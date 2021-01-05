/**
 * 作者：郭银龙
 * 日期：2020-4-29
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：整改反馈消息页面
 */
  
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myserver from "../../../services/securityCheck/securityChechServices2";

export default {
  namespace: 'zhengGaiFanKuiXiaoXi',
  state: {
    taskList:[],
    examineImg:[],
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
  
  //   * init({ query}, {put}) {
  //     console.log(1,query)
  //     yield put({
  //       type:'zhenggaifankui'
  //     })
    
  // },
  *zhenggaifankui({query}, {call, put}){
    
    // console.log(query)
    let taskid = query.arg_state
    let recData={
      arg_user_id:Cookie.get('userid'),
      argInfoId:query.arg_state
    };
    const response = yield call(myserver.rectificationNotice, recData);
        
        if(response.retCode === '1'){
          yield put({
            type:'save',
            payload:{
              taskList:[]
            }
          })
          if(response.dataRows){
            const res = response.dataRows;
            // console.log(res);
            yield put({
              type:'save',
              payload:{
                taskList:res
              }
            })
          }
          const { examineImg} = response.dataRows[0];
          if(examineImg.length>0){
            yield put({
              type:'save',
              payload:{
                examineImgId:[]
              }
            })
             
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
  *Submit({argReformAppraise, argAppraise, argInfoId }, {call, put}){
    let recData={
      arg_user_id:Cookie.get('userid'),
      argReformAppraise:argReformAppraise,//1笑脸/0苦脸
      argAppraise:argAppraise,//描述
      argInfoId:argInfoId,//消息id

    };
    const response = yield call(myserver.duizhenggaifankuishenpi, recData);
          response.retCode==1?message.info('提交成功'):message.error(response.retVal);;
          if(response.retCode==1){
            yield put(routerRedux.push({
              pathname:'/adminApp/securityCheck/myNews',
              }));
          }
  },

  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/securityCheck/myNews/rectificationFeedback') { //此处监听的是连接的地址
          dispatch({
            type: 'zhenggaifankui',
            query
          });
        }
      });
    },
  },
};
