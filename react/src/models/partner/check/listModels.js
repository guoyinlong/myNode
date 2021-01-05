/**
 * 文件说明：合作伙伴指标填写
 * 作者：王超
 * 邮箱：wangc235@chinaunicom.cn
 * 创建日期：2018-06-20
 */
import * as service from '../../../services/partner/partnerServers';
import message from '../../../components/commonApp/message';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';

export default {
  namespace : 'partnerCheckList',
  state : {
      checkListObj:[]
  },

  reducers : {
    r_getCheckList(state, {checkListObj}){
      return {
        ...state,
        checkListObj
      };
    }
  },

  effects : {
    *getCheckList({params}, {call, put}) {
         const {RetCode,DataRows}=yield call(service.getCheckList,params);
            if(RetCode === '1') {
                yield put({
                    type: 'r_getCheckList',
                    checkListObj:DataRows
                });
            } else {
                message.error('获取信息失败');
            }
    }
  },
  
  subscriptions : {
    setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
            if (pathname === '/projectApp/purchase/kpiCheck') {
                dispatch({type: 'getCheckList', params:{'arg_user_id':Cookie.get('userid')}});
            } 
        });
    }
  }
  
};
