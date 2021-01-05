/**
 * 作者：李杰双
 * 日期：2017/10/26
 * 邮件：282810545@qq.com
 * 文件说明：问卷调查数据
 */

import * as service from '../../../services/commonApp/questionnaire';
import {message} from 'antd';

export default {
  namespace : 'questionnaire',
  state : {
    list:[]
  },

  reducers : {
    noticeManagerList(state,{DataRows,RowCount}){
      for(var i=0;i<DataRows.length;i++){
        DataRows[i].updatetime=moment(DataRows[i].updatetime).format("YYYY-MM-DD");
      }
      return{
        ...state,
        noticeManagerList:[...DataRows],
        noticeManagerFlag:false,
        RowCount
      };
    }
  },

  effects : {
    * getquestion({}, {call, put}) {
      const aaa = yield call(service.q_ques_query, {
        //todo:暂时写死
        arg_infoid: 'bc377e9dfa7611e6960202429ca3c6ff',
        arg_userid: window.localStorage.sys_userid
      });
      console.log(aaa)
    }
  },

  subscriptions : {
    setup({dispatch, history}) {

      // return history.listen(({pathname, query}) => {
      //
      //   if (pathname === '/commonApp') {
      //
      //     dispatch({type: 'backlogQuery', query});
      //   }
      // });

    },
  },
}

