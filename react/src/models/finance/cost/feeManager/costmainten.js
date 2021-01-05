/**
 * 作者：陈红华
 * 创建日期：2017-09-13
 * 邮箱：1045825949@qq.com
 * 文件说明：财务全成本费用科目管理-费用科目维护
 */
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import * as costService from '../../../../services/finance/costService';
export default {
  namespace : 'costmainten',
  state : {
    costmaintenList:[],
    rightCtrl:[]
  },
  reducers : {
    costmaintenQueryR(state, {DataRows}){
      for(var i=0;i<DataRows.length;i++){
        DataRows[i].key=i;
      }
      return {
        ...state,
        costmaintenList:[...DataRows]
      }
    },
    getRightCtrlRedu(state,{DataRows}){
      return {
        ...state,
        rightCtrl:DataRows
      }
    }
  },
  effects : {
    *costUserHasModule({formData}, {call, put}) {
      // const {DataRows,RetCode,RetVal}=yield call(costService.costUserHasModule, formData);
      yield call(costService.costUserHasModule, formData);
    },
    *costUserGetOU({formData}, {call, put}) {
      // const {DataRows,RetCode,RetVal}=yield call(costService.costUserGetOU, formData);
      yield call(costService.costUserGetOU, formData);
    },
    *costmaintenQuery({formData}, {call, put}) {
      const {DataRows,RetCode}=yield call(costService.costmaintenQuery, formData);
      if(RetCode==1){
        yield put({
          type: 'costmaintenQueryR',
          DataRows
        });
      }
    },
    // 获取按钮权限
    *getRightCtrl({formData}, {call, put}){
      const {DataRows}=yield call(costService.userGetModule,formData);
      yield put({
        type:'getRightCtrlRedu',
        DataRows
      })
    },
    // 当前OU下的获取上级费用项
    *queryFeeNameBat({formData}, {call, put}) {
      // const {DataRows,RetCode,RetVal}=yield call(costService.queryFeeNameBat, formData);
      yield call(costService.queryFeeNameBat, formData);
    },
    *feeNameAddBat({formData}, {call, put}) {
      const {RetCode}=yield call(costService.feeNameAddBat, formData);
      if(RetCode=='1'){
        message.success('新增费用项成功！')
        yield put({
          type:'costmaintenQuery',
          formData:{}
        })
      }
    },
    *feeNameUpdateBat({formData,queryFormData}, {call, put}) {
      const {RetCode}=yield call(costService.feeNameUpdateBat, formData);
      if(RetCode=='1'){
        message.success('费用项修改成功！')
        yield put({
          type:'costmaintenQuery',
          formData:queryFormData
        })
      }
    },
  },
  subscriptions : {

  }
}
