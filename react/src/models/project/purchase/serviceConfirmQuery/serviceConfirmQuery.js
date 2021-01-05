/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：
 */
import * as serviceConfirmServices from '../../../../services/project/serviceConfirm';
import { routerRedux } from 'dva/router';
import { Tooltip, Icon, message } from 'antd';
import config from '../../../../utils/config';
import moment from 'moment';
export default {
    namespace: 'serviceConfirmQuery',
    state: {
        user_id:'',
        role:0,
        form_state:[{'key':'','value':"全部"},{'key':'2','value':"审核中"},{'key':'3','value':"已完成"},{'key':'1','value':"未填报"}],
        form_partner:[],
        form_proj:[],
        form_dept:[],
        search_condition: {
            arg_year_month:'',
            arg_partner_id:'',
            arg_state_desc:'',
            arg_proj_id:'',
            arg_pu_dept_id:'',
        },
        search_result:[],
        search_pagination:{},
        service_standarts:[]
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
        *serviceConfirmSearch ({payload={}}, { call, put, select }) {
            const {search_condition} = yield select(state => state.serviceConfirmQuery);
            payload.arg_pagecurrent = payload.arg_pagecurrent || 1;
            payload.arg_pagesize = payload.arg_pagesize || 10;
            const param = { ...search_condition, ...payload };
            const res = yield call(serviceConfirmServices.p_service_confirm_search,param);
            if (res.RetCode === '1') {
                yield put({
                    type : 'querySuccess',
                    payload : {'search_result':res.DataRows,'search_condition':param,'search_pagination':{'total':parseInt(res.RowCount),'current':param.arg_pagecurrent,'pageSize':param.arg_pagesize}}
                });
            }else{
                yield put({
                    type : 'querySuccess',
                    payload : {'search_result':[],'search_condition':param,'search_pagination':{'total':0,'current':param.arg_pagecurrent,'pageSize':param.arg_pagesize}}
                });
                message.error(res.RetVal);
            }
        },
        //用户身份查询，内部or外协
        *getUserId ({payload,callback}, { call, put }) {
            const res = yield call(serviceConfirmServices.p_if_isout, {'arg_username':payload.arg_user_id});
            if (res.RetCode === '1') {
                yield put({
                    type : 'formDataQuery',
                    payload : {...payload,'arg_user_id':res.DataRows[0].userid}
                });
            }
        },
        *formDataQuery ({payload}, { call, put }) {
            const [roleRes, partnerRes, projRes, deptRes] = yield [
                call(serviceConfirmServices.p_purchase_getroles,{'arg_user_id':payload.arg_user_id}),
                call(serviceConfirmServices.p_partner_search,{'arg_user_id':payload.arg_user_id}),
                call(serviceConfirmServices.p_proj_search,{'arg_user_id':payload.arg_user_id}),
                call(serviceConfirmServices.project_common_get_all_pu_department,{'arg_tenantid':10010}),
            ];
            if (roleRes.RetCode === '1' &&  partnerRes.RetCode === '1' && projRes.RetCode === '1' && deptRes.RetCode === '1') {

                const param = {
                    'user_id':payload.arg_user_id,
                    'role':roleRes.RetNum
                };
                switch (roleRes.RetNum) {
                    case '1':
                        param.form_partner = partnerRes.DataRows;
                        param.form_proj = [{'proj_id':'','proj_name':'全部'},...projRes.DataRows],
                        param.form_dept = [{'pu_dept_id':'','pu_dept_name':'全部'}];
                        break;
                    case '2':
                        param.form_partner = [{'partner_id':'','name':'全部'},...partnerRes.DataRows],
                        param.form_proj = projRes.DataRows,
                        param.form_dept = [{'pu_dept_id':'','pu_dept_name':'全部'}];
                        break;
                    case '3':
                    case '4':
                        param.form_partner = [{'partner_id':'','name':'全部'},...partnerRes.DataRows],
                        param.form_proj = [{'proj_id':'','proj_name':'全部'},...projRes.DataRows],
                        param.form_dept = [{'pu_dept_id':'','pu_dept_name':'全部'}];
                        break;
                    default:
                        param.form_partner = [{'partner_id':'','name':'全部'},...partnerRes.DataRows],
                        param.form_proj = [{'proj_id':'','proj_name':'全部'},...projRes.DataRows],
                        param.form_dept = [{'pu_dept_id':'','pu_dept_name':'全部'},...deptRes.DataRows];
                }

                yield put({
                    type : 'querySuccess',
                    payload : param
                });
                yield put({
                    type : 'serviceConfirmSearch',
                    payload : {
                        arg_userid:payload.arg_user_id,
                        arg_partner_id:param.form_partner[0].partner_id,
                        arg_proj_id:param.form_proj[0].proj_id,
                        arg_pu_dept_id:param.form_dept[0].pu_dept_id,
                        arg_year_month:payload.arg_year_month
                    }

                });
            }
        },
        *formProjQuery ({payload}, { call, put, select }) {
            const res = yield call(serviceConfirmServices.p_proj_search,payload);
            if (res.RetCode === '1') {
                yield put({
                    type : 'querySuccess',
                    payload : {'form_proj':res.DataRows}
                });
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
                        width: '8%'
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
                            width: '8%'
                        }]
                    }
                });
            }
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/purchase/serviceConfirmQuery') {
                    dispatch({
                        type : 'getUserId',
                        payload : {
                            'arg_user_id':localStorage.getItem('username'),
                            'arg_year_month':moment().subtract(1, "months").format("YYYY-MM")
                        }
                    });
                    dispatch({
                        type : 'serviceStandarts'
                    });
                }
            });
        },
    },
};
