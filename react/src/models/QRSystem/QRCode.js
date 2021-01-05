/**
 *  作者: 卢美娟
 *  创建日期: 2018-04-11
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：场地资源、办公设备、生活设施统一展示
 */
import {message} from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../services/QRCode/QRCode.js';
import {TENANT_ID,EVAL_MIDDLE_LEADER_POST_ID} from '../../utils/config'

export default {
  namespace: 'qrCodeCommon',
  state: {
    assetList:[],
    checkerList:[],
    checkerList2:[],
    assetTypeList:[],
    assetsList: [],
    detailsList:[],
    page: 1,
    paeSize: 10,
    total: 0,
  },

  reducers: {
    saveAsset(state, { assetList: DataRows,RowCount:RowCount }) {
      return { ...state, assetList:DataRows,RowCount:RowCount};
    },

    saveEmpLeader(state, {checkerList}){
      return {
        ...state,
        checkerList
      };
    },

    saveEmpLeader2(state, {checkerList2}){
      return {
        ...state,
        checkerList2
      };
    },

    saveAssetType(state, {assetTypeList}){
      return {
        ...state,
        assetTypeList
      };
    },

    saveType(state, {temp}){
      return {
        ...state,
        temp,
      };
    },
    save(state, action) {
      return {...state,...action.payload}
    },
  },

  effects: {
    //更新
    *assetsUpdate({data,currentpage}, { call, put }) {
      var type = data.type_id1;
      var dataString = JSON.stringify(data)
      const {RetCode} = yield call(usersService.assetsUpdate, {assetsInfo:dataString});
      if(RetCode == '1'){
        message.success('更改成功')
        //刷新
        var data3 = {
          argPageSize:12,
          argPageCurrent:currentpage,
          argAssetsState:1, // 0-禁用；1-启用
          argTypeId1: type, //场地
        }
        const {DataRows,RowCount,RetCode} = yield call(usersService.assetsQuery, {...data3});
        for(let i = 0; i < DataRows.length; i++){
          DataRows[i]["assetsQrcode"] = '';
        }

        if(RetCode == '1'){
          yield put({
            type: 'saveAsset',
            assetList: DataRows,
            RowCount:RowCount,
          });

          for(let i = 0; i < DataRows.length; i++){
            const RESULT = yield call(usersService.assetQrcodeQuery, {assetsId: DataRows[i].asset_id});
            if(RESULT.RetCode == '1'){
                DataRows[i]["assetsQrcode"] = RESULT.assetsQrcode;
            }
          }

        }

      }else{
        message.fail("更改失败")
      }
    },

    //禁用
    *assetsDisabled({assetsId,assetsState,param,currentpage}, { call, put }) {
      const {RetCode} = yield call(usersService.assetsDisabled, {assetsId, assetsState});
      if(RetCode == '1'){
        message.success('禁用成功')
        //刷新
        var data = {
          argPageSize:12,
          argPageCurrent:currentpage,
          argAssetsState:1, // 0-禁用；1-启用
          argTypeId1:param, //场地
        }
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

          for(let i = 0; i < DataRows.length; i++){
            const RESULT = yield call(usersService.assetQrcodeQuery, {assetsId: DataRows[i].asset_id});
            if(RESULT.RetCode == '1'){
                DataRows[i]["assetsQrcode"] = RESULT.assetsQrcode;
            }
          }
        }
      }else{
        message.fail("禁用失败")
      }
    },


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

        for(let i = 0; i < DataRows.length; i++){
          const RESULT = yield call(usersService.assetQrcodeQuery, {assetsId: DataRows[i].asset_id});
          if(RESULT.RetCode == '1'){
              DataRows[i]["assetsQrcode"] = RESULT.assetsQrcode;
          }
        }

        if(data.argTypeId1 == 'type1'){
          yield put({
            type: 'saveType',
            temp:'type1'
          });
        }else if(data.argTypeId1 == 'type2'){
          yield put({
            type: 'saveType',
            temp:'type2'
          });
        }else if(data.argTypeId1 == 'type3'){
          yield put({
            type: 'saveType',
            temp:'type3'
          });
        }
      }
    },

    //添加，包括单条添加和批量添加
    *assetsAdd({data}, { call, put }) {
      var type = data.type_id1;
      var tempData = [];
      tempData.push(data);
      var dataString = JSON.stringify(tempData);
      const {RetCode} = yield call(usersService.assetsAdd, {assetsInfoList: dataString});
      if(RetCode == '1'){
        message.success('添加成功')
        // //刷新 ，一直转圈圈，换个写法
        var data4 = {
          argPageSize:12,
          argPageCurrent:1,
          argAssetsState:1, // 0-禁用；1-启用
          argTypeId1:type, //场地
        }
        // yield put({
        //   type: 'assetsQuery',
        //   data:data,
        // });
        const {DataRows,RowCount,RetCode} = yield call(usersService.assetsQuery, {...data4});
        for(let i = 0; i < DataRows.length; i++){
          DataRows[i]["assetsQrcode"] = '';
        }

        if(RetCode == '1'){
          yield put({
            type: 'saveAsset',
            assetList: DataRows,
            RowCount:RowCount,
          });

          for(let i = 0; i < DataRows.length; i++){
            const RESULT = yield call(usersService.assetQrcodeQuery, {assetsId: DataRows[i].asset_id});
            if(RESULT.RetCode == '1'){
                DataRows[i]["assetsQrcode"] = RESULT.assetsQrcode;
            }
          }
        }


      }else{
        message.fail("添加失败")
      }
    },

    *assetsBatchDisabled({data,temp,callback}, { call, put }) {
      const {RetVal,RetCode} = yield call(usersService.assetsRestart, {...data});
      if(RetCode == '1'){
        message.success('批量废弃成功成功！');
        var tempdata = [];
        tempdata.push('1')
        setTimeout((callback(tempdata)),1000);

        // //刷新 ，一直转圈圈，换个写法
        var data4 = {
          argPageSize:12,
          argPageCurrent:1,
          argAssetsState:1, // 0-禁用；1-启用
          argTypeId1:temp, //场地
        }
        const {DataRows,RowCount,RetCode} = yield call(usersService.assetsQuery, {...data4});
        for(let i = 0; i < DataRows.length; i++){
          DataRows[i]["assetsQrcode"] = '';
        }

        if(RetCode == '1'){
          yield put({
            type: 'saveAsset',
            assetList: DataRows,
            RowCount:RowCount,
          });

          for(let i = 0; i < DataRows.length; i++){
            const RESULT = yield call(usersService.assetQrcodeQuery, {assetsId: DataRows[i].asset_id});
            if(RESULT.RetCode == '1'){
                DataRows[i]["assetsQrcode"] = RESULT.assetsQrcode;
            }
          }
        }

      }else{
        message.error(RetVal);
      }
    },

    //查询所属OU下流动设备信息（资产借还信息查询）
    *assetinformationquery({data}, {call, put}) {
      const {DataRows, RetCode, RowCount} = yield call(usersService.assetinformationquery,{...data});
      if(RetCode == "1"){
        DataRows.map((v,i) => {
          v.key = i;
          v.index = i+1;
          v.operation = "借还详情"
        });
        yield put({
          type: 'save',
          payload: {
            assetsList: DataRows,
            total: Number(RowCount)
          }
        }) ;
      } else {
        message.error("查询失败")
      };
    },
    //借还信息查询
    *detailsloaninformation({data},{call,put}) {
      const {DataRows, RetCode} = yield call(usersService.detailsloaninformation,{...data});
      const mappingTable = {
        0:"占用",
        1:"可借",
        2:"借出",
        3:"延期",
        4:"已归还",
        5:"管理员释放",
        6:"未借用",
        7:"释放",
        8:"损坏",
        9:"丢失",
     };
     if(RetCode == "1") {
        DataRows.map((v,i)=>{
          v.index = i+1;
          v.key = i;
          for (let i in mappingTable) {
            if(v.use_state == i) {
             v.use_state = mappingTable[i]
            };
         };
        });
        yield put({
          type: 'save',
          payload: {
            detailsList:DataRows
          }
        });
      } else {
       message.error("查询失败")
      };
    },
    //时间筛选
    *beginTime({data},{put}) {
      yield put ({type:"detailsloaninformation",data})
    },
    //更改页码
    *changePage({data},{put}) {
      yield put ({
        type: "save",
        payload: {
          page:data.page
        }
      }); 
      yield put ({
        type:"assetinformationquery",
        data
      });
    }
  },


    subscriptions: {
      setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
          var data = {
            argPageSize:12,
            argPageCurrent:1,
            argAssetsState:1, // 0-禁用；1-启用
          };
          if (pathname === '/adminApp/compRes/qrcode_locationres') {
            data.argTypeId1 = 'type3';
            dispatch({ type: 'assetsQuery',data });
          };
          if (pathname === '/adminApp/compRes/qrcode_office_equipment') {
            data.argTypeId1 = 'type1';
            dispatch({ type: 'assetsQuery',data });
          };
          if (pathname === '/adminApp/compRes/qrcode_living_facilities') {
            data.argTypeId1 = 'type2';
            dispatch({ type: 'assetsQuery',data });
          };
          if (pathname === '/adminApp/compRes/qrcode_office_equipment/assetLendingInformation') {
            dispatch({ type: 'assetinformationquery' });
          };
          if (pathname === '/adminApp/compRes/qrcode_office_equipment/assetLendingInformation/assetLendingDetail') {
            dispatch({ type: 'detailsloaninformation', data:{arg_asset_id:query.asset_id}});
          };
        });
      },
    },
};
