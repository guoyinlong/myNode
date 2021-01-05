/*
    @author:zhulei
    @date:2017/11/27
    @email:xiangzl3@chinaunicom.cn
    @description:GitLab-账户重置
*/

import * as gitLabService from '../../../services/commonApp/GitLabService.js';
import {message} from 'antd';

export default {
  namespace: 'passReset',
  state: {
    pass:'',
    pass_confirm:'',
    current_pass:'',
  },

  reducers: {
    /**
     * 作者：张楠华
     * 创建日期：2017-08-28
     * 功能：返回查询结果到routes层
     */
    save(state, action) {
      return {...state,...action.payload};
    },

  },

  effects: {


    /**
     * 作者：张楠华
     * 创建日期：2017-08-28
     * 功能：点击新增实现后台交互

     */
    * submit({arg_param}, {call}) {

      if (arg_param["arg_pass"] === arg_param["arg_pass_confirm"]) {
        const basicInfoData = yield call(gitLabService.gitlabpassreset, arg_param);
        if (basicInfoData.RetCode === '1') {
          message.success("修改密码成功");
        } else {
          message.error(basicInfoData.RetVal);
        }

      } else
        message.error("两次密码不一致");
    },
  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname}) => {
        if (pathname === '/commonApp/opensource/passReset') {
          dispatch({ type: 'init'});
        }
      });

    }
  }

}

