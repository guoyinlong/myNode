/**
 *  作者: 卢美娟
 *  创建日期: 2018-04-11
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：办公设备、场地资源、生活设施废弃
 */
import {message} from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../services/QRCode/QRCode.js';


export default {
  namespace: 'qrAbandonCommon',
  state: {

  },

  reducers: {
    saveAsset(state, { assetList: DataRows,RowCount:RowCount }) {
      return { ...state, assetList:DataRows,RowCount:RowCount};
    },
  },

  effects: {
    *assetsQuery({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.assetsQuery, {...data});
      for(let i = 0; i < DataRows.length; i++){
        DataRows[i]["assetsQrcode"] = '';
      }

      if(RetCode == '1'){
        yield put({
          type: 'saveAsset',
          assetList: DataRows,
          RowCount:RowCount,
        });

        // for(let i = 0; i < DataRows.length; i++){
        //   const RESULT = yield call(usersService.assetQrcodeQuery, {assetsId: DataRows[i].asset_id});
        //   if(RESULT.RetCode == '1'){
        //       DataRows[i]["assetsQrcode"] = RESULT.assetsQrcode;
        //   }
        // }
      }
      else{
        message.error('查询失败')
      }
    },

    *assetsRestart({passdata,temp}, { call, put }) {
      const {RetVal,RetCode} = yield call(usersService.assetsRestart, {...passdata});
      if(RetCode == '1'){
        message.success('重启成功！')
        //刷新
        var data = {
          argPageSize:12,
          argPageCurrent:1,
          argAssetsState:0, // 0-禁用；1-启用
          argTypeId1:temp.temp,
        }
        yield put({
          type:'assetsQuery',
          data,
        })
      }else{
        message.error(RetVal);
      }
    },
  },


    subscriptions: {
      setup({ dispatch, history }) {

        return history.listen(({ pathname, query }) => {
          var data = {
            argPageSize:12,
            argPageCurrent:1,
            argAssetsState:0, // 0-禁用；1-启用
          }
          if (pathname === '/adminApp/compRes/qrcode_office_equipment/qrAbandon') {
            data.argTypeId1 = 'type1';
            dispatch({ type: 'assetsQuery',data });
          }
          else if (pathname === '/adminApp/compRes/qrcode_living_facilities/qrAbandon') {
            data.argTypeId1 = 'type2';
            dispatch({ type: 'assetsQuery',data });
          }
          else if (pathname === '/adminApp/compRes/qrcode_locationres/qrAbandon') {
            data.argTypeId1 = 'type3';
            dispatch({ type: 'assetsQuery',data });
          }
        });
      },
    },
};
