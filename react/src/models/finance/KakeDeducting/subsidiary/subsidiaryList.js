/*
 * 作者：刘东旭
 * 日期：2017-11-17
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：加计扣除-首页列表(v1.0)
 */

import * as subsidiaryList from '../../../../services/finance/subsidiaryList';
import * as subsidiaryServer from '../../../../services/finance/KakeDeducingService.js';
import {message} from 'antd';

export default {
  namespace: 'subsidiaryList',
  state: {
    data: [], //默认展示内容
    allProject: [],
    projectName: [],
    projectOption: [], //项目下拉选择
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    },
    updateState(state, {index}) {
      state.data.DataRows[index].flag = '2';
      let data = {...state.data, ...state.DataRows};
      return {data}
    }
  },

  effects: {
    /*

        //忘了是什么服务
        * projectName({}, {call, put}) {
          const userID = localStorage.staffid; //获取当前用户ID
          let postData = {};
          postData['argtenantid'] = '10010';
          postData['arguserid'] = userID;
          postData['argmoduleid'] = '61e484a5e16e11e7921e008cfa042288';
          postData['argvgtype'] = '2';
          const allProjectData = yield call(subsidiaryList.allProjectService, postData);
          if (allProjectData.RetCode === '1') {
            if (allProjectData.DataRows.length !== 0) {
              yield put({
                type: 'save',
                payload: {
                  allProject: allProjectData,
                }
              });
            } else {
              yield put({
                type: 'save',
                payload: {
                  allProject: [],
                }
              })
            }
          }

          /!*      const projectNameData = yield call(subsidiaryList.projectNameService);
                yield put({
                  type: 'save',
                  payload: {
                    projectName: projectNameData,
                  }
                })*!/
        },
    */


    //默认显示数据
    * initList({}, {call, put}) {
      const postOu = localStorage.ou; //获取当前用户ID
      let postData = {};
      postData['arg_ou'] = postOu;
      const moduleData = yield call(subsidiaryList.listContent, postData);
      yield put({
        type: 'save',
        payload: {
          data: moduleData,
        }
      })
    },

    //项目下拉选择
    * projectOption({}, {call, put}) {
      const postOu = localStorage.ou; //获取当前用户ID
      let postData = {};
      postData['arg_ou'] = postOu;
      const projectData = yield call(subsidiaryList.projectNameService, postData);
      yield put({
        type: 'save',
        payload: {
          projectOption: projectData.DataRows,

        }
      })
    },


    //按类别查询查询返回数据
    * searchList({searchProType, searchFeeType, searchYear, searchMonth}, {call, put}) {
      const postOu = localStorage.ou; //获取当前用户ou
      let postData = {
        arg_fee_type: searchFeeType,
        arg_proj_type: searchProType,
        arg_year: searchYear,
        arg_month: searchMonth,
        arg_ou: postOu
      };
      const searchData = yield call(subsidiaryList.listSearch, postData);
      yield put({
        type: 'save',
        payload: {
          data: searchData,
        }
      })
    },

    //按月导出
    * derivedMonth({derivedProjectCode, derivedProjectOu, derivedProType, derivedFeeType, derivedYear, derivedMonth, derivedStatus}) {
      window.open(`/microservice/cosservice/divided/ExportSupportExcelAsMonthServlet?arg_proj_type=${derivedProType}&arg_fee_type=${derivedFeeType}&arg_proj_code=${derivedProjectCode}&arg_ou=${derivedProjectOu}&arg_year=${derivedYear}&arg_month=${derivedMonth}&arg_state_code=${derivedStatus}`);
    },

    //按年导出
    * derivedYear({derivedProjectCode, derivedProjectOu, derivedProType, derivedFeeType, derivedYear, derivedMonth}) {
      window.open(`/microservice/cosservice/divided/ExportSupportExcelAsYearServlet?arg_proj_type=${derivedProType}&arg_fee_type=${derivedFeeType}&arg_proj_code=${derivedProjectCode}&arg_ou=${derivedProjectOu}&arg_year=${derivedYear}&arg_month=${derivedMonth}`);
    },

    // 全部生成
    * createAll({createAllYear, createAllMonth}, {call}) {
      const postOu = localStorage.ou; //获取当前用户ou
      const postStaffId = localStorage.staffid; //获取当前用户staff_id
      let postData = {arg_year: createAllYear, arg_month: createAllMonth, arg_staffid: postStaffId, arg_ou: postOu};
      const data = yield call(subsidiaryList.createAll, postData);
      if (data.RetCode === '1') {
        message.success('全部生成成功！');
      } else {
        message.warning('全部生成失败！');
      }
    },


    //生成表1~4
    * CreateList({proType, feeType, year, month}, {call, put}) {
      let postData = {arg_fee_type: feeType, arg_proj_type: proType, arg_year: year, arg_month: month};
      const creareData = yield call(subsidiaryList.listCreate, postData);
      if (creareData === null || creareData === '{}') {
        message.info('生成失败！');
      } else {
        if (creareData.RetCode === '1') {
          message.success('生成成功！');
          yield put({
            type: 'createData',
            payload: {
              list: [],
              headerName: []
            }
          })
        }
      }
    },

    // 单个项目的生成
    * singleCreate({postData, index}, {call, put}) {
      const {RetCode} = yield call(subsidiaryServer.singleCreate, postData);
      if (RetCode === '1') {
        message.success('数据生成成功！');
        yield put({
          type: 'updateState',
          index
        });
        yield put({
          type: 'initList'
        });
        yield put({
          type: 'projectOption'
        });
      }
    },

  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/financeApp/cost_proj_divided_mgt/divided_mainpage_mgt') {
          dispatch({type: 'initList', query});
          dispatch({type: 'projectOption', query});
        }
      });
    },
  },
};
