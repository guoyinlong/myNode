 /**
 * 文件说明：考勤管理首页
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-06-28 
 */ 

import Cookie from 'js-cookie';
import { routerRedux } from "dva/router";
import { message } from "antd";
import * as hrService from "../../services/hr/hrService";
import * as attendService from "../../services/attend/attendService";
import * as overtimeService from '../../services/overtime/overtimeService.js'


export default {
    namespace: 'attend_index_model',
    state: {
      tableDataList: [],
      attendType: [],
    },
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      }
    },
    effects: {
    *initQuery({ }, { call, put }) {

        //查询考勤统计类型
        yield put({
          type: 'save',
          payload: {
            attendType: [],
            userRoleList: [],
          }
        });
        let postData = {};
        let auth_userid = Cookie.get('userid');
        postData["arg_user_id"] = auth_userid;

        let data = yield call(attendService.attendTypeInfoSearch, postData);
     

        if (data.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
                attendType: data.DataRows,
            }
          })
        };

      /*查询用户角色 Begin*/
      let postInfo = {};
      postInfo["arg_user_id"] = Cookie.get('userid');
      const userRoleData = yield call(overtimeService.queryUserRole, postInfo);
      if (userRoleData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            userRoleList: userRoleData.DataRows,
          }
        });
      } else {
        message.error("查询角色失败"); 
      }

      /*查询用户角色 End*/
      yield put({
        type: 'attendSearchDefault',
        arg_type: 1,
      });
      }, 

    *attendSearchDefault({arg_type},{call,put}){
      yield put({
        type:'save',
        payload:{
          tableDataList :[], 
          infoSearch : [],
        }
      });
      //获取Cookie的值，用的时候获取即可，写在最外面容易导致获取的不是最新的。
      const auth_tenantid = Cookie.get('tenantid');
      const auth_ou = Cookie.get('OU');
      let ou_search = auth_ou;

      let auth_userid = Cookie.get('userid');
      let postData ={};
      postData["arg_page_size"] = 50;  //初始化页面显示条数为10
      postData["arg_page_current"] = 1;   //初始化当前页码为1
      postData["arg_user_id"] = auth_userid;
      postData["arg_type"] = arg_type;

      let data = yield call(attendService.attendIndexApprovalInfo,postData);
      if( data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            tableDataList :data.DataRows,
          }
        })
      }
     
      let postInfo = {};
      postInfo["arg_tenantid"] = auth_tenantid;
      postInfo["arg_all"] = auth_userid;    //只查询自己的信息
      postInfo["arg_ou_name"] = ou_search;
      postInfo["arg_allnum"] = 0;     //默认值为0
      postInfo["arg_page_size"] = 50;
      postInfo["arg_page_current"] = 1;
      const basicInfoData = yield call(hrService.basicInfoQuery, postInfo);
 
      if (basicInfoData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            infoSearch: basicInfoData.DataRows,
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },
    },
    subscriptions: {
      setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
          if (pathname === '/humanApp/attend/index') {
            dispatch({ type: 'initQuery', query });
          }
        });
      }
    }
  };
  