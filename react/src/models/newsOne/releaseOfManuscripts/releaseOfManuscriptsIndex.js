/**
 * 作者：郭银龙
 * 创建日期： 2020-9-28
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 稿件发布情况首页
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myServices from '../../../services/newsOne/newsOneServers';
export default {
	namespace: 'releaseHome', 
	loading: true, 
	state: {
		qingkuangfankuiList:"",
	}, 
    reducers: { // 刷新数据
			save(state, action) {
				return { ...state,
					...action.payload
				};
			},
    },
  	effects: {
            // 稿件发布情况首页
            *queryUserInfo({page,beginTime,endTime,inputvalue3}, {call, put, select}){
				let recData = {
					start:beginTime?beginTime:"",//开始时间
					end:endTime?endTime:"",//结束时间
					releaseNewsName:inputvalue3?inputvalue3:"",//发布稿件名称
					pageCurrent:page==undefined?1:page,//表示请求第几页, 从1开始, 必须是正整数，默认为第1页
					RowCount:10,//表示每页数量，必须是正整数,默认为所有
				  };
                let contentData = yield call(myServices.qingkuangfankui, recData);
            
                if(contentData.retCode == '1') { 
					const res = contentData.dataRows;
					const {pageCurrent,pageSize,allCount} = contentData;
                        res.map((item, index) => {
                        
                            item.key = index;
                            item.type = '1';
                        });
                    yield put({
                        type: 'save',
                        payload: {
							qingkuangfankuiList:res,
							pageCurrent:pageCurrent,//第几页
							RowCount:pageSize,//页面条数
							allCount:allCount,//总数
                        }
                    })
                }
            },
	},
		
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if(pathname === '/adminApp/newsOne/releaseOfManuscripts'){
					
					dispatch({
						type: 'queryUserInfo',
								query
						});
				
				}
			});
		},
	},
}
