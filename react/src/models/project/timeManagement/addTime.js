/**
 * 作者：王旭东
 * 创建日期：2018-8-23
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明： 工时填报modal层
 */
import {message} from "antd";
import cookie from "js-cookie";
import * as timeManagementService from "../../../services/project/timeManagementService/timeManagementService";

export default {
  namespace: "addTime",

  state: {
    begintime: '',// 本周开始时间
    endtime: '', // 本周结束时间
    allProjectTime: [], // 本周全部项目活动工时
    allProjectTimeOld: [], // 本周未变化之前的数据
    allActivityList: [], // 全部项目的活动列表
    selectProjectKey: '',// 选择的项目
    totalHours: 0, // 总工时
    invalid_date: '', // 当前项目的截止时间
    effective_date: '', // 当前项目开始时间
    isOver24: false, // 是否超出24小时
    IsCommit: '', // 当前工时是否提交 0未提交
    hasProject: true, // 是否有可填报项目 默认true
    isOutDate: '0', // 1 提交按钮灰
    hasConditions: false, //是否满足填报工时的条件
  },

  effects: {
    // 初始化
    * init({}, {call, put, select}) {

      // 初始化需要将全部变量置空
      yield put({
        type: 'save',
        payload: {
          begintime: '',// 本周开始时间
          endtime: '', // 本周结束时间
          allProjectTime: [], // 本周全部项目活动工时
          allProjectTimeOld: [], // 本周未变化之前的数据
          allActivityList: [], // 全部项目的活动列表
          selectProjectKey: '',// 选择的项目
          totalHours: 0, // 总工时
          invalid_date: '', // 当前项目的截止时间
          effective_date: '', // 当前项目开始时间
          isOver24: false, // 是否超出24小时
          IsCommit: '', // 当前工时是否提交 0未提交
          hasProject: true, // 是否有可填报项目 默认true
          hasConditions: false, //是否满足填报工时的条件
          isOutDate: '0', // 1 提交按钮灰
        }
      })

      // 查询全部活动
      yield put({
        type: 'queryAllActivities'
      })
    },

    // 查询全部活动列表
    * queryAllActivities({}, {call, put, select}) {
      let {selectProjectKey, invalid_date, effective_date} = yield select(state => state.addTime);
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
      /*let postData = {
        arg_userid: cookie.get('userid')
      }*/
      const alldata = yield call(timeManagementService.queryThisWeekDataS, postData);
      if (alldata.RetCode === '1') {
        let allProjectTime = alldata.DataRows; // 没有项目时是空数组
        if (allProjectTime.length !== 0) {
          // 对数组每一项添加统一的属性proj_pms_key = proj_id + '-'+ pms_code
          allProjectTime.forEach((item) => {
            if (item.pms_code) {
              item.proj_pms_key = item.proj_id + '-' + item.pms_code,
                item.key = item.proj_id + '-' + item.pms_code // 列表数据需要有key
            } else {
              item.proj_pms_key = item.proj_id
              item.key = item.proj_id
            }
          })
          // 将活动列表字符转换成数组，添加key
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

          // 如果初始进入页面，将选择的项目默认第一个allProjectTime[0]，否则保留原来的值
          let selectProjectKeyTemp, invalid_dateTemp, effective_dateTemp;
          if (selectProjectKey === '' && invalid_date === '' && effective_date === '') {
            selectProjectKeyTemp = allProjectTime[0].proj_pms_key;
            // invalid_dateTemp = allProjectTime[0].invalid_date;
            // effective_dateTemp = allProjectTime[0].effective_date;
            invalid_dateTemp = allProjectTime[0].end_time;
            effective_dateTemp = allProjectTime[0].begin_time;
          } else {
            selectProjectKeyTemp = selectProjectKey;
            invalid_dateTemp = invalid_date;
            effective_dateTemp = effective_date;
          }
          const postData = {
            arg_userid: cookie.get('userid'),
            arg_proj_id: selectProjectKeyTemp.split("-")[0]
          }
          const {RetCode,subtime} = yield call(timeManagementService.timesheetCheckQuery,postData)
          if(RetCode == 1) {
            if(Date.parse(subtime) < Date.parse(alldata.begintime)) {
              yield put({
                type: "save",
                payload: {
                  hasConditions: true
                }
              })
            }
          }
          yield put({
            type: 'save',
            payload: {
              begintime: alldata.begintime,
              endtime: alldata.endtime,
              allProjectTime: allProjectTime,
              allProjectTimeOld: allProjectTime, // 用于存储未变化的数据
              selectProjectKey: selectProjectKeyTemp,
              IsCommit: alldata.IsCommit, // 1 提交 0 未提交
              invalid_date: invalid_dateTemp, // 当前项目的截止时间
              effective_date: effective_dateTemp, // 当前项目开始时间
              isOutDate: alldata.isOutDate, // 1 提交按钮置灰 0不置灰
            }
          });
        } else {
          yield put({
            type: 'save',
            payload: {
              begintime: alldata.begintime,
              endtime: alldata.endtime,
              // allProjectTime: allProjectTime,
              // allProjectTimeOld: allProjectTime, // 用于存储未变化的数据
              // selectProjectKey: allProjectTime[0].proj_pms_key, // 没有项目
              IsCommit: alldata.IsCommit, // 1 提交 0 未提交
              // invalid_date: allProjectTime[0].invalid_date, // 当前项目的截止时间
              // effective_date: allProjectTime[0].effective_date, // 当前项目开始时间
              hasProject: false, // 是否有可填报项目 默认true
              isOutDate: alldata.isOutDate, // 1 提交按钮置灰 0不置灰
            }
          });

          message.info('您没有参与任何项目或者项目已经结项请联系项目经理！')
        }
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
      let {allProjectTime,begintime} = yield select(state => state.addTime);
      // 将当前项目的开始时间和结束时间保存
      let projectData = allProjectTime.filter(
        (item) => item.proj_pms_key === selectProj)[0];
      yield put({
        type: 'save',
        payload: {
          selectProjectKey: selectProj,
          invalid_date: projectData.invalid_date, // 当前项目的截止时间
          effective_date: projectData.effective_date, // 当前项目开始时间
          hasConditions: false
        }
      })
      const postData = {
        arg_userid: cookie.get('userid'),
        arg_proj_id: selectProj.split("-")[0]
      }
      const {RetCode,subtime} = yield call(timeManagementService.timesheetCheckQuery,postData)
      if(RetCode == "1") {
        if(Date.parse(subtime) < Date.parse(begintime)) {
          yield put({
            type: "save",
                  payload: {
                    hasConditions: true
                  }
          })
        }
      }
    },
    // 选择活动 当前选择的项目 selectProjectKey
    * CheckboxGroupChange({value}, {call, put, select}) {
      let {allProjectTime, allActivityList, selectProjectKey} = yield select(state => state.addTime);

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

      let {allProjectTime, selectProjectKey} = yield select(state => state.addTime);
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
      const {allProjectTime} = yield select(state => state.addTime);
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
            allTimeTable[0].mon = Number(allTimeTable[0].mon) + Number(actiItem.mon)
            allTimeTable[0].tues = Number(allTimeTable[0].tues) + Number(actiItem.tues)
            allTimeTable[0].wed = Number(allTimeTable[0].wed) + Number(actiItem.wed)
            allTimeTable[0].thur = Number(allTimeTable[0].thur) + Number(actiItem.thur)
            allTimeTable[0].fri = Number(allTimeTable[0].fri) + Number(actiItem.fri)
            allTimeTable[0].sat = Number(allTimeTable[0].sat) + Number(actiItem.sat)
            allTimeTable[0].sun = Number(allTimeTable[0].sun) + Number(actiItem.sun)
            allTimeTable[0].total_hours = Number(allTimeTable[0].total_hours) + Number(actiItem.total_hours)
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
        /* if (Number(allTimeTable[0].mon) > 24 || Number(allTimeTable[0].tues) > 24 ||
           Number(allTimeTable[0].wed) > 24 || Number(allTimeTable[0].thur) > 24 ||
           Number(allTimeTable[0].fri) > 24 || Number(allTimeTable[0].sat) > 24 ||
           Number(allTimeTable[0].sun) > 24) {
           message.info('请勿超出24小时')
         }*/

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
      let {allProjectTime, allProjectTimeOld, begintime, endtime, isOver24, totalHours} = yield select(state => state.addTime);
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
          arg_begin_time: begintime,
          arg_end_time: endtime,
          arg_data_source: '0',
        };

        // 在有值时才添加数据
        if (arg_old_hours_list.length !== 0) {
          postData.arg_old_hours_list = JSON.stringify(arg_old_hours_list) // 需要删除的数据
        }

        postData.arg_new_hours_list = JSON.stringify(arg_new_hours_list)


        let data;
        if (saveOrSubmit === 'save') {
          data = yield call(timeManagementService.saveTimeS, postData);
          if (data.RetCode === '1') {
            message.info('工时保存成功！')
          } else {
            message.info('工时保存失败！')
          }
        } else if (saveOrSubmit === 'submit') {
          // 全部工时不为 0 才可以提交
          if (totalHours !== 0) {
            data = yield call(timeManagementService.submitTimeS, postData)
            if (data.RetCode === '1') {
              message.info('工时提交成功！')
            } else {
              message.info('工时提交失败！')
            }
          } else {
            message.info('工时提交失败！您未填写任何工时！')
          }

        }

        // 保存成功之后刷新数据
        yield put({
          type: 'queryAllActivities'
        })
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
      return history.listen(({pathname}) => {
        if (pathname === '/projectApp/timesheetManage/timesheetFillin') {
          dispatch({type: 'init'});
        }
      });
    },
  }
};
