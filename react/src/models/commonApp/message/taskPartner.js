/**
 * 作者：任华维
 * 日期：2017-09-31
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：待办功能
 */
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import { routerRedux } from 'dva/router';
import TaskPartnerCell from '../../../routes/commonApp/message/taskPartnerCell';
import {deepClone} from '../../../utils/func';
import { Tooltip, Icon, message } from 'antd';
export default {
    namespace : 'taskPartner',
    state : {
        taskDetail : [],
        historyDetail : [],
        projDetail : [],
        service_standarts : [],
        query:{},
        role : '',
        visible : false
    },

    reducers : {
        querySuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
        updateSuccess(state, {payload}) {
            const {index,key,value} = payload;
            const array = deepClone(state.taskDetail);
            array[index][key]=value;
            return {
                ...state,
                taskDetail:array
            };
        },
        showModal(state, {payload}) {
            return {
                ...state,
                visible:true
            };
        },
        hideModal(state, {payload}) {
            return {
                ...state,
                visible:false
            };
        }
    },
    effects : {
        *getStandarts ({payload,callback}, { call, put, select }) {
            const [standartsRes, rolesRes] = yield [
                call(commonAppService.p_service_standarts_search),
                call(commonAppService.p_purchase_getroles, {'arg_user_id':payload.arg_userid})
            ]
            if (standartsRes.RetCode === '1' && rolesRes.RetCode === '1') {
                yield put({
                    type : 'querySuccess',
                    payload : {'role':rolesRes.RetNum,'query':payload}
                });
                yield put({
                    type : 'taskDetail',
                    payload : payload
                });
                yield put({
                    type : 'serviceStandarts',
                    payload : {'role':rolesRes.RetNum,'query':payload,'standarts':standartsRes.DataRows,'callback':callback},
                });
            }
        },
        *serviceStandarts ({payload}, { call, put }) {
            let flag = false;
            if (payload.role === '2' && payload.query.flag === '0') {
                flag = true;
            }
            const data = payload.standarts.map((item, index) => {
                const desc = item.standards_desc.split("；").map((item, index) => {
                    return <p key={index}>{item}</p>
                });
                return {
                    title: (
                        <div>
                            <span>{item.standards_name+' '}</span>
                            <Tooltip title={<div>{desc}</div>}><Icon type="question-circle-o" /></Tooltip>
                        </div>
                    ),
                    dataIndex: item.standards_namekey,
                    render: (text, record, index) => {
                        return <TaskPartnerCell rw={flag} text={text} record={record} max={parseInt(item.standards_value)} onChange={(value)=>payload.callback(item.standards_namekey,index,value)}/>
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
        },
        /**
         * 项目详细信息查询
         *
         * @param {string} arg_proj_id 项目ID.
         * @return void.
         */
        *projectInfo ({payload}, { call, put }) {
            const res = yield call(commonAppService.projectInfo,{'arg_proj_id':payload.arg_proj_id});
            if (res.RetCode === '1') {
                yield put({
                    type : 'querySuccess',
                    payload : {'projDetail':res.DataRows[0]}
                });
            }
        },
        //合作伙伴查询登录人角色
        *getUserRoles ({payload}, { call, put }) {
            const res = yield call(commonAppService.p_purchase_getroles, {'arg_user_id':payload.arg_userid});
            if (res.RetCode === '1') {
                yield put({
                    type : 'querySuccess',
                    payload : {'role':res.RetNum,'query':payload}
                });
                yield put({
                    type : 'taskDetail',
                    payload : payload
                });
            }
        },
        //用户身份查询，内部or外协
        *getUserId ({payload,callback}, { call, put }) {
            const res = yield call(commonAppService.p_if_isout, {'arg_username':payload.arg_userid});
            if (res.RetCode === '1') {
                yield put({
                    type : 'getStandarts',
                    payload : {...payload,'arg_userid':res.DataRows[0].userid},
                    callback : callback
                });
            }
        },
        /**
         * 待办详细信息查询
         *
         * @param {string} arg_proj_id 项目ID.
         * @param {string} arg_opt 任务批次ID.
         * @return void.
         */
        *taskDetail ({payload}, { call, put }) {
            const res = yield call(commonAppService.p_service_confirm_search_taskdetails, payload);
            if (res.RetCode === '1') {
                yield put({
                    type : 'querySuccess',
                    payload : {'taskDetail':res.DataRows}
                });
            }
        },

        *serviceAddBatServlet ({payload}, { call, put, select }) {
            const {query,taskDetail} = yield select(state => state.taskPartner);
            const temp = taskDetail.filter((n)=>n.state_flag === '4' || n.state_flag === '6' || n.state_flag === '8' ).map(function(item, index){
                return {
                    proj_id:item.proj_id,
                    year_month:item.year_month,
                    partner_id:item.partner_id,
                    stability_score:item.stability_score.toString(),
                    attend_score:item.attend_score.toString(),
                    delivery_score:item.delivery_score.toString(),
                    quality_score:item.quality_score.toString(),
                    manage_score:item.manage_score.toString(),
                    create_by:query.arg_userid,
                    work_cnt:item.work_cnt,
                    month_work_cnt:item.month_work_cnt,
                    tel:item.tel
                };
            });
            const res = yield call(commonAppService.ServiceAddBatServlet,{arg_service_firm:JSON.stringify(temp)});
            if (res.RetCode === '1') {
                yield put({
                    type : 'serviceAddBatServletAfter',
                    payload : {
                        arg_userid:query.arg_userid,
                        arg_year_month:query.arg_year_month,
                        arg_proj_id:query.arg_proj_id,
                        arg_batchid:query.arg_batchid
                    }
                });
            }
        },
        *serviceAddBatServletAfter ({payload}, { call, put, select }) {
            const res = yield call(commonAppService.p_service_confirm_search_aftercommit,payload);
            if (res.RetCode === '1') {
                yield put(routerRedux.push({pathname:'/taskList'}));
                message.success('提交成功');
            }
        },
        //审核历史
        *taskHistory ({payload}, { call, put }) {
            const res = yield call(commonAppService.p_service_confirm_search_history, payload);
            if (res.RetCode === '1') {
                const historys = res.DataRows.map((item,index) => {
                    return {'index':index,...item}
                });
                yield put({
                    type : 'querySuccess',
                    payload : {'historyDetail':historys}
                });
            }
        },
        *taskPass ({payload}, { call, put }) {
            const res = yield call(commonAppService.p_service_confirm_pass,payload);
            if (res.RetCode === '1') {
                yield put({
                    type : 'partnerSum',
                    payload : payload
                });
            }
        },
        *taskBack ({payload}, { call, put }) {
            const res = yield call(commonAppService.p_service_confirm_back,payload);
            if (res.RetCode === '1') {
                yield put({
                    type : 'partnerSum',
                    payload : payload
                });
            }
        },

        *partnerSum ({payload}, { call, put }) {
            const res = yield call(commonAppService.p_service_confirm_partnersum,{
                arg_year_month:payload.arg_year_month,
                arg_proj_id:payload.arg_proj_id,
                arg_batchid:payload.arg_batchid,
                arg_flag:payload.arg_flag
            });
            if (res.RetCode === '1') {
                yield put({ type : 'hideModal' });
                yield put(routerRedux.push({pathname:'/taskList'}));
                message.success('提交成功');
            }
        },
        // tab切换
        *tabChange ({payload}, { call, put }) {
            yield put(routerRedux.replace({pathname:'/taskPartner',query:payload}));
        },
        *turnToHistoryPage ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/taskTeamManage',query:payload}));
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/taskPartner') {
                    dispatch({
                        type : 'projectInfo',
                        payload : query
                    });
                    dispatch({
                        type : 'getUserId',
                        payload : {arg_userid:localStorage.getItem('username'),activeKey:'0',...query},
                        callback : (key,index,value)=>{
                            dispatch({
                                type : 'updateSuccess',
                                payload : {key,index,value}
                            });
                        }
                    });
                    dispatch({
                        type : 'taskHistory',
                        payload : {arg_year_month:query.arg_year_month,arg_proj_id:query.arg_proj_id,arg_batchid:query.arg_batchid}
                    });
                }
            });
        },
    },
}
