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
  namespace : 'assessDetailModels',
  state : {
      kpiObj:[],
      titleObj:[],
      year:'',
      month:''
  },

  reducers : {
    r_getTitleObj(state, {titleObj,year,month}){
      return {
        ...state,
        titleObj,
        year,
        month
      };
    },
    r_getkpiObj(state, {kpiObj}){
      return {
        ...state,
        kpiObj
      };
    },
    r_cleanData(state){
      return {
        ...state,
        titleObj:[],
        kpiObj:[],
        year:'',
        month:''
      };
    }
  },

  effects : {
    *getDetailTitle({params}, {call, put}) {
        const {RetCode,DataRows}=yield call(service.getDetailTitle,params);
        if(RetCode === '1') {
            yield put({
                type: 'r_getTitleObj',
                titleObj:DataRows,
                year:params.arg_kpi_year,
                month:params.arg_kpi_month
            });
        } else {
            message.error('获取信息失败');
        }
    },
    *getKPI({params}, {call, put}) {
         const {RetCode,DataRows} = yield call(service.getKPI,params);
            if(RetCode === '1') {
                yield put({
                    type: 'r_getkpiObj',
                    kpiObj:DataRows
                });
            } else {
                message.error('获取信息失败');
            }
    },
    
    *pmPass({params}, {call, put}) {
         const {RetCode} = yield call(service.pmPass,params);
            if(RetCode === '1') {
                yield put(routerRedux.push({pathname: '/projectApp/purchase/kpiAssess'}));
            } else {
                message.error('操作失败');
            }
    }
  },
  
  subscriptions : {
    setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
            if (pathname === '/projectApp/purchase/kpiAssessDetail') {
                dispatch({
                    type: 'r_cleanData',
                });
                dispatch({type: 'getDetailTitle', params:query});
                dispatch({type: 'getKPI', params:query});
            } 
        });
    }
  }
  
};
