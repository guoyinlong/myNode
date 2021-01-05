/**
 * 作者：郝锐
 * 日期：2017-11-11
 * 邮件：haor@itnova.com.cn
 * 文件说明：部门预算完成情况
 */
import Cookies from 'js-cookie'
import * as Servers from '../../../../services/finance/detp_full_cost_mgt'
const config = {
  COST_DEPT_FULL: '/dept_full_cost_mgt'
}
export default {
  namespace: 'FeptFullCostMgt',
  state: {
    dept_list: [],
    statistical_type_code: '2',
    total_month: '',
    total_year: '',
    start_year: '',
    start_month: '',
    end_year: '',
    end_month: '',
    dept_name: '',
    completionOfDepartmentTravelBudget: [],
    completionOfDepartmentTravelBudgetInfo: [],
    v_loading: true,
    modal_loading: true,
    travelFeeAllBudget: '',
    travelFeeAllReal: '',
    travelFeeAllPerc: ''

  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  },
  effects: {
    //用户角色查询
    * user_type_query({ }, { call, put, select }) {
      const obj = {
        argtenantid: Cookies.get('tenantid'),
        argrouterurl: config.COST_DEPT_FULL,
        arguserid: Cookies.get('userid')
      }
      const data = yield call(Servers.p_userhasmodule, obj)

      if (data.RetCode === '1') {
        const { moduleid } = data
        const obj1 = {
          argtenantid: Cookies.get('tenantid'),
          arguserid: Cookies.get('userid'),
          argmoduleid: moduleid,
          argvgtype: '1'
        }
        // 部门列表查询
        const data1 = yield call(Servers.p_usergetouordeptinmodule, obj1)
        if (data1.RetCode === '1') {
          if (data1.DataRows.length) {
            data1.DataRows.length === 1 ?
              yield put({ type: 'save', payload: { dept_list: data1.DataRows, dept_name: data1.DataRows[0].dept_name } })
              :
              yield put({ type: 'save', payload: { dept_list: data1.DataRows, dept_name: 'all' } })
          }
        }
      }

      const obj3 = {
        argou: Cookies.get('OU')
      }
      //获取最近有权限年月
      const data3 = yield call(Servers.search_last_year_month_new, obj3)
      if (data3.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            total_month: data3.DataRows[0].total_month,
            total_year: data3.DataRows[0].total_year,
            start_year: data3.DataRows[0].total_year,
            start_month: '01',
            end_year: data3.DataRows[0].total_year,
            end_month: data3.DataRows[0].total_month
          }
        })
      }
      yield put({ type: 'proj_budget_going_multiproj_dept_query' })
    },

    * statistical_type_code_change({ code }, { put, select }) {
      const { total_year, total_month } = yield select(state => (state.FeptFullCostMgt))
      let make_payload = (statistical_type_code, start_year, start_month, end_year, end_month) => {
        return {statistical_type_code, start_year, start_month, end_year,end_month}
      }
      let code1 = code === '4' ? '2' : code
      switch (code1) {
        case '2':
          yield put({
            type: 'save',
            payload: make_payload (code,total_year,'01',total_year,total_month)
          })
          yield put({ type: 'proj_budget_going_multiproj_dept_query' })
          break;
        case '3':
          yield put({
            type: 'save',
            payload: make_payload (code,'2016','01',total_year,total_month)
          })
          yield put({ type: 'proj_budget_going_multiproj_dept_query' })
          break;
        case '1':
          yield put({
            type: 'save',
            payload: make_payload (code,total_year,total_month,total_year,total_month)
          })
          yield put({ type: 'proj_budget_going_multiproj_dept_query' })
          break
      }
    },
    * startTimeChange({ current }, { put }) {
      yield put({
        type: 'save',
        payload: {
          start_year: current.slice(0, 4),
          start_month: current.slice(-2)
        }
      })
      yield put({ type: 'proj_budget_going_multiproj_dept_query' })
    },
    * endTimeChange({ current }, { put }) {
      yield put({
        type: 'save',
        payload: {
          end_year: current.slice(0, 4),
          end_month: current.slice(-2)
        }
      })
      yield put({ type: 'proj_budget_going_multiproj_dept_query' })
    },
    * deptChange({ dept_name }, { put }) {
      yield put({
        type: 'save',
        payload: {
          dept_name: dept_name
        }
      })
      yield put({ type: 'proj_budget_going_multiproj_dept_query' })
    },
    * proj_budget_going_multiproj_dept_query({ }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          v_loading: true
        }
      })
      const { start_year, start_month, end_year, end_month, dept_name, statistical_type_code } = yield select(state => state.FeptFullCostMgt)
      const obj = dept_name === 'all' ?
        {
          arg_start_year: start_year,
          arg_start_month: start_month,
          arg_end_year: end_year,
          arg_end_month: end_month,
          arg_total_type: statistical_type_code,
          arg_req_deptname: '',
          arg_myuserid: Cookies.get('userid')
        }
        :
        {
          arg_start_year: start_year,
          arg_start_month: start_month,
          arg_end_year: end_year,
          arg_end_month: end_month,
          arg_req_deptname: dept_name,
          arg_total_type: statistical_type_code,
          arg_myuserid: Cookies.get('userid')
        }
      const data = yield call(Servers.proj_budget_going_multiproj_dept_query, obj)
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            completionOfDepartmentTravelBudget: data.DataRows,
            v_loading: false
          }
        })
      }
      const data1 = yield call(Servers.all_dept_budget,obj)
      if(data1.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            travelFeeAllBudget: data1.travelFeeAllBudget,
            travelFeeAllReal: data1.travelFeeAllReal,
            travelFeeAllPerc: data1.travelFeeAllPerc
          }
        })
      }
    },
    * proj_budget_going_multiproj_dept_detail_query({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          modal_loading: true
        }
      })
      const obj = {
        arg_start_year: query.arg_start_year,
        arg_start_month: query.arg_start_month,
        arg_end_year: query.arg_end_year,
        arg_end_month: query.arg_end_month,
        arg_proj_code: query.arg_proj_code
      }
      const data = yield call(Servers.proj_budget_going_multiproj_dept_detail_query, obj)
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            completionOfDepartmentTravelBudgetInfo: data.DataRows,
            modal_loading: false
          }
        })
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {

      return history.listen(({ pathname }) => {
        if (pathname === '/financeApp/cost_proj_fullcost_mgt/dept_full_cost_mgt') {
          dispatch({ type: 'user_type_query' });
        }
      });

    },
  }
}
