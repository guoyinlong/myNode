/**
 * 作者：张楠华
 * 日期：2018-4-3
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：小组资金计划报表
 */
import * as fundingPlanService from '../../../../services/finance/fundingPlanSRS';
import Cookie from 'js-cookie';
function delcommafy(num){
  if((num +"").trim() === ""){
    return"";
  }
  num=num.replace(/,/gi,'');
  return num;
}
export default {
  namespace: 'teamReportDetail',
  state: {
    list:[],
    monthlyDetailsDataCAPEX:[],
    monthlyDetailsDataOld:[],

    deptName:'',
    deptId:'',
    flag:'',
    visible:false,
    ou:'',
  },

  reducers: {
    initData(state) {
      return {
        ...state,
        list:[],
        monthlyDetailsDataCAPEX:[],
        monthlyDetailsDataOld:[],

        deptName:'',
        deptId:'',
        flag:'',
        visible:false,
        ou:'',
      }
    },
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    //初始化获取当前月份，并查询
    *init({query}, { call, put }) {
      let postData = {};
      postData['arg_total_year'] = query.year;
      postData['arg_total_month'] = query.month;
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_ou'] = query.ou?query.ou:localStorage.ou;
      postData['arg_dept_name'] =query.deptName;
      postData['arg_dept_id'] = query.flag ==='3'?Cookie.get('dept_id'):query.deptId;
      postData['arg_report_type'] = query.reportType;
      const teamInfo = yield call(fundingPlanService.allTeamCompleteRatio,postData);
      if(teamInfo.RetCode === '1'){
        let sum = {};
        // let payAmount = 0;
        // let feeAmount = 0;
        // let adjFeeAmount = 0;
        for(let i=0;i<teamInfo.DataRows.length;i++) {
          teamInfo.DataRows[i].addDetailForm=[];
          teamInfo.DataRows[i].queryOUCAPEX=[];
          teamInfo.DataRows[i].previousYears=[];
          // if(parseFloat(teamInfo.DataRows[i].pay_amount)){
          //   payAmount +=  parseFloat(delcommafy(teamInfo.DataRows[i].pay_amount));
          // }
          // if(teamInfo.DataRows[i].fee_amount){
          //   feeAmount +=  parseFloat(delcommafy(teamInfo.DataRows[i].fee_amount));
          // }
          // if(teamInfo.DataRows[i].adjusted_fee_amount){
          //   adjFeeAmount +=  parseFloat(delcommafy(teamInfo.DataRows[i].adjusted_fee_amount));
          // }
        }
        if(teamInfo.DataRows1 && teamInfo.DataRows1.length !==0 ){
          sum['team_name'] = '合计';
          sum['pay_amount'] = teamInfo.DataRows1[0]['all_pay_amount'];
          sum['fee_amount'] = teamInfo.DataRows1[0]['all_fee_amount'];
          sum['adjusted_fee_amount'] = teamInfo.DataRows1[0]['all_adjusted_fee_amount'];
          teamInfo.DataRows.push(sum);
        }
        const plainOptions = ['资金计划追加调整明细表', '以前年度应付款支出明细表', 'CAPEX现金支出明细表'];
        yield put({
          type:'save',
          payload:{
            list:teamInfo.DataRows,
            year : query.year,
            month : query.month,
            reportType:query.reportType,
            deptName:query.deptName,
            deptId:query.flag ==='3'?Cookie.get('dept_id'):query.deptId,
            flag : query.flag,
            queryBack:query.queryBack,
            ou:query.ou?query.ou:localStorage.ou,
            plainOptions,
          }
        });
      }
    },
    //获取资金计划追加明细表
    *getDeptMonthlyDetails({searchData},{select,call,put}){
      let {list,deptName,deptId,ou } = yield select(state => state.teamReportDetail);
      let postData = {};
      postData['arg_total_year'] = searchData.arg_PlanYear;
      postData['arg_total_month'] = searchData.arg_PlanMonth;
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_ou'] = ou;
      postData['arg_dept_name'] = deptName;
      postData['arg_dept_id'] = deptId;
      postData['arg_team_id'] = searchData.teamId;
      postData['arg_report_type'] = searchData.reportType;
      const OUmonthlyDetails = yield call(fundingPlanService.teamAdditional, postData);
      let monthlyDetailsData = [];
      for (let i=0;i<OUmonthlyDetails.DataRows.length;i++){
        let childRows = OUmonthlyDetails.DataRows[i].childRows?JSON.parse(OUmonthlyDetails.DataRows[i].childRows):[];//json->dataRows
        let children = [];
        if (childRows.length!==0) {
          for (let j = 0; j < childRows.length; j++) {
            children.push({
              key: childRows[j].fee_code + j,
              fee_name: childRows[j].fee_name,
              funds_plan: childRows[j].fee_amount,
              funds_diff: childRows[j].adjust_fee_amount,
              funds_current_amount: childRows[j].adjusted_fee_amount,
              remarks : childRows[j].remarks,
            })
          }
        }
        monthlyDetailsData.push({
          key:OUmonthlyDetails.DataRows[i].fee_code+i,
          fee_name:OUmonthlyDetails.DataRows[i].fee_name,
          funds_plan:OUmonthlyDetails.DataRows[i].fee_amount,
          funds_diff:OUmonthlyDetails.DataRows[i].adjust_fee_amount,
          funds_current_amount:OUmonthlyDetails.DataRows[i].adjusted_fee_amount,
          team_id:OUmonthlyDetails.DataRows[i].team_id,
          remarks : OUmonthlyDetails.DataRows[i].remarks,
          children:children.length !== 0 ? children : undefined,
        })
      }
      //如果返回的列表中的list的team_id与搜索中的teamId相同，将返回的数据方法其中
      for (let i=0;i<list.length;i++){
        if(list[i].team_id ===searchData.teamId){
          list[i].addDetailForm = monthlyDetailsData;
        }
      }
      yield put({
        type: 'save',
        payload:{
          list:list,
        }
      });
    },
    //获取以前年度应付款支出明细表
    *getOldMonthDetails({searchData},{select,call,put}){
      let {list,deptName,deptId,ou} = yield select(state => state.teamReportDetail);
      let postData = {};
      postData['arg_total_year'] = searchData.arg_PlanYear;
      postData['arg_total_month'] = searchData.arg_PlanMonth;
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_ou'] = ou;
      postData['arg_dept_name'] = deptName;
      postData['arg_dept_id'] = deptId;
      postData['arg_team_id'] = searchData.teamId;
      postData['arg_report_type'] = searchData.reportType;
      const OldMonthDetails = yield call(fundingPlanService.getOldMonthTeamDetails, postData);
      //如果返回的列表中的list的team_id与搜索中的teamId相同，将返回的数据方法其中
      for (let i=0;i<list.length;i++){
        if(list[i].team_id===searchData.teamId){
          list[i].previousYears=OldMonthDetails.DataRows;
        }
      }
      if(OldMonthDetails.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            list:list,
          }
        });
      }
    },
    //获取capex现金支出明细表
    *getCAPEXDetails({searchData},{select,call,put}){
      let {list,deptName,deptId,ou} = yield select(state => state.teamReportDetail);
      let postData = {};
      postData['arg_total_year'] = searchData.arg_PlanYear;
      postData['arg_total_month'] = searchData.arg_PlanMonth;
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_ou'] = ou;
      postData['arg_dept_name'] = deptName;
      postData['arg_dept_id'] = deptId;
      postData['arg_team_id'] = searchData.teamId;
      postData['arg_report_type'] = searchData.reportType;
      const CAPEXDetails = yield call(fundingPlanService.getTeamCAPEXDetails, postData);
      if(CAPEXDetails.RetCode === '1'){
        //如果返回的列表中的list的team_id与搜索中的teamId相同，将返回的数据方法其中
        for (let i=0;i<list.length;i++){
          if(list[i].team_id===searchData.teamId){
            list[i].queryOUCAPEX=CAPEXDetails.DataRows;
          }
        }
        yield put({
          type: 'save',
          payload:{
            list:list
          }
        });
      }
    },
    *changeModalVisible({flag},{put}){
      if (flag === 'open'){
        yield put({
          type: 'save',
          payload:{visible:true}
        });
      } else if(flag === 'close'){
        yield put({
          type: 'save',
          payload:{visible:false}
        });
      }

    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_deptMgr_report/funding_plan_team_report_detail'
          || pathname === '/financeApp/funding_plan/funding_plan_finance_report/funding_plan_dept_report/funding_plan_team_report_detail'
          || pathname === '/financeApp/funding_plan/funding_plan_branch_finance_report/funding_plan_dept_report/funding_plan_team_report_detail'
        ) {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
