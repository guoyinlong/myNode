/**
 * 作者：郭西杰
 * 创建日期：2020-08-27
 * 邮箱：guoxj116@chinaunicom.cn 
 * 文件说明：人工成本管理：验证码进入
 */
import Cookie from 'js-cookie';
import {message} from "antd";
import * as costService from "../../services/cost/costService";
const auth_tenantid = Cookie.get('tenantid');

export default {
  namespace:'costVerifyModel',
  state:{
    //工资项信息
    titleDataList:[],
    rand_code:'',
    codeVerify:'',
  },
  reducers:{
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },
  effects: {
    *initManageQuery({query}, {call, put}) {
      yield put({
        type: 'save',
        rand_code: ''
      });
      },
    *initManageIndexQuery({query}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          codeVerify: query.VerifyCode,
        }        
      });
      },
    *sentVerifyCode({arg_param}, {call, put}) {

      let paramCode = {}
      paramCode["arg_user_id"] = arg_param.arg_user_id;
      paramCode["arg_module_type"] = arg_param.arg_module_type;
      const sentVerifyCodeResult = yield call(costService.sentVerifyCodeSave, paramCode);
      let sentVerifyCodeResultList = [];
      sentVerifyCodeResultList = sentVerifyCodeResult.DataRows;

      if (sentVerifyCodeResult.RetCode !== '1') {
        message.error("验证码发送失败请重试");
        rollbackFlag = 1;
        return;
      }

      let param = {
        //验证码申请启动工作流标识
        start_type: 'sendMessage',
      };
      let email = arg_param.arg_email
      let userName = arg_param.arg_user_name
      let randCode = sentVerifyCodeResult.RetVal;

      param["form"] = '{email:"'  +email+  '", userName:"' +userName+ '", randCode:"' +randCode+ '"}';
      const sentVerifyCodeFlowStartResult = yield call(costService.sentVerifyCodeApplyFlowStart, param);
      let sentVerifyCodeStartList = [];
      if (sentVerifyCodeFlowStartResult.RetCode === '1') {
        sentVerifyCodeStartList = sentVerifyCodeFlowStartResult.DataRows[0];
      }
      else {
        message.error('Service sentVerifyCodeFlowStart ' + sentVerifyCodeFlowStartResult.RetVal);
        resolve("false");
        return;
      }
    },
    *queryVerifyCode({arg_param,resolve}, {call, put}) {

      let paramCode = {}
      paramCode["arg_user_id"] = arg_param.arg_user_id;
      paramCode["arg_module_type"] = arg_param.arg_module_type;
      const sentVerifyCodeResult = yield call(costService.sentVerifyCodeQery, paramCode);
      let sentVerifyCodeResultList = [];
      sentVerifyCodeResultList = sentVerifyCodeResult.DataRows;
      if (sentVerifyCodeResult.RetVal !== '1') {
        message.error(sentVerifyCodeResult.RetVal);
        resolve("false");
        return;
      }else
      {
        resolve("success");
      }
      yield put({
        type: 'save',
        payload: {
          rand_code: sentVerifyCodeResultList[0].rand_code,
        }
      });
    },
    *queryVerifyCodeIndex({query}, {call, put}) {

      let paramCode = {}
      
      paramCode["arg_user_id"] = Cookie.get("userid");
      paramCode["arg_module_type"] = 0;
      const sentVerifyCodeResult = yield call(costService.sentVerifyCodeQery, paramCode);
      let sentVerifyCodeResultList = [];
      sentVerifyCodeResultList = sentVerifyCodeResult.DataRows;
      if (sentVerifyCodeResult.RetVal !== '1') {
        message.error(sentVerifyCodeResult.RetVal);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          rand_code: sentVerifyCodeResultList[0].rand_code,
          codeVerify: sentVerifyCodeResultList[0].rand_code,
        }
      });
    },

    *queryVerifyCodeIndex1({query}, {call, put}) {

      let paramCode = {}
      
      paramCode["arg_user_id"] = Cookie.get("userid");
      paramCode["arg_module_type"] = 0;
      const sentVerifyCodeResult = yield call(costService.sentVerifyCodeQery, paramCode);
      let sentVerifyCodeResultList = [];
      sentVerifyCodeResultList = sentVerifyCodeResult.DataRows;
      yield put({
        type: 'save',
        payload: {
          rand_code: sentVerifyCodeResultList[0].rand_code,
          codeVerify: sentVerifyCodeResultList[0].rand_code,
        }
      });
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/costlabor/costVerify') {
          dispatch({ type: 'initManageQuery',query });
        }
        if (pathname === '/humanApp/costlabor/costVerify') {
          dispatch({ type: 'queryVerifyCodeIndex1',query });
        }
        if (pathname === '/humanApp/costlabor/costVerify/costVerifyIndex') {
          dispatch({ type: 'initManageIndexQuery',query });
        }
        if (pathname === '/humanApp/costlabor/costVerify/costVerifyIndex') { 
          dispatch({ type: 'queryVerifyCodeIndex',query });
        }
      });
    }
  }
}
