/**
 * 作者：任华维
 * 日期：2017-07-31
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：项目考核指标
 */
import * as projAssessmentStandardServices from '../../../../services/project/projAssessmentStandard';
import { routerRedux } from 'dva/router';
import config from '../../../../utils/config';
export default {
    namespace: 'projAssessmentStandard',
    state: {
        department:[],
        projectList:[],
        projectType:[]
    },
    reducers: {
        departmentQuerySuccess(state, {payload}) {
            return {
                ...state,
                department : payload
            };
        },
        projectListQuerySuccess(state, {payload}) {
            return {
                ...state,
                projectList : payload
            };
        },
        projectTypeQuerySuccess(state, {payload}) {
            return {
                ...state,
                projectType : payload
            };
        },
    },
    effects: {
        *departmentQuery ({payload}, { call, put, select }) {
            const res = yield call(projAssessmentStandardServices.departmentQuery,{'arg_tenantid':'10010'})
            if (res.RetCode === '1') {
                yield put({
                    type : 'departmentQuerySuccess',
                    payload : res.DataRows
                });
            }
        },
        *projectListQuery ({payload}, { call, put, select }) {
            const res = yield call(projAssessmentStandardServices.projectListQuery,{'arg_staff_id':localStorage.getItem('staffid'),...payload})
            if (res.RetCode === '1') {

                yield put({
                    type : 'projectListQuerySuccess',
                    payload : res.DataRows
                });
            }
        },
        *projectTypeQuery ({payload}, { call, put, select }) {
            const res = yield call(projAssessmentStandardServices.projectTypeQuery,payload)
            if (res.RetCode === '1') {

                yield put({
                    type : 'projectTypeQuerySuccess',
                    payload : res.DataRows
                });
            }
        },
        // 跳转页
        *projAssessmentStandardInfo ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/projectApp/projexam/examsetting/projAssessmentStandardInfo',query:payload}));
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/projexam/examsetting') {
                    dispatch({
                        type : 'departmentQuery'
                    });
                    dispatch({
                        type : 'projectListQuery'
                    });
                    dispatch({
                        type : 'projectTypeQuery',
                        payload : {
                            transjsonarray:'{"condition":{"type_state":"0"},"sequence":[{"type_order":"0"}]}'
                        }
                    });
                }
            });
        },
    },
};
