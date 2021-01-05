/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：团队管理
 */
import * as teamManageServices from '../../../../services/project/teamManage';
import { routerRedux } from 'dva/router';
export default {
    namespace: 'caiHaoSearchDetail',
    state: {
        dataSource:[],
        pagination:{},
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
        *caiHaoSearchDetail ({payload}, { call, put }) {
            const param = {
                'arg_dept_name':'联通软件研究院-公众研发事业部',
                ...payload
            }
            param.arg_page_size = param.arg_page_size || 10;
            param.arg_page_current = param.arg_page_current || 1;
            const res = yield call(teamManageServices.projPuTeamQuery,param);
            if (res.RetCode === '1') {
                yield put({
                    type : 'querySuccess',
                    payload : {'dataSource':res.DataRows,'pagination':{'total':parseInt(res.RowCount),'current':param.arg_page_current,'pageSize':param.arg_page_size}}
                });
            }
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/projPrepare/teamManage/teamManageSearch/teamManageSearchDetail') {
                    dispatch({
                        type : 'caiHaoSearchDetail'
                    });
                }
            });
        },
    },
};
