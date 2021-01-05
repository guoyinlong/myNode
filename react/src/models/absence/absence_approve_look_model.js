/**
 * 文件说明：请假管理-已办查看
 * 作者：郭西杰
 * 邮箱：郭西杰@chinaunicom.cn
 * 创建日期：2020-4-27
 */

import Cookie from "js-cookie";
import * as overtimeService from "../../services/overtime/overtimeService"
import { message } from "antd";
import { OU_NAME_CN, OU_HQ_NAME_CN } from '../../utils/config';
import * as absenceService from "../../services/absence/absenceService";

const auth_ou = Cookie.get('OU');
let auth_ou_flag = auth_ou;
if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}

export default {
  namespace: 'absence_approve_look_model',
  state: {
    //下一环节处理名称及处理人
    nextPersonList: [],
    nextPostName: '',
    create_person: [],
    //传递的参数
    approvalInfoRecord: [],
    //审批信息
    approvalList: [],
    approvalHiList: [],
    approvalNowList: [],
    //参训人员查询
    applyPersonInfo: [],
    personsList: [],
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    *absenceApplyApproval({ query }, { call, put }) {
      // 查询申请人基本信息
      let absence_apply_type1 = '';
      if (query.absence_apply_type === '调休申请') {
        absence_apply_type1 = '0'
      }
      else if (query.absence_apply_type === '年假申请') {
        absence_apply_type1 = '2'
      }
      else if (query.absence_apply_type === '事假申请') {
        absence_apply_type1 = '1'
      }

      let applyPersonParams = {
        arg_absence_apply_id: query.absence_apply_id,
        arg_absence_apply_type: absence_apply_type1,
      }

      let applyPersonInfo = yield call(absenceService.absenceApplyPersonsInfo, applyPersonParams);

      if (applyPersonInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            applyPersonInfo: applyPersonInfo.DataRows,
            editAble: query.editAble,
          }
        })
      } else {
        message.error("没有数据");
      }

      //查询审批信息
      let params = {
        arg_absence_apply_id: query.absence_apply_id,
      }
      //查询审批信息
      let approvalinfo = yield call(absenceService.absenceApplyApprovalListQuery, params);
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

      //查询请假人员信息
      let personParams = {
        arg_absence_apply_id: query.absence_apply_id,
        arg_absence_apply_type: absence_apply_type1,
      }
      let personInfo = yield call(absenceService.absenceApplyPersons, personParams);
      if (personInfo.RetCode === '1') {
        for (let i = 0; i < personInfo.DataRows.length; i++) {
          personInfo.DataRows[i]['indexID'] = i + 1;
        }
        yield put({
          type: 'save',
          payload: {
            personsList: personInfo.DataRows,
          }
        })
      } else {
        message.error("没有数据");
      };

      //阅后即焚
      let if_reback = query.if_reback;
      if (if_reback === '1') {
        let param = {
          arg_absence_apply_id: query.absence_apply_id
        };
        yield call(absenceService.approvalConcel, param);
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/absence/absenceIndex/absence_approve_look') {
          dispatch({ type: 'absenceApplyApproval', query });
        }
        if (pathname === '/humanApp/absence/absenceIndex/year_approve_look') {
          dispatch({ type: 'absenceApplyApproval', query });
        }
        if (pathname === '/humanApp/absence/absenceIndex/affair_approval_look') {
          dispatch({ type: 'absenceApplyApproval', query });
        }
      });
    }
  }
};
