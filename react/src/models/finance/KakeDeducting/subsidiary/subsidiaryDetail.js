/**
 * 作者：刘东旭
 * 日期：2018-04-26
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：财务加计扣除研发支出辅助账详情页面
 */
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import * as service from '../../../../services/finance/KakeDeducingService.js';

export default {
  namespace: 'subsidiaryDetail',
  state: {
    dataList:[], //详细数据：期初、期末、凭证
    tableHead:[], //表头
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    },
  },

  effects: {
    // 获取单个项目的详细数据：期初、期末、凭证
    * getSubsidiayDetail({formData}, {call, put}) {
      const data  = yield call(service.getSubsidiayDetail, formData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            dataList: data.DataRows,
          }
        })
      }
    },

    // 获取研发支出辅助账表头信息
    * getHeadData({formData}, {call, put}) {
      const data = yield call(service.dividedGetTableHead, formData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            tableHead: data.jsonTree,
          }
        })
      }
    },

    // 单个项目的发布
    * publishData({postData,otherData}, {call, put}) {
      const {arg_staffid} = otherData;
      const {RetCode} = yield call(service.publishData, {...postData, arg_staffid});
      if (RetCode === '1') {
        message.success('发布成功！');

        // 查询数据
        yield put({
          type: 'getSubsidiayDetail',
          formData: {
            ...postData,
            arg_state_code: 1
          }
        });

        // 查询表头信息
        yield put({
          type: 'getHeadData',
          formData: {
            arg_proj_type: postData.arg_proj_type,
            arg_fee_type: postData.arg_fee_type
          }
        })

      }
    },


    // 撤销发布
    * revocation({postData}, {call, put}) {
      const {RetCode} = yield call(service.revocation, postData);
      if (RetCode === '1') {
        message.success('数据撤销成功！');
        yield put(routerRedux.push({
          pathname: '/financeApp/cost_proj_divided_mgt/divided_mainpage_mgt/divided_support_mgt'
        }));
      }
    },

  },
  subscriptions: {},
};
