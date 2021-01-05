/**
 * 作者：任华维
 * 日期：2017-07-31
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：项目考核指标
 */
import * as projAssessmentStandardServices from '../../../../services/project/projAssessmentStandard';
import { routerRedux } from 'dva/router';
import config from '../../../../utils/config';
import {arrayToObjGroups} from '../../../../utils/func';
import moment from 'moment';
export default {
    namespace: 'projAssessmentStandardInfo',
    state: {
        proj_score:[],
        proj_id:'',
        proj_name:'',
        proj_TMO:[],
        userId:localStorage.getItem('userid'),
        userName:localStorage.getItem('fullName'),
        detail:{},
        list:[]
    },
    reducers: {
        projectScoreQueryListSuccess(state, {payload}) {
            let temp = state.proj_score
            return {
                ...state,
                proj_score:temp.concat(payload)
            };
        },
        projectDetailQuerySuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
    },
    effects: {
        *projectScoreQueryList ({payload}, { call, put, select}) {
            const [oneRes,twoRes,threeRes,fourRes] = yield [
                call(projAssessmentStandardServices.projectScoreQuery, {'transjsonarray':'{"condition":{"proj_id":'+payload.id+',"year":'+payload.year+',"season":1}}'}),
                call(projAssessmentStandardServices.projectScoreQuery, {'transjsonarray':'{"condition":{"proj_id":'+payload.id+',"year":'+payload.year+',"season":2}}'}),
                call(projAssessmentStandardServices.projectScoreQuery, {'transjsonarray':'{"condition":{"proj_id":'+payload.id+',"year":'+payload.year+',"season":3}}'}),
                call(projAssessmentStandardServices.projectScoreQuery, {'transjsonarray':'{"condition":{"proj_id":'+payload.id+',"year":'+payload.year+',"season":4}}'}),
            ]
            if (oneRes.RetCode === '1' && twoRes.RetCode === '1' && threeRes.RetCode === '1' && fourRes.RetCode === '1') {
                yield put({
                    type : 'projectScoreQueryListSuccess',
                    payload : [{'year':payload.year,'season':[oneRes.DataRows[0],twoRes.DataRows[0],threeRes.DataRows[0],fourRes.DataRows[0]]}]
                });
            }
        },
        *projectDetailQuery ({payload}, { call, put}) {
            const [detailRes, tmoRes, stateRes] = yield [
                call(projAssessmentStandardServices.projectDetailQuery,{'arg_flag':1,...payload}),
                call(projAssessmentStandardServices.projectTMOQuery, {'arg_vr_name':'项目管理-TMO'}),
                call(projAssessmentStandardServices.listProjKpiState,payload)
            ]
            if (detailRes.RetCode === '1' && tmoRes.RetCode === '1' && stateRes.RetCode === '1') {
                const detail = detailRes.DataRows[0];
                //const tmos = tmoRes.DataRows;
                const states = stateRes.DataRows;
                const beginYear = moment(detail.begin_time).year();
                const endYear = moment(detail.end_time).year();
                const beginSeason = moment(detail.begin_time).quarter();
                const endSeason = moment(detail.end_time).quarter();
                const list = [];
                if (beginYear === endYear) {
                    for (let i = beginSeason; i <= endSeason; i++) {
                        list.push({'year':endYear,'season':i});
                    }
                } else {
      
                      for (let i = 1; i <= endSeason; i++) {
                        list.push({'year':endYear,'season':i});
                    }
                  
                    if(endYear-beginYear>=2){
                    for (let i = 1; i <=endYear-beginYear-1; i++) {
                      for(let j=1;j<=4;j++){
                        list.push({'year':beginYear+i,'season':j});
                      } 
                  }
                }

                    for (let i = beginSeason; i <= 4; i++) {
                      list.push({'year':beginYear,'season':i});
                  }
                }
                for (let i = 0; i < list.length; i++) {
                    for (let j = 0; j < states.length; j++) {
                        if (list[i].year == states[j].year && list[i].season == states[j].season) {
                            list[i] = states[j];
                        }
                    }
                }
                yield put({
                    type : 'projectDetailQuerySuccess',
                    payload : {'detail':detail,'list':arrayToObjGroups(list,'year')}
                });
            }
        },

        // 跳转页
        *projAssessmentStandardDetail ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/projectApp/projexam/examsetting/projAssessmentStandardDetail',query:payload}));
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/projexam/examsetting/projAssessmentStandardInfo') {
                    dispatch({
                        type : 'projectDetailQuery',
                        payload : query
                    });
                }
            });
        },
    },
};
