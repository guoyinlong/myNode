/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划个人查询
 */
import * as costService from '../../../../services/finance/fundingPlanSRS';
import * as fundingPlanFillService from '../../../../services/finance/fundingPlanFillService';
import Cookie from 'js-cookie';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default {
  namespace: 'fundingPlanQuery',
  state: {
    list:[],
    oldList:[],

    feeList:[],

    canApplyUserList:[], //小组内有哪些人
    teamList:[],

    teamId:'',//小组查询时，需要先通过user查询小组的id

    beginPlanTime:moment(),
    endPlanTime:moment(),
    planType:'',
    feeName:'',
    applyUser:'',
    team:'',

    beginPlanTimeOld:moment(),
    endPlanTimeOld:moment(),
    planTypeOld:'',
    feeNameOld:'',
    applyUserOld:'',
    teamOld:'',
    flag:''

  },

  reducers: {
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *init({flag}, { put,call }) { //flag 1 个人 2是小组 3是部门
      yield put({
        type:'save',
        payload:{
          list:[],
          oldList:[],
          feeList:[],
          canApplyUserList:[], //小组内有哪些人
          deptUserList:[],//部门内有哪些人
          teamList:[],

          teamId:'',//小组查询时，需要先通过user查询小组的id

          beginPlanTime:moment(),
          endPlanTime:moment(),
          planType:'',
          feeName:'',
          applyUser:'',
          team:'',

          beginPlanTimeOld:moment(),
          endPlanTimeOld:moment(),
          planTypeOld:'',
          feeNameOld:'',
          applyUserOld:'',
          teamOld:'',
          flag:flag,
        }
      });
      //获取科目名称列表
      let feeListData = yield call(fundingPlanFillService.getFeeList);
      //DataRows1 : 一级和二级科目列表，有主子关系 变成树形组件想要的格式
      if (feeListData.RetCode === '1') {
        let feeListTree = [];
        if ('DataRows1' in feeListData && feeListData.DataRows1.length > 0) {
          for (let i = 0; i < feeListData.DataRows1.length; i++) {
            let obj = {};
            obj.label = feeListData.DataRows1[i].fee_name;
            obj.value = feeListData.DataRows1[i].uuid;
            obj.key = feeListData.DataRows1[i].uuid;
            obj.children = [];
            let children = [];
            if ('childRows' in feeListData.DataRows1[i]) {
              children = JSON.parse(feeListData.DataRows1[i].childRows);
            }
            if (children.length > 0) {
              obj.selectable = false;    //如果有二级目录，则一级目录不可选，如果没有，则一级可用
            }
            for (let j = 0; j < children.length; j++) {
              obj.children.push({
                label:children[j].fee_name,
                value:children[j].child_uuid,
                key:children[j].child_uuid,
                flag:children[j].fee_flag
              });
            }
            feeListTree.push(obj);
          }
        }
        yield put({
          type:'save',
          payload:{
            feeList:feeListTree
          }
        });
      }
      if(flag === '1'){
        yield put({
          type: 'query',
        });
      }else if(flag === '2'){//如果是部门需要查询小组，并且获取小组内人员名单
        //资金类型为“他购”时，获取可填报申请人名单
        const canApplyUserData = yield call(fundingPlanFillService.getTeamMembers, {arg_userid: Cookie.get('userid')});
        const data = yield call(costService.searchTeam,{arg_staffid: Cookie.get('userid')});
        if(data.RetCode === '1' && canApplyUserData.RetCode === '1' ){
          yield put({
            type: 'save',
            payload:{
              teamId:data.DataRows[0].id,
              canApplyUserList:canApplyUserData.DataRows,
            }
          });
          yield put({
            type: 'query',
          });
        }
      }else if( flag === '3'){ //部门管理员需要查询部门内有哪些人,以及部门有哪些小组
        let formData = {};
        formData['arg_ou'] = localStorage.ou;
        formData['arg_department'] = Cookie.get('deptname');
        const data = yield call(costService.GetDepartInfo,formData);
        if( data.RetCode === '1'){
          yield put({
            type: 'save',
            payload:{
              teamList : data.DataRows,
            }
          });
        }
        const deptUserList = yield call(fundingPlanFillService.getTeamMembers, {arg_userid: Cookie.get('userid')});
        if(data.RetCode === '1' && deptUserList.RetCode === '1' ){
          yield put({
            type: 'save',
            payload:{
              canApplyUserList:deptUserList.DataRows,
            }
          });
          yield put({
            type: 'query',
          });
        }
      }
    },
    *query({},{call,put,select}){
      const {flag,beginPlanTime,endPlanTime,feeName,planType,applyUser,team,teamId} = yield select(state=>state.fundingPlanQuery);
      let postData = {};
      postData['arg_plan_year_start'] = beginPlanTime.format('YYYY-MM').split('-')[0];
      postData['arg_plan_month_start'] = beginPlanTime.format('YYYY-MM').split('-')[1];
      postData['arg_plan_year_end'] = endPlanTime.format('YYYY-MM').split('-')[0];
      postData['arg_plan_month_end'] = endPlanTime.format('YYYY-MM').split('-')[1];
      postData['arg_funds_type'] = planType;
      postData['arg_subject_id'] = feeName;
      postData['arg_is_pre_year_funds'] = '2';
      if(flag === '1'){
        postData['arg_apply_user_id'] = localStorage.userid;
        postData['arg_apply_user_name'] = Cookie.get('username');
      }else if(flag === '2'){
        postData['arg_team_id'] = teamId;
        postData['arg_apply_user_name'] = applyUser;
      }else if( flag === '3'){
        postData['arg_dept_name'] = Cookie.get('deptname');
        postData['arg_team_id'] = team;
        postData['arg_apply_user_name'] = applyUser;
      }
      const data = yield call(costService.queryFundsBudgetRecordDetailList,postData);
      if( data.RetCode === '1'){
        for( let i=0;i<data.DataRows.length-1;i++){
          data.DataRows[i].index_num = i+1;
        }
        yield put({
          type: 'save',
          payload:{
            list:data.DataRows
          }
        });
      }
    },
    *queryOld({},{call,put,select}){
      const {flag,beginPlanTimeOld,endPlanTimeOld,feeNameOld,planTypeOld,applyUserOld,teamOld,teamId} = yield select(state=>state.fundingPlanQuery);
      let postData = {};
      postData['arg_plan_year_start'] = beginPlanTimeOld.format('YYYY-MM').split('-')[0];
      postData['arg_plan_month_start'] = beginPlanTimeOld.format('YYYY-MM').split('-')[1];
      postData['arg_plan_year_end'] = endPlanTimeOld.format('YYYY-MM').split('-')[0];
      postData['arg_plan_month_end'] = endPlanTimeOld.format('YYYY-MM').split('-')[1];
      postData['arg_funds_type'] = planTypeOld;
      postData['arg_subject_id'] = feeNameOld;
      postData['arg_is_pre_year_funds'] = '1';
      if(flag === '1'){
        postData['arg_apply_user_id'] = localStorage.userid;
        postData['arg_apply_user_name'] = Cookie.get('username');
      }else if(flag === '2'){
        postData['arg_team_id'] = teamId;
        postData['arg_apply_user_name'] = applyUserOld;
      }else if( flag === '3'){
        postData['arg_dept_name'] = Cookie.get('deptname');
        postData['arg_team_id'] = teamOld;
        postData['arg_apply_user_name'] = applyUserOld;
      }
      const data = yield call(costService.queryFundsBudgetRecordDetailList,postData);
      if( data.RetCode === '1'){
        for( let i=0;i<data.DataRows.length-1;i++){
          data.DataRows[i].index_num = i+1;
        }
        yield put({
          type: 'save',
          payload:{
            oldList:  data.DataRows,
          }
        });
      }
    },

    *clearQuery({},{call,put,select}){
      const {flag,teamId} = yield select(state=>state.fundingPlanQuery);
      let postData = {};
      postData['arg_plan_year_start'] = moment().format('YYYY-MM').split('-')[0];
      postData['arg_plan_month_start'] = moment().format('YYYY-MM').split('-')[1];
      postData['arg_plan_year_end'] = moment().format('YYYY-MM').split('-')[0];
      postData['arg_plan_month_end'] = moment().format('YYYY-MM').split('-')[1];
      postData['arg_is_pre_year_funds'] = '2';
      if(flag === '1'){
        postData['arg_apply_user_id'] = localStorage.userid;
        postData['arg_apply_user_name'] = Cookie.get('username');
      }else if(flag === '2'){
        postData['arg_team_id'] = teamId;
      }else if( flag === '3'){
        postData['arg_dept_name'] = Cookie.get('deptname');
      }
      const data = yield call(costService.queryFundsBudgetRecordDetailList,postData);
      if( data.RetCode === '1'){
        for( let i=0;i<data.DataRows.length-1;i++){
          data.DataRows[i].index_num = i+1;
        }
        yield put({
          type: 'save',
          payload:{
            list:  data.DataRows,
            beginPlanTime:moment(),
            endPlanTime:moment(),
            planType:'',
            feeName:'',
            applyUser:'',
            team:'',
          }
        });
      }
    },
    *clearQueryOld({},{call,put,select}){
      const {flag,teamId} = yield select(state=>state.fundingPlanQuery);
      let postData = {};
      postData['arg_plan_year_start'] = moment().format('YYYY-MM').split('-')[0];
      postData['arg_plan_month_start'] = moment().format('YYYY-MM').split('-')[1];
      postData['arg_plan_year_end'] = moment().format('YYYY-MM').split('-')[0];
      postData['arg_plan_month_end'] = moment().format('YYYY-MM').split('-')[1];
      postData['arg_is_pre_year_funds'] = '1';
      if(flag === '1'){
        postData['arg_apply_user_id'] = localStorage.userid;
        postData['arg_apply_user_name'] = Cookie.get('username');
      }else if(flag === '2'){
        postData['arg_team_id'] = teamId;
      }else if( flag === '3'){
        postData['arg_dept_name'] = Cookie.get('deptname');
      }
      const data = yield call(costService.queryFundsBudgetRecordDetailList,postData);
      if( data.RetCode === '1'){
        for( let i=0;i<data.DataRows.length-1;i++){
          data.DataRows[i].index_num = i+1;
        }
        yield put({
          type: 'save',
          payload:{
            oldList:  data.DataRows,
            beginPlanTimeOld:moment(),
            endPlanTimeOld:moment(),
            planTypeOld:'',
            feeNameOld:'',
            applyUserOld:'',
            teamOld:'',
          }
        });
      }
    },
    *changeState({ arg }, { put }) {
      let temp={};
      if(arg.length%2 !==0) return message.info('参数传递错误');
      for(let i=0;i<arg.length;i=i+2){
        temp[arg[i+1]] = arg[i]
      }
      yield put({
        type:'save',
        payload :temp
      })
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_budget_person_query') {
          let flag ='1';
          dispatch({ type: 'init',flag });
        }
        if (pathname === '/financeApp/funding_plan/funding_plan_budget_team_query') {
          let flag = '2';
          dispatch({ type: 'init',flag });
        }
        if (pathname === '/financeApp/funding_plan/funding_plan_budget_deptMgr_query') {
          let flag ='3';
          dispatch({ type: 'init',flag });
        }
      });
    },
  },
};
