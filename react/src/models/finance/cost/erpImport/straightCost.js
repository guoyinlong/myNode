/**
 * 作者：陈红华
 * 创建日期：2017-09-13
 * 邮箱：1045825949@qq.com
 * 文件说明：财务全成本erp成本导入-直接成本导入
 */
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import * as costService from '../../../../services/finance/costService';
import * as config from '../../../../services/finance/costServiceConfig.js';
import { rightControl } from '../../../../components/finance/rightControl';
export default {
  namespace : 'straightCost',
  state : {
    dataList:[],
    rightCtrl:[]
  },
  reducers : {
    straightSearchRedu(state, {DataRows}){
      for(let i=0;i<DataRows.length;i++){
        DataRows[i].key=i+1;
      }
      return {
        ...state,
        dataList:DataRows
      }
    },
    save(state, action){
      return { ...state, ...action.payload };
    },
    searchDateRedu(state, {DataRows}){
      return {
        ...state,
        lastDate:DataRows,
      }
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
        formData:!rightControl(config.StraightRelease,DataRows)
                &&!rightControl(config.StraightCancelRelease,DataRows)?{...formDataQuery,argstatecode :'0'}:formDataQuery
      });
      yield put({
        type:'getRightContrlRedu',
        DataRows
      })
    },
    // 查询最近有数据的月份
    *searchDateIndirectStraight({formData}, {call, put}) {
      const {straight_total_year_month,RetCode}=yield call(costService.searchDateIndirectStraight, formData);
      if(RetCode=='1'){
        yield put({
          type:'straightSearch',
          formData:{
            ou:formData.argou,
            total_year_month:straight_total_year_month
          }
        })
        yield put({
          type:'searchDateRedu',
          DataRows:straight_total_year_month,
        });
      }
    },
    // 直接成本查询数据
    *straightSearch({formData}, {call, put}) {
      const {DataRows,RetCode}=yield call(costService.straightSearch, formData);
      if(RetCode=='1'){
        yield put({
          type:'straightSearchRedu',
          DataRows
        })
      }
    },
    //直接成本同步
    *syn({searchPostData}, {call, put}){
      let postData = {};
      postData['arg_ou'] = searchPostData.ou;
      postData['arg_year'] = parseInt(searchPostData.total_year_month.split('-')[0]);
      postData['arg_month'] = parseInt(searchPostData.total_year_month.split('-')[1]);
      postData['arg_userid'] = localStorage.userid;
      const {RetCode,table_id}=yield call(costService.synStraightCost, postData);
      if(RetCode === '1'){
        yield put({
          type:'straightSearch',
          formData:searchPostData
        });
        yield put({
          type:'save',
          payload:{
            tableId : table_id
          }
        });
        message.success("直接成本同步成功！");
      }
    },
    // 直接成本撤销发布操作
    *straightCancelRelease({formData}, {call, put}) {
      const {RetCode}=yield call(costService.straightCancelRelease, formData);
      if(RetCode=='1'){
        yield put({
          type:'straightSearch',
          formData
        })
        message.success("直接成本撤销成功！");
      }
    },
    // 直接成本发布操作
    *straightRelease({formData,searchFormData}, {call, put}) {
      const {RetCode}=yield call(costService.straightRelease, formData);
      if(RetCode=='1'){
        yield put({
          type:'straightSearch',
          formData:searchFormData
        })
        message.success("直接成本发布成功！");
      }
    },

    //调账
    *updatefee({projCode , feeName , deptName , batchNum, feeValue,searchPostData }, {call, put}){
      let postData = {};
      postData['arg_proj_code'] = projCode;
      postData['arg_fee_name'] = feeName;
      postData['arg_dept_name'] = deptName;
      postData['arg_batch_num'] = batchNum;
      postData['arg_fee_value'] = feeValue;
      const {RetCode}=yield call(costService.updateFeeDirect, postData);
      if(RetCode === '1'){
        yield put({
          type:'straightSearch',
          formData:searchPostData
        });
        message.success("调账成功！");
      }
    },
  },
  subscriptions : {

  },
}
