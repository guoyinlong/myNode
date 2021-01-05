/**
 * 作者：邓广晖
 * 创建日期：2019-07-15
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：工时配置 model
 */
import * as workTimeConfigService from '../../../services/project/workTimeConfigService';
import { getUuid } from '../../../components/commonApp/commonAppConst.js';
import { message } from 'antd';

export default {
    namespace: 'workTimeConfig',
    state: {
        headIndexList: [],          // 头部索引列表，新增、修改也用到
        configList: [],
        modalVisible: false,
        modalUuid: '',
        modalType: '',
        modalData: {},
    },
    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },

    effects: {
        *initDataAndQuery({},{call,put,select}){
            yield put({
                type: 'save',
                payload: {
                    headIndexList: [],          // 头部索引列表，新增、修改也用到
                    configList: [],
                    modalVisible: false,
                    modalUuid: '',
                    modalType: '',
                    modalData: {}
                }
            });
            yield put({
                type:'queryConfigList'
            });
        },

        *queryConfigList({},{call,put,select}){
            const data = yield call(workTimeConfigService.queryConfigList,{arg_null:'any'});
            if (data.RetCode === '1') {
                data.DataRows.forEach((item,index)=>{item.key = index});
                yield put({
                    type: 'save',
                    payload: {
                        headIndexList: data.DataRows1,
                        configList: data.DataRows
                    }
                });
            }

        },

        *setModalVisible({modalType, record},{put,select}){
            let { headIndexList } = yield select(state => state.workTimeConfig);
            if (modalType === 'add') {
                yield put({
                    type: 'save',
                    payload: {
                        modalVisible: true,
                        modalUuid: getUuid(32,64),
                        modalType: modalType,
                        modalData: headIndexList.reduce((previous,current)=>{
                            previous[current.key] = '';
                            return previous
                        },{}),
                    }
                });
            } else if (modalType === 'edit') {
                yield put({
                    type: 'save',
                    payload: {
                        modalVisible: true,
                        modalUuid: getUuid(32,64),
                        modalType: modalType,
                        modalData: record,
                        record,
                    }
                });
            }
        },

        *handleModal({flag,values},{put,call,select}){
            let { modalType } = yield select(state => state.workTimeConfig);
            if (flag === 'confirm') {
                let postData = Object.keys(values).reduce((previous,current)=>{
                    previous['arg_'+current] = values[current];
                    return previous
                },{});
                if (modalType === 'add') {
                    const data = yield call(workTimeConfigService.newWorkTimeConfig,postData);
                    if (data.RetCode === '1') {
                        message.success('新增成功');
                        yield put({
                            type: 'save',
                            payload: { modalVisible: false }
                        });
                        yield put({type: 'queryConfigList'});
                    }
                } else if (modalType === 'edit') {
                    let { record } = yield select(state => state.workTimeConfig);
                    postData.arg_id = record.id;
                    const data = yield call(workTimeConfigService.editWorkTimeConfig,postData);
                    if (data.RetCode === '1') {
                        message.success('修改成功');
                        yield put({
                            type: 'save',
                            payload: { modalVisible: false }
                        });
                        yield put({type: 'queryConfigList'});
                    }
                }
            } else {
                yield put({
                    type: 'save',
                    payload: {
                        modalVisible: false,
                    }
                });
            }
        },

        *deleteWorkTime({record},{call,put}){
            const data = yield call(workTimeConfigService.deleteWorkTimeConfig,{arg_id:record.id});
            if (data.RetCode === '1') {
                message.success('删除成功');
                yield put({type: 'queryConfigList'});
            }
        },
    },

    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname === '/projectApp/timesheetManage/timesheetConfiguration') {
                    dispatch({type: 'initDataAndQuery'});
                }
            });
        },
    },
}