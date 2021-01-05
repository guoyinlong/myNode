/*
 * 作者：刘东旭
 * 日期：2017-12-06
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：工时管理-退回处理
 */

import * as timeManagementService from '../../../services/project/timeManagementService/timeManagementService';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import {message} from 'antd';

export default {
  namespace: 'fillSendBack',
  state: {
    projectListCode: [], //所参与的项目编号
    projectListName: [], //所参与的项目名称
    activityType: [], //主责项目活动类型
    activityType2: [], //配责项目活动类型
    currentWeek: {} //本周工时情况
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    }
  },

  effects: {

    //初始化
    * fillCheckProject({beginTime, endTime, approvedStatus, projectCode}, {call, put}) {
      const userID = localStorage.staffid; //获取当前用户ID
      if(beginTime && endTime){
        //查询退回工时状态
        let sendBackPostData = {};
        sendBackPostData['arg_staff_id'] = userID;
        sendBackPostData['arg_begin_time'] = beginTime;
        sendBackPostData['arg_end_time'] = endTime;
        sendBackPostData['arg_proj_code'] = projectCode;
        sendBackPostData['arg_approved_status'] = approvedStatus;
        const currentWeekData = yield call(timeManagementService.sendBackSearch, sendBackPostData);
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
      }

      if(projectCode){
        //获得被退回项目的活动类型
        let activityPostData = {};
        activityPostData['arg_userid'] = userID;
        activityPostData['arg_proj_code'] = projectCode;
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
      }
    },

    // 工时填报提交
    * fillCommitTime({endData,beginTime, endTime, approvedStatus}, {select, call, put}) {
      if (endData.length > 0) {
        let currentWeek = yield select(state => state.fillSendBack.currentWeek);
        let transjsonarray = [];//定义空数组，遍历从routes层传来的数据，拼接成后台服务所需格式

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

        const userType = localStorage.usertype; //获取当前用户类型，1：正式；6：外包；

        /* == 提交 START == */
        let myData = new Date();//获取创建时间
        let timeNow = myData.getFullYear() + "-" + (myData.getMonth() + 1) + "-" + myData.getDate() + " " + myData.getHours() + ":" + myData.getMinutes() + ":" + myData.getSeconds();
        for (let i = 0; i < endData.length; i++) {
          let appStatus = ''; //approved状态
          let rowType = ''; //rowType状态
          if(approvedStatus == 3){
            appStatus = 1;
            if(userType === '6'){
              rowType = 2
            }else {
              rowType = 0
            }
          }else if(approvedStatus == 7){
            appStatus =  4;
            if(userType === '6'){
              rowType = 2
            }else {
              rowType = 1
            }
          }
          transjsonarray.push({
            "opt": "insert",
            "data": {
              "proj_code": endData[i].key.split('++')[0],
              "proj_name": endData[i].key.split('++')[3],
              "staff_id": localStorage.staffid,
              "login_name": Cookie.get('loginname'),
              "full_name": localStorage.fullName,
              "begin_time": beginTime,
              "end_time": endTime,
              "dept_id": Cookie.get('dept_id'),
              "activity_id": endData[i].key.split('++')[1],
              "mon": endData[i].Monday,
              "tues": endData[i].Tuesday,
              "wed": endData[i].Wednesday,
              "thur": endData[i].Thursday,
              "fri": endData[i].Friday,
              "sat": endData[i].Saturday,
              "sun": endData[i].Sunday,
              "approved_status": appStatus, //0保存，1提交，2审核通过，3退回,4补录工时提交(项目成员),5补录工时提交（项目经理）,6补录工时保存(项目成员) 7 补录工时退回,8 历史
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
            yield put(routerRedux.push({
              pathname: '/commonApp'
            }));
          }
        }
        /* == 提交 END == */
      }else {
        message.info('请填写后再保存！');
      }
    },



    // 退回工时删除
    * deleteTime({}, {select, call, put}) {
        let currentWeek = yield select(state => state.fillSendBack.currentWeek);


        /* == 第二次保存前先清空之前的记录 START == */
        //判断本周工时是否填写过
        if (currentWeek.DataRows !== [] && currentWeek.DataRows.length > 0) {//判断本周填报工时不为空且有数据
          if (currentWeek.DataRows[0].staff_id === localStorage.staffid) { //判断当前数据等于已登录用户
            //定义空数组，遍历从routes层传来的数据，拼接成后台服务所需格式
            let deleteTransjsonarray = [];
            for (let i = 0; i < currentWeek.DataRows.length; i++) {
              deleteTransjsonarray.push({
                "opt": "delete",
                "data": {
                  "id": currentWeek.DataRows[i].id,
                }
              })
            }

            //将拼接好的数据转成字符串
            let deleteTime = {};
            deleteTime = {
              transjsonarray: JSON.stringify(deleteTransjsonarray)
            };

            //向后台传输删除信息且获得反馈
            const deleteTimeData = yield call(timeManagementService.fillSaveTime, deleteTime);
            if (deleteTimeData === null || deleteTimeData === "") {
              message.info('删除失败！');
            } else {
              if (deleteTimeData.RetCode === '1') {
                console.log('已删除退回工时！');
                yield put(routerRedux.push({
                  pathname: '/commonApp'
                }));
              }
            }

          }
        }
        /* == 第二次保存前先清空之前的记录 END == */

    },

  },


  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/projectApp/timesheetManage/fillSendBack') {
          dispatch({type: 'fillCheckProject', query});
        }
      });
    },
  },
};
