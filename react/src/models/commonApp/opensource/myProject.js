/*
    @author:zhulei
    @date:2017/11/9
    @email:xiangzl3@chinaunicom.cn
    @description:GitLab-我的项目
*/


import * as gitLabService from '../../../services/commonApp/GitLabService.js';
import Cookie from 'js-cookie';
import { message } from 'antd';
//获取当前用户名
const auth_username = Cookie.get('loginname');



export default {
  namespace:'myProject',
  state:{
    tableDataList: [],
    currentPage:null,
    total:null
  },
  reducers:{
    save(state,  action) {
      return { ...state, ...action.payload};
    },
    saveInit(state) {
      return { ...state}
    },

  },
  effects: {
    /**
     * @author:  zhulei
     * @date: 2017/11/14
     * @description:我的项目初始化
     * @param call 请求服务
     * @param put 返回reducer
     */

      *myProjectDefault({},{call,put}){

      let params = {};
      params["arguser"] = auth_username;
      params["argpagecurrent"] = 1;   //初始化当前页码为1
      params["argpagesize"] = 10;  //初始化页面显示条数为10
      //默认查询登陆人的所有项目
      const basicInfoData = yield call(gitLabService.gitlabprojuserjoin, params);

      if (basicInfoData.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            tableDataList: basicInfoData.DataRows,
            total:basicInfoData.RowCount,
            currentPage:params.argpagecurrent
          }
        });
      }else{
        message.error(basicInfoData.RetVal);
      }
    },//myProjectDefault
    /**
     * @author:  zhulei
     * @date: 2017/11/14
     * @description:根据参数查询数据
     * @param arg_param 请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *myProject({arg_param},{call,put}){
      const basicInfoData = yield call(gitLabService.gitlabprojuserjoin,arg_param);
      yield put({
        type: 'save',
        payload:{
          tableDataList: basicInfoData.DataRows,
          total:basicInfoData.RowCount,
          currentPage:arg_param.argpagecurrent
        }
      });
    }
  },


  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname}) => {
        if (pathname === '/commonApp/opensource/myProject') {
          dispatch({ type: 'myProjectDefault'});
        }
      });

    }
  }
};

