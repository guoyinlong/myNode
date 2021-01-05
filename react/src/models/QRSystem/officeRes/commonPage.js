/**
 * 作者： 卢美娟
 * 创建日期： 2018-08-22
 * 邮箱: lumj14@chinaunicom.cn
 * 功能： 办公资源- 七层通用页面
 */
import {message} from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../../services/QRCode/QRCode.js';

export default {
  namespace: 'CommonPage',
  state: {

  },

  reducers: {
    saveInfra(state, { infraContent: DataRows}) {
      return { ...state, infraContent:DataRows};
    },
    saveDept(state, {deptOption}) {
      return { ...state, deptOption};
    },
  },

  effects: {
    *infraQuery({data}, { call, put }) {
      const {DataRows,RetCode} = yield call(usersService.infraQuery, {...data});
      var deptOption = [];
      if(RetCode == '1'){
        yield put({
          type: 'saveInfra',
          infraContent: DataRows,
        });
        if(DataRows[0].station_user_depts){
          for(let i = 0; i < DataRows[0].station_user_depts.length; i++){
            deptOption.push({label:DataRows[0].station_user_depts[i].dept_name, value:DataRows[0].station_user_depts[i].dept_id});
            yield put({
              type: 'saveDept',
              deptOption,
            })
          }
        }
      }
    },

    *assetsUpdateV2({data2,paramPage}, { call, put }) {
      var assetsInfo = JSON.stringify(data2)
      const {RetCode} = yield call(usersService.assetsUpdateV2, {assetsInfo});
      if(RetCode == '1'){
        message.success('更改成功');
        // 这里
        const {DataRows,RetCode} = yield call(usersService.infraQuery, {arg_infra_id:paramPage});
        if(RetCode == '1'){
          yield put({
            type: 'saveInfra',
            infraContent: DataRows,
          });
        }
      }else{
        message.error('更新失败');
      }
    },

    *assetsAddV2({data3,item_id,paramPage}, { call, put }) {
      var tempData = [];
      tempData.push(data3);
      var dataString = JSON.stringify(tempData);
      const {RetCode,assetsIdList} = yield call(usersService.assetsAddV2, {assetsInfoList: dataString});
      if(RetCode == '0'){
        console.log("4444444");
      }
      console.log(RetCode);
      if(RetCode == '1'){
        var assetid = assetsIdList[0];
        var param = {
          arg_infra_id: item_id,
          arg_asset_id: assetid,
        }
        const {RetCode} = yield call(usersService.infraUpdateAsset, {...param});
        console.log(RetCode);
        if(RetCode === '1'){
          message.success("新增并关联成功！")
          //这里
          const {DataRows,RetCode} = yield call(usersService.infraQuery, {arg_infra_id:paramPage});
          if(RetCode == '1'){
            yield put({
              type: 'saveInfra',
              infraContent: DataRows,
            });
          }
        }else{
          message.error("新增成功但关联失败！")
        }
      }else{
        message.error('新增失败！');
      }
    },

    *cancelOfficeRes({data2,paramPage}, { call, put }) {
          const {RetCode} = yield call(usersService.infraUpdateAsset, {...data2});
          if(RetCode == '1'){
            message.success("取消关联成功");
            // 这里
            const {DataRows,RetCode} = yield call(usersService.infraQuery, {arg_infra_id:paramPage});
            if(RetCode == '1'){
              yield put({
                type: 'saveInfra',
                infraContent: DataRows,
              });
            }
          }else{
            message.error('取消关联失败！');
          }
        },

    *infraUpdateAsset({data2,paramPage}, { call, put }) {
      const {RetCode} = yield call(usersService.infraUpdateAsset, {...data2});
      if(RetCode == '1'){
        message.success('关联成功');
        //这里
        const {DataRows,RetCode} = yield call(usersService.infraQuery, {arg_infra_id:paramPage});
        if(RetCode == '1'){
          yield put({
            type: 'saveInfra',
            infraContent: DataRows,
          });
        }
      }else{
        message.error('关联失败');
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
            if( DataRows[j].children){
              for(let i = 0; i < DataRows[j].children.length; i++){
                if(DataRows[j].children[i].highlight == 1){
                  realResult.push({"parent_id":DataRows[j].children[i].parent_id,"id":DataRows[j].children[i].id,"charger_dept_name":DataRows[j].children[i].refer_assets_info.charger_dept_name,'assetuser_name':DataRows[j].children[i].refer_assets_info.assetuser_name})
                }
              }
            }
          }
        }
        // if(callback) callback(realResult);
        setTimeout((callback(realResult)),1000)
      }else{
        message.error("查询失败")
      }
      // yield put(routerRedux.push('/adminApp/compRes/B1'))  can route here
    },

  },


  subscriptions: {
    setup({ dispatch, history }) {

      return history.listen(({ pathname, query }) => {
        if(pathname === '/adminApp/compRes/officeResMain/commonPage'){
          //   var data = {
          //     arg_infra_id: global.tempvar,
          //   }
          //   dispatch({ type: 'infraQuery',data });
          }
      });
    },
  },
};
