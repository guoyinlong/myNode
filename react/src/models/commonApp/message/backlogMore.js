/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页待办任务页面model
 */
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import {message} from 'antd';
import Cookie from 'js-cookie';
import moment from 'moment';
export default {
  namespace : 'backlogMore',
  state : {
    backlogList:[],
    backlogFlag:true
  },

  reducers : {
    myBacklog(state, {DataRows,RowCount}) {
      return {
        ...state,
        backlogList:[...DataRows],
        backlogFlag:false,
        RowCount
      };
    }
  },

  effects : {
    *backlogQuery({arg_uesrid = Cookie.get('userid')}, {call, put}) {
      const {DataRows,RowCount} = yield call(commonAppService.backlogQuery, {arg_uesrid});
      yield put({
        type: 'myBacklog',
        DataRows,
        RowCount
      });
    }
},
  subscriptions : {

  },
}
