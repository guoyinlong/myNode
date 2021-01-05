/**
 * 作者：张楠华
 * 日期：2018-4-3
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：小组资金计划报表
 */
import * as fundingPlanService from '../../../../services/finance/fundingPlanSRS';
export default {
  namespace: 'teamReport',
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
      let postData = {};
      postData['arg_staffid'] = localStorage.userid;
      const data = yield call(fundingPlanService.searchTeam,postData);
      if(data.RetCode === '1'){
        //获取当前填报阶段的月份
        const batchType = yield call(fundingPlanService.getBatchType, {arg_null: null});
        let year = batchType.DataRows[0].plan_year;
        let month = batchType.DataRows[0].plan_month;
        yield put({
          type:'query',
          searchData:{
            arg_PlanYear:year,
            arg_PlanMonth:month,
            team_id : data.DataRows[0].id,
            department : data.DataRows[0].department,
            deptid : data.DataRows[0].deptid,
          },
        });
      }
    },
    //查询，并查询明细
    *query({searchData},{call,put}){
      let postData = {};
      postData['arg_total_year'] = searchData.arg_PlanYear;
      postData['arg_total_month'] = searchData.arg_PlanMonth;
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_ou'] = localStorage.ou;
      postData['arg_dept_name'] = searchData.department;
      postData['arg_dept_id'] = searchData.deptid;
      postData['arg_team_id'] = searchData.team_id;
      const OUDeptFundsPlan = yield call(fundingPlanService.teamAdditionalCompleteRatio,postData);
      if(OUDeptFundsPlan.RetCode==='1'){
        yield put({
          type:'save',
          payload:{
            list:OUDeptFundsPlan.DataRows,
            year:searchData.arg_PlanYear,
            month:searchData.arg_PlanMonth,
            team_id : searchData.team_id,
            message : '',
            department : searchData.department,
            deptid : searchData.deptid,
          }
        });
        yield put({
          type:'getDeptMonthlyDetails',
          searchData:{
            arg_PlanYear:searchData.arg_PlanYear,
            arg_PlanMonth:searchData.arg_PlanMonth,
            team_id : searchData.team_id,
            department : searchData.department,
            deptid : searchData.deptid,
          }
        });
      } else {
        yield put({
          type:'save',
          payload:{
            list:[],
            monthlyDetailsData:[],
            monthlyDetailsDataCAPEX:[],
            monthlyDetailsDataOld:[],
            year:searchData.arg_PlanYear,
            month:searchData.arg_PlanMonth,
            message : OUDeptFundsPlan.RetVal,
            team_id : searchData.team_id,
            department : searchData.department,
            deptid : searchData.deptid,
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
      postData['arg_dept_name'] = searchData.department;
      postData['arg_dept_id'] = searchData.deptid;
      postData['arg_team_id'] = searchData.team_id;
      const OUmonthlyDetails = yield call(fundingPlanService.getTeamMonthly, postData);
      let monthlyDetailsData = [];
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
              })
            }
            monthlyDetailsData.push({
              key:OUmonthlyDetails.DataRows[i].fee_code+i,
              fee_name:OUmonthlyDetails.DataRows[i].fee_name,
              funds_plan:OUmonthlyDetails.DataRows[i].fee_amount,
              funds_diff:OUmonthlyDetails.DataRows[i].adjust_fee_amount,
              funds_current_amount:OUmonthlyDetails.DataRows[i].adjusted_fee_amount,
              children:children,
            })
          }else{
            monthlyDetailsData.push({
              key:OUmonthlyDetails.DataRows[i].fee_code+i,
              fee_name:OUmonthlyDetails.DataRows[i].fee_name,
              funds_plan:OUmonthlyDetails.DataRows[i].fee_amount,
              funds_diff:OUmonthlyDetails.DataRows[i].adjust_fee_amount,
              funds_current_amount:OUmonthlyDetails.DataRows[i].adjusted_fee_amount,
            })
          }
        }
        yield put({
          type: 'save',
          payload:{
            monthlyDetailsData:monthlyDetailsData,
          }
        });
      }else{
        yield put({
          type: 'save',
          payload:{
            monthlyDetailsData:[],
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
      postData['arg_dept_name'] = searchData.department;
      postData['arg_dept_id'] = searchData.deptid;
      postData['arg_team_id'] = searchData.team_id;
      const OldMonthDetails = yield call(fundingPlanService.getOldMonthTeam, postData);
      if(OldMonthDetails.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            monthlyDetailsDataOld:OldMonthDetails.DataRows,
          }
        });
      }else {
        yield put({
          type: 'save',
          payload:{
            monthlyDetailsDataOld:[],
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
      postData['arg_dept_name'] = searchData.department;
      postData['arg_dept_id'] = searchData.deptid;
      postData['arg_team_id'] = searchData.team_id;
      const CAPEXDetails = yield call(fundingPlanService.getTeamCAPEX, postData);
      if(CAPEXDetails.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            monthlyDetailsDataCAPEX:CAPEXDetails.DataRows,
          }
        });
      }else {
        yield put({
          type: 'save',
          payload:{
            monthlyDetailsDataCAPEX:[],
          }
        });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_team_report') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
