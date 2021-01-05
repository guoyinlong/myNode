/**
 *  作者: 卢美娟
 *  创建日期: 2018-04-11
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：办公设备展示
 */
import {message} from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../../services/QRCode/QRCode.js';
import {TENANT_ID,EVAL_MIDDLE_LEADER_POST_ID} from '../../../utils/config'
import { routerRedux } from 'dva/router';

export default {
  namespace: 'officeResMain',
  state: {
  },

  reducers: {
    saveStation(state, { stationContent: RESULT}) {
      return { ...state, stationContent:RESULT};
    },
    saveInfra(state, { infraContent: DataRows}) {
      return { ...state, infraContent:DataRows};
    },
  },

  effects: {
    *infraQuery({data,callback}, { call, put }) {
      const {DataRows,RetCode} = yield call(usersService.infraQuery, {...data});
      if(RetCode == '1'){
        yield put({
          type: 'saveInfra',
          infraContent: DataRows,
        });
      }
      setTimeout((callback(DataRows)),1000)
    },

    *statisticsInfraStation({data,callback}, { call, put }) {
      console.log(data);
      const RESULT = yield call(usersService.statisticsInfraStation, {...data});
      if(RESULT.RetCode == '1'){
        setTimeout((callback(RESULT)),1000)
      }else{
        message.error("查询失败");
      }
    },

    *statisticsInfraStationOri({data}, { call, put }) {
      console.log(data);
      const RESULT = yield call(usersService.statisticsInfraStation, {...data});
      if(RESULT.RetCode == '1'){
        yield put({
          type: 'saveStation',
          stationContent: RESULT,
        });
      }
    },

    *searchPos({data,callback}, { call, put }) {
      const {RetCode,DataRows,RowCount} = yield call(usersService.infraQueryWithCriteria, {...data});
      if(RetCode == '1'){
        var realResult = [];
        if(RowCount == 0){
          message.info("未查询到此人！")
        }else{
          for(let j = 0; j < RowCount; j++){
            for(let i = 0; i < DataRows[j].children.length; i++){
              if(DataRows[j].children[i].highlight == 1){
                realResult.push({"parent_id":DataRows[j].children[i].parent_id,"id":DataRows[j].children[i].id,"charger_dept_name":DataRows[j].children[i].refer_assets_info.charger_dept_name,'assetuser_name':DataRows[j].children[i].refer_assets_info.assetuser_name})
              }
            }
          }

        }
        // if(callback) callback(realResult);
        setTimeout((callback(realResult)),1000)
      }
      // yield put(routerRedux.push('/adminApp/compRes/B1'))  can route here
    },

    *userpermission({data,callback}, { call, put }) {
      const {RetCode,DataRows} = yield call(usersService.userpermission, {...data});
      if(RetCode == '1'){
        setTimeout((callback(DataRows)),1000)
      }
    },

    *rolepermission({data,callback}, { call, put }) {
      const {RetCode,RoleTypeId} = yield call(usersService.rolepermission, {...data});
      if(RetCode == '1'){
        setTimeout((callback(RoleTypeId)),1000)
      }
    },

  },


    subscriptions: {
      setup({ dispatch, history }) {

        return history.listen(({ pathname, query }) => {
          if (pathname === '/adminApp/compRes/officeResMain') {

            var data = {}
            dispatch({ type:'statisticsInfraStationOri', data})
          }

        });
      },
    },
};
