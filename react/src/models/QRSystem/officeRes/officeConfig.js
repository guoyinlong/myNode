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
  namespace: 'officeConfig',
  state: {
    applyType:"0",
    flowStaffList:[],//流动人员列表
    postFlowStaffList:[],
    staffInfoList: [],
    externalresource: [],
    userlist: "",
    all_assets_num: "",
    blackList: [],
		deptList: [],
    adminName: [],
    submissionState: "0",
    page: 1,
    pageSize: 10,
    total: 0,
    flag: 'seat'
  },

  reducers: {
    saveStationAllot(state, { stationAllotArr: DataRows}) {
      return { ...state, stationAllotArr: DataRows};
    },
    saveExternalList(state, { externalList: DataRows}) {
      return { ...state, externalList:DataRows};
    },
    save(state, action) {
      return {...state,...action.payload};
    },
  },

  effects: {
    *addStationAllot({data}, { call, put }) {
      const {RetCode,RetVal} = yield call(usersService.addStationAllot, {...data});
      if(RetCode == '1') {
        message.success("添加配置成功！");
        //刷新
        yield put({type: 'getStationAllotList'})
      }else{
        message.error(RetVal);
      }
    },
    //用户查询
    * queryUserAssetsRole({},{ call, put,select}) {
      const { RetCode, RoleTypeId } = yield call(usersService.queryUserAssetsRole);
      if(RetCode == '1') {
        yield put({
          type: 'save',
          payload: {
            userlist: RoleTypeId,
          }
        });
        if(RoleTypeId == '2') {
          return null;
        } else {
          yield put({
            type: 'save',
            payload: {
              flag: 'external'
            }
          });
        };
      }else{
        message.error("查询失败")
      };
    },
    *getStationAllotList({data}, { call, put }) {
      const {DataRows,RetCode,RetVal} = yield call(usersService.getStationAllotList, {...data});
      if(RetCode == '1'){
        yield put({
          type: 'saveStationAllot',
          stationAllotArr: DataRows,
        });
      }else{
        message.error(RetVal);
      };
    },
    *deleteStationAllot({data}, { call, put }) {
      const {RetCode,RetVal} = yield call(usersService.deleteStationAllot, {...data});
      if(RetCode == '1'){
        message.success("删除成功！")
        //刷新
        yield put({type: 'getStationAllotList'})
      }else{
        message.error(RetVal);
      };
    },
    *editStationAllot({data}, { call, put }) {
      const {RetCode,RetVal} = yield call(usersService.editStationAllot, {...data});
      if(RetCode == '1'){
        message.success("修改成功！");
        //刷新
        yield put({type: 'getStationAllotList'})
      }else{
        message.error(RetVal);
      };
    },
    //保存外部人员信息
    *saveExternalInformation({data},{put,select}) {
      let { postFlowStaffList} = yield select(state => state.officeConfig) 
      data.length !== 0 && data.map((item,index) => {
        item.key = index;
        postFlowStaffList.push(
          {
            "vendor_name":item.vendor_name,
            "vendor_principal":item.vendor_principal,
            "vendor_principal_phone":item.vendor_principal_phone,
            "project_name": item.project_name,
            "project_code":item.project_code,
            "project_dept":item.project_dept,
            "project_principal":item.project_principal,
            "project_principal_phone":item.project_principal_phone,
            "staff_nature": "外部",
            "staff_name":item.staff_name,
            "staff_idnumber":item.staff_idnumber,
            "staff_phone":item.staff_phone
          }
        );
      }); 
      postFlowStaffList.map((v) => {
        v.key = v.staff_idnumber
      });
      yield put ({
        type: "save",
        payload:{
          flowStaffList: data,
          postFlowStaffList:postFlowStaffList
        }
      });  
    },
    //移除本地外部人员信息
    *deleteData({data},{put,select}) {
      let { postFlowStaffList} = yield select(state => state.officeConfig) 
      postFlowStaffList.splice(data,1)
      yield put ({
        type: "save",
        payload: {
          postFlowStaffList:postFlowStaffList
        }
      });
    },
    //清空本地外部人员信息
    *clearFlowStaff({},{put}) {
      yield put({
        type: "save",
        payload:{
          postFlowStaffList:[],
        }
      });
    },
    //修改本地外部人员信息
    *modifyInformation({data}, {put,select}) {
      let { postFlowStaffList} = yield select(state => state.officeConfig)
      postFlowStaffList.map((v,i) => {
        if(i == data.index) {
          postFlowStaffList.splice(i,1,data.FieldsValue)
        };
      });
      yield put({
        type: "save",
        payload: {
          postFlowStaffList:postFlowStaffList
        }
      });
    },
    //提交外部人员信息
    *importExternalResource({dataList}, { call, put }) {
      var dataListString = JSON.stringify(dataList);
      const {RetCode} = yield call(usersService.importExternalResource, {arg_external_resource: dataListString});
      if(RetCode == '1'){
        message.success("外部人员提交成功！");
        yield put({
          type: 'queryExternalResource',
        });
        yield put({
          type:'clearFlowStaff'
        });
      }else{
        message.error("外部人员提交失败");
      };
    },

    *getExternalResource({},{ call, put }) {
      const {DataRows,RetCode} = yield call(usersService.getExternalResource,{});
      if(RetCode == '1'){
        yield put({
          type: 'saveExternalList',
          externalList: DataRows,
        });
      }else{
        message.error("错误")
      };
    },
    //查询外部人员信息
    * queryExternalResource({},{ call ,put}) {
      const {DataRows,RetCode} = yield call(usersService.queryExternalResource);
      if(RetCode == '1'){
         yield put({
             type: 'save',
             payload: {
              externalresource: DataRows,
             }
         });
      };
    }, 
    //移除外部人员信息
    * removeExternalResource({data},{call,put}) {
      const {RetCode}   = yield call(usersService.removeExternalResource, {
          ...data
      });
      if(RetCode == "1") {
          message.success("移除成功",2);
          yield put({
              type:'queryExternalResource',
          });
      }else{
          message.error("移除失败")
      };
    },
    //修改外部人员信息
    *reviseExternalResource({data},{call,put}) {
      const {RetCode} = yield call(usersService.reviseExternalResource, {
          ...data
      });
      if(RetCode == "1") {
          message.success("修改成功",2);
          yield put({
              type:"queryExternalResource",
          });
      }else{
          message.error("修改失败");
      };
    },
    //修改flag的值
    *setFlag({data},{put}) {
      yield put({
        type: 'save',
        payload:{
          flag:data
        }
      });
    },
    *flowAssetsStatistic({data},{call,put}) {
      const {RetCode,all_assets_num,using_assets_num} = yield call(usersService.flowAssetsStatistic);
      if(RetCode == "1") {
        yield put ({
          type: "save",
          payload:{
            all_assets_num,
            using_assets_num
          }
        });
      };
    },
    //查询黑名单列表
		* queryBlackList({data}, {call, put}) {
			const {DataRows, RetCode, RowCount} = yield call(usersService.queryblacklist,{
        ...data
      });
			if(RetCode == '1'){
        DataRows.map((v,i)=>{
          v.key = v.user_id
        });
				yield put({
				    type: 'save',
				    payload: {
              blackList: DataRows,
              total:Number(RowCount)
					}
        });
			}else{
				message.error("查询失败！");
			};
    },
    //更改页码
    *changePage({data},{put}) {
      yield put({
        type:"save",
        payload: {
          page:data.page,
        }
      });
      yield put({
        type:"queryBlackList",
        data
      });
    },
    // 添加黑名单
		* addBlackList({data}, {call, put}) {
			const {RetCode} = yield call(usersService.addblacklistdata,{
				...data
			});
			if(RetCode == '1'){
				message.success('加入黑名单成功', 2);
				yield put({
				    type: 'queryBlackList',
				});
			}else{
				message.error("添加失败");
			};
    },
    //移除黑名单
		* modifyBlacklist({data}, {call, put}) {
			const {RetCode} = yield call(usersService.modifyblacklist, {
				...data
			});
			if(RetCode == '1'){
				message.success('移除成功', 2);
				yield put({
				    type: 'queryBlackList',
				});
			}else{
				message.error("移除失败");
			};
    },
    //部门列表查询
		* departmentlistquery({}, {call, put, select}) {
      const {RetCode, DataRows} = yield call(usersService.departmentlistquery);
			if(RetCode == '1'){
				yield put({
				    type: 'save',
				    payload: {
            deptList: DataRows,
            adminName:[]
					}
				});
			}else{
				message.error("查询失败！");
			};
    },
    //查询部门属地管理员信息
		* queryadminformation({data}, {call, put}){
			const {RetCode, DataRows} = yield call(usersService.queryadminformation, {
				...data
      });
			if(RetCode == '1'){
				yield put({
				    type: 'save',
				    payload: {
						adminName: DataRows
					}
				});
			}else{
				message.error("查询失败！");
			};
		}
  },


    subscriptions: {
      setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
          if (pathname === '/adminApp/compRes/officeResMain/officeConfig/blackList') {
            dispatch({type: "queryBlackList"});
          }
          if (pathname === '/adminApp/compRes/officeResMain/officeConfig') {
            var data = {}
            dispatch({type:'getStationAllotList', data});
            dispatch({type:'getExternalResource'});
            dispatch({type: 'queryUserAssetsRole'});
            dispatch({type: 'queryExternalResource'});
            dispatch({type: 'flowAssetsStatistic'});
            dispatch({type: 'queryBlackList'});
          }
        });
      },
    },
};
