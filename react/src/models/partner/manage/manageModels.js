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
  namespace : 'partnerManage',
  state : {
      listObj:[]
  },

  reducers : {
    
    r_getWriteList(state, {listObj}){
      return {
        ...state,
        listObj
      };
    }
  },

  effects : {
    *getWriteList({params}, {call, put}) {
        const {RetCode,DataRows}=yield call(service.getWriteList,params);
            if(RetCode === '1') {
                yield put({
                    type: 'r_getWriteList',
                    listObj:DataRows
                });
            } else {
                message.error('获取信息失败');
            }
    },
  },
  
  subscriptions : {
    setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
            if (pathname === '/projectApp/purchase/kpiAdd') {
                dispatch({type: 'getWriteList', params:{'arg_user_id':Cookie.get('userid')}});
            } 
        });
    }
  }
  
};
