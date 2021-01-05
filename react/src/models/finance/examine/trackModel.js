/**
 * 文件说明：组织绩效考核指标跟踪
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2020-08-03
 */
import * as servers from '../../../services/finance/examine';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
import moment from 'moment';
moment.locale('zh-cn');

export default {
    namespace: 'trackModel',

    state: {
        reportActiveKey: '1', // 指标跟踪填报tab
        evaluateActiveKey: '1', // 指标跟踪评价tab
        monthReportYear: new Date().getFullYear() + '', // 月度填报指标筛选
        quarterReportYear: new Date().getFullYear() + '', // 季度填报指标筛选
        monthEvaluateDate: moment(), // 月度评价指标筛选
        monthEvaluateUnit: 'all',
        monthEvaluateStatus: 'all',
        monthEvaluateName: '',
        quarterEvaluateYear: new Date().getFullYear() + '', // 季度评价指标筛选
        quarterEvaluateQuarter: Math.ceil((new Date().getMonth() + 1) / 3) + '',
        quarterEvaluateUnit: 'all',
        quarterEvaluateName: '',
        quarterEvaluateStatus: 'all',
        monthtIndexData: {}, // 月度表格数据
        quarterIndexData: {}, // 季度表格数据
        monthCurrentPage: 1, // 月度当前页
        quarterCurrentPage: 1, // 季度当前页
        indexTypeData: [], // 指标数据
        indexMsg: {}, // 指标信息
        activeKey: '', // 选中的tab
        professTypeId: '', // 专业化指标的typeId
        indexTypeDataLoading: false,
        monthtIndexDataLoading: false,
        quarterIndexDataLoading: false,
        evaluateUserKeys: [], // 审核人权限
    },

    reducers: {
        save(state, {payload}) {
            return {
                ...state,
                ...payload
            }
        },
        // 更新indexType
        indexTypeSave(state, {payload}) {
            for (let v of state.indexTypeData) {
                if (v.id === payload.itemId) {
                    v.indexItemData = payload.DataRows;
                    break;
                }
            }
            return {
                ...state,
                indexTypeData: JSON.parse(JSON.stringify(state.indexTypeData))
            }
        },
        // 季度indexItem插入
        insertIndexType(state, {payload}) {
            for (let v of state.indexTypeData) {
                v.indexItemData = payload.DataRows
            }
            return {
                ...state,
                indexTypeData: JSON.parse(JSON.stringify(state.indexTypeData))
            }
        },
        // 更新indexItem
        indexItemSave(state, {payload}) {
            state.indexTypeData[payload.indexTypeIndex].indexItemData[payload.indexItemIndex][payload.key] = payload.value;
            return {
                ...state,
                indexTypeData: JSON.parse(JSON.stringify(state.indexTypeData))
            }
        },
        // 更新indexType完成状况
        indexTypeCompleteSave(state, {payload}) {
            state.indexTypeData.forEach((v1, i) => {
                let count = 0;
                if (i === payload.indexTypeIndex) {
                    for (let v2 of v1.indexItemData) {
                        if (v2[payload.checkKey] && v2[payload.key] !== 0) {
                            count++;
                        }
                    }
                    v1.completedCount = count;
                    if (count === v1.allItemCount) {
                        v1.allCompleted = true;
                    } else {
                        v1.allCompleted = false;
                    }
                }
            });
            return {
                ...state,
                indexTypeData: JSON.parse(JSON.stringify(state.indexTypeData))
            }
        }
    },

    effects: {
        // 获取月度填报指标表格数据
        * getMonthIndex({payload}, {call, put, select}) {
            yield put({
                type: 'save',
                payload: {
                    monthtIndexData: {},
                    monthCurrentPage: 1,
                    monthtIndexDataLoading: true
                }
            });
            const {RetCode, RetVal, DataRows, totalCount} = yield call(servers.getMonthOrQuarterIndex, {
                year: payload.year,
                month: '13',
                pageNo: payload.pageNo
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        monthtIndexData: {
                            totalCount,
                            DataRows
                        },
                        monthCurrentPage: payload.pageNo
                    }
                })
            } else {
                message.error(RetVal);
            }
            yield put({
                type: 'save',
                payload: {
                    monthtIndexDataLoading: false
                }
            });
        },
        // 获取季度填报指标表格数据
        * getQuarterIndex({payload}, {call, put, select}) {
            yield put({
                type: 'save',
                payload: {
                    quarterIndexData: {},
                    quarterCurrentPage: 1,
                    quarterIndexDataLoading: true
                }
            });
            const {RetCode, RetVal, DataRows, totalCount} = yield call(servers.getMonthOrQuarterIndex, {
                year: payload.year,
                quarter: '5',
                pageNo: payload.pageNo,
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        quarterIndexData: {
                            DataRows,
                            totalCount
                        },
                        quarterCurrentPage: payload.pageNo
                    }
                });
            } else {
                message.error(RetVal);
            }
            yield put({
                type: 'save',
                payload: {
                    quarterIndexDataLoading: false
                }
            });
        },
        // 获取月度指标tab
        * getMonthIndexTypes({payload}, {call, put}) {
            yield put({
                type: 'save',
                payload: {
                    indexTypeData: [],
                    indexTypeDataLoading: true
                }
            });
            const {RetCode, RetVal, DataRows} = yield call(servers.getMonthTypes, {
                indexId: payload.indexId,
                month: payload.month
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        indexTypeData: DataRows,
                        activeKey: DataRows[0].id
                    }
                });
                yield put({
                    type: 'getMonthIndexDetail',
                    payload: {
                        indexId: payload.indexId,
                        month: payload.month,
                        itemMonthId: DataRows[0].id
                    }
                });
            } else {
                message.error(RetVal);
            }
            yield put({
                type: 'save',
                payload: {
                    indexTypeDataLoading: false
                }
            });
        },
        // 获取月度填报指标详情
        * getMonthIndexDetail({payload}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.getMonthIndexTypeDetail, {
                indexId: payload.indexId,
                month: payload.month,
                itemMonthId: payload.itemMonthId
            });
            if (RetCode === 1) {
                yield put({
                    type: 'indexTypeSave',
                    payload: {
                        itemId: payload.itemMonthId,
                        DataRows
                    }
                });
            } else {
                message.error(RetVal);
            }
        },
        // 获取季度指标tab
        * getQuarterIndexTypes({payload}, {call, put}) {
            yield put({
                type: 'save',
                payload: {
                    indexTypeData: [],
                    indexTypeDataLoading: true
                }
            });
            const {RetCode, RetVal, DataRows} = yield call(servers.getQuarterCompletion, {
                indexId: payload.indexId,
                quarter: payload.quarter
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        indexTypeData: DataRows,
                        activeKey: DataRows[0].id
                    }
                });
                yield put({
                    type: 'getQuarterIndexDetail',
                    payload: {
                        indexId: payload.indexId,
                        quarter: payload.quarter
                    }
                });
            } else {
                message.error(RetVal);
            }
            yield put({
                type: 'save',
                payload: {
                    indexTypeDataLoading: false
                }
            });
        },
        // 获取季度填报指标详情
        * getQuarterIndexDetail({payload}, {call, put, select}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.getMonthIndexTypeDetail, {
                indexId: payload.indexId,
                quarter: payload.quarter
            });
            if (RetCode === 1) {
                yield put({
                    type: 'insertIndexType',
                    payload: {
                        DataRows
                    }
                });
            } else {
                message.error(RetVal);
            }
        },
        // 指标填报
        * monthFillInItem({payload}, {call, put}) {
            let params = {};
            if (payload.key === 'month') {
                params = {
                    month: payload.month,
                    itemMonthId: payload.itemMonthId,
                }
            } else if (payload.key === 'quarter') {
                params = {
                    quarter: payload.quarter
                }
            }
            const {RetCode, RetVal} = yield call(servers.monthFillInItem, {
                itemId: payload.itemId,
                completion: payload.completion,
                ...params
            });
            if (RetCode === 1) {
                yield put({
                    type: 'indexItemSave',
                    payload: {
                        indexTypeIndex: payload.indexTypeIndex,
                        indexItemIndex: payload.indexItemIndex,
                        key: 'fillComplete',
                        value: 1
                    }
                });
                message.success(RetVal);
            } else {
                yield put({
                    type: 'indexItemSave',
                    payload: {
                        indexTypeIndex: payload.indexTypeIndex,
                        indexItemIndex: payload.indexItemIndex,
                        key: 'fillComplete',
                        value: 0
                    }
                });
                message.error(RetVal);
            }
            yield put({
                type: 'indexTypeCompleteSave',
                payload: {
                    indexTypeIndex: payload.indexTypeIndex,
                    checkKey: 'completion',
                    key: 'fillComplete'
                }
            });
        },
        // 指标提交
        * submitMonthIndex({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.submitMonthIndex, {
                indexId: payload.indexId,
                [payload.key]: payload[payload.key]
            });
            if (RetCode === 1) {
                message.success(RetVal);
                yield put(routerRedux.push({
                    pathname: '/financeApp/examine/trackReport'
                }))
            } else {
                message.error(RetVal);
            }
        },
        // 指标退后后再次提交
        * reSubmitMonthFlow({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers. reSubmitMonthFlow, {
                flowId: payload.flowId,
                flowLinkId: payload.flowLinkId,
                taskUUID: payload.taskUUID,
                taskBatchid: payload.taskBatchid,
                [payload.key]: payload[payload.key]
            });
            if (RetCode === 1) {
                message.success(RetVal);
                yield put(routerRedux.push({
                    pathname: '/commonApp'
                }))
            } else {
                message.error(RetVal);
            }
        },
        // 获取月度评价指标表格数据
        * getToDoMonthIndex({payload}, {call, put, select}) {
            yield put({
                type: 'save',
                payload: {
                    monthtIndexData: {},
                    monthCurrentPage: 1,
                    monthtIndexDataLoading: true
                }
            });
            const {monthEvaluateDate, monthEvaluateUnit, monthEvaluateStatus, monthEvaluateName} = yield select(state => state.trackModel);
            let params = {};
            if (monthEvaluateUnit !== 'all') params.unit = monthEvaluateUnit;
            if (monthEvaluateStatus !== 'all') params.status = monthEvaluateStatus;
            if (monthEvaluateName) params.applicantName = monthEvaluateName;
            const {RetCode, RetVal, DataRows, totalCount} = yield call(servers.getToDoMonthIndex, {
                month: monthEvaluateDate.month() + 1,
                year: monthEvaluateDate.year(),
                pageNo: payload.pageNo,
                ...params
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        monthtIndexData: {
                            DataRows,
                            totalCount
                        },
                        monthCurrentPage: payload.pageNo
                    }
                })
            } else {
                message.error(RetVal);
            }
            yield put({
                type: 'save',
                payload: {
                    monthtIndexDataLoading: false
                }
            });
        },
        // 获取季度评价指标表格数据
        * getToDoQuarterIndex({payload}, {call, put, select}) {
            yield put({
                type: 'save',
                payload: {
                    quarterIndexData: {},
                    quarterCurrentPage: 1,
                    quarterIndexDataLoading: true
                }
            });
            const {quarterEvaluateYear, quarterEvaluateQuarter, quarterEvaluateUnit, quarterEvaluateName, quarterEvaluateStatus} = yield select(state => state.trackModel);
            let params = {};
            if (quarterEvaluateUnit !== 'all') params.unit = quarterEvaluateUnit;
            if (quarterEvaluateStatus !== 'all') params.status = quarterEvaluateStatus;
            if (quarterEvaluateName) params.applicantName = quarterEvaluateName;
            const {RetCode, RetVal, DataRows, totalCount} = yield call(servers.getToDoMonthIndex, {
                year: quarterEvaluateYear,
                quarter: quarterEvaluateQuarter,
                pageNo: payload.pageNo,
                ...params
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        quarterIndexData: {
                            DataRows,
                            totalCount
                        },
                        quarterCurrentPage: payload.pageNo
                    }
                })
            } else {
                message.error(RetVal);
            }
            yield put({
                type: 'save',
                payload: {
                    quarterIndexDataLoading: false
                }
            });
        },
        // 获取评价指标tab
        * getToDoReIndexDetail({payload}, {call, put}) {
            let params = {};
            switch (payload.type) {
                case 'month':
                    params = {
                        month: payload.month
                    };
                    break;
                case 'quarter':
                    params = {
                        quarter: payload.quarter
                    }
                    break;
            }
            yield put({
                type: 'save',
                payload: {
                    indexTypeData: [],
                    indexTypeDataLoading: true
                }
            });
            const {RetCode, RetVal, DataRows} = yield call(servers.getToDoReIndexDetail, {
                flowId: payload.flowId,
                flowLinkId: payload.flowLinkId,
                tag: payload.tag,
                ...params
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        indexTypeData: DataRows.indexTypes[0].indexItems,
                        professTypeId: DataRows.indexTypes[0].id,
                        activeKey: DataRows.indexTypes[0].indexItems[0].id,
                        indexMsg: {
                            unit: DataRows.unit,
                            status: DataRows.status,
                            name: DataRows.name
                        }
                    }
                });
                yield put({
                    type: 'getToDoMonthIndexDetail',
                    payload: {
                        typeId: DataRows.indexTypes[0].id,
                        itemId: DataRows.indexTypes[0].indexItems[0].id,
                        type: payload.type,
                        ...params
                    }
                })
            } else {
                message.error(RetVal);
            }
            yield put({
                type: 'save',
                payload: {
                    indexTypeDataLoading: false
                }
            });
        },
        // 指标评价详情
        * getToDoMonthIndexDetail({payload}, {call, put}) {
            let params = {};
            switch (payload.type) {
                case 'month':
                    params = {
                        month: payload.month
                    };
                    break;
                case 'quarter':
                    params = {
                        quarter: payload.quarter
                    }
                    break;
            }
            const {RetCode, RetVal, DataRows} = yield call(servers.getMonthIndexDetail, {
                typeId: payload.typeId,
                itemId: payload.itemId,
                ...params
            });
            if (RetCode === 1) {
                yield put({
                    type: 'indexTypeSave',
                    payload: {
                        itemId: payload.itemId,
                        DataRows
                    }
                })
            } else {
                message.error(RetVal);
            }
        },
        // 指标通过
        * passMonthIndex({payload}, {call, put}) {
            let params = {};
            switch (payload.type) {
                case 'month':
                    params = {
                        month: payload.month
                    };
                    break;
                case 'quarter':
                    params = {
                        quarter: payload.quarter
                    }
                    break;
            }
            const {RetCode, RetVal} = yield call(servers.passMonthIndex, {
                flowId: payload.flowId,
                flowLinkId: payload.flowLinkId,
                taskUUID: payload.taskUUID,
                taskBatchid: payload.taskBatchid,
                tag: payload.tag,
                opinion: payload.opinion,
                ...params
            });
            if (RetCode === 1) {
                message.success(RetVal);
                yield put(routerRedux.push({
                    pathname: '/financeApp/examine/trackEvaluate'
                }));
            } else {
                message.error(RetVal);
            }
        },
        // 指标退回
        * refuseMonthIndex({payload}, {call, put}) {
            let params = {};
            switch (payload.type) {
                case 'month':
                    params = {
                        month: payload.month
                    };
                    break;
                case 'quarter':
                    params = {
                        quarter: payload.quarter
                    }
                    break;
            }
            const {RetCode, RetVal} = yield call(servers.refuseMonthIndex, {
                flowId: payload.flowId,
                flowLinkId: payload.flowLinkId,
                taskUUID: payload.taskUUID,
                taskBatchid: payload.taskBatchid,
                tag: payload.tag,
                opinion: payload.opinion,
                ...params
            });
            if (RetCode === 1) {
                message.success(RetVal);
                yield put(routerRedux.push({
                    pathname: '/financeApp/examine/trackEvaluate'
                }));
            } else {
                message.error(RetVal);
            }
        },
        // 审核人权限获取
        * getUserRights({payload}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.getUserRights);
            if (RetCode === 1) {
                let hasMonth = false;
                let hasQuater = false;
                for (let v of DataRows) {
                    switch (v.key) {
                        case '1':
                            hasMonth = true;
                            yield put({
                                type: 'getToDoMonthIndex',
                                payload: {
                                    pageNo: 1
                                }
                            });
                            break;
                        case '2':
                            hasQuater = true;
                            yield put({
                                type: 'getToDoQuarterIndex',
                                payload: {
                                    pageNo: 1
                                }
                            });
                            break;
                    }
                }
                if (hasQuater && !hasMonth) {
                    yield put({
                        type: 'save',
                        payload: {
                            evaluateActiveKey: '2'
                        }
                    });
                } else {
                    yield put({
                        type: 'save',
                        payload: {
                            evaluateActiveKey: '1'
                        }
                    });
                }
                yield put({
                    type: 'save',
                    payload: {
                        evaluateUserKeys: DataRows
                    }
                })
            } else {
                message.error(RetVal);
            }
        }
    },

    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                switch (pathname) {
                    case '/financeApp/examine/trackReport':
                        dispatch({
                            type: 'getMonthIndex',
                            payload: {
                                year: new Date().getFullYear() + '',
                                pageNo: 1
                            }
                        });
                        dispatch({
                            type: 'getQuarterIndex',
                            payload: {
                                year: new Date().getFullYear() + '',
                                pageNo: 1
                            }
                        });
                        break;
                    case '/financeApp/examine/trackReport/monthReportDetail':
                        dispatch({
                            type: 'getMonthIndexTypes',
                            payload: {
                                indexId: query.indexId,
                                month: query.month
                            }
                        });
                        break;
                    case '/financeApp/examine/trackReport/quarterReportDetail':
                        dispatch({
                            type: 'getQuarterIndexTypes',
                            payload: {
                                indexId: query.indexId,
                                quarter: query.quarter
                            }
                        });
                        break;
                    case '/financeApp/examine/trackEvaluate':
                        dispatch({
                            type: 'getUserRights'
                        });
                        break;
                    case '/reMonthReportDetail':
                    case '/financeApp/examine/trackEvaluate/monthEvaluateDetail':
                        dispatch({
                            type: 'getToDoReIndexDetail',
                            payload: {
                                flowId: query.flowId,
                                flowLinkId: query.flowLinkId,
                                tag: query.tag,
                                month: query.month,
                                type: 'month'
                            }
                        });
                        break;
                    case '/reQuarterReportDetail':
                    case '/financeApp/examine/trackEvaluate/quarterEvaluateDetail':
                        dispatch({
                            type: 'getToDoReIndexDetail',
                            payload: {
                                flowId: query.flowId,
                                flowLinkId: query.flowLinkId,
                                tag: query.tag,
                                quarter: query.quarter,
                                type: 'quarter'
                            }
                        });
                        break;
                }
            })
        }
    }
}
