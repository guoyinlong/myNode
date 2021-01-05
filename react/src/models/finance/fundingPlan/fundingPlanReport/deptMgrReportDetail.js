/**
 * 作者：杨青
 * 日期：2018-3-6
 * 邮箱：yangq41@chinaunicom.cn
 * 文件说明：部门详情资金计划报表
 */
import * as fundingPlanReportService from '../../../../services/finance/fundingPlanReportService';
import Cookie from 'js-cookie';
export default {
  namespace: 'deptMgrReportDetail',
  state: {
    list:[],
    queryData:{},
    visible:false,
  },

  reducers: {
    initData(state) {
      return {
        ...state,
        queryData: {},
        list:[],
        visible:false,
      }
    },
    save(state,action) {
      return { ...state,...action.payload};
    },
  },

  effects: {
    *init({query}, { call, put }) {
      const deptList = yield call(fundingPlanReportService.queryDept, query);
      const year = query.arg_planYear;
      const month = query.arg_planMonth;
      let list = [];
      //根据当前用户角色是否为总院财务，是则返回到总院财务报表查询页面，否则返回到分院财务报表查询页面。
      let financeOrNot ;
      if (Cookie.get('OU') === '联通软件研究院本部'){
        financeOrNot = true;
      }else{
        financeOrNot = false;
      }
      for (let i=0;i<deptList.DataRows.length;i++){
        list.push({
          plan_year_month:deptList.DataRows[i].plan_year_month,
          deptname:deptList.DataRows[i].deptname,
          pay_amount:deptList.DataRows[i].pay_amount,
          fee_money:deptList.DataRows[i].fee_money,
          fee_amount:deptList.DataRows[i].fee_amount,
          com_ratio:deptList.DataRows[i].com_ratio,
          flag_dept:deptList.DataRows[i].flag_dept,
          deptid:deptList.DataRows[i].deptid,
          addDetailForm:[],
          queryOUCAPEX:[],
          previousYears:[],
        })
      }
      let sum={};
      if(deptList.DataRows1 && deptList.DataRows1.length !==0 ){
        sum['deptname'] = '合计';
        sum['plan_year_month'] = deptList.DataRows[0].plan_year_month;
        sum['pay_amount'] = deptList.DataRows1[0]['all_pay_amount'];
        sum['fee_money'] = deptList.DataRows1[0]['all_fee_money'];
        sum['fee_amount'] = deptList.DataRows1[0]['all_fee_amount'];
        sum['com_ratio'] = deptList.DataRows1[0]['all_com_ratio'];
        list.push(sum);
      }
      const plainOptions = ['资金计划追加调整明细表', '以前年度应付款支出明细表', 'CAPEX现金支出明细表'];
      yield put({
        type: 'save',
        payload:{
          list: list,
          financeOrNot:financeOrNot,
          month:month,
          year:year,
          queryOU:query.arg_ou,
          query:query,
          plainOptions
        }
      });
    },
    /**
     * 作者：杨青
     * 创建日期：2018-03-14
     * 功能：获取资金计划追加明细表
     */
    *getDeptMonthlyDetails({searchData},{call,put,select}){
      let {list,query} = yield select(state => state.deptMgrReportDetail);
      searchData.arg_report_type = query.arg_report_type;
      const OUmonthlyDetails = yield call(fundingPlanReportService.getAddDetailForm, searchData);
      let monthlyDetailsData=[];
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
      for (let i=0;i<list.length;i++){
        if(list[i].deptname===searchData.arg_dept_name){
          list[i].addDetailForm=monthlyDetailsData;
        }
      }
      yield put({
        type: 'save',
        payload:{
          list:list,
        }
      });
    },
    /**
     * 作者：杨青
     * 创建日期：2018-04-16
     * 功能：资金计划capex查询
     */
    *getCAPEXDetails({searchData},{call,put,select}){
      let {list,query} = yield select(state => state.deptMgrReportDetail);
      searchData.arg_report_type = query.arg_report_type;
      const queryOUCAPEX = yield call(fundingPlanReportService.getCAPEXDetails, searchData);
      for (let i=0;i<list.length;i++){
        if(list[i].deptname===searchData.arg_dept_name){
          list[i].queryOUCAPEX=queryOUCAPEX.DataRows;
        }
      }
      yield put({
        type: 'save',
        payload:{
          list:list,
        }
      });
    },
    /**
     * 作者：杨青
     * 创建日期：2018-04-16
     * 功能：资金计划以前年度应付费查询
     */
    *getOldMonthDetails({searchData},{call,put,select}){
      let {list,query} = yield select(state => state.deptMgrReportDetail);
      searchData.arg_report_type = query.arg_report_type;
      const previousYears = yield call(fundingPlanReportService.getOldMonthDetails, searchData);
      for (let i=0;i<list.length;i++){
        if(list[i].deptname===searchData.arg_dept_name){
          list[i].previousYears=previousYears.DataRows;
        }
      }
      yield put({
        type: 'save',
        payload:{
          list:list,
        }
      });
    },
    *setQueryData({query},{put}){
      yield put({
        type: 'save',
        payload:{queryData:query}
      });
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
      return history.listen(({ pathname,  query }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_finance_report/funding_plan_deptMgr_report_detail') {
          dispatch({ type: 'init',query });
          dispatch({ type: 'initData' });
          dispatch({ type: 'setQueryData',query });
        };
        if (pathname === '/financeApp/funding_plan/funding_plan_branch_finance_report/funding_plan_deptMgr_report_detail') {
          dispatch({ type: 'init',query });
          dispatch({ type: 'initData' });
          dispatch({ type: 'setQueryData',query });
        }
      });
    },
  },
};
