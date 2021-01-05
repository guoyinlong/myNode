/**
 * 作者：郭银龙
 * 创建日期： 2020-10-08
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 稿件发布情况详情
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myServices from '../../../services/newsOne/newsOneServers';
export default {
	namespace: 'releaseDetails',
	loading: true,
	state: {
		dataList:"",
		tableUploadFile:[],
		tableUploadFile2:[]
	},
    reducers: { // 刷新数据
			save(state, action) {
				return { ...state,
					...action.payload
				};
			},
    },
  	effects: {
            // 稿件发布情况详情
            *queryUserInfo({query}, {call, put, select}){
              yield put({
                type: 'save',
                payload: {
                  dataList:'',
                  tableUploadFile:[],
                  tableUploadFile2:[]
                }
              })
				{
				if(query.type=="稿件名称的发布情况"){
					let recData = {
					userid:Cookie.get('userid'),
					materiaId: query.id
				  };
				let contentData = yield call(myServices.queryMaterialItem, recData);
				const res = contentData.dataRows;
                if(contentData.retCode == '1') {
                        // res.map((item, index) => {
                        //     item.key = index;
                        //     item.type = '1';
						// });
                    yield put({
                        type: 'save',
                        payload: {
							dataList:res,
							tableUploadFile:res.releaseNewsMsg?JSON.parse(res.releaseNewsMsg):[],
							tableUploadFile2:res.newsInfluence?JSON.parse(res.newsInfluence):[]
                        }
                    })
                }
				}else{

						let recData = {
								userid:Cookie.get('userid'),
								materiaId: query.id
							};
							let contentData = yield call(myServices.sucaifankuixiangqing, recData);
							const res = contentData.dataRows;
							if(contentData.retCode == '1') {
									// res.map((item, index) => {
									//     item.key = index;
									//     item.type = '1';
									// });
								yield put({
									type: 'save',
									payload: {
										dataList:res,
										tableUploadFile:res.releaseNewsMsg?JSON.parse(res.releaseNewsMsg):[],
										tableUploadFile2:res.newsInfluence?JSON.parse(res.newsInfluence):[]
									}
								})
							}
				}

			}

            },
	},

	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if(pathname === '/adminApp/newsOne/releaseOfManuscripts/releaseOfManuscriptsDetails'||pathname === '/adminApp/newsOne/newsPoolIndex/releaseOfManuscriptsDetails'){

					dispatch({
						type: 'queryUserInfo',
								query
						});

				}
			});
		},
	},
}
