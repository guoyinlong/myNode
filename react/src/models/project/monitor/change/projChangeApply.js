/**
 * 作者：邓广晖
 * 创建日期：2017-11-6
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目变更的申请时数据
 */
import * as projServices from '../../../../services/project/projService';
import config from '../../../../utils/config';
import Cookie from 'js-cookie';
import {message} from 'antd';
import moment from 'moment';
import {routerRedux} from 'dva/router';
import {getOuBussinessId, isInArray} from '../../../../routes/project/projConst.js';
import {argtenantid, getUuid} from '../../../../components/commonApp/commonAppConst.js';

/**
 * 作者：邓广晖
 * 创建日期：2017-11-24
 * 功能：改变OU值，主要是将 联通软件研究院  改为  联通软件研究院本部
 * @param name ou名
 */
function changeOuName(name) {
    return name === config.OU_NAME_CN ? config.OU_HQ_NAME_CN : name;
}


export default {
    namespace: 'projChangeApply',
    state: {
        currentTabKey: 't1',
        queryData: {},
        changeReason: '',

        /*全成本的子tab列表*/
        isShowTabINFullCost: '0',// 默认无子tab
        tabListArr: [], // 默认子数组为空
        squareTabKey: '',   // 默认的全成本tapkey
        deptModalShow: false, // 全成本配合部门选择弹窗的显示 和关闭


        /*基本信息数据*/
        mainProjList: [],                         //主项目列表
        projTypeList: [],                         //项目类型列表
        projOldInfo: {},
        projNewUid: '',                           // proj_uid ，如果是新增项目，从后台获取，如果是草稿，直接获取
        basicInfoUuid: '',                        //基本信息表单唯一id，保证数据填充到表单
        pms_list: [],                             //pms编码列表，只在初始化时传值，后续对pms的操作在router里面
        projInfoLimit: {},
        infoDraftFlag: '',
        projOriginName: '',
        puDeptId: '',
        projReasonDraftFlag: '',
        projChangeCheckFlag: '0',   //项目审核标志，0未在审核流中，1在审核流中
        projChangeCheckShow: '',
        isBranchProj: '',           //该项目是否是分院四个中心项目,0不是，1是
        bussinessBatchId: '',
        draft_isdelete: '',         //发起变更时，是否显示删除草稿按钮
        /*mainDeptData: '',           //主建部门修改后的提示*/

        /*里程碑数据*/
        mileModalType: '',                        //里程碑模态框类型
        mileStoneRecord: {},                       //里程碑列表中一行的记录
        mileStoneModalData: {},                   //里程碑模态框数据
        mileModalVisible: false,                  //里程碑编辑的模态框可见状态
        mileStoneList: [],
        mileStoneListOriginal: [],
        fore_workload: undefined,
        remainWorkLoad: undefined,
        begin_time: undefined,                    //里程碑里面使用的项目开始时间
        end_time: undefined,                      //里程碑里面使用的项目结束时间

        /*以下为全成本数据*/
        yearListRowSpan: {},
        coorpDeptList: [],          //配合部门列表
        coorpDeptListOriginal: [],
        allDeptList: [],            //所有部门列表，第一个为主责部门
        deptBudgetList: [],         //返回的部门预算数据
        deptBudgetListOriginal: [],
        deptBudgetTableData: [],    //部门预算信息表格数据
        yearList: [],               //显示的年份列表
        yearListOriginal: [],
        purchaseAllCostList: [],    //采购成本类型列表
        operateAllCostList: [],     //运行成本类型列表
        carryOutAllCostList: [],    //实施成本类型列表
        fullCostYearList: [],       //可添加的年份列表
        predictTimeTotal: '0',      //预计工时综合
        allTableTotal: 0,           //预算合计
        deptNum: [],                //全成本的配合部门出现次数
        oubudgetList: [],           //全成本预算标准
        //待办使用到的数据
        titleData: {},
        loading2: false,            //刷新标识位

    },
    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
        initData(state) {
            return {
                ...state,
                currentTabKey: 't1',
                queryData: {},
                changeReason: '',

                /*基本信息数据*/
                mainProjList: [],                         //主项目列表
                projTypeList: [],                         //项目类型列表
                projOldInfo: {},
                projNewUid: '',                           // proj_uid ，如果是新增项目，从后台获取，如果是草稿，直接获取
                basicInfoUuid: '',                        //基本信息表单唯一id，保证数据填充到表单
                pms_list: [],                             //pms编码列表，只在初始化时传值，后续对pms的操作在router里面
                projInfoLimit: {},
                infoDraftFlag: '',
                projOriginName: '',
                puDeptId: '',
                projReasonDraftFlag: '',
                projChangeCheckFlag: '0',   //项目审核标志，0未在审核流中，1在审核流中
                projChangeCheckShow: '',
                isBranchProj: '',           //该项目是否是分院四个中心项目,0不是，1是
                bussinessBatchId: '',
                draft_isdelete: '',         //发起变更时，是否显示删除草稿按钮

                /*里程碑数据*/
                mileModalType: '',                        //里程碑模态框类型
                mileStoneRecord: {},                       //里程碑列表中一行的记录
                mileStoneModalData: {},                   //里程碑模态框数据
                mileModalVisible: false,                  //里程碑编辑的模态框可见状态
                mileStoneList: [],
                mileStoneListOriginal: [],
                fore_workload: undefined,
                remainWorkLoad: undefined,
                begin_time: undefined,                    //里程碑里面使用的项目开始时间
                end_time: undefined,                      //里程碑里面使用的项目结束时间

                /*以下为全成本数据*/
                yearListRowSpan: {},
                coorpDeptList: [],          //配合部门列表
                coorpDeptListOriginal: [],
                allDeptList: [],            //所有部门列表，第一个为主责部门
                deptBudgetList: [],         //返回的部门预算数据
                deptBudgetListOriginal: [],
                deptBudgetTableData: [],    //部门预算信息表格数据
                yearList: [],               //显示的年份列表
                yearListOriginal: [],
                purchaseAllCostList: [],    //采购成本类型列表
                operateAllCostList: [],     //运行成本类型列表
                carryOutAllCostList: [],    //实施成本类型列表
                fullCostYearList: [],       //可添加的年份列表
                predictTimeTotal: '0',      //预计工时综合
                allTableTotal: 0,           //预算合计
                oubudgetList: [],           //全成本预算标准

                //待办使用到的数据
                titleData: {},

                // 全成本子tab数据
                isShowTabINFullCost: '0',// 默认无子tab
                tabListArr: [], // 默认子数组为空
                squareTabKey: '',   // 默认的全成本tapkey
            }
        },
    },
    effects: {

        /**
         * 作者：胡月
         * 创建日期：2017-11-23
         * 功能：项目变更中的标题查询
         */* projChangeTitleQuery({}, {call, put, select}) {
            let {queryData} = yield select(state => state.projChangeApply);
            let postData = {};
            let postUrl = '';
            postData.arg_proj_id = queryData.arg_proj_id;
            if (queryData.arg_check_id) {
                postData.arg_check_id = queryData.arg_check_id;
                postData.arg_tag = queryData.arg_tag;
                postData.arg_handle_flag = queryData.arg_handle_flag;
                postUrl = projServices.projChangeCheckTitle;
            } else {
                postUrl = projServices.getProjChangeTitle;  // 项目变更标题查询 第二个服务
            }
            const data = yield call(postUrl, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        projOriginName: data.proj_origin_name,
                        projReasonDraftFlag: data.ProjReasonCheckFlag,
                        projChangeCheckFlag: data.ProjChangeCheckFlag,
                        projChangeCheckShow: data.ProjChangeCheckShow,
                        isBranchProj: data.is_branch_proj,
                        puDeptId: data.pu_dept_id,
                        changeReason: data.change_reason,
                        bussinessBatchId: data.bussiness_batchid,
                        titleData: data.DataRows.length ? data.DataRows[0] : {},
                        draft_isdelete: data.draft_isdelete,      //这个值只在发起变更时使用
                    }
                });
            }
        },

        /**
         * 作者：胡月
         * 创建日期：2017-11-3
         * 功能：项目变更中的基本信息--查询主项目的列表
         */* mainProjQuery({}, {call, put}) {
            const data = yield call(projServices.getPrimaryProj);
            if (data.RetCode === '1' && data.DataRows.length) {
                //将主项目列表数据中的所有 投资替代额 除以 1000 ，以 万元 为单位
                for (let i = 0; i < data.DataRows.length; i++) {
                    if ('replace_money' in data.DataRows[i]) {
                        data.DataRows[i].replace_money = Number((Number(data.DataRows[i].replace_money) / 10000).toFixed(6));
                    }
                }
            }
            yield put({
                type: 'save',
                payload: {
                    mainProjList: data.DataRows,
                }
            });
        },

        /**
         * 作者：胡月
         * 创建日期：2017-11-13
         * 功能：项目变更中的基本信息--查询项目类型的列表
         */* projTypeQuery({}, {call, put}) {
            let {DataRows} = yield call(projServices.getProjType, {
                transjsonarray: JSON.stringify({
                    "condition": {"type_state": "0"}, "sequence": [{"type_order": "0"}]
                })
            });
            yield put({
                type: 'save',
                payload: {
                    projTypeList: DataRows,
                }
            });
        },

        /**
         * 作者：胡月
         * 创建日期：2017-11-13
         * 功能：查询项目的基本信息，
         */
        * projApplyBasicInfo({}, {call, put, select}) {
            yield put({type: 'mainProjQuery'});
            yield put({type: 'projTypeQuery'});
            yield put({type: 'projChangeTitleQuery'});

            let {queryData} = yield select(state => state.projChangeApply);
            let postData = {};
            let postUrl = '';
            postData.arg_proj_id = queryData.arg_proj_id;
            if (queryData.arg_check_id) {
                postData.arg_check_id = queryData.arg_check_id;
                postData.arg_query_flag = '1';
                postUrl = projServices.projChangeCheckInfo;
            } else {
                postUrl = projServices.getProjChangeInfo;
            }
            const data = yield call(postUrl, postData);
            //提交状态还是保存状态
            let projObj = data.DataRows[0];
            //预估投资替代额的元到万元的转换
            if ('replace_money' in projObj) {
                projObj.replace_money = Number((Number(projObj.replace_money) / 10000).toFixed(6));
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
                    projNewUid: projObj.proj_uid,
                    projOldInfo: projObj,
                    infoDraftFlag: data.ProjChangeInfoDraftFlag,
                    mixReplaceMoney: data.mixReplaceMoney,
                    projInfoLimit: {
                        isEditFieldPmsCode: data.isEditFieldPmsCode,
                        isEditFielProjType: data.isEditFielProjType,
                        isEditFieldPmsName: data.isEditFieldPmsName
                    },
                    basicInfoUuid: getUuid(32, 64),         //每一次查询给基本信息表单一个唯一key，保证数据填充
                    pms_list: data.pms_list,
                }
            });
        },

        /*/!**
         * 基本信息主建部门变化后的操作
         * @returns {IterableIterator<*>}
         *!/
        * getNextOperateMsg({}, {call, put, select}){
            // 一堆操作

            yield put({
                type: 'save',
                payload: {
                    mainDeptData:{
                        validateStatus: 'warning',
                        errorMsg: '主建部门已修改，请点击保存按钮确认是否进行下一步操作！'
                    }
                }
            });
        },*/

        /**
         * 服务获取配合部门人联系人数据
         * @param call
         * @param put
         * @param select
         * @returns {IterableIterator<*>}
         */* getDeptPersonList({}, {call, put, select}) {
            let {queryData, isShowTabINFullCost, tabListArr, squareTabKey} = yield select(state => state.projChangeApply);
            let postData = {};
            let postUrl = '';
            postData.arg_proj_id = queryData.arg_proj_id;
            postData.arg_tenantid = Cookie.get('tenantid');

            postUrl = projServices.getDeptPersonListS;

            if (isShowTabINFullCost === '1') {  // 有子tab
                let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
                postData.arg_tab_flag = tabItem.tab_flag; // 有tab就要传
                if (tabItem.tab_flag === '1') {
                    postData.arg_pms_code = tabItem.pms_code;
                }
            }

            const data = yield call(postUrl, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        deptPersonList: data.DataRows,
                    }
                });
            }
        },

        /**
         * 关闭选择配合部门的弹窗
         * @returns {IterableIterator<*>}
         */* showDeptModal({showORnot}, {call, put, select}) {
            yield put({
                type: 'save',
                payload: {
                    deptModalShow: showORnot, // 显示弹窗的标志位
                }
            });
        },


        /**
         * 作者：邓广晖
         * 创建日期：2018-06-15
         * 功能：处理tab切换
         * @param key tab的key
         * @param flag 标记
         */* tabChangeClick({key, flag}, {put}) {
            if (flag === 'cancel') {
                if (key === 't1') {
                    yield put({
                        type: 'projApplyBasicInfo',
                    });
                    /*yield put({
                        type: 'projChangeTitleQuery'
                    });*/
                }
                else if (key === 't2') {
                    yield put({
                        type: 'mileStoneQuery',
                    });
                    yield put({
                        type: 'projChangeTitleQuery'
                    });
                }
                else if (key === 't3') { // t3表示全成本
                    yield put({
                        type: 'projChangeTitleQuery'
                    });
                    yield put({
                        type: 'fullCostQuery',
                    });
                }
                yield put({
                    type: 'save',
                    payload: {
                        currentTabKey: key
                    }
                });
            }
        },

        /**
         *切换全成本子tab，执行查询
         * @param key  切换当前的子tab  key值，
         * @returns {IterableIterator<*>}
         */* childTabChangeClick({key, flag}, {put, select}) {

            yield put({
                type: 'save',
                payload: {
                    squareTabKey: key,
                },
            });

            yield put({
                type: 'clearPageCache' // 清空上一页面的滞留数据
            });

            if (flag === 'cancel') {
                yield put({
                    type: 'fullCostQueryByTab'
                })
            }
        },

        /**
         * 清空页面的滞留数据，解决数据变化在前端显示问题
         * @param put
         * @param select
         * @returns {IterableIterator<*>}
         */* clearPageCache({}, {put, select}) {
            yield put({
                type: 'save',
                payload: {
                    coorpDeptList: [],
                    deptBudgetTableData: [],
                },
            });
        },


        /**
         * 作者：胡月
         * 创建日期：2017-11-13
         * 功能：保存，提交功能
         * @param postData 保存提交参数
         * @param obj 标志对象
         */
        /**projAddSave({postData, obj}, {call, put, select}) {
            const data = yield call(projServices.projChangeSaveOrSubmit, postData);
            if (data.RetCode === '1' && obj.tag === '0') {
                message.success('数据保存成功!');
                if (obj.backFunc) {
                    //初始化查询项目
                    yield put({
                        type: 'projApplyBasicInfo',
                        callBack: obj.backFunc
                    });
                }
                if (obj.key === '1') {
                    //初始化查询项目
                    yield put({
                        type: 'projApplyBasicInfo',
                    });
                }
                else if (obj.key === '2') {
                    //初始化查询里程碑
                    yield put({
                        type: 'mileStoneQuery',
                    });
                    yield put({
                        type: 'projChangeTitleQuery'
                    });
                }
                else if (obj.key === '3') {
                    //初始化查询全成本
                    yield put({
                        type: 'fullCostQuery',
                    });
                    yield put({
                        type: 'projChangeTitleQuery'
                    });
                }
            }
            else if (data.RetCode === '1' && obj.tag === '2') {
                //跳转到详情页面
                message.success('数据提交成功!');
                let queryData = yield select(state => state.projChangeApply.queryData);
                if (queryData.arg_check_id) {
                    yield put(routerRedux.push({
                        pathname: '/taskList'
                    }));
                } else {
                    /!*yield put(routerRedux.push({
                    pathname: 'projectApp/projMonitor/projChangeApply',
                    arg_proj_id:queryData.arg_proj_id
                    }));*!/
                    /!*如果提交成功，不跳转，页面直接变为“审核中”*!/
                    yield put({
                        type: 'projChangeTitleQuery'
                    });
                }
            }
            else if (data.RetCode === '-1') {
                message.error(data.RetVal);
            } else if (data.RetCode === '0') {
                message.error('数据提交失败');
            }
        },*/

        /**
         * 作者：邓广晖
         * 创建日期：2018-06-15
         * 功能：保存或者提交
         * @param payload 传递的参数
         */* saveOrSubmit({payload}, {call, put, select}) {
            let {
                currentTabKey, projNewUid, projOldInfo,
                queryData, infoDraftFlag, proj_milestone_draft_flag, proj_cos_draft_flag,
                projReasonDraftFlag, projOriginName, isBranchProj, titleData,
                isShowTabINFullCost, tabListArr, squareTabKey
            } = yield select(state => state.projChangeApply);


            //const query = yield select(state => state.routing.locationBeforeTransitions.query);
            if (!('arg_proj_info_json' in payload)) {
                payload.arg_proj_info_json = {};
            }
            if (!('arg_proj_parent_info_json' in payload)) {
                payload.arg_proj_parent_info_json = {};
            }
            if (!('arg_pu_info_json' in payload)) {
                payload.arg_pu_info_json = {};
            }
            if (!('arg_pms_code_json' in payload)) {
                payload.arg_pms_code_json = [];
            }
            if (!('array_milestone' in payload)) {
                payload.array_milestone = [];
            }
            // 如果存在需要添加当前子tab的tab-flag
            if (!('array_proj_dept' in payload)) {
                payload.array_proj_dept = [];
            } else {
                payload.array_proj_dept.forEach(item => {
                    // 添加子tab的切换数据
                    if (isShowTabINFullCost === '1') {  // 有子tab
                        let tabItem = tabListArr.filter(item2 => item2.tab_name === squareTabKey)[0];
                        item.tab_flag = tabItem.tab_flag;
                        if (tabItem.tab_flag === '1') {
                            item.pms_uid = tabItem.pms_uid;
                        }
                    }
                })
            }
            if (!('array_proj_budget' in payload)) {
                payload.array_proj_budget = [];
            } else {
                payload.array_proj_budget.forEach(item => {
                    // 添加子tab的切换数据
                    if (isShowTabINFullCost === '1') {  // 有子tab
                        let tabItem = tabListArr.filter(item2 => item2.tab_name === squareTabKey)[0];
                        item.tab_flag = tabItem.tab_flag;
                        if (tabItem.tab_flag === '1') {
                            item.pms_uid = tabItem.pms_uid;
                        }
                    }
                })
            }
            /*if (!('arg_proj_attachment_json' in payload)) {
                payload.arg_proj_attachment_json = [];
            }*/


            let postData = {
                arg_proj_id: projOldInfo.proj_id,
                arg_proj_uid: projNewUid,
                arg_opt_byid: Cookie.get('userid'),
                arg_opt_byname: Cookie.get('username'),
                // arg_bussiness_batchid: bussinessBatchId,      //退回修改，此值需要修改  文档-删除
                arg_tab: currentTabKey,
                arg_draft_flag_json: JSON.stringify({
                    proj_info_draft_flag: infoDraftFlag,
                    proj_milestone_draft_flag: proj_milestone_draft_flag,
                    proj_cos_draft_flag: proj_cos_draft_flag,
                    proj_reason_draft_flag: projReasonDraftFlag
                }),
                arg_proj_origin_name: projOriginName,
                // arg_pu_dept_id: puDeptId,   文档-删除
                arg_is_branch_proj: isBranchProj,

                arg_proj_info_json: JSON.stringify(payload.arg_proj_info_json),
                arg_proj_parent_info_json: JSON.stringify(payload.arg_proj_parent_info_json),
                arg_pu_info_json: JSON.stringify(payload.arg_pu_info_json),
                arg_pms_code_json: JSON.stringify(payload.arg_pms_code_json),
                object_milestone_del_budget: JSON.stringify({
                    array_milestone: JSON.stringify(payload.array_milestone),
                    array_proj_dept: JSON.stringify(payload.array_proj_dept),
                    array_proj_budget: JSON.stringify(payload.array_proj_budget)
                }),
                //arg_proj_attachment_json: JSON.stringify(payload.arg_proj_attachment_json),
            };


            //如果全成本预算数据有变化 arg_cos = 1
            if (currentTabKey === 't3' && payload.array_proj_budget.length > 0) {
                postData.arg_cos = '1';
            } else {
                postData.arg_cos = '0';
            }
            //添加arg_bussiness_id // 文档-删除
            if ('ou' in payload.arg_proj_info_json) {
                postData.arg_bussiness_id = getOuBussinessId(payload.arg_proj_info_json.ou);
            } else {
                postData.arg_bussiness_id = getOuBussinessId(projOldInfo.ou);
            }


            //如果是退回修改，需要多传几个字段
            if (JSON.stringify(titleData) !== '{}') {
                postData.arg_bussiness_batchid = projOldInfo.batchid;
                const extraData = {
                    'arg_check_id': titleData.check_id,
                    'arg_check_batch_id': titleData.check_batch_id,
                    'arg_exe_id': titleData.exe_id,
                    'arg_wf_task_id': titleData.wf_task_id,
                    'arg_link_id': titleData.link_id,
                    'arg_link_name': titleData.link_name,
                    'arg_role_id': titleData.role_id,
                    'arg_task_uuid': queryData.arg_task_uuid,
                    'arg_task_batchid': queryData.arg_task_batchid,
                    'arg_task_wf_batchid': queryData.arg_task_wf_batchid,
                };
                postData = {...postData, ...extraData};
            }
            if (payload.optName === 'save') {
                postData.arg_flag = '0';
                const data = yield call(projServices.projChangeSaveOrSubmit, postData);
                if (data.RetCode === '1') {
                    if (data.RetVal !== '' && data.RetVal !== undefined) {
                        message.success(data.RetVal);
                    } else {
                        message.success('保存成功');
                    }


                    // 后续执行查询操作
                    let freshTab = currentTabKey;     // 将要刷新的tab,如果是直接保存，刷当前tab，如果是切换保存，刷新下一个tab
                    if (payload.isTab === '1') {
                        let squareTabKeyT = payload.childTab ? payload.childTab : squareTabKey
                        freshTab = payload.nextTab;
                        yield put({
                            type: 'save',
                            payload: {
                                currentTabKey: payload.nextTab,
                                squareTabKey: squareTabKeyT, // 有存储子tab时才保存子tab
                            }
                        });
                    }
                    if (freshTab === 't1') {
                        yield put({
                            type: 'projApplyBasicInfo'
                        });
                    }
                    else if (freshTab === 't2') {
                        //初始化查询里程碑
                        yield put({
                            type: 'mileStoneQuery',
                        });
                        yield put({
                            type: 'projChangeTitleQuery'
                        });
                    }
                    else if (freshTab === 't3') {
                        //初始化查询全成本
                        /* yield put({
                           type: 'fullCostQuery',
                         });*/
                        yield put({
                            type: 'fullCostQueryByTab',
                        });
                        yield put({
                            type: 'projChangeTitleQuery'
                        });
                    }
                }
                else if (data.RetCode === '-1') {
                    message.info(data.RetVal);
                }
            }
            else if (payload.optName === 'submit') {
                postData.arg_flag = '2';
                postData.arg_change_reason = payload.arg_change_reason.trim();  //提交时有变更烟瘾
                const data = yield call(projServices.projChangeSaveOrSubmit, postData);
                if (data.RetCode === '1') {
                    if (data.RetVal !== '' && data.RetVal !== undefined) {
                        message.success(data.RetVal);
                    } else {
                        message.success('提交成功');
                    }
                    //跳转到详情页面
                    if (queryData.arg_check_id) {
                        yield put(routerRedux.push({
                            pathname: '/taskList'
                        }));
                    } else {
                        /*如果提交成功，不跳转，页面直接变为“审核中”*/
                        yield put({
                            type: 'projChangeTitleQuery'
                        });
                    }
                } else if (data.RetCode === '-1') {
                    message.info(data.RetVal);
                } else if(data.RetCode === '-3'){
                    if (data.RetVal !== '' && data.RetVal !== undefined) {
                        message.info(data.RetVal);
                    } else {
                        message.info('提交失败！');
                    }
                    // 后续执行查询操作
                    let freshTab = currentTabKey;     // 将要刷新的tab,如果是直接保存，刷当前tab，如果是切换保存，刷新下一个tab
                    if (payload.isTab === '1') {
                        let squareTabKeyT = payload.childTab ? payload.childTab : squareTabKey
                        freshTab = payload.nextTab;
                        yield put({
                            type: 'save',
                            payload: {
                                currentTabKey: payload.nextTab,
                                squareTabKey: squareTabKeyT, // 有存储子tab时才保存子tab
                            }
                        });
                    }
                    if(freshTab === 't3'){ // 刷新全成本
                        yield put({
                            type: 'fullCostQueryByTab',
                        });
                        yield put({
                            type: 'projChangeTitleQuery'
                        });
                    }

                    if(freshTab === 't2'){ // 刷新里程碑
                        //初始化查询里程碑
                        yield put({
                            type: 'mileStoneQuery',
                        });
                        yield put({
                            type: 'projChangeTitleQuery'
                        });
                    }

                    if(freshTab === 't1'){ // 刷新基本信息
                        yield put({
                            type: 'projApplyBasicInfo'
                        });
                    }

                }

            }
        },
        /**
         * 作者：彭东洋
         * 创建日期：2020-04-16
         * 功能：查询全成本标准
        */
        *queryFullCostData({}, {put,call,select}) {
            const {DataRows,RetCode} = yield call(projServices.autocalcu_cost_budget_sort_oubudget_query)
            if(RetCode == "1" && DataRows) {
                // 筛选出来所有已经提交的项目
                let realDataRows = DataRows.filter((v) => {return v.is_sub == "1"})
                if(realDataRows.length == 0) {
                    message.error("请先配置全成本标准")
                }
                yield put({
                    type:"save",
                    payload: {
                        oubudgetList: realDataRows
                    }
                })
            }
        },
        /**
         * 作者：邓广晖
         * 创建日期：2017-11-15
         * 功能：变更项目申请里程碑
         */* mileStoneQuery({}, {select, call, put}) {
            let {queryData} = yield select(state => state.projChangeApply);
            let postData = {};
            let postUrl = '';
            postData.arg_proj_id = queryData.arg_proj_id;
            if (queryData.arg_check_id) {
                postData.arg_check_id = queryData.arg_check_id;
                postData.arg_query_flag = '1';
                postUrl = projServices.queryCheckMilestone;
            } else {
                postUrl = projServices.queryProjChgMileStone;
            }
            const data = yield call(postUrl, postData);

            //let postData = { arg_proj_id:queryData.arg_proj_id};
            //const data = yield call(projServices.queryProjChgMileStone,postData);
            if (data.RetCode === '1') {
                data.DataRows.map((i, index) => {
                    i.opt_type = 'search';   //查询出来的附件标记为 search
                    i.key = index;           //为没一条记录添加一个 key
                    return i;
                });

                //计算剩余工作量
                let mileStoneWorkLoad = 0;
                let remainWorkLoad = undefined;
                //如果有里程碑
                if (data.DataRows.length > 0) {
                    data.DataRows.map((item, index) => {
                        mileStoneWorkLoad += Number(item.plan_workload);
                        return item
                    });
                    remainWorkLoad = data.fore_workload - mileStoneWorkLoad;
                } else if (data.fore_workload) {
                    //如果没有里程碑，但有预计工作量
                    remainWorkLoad = data.fore_workload;
                }

                //let remainWorkLoadw = data.fore_workload - mileStoneWorkLoad;
                yield put({
                    type: 'save',
                    payload: {
                        proj_milestone_draft_flag: data.ProjChangeMileDraftFlag,
                        mileStoneList: data.DataRows,
                        mileStoneListOriginal: JSON.parse(JSON.stringify(data.DataRows)),
                        begin_time: data.begin_time,
                        end_time: data.end_time,
                        fore_workload: data.fore_workload,
                        remainWorkLoad: remainWorkLoad
                    }
                });
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-06-01
         * 功能：模态框显示
         * @param modalType 模态框类型
         * @param mileStoneRecord 记录
         */* showMileModal({modalType, mileStoneRecord}, {select, put}) {
            if (modalType === 'add') {
                yield put({
                    type: 'save',
                    payload: {
                        mileStoneModalData: {},
                        mileModalType: modalType,
                        mileModalVisible: true,
                    }
                });
            } else if (modalType === 'edit') {
                yield put({
                    type: 'save',
                    payload: {
                        mileStoneRecord: mileStoneRecord,
                        mileStoneModalData: JSON.parse(JSON.stringify(mileStoneRecord)),
                        mileModalType: modalType,
                        mileModalVisible: true,
                    }
                });
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-06-21
         * 功能：添加里程碑模态框关闭
         * @param flag 关闭模态框时的标志，为confirm，cancel
         * @param mileParams 里程碑参数
         */* hideMileModal({flag, mileParams}, {put, select}) {
            if (flag === 'confirm') {
                let {mileModalType, mileStoneList, remainWorkLoad, mileStoneRecord, mileStoneListOriginal} = yield select(state => state.projChangeApply);
                if (mileModalType === 'add') {
                    //let { mileStoneList, remainWorkLoad } = yield select(state => state.projectInfo);
                    remainWorkLoad -= Number(mileParams.plan_workload);
                    mileParams.opt_type = 'insert';
                    mileParams.mile_uid = getUuid(32, 62);
                    mileParams.mile_month_progress = '0';     //项目变更中，新增里程时，进度为0
                    mileParams.is_edit = '1';                 //is_edit  =0  为不可编辑  =1为可编辑
                    mileStoneList.push(mileParams);
                    mileStoneList.forEach((item, index) => {
                        item.key = index;
                    });
                    yield put({
                        type: 'save',
                        payload: {
                            mileStoneList: JSON.parse(JSON.stringify(mileStoneList)),
                            remainWorkLoad: Number(remainWorkLoad.toFixed(1)),
                            mileModalVisible: false,
                        }
                    });
                }
                else if (mileModalType === 'edit') {
                    const index = Number(mileStoneRecord.key);
                    //编辑的时候，状态的改变主要针对已经从数据库查询出来的数据，新增的里程碑的编辑不用考虑，因为其状态永远为insert
                    if (mileStoneList[index].opt_type === "search" || mileStoneList[index].opt_type === "update") {
                        //如果编辑的数据和原始数据相比较，没有发生变化，则状态为 search
                        if (mileStoneListOriginal[index].mile_name === mileParams.mile_name &&
                            mileStoneListOriginal[index].plan_begin_time === mileParams.plan_begin_time &&
                            mileStoneListOriginal[index].plan_end_time === mileParams.plan_end_time &&
                            Number(mileStoneListOriginal[index].plan_workload) === Number(mileParams.plan_workload)
                        ) {
                            mileStoneList[index].opt_type = 'search';
                        } else {
                            mileStoneList[index].opt_type = 'update';     //设置状态标识为 update
                        }
                    }
                    mileStoneList[index].mile_name = mileParams.mile_name;
                    mileStoneList[index].plan_begin_time = mileParams.plan_begin_time;
                    mileStoneList[index].plan_end_time = mileParams.plan_end_time;
                    //更新剩余量
                    remainWorkLoad += Number(mileStoneList[index].plan_workload);  //先还原修改前一个状态
                    remainWorkLoad -= Number(mileParams.plan_workload);  //减去新的值
                    mileStoneList[index].plan_workload = Number(mileParams.plan_workload);  //更新列表中的值

                    yield put({
                        type: 'save',
                        payload: {
                            mileStoneList: JSON.parse(JSON.stringify(mileStoneList)),
                            remainWorkLoad: remainWorkLoad,
                            mileModalVisible: false,
                        }
                    });
                }
            } else if (flag === 'cancel') {
                yield put({
                    type: 'save',
                    payload: {
                        mileModalVisible: false,
                    }
                });
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-06-21
         * 功能：里程碑删除功能
         * @param index 里程碑索引值
         * @param deleteMileRecord 里程碑删除时的所在行记录
         */* deleteMilestone({deleteMileRecord}, {select, put}) {
            let {mileStoneList, remainWorkLoad} = yield select(state => state.projChangeApply);
            let index = deleteMileRecord.key;
            remainWorkLoad += Number(mileStoneList[index].plan_workload);
            if (mileStoneList[index].opt_type !== 'insert') {
                mileStoneList[index].opt_type = 'delete';
            } else {
                mileStoneList.splice(index, 1);
            }
            //处理之后将key值重排
            for (let i = 0; i < mileStoneList.length; i++) {
                mileStoneList[i].key = i;
            }
            yield put({
                type: 'save',
                payload: {
                    mileStoneList: JSON.parse(JSON.stringify(mileStoneList)),
                    remainWorkLoad: remainWorkLoad
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-15
         * 功能：里程碑添加功能
         * @param data 当前里程碑数据
         * @param mileStoneList 里程碑列表数据
         * @param remainWorkLoad 剩余工作量
         * @param put 返回reducer
         */
        /**mileAddModal({data, mileStoneList, remainWorkLoad}, {put}) {
            remainWorkLoad -= Number(data.plan_workload);
            data.key = mileStoneList.length;
            data.opt_type = 'insert';
            data.mile_uid = getUuid(32, 62);
            data.mile_month_progress = '0';     //项目变更中，新增里程时，进度为0
            data.is_edit = '1';      //is_edit  =0  为不可编辑  =1为可编辑
            mileStoneList.push(data);
            yield put({
                type: 'save',
                payload: {
                    mileStoneList: JSON.parse(JSON.stringify(mileStoneList)),
                    remainWorkLoad: Number(remainWorkLoad.toFixed(1))
                }
            });
        },*/

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-15
         * 功能：里程碑编辑功能
         * @param values 当前里程碑变化数据
         * @param index 里程碑索引值
         * @param mileStoneList 里程碑列表数据
         * @param remainWorkLoad 剩余工作量
         */
        /** editMileModal({values, index, mileStoneList, remainWorkLoad}, {put, select}) {
            let mileStoneListOriginal = yield select(state => state.projChangeApply.mileStoneListOriginal);
            //编辑的时候，状态的改变主要针对已经从数据库查询出来的数据，新增的里程碑的编辑不用考虑，因为其状态永远为insert
            if (mileStoneList[index].opt_type === "search" || mileStoneList[index].opt_type === "update") {
                //如果编辑的数据和原始数据相比较，没有发生变化，则状态为 search
                if (mileStoneListOriginal[index].mile_name === values.mile_name &&
                    mileStoneListOriginal[index].plan_begin_time === values.plan_begin_time.format("YYYY-MM-DD") &&
                    mileStoneListOriginal[index].plan_end_time === values.plan_end_time.format("YYYY-MM-DD") &&
                    Number(mileStoneListOriginal[index].plan_workload) === Number(values.plan_workload)
                ) {
                    mileStoneList[index].opt_type = 'search';
                } else {
                    mileStoneList[index].opt_type = 'update';     //设置状态标识为 update
                }
            }
            mileStoneList[index].mile_name = values.mile_name;
            mileStoneList[index].plan_begin_time = values.plan_begin_time.format("YYYY-MM-DD");
            mileStoneList[index].plan_end_time = values.plan_end_time.format("YYYY-MM-DD");
            //更新剩余量
            remainWorkLoad += Number(mileStoneList[index].plan_workload);  //先还原修改前一个状态
            remainWorkLoad -= Number(values.plan_workload);  //减去新的值
            mileStoneList[index].plan_workload = Number(values.plan_workload);  //更新列表中的值

            yield put({
                type: 'save',
                payload: {mileStoneList: mileStoneList, remainWorkLoad: remainWorkLoad}
            });
        },*/

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-15
         * 功能：里程碑删除功能
         * @param index 里程碑索引值
         * @param mileStoneList 里程碑列表数据
         * @param remainWorkLoad 剩余工作量
         * @param put 返回reducer
         */
        /* * deleteCard({index, mileStoneList, remainWorkLoad}, {put}) {
             //let mileStoneListTemp = yield select(state=>state.projChangeApply.mileStoneList);
             remainWorkLoad += Number(mileStoneList[index].plan_workload);
             if (mileStoneList[index].opt_type !== 'insert') {
                 mileStoneList[index].opt_type = 'delete';
             } else {
                 mileStoneList.splice(index, 1);
             }
             //处理之后将key值重排
             for (let i = 0; i < mileStoneList.length; i++) {
                 mileStoneList[i].key = i;
             }
             yield put({
                 type: 'save',
                 payload: {mileStoneList: mileStoneList, remainWorkLoad: remainWorkLoad}
             });

         },
    */
        /**
         * 作者：邓广晖
         * 创建日期：2017-11-16
         * 功能：保存url传来的query数据
         * @param query url传值参数
         * @param put 返回reducer
         */
        * saveQuery({query}, {put}) {
            yield put({
                type: 'save',
                payload: {
                    queryData: query
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-16
         * 功能：全成本初始化查询， 查询tab有所不同
         */
        * fullCostQuery({}, {call, put, select}) {
            let {queryData, squareTabKey} = yield select(state => state.projChangeApply);
            // 查询全成本的页共有几个tab选项
            let tabListPostData = {
                arg_proj_id: queryData.arg_proj_id,
            }
            let tabListUrl = '';
            // 代办过来的数据  查询的tab服务不同
            if (queryData.arg_check_id) {
                tabListPostData.arg_query_flag = '1'; // 消息的flag=1
                tabListPostData.arg_check_id = queryData.arg_check_id;
                tabListUrl = projServices.messageTablistUrlS;

            } else { // 正常的项目变更的服务
                tabListUrl = projServices.tabListUrlS;
            }

            const tabListInFullCostD = yield call(tabListUrl, tabListPostData)
            if (tabListInFullCostD.RetCode === '1') {
                if (tabListInFullCostD.isShowTab === '0') { //只有团队预算 不显示tab
                    yield put({
                        type: 'save',
                        payload: {
                            isShowTabINFullCost: '0',
                            tabListArr: tabListInFullCostD.DataRows, // 全成本下属的tab数组
                            squareTabKey: tabListInFullCostD.DataRows[0].tab_name,// 子tab的默认选中第一个tab
                        }
                    });
                } else if (tabListInFullCostD.isShowTab === '1') { //显示tab
                    yield put({
                        type: 'save',
                        payload: {
                            isShowTabINFullCost: '1',
                            tabListArr: tabListInFullCostD.DataRows, // 全成本下属的tab数组
                            squareTabKey: tabListInFullCostD.DataRows[0].tab_name,// 子tab的默认选中第一个tab
                        }
                    });
                }

                // 在初始化之后执行tab下数据查询
                yield put({
                    type: 'fullCostQueryByTab',
                });

                // 合计预算时不需要查询配合部门联系人 ???
                if (squareTabKey !== '合计预算') {
                    // 在初始化之后执行配合部门人员查询
                    yield put({
                        type: 'getDeptPersonList',
                    });
                }
            }

            /*  //查询配合部门列表
              let coorpDeptPostData = {};
              let coorpDeptPostUrl = '';
              coorpDeptPostData.arg_proj_id = queryData.arg_proj_id;
              if (queryData.arg_check_id) { // 疑似变更审核人参数
                  coorpDeptPostData.arg_check_id = queryData.arg_check_id;
                  coorpDeptPostData.arg_query_flag = '1';
                  coorpDeptPostUrl = projServices.queryCheckFullCostDept; //项目变更审核人查看全成本配合部门对比
              } else {
                  coorpDeptPostUrl = projServices.queryCoorpDept; // 项目变更全成本 配合部门查询 第一个服务
              }
              const coorpDeptData = yield call(coorpDeptPostUrl, coorpDeptPostData);

              //const coorpDeptData = yield call(projServices.queryCoorpDept,{arg_proj_id:queryData.arg_proj_id});
              if (coorpDeptData.RetCode === '1') {
                  coorpDeptData.DataRows.map((i, index) => {
                      if ('mgr_name' in i) {
                          i.opt_type = 'search';   //查询出来的配合部门标记为 search
                          i.key = index;           //为没一条记录添加一个 key
                      } else {
                          i.opt_type = 'search';
                          i.key = index;
                          i.mgr_name = '';       //配合部门没有字段时，设置为空
                      }
                      return i;
                  });
                  yield put({
                      type: 'save',
                      payload: {
                          coorpDeptList: coorpDeptData.DataRows,
                          coorpDeptListOriginal: JSON.parse(JSON.stringify(coorpDeptData.DataRows))
                      }
                  });
              }

              //查询所有部门列表,第一个为主责部门
              let allDeptPostData = {};
              let allDeptPostUrl = '';
              allDeptPostData.arg_proj_id = queryData.arg_proj_id;
              if (queryData.arg_check_id) {
                  allDeptPostData.arg_check_id = queryData.arg_check_id;
                  allDeptPostData.arg_query_flag = '1';
                  allDeptPostUrl = projServices.queryCheckFullCostAllDept;
              } else {
                  allDeptPostUrl = projServices.queryAllDept; // 全成本所有部门查询 第三个服务
              }
              const allDeptData = yield call(allDeptPostUrl, allDeptPostData);
              //const allDeptData = yield call(projServices.queryAllDept,{arg_proj_id:queryData.arg_proj_id});
              //查询每个部门的预算
              let budgetPostData = {};
              let budgetPostUrl = '';
              budgetPostData.arg_proj_id = queryData.arg_proj_id;
              if (queryData.arg_check_id) {
                  budgetPostData.arg_check_id = queryData.arg_check_id;
                  budgetPostData.arg_query_flag = '1';
                  budgetPostUrl = projServices.queryCheckFullCostBudget;
              } else {
                  budgetPostUrl = projServices.querydeptBudgetData; // 预算查询                  第四个服务
              }
              const deptBudgetData = yield call(budgetPostUrl, budgetPostData);
              //const deptBudgetData = yield call(projServices.querydeptBudgetData,{arg_proj_id:queryData.arg_proj_id});

              //确定是否为草稿
              let proj_cos_draft_flag = coorpDeptData.ProjChangeDeptDraftFlag === '1' ||
              deptBudgetData.ProjChangeBudgetDraftFlag === '1' ?
                  '1' : '0';
              yield put({
                  type: 'save',
                  payload: {
                      proj_cos_draft_flag: proj_cos_draft_flag
                  }
              });

              //确定返回的预算中的年份
              let yearList = [];
              for (let i = 0; i < deptBudgetData.DataRows.length; i++) {
                  if (!isInArray(yearList, deptBudgetData.DataRows[i].year)) {
                      yearList.push(deptBudgetData.DataRows[i].year);
                  }
              }
              //数据存储的项目采购成本总列表
              let purchasePostData = {
                  transjsonarray: JSON.stringify({
                      "condition": {"fee_subtype": "0"},
                      "sequence": [{"index_num": "0"}]
                  })
              };
              let purchaseAllCostData = yield call(projServices.queryCostList, purchasePostData); // 费用类型查询 第五个服务
              //数据存储的项目实施成本总列表
              let carryOutPostData = {
                  transjsonarray: JSON.stringify({
                      "condition": {"fee_subtype": "1"},
                      "sequence": [{"index_num": "0"}]
                  })
              };
              let carryOutAllCostData = yield call(projServices.queryCostList, carryOutPostData);
              //数据存储的项目运行成本总列表
              let operatePostData = {
                  transjsonarray: JSON.stringify({
                      "condition": {"fee_subtype": "3"},
                      "sequence": [{"index_num": "0"}]
                  })
              };
              let operateAllCostData = yield call(projServices.queryCostList, operatePostData);

              allDeptData.DataRows.map((i) => {
                  i.opt_type = 'search';
                  return i
              });
              deptBudgetData.DataRows.map((i) => {
                  i.opt_type = 'search';
                  return i
              });
              //purchaseAllCostData.DataRows.map((i)=>{i.opt_type='search';return i});
              //carryOutAllCostData.DataRows.map((i)=>{i.opt_type='search';return i});
              /!*计算可添加的年份*!/
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

              yield put({
                  type: 'save',
                  payload: {
                      allDeptList: allDeptData.DataRows,
                      deptBudgetList: deptBudgetData.DataRows,
                      deptBudgetListOriginal: JSON.parse(JSON.stringify(deptBudgetData.DataRows)),
                      yearList: yearList,
                      yearListOriginal: JSON.parse(JSON.stringify(yearList)),
                      purchaseAllCostList: purchaseAllCostData.DataRows,
                      carryOutAllCostList: carryOutAllCostData.DataRows,
                      operateAllCostList: operateAllCostData.DataRows,
                      fullCostYearList: fullCostYearList
                  }
              });
              //转变数据
              yield put({
                  type: 'convertFullCostData',
                  isFirstTime: true
              });*/
        },

        /**
         * 点击全成本tab按钮查询
         * @param call
         * @param put
         * @param select
         * @returns {IterableIterator<*>}
         */
        * fullCostQueryByTab({}, {call, put, select}) {
            let {queryData, isShowTabINFullCost, tabListArr, squareTabKey} = yield select(state => state.projChangeApply);

            // 强制刷新
            yield put({
                type: 'save',
                payload: {
                    loading2: true,
                }
            });
            // 查询配合部门共出现多少次
            let deptNumPostData = {
                arg_proj_id: queryData.arg_proj_id,
                arg_tab_flag: '3',
                arg_query_flag: '1', //非对比
            }

            let deptNumData={};
            if(queryData.arg_check_id){ // 退回的项目修改
                deptNumPostData.arg_check_id = queryData.arg_check_id;
                deptNumData = yield call(projServices.queryCheckFullCostDept, deptNumPostData)
            }else{ // 正常变更的项目修改
                deptNumData = yield call(projServices.queryCoorpDept, deptNumPostData)
            }
            if (deptNumData.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        deptNum: deptNumData.DataRows,
                    }
                });
            }


            //查询配合部门列表
            let coorpDeptPostData = {};
            let coorpDeptPostUrl = '';
            coorpDeptPostData.arg_proj_id = queryData.arg_proj_id;

            if (queryData.arg_check_id) { // 退回的项目变更
                coorpDeptPostData.arg_check_id = queryData.arg_check_id;
                if (isShowTabINFullCost === '1') {  // 有子tab
                    let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
                    coorpDeptPostData.arg_tab_flag = tabItem.tab_flag;
                    coorpDeptPostData.arg_query_flag = tabItem.tab_flag_change === '1' ? '0' : '1'; // 根据tab选项的是否变化
                    if (tabItem.tab_flag === '1') {
                        coorpDeptPostData.arg_pms_code = tabItem.pms_code;
                    }
                }
                coorpDeptPostUrl = projServices.queryCheckFullCostDept;

            } else {
                coorpDeptPostUrl = projServices.queryCoorpDept; // 项目变更全成本 配合部门查询 第一个服务
                if (isShowTabINFullCost === '1') {  // 有子tab
                    let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
                    coorpDeptPostData.arg_tab_flag = tabItem.tab_flag;
                    if (tabItem.tab_flag === '1') {
                        coorpDeptPostData.arg_pms_code = tabItem.pms_code;
                    }
                }
            }

            const coorpDeptData = yield call(coorpDeptPostUrl, coorpDeptPostData);

            //const coorpDeptData = yield call(projServices.queryCoorpDept,{arg_proj_id:queryData.arg_proj_id});
            if (coorpDeptData.RetCode === '1') {
                coorpDeptData.DataRows.map((i, index) => {
                    if ('mgr_name' in i) {
                        i.opt_type = 'search';   //查询出来的配合部门标记为 search
                        i.key = index;           //为每一条记录添加一个 key
                        // i.mgr_name = `${i.mgr_name}(${i.mgr_id})` // 将员工编号显示出来
                    } else {
                        i.opt_type = 'search';
                        i.key = index;
                        i.mgr_name = '';       //配合部门没有字段时，设置为空
                    }
                    return i;
                });
                yield put({
                    type: 'save',
                    payload: {
                        coorpDeptList: coorpDeptData.DataRows,
                        coorpDeptListOriginal: JSON.parse(JSON.stringify(coorpDeptData.DataRows))
                    }
                });
            }

            //查询所有部门列表,第一个为主责部门
            let allDeptPostData = {};
            let allDeptPostUrl = '';
            allDeptPostData.arg_proj_id = queryData.arg_proj_id;
            if (queryData.arg_check_id) {
                allDeptPostData.arg_check_id = queryData.arg_check_id;

                if (isShowTabINFullCost === '1') {  // 有子tab
                    let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
                    allDeptPostData.arg_tab_flag = tabItem.tab_flag;
                    allDeptPostData.arg_query_flag = tabItem.tab_flag_change === '1' ? '0' : '1'; // 根据tab选项的是否变化
                    if (tabItem.tab_flag === '1') {
                        allDeptPostData.arg_pms_code = tabItem.pms_code;
                    }
                }
                allDeptPostUrl = projServices.queryCheckFullCostAllDept;
            } else {
                allDeptPostUrl = projServices.queryAllDept; // 全成本所有部门查询 第三个服务
                if (isShowTabINFullCost === '1') {  // 有子tab
                    let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
                    allDeptPostData.arg_tab_flag = tabItem.tab_flag; // 有tab就要传
                    if (tabItem.tab_flag === '1') {
                        allDeptPostData.arg_pms_code = tabItem.pms_code; // pms预算才需要传
                    }
                }
            }
            const allDeptData = yield call(allDeptPostUrl, allDeptPostData);

            //const allDeptData = yield call(projServices.queryAllDept,{arg_proj_id:queryData.arg_proj_id});

            //查询每个部门的预算
            let budgetPostData = {};
            let budgetPostUrl = '';
            budgetPostData.arg_proj_id = queryData.arg_proj_id;
            budgetPostData.arg_query_flag = '1'; // 默认填 1，修改页面 非对比

            if (queryData.arg_check_id) {
                budgetPostData.arg_check_id = queryData.arg_check_id;
                if (isShowTabINFullCost === '1') {  // 有子tab
                    let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
                    budgetPostData.arg_tab_flag = tabItem.tab_flag;
                    // budgetPostData.arg_query_flag = tabItem.tab_flag_change === '1' ? '0' : '1'; // 根据tab选项的是否变化
                    if (tabItem.tab_flag === '1') {
                        budgetPostData.arg_pms_code = tabItem.pms_code;
                    }
                }
                budgetPostUrl = projServices.queryCheckFullCostBudget;
            } else {
                budgetPostUrl = projServices.querydeptBudgetData; // 预算查询                  第四个服务
                if (isShowTabINFullCost === '1') {  // 有子tab
                    let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
                    budgetPostData.arg_tab_flag = tabItem.tab_flag; // 有tab就要传
                    if (tabItem.tab_flag === '1') {
                        budgetPostData.arg_pms_code = tabItem.pms_code; // pms预算才需要传
                    }
                }
            }

            const deptBudgetData = yield call(budgetPostUrl, budgetPostData);
            //const deptBudgetData = yield call(projServices.querydeptBudgetData,{arg_proj_id:queryData.arg_proj_id});

            //确定是否为草稿
            let proj_cos_draft_flag = coorpDeptData.ProjChangeDeptDraftFlag === '1' ||
            deptBudgetData.ProjChangeBudgetDraftFlag === '1' ?
                '1' : '0';
            yield put({
                type: 'save',
                payload: {
                    proj_cos_draft_flag: proj_cos_draft_flag
                }
            });


            //确定返回的预算中的年份
            let yearList = [];
            for (let i = 0; i < deptBudgetData.DataRows.length; i++) {
                if (!isInArray(yearList, deptBudgetData.DataRows[i].year)) {
                    yearList.push(deptBudgetData.DataRows[i].year);
                }
            }
            //数据存储的项目采购成本总列表
            let purchasePostData = {
                transjsonarray: JSON.stringify({
                    "condition": {"fee_subtype": "0"},
                    "sequence": [{"index_num": "0"}]
                })
            };
            let purchaseAllCostData = yield call(projServices.queryCostList, purchasePostData); // 费用类型查询 第五个服务
            //数据存储的项目实施成本总列表
            let carryOutPostData = {
                transjsonarray: JSON.stringify({
                    "condition": {"fee_subtype": "1"},
                    "sequence": [{"index_num": "0"}]
                })
            };
            let carryOutAllCostData = yield call(projServices.queryCostList, carryOutPostData);
            //数据存储的项目运行成本总列表
            let operatePostData = {
                transjsonarray: JSON.stringify({
                    "condition": {"fee_subtype": "3"},
                    "sequence": [{"index_num": "0"}]
                })
            };
            let operateAllCostData = yield call(projServices.queryCostList, operatePostData);

            // 所有部门列表
            allDeptData.DataRows.map((i) => {
                i.opt_type = 'search';
                return i
            });
            // 返回的当前tab的预算数据
            deptBudgetData.DataRows.map((i) => {
                i.opt_type = 'search';
                return i
            });

            //purchaseAllCostData.DataRows.map((i)=>{i.opt_type='search';return i});
            //carryOutAllCostData.DataRows.map((i)=>{i.opt_type='search';return i});
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

            yield put({
                type: 'save',
                payload: {
                    allDeptList: allDeptData.DataRows,
                    deptBudgetList: deptBudgetData.DataRows,
                    deptBudgetListOriginal: JSON.parse(JSON.stringify(deptBudgetData.DataRows)),
                    yearList: yearList,
                    yearListOriginal: JSON.parse(JSON.stringify(yearList)),
                    purchaseAllCostList: purchaseAllCostData.DataRows,
                    carryOutAllCostList: carryOutAllCostData.DataRows,
                    operateAllCostList: operateAllCostData.DataRows,
                    fullCostYearList: fullCostYearList
                }
            });
            yield put ({
                type:"queryFullCostData",
            })
            // 强制刷新
            yield put({
                type: 'save',
                payload: {
                    loading2: false,
                }
            });
            //转变数据
            yield put({
                type: 'convertFullCostData',
                isFirstTime: true
            });

        },
        /**
         * 作者：邓广晖
         * 创建日期：2017-11-21
         * 功能：转变数据
         * @param isFirstTime 是否是第一次转换
         */
        * convertFullCostData({isFirstTime}, {put, select}) {
            let {yearList, allDeptList, deptBudgetList, fullCostYearList} = yield select(state => state.projChangeApply);
            yearList = yearList.sort();   //年份需要排序
            allDeptList = allDeptList.filter(item => item.opt_type !== 'delete');
            deptBudgetList = deptBudgetList.filter(item => item.opt_type !== 'delete');
            //计算所有工时之和
            let predictTimeTotal = 0;
            for (let indexp = 0; indexp < deptBudgetList.length; indexp++) {
                if (deptBudgetList[indexp].fee_type === '0' && deptBudgetList[indexp].fee_subtype === '-1') {
                    predictTimeTotal += Number(deptBudgetList[indexp].fee);
                }
            }
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
            //                         predictTimeTotal:[3,7]         //每个部门的预计工时
            //                   2017:{yearRowSpan:x,                                             时间列的高度
            //                         purchaseCostList:['xxxx费用1'，‘xxxx费用2’],            2.1.1子项采购费用类别列表 纵向
            //                         purchaseDeptTotal:[12,35]  //每个部门的所有xxxx费用之和         2.1 采购成本 横向
            //                         operateCostList:['zzz费用1'，‘zzzz费用2’]，                    2.2.1 运行成本 纵向
            //                         operateDeptTotal:[78,10]   //每个部门的所有zzzz（运行）费用之和   2.2 横向数据
            //                         carryOutCostList:['yyyy费用1'，‘yyyy费用2’]},               2.3.1  实施成本 子项 纵向
            //                         carryOutDeptTotal:[38,68]  //每个部门的所有yyyy费用之和         2.3  实施成本  横向
            //                         humanCostTotal:[12,67]         // 每个部门的人工成本           2.4   人工成本 横向
            //                         predictTimeTotal:[3,7]         //每个部门的预计工时              1   预计工时 横向
            //                  }

            if (yearList.length === 0) {
                yearList = fullCostYearList.sort(); // 如果没有返回数据，就显示可添加数据的年份 wxd
            }


            // 表格的全部框架样式
            if (yearList.length) {
                //计算年份的rowspan
                for (let yearIndex = 0; yearIndex < yearList.length; yearIndex++) {
                    //预计工时，直接成本，项目采购成本，项目运行成本，项目实施成本，项目人工成本默认存在，yearRowSpan 默认加 6
                    let yearRowSpan = 0;
                    let purchaseCostList = [];   //项目采购成本列表  采购成本有几个小项
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
                    let purchaseDeptTotal = [];  //每个部门的所有xxxx费用之和的列表   采购成本和2.1
                    let operateDeptTotal = [];   //每个部门的所有zzzz费用之和的列表    运行成本2.2
                    let carryOutDeptTotal = [];  //每个部门的所有yyyy费用之和的列表    实施成本2.3
                    let humanCostTotal = [];          //项目人工成本列表（每个部门）   人工成本2.4
                    let predictTimeTotal = [];         //每个部门的预计工时           预计工时1
                    for (let deptIndexx = 0; deptIndexx < allDeptList.length; deptIndexx++) {
                        let purchaseDeptValue = 0; // 采购成本的合计
                        let operateDeptValue = 0;
                        let carryOutDeptValue = 0;
                        let humanCostValue = 0;
                        let predictTimeValue = 0;
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
                                } else if (deptBudgetList[cellDataIndexx].fee_type === '0') {
                                    if (deptBudgetList[cellDataIndexx].fee_subtype === '-1') {
                                        predictTimeValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    }
                                }
                            }
                        }
                        purchaseDeptTotal.push(purchaseDeptValue.toFixed(2)); // 直接成本-采购成本 的 合计
                        operateDeptTotal.push(operateDeptValue.toFixed(2));
                        carryOutDeptTotal.push(carryOutDeptValue.toFixed(2));
                        humanCostTotal.push(humanCostValue.toFixed(2));
                        predictTimeTotal.push(predictTimeValue.toFixed(1));
                    }// 按照部门的for循环 end  每一个部门都有5项
                    yearRowSpan = purchaseCostList.length + operateCostList.length + carryOutCostList.length + 6;
                    yearListRowSpan[yearList[yearIndex]] = {
                        yearRowSpan: yearRowSpan,
                        purchaseCostList: purchaseCostList,  // 采购成本子项名称
                        purchaseDeptTotal: purchaseDeptTotal, // 采购成本总和，各个部门的列表
                        operateCostList: operateCostList,
                        operateDeptTotal: operateDeptTotal,
                        carryOutCostList: carryOutCostList,
                        carryOutDeptTotal: carryOutDeptTotal,
                        humanCostTotal: humanCostTotal,
                        predictTimeTotal: predictTimeTotal
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
                    obj.yearRowSpan = yearListRowSpan[yearList[yearIndex2]].yearRowSpan; // 这一年对应类别的行数
                    obj.fee_name = config.PREDICT_TIME; //"1.预计工时（人月）",
                    obj.no_pre_fee_name = config.NO_PREFIX_PREDICT; //"预计工时（人月）",  没有前置编号
                    obj.padLeft = '0px';
                    obj.feeType = '0';         //  0 代表预计工时，1 代表 预算
                    obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
                    let predictTime = 0;
                    for (let i = 0; i < allDeptList.length; i++) {
                        let findPredictTime = false;
                        for (let cellDataIndex2 = 0; cellDataIndex2 < deptBudgetList.length; cellDataIndex2++) {
                            //年相同就添加一条数据
                            if (yearList[yearIndex2] === deptBudgetList[cellDataIndex2].year) {
                                if (deptBudgetList[cellDataIndex2].fee_type === '0' &&
                                    deptBudgetList[cellDataIndex2].fee_subtype === '-1') {
                                    if (allDeptList[i].dept_name === deptBudgetList[cellDataIndex2].dept_name) {
                                        if (isFirstTime === true) {
                                            // 表头有这一项
                                            obj['dept' + i.toString()] = Number(deptBudgetList[cellDataIndex2].fee).toFixed(1);
                                        } else {
                                            obj['dept' + i.toString()] = deptBudgetList[cellDataIndex2].fee;
                                        }
                                        predictTime += Number(deptBudgetList[cellDataIndex2].fee);
                                        findPredictTime = true;
                                        break;
                                    }
                                }
                            }
                        }//end for
                        //如果没有这种类型的数据，数据源加一条
                        if (findPredictTime === false) {
                            deptBudgetList.push({
                                year: yearList[yearIndex2],
                                ou: changeOuName(allDeptList[i].dept_name.split('-')[0]),
                                fee: '0.0',
                                dept_name: allDeptList[i].dept_name,
                                fee_type: '0',
                                fee_subtype: '-1',
                                fee_name: config.NO_PREFIX_PREDICT,
                                budget_uid: getUuid(32, 62),
                                opt_type: 'insert',
                            });
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
                    obj.no_pre_fee_name = config.NO_PREFIX_DIRECT_COST;//直接成本
                    obj.not_edit = 'not_edit';
                    obj.padLeft = '0px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
                    let directCostTotal = 0;
                    for (let j = 0; j < allDeptList.length; j++) {
                        let directCost = Number(yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].humanCostTotal[j]);
                        obj['dept' + j.toString()] = directCost.toFixed(2);
                        directCostTotal += directCost;
                    }//end for
                    obj.total = directCostTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.1添加项目采购成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.PURCHASE_COST;
                    obj.no_pre_fee_name = config.NO_PREFIX_PURCHASE_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    obj.feeNameLevel = '2';    //  费用项的目录级别  1 2 3
                    obj.not_edit = 'not_edit';
                    obj.can_add = 'can_add';
                    obj.add_type = 'purchase';
                    let purchaseAllTotal = 0;
                    for (let k = 0; k < allDeptList.length; k++) {
                        obj['dept' + k.toString()] = yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[k];
                        purchaseAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[k]);
                    }//end for
                    obj.total = purchaseAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.1. 添加项目采购成本-子费用
                    let purchaseCostTypeList = yearListRowSpan[yearList[yearIndex2]].purchaseCostList; // 采购成本的子项名称
                    for (let purchaseIndex = 0; purchaseIndex < purchaseCostTypeList.length; purchaseIndex++) {
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.1.' + (purchaseIndex + 1).toString() + purchaseCostTypeList[purchaseIndex];
                        obj.no_pre_fee_name = purchaseCostTypeList[purchaseIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        obj.feeNameLevel = '3';    //  费用项的目录级别  1 2 3
                        let purchaseTotal = 0;
                        for (let p = 0; p < allDeptList.length; p++) {
                            let findPurchase = false;
                            for (let cellDataIndex3 = 0; cellDataIndex3 < deptBudgetList.length; cellDataIndex3++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex3].year &&
                                    purchaseCostTypeList[purchaseIndex].trim() === deptBudgetList[cellDataIndex3].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex3].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex3].fee_subtype === '0') {
                                        if (allDeptList[p].dept_name === deptBudgetList[cellDataIndex3].dept_name) {
                                            if (isFirstTime === true) {
                                                obj['dept' + p.toString()] = Number(deptBudgetList[cellDataIndex3].fee).toFixed(2);
                                            } else {
                                                obj['dept' + p.toString()] = deptBudgetList[cellDataIndex3].fee;
                                            }
                                            purchaseTotal += Number(deptBudgetList[cellDataIndex3].fee);
                                            findPurchase = true;
                                            break;
                                        }
                                    }
                                }
                            }//end for
                            if (findPurchase === false) {
                                deptBudgetList.push({
                                    year: yearList[yearIndex2],
                                    ou: changeOuName(allDeptList[p].dept_name.split('-')[0]),
                                    fee: '0.00',
                                    dept_name: allDeptList[p].dept_name,
                                    fee_type: '1',
                                    fee_subtype: '0',
                                    fee_name: purchaseCostTypeList[purchaseIndex],
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                });
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
                    obj.no_pre_fee_name = config.NO_PREFIX_OPERATE_COST;
                    obj.not_edit = 'not_edit';
                    //obj.can_add = 'can_add';
                    obj.add_type = 'operate';
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
                    let operateAllTotal = 0;
                    for (let m = 0; m < allDeptList.length; m++) {
                        obj['dept' + m.toString()] = yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[m];
                        operateAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[m]);
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
                        obj.feeNameLevel = '3';    //  费用项的目录级别  1 2 3
                        let operateTotal = 0;
                        for (let jj = 0; jj < allDeptList.length; jj++) {
                            let findOperate = false;
                            for (let cellDataIndex44 = 0; cellDataIndex44 < deptBudgetList.length; cellDataIndex44++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex44].year &&
                                    operateCostTypeList[operateIndex] === deptBudgetList[cellDataIndex44].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex44].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex44].fee_subtype === '3') {
                                        if (allDeptList[jj].dept_name === deptBudgetList[cellDataIndex44].dept_name) {
                                            if (isFirstTime === true) {
                                                obj['dept' + jj.toString()] = Number(deptBudgetList[cellDataIndex44].fee).toFixed(2);
                                            } else {
                                                obj['dept' + jj.toString()] = deptBudgetList[cellDataIndex44].fee;
                                            }
                                            operateTotal += Number(deptBudgetList[cellDataIndex44].fee);
                                            findOperate = true;
                                            break;
                                        }
                                    }
                                }
                            }//end for
                            if (findOperate === false) {
                                deptBudgetList.push({
                                    year: yearList[yearIndex2],
                                    ou: changeOuName(allDeptList[jj].dept_name.split('-')[0]),
                                    fee: '0.00',
                                    dept_name: allDeptList[jj].dept_name,
                                    fee_type: '1',
                                    fee_subtype: '3',
                                    fee_name: operateCostTypeList[operateIndex],
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                });
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
                    obj.no_pre_fee_name = config.NO_PREFIX_CARRYOUT_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    obj.feeNameLevel = '2';    //  费用项的目录级别  1 2 3
                    obj.not_edit = 'not_edit';
                    obj.can_add = 'can_add';
                    obj.add_type = 'carryOut';
                    let carryOutAllTotal = 0;
                    for (let ii = 0; ii < allDeptList.length; ii++) {
                        obj['dept' + ii.toString()] = yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii];
                        carryOutAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii]);
                    }//end for
                    obj.total = carryOutAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.3. 添加项目实施成本-子费用
                    let carryOutCostTypeList = yearListRowSpan[yearList[yearIndex2]].carryOutCostList;
                    let {carryOutAllCostList} = yield select(state => state.projChangeApply);
                    for (let carryOutIndex = 0; carryOutIndex < carryOutCostTypeList.length; carryOutIndex++) {
                        //通过名字找到对应的费用项，获取 fee_class 的值
                        let carryOutFeeClass = carryOutAllCostList.filter((item) => item.fee_name === carryOutCostTypeList[carryOutIndex]);
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.3.' + (carryOutIndex + 1).toString() + carryOutCostTypeList[carryOutIndex];
                        obj.no_pre_fee_name = carryOutCostTypeList[carryOutIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        obj.feeNameLevel = '3';    //  费用项的目录级别  1 2 3
                        obj.fee_class = carryOutFeeClass[0].fee_class; // fee_class 1时不能修改编辑和删除
                        let carryOutTotal = 0;
                        for (let jj = 0; jj < allDeptList.length; jj++) {
                            let findCarryOut = false;
                            for (let cellDataIndex4 = 0; cellDataIndex4 < deptBudgetList.length; cellDataIndex4++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex4].year &&
                                    carryOutCostTypeList[carryOutIndex] === deptBudgetList[cellDataIndex4].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex4].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex4].fee_subtype === '1') {
                                        if (allDeptList[jj].dept_name === deptBudgetList[cellDataIndex4].dept_name) {
                                            if (isFirstTime === true) {
                                                obj['dept' + jj.toString()] = Number(deptBudgetList[cellDataIndex4].fee).toFixed(2);
                                            } else {
                                                obj['dept' + jj.toString()] = deptBudgetList[cellDataIndex4].fee;
                                            }
                                            carryOutTotal += Number(deptBudgetList[cellDataIndex4].fee);
                                            findCarryOut = true;
                                            break;
                                        }
                                    }
                                }
                            }//end for
                            if (findCarryOut === false) {
                                deptBudgetList.push({
                                    year: yearList[yearIndex2],
                                    ou: changeOuName(allDeptList[jj].dept_name.split('-')[0]),
                                    fee: '0.00',
                                    dept_name: allDeptList[jj].dept_name,
                                    fee_type: '1',
                                    fee_subtype: '1',
                                    fee_name: carryOutCostTypeList[carryOutIndex],
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                });
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
                    obj.no_pre_fee_name = config.NO_PREFIX_HUMAN_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    obj.feeNameLevel = '2';    //  费用项的目录级别  1 2 3
                    let humanCostTotal = 0;
                    for (let b = 0; b < allDeptList.length; b++) {
                        let findHumanCost = false;
                        for (let cellDataIndex5 = 0; cellDataIndex5 < deptBudgetList.length; cellDataIndex5++) {
                            if (yearList[yearIndex2] === deptBudgetList[cellDataIndex5].year) {
                                if (deptBudgetList[cellDataIndex5].fee_type === '1' &&
                                    deptBudgetList[cellDataIndex5].fee_subtype === '2') {
                                    if (allDeptList[b].dept_name === deptBudgetList[cellDataIndex5].dept_name) {
                                        if (isFirstTime === true) {
                                            obj['dept' + b.toString()] = Number(deptBudgetList[cellDataIndex5].fee).toFixed(2);
                                        } else {
                                            obj['dept' + b.toString()] = deptBudgetList[cellDataIndex5].fee;
                                        }
                                        humanCostTotal += Number(deptBudgetList[cellDataIndex5].fee);
                                        findHumanCost = true;
                                        break;
                                    }
                                }
                            }
                        }//end for
                        if (findHumanCost === false) {
                            deptBudgetList.push({
                                year: yearList[yearIndex2],
                                ou: changeOuName(allDeptList[b].dept_name.split('-')[0]),
                                fee: '0.00',
                                dept_name: allDeptList[b].dept_name,
                                fee_type: '1',
                                fee_subtype: '2',
                                fee_name: config.NO_PREFIX_HUMAN_COST,
                                budget_uid: getUuid(32, 62),
                                opt_type: 'insert',
                            });
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
                obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
                obj.yearOptType = 'total';
                obj.not_input = 'not_input';
                for (let de = 0; de < allDeptList.length; de++) {
                    let allYearTotal = 0;
                    for (let yi = 0; yi < yearList.length; yi++) {
                        allYearTotal += Number(yearListRowSpan[yearList[yi]].purchaseDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].operateDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].carryOutDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].humanCostTotal[de]);
                    }
                    allTableTotal += allYearTotal;
                    obj['dept' + de.toString()] = allYearTotal.toFixed(2);
                }//end for
                obj.total = allTableTotal.toFixed(2);
                deptBudgetTableData.push(obj);
            }
            //deptBudgetTableData.map((i,index)=>{ i.key=index;return i});
            for (let indexd = 0; indexd < deptBudgetTableData.length; indexd++) {
                deptBudgetTableData[indexd].key = indexd;
            }
            //如果是第一次查询，保存
            if (isFirstTime === true) {
                yield put({
                    type: 'save',
                    payload: {deptBudgetList: JSON.parse(JSON.stringify(deptBudgetList))}
                });
            }
            yield put({
                type: 'save',
                payload: {
                    deptBudgetTableData: JSON.parse(JSON.stringify(deptBudgetTableData)),
                    yearList: JSON.parse(JSON.stringify(yearList)),
                    //allDeptList:JSON.parse(JSON.stringify(allDeptList)),
                    predictTimeTotal: predictTimeTotal.toFixed(1),
                    yearListRowSpan: JSON.parse(JSON.stringify(yearListRowSpan)),
                    allTableTotal: allTableTotal
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-16
         * 功能：添加配合部门
         * @param deptSelectData 已选中的部门 // 此处已经变成已经选中的人员 包含部门信息
         */
        * addCoorpDept({deptSelectData}, {put, select}) {
            let coorpDeptListTemp = [];
            let {queryData, coorpDeptList, allDeptList, deptBudgetList, yearList, yearListRowSpan} = yield select(state => state.projChangeApply);
            //如果选了更多的配合部门，将新添加的配合部门添加到列表 // wxd新需求只添加一个人，只有一个部门
            if (deptSelectData.length) {
                let deptIsRepeated = false;
                //首先判断是否有与存在的部门重复，包括主责部门和配合部门
                for (let i = 0; i < deptSelectData.length; i++) {
                    if (deptSelectData[i].dept_name === allDeptList[0].dept_name) { //主责部门
                        deptIsRepeated = true;
                        message.error(deptSelectData[i].dept_name + '为主责部门，请重新添加');  //添加的配合部门不能为主责部门
                        break;
                    }
                    //如果有配合部门，还需要和已经添加的配合进行对比，不能重复,同时需要去除类型为delete的
                    if (coorpDeptList.length) {
                        for (let j = 0; j < coorpDeptList.length; j++) {
                            if (deptSelectData[i].dept_name === coorpDeptList[j].dept_name && coorpDeptList[j].opt_type !== 'delete') {
                                deptIsRepeated = true;
                                message.error(deptSelectData[i].dept_name + '已经存在，请重新添加');
                                break;
                            }
                        }
                        if (deptIsRepeated === true) {
                            break;
                        }
                    }
                }
                //如果没有重复的再进行添加
                if (deptIsRepeated === false) {
                    for (let i = 0; i < deptSelectData.length; i++) {
                        coorpDeptListTemp.push({
                                dept_name: deptSelectData[i].dept_name,
                                dept_uid: getUuid(32, 62),
                                key: coorpDeptList.length + i,
                                proj_id: queryData.arg_proj_id,
                                opt_type: 'insert',
                                mgr_name: deptSelectData[i].username, // 这个值新添加
                                mgr_id: deptSelectData[i].userid,// 员工编号
                                // mgr_name: `${deptSelectData[i].username}(${deptSelectData[i].userid})`, // 这个值新添加
                                NewOldFlag: '（新）',
                                ou: changeOuName(deptSelectData[i].dept_name.split('-')[0]),

                            }
                        );
                        //对于选中的每一个部门，将其添加到deptBudgetList
                        for (let yi = 0; yi < yearList.length; yi++) {
                            //对于每一年，需要添加预计工时和各项直接成本，默认值都为0
                            //1.添加预计工时
                            deptBudgetList.push({
                                year: yearList[yi],
                                fee_type: '0',
                                fee_subtype: '-1',
                                fee: '0',
                                fee_name: config.NO_PREFIX_PREDICT,
                                dept_name: deptSelectData[i].dept_name,
                                ou: changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                                budget_uid: getUuid(32, 62),
                                opt_type: 'insert',
                                proj_id: queryData.arg_proj_id,
                                dept_uid: deptSelectData[i].dept_id,
                            });

                            //2.添加直接成本中的采购成本
                            let purchaseCostList = yearListRowSpan[yearList[yi]].purchaseCostList;
                            for (let pi = 0; pi < purchaseCostList.length; pi++) {
                                deptBudgetList.push({
                                    year: yearList[yi],
                                    fee_type: '1',
                                    fee_subtype: '0',
                                    fee: '0',
                                    fee_name: purchaseCostList[pi],
                                    dept_name: deptSelectData[i].dept_name,
                                    ou: changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_id: queryData.arg_proj_id,
                                    dept_uid: deptSelectData[i].dept_id,
                                });
                            }

                            //3.添加直接成本中的运行成本
                            let operateCostList = yearListRowSpan[yearList[yi]].operateCostList;
                            for (let oi = 0; oi < operateCostList.length; oi++) {
                                deptBudgetList.push({
                                    year: yearList[yi],
                                    fee_type: '1',
                                    fee_subtype: '3',
                                    fee: '0',
                                    fee_name: operateCostList[oi],
                                    dept_name: deptSelectData[i].dept_name,
                                    ou: changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_uid: queryData.arg_proj_id,
                                    dept_uid: deptSelectData[i].dept_id,
                                });
                            }

                            //4.添加直接成本中的实施成本
                            let carryOutCostList = yearListRowSpan[yearList[yi]].carryOutCostList;
                            for (let ci = 0; ci < carryOutCostList.length; ci++) {
                                deptBudgetList.push({
                                    year: yearList[yi],
                                    fee_type: '1',
                                    fee_subtype: '1',
                                    fee: '0',
                                    fee_name: carryOutCostList[ci],
                                    dept_name: deptSelectData[i].dept_name,
                                    ou: changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_id: queryData.arg_proj_id,
                                    dept_uid: deptSelectData[i].dept_id,
                                });
                            }
                            //5.添加人工成本
                            deptBudgetList.push({
                                year: yearList[yi],
                                fee_type: '1',
                                fee_subtype: '2',
                                fee: '0',
                                fee_name: config.NO_PREFIX_HUMAN_COST,
                                dept_name: deptSelectData[i].dept_name,
                                ou: changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                                budget_uid: getUuid(32, 62),
                                opt_type: 'insert',
                                proj_id: queryData.arg_proj_id,
                                dept_uid: deptSelectData[i].dept_id,
                            });
                        }//end for year
                    }
                    coorpDeptList = coorpDeptList.concat(coorpDeptListTemp);
                    allDeptList = allDeptList.concat(coorpDeptListTemp);
                    yield put({
                        type: 'save',
                        payload: {
                            coorpDeptList: coorpDeptList,
                            allDeptList: allDeptList,
                            deptBudgetList: deptBudgetList,
                        }
                    });
                    //转变数据
                    yield put({
                        type: 'convertFullCostData',
                        isFirstTime: false
                    });
                }
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-20
         * 功能：删除配合部门
         * @param index 已选中的部门
         */
        * deleteCoorpDept({index}, {call, put, select}) {
            let {coorpDeptList, allDeptList, deptBudgetList, projOldInfo,deptNum} = yield select(state => state.projChangeApply);
            //先判断是否可以删除(1,该项目中已产生成本,2,该项目中尚有启用成员)
            if (coorpDeptList[index].opt_type !== 'insert') {
                // 加判断，是否是最后一个
                let thisDept = deptNum.filter(item=>item.dept_name===coorpDeptList[index].dept_name)[0];
                if(Number(thisDept.dept_num) === 1){ // 返回的数据是字符
                    let costPostData = {
                        arg_proj_id: projOldInfo.proj_id,
                        arg_ou: coorpDeptList[index].ou,
                        arg_proj_code: projOldInfo.proj_code,
                        arg_dept_name: coorpDeptList[index].dept_name,
                    };
                    const costData = yield call(projServices.queryCostData, costPostData);
                    if (costData.cos_delete_flag !== 'true') {
                        message.error(coorpDeptList[index].dept_name + '在该项目中已产生成本，不能删除该部门！'); // 可去除 暂时
                        return;
                    } else {
                        let memberPostData = {
                            arg_proj_id: projOldInfo.proj_id,
                            arg_dept_name: coorpDeptList[index].dept_name,
                            arg_tenantid: Cookie.get('tenantid')
                        };
                        const memberData = yield call(projServices.queryMemberData, memberPostData);
                        if (memberData.RowCount !== '0') {
                            message.error(coorpDeptList[index].dept_name + '在该项目中尚有启用成员，不能删除该部门！'); // 可去除 暂时
                            return;
                        }
                    }
                }else if(Number(thisDept.dept_num)>1){
                    deptNum.forEach(item =>{
                        if(item.dept_name===coorpDeptList[index].dept_name){
                            item.dept_num = Number(item.dept_num) - 1
                        }
                    })

                    yield put({
                        type: 'save',
                        payload:{
                            deptNum: JSON.parse(JSON.stringify(deptNum)),
                        }
                    })


                }else{
                    console.log('Counter error!!')
                }
            }

            /*都没有问题，处理部门预算列表*/
            let deptBudgetListNew = [];
            for (let di = 0; di < deptBudgetList.length; di++) {
                if (deptBudgetList[di].dept_name !== coorpDeptList[index].dept_name) {
                    //如果部门不相等，将其加入新列表
                    deptBudgetListNew.push(deptBudgetList[di]);
                } else {
                    //如果部门相等，查询出来的部门数据(search,delete,update)，将其加入New,将标志改为delete，如果是新加入的(insert)，不加入
                    if (deptBudgetList[di].opt_type !== 'insert') {
                        deptBudgetList[di].opt_type = 'delete';
                        deptBudgetListNew.push(deptBudgetList[di]);
                    }
                }
            }
            //处理配合部门
            if (coorpDeptList[index].opt_type !== 'insert') {
                coorpDeptList[index].opt_type = 'delete';
            } else {
                coorpDeptList.splice(index, 1);
            }
            //处理所有部门
            if (allDeptList[index + 1].opt_type !== 'insert') {
                allDeptList[index + 1].opt_type = 'delete';
            } else {
                allDeptList.splice(index + 1, 1);
            }
            //处理之后将key值重排
            //coorpDeptList.map((item,indexc) => {item.key = indexc;return item});
            for (let i = 0; i < coorpDeptList.length; i++) {
                coorpDeptList[i].key = i;
            }
            yield put({
                type: 'save',
                payload: {
                    deptBudgetList: JSON.parse(JSON.stringify(deptBudgetListNew)),
                    coorpDeptList: JSON.parse(JSON.stringify(coorpDeptList)),
                    allDeptList: JSON.parse(JSON.stringify(allDeptList))
                }
            });

            //转变数据
            yield put({
                type: 'convertFullCostData',
                isFirstTime: false
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-20
         * 功能：删除配合部门
         * @param index 配合部门索引值
         * @param text 配合部门联系人文本的id
         */
        * editCoorpMgrName({index, text}, {put, select}) {
            let {coorpDeptList, coorpDeptListOriginal, deptPersonList} = yield select(state => state.projChangeApply);
            //如果编辑的是查询出来的配合部门
            if (coorpDeptList[index].opt_type !== 'insert') {
                //如果配合部门联系人于最原始查出来的联系人不一样，将标志设置为 update
                if (text !== coorpDeptListOriginal[index].mgr_id) {
                    coorpDeptList[index].opt_type = 'update';
                } else {
                    //如果改过后，又改回原来的值
                    coorpDeptList[index].opt_type = 'search';
                }
            }
            //不管是查询的配合部门还是新增的配合部门，修改了，就修改内容
            if (coorpDeptList[index].mgr_id !== text) {
                coorpDeptList[index].mgr_id = text;
                coorpDeptList[index].mgr_name = deptPersonList.filter(item => item.userid === text)[0].username;
            }

            yield put({
                type: 'save',
                payload: {coorpDeptList: JSON.parse(JSON.stringify(coorpDeptList))}
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-23
         * 功能：编辑表格单元格数据
         * @param value 单元格数据
         * @param year 年份
         * @param deptName 部门
         * @param noPreFeeName 没有前缀的费用名
         */
        * editCellData({value, year, deptName, noPreFeeName}, {put, select}) {
            //const jointDataList = jointData.split("++");
            let {deptBudgetList, deptBudgetListOriginal} = yield select(state => state.projChangeApply);
            for (let i = 0; i < deptBudgetList.length; i++) {
                if (deptBudgetList[i].year === year &&
                    deptBudgetList[i].dept_name === deptName &&
                    deptBudgetList[i].fee_name.trim() === noPreFeeName.trim()) {
                    //如果编辑的是查询出来的单元格
                    if (deptBudgetList[i].opt_type !== 'insert') {
                        if (Number(deptBudgetListOriginal[i].fee) !== Number(value)) {
                            deptBudgetList[i].opt_type = 'update';
                        } else {
                            deptBudgetList[i].opt_type = 'search';
                        }
                    }
                    //不管是查询的单元格还是新增的单元格，内容修改了，就修改内容(包括 5.  5.0  5)
                    if (deptBudgetList[i].fee !== value) {
                        deptBudgetList[i].fee = value;
                    }
                    break;
                }
            }
            yield put({
                type: 'save',
                payload: {
                    deptBudgetList: JSON.parse(JSON.stringify(deptBudgetList))
                }
            });
            //转变数据
            yield put({
                type: 'convertFullCostData',
                isFirstTime: false
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-23
         * 功能：增加费用项
         * @param value 费用项的值
         * @param fee_type 费用主类型
         * @param fee_subtype 费用子类型
         * @param year 年份
         */
        * addCostType({value, fee_type, fee_subtype, year}, {put, select}) {
            let {queryData, deptBudgetList, allDeptList} = yield select(state => state.projChangeApply);
            allDeptList = allDeptList.filter(item => item.opt_type !== 'delete');
            for (let i = 0; i < allDeptList.length; i++) {
                deptBudgetList.push({
                    year: year,
                    fee_type: fee_type,
                    fee_subtype: fee_subtype,
                    fee: '0',
                    fee_name: value,
                    dept_name: allDeptList[i].dept_name,
                    ou: changeOuName(allDeptList[i].dept_name.split('-')[0]),
                    budget_uid: getUuid(32, 62),
                    opt_type: 'insert',
                    proj_id: queryData.arg_proj_id,
                    dept_uid: allDeptList[i].deptid,
                });
            }

            yield put({
                type: 'save',
                payload: {
                    deptBudgetList: JSON.parse(JSON.stringify(deptBudgetList)),
                }
            });
            //转变数据
            yield put({
                type: 'convertFullCostData',
                isFirstTime: false
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-23
         * 功能：删除费用项
         * @param value 费用项
         * @param year 年份
         * @param put 返回reducer
         * @param select 获取model的state
         */
        * deleteCostType({value, year}, {put, select}) {
            let {deptBudgetList} = yield select(state => state.projChangeApply);
            let deptBudgetListNew = [];
            //如果删除的是新增的费用项，直接删除,即不添加到新的里面
            for (let i = 0; i < deptBudgetList.length; i++) {
                if (deptBudgetList[i].year === year && deptBudgetList[i].fee_name.trim() === value) {
                    if (deptBudgetList[i].opt_type !== 'insert') {
                        //如果删除的是查询出来的，opt_type 设为 delete
                        deptBudgetList[i].opt_type = 'delete';
                        deptBudgetListNew.push(deptBudgetList[i]);
                    }
                } else {
                    deptBudgetListNew.push(deptBudgetList[i]);
                }
            }
            yield put({
                type: 'save',
                payload: {
                    deptBudgetList: JSON.parse(JSON.stringify(deptBudgetListNew)),
                }
            });
            //转变数据
            yield put({
                type: 'convertFullCostData',
                isFirstTime: false
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-24
         * 功能：添加年份费用项
         * @param value 费用项
         * @param year 年份
         */
        * addYear({year}, {put, select}) {
            let {queryData, deptBudgetList, allDeptList, yearList} = yield select(state => state.projChangeApply);
            yearList.push(year);
            allDeptList = allDeptList.filter(item => item.opt_type !== 'delete');
            //添加年份时，只添加1.预计工时  和  2.3项目人工成本
            for (let i = 0; i < allDeptList.length; i++) {
                //添加预计工时
                deptBudgetList.push({
                    year: year,
                    fee_type: '0',
                    fee_subtype: '-1',
                    fee: '0',
                    fee_name: config.NO_PREFIX_PREDICT,
                    dept_name: allDeptList[i].dept_name,
                    ou: changeOuName(allDeptList[i].dept_name.split('-')[0]),
                    budget_uid: getUuid(32, 62),
                    opt_type: 'insert',
                    proj_id: queryData.arg_proj_id,
                    dept_uid: allDeptList[i].deptid,
                });
                //添加项目人工成本
                deptBudgetList.push({
                    year: year,
                    fee_type: '1',
                    fee_subtype: '2',
                    fee: '0',
                    fee_name: config.NO_PREFIX_HUMAN_COST,
                    dept_name: allDeptList[i].dept_name,
                    ou: changeOuName(allDeptList[i].dept_name.split('-')[0]),
                    budget_uid: getUuid(32, 62),
                    opt_type: 'insert',
                    proj_id: queryData.arg_proj_id,
                    dept_uid: allDeptList[i].deptid,
                });
            }//end for
            yield put({
                type: 'save',
                payload: {
                    yearList: yearList,
                    deptBudgetList: JSON.parse(JSON.stringify(deptBudgetList))
                }
            });
            //转变数据
            yield put({
                type: 'convertFullCostData',
                isFirstTime: false
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-24
         * 功能：删除年份费用项
         * @param value 费用项
         * @param year 年份
         */* deleteYear({year}, {put, select}) {
            let {deptBudgetList, yearList} = yield select(state => state.projChangeApply);
            yearList = yearList.filter(item => item !== year);
            let deptBudgetListNew = [];
            //如果删除的是新增的年份，直接删除,即不添加到新的里面
            for (let i = 0; i < deptBudgetList.length; i++) {
                if (deptBudgetList[i].year === year) {
                    if (deptBudgetList[i].opt_type !== 'insert') {
                        //如果删除的是查询出来的，opt_type 设为 delete
                        // if(!(deptBudgetList[i].fee_class==='1'&&deptBudgetList[i].fee == 0)){
                            deptBudgetList[i].opt_type = 'delete';
                            deptBudgetListNew.push(deptBudgetList[i]);
                        // }
                    }
                } else {
                    deptBudgetListNew.push(deptBudgetList[i]);
                }
            }
            yield put({
                type: 'save',
                payload: {
                    yearList: yearList,
                    deptBudgetList: JSON.parse(JSON.stringify(deptBudgetListNew))
                }
            });
            //转变数据
            yield put({
                type: 'convertFullCostData',
                isFirstTime: false
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-10-15
         * 功能：删除草稿
         */* deleteChangeApplyDraft({}, {select, call, put}) {
            let {queryData} = yield select(state => state.projChangeApply);
            let postData = {
                arg_proj_id: queryData.arg_proj_id,
                arg_opt_id: Cookie.get('userid'),        //操作人id，必传
                arg_opt_name: Cookie.get('username'),    //操作人姓名，必传
            };
            const data = yield call(projServices.deleteChangeApplyDraft, postData);
            if (data.RetCode === '1') {
                if (data.RetVal === '' || data.RetVal === undefined) {
                    message.success('重置成功！');
                } else {
                    message.success(data.RetVal);
                }
                /*yield put(routerRedux.push({
                    pathname: '/projectApp/projMonitor/change'
                }));*/
                yield put({
                    type: 'save',
                    payload: {
                        currentTabKey: 't1',
                    }
                });
                yield put({
                    type: 'projApplyBasicInfo'
                });
            }
        },

    },
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname === '/projectApp/projMonitor/change/projChangeApply' || pathname === '/projChangeModify') {
                    dispatch({type: 'initData'});
                    dispatch({type: 'saveQuery', query});
                    dispatch({type: 'projApplyBasicInfo', query});
                }
            });
        }
    }
}
