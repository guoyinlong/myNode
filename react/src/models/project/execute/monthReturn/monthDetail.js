/**
 * 作者：夏天
 * 创建日期：2018-10-19
 * 邮件：1348744578@qq.com
 * 文件说明：周报月报-月报详细（退回页面）
 */
import Cookie from 'js-cookie';
import { message } from 'antd';
import * as projServices from '../../../../services/project/monthDetailService';
import * as publicFunc from './publicFunc';

export default {
    namespace: 'monthDetail',
    state: {
        monthDetailList: [], // 项目信息列表
        monthDetailQueryList: [], // 请求得到是项目信息数据
        monthTypeList: [], // 所有月报状态
        projId: '', // 项目id
        type_tag: '', // 月报状态
        proj_name_title: '', // 项目名称
        proj_begin_time: '', // 项目开始时间
        proj_end_time: '', // 项目结束时间
        is_edit: '', // 编辑权限
        // 项目列表页查询条件,返回项目列表所用
        ou_name: '',
        pu_deptid: '',
        proj_label: '',
        proj_code: '',
        proj_name: '',
        dept_name: '',
        mgr_name: '',
        proj_type: '',
        staff_id: '',
        page: '',
        condCollapse: '',

    },
    reducers: {
        initData(state) {
            return {
                ...state,
                type_tag: '',
                monthDetailList: [], // 项目信息列表
                monthDetailQueryList: [], // 请求得到是项目信息数据
                monthTypeList: [], // 所有月报状态
            }
        },
        save(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
    effects: {
        *initQuery({ query }, { put }) {
            query.payload = JSON.parse(query.payload);
            //保存项目列表页查询条件
            yield put({
                type: 'save',
                payload: {
                    projId: query.proj_id,
                    ou_name: query.payload.ou_name,
                    pu_deptid: query.payload.pu_deptid,
                    proj_label: query.payload.proj_label,
                    proj_code: query.payload.proj_code,
                    proj_name: query.payload.proj_name,
                    dept_name: query.payload.dept_name,
                    mgr_name: query.payload.mgr_name,
                    proj_type: query.payload.proj_type,
                    staff_id: query.payload.staff_id,
                    page: query.payload.page,
                    condCollapse: query.payload.condCollapse,
                }
            });
            yield put({
                type: 'monthTypeQuery'
            });
            yield put({
                type: 'monthDetailQuery'
            });
        },
        // 月报所有状态查询
        *monthTypeQuery({ }, { call, put, select }) {
            const { projId } = yield select(state => state.monthDetail);
            const postData = {
                arg_proj_id: projId,
                arg_req_userid: publicFunc.getUserId(),
                arg_req_moduleurl: publicFunc.getModuleUrlIndex(),
            };
            const data = yield call(projServices.monthTypeQuery, postData);
            if (data.RetCode === '1') {
                let list = data.DataRows;
                yield put({
                    type: 'save',
                    payload: {
                        monthTypeList: list,
                    }
                });
            }
        },
        // 保存搜索框中的“状态”
        *setProjTag({ value }, { put }) {
            yield put({
                type: 'save',
                payload: {
                    type_tag: value,
                }
            });
            yield put({
                type: 'savemonthDetailList'
            });
        },
        // 月报详情列表查询
        *monthDetailQuery({ }, { call, put, select }) {
            const { projId } = yield select(state => state.monthDetail);
            const postData = {
                arg_proj_id: projId,
                arg_req_userid: publicFunc.getUserId(),
                arg_req_moduleurl: publicFunc.getModuleUrlIndex(),
            };
            const data = yield call(projServices.monthDetailQuery, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        monthDetailQueryList: data.DataRows,
                        proj_begin_time: data.proj_begin_time,
                        proj_end_time: data.proj_end_time,
                        proj_name_title: data.proj_name,
                        is_edit: data.is_edit,
                    }
                });
                yield put({
                    type: 'savemonthDetailList',
                })
            }
        },
        *savemonthDetailList({ }, { call, put, select }) {
            const { monthDetailQueryList, proj_begin_time, proj_end_time, type_tag } = yield select(state => state.monthDetail);

            // 算出来项目所处时间的（字段为年、月）json数组
            let startTime = new Date(Date.parse(proj_begin_time.replace(/-/g, "/")));

            let endTime = new Date(Date.parse(proj_end_time.replace(/-/g, "/")));

            let startMonth; let endMonth;

            startMonth = startTime.getMonth() + 1;

            if (endTime >= 7) {
                endMonth = endTime.getMonth() + 1;
            } else {
                if ((endTime.getDate() - endTime.getDay()) >= 0) {
                    endMonth = endTime.getMonth() + 1;
                } else {
                    endMonth = endTime.getMonth();
                }
            };
            let startYear = startTime.getFullYear();
            let endYear = endTime.getFullYear();
            if (startMonth == 0) {
                startYear = startYear - 1;
                startMonth = 12;
            }
            if (endMonth == 0) {
                endYear = endYear - 1;
                endMonth = 12;
            }
            let dataList = [];
            for (let i = startYear; i <= endYear; i++) {
                if (i === startYear && i === endYear) {
                    for (let j = startMonth; j <= endMonth; j++) {
                        let str = {};
                        str.proj_year = i;
                        str.proj_month = j;
                        str.tag = '2';
                        str.tag_show = '未填写';
                        str.key = i + '' + j;
                        dataList.push(str);
                    }
                } else {
                    if (i === startYear) {
                        for (let j = startMonth; j <= 12; j++) {
                            let str = {};
                            str.proj_year = i;
                            str.proj_month = j;
                            str.tag = '2';
                            str.tag_show = '未填写';
                            str.key = i + '' + j;
                            dataList.push(str);
                        }
                    } else if (i > startYear && i < endYear) {
                        for (let j = 1; j <= 12; j++) {
                            let str = {};
                            str.proj_year = i;
                            str.proj_month = j;
                            str.tag = '2';
                            str.tag_show = '未填写';
                            str.key = i + '' + j;
                            dataList.push(str);
                        }
                    } else if (i == endYear) {
                        for (let j = 1; j <= endMonth; j++) {
                            let str = {};
                            str.proj_year = i;
                            str.proj_month = j;
                            str.tag = '2';
                            str.tag_show = '未填写';
                            str.key = i + '' + j;
                            dataList.push(str);
                        }
                    }

                }
            }
            // 将请求得到的数据加到上面得到的json数组中
            for (let j in monthDetailQueryList) {
                for (let i in dataList) {
                    if (dataList[i].proj_year == monthDetailQueryList[j].proj_year && dataList[i].proj_month == monthDetailQueryList[j].proj_month) {
                        dataList[i].tag = monthDetailQueryList[j].tag;
                        dataList[i].tag_show = monthDetailQueryList[j].tag_show;
                        dataList[i].proj_num_month = monthDetailQueryList[j].proj_num_month;
                        break;
                    }
                }
            }
            for (let m in dataList) {
                if (dataList[m].proj_month < 10) {
                    dataList[m].proj_month = '0' + dataList[m].proj_month;
                }
            }
            // 页面头部状态搜索
            if (type_tag === '0' || type_tag === '1' || type_tag === '2') {
                let list = [];
                for (let k = 0; k < dataList.length; k++) {
                    if (type_tag == dataList[k].tag) {
                        list.push(dataList[k]);
                    }
                }
                dataList = list;
            }
            yield put({
                type: 'save',
                payload: {
                    monthDetailList: dataList
                }
            })
        },
        // 退回、删除月报功能
        *returnOrDeleteMonth({ record, arg_flag }, { call, put, select }) {
            const { projId } = yield select(state => state.monthDetail);
            const postData = {
                arg_proj_id: projId,
                arg_req_userid: publicFunc.getUserId(),
                arg_req_moduleurl: publicFunc.getModuleUrlIndex(),
                arg_proj_month: record.proj_month,
                arg_proj_num_month: record.proj_num_month,
                arg_proj_year: record.proj_year,
                arg_flag: arg_flag,
            };
            const data = yield call(projServices.monthTagUpdateQuery, postData);
            if (data.RetCode === '1') {
                message.success(data.RetVal);
                yield put({
                    type: 'monthDetailQuery'
                })
            } else if(data.RetCode === '-1'){
                message.error(data.RetVal);
            }
        },



    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                // const query = parse(search.split('?')[1]);
                if (pathname === '/projectApp/projExecute/weekAndMonth/monthDetail') {
                    dispatch({ type: 'initData' });
                    dispatch({ type: 'initQuery', query });
                }
            });
        },
    },
};
