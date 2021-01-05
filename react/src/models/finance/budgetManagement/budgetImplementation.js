/**
 * 作者：杨青
 * 日期：2018-10-8
 * 邮箱：yangq41@chinaunicom.cn
 * 功能：年度执行
 */
import * as budgeManage from '../../../services/finance/budgeManageZ';
import Cookie from 'js-cookie';
import { message } from 'antd';

function MergeCells (list,mergeCell,key){
  let rowSpanNum = 1;
  let rowSpanArray = [];
  for(let i=1;i<list.length;i++){
    if(list[i][mergeCell] !== list[i-1][mergeCell]||list[i-1].sub_total === '总计'){
      rowSpanArray.push(rowSpanNum);
      rowSpanNum = 1;
      if(i===list.length-1){
        rowSpanArray.push(1);
      }
    }else{
      rowSpanNum++;
      if(i===list.length-1 && list[i][mergeCell] === list[i-1][mergeCell]){
        rowSpanArray.push(rowSpanNum);
      }
    }
  }
  //部门合计不加rowSpan，重复的加rowSpan=0，不重复的（第一个）加rowSpan=null。
  for(let i=1;i<list.length;i++){
    list[0][key] = null;
    if(list[i][mergeCell] === list[i-1][mergeCell]&&list[i-1].sub_total !== '总计'){
      list[i][key] = 0;
    }else{
      list[i][key] = null;
    }
  }
  let j=0;
  for(let i=0;i<list.length;i++){
    if(list[i][key] === null){
      list[i][key] = rowSpanArray[j];
      j++;
    }
  }
}
function MergeCol(list) {
  for(let i=0;i<list.length;i++){
    if (list[i].fee_name===list[i].fuse_name&&list[i].sub_total!=='非合计'){
      list[i].col1 = 2;
      list[i].col2 = 0;
    }
  }
}

