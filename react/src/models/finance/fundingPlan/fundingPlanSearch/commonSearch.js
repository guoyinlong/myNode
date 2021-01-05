/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划财务查询
 */
import * as costService from '../../../../services/finance/fundingPlanSRS';
import * as service from '../../../../services/project/timeManagement';
import { message } from 'antd';
import Cookie from 'js-cookie'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default {
  namespace: 'commonSearch',
  state: {
    list:[],
    flag:'',

    ouList:[],//ou

    //财务调账用 部门列表，小组列表，科目名称
    deptInfo:[],//部门
    departInfo:[],//小组

    //外部需要用的到
    deptList:[],
    teamList:[],

    tag:'',
    //查询条件
    yearMonthBegin:moment(),
    yearMonthEnd:moment(),
    planCode:'',
    team:'',
    applyUser:'',
    dept:'',
    ou:localStorage.ou,
    //业务大类
    busId:'',
    busNameList:[],
    chartMonth: new Date().getMonth() + 1 + '',
    chartGenerateVisible: false
  },

  reducers: {
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *init({ flag }, { put,call }) {
      yield put({
        type:'save',
        payload:{
          list:[],
          flag:flag,

          //财务调账用 部门列表，小组列表，科目名称
          deptInfo:[],//部门
          departInfo:[],//小组
          ouList:[],//ou

          tag:'',
          //查询条件
          yearMonthBegin:moment(),
          yearMonthEnd:moment(),
          planCode:'',
          team:'',
          applyUser:'',
          dept:'',
          ou:localStorage.ou,
          busId:'',
          busNameList:[]
        }
      });
      //查询业务大类
      const busType = yield call(costService.getBusName);
      if(busType.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            busNameList: busType.DataRows,
          }
        });
      }
      yield put({
        type:'queryData',
      });
      if( flag === '2'){
        yield put({
          type:'GetTeamList',
          ou:Cookie.get('OU'),
          deptName:Cookie.get('deptname'),
        });
      }
      if( flag === '3'){
        const {OUID, OU} = Cookie.get();
        yield put({
          type: 'save',
          payload: {
            ouList: [
              {
                ou_id: OUID,
                ou_name: OU
              }
            ]
          }
        });
        yield put({
          type:'GetDeptList',
          ou:Cookie.get('OU'),
        });
      }
      if( flag === '4'){
        const ouList = yield call(costService.getOu);
        if(ouList.RetCode === '1'){
          yield put({
            type: 'save',
            payload:{
              ouList: ouList.DataRows,
            }
          });
        }
        yield put({
          type:'GetDeptList',
          ou:Cookie.get('OU'),
        });
      }
    },
    *queryData({}, { call, put,select }) {
      const  {flag,yearMonthBegin,yearMonthEnd,planCode,team,applyUser,dept,ou,busId} = yield select(state=>state.commonSearch);
      let postData = {};
      postData['arg_plan_year_start'] = yearMonthBegin.format('YYYY-MM').split('-')[0];
      postData['arg_plan_month_start'] = yearMonthBegin.format('YYYY-MM').split('-')[1];
      postData['arg_plan_year_end'] = yearMonthEnd.format('YYYY-MM').split('-')[0];
      postData['arg_plan_month_end'] = yearMonthEnd.format('YYYY-MM').split('-')[1];
      postData['arg_claim_no'] = planCode;
      postData['arg_bus_id'] = busId;
      if( flag === '0'){
        postData['arg_user_id'] = localStorage.userid;
        postData['arg_ou'] = localStorage.ou;
        const data = yield call(costService.personSearch,postData);
        if( data.RetCode === '1'){
          yield put({
            type: 'save',
            payload:{
              list: data.DataRows,
              //tag:Cookie.get('dept_name')+'-'+localStorage.fullName,
            }
          });
        }
      }
      if(flag === '1'){
        const data1 = yield call(costService.searchTeam,{'arg_staffid':localStorage.userid});
        if(data1.RetCode === '1'){
          postData['arg_team_id'] = data1.DataRows[0].id;
          postData['arg_apply_user_name'] = applyUser;
          postData['arg_ou'] = localStorage.ou;
          const data = yield call(costService.teamSearch,postData);
          if( data.RetCode === '1'){
            yield put({
              type: 'save',
              payload:{
                list: data.DataRows,
                //tag:Cookie.get('dept_name')+'-'+data1.DataRows[0].team_name,
              }
            });
          }
        }
      }
      if( flag === '2'){
        postData['arg_apply_user_name'] = applyUser;
        postData['arg_team_name'] = team;
        postData['arg_ou'] = localStorage.ou;
        postData['arg_dept_name'] =Cookie.get('deptname');
        const data = yield call(costService.deptSearch,postData);
        if( data.RetCode === '1'){
          yield put({
            type: 'save',
            payload:{
              list: data.DataRows,
              //tag:Cookie.get('dept_name'),
            }
          });
        }
      }
      if( flag === '3'){
        postData['arg_apply_user_name'] = applyUser;
        postData['arg_team_name'] = team;
        postData['arg_dept_name'] =dept;
        postData['arg_ou'] = localStorage.ou;
        const data = yield call(costService.financeSearch,postData);
        if( data.RetCode === '1'){
          yield put({
            type: 'save',
            payload:{
              list: data.DataRows,
              //tag:localStorage.ou,
            }
          });
        }
      }
      if( flag === '4'){
        postData['arg_apply_user_name'] = applyUser;
        postData['arg_team_name'] = team;
        postData['arg_dept_name'] =dept;
        postData['arg_ou'] = ou;
        const data = yield call(costService.financeSearch,postData);
        if( data.RetCode === '1'){
          yield put({
            type: 'save',
            payload:{
              list: data.DataRows,
              //tag:localStorage.ou,
            }
          });
        }
      }
    },

    *clearQuery({}, { call, put,select }) {
      const  {flag} = yield select(state=>state.commonSearch);
      let postData = {};
      postData['arg_plan_year_start'] = moment().format('YYYY-MM').split('-')[0];
      postData['arg_plan_month_start'] = moment().format('YYYY-MM').split('-')[1];
      postData['arg_plan_year_end'] = moment().format('YYYY-MM').split('-')[0];
      postData['arg_plan_month_end'] = moment().format('YYYY-MM').split('-')[1];
      postData['arg_claim_no'] = '';
      postData['arg_bus_id'] = '';
      if( flag === '0'){
        postData['arg_user_id'] = localStorage.userid;
        postData['arg_ou'] = localStorage.ou;
        const data = yield call(costService.personSearch,postData);
        if( data.RetCode === '1'){
          yield put({
            type: 'save',
            payload:{
              list: data.DataRows,
              //tag:Cookie.get('dept_name')+'-'+localStorage.fullName,
              busId:'',
              planCode:'',
              yearMonthBegin:moment(),
              yearMonthEnd:moment(),
            }
          });
        }
      }
      if(flag === '1'){
        const data1 = yield call(costService.searchTeam,{'arg_staffid':localStorage.userid});
        if(data1.RetCode === '1'){
          postData['arg_team_id'] = data1.DataRows[0].id;
          postData['arg_ou'] = localStorage.ou;
          postData['arg_apply_user_name'] = '';
          const data = yield call(costService.teamSearch,postData);
          if( data.RetCode === '1'){
            yield put({
              type: 'save',
              payload:{
                list: data.DataRows,
                //tag:Cookie.get('dept_name')+'-'+data1.DataRows[0].team_name,
                planCode:'',
                busId:'',
                applyUser:'',
                yearMonthBegin:moment(),
                yearMonthEnd:moment(),
              }
            });
          }
        }
      }
      if( flag === '2'){
        postData['arg_apply_user_name'] = '';
        postData['arg_team_name'] = '';
        postData['arg_ou'] = localStorage.ou;
        postData['arg_dept_name'] =Cookie.get('deptname');
        const data = yield call(costService.deptSearch,postData);
        if( data.RetCode === '1'){
          yield put({
            type: 'save',
            payload:{
              list: data.DataRows,
              //tag:Cookie.get('dept_name'),
              planCode:'',
              busId:'',
              applyUser:'',
              team:'',
              dept:'',
              yearMonthBegin:moment(),
              yearMonthEnd:moment(),
            }
          });
        }
      }
      if( flag === '3' || flag === '4'){
        postData['arg_apply_user_name'] = '';
        postData['arg_team_name'] = '';
        postData['arg_dept_name'] ='';
        postData['arg_ou'] = localStorage.ou;
        const data = yield call(costService.financeSearch,postData);
        if( data.RetCode === '1'){
          yield put({
            type: 'save',
            payload:{
              list: data.DataRows,
              //tag:localStorage.ou,
              planCode:'',
              applyUser:'',
              busId:'',
              team:'',
              dept:'',
              ou:localStorage.ou,
              yearMonthBegin:moment(),
              yearMonthEnd:moment(),
            }
          });
        }
      }
    },

    *adjustAccount({arg_pay_time, ou, arg_dept_name, arg_team_name, arg_pay_money, arg_summary,teamId,deptId},{call,put}){
      let formData = {};
      formData['arg_pay_time']=arg_pay_time.format("YYYY-MM-DD");
      formData['arg_ou']=ou;
      formData['arg_dept_name']=arg_dept_name;
      formData['arg_team_name']=arg_team_name;
      formData['arg_apply_user_name']='财务调账';
      formData['arg_create_user_id'] = localStorage.userid;
      formData['arg_pay_amount']=arg_pay_money;
      formData['arg_summary']=arg_summary;
      formData['arg_team_id']=teamId;
      formData['arg_dept_id']=deptId;
      const data = yield call(costService.adjustAccount,formData);
      if( data.RetCode === '1'){
        yield put({
          type: 'queryData',
        });
        message.info('调账成功！');
      }
    },


    //调账中需要用到的，需要根据ou查部门的时候清空部门值，ou查小组的时候清空小组值
    //根据ou查部门
    *GetDepartProjInfo({ ou },{call,put}){
      let formData = {};
      formData['arg_ou'] = ou;
      const data = yield call(costService.GetDepartProjInfo,formData);
      if( data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            deptInfo : data.DataRows,
          }
        });
      }
    },
    //部门查小组
    *GetDepartInfo({ ou , deptName },{call,put}){
      let formData = {};
      formData['arg_ou'] = ou;
      formData['arg_department'] = deptName;
      const data = yield call(costService.GetDepartInfo,formData);
      if( data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            departInfo : data.DataRows,
          }
        });
      }
    },
    *clearDeptAndTeam({ },{put}){
        yield put({
          type: 'save',
          payload:{
            deptInfo : [],
            departInfo : [],
          }
        });
    },


    //根据ou查部门
    *GetDeptList({ ou },{call,put}){
      let formData = {};
      formData['arg_ou'] = ou;
      const data = yield call(costService.GetDepartProjInfo,formData);
      if( data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            deptList : data.DataRows,
            dept:''
          }
        });
      }
    },
    //部门查小组
    *GetTeamList({ ou , deptName },{call,put}){
      let formData = {};
      formData['arg_ou'] = ou;
      formData['arg_department'] = deptName;
      const data = yield call(costService.GetDepartInfo,formData);
      if( data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            teamList : data.DataRows,
            team:''
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
    *changeStateHasService({ value,key }, { put }) {
      yield put({
        type:'GetDeptList',
        ou:value,
      });
      yield put({
        type:'save',
        payload :{
          [key]:value
        }
      })
    },
    // 财务报销生成
    * fundingExpenseGenerate({payload}, {call}) {
      const {RetCode, RetVal} = yield call(costService.funding_expense_generate, {
        arg_year: new Date().getFullYear() + '',
        arg_month: payload.arg_month
      });
      if (RetCode === '1') {
        message.success('生成成功');
      } else {
        message.error(RetVal);
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_finance_search') {
          dispatch({ type: 'init',flag : '4'});
        }
        if (pathname === '/financeApp/funding_plan/funding_plan_branch_finance_search') {
          dispatch({ type: 'init',flag : '3' });
        }
        if (pathname === '/financeApp/funding_plan/funding_plan_deptMgr_search') {
          dispatch({ type: 'init',flag : '2' });
        }
        if (pathname === '/financeApp/funding_plan/funding_plan_team_search') {
          dispatch({ type: 'init',flag : '1' });
        }
        if (pathname === '/financeApp/funding_plan/funding_plan_person_search') {
          dispatch({ type: 'init',flag : '0' });
        }
      });
    },
  },
};
