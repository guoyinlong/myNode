/**
 * 作者：郭银龙
 * 日期：2020-4-29
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：员工督查反馈
 */

import Cookie from 'js-cookie';
import { message} from "antd";
import { routerRedux } from 'dva/router';
import * as myserver from "../../../services/securityCheck/securityChechServices2";

export default { 
  namespace: 'yuangongducha',
  state: {
    taskList:[],
    roleList:[],
     roleObject:[],//通知对象
     examineImgId:[]
    
  },
  

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
  //   * init({}, {put}) {
  //     yield put({
  //       type:'duchafankui'
  //     })
    
  // },
  *duchafankui({query}, {call, put}){


    yield put({
      type:'save',
      payload:{
        examineImgId: []//图片
      }
    })
      let taskid = query.arg_state
      let recData={
        arg_user_id:Cookie.get('userid'),
        argInfoId:taskid
      };
    const response = yield call(myserver.employeeInspectionFeedback, recData);
        if(response.retCode === '1'){
          if(response.dataRows){
            const res = response.dataRows;
            yield put({
              type:'save',
              payload:{
                taskList:res,
               
              }
            })
          }
          const { examineImg} = response.dataRows[0];
          if(examineImg.length>0){
             
            yield put({
            type:'save',
            payload:{
              examineImgId: JSON.parse(examineImg), //图片
            }
          })
          }
        }else {
          message.error(response.retVal);
      }


     
      
  },

  
  *roleListData({record}, {put}) { //保存通知 对象
    yield put({
      type:'save',
      payload:{
        roleObject: "",
      }
    })
    let newroleObject = [...record]
    yield put({
      type:'save',
      payload:{
        roleObject: newroleObject,
      }
    })
  },


  *Submit({datalist}, {call, put,select}){
    let roleData = yield call(myserver.queryUserInfo, {});// 登录人角色查询
    let arg_current_role=""
    if(roleData.dataRows[0].roleName.indexOf("安委办主办")> -1){
      arg_current_role=0
    }else if(roleData.dataRows[0].roleName.indexOf("分院办公室安全接口人")> -1){
      arg_current_role=1
    }else if(roleData.dataRows[0].roleName.indexOf("安全员")> -1){
      arg_current_role=2
    }
    const {roleObject} = yield select(v =>v.yuangongducha)
    let argCopy=roleObject.join()
    let recData={
      arg_user_id:Cookie.get('userid'),
      ...datalist,
      argCopy,
      arg_current_role

    };
    const response = yield call(myserver.duiyuangongduchashenpi, recData);
          response.retCode==1?message.info('提交成功'):message.error(response.retVal);
          if(response.retCode==1){
            yield put(routerRedux.push({
              pathname:'/adminApp/securityCheck/myNews',
              }));
          }
  },
  *quanbujuese({}, {call, put}){
    let recData={
      arg_user_id:Cookie.get('userid')
    };
    const response = yield call(myserver.queryRole, recData);
    let roleData = yield call(myserver.queryUserInfo, {});// 登录人角色查询
    let  allroleList = [];
   
        if(response.retCode === '1'){
          if(roleData.dataRows[0].roleName.indexOf("安委办主办")> -1){
						const res = response.dataRows;
             let roleRequstData = res.filter((v) => {
              let item = v.roleName
              let itemroleSort=v.roleSort
                return item.indexOf('院领导') >-1&&itemroleSort==0 || item.indexOf('各部门/中心负责人') >-1 ||
                item.indexOf('各部门/中心安全员') >-1 || item.indexOf('分管副院长') >-1 
            })
          
            roleRequstData.map((item, index) => {
              item.roleName = item.roleName.slice(19);
              item.key=index;
              item.type = '1';
            });
            // console.log(roleRequstData);
          let roleDefault = [
           
            {
              "roleId": '1',
              "roleName": "本部全员"
            }
            
          ]
          allroleList = [...roleDefault, ...roleRequstData ];
            yield put({
              type:'save',
              payload:{
                roleList:allroleList
              }
            })
						
          }
          if(roleData.dataRows[0].roleName.indexOf("分院办公室安全接口人")> -1){
						const res = response.dataRows;
             let roleRequstData = res.filter((v) => {
              let item = v.roleName
              let itemroleSort=v.roleSort
                return item.indexOf('分院院领导') >-1&&itemroleSort==1 || item.indexOf('各部门/中心负责人') >-1 ||
                item.indexOf('各部门/中心安全员') >-1 || item.indexOf('分管副院长') >-1 
            })
          
            roleRequstData.map((item, index) => {
              item.roleName = item.roleName.slice(19);
              item.key=index;
              item.type = '1';
            });
            // console.log(roleRequstData);
          let roleDefault = [
           
            {
              "roleId": '2',
              "roleName": "分院全员"
            }
            
          ]
          allroleList = [...roleDefault, ...roleRequstData ];
            yield put({
              type:'save',
              payload:{
                roleList:allroleList
              }
            })
						
					}
            
          
          
        }else {
          message.error(response.retVal);
      }
  
  },




  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/securityCheck/myNews/staffSupervision') { //此处监听的是连接的地址
          dispatch({
            type: 'duchafankui',
            query
          });
          dispatch({
            type: 'quanbujuese',
            query
          });
        }
      });
    },
  },
};
