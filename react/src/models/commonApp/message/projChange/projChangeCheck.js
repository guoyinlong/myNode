/**
 * 作者：邓广晖
 * 创建日期：2017-11-5
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目变更的项目审核数据的model
 */
import * as projServices from '../../../../services/project/projService';
import {routerRedux} from 'dva/router';
import config from '../../../../utils/config';
import {isInArray, checkProjLabel, checkProjType} from '../../../../routes/project/projConst.js';
import {message} from 'antd';


export default {
    namespace: 'projChangeCheck',
    state: {
        modalVisible: false,
        projInfoTableData: [],
        pms_list: [],
        notChangeBasicInfo: {},
        roleTag: '',
        projOriginName: '',
        changeReason: '',
        isSelectConference: '',
        returnReason: '',
        preLinkName: '',
        linkName: '',
        flag: '',
        taskUuid: '',
        projUid: '',
        businessId: '',
        userid: localStorage.getItem('userid'),
        username: localStorage.getItem('fullName'),
        checkId: '',
        taskBatchid: '',
        taskWfBatchid: '',
        projId: '',
        titleDetail: {},
        puDeptId: '',
        projChangeByid: '',
        projChangeByname: '',
        t1: '',
        t2: '',
        t3: '',
        lastCheckId: '',
        isFinanceLink: '',
        isReportZongyuan: '',
        isBranchProj: '',
        returnReasonFlag: '',
        projChangeLog: [],
        notChangeMileInfo: [],
        allDeptList: [],
        coorpDeptList: [],
        deptBudgetTableData: [],
        predictTimeTotal: '0',
        checkMilestonePreData: [],
        checkMilestoneNewData: [],
        new_fore_workload: '0',
        old_fore_workload: '0',
        old_remain_workload: 0,
        new_remain_workload: 0,
        tab_key: '1',
        backButtonIsDown: false, /*点击审批历史进去后，出现返回按钮，判断返回按钮是否被按下*/

        tabListArr: [], // 全成本子tab数组
        isShowTabINFullCost: '', // 用于判断是否有子tab
        squareTabKey: '', // 选中的子tab
        deptNum: [],       // 配合部门出现次数
    },
    reducers: {
        initData(state) {
            return {
                ...state,
                modalVisible: false,
                projInfoTableData: [],
                pms_list: [],
                notChangeBasicInfo: {},
                roleTag: '',
                projOriginName: '',
                changeReason: '',
                isSelectConference: '',
                returnReason: '',
                preLinkName: '',
                linkName: '',
                flag: '',
                taskUuid: '',
                projUid: '',
                businessId: '',
                userid: localStorage.getItem('userid'),
                username: localStorage.getItem('fullName'),
                checkId: '',
                taskBatchid: '',
                taskWfBatchid: '',
                projId: '',
                titleDetail: {},
                puDeptId: '',
                projChangeByid: '',
                projChangeByname: '',
                t1: '',
                t2: '',
                t3: '',
                lastCheckId: '', /*待办中传递过来arg_check_id与标题中查询出来的last_check_id一样，而已办和办结中传递过来的arg_check_id与标题中查询出来的last_check_id不一样*/
                isFinanceLink: '',
                isReportZongyuan: '',
                isBranchProj: '',
                returnReasonFlag: '',
                projChangeLog: [],
                notChangeMileInfo: [],
                allDeptList: [],
                coorpDeptList: [],
                deptBudgetTableData: [],
                predictTimeTotal: '0',
                checkMilestonePreData: [],
                checkMilestoneNewData: [],
                new_fore_workload: '0',
                old_fore_workload: '0',
                old_remain_workload: 0,
                new_remain_workload: 0,
                tab_key: '1',
            }
        },
        backShowModal(state) {
            return {
                ...state,
                modalVisible: true
            };
        },
        backHideModal(state) {
            return {
                ...state,
                modalVisible: false
            };
        },
        save(state, action) {
            return {...state, ...action.payload};
        }
    },
    effects: {
        /**
         * 作者：胡月
         * 创建日期：2017-11-20
         * 功能：审核人的项目基本信息对比页面
         */
        * projCheckBasicInfo({payload}, {call, put, select}) {
            const {lastCheckId} = yield select(state => state.projChangeCheck);
            yield put({
                type: 'save',
                payload: {
                    roleTag: payload.arg_tag, /*当前用户是什么角色，3是变更人角色，4审核人角色*/
                    flag: payload.arg_handle_flag, /*0待办/1已办/3办结*/
                    taskUuid: payload.arg_task_uuid,
                    projUid: payload.arg_proj_uid,
                    checkId: payload.arg_check_id,
                    taskBatchid: payload.arg_task_batchid,
                    taskWfBatchid: payload.arg_task_wf_batchid,
                    projId: payload.arg_proj_id,
                }
            });
            const data = yield call(projServices.projChangeCheckInfo,
                {arg_proj_id: payload.arg_proj_id, arg_check_id: lastCheckId});

                

            if (data.RetCode === '1') {
                let oldInfo = JSON.parse(data.oldInfo);
                let newInfo = JSON.parse(data.newInfo);
                let pmsOldInfo = 'pmsOldInfo' in data ? JSON.parse(data.pmsOldInfo) : [];
                let pmsNewInfo = 'pmsNewInfo' in data ? JSON.parse(data.pmsNewInfo) : [];

                //临时设定
                let oldis_associated = { 'is_associated' : {value : '0'} }
                 oldInfo = { ...oldis_associated,...oldInfo}

                 let newis_associated = { 'is_associated' : {value : '1'} }
                 newInfo = { ...newis_associated,...newInfo}


                //是否关联
                if('is_associated' in oldInfo){
                    oldInfo.is_associated.value = oldInfo.is_associated.value === '0' ? '是' : '否';
                }
                if ('is_associated' in newInfo) {
                    newInfo.is_associated.value = newInfo.is_associated.value === '0' ? '是' : '否';
                }


                //项目分类  checkProjLabel,
                if ('proj_label' in oldInfo) {
                    oldInfo.proj_label.value = checkProjLabel(oldInfo.proj_label.value);
                }
                if ('proj_label' in newInfo) {
                    newInfo.proj_label.value = checkProjLabel(newInfo.proj_label.value);
                }
                //主子项目
                if ('is_primary' in oldInfo) {
                    oldInfo.is_primary.value = oldInfo.is_primary.value === '0' ? '主项目' : '子项目';
                }
                if ('is_primary' in newInfo) {
                    newInfo.is_primary.value = newInfo.is_primary.value === '0' ? '主项目' : '子项目';
                }
                //项目类型
               /* if ('proj_type_show' in oldInfo) {
                    oldInfo.proj_type.value = oldInfo.proj_type_show.value;
                }
                if ('proj_type_show' in newInfo) {
                    newInfo.proj_type.value = newInfo.proj_type_show.value;
                }*/
                // 投资替代额
                if ('replace_money' in oldInfo) {
                    oldInfo.replace_money.value = Number((Number(oldInfo.replace_money.value) / 10000).toFixed(6)) + '万元';
                }
                if ('replace_money' in newInfo) {
                    newInfo.replace_money.value = Number((Number(newInfo.replace_money.value) / 10000).toFixed(6)) + '万元';
                }
                // 工作量
                if ('fore_workload' in oldInfo) {
                    oldInfo.fore_workload.value = oldInfo.fore_workload.value + '人月';
                }
                if ('fore_workload' in newInfo) {
                    newInfo.fore_workload.value = newInfo.fore_workload.value + '人月';
                }



                //关联信息

                let associatedList = [
                    {indexName: 'is_associated',showName:'是否关联'}
                ]

                //基础信息
                let basicInfoList = [


                     


                    {indexName: 'proj_label', showName: '项目分类'},          //需要转
                    {indexName: 'is_primary', showName: '主/子项目'},         //需要转
                    {indexName: 'primary_name', showName: '主项目名称'},
                    {indexName: 'proj_code', showName: '生产编码'},
                    {indexName: 'proj_name', showName: '团队名称'},
                    {indexName: 'proj_shortname', showName: '项目简称'},
                    {indexName: 'proj_type_show', showName: '项目类型'},
                    {indexName: 'proj_ratio', showName: '团队系数'},
                    {indexName: 'replace_money', showName: '预估投资替代额'},   //需要转为 万元
                    {indexName: 'fore_workload', showName: '预估工作量'},      //需要转为 人月
                    {indexName: 'begin_time', showName: '开始时间'},
                    {indexName: 'end_time', showName: '结束时间'},
                    {indexName: 'dept_name', showName: '主建部门'},
                    {indexName: 'mgr_name', showName: '项目经理'},
                    {indexName: 'pu_dept_name', showName: '归属部门'}
                ];
                /**
                 * 作者：刘洪若
                 * 时间：2020-4-10
                 * 功能：不显示委托方信息
                 */
                //委托方信息信息
                // let clientInfoList = [
                //     {indexName: 'client', showName: '委托方'},
                //     {indexName: 'mandator', showName: '委托方联系人'},
                //     {indexName: 'client_tel', showName: '委托方手机号'},
                //     {indexName: 'client_tel', showName: '委托方E-mail'},
                // ];
                //其他信息
                let extraInfoList = [
                    {indexName: 'work_target', showName: '项目目标'},
                    {indexName: 'proj_range', showName: '项目范围/建设内容'},
                    {indexName: 'quality_target', showName: '技术/质量目标'},
                    {indexName: 'proj_check', showName: '考核指标及验收标准'},
                    {indexName: 'proj_repair', showName: ' 备注'},
                ];
                 let projInfoTableData = [];

                //添加一行关联项目
             let obj = {}
             obj.module = '关联项目'
             obj.modifyItem = associatedList[0].showName;
             obj.is_diff = newInfo[associatedList[0].indexName].is_diff;
             obj.oldValue = associatedList[0].indexName in oldInfo &&
             oldInfo[associatedList[0].indexName].value !== null
                 ? oldInfo[associatedList[0].indexName].value : '-';
             obj.newValue = associatedList[0].indexName in newInfo &&
             newInfo[associatedList[0].indexName].value !== null
                 ? newInfo[associatedList[0].indexName].value : '-';
                 obj.rowSpan = associatedList.length;
             projInfoTableData.push(obj);


                for (let i = 0; i < basicInfoList.length; i++) {
                    let obj = {};
                    obj.module = '基础信息';
                    obj.modifyItem = basicInfoList[i].showName;
                    obj.is_diff = newInfo[basicInfoList[i].indexName].is_diff;
                    obj.oldValue = basicInfoList[i].indexName in oldInfo &&
                    oldInfo[basicInfoList[i].indexName].value !== null
                        ? oldInfo[basicInfoList[i].indexName].value : '-';
                    obj.newValue = basicInfoList[i].indexName in newInfo &&
                    newInfo[basicInfoList[i].indexName].value !== null
                        ? newInfo[basicInfoList[i].indexName].value : '-';
                    if (i === 0) {
                        obj.rowSpan = basicInfoList.length;
                    } else {
                        obj.rowSpan = 0;
                    }
                    projInfoTableData.push(obj);
                }
                //pms信息
                for (let i = 0; i < pmsNewInfo.length; i++) {
                    let obj = {};
                    obj.module = 'PMS信息';
                    obj.modifyItem = 'PMS项目编码';
                    obj.is_diff = pmsNewInfo[i].pms_code.is_diff;
                    obj.oldValue = pmsOldInfo[i].pms_code.content !== null ? pmsOldInfo[i].pms_code.content : '-';
                    obj.newValue = pmsNewInfo[i].pms_code.content !== null ? pmsNewInfo[i].pms_code.content : '-';
                    //如果是新增的
                    if (pmsNewInfo.opt_flag === '1') {
                        obj.oldValue = '-';
                    }
                    //如果是删除的
                    if (pmsNewInfo.opt_flag === '3') {
                        obj.newValue = '-';
                    }
                    if (i === 0) {
                        obj.rowSpan = pmsNewInfo.length * 3;
                    } else {
                        obj.rowSpan = 0;
                    }
                    projInfoTableData.push(obj);

                    obj = {};
                    obj.module = 'PMS信息';
                    obj.modifyItem = 'PMS项目名称';
                    obj.is_diff = pmsNewInfo[i].pms_name.is_diff;
                    /*let oldValueTemp = pmsOldInfo[i].pms_name.content !== null ? pmsOldInfo[i].pms_name.content : '-';
                    if (pmsOldInfo[i].pms_stage.content !== null) {
                        oldValueTemp += oldValueTemp + '（' + pmsOldInfo[i].pms_stage.content + '）';
                    }*/
                    obj.oldValue = pmsOldInfo[i].pms_name.content !== null ? pmsOldInfo[i].pms_name.content : '-';
                    /*let newValueTemp = pmsNewInfo[i].pms_name.content !== null ? pmsNewInfo[i].pms_name.content : '-';
                    if (pmsNewInfo[i].pms_stage.content !== null && pmsNewInfo[i].pms_stage.content !== '') {
                        newValueTemp += newValueTemp + '（' + pmsNewInfo[i].pms_stage.content + '）';
                    }*/
                    obj.newValue = pmsNewInfo[i].pms_name.content !== null ? pmsNewInfo[i].pms_name.content : '-';
                    //如果是新增的
                    if (pmsNewInfo.opt_flag === '1') {
                        obj.oldValue = '-';
                    }
                    //如果是删除的
                    if (pmsNewInfo.opt_flag === '3') {
                        obj.newValue = '-';
                    }
                    obj.rowSpan = 0;
                    projInfoTableData.push(obj);

                    obj = {};
                    obj.module = 'PMS信息';
                    obj.modifyItem = '期数';
                    obj.is_diff = pmsNewInfo[i].pms_stage.is_diff;
                    obj.oldValue = pmsOldInfo[i].pms_stage.content !== null ? pmsOldInfo[i].pms_stage.content : '-';
                    obj.newValue = pmsNewInfo[i].pms_stage.content !== null ? pmsNewInfo[i].pms_stage.content : '-';
                    //如果是新增的
                    if (pmsNewInfo.opt_flag === '1') {
                        obj.oldValue = '-';
                    }
                    //如果是删除的
                    if (pmsNewInfo.opt_flag === '3') {
                        obj.newValue = '-';
                    }
                    obj.rowSpan = 0;
                    projInfoTableData.push(obj);
                }
                /**
                 * 作者：刘洪若
                 * 时间：2020-4-10
                 * 功能：后台返回的数据委托方信息不添加
                 */
                // for (let i = 0; i < clientInfoList.length; i++) {
                //     let obj = {};
                //     obj.module = '委托方信息';
                //     obj.modifyItem = clientInfoList[i].showName;
                //     obj.is_diff = newInfo[clientInfoList[i].indexName].is_diff;
                //     obj.oldValue = clientInfoList[i].indexName in oldInfo &&
                //     oldInfo[clientInfoList[i].indexName].value !== null
                //         ? oldInfo[clientInfoList[i].indexName].value : '-';
                //     obj.newValue = clientInfoList[i].indexName in newInfo &&
                //     newInfo[clientInfoList[i].indexName].value !== null
                //         ? newInfo[clientInfoList[i].indexName].value : '-';
                //     if (i === 0) {
                //         obj.rowSpan = clientInfoList.length;
                //     } else {
                //         obj.rowSpan = 0;
                //     }
                //     projInfoTableData.push(obj);
                // }
                for (let i = 0; i < extraInfoList.length; i++) {
                    let obj = {};
                    obj.module = '其他信息';
                    obj.modifyItem = extraInfoList[i].showName;
                    obj.is_diff = newInfo[extraInfoList[i].indexName].is_diff;
                    obj.oldValue = extraInfoList[i].indexName in oldInfo &&
                    oldInfo[extraInfoList[i].indexName].value !== null
                        ? oldInfo[extraInfoList[i].indexName].value : '-';
                    obj.newValue = extraInfoList[i].indexName in newInfo &&
                    newInfo[extraInfoList[i].indexName].value !== null
                        ? newInfo[extraInfoList[i].indexName].value : '-';
                    if (i === 0) {
                        obj.rowSpan = extraInfoList.length;
                    } else {
                        obj.rowSpan = 0;
                    }
                    obj.isTextArea = '1';                     //此处多加一个字段，用来区分是文本域
                    projInfoTableData.push(obj);
                }
                projInfoTableData.forEach((item, index) => {
                    item.key = index;
                });
                yield put({
                    type: 'save',
                    payload: {
                        projInfoTableData: projInfoTableData
                    }
                });
            }
        },

        /**
         * 作者：胡月
         * 创建日期：2017-11-27
         * 功能：申请人基本信息无变更，审核人查询无变更的基本信息(非对比)
         */
        * notChangeBasicInfo({payload}, {call, put, select}) {
            const {lastCheckId} = yield select(state => state.projChangeCheck);
            const postData = {
                arg_query_flag: '1',
                arg_check_id: lastCheckId,
                arg_proj_id: payload.arg_proj_id
            };
            const data = yield call(projServices.notChangeBasicInfo, postData);
            if (data.RetCode === '1') {
                if (data.DataRows.length > 0 && 'replace_money' in data.DataRows[0]) {
                    data.DataRows[0].replace_money = Number((Number(data.DataRows[0].replace_money) / 10000).toFixed(6));
                }
                //添加Pms字段
                if (data.pms_list === undefined || data.pms_list === 'NaN') {
                    data.pms_list = [];
                } else {
                    let pms_list = JSON.parse(data.pms_list);
                    pms_list.forEach((item, index) => {
                        if (item.pms_stage_num === 'NaN') {
                            item.pms_stage_num = '0';
                        }
                        item.opt_type = 'search';
                        item.key = index;
                    });
                    data.pms_list = pms_list;
                }
                yield put({
                    type: 'save',
                    payload: {
                        notChangeBasicInfo: data.DataRows[0],
                        pms_list: data.pms_list,
                    }
                });
            }
        },
        /**
         * 作者：胡月
         * 创建日期：2017-11-22
         * 功能：审核人查看项目信息的标题、变更原因、上一环节或者申请人查看项目信息的标题、上一环节
         */
        * projChangeCheckTitle({payload}, {call, put, select}) {
            //arg_check_detail_flag
            let postData = {
                arg_proj_id: payload.arg_proj_id,
                arg_check_id: payload.arg_check_id,
                arg_tag: payload.arg_tag, /*起草人还是审核人，后来加的*/
                arg_handle_flag: payload.arg_handle_flag, /*代办，已办，办结的标志位*/
                arg_is_first: payload.arg_is_first  /*是否点击审批环节表格的第一行*/
            };
            if ('arg_check_detail_flag' in payload) {
                postData.arg_check_detail_flag = payload.arg_check_detail_flag;
            }
            const data = yield call(projServices.projChangeCheckTitle, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        businessId: data.business_id,
                        projOriginName: data.proj_origin_name,
                        changeReason: data.change_reason,
                        isSelectConference: data.is_select_conference,
                        returnReason: data.DataRows[0].return_reason,
                        preLinkName: data.DataRows[0].pre_link_name,
                        linkName: data.DataRows[0].link_name,
                        titleDetail: data.DataRows[0],
                        puDeptId: data.pu_dept_id,
                        projChangeByid: data.proj_change_byid,
                        projChangeByname: data.proj_change_byname,
                        t1: data.t1,
                        t2: data.t2,
                        t3: data.t3,
                        lastCheckId: data.last_check_id,
                        isFinanceLink: data.is_finance_link,
                        isReportZongyuan: data.is_report_zongyuan,
                        isBranchProj: data.is_branch_proj,
                        returnReasonFlag: data.DataRows[0].return_reason_flag,
                        projId: payload.arg_proj_id,
                    }
                });
                //先由标题查询出last_check_id，然后再去查询别的tab，如果是财务的审核环节（isFinanceLink为1），先查询全成本，再查询基本信息（变与不变）、审核环节；
                //如果不是财务的审核环节（isFinanceLink为0），查询基本信息（变与不变）、审核环节，切换tab的时候再查询里程别和全成本
                const {isFinanceLink, backButtonIsDown} = yield select(state => state.projChangeCheck);
                if (isFinanceLink === '1') {
                    //财务阶段，如果是点击返回的页面，首先显示tab4，否则tab3
                    if (backButtonIsDown === true) {
                        yield put({
                            type: 'save',
                            payload: {
                                tab_key: '4',
                            }
                        });
                    } else {
                        yield put({
                            type: 'save',
                            payload: {
                                tab_key: '3',
                            }
                        });
                    }
                    /* yield put({
                         type: 'projCheckFullcost',
                     });*/
                    yield put({
                        type: 'beforeProjCheckFullcost', // 使用该函数进行分别处理
                    });
                    /*  yield put({
                          type: 'notChangeFullcost',
                      });*/
                    yield put({
                        type: 'projCheckBasicInfo',
                        payload
                    });
                    yield put({
                        type: 'notChangeBasicInfo',
                        payload
                    });
                    yield put({
                        type: 'projChangeCheckLog',
                        payload
                    });
                } else {
                    //非财务阶段，如果是点击返回的页面，首先显示tab4，否则tab1
                    if (backButtonIsDown === true) {
                        yield put({
                            type: 'save',
                            payload: {
                                tab_key: '4',
                            }
                        });
                    } else {
                        yield put({
                            type: 'save',
                            payload: {
                                tab_key: '1',
                            }
                        });
                    }
                    yield put({
                        type: 'projCheckBasicInfo',
                        payload
                    });
                    yield put({
                        type: 'notChangeBasicInfo',
                        payload
                    });
                    yield put({
                        type: 'projChangeCheckLog',
                        payload
                    });
                }
            }
        },

        /**
         * 作者：胡月
         * 创建日期：2018-1-5
         * 功能：改变tab_key的值
         */
        * changeTabKey({payload}, {call, put, select}) {
            yield put({
                type: 'save',
                payload: {
                    tab_key: payload.key,
                    backButtonIsDown: payload.backButtonIsDown
                }
            });
        },

        /**
         * 作者：胡月
         * 创建日期：2017-11-24
         * 功能：审核人查看审批环节
         */
        * projChangeCheckLog({}, {call, put, select}) {
            const {lastCheckId} = yield select(state => state.projChangeCheck);
            const data = yield call(projServices.projChangeCheckLog,
                {
                    arg_check_id: lastCheckId,
                });
            if (data.RetCode === '1') {
                if (data.DataRows.length > 0) {
                    yield put({
                        type: 'save',
                        payload: {projChangeLog: data.DataRows}
                    });
                } else {
                    yield put({
                        type: 'save',
                        payload: {projChangeLog: []}
                    });
                }
            }
        },
        /**
         * 作者：胡月
         * 创建日期：2017-11-24
         * 功能：审核人查看待办是否被审核过，
         * 返回值RetNum为1时表示未审核,进详细信息页面；
         * RetNum为0时表示已被审核,提示已被审核并返回待办列表页面
         */
        * projChangeIsCheck({payload}, {call, put}) {
            const data = yield call(projServices.projChangeIsCheck, {
                arg_task_id: payload.arg_task_id,
                arg_task_uuid: payload.arg_task_uuid
            });
            if (data.RetCode === '1') {
                if (payload.arg_handle_flag === '0') {
                    if (data.RetNum === '1') {
                        yield put({
                            type: 'initData',
                        });
                        yield put({
                            type: 'projChangeCheckTitle',
                            payload
                        });
                    } else {
                        yield put(routerRedux.push({pathname: '/taskList'}));
                        message.error('项目变更已经被审核！');
                    }
                } else {
                    yield put({
                        type: 'initData',
                    });
                    yield put({
                        type: 'projChangeCheckTitle',
                        payload
                    });
                }
            }
        },
        /**
         * 作者：胡月
         * 创建日期：2017-11-22
         * 功能：审核人通过操作
         */
        * projChangeApproval({payload}, {call, put}) {
            const data = yield call(projServices.projChangeApproval, payload);
            if (data.RetCode === '1') {
                message.success('通过成功');
                yield put(routerRedux.push({pathname: '/taskList'}));
            }
        },

        /**
         * 作者：胡月
         * 创建日期：2017-11-23
         * 功能：审核人退回操作
         */
        * projChangeReturn({payload}, {call, put}) {
            const data = yield call(projServices.projChangeReturn, payload);
            if (data.RetCode === '1') {
                message.success('退回成功');
                yield put(routerRedux.push({pathname: '/taskList'}));
            }
            yield put({
                type: 'save',
                payload: {
                    modalVisible: false
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-24
         * 功能：变更项目审核里程碑
         */
        * projCheckMilestone({}, {call, put, select}) {
            const {projId, lastCheckId} = yield select(state => state.projChangeCheck);
            const compMileData = yield call(projServices.queryCheckMilestone, {
                arg_proj_id: projId,
                arg_check_id: lastCheckId
            });
            //转换旧数据
            let oldMilestoneInfo = JSON.parse(compMileData.oldMilestoneInfo);
            let old_fore_workload = compMileData.old_fore_workload ? compMileData.old_fore_workload : '0';
            let sumOldWorkload = 0;
            let checkMilestonePreData = [];
            for (let i = 0; i < oldMilestoneInfo.length; i++) {
                //mile_file_tag_show 代表里程碑的状态，在里程碑右上角显示，如果是正常情况（mile_file_tag = 0），不用显示
                if (oldMilestoneInfo[i].mile_flag === '1') {
                    sumOldWorkload += Number(oldMilestoneInfo[i].plan_workload.value);
                    checkMilestonePreData.push({
                        mile_name: oldMilestoneInfo[i].mile_name.value,
                        plan_begin_time: oldMilestoneInfo[i].plan_begin_time.value,
                        plan_end_time: oldMilestoneInfo[i].plan_end_time.value,
                        plan_workload: oldMilestoneInfo[i].plan_workload.value,
                        mile_month_progress: oldMilestoneInfo[i].mile_month_progress ?
                            oldMilestoneInfo[i].mile_month_progress.value : '0',
                        key: i,
                        mile_name_is_diff: '0',
                        plan_begin_time_is_diff: '0',
                        plan_end_time_is_diff: '0',
                        plan_workload_is_diff: '0',
                        has_data: '1',
                        mile_file_tag_show: oldMilestoneInfo[i].mile_file_tag.value !== '0' ?
                            oldMilestoneInfo[i].mile_file_tag_show.value : ''
                    });
                } else {
                    checkMilestonePreData.push({
                        has_data: '0',
                        key: i,
                    });
                }
            }
            //转换新数据
            let newMilestoneInfo = JSON.parse(compMileData.newMilestoneInfo);
            let new_fore_workload = compMileData.new_fore_workload ? compMileData.new_fore_workload : '0';
            let sumNewWorkload = 0;
            let checkMilestoneNewData = [];
            for (let j = 0; j < newMilestoneInfo.length; j++) {
                let obj = {};
                obj.key = j + 1000;  //为了区分旧的key
                if (newMilestoneInfo[j].opt_flag === '0') {
                    //不变
                    sumNewWorkload += Number(newMilestoneInfo[j].plan_workload.value);
                    obj.mile_name_is_diff = '0';
                    obj.plan_begin_time_is_diff = '0';
                    obj.plan_end_time_is_diff = '0';
                    obj.plan_workload_is_diff = '0';
                    obj.is_change = '0';
                    obj.mile_file_tag_show = newMilestoneInfo[j].mile_file_tag.value !== '0' ?
                        newMilestoneInfo[j].mile_file_tag_show.value : '';
                    obj.mile_name = newMilestoneInfo[j].mile_name.value;
                    obj.plan_begin_time = newMilestoneInfo[j].plan_begin_time.value;
                    obj.plan_end_time = newMilestoneInfo[j].plan_end_time.value;
                    obj.plan_workload = newMilestoneInfo[j].plan_workload.value;
                    obj.mile_month_progress = newMilestoneInfo[j].mile_month_progress ?
                        newMilestoneInfo[j].mile_month_progress.value : '0';
                } else if (newMilestoneInfo[j].opt_flag === '1') {
                    //新增
                    sumNewWorkload += Number(newMilestoneInfo[j].plan_workload.value);
                    obj.mile_name_is_diff = '1';
                    obj.plan_begin_time_is_diff = '1';
                    obj.plan_end_time_is_diff = '1';
                    obj.plan_workload_is_diff = '1';
                    obj.is_change = '1';
                    obj.mile_file_tag_show = newMilestoneInfo[j].mile_file_tag.value !== '0' ?
                        newMilestoneInfo[j].mile_file_tag_show.value : '';
                    obj.mile_name = newMilestoneInfo[j].mile_name.value;
                    obj.plan_begin_time = newMilestoneInfo[j].plan_begin_time.value;
                    obj.plan_end_time = newMilestoneInfo[j].plan_end_time.value;
                    obj.plan_workload = newMilestoneInfo[j].plan_workload.value;
                    obj.mile_month_progress = newMilestoneInfo[j].mile_month_progress ?
                        newMilestoneInfo[j].mile_month_progress.value : '0';
                } else if (newMilestoneInfo[j].opt_flag === '2') {
                    //修改
                    sumNewWorkload += Number(newMilestoneInfo[j].plan_workload.value);
                    obj.mile_name_is_diff = newMilestoneInfo[j].mile_name.is_diff;
                    obj.plan_begin_time_is_diff = newMilestoneInfo[j].plan_begin_time.is_diff;
                    obj.plan_end_time_is_diff = newMilestoneInfo[j].plan_end_time.is_diff;
                    obj.plan_workload_is_diff = newMilestoneInfo[j].plan_workload.is_diff;
                    obj.is_change = '1';
                    obj.mile_file_tag_show = newMilestoneInfo[j].mile_file_tag.value !== '0' ?
                        newMilestoneInfo[j].mile_file_tag_show.value : '';
                    obj.mile_name = newMilestoneInfo[j].mile_name.value;
                    obj.plan_begin_time = newMilestoneInfo[j].plan_begin_time.value;
                    obj.plan_end_time = newMilestoneInfo[j].plan_end_time.value;
                    obj.plan_workload = newMilestoneInfo[j].plan_workload.value;
                    obj.mile_month_progress = newMilestoneInfo[j].mile_month_progress ?
                        newMilestoneInfo[j].mile_month_progress.value : '0';
                } else if (newMilestoneInfo[j].opt_flag === '3') {
                    //删除，删除的值是null的，这里使用old的数据
                    //删除的工作量不能求和
                    obj.mile_name_is_diff = '0';
                    obj.plan_begin_time_is_diff = '0';
                    obj.plan_end_time_is_diff = '0';
                    obj.plan_workload_is_diff = '0';
                    obj.is_change = '1';
                    obj.is_delete = '1';
                    obj.mile_file_tag_show = '';    //删除时，新的里程碑上不用写tag
                    obj.mile_name = oldMilestoneInfo[j].mile_name.value;
                    obj.plan_begin_time = oldMilestoneInfo[j].plan_begin_time.value;
                    obj.plan_end_time = oldMilestoneInfo[j].plan_end_time.value;
                    obj.plan_workload = oldMilestoneInfo[j].plan_workload.value;
                    obj.mile_month_progress = oldMilestoneInfo[j].mile_month_progress ?
                        oldMilestoneInfo[j].mile_month_progress.value : '0';
                }
                checkMilestoneNewData.push(obj);
            }
            yield put({
                type: 'save',
                payload: {
                    checkMilestonePreData: checkMilestonePreData,
                    old_fore_workload: old_fore_workload,
                    old_remain_workload: Number(old_fore_workload) - sumOldWorkload,
                    checkMilestoneNewData: checkMilestoneNewData,
                    new_fore_workload: new_fore_workload,
                    new_remain_workload: Number(new_fore_workload) - sumNewWorkload
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-24
         * 功能：里程碑没有发生变化时的查询
         */
        * notChangeMilestone({}, {call, put, select}) {
            const {projId, lastCheckId} = yield select(state => state.projChangeCheck);
            const mileData = yield call(projServices.queryCheckMilestone, {
                arg_query_flag: '1',
                arg_proj_id: projId,
                arg_check_id: lastCheckId
            });
            yield put({
                type: 'save',
                payload: {
                    notChangeMileInfo: mileData.DataRows
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-24
         * 功能：变更项目审核查询发生变化后的全成本
         */
        * projCheckFullcost({}, {call, put, select}) {
            ///////////////////////////////////////////////////////  配合部门
            const {
                projId, lastCheckId,
                tabListArr, isShowTabINFullCost, squareTabKey
            } = yield select(state => state.projChangeCheck);

            // 查询配合部门共出现多少次
            let deptNumPostData = {
                arg_proj_id: projId,
                arg_tab_flag: '3'
            }
            const deptNumData = yield call(projServices.queryCoorpDept, deptNumPostData)
            if (deptNumData.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        deptNum: deptNumData.DataRows,
                    }
                });
            }

            // 配合部门
            let postData = {
                arg_proj_id: projId,
                arg_check_id: lastCheckId
            }

            // 取出当前子tab的参数
            if (isShowTabINFullCost === '1') {  // 有子tab
                let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
                postData.arg_tab_flag = tabItem.tab_flag;
                postData.arg_query_flag = tabItem.tab_flag_change === '1' ? '0' : '1'; // 此处0-1是互换的
                if (tabItem.tab_flag === '1') {
                    postData.arg_pms_code = tabItem.pms_code;
                }
            } else {
                postData.arg_tab_flag = tabListArr[0].tab_flag;
            }

            const compDeptData = yield call(projServices.queryCheckFullCostDept, postData);

            /*转换配合部门数据*/
            let coorpDeptCompList = [];
            if (compDeptData.oldCosDeptInfo !== undefined && compDeptData.newCosDeptInfo !== undefined) {
                let oldCosDeptInfo = JSON.parse(compDeptData.oldCosDeptInfo);
                let newCosDeptInfo = JSON.parse(compDeptData.newCosDeptInfo);
                for (let i = 0; i < oldCosDeptInfo.length; i++) {
                    //key  0=> 1,2    1=>3,4   2=>5,6
                    let obj = {};
                    obj.index = i + 1;
                    obj.key = 2 * i + 1;
                    obj.rowSpan = 2;
                    obj.name = oldCosDeptInfo[i].dept.name;
                    obj.oldContent = oldCosDeptInfo[i].dept.content;
                    obj.newContent = newCosDeptInfo[i].dept.content;
                    obj.newColor = newCosDeptInfo[i].dept.is_diff === '0' ? '#345669' : 'red';
                    obj.is_delete = newCosDeptInfo[i].opt_flag === '3' ? '1' : '0';
                    coorpDeptCompList.push(obj);

                    obj = {};
                    obj.index = i + 1;
                    obj.key = 2 * i + 2;
                    obj.rowSpan = 0;
                    obj.name = oldCosDeptInfo[i].staff.name;
                    obj.oldContent = oldCosDeptInfo[i].staff.content;
                    obj.newContent = newCosDeptInfo[i].staff.content;
                    obj.newColor = newCosDeptInfo[i].staff.is_diff === '0' ? '#345669' : 'red';
                    obj.is_delete = newCosDeptInfo[i].opt_flag === '3' ? '1' : '0';
                    coorpDeptCompList.push(obj);
                }
            }
            yield put({
                type: 'save',
                payload: {
                    coorpDeptCompList: coorpDeptCompList,
                }
            });

            /////////////////////////////////////////////////////////  部门预算

            //const allDeptData = yield call(projServices.queryAllDept,{arg_proj_id:query.arg_proj_id});
            //const allDeptList = allDeptData.DataRows;
            //查询每个部门的预算
            // 取出当前子tab的参数
            let postData2 = {
                arg_proj_id: projId,
                arg_check_id: lastCheckId
            }

            if (isShowTabINFullCost === '1') {  // 有子tab
                let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
                postData2.arg_tab_flag = tabItem.tab_flag;
                postData2.arg_query_flag = tabItem.tab_flag_change === '1' ? '0' : '1'; // 0 对比
                if (tabItem.tab_flag === '1') {
                    postData2.arg_pms_code = tabItem.pms_code;
                }
            }else{ // 没有tab时
                postData2.arg_query_flag = tabListArr[0].tab_flag_change === '1' ? '0' : '1'; // 0 对比
            }

            const compBudgetData = yield call(projServices.queryCheckFullCostBudget, postData2);
            let compBudgetList = compBudgetData.DataRows;
            //确定返回的预算中的年份
            let yearList = [];
            //查询所有部门列表,第一个为主责部门
            let allDeptList = [];
            for (let i = 0; i < compBudgetList.length; i++) {
                if (!isInArray(yearList, compBudgetList[i].year)) {
                    yearList.push(compBudgetList[i].year);
                }
                if (!isInArray(allDeptList, compBudgetList[i].dept_name)) {
                    allDeptList.push(compBudgetList[i].dept_name);
                }
            }
            yearList = yearList.sort();

            let deptListRowSpan = {};
            // deptListRowSpan = { dept0:{  2016:{
            //                                     purchaseTypeList:['xxxx费用1'，‘xxxx费用2’],
            //                                     purchaseTotal:[25 ,78]  // （原金额，新金额）所有xxx（采购）费用之和
            //                                     operateTypeList:['zzzz费用1'，‘zzzz费用2’],
            //                                     operateTotal:[25 ,78]  // （原金额，新金额）所有zzz（运行）费用之和
            //                                     carryOutTypeList:['yyyy费用1'，‘yyyy费用2’]},
            //                                     carryOutTotal:[56 ,90]  // （原金额，新金额）所有yyy（实施）费用之和
            //                                     humanTotal:[52, 67]    // （原金额，新金额）的人工成本
            //                                  }
            //                             2017:{
            //                                     purchaseTypeList:['xxxx费用1'，‘xxxx费用2’],
            //                                     purchaseTotal:[30 ,46]  // （原金额，新金额）所有xxx费用之和
            //                                     operateTypeList:['zzzz费用1'，‘zzzz费用2’],
            //                                     operateTotal:[25 ,78]  // （原金额，新金额）所有zzz费用之和
            //                                     carryOutTypeList:['yyyy费用1'，‘yyyy费用2’]},
            //                                     carryOutTotal:[11 ,95]  // （原金额，新金额）所有yyy费用之和
            //                                  }
            //                    dept1:{ ...}
            for (let d1 = 0; d1 < allDeptList.length; d1++) {
                deptListRowSpan['dept' + d1.toString()] = {};
                for (let y1 = 0; y1 < yearList.length; y1++) {
                    //预计工时，直接成本，项目采购成本，项目运行成本，项目实施成本，项目人工成本默认存在
                    let purchaseTypeList = [];   //项目采购成本列表
                    let operateTypeList = [];    //项目运行成本列表
                    let carryOutTypeList = [];   //项目实施成本列表
                    let purchaseTotal = [];  //（原金额，新金额）所有xxx费用之和
                    let operateTotal = [];   //（原金额，新金额）所有zzz费用之和
                    let carryOutTotal = [];  //（原金额，新金额）所有yyy费用之和
                    let humanTotal = [];      // （原金额，新金额）的人工成本
                    let purchaseOldValue = 0;
                    let purchaseNewValue = 0;
                    let operateOldValue = 0;
                    let operateNewValue = 0;
                    let carryOutOldValue = 0;
                    let carryOutNewValue = 0;
                    let humanOldValue = 0;
                    let humanNewValue = 0;
                    for (let index1 = 0; index1 < compBudgetList.length; index1++) {
                        //先判断部门
                        if (allDeptList[d1] === compBudgetList[index1].dept_name) {
                            //判断年
                            if (yearList[y1] === compBudgetList[index1].year) {
                                //判断是不是属于直接成本中的采购成本或者实施成本，即fee_subtype = 0 或者 1
                                if (compBudgetList[index1].fee_type === '1') {
                                    //debugger;
                                    if (compBudgetList[index1].fee_subtype === '0') {
                                        //此处不用判断是否已经在列表
                                        purchaseTypeList.push(compBudgetList[index1].fee_name.trim());
                                        if ('old_fee' in compBudgetList[index1]) {
                                            purchaseOldValue += Number(compBudgetList[index1].old_fee);
                                        }
                                        if ('new_fee' in compBudgetList[index1]) {
                                            purchaseNewValue += Number(compBudgetList[index1].new_fee);
                                        }
                                    } else if (compBudgetList[index1].fee_subtype === '3') {
                                        operateTypeList.push(compBudgetList[index1].fee_name.trim());
                                        if ('old_fee' in compBudgetList[index1]) {
                                            operateOldValue += Number(compBudgetList[index1].old_fee);
                                        }
                                        if ('new_fee' in compBudgetList[index1]) {
                                            operateNewValue += Number(compBudgetList[index1].new_fee);
                                        }
                                    } else if (compBudgetList[index1].fee_subtype === '1') {
                                        carryOutTypeList.push(compBudgetList[index1].fee_name.trim());
                                        if ('old_fee' in compBudgetList[index1]) {
                                            carryOutOldValue += Number(compBudgetList[index1].old_fee);
                                        }
                                        if ('new_fee' in compBudgetList[index1]) {
                                            carryOutNewValue += Number(compBudgetList[index1].new_fee);
                                        }
                                    } else if (compBudgetList[index1].fee_subtype === '2') {
                                        if ('old_fee' in compBudgetList[index1]) {
                                            humanOldValue = Number(compBudgetList[index1].old_fee);
                                        } else {
                                            humanOldValue = 0;
                                        }
                                        if ('new_fee' in compBudgetList[index1]) {
                                            humanNewValue = Number(compBudgetList[index1].new_fee);
                                        } else {
                                            humanNewValue = 0;
                                        }
                                    }
                                }
                            }
                        }
                    } //end for
                    purchaseTotal.push(purchaseOldValue.toFixed(2), purchaseNewValue.toFixed(2));
                    operateTotal.push(operateOldValue.toFixed(2), operateNewValue.toFixed(2));
                    carryOutTotal.push(carryOutOldValue.toFixed(2), carryOutNewValue.toFixed(2));
                    humanTotal.push(humanOldValue.toFixed(2), humanNewValue.toFixed(2));
                    deptListRowSpan['dept' + d1.toString()][yearList[y1]] = {
                        purchaseTypeList: purchaseTypeList,
                        purchaseTotal: purchaseTotal,
                        operateTypeList: operateTypeList,
                        operateTotal: operateTotal,
                        carryOutTypeList: carryOutTypeList,
                        carryOutTotal: carryOutTotal,
                        humanTotal: humanTotal
                    };
                }
            }

            /*转换部门预算数据*/
            let compBudgetTableData = [];
            let allBudgetTotal = [0, 0];        //所有预算的总计初始化
            for (let d2 = 0; d2 < allDeptList.length; d2++) {
                let deptBudgetTotal = [0, 0];     //每个部门预算的合计初始化
                for (let y2 = 0; y2 < yearList.length; y2++) {
                    //先添加  预计工时     //有可能没有查到预计工时
                    let findPredict = false;
                    for (let index2 = 0; index2 < compBudgetList.length; index2++) {
                        //确定部门和年份
                        if (allDeptList[d2] === compBudgetList[index2].dept_name &&
                            compBudgetList[index2].year === yearList[y2] &&
                            compBudgetList[index2].fee_type === '0' &&
                            compBudgetList[index2].fee_subtype === '-1') {
                            findPredict = true;
                            //如果是被删除的，标记，页面加删除线
                            let feeIsDelete = false;
                            if (compBudgetList[index2].opt_flag && compBudgetList[index2].opt_flag === '3') {
                                feeIsDelete = true;
                            }
                            compBudgetTableData.push({
                                feeIsDelete: feeIsDelete,
                                deptName: allDeptList[d2],
                                year: yearList[y2],
                                feeType: config.PREDICT_TIME,
                                deptNamePadLeft: '0px',
                                kindOfFee: '0',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                                oldMoney: compBudgetList[index2].old_fee ? Number(compBudgetList[index2].old_fee).toFixed(1) : '0.0',
                                newMoney: compBudgetList[index2].new_fee ? Number(compBudgetList[index2].new_fee).toFixed(1) : '0.0',
                                isAdd: compBudgetList[index2].opt_flag==='1',// 如果费用项是新增且为0, 值true
                            });
                        }
                    }
                    if (findPredict === false) {
                        compBudgetTableData.push({
                            deptName: allDeptList[d2],
                            year: yearList[y2],
                            feeType: config.PREDICT_TIME,
                            deptNamePadLeft: '0px',
                            kindOfFee: '0',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                            oldMoney: '0.0',
                            newMoney: '0.0',
                        });
                    }
                    //添加 2 直接成本
                    let oldTotal = Number(deptListRowSpan['dept' + d2.toString()][yearList[y2]].purchaseTotal[0]) +
                        Number(deptListRowSpan['dept' + d2.toString()][yearList[y2]].operateTotal[0]) +
                        Number(deptListRowSpan['dept' + d2.toString()][yearList[y2]].carryOutTotal[0]) +
                        Number(deptListRowSpan['dept' + d2.toString()][yearList[y2]].humanTotal[0]);
                    let newTotal = Number(deptListRowSpan['dept' + d2.toString()][yearList[y2]].purchaseTotal[1]) +
                        Number(deptListRowSpan['dept' + d2.toString()][yearList[y2]].operateTotal[1]) +
                        Number(deptListRowSpan['dept' + d2.toString()][yearList[y2]].carryOutTotal[1]) +
                        Number(deptListRowSpan['dept' + d2.toString()][yearList[y2]].humanTotal[1]);
                    compBudgetTableData.push({
                        deptName: allDeptList[d2],
                        year: yearList[y2],
                        feeType: config.DIRECT_COST,
                        deptNamePadLeft: '0px',
                        kindOfFee: '1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                        oldMoney: oldTotal.toFixed(2),
                        newMoney: newTotal.toFixed(2)
                    });
                    //添加 2.1 采购成本
                    compBudgetTableData.push({
                        deptName: allDeptList[d2],
                        year: yearList[y2],
                        feeType: config.PURCHASE_COST,
                        deptNamePadLeft: '10px',
                        kindOfFee: '1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                        oldMoney: deptListRowSpan['dept' + d2.toString()][yearList[y2]].purchaseTotal[0],
                        newMoney: deptListRowSpan['dept' + d2.toString()][yearList[y2]].purchaseTotal[1],
                    });
                    //添加 2.1. 采购成本  子费用
                    let secondIndex = 1;
                    for (let index3 = 0; index3 < compBudgetList.length; index3++) {
                        //确定部门和年份
                        if (allDeptList[d2] === compBudgetList[index3].dept_name &&
                            compBudgetList[index3].year === yearList[y2] &&
                            compBudgetList[index3].fee_type === '1' &&
                            compBudgetList[index3].fee_subtype === '0') {
                            //如果是被删除的，标记，页面加删除线
                            let feeIsDelete = false;
                            if (compBudgetList[index3].opt_flag && compBudgetList[index3].opt_flag === '3') {
                                feeIsDelete = true;
                            }
                            compBudgetTableData.push({
                                feeIsDelete: feeIsDelete,
                                deptName: allDeptList[d2],
                                year: yearList[y2],
                                feeType: '2.1.' + secondIndex.toString() + compBudgetList[index3].fee_name,
                                deptNamePadLeft: '30px',
                                kindOfFee: '1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                                oldMoney: compBudgetList[index3].old_fee ? Number(compBudgetList[index3].old_fee).toFixed(2) : '0.00',
                                newMoney: compBudgetList[index3].new_fee ? Number(compBudgetList[index3].new_fee).toFixed(2) : '0.00',
                                isAdd: compBudgetList[index3].opt_flag==='1',// 如果费用项是新增且为0, 值true
                            });
                            secondIndex++;
                        }
                    }

                    //添加 2.2 运行成本
                    compBudgetTableData.push({
                        deptName: allDeptList[d2],
                        year: yearList[y2],
                        feeType: config.OPERATE_COST,
                        deptNamePadLeft: '10px',
                        kindOfFee: '1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                        oldMoney: deptListRowSpan['dept' + d2.toString()][yearList[y2]].operateTotal[0],
                        newMoney: deptListRowSpan['dept' + d2.toString()][yearList[y2]].operateTotal[1],
                    });

                    //添加 2.2. 运行成本  子费用
                    let secondIndex22 = 1;
                    for (let index44 = 0; index44 < compBudgetList.length; index44++) {
                        //确定部门和年份
                        if (allDeptList[d2] === compBudgetList[index44].dept_name &&
                            compBudgetList[index44].year === yearList[y2] &&
                            compBudgetList[index44].fee_type === '1' &&
                            compBudgetList[index44].fee_subtype === '3') {
                            //如果是被删除的，标记，页面加删除线
                            let feeIsDelete = false;
                            if (compBudgetList[index44].opt_flag && compBudgetList[index44].opt_flag === '3') {
                                feeIsDelete = true;
                            }
                            compBudgetTableData.push({
                                feeIsDelete: feeIsDelete,
                                deptName: allDeptList[d2],
                                year: yearList[y2],
                                feeType: '2.2.' + secondIndex22.toString() + compBudgetList[index44].fee_name,
                                deptNamePadLeft: '30px',
                                kindOfFee: '1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                                oldMoney: compBudgetList[index44].old_fee ? Number(compBudgetList[index44].old_fee).toFixed(2) : '0.00',
                                newMoney: compBudgetList[index44].new_fee ? Number(compBudgetList[index44].new_fee).toFixed(2) : '0.00',
                                isAdd: compBudgetList[index44].opt_flag==='1',// 如果费用项是新增且为0, 值true
                            });
                            secondIndex22++;
                        }
                    }


                    //添加 2.3 实施成本
                    compBudgetTableData.push({
                        deptName: allDeptList[d2],
                        year: yearList[y2],
                        feeType: config.CARRYOUT_COST,
                        deptNamePadLeft: '10px',
                        kindOfFee: '1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                        oldMoney: deptListRowSpan['dept' + d2.toString()][yearList[y2]].carryOutTotal[0],
                        newMoney: deptListRowSpan['dept' + d2.toString()][yearList[y2]].carryOutTotal[1],
                    });

                    //添加 2.3. 实施成本  子费用
                    let secondIndex2 = 1;
                    for (let index4 = 0; index4 < compBudgetList.length; index4++) {
                        //确定部门和年份
                        if (allDeptList[d2] === compBudgetList[index4].dept_name &&
                            compBudgetList[index4].year === yearList[y2] &&
                            compBudgetList[index4].fee_type === '1' &&
                            compBudgetList[index4].fee_subtype === '1') {
                            //如果是被删除的，标记，页面加删除线
                            let feeIsDelete = false;
                            if (compBudgetList[index4].opt_flag && compBudgetList[index4].opt_flag === '3') {
                                feeIsDelete = true;
                            }
                            compBudgetTableData.push({
                                feeIsDelete: feeIsDelete,
                                deptName: allDeptList[d2],
                                year: yearList[y2],
                                feeType: '2.3.' + secondIndex2.toString() + compBudgetList[index4].fee_name,
                                deptNamePadLeft: '30px',
                                kindOfFee: '1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                                oldMoney: compBudgetList[index4].old_fee ? Number(compBudgetList[index4].old_fee).toFixed(2) : '0.00',
                                newMoney: compBudgetList[index4].new_fee ? Number(compBudgetList[index4].new_fee).toFixed(2) : '0.00',
                                isAdd: compBudgetList[index4].opt_flag==='1',// 如果费用项是新增且为0, 值true
                            });
                            secondIndex2++;
                        }
                    }
                    //添加 2.4  人工成本
                    //如果是被删除的，标记，页面加删除线
                    let feeIsDelete = false;
                    let isAdd = false;
                    for (let index5 = 0; index5 < compBudgetList.length; index5++) {
                        //确定部门和年份
                        if (allDeptList[d2] === compBudgetList[index5].dept_name &&
                            compBudgetList[index5].year === yearList[y2] &&
                            compBudgetList[index5].fee_type === '1' &&
                            compBudgetList[index5].fee_subtype === '2') {
                            isAdd = compBudgetList[index5].opt_flag === '1'
                            if (compBudgetList[index5].opt_flag && compBudgetList[index5].opt_flag === '3') {
                                feeIsDelete = true;
                            }
                        }
                    }
                    compBudgetTableData.push({
                        feeIsDelete: feeIsDelete,
                        deptName: allDeptList[d2],
                        year: yearList[y2],
                        feeType: config.HUMAN_COST,
                        deptNamePadLeft: '10px',
                        kindOfFee: '1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                        oldMoney: deptListRowSpan['dept' + d2.toString()][yearList[y2]].humanTotal[0],
                        newMoney: deptListRowSpan['dept' + d2.toString()][yearList[y2]].humanTotal[1],
                        isAdd: isAdd,
                    });

                    //加总部门的每年合计
                    deptBudgetTotal[0] += oldTotal;
                    deptBudgetTotal[1] += newTotal;
                    allBudgetTotal[0] += oldTotal;
                    allBudgetTotal[1] += newTotal;

                }

                //添加完年份数据后，需要加部门的   合计
                compBudgetTableData.push({
                    deptName: allDeptList[d2],
                    year: '合计',
                    feeType: '',
                    deptNamePadLeft: '0px',
                    kindOfFee: '1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                    oldMoney: deptBudgetTotal[0].toFixed(2),
                    newMoney: deptBudgetTotal[1].toFixed(2),
                });
            }
            //所有预算处理完后，添加所有预算总计
            compBudgetTableData.push({
                deptName: '总计',
                year: '',
                feeType: '',
                deptNamePadLeft: '0px',
                kindOfFee: '1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                oldMoney: allBudgetTotal[0].toFixed(2),
                newMoney: allBudgetTotal[1].toFixed(2),
            });

            //compBudgetTableData.map((item,index)=>{item.key = index;return item});
            for (let indexc = 0; indexc < compBudgetTableData.length; indexc++) {
                compBudgetTableData[indexc].key = indexc;
            }
            /*表格单元格合并,由于有些数据是拼出来的，所以需要手工合并*/
            let indexTable = [];  //表格合并时，长度索引表
            /*
            * indexTable = [ { deptName:xxxx,
            *                  height:5,
            *                  children: [  {year:2017,
            *                                height:6
            *                               },
            *                               {year:2018,
            *                                height:5
            *                                }
            *                 },
            *                 {...}
            * */
            let deptInfo = {};
            deptInfo.deptName = compBudgetTableData[0].deptName;
            deptInfo.height = 1;
            deptInfo.children = [];
            deptInfo.children.push({year: compBudgetTableData[0].year, height: 1});

            //indexTable.push(deptInfo);
            compBudgetTableData[0].deptNameChange = true;
            compBudgetTableData[0].yearChange = true;

            for (let i = 1; i < compBudgetTableData.length; i++) {
                if (compBudgetTableData[i].deptName === compBudgetTableData[i - 1].deptName) {
                    compBudgetTableData[i].deptNameChange = false;
                    //部门与上一个相等了，部门包含的信息条数加1
                    deptInfo.height++;
                    if (compBudgetTableData[i].year === compBudgetTableData[i - 1].year) {
                        compBudgetTableData[i].yearChange = false;
                        //部门相同的情况下，如果年份相同，将年份列表末尾元素的信息条数加1
                        deptInfo.children[deptInfo.children.length - 1].height++;
                    } else {
                        compBudgetTableData[i].yearChange = true;
                        //如果年份不同，添加到children里面，长度设置为1
                        deptInfo.children.push({year: compBudgetTableData[i].year, height: 1});
                    }
                    //如果到了末尾，将正在处理的部门信息push到索引表
                    if (i === compBudgetTableData.length - 1) {
                        indexTable.push(deptInfo);
                    }
                } else {
                    compBudgetTableData[i].deptNameChange = true;
                    compBudgetTableData[i].yearChange = true;
                    //如果部门不相同，代表新的部门开始，将上一个部门信息push到索引表
                    indexTable.push(deptInfo);
                    //初始化一个新的部门信息
                    deptInfo = {};
                    deptInfo.deptName = compBudgetTableData[i].deptName;
                    deptInfo.height = 1;
                    deptInfo.children = [];
                    deptInfo.children.push({year: compBudgetTableData[i].year, height: 1});
                    //如果到了末尾，将正在处理的部门信息push到索引表
                    if (i === compBudgetTableData.length - 1) {
                        indexTable.push(deptInfo);
                    }
                }
            }

            //tableDatalist[0].rowSpan = indexTable[0].height;
            let deptNameIndex = 0;
            let yearIndex = 0;
            for (let i = 0; i < compBudgetTableData.length; i++) {
                if (compBudgetTableData[i].deptNameChange === true) {
                    //如果部门发生变化
                    compBudgetTableData[i].deptRowSpan = indexTable[deptNameIndex].height;
                    yearIndex = 0;
                    compBudgetTableData[i].yearRowSpan = indexTable[deptNameIndex].children[yearIndex].height;
                    deptNameIndex++;
                } else {
                    //如果部门没有发生变化
                    compBudgetTableData[i].deptRowSpan = 0;
                    if (compBudgetTableData[i].yearChange === true) {
                        //如果年份发生了变化
                        //debugger;
                        yearIndex++;
                        compBudgetTableData[i].yearRowSpan = indexTable[deptNameIndex - 1].children[yearIndex].height;
                    } else {
                        //如果年份没有变化
                        compBudgetTableData[i].yearRowSpan = 0;
                    }
                }
            }
            yield put({
                type: 'save',
                payload: {
                    compBudgetTableData: compBudgetTableData
                }
            });

        },

        /**
         * 用于子tab的切换
         * @param call
         * @param put
         * @param select
         * @returns {IterableIterator<*>}
         */
        * childTabChangeClick({key}, {call, put, select}) {
            const {isShowTabINFullCost, tabListArr} = yield select(state => state.projChangeCheck)

            yield put({
                type: 'clearPageCache',
            });

            yield put({
                type: 'save',
                payload: {
                    squareTabKey: key,
                },
            });

            // 点击tab切换时，将查询出的数据全部置空
            /* yield put({
               type: 'save',
               payload: {
                 coorpDeptCompList: [],   // 配合部门
                 compBudgetTableData: [], // 预算数据
               }
             });*/

            // 取出当前子tab的参数
            if (isShowTabINFullCost === '1') {  // 有子tab
                let tabItem = tabListArr.filter(item => item.tab_name === key)[0];
                if (tabItem.tab_flag_change === '1') {
                    // 发生变化，走变化的服务
                    yield put({
                        type: 'projCheckFullcost'
                    })
                } else {
                    yield put({
                        type: 'notChangeFullcost'
                    })
                }
            } else {
                if (tabListArr[0].tab_flag_change === '1') { //不显示tab的情况默认只有一个 团队预算
                    yield put({
                        type: 'projCheckFullcost'
                    })
                } else {
                    yield put({
                        type: 'notChangeFullcost'
                    })
                }
            }
        },


        /**
         * 清空页面的滞留数据，解决数据变化在前端显示问题
         * @param put
         * @param select
         * @returns {IterableIterator<*>}
         */
        * clearPageCache({}, {put, select}) {
            yield put({
                type: 'save',
                payload: {
                    coorpDeptCompList: [],  // 变化的
                    compBudgetTableData: [],  //
                    coorpDeptList: [], // 无变化的
                    deptBudgetTableData: [],
                },
            });
        },


        /**
         * 在查询全成本之前查询子tab,第一次默认第一项，用地意向的参数进项查询
         * @param call
         * @param put
         * @param select
         * @returns {IterableIterator<*>}
         */
        * beforeProjCheckFullcost({}, {call, put, select}) {
            const {projId, lastCheckId, t3} = yield select(state => state.projChangeCheck);
            let postData = {
                arg_proj_id: projId,
                arg_check_id: lastCheckId,
                arg_query_flag: t3 === '1' ? '0' : '1', // 0 默认对比， 1非对比
            }

            let data = yield call(projServices.queryCheckFullCostTab, postData)
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        tabListArr: data.DataRows,
                        squareTabKey: data.DataRows[0].tab_name,
                        isShowTabINFullCost: data.isShowTab,
                    }
                })
            }
            // 第一次默认团队预算
            if (data.DataRows[0].tab_flag_change === '1') {
                yield put({
                    type: 'projCheckFullcost'
                })
            } else {
                yield put({
                    type: 'notChangeFullcost'
                })
            }


        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-24
         * 功能：变更项目审核时查询未变化的全成本 非对比的数据
         */
        * notChangeFullcost({}, {call, put, select}) {
            const {
                projId, lastCheckId,
                isShowTabINFullCost, tabListArr, squareTabKey
            } = yield select(state => state.projChangeCheck);
            //查询配合部门列表
            let coorpDeptPostData = {
                arg_proj_id: projId,
                arg_check_id: lastCheckId,
                arg_query_flag: '1'
            };

            // 取出当前子tab的参数
            if (isShowTabINFullCost === '1') {  // 有子tab
                let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
                coorpDeptPostData.arg_tab_flag = tabItem.tab_flag;
                if (tabItem.tab_flag === '1') {
                    coorpDeptPostData.arg_pms_code = tabItem.pms_code;
                }
            }

            const coorpDeptData = yield call(projServices.queryCheckFullCostDept, coorpDeptPostData);
            if (coorpDeptData.RetCode === '1') {
                coorpDeptData.DataRows.map((i, index) => {
                    if ('mgr_name' in i) {
                        i.key = index;           //为没一条记录添加一个 key
                    } else {
                        i.key = index;
                        i.mgr_name = '';       //配合部门没有字段时，设置为空
                    }
                    return i;
                });
            }

            //查询所有部门列表,第一个为主责部门
            let allDeptPostData = {
                arg_proj_id: projId,
                arg_check_id: lastCheckId,
                arg_query_flag: '1'
            };

            // 取出当前子tab的参数
            if (isShowTabINFullCost === '1') {  // 有子tab
                let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
                allDeptPostData.arg_tab_flag = tabItem.tab_flag;
                if (tabItem.tab_flag === '1') {
                    allDeptPostData.arg_pms_code = tabItem.pms_code;
                }
            }

            const allDeptData = yield call(projServices.queryCheckFullCostAllDept, allDeptPostData);
            //const allDeptData = yield call(projServices.queryAllDept,{arg_proj_id:queryData.arg_proj_id});
            //查询每个部门的预算
            let budgetPostData = {
                arg_proj_id: projId,
                arg_check_id: lastCheckId,
                arg_query_flag: '1'
            };

            // 取出当前子tab的参数
            if (isShowTabINFullCost === '1') {  // 有子tab
                let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
                budgetPostData.arg_tab_flag = tabItem.tab_flag;
                if (tabItem.tab_flag === '1') {
                    budgetPostData.arg_pms_code = tabItem.pms_code;
                }
            }
            const deptBudgetData = yield call(projServices.queryCheckFullCostBudget, budgetPostData);
            //const deptBudgetData = yield call(projServices.querydeptBudgetData,{arg_proj_id:queryData.arg_proj_id});

            yield put({
                type: 'save',
                payload: {
                    coorpDeptList: coorpDeptData.DataRows,
                    allDeptList: allDeptData.DataRows
                }
            });
            let allDeptList = allDeptData.DataRows;
            let deptBudgetList = deptBudgetData.DataRows;
            //确定返回的预算中的年份
            let yearList = [];
            for (let i = 0; i < deptBudgetData.DataRows.length; i++) {
                if (!isInArray(yearList, deptBudgetData.DataRows[i].year)) {
                    yearList.push(deptBudgetData.DataRows[i].year);
                }
            }
            /*计算可添加的年份*/
            let fullCostYearList = [];
            //年的索引，先从开始时间的年份开始算起
            let yearIndex = parseInt(allDeptData.begin_time.split('-')[0]);
            //将结束时间作为结束标志
            let yearEndTagIndex = parseInt(allDeptData.end_time.split('-')[0]);
            //如果年份索引不超过开始年份，进行添加
            while (yearIndex <= yearEndTagIndex) {
                fullCostYearList.push(yearIndex.toString());
                yearIndex++;
            }

            yearList = yearList.sort();   //年份需要排序
            //计算所有工时之和
            let predictTimeTotal = 0;
            for (let indexp = 0; indexp < deptBudgetList.length; indexp++) {
                if (deptBudgetList[indexp].fee_type === '0' && deptBudgetList[indexp].fee_subtype === '-1') {
                    predictTimeTotal += Number(deptBudgetList[indexp].fee);
                }
            }
            yield put({
                type: 'save',
                payload: {predictTimeTotal: predictTimeTotal.toFixed(1)}
            });
            //查询每一个年份下的费用类型个数，首先要确定三级目录的个数
            let yearListRowSpan = {};
            //yearListRowSpan = {2016:{yearRowSpan:x,
            //                         purchaseCostList:['xxxx费用1'，‘xxxx费用2’],
            //                         purchaseDeptTotal:[12,35]  //每个部门的所有xxxx(采购)费用之和
            //                         operateCostList:['zzz费用1'，‘zzzz费用2’]，
            //                         operateDeptTotal:[78,10]   //每个部门的所有zzzz（运行）费用之和
            //                         carryOutCostList:['yyyy费用1'，‘yyyy费用2’]},
            //                         carryOutDeptTotal:[38,68]  //每个部门的所有yyyy（实施）费用之和
            //                         humanCostTotal:[12,67]         // 每个部门的人工成本
            //                   2017:{yearRowSpan:x,
            //                         purchaseCostList:['xxxx费用1'，‘xxxx费用2’],
            //                         purchaseDeptTotal:[12,35]  //每个部门的所有xxxx费用之和
            //                         operateCostList:['zzz费用1'，‘zzzz费用2’]，
            //                         operateDeptTotal:[78,10]   //每个部门的所有zzzz（运行）费用之和
            //                         carryOutCostList:['yyyy费用1'，‘yyyy费用2’]},
            //                         carryOutDeptTotal:[38,68]  //每个部门的所有yyyy费用之和
            //                         humanCostTotal:[12,67]         // 每个部门的人工成本
            //                  }

            if (yearList.length) {
                //计算年份的rowspan
                for (let yearIndex = 0; yearIndex < yearList.length; yearIndex++) {
                    //预计工时，直接成本，项目采购成本，项目运行成本，项目实施成本，项目人工成本默认存在，yearRowSpan 默认加 6
                    let yearRowSpan = 0;
                    let purchaseCostList = [];   //项目采购成本列表
                    let operateCostList = [];    //项目运行成本列表
                    let carryOutCostList = [];   //项目实施成本列表
                    for (let cellDataIndex1 = 0; cellDataIndex1 < deptBudgetList.length; cellDataIndex1++) {
                        //先判断年
                        if (yearList[yearIndex] === deptBudgetList[cellDataIndex1].year) {
                            //判断是否为直接成本，即fee_type = 1
                            if (deptBudgetList[cellDataIndex1].fee_type === '1') {
                                //判断是不是属于直接成本中的采购成本、运行成本或者实施成本，即fee_subtype = 0 ，3 或者 1
                                if (deptBudgetList[cellDataIndex1].fee_subtype === '0') {
                                    //如果不在列表里面才添加
                                    if (!isInArray(purchaseCostList, deptBudgetList[cellDataIndex1].fee_name.trim())) {
                                        purchaseCostList.push(deptBudgetList[cellDataIndex1].fee_name.trim());
                                    }
                                } else if (deptBudgetList[cellDataIndex1].fee_subtype === '3') {
                                    if (!isInArray(operateCostList, deptBudgetList[cellDataIndex1].fee_name.trim())) {
                                        operateCostList.push(deptBudgetList[cellDataIndex1].fee_name.trim());
                                    }
                                } else if (deptBudgetList[cellDataIndex1].fee_subtype === '1') {
                                    if (!isInArray(carryOutCostList, deptBudgetList[cellDataIndex1].fee_name.trim())) {
                                        carryOutCostList.push(deptBudgetList[cellDataIndex1].fee_name.trim());
                                    }
                                }
                            }
                        }
                    } //end for
                    let purchaseDeptTotal = [];  //每个部门的所有xxxx费用之和的列表
                    let operateDeptTotal = [];   //每个部门的所有zzzz费用之和的列表
                    let carryOutDeptTotal = [];  //每个部门的所有yyyy费用之和的列表
                    let humanCostTotal = [];          //项目人工成本列表（每个部门）
                    for (let deptIndexx = 0; deptIndexx < allDeptList.length; deptIndexx++) {
                        let purchaseDeptValue = 0;
                        let operateDeptValue = 0;
                        let carryOutDeptValue = 0;
                        let humanCostValue = 0;
                        for (let cellDataIndexx = 0; cellDataIndexx < deptBudgetList.length; cellDataIndexx++) {
                            //首先判断单元格中的年份
                            if (yearList[yearIndex] === deptBudgetList[cellDataIndexx].year &&
                                allDeptList[deptIndexx].dept_name === deptBudgetList[cellDataIndexx].dept_name) {
                                //判断是否为直接成本，即fee_type = 1
                                if (deptBudgetList[cellDataIndexx].fee_type === '1') {
                                    if (deptBudgetList[cellDataIndexx].fee_subtype === '0') {
                                        //判断是不是属于直接成本中的采购成本，即fee_subtype = 0
                                        purchaseDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '3') {
                                        //判断是不是属于直接成本中的运行成本，即fee_subtype = 3
                                        operateDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '1') {
                                        //判断是不是属于直接成本中的实施成本，即fee_subtype = 1
                                        carryOutDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '2') {
                                        //判断是不是属于直接成本中的人工成本，即fee_subtype =2
                                        humanCostValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    }
                                }
                            }
                        }
                        purchaseDeptTotal.push(purchaseDeptValue.toFixed(2));
                        operateDeptTotal.push(operateDeptValue.toFixed(2));
                        carryOutDeptTotal.push(carryOutDeptValue.toFixed(2));
                        humanCostTotal.push(humanCostValue.toFixed(2));
                    }
                    yearRowSpan = purchaseCostList.length + operateCostList.length + carryOutCostList.length + 6;
                    yearListRowSpan[yearList[yearIndex]] = {
                        yearRowSpan: yearRowSpan,
                        purchaseCostList: purchaseCostList,
                        purchaseDeptTotal: purchaseDeptTotal,
                        operateCostList: operateCostList,
                        operateDeptTotal: operateDeptTotal,
                        carryOutCostList: carryOutCostList,
                        carryOutDeptTotal: carryOutDeptTotal,
                        humanCostTotal: humanCostTotal
                    };
                }//end for year
            }

            /*将返回的预算数据转变成表格数据
            * */
            let deptBudgetTableData = [];
            let obj = {};
            let allTableTotal = 0;
            if (yearList.length) {
                for (let yearIndex2 = 0; yearIndex2 < yearList.length; yearIndex2++) {
                    obj = {};
                    //每一年的每一个费用项，要添加所有部门的数据
                    //1.添加预计工时 fee_type =0 , fee_subtype = -1
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = yearListRowSpan[yearList[yearIndex2]].yearRowSpan;
                    obj.fee_name = config.PREDICT_TIME;
                    obj.padLeft = '0px';
                    obj.feeType = '0';         //  0 代表预计工时，1 代表 预算
                    let predictTime = 0;
                    for (let i = 0; i < allDeptList.length; i++) {
                        let findPredictTime = false;
                        for (let cellDataIndex2 = 0; cellDataIndex2 < deptBudgetList.length; cellDataIndex2++) {
                            //年相同就添加一条数据
                            if (yearList[yearIndex2] === deptBudgetList[cellDataIndex2].year) {
                                if (deptBudgetList[cellDataIndex2].fee_type === '0' &&
                                    deptBudgetList[cellDataIndex2].fee_subtype === '-1') {
                                    if (allDeptList[i].dept_name === deptBudgetList[cellDataIndex2].dept_name) {
                                        obj['dept' + i.toString()] = Number(deptBudgetList[cellDataIndex2].fee).toFixed(1);
                                        predictTime += Number(deptBudgetList[cellDataIndex2].fee);
                                        findPredictTime = true;
                                        break;
                                    }
                                }
                            }
                        }//end for
                        //如果没有这种类型的数据，数据源加一条
                        if (findPredictTime === false) {
                            //如果查询出来的没有预计工时，则新增0
                            obj['dept' + i.toString()] = '0.0';
                        }
                    }//end for
                    obj.total = predictTime.toFixed(1);
                    deptBudgetTableData.push(obj);
                    //添加预计工时end

                    //2.添加直接成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.DIRECT_COST;
                    obj.padLeft = '0px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let directCostTotal = 0;
                    for (let j = 0; j < allDeptList.length; j++) {
                        let directCost = Number(yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].humanCostTotal[j]);
                        directCostTotal += directCost;
                        obj['dept' + j.toString()] = directCost.toFixed(2);
                    }//end for
                    obj.total = directCostTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.1添加项目采购成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.PURCHASE_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let purchaseAllTotal = 0;
                    for (let k = 0; k < allDeptList.length; k++) {
                        obj['dept' + k.toString()] = yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[k];
                        purchaseAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[k]);
                    }//end for
                    obj.total = purchaseAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.1. 添加项目采购成本-子费用
                    let purchaseCostTypeList = yearListRowSpan[yearList[yearIndex2]].purchaseCostList;
                    for (let purchaseIndex = 0; purchaseIndex < purchaseCostTypeList.length; purchaseIndex++) {
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.1.' + (purchaseIndex + 1).toString() + purchaseCostTypeList[purchaseIndex];
                        obj.no_pre_fee_name = purchaseCostTypeList[purchaseIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        let purchaseTotal = 0;
                        for (let p = 0; p < allDeptList.length; p++) {
                            let findPurchase = false;
                            for (let cellDataIndex3 = 0; cellDataIndex3 < deptBudgetList.length; cellDataIndex3++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex3].year &&
                                    purchaseCostTypeList[purchaseIndex].trim() === deptBudgetList[cellDataIndex3].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex3].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex3].fee_subtype === '0') {
                                        if (allDeptList[p].dept_name === deptBudgetList[cellDataIndex3].dept_name) {
                                            obj['dept' + p.toString()] = Number(deptBudgetList[cellDataIndex3].fee).toFixed(2);
                                            purchaseTotal += Number(deptBudgetList[cellDataIndex3].fee);
                                            findPurchase = true;
                                            break;
                                        }
                                    }
                                }
                            }//end for
                            if (findPurchase === false) {
                                obj['dept' + p.toString()] = '0.00';
                            }
                        }//end for
                        obj.total = purchaseTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }

                    //2.2添加项目运行成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.OPERATE_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let operateAllTotal = 0;
                    for (let ii = 0; ii < allDeptList.length; ii++) {
                        obj['dept' + ii.toString()] = yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[ii];
                        operateAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[ii]);
                    }//end for
                    obj.total = operateAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.2. 添加项目运行成本-子费用
                    let operateCostTypeList = yearListRowSpan[yearList[yearIndex2]].operateCostList;
                    for (let operateIndex = 0; operateIndex < operateCostTypeList.length; operateIndex++) {
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.2.' + (operateIndex + 1).toString() + operateCostTypeList[operateIndex];
                        obj.no_pre_fee_name = operateCostTypeList[operateIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        let operateTotal = 0;
                        for (let jj = 0; jj < allDeptList.length; jj++) {
                            let findOperate = false;
                            for (let cellDataIndex44 = 0; cellDataIndex44 < deptBudgetList.length; cellDataIndex44++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex44].year &&
                                    operateCostTypeList[operateIndex] === deptBudgetList[cellDataIndex44].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex44].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex44].fee_subtype === '3') {
                                        if (allDeptList[jj].dept_name === deptBudgetList[cellDataIndex44].dept_name) {
                                            obj['dept' + jj.toString()] = Number(deptBudgetList[cellDataIndex44].fee).toFixed(2);
                                            operateTotal += Number(deptBudgetList[cellDataIndex44].fee);
                                            findOperate = true;
                                            break;
                                        }
                                    }
                                }
                            }//end for
                            if (findOperate === false) {
                                obj['dept' + jj.toString()] = '0.00';
                            }
                        }//end for
                        obj.total = operateTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }


                    //2.3添加项目实施成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.CARRYOUT_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let carryOutAllTotal = 0;
                    for (let ii = 0; ii < allDeptList.length; ii++) {
                        obj['dept' + ii.toString()] = yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii];
                        carryOutAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii]);
                    }//end for
                    obj.total = carryOutAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.3. 添加项目采购成本-子费用
                    let carryOutCostTypeList = yearListRowSpan[yearList[yearIndex2]].carryOutCostList;
                    for (let carryOutIndex = 0; carryOutIndex < carryOutCostTypeList.length; carryOutIndex++) {
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.3.' + (carryOutIndex + 1).toString() + carryOutCostTypeList[carryOutIndex];
                        obj.no_pre_fee_name = carryOutCostTypeList[carryOutIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        let carryOutTotal = 0;
                        for (let jj = 0; jj < allDeptList.length; jj++) {
                            let findCarryOut = false;
                            for (let cellDataIndex4 = 0; cellDataIndex4 < deptBudgetList.length; cellDataIndex4++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex4].year &&
                                    carryOutCostTypeList[carryOutIndex] === deptBudgetList[cellDataIndex4].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex4].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex4].fee_subtype === '1') {
                                        if (allDeptList[jj].dept_name === deptBudgetList[cellDataIndex4].dept_name) {
                                            obj['dept' + jj.toString()] = Number(deptBudgetList[cellDataIndex4].fee).toFixed(2);
                                            carryOutTotal += Number(deptBudgetList[cellDataIndex4].fee);
                                            findCarryOut = true;
                                            break;
                                        }
                                    }
                                }
                            }//end for
                            if (findCarryOut === false) {
                                obj['dept' + jj.toString()] = '0.00';
                            }
                        }//end for
                        obj.total = carryOutTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }

                    //2.4添加项目人工成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.HUMAN_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let humanCostTotal = 0;
                    for (let b = 0; b < allDeptList.length; b++) {
                        let findHumanCost = false;
                        for (let cellDataIndex5 = 0; cellDataIndex5 < deptBudgetList.length; cellDataIndex5++) {
                            if (yearList[yearIndex2] === deptBudgetList[cellDataIndex5].year) {
                                if (deptBudgetList[cellDataIndex5].fee_type === '1' &&
                                    deptBudgetList[cellDataIndex5].fee_subtype === '2') {
                                    if (allDeptList[b].dept_name === deptBudgetList[cellDataIndex5].dept_name) {
                                        obj['dept' + b.toString()] = Number(deptBudgetList[cellDataIndex5].fee).toFixed(2);
                                        humanCostTotal += Number(deptBudgetList[cellDataIndex5].fee);
                                        findHumanCost = true;
                                        break;
                                    }
                                }
                            }
                        }//end for
                        if (findHumanCost === false) {
                            obj['dept' + b.toString()] = '0.00';
                        }
                    }//end for
                    obj.total = humanCostTotal.toFixed(2);
                    deptBudgetTableData.push(obj);
                }//end for year

                //添加最后一行总计
                obj = {};
                obj.year = config.COST_ALL_TOTAL;
                obj.yearRowSpan = 1;
                obj.fee_name = '';
                obj.padLeft = '0px';
                obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                obj.yearOptType = 'total';
                for (let de = 0; de < allDeptList.length; de++) {
                    let allYearTotal = 0;
                    for (let yi = 0; yi < yearList.length; yi++) {
                        allYearTotal += Number(yearListRowSpan[yearList[yi]].purchaseDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].operateDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].carryOutDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].humanCostTotal[de]);
                    }
                    obj['dept' + de.toString()] = allYearTotal.toFixed(2);
                    allTableTotal += allYearTotal;
                }//end for
                obj.total = allTableTotal.toFixed(2);
                deptBudgetTableData.push(obj);
            }
            //deptBudgetTableData.map((i,index)=>{ i.key=index;return i});
            for (let indexd = 0; indexd < deptBudgetTableData.length; indexd++) {
                deptBudgetTableData[indexd].key = indexd;
            }

            yield put({
                type: 'save',
                payload: {
                    deptBudgetTableData: deptBudgetTableData
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-24
         * 功能：变更项目审核时终止流程
         * @param payload 请求数据
         */
        * terminate({payload}, {call, put}) {
            const data = yield call(projServices.projTerminate, payload);
            if (data.RetCode === '1') {
                message.success('终止流程成功');
                yield put(routerRedux.push({pathname: '/taskList'}));
            }
        },

    },
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname.indexOf('/projChangeCheck') !== -1) {
                    dispatch({type: 'projChangeIsCheck', payload: query});
                    /* dispatch({type: 'initData'});
                     dispatch({type: 'projChangeCheckTitle', payload: query});
                     dispatch({type: 'projCheckBasicInfo', payload: query});
                     dispatch({type: 'notChangeBasicInfo', payload: query});
                     dispatch({type: 'projChangeCheckLog', payload: query});*/
                }
            });
        }
    }
}
