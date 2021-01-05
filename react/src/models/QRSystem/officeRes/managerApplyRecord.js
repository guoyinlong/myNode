/**
 * 作者：彭东洋
 * 创建日期：2019-09-12
 * 邮件：pengdy@itnova.com.cn
 * 文件说明：部门经理工位申请-申请记录查询
 */
import * as Service from './../../../services/QRCode/officeResService.js';
import Cookie from 'js-cookie';
export default {
    namespace: 'mangerApplyRecord',
    state: {
        recordList:[],
        applyBegin:null,
        applyEnd:null,
        endBegin:null,
        endEnd:null
    },
    reducers: {
        initData(state) {           //初始值
            return{
                ...state,
                recordList:[],
                applyBegin:null,
                applyEnd:null,
                endBegin:null,
                endEnd:null
            };
        },
        save(state, action) {
            return {...state,...action.payload};
        },
    },
    effects: {
        //申请记录查询
        * queryApplyHistory({},{select,put,call}) {
            let {applyBegin,applyEnd,endBegin,endEnd} = yield select (state => state.mangerApplyRecord);
            let pstData = {
                arg_apply_time_left: applyBegin,
                arg_apply_time_right: applyEnd,
                arg_end_time_left: endBegin,
                arg_end_time_right: endEnd,
            };
            let data = yield call(Service.queryApplyHistory,pstData);
            if(data.RetCode === "1") {
                if(data.DataRows.length != 0 ) {
                    data.DataRows.map((item,index) => {
                        item.key = index;
                        item.apply_time = item.apply_time.slice(0,10);
                    });
                };
            };
            yield put ({
                type: "save",
                payload: {
                    recordList: data.DataRows,
                }
            });
        },
        //更改页码
        *changePage({page},{put}) {
            yield put({
                type: "save",
                payload: {
                    page: page,
                }
            });
            yield put({
                type:"queryApplyHistory",

            });
        },
        //申请开始时间
        *beginTime({data},{put}) {
            yield put({type:"save",payload:{applyBegin:data[0],applyEnd:data[1]}});
            yield put({type:"queryApplyHistory"});
        },
        //到期时间
        *endTime({data},{put}) {
            yield put ({type:"save",payload:{endBegin:data[0],endEnd:data[1]}});
            yield put({type:"queryApplyHistory"});
        },
        //清空申请时间
        *clearApplyDate({},{put}) {
            yield put({type:"save", payload:{applyBegin:null,applyEnd:null}});
            yield put({type:"queryApplyHistory"});
        },
        //清空结束时间
        *clearExpireDate({},{put}) {
            yield put({type:"save", payload:{endBegin:null,endEnd:null}});
            yield put({type:"queryApplyHistory"});
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if(pathname === '/adminApp/compRes/todoList/managerApplyRecord') {
                    dispatch({ type: 'initData'});
                    dispatch({ type: 'queryApplyHistory', query})
                };
                if(pathname === '/adminApp/compRes/todoList/adminApplicationRecord') {
                    dispatch({ type: 'initData'});
                    dispatch({ type: 'queryApplyHistory', query})
                };
                if(pathname === '/adminApp/compRes/todoList/managerApplyRecord/managerDetail') {
                    dispatch({ type: 'initData'});
                    dispatch({ type: 'queryApplyHistory', query})
                }
                if(pathname === '/adminApp/compRes/officeResMain/apply/applyRecord/Details') {
                  dispatch({ type: 'initData'});
                  dispatch({ type: 'queryApplyHistory', query})
                }
            })
        }
    }
};
