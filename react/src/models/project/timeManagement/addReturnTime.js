/**
 * 作者：王旭东
 * 创建日期：2018-9-5
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明：填写退回工时
 */
import {message} from "antd";
import cookie from "js-cookie";
import { routerRedux } from 'dva/router';
import * as timeManagementService from "../../../services/project/timeManagementService/timeManagementService";

export default {
  namespace: "addReturnTime",

  state: {
    allProjectTime: [], // 本周全部项目活动工时
    allProjectTimeOld: [], // 本周未变化之前的数据
    allActivityList: [], // 全部项目的活动列表
    selectProjectKey: "",// 选择的项目
    totalHours: 0, // 总工时
    invalid_date: '', // 当前项目的截止时间
    effective_date: '', // 当前项目开始时间
    isOver24: false, // 是否超出24小时

    timeSelect: {}, // 退回的周期
    proj_code: '', // 退回项目的编码
    proj_name: '',// 退回项目的名称
    task_type: '', // 填报退回/补录退回  week_timesheet_back/makeup_timesheet_back
    IsCommit: "0", //
  },

  effects: {
    // 初始化
    * init({query}, {call, put, select}) {
      // *************将传过来的参数初始化********
      let timeInit = {};
      timeInit.weekStart = query.begin_time;
      timeInit.weekEnd = query.end_time;
      yield put({
        type: 'save',
        payload: {
          allProjectTime: [], // 本周全部项目活动工时
          allProjectTimeOld: [], // 本周未变化之前的数据
          allActivityList: [], // 全部项目的活动列表
          selectProjectKey: "",// 选择的项目
          totalHours: 0, // 总工时
          invalid_date: '', // 当前项目的截止时间
          effective_date: '', // 当前项目开始时间
          isOver24: false, // 是否超出24小时

          timeSelect: timeInit, // 初始工时
          proj_code: query.proj_code, // 退回项目的编码
          proj_name: query.proj_name,// 退回项目的名称
          task_type: query.task_type, // week_timesheet_back 填报退回 makeup_timesheet_back 补录退回
          approved_status: query.approved_status,// 传过来的状态
        }
      });

      // 查询活动工时
      yield put({
        type: 'queryAllActivities'
      })
    },

    // 查询全部活动
    * queryAllActivities({}, {call, put, select}) {
      let {timeSelect, proj_code, approved_status, selectProjectKey, invalid_date, effective_date } = yield select(state => state.addReturnTime);
      // ********************查询全部活动列表************************
      let postData = {
        arg_userid: cookie.get('userid')
      }
      const data = yield call(timeManagementService.queryAllActivities, postData);
      let allActivityList;
      if (data.RetCode === '1') {
        // 将活动列表转换成数组
        allActivityList = data.DataRows
        allActivityList.forEach((activityListItem) => {
          let activityListString = activityListItem.activity_list;
          activityListItem.activity_list = JSON.parse(activityListString);
        })
        // 将转换之后的对象存入
        yield put({
          type: 'save',
          payload: {
            allActivityList: allActivityList,
          }
        });
      }

      // *************在查询全部工时数据时需要使用活动列表数据***********start
      let postreturnData = {
        arg_staff_id: cookie.get('userid'),
        arg_begin_time: timeSelect.weekStart, // 开始时间 必传
        arg_end_time: timeSelect.weekEnd, // 结束时间 必传
        arg_approved_status: approved_status, // 状态哪儿来的
        arg_proj_code: proj_code, //
      }
      const alldata = yield call(timeManagementService.queryReturnTimeS, postreturnData);
      if (alldata.RetCode === '1') {
        let allProjectTime = alldata.DataRows;
        // 对数组每一项添加统一的属性proj_pms_key = proj_id + '-'+ pms_code
        allProjectTime.forEach((item) => {
          if (item.pms_code) {
            item.proj_pms_key = item.proj_id + '-' + item.pms_code
            item.key = item.proj_id + '-' + item.pms_code // 列表数据需要有key
          } else {
            item.proj_pms_key = item.proj_id
            item.key = item.proj_id
          }
        })

        // 将活动列表字符转换成数组，添加key
        if (allProjectTime.length !== 0) {
          allProjectTime.forEach((projItem) => {
            // 将数组中的每一项的 活动列表字符串 转成 数组
            if (projItem.activity_list) {
              let activityList = JSON.parse(projItem.activity_list)

              activityList.forEach((actiItem) => {
                // 添加唯一key
                actiItem.key = actiItem.activity_id;

                // 为活动列表的每一项添加名称 先filter出活动列表再出活动
                actiItem.activityName = allActivityList.filter(
                  (allActItem) => allActItem.proj_id === projItem.proj_id
                )[0].activity_list.filter(
                  (actiListItem) => actiListItem.activity_code === actiItem.activity_id
                )[0].activity_name;
              })
              projItem.activity_list = activityList
            } else {
              projItem.activity_list = []
            }
          })
        }

        // 如果初始进入页面，将选择的项目默认第一个allProjectTime[0]，否则保留原来的值
        let selectProjectKeyTemp,invalid_dateTemp, effective_dateTemp;
        if (selectProjectKey==='' && invalid_date === '' && effective_date==='') {
          selectProjectKeyTemp = allProjectTime[0].proj_pms_key;
          invalid_dateTemp = allProjectTime[0].invalid_date;
          effective_dateTemp = allProjectTime[0].effective_date;
        } else {
          selectProjectKeyTemp = selectProjectKey;
          invalid_dateTemp = invalid_date;
          effective_dateTemp = effective_date;
        }

        yield put({
          type: 'save',
          payload: {
            allProjectTime: allProjectTime,
            allProjectTimeOld: allProjectTime, // 用于存储未变化的数据
            selectProjectKey: selectProjectKeyTemp,
            IsCommit: alldata.IsCommit, // 1 提交 0 未提交
            invalid_date: invalid_dateTemp, // 当前项目的截止时间
            effective_date: effective_dateTemp, // 当前项目开始时间
            approvedby: alldata.approvedby, // 退回原因
          }
        });

        // 计算全部工时
        yield put({
            type: 'calculateAllTime'
          }
        )
      }

      // *************在查询全部工时数据时需要使用活动列表数据***********end
    },

    // 选择项目
    * selectChange({selectProj}, {call, put, select}) {
      let {allProjectTime} = yield select(state => state.addReturnTime);

      // 将当前项目的开始时间和结束时间保存
      let projectData = allProjectTime.filter(
        (item) => item.proj_pms_key === selectProj)[0];
      yield put({
        type: 'save',
        payload: {
          selectProjectKey: selectProj,
          invalid_date: projectData.invalid_date, // 当前项目的截止时间
          effective_date: projectData.effective_date, // 当前项目开始时间
        }
      })
    },

    // 选择活动 当前选择的项目 selectProjectKey
    * CheckboxGroupChange({value}, {call, put, select}) {
      let {allProjectTime, allActivityList, selectProjectKey} = yield select(state => state.addReturnTime);

      // 取出当前项目的活动列表 activityListOne是一个数组
      let activityListOne = allActivityList.filter(
        actiListItem => actiListItem.proj_id === selectProjectKey.split('-')[0])

      // 取出 allProjectTime中当前操作的项目对象数组，filter返回的数组
      let projectOne = allProjectTime.filter(projItem => projItem.proj_pms_key === selectProjectKey)[0]
      // 生成新的活动数组 activity_list
      let activity_list = value.map((activityItem) => {
        // 在已有的活动列表中找到这个活动 activityItem
        let haveActivity = projectOne.activity_list.filter(
          activityOneItem => activityOneItem.activity_id === activityItem
        )
        // 已有的数据中包含这个活动,直接返回，否则添加新数组
        if (haveActivity.length !== 0) {
          return haveActivity[0]
        } else {
          return {
            key: activityItem,
            id: '',
            activity_id: activityItem,
            activityName: activityListOne[0].activity_list.filter(
              (actiListItem) => actiListItem.activity_code === activityItem
            )[0].activity_name,
            mon: '0',
            tues: '0',
            wed: '0',
            thur: '0',
            fri: '0',
            sat: '0',
            sun: '0',
            total_hours: '0',
          }
        }
      })

      // 将新的活动列表赋值给 当前项目
      projectOne.activity_list = activity_list;
      yield put({
        type: 'save',
        payload: {
          allProjectTime: JSON.parse(JSON.stringify(allProjectTime)),
        }
      })

      // 重新计算全部工时
      yield put({
        type: 'calculateAllTime'
      })

    },

    // 处理输入框
    * handleChange({value, column, record}, {call, put, select}) {
      // 第一步对数值进行处理，精度0.5，不能超过24
      if (isNaN(value)) {
        message.info('请输入数字！');
        value = 0;
      } else if (value % 0.5 !== 0) {
        value = parseInt(value / 0.5) / 2;
        message.info('工时最高可精确到0.5小时！')
      }

      if (value > 24) {
        message.info('请勿超出24小时！')
        value = 0;
      }

      // 保证value有值
      if (value === null) {
        value = 0;
      }
      if (!value) {
        value = 0;
      }

      let {allProjectTime, selectProjectKey} = yield select(state => state.addReturnTime);
      const targetProject = allProjectTime.filter(item => selectProjectKey === item.proj_pms_key)[0];
      const targetActivity =
        targetProject.activity_list.filter(item => record.activity_id === item.activity_id)[0];

      targetActivity[column] = value;

      yield put({
        type: "save",
        payload: {
          tableValue: JSON.parse(JSON.stringify(allProjectTime))
        }
      });

      // 计算该项目全部工时
      yield put({
        type: "calculateAllTime"
      });
    },

    // 更新全部总工时 包括每一行的 和 每一列
    * calculateAllTime({}, {call, put, select}) {
      const {allProjectTime} = yield select(state => state.addReturnTime);
      let totalHours = 0;
      // 全部项目每天的总工时
      let allProjTimeADay = {
        key: 'heji',
        id: '',
        activity_id: 'heji',
        activityName: '合计',
        mon: '0',
        tues: '0',
        wed: '0',
        thur: '0',
        fri: '0',
        sat: '0',
        sun: '0',
        total_hours: '0',
      }
      // 每天工时超出的状态
      let isOver24 = false;

      allProjectTime.forEach((allProjItem) => {
        // 定义合计的数值形式,数组里边一个对象
        let allTimeTable = [{
          key: 'heji',
          id: '',
          activity_id: 'heji',
          activityName: '合计',
          mon: '0',
          tues: '0',
          wed: '0',
          thur: '0',
          fri: '0',
          sat: '0',
          sun: '0',
          total_hours: '0',
        }];
        if (allProjItem.activity_list) {
          let activityListtemp = allProjItem.activity_list;
          // 计算每一个活动的总时间
          activityListtemp.forEach((actiItem) => {
            let aActivityAllTime =
              Number(actiItem.mon) +
              Number(actiItem.tues) +
              Number(actiItem.wed) +
              Number(actiItem.thur) +
              Number(actiItem.fri) +
              Number(actiItem.sat) +
              Number(actiItem.sun)
            actiItem.total_hours = aActivityAllTime;

            // 合计行的数据
            allTimeTable[0].mon = Number(allTimeTable[0].mon) + Number(actiItem.mon);
            allTimeTable[0].tues = Number(allTimeTable[0].tues) + Number(actiItem.tues);
            allTimeTable[0].wed = Number(allTimeTable[0].wed) + Number(actiItem.wed);
            allTimeTable[0].thur = Number(allTimeTable[0].thur) + Number(actiItem.thur);
            allTimeTable[0].fri = Number(allTimeTable[0].fri) + Number(actiItem.fri);
            allTimeTable[0].sat = Number(allTimeTable[0].sat) + Number(actiItem.sat);
            allTimeTable[0].sun = Number(allTimeTable[0].sun) + Number(actiItem.sun);
            allTimeTable[0].total_hours = Number(allTimeTable[0].total_hours) + Number(actiItem.total_hours);
          })


        }

        // 将所有项目周一的工时叠加，周二类似
        allProjTimeADay.mon = Number(allProjTimeADay.mon) + Number(allTimeTable[0].mon)
        allProjTimeADay.tues = Number(allProjTimeADay.tues) + Number(allTimeTable[0].tues)
        allProjTimeADay.wed = Number(allProjTimeADay.wed) + Number(allTimeTable[0].wed)
        allProjTimeADay.thur = Number(allProjTimeADay.thur) + Number(allTimeTable[0].thur)
        allProjTimeADay.fri = Number(allProjTimeADay.fri) + Number(allTimeTable[0].fri)
        allProjTimeADay.sat = Number(allProjTimeADay.sat) + Number(allTimeTable[0].sat)
        allProjTimeADay.sun = Number(allProjTimeADay.sun) + Number(allTimeTable[0].sun)
        if (Number(allProjTimeADay.mon) > 24 || Number(allProjTimeADay.tues) > 24 ||
          Number(allProjTimeADay.wed) > 24 || Number(allProjTimeADay.thur) > 24 ||
          Number(allProjTimeADay.fri) > 24 || Number(allProjTimeADay.sat) > 24 ||
          Number(allProjTimeADay.sun) > 24) {
          message.info('请勿超出24小时');
          isOver24 = true;
        }

        // 将合计行添加到对应项目之下,检验单个项目时间在全部项目时包含
        allProjItem.allTimeTable = allTimeTable;

        // 计算总工时
        totalHours = Number(totalHours) + Number(allTimeTable[0].total_hours)
      })

      // 将计算后的数据保存
      yield put({
        type: "save",
        payload: {
          allProjectTime: JSON.parse(JSON.stringify(allProjectTime)),
          totalHours: totalHours,// 全部项目的总工时
          isOver24: isOver24,
        }
      });
    },

    // 工时保存和提交
    * saveAndSubmit({saveOrSubmit}, {call, put, select}) {
      let {allProjectTime, allProjectTimeOld, timeSelect, isOver24, task_type, totalHours} = yield select(state => state.addReturnTime);
      if (isOver24) {
        message.info('请勿超出24小时！')
      } else {
        // 需要删除数据
        let arg_old_hours_list = [];
        allProjectTimeOld.forEach((projItem) => {
          if (projItem.activity_list && projItem.activity_list.length !== 0) {
            projItem.activity_list.forEach((actiItem) => {
              arg_old_hours_list.push({
                id: actiItem.id
              })
            })
          }
        })

        // 需要新增的数据
        let arg_new_hours_list = [];
        let activityItemString = [];
        allProjectTime.forEach((projItem) => {
          activityItemString = [];
          // 组合活动列表 空值时，不会向arg_new_hours_list添加
          if (projItem.activity_list && projItem.activity_list.length !== 0) {
            projItem.activity_list.forEach((actiItem) => {
              activityItemString.push({
                activity_id: actiItem.activity_id,
                mon: actiItem.mon.toString(),
                tues: actiItem.tues.toString(),
                wed: actiItem.wed.toString(),
                thur: actiItem.thur.toString(),
                fri: actiItem.fri.toString(),
                sat: actiItem.sat.toString(),
                sun: actiItem.sun.toString(),
              })
            })
            // 组合项目数据
            arg_new_hours_list.push({
              activity_list: activityItemString,
              pms_code: projItem.pms_code,
              pms_name: projItem.pms_name,
              proj_name: projItem.proj_name,
              proj_code: projItem.proj_code,
              proj_id: projItem.proj_id,
            })
          }
        })

        let postData = {
          arg_begin_time: timeSelect.weekStart,
          arg_end_time: timeSelect.weekEnd,
          arg_data_source: '0',
        };
        // 在有值时才添加数据
        if (arg_old_hours_list.length !== 0) {
          postData.arg_old_hours_list = JSON.stringify(arg_old_hours_list) // 需要删除的数据
        }

        // 点击删除时，没有新增的数据
        if (saveOrSubmit === 'submit') {
          if (arg_new_hours_list.length !== 0) {
            postData.arg_new_hours_list = JSON.stringify(arg_new_hours_list) // 需要删除的数据
          }
        }

        let data;
        // 在退回页面只有 删除 和 提交
        if (saveOrSubmit === 'delete') {
       /*   // 此处服务改为同一个服务，本周 与 补录使用相同服务
          if(task_type === 'week_timesheet_back'){
            // 填报退回删除
            data = yield call(timeManagementService.returnTimeDeleteS, postData)
            if (data.RetCode === '1') {
              message.info('工时删除成功！')
            } else {
              message.info('工时删除失败！')
            }
          } else if (task_type === 'makeup_timesheet_back') {
            // 补录退回再删除，使用填报的提交
            data = yield call(timeManagementService.returnTimeDeleteS, postData)
            if (data.RetCode === '1') {
              message.info('工时删除成功！')
            } else {
              message.info('工时删除失败！')
            }
          }*/
          data = yield call(timeManagementService.returnTimeDeleteS, postData)
          if (data.RetCode === '1') {
            message.info('工时删除成功！')
          } else {
            message.info('工时删除失败！')
          }

        } else if (saveOrSubmit === 'submit') {
          // 全部工时为0时不能提交
          if (totalHours !== 0) {
            if(task_type === 'week_timesheet_back'){
              // 填报退回再提交，使用填报的提交
              data = yield call(timeManagementService.submitTimeS, postData)
              if (data.RetCode === '1') {
                message.info('工时提交成功！')
              } else {
                message.info('工时提交失败！')
              }
            } else if (task_type === 'makeup_timesheet_back') {
              // 补录退回再提交，使用填报的提交
              data = yield call(timeManagementService.submitMakeUpTimeS, postData)
              if (data.RetCode === '1') {
                message.info('工时提交成功！')
              } else {
                message.info('工时提交失败！')
              }
            }
          } else {
            message.info('工时提交失败！您未填写任何工时！')
          }
        }

        // 操作成功之后去首页
        yield put(routerRedux.push({
          pathname: '/commonApp'
        }));
      }
    },
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    }
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/projectApp/timesheetManage/fillSendBack') {
          dispatch({
            type: 'init',
            query: query,
          });
        }
      });
    },
  }
};

