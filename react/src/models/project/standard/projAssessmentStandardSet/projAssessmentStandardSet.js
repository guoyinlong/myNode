/**
 * 作者：任华维
 * 日期：2017-07-31
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：项目考核指标
 */
import * as projAssessmentStandardServices from '../../../../services/project/projAssessmentStandard';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import config from '../../../../utils/config';
import {getUuid} from '../../../../utils/func';
import moment from 'moment';
export default {
    namespace: 'standardSet',
    state: {
        years:[],
        list:[],
        year:'',
        season:'',
        selectedRowKeys:[],
        userId:localStorage.getItem('userid'),
        userName:localStorage.getItem('fullName'),
    },
    reducers: {
        projQuerySuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
        selectedRowKeys(state, {payload}) {
            return {
                ...state,
                selectedRowKeys:payload
            };
        },
    },
    effects: {
        *projQuery ({payload}, { call, put, select }) {
            const {userId,userName} = yield select(state => state.standardSet);
            const res = yield call(projAssessmentStandardServices.projExamQuery,{'arg_year':payload.year,'arg_season':payload.season});
            if (res.RetCode === '1') {
                const data = [];
                const list = res.DataRows1 || [];
                for (let i = 0; i < list.length; i++) {
                    list[i].uid = getUuid(32,62);
                    list[i].f_year = payload.year;
                    list[i].f_season = payload.season;
                    list[i].proj_flag = list[i].state;
                    list[i].state = '1';
                    list[i].create_id = userId;
                    list[i].create_name = userName;
                    if (list[i].proj_flag === '1') {
                        data.push(list[i].proj_id);
                    }
                }
                yield put({
                    type : 'projQuerySuccess',
                    payload : {'years':res.DataRows || [],'list':list,'selectedRowKeys':data,...payload}
                });
            }
        },
        *projExamAlloc ({payload}, { call, put, select }) {
            const {list,year,season,selectedRowKeys} = yield select(state => state.standardSet);
            for (let i = 0; i < list.length; i++) {
                list[i].proj_flag = '0';
                for (let j = 0; j < selectedRowKeys.length; j++) {
                    if (list[i].proj_id === selectedRowKeys[j]) {
                        list[i].proj_flag = '1';
                    }
                }
            }
            const data = list.map((item, index) => {
                delete item.kpi_fill_state;
                return '{"opt":"insert","data":'+JSON.stringify(item)+'}';
            })
            const args = {
                transjsonarray:'['
                    +'{"opt":"delete","data":{"f_year":"'+year+'","f_season":"'+season+'"}},'
                    + data.join(',')
                +']'
            }
            const res = yield call(projAssessmentStandardServices.projExamAlloc,args)
            if (res.RetCode === '1') {
                yield put({
                    type : 'projQuery',
                    payload:{'year':year,'season':season}
                });
                message.success('提交成功！');
            }
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/projexam/examallocation') {
                    dispatch({
                        type : 'projQuery',
                        payload:{'year':moment().year().toString(),'season':moment().quarter().toString()}
                    });
                }
            });
        },
    },
};
