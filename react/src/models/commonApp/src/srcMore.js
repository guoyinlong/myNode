/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页常用表单页面model
 */
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import {message} from 'antd';
import Cookie from 'js-cookie';
import moment from 'moment';
export default {
  namespace : 'srcMore',
  state : {
    resourceList:[],
    SrcFlag:true,
  },

  reducers : {
    commonResource(state,{DataRows}){
      return{
        ...state,
        resourceList:[...DataRows],
        SrcFlag:false

      };
    }
  },

  effects : {
    *ResourceQuery ({formData}, {call, put}) {
      const {DataRows} = yield call(commonAppService.fileQuery,formData);
      yield put({
        type: 'commonResource',
        DataRows
      });
    },
},
  subscriptions : {

  },
}