export default {
  namespace: 'budgetImplementation',
  state: {
    data:[],
    ouList:[],
    deptList:[],
    checkList:[],
    dateInfo:new Date().getFullYear() + '-' + (new Date().getMonth()+1),
    ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
    //deptFlag:true,
    //deptInfoOnlyOne:'全部',
    deptInfo:'全部',
    editionInfo:'1',
    monthlyBudgetImplementData : [],
    rawData:[],
    state_code:'',
    tenantid:Cookie.get('tenantid'),
    userid:Cookie.get('userid'),
    deptName:[{
      dept_id:Cookie.get('dept_id'),
      dept_name:Cookie.get('dept_name'),
    }],
    roleFlag:true,
    role:false,
  },

  reducers: {
    initData(state){
      return {
        ...state,
        data:[],
        ouList:[],
        deptList:[],
        checkList:[],
        dateInfo:new Date().getFullYear() + '-' + (new Date().getMonth()+1),
        ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
        //deptFlag:true,
        //deptInfoOnlyOne:'全部',
        deptInfo:'全部',
        editionInfo:'1',
        monthlyBudgetImplementData : [],
        rawData:[],
        state_code:'',
        tenantid:Cookie.get('tenantid'),
        userid:Cookie.get('userid'),
        deptName:[{
          dept_id:Cookie.get('dept_id'),
          dept_name:Cookie.get('dept_name'),
        }],
        roleFlag:true,
        role:false,
      }
    },
    save(state,action) {
      return { ...state,...action.payload};
    },
  },

  effects: {
    *init({}, { put }) {
      yield put({
        type: 'save',
        payload:{
          ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
        }
      });
      yield put({
        type: 'getOU',
      });
    },

    //查询ou列表
    *getOU({}, { call, put, select }){
      let { tenantid, ouInfo } = yield select(state => state.budgetImplementation);
      let postData={};
      postData["argtenantid"] = tenantid;
      postData["arguserid"] = localStorage.userid;
      postData["argrouterurl"] = '/budget_implementation';
      const moduleIdData= yield call(budgeManage.costUserHasModule, postData);
      if (moduleIdData.RetCode==='1'){
        let moduleId = moduleIdData.moduleid;
        let postData1 = {};
        postData1["argtenantid"] = tenantid;
        postData1["arguserid"] = localStorage.userid;
        postData1['argmoduleid'] = moduleId;
        postData1["argvgtype"] = '2';//全成本选择OU

        const data= yield call(budgeManage.costUserGetOU, postData1);
        if (data.RetCode==='1'){
          if (data.RowCount === '0'){
            let list = [];
            list.push({
              dept_id:ouInfo.split('-')[0],
              dept_name:ouInfo.split('-')[1],
            });
            yield put({
              type: 'save',
              payload:{
                ouList : list,
              }
            });
          }else{
            yield put({
              type: 'save',
              payload:{
                ouList : data.DataRows,
              }
            });
          }
          yield put({
            type:'getDept',
            ou : ouInfo.split('-')[0],
            flag: '1',
          })
        }else{
          message.error(data.RetVal);
        }
      }else{
        message.error(moduleIdData.RetVal);
      }
    },

    //查询部门列表
    *getDept({ ou, flag }, { call, put, select }){
      let { userid, deptName } = yield select(state => state.budgetImplementation);
      let postData = {};
      postData = {
        arg_tp_name: '预算管理',
        arg_user_id: userid,
      };
      const userRole = yield call(budgeManage.queryUserRole,postData);
      if (userRole.RetCode === '1'){
        if (userRole.DataRows){
          let role = false;
          let financeFlag = false;//是否是财务其他人员，可看全部部门，但不能生成等操作
          for(let i=0;i<userRole.DataRows.length;i++){
            if(userRole.DataRows[i].tag === '1'){
              role = true;
            }else if(userRole.DataRows[i].tag === '2'){
              financeFlag = true;
            }
          }
          if (role===true||financeFlag === true){
            let formData = {};
            formData['arg_parent_dept_id'] = ou;
            const data = yield call(budgeManage.queryOU,formData);

            //手动给每一个list一个key，不然表格数据会报错
            if (data.DataRows[0].children.length) {
              data.DataRows[0].children.map((i, index) => {
                i.key = index;
              })
            }
            let checkList = [];
            data.DataRows[0].children.map(item =>{
              checkList.push(item.dept_name);
            });
            if( data.RetCode === '1'){
              yield put({
                type: 'save',
                payload:{
                  deptList : data.DataRows[0].children,
                  //deptInfoOnlyOne : '全部',
                  checkList : checkList,
                  deptInfo:'全部',
                  role:role,
                }
              });
            }
          }else{
            yield put({
              type: 'save',
              payload:{
                deptList : deptName,
                //deptInfoOnlyOne : deptName[0].dept_name,
                roleFlag:false,
                role:role,
              }
            });
          }
          if (flag === '1'){
            yield put({
              type: 'queryData',
            });
          }
        }
      }
    },

    //修改年月
    *onChangeDatePicker({dateInfo},{put}){
      yield put({
        type: 'save',
        payload:{
          dateInfo,
        }
      });
    },

    //修改OU
    *onChangeOu({ou},{put}){
      yield put({
        type: 'save',
        payload:{
          ouInfo:ou,
        }
      });
      if (ou.split('-').length>1){
        yield put({
          type: 'getDept',
          ou: ou.split('-')[0],
        });

      } else {
        yield put({
          type: 'save',
          payload:{
            deptList : [],
            deptInfoOnlyOne:'全部',
            deptInfo:'全部',
          }
        });
      }
    },

    *onChangeDept({checkList,checkAll},{put}){
      if(checkAll === true){
        yield put({
          type: 'save',
          payload:{
            deptInfo:'全部',
          }
        });
      }else{
        yield put({
          type: 'save',
          payload:{
            deptInfo:checkList.join('\n'),
          }
        });
      }
    },
    *onChangeCheckList({checkedList},{put}){
      yield put({
        type: 'save',
        payload:{
          checkList:checkedList,
        }
      });
    },

    //修改费用项维度
    *onChangeEditionInfo({editionInfo},{put}){
      yield put({
        type: 'save',
        payload:{
          editionInfo,
        }
      });
    },

    //查询
    *queryData({}, { call, put, select }){
      let { dateInfo, ouInfo, deptInfo, editionInfo, deptList, checkList, deptName, roleFlag } = yield select(state => state.budgetImplementation);
      yield put({
        type: 'save',
        payload:{
          loading:true,
        }
      });
      let formData = {};
      let dept = [];
      for(let i = 0;i<deptList.length;i++){
        dept.push(
          deptList[i].dept_name
        )
      }
      let argdept = '';
      if (roleFlag === true){
        if (deptInfo==='全部'){
          argdept = '"'+dept.join('","')+'"';
        }else{
          if(checkList.length === 0){
            message.info('请选择部门');
            return;
          }
          argdept = '"'+checkList.join('","')+'"';
        }
      }else{
        if (ouInfo.match('本部')){
          argdept = '("联通软件研究院-'+deptName[0].dept_name+'")';
        }else{
          argdept = '("'+ouInfo.split('-')[1]+'-'+deptName[0].dept_name+'")';
        }
      }

      formData['arg_year'] = dateInfo.split("-")[0];
      formData['arg_month'] = dateInfo.split("-")[1];
      formData['arg_ou'] = ouInfo==='联通软件研究院'?'联通软件研究院':ouInfo.split("-")[1];
      formData['arg_dept_name'] = ouInfo==='联通软件研究院'?'': argdept;
      formData['arg_is_default'] = editionInfo;
      let data = yield call(budgeManage.queryAnnualBudgetCompletion,formData);

      let subList = [];//小计
      let subDetail = [];//统计
      let titleList = [];
      let index = [];//总合计
      let subIndex = [];//小计index
      if (data.RetCode === '1'){
        if (data.DataRows.length) {
          if (data.DataRows.length>3){
            //手动给每一个list一个key，不然表格数据会报错
            data.DataRows.map((i, index) => {
              i.key = index;
            });

            //获取表头名称
            for (let i = 0;i < JSON.parse(data.DataRows[0].budget).length;i++){
              titleList.push(
                JSON.parse(data.DataRows[0].budget)[i].ou_name,
              )
            }
            titleList.push('合计');
            //将数据按sub_total分到不同的list中，便于将小计的数据插入对应的位置。
            for (let i=0;i<data.DataRows.length;i++){
              if(data.DataRows[i].sub_total === '小计'){
                subList.push(data.DataRows[i]);
              }
            }
            for (let i=0;i<subList.length;i++){
              data.DataRows.splice(data.DataRows.indexOf(subList[i]), 1);
            }
            for (let i=0;i<data.DataRows.length;i++){
              for (let j=0;j<subList.length;j++){
                if((subList[j].parent_fee_name===data.DataRows[i].parent_fee_name&&subList[j].fuse_name===data.DataRows[i].fuse_name)&&((i!==data.DataRows.length-1&&subList[j].fuse_name!==data.DataRows[i+1].fuse_name)||i===data.DataRows.length-1)){
                  subIndex.push({
                    index:data.DataRows[i],
                    sub:subList[j],
                  })
                }
              }
            }
            for (let i=0;i<subIndex.length;i++){
              data.DataRows.splice(data.DataRows.indexOf(subIndex[i].index)+1, 0,subIndex[i].sub);
            }
            //处理每条数据
            for (let i=0;i<data.DataRows.length;i++){
              let c_cost = 0;
              let c_budget = 0;
              let a_cost = 0;
              let a_budget = 0;
              for (let j=0;j<JSON.parse(data.DataRows[i].budget).length;j++){
                if (JSON.parse(data.DataRows[i].budget)[j].capitalization_budget_fee_values.length!==0){
                  data.DataRows[i][JSON.parse(data.DataRows[i].budget)[j].ou_name+'_capitalization_budget_fee_values_cost_month_value'] = JSON.parse(data.DataRows[i].budget)[j].capitalization_budget_fee_values[0].cost_month_value;
                  data.DataRows[i][JSON.parse(data.DataRows[i].budget)[j].ou_name+'_capitalization_budget_fee_values_budget_month_value'] = JSON.parse(data.DataRows[i].budget)[j].capitalization_budget_fee_values[0].budget_month_value;
                  //data.DataRows[i][JSON.parse(data.DataRows[i].budget)[j].ou_name+'_capitalization_budget_fee_values_budget_completion_rate'] = JSON.parse(data.DataRows[i].budget)[j].capitalization_budget_fee_values[0].budget_completion_rate;
                  c_cost += parseFloat(JSON.parse(data.DataRows[i].budget)[j].capitalization_budget_fee_values[0].cost_month_value);
                  c_budget += parseFloat(JSON.parse(data.DataRows[i].budget)[j].capitalization_budget_fee_values[0].budget_month_value);

                  data.DataRows[i][JSON.parse(data.DataRows[i].budget)[j].ou_name+'_capitalization_budget_fee_values_budget_completion_rate'] = JSON.parse(data.DataRows[i].budget)[j].capitalization_budget_fee_values[0].budget_completion_rate==='-'||JSON.parse(data.DataRows[i].budget)[j].capitalization_budget_fee_values[0].budget_completion_rate===''||parseFloat(JSON.parse(data.DataRows[i].budget)[j].capitalization_budget_fee_values[0].budget_completion_rate)===0?'-':parseFloat(parseFloat(JSON.parse(data.DataRows[i].budget)[j].capitalization_budget_fee_values[0].budget_completion_rate)*100).toFixed(2).toString() + '%';
                }
                if (JSON.parse(data.DataRows[i].budget)[j].aperture_budget_fee_values.length!==0) {
                  data.DataRows[i][JSON.parse(data.DataRows[i].budget)[j].ou_name + '_aperture_budget_fee_values_cost_month_value'] = JSON.parse(data.DataRows[i].budget)[j].aperture_budget_fee_values[0].cost_month_value;
                  data.DataRows[i][JSON.parse(data.DataRows[i].budget)[j].ou_name + '_aperture_budget_fee_values_budget_month_value'] = JSON.parse(data.DataRows[i].budget)[j].aperture_budget_fee_values[0].budget_month_value;
                  //data.DataRows[i][JSON.parse(data.DataRows[i].budget)[j].ou_name + '_aperture_budget_fee_values_budget_completion_rate'] = JSON.parse(data.DataRows[i].budget)[j].aperture_budget_fee_values[0].budget_completion_rate;
                  a_cost += parseFloat(JSON.parse(data.DataRows[i].budget)[j].aperture_budget_fee_values[0].cost_month_value);
                  a_budget += parseFloat(JSON.parse(data.DataRows[i].budget)[j].aperture_budget_fee_values[0].budget_month_value);

                  data.DataRows[i][JSON.parse(data.DataRows[i].budget)[j].ou_name + '_aperture_budget_fee_values_budget_completion_rate'] = JSON.parse(data.DataRows[i].budget)[j].aperture_budget_fee_values[0].budget_completion_rate==='-'||JSON.parse(data.DataRows[i].budget)[j].aperture_budget_fee_values[0].budget_completion_rate===''||parseFloat(JSON.parse(data.DataRows[i].budget)[j].aperture_budget_fee_values[0].budget_completion_rate)===0?'-':parseFloat(parseFloat(JSON.parse(data.DataRows[i].budget)[j].aperture_budget_fee_values[0].budget_completion_rate)*100).toFixed(2).toString() + '%';
                }
              }
              data.DataRows[i]['合计'+'_capitalization_budget_fee_values_cost_month_value'] = c_cost;
              data.DataRows[i]['合计'+'_capitalization_budget_fee_values_budget_month_value'] = c_budget;
              data.DataRows[i]['合计'+'_capitalization_budget_fee_values_budget_completion_rate'] = c_budget===0||c_cost===0?'-':(parseFloat(c_cost/c_budget*100).toFixed(2).toString() + '%');
              data.DataRows[i]['合计'+'_aperture_budget_fee_values_cost_month_value'] = a_cost;
              data.DataRows[i]['合计'+'_aperture_budget_fee_values_budget_month_value'] = a_budget;
              data.DataRows[i]['合计'+'_aperture_budget_fee_values_budget_completion_rate'] = a_budget===0||a_cost===0?'-':(parseFloat(a_cost/a_budget*100).toFixed(2).toString() + '%');

              if (data.DataRows[i].sub_total === '总计'){
                data.DataRows[i].fuse_name = data.DataRows[i].parent_fee_name;
                data.DataRows[i].fee_name = data.DataRows[i].parent_fee_name;
              } else if (data.DataRows[i].sub_total === '小计'){
                data.DataRows[i].fee_name = data.DataRows[i].sub_total;
              } else if (data.DataRows[i].sub_total !== '非合计'){
                data.DataRows[i].fuse_name = data.DataRows[i].sub_total;
                data.DataRows[i].fee_name = data.DataRows[i].sub_total;
                subDetail.push(data.DataRows[i]);
              }
              if (i < data.DataRows.length-1 && (data.DataRows[i].sub_total === '非合计'||data.DataRows[i].sub_total === '总计')){
                if (data.DataRows[i].fee_type !== data.DataRows[i+1].fee_type){
                  index.push({
                    index:i+1,
                    feeType:data.DataRows[i].fee_type,
                  })
                }
              }
            }
            //只有一种fee_type的情况
            // if (index.length===0){
            //   index.push({
            //     index:data.DataRows.length,
            //     feeType:data.DataRows[data.DataRows.length-2].fee_type,
            //   })
            // }
            if (subDetail){
              for (let i=0;i<subDetail.length;i++){
                if (index.length===0){
                  data.DataRows.splice(data.DataRows.length, 0, subDetail[i]);
                }else{
                  for (let j=0;j<index.length;j++){
                    if (subDetail[i].fee_type === index[j].feeType){
                      data.DataRows.splice(index[j].index, 0 , subDetail[i]);
                    }
                  }
                  if (subDetail[i].fee_type === '2') {
                    data.DataRows.splice(data.DataRows.length, 0, subDetail[i]);
                  }
                }
              }
              for (let i=0;i<subDetail.length;i++){
                data.DataRows.splice(data.DataRows.indexOf(subDetail[i]), 1);
              }
            }

            MergeCells(data.DataRows, 'parent_fee_name','1');
            MergeCells(data.DataRows, 'fuse_name','3');
            MergeCol(data.DataRows);

            yield put({
              type: 'save',
              payload:{
                loading:false,
                data:data.DataRows,
                titleList:titleList,
                state_code:data.state_code,
              }
            });
          }else{
            yield put({
              type: 'save',
              payload:{
                loading:false,
                data:[],
                titleList:[],
                state_code:data.state_code,
              }
            });
          }
        }
        else{
          yield put({
            type: 'save',
            payload:{
              loading:false,
              data:[],
              titleList:[],
              state_code:data.state_code,
            }
          });
        }
      }else{
        message.error(data.RetVal);
      }
    },

    *generateMonthlyBudgetCompletion({},{call,put,select}){
      let { dateInfo, ouInfo, userid } = yield select(state => state.budgetImplementation);
      let postData = {};
      postData['arg_total_year'] = dateInfo.split('-')[0];
      postData['arg_total_month'] = dateInfo.split('-')[1];
      postData['arg_ou'] = ouInfo.split('-')[1];
      postData['arg_user_id'] = userid;
      yield put({
        type: 'save',
        payload:{
          loading:true,
        }
      });
      const data = yield call(budgeManage.generateMonthlyBudgetCompletion,postData);
      if (data.RetCode === '1'){
        message.success('生成成功！');
        yield put({
          type: 'queryData',
        });
        yield put({
          type: 'save',
          payload:{
            loading:false,
          }
        });
      }else {
        yield put({
          type: 'save',
          payload:{
            loading:false,
          }
        });
        message.error(data.RetVal);
      }
    },

    *cancelMonthlyBudgetCompletion({},{call,put,select}){
      let { dateInfo, ouInfo, userid } = yield select(state => state.budgetImplementation);
      let postData = {};
      postData['arg_year'] = dateInfo.split('-')[0];
      postData['arg_month'] = dateInfo.split('-')[1];
      postData['arg_ou'] = ouInfo.split('-')[1];
      postData['arg_user_id'] = userid;
      const data = yield call(budgeManage.cancelMonthlyBudgetCompletion,postData);
      if (data.RetCode === '1'){
        message.success('撤销成功！');
        yield put({
          type: 'queryData',
        });
      }else {
        message.error(data.RetVal);
      }
    },

    *checkMonthlyBudgetCompletion({},{call,put,select}){
      let { dateInfo, ouInfo } = yield select(state => state.budgetImplementation);
      let postData = {};
      postData['arg_year'] = dateInfo.split('-')[0];
      postData['arg_month'] = dateInfo.split('-')[1];
      postData['arg_ou'] = ouInfo.split('-')[1];
      const data = yield call(budgeManage.checkMonthlyBudgetCompletion,postData);
      if (data.RetCode === '1'){
        message.success('审核成功！');
        yield put({
          type: 'queryData',
        });
      }else {
        message.error(data.RetVal);
      }
    },
    //修改实际数
    *onCellChange({postData},{call,put}){
      const data = yield call(budgeManage.updateMonthlyBudgetCompletion,postData);
      if (data.RetCode === '1'){
        message.success('修改成功！');
        yield put({
          type: 'queryData',
        });
      }else {
        message.error(data.RetVal);
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/budget_management/budget_implementation') {
          dispatch({ type: 'init',query });
          dispatch({type:'initData'});
        }
      });
    },
  },
};
