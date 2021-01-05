/**
 * 文件说明：组织绩效考核服务评价
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-10-21
 */
import * as servers from '../../../services/finance/examine';
import messageBig from '../../../components/commonApp/message';
import {message} from 'antd';
import {routerRedux} from 'dva/router';

export default {
    namespace: 'supportModel',

    state: {
        supports: [],
        supportItem: [],
        submitLoading: false,
        hasAdd: false
    },

    reducers: {
        save(state, {payload}) {
            return {
                ...state,
                ...payload
            }
        },
        jsonSave(state, {payload}) {
            const list = JSON.stringify(payload.value);
            return {
                ...state,
                [payload.key]: JSON.parse(list)
            }
        },
    },

    effects: {
        // 获取support
        * getSupports({}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.getSupports);
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        supports: DataRows
                    }
                });
            } else {
                message.error(RetVal);
            }
        },
        * addSupport({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.addSupport, {year: payload.year});
            if (RetCode === 1) {
                yield put({
                    type: 'getSupports'
                });
            } else {
                message.error(RetVal);
            }
        },
        // 获取supportItem
        * getSupportItem({payload}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.getSupportItem, {supportId: payload.supportId});
            if (payload.status == 0) {
                messageBig.info('请对您较为了解的部门进行评价');
            }
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        supportItem: DataRows
                    }
                });
            } else {
                message.error(RetVal);
            }
        },
        // 打分
        * markScore({payload}, {call}) {
            const {RetCode, RetVal} = yield call(servers.markScore, {supportItemId: payload.supportItemId, score: payload.score});
            if (RetCode === 1) {
                message.success(RetVal);
            } else {
                message.error(RetVal);
            }
        },
        // 提交打分
        * submitScore({payload}, {call, put}) {
            yield put({
                type: 'save',
                payload: {
                    submitLoading: true
                }
            })
            const {RetCode, RetVal} = yield call(servers.submitScore, {
                supportId: payload.supportId
            });
            if (RetCode === 1) {
                message.success(RetVal);
                yield put(routerRedux.push({
                    pathname: '/financeApp/examine/support'
                }));
            } else {
                message.error(RetVal);
            }
            yield put({
                type: 'save',
                payload: {
                    submitLoading: false
                }
            });
        },
        // 生成支撑服务评价人
        * addSupportExaminerUsers({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.addSupportExaminerUsers, {
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'hasAddSupportExaminerUsers',
                    payload: {
                        year: payload.year
                    }
                });
            } else {
                message.error(RetVal);
            }
        },
        // 支撑服务评价人是否生成
        * hasAddSupportExaminerUsers({payload}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.hasAddSupportExaminerUsers, {
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        hasAdd: DataRows.hasAdd
                    }
                });
            } else {
                message.error(RetVal);
            }
        },
    },

    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                switch (pathname) {
                    case '/financeApp/examine/support':
                        dispatch({
                            type: 'getMutualConf'
                        });
                        dispatch({
                            type: 'getSupports'
                        });
                        break;
                    case '/financeApp/examine/support/supportDetail':
                        dispatch({
                            type: 'getSupportItem',
                            payload: {
                                supportId: query.supportId,
                                status: query.status
                            }
                        })
                        break;
                    case '/financeApp/examine/setting':
                        dispatch({
                            type: 'hasAddSupportExaminerUsers',
                            payload: {
                                year: new Date().getFullYear()
                            }
                        })
                }
            })
        }
    }
}
