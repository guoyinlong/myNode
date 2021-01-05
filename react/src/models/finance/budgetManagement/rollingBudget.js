/**
 * 作者：杨青
 * 日期：2018-10-8
 * 邮箱：yangq41@chinaunicom.cn
 * 功能：滚动预算
 */
import * as budgeManage from '../../../services/finance/budgeManageZ';
import Cookie from 'js-cookie';
import {message} from 'antd';
Date.prototype.getCurSeason = function() {
  let month = this.getMonth();
  if(month  < 3) {
    return '1';
  }else if(month < 6) {
    return '2';
  }else if(month <9) {
    return '3';
  }else if(month <12) {
    return '4';
  }
};
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
  namespace: 'rollingBudget',
  state: {
    rawData:[], //
    ouList:[],
    deptList:[],
    checkList:[],
    dateInfo:new Date().getFullYear().toString(),
    seasonInfo: [new Date().getCurSeason()],
    ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
    deptInfo:'全部',
    deptFlag:false,//false时显示模态框选择部门，true时显示下拉选择部门，只能单选,
    deptInfoOnlyOne:'',//单选时的初始部门
    rollingBudgetData:[], //查询回来的数据
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
        rawData:[],
        ouList:[],
        deptList:[],
        checkList:[],
        dateInfo:new Date().getFullYear().toString(),
        seasonInfo: [new Date().getCurSeason()],
        ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
        deptInfo:'全部',
        deptFlag:false,
        deptInfoOnlyOne:'',//单选时的初始部门
        rollingBudgetData:[], //查询回来的数据
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
    *init({}, { call, put }) {
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
      let { tenantid, ouInfo } = yield select(state => state.rollingBudget);
      let postData={};
      postData["argtenantid"] = tenantid;
      postData["arguserid"] = localStorage.userid;
      postData["argrouterurl"] = '/rolling_budget';
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
      let { userid, deptName } = yield select(state => state.rollingBudget);
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
        yield put({
          type: 'save',
          payload:{
            deptInfoOnlyOne:'',
          }
        });
      } else {
        yield put({
          type: 'save',
          payload:{
            deptList : [],
            checkList : [],
            deptInfo:'全部',
            deptInfoOnlyOne:'',
          }
        });
      }
    },

    //确认选择多选部门
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
            deptInfo:checkList,
          }
        });
      }
    },

    //修改单选部门
    *onChangeDeptOnlyOne({deptInfoOnlyOne},{put}){
      yield put({
        type: 'save',
        payload:{
          deptInfoOnlyOne,
        }
      });
    },

    //修改多选部门
    *onChangeCheckList({checkedList},{put}){
      yield put({
        type: 'save',
        payload:{
          checkList:checkedList,
        }
      });
    },

    //选择季度
    *onChangeSeason({seasonInfo},{put}){
      let deptFlag='';
      if(seasonInfo.length >1){
        deptFlag = true;
      }else {
        deptFlag = false;
      }
      yield put({
        type: 'save',
        payload:{
          seasonInfo,
          deptFlag:deptFlag,
        }
      });
    },

    *queryData({}, { call, put,select }){
      let { deptFlag, dateInfo, ouInfo, deptInfoOnlyOne, checkList, seasonInfo, roleFlag, deptName } = yield select(state=>state.rollingBudget);
      let arg_dept = '';
      let arg_ou='';
      let arg_quarter = [];
      if (seasonInfo.length>0){
        for(let i=0;i<seasonInfo.length;i++){
          arg_quarter.push({
            arg_quarter:seasonInfo[i],
          })
        }
      }else{
        message.info('请选择季度！');
        return;
      }
      if (ouInfo.split('-').length>1){
        arg_ou = ouInfo.split('-')[1];
      }else{
        arg_ou = ouInfo;
      }
      if (roleFlag===true){
        if (deptFlag === true){
          if (deptInfoOnlyOne === ''&&arg_ou!=='联通软件研究院'){
            message.info('请选择部门！');
            return;
          }
          arg_dept = '("'+deptInfoOnlyOne.split('-')[1]+'-'+deptInfoOnlyOne.split('-')[2]+'")';
        }else{
          arg_dept = '("'+checkList.join('","')+'")';
        }
      }else{
        if (arg_ou.match('本部')){
          arg_dept = '("联通软件研究院-'+deptName[0].dept_name+'")';
        }else{
          arg_dept = '("'+arg_ou+'-'+deptName[0].dept_name+'")';
        }
      }
      yield put({
        type: 'save',
        payload:{
          loading:true,
        }
      });
      let formData = {};
      formData['arg_year'] = dateInfo;
      formData['arg_ou'] = arg_ou;
      formData['arg_dept_name'] = arg_ou==='联通软件研究院'?'':arg_dept;
      formData['arg_quarter'] = JSON.stringify(arg_quarter);
      const rawData = yield call(budgeManage.queryRollingBudget,formData);

      if (rawData.RetCode==='1'){
        if (rawData.DataRows.length>0) {
          //手动给每一个list一个key，不然表格数据会报错,并处理数据
          rawData.DataRows.map((i, index) => {
            i.key = index;
            i.budget_fee_value = i.budget_fee_value.replace(/\:\"\[+/g, ':[');
            i.budget_fee_value = i.budget_fee_value.replace(/\}\]\"/g, '}]');
            i.budget_fee_value = JSON.parse(i.budget_fee_value);
          })

          //获取月份
          let monthList = [];
          let deptLists = [];

          for (let i = 0;i<rawData.DataRows[0].budget_fee_value.length;i++){
            deptLists.push(rawData.DataRows[0].budget_fee_value[i].dept_name);
          }

          if(deptFlag === true){
            //多季度，单部门
            // console.log(rawData.DataRows[0].budget_fee_value[0].budget_fee_value.length);
            for (let i = 0;i<rawData.DataRows[0].budget_fee_value.length;i++){
              for (let j=0;j<rawData.DataRows[0].budget_fee_value[i].budget_fee_value.length;j++){
                monthList.push(i+'-'+j+'-'+rawData.DataRows[0].budget_fee_value[i].budget_fee_value[j].total_month);
              }
            }
          } else {
            //单季度，多部门
            for (let i=0;i<rawData.DataRows[0].budget_fee_value[0].budget_fee_value.length;i++){
              monthList.push(rawData.DataRows[0].budget_fee_value[0].budget_fee_value[i].total_month);
            }
          }
          yield put({
            type: 'save',
            payload:{
              monthList:monthList,
              deptLists:deptLists,
            }
          });
          let subDetail = [];
          let index = [];
          //处理每条数据
          for (let i=0;i<rawData.DataRows.length;i++){
            if(deptFlag === true){
              //多季度，单部门
              //let sub = 0;
              for (let m=0;m<monthList.length;m++){
                rawData.DataRows[i][rawData.DataRows[i].budget_fee_value[monthList[m].split('-')[0]].dept_name+'_'+monthList[m].split('-')[2]]=rawData.DataRows[i].budget_fee_value[monthList[m].split('-')[0]].budget_fee_value[monthList[m].split('-')[1]].budget_fee_value;
                //sub += parseFloat(rawData.DataRows[i].budget_fee_value[monthList[m].split('-')[0]].budget_fee_value[monthList[m].split('-')[1]].budget_fee_value);
                rawData.DataRows[i][rawData.DataRows[i].budget_fee_value[monthList[m].split('-')[0]].dept_name+'_sum_budget_value']=rawData.DataRows[i].budget_fee_value[monthList[m].split('-')[0]].sum_budget_value;

              }
              //rawData.DataRows[i]['sub'] = parseFloat(sub/2);
            }else {
              //单季度，多部门
              for (let j=0;j<rawData.DataRows[i].budget_fee_value.length;j++){
                for (let n=0;n<rawData.DataRows[i].budget_fee_value[j].budget_fee_value.length;n++){
                  rawData.DataRows[i][rawData.DataRows[i].budget_fee_value[j].dept_name+'_'+rawData.DataRows[i].budget_fee_value[j].budget_fee_value[n].total_month]=rawData.DataRows[i].budget_fee_value[j].budget_fee_value[n].budget_fee_value;
                  rawData.DataRows[i][rawData.DataRows[i].budget_fee_value[j].dept_name+'_sum_budget_value']=rawData.DataRows[i].budget_fee_value[j].sum_budget_value;

                  if (rawData.DataRows[i]['sub-'+rawData.DataRows[i].budget_fee_value[j].budget_fee_value[n].total_month]){
                    rawData.DataRows[i]['sub-'+rawData.DataRows[i].budget_fee_value[j].budget_fee_value[n].total_month] += parseFloat(rawData.DataRows[i].budget_fee_value[j].budget_fee_value[n].budget_fee_value);
                  }else{
                    rawData.DataRows[i]['sub-'+rawData.DataRows[i].budget_fee_value[j].budget_fee_value[n].total_month] = parseFloat(rawData.DataRows[i].budget_fee_value[j].budget_fee_value[n].budget_fee_value);
                  }
                }
              }
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
          if (subDetail){
            for (let i=0;i<subDetail.length;i++){
              for (let j=0;j<index.length;j++){
                if (subDetail[i].fee_type === index[j].feeType){
                  rawData.DataRows.splice(index[j].index, 0 , subDetail[i]);
                }
              }
              if (subDetail[i].fee_type === '0') {
                rawData.DataRows.splice(rawData.DataRows.length, 0, subDetail[i]);
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
              seasonFlag:deptFlag,
              loading:false,
            }
          });
        }else {
          yield put({
            type: 'save',
            payload:{
              rawData:[],
              seasonFlag:deptFlag,
              deptLists:[],
              loading:false,
            }
          });
        }
      }else{
        message.error(rawData.RetVal);
      }

    },

    //修改单元格
    *onCellChange({postData},{call,put}){
      const data = yield call(budgeManage.updateRollingBudget,postData);
      if (data.RetCode === '1'){
        message.success('修改成功！');
        yield put({
          type: 'queryData',
        });
      }else {
        message.error(data.RetVal);
      }
    },

    //下载模板
    *downloadMonthlyRollingBudget({},{call,select}){
      let { dateInfo, ouInfo, seasonInfo } = yield select(state => state.rollingBudget);
      if(seasonInfo.length === 0){
        message.info('请选择季度');
        return;
      }else if (seasonInfo.length > 1){
        message.info('只能选择一个季度');
        return;
      }
      window.open('/budgetservice/monthly_budget_maintain/MonthlyRollingBudget?argYear='+dateInfo+'&argQuarter='+seasonInfo[0]+'&argOu='+'联通软件研究院-'+ouInfo.split('-')[1]);
    },

    //撤回
    *cancelMonthlyRollingBudget({},{put,call,select}){
      let { dateInfo, ouInfo, seasonInfo } = yield select(state => state.rollingBudget);
      if(seasonInfo.length === 0){
        message.info('请选择季度');
        return;
      }else if (seasonInfo.length > 1){
        message.info('只能撤销一个季度数据');
        return;
      }
      let formData = {};
      formData['arg_year'] = dateInfo;
      formData['arg_ou'] = ouInfo.split('-')[1];
      formData['arg_user_id'] = localStorage.userid;
      formData['arg_quarter'] = seasonInfo[0];
      const data = yield call(budgeManage.cancelMonthlyRollingBudget,formData);
      if (data.RetCode === '1'){
        message.success('撤销成功！');
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
        if (pathname === '/financeApp/budget_management/rolling_budget') {
          dispatch({ type: 'init',query });
          dispatch({ type: 'initData'});
        }
      });
    },
  },
};
