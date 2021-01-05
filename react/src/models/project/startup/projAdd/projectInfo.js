/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：项目启动的所有model数据
 */
import * as projServices from '../../../../services/project/projService';
import config from '../../../../utils/config';
import Cookie from 'js-cookie';
import {message} from 'antd';
import moment from 'moment';
import {routerRedux} from 'dva/router';
import { getOuBussinessId, isInArray } from '../../../../routes/project/projConst.js';
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
    namespace: 'projectInfo',
    state: {
        currentTabKey: 't1',
        projInfoFlag: '',                        //项目信息标志，新增（insert）草稿编辑（update）

        /*基本信息数据*/
        mainProjList: [],                         //主项目列表
        projTypeList: [],                         //项目类型列表
        projRelation: [],                         //关联项目列表
        is_limit_key:"",
        projRelSearch:[],
        projOldInfo: {},
        projNewUid: '',                           // proj_uid ，如果是新增项目，从后台获取，如果是草稿，直接获取
        basicInfoUuid: '',                        //基本信息表单唯一id，保证数据填充到表单
        pms_list: [],                             //pms编码列表，只在初始化时传值，后续对pms的操作在router里面
        /*里程碑数据*/
        mileModalType: '',                        //里程碑模态框类型
        mileStoneRecord:{},                       //里程碑列表中一行的记录
        mileStoneModalData: {},                   //里程碑模态框数据
        mileModalVisible: false,                  //里程碑编辑的模态框可见状态
        mileStoneList: [],
        mileStoneListOriginal: [],
        fore_workload: undefined,
        remainWorkLoad: undefined,
        begin_time: undefined,                    //里程碑里面使用的项目开始时间
        end_time: undefined,                      //里程碑里面使用的项目结束时间
        /*附件数据*/
        attachmentList: [],
        attachmentListOriginal: [],

        /*以下为全成本数据*/
        fullCostPmsTab: {},                      //显示高亮的pms的tab数据
        fullCostShowPmsTab: '0',                 //是否显示PMS的tab组件
        fullCostPmsListData: [],                 //pms的tab总数据
        yearListRowSpan: {},
        coorpDeptList: [],                        //配合部门列表
        coorpDeptListOriginal: [],
        allDeptList: [],                          //所有部门列表，第一个为主责部门
        deptBudgetList: [],                       //返回的部门预算数据
        deptBudgetListOriginal: [],
        deptBudgetTableData: [],                  //部门预算信息表格数据
        yearList: [],                             //显示的年份列表
        yearListOriginal: [],
        purchaseAllCostList: [],                  //采购成本类型列表
        operateAllCostList: [],                   //运行成本类型列表
        carryOutAllCostList: [],                  //实施成本类型列表
        fullCostYearList: [],                     //可添加的年份列表
        predictTimeTotal: '0',                    //预计工时综合
        allTableTotal: 0,                         //预算合计
        fullCostLoading: false,                   //全成本页面强制转圈
        oubudgetList:[],                          //全成本预算标准

        //其他数据
        TMOchecked: '-1',
        //本地姓名
        username:Cookie.get('username'),
        userid:Cookie.get('userid')
    },
    
    reducers: {
        initData(state){
            return {
                ...state,
                currentTabKey: 't1',
                projInfoFlag: '',                        //项目信息标志，新增（insert）草稿编辑（update）

                /*基本信息数据*/
                mainProjList: [],                         //主项目列表
                projTypeList: [],                         //项目类型列表
                projRelation: [],                         //关联项目列表
                is_limit_key:"",
                projRelSearch: [],
                projOldInfo: {},
                projNewUid: '',                           // proj_uid ，如果是新增项目，从后台获取，如果是草稿，直接获取
                basicInfoUuid: '',                        //基本信息表单唯一id，保证数据填充到表单
                pms_list: [],                             //pms编码列表，只在初始化时传值，后续对pms的操作在router里面
                /*里程碑数据*/
                mileModalType: '',                        //里程碑模态框类型
                mileStoneRecord:{},                       //里程碑列表中一行的记录
                mileStoneModalData: {},                   //里程碑模态框数据
                mileModalVisible: false,                  //里程碑编辑的模态框可见状态
                mileStoneList: [],
                mileStoneListOriginal: [],
                fore_workload: undefined,
                remainWorkLoad: undefined,
                begin_time: undefined,                    //里程碑里面使用的项目开始时间
                end_time: undefined,                      //里程碑里面使用的项目结束时间
                /*附件数据*/
                attachmentList: [],
                attachmentListOriginal: [],

                /*以下为全成本数据*/
                fullCostPmsTab: {},                      //显示高亮的pms的tab数据
                fullCostShowPmsTab: '0',                 //是否显示PMS的tab组件
                fullCostPmsListData: [],                 //pms的tab总数据
                yearListRowSpan: {},
                coorpDeptList: [],                        //配合部门列表
                coorpDeptListOriginal: [],
                allDeptList: [],                          //所有部门列表，第一个为主责部门
                deptBudgetList: [],                       //返回的部门预算数据
                deptBudgetListOriginal: [],
                deptBudgetTableData: [],                  //部门预算信息表格数据
                yearList: [],                             //显示的年份列表
                yearListOriginal: [],
                purchaseAllCostList: [],                  //采购成本类型列表
                operateAllCostList: [],                   //运行成本类型列表
                carryOutAllCostList: [],                  //实施成本类型列表
                fullCostYearList: [],                     //可添加的年份列表
                predictTimeTotal: '0',                    //预计工时综合
                allTableTotal: 0,                         //预算合计
                fullCostLoading: false,                   //全成本页面强制转圈
                oubudgetList:[],                          //全成本预算标准

                //其他数据
                TMOchecked: '-1',
            };
        },
        save(state, action) {
            return {...state, ...action.payload};
        },
    },
    effects: {
        /**
         * 作者：邓广晖
         * 创建日期：2017-10-24
         * 功能：先判断是不是经理角色，是，查询，不是，跳转
         */
        *initJudgeRoleAndSearch({}, {select, call, put}) {
            let postData = {
                'arg_userid': Cookie.get('staff_id')
            };
            const query = yield select(state => state.routing.locationBeforeTransitions.query);
            const judgeData = yield call(projServices.getPMRole, postData);
            if (judgeData.RetCode === '1' && judgeData.RetNum === '1') {
                yield put({type: 'mainProjQuery'});
                yield put({type: 'projTypeQuery'});
                yield put({type: 'projInfoNewQuery'});
                //yield put({type: 'projQuery'});
                //yield put({type: 'projuidCalculateRelation'});
                yield put({type: 'pmRoleSearch'});
            } else {
                message.info(config.NO_AUTHORITY);
                if (query.arg_check_id) {
                    yield put(routerRedux.push({
                        pathname: 'taskList'
                    }))
                } else {
                    yield put(routerRedux.push({
                        pathname: 'projectApp/projStartUp/projList'
                    }))
                }
            }
        },

        /**
         * 作者：胡月
         * 创建日期：2017-10-11
         * 功能：查询主项目的列表
         */
        *mainProjQuery({}, {call, put}) {
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
                type:'save',
                payload: {
                    mainProjList: data.DataRows,
                }
            });
        },

        /** 
        * 作者：金冠超
        * 创建日期：2019-6-12
        * 功能：查询关联项目的列表 
        **/
       *projQuery({},{call,put,select}){
        const query = yield select(state => state.routing.locationBeforeTransitions.query);
        let { projNewUid } = yield select(state => state.projectInfo);
        let{DataRows} = yield call(projServices.projQuery,{
            arg_userid: Cookie.get('userid'),
            arg_proj_uid: projNewUid,
            arg_is_check: query.is_check === '1' ? '1':'0'
        });
        yield put({
            type:'save',
            payload: {
                projRelation: DataRows,
            }
        });
    },
       /** 
        * 作者：金冠超
        * 创建日期：2019-8-6
        * 功能：关联项目（is_limit_key）查询
        **/
       *projuidCalculateRelation({},{call,put,select}){
        const query = yield select(state => state.routing.locationBeforeTransitions.query);
        let { projNewUid } = yield select(state => state.projectInfo);
        let postData = {
            arg_userid: Cookie.get('userid'),
            arg_proj_uid: projNewUid,
            arg_is_check: query.is_check === '1' ? '1':'0'
        }
        const data = yield call(projServices.projuidCalculateRelation,postData)
        yield put({
            type:'save',
            payload: {
                is_limit_key:data.is_limit_key,
            }
           
        });
       },
    
        /** 
        * 作者：金冠超
        * 创建日期：2019-6-12
        * 功能：显示基本信息 
        **/
    *pmRoleSearch({}, {call, put}) {
        let postData = {
            arg_userid: Cookie.get('staff_id'),
        };
        const data = yield call(projServices.getNewAddProjArth, postData);
        if (data.RetCode === '1') {
            yield put({
                type: 'save',
                payload: {
                    projRelSearch: data,
                }
            });
        }
    },

        /**
         * 作者：胡月
         * 创建日期：2017-10-11
         * 功能：查询项目类型的列表
         */
        *projTypeQuery({}, {call, put}) {
            let {DataRows} = yield call(projServices.getProjType, {
                transjsonarray: JSON.stringify({
                    "condition": {"type_state": "0"}, "sequence": [{"type_order": "0"}]
                })
            });
            yield put({
                type:'save',
                payload: {
                    projTypeList: DataRows,
                }
            });
        },

        /**
         * 作者：胡月
         * 创建日期：2017-10-11
         * 功能：查询项目的基本信息，新增项目，第一次进来时，用proj_userid查询proj_uid(唯一标识)
         *      如果不存在proj_uid，需要调用服务产生proj_uid；如果存在proj_uid，根据proj_uid查询项目基本信息
         */
        *projInfoNewQuery({}, {select, call, put}) {

            //查询完基本信息后，再查关联项目，用到 uid
            const query = yield select(state => state.routing.locationBeforeTransitions.query);
            let postData = {};
            let postUrl = '';
            //从待办进入，如果有arg_check_id，说明是退回的项目，点击修改，查询项目的基本信息
            if (query.arg_check_id) {
                postData = {
                    arg_flag: 0,
                    arg_check_id: query.arg_check_id
                };
                postUrl = projServices.getProjInfoNew4Task;
            } else {
                postData = {
                    arg_flag: 0,
                    arg_userid: Cookie.get('userid')
                };
                postUrl = projServices.getProjInfoNew;
            }
            const data = yield call(postUrl, postData);
            const uuidData = yield call(projServices.getProjUuid);
            if (data.DataRows.length === 0) {
                yield put({
                    type: 'save',
                    payload: {
                        projNewUid: uuidData.uuid,
                        projInfoFlag: 'insert',
                        projOldInfo: {},
                        basicInfoUuid: getUuid(32,64),         //每一次查询给基本信息表单一个唯一key，保证数据填充
                        pms_list: [],
                    }
                });
            } else {
                //提交状态还是保存状态
                let projObj = data.DataRows[0].info_form_state === '0' ? data.DataRows[0] : {};
                //预估投资替代额的元到万元的转换
                if ('replace_money' in projObj) {
                    projObj.replace_money = Number((Number(projObj.replace_money) / 10000).toFixed(6));
                }
                //添加Pms字段
                if (data.pms_list === undefined || data.pms_list === 'NaN') {
                    data.pms_list = [];
                } else {
                    let pms_list = JSON.parse(data.pms_list);
                    pms_list.forEach((item,index)=>{
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
                        projNewUid: data.DataRows[0].proj_uid,
                        projInfoFlag: 'update',
                        projOldInfo: projObj,
                        basicInfoUuid: getUuid(32,64),         //每一次查询给基本信息表单一个唯一key，保证数据填充
                        pms_list: data.pms_list,
                    }
                });

                let { TMOchecked } = yield select(state => state.projectInfo);

                //如果是财务退回，点击修改页面，从基本信息获取uuid后，直接查询全成本数据
                if (TMOchecked !== '-1') {
                    /*yield put({
                        type:'fullCostQuery'
                    });*/
                    yield put({
                        type:'searchProjFullcostTab'
                    });
                }
            }
            yield put({type: 'projQuery'});
            yield put({type: 'projuidCalculateRelation'})
        },
        
        /**
         * 作者：邓广晖
         * 创建日期：2018-06-15
         * 功能：处理tab切换
         * @param key tab的key
         * @param flag 标记
         * @param isFullCost 是否是全程本的 tab切换
         * @param nextPmsTabValue 下一个全成本的 tab值
         */
        *tabChangeClick ({key, flag, isFullCost, nextPmsTabValue},{put}) {
            if (isFullCost === '1') {
                if (flag === 'cancel') {
                    yield put({
                        type: 'fullCostPmsTabClickDirectSwitch',
                        nextPmsTabValue: nextPmsTabValue
                    });
                }
            } else {
                if (flag === 'cancel') {
                    if (key === 't1') {
                        yield put({
                            type: 'mainProjQuery'
                        });
                        yield put({
                            type: 'projTypeQuery'
                        });
                        yield put({
                            type: 'projInfoNewQuery'
                        });
                    }
                    else if (key === 't2') {
                        yield put({
                            type: 'mileStoneQuery'
                        });
                    }
                    else if (key === 't3') {
                        yield put({
                            type: 'searchProjFullcostTab'
                        });
                    }
                    else if (key === 't4') {
                        yield put({
                            type: 'searchNewAddAttachment'
                        });
                    }
                    yield put({
                        type: 'save',
                        payload: {
                            currentTabKey: key
                        }
                    });
                }
            }

        },

        /**
         * 作者：胡月
         * 创建日期：2017-10-17
         * 功能：保存，提交功能
         * @param postData 保存提交参数
         * @param obj 标志对象
         */
        /**projAddSave({postData, obj}, {select, call, put}) {
            const query = yield select(state => state.routing.locationBeforeTransitions.query);
            const data = yield call(projServices.projAddSaveOrSubmit, postData);
            if (data.RetCode === '1' && obj.tag === '0') {
                message.success('数据保存成功!');
                if (obj.backFunc) {
                    //初始化查询项目
                    yield put({
                        type: 'projInfoNewQuery',
                        callBack: obj.backFunc
                    });
                }
                if (obj.key === '1') {
                    //初始化查询项目
                    yield put({
                        type: 'projInfoNewQuery',
                    });
                }
                else if (obj.key === '2') {
                    //初始化查询里程碑
                    yield put({
                        type: 'mileStoneQuery',
                    });
                }
                else if (obj.key === '3') {
                    //初始化查询全成本
                    yield put({
                        type: 'fullCostQuery',
                    });
                }
                else if (obj.key === '4') {
                    //初始化查询附件信息
                    yield put({
                        type: 'searchNewAddAttachment',
                    });
                }

            }
            else if (data.RetCode === '1' && obj.tag === '2') {
                //跳转到详情页面
                message.success('数据提交成功!');
                if (query.arg_check_id) {
                    yield put(routerRedux.push({
                        pathname: 'taskList'
                    }));
                } else {
                    yield put(routerRedux.push({
                        pathname: 'projectApp/projStartUp/projList'
                    }));
                }
            }
            else if (data.RetCode === '-1') {
                message.error(data.RetVal);
            }
        },*/

        /**
         * 作者：邓广晖
         * 创建日期：2018-06-15
         * 功能：保存或者提交
         * @param payload 传递的参数
         */
        *saveOrSubmit({payload},{call,put,select}){
            let { currentTabKey, projNewUid, projInfoFlag } = yield select(state => state.projectInfo);
            const query = yield select(state => state.routing.locationBeforeTransitions.query);
            if (!('arg_proj_info_json' in payload)) {
                payload.arg_proj_info_json = {};
            }
            if(!('arg_proj_relation_json' in payload)) {
                payload.arg_proj_relation_json ={};
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
            if (!('array_proj_dept' in payload)) {
                payload.array_proj_dept = [];
            }
            if (!('array_proj_budget' in payload)) {
                payload.array_proj_budget = [];
            }
            if (!('arg_proj_attachment_json' in payload)) {
                payload.arg_proj_attachment_json = [];
            }
            let postData = {
                arg_proj_uid: projNewUid,
                arg_opt_byid: Cookie.get('userid'),
                arg_opt_byname: Cookie.get('username'),
                arg_tab: currentTabKey,
                arg_proj_info_json: JSON.stringify(payload.arg_proj_info_json),
                arg_proj_parent_info_json: JSON.stringify(payload.arg_proj_parent_info_json),
                arg_proj_relation_json :JSON.stringify(payload.arg_proj_relation_json ),
                arg_pu_info_json: JSON.stringify(payload.arg_pu_info_json),
                arg_pms_code_json: JSON.stringify(payload.arg_pms_code_json),
                object_milestone_del_budget: JSON.stringify({
                    array_milestone: JSON.stringify(payload.array_milestone),
                    array_proj_dept: JSON.stringify(payload.array_proj_dept),
                    array_proj_budget: JSON.stringify(payload.array_proj_budget)
                }),
                arg_proj_attachment_json: JSON.stringify(payload.arg_proj_attachment_json),
            };

            

            //如果全成本预算数据有变化 arg_cos = 1
            if (currentTabKey === 't3' && payload.array_proj_budget.length > 0) {
                postData.arg_cos = '1';
            } else {
                postData.arg_cos = '0';
            }
            //添加arg_bussiness_id
            let { projOldInfo } = yield select(state => state.projectInfo);
            if ('ou' in payload.arg_proj_info_json) {
                postData.arg_bussiness_id = getOuBussinessId(payload.arg_proj_info_json.ou);
            } else {
                postData.arg_bussiness_id = getOuBussinessId(projOldInfo.ou);
            }
            if (projInfoFlag === 'update') {
                if (query.arg_check_id) {
                    //如果是退回修改
                    postData.arg_bussiness_batchid = projOldInfo.bussiness_batchid;
                } else {
                    //如果是立项
                    postData.arg_bussiness_batchid = projOldInfo.batchid;
                }
            }

            //如果是退回修改，需要多传几个字段
            if (query.arg_check_id) {
                const extraData = {
                    'arg_check_id': query.arg_check_id,
                    'arg_check_batch_id': projOldInfo.check_batchid,
                    'arg_exe_id': projOldInfo.exe_id,
                    'arg_link_id': projOldInfo.link_id,
                    'arg_link_name': projOldInfo.link_name,
                    'arg_role_id': projOldInfo.role_id,
                    'arg_task_uuid': query.arg_task_uuid,
                    'arg_task_batchid': query.arg_task_batchid,
                    'arg_task_wf_batchid': query.arg_task_wf_batchid,
                };
                postData = {...postData,...extraData};
            }
            if (payload.optName === 'save') {
                postData.arg_flag = '0';
                const data = yield call(projServices.projAddSaveOrSubmit,postData);
                if (data.RetCode === '1') {
                    if (data.RetVal !== '' && data.RetVal !== undefined) {
                        message.success(data.RetVal);
                    } else {
                        message.success('保存成功');
                    }

                    let freshTab = currentTabKey;     // 将要刷新的tab,如果是直接保存，刷当前tab，如果是切换保存，刷新下一个tab
                    if (payload.isTab === '1') {
                        freshTab = payload.nextTab;
                        yield put({
                            type: 'save',
                            payload: {
                                currentTabKey: payload.nextTab
                            }
                        });
                    }
                    if (freshTab === 't1') {
                        yield put({
                            type: 'mainProjQuery'
                        });
                        yield put({
                            type: 'projTypeQuery'
                        });
                        yield put({
                            type: 'projInfoNewQuery'
                        });
                    }
                    else if (freshTab === 't2') {
                        yield put({
                            type: 'mileStoneQuery'
                        });
                    }
                    else if (freshTab === 't3') {
                        if (payload.isFullCostTab === '1') {
                            yield put({
                                type: 'fullCostPmsTabClickDirectSwitch',
                                nextPmsTabValue: payload.nextPmsTabValue
                            })
                        } else {
                            yield put({
                                type: 'fullCostQuery'
                            });
                        }
                    }
                    else if (freshTab === 't4') {
                        yield put({
                            type: 'searchNewAddAttachment'
                        });
                    }
                }
                else {
                    message.info(data.RetVal);
                }
            }
            else if (payload.optName === 'submit') {
                postData.arg_flag = '2';
                const data = yield call(projServices.projAddSaveOrSubmit,postData);
                if (data.RetCode === '1') {
                    if (data.RetVal !== '' && data.RetVal !== undefined) {
                        message.success(data.RetVal);
                    } else {
                        message.success('提交成功');
                    }
                    //跳转到详情页面
                    if (query.arg_check_id) {
                        yield put(routerRedux.push({
                            pathname: 'taskList'
                        }));
                    } else {
                        yield put(routerRedux.push({
                            pathname: 'projectApp/projStartUp/projList'
                        }));
                    }
                } else if (data.RetCode === '-1') {
                    message.info(data.RetVal);
                } else if (data.RetCode === '-3') {
                    if (data.RetVal !== '' && data.RetVal !== undefined) {
                        message.info(data.RetVal);
                    } else {
                        message.info('提交失败');
                    }

                    let freshTab = currentTabKey;     // 将要刷新的tab,如果是直接保存，刷当前tab，如果是切换保存，刷新下一个tab
                    if (payload.isTab === '1') {
                        freshTab = payload.nextTab;
                        yield put({
                            type: 'save',
                            payload: {
                                currentTabKey: payload.nextTab
                            }
                        });
                    }
                    if (freshTab === 't1') {
                        yield put({
                            type: 'mainProjQuery'
                        });
                        yield put({
                            type: 'projTypeQuery'
                        });
                        yield put({
                            type: 'projInfoNewQuery'
                        });
                    }
                    else if (freshTab === 't2') {
                        yield put({
                            type: 'mileStoneQuery'
                        });
                    }
                    else if (freshTab === 't3') {
                        if (payload.isFullCostTab === '1') {
                            yield put({
                                type: 'fullCostPmsTabClickDirectSwitch',
                                nextPmsTabValue: payload.nextPmsTabValue
                            })
                        } else {
                            yield put({
                                type: 'fullCostQuery'
                            });
                        }
                    }
                    else if (freshTab === 't4') {
                        yield put({
                            type: 'searchNewAddAttachment'
                        });
                    }
                }
            }

        },

      

        /**
         * 作者：邓广晖
         * 创建日期：2017-10-11
         * 功能：里程碑查询功能
         */
        *mileStoneQuery({}, {select, call, put}) {
            let { projOldInfo } = yield select(state => state.projectInfo);
            let query = yield select(state => state.routing.locationBeforeTransitions.query);
            //let uuid = yield select(state=>state.projectInfo.uuid);
            let postData = {};
            let postUrl = '';
            if (query.arg_check_id) {
                postData = {
                    arg_flag: 0,
                    arg_proj_uid: projOldInfo.proj_uid,
                    arg_check_id: query.arg_check_id
                };
                postUrl = projServices.getMileStone4Task;
            } else {
                postData = {
                    arg_flag: 0,
                    arg_proj_uid: projOldInfo.proj_uid,
                    arg_mile_flag: 0
                };
                postUrl = projServices.getMileStone;
            }
            const data = yield call(postUrl, postData);
            if (data.RetCode === '1') {
                data.DataRows.map((i, index) => {
                    i.opt_type = 'search';   //查询出来的附件标记为 search
                    i.key = index;           //为没一条记录添加一个 key
                });

                //计算剩余工作量
                let mileStoneWorkLoad = 0;
                let remainWorkLoad = undefined;
                //如果有里程碑
                if (data.DataRows.length > 0) {
                    data.DataRows.map((item, index) => {
                        mileStoneWorkLoad += Number(item.plan_workload);
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
         */
        *showMileModal({modalType, mileStoneRecord},{ select, put }) {
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
         */
        *hideMileModal({flag, mileParams},{put,select}){
            if (flag === 'confirm') {
                let { mileModalType, mileStoneList,remainWorkLoad, mileStoneRecord, mileStoneListOriginal } = yield select(state => state.projectInfo);
                if (mileModalType === 'add') {
                    //let { mileStoneList, remainWorkLoad } = yield select(state => state.projectInfo);
                    remainWorkLoad -= Number(mileParams.plan_workload);
                    mileParams.opt_type = 'insert';
                    mileParams.mile_uid = getUuid(32, 62);
                    mileStoneList.push(mileParams);
                    mileStoneList.forEach((item,index)=>{
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
         */
        *deleteMilestone({deleteMileRecord}, {select,put}) {
            let { mileStoneList, remainWorkLoad } = yield select(state => state.projectInfo);
            let index = deleteMileRecord.key;
            remainWorkLoad += Number(mileStoneList[index].plan_workload);
            if(mileStoneList[index].opt_type !== 'insert'){
                mileStoneList[index].opt_type = 'delete';
            }else{
                mileStoneList.splice(index,1);
            }
            //处理之后将key值重排
            for(let i =0;i<mileStoneList.length; i++){
                mileStoneList[i].key = i;
            }
            yield put({
                type: 'save',
                payload:{
                    mileStoneList: JSON.parse(JSON.stringify(mileStoneList)),
                    remainWorkLoad: remainWorkLoad
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-10-11
         * 功能：项目启动时新增页面查询已上传附件列表
         */
        *searchNewAddAttachment({}, {call, put, select}) {
            let { projOldInfo } = yield select(state => state.projectInfo);
            let query = yield select(state => state.routing.locationBeforeTransitions.query);
            //let uuid = yield select(state=>state.projectInfo.uuid);
            let postData = {};
            let postUrl = '';
            if (query.arg_check_id) {
                postData = {
                    arg_flag: 0,
                    arg_check_id: query.arg_check_id
                };
                postUrl = projServices.searchNewAddAttachment4Task;
            } else {
                postData = {
                    arg_flag: 0,
                    arg_proj_uid: projOldInfo.proj_uid,
                };
                postUrl = projServices.searchNewAddAttachment;
            }
            const data = yield call(postUrl, postData);
            if (data.RetCode === '1') {
                if (data.DataRows.length && data.DataRows[0].file_list) {
                    //将字符串转为json对象
                    let attachmentListTemp = JSON.parse(data.DataRows[0].file_list);
                    attachmentListTemp.forEach((i, index) => {
                        i.opt_type = 'search';   //查询出来的附件标记为 search
                        i.key = index;           //为没一条记录添加一个 key
                    });
                    yield put({
                        type: 'save',
                        payload: {
                            attachmentList: attachmentListTemp,
                            attachmentListOriginal: JSON.parse(JSON.stringify(attachmentListTemp)),
                        }
                    });
                } else {
                    yield put({
                        type: 'save',
                        payload: {
                            attachmentList: [],
                            attachmentListOriginal: []
                        }
                    });
                }
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-10-11
         * 功能：项目启动时新增页面删除附件列表
         * @param key 附件的key
         */
        *deleteAttachment({key}, {put,select}) {
            let { attachmentList } = yield select(state => state.projectInfo);
            //如果删除的附件不是新增的，将状态改为delete
            if (attachmentList[key].opt_type !== 'insert') {
                attachmentList[key].opt_type = 'delete';
            } else {
                //如果删除的附件是新增的，直接删除这条记录
                attachmentList.splice(key, 1);
            }
            //处理之后将key值重排
            for (let i = 0; i < attachmentList.length; i++) {
                attachmentList[i].key = i;
            }
            yield put({
                type: 'save',
                payload: {
                    attachmentList: JSON.parse(JSON.stringify(attachmentList)),
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-10-11
         * 功能：项目启动时新增页面编辑附件列表
         * @param key 附件的key
         * @param text 编辑时的文本值
         */
        *editAttachment({key, text}, {put, select}) {
            let { attachmentList } = yield select(state => state.projectInfo);
            let oldAttach = yield select(state => state.projectInfo.attachmentListOriginal);
            //如果编辑的是查询出来的文件
            if (attachmentList[key].opt_type !== 'insert') {
                //如果文件别名于最原始查出来的文件别名不一样，将标志设置为 update
                if (text !== oldAttach[key].file_byname) {
                    attachmentList[key].opt_type = 'update';
                } else {
                    attachmentList[key].opt_type = 'search';
                }
            }
            //不管是查询的文件还是新增的文件，文件别名修改了，就修改内容
            if (attachmentList[key].file_byname !== text) {
                attachmentList[key].file_byname = text;
            }
            yield put({
                type: 'save',
                payload: {
                    attachmentList: JSON.parse(JSON.stringify(attachmentList)),
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-10-11
         * 功能：项目启动时新增页面新增附件列表
         * @param objFile 添加的文件
         */
        *addAttachment({ objFile }, {put,select}) {
            let { attachmentList } = yield select(state => state.projectInfo);
            attachmentList.push(objFile);
            attachmentList.forEach((item,index)=>{
                item.key = index;
            });
            yield put({
                type: 'save',
                payload: {
                    attachmentList: JSON.parse(JSON.stringify(attachmentList)),
                }
            });

        },

        /**
         * 作者：任华维
         * 创建日期：2017-10-11
         * 功能：判断tab的显示
         * @param payload 标记
         */
        *taskIsShowAllTab({payload}, {call, put, select}) {
            const res = yield call(projServices.taskIsShowAllTab, {arg_check_id: payload});
            if (res.RetCode === '1') {
                if (res.TMOchecked !== '-1') {
                    yield put({
                        type: 'save',
                        payload: {
                            currentTabKey: 't3'
                        }
                    });
                }
                yield put({
                    type: 'save',
                    payload: {
                        TMOchecked: res.TMOchecked
                    }
                });
                yield put({
                    type: 'projInfoNewQuery'
                });
                //yield put({type: 'fullCostQuery'});
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-12-04
         * 功能：立项项目的全成本,PMS的tab列表查询
         */
        *searchProjFullcostTab({},{call,put,select}) {
            const { projNewUid } = yield select(state => state.projectInfo);
            let pmsListPostData = {
                arg_proj_uid: projNewUid,         //项目uid，必传
                //arg_flag：查询标志，待定
            };
            const pmsListData = yield call(projServices.projStartPmsDataQuery, pmsListPostData);
            let fullCostPmsTab = {
                pms_code: '',
                tab_name: '',
                tab_flag: '0',
                tabConvertName:'',
            };
            if (pmsListData.RetCode === '1') {
                if (pmsListData.DataRows.length) {
                    pmsListData.DataRows.forEach((item,index)=>{
                        item.tabConvertName =  item.tab_name;
                        if (item.tab_flag === '1') {
                            item.tabConvertName = 'PMS' + index + '预算';
                        }
                    });
                    fullCostPmsTab = {...pmsListData.DataRows[0]};
                }
                yield put({
                    type: 'save',
                    payload: {
                        fullCostPmsTab: fullCostPmsTab,
                        fullCostShowPmsTab: pmsListData.isShowTab,
                        fullCostPmsListData: pmsListData.DataRows,
                    }
                });
                yield put({
                    type:'fullCostQuery'
                });
            } else if (pmsListData.RetCode === '-1') {
                message.error(pmsListData.RetVal);
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-12-03
         * 功能：全成本里面  Pms编码 直接切换, 保存成功时也调这个方法
         * @param nextPmsTabValue 下一个pms的tab
         */
        *fullCostPmsTabClickDirectSwitch({nextPmsTabValue},{put,select}){
            const { fullCostPmsListData } = yield select(state => state.projectInfo);
            let clickFullcostPmsTab = fullCostPmsListData.filter(item => item.tabConvertName === nextPmsTabValue);
            yield put({
                type: 'save',
                payload: {
                    fullCostPmsTab: clickFullcostPmsTab[0],
                }
            });
            yield put({
                type:'fullCostQuery'
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-03
         * 功能：全成本初始化查询
         */
        *fullCostQuery({}, {call, put, select}) {
            //强制转圈开启
            yield put({
                type: 'save',
                payload: {
                    fullCostLoading: true
                }
            });
            let { projNewUid, projOldInfo, fullCostPmsTab } = yield select(state => state.projectInfo);
            //查询配合部门列表
            let coorpDeptPostData = {};
            let coorpDeptPostUrl = '';
            coorpDeptPostData.arg_proj_uid = projNewUid;
            coorpDeptPostData.arg_flag = '0';
            coorpDeptPostData.arg_dept_flag = '0';   //arg_dept_flag  为0时，查询配合部门 ，为1时，查询所有部门
            coorpDeptPostData.arg_tab_flag = fullCostPmsTab.tab_flag;
            coorpDeptPostData.arg_pms_code = fullCostPmsTab.pms_code;
            coorpDeptPostUrl = projServices.projStartCoorDeptQuery;
            const coorpDeptData = yield call(coorpDeptPostUrl, coorpDeptPostData);

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
            allDeptPostData.arg_proj_uid = projNewUid;
            allDeptPostData.arg_flag = '0';
            allDeptPostData.arg_dept_flag = '1';        //arg_dept_flag  为0时，查询配合部门 ，为1时，查询所有部门
            allDeptPostData.arg_tab_flag = fullCostPmsTab.tab_flag;
            allDeptPostData.arg_pms_code = fullCostPmsTab.pms_code;
            allDeptPostUrl = projServices.projStartCoorDeptQuery;
            const allDeptData = yield call(allDeptPostUrl, allDeptPostData);
            //查询每个部门的预算
            let budgetPostData = {};
            let budgetPostUrl = '';
            budgetPostData.arg_proj_uid = projNewUid;
            budgetPostData.arg_flag = '0';
            budgetPostData.arg_tab_flag = fullCostPmsTab.tab_flag;
            budgetPostData.arg_pms_code = fullCostPmsTab.pms_code;
            budgetPostUrl = projServices.projStartBudgetQuery;
            const deptBudgetData = yield call(budgetPostUrl, budgetPostData);
            //确定返回的预算中的年份
            let bugetYearList = [];
            for (let i = 0; i < deptBudgetData.DataRows.length; i++) {
                if (!isInArray(bugetYearList, deptBudgetData.DataRows[i].year)) {
                    bugetYearList.push(deptBudgetData.DataRows[i].year);
                }
            }

            //数据存储的项目采购成本总列表
            let purchasePostData = {
                transjsonarray: JSON.stringify({
                    "condition": {"fee_subtype": "0"},
                    "sequence": [{"index_num": "0"}]
                })
            };
            let purchaseAllCostData = yield call(projServices.queryCostList, purchasePostData);
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

            allDeptData.DataRows.forEach((item) => {
                item.opt_type = 'search';
            });
            for (let budgeIndex = 0; budgeIndex < deptBudgetData.DataRows.length; budgeIndex++) {
                deptBudgetData.DataRows[budgeIndex].opt_type = 'search';
                deptBudgetData.DataRows[budgeIndex].proj_uid = projNewUid;
            }
            //deptBudgetData.DataRows.map((i)=>{i.opt_type='search';i.proj_uid=uuid;return i});
            //purchaseAllCostData.DataRows.map((i)=>{i.opt_type='search';return i});
            //carryOutAllCostData.DataRows.map((i)=>{i.opt_type='search';return i});

            /*计算可添加的年份*/
            let fullCostYearList = [];
            //年的索引，先从开始时间的年份开始算起
            let yearIndex = parseInt(projOldInfo.begin_time.split('-')[0]);
            //将结束时间作为结束标志
            let yearEndTagIndex = parseInt(projOldInfo.end_time.split('-')[0]);
            //如果年份索引不超过开始年份，进行添加
            while (yearIndex <= yearEndTagIndex) {
                fullCostYearList.push(yearIndex.toString());
                yearIndex++;
            }
            //console.log('====================allDeptData.DataRows');
            //console.log(allDeptData.DataRows);  //.primary_proj_id

            //显示的年份，取预算和所有年份的并集
            let yearList = [];
            for (let bi = 0; bi < bugetYearList.length; bi++) {
                if (!isInArray(yearList, bugetYearList[bi])) {
                    yearList.push(bugetYearList[bi]);
                }
            }
            for (let fi = 0; fi < fullCostYearList.length; fi++) {
                if (!isInArray(yearList, fullCostYearList[fi])) {
                    yearList.push(fullCostYearList[fi]);
                }
            }

            //此处需要手动添加 差旅费  和  差旅费_资本化数据
            //let { deptBudgetList, allDeptList } = yield select(state => state.projectInfo);
            //allDeptList = allDeptList.filter(item => item.opt_type !== 'delete');
            let allDeptList = allDeptData.DataRows;
            let deptBudgetList = deptBudgetData.DataRows;
            for (let ci = 0; ci < carryOutAllCostData.DataRows.length; ci++) {
                //debugger;
                if (carryOutAllCostData.DataRows[ci].fee_class === '1') {
                    //debugger;
                    for (let yi = 0; yi < yearList.length; yi++) {
                        for (let ai = 0; ai < allDeptList.length; ai++) {
                            let findTravel = false;
                            for (let bgi = 0; bgi < deptBudgetList.length; bgi++) {
                                if (
                                    deptBudgetList[bgi].year === yearList[yi] &&
                                    deptBudgetList[bgi].dept_name === allDeptList[ai].dept_name &&
                                    deptBudgetList[bgi].fee_type === '1' &&
                                    deptBudgetList[bgi].fee_subtype === '1' &&
                                    deptBudgetList[bgi].fee_class ===  '1' &&
                                    deptBudgetList[bgi].fee_name === carryOutAllCostData.DataRows[ci].fee_name
                                ) {
                                    findTravel = true;
                                    break;
                                }
                            }
                            if(!deptBudgetList.some(v => v.fee_name == "办公费")) {
                                deptBudgetList.push({
                                    year: yearList[yi],
                                    fee_type: '1',
                                    fee_subtype: '1',
                                    fee_class: '0',
                                    fee: '0',
                                    fee_name: '办公费',
                                    dept_name: allDeptList[ai].dept_name,
                                    ou: changeOuName(allDeptList[ai].dept_name.split('-')[0]),
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_uid: projOldInfo.proj_uid,
                                    dept_uid: allDeptList[ai].deptid,
                                })
                            }
                            if(!deptBudgetList.some(v => v.fee_name == "通信费")) {
                                deptBudgetList.push({
                                    year: yearList[yi],
                                    fee_type: '1',
                                    fee_subtype: '1',
                                    fee_class: '0',
                                    fee: '0',
                                    fee_name: '通信费',
                                    dept_name: allDeptList[ai].dept_name,
                                    ou: changeOuName(allDeptList[ai].dept_name.split('-')[0]),
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_uid: projOldInfo.proj_uid,
                                    dept_uid: allDeptList[ai].deptid,
                                })
                            }
                            if(!deptBudgetList.some(v => v.fee_name == "车辆使用费")) {
                                deptBudgetList.push({
                                    year: yearList[yi],
                                    fee_type: '1',
                                    fee_subtype: '1',
                                    fee_class: '0',
                                    fee: '0',
                                    fee_name: '车辆使用费',
                                    dept_name: allDeptList[ai].dept_name,
                                    ou: changeOuName(allDeptList[ai].dept_name.split('-')[0]),
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_uid: projOldInfo.proj_uid,
                                    dept_uid: allDeptList[ai].deptid,
                                })
                            }
                            if (findTravel === false) {
                                deptBudgetList.push({
                                    year: yearList[yi],
                                    fee_type: '1',
                                    fee_subtype: '1',
                                    fee_class: '1',
                                    fee: '0',
                                    fee_name: carryOutAllCostData.DataRows[ci].fee_name,
                                    dept_name: allDeptList[ai].dept_name,
                                    ou: changeOuName(allDeptList[ai].dept_name.split('-')[0]),
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_uid: projOldInfo.proj_uid,
                                    dept_uid: allDeptList[ai].deptid,
                                });
                            }
                        }
                    }
                }
            }
            yield put({
                type: 'save',
                payload: {
                    allDeptList: allDeptList,
                    deptBudgetList: deptBudgetList,
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
            });
            yield put ({
                type:"queryFullCostData",
            })
            //强制转圈结束
            yield put({
                type: 'save',
                payload: {
                    fullCostLoading: false
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-21
         * 功能：转变数据
         * @param isFirstTime 是否是第一次转换
         */
        *convertFullCostData({isFirstTime}, {put, select}) {
            let {yearList, allDeptList, deptBudgetList, projOldInfo} = yield select(state => state.projectInfo);
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
            //                   2017:{yearRowSpan:x,
            //                         purchaseCostList:['xxxx费用1'，‘xxxx费用2’],
            //                         purchaseDeptTotal:[12,35]  //每个部门的所有xxxx费用之和
            //                         operateCostList:['zzz费用1'，‘zzzz费用2’]，
            //                         operateDeptTotal:[78,10]   //每个部门的所有zzzz（运行）费用之和
            //                         carryOutCostList:['yyyy费用1'，‘yyyy费用2’]},
            //                         carryOutDeptTotal:[38,68]  //每个部门的所有yyyy费用之和
            //                         humanCostTotal:[12,67]         // 每个部门的人工成本
            //                         predictTimeTotal:[3,7]         //每个部门的预计工时
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
                    let predictTimeTotal = [];         //每个部门的预计工时
                    for (let deptIndexx = 0; deptIndexx < allDeptList.length; deptIndexx++) {
                        let purchaseDeptValue = 0;
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
                        purchaseDeptTotal.push(purchaseDeptValue.toFixed(2));
                        operateDeptTotal.push(operateDeptValue.toFixed(2));
                        carryOutDeptTotal.push(carryOutDeptValue.toFixed(2));
                        humanCostTotal.push(humanCostValue.toFixed(2));
                        predictTimeTotal.push(predictTimeValue.toFixed(1));
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
                    obj.yearRowSpan = yearListRowSpan[yearList[yearIndex2]].yearRowSpan;
                    obj.fee_name = config.PREDICT_TIME;
                    obj.no_pre_fee_name = config.NO_PREFIX_PREDICT;
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
                                fee_type: '0',
                                fee_subtype: '-1',
                                fee: '0.0',
                                fee_name: config.NO_PREFIX_PREDICT,
                                ou: changeOuName(allDeptList[i].dept_name.split('-')[0]),
                                dept_name: allDeptList[i].dept_name,
                                budget_uid: getUuid(32, 62),
                                opt_type: 'insert',
                                proj_uid: projOldInfo.proj_uid,
                                dept_uid: allDeptList[i].dept_id,
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
                    obj.no_pre_fee_name = config.NO_PREFIX_DIRECT_COST;
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
                    obj.not_edit = 'not_edit';
                    obj.can_add = 'can_add';
                    obj.add_type = 'purchase';
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
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
                                    fee_type: '1',
                                    fee_subtype: '0',
                                    fee: '0.00',
                                    fee_name: purchaseCostTypeList[purchaseIndex],
                                    ou: changeOuName(allDeptList[p].dept_name.split('-')[0]),
                                    dept_name: allDeptList[p].dept_name,
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_uid: projOldInfo.proj_uid,
                                    dept_uid: allDeptList[p].dept_id,
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
                        for (let p = 0; p < allDeptList.length; p++) {
                            let findOperate = false;
                            for (let cellDataIndex33 = 0; cellDataIndex33 < deptBudgetList.length; cellDataIndex33++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex33].year &&
                                    operateCostTypeList[operateIndex].trim() === deptBudgetList[cellDataIndex33].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex33].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex33].fee_subtype === '3') {
                                        if (allDeptList[p].dept_name === deptBudgetList[cellDataIndex33].dept_name) {
                                            if (isFirstTime === true) {
                                                obj['dept' + p.toString()] = Number(deptBudgetList[cellDataIndex33].fee).toFixed(2);
                                            } else {
                                                obj['dept' + p.toString()] = deptBudgetList[cellDataIndex33].fee;
                                            }
                                            operateTotal += Number(deptBudgetList[cellDataIndex33].fee);
                                            findOperate = true;
                                            break;
                                        }
                                    }
                                }
                            }//end for
                            if (findOperate === false) {
                                deptBudgetList.push({
                                    year: yearList[yearIndex2],
                                    fee_type: '1',
                                    fee_subtype: '3',
                                    fee: '0.00',
                                    fee_name: operateCostTypeList[operateIndex],
                                    ou: changeOuName(allDeptList[p].dept_name.split('-')[0]),
                                    dept_name: allDeptList[p].dept_name,
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_uid: projOldInfo.proj_uid,
                                    dept_uid: allDeptList[p].dept_id,
                                });
                                obj['dept' + p.toString()] = '0.00';
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
                    obj.not_edit = 'not_edit';
                    obj.can_add = 'can_add';
                    obj.add_type = 'carryOut';
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    obj.feeNameLevel = '2';    //  费用项的目录级别  1 2 3
                    let carryOutAllTotal = 0;
                    for (let ii = 0; ii < allDeptList.length; ii++) {
                        obj['dept' + ii.toString()] = yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii];
                        carryOutAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii]);
                    }//end for
                    obj.total = carryOutAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.3. 添加项目实施成本-子费用
                    let carryOutCostTypeList = yearListRowSpan[yearList[yearIndex2]].carryOutCostList;
                    let { carryOutAllCostList } =  yield select(state => state.projectInfo);
                    for (let carryOutIndex = 0; carryOutIndex < carryOutCostTypeList.length; carryOutIndex++) {
                        //通过名字找到对应的费用项，获取 fee_class 的值
                        let carryOutFeeClass = carryOutAllCostList.filter((item)=> item.fee_name === carryOutCostTypeList[carryOutIndex]);
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.3.' + (carryOutIndex + 1).toString() + carryOutCostTypeList[carryOutIndex];
                        obj.no_pre_fee_name = carryOutCostTypeList[carryOutIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        obj.feeNameLevel = '3';    //  费用项的目录级别  1 2 3
                        obj.fee_class = carryOutFeeClass[0].fee_class;
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
                                    fee_type: '1',
                                    fee_subtype: '1',
                                    fee: '0.00',
                                    fee_name: carryOutCostTypeList[carryOutIndex],
                                    ou: changeOuName(allDeptList[jj].dept_name.split('-')[0]),
                                    dept_name: allDeptList[jj].dept_name,
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_uid: projOldInfo.proj_uid,
                                    dept_uid: allDeptList[jj].dept_id,
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
                                fee_type: '1',
                                fee_subtype: '2',
                                fee: '0.00',
                                fee_name: config.NO_PREFIX_HUMAN_COST,
                                ou: changeOuName(allDeptList[b].dept_name.split('-')[0]),
                                dept_name: allDeptList[b].dept_name,
                                budget_uid: getUuid(32, 62),
                                opt_type: 'insert',
                                proj_uid: projOldInfo.proj_uid,
                                dept_uid: allDeptList[b].dept_id,
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
                obj.yearOptType = 'total';
                obj.not_input = 'not_input';
                obj.padLeft = '0px';
                obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
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
         * 创建日期：2018-01-03
         * 功能：添加配合部门
         * @param deptSelectData 已选中的部门
         */
        *addCoorpDept({deptSelectData}, {put, select}) {
            let coorpDeptListTemp = [];
            let {projOldInfo, coorpDeptList, allDeptList, deptBudgetList, yearList, yearListRowSpan} = yield select(state => state.projectInfo);
            //如果选了更多的配合部门，将新添加的配合部门添加到列表
            if (deptSelectData.length) {
                let deptIsRepeated = false;
                //首先判断是否有与存在的部门重复，包括主责部门和配合部门
                for (let i = 0; i < deptSelectData.length; i++) {
                    if (deptSelectData[i].dept_name === allDeptList[0].dept_name) {
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
                                proj_uid: projOldInfo.proj_uid,
                                opt_type: 'insert',
                                mgr_name: deptSelectData[i].username,   // 员工姓名
                                mgr_id: deptSelectData[i].userid,       // 员工编号
                                ou: changeOuName(deptSelectData[i].dept_name.split('-')[0])
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
                                proj_uid: projOldInfo.proj_uid,
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
                                    proj_uid: projOldInfo.proj_uid,
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
                                    proj_uid: projOldInfo.proj_uid,
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
                                    proj_uid: projOldInfo.proj_uid,
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
                                proj_uid: projOldInfo.proj_uid,
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
                            deptBudgetList: deptBudgetList
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
         * 创建日期：2018-01-05
         * 功能：删除配合部门
         * @param deptSelectData 已选中的部门
         * @param put 返回reducer
         * @param call 请求服务
         * @param select 获取model的state
         */
        *deleteCoorpDept({index}, {put, select}) {
            let {coorpDeptList, allDeptList, deptBudgetList} = yield select(state => state.projectInfo);
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
         * 创建日期：2018-01-05
         * 功能：删除配合部门
         * @param index 配合部门索引值
         * @param selectPerson 配合部门联系人(姓名:username id： userid)
         */
        *editCoorpMgrName({index, selectPerson}, {put, select}) {
            let {coorpDeptList, coorpDeptListOriginal} = yield select(state => state.projectInfo);
            //如果编辑的是查询出来的配合部门
            if (coorpDeptList[index].opt_type !== 'insert') {
                //如果配合部门联系人于最原始查出来的联系人不一样，将标志设置为 update
                if (selectPerson.userid !== coorpDeptListOriginal[index].mgr_id) {
                    coorpDeptList[index].opt_type = 'update';
                } else {
                    //如果改过后，又改回原来的值
                    coorpDeptList[index].opt_type = 'search';
                }
            }
            //不管是查询的配合部门还是新增的配合部门，修改了，就修改内容
            if (coorpDeptList[index].mgr_id !== selectPerson.userid) {
                coorpDeptList[index].mgr_name = selectPerson.username;
                coorpDeptList[index].mgr_id = selectPerson.userid;
            }
            yield put({
                type: 'save',
                payload: {coorpDeptList: JSON.parse(JSON.stringify(coorpDeptList))}
            });
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
         * 创建日期：2018-01-05
         * 功能：编辑表格单元格数据
         * @param value 单元格数据
         * @param year 年份
         * @param deptName 部门
         * @param noPreFeeName 没有前缀的费用名
         */
        *editCellData({value, year, deptName, noPreFeeName}, {put, select}) {
            let {deptBudgetList, deptBudgetListOriginal} = yield select(state => state.projectInfo);
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
         * 创建日期：2018-01-05
         * 功能：增加费用项
         * @param value 费用项的值
         * @param fee_type 费用主类型
         * @param fee_subtype 费用子类型
         * @param year 年份
         */
        *addCostType({value, fee_type, fee_subtype, year}, {put, select}) {
            let {projOldInfo, deptBudgetList, allDeptList} = yield select(state => state.projectInfo);
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
                    proj_uid: projOldInfo.proj_uid,
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
         * 创建日期：2018-01-05
         * 功能：删除费用项
         * @param value 费用项
         * @param year 年份
         */
        *deleteCostType({value, year}, {put, select}) {
            let {deptBudgetList} = yield select(state => state.projectInfo);
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
         * 创建日期：2018-01-05
         * 功能：添加年份费用项
         * @param value 费用项
         * @param year 年份
         */
        *addYear({year}, {put, select}) {
            let {projOldInfo, deptBudgetList, allDeptList, yearList} = yield select(state => state.projectInfo);
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
                    proj_uid: projOldInfo.proj_uid,
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
                    proj_uid: projOldInfo.proj_uid,
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
         * 作者：金冠超
         * 创建日期：2020-02-24
         * 功能：删除草稿
         * @param proj_uid 项目主键
         */
        *delDraftModalOk({proj_uid},{put,select,call}){
            const postData={
                arg_req_moduleurl:window.location.hash.replace('#/','').split('?')[0],
                arg_proj_uid:proj_uid
            }
            const data=yield call(projServices.delDraftModalOk, postData)
            if(data.RetCode == '1'){
                message.success('草稿已删除');
                yield put(routerRedux.push({
                    pathname: 'projectApp/projStartUp/projList'
                }))
            }
        },
        /**
         * 作者：邓广晖
         * 创建日期：2018-01-05
         * 功能：删除年份费用项
         * @param value 费用项
         * @param year 年份
         */
        *deleteYear({year}, {put, select}) {
            let {deptBudgetList, yearList} = yield select(state => state.projectInfo);
            yearList = yearList.filter(item => item !== year);
            let deptBudgetListNew = [];
            //如果删除的是新增的年份，直接删除,即不添加到新的里面
            for (let i = 0; i < deptBudgetList.length; i++) {
                if (deptBudgetList[i].year === year) {
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
    },

    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                dispatch({type: 'initData'});
                if (pathname === '/projectApp/projStartUp/projList/projMainPage') {
                    //dispatch({type: 'initData'});
                    dispatch({type: 'initJudgeRoleAndSearch', query});
                }
                if (pathname.indexOf('/taskUpdate') !== -1) {
                    //dispatch({type: 'initData'});
                    dispatch({type: 'taskIsShowAllTab', payload: query.arg_check_id});
                    dispatch({type: 'initJudgeRoleAndSearch', query});
                }
            });
        },
    },
};


