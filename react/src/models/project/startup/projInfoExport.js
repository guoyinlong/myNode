/**
 * 作者：夏天
 * 创建日期：2018-9-4
 * 邮件：1348744578@qq.com
 * 文件说明：项目信息导出-models
 */
import Cookie from 'js-cookie';
import * as projInfoExportService from '../../../services/project/projInfoExportService';

export default {
    namespace: 'projInfoExport',
    state: {
        projInfoList: [], // 项目信息列表
        tableParam: [], // 列表服务所需参数
        allDepartment: [], // 归口部门列表
        allSearchProjType: [], // 项目分类列表
        allComonProjType: [], // 项目类型列表
        allOu: [], // 主建单位列表
        allProjTag: [], // 项目状态列表
        startAndEndYear: [], // 启动年份和结束年份区间

        projExportFiled: [],      // 可导出字段
        rowCount: '', // 项目信息列表条数
        saveExportField: [], // 待导出的字段
        judgeAllFiledCheck: '', // 判断可导出字段是否全选:-1全不选、0部分已选部分未选、1全选

    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
    effects: {
        *initQuery({ }, { put }) {
            const tableParam = {
                arg_pu_dept_name: '',
                arg_proj_label: '',
                arg_proj_type: '',
                arg_ou: '',
                arg_dept_name: '',
                arg_proj_tag: '2',
                arg_begin_year: '',
                arg_end_year: '',
            };
            yield put({
                type: 'save',
                payload: {
                    tableParam: JSON.parse(JSON.stringify(tableParam)),
                },
            });
            yield put({
                type: 'projInfoListQuery',
            });
            yield put({ type: 'allDepartmentQuery' });
            yield put({ type: 'allSearchProjTypeQuery' });
            yield put({ type: 'allCommonProjTypeQuery' });
            yield put({ type: 'allOuQuery' });
            yield put({ type: 'allProjTagQuery' });
            yield put({ type: 'startAndEndYearQuery' });
        },
        // 获取项目信息列表
        *projInfoListQuery({ }, { call, put, select }) {
            const { tableParam } = yield select(state => state.projInfoExport);
            const postData = {
                arg_pu_dept_name: tableParam.arg_pu_dept_name,
                arg_proj_label: tableParam.arg_proj_label,
                arg_proj_type: tableParam.arg_proj_type,
                arg_ou: tableParam.arg_ou,
                arg_dept_name: tableParam.arg_dept_name,
                arg_proj_tag: tableParam.arg_proj_tag,
                arg_begin_year: tableParam.arg_begin_year,
                arg_end_year: tableParam.arg_end_year,
            };
            const data = yield call(projInfoExportService.projInfoListQuery, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        projInfoList: data.DataRows,
                        rowCount: data.RowCount,
                    },
                });
            }
        },
        // 查询全部归口部门名称
        *allDepartmentQuery({ }, { call, put }) {
            const postData = {
                arg_tenantid: Cookie.get('tenantid'),
            };
            const data = yield call(projInfoExportService.allDepartmentQuery, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        allDepartment: data.DataRows,
                    },
                });
            }
        },
        // 查询所有项目分类
        *allSearchProjTypeQuery({ }, { call, put }) {
            const postData = {
                arg_tenantid: Cookie.get('tenantid'),
            };
            const data = yield call(projInfoExportService.allSearchProjTypeQuery, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        allSearchProjType: data.DataRows,
                    },
                });
            }
        },
        // 查询当前在用的项目类型
        *allCommonProjTypeQuery({ }, { call, put }) {
            const data = yield call(projInfoExportService.allCommonProjTypeQuery);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        allComonProjType: data.DataRows,
                    },
                });
            }
        },
        // 查询主建单位
        *allOuQuery({ }, { call, put }) {
            const postData = {
                arg_tenantid: Cookie.get('tenantid'),
            };
            const data = yield call(projInfoExportService.allOuQuery, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        allOu: data.DataRows,
                    },
                });
            }
        },
        // 查询项目状态
        *allProjTagQuery({ }, { call, put }) {
            const data = yield call(projInfoExportService.allProjTagQuery);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        allProjTag: data.DataRows,
                    },
                });
            }
        },
        // 查询项目启动年份区间和结束年份区间
        *startAndEndYearQuery({ }, { call, put }) {
            const data = yield call(projInfoExportService.startAndEndYearQuery);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        startAndEndYear: data,
                    },
                });
            }
        },
        /**
         * 保存选择框输入的的值,并查询
         */
        *setInputOrSelectShow({ value, objParam }, { put, select }) {
            const { tableParam } = yield select(state => state.projInfoExport);
            if (value === 'defaultAll') {
                tableParam[objParam] = '';
            } else if (value !== 'defaultAll') {
                tableParam[objParam] = value;
            }
            yield put({
                type: 'save',
                payload: {
                    tableParam: JSON.parse(JSON.stringify(tableParam)),
                },
            });
            yield put({
                type: 'projInfoListQuery',
            });
        },
        /**
        * 功能：页面清空按钮
        * @param buttonType 清空输入框
        */
        *queryHeadClick({ buttonType }, { put }) {
            yield put({
                type: 'initQuery',
            });
        },
        // 打开弹框,并查询可导出字段名的信息
        *exportButton({ }, { call, put }) {
            const data = yield call(projInfoExportService.exportFieldQuery);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        projExportFiled: data.DataRows,
                    },
                });
                yield put({
                    type: 'saveExportField',
                });
            }
        },
        // 勾选或取消勾选导出excel的字段
        *exportDataSelect({ field, value }, { put, select }) {
            const { projExportFiled } = yield select(state => state.projInfoExport);
            for (const i in projExportFiled) {
                if (field === projExportFiled[i].field_id) {
                    if (value === true) {
                        projExportFiled[i].init_is_checked = '1';
                    } else if (value === false) {
                        projExportFiled[i].init_is_checked = '0';
                    }
                }
            }
            yield put({
                type: 'save',
                payload: {
                    projExportFiled,
                },
            });
            yield put({
                type: 'saveExportField',
            });
        },
        // 保存已选择的字段、判断字段是否全选
        *saveExportField({ }, { put, select }) {
            const { projExportFiled } = yield select(state => state.projInfoExport);
            const saveExportField = [];
            for (const i in projExportFiled) {
                if (projExportFiled[i].init_is_checked === '1') {
                    const str = {};
                    str.field_id = projExportFiled[i].field_id;
                    str.field_name = projExportFiled[i].field_name;
                    saveExportField.push(str);
                }
            }
            // 判断字段是否全选
            let num = 0;
            let allFiledChecked = '';
            for (const k in projExportFiled) {
                if (projExportFiled[k].init_is_checked === '1') {
                    num++;
                }
            }
            if (num === 0) {
                allFiledChecked = '-1';
            } else if (num === projExportFiled.length) {
                allFiledChecked = '1';
            } else {
                allFiledChecked = '0';
            }
            yield put({
                type: 'save',
                payload: {
                    saveExportField,
                    judgeAllFiledCheck: allFiledChecked,
                },
            });
        },
        // 全选按钮
        *checkAllOrNull({ }, { put, select }) {
            const {
                 projExportFiled, judgeAllFiledCheck,
                } = yield select(state => state.projInfoExport);
            for (const i in projExportFiled) {
                if (judgeAllFiledCheck === '1') {
                    projExportFiled[i].init_is_checked = '0';
                } else if (judgeAllFiledCheck === '0' || judgeAllFiledCheck === '-1') {
                    projExportFiled[i].init_is_checked = '1';
                }
            }
            yield put({
                type: 'save',
                payload: {
                    projExportFiled: JSON.parse(JSON.stringify(projExportFiled)),
                },
            });
            yield put({
                type: 'saveExportField',
            });
        },

    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                // const query = parse(search.split('?')[1]);
                if (pathname === '/projectApp/projStartUp/projInfoExport') {
                    dispatch({ type: 'initQuery' });
                }
            });
        },
    },
};
