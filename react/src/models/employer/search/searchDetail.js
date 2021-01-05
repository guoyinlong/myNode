/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：指标详细数据
 */

import * as service from '../../../services/employer/search';

import Cookie from 'js-cookie';
//const staff_id=Cookie.get('staff_id')
//const fullName=Cookie.get('username')

export default {
  namespace : 'searchDetail',
  state : {
    list: [],
    query: {},
    projects:[],
    
  },

  reducers : {
    save(state,{payload}){

      return {
        ...state,
        ...payload
      };
    },
    clearList(state){
      return {
        ...state,
        list:[]
      }
    }
  },

  effects : {
    *fetch({query}, {call, put}) {
      const scoreRes = yield call(service.empscorequery, {
        transjsonarray:JSON.stringify(
          {"condition":{...query,"tag":'0'},"sequence":[{"create_time":"0"}]}
        )
      });
      if(scoreRes.RetCode==='1'){
        const {DataRows} = yield call(service.empkpiquery, {
          transjsonarray:JSON.stringify({condition:{...query}})
        });
        yield put({
          type: 'save',
          payload:{
            list: DataRows,
            query,
            projects:scoreRes.DataRows
          }
        });
      }
    },

 
  },
  subscriptions : {
    setup({dispatch, history}) {
      return history.listen(({pathname,query}) => {
        if (pathname === '/humanApp/employer/manage/searchDetail'||pathname === '/humanApp/employer/check/checkDetail') {
          dispatch({type: 'fetch',query});
        }
      });

    },
  },
};
