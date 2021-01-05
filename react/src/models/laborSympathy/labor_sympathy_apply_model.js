/**
* 作者：翟金亭
* 创建日期：2020-6-10 
* 邮箱：zhaijt3@chinaunicom.cn
* 功能：申请工会慰问  
*/
import Cookie from "js-cookie";
import * as sympathyeService from "../../services/laborSympathy/laborSympathyeService";
import * as overtimeService from "../../services/overtime/overtimeService"

import { message } from "antd";

export default {
    namespace: 'labor_sympathy_apply_model',
    state: {
        sympathyType: '',
        sympathyData: [],
        nextDataList: [],
        postDataList: [],
        laobrDataList: [],
        postLookData: [],
        fileDataList: [],
        pf_url: '',
        file_relative_path: '',
        file_name: '',
    },
    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        }
    },
    effects: {
        //默认查询，传参
        *init({ query }, { call, put }) {
            let sympathyTypeInfo = '';
            if(query.sympathyType === null || query.sympathyType === undefined || query.sympathyType === '')
            {
                sympathyTypeInfo = query.sympathy_type
            }
            else
            {
                sympathyTypeInfo = query.sympathyType
            }
            // 回传信息 保存状态信息
            if (query.statusFlag === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        //申请的类型
                        sympathyType: query.sympathy_type,
                        //保存状态的信息
                        postDataList: query,
                        sympathy_apply_id: query.sympathy_apply_id,
                    }
                });
            }
            //回传创建时候的申请类型信息
            else {
                yield put({
                    type: 'save',
                    payload: {
                        //申请的类型
                        sympathyType: query.sympathyType,
                        sympathyData: [],
                        nextDataList: [],
                        postDataList: [],
                        laobrDataList: [],
                        postLookData: [],
                        fileDataList: [],
                    }
                });
            }

            /* 查询默认填充信息 Begin */
            let auth_ou_id = Cookie.get('OUID');
            let postData = {};
            postData["arg_ou_id"] = auth_ou_id;
            postData["arg_sympathy_type"] = sympathyTypeInfo;
            let data = yield call(sympathyeService.sympathyTypeInfoSearch, postData);
            if (data.RetCode === '1' && data.DataRows) {
                yield put({
                    type: 'save',
                    payload: {
                        sympathyData: data.DataRows,
                    }
                })
            };

            let auth_userid = Cookie.get('userid');
            let postData2 = {};
            let labor_id = '';
            postData2["arg_user_id"] = auth_userid;
            let laobrData = yield call(sympathyeService.laborPersonQuery, postData2);
            if (laobrData.RetCode === '1') {
                labor_id = laobrData.DataRows[0].labor_id;
                yield put({
                    type: 'save',
                    payload: {
                        laobrDataList: laobrData.DataRows,
                    }
                })
            }
            /* 查询默认填充信息 End */

            /* 查询下一环节处理人信息 Begin */
            let post_id = '';
            let task_id = '';
            let proc_inst_id = 'NA';

            let postQueryParams = {
                arg_proc_inst_id: proc_inst_id,
                arg_task_id: task_id,
                arg_post_id: post_id,
                arg_labor_id: labor_id
            };
            let nextData1 = yield call(sympathyeService.nextPersonListQuery, postQueryParams);
            if (nextData1.length > 0) {
                nextName = nextData1.DataRows[0].submit_post_name;
            }
            if (nextData1.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        nextDataList: nextData1.DataRows,
                    }
                })
            } else {
                message.error("查询下一环节处理人信息异常");
            }
            /* 查询下一环节处理人信息 End */
            //阅后即焚
            if (query.statusFlag === '2') {
                let if_reback = query.if_reback;
                yield put({
                    type: 'save',
                    payload: {
                        postLookData: query
                    }
                })
                if (if_reback === '1') {
                    let param = {
                        arg_sympathy_apply_id: query.sympathy_apply_id,
                        arg_status: '1'
                    };
                    yield call(sympathyeService.sympathyeRebackDelete, param);
                }
            }
            //查询附件列表
            let fileQueryParams = {
                arg_query_id: query.proc_inst_id ? query.proc_inst_id : (query.sympathy_apply_id ? query.sympathy_apply_id : 'temp'),
            };
            let fileData = yield call(sympathyeService.UploadFileListQuery, fileQueryParams);
            if (fileData.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        fileDataList: fileData.DataRows,
                    }
                })
            }
        },
        //保存申请信息
        * sympathyApplySave({ basicInfoData, resolve }, { call }) {
            /* 保存sympathy_apply */
            let saveBasicInfo = yield call(sympathyeService.sympathyeInfoSave, basicInfoData);
            if (saveBasicInfo.RetCode === '1') {
                message.success('保存成功');
                resolve("success");
                return;
            } else {
                message.error('保存失败');
                resolve("false");
                return;
            }
        },
        //提交申请信息 
        * sympathyApplySubmit({ basicInfoData, approvalData, approvalDataNext, sympathy_apply_id, committee_type, resolve }, { call }) {
            /*调用工作流开始服务，传入 启动工作流标识 返回proc_inst_id，post_id_next*/
            let param = {
                //离职申请启动工作流标识
                start_type: 'union_sympathy_apply',
            };
            let listenersrc = '{sympathy_apply:{arg_procInstId:"${procInstId}",arg_committee_type:"' + committee_type + '",arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
            param["listener"] = listenersrc;
            const laborSympathyFlowStartResult = yield call(sympathyeService.sympathyeApplyFlowStart, param);
            let laborSympathyFlowStartList = [];
            if (laborSympathyFlowStartResult.RetCode === '1') {
                laborSympathyFlowStartList = laborSympathyFlowStartResult.DataRows[0];
            }
            else {
                message.error('Service laborSympathyFlowStart ' + laborSympathyFlowStartResult.RetVal);
                resolve("false");
                return;
            }
            let proc_inst_id = laborSympathyFlowStartList.procInstId;
            let task_id = laborSympathyFlowStartList.taskId;
            let task_name = laborSympathyFlowStartList.actName;

            //基本信息表apply补全
            basicInfoData["arg_proc_inst_id"] = proc_inst_id;
            //审批信息approval补全
            approvalData["arg_task_id"] = task_id;
            approvalData["arg_task_name"] = task_name;

            //用来回滚数据库和工作流
            let postDataDeleteDateBase = {};
            let postDataDeleteFlow = {};
            postDataDeleteDateBase["arg_sympathy_apply_id"] = sympathy_apply_id;
            let deleteFlag = {};
            deleteFlag["arg_sympathy_apply_id"] = sympathy_apply_id;
            postDataDeleteFlow["procInstId"] = proc_inst_id;
            postDataDeleteDateBase["arg_status"] = '1';

            try {
                //回滚标志
                let rollbackFlag = 0;
                let postDataDelete = {};
                postDataDelete["arg_sympathy_apply_id"] = sympathy_apply_id;
                postDataDelete["arg_status"] = '0';

                //提交基本申请信息
                let saveBasicInfo = yield call(sympathyeService.sympathyeInfoSave, basicInfoData);
                if (saveBasicInfo.RetCode !== '1') {
                    rollbackFlag = 1;
                }
                /* 提交审批信息  */
                const approvalDataInfo = yield call(sympathyeService.sympathyeApprovalSubmitInfo, approvalData);
                if (approvalDataInfo.RetCode !== '1') {
                    rollbackFlag = 1;
                }

                /*调用工作流节点结束服务 Begin */
                param["taskId"] = task_id;
                let listenerSrc = '{sympathy_apply:{arg_procInstId:"${procInstId}", arg_committee_type:"' + committee_type + '", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
                param["listener"] = listenerSrc;

                let laborSympathyApplyFlowCompleteList = {};
                const sympathyApplyFlowCompleteResult = yield call(sympathyeService.sympathyApplyFlowComplete, param);
                if (sympathyApplyFlowCompleteResult.RetCode === '1') {
                    laborSympathyApplyFlowCompleteList = sympathyApplyFlowCompleteResult.DataRows;
                } else {
                    message.error('Service absenceApplyFlowComplete ' + absenceApplyFlowCompleteResult.RetVal);
                    resolve("false");
                    return;
                }
                let task_id_end = laborSympathyApplyFlowCompleteList[0] && laborSympathyApplyFlowCompleteList[0].taskId;
                let task_name_end = laborSympathyApplyFlowCompleteList[0] && laborSympathyApplyFlowCompleteList[0].actName;
                // 补全下一环节审批信息
                approvalDataNext["arg_task_id"] = task_id_end;
                approvalDataNext["arg_task_name"] = task_name_end;
                /*调用工作流节点结束服务 End */

                /*保存下一节点信息 Begin */
                const approvalDataInfoNext = yield call(sympathyeService.sympathyeApprovalSubmitInfo, approvalDataNext);
                if (approvalDataInfoNext.RetCode !== '1') {
                    rollbackFlag = 1;
                }
                /*保存下一节点信息 End */

                if (rollbackFlag === 1) {
                    /* 回滚功能:数据库 */
                    yield call(sympathyeService.deleteSympathyeApprovalInfo, deleteFlag);
                    // 结束工作流
                    yield call(sympathyeService.sympathyApplyFlowTerminate, postDataDeleteFlow);
                    message.error('提交失败');
                    resolve("false");
                } else {
                    message.success('提交成功');
                    resolve("success");
                }
            } catch (e) {
                try {

                    /* 回滚功能:数据库 */
                    yield call(sympathyeService.deleteSympathyeApprovalInfo, deleteFlag);
                    // 结束工作流
                    yield call(sympathyeService.sympathyApplyFlowTerminate, postDataDeleteFlow);
                } catch (e1) {
                    message.error('回滚失败');
                    resolve("false");
                }
            }

        },
        //删除附件
        *deleteFile({ RelativePath }, { call, put }) {
            let projectQueryparams = {
                RelativePath: RelativePath,
            };
            let deletefalg = yield call(overtimeService.deleteFile, projectQueryparams);
            if (deletefalg.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        pf_url: '',
                        file_relative_path: '',
                        file_name: '',
                    }
                })
            }
        },
        //保存文件
        * changeNewFile({ oldfile, newfile }, { call, put }) {
            if (oldfile.name === "" || oldfile.name === null) {
                yield put({
                    type: 'save',
                    payload: {
                        pf_url: newfile[0].response.file.AbsolutePath,
                        file_relative_path: newfile[0].response.file.RelativePath,
                        file_name: newfile[0].name,
                    }
                })
            } else {
                if (oldfile.uid === 1) {
                    //删除旧文件
                    let projectQueryparams = {
                        RelativePath: oldfile.url,
                    };
                    yield call(overtimeService.deleteFile, projectQueryparams);
                    //保存新文件
                    yield put({
                        type: 'save',
                        payload: {
                            pf_url: newfile[0].response.file.AbsolutePath,
                            file_relative_path: newfile[0].response.file.RelativePath,
                            file_name: newfile[0].name,
                        }
                    })
                } else {
                    //删除旧文件
                    let projectQueryparams = {
                        RelativePath: oldfile.response.file.RelativePath,
                    };
                    yield call(overtimeService.deleteFile, projectQueryparams);
                    //保存新文件
                    yield put({
                        type: 'save',
                        payload: {
                            pf_url: newfile[0].response.file.AbsolutePath,
                            file_relative_path: newfile[0].response.file.RelativePath,
                            file_name: newfile[0].name,
                        }
                    })
                }
            }
        },
    },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/humanApp/laborSympathy/index/apply') {
                    dispatch({ type: 'init', query });
                }
                if (pathname === '/humanApp/laborSympathy/index/labor_sympathy_apply_look') {
                    dispatch({ type: 'init', query });
                }
            });
        }
    }
};
