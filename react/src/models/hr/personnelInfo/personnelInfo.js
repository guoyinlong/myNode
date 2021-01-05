/**
 *  作者: 耿倩倩
 *  创建日期: 2017-08-19
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现人员变动统计功能
 */
import * as hrService from '../../../services/hr/hrService.js';
import Cookie from 'js-cookie';
import { message } from 'antd';
export default {
  namespace: 'hrPersonnelInfo',
  state: {
    list: [],
    query: [],
    ouList:[]
  },
  reducers:{
    save(state, {list: DataRows}) {
      //添加合计
      let obj = {};
      let up_month_num = 0;
      let move_per_num = 0;
      let add_per_num = 0;
      let del_per_num = 0;
      let latle_month = 0;
      for(let i=0; i<DataRows.length; i++){
         up_month_num += parseInt(DataRows[i].up_month_num);
         move_per_num += parseInt(DataRows[i].move_per_num);
         add_per_num += parseInt(DataRows[i].add_per_num);
         del_per_num += parseInt(DataRows[i].del_per_num);
         latle_month += parseInt(DataRows[i].latle_month);
      }
      obj.add_per_num = add_per_num;
      obj.del_per_num = del_per_num;
      obj.deptname = '合计';
      obj.key = '';
      obj.latle_month = latle_month;
      obj.move_per_num = move_per_num;
      obj.up_month_num = up_month_num;
      DataRows.push(obj);
      return { ...state, list:DataRows};
    },
    saveOU(state,{ouList: DataRows}){
      return { ...state, list:[],ouList:DataRows};
    }
  },
  effects:{
    //获取OU列表
    *init({}, {call, put}){
      let auth_tenantid = Cookie.get('tenantid');
      let postData = {};
      postData["arg_tenantid"] = auth_tenantid;
      const {DataRows} = yield call(hrService.getOuList, postData);
      yield put({
        type: 'saveOU',
        list: [],
        ouList: DataRows
      });
    },
    //生成数据
    *personnelInfoCreate({arg_param1,arg_param2}, {call, put}){
      //首先判断财务是否已经使用该月数据
      const {RetCode} = yield call(hrService.judge, arg_param1);
      if(RetCode === '1'){
        const {DataRows} = yield call(hrService.personnelInfoCreate, arg_param2);
        yield put({
          type: 'save',
          list: DataRows
        });
      }
      else if(RetCode === '0'){
        message.error("该月数据财务已使用，不允许生成！");
      }
    },
    //查询数据
    *personnelInfoSearch({arg_param,callback}, {call, put}){
      const {DataRows} = yield call(hrService.personnelInfoSearch, arg_param);
      yield put({
        type: 'save',
        list: DataRows
      });
      //调用回调函数
      if(DataRows.length<=1&&callback){
        callback()
      }
    },
    //确认数据
    *personnelInfoCommit({arg_param}, {call}){
      const {RetCode} = yield call(hrService.personnelInfoCommit, arg_param);
      if(RetCode === '1'){
        message.success("确认成功");
      }
    },
    //撤消确认
    *personnelInfoCancel({arg_param1,arg_param2}, {call}){
      const {RetCode} = yield call(hrService.judge, arg_param1);
      if(RetCode === '1'){
        const {RetCode} = yield call(hrService.personnelInfoCancel, arg_param2);
        if(RetCode === '1'){
          message.success("撤消成功");
        }
      }
      else if(RetCode === '0'){
        message.error("该月数据财务已使用，请联系财务撤消！");
      }
    }
  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({pathname,query}) => {
        if (pathname === '/humanApp/hr/personnelInfo') {
          dispatch({ type: 'init',query});
        }
      });
    }
  }
};
