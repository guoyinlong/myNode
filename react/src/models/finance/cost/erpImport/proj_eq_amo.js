/**
 * 作者：郝锐
 * 日期：2020-03-04
 * 邮件：haor@itnova.com.cn
 * 文件说明：erp成本导入-项目设备摊销
 */
import * as Serves from "../../../../services/finance/proj_eq_amo";
import Cookies from "js-cookie";

export default {
  namespace: 'proj_eq_amo',
  state: {
    list:[],
    ou_list: [],
    ou: '',
    total_year: '',
    total_month: '',
    proj_eq_amo_sum:[]
  },
  reducers: {
    initData(state){
      return {
        ...state,
        list: [],
        ou_list: [],
        ou: Cookies.get('OU'),
        total_year: '',
        total_month: '',
        proj_eq_amo_sum:[]
      }
    },
    save(state,action) {
      return { ...state,...action.payload};
    },
  },
  effects: {
    //用户角色查询
    * user_type_query({ }, { call, put, select }) {
      const obj = {
        argtenantid: Cookies.get('tenantid'),
        argrouterurl: '/proj_eq_amo',
        arguserid: Cookies.get('userid')
      }
      const data = yield call(Serves.p_userhasmodule, obj)
      if (data.RetCode === '1') {
        const { moduleid } = data
        const obj1 = {
          argtenantid: Cookies.get('tenantid'),
          arguserid: Cookies.get('userid'),
          argmoduleid: moduleid,
          argvgtype: '2'
        }
        // ou列表查询
        const data1 = yield call(Serves.p_usergetouordeptinmodule, obj1)
        if (data1.RetCode === '1') {
          if (data1.DataRows.length) {
            data1.DataRows.length === 1 ?
              yield put({ type: 'save', payload: { ou_list: data1.DataRows, ou_name: data1.DataRows[0].dept_name } })
              :
              yield put({ type: 'save', payload: { ou_list: data1.DataRows, ou_name: 'all' } })
          }
        }
      }

      const obj3 = {
        argou: Cookies.get('OU')
      }
      //获取最近有权限年月
      const data2 = yield call(Serves.search_amo_last_year_month, obj3)
      if (data2.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            total_month: data2.DataRows[0].total_month,
            total_year: data2.DataRows[0].total_year
          }
        })
      }
      yield put({ type: 'proj_amo_query' })
    },
    //查询
    *proj_amo_query({},{call,put,select}){
      let obj = {
        arg_ou_name: yield select(state=>state.proj_eq_amo.ou),
        arg_year: yield select(state=>state.proj_eq_amo.total_year),
        arg_month: yield select(state=>state.proj_eq_amo.total_month)

      }
      console.log(111)
      const data = yield call(Serves.proj_amo_query,obj)
      if (data.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            list: data.DataRows,
            proj_eq_amo_sum: data.DataRows1
          }
        })
      }
    },
    *days_change({current},{call,put}){
      yield put({
        type: 'save',
        payload: {
          total_month: current.split('-')[1],
          total_year: current.split('-')[0],
        }
      })
      yield put({
        type: 'proj_amo_query'
      })
    },
    // ou改变时进行查询
    *ou_change({ou},{call,put}){
      yield put({
        type: 'save',
        payload: {
          ou: ou
        }
      })
      yield put({
        type:'proj_amo_query'
      })
    },
    *proj_eq_amo_sync({},{call,put,select}){
      let obj = {
        arg_ou_name: yield select(state=>state.proj_eq_amo.ou),
        arg_year: yield select(state=>state.proj_eq_amo.total_year),
        arg_month: yield select(state=>state.proj_eq_amo.total_month)
      }
      const data = yield call(Serves.proj_amo_generate,obj)
      if (data.RetCode === '1'){
        yield put({ type: 'proj_amo_query' })
      }
    },
    *proj_eq_amo_release({}, { put,call,select }) {
      const obj = {
        arg_ou_name: yield select(state=>state.proj_eq_amo.ou),
        arg_year: yield select(state=>state.proj_eq_amo.total_year),
        arg_month: yield select(state=>state.proj_eq_amo.total_month)
      }
      const data = yield call(Serves.proj_amo_publish,obj)
      if (data.RetCode === '1'){
        yield put({type: 'proj_amo_query'})
      }
    },
    *delData({}, { call, put,select }) {
      const obj = {
        arg_ou_name: yield select(state=>state.proj_eq_amo.ou),
        arg_year: yield select(state=>state.proj_eq_amo.total_year),
        arg_month: yield select(state=>state.proj_eq_amo.total_month)
      }
      const data = yield call(Serves.proj_amo_cancel,obj)
      if (data.RetCode === '1'){}
        yield put({type: 'proj_amo_query'})
    },
    * get_total_month({},{put,call,select}){
      let obj = {
        arg_ou_name: Cookies.get('ou'),
      }
      const data = yield call(Serves.proj_amo_query,obj)
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {

      return history.listen(({ pathname,query }) => {
        if (pathname === '/financeApp/cost_erp_fileupload/proj_eq_amo') {
          dispatch({ type: 'user_type_query' });
          dispatch({ type: 'initData',query });
        }
      });

    },
  }
}
