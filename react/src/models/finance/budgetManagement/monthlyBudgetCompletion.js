/**
 * 作者：杨青
 * 日期：2018-10-8
 * 邮箱：yangq41@chinaunicom.cn
 * 功能：滚动预算
 */
import * as budgeManage from '../../../services/finance/budgeManageZ';
import Cookie from 'js-cookie';
import { message } from 'antd';

function MergeCells (list,mergeCell,key){
  let rowSpanNum = 1;
  let rowSpanArray = [];
  for(let i=1;i<list.length;i++){
    if(list[i][mergeCell] !== list[i-1][mergeCell]||list[i-1].sub_total === '合计'){
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
    if(list[i][mergeCell] === list[i-1][mergeCell]&&list[i-1].sub_total !== '合计'){
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
    if (list[i].concentration_fee_name===list[i].fee_name&&list[i].fee_name===list[i].fee_use_name){
      list[i].col1 = 3;
      list[i].col2 = 0;
      list[i].col3 = 0;
    }else if (list[i].concentration_fee_name===list[i].fee_name){
      list[i].col1 = 1;
      list[i].col2 = 2;
      list[i].col3 = 0;
    }
  }
}

export default {
  namespace: 'monthlyBudgetCompletion',
  state: {
    list:[],
    ouList:[],
    deptList:[],
    checkList:[],
    dateInfo:new Date().getFullYear() + '-' + (new Date().getMonth()+1),
    ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
    tenantid:Cookie.get('tenantid'),
    userid:Cookie.get('userid'),
    deptName:[{
      dept_id:Cookie.get('dept_id'),
      dept_name:Cookie.get('dept_name'),
    }],
    roleFlag:true,
    deptFlag:true,
    deptInfoOnlyOne:'全部',
    editionInfo:'1',
    monthlyBudgetImplementData : [],
    rawData:[],
    title:'',
  },

  reducers: {
    initData(state){
      return {
        ...state,
        list:[],
        ouList:[],
        deptList:[],
        checkList:[],
        dateInfo:new Date().getFullYear() + '-' + (new Date().getMonth()+1),
        ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
        tenantid:Cookie.get('tenantid'),
        userid:Cookie.get('userid'),
        deptName:[{
          dept_id:Cookie.get('dept_id'),
          dept_name:Cookie.get('dept_name'),
        }],
        deptFlag:true,
        deptInfoOnlyOne:'全部',
        editionInfo:'1',
        monthlyBudgetImplementData : [],
        rawData:[],
        roleFlag:true,
        title:'',
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
      let { tenantid, ouInfo } = yield select(state => state.monthlyBudgetCompletion);
      let postData={};
      postData["argtenantid"] = tenantid;
      postData["arguserid"] = localStorage.userid;
      postData["argrouterurl"] = '/monthly_budget_completion';
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
      let { userid, deptName } = yield select(state => state.monthlyBudgetCompletion);
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
            if( data.RetCode === '1'){
              yield put({
                type: 'save',
                payload:{
                  deptList : data.DataRows[0].children,
                  deptInfoOnlyOne : '全部',
                  role:role,
                }
              });
            }
          }else{
            yield put({
              type: 'save',
              payload:{
                deptList : deptName,
                deptInfoOnlyOne : deptName[0].dept_name,
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
          }
        });
      }
    },

    //修改部门
    *onChangeDept({dept},{put}){
      yield put({
        type: 'save',
        payload:{
          deptInfoOnlyOne:dept,
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
      let { dateInfo, ouInfo, deptInfoOnlyOne, editionInfo, deptName } = yield select(state => state.monthlyBudgetCompletion);
      yield put({
        type: 'save',
        payload:{
          loading:true,
        }
      });
      let dept = '';
      if (deptInfoOnlyOne.split('-').length>1){
        dept = '("'+deptInfoOnlyOne.split('-')[1]+'-'+deptInfoOnlyOne.split('-')[2]+'")';
      }else if (deptInfoOnlyOne!=='全部'){
        if (ouInfo.split("-")[1].match('本部')){
          dept = '("联通软件研究院-'+deptInfoOnlyOne+'")';
        }else{
          dept = '("'+ouInfo.split("-")[1]+'-'+deptName[0].dept_name+'")';
        }
      }
      let formData = {};
      formData['arg_year'] = dateInfo.split("-")[0];
      formData['arg_month'] = dateInfo.split("-")[1];
      formData['arg_ou'] = ouInfo.split("-")[1]==='联通软件研究院'?'':ouInfo.split("-")[1];
      formData['arg_dept_name'] = dept;
      formData['arg_is_default'] = editionInfo;
      let rawData = yield call(budgeManage.queryMonthlyBudgetCompletion,formData);

      if (rawData.RetCode==='1'){
        if (rawData.DataRows){
          let title = '';
          if (deptInfoOnlyOne === '全部'){
            title = dateInfo.split("-")[0]+'年'+dateInfo.split("-")[1]+'月'+(ouInfo.split("-")[1]==='联通软件研究院'?'联通软件研究院':ouInfo.split("-")[1]);
          }else {
            title = dateInfo.split("-")[0]+'年'+dateInfo.split("-")[1]+'月'+(ouInfo.split("-")[1]==='联通软件研究院'?'联通软件研究院':ouInfo.split("-")[1])+'-'+(deptInfoOnlyOne.split('-').length>1?deptInfoOnlyOne.split("-")[2]:deptInfoOnlyOne);
          }
          if (rawData.DataRows.length>0){
            //手动给每一个list一个key，不然表格数据会报错
            if (rawData.DataRows.length) {
              rawData.DataRows.map((i, index) => {
                i.key = index;
              })
            }

            //获取月份
            let monthList = [];
            for (let i = 0;i<JSON.parse(rawData.DataRows[0].budget_month_value).length;i++){
              monthList.push(JSON.parse(rawData.DataRows[0].budget_month_value)[i].total_month);
            }
            yield put({
              type: 'save',
              payload:{
                monthList:monthList,
              }
            });

            let subDetail = [];
            let index = [];
            //处理每条数据
            for (let i=0;i<rawData.DataRows.length;i++){
              let budgetMonthValue = 0;
              let costMonthValue = 0;
              for (let j=0;j<JSON.parse(rawData.DataRows[i].budget_month_value).length;j++){
                rawData.DataRows[i][JSON.parse(rawData.DataRows[i].budget_month_value)[j].total_month+'_budget_month_value']=JSON.parse(rawData.DataRows[i].budget_month_value)[j].budget_month_value;
                rawData.DataRows[i][JSON.parse(rawData.DataRows[i].budget_month_value)[j].total_month+'_cost_month_value']=JSON.parse(rawData.DataRows[i].budget_month_value)[j].cost_month_value;
                rawData.DataRows[i][JSON.parse(rawData.DataRows[i].budget_month_value)[j].total_month+'_budget_completion_rate']=parseFloat(JSON.parse(rawData.DataRows[i].budget_month_value)[j].budget_completion_rate)===0?'-':parseFloat(parseFloat(JSON.parse(rawData.DataRows[i].budget_month_value)[j].budget_completion_rate)*100).toFixed(2).toString() + '%';
                budgetMonthValue +=  parseFloat(JSON.parse(rawData.DataRows[i].budget_month_value)[j].budget_month_value);
                costMonthValue +=  parseFloat(JSON.parse(rawData.DataRows[i].budget_month_value)[j].cost_month_value);
              }
              rawData.DataRows[i]['budget_value']=budgetMonthValue;
              rawData.DataRows[i]['cost_value']=costMonthValue;
              if (budgetMonthValue === 0||costMonthValue===0){
                rawData.DataRows[i]['completion_rate']='-';
              }else {
                rawData.DataRows[i]['completion_rate']=parseFloat(costMonthValue/budgetMonthValue*100).toFixed(2).toString() + '%';
                //rawData.DataRows[i]['completion_rate']=parseFloat(costMonthValue/budgetMonthValue).toFixed(2).toString();
              }


              if (rawData.DataRows[i].sub_total === '合计'){
                rawData.DataRows[i].fee_use_name = rawData.DataRows[i].parent_fee_name;
                rawData.DataRows[i].concentration_fee_name = rawData.DataRows[i].parent_fee_name;
                rawData.DataRows[i].fee_name = rawData.DataRows[i].parent_fee_name;
              } else if (rawData.DataRows[i].sub_total === '小计'){
                if (i+1 === rawData.DataRows.length || rawData.DataRows[i+1].fee_use_name !== rawData.DataRows[i-1].fee_use_name){
                  rawData.DataRows[i].fee_use_name = '';
                  rawData.DataRows[i].concentration_fee_name = rawData.DataRows[i].sub_total;
                  rawData.DataRows[i].fee_name = rawData.DataRows[i].sub_total;
                } else if (rawData.DataRows[i+1].fee_use_name === rawData.DataRows[i-1].fee_use_name){
                  rawData.DataRows[i].fee_use_name = rawData.DataRows[i-1].fee_use_name;
                  rawData.DataRows[i].concentration_fee_name = rawData.DataRows[i].sub_total;
                  rawData.DataRows[i].fee_name = rawData.DataRows[i].sub_total;
                }
              } else if (rawData.DataRows[i].sub_total !== '非合计'){
                rawData.DataRows[i].fee_use_name = rawData.DataRows[i].sub_total;
                rawData.DataRows[i].concentration_fee_name = rawData.DataRows[i].sub_total;
                rawData.DataRows[i].fee_name = rawData.DataRows[i].sub_total;
                subDetail.push(rawData.DataRows[i]);
              }
              if (i < rawData.DataRows.length-1 && (rawData.DataRows[i].sub_total === '非合计'||rawData.DataRows[i].sub_total === '合计')){
                if (rawData.DataRows[i].fee_type !== rawData.DataRows[i+1].fee_type){
                  index.push({
                    index:i+1,
                    feeType:rawData.DataRows[i].fee_type,
                  })
                }
              }
            }
            //只有一种fee_type的情况
            // if (index.length===0){
            //   index.push({
            //     index:rawData.DataRows.length,
            //     feeType:rawData.DataRows[rawData.DataRows.length-1].fee_type,
            //   })
            // }
            if (subDetail){
              for (let i=0;i<subDetail.length;i++){
                if (index.length===0){
                  rawData.DataRows.splice(rawData.DataRows.length, 0, subDetail[i]);
                }else{
                  for (let j=0;j<index.length;j++){
                    if (subDetail[i].fee_type === index[j].feeType){
                      rawData.DataRows.splice(index[j].index, 0 , subDetail[i]);
                    }
                  }
                  if (subDetail[i].fee_type === '0') {
                    rawData.DataRows.splice(rawData.DataRows.length, 0, subDetail[i]);
                  }
                }
              }
              for (let i=0;i<subDetail.length;i++){
                rawData.DataRows.splice(rawData.DataRows.indexOf(subDetail[i]), 1);
              }
            }
            MergeCells(rawData.DataRows, 'parent_fee_name','1');
            MergeCells(rawData.DataRows, 'concentration_fee_name','2');
            MergeCells(rawData.DataRows, 'fee_use_name','3');
            MergeCol(rawData.DataRows);
            yield put({
              type: 'save',
              payload:{
                rawData:rawData.DataRows,
                title:title,
                loading:false,
              }
            });
          }else {
            yield put({
              type: 'save',
              payload:{
                rawData:[],
                loading:false,
              }
            });
          }
        }else {
          yield put({
            type: 'save',
            payload:{
              rawData:[],
              loading:false,
            }
          });
        }
      }else{
        message.error(rawData.RetVal);
      }
    },

  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/budget_management/monthly_budget_completion') {
          dispatch({ type: 'init',query });
          dispatch({type:'initData'});
        }
      });
    },
  },
};
