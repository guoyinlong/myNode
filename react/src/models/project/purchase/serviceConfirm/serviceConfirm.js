/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：
 */
import * as serviceConfirmServices from '../../../../services/project/serviceConfirm';
import { routerRedux } from 'dva/router';
import { Tooltip, Icon, message } from 'antd';
import EditableCell from '../../../../routes/project/purchase/serviceConfirm/editableCell';
import config from '../../../../utils/config';
import {deepClone} from '../../../../utils/func';
import moment from 'moment';
export default {
    namespace: 'serviceConfirm',
    state: {
        user_id:'',
        form_proj:[],
        search_condition: {
            arg_year_month:'',
            arg_partner_id:'',
            arg_state_desc:'',
            arg_proj_id:'',
            arg_pu_dept_id:'',
        },
        search_result:[],
        service_standarts:[]
    },
    reducers: {
        querySuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
        updateSuccess(state, {payload}) {
            const {index,key,value} = payload;
            const array = deepClone(state.search_result);
            array[index][key]=value;
            return {
                ...state,
                search_result:array
            };
        },
    },
    effects: {
        *serviceConfirmSearch ({payload={}}, { call, put, select }) {
            const {search_condition} = yield select(state => state.serviceConfirm);
            const param = { ...search_condition, ...payload };
            const res = yield call(serviceConfirmServices.p_service_confirm_search,param);
            if (res.RetCode === '1') {
                yield put({
                    type : 'querySuccess',
                    payload : {'search_result':res.DataRows,'search_condition':param}
                });
            }else{
                yield put({
                    type : 'querySuccess',
                    payload : {'search_result':[],'search_condition':param}
                });
                message.error(res.RetVal);
            }
        },
        *projQuery ({payload}, { call, put }) {
            const res = yield call(serviceConfirmServices.p_proj_search,{'arg_user_id':payload.arg_user_id});
            if (res.RetCode === '1') {
                yield put({
                    type : 'querySuccess',
                    payload : {
                        'user_id':payload.arg_user_id,
                        'form_proj':res.DataRows,
                    }
                });
                yield put({
                    type : 'serviceConfirmSearch',
                    payload : {
                        arg_userid:payload.arg_user_id,
                        arg_proj_id:res.DataRows[0].proj_id,
                        arg_year_month:payload.arg_year_month
                    }
                });
            }
        },
        *serviceAddBatServlet ({payload}, { call, put, select }) {
            const {user_id,search_condition,search_result} = yield select(state => state.serviceConfirm);
            const temp = search_result.map(function(item, index){
                return {
                    proj_id:item.proj_id,
                    year_month:search_condition.arg_year_month,
                    partner_id:item.partner_id,
                    stability_score:item.stability_score.toString(),
                    attend_score:item.attend_score.toString(),
                    delivery_score:item.delivery_score.toString(),
                    quality_score:item.quality_score.toString(),
                    manage_score:item.manage_score.toString(),
                    create_by:user_id,
                    work_cnt:item.proj_work_cnt,
                    month_work_cnt:item.month_work_cnt,
                    tel:item.tel
                };
            })

            const res = yield call(serviceConfirmServices.ServiceAddBatServlet,{arg_service_firm:JSON.stringify(temp)});
            if (res.RetCode === '1') {
                yield put({
                    type : 'serviceAddBatServletAfter',
                    payload : {
                        arg_userid:user_id,
                        arg_year_month:search_condition.arg_year_month,
                        arg_proj_id:search_condition.arg_proj_id,
                        arg_batchid:''
                    }
                });
            }
        },

        *serviceAddBatServletAfter ({payload}, { call, put, select }) {
            const res = yield call(serviceConfirmServices.p_service_confirm_search_aftercommit,payload);
            if (res.RetCode === '1') {
                yield put({
                    type : 'serviceConfirmSearch',
                    payload : {
                        arg_proj_id:payload.arg_proj_id,
                        arg_year_month:payload.arg_year_month
                    }
                });
                message.success('提交成功');
            }
        },
        *serviceStandarts ({payload}, { call, put }) {
            const res = yield call(serviceConfirmServices.p_service_standarts_search);
            if (res.RetCode === '1') {
                const data = res.DataRows.map((item, index) => {
                    const desc = item.standards_desc.split("；").map((item, index) => {
                        return <p key={index}>{item}</p>
                    });
                    return {
                        title: (
                            <div>
                                <span>{item.standards_name + " "}</span>
                                <Tooltip title={<div>{desc}</div>}><Icon type="question-circle-o"/></Tooltip>
                            </div>
                        ),
                        dataIndex: item.standards_namekey,
                        render: (text, record, index) => {
                            return <EditableCell text={text} record={record} max={parseInt(item.standards_value)} onChange={(value)=>payload(item.standards_namekey,index,value)}/>
                        },
                        width: '10%'
                    }
                });
                yield put({
                    type : 'querySuccess',
                    payload : {
                        'service_standarts':[...data,{
                            title: (
                                <div>
                                    <span>{'合计得分'}</span>
                                </div>
                            ),
                            dataIndex: 'total_score',
                            render: (text, record, index) => {
                                return (
                                    parseInt(record.stability_score || 0)
                                    +parseInt(record.attend_score || 0)
                                    +parseInt(record.delivery_score || 0)
                                    +parseInt(record.quality_score || 0)
                                    +parseInt(record.manage_score || 0)
                                )
                            },
                            width: '10%'
                        }]
                    }
                });
            }
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/purchase/serviceConfirm') {
                    const user_id = localStorage.getItem('staffid');
                    dispatch({
                        type : 'projQuery',
                        payload : {
                            'arg_user_id':user_id,
                            'arg_year_month':moment().subtract(1, "months").format("YYYY-MM")
                        }
                    });
                    dispatch({
                        type : 'serviceStandarts',
                        payload : (key,index,value)=>{
                            dispatch({
                                type : 'updateSuccess',
                                payload : {key,index,value}
                            });
                        }
                    });
                }
            });
        },
    },
};
