/**
 *  作者: 耿倩倩
 *  创建日期: 2017-08-11
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现部门负责人维护功能
 */
import * as hrService from '../../../services/hr/hrService.js';
import Cookie from 'js-cookie';
import { message } from 'antd';
export default {
  namespace: 'hrDeptInfo',
  state: {
    list: [],
    query: [],
    masterOptionList: [],
    ouList:[]
  },
  reducers:{
    save(state, { list}) {
      return { ...state, list};
    },
    saveOU(state, { ouList}) {
      return { ...state, ouList};
    },
    saveOption(state, { masterOptionList}) {
      return { ...state, masterOptionList};
    }
  },
  effects:{
    //部门负责人初始化查询
    *deptInitInfoSearch({}, {call, put}){
      let auth_tenantid = Cookie.get('tenantid');
      let auth_ouname = Cookie.get('OU');
      let arg_param = {
        "arg_tenantid": auth_tenantid,
        "arg_ou_name": auth_ouname,
        "arg_page_size": 10,
        "arg_page_current": 1
      };
      //获取OU列表
      let postData = {};
      postData["arg_tenantid"] = auth_tenantid;
      const {DataRows:DataRows_OU} = yield call(hrService.getOuList, postData);
      yield put({
        type: 'saveOU',
        ouList: DataRows_OU
      });

      const {DataRows} = yield call(hrService.deptInfoQuery, arg_param);
      yield put({
        type: 'save',
        list: DataRows
      });
    },
    //部门负责人查询
    *deptInfoSearch({arg_param}, {call, put ,select}){
      const {list} = yield select(state => state.hrDeptInfo)
      yield put({
        type: 'save',
        list: list
      });
      const {DataRows} = yield call(hrService.deptInfoQuery, arg_param);
      yield put({
        type: 'save',
        list: DataRows
      });
    },
    //获取部门下的所有员工
    *getAllUsers({arg_param}, {call, put}){
      const {DataRows} = yield call(hrService.getAllUsers, arg_param);
      const list = DataRows.filter((i)=>i.user_dept_flag==='u');
      yield put({
        type: 'saveOption',
        masterOptionList: list
      });
    },
    //指定部门负责人
    *saveDeptMaster({arg_param,arg_param2}, {call, put}){
      const {RetCode} = yield call(hrService.saveDeptMaster, arg_param);
      if(RetCode === "1"){
        message.success('部门负责人修改成功');
        //刷新
        yield put({type: 'deptInfoSearch', arg_param: arg_param2});
      }
    },


    //指定 分管领导
    *saveDeptManager({arg_param,arg_param2}, {call, put}){
      const {RetCode} = yield call(hrService.saveDeptManager, arg_param);
      if(RetCode === "1"){
        message.success('部门分管领导人修改成功');
        //刷新
        yield put({type: 'deptInfoSearch', arg_param: arg_param2});
      }
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/hr/deptInfo') {
          dispatch({ type: 'deptInitInfoSearch',query });
        }
      });
    }
  }
};
