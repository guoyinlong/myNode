/*
 * 作者：刘东旭
 * 日期：2017-11-17
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：工时管理models层
 */

import * as timeManagementService from '../../../services/project/timeManagementService/timeManagementService';
import Cookie from 'js-cookie';
import {message} from 'antd';

export default {
  namespace: 'timeManagement',
  state: {
    projectList: [], //所参与的项目
    activityType: [], //主责项目活动类型
    activityType2: [], //配责项目活动类型
    currentWeek: [] //本周工时情况
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    }
  },

  effects: {

    //初始化
    * fillCheckProject({}, {call, put}) {
      const userID = localStorage.staffid; //获取当前用户ID
      let postData = {};
      postData['arg_userid'] = userID;
      //获取当前用户所参与的项目
      const data = yield call(timeManagementService.fillCheckProject, postData);
      if (data.RetCode === '1') {
        if (data.DataRows.length !== 0) {
          yield put({
            type: 'save',
            payload: {
              projectList: data.DataRows,
            }
          });
        } else {
          yield put({
            type: 'save',
            payload: {
              projectList: [],
            }
          })
        }
      }

      //查询本周工时状态
      yield put({
        type: 'save',
        payload: {
          currentWeek: [],
        }
      });
      const currentWeekData = yield call(timeManagementService.currentWeekSearch, postData);
      if (currentWeekData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            currentWeek: currentWeekData,
          }
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            currentWeek: [],
          }
        })
      }

      if (data.DataRows.length > 0) {
        //获得项目1活动类型
        let activityPostData = {};
        activityPostData['arg_userid'] = userID;
        activityPostData['arg_proj_code'] = data.DataRows[0].proj_code;
        const activityData = yield call(timeManagementService.fillActivityType, activityPostData);
        if (activityData.RetCode === '1') {
          if (activityData.DataRows.length !== 0) {
            yield put({
              type: 'save',
              payload: {
                activityType: activityData.DataRows,
              }
            });
          } else {
            yield put({
              type: 'save',
              payload: {
                activityType: [],
              }
            })
          }
        }

        if (data.DataRows.length > 1) {
          //获得项目2活动类型
          let activityPostData2 = {};
          activityPostData2['arg_userid'] = userID;
          activityPostData2['arg_proj_code'] = data.DataRows[1].proj_code;
          const activityData2 = yield call(timeManagementService.fillActivityType, activityPostData2);
          if (activityData2.RetCode === '1') {
            if (activityData2.DataRows.length !== 0) {
              yield put({
                type: 'save',
                payload: {
                  activityType2: activityData2.DataRows,
                }
              });
            } else {
              yield put({
                type: 'save',
                payload: {
                  activityType2: [],
                }
              })
            }
          }
        }
      } else {
        message.info('抱歉，您没有参与任何项目！')
      }
    },

    // 工时填报保存
    * fillSaveTime({endData}, {call}) {
      if (endData.length > 0) {
        const userID = localStorage.staffid; //获取当前用户ID
        const userType = localStorage.usertype; //获取当前用户类型，1：正式；6：外包；
        //判断是否为外包
        let rowType = 0;
        if(userType === '6'){
          rowType = 2;
        }else {
          rowType = 0;
        }

        let currentWeekPostData = {};
        currentWeekPostData['arg_userid'] = userID;

        //查询本周工时状态
        const currentWeek = yield call(timeManagementService.currentWeekSearch, currentWeekPostData);
        let transjsonarray = []; //定义空数组，用来传入删除和保存或提交的数据


        /* == 第二次保存前先清空之前的记录 START == */
        //判断本周工时是否填写过
        if (currentWeek.DataRows.length > 0 && currentWeek.DataRows !== []) { //判断本周填报工时不为空且有数据
          if (currentWeek.DataRows[0].staff_id === localStorage.staffid) { //判断当前数据等于已登录用户
            //定义空数组，遍历查询出来的本周工时数据，拼接成后台服务所需格式

            for (let i = 0; i < currentWeek.DataRows.length; i++) { //先删除旧数据，push到参数数组里
              transjsonarray.push({
                "opt": "delete",
                "data": {
                  "id": currentWeek.DataRows[i].id,
                }
              })
            }

          }
        }
        /* == 第二次保存前先清空之前的记录 END == */


        /* == 保存 START == */

        //获取创建时间
        let myData = new Date();
        let timeNow = myData.getFullYear() + "-" + (myData.getMonth() + 1) + "-" + myData.getDate() + " " + myData.getHours() + ":" + myData.getMinutes() + ":" + myData.getSeconds();
        //定义空数组，遍历从routes层传来的数据，拼接成后台服务所需格式
        for (let i = 0; i < endData.length; i++) {
          transjsonarray.push({
            "opt": "insert",
            "data": {
              "proj_code": endData[i].key.split('++')[0],
              "proj_name": endData[i].key.split('++')[3],
              "staff_id": localStorage.staffid,
              "login_name": Cookie.get('loginname'),
              "full_name": localStorage.fullName,
              "begin_time": currentWeek.FillDateBegin,
              "end_time": currentWeek.FillDateEnd,
              "dept_id": Cookie.get('dept_id'),
              "activity_id": endData[i].key.split('++')[1],
              "mon": endData[i].Monday,
              "tues": endData[i].Tuesday,
              "wed": endData[i].Wednesday,
              "thur": endData[i].Thursday,
              "fri": endData[i].Friday,
              "sat": endData[i].Saturday,
              "sun": endData[i].Sunday,
              "approved_status": 0, //0保存，1提交，2审核通过，3退回,4补录工时提交(项目成员),5补录工时提交（项目经理）,6补录工时保存(项目成员) 7 补录工时退回,8 历史
              "data_source": 0,
              "row_type": rowType, //记录类型，0.正常填写工时 1.补录工时，2.外包填写的工时 3.自动填加的工时
              "create_time": timeNow,
            }
          })
        }

        //将拼接好的数据转成字符串
        let postData = {};
        postData = {
          transjsonarray: JSON.stringify(transjsonarray)
        };

        //向后台传输且取回结果
        const fillSaveTimeData = yield call(timeManagementService.fillSaveTime, postData);
        if (fillSaveTimeData === null || fillSaveTimeData === "") {
          message.info('保存失败！');
        } else {
          if (fillSaveTimeData.RetCode === '1') {
            message.success('保存成功！');
            location.reload();
          }
        }

        /* == 保存 END == */

      } else {
        message.info('请填写后再保存！');
      }
    },

    // 工时填报提交
    * fillCommitTime({endData}, {call, put}) {
      if (endData.length > 0) {
        const userID = localStorage.staffid; //获取当前用户ID
        const userType = localStorage.usertype; //获取当前用户类型，1：正式；6：外包；
        //判断是否为外包
        let rowType = 0;
        if(userType === '6'){
          rowType = 2;
        }else {
          rowType = 0;
        }

        let currentWeekPostData = {};
        currentWeekPostData['arg_userid'] = userID;

        //查询本周工时状态
        const currentWeek = yield call(timeManagementService.currentWeekSearch, currentWeekPostData);
        let transjsonarray = []; ////定义空数组，用来传入删除和保存或提交的数据

        /* == 第二次保存前先清空之前的记录 START == */

        //判断本周工时是否填写过
        if (currentWeek.DataRows !== [] && currentWeek.DataRows.length > 0) {//判断本周填报工时不为空且有数据
          if (currentWeek.DataRows[0].staff_id === localStorage.staffid) { //判断当前数据等于已登录用户
            for (let i = 0; i < currentWeek.DataRows.length; i++) {
              transjsonarray.push({
                "opt": "delete",
                "data": {
                  "id": currentWeek.DataRows[i].id,
                }
              })
            }
          }
        }
        /* == 第二次保存前先清空之前的记录 END == */


        /* == 提交 START == */

        //获取创建时间
        let myData = new Date();
        let timeNow = myData.getFullYear() + "-" + (myData.getMonth() + 1) + "-" + myData.getDate() + " " + myData.getHours() + ":" + myData.getMinutes() + ":" + myData.getSeconds();

        //定义空数组，遍历从routes层传来的数据，拼接成后台服务所需格式
        for (let i = 0; i < endData.length; i++) {
          transjsonarray.push({
            "opt": "insert",
            "data": {
              "proj_code": endData[i].key.split('++')[0],
              "proj_name": endData[i].key.split('++')[3],
              "staff_id": localStorage.staffid,
              "login_name": Cookie.get('loginname'),
              "full_name": localStorage.fullName,
              "begin_time": currentWeek.FillDateBegin,
              "end_time": currentWeek.FillDateEnd,
              "dept_id": Cookie.get('dept_id'),
              "activity_id": endData[i].key.split('++')[1],
              "mon": endData[i].Monday,
              "tues": endData[i].Tuesday,
              "wed": endData[i].Wednesday,
              "thur": endData[i].Thursday,
              "fri": endData[i].Friday,
              "sat": endData[i].Saturday,
              "sun": endData[i].Sunday,
              "approved_status": 1, //0保存，1提交，2审核通过，3退回,4补录工时提交(项目成员),5补录工时提交（项目经理）,6补录工时保存(项目成员) 7 补录工时退回,8 历史
              "data_source": 0,
              "row_type": rowType, //记录类型，0.正常填写工时 1.补录工时，2.外包填写的工时 3.自动填加的工时
              "create_time": timeNow,
            }
          })
        }

        //将拼接好的数据转成字符串
        let postData = {};
        postData = {
          transjsonarray: JSON.stringify(transjsonarray)
        };

        //向后台传输且取回结果
        const fillSaveTimeData = yield call(timeManagementService.fillCommitTime, postData);
        if (fillSaveTimeData === null || fillSaveTimeData === "") {
          message.info('提交失败！');
        } else {
          if (fillSaveTimeData.RetCode === '1') {
            message.success('提交成功！');
            location.reload();
          }
        }

        /* == 提交 END == */

      } else {
        message.info('请填写后再提交！');
      }
    },
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/projectApp/timesheetManage/timesheetFillin') {
          dispatch({type: 'fillCheckProject', query});
        }
      });
    },
  },
};
