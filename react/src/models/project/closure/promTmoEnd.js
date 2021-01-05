/**
 * 作者：邓广晖
 * 创建日期：2019-01-14
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：项目结项model
 */
import * as projTmoEndServices from '../../../services/project/projTmoEndService';
import Cookie from 'js-cookie';
import { message } from 'antd';

export default {
    namespace: 'projTmoEnd',

    state: {
        porjEndTableParam: {
            arg_proj_name: '',
            arg_proj_code: '',
            arg_mgr_name: '',
            arg_page_current: 1,
            rowCount: '',                      //数据总条数
        },
        projEndDataList: [],

    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                ...action.payload
            };
        },

        initData(state) {
            return {
                ...state,
                porjEndTableParam: {
                    arg_proj_name: '',
                    arg_proj_code: '',
                    arg_mgr_name: '',
                    arg_page_current: 1,
                    rowCount: '',                      //数据总条数
                },
                projEndDataList: [],
            };
        },
    },

    effects: {
        /**
         * 作者：邓广晖
         * 创建日期：2019-01-20
         * 功能：查询项目列表
         */
        *projTmoEndQuery( _ , { call, put, select}) {
            let { porjEndTableParam } = yield select(state => state.projTmoEnd);
            let postData = {
                arg_proj_name: porjEndTableParam.arg_proj_name.trim(),
                arg_proj_code: porjEndTableParam.arg_proj_code.trim(),
                arg_mgr_name: porjEndTableParam.arg_mgr_name.trim(),
                arg_page_size: 10,
                arg_page_current: porjEndTableParam.arg_page_current,
                arg_staff_id: Cookie.get('userid'),
                arg_tenantid: Cookie.get('tenantid'),
            };
            const data = yield call(projTmoEndServices.projTmoEndQuery,postData);
            if (data.RetCode === '1') {
                porjEndTableParam.rowCount = data.RowCount;
                yield put({
                    type: 'save',
                    payload: {
                        porjEndTableParam: JSON.parse(JSON.stringify(porjEndTableParam)),
                        projEndDataList: data.DataRows
                    },
                });
                /*if (data.RetVal !== '') {
                    message.success('结项成功!');
                } else {
                    message.success(data.RetVal);
                }*/
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2019-01-25
         * 功能：设置是输入框的值
         * @param value 输入框的值或者选择框的值
         * @param objParam 输入的对象参数
         */
        *setInputOrSelectShow({value, objParam}, {put, select}) {
            let { porjEndTableParam } = yield select(state => state.projTmoEnd);
            porjEndTableParam[objParam] = value;
            yield put({
                type: 'save',
                payload: {
                    porjEndTableParam: JSON.parse(JSON.stringify(porjEndTableParam))
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2019-01-25
         * 功能：切换状态
         * @param page 当前页码
         */
        *handlePageChange({page}, {select, put}) {
            let { porjEndTableParam } = yield select(state => state.projTmoEnd);
            porjEndTableParam.arg_page_current = page;
            yield put({
                type: 'save',
                payload: {
                    porjEndTableParam: JSON.parse(JSON.stringify(porjEndTableParam))
                }
            });
            yield put({
                type: 'projTmoEndQuery'
            });

        },

        /**
         * 作者：邓广晖
         * 创建日期：2019-01-25
         * 功能：点击查询或者清空按钮
         * @param buttonType 按钮类型，query 和 clear
         */
        *clickQueryButton({buttonType}, {put, select}) {
            if (buttonType === 'query') {
                let { porjEndTableParam } = yield select(state => state.projTmoEnd);
                porjEndTableParam.arg_page_current = 1;
                yield put({
                    type: 'save',
                    payload: {
                        porjEndTableParam: JSON.parse(JSON.stringify(porjEndTableParam))
                    }
                });
                yield put({
                    type: 'projTmoEndQuery'
                });
            } else if (buttonType === 'clear') {
                //清空时
                let porjEndTableParam = {
                    arg_proj_name: '',
                    arg_proj_code: '',
                    arg_mgr_name: '',
                    arg_page_current: 1,
                    rowCount: '',                      //数据总条数
                };
                yield put({
                    type: 'save',
                    payload: {
                        porjEndTableParam: JSON.parse(JSON.stringify(porjEndTableParam))
                    }
                });
                yield put({
                    type: 'projTmoEndQuery'
                });
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2019-01-25
         * 功能：项目结项
         * @param record 一行记录
         */
        *endProj({record},{call,put,select}){
            let { porjEndTableParam } = yield select(state => state.projTmoEnd);
            let postData = {
                arg_proj_uid: record.proj_uid,
                arg_staff_id: Cookie.get('userid'),
                arg_tenantid: Cookie.get('tenantid'),
                arg_proj_id: record.proj_id,
            };
            //先验证 项目 和 考核，再结项
            const [ validateProj, validateExam ] = yield [
                call(projTmoEndServices.projTmoEndValidateProj, postData),
                call(projTmoEndServices.projTmoEndValidateExamine, postData),
            ];
            if (validateProj.RetCode === '1' && validateExam.RetCode === '1') {
                //验证成功后
                const data = yield call(projTmoEndServices.projTmoEnd,postData);
                if (data.RetCode === '1') {
                    if (data.RetVal !== '') {
                        message.success('结项成功!');
                    } else {
                        message.success(data.RetVal);
                    }
                    porjEndTableParam.arg_page_current = 1;
                    yield put({
                        type: 'save',
                        payload: {
                            porjEndTableParam: JSON.parse(JSON.stringify(porjEndTableParam)),
                        },
                    });
                    yield put({
                        type: 'projTmoEndQuery',
                    });
                } else if (data.RetCode === '-1') {
                    message.info(data.RetVal);
                }
            } else {
                let messageInfo = '不能结项：';
                if (validateProj.RetVal !== '') {
                    messageInfo += validateProj.RetVal;
                }
                if (validateExam.RetVal !== '') {
                    messageInfo += validateExam.RetVal;
                }
                message.info(messageInfo);
            }
        },
    },

    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname === '/projectApp/projClosure/projTmoEnd') {
                    dispatch({type: 'initData'});
                    dispatch({type: 'projTmoEndQuery', query});
                }
            });
        },
    }
};
