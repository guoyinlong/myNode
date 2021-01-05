/**
 * 作者：杨青
 * 日期：2018-3-6
 * 邮箱：yangq41@chinaunicom.cn
 * 文件说明：总院财务资金计划报表
 */
import * as fundingPlanReportService from '../../../../services/finance/fundingPlanReportService';
import * as costService from '../../../../services/finance/costService';
import Cookie from 'js-cookie';
export default {
  namespace: 'financeReport',
  state: {
    list:[],
    ous:[]
  },

  reducers: {
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *init({}, { call,put }) {
      const ou = Cookie.get('OU');
      let postData = {};
      postData["argtenantid"] = Cookie.get('tenantid');
      postData["arguserid"] = Cookie.get('userid');
      postData["argrouterurl"] = '/funding_plan_finance_report';
      const moduleIdData = yield call(costService.costUserHasModule,postData);
      if(moduleIdData.RetCode === '1') {
        let postData1 = {};
        postData1["argtenantid"] = Cookie.get('tenantid');
        postData1["arguserid"] = Cookie.get('userid');
        postData1["argmoduleid"] = moduleIdData.moduleid;
        postData1["argvgtype"] = '2';
        const data = yield call(costService.costUserGetOU, postData1);
        if(data.RetCode === '1'){
          let ous = data.DataRows.map(i=>i.dept_name);
          yield put({
            type: 'save',
            payload:{
              ous
            }
          });
          yield put({
            type:'query',
            searchData:{
              arg_ou: ous.length > 0 ? ous.includes(ou) ? ou : ous[0] : ou,
            },
          });
        }
      }
    },
    /**
     * 作者：杨青
     * 创建日期：2018-03-14
     * 功能：查询
     */
    *query({searchData},{call,put}){
      const batchType = yield call(fundingPlanReportService.searchBatchType, searchData);
      if (batchType.DataRows.length!==0){
        let reportType = batchType.DataRows[0].report_type?batchType.DataRows[0].report_type:'1';//填报批次
        let batchNum = batchType.DataRows[0].batch_number;//批次号
        let time = batchType.DataRows[0].plan_year_month;
        let year = time.split("-")[0];
        let month = parseInt(time.split("-")[1]);
        //资金计划ou生成情况
        yield put({
          type:'queryOUFundingPlan',
          searchData:{
            arg_ou:searchData.arg_ou,
            arg_report_type:reportType,
            arg_batch_number:batchNum,
            arg_planYear:year,
            arg_planMonth:month,
          },
        });
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
        if (searchData.arg_ou==='联通软件研究院'||searchData.arg_ou==='联通软件研究院本部'){
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

      } else {
        yield put({
          type: 'save',
          payload:{
            list:[],
            year:searchData.arg_planYear,
            month:(searchData.arg_planMonth).toString(),
            ou:searchData.arg_ou,
            reportType:searchData.arg_reportType,
            RetVal:'',
          }
        });
      }
    },
    /**
     * 作者：杨青
     * 创建日期：2018-03-14
     * 功能：资金计划ou生成情况
     */
    *queryOUFundingPlan({searchData},{call,put}){
      const OUFundsPlan = yield call(fundingPlanReportService.queryOUFundingPlan,searchData);
      if (OUFundsPlan.RetCode==='1'){
        yield put({
          type: 'save',
          payload:{
            list: OUFundsPlan.DataRows,
            year:searchData.arg_planYear,
            month:(searchData.arg_planMonth).toString(),
            ou:searchData.arg_ou,
            reportType:searchData.arg_report_type,
            generateState:OUFundsPlan.DataRows[0].flag_ou,
            batchNum:searchData.arg_batch_number,
            RetVal:'',
          }
        });
      } else {
        yield put({
          type: 'save',
          payload:{
            list: [],
            year:searchData.arg_planYear,
            month:searchData.arg_planMonth,
            ou:searchData.arg_ou,
            reportType:searchData.arg_report_type,
            batchNum:searchData.arg_batch_number,
            RetVal:'',
          }
        });
      }
    },
    /**
     * 作者：杨青
     * 创建日期：2018-03-14
     * 功能：获取资金计划追加明细表
     */
    *queryAddJect({searchData},{call,put}){
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
      yield put({
        type: 'save',
        payload:{
          addJectData:addJectData,
        }
      });
    },
    /**
     * 作者：杨青
     * 创建日期：2018-04-16
     * 功能：月度资金计划审批表
     */
    *queryMonthlyApprovalForm({searchData},{call,put}){
      const monthlyApprovalForm = yield call(fundingPlanReportService.queryMonthlyApprovalForm, searchData);
      yield put({
        type: 'save',
        payload:{
          monthlyApprovalForm:monthlyApprovalForm.DataRows,
        }
      });
    },
    /**
     * 作者：杨青
     * 创建日期：2018-04-16
     * 功能：资金计划capex查询
     */
    *queryOUCAPEX({searchData},{call,put}){
      const queryOUCAPEX = yield call(fundingPlanReportService.queryOUCAPEX, searchData);
      yield put({
        type: 'save',
        payload:{
          queryOUCAPEX:queryOUCAPEX.DataRows,
        }
      });
    },
    /**
     * 作者：杨青
     * 创建日期：2018-04-16
     * 功能：资金计划以前年度应付费查询
     */
    *queryPreviousYears({searchData},{call,put}){
      const previousYears = yield call(fundingPlanReportService.queryPreviousYears, searchData);
      yield put({
        type: 'save',
        payload:{
          previousYears:previousYears.DataRows,
        }
      });
    },
    /**
     * 作者：杨青
     * 创建日期：2018-03-14
     * 功能：资金计划报表-月度资金计划查询
     */
    *searchMonthlyReportForm({searchData},{call,put}){
      const monthlyReportForm = yield call(fundingPlanReportService.searchMonthlyReportForm, searchData);
      if (monthlyReportForm.RetCode==='1'){
        yield put({
          type: 'save',
          payload:{
            monthlyReportForm:monthlyReportForm.DataRows,
          }
        });
      } else {
        yield put({
          type: 'save',
          payload:{
            monthlyReportForm:[],
          }
        });
      }
    },
    /**
     * 作者：杨青
     * 创建日期：2018-03-14
     * 功能：生成数据
     */
    *generateOU({data},{put,call}){
      let retCode;
      if (data.arg_ou==='联通软件研究院'){
        retCode = yield call(fundingPlanReportService.generateAllOU,data);
      }else{
        retCode = yield call(fundingPlanReportService.generateOU,data);
      }
      if(retCode.RetCode==='1') {
        let searchData = {};
        searchData['arg_ou'] = data.arg_ou;
        searchData['arg_reportType'] = data.arg_report_type;
        searchData['arg_planYear'] = data.arg_planYear;
        searchData['arg_planMonth'] = data.arg_planMonth;
        yield put({
          type: 'query',
          searchData: searchData,
        });
      }else {
        yield put({
          type: 'save',
          payload:{
            RetVal:retCode.RetVal,
          }
        });
      }
    },
    /**
     * 作者：杨青
     * 创建日期：2018-03-14
     * 功能：撤销数据
     */
    *deleteReportForm({data},{put,call}){
      const retCode = yield call(fundingPlanReportService.undoAllOU,data);
      if(retCode.RetCode==='1'){
        let searchData = {};
        searchData['arg_ou']=data.arg_ou;
        searchData['arg_reportType']=data.arg_report_type;
        searchData['arg_planYear']=data.arg_planYear;
        searchData['arg_planMonth']=data.arg_planMonth;
        yield put({
          type:'query',
          searchData:searchData,
        });
      }else {
        yield put({
          type: 'save',
          payload:{
            RetVal:retCode.RetVal,
          }
        });
      }
    },
    /**
     * 作者：杨青
     * 创建日期：2018-03-14
     * 功能：还原查询条件的值
     */
    *returnToListSearch({query}, { call, put }) {
      query.payload = JSON.parse(query.payload);
      yield put({ type: 'query', searchData:{...query.payload}
      });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_finance_report') {
          //dispatch({ type: 'init',query });
          if(JSON.stringify(query) === '{}'){
            dispatch({type: 'init'});
          }else{
            dispatch({type: 'returnToListSearch',query});
          }
        }
      });
    },
  },
};
