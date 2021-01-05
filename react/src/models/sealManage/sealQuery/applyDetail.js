/**
 * 作者：窦阳春
 * 日期：2019-9-20
 * 邮箱：douyc@itnova.com.cn
 * 功能：个人查询 申请详情页
 */
// import Cookie from 'js-cookie';
// import { message } from "antd";
// import { routerRedux } from 'dva/router';
// import * as Services from '../../../services/sealManage/sealApply';

// export default {
// 	namespace: 'applyDetail',
// 	loading: false,
// 	state: {
//         applicant: "",
//         applyTime: '',
//         applySealName: '',
//         useStartTime: '',
//         useSealReason: '',
//         useEndTime: '',
//         isSecret: '',
//         jump: "1",
//         query:{},
//         applyList: [], // 申请详情数据
//         sealFileData: [], // 用印文件数据
//         approvalList: [], // 审批流程数据
//         userName: "1", // 申请人
//         createDate: "11", // 申请时间
//         formName: "111", // 需使用印章名称
//         borrowDate: "111", // 借用时间
//         returnDate: "111", //归还时间
//         reason: "111", // 使用事由
//         secret: "111", // 是否涉密
// 	},

// 	reducers: { // 刷新数据
// 		save(state, action) { 
// 			return { ...state,
// 				...action.payload 
// 			};
// 		},
// 	},

//   	effects: {
// 		*init({query},{call, put, select}) {
//             const { applicant_name, datetime, dept_name, form_uuid, state, title} = query;
//             let postData = {
//                 arg_form_uuid: form_uuid
//             }
//             let data = yield call(Services.applyDetailSerch, postData)
//             let downloadData = yield call(Services.uploadSearch, postData)
//             // console.log(downloadData, 'downloadData')
//             const { RetCode, DataRows } = data
//             // console.log(DataRows[0], 'da')
//             if(RetCode === '1') {
//                 DataRows.map((v, i) => {
//                     if(v.form_if_secret == '0'){ //是否涉密 0 否 1 是
//                         v.if_secret = "否"
//                     }else {
//                         v.if_secret = '是'
//                     }
//                 })
//                 yield put({
//                     type: 'save',
//                     payload: {
//                         applyList:DataRows,
//                         query: query,
//                         jump: "1",
//                         applicant: applicant_name,
//                         applyTime: datetime,
//                         userName: DataRows[0].screate_user_name,
//                         createDate: DataRows[0].screate_date,
//                         formName: DataRows[0].form_name,
//                         borrowDate: DataRows[0].form_borrow_date,
//                         returnDate: DataRows[0].form_return_date,
//                         reason: DataRows[0].form_reason,
//                         secret: DataRows[0].if_secret
//                     }
//                 })
//             }
//             if(downloadData.RetCode === '1') {  //用印文件
//                 downloadData.DataRows.map((v, i) => {
//                     v.key = i+1;
//                 })
//                 yield put({
//                     type: 'save',
//                     payload: {
//                         sealFileData: downloadData.DataRows
//                     }
//                 })
//             }
//         },
//         *download({record}, {call, put, select}) {
//             alert("下载文件")
//         },
//         // 审批流程
//         *handleProcess({},{call, put, select}) {
//             const {query} = yield select(state => state.applyDetail)
//             yield put({
//                 type: 'save',
//                 payload: {
//                     jump: "2"
//                 }
//             })
//             let postData = {
//                 form_uuid: query.form_uuid
//             }
//             const data = yield call(Services.approvalProcess, postData);
//             // console.log(data)
//             const { DataRows, RetCode } = data;
//             if (RetCode === '1') {
//                 DataRows.map((v, i) => {
//                     v.key = i+1;
//                     if(v.process_state == '0'){
//                         v.pState = "办毕"
//                     }else {
//                         v.pState = '办理中'
//                     }
//                 })
//             }
//             // console.log(DataRows)
//             yield put({
//                 type: 'save',
//                 payload: {
//                     approvalList: DataRows // 审批流程表格数据
//                 }
//             })
//         },
// },

// subscriptions: {
//       	setup({dispatch, history}) {
//         	return history.listen(({pathname, query}) => {
//           	if (pathname === '/adminApp/sealManage/sealQuery/applyDetail') { //此处监听的是连接的地址
//             	dispatch({
//                     type: 'init', // 匹配到路由，初始化页面
//                     query
//             	});
// 			  }
// 			});
// 		},
// 	},
// };
