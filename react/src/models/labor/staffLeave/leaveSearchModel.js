/**
 *  作者: 王福江
 *  创建日期: 2019-10-16
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：离职流程查询
 */
import Cookie from 'js-cookie';
import * as overtimeService from '../../../services/overtime/overtimeService.js'
import {routerRedux} from "dva/router";
import {message} from "antd";
import * as contractService from "../../../services/labor/contract/contractService";
import * as staffLeaveService from "../../../services/labor/staffLeave/staffLeaveService";
export default {
  namespace: 'leave_search_model',
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

    *leaveSearchDefault({arg_type},{call,put}){
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
      postDataParam["arg_post_id"] = 'defgh98765b311e6a01d02429ca3c6ff';
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
      let data = yield call(staffLeaveService.flowSearch,postData);
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
    *leaveFlowSearch({arg_param},{call,put}){
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
      let data = yield call(staffLeaveService.flowSearch,postData);
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

  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/labor/leave_search') {
          dispatch({ type: 'leaveSearchDefault',query });
        }
      });
    }
  }
};
