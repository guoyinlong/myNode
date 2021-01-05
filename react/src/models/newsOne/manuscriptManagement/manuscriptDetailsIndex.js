/**
 * 作者：郭银龙
 * 日期：2020-9-28
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：稿件详情
 */ 


import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myServices from '../../../services/newsOne/newsOneServers';
export default {
	namespace: 'manuscriptDetails', 
	// loading: true, 
	state: {
    auth:[],
    gaojianList: "",
    tableUploadFile: [], // 附件上传
    type:"",
    tuihuiValue:"",//回退原因
    // examineImgId: [], // 富文本上传的图片
    // outputHTML: "", // 富文本上传的文本

	},
    reducers: { // 刷新数据
			save(state, action) {
				return { ...state,
					...action.payload
				};
			},
    },
  	effects: {
      * init({query}, {put}) {
        yield put({
          type:'save',
          payload:{
            newsId: query.newsId,
            difference:query.difference
          }
        })
              yield put({
                  type:'gaojiandetail',
        })
       
          },
    //获取详情数据
    * gaojiandetail({}, { call, put,select }) {
      const {difference} = yield select(v =>v.manuscriptDetails)
      yield put({
        type: 'save',
        payload: {
          gaojianList: "",
          auth:[],
          tableUploadFile: [], // 附件本上传
          type:"",
          // examineImgId: [], // 富文本上传的图片
          // outputHTML: "", // 富文本上传的文本

        }
      })
      if(difference=="审核"){
        const {newsId,difference} = yield select(v =>v.manuscriptDetails)
			let recData = {
				approval_id:newsId
			  };
        // const response = yield call(myServices.queryCheckItem, recData);
        const response = yield call(myServices.showTodoApprovalDetail, recData);
        if (response.retCode === '1') {
          if (response.dataRows.projApply.businessObj!=null) {
            const res = response.dataRows.projApply.businessObj;
            yield put({
              type: 'save',
              payload: {
                gaojianList: res,
                auth:res.author,
                tableUploadFile: JSON.parse(res.news.materialUpload).outputHTML?[]:JSON.parse(res.news.materialUpload), // 上传的附件
                type:difference,
                id:newsId,
                taskid:response.dataRows.taskId,
                tuihuiValue:"",//退回原因
                auditProcess:res.news.auditProcess=="分院级"?false:true,
                branchInner:res.news.auditProcess=="分院级"?true:false,
                isYearNews:res.news.auditProcess=="院级"?true:false,
                // examineImgId: JSON.parse(imglist).examineImgId, // 富文本上传的图片
                // outputHTML: JSON.parse(imglist).outputHTML, // 富文本上传的文本
                taskName:response.dataRows.taskName,
                tableid:response.dataRows.projApply.tableId,
                pass:response.dataRows.pass,
                isEmergency:res.news.isUrgent,

              }
            })
          }
        }else{
          message.error(response.retVal);
        }
      }else{
        const {newsId} = yield select(v =>v.manuscriptDetails)
        let recData = {
          newsId: newsId
        };
        const response = yield call(myServices.gaojianxiangqing, recData);
         const imglist=(response.dataRows[0].news.materialUpload).replace(/^\"|\"$/g,'')
        if (response.retCode === '1') {
          if (response.dataRows) {
            const res = response.dataRows[0];
            // res.map((item, index) => {
            //   item.key = index;
            //   item.type = '1';
            // });
            yield put({
              type: 'save',
              payload: {
                gaojianList: res,
                auth:res.author,
                tableUploadFile: JSON.parse(res.news.materialUpload).outputHTML?[]:JSON.parse(res.news.materialUpload), // 上传的附件
                // examineImgId: JSON.parse(imglist).examineImgId, // 富文本上传的图片
                // outputHTML: JSON.parse(imglist).outputHTML, // 富文本上传的文本

              }
            })
          }
        }else{
          message.error(response.retVal);
        }
      }
     
    },
    //获取审批环节数据
    * gaojianhuanjie({}, { call, put ,select}) {
      const {newsId,tableid} = yield select(v =>v.manuscriptDetails)
			let recData = {
				id:tableid?tableid:newsId
			  };
        const response = yield call(myServices.queryNewsLink, recData);
        if (response.retCode === '1') {
          if (response.dataRows) {
            const res = response.dataRows;
            res.map((item, index) => {
              if(item.commentDetail){
                if(JSON.parse(item.commentDetail).endApply==false){
                item.commentDetail="不同意："+JSON.parse(item.commentDetail).opinion
    
                }else if(JSON.parse(item.commentDetail).endApply==true){
                  item.commentDetail="同意"
                } else{
                  item.commentDetail="重新提交"
                }  
    
              }
              if (item.state == "0") {
                item.failUnm = "办理中"
              } else if (item.state == "1") {
                item.failUnm = "办毕"
              }
              item.key = index;
              item.type = '1';
            });
            yield put({
              type: 'save',
              payload: {
                reportList: res
              }
            })
          }
        }else{
          message.error(response.retVal);
        }
      },
    //同意审核
    * onAgree({record},{call, put,select}){
      const {taskid,auditProcess,isYearNews,isEmergency,branchInner}= yield select (state =>state.manuscriptDetails);
      let recData={
        user_id:Cookie.get('userid'),
        user_name:Cookie.get('username'),
        form:JSON.stringify({
          endApply:true,//审核同意
          isYearOrOutNews:auditProcess,//是否是分院和外部媒体
          isYearNews:isYearNews,//是否是分院
          isEmergency:isEmergency,//紧急
          branch_inner:branchInner,//分院级传true
          jump_branch_chief:record?record:false,//跳过分院主管业务院长
          jump_branch_flack_lead:record?record:false,//跳过分院办公室主任
          
        }),
        task_id:taskid,
      };
      const response = yield call(myServices.completeTask, recData); 
      if(response.dataRows.RetCode === '1'){
        if(response.dataRows.DataRows){
            message.info('审核成功');
                yield put(routerRedux.push({
                    pathname:'/adminApp/newsOne/myReview'
                }))
        }
      }else{
        message.error(response.dataRows.RetVal);
      }
    
    },
    //回退原因
    * tuihui({record},{call, put,select}){
      if(record.length<200){
        yield put({
				type:'save',
				payload: {
                tuihuiValue: record,
                }
			})
      }else{
        message.info("不能超过200个字符")
      }
			

    },
    // 确定回退
    * handle({},{call, put,select}){
      const {taskid,tuihuiValue}= yield select (v =>v.manuscriptDetails);
      let recData={
        user_id:Cookie.get('userid'),
        user_name:Cookie.get('username'),
        form:JSON.stringify({endApply:false,opinion:tuihuiValue,isEmergency:false}),
        task_id:taskid,
      };
      const response = yield call(myServices.completeTask, recData); 
      if(response.retCode === '1'){
        if(response.dataRows){
          message.info('退回成功');
                yield put(routerRedux.push({
                    pathname:'/adminApp/newsOne/myReview'
                }))
        }
      }else{
        message.error(response.retVal);
      }
    }
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if(pathname === '/adminApp/newsOne/manuscriptManagement/manuscriptDetails'){
					dispatch({
						type: 'init',
								query
                  });
				}
			});
		},
	},
}
