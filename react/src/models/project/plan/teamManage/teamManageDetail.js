/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：团队管理
 */
import * as teamManageServices from '../../../../services/project/teamManage';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import config from '../../../../utils/config';
export default {
    namespace: 'teamManageDetail',
    state: {
        //dataSource:[],
        dataUp: [],   //t_proj_team_check表中的员工信息
        dataDown: [], //团队员工信息
        projectInfo:{},
        selected:[],
        checked:[],
        userList:[],
        roleList:[],
        historyList:[],
        childHistoryList:{},
        staffId:localStorage.getItem('staffid'),
        visible:false,
        activeKey:'0',
        inCheck:'0',
        opt:null
    },
    reducers: {
        querySuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
        showModal(state) {
            return {
                ...state,
                visible:true
            };
        },
        hideModal(state) {
            return {
                ...state,
                visible:false,
                checked:[]
            };
        },
        selectedRows(state, {payload}) {
            return {
                ...state,
                selected:payload
            };
        },
        checkedNodes(state, {payload}) {
            return {
                ...state,
                checked:payload
            };
        },
    },
    effects: {
        /**
         * 判断是否在审核中,1是审核中,0是已完成
         *
         * @param {string} projId 项目ID.
         * @return void.
         */
        // *teamInCheck ({payload}, { call, put }) {
        //     //获取的是审核中的成员列表
        //     const res = yield call(teamManageServices.teamInCheck,payload);
        //     const list = res.dataRows || [];
        //     if (res.retCode === '1') {
        //         yield put({
        //             type: 'querySuccess',
        //             payload: {
        //               'inCheck': list.length > 0 ? "1" : "0"
        //             }
        //         });
        //     }
        // },
        /**
         * 项目详细信息查询
         *
         * @param {string} projId 项目ID.
         * @return void.
         */
        *projectInfo ({payload}, { call, put }) {
            yield put({
                type: "querySuccess",
                payload: {
                    projectInfo: payload,
                    activeKey: payload.activeKey || "0",
                    opt: payload.opt
                }
            });
            yield put({
                type : 'roleQuery',
                payload : {...payload, createId: payload.marId}
            });

        },
        /**
         * 团队人员列表查询
         *
         * @param {string} projId 项目ID
         * @return void
         */
        *teamQuery ({payload}, { call, put }) {
            //查询团队成员列表
            const res = yield call(teamManageServices.teamMemberQuery,{...payload});
            if (res.retCode === '1') {
                let list = res.dataRows || [];
                //过滤掉tag=2的
                list = list.filter(item => item.tag !== 2);
                yield put({
                  type: 'querySuccess',
                  payload: {dataDown: list}
                });
            }
            const res2 = yield call(teamManageServices.teamMemberInCheckQuery, payload);
            if(res2.retCode === "1") {
                const list = res2.dataRows || [];
                let isInCheck = "0";
                //检查是否已提交
                if(list.filter(item => item.formState === "1").length > 0) {
                  isInCheck = "1";
                }
                yield put({
                  type: 'querySuccess',
                  payload: {
                    dataUp: list,
                    inCheck: isInCheck
                  }
                });
            }
        },
        /**
         * 角色列表查询
         *
         * @param {string} projId 项目ID.
         * @param {string} createId 项目经理id.
         * @return void.
         */
        *roleQuery ({payload}, { call, put }) {
            const res = yield call(teamManageServices.roleQuery, payload);
            if (res.retCode === '1') {
                yield put({
                    type : 'querySuccess',
                    payload : {'roleList': res.dataRows}
                });
            }
        },
        /**
         * 添加角色
         *
         * @param {string} projId 项目ID.
         * @param {string} createId 项目经理id.
         * @param {string} roleId 项目经理id.
         * @param {string} staffId 项目经理id.
         * @return void.
         */
        *roleAddOrDelete ({payload}, { call, put }) {
            const res = yield call(teamManageServices.roleAddOrDelete, payload);
            if (res.retCode === '1') {
                yield put({
                    type : 'teamQuery',
                    payload : {'projId': payload.projId}
                });
            } else {
                message.error("修改失败");
            }
        },
        /**
         * 删除角色
         *
         * @param {string} projId 项目ID.
         * @param {string} createId 项目经理id.
         * @param {string} roleId 项目经理id.
         * @param {string} staffId 项目经理id.
         * @return void.
         */
        // *roleDel ({payload}, { call, put }) {
        //     const res = yield call(teamManageServices.roleDel,payload);
        //     if (res.retCode === '1') {
        //         yield put({
        //             type : 'teamQuery',
        //             payload : {'projId':payload.projId}
        //         });
        //     }
        // },

        /**
         * 详情页提交
         *
         * @param {string} projId 项目ID.
         * @param {string} deptId 主责部门id.
         * @param {string} createBy 创建人id.
         * @param {string} createByName 创建人姓名.
         * @param {string} opt 待办中查询出的t_proj_team_change表中的opt.
         * @return void.
         */
        *projTeamSubmit ({payload}, { call, put, select }) {
            const {inCheck} = yield select(state => state.teamManageDetail);
            const res = yield call(teamManageServices.projTeamSubmit,payload);
            if (res.retCode === '1') {
                if (inCheck === '1') {
                    yield put(routerRedux.push({pathname:'/taskList'}));
                }else {
                    yield put({
                        type : 'teamQuery',
                        payload : {'projId':payload.projId}
                    });
                }
                message.success('提交成功，请等待审核');
            }
        },
        /**
         * 查询部门id组
         *
         * @param {string} deptId 项目ID.
         * @param {string} arg_tenantid 10010.
         * @return void.
         */
        *budgetDeptQuery ({payload}, { call, put }) {
            const res = yield call(teamManageServices.budgetDeptQuery,{...payload,'arg_tenantid':10010});
            if (res.retCode === '1') {
                const list = res.dataRows || [];
                const deptArray = list.map((item, index) => {
                    return item.deptid;
                });
                yield put({
                    type : 'userQuery',
                    payload : {...payload, deptId: deptArray.join(",")}
                });
            }
        },
        /**
         * 添加人员列表查询
         *
         * @param {string} deptId 项目ID.
         * @param {string} arg_tenantid 10010.
         * @param {string} deptId 部门id组.
         * @return void.
         */
        *userQuery ({payload}, { call, put }) {
            const res = yield call(teamManageServices.userQuery,{...payload,'arg_tenantid':10010});
            if (res.retCode === '1') {
                yield put({
                    type : 'querySuccess',
                    payload : {'userList': res.dataRows}
                });
                yield put({
                    type : 'showModal'
                });
            }
        },
        /**
         * 删除新增的未审核的人员
         *
         * @param {string} staffId ID.
         * @param {string} projId 项目ID.
         * @return void.
         */
        *deleteMembers ({payload}, { call, put }) {
            const res = yield call(teamManageServices.deleteMembers,payload);
            if (res.retCode === '1') {
                yield put({
                  type: 'teamQuery',
                  payload: {projId: payload.projId}
                });
            }
        },
      /**
       * 删除新增的未审核的人员
       *
       * @param {string} staffId ID.
       * @param {string} projId 项目ID.
       * @return void.
       */
        *deleteOldMembers ({payload}, { call, put }) {
        const res = yield call(teamManageServices.deleteOldMembers,payload);
        if (res.retCode === '1') {
          yield put({
            type: 'teamQuery',
            payload: {projId: payload.projId}
          });
        }
      },
        /**
         * 新增或删除原始成员
         *
         * @param {string} projId 项目ID.
         * @param {string} opt 新增（insert）或者删除（delete）.
         * @param {string} createBy 操作人ID.
         * @param {array}  newTeams 新增人员信息.
         * @return void.
         */
        *addMembers ({payload}, { call, put }) {
            const res = yield call(teamManageServices.addMembers,payload);
            if (res.retCode === '1') {
                yield put({
                  type: 'teamQuery',
                  payload: {projId:payload.projId}
                });
            }
        },
        /**
         * 修改主责配合
         *
         * @param {string} staffId 员工id.
         * @param {string} projId 项目id.
         * @param {string} type 类型.
         * @param {array} teamId 团队id.
         * @param {array} optId 操作人id.
         * @return void.
         */
        *typeUpdate ({payload}, { call, put }) {
            const res = yield call(teamManageServices.typeUpdate,payload);
            if (res.retCode === '1') {
                yield put({
                  type: 'teamQuery',
                  payload: {projId:payload.projId}
                });
            } else {
                message.error(res.retVal || "更新失败");
            }
        },
        /**
         * 待办审批环节查询
         *
         * @param {string} projId 项目ID.
         * @return void.
         */
        *projSeachList ({payload}, { call, put, select }) {
            const {childHistoryList} = yield select(state => state.teamManageDetail);
            const res = yield call(teamManageServices.projSeachList,{'projId':payload.projId,'teamBatchId':payload.teamBatchId});
            if (res.retCode === '1') {
                const data = res.dataRows.map((item, index) => {
                    return {...item,'index':index}
                });
                childHistoryList[payload.id] = data;
                yield put({
                    type : 'querySuccess',
                    payload : childHistoryList
                });
            }
        },

        /**
         * 待办审批环节查询
         *
         * @param {string} projId 项目ID.
         * @return void.
         */
        *projSeachApprovedList ({payload}, { call, put }) {
            const res = yield call(teamManageServices.projSeachApprovedList,payload);
            if (res.retCode === '1') {
                yield put({
                    type: 'querySuccess',
                    payload: {'historyList': res.dataRows}
                });
            }
        },
        // tab切换
        *tabChange ({payload}, { call, put }) {
            yield put(routerRedux.replace({pathname:'/projectApp/projPrepare/teamManage/teamManageDetail',query:payload}));
        },
        // 跳转页
        *turnToPage ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/projectApp/projPrepare/teamManage/teamManageDetail',query:payload}));
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/projPrepare/teamManage/teamManageDetail') {
                    // dispatch({
                    //     type : 'teamInCheck',
                    //     payload : {'projId' : query.projId}
                    // });
                    dispatch({
                        type : 'projectInfo',
                        payload : query
                    });
                    dispatch({
                        type : 'teamQuery',
                        payload : {'projId' : query.projId}
                    });
                    dispatch({
                        type : 'projSeachApprovedList',
                        payload : {'projId' : query.projId}
                    });
                }
            });
        },
    },
};
