/**
 * 作者：贾茹
 * 日期：2020-9-30
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-宣传渠道备案模块填报页面
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router'; 
import * as newsOneService from '../../../services/newsOne/newsOneServers.js';

export default {
	namespace: 'experienceSharingWrite',
	state: {
		caseTitle:'',  //案例分享标题名称
		shareResult:[], //上传文件的数据
	},

	reducers: {
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},

	effects: {
        //初始化数据
		* init({}, {call,put,select}) {
			//初始化数据
			yield put({
				type:'save',
				payload:{
					caseTitle:'',  //案例分享标题名称
					shareResult:[], //上传文件的数据
				}
			})
			/* const {deptsData} = yield select (state =>state.experienceSharingWrite);
			const response = yield call(newsOneService.queryOuDept);		
			if(response.retCode==='1'){
			  yield put({
				  type:'save',
				  payload:{
					  deptsData:response.deptsData,
					  tripals:response.tripals
				  }
			  })
			} */
			
		}, 
		
		//点击保存
		* saveCase({},{select,call,put}){
			const {caseTitle,shareResult} = yield select (state =>state.experienceSharingWrite);
			const recData = {
				titleName: caseTitle,
				shareDept: Cookie.get('dept_id'),
				shareDeptName: Cookie.get('deptname'),
				shareById: Cookie.get('userid'),
				shareByName: Cookie.get('deptname'),
				shareGain : JSON.stringify(shareResult),
				flag : '0',
			}
			const response = yield call (newsOneService.addCaseCaseExSharing,recData);
			if(response.retCode==='1'){
				message.info('保存成功');
				yield put(routerRedux.push({
					pathname:'/adminApp/newsOne/experienceSharingIndex'
				  }));
			}
		},
		//点击提交
		* submission({},{put,select,call}){
			const {caseTitle,shareResult} = yield select (state =>state.experienceSharingWrite);
			if(caseTitle === ""||shareResult.length === 0){
				message.info('请填写必填项');
			}else{
				const recData = {
					titleName: caseTitle,
					shareDept: Cookie.get('dept_id'),
					shareDeptName: Cookie.get('deptname'),
					shareById: Cookie.get('userid'),
					shareByName: Cookie.get('deptname'),
					shareGain : JSON.stringify(shareResult),
					flag : '1',
				}
				const response = yield call (newsOneService.addCaseCaseExSharing,recData);
				if(response.retCode==='1'){
					message.info('提交成功');
					yield put(routerRedux.push({
						pathname:'/adminApp/newsOne/experienceSharingIndex'
					  }));
				}
			}
			
		},

		//保存案例标题名称
		* handleCaseTitleChange({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					caseTitle:record.target.value
				}
			})
        }, 
        //点击上传保存文件相关信息
		* saveUploadFile({value}, {put,select}) {
            const { shareResult } = yield select (state => state.experienceSharingWrite)
             shareResult.push({
                upload_name: value.filename.RealFileName,
                AbsolutePath: value.filename.AbsolutePath,
                RelativePath: value.filename.RelativePath,
                key: value.filename.AbsolutePath,
               
              });
			yield put({
				type:'save',
				payload:{
					shareResult:JSON.parse(JSON.stringify(shareResult))
				}
            })
        }, 
	  //点击删除文件n
	  * deleteUpload({record }, {call,select,put}) {
			const {shareResult} = yield select(state => state.experienceSharingWrite);
			for (let i = 0; i < shareResult.length; i++) {
			const a = shareResult.filter(v => v.AbsolutePath !== record.AbsolutePath);
			yield put({
				type: 'save',
				payload: {
					shareResult: JSON.parse(JSON.stringify(a)),
				}
			})
			}
	  },
		
		//点击取消返回渠道备案首页
	   * canCel({},{put}){
			yield put(routerRedux.push({
				pathname: '/adminApp/newsOne/experienceSharingIndex'
			}));
		},
	},
	subscriptions: {
		setup({dispatch, history}) {
		  return history.listen(({pathname, query}) => {
			if (pathname === '/adminApp/newsOne/experienceSharingIndex/experienceSharingWrite') { //此处监听的是连接的地址
			  dispatch({
				type: 'init',
				query
			  });
			}
		  });
		},
	  },

};