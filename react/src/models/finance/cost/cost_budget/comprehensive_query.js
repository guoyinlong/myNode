/**
 * 作者：郝锐
 * 日期：2020/09/16
 * 邮件：haor@itnova.com.cn
 * 文件说明：全成本综合查询
 */
import * as Serves from '../../../../services/finance/comprehensive_query'
import Cookies from "js-cookie";
import * as Servers from "../../../../services/finance/detp_full_cost_mgt";
import {message} from 'antd';

export default {
  namespace: 'comprehensive_query',
  state: {
    dept: '',
    ou: '',
    deptList: [],
    ouList: [],
    query_period: '2',
    query_content: '部门全成本',
    total_month: '',
    total_year: '',
    start_year: '',
    start_month: '',
    end_year: '',
    end_month: '',
    dept_dataSource: [],
    v_loading: false,
    fee: [],
    chartList: [],
    feeList: [],
    FeeCompletionRate: [],
    budget_fee_year: [],
    proj_dataSource: [],
    proj_type_list: [],
    form_proj_name: '',
    form_proj_code: '',
    form_mgr_name: '',
    chart_show: true
  },
  reducers: {
    initData(state) {
      return {
        ...state,
        dept: '',
        ou: '',
        deptList: [],
        ouList: [],
        query_period: '2',
        query_content: '部门全成本',
        total_month: '',
        total_year: '',
        start_year: '',
        start_month: '',
        end_year: '',
        end_month: '',
        dept_dataSource: [],
        fee: [],
        chartList: [],
        feeList: [],
        FeeCompletionRate: [],
        budget_fee_year: [],
        proj_dataSource: [],
        proj_type_list: [],
        form_proj_name: '',
        form_proj_code: '',
        form_mgr_name: '',
        chart_show: true
      }
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  },
  effects: {
    // 虚拟组织查询
    * user_type_query({query}, {call, put, select}) {
      let history_param = false
      if (Object.keys(query).length) {
        history_param = JSON.parse(query.history_param)
      }
      const obj = {
        argtenantid: Cookies.get('tenantid'),
        argrouterurl: '/comprehensive_query',
        arguserid: Cookies.get('userid')
      }
      const data = yield call(Servers.p_userhasmodule, obj)

      if (data.RetCode === '1') {
        const {moduleid} = data
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
            history_param ?
              yield put({type: 'save', payload: {deptList: data1.DataRows, dept: history_param.dept}})
              : data1.DataRows.length === 1 ?
              yield put({
                type: 'save',
                payload: {deptList: data1.DataRows, dept: data1.DataRows[0].dept_name.split('-')[1]}
              })
              :
              yield put({type: 'save', payload: {deptList: data1.DataRows, dept: '全部'}})
          }
        }
        // ou列表查询
        const obj2 = {
          argtenantid: Cookies.get('tenantid'),
          arguserid: Cookies.get('userid'),
          argmoduleid: moduleid,
          argvgtype: '2'
        }
        const data2 = yield call(Servers.p_usergetouordeptinmodule, obj2)
        if (data2.RetCode === '1') {
          if (data2.DataRows.length) {
            history_param ?
              yield put({type: 'save', payload: {ouList: data2.DataRows, ou: history_param.ou}})
              : data2.DataRows.length === 1 ?
              yield put({
                type: 'save',
                payload: {ouList: data2.DataRows, ou: data2.DataRows[0].dept_name}
              })
              :
              yield put({type: 'save', payload: {ouList: data2.DataRows, ou: '联通软件研究院'}})
          }
        }
      }

      const obj3 = {
        argou: Cookies.get('OU')
      }
      //获取最近有权限年月
      const data3 = yield call(Servers.search_last_year_month_new, obj3)
      if (data3.RetCode === '1') {
        history_param ?
          yield put({
            type: 'save',
            payload: {
              total_month: data3.DataRows[0].total_month,
              total_year: data3.DataRows[0].total_year,
              start_year: history_param.start_year,
              start_month: history_param.start_month,
              end_year: history_param.end_year,
              end_month: history_param.end_month
            }
          })
          : yield put({
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
      if (history_param) {
        yield put({
          type: 'save',
          payload: {
            query_content: history_param.query_content,
            query_period: history_param.query_period
          }
        })
        if (history_param.queryContent === '部门全成本') {
          yield put({type: 'deptTotalCost'})
          yield put({type: 'ChartDataQuery'})
        } else {
          yield put({type: 'projectTotalCost'})
        }
      } else {
        yield put({type: 'deptTotalCost'})
        yield put({type: 'ChartDataQuery'})
      }
    },
    //项目全成本查询
    * projectTotalCost({}, {call, put, select}) {
      yield put({
        type: 'save',
        payload: {
          v_loading: true
        }
      })
      const {start_year, start_month, end_year, end_month, query_period, dept, ou, form_proj_name, form_proj_code, form_mgr_name} = yield select(state => state.comprehensive_query)
      const postData = {
        arg_start_year: start_year,
        arg_start_month: start_month,
        arg_end_year: end_year,
        arg_end_month: end_month,
        arg_total_type: query_period,
        arg_dept_name: dept,
        arg_ou: ou,
        arg_proj_code: form_proj_code,
        arg_proj_name: form_proj_name,
        arg_mgr_name: form_mgr_name
      }
      const data = yield call(Serves.projectTotalCost, postData)
      const data1 = yield call(Serves.projTypeListQuery, postData)
      if (data.RetCode === '1') {
        data.DataRows.map((item,index) => item.key = index)
        yield put({
          type: 'save',
          payload: {
            proj_dataSource: data.DataRows
          }
        })
      } else {
        yield put({
          type: 'save',
          payload: {
            proj_dataSource: []
          }
        })
      }
      if (data1.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            proj_type_list: data1.DataRows
          }
        })
      } else {
        yield put({
          type: 'save',
          payload: {
            proj_type_list: []
          }
        })
      }
      yield put({
        type: 'save',
        payload: {
          v_loading: false
        }
      })
    },
    // 部门全成本查询
    * deptTotalCost({}, {call, put, select}) {
      yield put({
        type: 'save',
        payload: {
          v_loading: true
        }
      })
      const postData = {
        arg_start_year: yield select(state => state.comprehensive_query.start_year),
        arg_start_month: yield select(state => state.comprehensive_query.start_month),
        arg_end_year: yield select(state => state.comprehensive_query.end_year),
        arg_end_month: yield select(state => state.comprehensive_query.end_month),
        arg_total_type: yield select(state => state.comprehensive_query.query_period),
        arg_dept_name: yield select(state => state.comprehensive_query.dept),
        arg_ou: yield select(state => state.comprehensive_query.ou),
      }
      const data = yield call(Serves.deptTotalCost, postData)
      if (data.RetCode === '1') {
        data.DataRows.map((item, index) => {
          item.key = index + 1
          if (item.children) {
            item.children = JSON.parse(item.children)
            item.children.map((item1, index1) => {
              item1.key = `${index + 1}${index1 + 1}`
            })
          }
        })
        yield put({
          type: 'save',
          payload: {
            dept_dataSource: data.DataRows
          }
        })
      } else {
        yield put({
          type: 'save',
          payload: {
            dept_dataSource: []
          }
        })
      }
      yield put({
        type: 'save',
        payload: {
          v_loading: false
        }
      })
    },
    // 图表数据查询
    * ChartDataQuery({}, {call, put, select}) {
      const {ou, dept, start_year, start_month, end_year, end_month, query_period} = yield select(state => state.comprehensive_query)
      const postData = {
        arg_start_year: start_year,
        arg_start_month: start_month,
        arg_end_year: end_year,
        arg_end_month: end_month,
        arg_total_type: query_period,
        arg_dept_name: dept,
        arg_ou: ou,
      }
      const data = yield call(Serves.deptTotalCostChart, postData)
      const fee = []
      const feeList = []
      const chartList = []
      const FeeCompletionRate = []
      const budget_fee_year = []
      if (data.RetCode === '1') {
        if (dept === '全部' && ou !== '联通软件研究院') {
          data.DataRows.map((item, index) => {
            const dept_name = item.pu_dept_name.split('-')[1]
            chartList.push(dept_name)
            feeList.push(item.fee)
            fee.push({value: item.fee, name: dept_name})
            FeeCompletionRate.push(item.FeeCompletionRate.slice(0, item.FeeCompletionRate.length - 1))
            budget_fee_year.push(item.budget_fee_year)
          })
        } else if (dept !== '全部' && ou === '联通软件研究院') {
          data.DataRows.map((item, index) => {
            chartList.push(item.ou)
            feeList.push(item.fee)
            fee.push({value: item.fee, name: item.ou})
            FeeCompletionRate.push(item.FeeCompletionRate.slice(0, item.FeeCompletionRate.length - 1))
            budget_fee_year.push(item.budget_fee_year)
          })
        } else {
          data.DataRows.map((item, index) => {
            switch (item.fee_name) {
              case '预计工时（小时）':
                fee.push({value: item.fee, name: '工作量'})
                chartList.push('工作量')
                break;
              case ' (二) 项目实施成本':
                fee.push({value: item.fee, name: '一、实施成本'})
                chartList.push('一、实施成本')
                break;
              case '   项目人工成本（元）':
                fee.push({value: item.fee, name: '二、人工成本'})
                chartList.push('二、人工成本')
                break;
              case '二、项目分摊成本':
                fee.push({value: item.fee, name: '三、分摊成本'})
                chartList.push('三、分摊成本')
                break;
              case ' (一) 项目采购成本':
                fee.push({value: item.fee, name: '四、采购成本'})
                chartList.push('四、采购成本')
                break;
              default:
                fee.push({value: item.fee, name: item.fee_name})
                chartList.push(item.fee_name)
            }
            feeList.push(item.fee)
            FeeCompletionRate.push(item.FeeCompletionRate.slice(0, item.FeeCompletionRate.length - 1))
            budget_fee_year.push(item.budget_fee_year)
          })
        }
        yield put({
          type: 'save',
          payload: {
            fee,
            chartList,
            feeList,
            FeeCompletionRate,
            budget_fee_year,
            chart_show: true
          }
        })
      } else {
        yield put({
          type: 'save',
          payload: {
            chart_show: false,
            fee: [],
            chartList: [],
            feeList: [],
            FeeCompletionRate: [],
            budget_fee_year: [],
          }
        })
      }
    },
    // ou变更
    * ouChange({query}, {put, call, select}) {
      yield put({
        type: 'save',
        payload: {
          ou: query.ou
        }
      })

      yield put({type: 'data_query'})
    },
    // 部门变更
    * deptChange({query}, {put}) {
      yield put({
        type: 'save',
        payload: {
          dept: query.dept
        }
      })
      yield put({type: 'data_query'})
    },
    // 统计类型变更
    * queryPeriodChange({query}, {put, select}) {
      const {queryPeriod} = query
      if (queryPeriod === '2') {
        yield put({
          type: 'save',
          payload: {
            start_year: yield select(state => state.comprehensive_query.total_year),
            start_month: '01',
            end_year: yield select(state => state.comprehensive_query.total_year),
            end_month: yield select(state => state.comprehensive_query.total_month)
          }
        })
      } else if (queryPeriod === '1') {
        yield put({
          type: 'save',
          payload: {
            start_year: yield select(state => state.comprehensive_query.total_year),
            start_month: yield select(state => state.comprehensive_query.total_month),
            end_year: yield select(state => state.comprehensive_query.total_year),
            end_month: yield select(state => state.comprehensive_query.total_month)
          }
        })
      } else if (queryPeriod === '3') {
        yield put({
          type: 'save',
          payload: {
            start_year: '2016',
            start_month: '01',
            end_year: yield select(state => state.comprehensive_query.total_year),
            end_month: yield select(state => state.comprehensive_query.total_month)
          }
        })
      } else if (queryPeriod === '4') {
        yield put({
          type: 'save',
          payload: {
            start_year: yield select(state => state.comprehensive_query.total_year),
            start_month: '01',
            end_year: yield select(state => state.comprehensive_query.total_year),
            end_month: yield select(state => state.comprehensive_query.total_month)
          }
        })
      }
      yield put({
        type: 'save',
        payload: {
          query_period: query.queryPeriod
        }
      })
      yield put({type: 'data_query'})
    },
    // 查询内容变更
    * queryContentChange({query}, {put}) {
      yield put({
        type: 'save',
        payload: {
          query_content: query.queryContent
        }
      })
      yield put({type: 'data_query'})
    },
    // 查询分类
    * data_query({}, {put, select}) {
      yield put({
        type: 'save',
        payload: {
          query_loading: true
        }
      })
      const {query_content} = yield select(state => state.comprehensive_query)
      if (query_content === '部门全成本') {
        yield put({type: 'deptTotalCost'})
        yield put({type: 'ChartDataQuery'})
      } else if (query_content === '项目全成本') {
        yield put({type: 'projectTotalCost'})
      }
      yield put({
        type: 'save',
        payload: {
          query_loading: false
        }
      })
    },
    * ChartClick({query}, {put}) {
      // const { start_year, start_month, end_year, end_month } = yield select(state => state.comprehensive_query)
      const {ou, dept} = query
      yield put({type: 'save', payload: {ou, dept, query_content: '项目全成本'}})
      yield put({type: 'projectTotalCost'})
    },
    // 开始时间变更
    * startTimeChange({current}, {put}) {
      yield put({
        type: 'save',
        payload: {
          start_year: current.slice(0, 4),
          start_month: current.slice(-2)
        }
      })
      yield put({type: 'data_query'})
    },
    // 结束时间变更
    * endTimeChange({current}, {put}) {
      yield put({
        type: 'save',
        payload: {
          end_year: current.slice(0, 4),
          end_month: current.slice(-2)
        }
      })
      yield put({type: 'data_query'})
    },
    * filter_change({query}, {put}) {
      yield put({
        type: 'save',
        payload: {
          [query.name]: query.value
        }
      })
      yield put({
        type: 'projectTotalCost'
      })
    },
    // 项目类型查询
    // *projTypeListQuery({ }, { call, put }) {
    //   const { start_year, start_month, end_year, end_month, dept, ou } = yield select(state => state.comprehensive_query)
    //   const postData = {
    //     arg_start_year: start_year,
    //     arg_start_month: start_month,
    //     arg_end_year: end_year,
    //     arg_end_month: end_month,
    //     arg_dept_name: dept,
    //     arg_ou: ou,
    //   }
    //   const data = yield call(Serves.projTypeListQuery,postData)
    //   if (data.RetCode === '1') {
    //     yield put({
    //       type: 'save',
    //       payload: {
    //         proj_type_list: data.DataRows
    //       }
    //     })
    //   }
    // }
    * detail_query({callback}, {call, select, put}) {
      const {ou, dept, start_year, start_month, end_year, end_month, query_period, total_year, total_month} = yield select(state => state.comprehensive_query);
      let postData = {}
      postData['arguserid'] = Cookies.get('userid')
      postData['argyear'] = end_year
      postData['argmonth'] = end_month
      postData['argdeptname'] = dept === '全部' ? '*' : dept
      postData['argou'] = ou === '联通软件研究院' ? '*' : ou
      postData['argstatecode'] = '0'
      postData['argprojcode'] = ''
      postData['argprojname'] = ''
      postData['argmgrname'] = ''
      postData['argtotaltype'] = query_period
      postData['argstartyear'] = start_year
      postData['argstartmonth'] = start_month
      const data = yield call(Serves.proj_total_cost_detail_query,postData)
      if (data.RetCode === '1'){
        callback(data)
      }
    }
  }
  ,
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/financeApp/cost_proj_fullcost_mgt/comprehensive_query') {
          dispatch({type: 'initData'});
          // dispatch({ type: 'projTypeListQuery' })
          dispatch({type: 'user_type_query', query})
        }
      });
    }
    ,
  }
}
