
/**
 * 作者：郭银龙
 * 日期：2020-5-18
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：创建报告 
 */
import Cookie from 'js-cookie';
import { message } from "antd"; 
import { routerRedux } from 'dva/router';
import * as myserver from "../../../services/securityCheck/securityChechServices2";

export default {
  namespace: 'newReport',
  loading: true, 
  state: {
    reportList:[],
    checkObjectAndContentList:[],
    checkZhuGuanFuYanZhangList:[],
    examineImgId: [], // 上传的图片id 
    previewVisible: false,
    roleType: '', // 1 安委办  2 分院办公室安全接口人 
	roleList: [], // 通知对象
	roleObject:[],//选中通知对象
	roleObject2:[],//选中通知主管副院长
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({}, {put}) {
			
			yield put({
			  type:'queryUserInfo'
			})
			yield put({
			  type:'quanbujuese'
			})
			yield put({
				type:'zhuguanfuyanzhang'
			  })
		},
		 // 角色查询	
		 *queryUserInfo({}, {call, put, select}){
            let OUID = "e65c02c2179e11e6880d008cfa0427c4"
            let roleData = yield call(myserver.queryUserInfo, {});
            let roleTypeData = '0'
            // console.log(roleData.dataRows[0].roleName ,'roleData.dataRows[0].roleName')
            if(roleData.retCode == '1') {
                if(roleData.dataRows[0].roleName.indexOf("安委办主办")>-1){
                    roleTypeData = '1'
                }else if(roleData.dataRows[0].roleName.indexOf("办公室安全接口人")>-1){
                    roleTypeData = '2'
                }else if(roleData.dataRows[0].roleName.indexOf("安全员")>-1 && Cookie.get("OUID")==OUID) {//部门安全员
                    roleTypeData = '3'
                }else if(roleData.dataRows[0].roleName.indexOf("安全员")>-1 && Cookie.get("OUID")!=OUID) {//分院部门安全员
                    roleTypeData = '4'
                }
				// console.log(roleTypeData,"22222")
				yield put({
                    type: 'save',
                    payload: { 
						roleType: roleTypeData,
						usename:roleData.dataRows[0].userName
                    }
                })
                
            }
        },
    
 
		*quanbujuese({}, {call, put}){
			let recData={
			  arg_user_id:Cookie.get('userid')
			};
			const response = yield call(myserver.queryRole, recData);
			let roleData = yield call(myserver.queryUserInfo, {});// 登录人角色查询
			let roleTypeData = '0'
			let  roleList = [];
			if(roleData.retCode == '1') {
			  if(roleData.dataRows[0].roleName.indexOf("安委办主办")>-1){
				  roleTypeData = '1'
			  }else if(roleData.dataRows[0].roleName.indexOf("办公室安全接口人")>-1){
				  roleTypeData = '2'
			  }else if(roleData.dataRows[0].roleName.indexOf("安全员")>-1 && Cookie.get("OUID")==OUID) {//部门安全员
				  roleTypeData = '3'
			  }else if(roleData.dataRows[0].roleName.indexOf("安全员")>-1 && Cookie.get("OUID")!=OUID) {//分院部门安全员
				  roleTypeData = '4'
			  }

			 
		  }
				if(response.retCode === '1'){
				  if(roleTypeData==1||roleTypeData==2){
					const res = response.dataRows;
					 let roleRequstData = res.filter((v) => {
								  let item = v.roleName
									  return item.indexOf('分院院领导') >-1 ||
									  item.indexOf('各部门/中心负责人') >-1 || item.indexOf('分院办公室负责人') >-1 || 
									  item.indexOf('各部门/中心安全员')>-1 
					})
				  
					roleRequstData.map((item, index) => {
					  item.roleName = item.roleName.slice(19);
					  item.key=index;
					  item.type = '1';
					});
				  //   console.log(res);
				  let roleDefault = [
					// {
					//   "roleId": '1',
					//   "roleName": "本部全员"
					// },
					// {
					//   "roleId": '0',
					//   "roleName": "本部/分院全员"
					// },
					{
						"roleId": '2',
						"roleName": "分院全员"
					  },
				  ]
				  roleList = [ ...roleRequstData ,...roleDefault];
					yield put({
					  type:'save',
					  payload:{
						checkObjectAndContentList:roleList
					  }
					})
				  }else if(roleTypeData==3||roleTypeData==4){
					const res = response.dataRows;
					 let roleRequstData = res.filter((v) => {
								  let item = v.roleName
									  return item.indexOf('本部全员') >-1 || item.indexOf('院领导') >-1 || item.indexOf('院主管领导') >-1 ||
									  item.indexOf('各部门/中心负责人') >-1 || item.indexOf('各部门/中心安全员') >-1 || item.indexOf('院办公室负责人') >-1 
					})
				  
					roleRequstData.map((item, index) => {
					  item.roleName = item.roleName.slice(19);
					  item.key=index;
					  item.type = '1';
					});
				  //   console.log(res);
				  let roleDefault = [
					{
					  "roleId": '1',
					  "roleName": "本院全员"
					},
					// {
					//   "roleId": '0',
					//   "roleName": "本部/分院全员"
					// },
				  ]
				  roleList = [ ...roleRequstData ,...roleDefault];
					yield put({
					  type:'save',
					  payload:{
						checkObjectAndContentList:roleList
					  }
					})
				  }
				}else {
				  message.error("查询失败");
			  }
		  
		  },
		  *zhuguanfuyanzhang({}, {call, put}){
			let recData={
			  arg_user_id:Cookie.get('userid')
			};
			const response = yield call(myserver.queryOffice, recData);
				// console.log(response,1230000);
				if(response.retCode === '1'){
				  if(response.dataRows){
					const res = response.dataRows;
					res.map((item, index) => {
					  item.roleName = item.roleName.slice(19);
					  item.key=index;
					  item.type = '1';
					});
					// console.log(res);
					yield put({
					  type:'save',
					  payload:{
						checkZhuGuanFuYanZhangList:res
					  }
					})
				  }
				}else {
				  message.error(response.retVal);
			  }
		  
		  },
   
  
    *submitReport({niandu,nianfen,yuefen}, {call, put}){
      let recData={
		buttonType:niandu,
        year:nianfen,
        month:yuefen
      };
      const response = yield call(myserver.newbaogao, recData);
                // console.log(response,"创建报告");
                if(response.retCode == '1'){
                  if(response.dataRows){ 
                    const res = response.dataRows;
                    res.map((item,index)=>{
                      item.key=index;
                      item.type = '1';
                    })
                    console.log(res,"列表数据");
                    
                    yield put({
                      
                      type:'save',
                      payload:{
                        reportList:res
                      }
                    })
				  }
		// 		  const { examineImg} = response.dataRows[0];
        //   if(examineImg.length>0){
             
        //     yield put({
        //     type:'save',
        //     payload:{
        //       examineImgId: JSON.parse(examineImg), //图片
        //     }
        //   })
        //   }
                }else {
                  message.error(response.retVal);
              }





    },
  //报送主管副院长
  *baoSongZhuGuanFuYuanZhang({arg_statistics_id,arg_result_content,arg_result_img}, {call, put,select}){
	const {roleObject2} = yield select(v =>v.newReport)
	let roleData = yield call(myserver.queryUserInfo, {});// 登录人角色查询
    let arg_current_role=""
    if(roleData.dataRows[0].roleName.indexOf("安委办主办")> -1){
      arg_current_role=0
    }else if(roleData.dataRows[0].roleName.indexOf("分院办公室安全接口人")> -1){
      arg_current_role=1
    }
	let recData={
    arg_user_id:Cookie.get('userid'),
    arg_statistics_id:arg_statistics_id,
    arg_result_content:arg_result_content,
    arg_result_img:arg_result_img,
	arg_user_ids:roleObject2.join(),
	arg_current_role
	};
	const response = yield call(myserver.setInformToOffice, recData);
		  response.retCode=="1"?message.info('提交成功'):message.error(response.retVal)
  },
  //报送领导
  *baoSongLingDao({arg_statistics_id,arg_result_content,arg_result_img}, {call, put}){
	//   console.log(arg_statistics_id)
	let recData={
	  arg_user_id:Cookie.get('userid'),
    arg_statistics_id:arg_statistics_id,
    arg_result_content:arg_result_content,
    arg_result_img:arg_result_img
	};
	const response = yield call(myserver.notiStatisticsLead, recData);
		  response.retCode=="1"?message.info('提交成功'):message.error(response.retVal)
  },
 // 检查通报
 *jianChaTongBao({arg_statistics_id,arg_result_content,arg_result_img}, {call, put,select}){
    
    const {roleObject} = yield select(v =>v.newReport)
	let roleData = yield call(myserver.queryUserInfo, {});// 登录人角色查询
    let arg_current_role=""
    if(roleData.dataRows[0].roleName.indexOf("安委办主办")> -1){
      arg_current_role=0
    }else if(roleData.dataRows[0].roleName.indexOf("分院办公室安全接口人")> -1){
      arg_current_role=1
    }
	let recData={
    arg_user_id:Cookie.get('userid'),
    arg_statistics_id:arg_statistics_id,
    arg_visible:roleObject.join(),
    arg_result_content:arg_result_content,
	arg_result_img:arg_result_img,
	arg_current_role
	};
  const response = yield call(myserver.statisticsNoti, recData);
  
      response.retCode=="1"?message.info('提交成功'):message.error(response.retVal)
      if(response.retCode=="1"){
        yield put({
        type:'save',
       
      })
      }
      
  },
 //信息发布
 *xinXiFaBu({arg_statistics_id,arg_result_content,arg_result_img}, {call, put}){
	let recData={
    arg_user_id:Cookie.get('userid'),
    arg_statistics_id:arg_statistics_id,
    arg_result_content:arg_result_content,
    arg_result_img:arg_result_img
	};
	const response = yield call(myserver.issueStatistics, recData);
		  response.retCode=="1"?message.info('提交成功'):message.error(response.retVal)
  },

//图片上传
    *saveUploadFile({value,previewImage,previewVisible}, {put,call, select}) { //上传图片
      const {examineImgId} = yield select(s => s.newReport)
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
    *handleCancel({}, {put}) { //取消预览
      yield put({
        type: 'save',
        payload: {
          previewVisible: false
        }
      })
    },
    *onRemove({file}, {put,call, select}) { //删除图片
      const {examineImgId} = yield select(s => s.newReport)
      let delFileId = file.response.filename.FileId;
      examineImgId.splice(delFileId, 1)
      yield put({
        type: 'save',
        payload: {
          examineImgId: examineImgId
        }
      })
    },
	*roleListData({record}, {put}) { //保存通知 对象
		let newroleObject = [...record]
		yield put({
		  type:'save',
		  payload:{
			roleObject: newroleObject,
		  }
		})
	  },
	  *roleListData2({record}, {put}) { //保存通知 对象
		let newroleObject = [...record]
		yield put({
		  type:'save',
		  payload:{
			roleObject2: newroleObject,
		  }
		})
	  },

  
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/securityCheck/checkStatistics/createReport') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },

};
