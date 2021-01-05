/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：团队管理
 */
import * as teamManageServices from '../../../../services/project/teamManage';
import { routerRedux } from 'dva/router';
export default {
    namespace: 'projTeamInfo',
    state: {
        dataSource:[],
        inputStr:''
    },
    reducers: {
        querySuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
    },
    effects: {
        *projTeamInfoQuery ({payload}, { call, put }) {
            yield put({
                type : 'querySuccess',
                payload : payload
            });
            const res = yield call(teamManageServices.projTeamInfoQuery,{...payload,'arg_tenantid':10010});
            if (res.retCode === '1') {
                yield put({
                    type : 'querySuccess',
                    payload : {dataSource:res.dataRows}
                });
            }
        },
        //
        *reSearch ({payload}, { call, put }) {
            yield put(routerRedux.replace({pathname:'/projectApp/projPrepare/teamManage/projTeamInfo',query:payload}));
        },
        // 跳转页
        *turnToPage ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/projectApp/projPrepare/teamManage/projTeamInfo',query:payload}));
        },
        // 跳转页
        *turnToBack ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/projectApp/projPrepare/teamManage'}));
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/projPrepare/teamManage/projTeamInfo') {
                    dispatch({
                        type : 'projTeamInfoQuery',
                        payload : query
                    });
                }
            });
        },
    },
};
