/**
 * 文件说明：组织绩效考核指标考核
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-9-16
 */
import * as servers from '../../../services/finance/examine';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
import {indexTypeMap} from '../../../routes/finance/examine/common/mapInformation';

export default {
    namespace: 'indexModel',

    state: {
        indexList: [], // 指标列表数据
        indexDetailList: [],
        hasAdd: false,
        indexEvaluateList: [], // 指标评分列表
        indexEvaluateListLoading: false,
        totalCount: 0, // 分页数据
        indexTotalCount: 0,
        indexEvaluateDetailList: {}, // 指标评价详情数据
        searchList: [], // 搜索列表
        evaluateRecordList: [], // 评分记录
        searchRules: { // 搜索规则
            pageNo: 1,
            pageSize: 10,
            year: new Date().getFullYear()
        },
        modalVisible: { // 模态框状态
            backModalVisible: false,
            passModalVisible: false,
            submitModalVisible: false,
            submitModalConfirmLoading: false,
            backModalConfirmLoading: false,
            passModalConfirmLoading: false
        },
        indexDetailLoading: true, // 评分内容加载loding
        activeKey: [], // 折叠框activeKey
        opinion: {}, // 审核意见
        indexTypesDetailList: [],
        reportIsChange: false,
        indexTypeData: [], // it专业线的tab和互评数据
        itActiveKey: '',
        indexTypeDataLoading: false,
        mutualData: [], // 支撑协同互评部门数据
        mututalActiveKey: '',
        reportInfoVisible: false, // 填报提示框显示
        reportInfoData: [] // 填报框数据
    },

    reducers: {
        save(state, {payload}) {
            return {
                ...state,
                ...payload
            }
        },
        saveJsonParse(state, {payload}) {
            return {
                ...state,
                [payload.listName]: JSON.parse(JSON.stringify(payload.listDate))
            }
        },
        // 更新二维数组
        updateIndexDetail(state, {payload}) {
            const {listName, typeIndex, itemIndex, indexProp} = payload;
            let currentIndexItem = state[listName].indexTypes[typeIndex].indexItems[itemIndex];
            for (let v in indexProp) {
                currentIndexItem[v] = indexProp[v];
            }
            let newIndexDate = JSON.stringify(state[listName]);
            return {
                ...state,
                [listName]: JSON.parse(newIndexDate)
            }
        },
        // 更新二维数组2
        updateIndexTypes(state, {payload}) {
            const {listName, typeIndex, itemIndex, indexProp} = payload;
            let currentIndexItem = state[listName][typeIndex].indexItems[itemIndex];
            state[listName][typeIndex].indexItems[itemIndex] = {
                ...currentIndexItem,
                ...indexProp
            };
            return {
                ...state,
                [listName]: JSON.parse(JSON.stringify(state[listName]))
            };
        },
        // 更新一维数组
        updateTypes(state, {payload}) {
            const {listName, typeIndex, indexProp} = payload;
            let currentIndexItem = state[listName][typeIndex];
            state[listName][typeIndex] = {
                ...currentIndexItem,
                ...indexProp
            };
            return {
                ...state,
                [listName]: JSON.parse(JSON.stringify(state[listName]))
            };
        },
        // 模态框可见性更新
        modalVisibleSave(state, {payload}) {
            return {
                ...state,
                modalVisible: {
                    ...state.modalVisible,
                    ...payload
                }
            };
        },
        // 保存indexItems
        saveIndexItems(state, {payload}) {
            let indexTypesDetailList = state.indexTypesDetailList;
            for (let v of indexTypesDetailList) {
                if (v.id === payload.id) {
                    v[payload.childName] = payload[payload.childName]
                }
            }
            return {
                ...state,
                indexTypesDetailList: JSON.parse(JSON.stringify(indexTypesDetailList))
            };
        },
        // it插入
        insertIndexType(state, {payload}) {
            for (let v of state.indexTypeData) {
                if (v.id === payload.id) {
                    v.indexItemData = payload.DataRows
                }
            }
            return {
                ...state,
                indexTypeData: JSON.parse(JSON.stringify(state.indexTypeData))
            }
        },
        // 更新it的indexItem
        indexItemSave(state, {payload}) {
            state.indexTypeData[payload.indexTypeIndex].indexItemData[payload.indexItemIndex][payload.key] = payload.value;
            return {
                ...state,
                indexTypeData: JSON.parse(JSON.stringify(state.indexTypeData))
            }
        },
        // 更新it的indexType完成状况
        indexTypeCompleteSave(state, {payload}) {
            state.indexTypeData.forEach((v1, i) => {
                let count = 0;
                if (i === payload.indexTypeIndex) {
                    for (let v2 of v1.indexItemData) {
                        if ((v2[payload.checkKey] || v2[payload.checkKey] === 0) && v2[payload.key] !== 0) {
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
        },
        // 更新indexTypeData
        mutualItemSave(state, {payload}) {
            for (let v of state.indexTypeData) {
                if (v.examineIndex === payload.examineIndex) {
                    v.indexItemData = payload.DataRows;
                    break;
                }
            }
            return {
                ...state,
                indexTypeData: JSON.parse(JSON.stringify(state.indexTypeData))
            }
        },
    },

    effects: {
        // 查询指标列表
        * getIndexList({payload}, {call, put}) {
            const {RetCode, DataRows, totalCount, RetVal} = yield call(servers.getIndexs, payload);
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        indexList: DataRows,
                        indexTotalCount: totalCount
                    }
                });
            } else {
                message.error(RetVal);
            }
        },
        // 插入指标列表
        * addIndex({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.addIndex, {
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'hasAddIndex',
                    payload: {
                        year: payload.year
                    }
                })
            } else {
                message.error(RetVal);
            }
        },
        // 导入指标
        * importIndexModel({}, {call, put}) {
            const {RetCode} = yield call(servers.importIndexModel, {
                year: '2020'
            });
            if (RetCode == 1) {
                message.success('指标导入成功');
            } else {
                message.error('指标导入失败')
            }
        },
        // 指标是否插入
        * hasAddIndex({payload}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.hasAddIndex, {year: payload.year});
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        hasAdd: DataRows.hasAdd
                    }
                })
            } else {
                message.error(RetVal);
            }
        },
        // 搜索规则获取
        * getSearchRules({rules}, {put, select}) {
            const currentRules = yield select(state => state.indexModel.searchRules);
            const newRules = {
                ...currentRules,
                ...rules
            }
            let searchRules = {}
            for (let k in newRules) {
                if (newRules[k]) {
                    searchRules[k] = newRules[k]
                }
            }
            yield put({
                type: 'save',
                payload: {
                    searchRules
                }
            })
            yield put({
                type: 'getToDoIndex'
            })
        },
        // 获取指标搜索项
        * getSearchList(action, {call, put}) {
            const [unitsData, indexTypeKeys] = yield [
                call(servers.getUnits),
                call(servers.getIndexTypeKeys)
            ];
            const currentYear = new Date().getFullYear(); // 年份
            if (unitsData.RetCode === 1 && indexTypeKeys.RetCode === 1) {
                const unitOptions = unitsData.DataRows.map((v, i) => ({ // 部门
                    id: i + 1 + '',
                    text: v.value,
                    value: v.key
                }));
                const indexTypeOptions = indexTypeKeys.DataRows.map((v, i) => ({
                    id: i + 1 + '',
                    text: indexTypeMap[v.key],
                    value: v.key
                }));
                let yearList = [];
                for (let i = 2019; i <= currentYear; i++) {
                    yearList.push({
                        id: i + 1,
                        text: i + '',
                        value: i + ''
                    })
                }
                let searchList = [
                    {
                        id: 'year',
                        title: '年份',
                        type: 'select',
                        options: yearList
                    },
                    {
                        id: 'unit',
                        title: '部门（分院）',
                        type: 'select',
                        options: [
                            {
                                id: '0',
                                text: '全部',
                                value: ''
                            },
                            ...unitOptions
                        ]
                    },
                    {
                        id: 'type',
                        title: '指标类型',
                        type: 'select',
                        options: [
                            {
                                id: '0',
                                text: '全部',
                                value: ''
                            },
                            ...indexTypeOptions
                        ]
                    },
                    {
                        id: 'applicantName',
                        title: '姓名',
                        type: 'input'
                    },
                    {
                        id: 'status',
                        title: '状态',
                        type: 'select',
                        options: [
                            {
                                id: '0',
                                text: '全部',
                                value: ''
                            },
                            {
                                id: '1',
                                text: '未提交',
                                value: '0'
                            },
                            {
                                id: '2',
                                text: '待评价',
                                value: '1'
                            },
                            {
                                id: '3',
                                text: '评价完成',
                                value: '2'
                            },
                        ]
                    }
                ]
                yield put({
                    type: 'save',
                    payload: {
                        searchList
                    }
                })
            }
        },
        // 指标填报按钮
        * indexItemReportBtn({payload}, {call, put}) {
            const {itemId, completion} = payload;
            const {RetCode, RetVal} = yield call(servers.fillInItem, {itemId, completion});
            if (RetCode === 1) {
                message.success('保存成功');
            } else {
                message.error(RetVal);
            }
        },
        // 指标项填报
        * indexItemReport({payload}, {call, put, select}) {
            const {itemId, completion, typeIndex, itemIndex, listName, updateMethod} = payload;
            if (/^\s*$/.test(completion)) {
                yield put({
                    type: updateMethod,
                    payload: {
                        indexProp: {
                            reportWarning: 0
                        },
                        typeIndex,
                        itemIndex,
                        listName
                    }
                });
                message.error('填报不能为空');
                return;
            }
            const {RetCode, RetVal} = yield call(servers.fillInItem, {itemId, completion});
            if (RetCode === 1) {
                yield put({
                    type: updateMethod,
                    payload: {
                        indexProp: {
                            reportWarning: 1
                        },
                        typeIndex,
                        itemIndex,
                        listName
                    }
                });
                if (updateMethod === 'updateIndexTypes') {
                    const indexTypesDetailList = yield select(state => state.indexModel.indexTypesDetailList);
                    let completedCount = 0;
                    let allCompleted = false;
                    indexTypesDetailList[typeIndex].indexItems.forEach(v => {
                        if (v.completion) {
                            completedCount++;
                        }
                    });
                    const allCount = indexTypesDetailList[typeIndex].indexItems.length;
                    if (completedCount === allCount) {
                        allCompleted = true
                    }
                    yield put({
                        type: 'updateTypes',
                        payload: {
                            listName: 'indexTypesDetailList',
                            typeIndex,
                            indexProp: {
                                completedCount,
                                allCompleted
                            }
                        }
                    });

                }
                message.success('保存成功');
            } else {
                yield put({
                    type: updateMethod,
                    payload: {
                        indexProp: {
                            reportWarning: 0
                        },
                        typeIndex,
                        itemIndex,
                        listName
                    }
                });
                message.error(RetVal);
            }
        },
        // 指标提交
        * submitIndex({payload}, {call, put}) {
            if (payload.tag === '2') {
                // 指标再次提交
                let {RetCode, RetVal} = yield call(servers.reSubmitIndex, {...payload.params});
                if (RetCode === 1) {
                    yield put(routerRedux.push({
                        pathname: '/taskList'
                    }))
                    message.success(RetVal);
                } else {
                    message.error(RetVal);
                }
            } else {
                // 指标首次提交
                let {RetCode, RetVal} = yield call(servers.submitIndex, {indexId: payload.indexId, year: payload.year});
                if (RetCode === 1) {
                    yield put(routerRedux.push({
                        pathname: '/financeApp/examine/report'
                    }))
                    message.success(RetVal);
                } else {
                    message.error(RetVal);
                }
            }
            yield put({
                type: 'modalVisibleSave',
                payload: {
                    submitModalVisible: false,
                    submitModalConfirmLoading: false
                }
            })
        },
        // 指标评价列表
        * getToDoIndex(action, {call, put, select}) {
            yield put({
                type: 'save',
                payload: {
                    indexEvaluateListLoading: true
                }
            });
            const rules = yield select(state => state.indexModel.searchRules);
            const {RetCode, DataRows, totalCount, RetVal} = yield call(servers.getToDoIndex, rules);
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        indexEvaluateList: DataRows,
                        totalCount
                    }
                });
            } else {
                message.error(RetVal);
            }
            yield put({
                type: 'save',
                payload: {
                    indexEvaluateListLoading: false
                }
            });
        },
        // 指标评价详情
        * getToDoIndexDetailList({payload}, {call, put}) {
            yield put({
                type: 'save',
                payload: {
                    indexDetailLoading: true
                }
            });
            const {RetCode, DataRows, RetVal} = yield call(servers.getToDoIndexDetail, payload);
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        indexEvaluateDetailList: DataRows
                    }
                })
                yield put({
                    type: 'save',
                    payload: {
                        indexDetailLoading: false
                    }
                });
            } else {
                message.error(RetVal)
            }
        },
        // 指标评分
        * indexItemEvaluate({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.markItem, {
                itemId: payload.itemId,
                score: payload.score
            });
            if (RetCode === 1) {
                yield put({
                    type: 'updateIndexDetail',
                    payload: {
                        indexProp: {
                            checkWarning: 1
                        },
                        typeIndex: payload.typeIndex,
                        itemIndex: payload.itemIndex,
                        listName: payload.listName
                    }
                })
                message.success('评分保存成功');
            } else {
                yield put({
                    type: 'updateIndexDetail',
                    payload: {
                        indexProp: {
                            checkWarning: 0
                        }, 
                        typeIndex: payload.typeIndex,
                        itemIndex: payload.itemIndex,
                        listName: payload.listName
                    }
                })
                message.error(RetVal);
            }
        },
        // 指标通过
        * passIndex({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.passIndex, payload);
            if (RetCode === 1) {
                yield put(routerRedux.push({
                    pathname: '/financeApp/examine/evaluate'
                }))
                message.success(RetVal);
            } else {
                message.error(RetVal);
            }
            yield put({
                type: 'modalVisibleSave',
                payload: {
                    passModalVisible: false,
                    passModalConfirmLoading: false
                }
            })
        },
        // 指标退回
        * refuseIndex({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.refuseIndex, payload);
            if (RetCode === 1) {
                message.success(RetVal)
                yield put(routerRedux.push({
                    pathname: '/financeApp/examine/evaluate'
                }))
            } else {
                message.error(RetVal)
            }
            yield put({
                type: 'modalVisibleSave',
                payload: {
                    backModalVisible: false,
                    backModalConfirmLoading: false
                }
            })
        },
        // 获取评分记录
        * getEvaluateRecordList({query}, {call, put}) {
            const {RetCode, DataRows} = yield call(servers.getReviewRecord, {flowId: query.flowId});
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        evaluateRecordList: DataRows
                    }
                })
            }
        },
        // 获取审核意见
        * getOpinion({query}, {call, put}) {
            const {RetCode, DataRows} = yield call(servers.getOpinion, query);
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        opinion: DataRows
                    }
                })
            }
        },
        // 获取指标类型信息
        * getIndexTypes({payload}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.getIndexTypes, {
                indexId: payload.indexId
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        indexTypesDetailList: DataRows
                    }
                });
                yield put({
                    type: 'getIndexTypeDetail',
                    payload: {
                        typeId: DataRows.length > 0 ? DataRows[0].id : '',
                        year: new Date().getFullYear()
                    }
                })
            } else {
                message.error(RetVal);
            }
        },
        // 获取填报详情
        * getIndexTypeDetail({payload}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.getIndexTypeDetail, {
                typeId: payload.typeId,
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'saveIndexItems',
                    payload: {
                        id: payload.typeId,
                        indexItems: DataRows,
                        childName: 'indexItems'
                    }
                });
            } else {
                message.error(RetVal);
            }
        },
        // it评价年度tab
        * getYearCount({payload}, {call, put}) {
            yield put({
                type: 'save',
                indexTypeDataLoading: true
            })
            const {RetCode, RetVal, DataRows} = yield call(servers.getYearCount, {
                indexId: payload.indexId,
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        indexTypeData: DataRows,
                        itActiveKey: DataRows[0].id
                    }
                });
                yield put({
                    type: 'getYearDetail',
                    payload: {
                        indexId: payload.indexId,
                        year: payload.year,
                        id: DataRows.length > 0 ? DataRows[0].id : '',
                        type: DataRows[0].type
                    }
                });
            } else {
                message.error(RetVal);
            }
            yield put({
                type: 'save',
                indexTypeDataLoading: false
            })
        },
        // it评价年度评价详情
        * getYearDetail({payload}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.getYearDetail, {
                indexId: payload.indexId,
                year: payload.year,
                type: payload.type
            });
            if (RetCode === 1) {
                yield put({
                    type: 'insertIndexType',
                    payload: {
                        id: payload.id,
                        DataRows
                    }
                });
            } else {
                message.error(RetVal);
            }
        },
        // it年度分数保存
        * markITItem({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.markITItem, {
                itemId: payload.itemId,
                month: payload.month,
                score: payload.score
            });
            if (RetCode === 1) {
                yield put({
                    type: 'indexItemSave',
                    payload: {
                        indexTypeIndex: payload.indexTypeIndex,
                        indexItemIndex: payload.indexItemIndex,
                        key: 'evaluateComplete',
                        value: 1
                    }
                });
                message.success('评分保存成功');
            } else {
                yield put({
                    type: 'indexItemSave',
                    payload: {
                        indexTypeIndex: payload.indexTypeIndex,
                        indexItemIndex: payload.indexItemIndex,
                        key: 'evaluateComplete',
                        value: 0
                    }
                });
                message.error(RetVal);
            }
            yield put({
                type: 'indexTypeCompleteSave',
                payload: {
                    indexTypeIndex: payload.indexTypeIndex,
                    checkKey: 'score',
                    key: 'evaluateComplete'
                }
            });
        },
        // it分数合计
        * getItScore({payload}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.submitITItem, {
                indexId: payload.indexId,
                itemId: payload.itemId
            });
            if (RetCode === 1) {
                yield put({
                    type: 'updateIndexDetail',
                    payload: {
                        listName: 'indexEvaluateDetailList',
                        typeIndex: payload.typeIndex,
                        itemIndex: payload.itemIndex,
                        indexProp: {
                            score: DataRows.score
                        }
                    }
                })
            } else {
                message.error(RetVal);
            }
        },
        // it填报年度tab
        * getCount({payload}, {call, put}) {
            yield put({
                type: 'save',
                payload: {
                    indexTypeDataLoading: true
                }
            });
            const {RetCode, RetVal, DataRows} = yield call(servers.getCount, {
                itemId: payload.itemId
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        indexTypeData: DataRows,
                        itActiveKey: DataRows[0].id
                    }
                });
                yield put({
                    type: 'getItIndexDetail',
                    payload: {
                        itemId: DataRows[0].typeId,
                        type: DataRows[0].type,
                        id: DataRows[0].id
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
        // it年度填报详情
        * getItIndexDetail({payload}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.getItIndexDetail, {
                itemId: payload.itemId,
                type: payload.type
            });
            if (RetCode === 1) {
                yield put({
                    type: 'insertIndexType',
                    payload: {
                        id: payload.id,
                        DataRows
                    }
                });
            } else {
                message.error(RetVal);
            }
        },
        // it年度填报保存
        * fillInYearItem({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.fillInYearItem, {
                itemId: payload.itemId,
                completion: payload.completion
            });
            if (RetCode === 1) {
                message.success('保存成功');
                yield put({
                    type: 'indexItemSave',
                    payload: {
                        indexTypeIndex: payload.indexTypeIndex,
                        indexItemIndex: payload.indexItemIndex,
                        key: 'fillComplete',
                        value: 1
                    }
                });
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
        // it保存
        * saveITItem({payload}, {call, put, select}) {
            const {RetCode, RetVal} = yield call(servers.saveITItem, {
                indexId: payload.indexId,
                itemId: payload.itemId
            });
            if (RetCode === 1) {
                message.success('保存成功');
                const {typeIndex, itemIndex, tag} = payload;
                yield put({
                    type: 'updateIndexTypes',
                    payload: {
                        indexProp: {
                            completion: '已填报'
                        },
                        typeIndex,
                        itemIndex,
                        listName: 'indexTypesDetailList'
                    }
                });
                if (tag) {
                    // 暂时不做任何操作
                } else {
                    const indexTypesDetailList = yield select(state => state.indexModel.indexTypesDetailList);
                    let completedCount = 0;
                    let allCompleted = false;
                    indexTypesDetailList[typeIndex].indexItems.forEach(v => {
                        if (v.completion) {
                            completedCount++;
                        }
                    });
                    const allCount = indexTypesDetailList[typeIndex].indexItems.length;
                    if (completedCount === allCount) {
                        allCompleted = true
                    }
                    yield put({
                        type: 'updateTypes',
                        payload: {
                            listName: 'indexTypesDetailList',
                            typeIndex,
                            indexProp: {
                                completedCount,
                                allCompleted
                            }
                        }
                    });
                }
            } else {
                message.error(RetVal);
            }
        },
        // 协同互评指标查询
        * getMutual({payload}, {call, put}) {
            const {RetCode, DataRows} = yield call(servers.getMutual, {
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        mutualData: DataRows
                    }
                });
            }
        },
        // 协同互评tab
        * getMutualItemIndexs({payload}, {call, put}) {
            yield put({
                type: 'save',
                payload: {
                    indexTypeDataLoading: true
                }
            });
            const {DataRows, RetCode, RetVal} = yield call(servers.getMutualItemIndexs, {
                mutualId: payload.mutualId,
                examineObject: payload.examineObject,
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        indexTypeData: DataRows,
                        mututalActiveKey: DataRows[0].examineIndex
                    }
                });
                yield put({
                    type: 'getMutualDetail',
                    payload: {
                        mutualId: payload.mutualId,
                        examineObject: payload.examineObject,
                        examineIndex: DataRows[0].examineIndex,
                        year: payload.year
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
        // 协同互评详情
        * getMutualDetail({payload}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.getMutualDetail, {
                mutualId: payload.mutualId,
                examineObject: payload.examineObject,
                examineIndex: payload.examineIndex,
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'mutualItemSave',
                    payload: {
                        DataRows,
                        examineIndex: payload.examineIndex
                    }
                })
            } else {
                message.error(RetVal);
            }
        },
        // 互评打分
        * supportMarkItem({payload}, {call, put}) {
            const {RetCode, RetVal} = yield call(servers.supportMarkItem, {
                itemId: payload.itemId,
                score: payload.score,
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'indexItemSave',
                    payload: {
                        indexTypeIndex: payload.indexTypeIndex,
                        indexItemIndex: payload.indexItemIndex,
                        key: 'evaluateComplete',
                        value: 1
                    }
                });
                message.success('评分保存成功');
            } else {
                yield put({
                    type: 'indexItemSave',
                    payload: {
                        indexTypeIndex: payload.indexTypeIndex,
                        indexItemIndex: payload.indexItemIndex,
                        key: 'evaluateComplete',
                        value: 0
                    }
                });
                message.error(RetVal);
            }
            yield put({
                type: 'indexTypeCompleteSave',
                payload: {
                    indexTypeIndex: payload.indexTypeIndex,
                    checkKey: 'score',
                    key: 'evaluateComplete'
                }
            });
        },
        // 互评提交
        * supportSubmitIndex({payload}, {call, put, select}) {
            const {RetCode, RetVal} = yield call(servers.supportSubmitIndex, {
                mutualId: payload.mutualId,
                examineObject: payload.examineObject,
                year: payload.year
            });
            if (RetCode === 1) {
                message.success(RetVal);
                yield put({
                    type: 'updateTypes',
                    payload: {
                        listName: 'mutualData',
                        typeIndex: payload.mutualIndex,
                        indexProp: {
                            status: '2'
                        }
                    }
                })
                const {mutualData} = yield select(state => state.indexModel);
                const mutualFinish = mutualData.every(v => v.status === '2');
                if (mutualFinish) {
                    yield put({
                        type: 'indexItemReport',
                        payload: {
                            itemId: payload.itemId, 
                            completion: '此项无需填报',
                            typeIndex: payload.typeIndex,
                            itemIndex: payload.itemIndex,
                            listName: 'indexTypesDetailList',
                            updateMethod: 'updateIndexTypes'
                        }
                    });
                    yield put({
                        type: 'updateIndexTypes',
                        payload: {
                            typeIndex: payload.typeIndex,
                            itemIndex: payload.itemIndex,
                            indexProp: {
                                completion: '此项无需填报'
                            },
                            listName: 'indexTypesDetailList'
                        }
                    })
                }
            } else {
                message.error(RetVal);
            }
        },
        // 填报提示
        * getPendingIndex({payload}, {call, put}) {
            const {RetCode, RetVal, DataRows} = yield call(servers.getPendingIndex, {
                indexId: payload.indexId,
                year: payload.year
            });
            if (RetCode === 1) {
                yield put({
                    type: 'save',
                    payload: {
                        reportInfoVisible: true,
                        reportInfoData: DataRows
                    }
                })
            } else if (RetCode !== 6) {
                message.error(RetVal);
            }
        }
    },

    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                switch (pathname) {
                    case '/financeApp/examine/query':
                    case '/financeApp/examine/report':
                        dispatch({
                            type: 'getIndexList',
                            payload: {
                                year: new Date().getFullYear()
                            }
                        });
                        break;
                    case '/financeApp/examine/query/queryDetail':
                    case '/financeApp/examine/report/reportDetail':
                        dispatch({
                            type: 'getIndexTypes',
                            payload: {
                                indexId: query.indexId
                            }
                        });
                        dispatch({
                            type: 'getMutual',
                            payload: {
                                year: query.year
                            }
                        });
                        dispatch({
                            type: 'getPendingIndex',
                            payload: {
                                year: query.year,
                                indexId: query.indexId
                            }
                        })
                        break;
                    case '/reReportDetail':
                        dispatch({
                            type: 'getToDoIndexDetailList',
                            payload: {
                                flowId: query.flowId,
                                tag: query.tag - 0,
                                flowLinkId: query.flowLinkId,
                                year: query.year
                            }
                        })
                        dispatch({
                            type: 'getOpinion',
                            query: {
                                flowId: query.flowId,
                                flowLinkId: query.flowLinkId,
                                tag: query.tag
                            }
                        })
                        break;
                    case '/financeApp/examine/evaluate':
                        dispatch({
                            type: 'getToDoIndex'
                        });
                        dispatch({
                            type: 'getSearchList'
                        });
                        break;
                    case '/todoEvaluateDetail':
                    case '/financeApp/examine/evaluate/evaluateDetail':
                        dispatch({
                            type: 'getToDoIndexDetailList',
                            payload: {
                                flowId: query.flowId,
                                tag: query.tag - 0,
                                flowLinkId: query.flowLinkId,
                                year: query.year
                            }
                        });
                        dispatch({
                            type: 'getEvaluateRecordList',
                            query
                        });
                        dispatch({
                            type: 'getOpinion',
                            query: {
                                flowId: query.flowId,
                                flowLinkId: query.flowLinkId,
                                tag: query.tag
                            }
                        })
                        break;
                    case '/financeApp/examine/setting':
                        dispatch({
                            type: 'hasAddIndex',
                            payload: {
                                year: new Date().getFullYear()
                            }
                        })
                        break;
                }
            })
        }
    }
}