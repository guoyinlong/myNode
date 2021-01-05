/**
 * 文件说明: 培训统计配置查询界面
 * 作者：wangfujiang
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2019-08-19
 **/
import Cookie from "js-cookie";
import * as trainService from "../../services/train/trainService";
import { message } from "antd";
import { routerRedux } from "dva/router";
import { OU_NAME_CN, OU_HQ_NAME_CN } from '../../utils/config';
const auth_tenantid = Cookie.get('tenantid');
const auth_ou = Cookie.get('OU');
let auth_ou_flag = auth_ou;
if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}

export default {
  namespace: 'train_query_model',
  state: {
    currentPage: null,
    total: null,
    tableDataList: [],
    tableDataListTotal: [],
    query_sql_list: [],
    query_title: '',
    excle_title: '',
    //首页个人情况概览
    year_info: [],
    person_info: [],
    learn_info: [],
    //默认查询类型
    queryType: '',
    queryYear: ''
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  },
  effects: {
    *trainConfigQueryInit({ }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          query_title: '',
          excle_title: '',
          tableDataList: [],
          tableDataListTotal: [],
          total: '',
          currentPage: '',
        }
      });

      let param = {
        arg_type: 1,
        arg_ouid: Cookie.get('OUID')
      };
      //查询sql列表
      const querySqlListInfo = yield call(trainService.trainQuerySqlList, param);
      if (querySqlListInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            query_sql_list: querySqlListInfo.DataRows,
          }
        });
      } else {
        message.error('sql列表查询失败');
      }
      //
    },

    *trainPersonQueryIndexInit({ paramData }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          query_title: '',
          excle_title: '',
          tableDataList: [],
          tableDataListTotal: [],
          total: '',
          currentPage: '',
          //首页个人情况概览
          year_info: [],
          person_info: [],
          learn_info: [],
        }
      });

      let param = {
        arg_type: 2
      };
      //查询sql列表
      const querySqlListInfo = yield call(trainService.trainQuerySqlList, param);
      if (querySqlListInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            query_sql_list: querySqlListInfo.DataRows,
          }
        });
      } else {
        message.error('sql列表查询失败');
      }
      //查询个人年度计划
      let param1 = {
        arg_user_id: Cookie.get("userid"),
        arg_year: paramData && paramData.arg_year !== '' ? paramData.arg_year : new Date().getFullYear(),
        arg_ou_id: Cookie.get("OUID"),
        arg_dept_id: Cookie.get("dept_id")
      };
      const queryYearData = yield call(trainService.trainQueryYearInfo, param1);
      if (queryYearData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            year_info: queryYearData.DataRows,
          }
        });
      } else {
        message.error('查询年度计划失败！');
      }
      //查询个人已完成计划
      const queryPersonData = yield call(trainService.trainQueryPersonalInfo, param1);
      if (queryPersonData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            person_info: queryPersonData.DataRows,
          }
        });
      } else {
        message.error('查询年度计划失败！');
      }
      //查询个人仍可学习计划
      const queryLearnData = yield call(trainService.trainQueryLearnInfo, param1);
      if (queryLearnData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            learn_info: queryLearnData.DataRows,
          }
        });
      } else {
        message.error('查询年度计划失败！');
      };
    },

    *trainPersonQueryInit({ query }, { call, put }) {

      console.log("**********************");
      console.log(query);
      console.log("**********************");
      yield put({
        type: 'save',
        payload: {
          query_title: '',
          excle_title: '',
          tableDataList: [],
          tableDataListTotal: [],
          total: '',
          currentPage: '',
          //默认查询类型
          queryType: query.arg_querytype,
          queryYear: query.arg_queryYear,
        }
      });

      let param = {
        arg_type: 2
      };
      //查询sql列表
      const querySqlListInfo = yield call(trainService.trainQuerySqlList, param);
      if (querySqlListInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            query_sql_list: querySqlListInfo.DataRows,
          }
        });
      } else {
        message.error('sql列表查询失败');
      }

      // 跳转默认查询
      let arg_querytype = {
        arg_querytype: query.arg_querytype
      };
      const queryTitleInfo = yield call(trainService.trainQueryTitleQuery, arg_querytype);
      if (queryTitleInfo.RetCode === '1') {
        let titlestr = queryTitleInfo.DataRows[0].query_title.split('\\')[0];
        let titlestr2 = queryTitleInfo.DataRows[0].excle_title.split('\\')[0];
        yield put({
          type: 'save',
          payload: {
            query_title: titlestr,
            excle_title: titlestr2
          }
        })
      } else {
        message.error('表头查询失败');
      }
      const querySqlInfo = yield call(trainService.trainQuerySqlExecute, query);
      if (querySqlInfo.RetCode === '1') {
        if (query.arg_page_size === 1000) {
          yield put({
            type: 'save',
            payload: {
              tableDataListTotal: querySqlInfo.DataRows,
            }
          })
        } else {
          yield put({
            type: 'save',
            payload: {
              tableDataList: querySqlInfo.DataRows,
              total: querySqlInfo.RowCount,
              currentPage: query.arg_page_current,
            }
          })
        }
      } else {
        message.error('sql列表查询失败');
      }

    },

    *trainConfigQuery({ query, resolve }, { call, put }) {
      console.log("query===" + JSON.stringify(query));
      //查询表头
      let queryparam = {
        arg_querytype: query.arg_querytype
      }
      const queryTitleInfo = yield call(trainService.trainQueryTitleQuery, queryparam);
      if (queryTitleInfo.RetCode === '1') {
        //console.log("queryTitleInfo.DataRows[0].query_title==="+queryTitleInfo.DataRows[0].query_title);
        let titlestr = queryTitleInfo.DataRows[0].query_title.split('\\')[0];
        let titlestr2 = queryTitleInfo.DataRows[0].excle_title.split('\\')[0];
        console.log("titlestr2===" + titlestr2);
        yield put({
          type: 'save',
          payload: {
            query_title: titlestr,
            excle_title: titlestr2
          }
        })
      } else {
        message.error('表头查询失败');
      }
      //查询Sql语句
      queryparam = {
        arg_page_size: query.arg_page_size,
        arg_page_current: query.arg_page_current,
        arg_querytype: query.arg_querytype,
        arg_trainyear: query.arg_trainyear,
        arg_traintime: query.arg_traintime,
        arg_trainlevel: query.arg_trainlevel,
        arg_classlevel: query.arg_classlevel,
        arg_traintype: query.arg_traintype,
        arg_ouid: Cookie.get('OUID'),
        arg_deptid: Cookie.get('dept_id'),
        arg_userid: Cookie.get('userid')
      };
      const querySqlInfo = yield call(trainService.trainQuerySqlExecute, queryparam);
      if (querySqlInfo.RetCode === '1') {

        //console.log("querySqlInfo.DataRows==="+querySqlInfo.DataRows);
        if (query.arg_page_size === 1000) {
          resolve("success");
          yield put({
            type: 'save',
            payload: {
              tableDataListTotal: querySqlInfo.DataRows,
            }
          })
        } else {
          yield put({
            type: 'save',
            payload: {
              tableDataList: querySqlInfo.DataRows,
              total: querySqlInfo.RowCount,
              currentPage: query.arg_page_current,
            }
          })
        }
      } else {
        resolve("false");
        message.error('sql列表查询失败');
      }
    },

    *trainPersonQuery({ query, resolve }, { call, put }) {
      console.log("query===" + JSON.stringify(query));
      //查询表头
      let queryparam = {
        arg_querytype: query.arg_querytype
      }
      const queryTitleInfo = yield call(trainService.trainQueryTitleQuery, queryparam);
      if (queryTitleInfo.RetCode === '1') {
        //console.log("queryTitleInfo.DataRows[0].query_title==="+queryTitleInfo.DataRows[0].query_title);
        let titlestr = queryTitleInfo.DataRows[0].query_title.split('\\')[0];
        let titlestr2 = queryTitleInfo.DataRows[0].excle_title.split('\\')[0];
        console.log("titlestr2===" + titlestr2);
        yield put({
          type: 'save',
          payload: {
            query_title: titlestr,
            excle_title: titlestr2
          }
        })
      } else {
        message.error('表头查询失败');
      }
      //查询Sql语句
      queryparam = {
        arg_page_size: query.arg_page_size,
        arg_page_current: query.arg_page_current,
        arg_querytype: query.arg_querytype,
        arg_trainyear: query.arg_trainyear,
        arg_traintime: query.arg_traintime,
        arg_trainlevel: query.arg_trainlevel,
        arg_classlevel: query.arg_classlevel,
        arg_traintype: query.arg_traintype,
        arg_ouid: Cookie.get('OUID'),
        arg_deptid: Cookie.get('dept_id'),
        arg_userid: Cookie.get('userid')
      };
      const querySqlInfo = yield call(trainService.trainQuerySqlExecute, queryparam);
      if (querySqlInfo.RetCode === '1') {

        //console.log("querySqlInfo.DataRows==="+querySqlInfo.DataRows);
        if (query.arg_page_size === 1000) {
          resolve("success");
          yield put({
            type: 'save',
            payload: {
              tableDataListTotal: querySqlInfo.DataRows,
            }
          })
        } else {
          yield put({
            type: 'save',
            payload: {
              tableDataList: querySqlInfo.DataRows,
              total: querySqlInfo.RowCount,
              currentPage: query.arg_page_current,
            }
          })
        }
      } else {
        resolve("false");
        message.error('sql列表查询失败');
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/train/trainStatistic/train_config_query') {
          /**培训配置统计查询 */
          dispatch({ type: 'trainConfigQueryInit', query });
        }
        if (pathname === '/humanApp/train/personalClassQueryIndex/personalClassQuery') {
          /**培训配置统计查询 */
          dispatch({ type: 'trainPersonQueryInit', query });
        }
        if (pathname === '/humanApp/train/personalClassQueryIndex') {
          /**培训配置统计查询 */
          dispatch({ type: 'trainPersonQueryIndexInit', query });
        }
      });
    }
  },
}
