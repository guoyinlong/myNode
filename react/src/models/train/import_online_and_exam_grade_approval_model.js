/**
 *  作者: 翟金亭
 *  创建日期: 2019-08-19
 *  邮箱：zhaijt33@chinaunicom.cn
 *  文件说明：实现线上培训、认证考试成绩导入审批
 */
import * as trainService from "../../services/train/trainService";
import { message } from "antd";

export default {
  namespace: 'importGradeApprovalModel',
  state: {
    //成绩信息
    examAndOnlineGradeList: [],
    //下一环节处理人信息
    nextPersonList: [],
    //所有信息
    approvalInfoRecord: [],
    //审批意见信息
    approvalList: [],
    approvalHiList: [],
    approvalNowList: [],
    //附件信息
    fileDataList: [],
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

  effects: {
    *initQuery({ query }, { call, put }) {
      //传递参数值
      yield put({
        type: 'save',
        payload: {
          approvalInfoRecord: query,
        }
      });
      //查询成绩信息
      let params = {
        arg_import_id: query.proc_inst_id,
      }
      let gradeInfo = yield call(trainService.trainExamAndOnlineDateQuery, params);
      if (gradeInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            examAndOnlineGradeList: gradeInfo.DataRows,
          }
        })
      } else {
        message.error("没有数据");
      }

      //查询审批信息
      let approvalinfo = yield call(trainService.trainExamAndOnlineApprovalDataQuery, params);

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
        message.error("没有数据");
      }

      //查询下一处理人员信息
      let arg_deptid = query.create_person_dept_id;
      let queryparams = {};
      queryparams["arg_dept_id"] = arg_deptid;
      let nextPerson = yield call(trainService.onlineAndExamImportNextPersonQuery, queryparams);
      //部门接口人-部门经理—培训人力资源专员归档，将所有的人员查出来
      if (nextPerson.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextPersonList: nextPerson.DataRows,
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }

      //查询附件列表
      let fileData = yield call(trainService.examAndOnlineFileListQuery, params);
      if (fileData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            fileDataList: fileData.DataRows,
          }
        })
      }
    },
    *importExamGradeOperationApprovalSubmit({ transferExamData, resolve }, { call }) {
      let postData = transferExamData;
      postData["arg_rollback_flag"] = '0';
      let rollbackFlag = 0;
      try {
        const saveOnlineGradeInfo = yield call(trainService.trainExamAndOnlineGradeApprovalSubmit, transferExamData);
        if (saveOnlineGradeInfo.RetCode !== '1') {
          message.error('保存失败');
          rollbackFlag = 1;
        } else {
          message.info('保存成功');
          resolve("success");
        }
        if (rollbackFlag !== 0) {
          message.error('提交失败');
          postData["arg_rollback_flag"] = '1';
          yield call(trainService.trainExamAndOnlineGradeApprovalSubmit, postData);
          resolve("false");
        }
      } catch (error) {
        message.error('回滚失败');
        resolve("false");
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/train/train_do/train_online_exam_import_approval') {
          dispatch({ type: 'initQuery', query });
        }
      });
    }
  }
};
