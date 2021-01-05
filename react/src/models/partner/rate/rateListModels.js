/**
 * 文件说明：合作伙伴指标填写
 * 作者：王超
 * 邮箱：wangc235@chinaunicom.cn
 * 创建日期：2018-06-20
 */
import * as service from '../../../services/partner/partnerServers';
import message from '../../../components/commonApp/message';
import { routerRedux } from 'dva/router';

export default {
  namespace : 'partnerRateList',
  state : {
      listObj:''
  },

  reducers : {
    r_getListObj(state, {listObj}){
      return {
        ...state,
        listObj
      };
    },
    
    r_cleanData(state){
      return {
        ...state,
        listObj:''
      };
    }
  },

  effects : {
    *getListObj({params}, {call, put}) {
         const {RetCode,DataRows}=yield call(service.getRateList,params);
            if(RetCode === '1') {
                yield put({
                    type: 'r_getListObj',
                    listObj:DataRows
                });
            } else {
                message.error('获取信息失败');
            }
    }
  },
  
  subscriptions : {
    setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
            if (pathname === '/projectApp/purchase/kpiRate') {
                let paraObj = {
                    arg_kpi_year:new Date().getFullYear(),
                    //arg_kpi_month:new Date().getMonth(),
                    arg_kpi_month:10,
                    arg_user_id:window.localStorage.userid
                    
                    
                }
                dispatch({
                    type: 'r_cleanData',
                });
                dispatch({type: 'getListObj', params:paraObj});
            } 
        });
    }
  }
};
