/**
 * 作者：郭银龙
 * 日期：2020-4-21
 * 邮箱：guoyl@itnova.com.cn 
 * 文件说明：员工整改通知
 */
 
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myserver from "../../../services/securityCheck/securityChechServices2";

export default {
  namespace: 'yuanGongTongZhiZhengGai',
  loading: true, 
  state:  {
    taskList:[],
    InputValue:"",
    examineImgId: [], // 上传的图片id
    previewVisible: false,
    examineImgId2:[],
},





  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
  
    *zhewnggaitongzhi({query}, {call, put}){
// console.log(query.arg_state)
let taskid = query.arg_state
      let recData={
        arg_user_id:Cookie.get('userid'),
        argInfoId:taskid
      };
      const response = yield call(myserver.rectificationNotice, recData);
          // console.log(response,123);
          if(response.retCode === '1'){
            if(response.dataRows){
              const res = response.dataRows;
              res.map((item, index) => {
                // item.sortDate = item.update_date.slice(0,19);
                item.key=index;
                item.type = '1';
              });
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
                examineImgId2: JSON.parse(examineImg), //图片
              }
            })
            } 
            
           
          }else {
            message.error(response.retVal);
        }
    
    },
    *Submit({argReform, argreformDesc,argInfoId}, {call, put}){
      let recData={
        // arg_user_id:Cookie.get('userid'),
        argReform:JSON.stringify(argReform),//图片
        argreformDesc:JSON.parse(JSON.stringify(argreformDesc)) ,  //整改描述
        argInfoId:JSON.parse(JSON.stringify(argInfoId)),    //消息id
      };
      const response = yield call(myserver.duizhenggaibujigedeshenpi, recData);
            response.retCode==1?message.info('提交成功'):message.error(response.retVal);;
            if(response.retCode==1){
              yield put(routerRedux.push({
                pathname:'/adminApp/securityCheck/myNews',
                }));
              
            }
    },
    *saveUploadFile({value,previewImage,previewVisible}, {put,call, select}) { //上传图片
      const {examineImgId} = yield select(s => s.yuanGongTongZhiZhengGai)
      yield put({
        type: 'save',
        payload: {
          examineImgId: []
        }
      })
			if(value == undefined) { //value为未定义时,其他两个有值
				yield put({
					type: 'save',
					payload: {
						previewImage: JSON.parse(JSON.stringify(previewImage)),
						previewVisible: JSON.parse(JSON.stringify(previewVisible)),
					}
				})
			}else {
				if(value.RetCode == '1') {
					// console.log(value.filename, 'value.filename')  //有value的值时,其他参数为未定义
					examineImgId.push(value.filename)
				}
				// console.log(examineImgId, 'examineImgId图片上传数组')
				yield put({
					type: 'save',
					payload: {
						examineImgId: examineImgId
					}
				})
			}
		},
		*onRemove({file}, {put,call, select}) { //删除图片
			const {examineImgId} = yield select(s => s.yuanGongTongZhiZhengGai)
			let delFileId = file.response.filename.FileId;
			examineImgId.splice(delFileId, 1)
			// console.log(examineImgId, 'examineImgIdexamineImgIdexamineImgIdexamineImgId')
			yield put({
				type: 'save',
				payload: {
					examineImgId: examineImgId
				}
			})
		},
		*handleCancel({}, {put}) { //取消预览
			yield put({
				type: 'save',
				payload: {
					previewVisible: false
				}
			})
		},



  

 

 
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/securityCheck/myNews/safetyTask') { //此处监听的是连接的地址
          dispatch({
            type: 'zhewnggaitongzhi',
            query
          });
        }
      });
    },
  },
};
