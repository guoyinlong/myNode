/**
 * 文件说明：创建新加班审批流程
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-06-20(补充)
 */
import Cookie from 'js-cookie';
import * as overtimeService from '../../services/overtime/overtimeService.js'
import * as hrService from "../../services/hr/hrService";
import {routerRedux} from "dva/router";
import {message} from "antd";
import * as contractService from "../../services/labor/contract/contractService";
export default {
  namespace: 'overtime_index_model',
  state:{
    tableDataList:[],
    infoSearch:[],
    userRoleList:[],
    deptList:[],
    postData:[],
    total: '',
    currentPage: '',
    if_human:true
  },
  reducers:{
    saveDept(state,{deptList: DataRows}) {
      return { ...state, deptList:DataRows};
    },
    save(state, action) {
      return { ...state, ...action.payload};
    }
  },
  effects:{
    *overtimeSearchDefault({arg_type},{call,put}){
      yield put({
        type:'save',
        payload:{
          tableDataList :[],
          infoSearch : [],
        }
      });
      //获取Cookie的值，用的时候获取即可，写在最外面容易导致获取的不是最新的。
      const auth_tenantid = Cookie.get('tenantid');
      const auth_ou = Cookie.get('OU');
      let ou_search = auth_ou;

      let auth_userid = Cookie.get('userid');
      let postData ={};
      postData["arg_page_size"] = 50;  //初始化页面显示条数为10
      postData["arg_page_current"] = 1;   //初始化当前页码为1
      postData["arg_user_id"] = auth_userid;
      postData["arg_type"] = arg_type;

      let data = yield call(overtimeService.overtimeApprovalQuery,postData);
      if( data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            tableDataList :data.DataRows,
          }
        })
      }

      let postInfo = {};
      postInfo["arg_tenantid"] = auth_tenantid;
      postInfo["arg_all"] = auth_userid;    //只查询自己的信息
      postInfo["arg_ou_name"] = ou_search;
      postInfo["arg_allnum"] = 0;     //默认值为0
      postInfo["arg_page_size"] = 50;
      postInfo["arg_page_current"] = 1;
      const basicInfoData = yield call(hrService.basicInfoQuery, postInfo);
      /*      console.log("用户信息前+++++model");
            console.log(basicInfoData);
            console.log("用户信息前+++++model");*/

      if (basicInfoData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            infoSearch: basicInfoData.DataRows,
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },

    *overtimeSearchDefault2({arg_type},{call,put}){
      yield put({
        type:'save',
        payload:{
          tableDataList :[],
          total: '',
          currentPage: ''
        }
      });
      //从服务获取所属OU下的部门列表
      let postData_getDept = {};
      postData_getDept["arg_ou_id"] = Cookie.get('OUID');
      const {DataRows: getDeptData} = yield call(contractService.deptListQuery, postData_getDept);

      let pureDeptData = [];//存储去除前缀后的部门数据
      for (let i = 0; i < getDeptData.length; i++) {
        /*if (getDeptData[i].deptname.split('-')[0] === Cookie.get('OU') && getDeptData[i].deptname.split('-')[1]) {
          if (!getDeptData[i].deptname.split('-')[2]) { //纪委去重
            let adddept = {};
            adddept["deptname"] = getDeptData[i].deptname.split('-')[1];
            adddept["deptid"] = getDeptData[i].deptid;
            pureDeptData.push(adddept);
          }
        }*/
        let adddept = {};
        adddept["deptname"] = getDeptData[i].deptname.split('-')[1];
        adddept["deptid"] = getDeptData[i].deptid;
        pureDeptData.push(adddept);
      }
      yield put({
        type: 'saveDept',
        deptList: pureDeptData
      });

      //判断是否是人力资源
      let postDataParam = {};
      postDataParam["arg_user_id"] = Cookie.get('userid');
      postDataParam["arg_post_id"] = 'cdfeg67890b311e6a01d02429ca3c6ff';
      const checkData = yield call(contractService.checkIfHumanSpecial, postDataParam);
      console.log("checkData==="+JSON.stringify(checkData));
      if(checkData.DataRows.length>0){
        yield put({
          type: 'save',
          payload: {
            if_human: false
          }
        });
      }

      let postData ={};
      postData["arg_page_size"] = 20;  //初始化页面显示条数为10
      postData["arg_page_current"] = 1;   //初始化当前页码为1
      postData["arg_ou_id"] = Cookie.get('OUID');
      postData["arg_dept_id"] = Cookie.get('dept_id');
      postData["arg_flow_type"] = '项目组加班申请';
      postData["arg_flow_state"] = '1';
      let data = yield call(overtimeService.flowSearch,postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            tableDataList: data.DataRows,
            postData: postData,
            total: data.RowCount,
            currentPage: postData.arg_page_current
          }
        });
      } else {
        message.error("查询角色失败");
      }
    },
    *overtimeFlowSearch({arg_param},{call,put}){
      yield put({
        type:'save',
        payload:{
          tableDataList :[],
          total: '',
          currentPage: ''
        }
      });

      let postData ={};
      postData["arg_page_size"] = arg_param.arg_page_size;  //初始化页面显示条数为10
      postData["arg_page_current"] = arg_param.arg_page_current;   //初始化当前页码为1
      postData["arg_ou_id"] = Cookie.get('OUID');
      postData["arg_dept_id"] = arg_param.arg_dept_id;
      postData["arg_flow_type"] = arg_param.arg_flow_type;
      postData["arg_flow_state"] = arg_param.arg_flow_state;
      let data = yield call(overtimeService.flowSearch,postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            tableDataList: data.DataRows,
            postData: postData,
            total: data.RowCount,
            currentPage: postData.arg_page_current
          }
        });
      } else {
        message.error("查询角色失败");
      }
    },

    *overtimeApprovalQuery({},{call,put}){
      /*查询用户角色 Begin*/
      let postInfo = {};
      postInfo["arg_user_id"] = Cookie.get('userid');
      const userRoleData = yield call(overtimeService.queryUserRole, postInfo);
      if (userRoleData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            userRoleList: userRoleData.DataRows,
          }
        });
      } else {
        message.error("查询角色失败");
      }
      /*查询用户角色 End*/
      yield put({
        type: 'overtimeSearchDefault',
        arg_type: 1,
      });
    },

    *deleteInfo({query},{call,put}){
      yield put({
        type:'save',
        payload:{
          tableDataList :[],
        }
      });
      if(query.type_delete === '1') {
        let deleteKey = {
          arg_team_apply_id: query.apply_id
        }
        let data = yield call(overtimeService.teamOvertimeApplyDelete, deleteKey);
        if (data.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
              tableDataList: data.DataRows,
            }
          })
          message.success('删除成功!');
          yield put(
            routerRedux.push('/humanApp/overtime/overtime_index')
          )
        }
      }else if(query.type_delete === '2') {
          let deleteKey ={
            arg_team_stats_id : query.apply_id
          }
          let data = yield call(overtimeService.teamOvertimeStatsDelete, deleteKey);
          if (data.RetCode === '1') {
            yield put({
              type: 'save',
              payload: {
                tableDataList: data.DataRows,
              }
            })
            message.success('删除成功!');
            yield put(
              routerRedux.push('/humanApp/overtime/overtime_index')
            )
          }
        }else if(query.type_delete === "5") {
          console.log("dsajkdsakdjsakjdklasjdklsajdklsajdkslajdklsajdklsjdsa")
          let deleteKey ={
            arg_department_apply_id : query.apply_id
          }
          let data = yield call(overtimeService.departmentOvertimeApplyDeleteSave, deleteKey);
          if (data.RetCode === '1') {
            yield put({
              type: 'save',
              payload: {
                tableDataList: data.DataRows,
              }
            })
            message.success('删除成功!');
            yield put(
              routerRedux.push('/humanApp/overtime/overtime_index')
            )
          }
        }else if(query.type_delete === '6') {
          let deleteKey ={
            arg_department_stats_id : query.apply_id
          }
          let data = yield call(overtimeService.departmentOvertimeStatsDeleteSave, deleteKey);
          if (data.RetCode === '1') {
            yield put({
              type: 'save',
              payload: {
                tableDataList: data.DataRows,
              }
            })
            message.success('删除成功!');
            yield put(
              routerRedux.push('/humanApp/overtime/overtime_index')
            )
          }
        }
        else {
          message.info("参数错误！");
        }
    },

    //删除待办信息
    *deleteApproval({query},{call,put}) {
      //项目组查询
      //console.log("query======")
      let param = {
        arg_apply_id: query.task_id,
        arg_apply_type:query.apply_type,
      };
      //console.log("param======"+param)
      yield call(overtimeService.deleteApproval,param);
    },

        //撤销未提交的项目组加班申请/统计查询
        *teamApplyStatesQuery({query,resolve},{call}){
          console.log("-------------------------------------------------------");
          let param = query;
          const teamApplyStatesInfo = yield call(overtimeService.teamApplyStatesInfoQuery, param);
          if (teamApplyStatesInfo.RetCode === '1') {
            let teamApplyStatesData = teamApplyStatesInfo.DataRows[0].state;
            if(teamApplyStatesData === '0'){
              resolve("0");
            }
            else if(teamApplyStatesData >= '1'){
              resolve("1");
            }
          } else {
            message.error('检查查询参数');
            return;
          }
        },
        //撤销未提交的项目组加班申请/统计操作
        *teamApplyRevokeOperation({query,resolve},{call}){
          let param = query;
          const teamApplyRevoke = yield call(overtimeService.teamApplyRevokeOperation, param);
          if (teamApplyRevoke.RetCode === '1') {
            resolve("success");
          } else {
            resolve('false');
            return;
          }
        },
  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/overtime/overtime_index') {
           dispatch({ type: 'overtimeApprovalQuery',query });
         }
        if (pathname === '/humanApp/overtime/overtime_search') {
          dispatch({ type: 'overtimeSearchDefault2',query });
        }
      });
    }
  }
};
