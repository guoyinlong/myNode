/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：员工类型数据
 */
import * as usersService from '../../../services/employer/empservices';

import Cookie from 'js-cookie';
import {EVAL_EMP_POST,EVAL_MGR_POST,EVAL_GROUP_LEADER_POST,
  OU_HQ_NAME_CN,OU_HAERBIN_NAME_CN,OU_JINAN_NAME_CN,OU_HQ_ID,OU_HAERBIN_ID,OU_JINAN_ID
} from '../../../utils/config'

//const staff_id=Cookie.get('staff_id')
//const fullName=Cookie.get('username')

export default {
  namespace : 'kindWatch',
  state : {
    list: [],
    query: {},

  },

  reducers : {
    save(state, {list: DataRows}){

      //debugger
      return {
        ...state,
        list: DataRows,

      };
    },

  },

  effects : {
    *fetch({pageCondition}, {call, put}) {
      //debugger
      let arg_ou_id='',ou=localStorage.ou
      if(ou===OU_HQ_NAME_CN){
        arg_ou_id=OU_HQ_ID
      }
      if(ou===OU_HAERBIN_NAME_CN){
        arg_ou_id=OU_HAERBIN_ID
      }
      if(ou===OU_JINAN_NAME_CN){
        arg_ou_id=OU_JINAN_ID
      }
      const {DataRows} = yield call(usersService.empclassquery,
        {
          arg_ou_id,
          arg_post_name:`("${EVAL_EMP_POST}","${EVAL_MGR_POST}","${EVAL_GROUP_LEADER_POST}")`,
          arg_tenant_id:localStorage.tenant_id
        });
      if(DataRows.length){
        yield put({
          type:'save',
          list:DataRows
        })
      }
    },


  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname}) => {

        if (pathname === '/humanApp/employer/kindWatch') {

          dispatch({type: 'fetch',
            pageCondition:{
              arg_page_num:10, arg_start:1}});
        }
      });

    },
  },
};
