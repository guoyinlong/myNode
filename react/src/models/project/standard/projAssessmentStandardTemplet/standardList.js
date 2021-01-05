/**
 * 作者：任华维
 * 日期：2017-07-31
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：项目考核指标
 */
import * as projAssessmentStandardServices from '../../../../services/project/projAssessmentStandard';
import { routerRedux } from 'dva/router';
import config from '../../../../utils/config';
import moment from 'moment';
export default {
    namespace: 'standardList',
    state: {
        userId: localStorage.getItem("userid"),
        templetList : [],
        role:""
    },
    reducers: {
        templetStateQuerySuccess(state, {payload}) {
            return {
                ...state,
                templetList : payload
            };
        },
    },
    effects: {

        *templetStateQuery ({payload}, { call, put, select }) {
            const currentYear = moment().year();
            const lastYear = currentYear-1;

            const res = yield call(projAssessmentStandardServices.templetStateQuery,payload)
            if (res.RetCode === '1') {
                const data = res.DataRows;
                const cy = [{season:1,state:-1},{season:2,state:-1},{season:3,state:-1},{season:4,state:-1}];
                const ly = [{season:1,state:-1},{season:2,state:-1},{season:3,state:-1},{season:4,state:-1}];
                for (let i = 0; i < data.length; i++) {
                    if (currentYear == data[i].f_year) {
                        for (let j = 0; j < 4; j++) {
                            if (data[i].f_season == cy[j].season) {
                                cy[j].state = data[i].kpi_state
                            }
                        }
                    }
                    if (lastYear == data[i].f_year) {
                        for (let j = 0; j < 4; j++) {
                            if (data[i].f_season == ly[j].season) {
                                ly[j].state = data[i].kpi_state
                            }
                        }
                    }
                }
                yield put({
                    type : 'templetStateQuerySuccess',
                    payload : [{'year':currentYear,'season':cy},{'year':lastYear,'season':ly}]
                });
            }
        },
        // 跳转页
        *standardInfo ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/projectApp/projexam/tmp_setting/projAssessmentStandardTempletInfo',query:payload}));
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/projexam/tmp_setting') {
                    dispatch({type : 'templetStateQuery'});
                }
            });
        },
    },
};
