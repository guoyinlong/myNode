/**
 * 作者：郭银龙
 * 创建日期： 2020-11-9
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 稿件名称的发布情况
 */
import Cookie from 'js-cookie'; 
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myServices from '../../../services/newsOne/newsOneServers';
export default {
	namespace: 'manuscriptDetail', 
	state: {
		manuscriptDetailList:[],
		allCount:"",//总数
		pageCount:"",//总条数
		pageCurrent:"",//第几页
		rowCount:"",//页面条数
	},
    reducers: { // 刷新数据
			save(state, action) {
				return { ...state,
					...action.payload
				};
			},
    },
  	effects: {
        //详情查询
        *queryUserInfo({query,page}, {call, put, select}){
			let recData = {
                newsId: query.id,
                pageCurrent:page?page:1,
                pageSize:10
			  };
            let detailData = yield call(myServices.queryStatisticsListItem, recData);
            if(detailData.retCode == '1') { 
                if(detailData.dataRows){
					const res=detailData
                    yield put({
                            type: 'save',
                            payload: {
								manuscriptDetailList:res.dataRows, 
								allCount:res.allCount,//总数
								pageCount:res.pageCount,//总条数
								pageCurrent:res.pageCurrent,//第几页
								rowCount:res.rowCount,//页面条数
                            }
                        })
                }
            }
        },
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if(pathname === '/adminApp/newsOne/statisticalReport/manuscriptDetail'){
					dispatch({
						type: 'queryUserInfo',
								query
                        });
				}
			});
		},
	},
}
