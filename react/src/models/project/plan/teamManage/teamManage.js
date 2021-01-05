/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：团队管理
 */
import * as teamManageServices from '../../../../services/project/teamManage';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import config from '../../../../utils/config';
export default {
    namespace: 'teamManage',
    state: {
        dataSource:[],
        ouSource:[],
        deptSource:[],
        puSource:[],
        typeSource:[],
        staffId:null,
        pagination:{},
        condition:{},
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
        *projQuery ({payload}, { call, put }) {
            const param = {
                'staffId':localStorage.getItem('staffid'),
                //'queryflag':3,
                //'version':'3.0',
                ...payload
            }
            param.page = param.pageCurrent || 1; //页码
            param.count = param.pageSize || 10;  //页内条数
            const res = yield call(teamManageServices.projQuery,param);
            if (res.retCode === '1') {
                const result = res.dataRows || {};
                const dataList = result.pageItems || [];
                // const data = dataList.map((item, index)=> {
                //     if(item.childRows){
                //         item.children = JSON.parse(item.childRows);
                //         item.children.map((value)=>{
                //             value.parentIndex = index;
                //         })
                //     }
                //     return item;
                // })
                yield put({
                    type : 'querySuccess',
                    payload : {
                        'dataSource': dataList,
                        'staffId': param.staffId,
                        'condition': payload,
                        'pagination': {
                            'total': result.totalCount,
                            'current': result.pageNo,
                            'pageSize': result.pageSize //每页条数
                        }
                    }
                });
            }
        },
        *optionQuery ({payload}, { call, put }) {
            const [ouRes, deptRes, puRes, typeRes] = yield [
                call(teamManageServices.ouQuery,{'tenantid':10010}),
                call(teamManageServices.deptQuery,{'argtenantid':10010}),
                call(teamManageServices.projectCommonGetAllPuDepartment,{'tenantid':10010}),
                call(teamManageServices.tProjTypeShowall,{transjsonarray:'{"condition":{"typeState":"0"},"sequence":[{"typeOrder":"0"}]}'}),
            ];
            if (ouRes.retCode === '1' && deptRes.retCode === '1' && puRes.retCode === '1' && typeRes.retCode === '1') {
                yield put({
                    type : 'querySuccess',
                    payload : {'ouSource':ouRes.dataRows,'deptSource':deptRes.dataRows,'puSource':puRes.dataRows,'typeSource':typeRes.dataRows}
                });
            }
        },
        // 跳转页
        *reSearch ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/projectApp/projPrepare/teamManage/projTeamInfo',query:payload}));
        },
        // 跳转页
        *turnToPage ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/projectApp/projPrepare/teamManage/teamManageDetail',query:payload}));
        },
        // 跳转页
        *turnToCaiHaoPage ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/projectApp/projPrepare/teamManage/teamManageSearch',query:payload}));
        },
        *loginNewProject({}, {call,put}) {
            const res = yield call(teamManageServices.loginNewProject, {loginname: Cookie.get("loginname"), loginpass: Cookie.get("loginpass")});
            if(res && res.retCode && res.retCode === "1") {
            } else {
               message.error("认证失败!");
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/projPrepare/teamManage') {
                    // dispatch({
                    //     type: 'loginNewProject'
                    // })
                    dispatch({
                      type : 'projQuery'
                    });
                    dispatch({
                      type : 'optionQuery'
                    });
                }
            });
        },
    },
};
