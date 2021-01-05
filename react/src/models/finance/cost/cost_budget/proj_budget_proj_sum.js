/**
 * 作者：李杰双
 * 日期：2017/10/30
 * 邮件：282810545@qq.com
 * 文件说明：全成本汇总查询数据
 */

import * as service from '../../../../services/finance/const_budget';

import {message} from 'antd'

export default {
  namespace : 'proj_budget_proj_sum',
  state : {
    list: [],
    v_remarks:'',
    v_remarks_month:''

  },
  reducers : {
    saveList(state, {DataRows,v_remarks,v_remarks_month}){
      //debugger
      return {
        ...state,
        list:DataRows,
        v_remarks,
        v_remarks_month
      };
    },
  },

  effects : {
    *search_proc({arg_ou, arg_year},{call,put}){
      let {RetCode, DataRows, v_remarks, v_remarks_month} = yield call(service.collect_search_proc,{
        arg_ou,
        arg_year
      });
      if(RetCode==='1'){
        yield put ({
          type:'saveList',
          DataRows,
          v_remarks,
          v_remarks_month,
        })
      }else{
        message.error('同步失败！')
      }
    }

  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname}) => {
        if (pathname === '/financeApp/financeCost/projCostManage/proj_budget_proj_sum') {
          // dispatch({
          //   type:'fetch',
          //   // pageCondition:{arg_page_num:400, arg_start:0},
          // });
        }
      });

    },
  },
};
