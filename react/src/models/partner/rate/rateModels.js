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
  namespace : 'partnerDetail',
  state : {
      detailObj:'',
      projectID:'',
      scoreObj:'',   // 上期余数对象
      suggestNum:'', // 建议数量
      num:{A:0,B:0,C:0,D:0},        // 实际数量
      thisResidue:{A:'--',B:'--',C:'--',D:'--'},  // 本期余数
      selectObj:[],
      year:'',
      month:''
  },

  reducers : {
    r_getDetailInfo(state, {detailObj}){
      return {
        ...state,
        detailObj
      };
    },
    r_setSuggestNum(state, {suggestNum}){
      return {
        ...state,
        suggestNum
      };
    },
    r_setNum(state, {num}){
      return {
        ...state,
        num
      };
    },
    r_setThisResidue(state, {thisResidue}){
      return {
        ...state,
        thisResidue
      };
    },
    r_getDetailScore(state, {scoreObj}){
      return {
        ...state,
        scoreObj
      };
    },
    r_getSelectObj(state,{selectObj,year,month,projectID}) {
        return {
            ...state,
            selectObj,
            year,
            month,
            projectID
        };
    },
    r_cleanData(state){
      return {
        ...state,
        detailObj:'',
        projectID:'',
        scoreObj:'',   // 上期余数对象
        suggestNum:'', // 建议数量
        num:{A:0,B:0,C:0,D:0},        // 实际数量
        thisResidue:{A:'--',B:'--',C:'--',D:'--'},  // 本期余数
        selectObj:[],
        year:'',
        month:''
      };
    }
  },

  effects : {
    *getCompanyObj({params}, {call, put,select}) {
        let paraObj = {
                arg_kpi_year:new Date().getFullYear(),
                //arg_kpi_month:new Date().getMonth(),
                arg_kpi_month:10,
                arg_user_id:window.localStorage.userid
            }
        const {RetCode,DataRows}=yield call(service.getRateList,paraObj);
        if(RetCode === '1') {
           for(let i=0; i<DataRows.length; i++) {
                 if(DataRows[i].proj_id === params.id) {
                     yield put({
                        type: 'r_getSelectObj',
                        selectObj:JSON.parse(DataRows[i].info),
                        year:DataRows[i].kpi_year,
                        month:DataRows[i].kpi_month,
                        projectID:DataRows[i].proj_id
                    });
                 }
            }
            yield put({
                type: 'getDetailScore',
                params:{
                    arg_proj_id:DataRows[0].proj_id,
                    arg_partner_id:JSON.parse(DataRows[0].info)[0].partner_id,
                    arg_kpi_year:DataRows[0].kpi_year,
                    arg_kpi_month:DataRows[0].kpi_month
                }
            });
            yield put({
                type: 'getDetail',
                params:{
                    arg_proj_id:DataRows[0].proj_id,
                    arg_partner_id:JSON.parse(DataRows[0].info)[0].partner_id,
                    arg_kpi_year:DataRows[0].kpi_year,
                    arg_kpi_month:DataRows[0].kpi_month
                }
            });
        } else {
            message.error('获取信息失败');
        }
    },
    *getDetailScore({params}, {call, put}) {
        const {RetCode,DataRows}=yield call(service.getRateScore,params);
        if(RetCode === '1') {
            yield put({
                type: 'r_getDetailScore',
                scoreObj:DataRows,
            });
        } else {
            message.error('获取信息失败');
        }
    },
    *getDetail({params}, {call, put}) {
        const {RetCode,DataRows}=yield call(service.getRateDetail,params);
        if(RetCode === '1') {
            yield put({
                type: 'r_getDetailInfo',
                detailObj:DataRows,
            });
        } else {
            message.error('获取信息失败');
        }
    },
    *dataSubmit({params}, {call, put}) {
        const {RetCode}=yield call(service.getRateSubmit,params);
        if(RetCode === '1') {
            message.success('提交成功！');
        } else {
            message.error('提交失败！');
        }
    }
  },
  
  subscriptions : {
    setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
            if (pathname === '/projectApp/purchase/rateDetail') {
                dispatch({
                    type: 'r_cleanData',
                });
                dispatch({type: 'getCompanyObj', params:query});
            } 
        });
    }
  } 
};
