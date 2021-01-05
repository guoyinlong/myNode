/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-19
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现员工部门信息维护功能
 */
import * as hrService from '../../../services/hr/hrService.js';
import Cookie from 'js-cookie';
import { message } from 'antd';
import {OU_HQ_NAME_CN,OU_NAME_CN} from '../../../utils/config';
const auth_tenantid = Cookie.get('tenantid');

export default {
  namespace:'staffDeptEdit',
  state:{
    tableDataList: [],
    ouList:[],
    deptList:[],
    postList:[],
    postData:{},
    currentPage:null,
    total:null,
    flag_change:false,
    staffDeptChangeDate:''
  },
  reducers:{
    save(state,  action) {
      return { ...state, ...action.payload};
    },
    saveInit(state, {deptList: [], postList: []}) {
      return { ...state, deptList: [], postList: []}
    },
    saveOU(state,{ouList: DataRows}) {
      return { ...state, ouList:DataRows};
    },
    saveDept(state,{deptList: DataRows}) {
      return { ...state, deptList:DataRows};
    },
    savePost(state,{postList: DataRows}) {
      return { ...state, postList:DataRows};
    },
    saveStaffDeptChangeDate(state,{staffDeptChangeDate}) {
      return {...state,staffDeptChangeDate}
    }
  },
  effects: {

    /**
     * 作者：邓广晖
     * 创建日期：2017-9-20
     * 功能：初始化查询
     * @param call 请求服务
     * @param put 返回reducer
     */
    *staffDeptSearchDefault({},{call,put}){
      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = auth_tenantid;
      const {DataRows: getOuData} = yield call(hrService.getOuList, postData_getOU);
      yield put({
        type: 'saveOU',
        ouList: getOuData
      });

      //从服务获取所属OU下的部门列表
      const auth_ou = Cookie.get('OU');
      let auth_ou_flag = auth_ou;
      if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
        auth_ou_flag = OU_NAME_CN;
      }
      let postData_getDept = {};
      postData_getDept["argtenantid"] = auth_tenantid;
      const {DataRows: getDeptData} = yield call(hrService.getDeptInfo, postData_getDept);
      let pureDeptData = [];//存储去除前缀后的部门数据
      for (let i = 0; i < getDeptData.length; i++) {
        if (getDeptData[i].dept_name.split('-')[0] === auth_ou_flag && getDeptData[i].dept_name.split('-')[1]) {
          if(!getDeptData[i].dept_name.split('-')[2]){ //去重
            pureDeptData.push(getDeptData[i].dept_name.split('-')[1]);
          }
        }
      }
      yield put({
        type: 'saveDept',
        deptList: pureDeptData
      });

      //根据服务获取所属OU下的职务列表
      let postData_getPost = {};
      postData_getPost["arg_tenantid"] = auth_tenantid;
      postData_getPost["arg_post_tenantid"] = auth_tenantid;
      postData_getPost["arg_ouname"] = auth_ou;
      const {DataRows: getPostData} = yield call(hrService.postInfoQuery, postData_getPost);
      yield put({
        type: 'savePost',
        postList: getPostData
      });

      let postData = {};
      postData["arg_tenantid"] = auth_tenantid;
      postData["arg_ou_name"] = auth_ou_flag;
      postData["arg_allnum"] = 0;     //默认值为0
      postData["arg_page_current"] = 1;   //初始化当前页码为1
      postData["arg_page_size"] = 10;  //初始化页面显示条数
      postData["arg_post_type"] = '0';
      postData["arg_employ_type"] = '正式';
      //默认查询登陆人所属OU下的所有员工
      const basicInfoData = yield call(hrService.basicInfoQuery, postData);
      if (basicInfoData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            tableDataList: basicInfoData.DataRows,
            postData: postData,
            total: basicInfoData.RowCount,
            currentPage: postData.arg_page_current
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：从服务获取OU下的部门列表
     * @param arg_param 请求的参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *getDept({arg_param}, {call, put}) {
      let postData_getDept = {};
      postData_getDept["argtenantid"] = auth_tenantid;
      const {DataRows: getDeptData} = yield call(hrService.getDeptInfo, postData_getDept);
      let pureDeptData = [];//存储去除前缀后的部门数据
      for (let i = 0; i < getDeptData.length; i++) {
        if (arg_param === OU_HQ_NAME_CN) { //联通软件研究院本部
          arg_param = OU_NAME_CN; //联通软件研究院
        }
        if (getDeptData[i].dept_name.split('-')[0] === arg_param && getDeptData[i].dept_name.split('-')[1]) {
          if(!getDeptData[i].dept_name.split('-')[2]){ //纪委去重
            pureDeptData.push(getDeptData[i].dept_name.split('-')[1]);
          }
        }
      }
      yield put({
        type: 'saveDept',
        deptList: pureDeptData
      });
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：从服务获取OU下的职务列表
     * @param arg_param 请求的参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *getPost({arg_param}, {call, put}) {
      let postData_getPost = {};
      postData_getPost["arg_tenantid"] = auth_tenantid;
      postData_getPost["arg_post_tenantid"] = auth_tenantid;
      postData_getPost["arg_ouname"] = arg_param;
      const {DataRows: getPostData} = yield call(hrService.postInfoQuery, postData_getPost);
      yield put({
        type: 'savePost',
        postList: getPostData
      });
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：按条件查询人员信息
     * @param arg_param 请求的参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *staffDeptSearch({arg_param}, {call, put}){
      const basicInfoData = yield call(hrService.basicInfoQuery, arg_param);
      yield put({
        type: 'save',
        payload: {
          tableDataList: basicInfoData.DataRows,
          postData: arg_param,
          total: basicInfoData.RowCount,
          currentPage: arg_param.arg_page_current
        }
      });
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：部门变更
     * @param arg_param 请求的参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *staffDeptChange({arg_param}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          flag_change: false
        }
      });
      const {RetCode} = yield call(hrService.staffDeptChange, arg_param);
      if (RetCode === '1') {
        message.success('变更部门成功。');
        yield put({
          type: 'save',
          payload: {
            flag_change: true
          }
        });
      }
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：同步提示模态框倒计时结束后设置flag_change=false
     * @param put 返回reducer
     */
    *setFlag({}, {put}) {
      yield put({
        type: 'save',
        payload: {
          flag_change: false
        }
      });
    },
    /**
    * 功能：默认日期修改
    * 作者：郑宁
    * 邮箱：zhengning@honor-win.cn
    * 创建日期：2020-11-03
    */
    *staffDeptChangeDate({param},{call,put}){
    
      const infoRes = yield call(hrService.staffDeptChangeDate,param)
    
      if(infoRes.RetCode == '1' && infoRes.DataRows){
        yield put({
          type:'saveStaffDeptChangeDate',
          staffDeptChangeDate:infoRes.DataRows
        })
      }
    
    }
  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/hr/staffDeptEdit') {
          dispatch({ type: 'staffDeptSearchDefault',query });
        }
      });

    }
  }
};
