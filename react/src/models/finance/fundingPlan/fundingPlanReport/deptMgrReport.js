/**
 * 作者：杨青
 * 日期：2018-3-6
 * 邮箱：yangq41@chinaunicom.cn
 * 文件说明：部门资金计划报表
 */
import * as fundingPlanService from '../../../../services/finance/fundingPlanSRS';
import { message } from 'antd'
import Cookie from 'js-cookie';
export default {
  namespace: 'deptMgrReport',
  state: {
    list:[],
    monthlyDetailsData:[],
    monthlyDetailsDataCAPEX:[],
    monthlyDetailsDataOld:[],
    message : ''
  },

  reducers: {
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    //初始化获取当前月份，并查询
    *init({}, { call, put }) {
      const ou = Cookie.get('OU');
      //获取当前填报阶段的月份1
      const batchType = yield call(fundingPlanService.getBatchType, {arg_null: null});
      let year = batchType.DataRows[0].plan_year;
      let month = batchType.DataRows[0].plan_month;
      let reportType = batchType.DataRows[0].report_type;
      yield put({
        type:'query',
        searchData:{
          arg_ou:ou,
          arg_PlanYear:year,
          arg_PlanMonth:month,
          reportType:reportType === '1'?'1':reportType ==='2'?'2':'1',//如果是预填报默认预填报，调整默认调整，其他默认预填报
        },
      });
    },
    //查询，并查询明细
    *query({searchData},{call,put}){
      const dept = Cookie.get('deptname');
      let postData = {};
      postData['arg_total_year'] = searchData.arg_PlanYear;
      postData['arg_total_month'] = searchData.arg_PlanMonth;
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_ou'] = localStorage.ou;
      postData['arg_dept_name'] = Cookie.get('deptname');
      postData['arg_dept_id'] = Cookie.get('dept_id');
      postData['arg_report_type'] = searchData.reportType;
      const OUDeptFundsPlan = yield call(fundingPlanService.completeRatio,postData);
      if(OUDeptFundsPlan.RetCode==='1'){
        const list = OUDeptFundsPlan.DataRows;
        yield put({
          type:'save',
          payload:{
            list:list,
            ou:searchData.arg_ou,
            year:searchData.arg_PlanYear,
            month:searchData.arg_PlanMonth,
            reportType:searchData.reportType,
            dept:dept,
            message : '',
          }
        });
        yield put({
          type:'getDeptMonthlyDetails',
          searchData:{
            arg_ou:searchData.arg_ou,
            arg_PlanYear:searchData.arg_PlanYear,
            arg_PlanMonth:searchData.arg_PlanMonth,
            arg_dept:dept,
            reportType:searchData.reportType,
          }
        });
        yield put({
          type:'getOldMonthDetails',
          searchData:{
            arg_ou:searchData.arg_ou,
            arg_PlanYear:searchData.arg_PlanYear,
            arg_PlanMonth:searchData.arg_PlanMonth,
            arg_dept:dept,
            reportType:searchData.reportType,
          }
        });
        yield put({
          type:'getCAPEXDetails',
          searchData:{
            arg_ou:searchData.arg_ou,
            arg_PlanYear:searchData.arg_PlanYear,
            arg_PlanMonth:searchData.arg_PlanMonth,
            arg_dept:dept,
            reportType:searchData.reportType,
          }
        });
      } else {
        yield put({
          type:'getDeptMonthlyDetails',
          searchData:{
            arg_ou:searchData.arg_ou,
            arg_PlanYear:searchData.arg_PlanYear,
            arg_PlanMonth:searchData.arg_PlanMonth,
            arg_dept:dept,
            reportType:searchData.reportType,
          }
        });
        yield put({
          type:'save',
          payload:{
            list:[],
            monthlyDetailsData:[],
            monthlyDetailsDataCAPEX:[],
            monthlyDetailsDataOld:[],
            ou:searchData.arg_ou,
            year:searchData.arg_PlanYear,
            month:searchData.arg_PlanMonth,
            reportType:searchData.reportType,
            dept:dept,
            message : OUDeptFundsPlan.RetVal,
          }
        });
      }
    },

    //获取资金计划追加明细表
    *getDeptMonthlyDetails({searchData},{call,put}){
      let postData = {};
      postData['arg_total_year'] = searchData.arg_PlanYear;
      postData['arg_total_month'] = searchData.arg_PlanMonth;
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_ou'] = localStorage.ou;
      postData['arg_dept_name'] = Cookie.get('deptname');
      postData['arg_dept_id'] = Cookie.get('dept_id');
      postData['arg_report_type'] = searchData.reportType;
      const OUmonthlyDetails = yield call(fundingPlanService.getDeptMonthlyDetails, postData);
      let monthlyDetailsData = [];
      let isGenerate = false;
      if(OUmonthlyDetails.DataRows.length !== 0){
        if(OUmonthlyDetails.DataRows[0].hasOwnProperty('fee_amount')  && searchData.reportType === '1' || OUmonthlyDetails.DataRows[0].hasOwnProperty('adjusted_fee_amount')  && searchData.reportType === '2'){
          isGenerate = true;
        }
      }else {
        isGenerate = false;
      }
      yield put({
        type:'save',
        payload:{
          isGenerate : isGenerate,
        }
      });
      if(OUmonthlyDetails.RetCode === '1'){
        for (let i=0;i<OUmonthlyDetails.DataRows.length;i++){
          let childRows = OUmonthlyDetails.DataRows[i].childRows?JSON.parse(OUmonthlyDetails.DataRows[i].childRows):[];//json->dataRows
          if (childRows.length!==0){
            let children =[];
            for (let j=0;j<childRows.length;j++){
              children.push({
                key:childRows[j].fee_code+j,
                fee_name:childRows[j].fee_name,
                funds_plan:childRows[j].fee_amount,
                funds_diff:childRows[j].adjust_fee_amount,
                funds_current_amount:childRows[j].adjusted_fee_amount,
                remarks : childRows[j].remarks,
              })
            }
            monthlyDetailsData.push({
              key:OUmonthlyDetails.DataRows[i].fee_code+i,
              fee_name:OUmonthlyDetails.DataRows[i].fee_name,
              funds_plan:OUmonthlyDetails.DataRows[i].fee_amount,
              funds_diff:OUmonthlyDetails.DataRows[i].adjust_fee_amount,
              funds_current_amount:OUmonthlyDetails.DataRows[i].adjusted_fee_amount,
              remarks : OUmonthlyDetails.DataRows[i].remarks,
              children:children,
            })
          }else{
            monthlyDetailsData.push({
              key:OUmonthlyDetails.DataRows[i].fee_code+i,
              fee_name:OUmonthlyDetails.DataRows[i].fee_name,
              funds_plan:OUmonthlyDetails.DataRows[i].fee_amount,
              funds_diff:OUmonthlyDetails.DataRows[i].adjust_fee_amount,
              funds_current_amount:OUmonthlyDetails.DataRows[i].adjusted_fee_amount,
              remarks : OUmonthlyDetails.DataRows[i].remarks,
            })
          }
        }

        // let monthlyDetailsDataExport = [];
        // for (let i=0;i<OUmonthlyDetails.DataRows.length;i++){
        //   let childRowsExport = OUmonthlyDetails.DataRows[i].childRows?JSON.parse(OUmonthlyDetails.DataRows[i].childRows):[];//json->dataRows
        //   monthlyDetailsDataExport.push({
        //     key:i+'-'+i,
        //     fee_name:OUmonthlyDetails.DataRows[i].fee_name,
        //     funds_plan:OUmonthlyDetails.DataRows[i].fee_amount,
        //     funds_diff:OUmonthlyDetails.DataRows[i].adjust_fee_amount,
        //     funds_current_amount:OUmonthlyDetails.DataRows[i].adjusted_fee_amount,
        //   });
        //   for (let j=0;j<childRowsExport.length;j++){
        //     monthlyDetailsDataExport.push({
        //       key:childRowsExport[j].fee_code,
        //       fee_name:childRowsExport[j].fee_name,
        //       funds_plan:childRowsExport[j].fee_amount,
        //       funds_diff:childRowsExport[j].adjust_fee_amount,
        //       funds_current_amount:childRowsExport[j].adjusted_fee_amount,
        //     })
        //   }
        // }
        yield put({
          type: 'save',
          payload:{
            monthlyDetailsData:monthlyDetailsData,
            //monthlyDetailsDataExport : monthlyDetailsDataExport,
            message : ''
          }
        });
      }else{
        yield put({
          type: 'save',
          payload:{
            monthlyDetailsData:[],
            message : OUmonthlyDetails.RetVal,
          }
        });
      }
    },
    //获取以前年度应付款支出明细表
    *getOldMonthDetails({searchData},{call,put}){
      let postData = {};
      postData['arg_total_year'] = searchData.arg_PlanYear;
      postData['arg_total_month'] = searchData.arg_PlanMonth;
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_ou'] = localStorage.ou;
      postData['arg_dept_name'] = Cookie.get('deptname');
      postData['arg_dept_id'] = Cookie.get('dept_id');
      postData['arg_report_type'] = searchData.reportType;
      const OldMonthDetails = yield call(fundingPlanService.getOldMonthDetails, postData);
      if(OldMonthDetails.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            monthlyDetailsDataOld:OldMonthDetails.DataRows,
            //message :''
          }
        });
      }else {
        yield put({
          type: 'save',
          payload:{
            monthlyDetailsDataOld:[],
            //message : OldMonthDetails.RetVal,
          }
        });
      }
    },
    //获取capex现金支出明细表
    *getCAPEXDetails({searchData},{call,put}){
      let postData = {};
      postData['arg_total_year'] = searchData.arg_PlanYear;
      postData['arg_total_month'] = searchData.arg_PlanMonth;
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_ou'] = localStorage.ou;
      postData['arg_dept_name'] = Cookie.get('deptname');
      postData['arg_dept_id'] = Cookie.get('dept_id');
      postData['arg_report_type'] = searchData.reportType;
      const CAPEXDetails = yield call(fundingPlanService.getCAPEXDetails, postData);
      if(CAPEXDetails.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            monthlyDetailsDataCAPEX:CAPEXDetails.DataRows,
            //message : ''
          }
        });
      }else {
        yield put({
          type: 'save',
          payload:{
            monthlyDetailsDataCAPEX:[],
            //message: CAPEXDetails.RetVal,
          }
        });
      }
    },
    //生成数据
    *generateData({year, month, reportType},{call,put}) {
      let postData = {};
      postData['arg_total_year'] = year;
      postData['arg_total_month'] = month;
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_ou'] = localStorage.ou;
      postData['arg_report_type'] = reportType;
      postData['arg_dept_name'] = Cookie.get('deptname');
      postData['arg_dept_id'] = Cookie.get('dept_id');
      let reportTypes = reportType === '1'?'预填阶段':'调整阶段';
      const data = yield call(fundingPlanService.generateData, postData);
      if(data.RetCode === '1'){
        message.success('成功生成'+year +'-' +month+reportTypes+'的数据');
        yield put({
          type : 'query',
          searchData : {
            arg_ou:localStorage.ou,
            arg_PlanYear:year,
            arg_PlanMonth:month,
            arg_dept:Cookie.get('deptname'),
            reportType:reportType,
          }
        })
      }
    },
    //撤销数据
    *cancelData({year, month, reportType},{call,put}){
      let postData = {};
      postData['arg_total_year'] = year;
      postData['arg_total_month'] = month;
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_ou'] = localStorage.ou;
      postData['arg_report_type'] = reportType;
      postData['arg_dept_name'] = Cookie.get('deptname');
      postData['arg_dept_id'] = Cookie.get('dept_id');
      let reportTypes = reportType === '1'?'预填阶段':'调整阶段';
      const data = yield call(fundingPlanService.deleteData, postData);
      if(data.RetCode === '1'){
        message.success('成功撤销'+year +'-' +month+reportTypes+'的数据');
        yield put({
          type : 'query',
          searchData : {
            arg_ou:localStorage.ou,
            arg_PlanYear:year,
            arg_PlanMonth:month,
            arg_dept:Cookie.get('deptname'),
            reportType:reportType,
          }
        })
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_deptMgr_report') {
          dispatch({ type: 'init',query  });
        }
      });
    },
  },
};
