/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-11
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现员工信息查询功能
 */
import * as hrService from '../../../services/hr/hrService.js';
import Cookie from 'js-cookie';
import { message } from 'antd';
import {OU_NAME_CN,OU_HQ_NAME_CN} from '../../../utils/config';
const auth_tenantid = Cookie.get('tenantid');
const auth_ou = Cookie.get('OU');
let auth_ou_flag = auth_ou;
if(auth_ou_flag === OU_HQ_NAME_CN){ //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}

export default {
  namespace:'staffInfoSearch',
  state:{
    tableDataList: [],
    ouList:[],
    deptList:[],
    postList:[],
    postData:{},
    currentPage:null,
    total:null
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
    *staffInfoSearchDefault({},{call,put}){
      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = auth_tenantid;
      const {DataRows:getOuData} = yield call(hrService.getOuList, postData_getOU);
      yield put({
        type: 'saveOU',
        ouList: getOuData
      });

      //从服务获取所属OU下的部门列表
      let postData_getDept = {};
      postData_getDept["argtenantid"] = auth_tenantid;
      const {DataRows:getDeptData} = yield call(hrService.getDeptInfo, postData_getDept);
      let pureDeptData = [];//存储去除前缀后的部门数据
      for(let i=0;i<getDeptData.length;i++){
        if(getDeptData[i].dept_name.split('-')[0] === auth_ou_flag && getDeptData[i].dept_name.split('-')[1]){
          if(!getDeptData[i].dept_name.split('-')[2]){ //纪委去重
            pureDeptData.push(getDeptData[i].dept_name.split('-')[1]);
          }
        }
      }
      yield put({
        type: 'saveDept',
        deptList: pureDeptData
      });

      //根据服务获取所属OU下的职务列表
      let postData_getPost={};
      postData_getPost["arg_tenantid"] = auth_tenantid;
      postData_getPost["arg_post_tenantid"] = auth_tenantid;
      postData_getPost["arg_ouname"] = auth_ou;
      const {DataRows:getPostData} = yield call(hrService.postInfoQuery, postData_getPost);
      yield put({
        type: 'savePost',
        postList:getPostData
      });

      let postData = {};
      postData["arg_tenantid"] = auth_tenantid;
      postData["arg_ou_name"] = auth_ou_flag;
      postData["arg_allnum"] = 0;     //默认值为0
      postData["arg_page_current"] = 1;   //初始化当前页码为1
      postData["arg_page_size"] = 9;  //初始化页面显示条数为9
      //默认查询登陆人所属OU下的所有员工
      let basicInfoData = yield call(hrService.basicInfoQuery, postData);
      let result=basicInfoData.DataRows.map(item => {
        item['ou']=item['deptname'].split('-')[0]
        return item
      });

      if (basicInfoData.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            tableDataList: result,
            postData:postData,
            total:basicInfoData.RowCount,
            currentPage:postData.arg_page_current
          }
        });
      }else{
        message.error(basicInfoData.RetVal);
      }
    },//staffInfoSearchDefault

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：初始化部门和职务数组
     * @param put 返回reducer
     */
    *init({}, {put}){
      yield put({
        type: 'saveInit',
        deptList: [],
        postList: []
      });
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：从服务获取OU下的部门列表
     * @param arg_param 请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *getDept({arg_param},{call,put}){
      let postData_getDept = {};
      postData_getDept["argtenantid"] = auth_tenantid;
      const {DataRows:getDeptData} = yield call(hrService.getDeptInfo, postData_getDept);
      let pureDeptData = [];//存储去除前缀后的部门数据
      for(let i=0;i<getDeptData.length;i++){
        if(arg_param === OU_HQ_NAME_CN){ //联通软件研究院本部
          arg_param = OU_NAME_CN; //联通软件研究院
        }
        if(getDeptData[i].dept_name.split('-')[0] === arg_param && getDeptData[i].dept_name.split('-')[1]){
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
     * @param arg_param 请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *getPost({arg_param},{call,put}){
      let postData_getPost={};
      postData_getPost["arg_tenantid"] = auth_tenantid;
      postData_getPost["arg_post_tenantid"] = auth_tenantid;
      postData_getPost["arg_ouname"] = arg_param;
      const {DataRows:getPostData} = yield call(hrService.postInfoQuery, postData_getPost);
      yield put({
        type: 'savePost',
        postList:getPostData
      });
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：按条件查询人员信息
     * @param arg_param 请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *staffInfoSearch({arg_param},{call,put}){
      let basicInfoData = yield call(hrService.basicInfoQuery,arg_param);
      let result=basicInfoData.DataRows.map(item => {
        item['ou']=item['deptname'].split('-')[0]
        return item
      });

      yield put({
        type: 'save',
        payload:{
          tableDataList:[...result],
          postData:arg_param,
          total:basicInfoData.RowCount,
          currentPage:arg_param.arg_page_current
        }
      });
    },


    // 全部员工信息查询
    *allStaffInfoSearch({arg_param},{call,put}){
      // message.info('allStaffInfoSearch')
      let basicInfoData = yield call(hrService.allbasicInfoQuery,arg_param);
      let result=basicInfoData.DataRows.map(item => {
        item['ou']=item['deptname'].split('-')[0]
        return item
      });

      yield put({
        type: 'save',
        payload:{
          tableDataList:[...result],
          postData:arg_param,
          total:basicInfoData.RowCount,
          currentPage:arg_param.arg_page_current
        }
      });
    },



  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/hr/staffInfoSearch') {
          dispatch({ type: 'staffInfoSearchDefault',query });
        }
      });

    }
  }
};
