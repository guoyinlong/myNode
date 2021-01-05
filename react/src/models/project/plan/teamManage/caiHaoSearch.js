/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：团队管理
 */
import * as teamManageServices from '../../../../services/project/teamManage';
import { routerRedux } from 'dva/router';
import {arrayToObjGroups} from '../../../../utils/func';
export default {
    namespace: 'caiHaoSearch',
    state: {
        dataSource:[],
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
        *caiHaoSearch ({payload}, { call, put }) {
            const res = yield call(teamManageServices.projSearchNumberOfPeople,{'arg_dept_name':'联通软件研究院-公众研发事业部'});
            if (res.RetCode === '1') {
                const data = arrayToObjGroups(res.DataRows,'ou');

                for (let i = 0; i < data.length; i++) {
                    data[i].sum = 0;
                    let ou = data[i].value;
                    for (let j = 0; j < ou.length; j++) {
                        data[i].sum += parseInt(ou[j].sumpeople);
                    }
                }
                let newData = [];
                let sum = 0;
                for (let i = 0; i < data.length; i++) {
                    data[i].value.map((item, index) => {
                        item.span = (index === 0 ? data[i].value.length : 0);
                        item.oupeople = data[i].sum;
                        item.flag = (i % 2 !== 0 ? 'odd' : 'even');
                    })
                    newData = [...newData,...data[i].value];
                    sum += data[i].value[0].oupeople;
                }
                newData.push({"ou":"1","proj_name":"2","dept_name":"3","sumpeople":"0","span":5,"oupeople":sum});
                const newArray = newData.map((item, index) => {
                    return {...item,'index':index}
                });
                yield put({
                    type : 'querySuccess',
                    payload : {'dataSource':newArray}
                });
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/projPrepare/teamManage/teamManageSearch') {
                    dispatch({
                        type : 'caiHaoSearch'
                    });
                }
            });
        },
    },
};
