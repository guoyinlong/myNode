/**
 *  作者: 卢美娟
 *  创建日期: 2018-04-11
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：场地资源、办公设备、生活设施批量导入
 */
import {message} from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../services/QRCode/QRCode.js';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'qrbulkImportCommon',
  state: {

  },

  reducers: {

  },

  effects: {
    *assetsAdd2({addList, type}, { call, put }) {
      var addListString = JSON.stringify(addList);
      const {RetCode} = yield call(usersService.assetsAdd, {assetsInfoList: addListString});
      if(RetCode == '1'){
        message.success('添加成功');
        if(type == 'type1'){
          yield put(routerRedux.push('/adminApp/compRes/qrcode_office_equipment'));
        }else if(type == 'type2'){
          yield put(routerRedux.push('/adminApp/compRes/qrcode_living_facilities'));
        }else if(type == 'type3'){
          yield put(routerRedux.push('/adminApp/compRes/qrcode_locationres'));
        }
      }else{
        message.fail("添加失败")
      }
    },

  },
  subscriptions: {
    setup({ dispatch, history }) {

      return history.listen(({ pathname, query }) => {
      });
    },
  },
};
