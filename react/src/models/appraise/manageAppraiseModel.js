/**
 *  作者: 翟金亭
 *  创建日期: 2019-11-19
 *  邮箱：zhaijt3@chinaunicom.cn
 *  文件说明：实现干部管理的各功能
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import * as appraiseService from "../../services/appraise/appraiseService";

export default {
  namespace: 'manageAppraiseModel',
  state: {
    //评议内容
    commentInfoDatas: [],
    //新的评议内容类型
    newCommentInfoType: [],
    //评议-个人评议
    commentPersonInfo: [],
    //首评=1/复评=2
    evaluationTime: '',
    //评议批次
    approval_batch: '',
    //评议人类型：0,1,2
    appraisePersonType: '',
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    //查询评议内容
    *initCommentInfoQuery({ queryParam }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          commentInfoDatas: []
        }
      });
      let postParam = {
        arg_ou_id: Cookie.get("OUID"),
      };
      const detailsData = yield call(appraiseService.getCommentInfoQuery, postParam);
      if (detailsData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            commentInfoDatas: detailsData.DataRows,
          }
        });
      } else {
        message.info("尚未有评议内容！");
      }
    },
    //跳转新增评议内容项
    *initNewCommentInfoAddQuery({ query }, { put }) {
      yield put({
        type: 'save',
        payload: {
          newCommentInfoType: query
        }
      });
    },
    //修改评议内容项
    *updateCommentInfo({ transferUpdateCommentList, arg_comment_info_id, resolve }, { call }) {
      let postParam = {
        arg_comment_info_id: arg_comment_info_id
      }
      let j = 0;
      for (let i = 0; i < transferUpdateCommentList.length; i++) {
        const saveCommentInfo = yield call(appraiseService.updateCommentInfo, transferUpdateCommentList[i]);
        if (saveCommentInfo.RetCode !== '1') {
          j = 1;
          message.error("更新失败，正在回滚");
          const deleteCommentInfo = yield call(appraiseService.deleteCommentInfo, postParam);
          if (deleteCommentInfo.RetCode === '1') {
            message.info("回滚成功！");
          } else {
            message.error("回滚失败！");
          }
          break;
        }
      }
      if (j === 0) {
        resolve("success");
      } else {
        resolve("false");
      }
    },
    //删除评议内容项
    *deleteCommentInfo({ arg_comment_info_id, resolve }, { call }) {
      let postParam = {
        arg_comment_info_id: arg_comment_info_id
      }
      const deleteCommentInfo = yield call(appraiseService.deleteCommentInfo, postParam);
      if (deleteCommentInfo.RetCode === '1') {
        resolve("success");
      } else {
        resolve("false");
      }
    },
    //个人评议功能初始化
    *initPersonCommentApprovalQuery({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          commentPersonInfo: [],
          appraisePersonType: [],
          evaluationTime: query.comment_type,
          approval_batch: query.task_id
        }
      });
      let postParam = {
        arg_ou_id: Cookie.get("OUID"),
        arg_user_id: Cookie.get("userid"),
        arg_approval_batch: query.task_id,
      }

      const approvalCommentInfo = yield call(appraiseService.apprasiePersonCommentInfoQuery, postParam);
      if (approvalCommentInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            commentPersonInfo: approvalCommentInfo.DataRows,
          }
        });
      } else {
        message.info("尚未有待评议内容！");
      }

      let personTypeParam = {
        arg_user_id: Cookie.get("userid"),
        arg_ou_id: Cookie.get("OUID"),
      }

      const appraisePersonTypeInfo = yield call(appraiseService.apprasiePersonTypeQuery, personTypeParam);
      if (appraisePersonTypeInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            appraisePersonType: appraisePersonTypeInfo.DataRows,
          }
        });
      } else {
        message.info("查询中···");
      }
    },
    //新增评议内容项
    *addCommentInfo({ transferAddCommentList, resolve }, { call }) {
      let j = 0;
      for (let i = 0; i < transferAddCommentList.length; i++) {
        const addCommentInfo = yield call(appraiseService.addCommentInfo, transferAddCommentList[i]);
        if (addCommentInfo.RetCode !== '1') {
          j = 1;
          message.error("新增失败，正在回滚");
          break;
        }
      }
      if (j === 0) {
        resolve("success");
      } else {
        resolve("false");
      }
    },
    //评议内容提交
    *commentApprovalOperation({ transferApprovalList, resolve }, { call }) {
      let j = 0;
      for (let i = 0; i < transferApprovalList.length; i++) {
        const commentApprovalRes = yield call(appraiseService.commentApprovalSubmit, transferApprovalList[i]);
        if (commentApprovalRes.RetCode !== '1') {
          j = 1;
          message.error("评议失败，正在撤回");
          break;
        }
      }
      if (j === 0) {
        resolve("success");
      } else {
        resolve("false");
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/appraise/commentInfo') {
          dispatch({ type: 'initCommentInfoQuery', query });
        }
        if (pathname === '/humanApp/appraise/approvalInfo') {
          dispatch({ type: 'initCommentInfoQuery', query });
        }
        if (pathname === '/humanApp/appraise/newCommentInfoAdd') {
          dispatch({ type: 'initNewCommentInfoAddQuery', query });
        }
        if (pathname === '/humanApp/appraise/approvalInfo/commentApproval') {
          dispatch({ type: 'initPersonCommentApprovalQuery', query });
        }
      });
    }
  }
}
