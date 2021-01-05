/**
 *  作者: 王福江
 *  创建日期: 2019-11-21
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：评议功能
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import * as appraiseService from "../../services/appraise/appraiseService";
import * as costService from "../../services/cost/costService";

export default {
  namespace: 'oraganApprovalModel',
  state: {
    commentDataList: [],
    commentData1: [],
    commentData2: [],
    commentData3: [],
    year: new Date().getFullYear(),
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    //初始化
    *initOraganApproval({ query }, { call, put }) {
      let queryParam = {
        arg_ou_id: Cookie.get('OUID')
      };
      const commentData = yield call(appraiseService.commentListQuery, queryParam);
      if (commentData.RetCode === '1') {
        let commentData1 = [];
        let commentData2 = [];
        let commentData3 = [];
        for (let i = 0; i < commentData.DataRows.length; i++) {
          commentData.DataRows[i]['indexID'] = i + 1;
          commentData.DataRows[i]['ID'] = i + 1;
          if (commentData.DataRows[i].comment_info_type === '1') {
            commentData1.push(commentData.DataRows[i]);
          } else if (commentData.DataRows[i].comment_info_type === '2') {
            commentData2.push(commentData.DataRows[i]);
          } else {
            commentData3.push(commentData.DataRows[i]);
          }
        }
        yield put({
          type: 'save',
          payload: {
            year: query.comment_year,
            commentDataList: commentData.DataRows,
            commentData1: commentData1,
            commentData2: commentData2,
            commentData3: commentData3
          }
        });
      } else {
        message.error('查询失败！');
      }
    },
    //提交评议
    *startOraganApproval({ arg_year, datalist1, datalist2, datalist3, resolve }, { call, put }) {

      let insertlist = [];
      for (let i = 0; i < datalist1.length; i++) {
        let insertparam = {};
        insertparam['ou_id'] = Cookie.get('OUID');
        insertparam['ou_name'] = Cookie.get('OU');
        insertparam['year'] = arg_year;
        insertparam['comment_id'] = datalist1[i].check_id;
        insertparam['comment_result'] = datalist1[i].sel_value;
        insertparam['comment_type'] = '1';
        insertlist.push(insertparam);
      }
      for (let i = 0; i < datalist2.length; i++) {
        let insertparam = {};
        insertparam['ou_id'] = Cookie.get('OUID');
        insertparam['ou_name'] = Cookie.get('OU');
        insertparam['year'] = arg_year;
        insertparam['comment_id'] = datalist2[i].check_id;
        insertparam['comment_result'] = datalist2[i].sel_value;
        insertparam['comment_type'] = '2';
        insertlist.push(insertparam);
      }
      for (let i = 0; i < datalist3.length; i++) {
        let insertparam = {};
        insertparam['ou_id'] = Cookie.get('OUID');
        insertparam['ou_name'] = Cookie.get('OU');
        insertparam['year'] = arg_year;
        insertparam['comment_id'] = datalist3[i].check_id;
        insertparam['comment_result'] = datalist3[i].sel_value;
        insertparam['comment_type'] = '3';
        insertlist.push(insertparam);
      }
      let insertparam = {};
      insertparam['transjsonarray'] = JSON.stringify(insertlist);
      let insertRet = yield call(appraiseService.commentOraganSubmit, insertparam);
      if (insertRet.RetCode !== '1') {
        resolve("false");
        message.info('提交失败');
        return;
      }
      let updateparam = {};
      updateparam['arg_ou_id'] = Cookie.get('OUID');
      updateparam['arg_year'] = arg_year;
      updateparam['arg_user_id'] = Cookie.get('userid');
      let updateRet = yield call(appraiseService.commentOraganUpdate, updateparam);
      if (updateRet.RetCode === '1') {
        resolve("success");
        message.info('提交成功');
      } else {
        resolve("false");
        message.info('提交失败');
      }

    },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/appraise/approvalInfo/oraganApproval') {
          dispatch({ type: 'initOraganApproval', query });
        }
      });
    }
  }
}
