/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划审核
 */
import * as costService from '../../../services/finance/fundingPlanSRS';
import * as fundingPlanFillService from '../../../services/finance/fundingPlanFillService';
import moment from 'moment';
import Cookies from 'js-cookie'
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
const dateFormat = 'YYYY-MM';
moment.locale('zh-cn');
function change2Thousands (value) {
  if(value){
    return (parseFloat(value).toFixed(2)+'').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  }else{
    return '-';
  }
}
function accAdd(arg1,arg2){
  let r1,r2,m;
  try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
  try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
  m=Math.pow(10,Math.max(r1,r2));
  return (arg1*m+arg2*m)/m
}
function sumPerson( recordList) {
    let map = {}, list = [];
    for(let i = 0; i < recordList.length; i++){
        recordList[i].key =i;
        if(!map[recordList[i].applyUserId]){//如果id不存在，加入recordListPMS中
          recordList[i].personAll = parseFloat(recordList[i].fundsPlan);
          list.push({
            applyUserId: recordList[i].applyUserId,
            applyUserName: recordList[i].applyUserName,
            children: [recordList[i]]
          });
          map[recordList[i].applyUserId] = recordList[i];
        }else{
          for(let j = 0; j < list.length; j++){
            if(list[j].applyUserId === recordList[i].applyUserId){
              recordList[i].personAll = parseFloat(accAdd(recordList[i-1].personAll,recordList[i].fundsPlan));
              list[j].children.push(recordList[i]);
              break;
            }
          }
        }
    }
    return list;
}
function changeDataList(dataList) {
  let a =[],b=[];
  for (let i=0;i<dataList.length;i++){
    a = dataList[i].children;
    [a[0],a[a.length-1]] = [a[a.length-1],a[0]];
    for(let j=0;j<a.length;j++){
      a[j].fundsPlan = change2Thousands(a[j].fundsPlan);//将a[i].fundsPlan转化为千分位
      a[j].personAll = change2Thousands((a[j].personAll));
      b.push(a[j]);
    }
  }
  return b;
}
export default {
  namespace: 'fundingPlanReview',
  state: {
    list:[],
    officeSuppliesList:[],
    historyList:[],
    officeSuppliesHistoryList : [],
    isGenerate : '1',
    recentMonth:moment(),
    batchNumber:'',
    fundStageData:[]
  },

  reducers: {
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    //初始化时存batchNumber
    *init({}, { call,put }) {
      //获取资金填报阶段
      const fillStageData = yield call(fundingPlanFillService.getBatchType, {arg_null: Cookies.get('userid')});
      if (fillStageData.RetCode === '1') {
        yield put({
          type:'save',
          payload:{
            fundStageData:fillStageData.DataRows[0]
          }
        });
      }
      let postDate = {};
      const data = yield call(costService.queryTime,postDate);
      let yearMonthNow = moment();
      if(data.RetCode === '1'){
        yearMonthNow = data.DataRows.length > 0 ? moment( data.DataRows[0].planYear + '-'+data.DataRows[0].planMonth,'YYYY-MM') : moment();
      }
      if(data.DataRows.length > 0){
        if(data.DataRows[0].stateCode === '1' && data.DataRows[0].reportType === '2'){
          yield put({
            type: 'query',
            batchNumber : data.DataRows[0].batch_number
          });
          yield put({
            type: 'save',
            payload:{
              isGenerate:'1',
              recentMonth:yearMonthNow,
              batchNumber : data.DataRows[0].batch_number,
            }
          });
        }else{
          yield put({
            type: 'query',
            batchNumber : ''
          });
          yield put({
            type: 'save',
            payload:{
              isGenerate:'1',
              recentMonth:yearMonthNow,
              batchNumber : '',
            }
          });
        }
      }
    },
    *query({},{call,put}){
      let postData = {};
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_state_code'] = '2';
      const data = yield call(costService.reviewSearch,postData);
      let dataList = sumPerson(data.DataRows);
      let reviewData = changeDataList(dataList);
      if( data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            list: reviewData,
            capexList : data.DataRows1 !== undefined ? data.DataRows1 : [],
          }
        });
      }
    },
    *pass({ selectedRows },{call,put,select}){
      let postData = {};
      let selectedData = '';
      for(let i= 0 ;i<selectedRows.length-1;i++){
        selectedData = selectedData + selectedRows[i].budgetId + '#'
      }
      const { batchNumber } = yield select(state => state.fundingPlanReview);
      selectedData = selectedData +selectedRows[selectedRows.length-1].budgetId;
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_budget_ids'] = selectedData;
      postData['arg_state_code'] = '3';
      postData['arg_dept_id'] = Cookies.get('dept_id');
      if(batchNumber !== ''){
        postData['arg_batch_number'] = batchNumber;
      }
      const data = yield call(costService.pass,postData);
      if( data.RetCode === '1'){
        yield put({
          type: 'query',
          batchNumber : batchNumber
        });
      }
    },
    *returnCrl({ selectedRows,reason },{call,put,select}){
      let postData = {};
      let selectedData = '';
      for(let i= 0 ;i<selectedRows.length-1;i++){
        selectedData = selectedData + selectedRows[i].budgetId + '#'
      }
      const { batchNumber } = yield select(state => state.fundingPlanReview);
      selectedData = selectedData +selectedRows[selectedRows.length-1].budgetId;
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_budget_ids'] = selectedData;
      postData['arg_state_code'] = '4';
      postData['arg_reject_reason'] = reason;
      postData['arg_dept_id'] = Cookies.get('dept_id');
      if(batchNumber !== ''){
        postData['arg_batch_number'] = batchNumber;
      }
      const data = yield call(costService.returnCrl,postData);
      if( data.RetCode === '1'){
        yield put({
          type: 'query',
          batchNumber : batchNumber
        });
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_review') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
