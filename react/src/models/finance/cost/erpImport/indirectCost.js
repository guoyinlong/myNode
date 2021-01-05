/**
 * 作者：陈红华
 * 创建日期：2017-09-13
 * 邮箱：1045825949@qq.com
 * 文件说明：财务全成本erp成本导入-间接成本导入
 */
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import * as costService from '../../../../services/finance/costService';
import * as config from '../../../../services/finance/costServiceConfig.js';
import { rightControl } from '../../../../components/finance/rightControl';
const generate_postData = (searchPostData)=>{
  return {
    arg_ou : searchPostData.ou,
    arg_year : parseInt(searchPostData.total_year_month.split('-')[0]),
    arg_month : parseInt(searchPostData.total_year_month.split('-')[1]),
    arg_userid : localStorage.userid,
  }
}

export default {
  namespace : 'indirectCost',
  state : {
      rightCtrl:[]
  },
  reducers : {
    indirectSearchRedu(state, {DataRows}){
      for(let i=0;i<DataRows.length;i++){
        DataRows[i].key=i;
      }
      return {
        ...state,
        dataList:DataRows
      }
    },
    searchDateRedu(state, {DataRows}){
      return {
        ...state,
        lastDate:DataRows,
      }
    },
    save(state, action){
      return { ...state, ...action.payload };
    },
    // 获取按钮权限
    getRightContrlRedu(state,{DataRows}){
      return {
        ...state,
        rightCtrl:[...DataRows]
      }
    }
  },
  effects : {
    // 查询该用户的按钮权限
    *getRightCtrl({formDataRight,formDataQuery},{call,put}){
      const {DataRows}=yield call(costService.userGetModule,formDataRight);
      yield put({
        type:'searchDateIndirectStraight',
        formData:!rightControl(config.IndirectRelease,DataRows)
                &&!rightControl(config.IndirectCancelRelease,DataRows)?{...formDataQuery,argstatecode :'0'}:formDataQuery
      });
      yield put({
        type:'getRightContrlRedu',
        DataRows
      })
    },
    // 查询最近有数据的月份
    *searchDateIndirectStraight({formData}, {call, put}) {
      const {indirect_total_year_month,RetCode}=yield call(costService.searchDateIndirectStraight, formData);
      if(RetCode=='1'){
        yield put({
          type:'searchDateRedu',
          DataRows:indirect_total_year_month,
        });
        yield put({
          type:'indirectSearch',
          formData:{
            ou:formData.argou,
            total_year_month:indirect_total_year_month
          }
        })
      }
    },
    // 间接成本查询数据
    *indirectSearch({formData}, {call, put}) {
      const {DataRows,RetCode}=yield call(costService.indirectSearch, formData);
      if(RetCode=='1'){
        yield put({
          type:'indirectSearchRedu',
          DataRows
        })
      }
    },
    //间接成本同步
    *syn({searchPostData}, {call, put}){
      const {RetCode,table_id}=yield call(costService.synIndirectCost, generate_postData(searchPostData));
      const data = yield call(costService.createBP,generate_postData(searchPostData))
      if(RetCode === '1' && data.RetCode === '1'){
        yield put({
          type:'indirectSearch',
          formData:searchPostData
        });
        yield put({
          type:'save',
          payload:{
            tableId : table_id
          }
        });
        message.success("间接成本同步成功！");
      }
    },
    // 间接成本撤销发布操作
    *indirectCancelRelease({formData,searchPostData}, {call, put}) {
      const {RetCode}=yield call(costService.indirectCancelRelease, formData);
      const data = yield call(costService.cancelBP,generate_postData(searchPostData))
      if(RetCode=='1' && data.RetCode === '1'){
        yield put({
          type:'indirectSearch',
          formData
        })
        message.success("间接成本撤销成功！");
      }
    },
    // 间接成本发布操作
    *indirectRelease({formData,searchPostData}, {call, put}) {
      const {RetCode}=yield call(costService.indirectRelease, formData);
      const data = yield call(costService.publishBP,generate_postData(searchPostData))
      if(RetCode=='1' && data.RetCode === '1'){
        yield put({
          type:'indirectSearch',
          formData:searchPostData
        })
        message.success("间接成本发布成功！");
      }
    },

    //调账
    *updatefee({feeCode , ou , batchNum, feeValue,searchPostData }, {call, put}){
      let postData = {};
      postData['arg_fee_code'] = feeCode;
      postData['arg_ou'] = ou;
      postData['arg_batch_num'] = batchNum;
      postData['arg_fee_value'] = feeValue;
      const {RetCode}=yield call(costService.updateFeeIndirect, postData);
      if(RetCode === '1'){
        yield put({
          type:'indirectSearch',
          formData:searchPostData
        });
        message.success("调账成功！");
      }
    },
  },
  subscriptions : {

  },
}
