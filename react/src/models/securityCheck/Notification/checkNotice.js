
/**
 * 作者：郭银龙
 * 日期：2020-4-21
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：安全检查通知详情页
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myserver from "../../../services/securityCheck/securityChechServices2";

export default {
  namespace: 'anquanjianchatongzhixiangqing',
  state: {
    taskList:[],
    examineImgId: [], // 上传图片参数 
  },

  reducers: {// 刷新数据
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({}, {put}) {
			
			// yield put({
			//   type:'queryStaffByDept'
			// })
			// yield put({
			//   type:'queryCourtyardAndDeptAndStaff'
			// })
		
		},
    *anquanjianchatongzhi({query}, {call, put}){
    //  console.log(query)
     let argNotificationId=query.argNotificationId
      let recData={
        arg_user_id:Cookie.get('userid'),
        argNotificationId:argNotificationId

      };
      const response = yield call(myserver.Anquanjianchatongzhi, {...recData});
          if(response.retCode == '1'){
            if(response.dataRows){
              const res = response.dataRows;
              
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
                examineImgId: JSON.parse(examineImg), //图片
              }
            })
            }
           
    
          }else {
            message.error(response.retVal);
        }
    
    }
    ,

  


  
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/securityCheck/Notification/checkNotice') { //此处监听的是连接的地址
          dispatch({
            type: 'anquanjianchatongzhi',
            query
          });
        }
      });
    },
  },

};
