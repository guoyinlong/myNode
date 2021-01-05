/**
 * 作者：杨青
 * 日期：2018-3-6
 * 邮箱：yangq41@chinaunicom.cn
 * 文件说明：各院报表详情（总院选择联通软件研究院跳转至此页面）
 */
import * as fundingPlanReportService from '../../../../services/finance/fundingPlanReportService';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'financeReportDetail',
  state: {
    list:[],
    queryData:{},
    visible:false,
    reportType:'',
    year:'',
    month:'',
    batchNum:'',
  },

  reducers: {
    initData(state) {
      return {
        ...state,
        queryData: {},
        list:[],
        visible:false,
        reportType:'',
        year:'',
        month:'',
        batchNum:'',
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
      const reportType = query.arg_report_type;
      const batchNum= query.arg_batch_number;
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
          monthlyApprovalForm:[],
          monthlyReportForm:[],
        })
      }
      let sum={};
      if(deptList.DataRows1 && deptList.DataRows1.length !==0 ){
        sum['deptname'] = '合计';
        sum['plan_year_month'] = deptList.DataRows[0].plan_year_month;
        sum['pay_amount'] = deptList.DataRows1[0]['all_pay_amount'];
        sum['fee_money'] = deptList.DataRows1[0]['all_fee_money'];
        sum['fee_amount'] = deptList.DataRows1[0]['all_fee_amount'];
        sum['com_ratio'] = deptList.DataRows1[0]['all_com_ratio']||deptList.DataRows1[0]['com_ratio'];
        list.push(sum);
      }
      yield put({
        type: 'save',
        payload:{
          list: list,
          financeOrNot:financeOrNot,
          month:month,
          year:year,
          queryOU:query.arg_ou,
          query:query,
          reportType,
          batchNum,
          // plainOptions
        }
      });
    },
    *queryDetail({key,record},{call,put,select}){
      let {reportType,batchNum,year,month} = yield select(state =>state.financeReportDetail);
      let searchData={arg_ou:record.deptname};
      // const batchType = yield call(fundingPlanReportService.searchBatchType, searchData);
      // if (batchType.DataRows.length!==0){
      //   let reportType = batchType.DataRows[0].report_type?batchType.DataRows[0].report_type:'1';//填报批次
      //   let batchNum = batchType.DataRows[0].batch_number;//批次号
      //   let time = batchType.DataRows[0].plan_year_month;
        // let year = time.split("-")[0];
        // let month = parseInt(time.split("-")[1]);
        // yield put({
        //   type: 'save',
        //   payload:{
        //     reportType,
        //     batchNum,
        //   }
        // });
        if (key === '1'){
          //获取资金计划追加明细表
          yield put({
            type:'queryAddJect',
            searchData:{
              arg_ou:searchData.arg_ou,
              arg_report_type:reportType,
              arg_batch_number:batchNum,
              arg_planYear:year,
              arg_planMonth:month,
            },
          });
        }else if (key ==='2'){
          //月度资金计划审批表
          yield put({
            type:'queryMonthlyApprovalForm',
            searchData:{
              arg_ou:searchData.arg_ou,
              arg_report_type:reportType,
              arg_batch_number:batchNum,
              arg_planYear:year,
              arg_planMonth:month,
            },
          });
        }else if (key ==='3'){
          //月度资金计划表
          yield put({
            type:'searchMonthlyReportForm',
            searchData:{
              arg_ou:searchData.arg_ou,
              arg_report_type:reportType,
              arg_total_year:year,
              arg_total_month:month,
            },
          });
        }else if (key ==='4'){
          //资金计划以前年度应付费查询
          yield put({
            type:'queryPreviousYears',
            searchData:{
              arg_ou:searchData.arg_ou,
              arg_report_type:reportType,
              arg_batch_number:batchNum,
              arg_planYear:year,
              arg_planMonth:month,
            },
          });
        }else if (key ==='5'){
          //资金计划capex查询
          yield put({
            type:'queryOUCAPEX',
            searchData:{
              arg_ou:searchData.arg_ou,
              arg_report_type:reportType,
              arg_batch_number:batchNum,
              arg_planYear:year,
              arg_planMonth:month,
            },
          });
        }else if (key ==='jump'){
          yield put(routerRedux.push({
            pathname: 'financeApp/funding_plan/funding_plan_finance_report/funding_plan_deptMgr_report_detail',
            query: {
              arg_ou:record.deptname,
              arg_planMonth:parseInt(record.plan_year_month.split("-")[1]),
              arg_planYear:parseInt(record.plan_year_month.split("-")[0]),
              arg_report_type:reportType,
              arg_batch_number:batchNum,
              flag:'1',
              url:'funding_plan_finance_report_detail',
              payload:JSON.stringify({
                arg_ou:record.deptname,
                arg_reportType:reportType,
                arg_planYear:parseInt(record.plan_year_month.split("-")[0]),
                arg_planMonth:parseInt(record.plan_year_month.split("-")[1]),
              })
            }
          }))
        }

        if (searchData.arg_ou==='联通软件研究院本部'){
          yield put({
            type: 'save',
            payload:{
              plainOptions:['资金计划追加调整明细表', '月度资金计划审批表', '月度资金计划表', '以前年度应付款支出明细表', 'CAPEX现金支出明细表'],
            }
          });
        }else {
          yield put({
            type: 'save',
            payload:{
              plainOptions:['资金计划追加调整明细表', '以前年度应付款支出明细表', 'CAPEX现金支出明细表'],
            }
          });
        }

      // } else {
      //   yield put({
      //     type: 'save',
      //     payload:{
      //       list:[],
      //       year:searchData.arg_planYear,
      //       month:(searchData.arg_planMonth).toString(),
      //       ou:searchData.arg_ou,
      //       reportType:searchData.arg_reportType,
      //       RetVal:'',
      //     }
      //   });
      // }
    },
    /**
     * 作者：杨青
     * 创建日期：2018-03-14
     * 功能：获取资金计划追加明细表
     */
      *queryAddJect({searchData},{call,put,select}){
      let {list} = yield select(state => state.financeReportDetail);
      const addJect = yield call(fundingPlanReportService.queryAddJect, searchData);
      let addJectData = [];
      for (let i = 0;i<addJect.DataRows.length;i++){
        let childRows = JSON.parse(addJect.DataRows[i].chlidRows);//json->dataRows
        if (childRows.length!==0){
          let children =[];
          for (let j=0;j<childRows.length;j++){
            children.push({
              key:childRows[j].child_id,
              fee_name:childRows[j].childFee_name,
              funds_plan:childRows[j].child_money,
              funds_diff:childRows[j].child_diff,
              funds_current_amount:childRows[j].child_adject,
            })
          }
          addJectData.push({
            key:addJect.DataRows[i].fee_code,
            fee_name:addJect.DataRows[i].fee_name,
            funds_plan:addJect.DataRows[i].fee_amount,
            funds_diff:addJect.DataRows[i].fee_diff,
            funds_current_amount:addJect.DataRows[i].fee_adject,
            children:children,
          })
        }else{
          addJectData.push({
            key:addJect.DataRows[i].fee_code,
            fee_name:addJect.DataRows[i].fee_name,
            funds_plan:addJect.DataRows[i].fee_amount,
            funds_diff:addJect.DataRows[i].fee_diff,
            funds_current_amount:addJect.DataRows[i].fee_adject,
          })
        }
      }
      for (let i=0;i<list.length;i++){
        if(list[i].deptname===searchData.arg_ou){
          list[i].addDetailForm=addJectData;
        }
      }
      yield put({
        type: 'save',
        payload:{
          list:JSON.parse(JSON.stringify(list)),
        }
      });
    },
    /**
     * 作者：杨青
     * 创建日期：2018-04-16
     * 功能：月度资金计划审批表
     */
      *queryMonthlyApprovalForm({searchData},{call,put,select}){
      let {list} = yield select(state => state.financeReportDetail);
      const monthlyApprovalForm = yield call(fundingPlanReportService.queryMonthlyApprovalForm, searchData);
      for (let i=0;i<list.length;i++){
        if(list[i].deptname===searchData.arg_ou){
          list[i].monthlyApprovalForm=monthlyApprovalForm.DataRows;
        }
      }
      yield put({
        type: 'save',
        payload:{
          list:JSON.parse(JSON.stringify(list)),
        }
      });
    },
    /**
     * 作者：杨青
     * 创建日期：2018-04-16
     * 功能：资金计划capex查询
     */
      *queryOUCAPEX({searchData},{call,put,select}){
      let {list} = yield select(state => state.financeReportDetail);
      const queryOUCAPEX = yield call(fundingPlanReportService.queryOUCAPEX, searchData);
      for (let i=0;i<list.length;i++){
        if(list[i].deptname===searchData.arg_ou){
          list[i].queryOUCAPEX=queryOUCAPEX.DataRows;
        }
      }
      yield put({
        type: 'save',
        payload:{
          list:JSON.parse(JSON.stringify(list)),
        }
      });
    },
    /**
     * 作者：杨青
     * 创建日期：2018-04-16
     * 功能：资金计划以前年度应付费查询
     */
      *queryPreviousYears({searchData},{call,put,select}){
      let {list} = yield select(state => state.financeReportDetail);
      const previousYears = yield call(fundingPlanReportService.queryPreviousYears, searchData);
      for (let i=0;i<list.length;i++){
        if(list[i].deptname===searchData.arg_ou){
          list[i].previousYears=previousYears.DataRows;
        }
      }
      yield put({
        type: 'save',
        payload:{
          list:JSON.parse(JSON.stringify(list)),
        }
      });
    },
    /**
     * 作者：杨青
     * 创建日期：2018-03-14
     * 功能：资金计划报表-月度资金计划查询
     */
      *searchMonthlyReportForm({searchData},{call,put,select}){
      let {list} = yield select(state => state.financeReportDetail);
      const monthlyReportForm = yield call(fundingPlanReportService.searchMonthlyReportForm, searchData);
      if (monthlyReportForm.RetCode==='1'){
        for (let i=0;i<list.length;i++){
          if(list[i].deptname===searchData.arg_ou){
            list[i].monthlyReportForm=monthlyReportForm.DataRows;
          }
        }
        yield put({
          type: 'save',
          payload:{
            list:JSON.parse(JSON.stringify(list)),
          }
        });
      }
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
          payload:{
            visible:true,
            }
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
        if (pathname === '/financeApp/funding_plan/funding_plan_finance_report/funding_plan_finance_report_detail') {
          dispatch({ type: 'init',query });
          dispatch({ type: 'initData' });
          dispatch({ type: 'setQueryData',query });
        };
      });
    },
  },
};
