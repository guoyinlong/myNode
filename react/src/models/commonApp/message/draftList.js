/**
 * 作者：薛刚
 * 创建日期：2018-12-13
 * 邮箱：xueg@chinaunicom.cn
 * 文件说明：门户首页草稿列表页面model
 */
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import { message } from 'antd';
import Cookie from 'js-cookie';
export default {
  namespace : 'draftList',
  state : {
    draftList: [],
  },
  reducers : {
    save(state) {
      return {
        ...state,
      };
    }
  },

  effects : {
    // 查看草稿
    *draftQuery({ payload }, { call, put }) {

    },

    // 删除草稿
    *draftDelete ({ payload }, { call, put }) {

    },
  },

  subscriptions : {

  },
}
