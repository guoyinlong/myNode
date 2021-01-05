/*
 * 作者：刘东旭
 * 日期：2017-10-21
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：一点看全model层文件(v1.0)
 * 修改：刘东旭，2017-11-13，13：55
 */

import * as onePointData from '../../../services/commonApp/onePoint/onePoint'; //从services调用


export default {
  namespace: 'onePoint',
  state: {
    gs: [],
    enterprise: [],
    infoDept: [],
    projectType: [],
    newServlet: [],
    ratio: []
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    }
  },

  effects: {

    //企发部指标
    * enterprise({}, {call, put}) {
      let postData = {'arg_kpi_type': '企发部指标'};
      const kpiData = yield call(onePointData.kpi, postData);
      if (kpiData === null || kpiData === '{}') {
        console.log('企发部获取失败！');
      } else {
        if (kpiData.RetCode === '1' || kpiData.DataRows !== null || kpiData.DataRows !== '{}' || kpiData.DataRows !== '[]' || kpiData.DataRows !== undefined) {
          yield put({
            type: 'save',
            payload: {
              enterprise: kpiData.DataRows
            }
          })
        }
      }
    },

    //信息化部指标
    * infoDept({}, {call, put}) {
      let postData = {'arg_kpi_type': '信息化部指标'};
      const infoDeptData = yield call(onePointData.kpi, postData);
      if (infoDeptData === null || infoDeptData === '{}') {
        console.log('信息化部获取失败！');
      } else {
        if (infoDeptData.RetCode === '1' || infoDeptData.DataRows !== null || infoDeptData.DataRows !== '{}' || infoDeptData.DataRows !== '[]' || infoDeptData.DataRows !== undefined) {
          yield put({
            type: 'save',
            payload: {
              infoDept: infoDeptData.DataRows
            }
          })
        }
      }
    },

    //GS任务
    * gsTable({}, {call, put}) {
      let postData = {'argyear': '2017', 'argmonth': '11'};
      const gsData = yield call(onePointData.Gs, postData);
      if (gsData === null || gsData === '{}') {
        console.log('GS获取失败！');
      } else {
        if (gsData.RetCode === '1' || gsData.DataRows !== null || gsData.DataRows !== '{}' || gsData.DataRows !== '[]' || gsData.DataRows !== undefined) {
          yield put({
            type: 'save',
            payload: {
              gs: gsData.DataRows
            }
          })
        }
      }
    },

    //项目类别分布
    * projectType({}, {call, put}) {
      let postData = {'arg_ou': '联通软件研究院'};
      const projectTypeData = yield call(onePointData.projectTypeServices, postData);
      if (projectTypeData === null || projectTypeData === '{}') {
        console.log('项目类别分布获取失败！');
      } else {
        if (projectTypeData.RetCode === '1' || projectTypeData.DataRows !== null || projectTypeData.DataRows !== '{}' || projectTypeData.DataRows !== '[]' || projectTypeData.DataRows !== undefined) {
          yield put({
            type: 'save',
            payload: {
              projectType: projectTypeData.DataRows
            }
          })
        }
      }
    },


  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/commonApp/overviewbypoint/searchallouinfo') {
          dispatch({type: 'gsTable', query});
          dispatch({type: 'enterprise', query});
          dispatch({type: 'infoDept', query});
          dispatch({type: 'projectType', query});
          dispatch({type: 'ratio', query});
        }
      });
    },
  },
};
