/*
    @author:zhulei
    @date:2017/11/9
    @email:xiangzl3@chinaunicom.cn
    @description:
*/


import * as gitLabService from '../../../services/commonApp/GitLabService.js';
import {message} from 'antd';

export default {
  namespace: 'projectBuild',
  state: {
    name:'',
    zhname:'',
    class_id:'',
    mainlang:'',
    desc:''
  },

  reducers: {
    /**
     * 作者：张楠华
     * 创建日期：2017-08-28
     * 功能：返回查询结果到routes层
     */
    save(state, action) {
      return {...state,...action.payload};
    },

  },

  effects: {

    /**
     * 作者：张楠华
     * 创建日期：2017-08-28
     * 功能：点击新增实现后台交互
     * @param value 表格每一行数据
     * @param year_type 选择的年份
     * @param season_type 选择的月份
     * @param call 调用后台
     * @param put 存放数据
     */
      *submit({arg_param},{call}){
      console.log(arg_param)
      const basicInfoData = yield call(gitLabService.gitlabprojectadd,arg_param);
      if (basicInfoData.RetCode === '1'){
        message.success("添加成功");
      }else{
        message.error(basicInfoData.RetVal);
      }
    }
  },


  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname}) => {
        if (pathname === '/commonApp/opensource/projectBuild') {
          dispatch({ type: 'init'});
        }
      });

    }
  }
};

