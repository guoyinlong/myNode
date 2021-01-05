/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-11
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现员工职务信息维护功能
 */
import * as hrService from '../../../services/hr/hrService.js';
import Cookie from 'js-cookie';
import {message} from 'antd';
import {OU_HQ_NAME_CN, OU_NAME_CN} from '../../../utils/config';
const auth_tenantid = Cookie.get('tenantid');

export default {
  namespace: 'staffPostEdit',
  state: {
    tableDataList:[],
    ouList:[],
    deptList:[],
    postList:[],
    postData:{},
    currentPage:null,
    total:null,
    flag_change:false,
    flag_post_type:'0'
  },
  reducers: {
    save(state,  action) {
      return { ...state, ...action.payload};
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
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：修改职务
     * @param param 请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *modifyPost({param}, {call, put}){
      yield put({
        type: 'save',
        payload: {
          flag_change: false,
          flag_post_type: '0' //主岗
        }
      });
      const data = yield call(hrService.changePost, param);
      if (data.RetCode === '1') {
        message.success('修改成功！');
        yield put({
          type: 'save',
          payload: {
            flag_change: true
          }
        });
      } else {
        message.error(`"修改失败！失败原因："${data.RetVal}`);
      }
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：新增兼职
     * @param param 请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *newAddPartTimeJob({param}, {call, put}){
      yield put({
        type: 'save',
        payload: {
          flag_change: false,
          flag_post_type: '0' //主岗
        }
      });
      const data = yield call(hrService.addPost, param);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            flag_change: true
          }
        });
        message.success('新增成功！');
      } else {
        message.error(`"新增失败！失败原因："${data.RetVal}`);
      }
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：删除兼职
     * @param param 请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *deletePartTimeJob({param}, {call, put}){
      yield put({
        type: 'save',
        payload: {
          flag_change: false,
          flag_post_type: '1' //兼职
        }
      });
      const data = yield call(hrService.deleteInfo, param);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            flag_change: true
          }
        });
        message.success('删除成功！');
      } else {
        message.error(`"删除失败！失败原因："${data.RetVal}`);
      }
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：默认查询
     * @param arg_post_type 请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *defaultSearch({arg_post_type}, {call, put}){
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
      postData["arg_page_size"] = 10;  //初始化页面显示条数为10
      postData["arg_post_type"] = '0';
      if(arg_post_type){
        postData["arg_post_type"] = arg_post_type;
      }
      //postData["arg_post_type"] = arg_post_type;
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
     * 功能：修改职务tab页查询
     * @param put 返回reducer
     */
    *searchPostModify({},{put}){
      yield put({
        type: 'defaultSearch',
        arg_post_type: '0'
      });
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：新增兼职tab页查询
     * @param put 返回reducer
     */
    *searchPostAdd({},{put}){
      yield put({
        type: 'defaultSearch',
        arg_post_type: '0'
      });
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：删除兼职tab页查询
     * @param put 返回reducer
     */
    *searchPostDelete({},{put}){
      yield put({
        type: 'defaultSearch',
        arg_post_type: '1'
      });
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：初始化表格数据
     * @param put 返回reducer
     */
    *init({},{put}){
      yield put({
        type: 'save',
        payload: {
          tableDataList: []
        }
      });
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：条件查询
     * @param arg_param 请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *search({arg_param}, {call, put}){
      //按条件查询人员信息
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
     * 功能：从服务获取OU下的部门列表
     * @param arg_param 请求参数
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
     * @param arg_param 请求参数
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
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/humanApp/hr/staffPostEdit') {
          dispatch({type: 'defaultSearch', query});
        }
      });
    }
  }
};
