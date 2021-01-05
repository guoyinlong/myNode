/**
 *  作者: 耿倩倩
 *  创建日期: 2017-08-11
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现个人信息维护功能
 */
import * as hrService from '../../../services/hr/hrService.js';
import Cookie from 'js-cookie';
import { message } from 'antd';
import {OU_HQ_NAME_CN,OU_NAME_CN} from '../../../utils/config';

export default {
  namespace:'staffInfoEdit',
  state:{
    tableDataList: [],
    postData: {},
    flag_change: false //标记修改信息成功与否
  },
  reducers:{
    save(state,  action) {
      return { ...state, ...action.payload};
    }
  },
  effects: {
    /**
     * 作者：耿倩倩
     * 创建日期：2017-8-20
     * 功能：初始化查询
     * @param call 请求服务
     * @param put 返回reducer
     */
    *staffInfoSearch({},{call,put}) {
      //获取Cookie的值，用的时候获取即可，写在最外面容易导致获取的不是最新的。
      const auth_tenantid = Cookie.get('tenantid');
      const auth_userid = Cookie.get('userid');
      const auth_ou = Cookie.get('OU');
      let ou_search = auth_ou;
      if (auth_ou === OU_HQ_NAME_CN) { //如果是联通软件研究院本部，传参：联通软件研究院
        ou_search = OU_NAME_CN;
      }
      let postData = {};
      postData["arg_tenantid"] = auth_tenantid;
      postData["arg_all"] = auth_userid;    //只查询自己的信息
      postData["arg_ou_name"] = ou_search;
      postData["arg_allnum"] = 0;     //默认值为0
      postData["arg_page_size"] = 9;
      postData["arg_page_current"] = 1;
      const basicInfoData = yield call(hrService.selfinfoquery);
      if (basicInfoData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            tableDataList: basicInfoData.DataRows,
            postData: postData
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-8-20
     * 功能：信息修改
     * @param param 请求参数
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *staffInfoModify({param},{call,put,select}){
      yield put({
        type: 'save',
        payload: {
          flag_change: false
        }
      });
      const data = yield call(hrService.staffInfoModify,param);
      if(data.RetCode === '1'){
        let tableDataList=yield select(state => state.staffInfoEdit.tableDataList);
        message.success('信息修改成功！');
        yield put({
          type: 'save',
          payload: {
            flag_change: true,
            tableDataList:[{...tableDataList[0],username:param.arg_username,tel:param.arg_tel}]
          }
        });
        //修改全局显示的用户名
        yield put({
          type: 'app/updateUserInfo',
          payload: param.arg_username
        });

      }else{
        let errorData = "信息修改失败！失败原因："+ data.RetVal;
        message.error(errorData);
      }
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-8-20
     * 功能：同步提示模态框倒计时结束后设置flag_change=false
     * @param put 返回reducer
     */
    *setFlag({},{put}){
      yield put({
        type: 'save',
        payload: {
          flag_change: false
        }
      });
    }
  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/hr/staffInfoEdit') {
          dispatch({ type: 'staffInfoSearch',query });
        }
      });

    }
  }
};
