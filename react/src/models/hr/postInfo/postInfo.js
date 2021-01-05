/**
 *  作者: 耿倩倩
 *  创建日期: 2017-08-17
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现组织单元职务维护功能
 */

import * as hrService from '../../../services/hr/hrService.js';
import Cookie from 'js-cookie';
import { message } from 'antd';
import {OU_HQ_NAME_CN} from '../../../utils/config';
const hr_ou_beijing = OU_HQ_NAME_CN;

export default{
  namespace:'hrPostInfo',
  /* list 用于返回页面表格数据
  * optionList 代表OU列表
  * optionVisible  代表OU列表的下拉菜单是否能显示
  * current_ou_name  代表选中OU后的当前页面的ou名称
  * current_ou_id  代表选中OU后的当前页面的ou id
  * postList  代表职务列表
  **/
  state:{
    list: [],
    optionList:[],
    optionVisible:true,
    current_ou_name:'',
    current_ou_id:'',
    postList:[]
  },
  reducers:{
    save(state, action){
        return { ...state, ...action.payload };
    }
  },
  effects:{
    //组织单元职务初始化查询
    *postInfoSearchDefault({}, {call, put}){
      const auth_tenantid = Cookie.get('tenantid');
      const auth_userid = Cookie.get('userid');
      let postData_seeOU = {};
      postData_seeOU["arg_tenantid"] = auth_tenantid;
      const seeOUdata = yield call(hrService.getOuList, postData_seeOU);

      let postData_ou = {};
      postData_ou['arguserid'] = auth_userid;
      postData_ou['argtenantid'] = auth_tenantid;
      //根据用户ID，查询用户所属分院，使用userOUdata.DataRows[0].OU来获取
      const userOUdata = yield call(hrService.userOU, postData_ou);

      let selectVisible = true;
      if(userOUdata.DataRows[0].OU !== hr_ou_beijing){
        selectVisible = false;
      }
      //获取用户所属的OU作为初始化查询的条件
      const current_ou_name = userOUdata.DataRows[0].OU;//将用户所属OU设为OU下拉列表的默认值
      const current_ou_id = userOUdata.DataRows[0].ou_id;
      let postData = {};
      postData["arg_tenantid"]=auth_tenantid;
      postData["arg_ouname"]=current_ou_name;
      postData["arg_post_tenantid"]=auth_tenantid;

      //根据用户ID以及所属部门，查询职务信息
      const postInfoData = yield call(hrService.postInfoQuery, postData);
      if (postInfoData.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            list: postInfoData.DataRows,
            optionVisible:selectVisible,
            optionList:seeOUdata.DataRows,
            current_ou_name:current_ou_name,
            ouSelectValue:current_ou_name,
            current_ou_id:current_ou_id
          }
        });
      }

      let postListParam={};
      postListParam["arg_tenantid"] = auth_tenantid;
      postListParam["arg_post_tenantid"] = auth_tenantid;
      //根据tenantID获取可添加的职务列表
      const postList = yield call(hrService.postListQuery, postListParam);
      if (postList.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{postList:postList.DataRows}
        });
      }
    },
    //组织单元职务查询
    *postInfoSearch({arg_ouname}, {call, put}){
      let auth_tenantid = Cookie.get('tenantid');
      let arg_param = {
        "arg_tenantid": auth_tenantid,
        "arg_ouname":arg_ouname,
        "arg_post_tenantid":auth_tenantid
      };
      const data = yield call(hrService.postInfoQuery, arg_param);
      if(data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            list: data.DataRows,
            current_ou_id:data.DataRows[0].op_ouid,
            ouSelectValue:arg_ouname
          }
        });
      }else{
        message.error(data.RetVal);
      }
    },
    //删除职务
    *delPost({arg_param ,arg_ouname},{call,put}){
      const {RetCode} = yield call(hrService.postDele, arg_param);
      if(RetCode === "1"){
        message.success('删除职务成功');
        //刷新
        yield put({ type: 'postInfoSearch',arg_ouname:arg_ouname});
      }else{
        message.error('删除职务失败');
      }
    },
    //获取添加职务对话框中的职务列表
    *newPost({},{call,put}){
      let auth_tenantid = Cookie.get('tenantid');
      let postListData={};
      postListData["arg_tenantid"] = auth_tenantid;
      postListData["arg_post_tenantid"] = auth_tenantid;
      //根据tenantID获取可添加的职务列表
      const postList = yield call(hrService.postListQuery, postListData);
      if (postList.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
             postList:postList.DataRows,
             postListDone:true    // postListDone代表职务列表请求完成
          }
        });
      }else{
        message.error(postList.RetVal);
      }
    },

    //添加职务
    *newPostSend({param},{call,put}){
      let auth_tenantid = Cookie.get('tenantid');
      let auth_userid = Cookie.get('userid');
      let arg_param ={};
      arg_param['arg_tenantid']= auth_tenantid;
      arg_param['arg_op_tenantid']= auth_tenantid;
      arg_param['arg_op_ouid'] = param['arg_op_ouid'];
      arg_param['arg_op_postid'] = param['arg_op_postid'];
      arg_param['arg_op_create_by'] = auth_userid;

      const {RetCode,RetVal} = yield call(hrService.newPostSend, arg_param);
      if(RetCode === '1'){
        message.success("新添职务成功");
        //刷新
        let arg_ouname = param['current_ou_name'];
        yield put({ type: 'postInfoSearch',arg_ouname:arg_ouname });
      }else{
        message.error(RetVal);
      }
    }
  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/hr/postInfo') {
          dispatch({ type: 'postInfoSearchDefault',payload:query });
        }
      });
    }
  }
};
