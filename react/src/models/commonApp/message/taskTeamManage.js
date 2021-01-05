/**
 * 作者：任华维
 * 日期：2017-09-31
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：待办功能
 */
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
export default {
    namespace : 'taskTeamManage',
    state : {
        userInfo : {
            'createBy':localStorage.getItem('userid'),
            'updateBy':localStorage.getItem('userid')
        },
        teamData : [],
        projData : [],
        historyList : [],
        activeKey : '0',
        optId : null,
        queryType: null,
        arg_team_batchid: null,
        flag : null,
        visible : false
    },

    reducers : {
        querySuccess(state, {payload}) {
            return {
                ...state,
                ...payload
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
        /**
         * 待办详细信息查询
         *
         * @param {string} arg_proj_id 项目ID.
         * @param {string} arg_opt 任务批次ID.
         * @return void.
         */
        *projTeamDetails ({payload}, { call, put }) {
            const res = yield call(commonAppService.projTeamDetails, {'projId':payload.projId,'optId':payload.optId,'queryType':payload.queryType || '0','teamBatchid':payload.teamBatchid});
            if (res.retCode === '1') {
                yield put({
                    type : 'querySuccess',
                    payload : {'teamData':res.dataRows}
                });
            }
        },
        /**
         * 项目详细信息查询
         *
         * @param {string} arg_proj_id 项目ID.
         * @return void.
         */
        *projectInfo ({payload}, { call, put }) {
            const res = yield call(commonAppService.projectInfo,{'projId':payload.projId});
            if (res.retCode === '1') {
                let projData = [];
                if(res.dataRows && res.dataRows.pageItems) {
                  projData = res.dataRows.pageItems[0];
                }
                yield put({
                    type: 'querySuccess',
                    payload: {
                      'projData': projData,
                      'activeKey':payload.activeKey||'0',
                      'optId':payload.optId,
                      'queryType':payload.queryType || '0',
                      'flag':payload.flag,
                      'teamBatchid':payload.teamBatchid
                    }
                });
            }
        },

        /**
         * 项目详细信息查询
         *
         * @param {string} arg_proj_id 项目ID.
         * @return void.
         */
        *projTeamEdit ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/projectApp/projPrepare/teamManage/teamManageDetail',query:payload}));
        },
        // tab切换
        *tabChange ({payload}, { call, put }) {
            yield put(routerRedux.replace({pathname:'/taskTeamManage',query:payload}));
        },
        /**
         * 待办审批环节查询
         *
         * @param {string} arg_proj_id 项目ID.
         * @return void.
         */
        // *projTeamCheckHistory ({payload}, { call, put }) {
        //     const res = yield call(commonAppService.projTeamCheckHistory, payload);
        //     if (res.RetCode === '1') {
        //
        //     }
        // },
        /**
         * 待办审批环节查询
         *
         * @param {string} arg_proj_id 项目ID.
         * @return void.
         */
        *projSeachList ({payload}, { call, put }) {
            const res = yield call(commonAppService.projSeachList,payload);
            if (res.retCode === '1') {
                const list = res.dataRows || [];
                const data = list.map((item, index) => {
                    return {...item,'index':index}
                });
                yield put({
                    type : 'querySuccess',
                    payload : {'historyList':data}
                });
            }
        },

        /**
         * 待办审批退回
         *
         * @param {string} arg_staff_id 提交人id.
         * @param {string} arg_create_by 审核人id.
         * @param {string} arg_create_by_name 审核人姓名.
         * @param {string} arg_opt proj_team_change表的opt.
         * @param {string} arg_proj_id 项目ID.
         * @param {string} resultTag：1通过/0退回。
         * @param {string} arg_reason 退回原因.
         * @return void.
         */
        *projTeamBack ({payload}, { call, put, select }) {
            const {userInfo} = yield select(state => state.taskTeamManage);
            const {teamData} = yield select(state => state.taskTeamManage);
            const data = teamData.map((item, index) =>item.id);
            const ids =data.length ? data.join(",") : "";
            const res = yield call(commonAppService.projTeamBack,{...payload,...userInfo,"resultTag":"0","ids":ids});
            if (res.retCode === '1') {
                yield put({ type : 'hideModal' });
                yield put(routerRedux.push({pathname:'/taskList'}));
                message.success('审核未通过，已退回提交人');
            }
        },

        /**
         * 待办审批通过
         *
         * @param {string} staff_id 提交人id.
         * @param {string} create_by 审核人id.
         * @param {string} arg_create_by_name 审核人姓名.
         * @param {string} arg_opt proj_team_change表的opt.
         * @param {string} arg_proj_id 项目ID.
         * @param {string} arg_ou：OU.
         * @param {string} resultTag：1通过/0退回。
         * @return void.
         */
        *projTeamPass ({payload}, { call, put, select }) {
            const {teamData} = yield select(state => state.taskTeamManage);
            const data = teamData.map((item, index) =>item.id);
            const ids =data.length ? data.join(",") : "";
            const {userInfo} = yield select(state => state.taskTeamManage);
            const res = yield call(commonAppService.projTeamPass,{...payload,...userInfo,"resultTag":"1","ids":ids});
            if (res.retCode === '1') {
                yield put(routerRedux.push({pathname:'/taskList'}));
                message.success('提交成功');
            }
        },
        /**
         * 审核历史详情
         *
         */
        *turnToHistoryPage ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/taskTeamManage',query:payload}));
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/taskTeamManage') {
                    dispatch({
                        type : 'projectInfo',
                        payload : query
                    });
                    if (query.teamBatchid) {
                        dispatch({
                            type : 'projSeachList',
                            payload : {'projId':query.projId,'teamBatchId':query.teamBatchid}
                        });
                    }
                    dispatch({
                        type : 'projTeamDetails',
                        payload : query
                    });
                }
            });
        },
    },
}
