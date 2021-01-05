/**
 *  作者: 王福江
 *  创建日期: 2019-07-15
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：培训计划审批功能
 */
import Cookie from "js-cookie";
import { message } from "antd";
import * as trainService from "../../services/train/trainService";
import * as overtimeService from "../../services/overtime/overtimeService";

export default {
  namespace: 'train_plan_approval_model',
  state: {
    dataInfoList: [],
    approvalList: [],
    approvalHiList: [],
    approvalNowList: [],
    nextPersonList: [],
    create_person: [],
    proc_inst_id: '',
    proc_task_id: '',
    apply_task_id: '',
    create_person_id: '',
    apply_type: '',
    //调整原因
    changeReason: '',
    //培训类型
    trainType: '',
    if_budget: ''
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  },
  effects: {
    * trainPlanApprovalInit({ query }, { call, put }) {
      console.log("****************************************************");
      console.log(query);
      console.log("****************************************************");
      yield put({
        type: 'save',
        payload: {
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_task_id: query.task_id,
          create_person_id: query.create_person,
          apply_type: query.approvalType,
        }
      });

      let params = {
        arg_plan_id: query.task_id,
        arg_plan_type: query.approvalType
      }

      //查询课程信息
      let queryClassInfo = yield call(trainService.applyCenterClassQuery, params);

      if (queryClassInfo.RetCode === '1' && queryClassInfo.DataRows.length > 0) {

        let dataInfoList = [];

        //基础信息
        let basicInfoList_com = [
          { indexName: 'class_name', showName: '课程名称' },
          { indexName: 'train_level', showName: '培训级别' },
          { indexName: 'train_type', showName: '计划类型' },
          { indexName: 'assign_score', showName: '赋分规则' },
          { indexName: 'train_hour', showName: '培训时长' },
          { indexName: 'train_year', showName: '培训年份' },
          { indexName: 'train_time', showName: '培训季度' },
          { indexName: 'train_fee', showName: '培训费用' },
          { indexName: 'duty_dept', showName: '责任部门' },
          { indexName: 'deptname', showName: '落地组织机构' },
          { indexName: 'if_budget', showName: '是否超预算' }
        ];
        //基础信息
        let basicInfoList_ele = [
          { indexName: 'class_name', showName: '课程名称' },
          { indexName: 'train_level', showName: '培训级别' },
          { indexName: 'train_type', showName: '计划类型' },
          { indexName: 'assign_score', showName: '赋分规则' },
          { indexName: 'train_hour', showName: '培训时长' },
          { indexName: 'train_year', showName: '培训年份' },
          { indexName: 'train_fee', showName: '培训费用' },
          { indexName: 'duty_dept', showName: '责任部门' },
          { indexName: 'deptname', showName: '落地组织机构' },
          { indexName: 'if_budget', showName: '是否超预算' },
        ];
        //基础信息
        let basicInfoList_dept = [
          { indexName: 'class_name', showName: '课程名称' },
          { indexName: 'train_level', showName: '培训级别' },
          { indexName: 'train_type', showName: '计划类型' },
          { indexName: 'assign_score', showName: '赋分规则' },
          { indexName: 'train_group', showName: '培训对象' },
          { indexName: 'train_person', showName: '培训人数' },
          { indexName: 'train_hour', showName: '培训时长' },
          { indexName: 'train_year', showName: '培训年份' },
          { indexName: 'train_time', showName: '培训时间' },
          { indexName: 'train_fee', showName: '培训费用' },
          { indexName: 'duty_dept', showName: '责任部门' },
          { indexName: 'deptname', showName: '落地组织机构' },
          { indexName: 'if_budget', showName: '是否超预算' },
        ];
        //基础信息
        let basicInfoList_exam = [
          { indexName: 'exam_name', showName: '认证考试名称' },
          { indexName: 'exam_person_name', showName: '考试人员' },
          { indexName: 'claim_fee', showName: '考试年份' },
          { indexName: 'exam_time', showName: '考试时间' },
          { indexName: 'exam_fee', showName: '考试费用预算' },
          { indexName: 'if_budget', showName: '是否超预算' },

        ];
        let oldInfo = queryClassInfo.DataRows[0];
        if (query.approvalType === '1') {
          if (queryClassInfo.DataRows.length > 1) {
            let newInfo = queryClassInfo.DataRows[1];
            for (let i = 0; i < basicInfoList_com.length; i++) {
              let obj = {};
              obj.module = '基础信息';
              obj.modifyItem = basicInfoList_com[i].showName;
              obj.is_diff = newInfo[basicInfoList_com[i].indexName] === oldInfo[basicInfoList_com[i].indexName] ? '0' : '1';
              obj.oldValue = basicInfoList_com[i].indexName in oldInfo &&
                oldInfo[basicInfoList_com[i].indexName] !== null
                ? (basicInfoList_com[i].indexName === 'if_budget' ? (oldInfo[basicInfoList_com[i].indexName] === '0' ? '未超预算' : '已超预算') : oldInfo[basicInfoList_com[i].indexName]) : '-';
              obj.newValue = basicInfoList_com[i].indexName in oldInfo &&
                newInfo[basicInfoList_com[i].indexName] !== null
                ? (basicInfoList_com[i].indexName === 'if_budget' ? (newInfo[basicInfoList_com[i].indexName] === '0' ? '未超预算' : '已超预算') : newInfo[basicInfoList_com[i].indexName]) : '-';

              if (i === 0) {
                obj.rowSpan = basicInfoList_com.length;
              } else {
                obj.rowSpan = 0;
              }
              dataInfoList.push(obj);
            };
            yield put({
              type: 'save',
              payload: {
                if_budget: query.if_budget,
              }
            });

          } else if (queryClassInfo.DataRows.length < 2) {
            let oldInfo = queryClassInfo.DataRows[0];
            for (let i = 0; i < basicInfoList_com.length; i++) {
              let obj = {};
              obj.module = '基础信息';
              obj.modifyItem = basicInfoList_com[i].showName;
              obj.is_diff = '1';
              obj.oldValue = basicInfoList_com[i].indexName in oldInfo &&
                oldInfo[basicInfoList_com[i].indexName] !== null
                ? (basicInfoList_com[i].indexName === 'if_budget' ? (oldInfo[basicInfoList_com[i].indexName] === '0' ? '未超预算' : '已超预算') : oldInfo[basicInfoList_com[i].indexName]) : '-';
              obj.newValue = '计划已申请撤销';
              if (i === 0) {
                obj.rowSpan = basicInfoList_com.length;
              } else {
                obj.rowSpan = 0;
              }
              dataInfoList.push(obj);
            };
            yield put({
              type: 'save',
              payload: {
                if_budget: query.if_budget,
              }
            });
          }
        } else if (query.approvalType === '2') {
          if (queryClassInfo.DataRows.length > 1) {
            let newInfo = queryClassInfo.DataRows[1];
            for (let i = 0; i < basicInfoList_ele.length; i++) {
              let obj = {};
              obj.module = '基础信息';
              obj.modifyItem = basicInfoList_ele[i].showName;
              obj.is_diff = newInfo[basicInfoList_ele[i].indexName] === oldInfo[basicInfoList_ele[i].indexName] ? '0' : '1';
              obj.oldValue = basicInfoList_ele[i].indexName in oldInfo &&
                oldInfo[basicInfoList_ele[i].indexName] !== null
                ? (basicInfoList_ele[i].indexName === 'if_budget' ? (oldInfo[basicInfoList_ele[i].indexName] === '0' ? '未超预算' : '已超预算') : oldInfo[basicInfoList_ele[i].indexName]) : '-';
              obj.newValue = basicInfoList_ele[i].indexName in oldInfo &&
                newInfo[basicInfoList_ele[i].indexName] !== null
                ? (basicInfoList_ele[i].indexName === 'if_budget' ? (newInfo[basicInfoList_ele[i].indexName] === '0' ? '未超预算' : '已超预算') : newInfo[basicInfoList_ele[i].indexName]) : '-';
              if (i === 0) {
                obj.rowSpan = basicInfoList_ele.length;
              } else {
                obj.rowSpan = 0;
              }
              dataInfoList.push(obj);
            };
            yield put({
              type: 'save',
              payload: {
                if_budget: query.if_budget,
              }
            });
          } else if (queryClassInfo.DataRows.length < 2) {
            let oldInfo = queryClassInfo.DataRows[0];
            for (let i = 0; i < basicInfoList_ele.length; i++) {
              let obj = {};
              obj.module = '基础信息';
              obj.modifyItem = basicInfoList_ele[i].showName;
              obj.is_diff = '1';
              obj.oldValue = basicInfoList_ele[i].indexName in oldInfo &&
                oldInfo[basicInfoList_ele[i].indexName] !== null
                ? (basicInfoList_ele[i].indexName === 'if_budget' ? (oldInfo[basicInfoList_ele[i].indexName] === '0' ? '未超预算' : '已超预算') : oldInfo[basicInfoList_ele[i].indexName]) : '-';
              obj.newValue = '计划已申请撤销';
              if (i === 0) {
                obj.rowSpan = basicInfoList_ele.length;
              } else {
                obj.rowSpan = 0;
              }
              dataInfoList.push(obj);
            };
            yield put({
              type: 'save',
              payload: {
                if_budget: query.if_budget,
              }
            });
          }
        } else if (query.approvalType === '3') {
          if (queryClassInfo.DataRows.length > 1) {
            let newInfo = queryClassInfo.DataRows[1];
            for (let i = 0; i < basicInfoList_dept.length; i++) {
              let obj = {};
              obj.module = '基础信息';
              obj.modifyItem = basicInfoList_dept[i].showName;
              obj.is_diff = newInfo[basicInfoList_dept[i].indexName] === oldInfo[basicInfoList_dept[i].indexName] ? '0' : '1';
              obj.oldValue = basicInfoList_dept[i].indexName in oldInfo &&
                oldInfo[basicInfoList_dept[i].indexName] !== null
                ? (basicInfoList_dept[i].indexName === 'if_budget' ? (oldInfo[basicInfoList_dept[i].indexName] === '0' ? '未超预算' : '已超预算') : oldInfo[basicInfoList_dept[i].indexName]) : '-';
              obj.newValue = basicInfoList_dept[i].indexName in oldInfo &&
                newInfo[basicInfoList_dept[i].indexName] !== null
                ? (basicInfoList_dept[i].indexName === 'if_budget' ? (newInfo[basicInfoList_dept[i].indexName] === '0' ? '未超预算' : '已超预算') : newInfo[basicInfoList_dept[i].indexName]) : '-';
              if (i === 0) {
                obj.rowSpan = basicInfoList_dept.length;
              } else {
                obj.rowSpan = 0;
              }
              dataInfoList.push(obj);
            };
            yield put({
              type: 'save',
              payload: {
                if_budget: query.if_budget,
              }
            });
          } else if (queryClassInfo.DataRows.length < 2) {
            let oldInfo = queryClassInfo.DataRows[0];
            for (let i = 0; i < basicInfoList_dept.length; i++) {
              let obj = {};
              obj.module = '基础信息';
              obj.modifyItem = basicInfoList_dept[i].showName;
              obj.is_diff = '1';
              obj.oldValue = basicInfoList_dept[i].indexName in oldInfo &&
                oldInfo[basicInfoList_dept[i].indexName] !== null
                ? (basicInfoList_dept[i].indexName === 'if_budget' ? (oldInfo[basicInfoList_dept[i].indexName] === '0' ? '未超预算' : '已超预算') : oldInfo[basicInfoList_dept[i].indexName]) : '-';

              obj.newValue = '计划已申请撤销';
              if (i === 0) {
                obj.rowSpan = basicInfoList_dept.length;
              } else {
                obj.rowSpan = 0;
              }
              dataInfoList.push(obj);
            };
            yield put({
              type: 'save',
              payload: {
                if_budget: query.if_budget,
              }
            });
          }
        } else if (query.approvalType === '4') {
          if (queryClassInfo.DataRows.length > 1) {
            let newInfo = queryClassInfo.DataRows[1];
            for (let i = 0; i < basicInfoList_exam.length; i++) {
              let obj = {};
              obj.module = '基础信息';
              obj.modifyItem = basicInfoList_exam[i].showName;
              obj.is_diff = newInfo[basicInfoList_exam[i].indexName] === oldInfo[basicInfoList_exam[i].indexName] ? '0' : '1';
              obj.oldValue = basicInfoList_exam[i].indexName in oldInfo &&
                oldInfo[basicInfoList_exam[i].indexName] !== null
                ? (basicInfoList_exam[i].indexName === 'if_budget' ? (oldInfo[basicInfoList_exam[i].indexName] === '0' ? '未超预算' : '已超预算') : oldInfo[basicInfoList_exam[i].indexName]) : '-';
              obj.newValue = basicInfoList_exam[i].indexName in newInfo &&
                newInfo[basicInfoList_exam[i].indexName] !== null
                ? (basicInfoList_exam[i].indexName === 'if_budget' ? (newInfo[basicInfoList_exam[i].indexName] === '0' ? '未超预算' : '已超预算') : newInfo[basicInfoList_exam[i].indexName]) : '-';
              if (i === 0) {
                obj.rowSpan = basicInfoList_exam.length;
              } else {
                obj.rowSpan = 0;
              }
              dataInfoList.push(obj);
            };
            yield put({
              type: 'save',
              payload: {
                if_budget: query.if_budget,
              }
            });
          } else if (queryClassInfo.DataRows.length < 2) {
            let oldInfo = queryClassInfo.DataRows[0];
            for (let i = 0; i < basicInfoList_exam.length; i++) {
              let obj = {};
              obj.module = '基础信息';
              obj.modifyItem = basicInfoList_exam[i].showName;
              obj.is_diff = '1';
              obj.oldValue = basicInfoList_exam[i].indexName in oldInfo &&
                oldInfo[basicInfoList_exam[i].indexName] !== null
                ? (basicInfoList_exam[i].indexName === 'if_budget' ? (oldInfo[basicInfoList_exam[i].indexName] === '0' ? '未超预算' : '已超预算') : oldInfo[basicInfoList_exam[i].indexName]) : '-';
              obj.newValue = '认证考试已申请撤销';
              if (i === 0) {
                obj.rowSpan = basicInfoList_exam.length;
              } else {
                obj.rowSpan = 0;
              }
              dataInfoList.push(obj);
            };
            yield put({
              type: 'save',
              payload: {
                if_budget: query.if_budget,
              }
            });
          }
        } else {
          if (queryClassInfo.DataRows.length > 0) {
            dataInfoList = queryClassInfo.DataRows;
          }
        }
        dataInfoList.forEach((item, index) => {
          item.key = index;
        });

        yield put({
          type: 'save',
          payload: {
            dataInfoList: dataInfoList,
            changeReason: oldInfo.remark,
            trainType: query.approvalType,
            proc_inst_id: query.proc_inst_id,
            proc_task_id: query.proc_task_id,
            apply_task_id: query.task_id,
          }
        });
      } else {
        return;
      }

      //查询审批信息
      let approvalinfo = yield call(trainService.applyApprovalQuery, params);
      if (approvalinfo.RetCode === '1') {
        let approvalHiList = [];
        let approvalNowList = [];
        for (let i = 0; i < approvalinfo.DataRows.length; i++) {
          if (approvalinfo.DataRows[i].task_type_id === '1') {
            approvalinfo.DataRows[i].key = i;
            approvalHiList.push(approvalinfo.DataRows[i]);
          } else {
            approvalinfo.DataRows[i].key = i;
            approvalNowList.push(approvalinfo.DataRows[i]);
          }
        }
        yield put({
          type: 'save',
          payload: {
            approvalList: approvalinfo.DataRows,
            approvalHiList: approvalHiList,
            approvalNowList: approvalNowList,
          }
        })
      } else {
        return;
      }
      //查询下一环节处理人
      let personinfo = {
        arg_proc_inst_id: query.proc_inst_id
      };
      let nextData = yield call(overtimeService.nextPersonListQuery, personinfo);
      if (nextData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextPersonList: nextData.DataRows,
            create_person: [{ create_person_id: query.create_person_name, create_person_name: query.create_person_name }],
          }
        })
      } else {
        message.error("查询下一环节处理人为空");
      }
    },

    *submitApproval({ approval_if, approval_advice, nextstepPerson, nextstep, orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id, approval_type, if_budget, resolve }, { call, put }) {
      console.log("+++++++++++++++++++++++++++++++++++++++++++");
      console.log(orig_proc_task_id);
      console.log(if_budget);
      console.log("+++++++++++++++++++++++++++++++++++++++++++");
      let submitparams = {
        arg_proc_id: orig_proc_inst_id,
        arg_apply_id: orig_apply_task_id,
        arg_approval_type: approval_type,
        arg_approval_if: approval_if,
        arg_approval_advice: approval_advice,
        arg_task_id: '',
        arg_if_end: '',
        arg_post_id: '',
        arg_next_person: nextstepPerson,
        arg_nextstep: nextstep
      }
      //最后一步
      if (nextstepPerson === '结束' || nextstepPerson === 'end' || nextstepPerson === '' || nextstepPerson === null) {
        submitparams.arg_if_end = '1';
        let procparams = {
          taskId: orig_proc_task_id,
        }
        yield call(overtimeService.overtimeFlowComplete, procparams);

        let updateCompleteData = yield call(trainService.trainPlanApprovalOperate, submitparams);
        if (updateCompleteData.RetCode === '1') {
          resolve("success");
          message.info('归档成功');
        } else {
          resolve("false");
          message.error('归档失败');
        }

      } else if (approval_if == "同意") {
        //是否超出预算
        submitparams.arg_if_end = '0';
        let param = {}
        param["taskId"] = orig_proc_task_id;
        let listenersrc = '{addtrainnext:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenersrc;
        //param["form"] = '{if_budget:' + if_budget + '}';
        param["form"] = '{deptid:"'+Cookie.get('OUID')+ '"}';

        let flowTerminateData = yield call(overtimeService.overtimeFlowComplete, param);
        submitparams.arg_task_id = flowTerminateData.DataRows[0].taskId;

        let updateCompleteData = yield call(trainService.trainPlanApprovalOperate, submitparams);
        //console.log(updateCompleteData);
        if (updateCompleteData.RetCode === '1') {
          resolve("success");
          message.info('提交成功');
        } else {
          resolve("false");
          message.error('提交失败');
        }
      } else {//驳回
        submitparams.arg_if_end = '0';
        let projectparams = {
          procInstId: orig_proc_inst_id,
        }
        yield call(overtimeService.overtimeFlowTerminate, projectparams);
        //驳回功能，新增待办
        //yield call(overtimeService.leaveUpdateTerminate,submitparams);

        let updateTerminateData = yield call(trainService.trainPlanApprovalOperate, submitparams);
        if (updateTerminateData.RetCode === '1') {
          resolve("success");
          message.info('提交成功');
        } else {
          resolve("false");
          message.error('提交失败');
        }
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        dispatch({ type: 'trainPlanApprovalInit', query });
      /*  if (pathname === '/humanApp/train/train_do/train_plan_look_dept') {
          dispatch({ type: 'trainPlanApprovalInit', query });
       }
        if (pathname === '/humanApp/train/train_do/train_plan_approval_dept') {
           dispatch({ type: 'trainPlanApprovalInit', query });
        }
        if (pathname === '/humanApp/train/train_do/train_plan_approval') {
          dispatch({ type: 'trainPlanApprovalInit', query });
        }*/

      });
    }
  }
}
