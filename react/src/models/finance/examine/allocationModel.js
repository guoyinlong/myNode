/**
 * 文件说明：组织绩效考核人员配置
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-11-29
 */
import * as servers from '../../../services/finance/examine';
import {message} from 'antd';

export default {
    namespace: 'allocationModel',
    state: {
        applicants: [],
        users: [],
        examinerUsers: [],
        mutualUsersData: [],
        itUsersData: []
    },
    reducers: {
        save(state, {payload}) {
            return {
                ...state,
                ...payload
            }
        }
    },
    effects: {
        // 查询申请人信息
        * getApplicants({payload}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.getApplicants, {
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        applicants: DataRows
                    }
                })
            } else {
                message.error(RetVal);
            }
        },
        // 插入申请人信息
        * addApplicants({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.addApplicants, {
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'getApplicants',
                    payload: {
                        year: payload.year
                    }
                });
            } else {
                message.error(RetVal);
            }
        },
        // 修改申请人
        * modifyApplicant({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.modifyApplicant, {id: payload.id, userId: payload.userId});
            if (RetCode === 1) {
                yield put({
                    type: 'getApplicants',
                    payload: {
                        year: payload.year
                    }
                })
            } else {
                message.error(RetVal);
            }
        },
        // 查询用户
        * getUsers({}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.getUsers);
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        users: DataRows
                    }
                });
            } else {
                message.error(RetVal);
            }
        },
        // 查询审核人信息
        * getExaminerUsers({payload}, {call, put}) {
            const unitKey = payload ? payload.unitKey : 0;
            const {RetCode, RetVal, DataRows} = yield call(servers.getExaminerUsers, {unitKey, year: payload.year});
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        examinerUsers: DataRows,
                    }
                })
            } else {
                message.error(RetVal);
            }
        },
        // 插入审核人信息
        * addExaminerUsers({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.addExaminerUsers, {
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'getExaminerUsers',
                    payload: {
                        year: payload.year,
                        unitKey: '0'
                    }
                });
            } else {
                message.error(RetVal);
            }
        },
        // 修改申请人
        * modifyExaminerUser({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.modifyExaminerUser, {id: payload.id, userId: payload.userId});
            if (RetCode === 1) {
                yield put({
                    type: 'getExaminerUsers',
                    payload: {
                        unitKey: payload.unitKey,
                        year: payload.year
                    }
                })
            } else {
                message.error(RetVal);
            }
        },
        // 互评生成
        * addMutual({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.addMutual, {
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'getMutualUsers',
                    payload: {
                        year: payload.year
                    }
                })
            } else {
                message.error(RetVal);
            }
        },
        // 互评查询
        * getMutualUsers({payload}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.getMutualUsers, {
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        mutualUsersData: DataRows
                    }
                })
            } else {
                message.error(RetVal);
            }
        },
        // 互评修改
        * supportModifyExaminerUser({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.supportModifyExaminerUser, {id: payload.id, userId: payload.userId});
            if (RetCode === 1) {
                yield put({
                    type: 'getMutualUsers',
                    payload: {
                        year: payload.year
                    }
                })
            } else {
                message.error(RetVal);
            }
        },
        // // it生成
        // * addIt({}, {call, put}) {
        //     const {RetCode, RetVal} = yield call(servers.addIt);
        //     if (RetCode === 1) {
        //         yield put({
        //             type: 'getItUsers'
        //         })
        //     } else {
        //         message.error(RetVal);
        //     }
        // },
        // // it查询
        // * getItUsers({}, {call, put}) {
        //     const {RetCode, RetVal, DataRows} = yield call(servers.getItUsers);
        //     if (RetCode === 1) {
        //         yield put({
        //             type: 'save',
        //             payload: {
        //                 itUsersData: DataRows
        //             }
        //         })
        //     } else {
        //         message.error(RetVal);
        //     }
        // },
        // // it修改
        // * itModifyExaminerUser({payload}, {call, put}) {
        //     const {RetCode, RetVal} = yield call(servers.itModifyExaminerUser, {id: payload.id, userId: payload.userId});
        //     if (RetCode === 1) {
        //         yield put({
        //             type: 'getItUsers'
        //         });
        //     } else {
        //         message.error(RetVal);
        //     }
        // },
    },

    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                switch (pathname) {
                    case '/financeApp/examine/setting':
                        dispatch({
                            type: 'getApplicants',
                            payload: {
                                year: new Date().getFullYear()
                            }
                        });
                        dispatch({
                            type: 'getUsers'
                        });
                        dispatch({
                            type: 'getExaminerUsers',
                            payload: {
                                year: new Date().getFullYear(),
                                unitKey: '0'
                            }
                        });
                        dispatch({
                            type: 'getMutualUsers',
                            payload: {
                                year: new Date().getFullYear()
                            }
                        });
                        // dispatch({
                        //     type: 'getItUsers'
                        // });
                        break;
                }
            })
        }
    }
}
