/**
 * 作者：邓广晖
 * 创建日期：2017-11-5
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目变更的审核功能
 */
import React from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Button, Tabs, Breadcrumb, Modal, Spin, Radio, Input, message, Icon} from 'antd';

const RadioGroup = Radio.Group;
import {Link} from 'dva/router';
import ProjCheckBasicInfo from './projCheckBasicInfo';
import NotChangeBasicInfo from './notChangeBasicInfo';
import ProjCheckFullcost from './projCheckFullcost';
import NotChangeFullCost from './notChangeFullCost';
import ProjCheckMilstone from './projCheckMilestone';
import NotChangeMilestone from './notChangeMilestone';
import ExamineLink from './projCheckExamineLink';
import ResonModal from '../taskDetailModal';
import config from '../../../../utils/config';
import {getUuid} from '../../../../components/commonApp/commonAppConst.js';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

/**
 * 作者：邓广晖
 * 创建日期：2017-11-5
 * 功能：变更项目审核主页
 */
class ProjCheckMainPage extends React.PureComponent {
    state = {

        approvalContentVisible: false,               //直接通过时模态框是否可见
        approvalContent: '',                         //直接通过，上会，上报总院的备注

        conferenceModalVisible: false,               //上会模态框是否可见
        conferenceKey: getUuid(32,64),               //上会模态框key
        reportModalVisible: false,                   //上报总院模态框是否可见
        conferenceDisabled: true,                    //上会模态框中的确定按钮是否置灰
        reportDisabled: true,                        //上报总院模态框中的确定按钮是否置灰
        reportKey: getUuid(32,64),                   //上报总院模态框的 key
        conferenceSelectedRadio: '',                 //上会选择按钮的值
        reportSelectedRadio: '',                     //上报总院选择按钮的值
        terminateVisible: false,                     //终止流程模态框是否可见
        terminateValue: '',                          //终止流程原因
    };
    /**
     * 作者：胡月
     * 创建日期：2017-11-23
     * 功能：弹出是否上会弹窗，点击确定按钮，审核通过
     */
    conferenceOk = () => {
        this.setState({
            conferenceModalVisible: false
        });
        const {dispatch} = this.props;
        dispatch({
            type: 'projChangeCheck/projChangeApproval',
            payload: {
                arg_proj_uid: this.props.projUid,
                arg_opt_byid: this.props.userid,
                arg_opt_byname: this.props.username,
                arg_bussiness_batchid: this.props.titleDetail.bussiness_batchid,
                arg_check_id: this.props.checkId,
                arg_check_batch_id: this.props.titleDetail.check_batch_id,
                arg_exe_id: this.props.titleDetail.exe_id,
                arg_wf_task_id: this.props.titleDetail.wf_task_id,
                arg_link_id: this.props.titleDetail.link_id,
                arg_link_name: this.props.titleDetail.link_name,
                arg_role_id: this.props.titleDetail.role_id,
                arg_task_uuid: this.props.taskUuid,
                arg_task_batchid: this.props.taskBatchid,
                arg_task_wf_batchid: this.props.taskWfBatchid,
                arg_proj_id: this.props.projId,
                arg_pu_dept_id: this.props.puDeptId,
                arg_proj_origin_name: this.props.projOriginName,
                arg_proj_change_byid: this.props.projChangeByid,
                arg_proj_change_byname: this.props.projChangeByname,
                arg_conference_decision_flag: this.state.conferenceSelectedRadio,
                arg_opt_content: this.state.approvalContent.trim(),
            }
        });
    };
    /**
     * 作者：胡月
     * 创建日期：2018-1-15
     * 功能：弹出是否上报总院弹窗，点击确定按钮，审核通过
     */
    reportOk = () => {
        this.setState({
            reportModalVisible: false
        });
        const {dispatch} = this.props;
        dispatch({
            type: 'projChangeCheck/projChangeApproval',
            payload: {
                arg_proj_uid: this.props.projUid,
                arg_opt_byid: this.props.userid,
                arg_opt_byname: this.props.username,
                arg_bussiness_batchid: this.props.titleDetail.bussiness_batchid,
                arg_check_id: this.props.checkId,
                arg_check_batch_id: this.props.titleDetail.check_batch_id,
                arg_exe_id: this.props.titleDetail.exe_id,
                arg_wf_task_id: this.props.titleDetail.wf_task_id,
                arg_link_id: this.props.titleDetail.link_id,
                arg_link_name: this.props.titleDetail.link_name,
                arg_role_id: this.props.titleDetail.role_id,
                arg_task_uuid: this.props.taskUuid,
                arg_task_batchid: this.props.taskBatchid,
                arg_task_wf_batchid: this.props.taskWfBatchid,
                arg_proj_id: this.props.projId,
                arg_pu_dept_id: this.props.puDeptId,
                arg_proj_origin_name: this.props.projOriginName,
                arg_proj_change_byid: this.props.projChangeByid,
                arg_proj_change_byname: this.props.projChangeByname,
                arg_is_report_zongyuan: this.state.reportSelectedRadio,
                arg_opt_content: this.state.approvalContent.trim(),
            }
        });
    };
    /**
     * 作者：胡月
     * 创建日期：2017-11-23
     * 功能：弹出是否通过审核弹窗，点击确定按钮，审核通过
     */
    hideContentModal = (flag) => {
        if (flag === 'confirm') {
            const {dispatch} = this.props;
            dispatch({
                type: 'projChangeCheck/projChangeApproval',
                payload: {
                    arg_proj_uid: this.props.projUid,
                    arg_opt_byid: this.props.userid,
                    arg_opt_byname: this.props.username,
                    arg_bussiness_batchid: this.props.titleDetail.bussiness_batchid,
                    arg_check_id: this.props.checkId,
                    arg_check_batch_id: this.props.titleDetail.check_batch_id,
                    arg_exe_id: this.props.titleDetail.exe_id,
                    arg_wf_task_id: this.props.titleDetail.wf_task_id,
                    arg_link_id: this.props.titleDetail.link_id,
                    arg_link_name: this.props.titleDetail.link_name,
                    arg_role_id: this.props.titleDetail.role_id,
                    arg_task_uuid: this.props.taskUuid,
                    arg_task_batchid: this.props.taskBatchid,
                    arg_task_wf_batchid: this.props.taskWfBatchid,
                    arg_proj_id: this.props.projId,
                    arg_pu_dept_id: this.props.puDeptId,
                    arg_proj_origin_name: this.props.projOriginName,
                    arg_proj_change_byid: this.props.projChangeByid,
                    arg_proj_change_byname: this.props.projChangeByname,
                    arg_opt_content: this.state.approvalContent.trim(),
                }
            });
        }
        this.setState({
            approvalContentVisible: false
        });
    };
    /**
     * 作者：胡月
     * 创建日期：2017-12-27
     * 功能：点击通过按钮，弹出是否上会的弹窗
     */
    showConfirm = () => {
        if (this.props.isSelectConference === '1' && this.props.isReportZongyuan === '0') {
            this.setState({
                conferenceModalVisible: true,
                conferenceSelectedRadio: '',                 //上会选择按钮的值
                approvalContent: '',                         //直接通过，上会，上报总院的备注
                conferenceDisabled: true,
                conferenceKey: getUuid(32,64)
            });
        } else if (this.props.isSelectConference === '0' && this.props.isReportZongyuan === '0') {
            /*let thisMe = this;
            confirm({
                title: '确定通过审核吗？',
                onOk() {
                    thisMe.handleApprovalClick();
                }
            });*/
            this.setState({
                approvalContentVisible: true,
                approvalContent: '',                         //直接通过，上会，上报总院的备注
            });
        } else if (this.props.isReportZongyuan === '1' && this.props.isSelectConference === '0') {
            this.setState({
                reportModalVisible: true,
                reportSelectedRadio: '',                     //上报总院选择按钮的值
                approvalContent: '',                         //直接通过，上会，上报总院的备注
                reportDisabled: true,
                reportKey: getUuid(32,64)
            });
        }
    };
    setModalVisible = (optType, trueOrFalse) => {
        this.setState({
            [optType]: trueOrFalse
        });
    };
    /**
     * 作者：胡月
     * 创建日期：2017-11-23
     * 功能：点击退回按钮，弹出退回原因弹窗
     */
    handleReturnClick = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'projChangeCheck/backShowModal'
        });
    };

    /**
     * 作者：胡月
     * 创建日期：2017-12-27
     * 功能：点击上会模态框的关闭按钮或者取消按钮，上会模态框关闭
     */
    /*conferenceCancel = () => {
        this.setState({
            conferenceModalVisible: false
        });
    }*/

    /**
     * 作者：胡月
     * 创建日期：2018-1-15
     * 功能：点击上报总院模态框的关闭按钮或者取消按钮，上报总院模态框关闭
     */
    /*reportCancel = () => {
        this.setState({
            reportModalVisible: false
        });
    }*/
    /**
     * 作者：胡月
     * 创建日期：2017-11-23
     * 功能：退回原因弹窗关闭
     */
    handleModalCancelClick = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'projChangeCheck/backHideModal'
        });
    };
    /**
     * 作者：胡月
     * 创建日期：2017-11-23
     * 功能：点击确定按钮，进行退回
     * @param value 原因内容
     */
    handleModalOkClick = (value) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'projChangeCheck/projChangeReturn',
            payload: {
                arg_proj_uid: this.props.projUid,
                arg_opt_byid: this.props.userid,
                arg_opt_byname: this.props.username,
                arg_bussiness_batchid: this.props.titleDetail.bussiness_batchid,
                arg_opt_content: value.reson,
                arg_check_id: this.props.checkId,
                arg_check_batch_id: this.props.titleDetail.check_batch_id,
                arg_exe_id: this.props.titleDetail.exe_id,
                arg_wf_task_id: this.props.titleDetail.wf_task_id,
                arg_link_id: this.props.titleDetail.link_id,
                arg_link_name: this.props.titleDetail.link_name,
                arg_role_id: this.props.titleDetail.role_id,
                arg_task_uuid: this.props.taskUuid,
                arg_task_batchid: this.props.taskBatchid,
                arg_task_wf_batchid: this.props.taskWfBatchid,
                arg_proj_id: this.props.projId,
                arg_proj_origin_name: this.props.projOriginName,
                arg_proj_change_byid: this.props.projChangeByid,
                arg_proj_change_byname: this.props.projChangeByname
            }
        });
    };
    /*
    * 作者：邓广晖
    * 创建日期：2017-11-23
    * 功能：点击修改按钮，进入修改页面
    * */
    jumpModify = () => {
        this.props.dispatch(routerRedux.push({
            pathname: '/projChangeModify',
            query: {
                arg_tag: this.props.roleTag,
                arg_handle_flag: this.props.flag,
                arg_proj_id: this.props.projId,
                arg_check_id: this.props.checkId,
                arg_task_uuid: this.props.taskUuid,
                arg_task_batchid: this.props.taskBatchid,
                arg_task_wf_batchid: this.props.taskWfBatchid,
            }
        }));
    };
    /**
     * 作者：邓广晖
     * 创建日期：2017-11-09
     * 功能：tab切换
     */
    switchTab = (key) => {
        this.props.dispatch({
            type: 'projChangeCheck/changeTabKey',
            payload: {
                key: key,
                backButtonIsDown: this.props.backButtonIsDown
            }
        });
        //切换到 里程碑和全成本时 根据情况查询服务，  其他tab默认查询
        if (key === '2') {
            if (this.props.t2 === '1') {
                this.props.dispatch({
                    type: 'projChangeCheck/projCheckMilestone'
                });
            } else {
                this.props.dispatch({
                    type: 'projChangeCheck/notChangeMilestone'
                });
            }
        } else if (key === '3') {
            /*if (this.props.t3 === '1') {*/
            this.props.dispatch({
                type: 'projChangeCheck/beforeProjCheckFullcost' // 当点击全成本时，根据是否变化走相应服务
            });
            /* } else {
                 this.props.dispatch({
                     type: 'projChangeCheck/notChangeFullcost'
                 });
             }*/
        }
    };
    /**
     * 作者：邓广晖
     * 创建日期：2017-12-06
     * 功能：点击审批历史列表详情跳转
     */
    goCheckDetail = () => {
        if (this.props.isFinanceLink === '1') {
            this.props.dispatch({
                type: 'projChangeCheck/changeTabKey',
                payload: {
                    key: '3',
                    backButtonIsDown: false
                }
            });
        } else {
            this.props.dispatch({
                type: 'projChangeCheck/changeTabKey',
                payload: {
                    key: '1',
                    backButtonIsDown: false
                }
            });
        }
    };
    /**
     * 作者：邓广晖
     * 创建日期：2017-12-06
     * 功能：从审批历史具体详情返回时，回到上一个页面，并将tab切换到 4
     */
    goBackCheckTab = () => {
        this.props.dispatch({
            type: 'projChangeCheck/changeTabKey',
            payload: {
                key: '4',
                backButtonIsDown: true,
            }
        });
        history.back();
    };
    /**
     * 作者：胡月
     * 创建日期：2017-12-27
     * 功能：选择是否上会，来决定“确定”按钮是否可点击
     */
    conferenceRadioChange = (e) => {
        if (e.target.value) {
            this.setState({
                conferenceDisabled: false,
                conferenceSelectedRadio: e.target.value
            })
        }
    };
    /**
     * 作者：胡月
     * 创建日期：2018-1-15
     * 功能：选择是否上报总院，来决定“确定”按钮是否可点击
     */
    reportRadioChange = (e) => {
        if (e.target.value) {
            this.setState({
                reportDisabled: false,
                reportSelectedRadio: e.target.value
            })
        }
    };
    /**
     * 作者：邓广晖
     * 创建日期：2017-12-06
     * 功能：申请人，被退回后，可终止流程
     */
    terminate = () => {
        this.setState({
            terminateVisible: true
        });
    };
    /**
     * 作者：邓广晖
     * 创建日期：2018-01-22
     * 功能：设置输入型框的值
     * @param e 输入事件
     * @param inputType 输入的类型
     */
    setInputValue = (e, inputType) => {
        this.state[inputType] = e.target.value;
    };
    /**
     * 作者：邓广晖
     * 创建日期：2018-01-22
     * 功能：终止流程
     * @param flag 确定标志位
     */
    hideTerminateModal = (flag) => {
        if (flag === 'confirm') {
            if (this.state.terminateValue.trim() === '') {
                message.error('终止原因不能为空');
                return;
            } else {
                this.props.dispatch({
                    type: 'projChangeCheck/terminate',
                    payload: {
                        arg_proj_id: this.props.projId,
                        arg_proj_name: this.props.projOriginName,
                        arg_proj_uid: this.props.projUid,
                        arg_opt_byid: this.props.userid,
                        arg_opt_byname: this.props.username,
                        arg_opt_content: this.state.terminateValue.trim(), //终止流程原因，必传
                        arg_business_batchid: this.props.titleDetail.bussiness_batchid,
                        arg_business_id: this.props.businessId,
                        arg_check_id: this.props.checkId,
                        arg_check_batch_id: this.props.titleDetail.check_batch_id,
                        arg_exe_id: this.props.titleDetail.exe_id,
                        arg_task_uuid: this.props.taskUuid,
                        arg_task_batchid: this.props.taskBatchid,
                        arg_task_wf_batchid: this.props.taskWfBatchid,
                    }
                });
            }
        }
        this.setState({
            terminateVisible: false
        });
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {TextArea} = Input;
        const {
            dispatch, notChangeBasicInfo, roleTag,
            projOriginName, changeReason, preLinkName, linkName,
            returnReason, flag, taskUuid, modalVisible, projChangeLog,
            projId, isFinanceLink,
            tabListArr, isShowTabINFullCost, squareTabKey

        } = this.props;
        // console.log('主页面')
        // console.log(this.props.tabListArr)

        let operations;
        if (typeof(taskUuid) !== 'string') {
            operations = (
                <div>
                    <Button type="primary" style={{marginRight: 10}} onClick={this.goBackCheckTab}>返回</Button>
                </div>
            );
        } else {
            if (flag === '0') {
                if (roleTag === '4' && typeof(taskUuid) === 'string') {
                    operations = (
                        <div>
                            <Button type="primary" style={{marginRight: 10}} onClick={this.showConfirm}>通过</Button>
                            {/*通过备注*/}
                            <Modal visible={this.state.approvalContentVisible}
                                   key={getUuid(20, 62)}
                                   width={600}
                                   onOk={() => this.hideContentModal('confirm')}
                                   onCancel={() => this.hideContentModal('cancel')}
                            >
                                <div style={{fontWeight: 'bold', fontSize: 20, marginTop: 20, textAlign: 'center'}}>
                                    <Icon
                                        type='question-circle-o'
                                        style={{fontSize: 20, color: '#ffbf00'}}
                                    />
                                    &nbsp;&nbsp;
                                    {'确定通过审核吗？'}
                                </div>
                                <div>
                                   <TextArea
                                       rows={4}
                                       onChange={(e) => this.setInputValue(e, 'approvalContent')}
                                       placeholder={'（选填）填写备注信息，限100字'}
                                       maxLength='100'
                                   />
                                </div>
                            </Modal>

                            <Modal
                                visible={this.state.conferenceModalVisible}
                                onCancel={() => this.setModalVisible('conferenceModalVisible', false)}
                                width={600}
                                key={this.state.conferenceKey}
                                footer={[
                                    <Button
                                        key="conferenceBack"
                                        onClick={() => this.setModalVisible('conferenceModalVisible', false)}
                                    >取消</Button>,
                                    <Button
                                        key="conferenceSubmit"
                                        type="primary"
                                        onClick={this.conferenceOk}
                                        disabled={this.state.conferenceDisabled}
                                    >确定</Button>
                                ]}
                            >
                                <div>
                                    <div style={{fontWeight: 'bold', fontSize: 16, marginBottom: '10px'}}>是否上会?</div>
                                    <RadioGroup onChange={this.conferenceRadioChange}>
                                        <Radio value={'1'}>是</Radio>
                                        <Radio value={'0'}>否</Radio>
                                    </RadioGroup>
                                    <div style={{marginTop: '10px'}}>
                                    <TextArea
                                        rows={4}
                                        onChange={(e) => this.setInputValue(e, 'approvalContent')}
                                        placeholder={'（选填）填写备注信息，限100字'}
                                        maxLength='100'
                                    />
                                    </div>
                                </div>
                            </Modal>
                            <Modal
                                visible={this.state.reportModalVisible}
                                onCancel={() => this.setModalVisible('reportModalVisible', false)}
                                width={600}
                                key={this.state.reportKey}
                                footer={[
                                    <Button
                                        key="reportBack"
                                        onClick={() => this.setModalVisible('reportModalVisible', false)}
                                    >取消</Button>,
                                    <Button
                                        key="reportSubmit"
                                        type="primary"
                                        onClick={this.reportOk}
                                        disabled={this.state.reportDisabled}
                                    >确定</Button>
                                ]}
                            >
                                <div>
                                    <div style={{fontWeight: 'bold', fontSize: 16, marginBottom: '10px'}}>是否上报总院?</div>
                                    <RadioGroup onChange={this.reportRadioChange}>
                                        <Radio value={'1'}>是</Radio>
                                        <Radio value={'0'}>否</Radio>
                                    </RadioGroup>
                                    <div style={{marginTop: '10px'}}>
                                    <TextArea
                                        rows={4}
                                        onChange={(e) => this.setInputValue(e, 'approvalContent')}
                                        placeholder={'（选填）填写备注信息，限100字'}
                                        maxLength='100'
                                    />
                                    </div>
                                </div>
                            </Modal>
                            <Button type="primary" style={{marginRight: 10}}
                                    onClick={this.handleReturnClick}>退回</Button>
                            <ResonModal
                                okClick={this.handleModalOkClick}
                                cancelClick={this.handleModalCancelClick}
                                isShow={modalVisible}
                            />
                        </div>
                    );
                } else if (roleTag === '3' && typeof(taskUuid) === 'string') {
                    operations = (
                        <div>
                            <Button type="primary" style={{marginRight: 10}} onClick={this.terminate}>终止</Button>
                            {/*终止流程原因*/}
                            <Modal visible={this.state.terminateVisible}
                                   key={getUuid(20, 62)}
                                   title={'终止流程原因'}
                                   width={'500px'}
                                   onOk={() => this.hideTerminateModal('confirm')}
                                   onCancel={() => this.hideTerminateModal('cancel')}
                            >
                                <div>
                                    <div style={{
                                        color: 'red',
                                        display: 'inline-block',
                                        verticalAlign: 'top',
                                        marginRight: 5
                                    }}>{"*"}</div>
                                    <div style={{display: 'inline-block', width: '97%'}}>
                                    <TextArea rows={4} onChange={(e) => this.setInputValue(e, 'terminateValue')}
                                              placeholder={'请输入终止流程原因,限200字'} maxLength='200'/>
                                    </div>
                                </div>
                            </Modal>
                            <Button type="primary" style={{marginRight: 10}} onClick={this.jumpModify}>修改</Button>
                        </div>
                    );
                }
            } else {
                operations = '';
            }
        }

        // 根据子tab的值切换到对比 与 非对比

        let tabFlagChange = '';
        if (tabListArr.length !== 0) {
            if (isShowTabINFullCost === '1') {  // 有子tab
                let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
                tabFlagChange = tabItem.tab_flag_change;
            } else {
                tabFlagChange = tabListArr[0].tab_flag_change;
            }
        }


        return (
            <Spin tip={config.PROCESSING_DATA} spinning={this.props.loading}>
                <div style={{background: 'white', padding: '10px 10px 10px 10px'}}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to='/taskList'>任务列表</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {
                                typeof(taskUuid) === 'string'
                                    ?
                                    (
                                        flag == '0'
                                            ?
                                            '待办任务详情'
                                            :
                                            (
                                                flag == '1'
                                                    ? '已办任务详情'
                                                    :
                                                    (
                                                        flag == '3'
                                                            ? '办结任务详情'
                                                            : '任务详情'
                                                    )
                                            )
                                    )
                                    :
                                    '审核环节'}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 28,
                        marginBottom: '8px'
                    }}>{projOriginName}</div>
                    <div style={{fontSize: 16, textAlign: 'left', marginBottom: '12px', marginTop: '23px'}}>
                        <div style={{marginBottom: '10px'}}>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span style={{fontWeight: 'bold', fontSize: 16}}>上一环节：</span>{preLinkName}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span style={{fontWeight: 'bold', fontSize: 16}}>当前环节：</span>{linkName}
                        </div>
                        <div style={{marginBottom: '10px'}}>
                            {
                                roleTag === '4'
                                    ?
                                    <div style={{marginLeft: 20}}>
                                        <span style={{fontWeight: 'bold', fontSize: 16}}>变更原因：</span>
                                        <TextArea value={changeReason}
                                                  autosize={{minRows: 1, maxRows: 4}}
                                                  style={{width: '90%', verticalAlign: 'top', color: 'black'}}
                                                  disabled={true}
                                        >
                                        </TextArea>
                                    </div>
                                    :
                                    (
                                        this.props.returnReasonFlag === '1' ?
                                            <div style={{marginLeft: 20}}>
                                                <span style={{fontWeight: 'bold', fontSize: 16}}>退回原因：</span>
                                                <TextArea value={returnReason}
                                                          autosize={{minRows: 1, maxRows: 4}}
                                                          style={{width: '90%', verticalAlign: 'top', color: 'black'}}
                                                          disabled={true}
                                                >
                                                </TextArea>
                                            </div>
                                            :
                                            null
                                    )
                            }
                        </div>

                    </div>
                    <Tabs
                        tabBarExtraContent={operations}
                        onTabClick={this.switchTab}
                        activeKey={this.props.tab_key}
                    >
                        <TabPane tab={<span
                            style={{color: this.props.isFinanceLink === '0' ? (this.props.t1 === '1' ? 'black' : '#d6d0d0') : '#d6d0d0'}}>基本信息</span>}
                                 key="1">
                            {this.props.isFinanceLink === '0' ?
                                <div>
                                    {this.props.t1 === '1' ?
                                        <ProjCheckBasicInfo
                                            dispatch={dispatch}
                                            projInfoTableData={this.props.projInfoTableData}
                                        />
                                        :
                                        <NotChangeBasicInfo
                                            projectInfo={notChangeBasicInfo}
                                            isFinanceLink={isFinanceLink}
                                            pms_list={this.props.pms_list}
                                        />
                                    }
                                </div>
                                :
                                <NotChangeBasicInfo
                                    ref="notChangeBasicInfo"
                                    projectInfo={notChangeBasicInfo}
                                    isFinanceLink={isFinanceLink}
                                    pms_list={this.props.pms_list}
                                />
                            }

                        </TabPane>
                        <TabPane tab={<span
                            style={{color: this.props.isFinanceLink === '0' ? (this.props.t2 === '1' ? 'black' : '#d6d0d0') : '#d6d0d0'}}>里程碑</span>}
                                 key="2">
                            {this.props.isFinanceLink === '0' ?
                                <div>
                                    {this.props.t2 === '1' ?
                                        <ProjCheckMilstone
                                            checkMilestonePreData={this.props.checkMilestonePreData}
                                            checkMilestoneNewData={this.props.checkMilestoneNewData}
                                            old_fore_workload={this.props.old_fore_workload}
                                            new_fore_workload={this.props.new_fore_workload}
                                            new_remain_workload={this.props.new_remain_workload}
                                            old_remain_workload={this.props.old_remain_workload}
                                        />
                                        :
                                        <NotChangeMilestone
                                            notChangeMileInfo={this.props.notChangeMileInfo}
                                            isFinanceLink={this.props.isFinanceLink}
                                        />
                                    }
                                </div>
                                :
                                <NotChangeMilestone
                                    notChangeMileInfo={this.props.notChangeMileInfo}
                                    isFinanceLink={this.props.isFinanceLink}
                                />
                            }

                        </TabPane>
                        <TabPane tab={<span
                            style={{color: this.props.isFinanceLink === '0' ? (this.props.t3 === '1' ? 'black' : '#d6d0d0') : 'black'}}>全成本</span>}
                                 key="3">
                            {tabFlagChange === '1' ?
                                <ProjCheckFullcost
                                    loading={this.props.loading}
                                    dispatch={this.props.dispatch}
                                    coorpDeptCompList={this.props.coorpDeptCompList}
                                    compBudgetTableData={this.props.compBudgetTableData}
                                    isShowTabINFullCost={this.props.isShowTabINFullCost}
                                    tabListArr={this.props.tabListArr}
                                    squareTabKey={this.props.squareTabKey}
                                />
                                :
                                <NotChangeFullCost loading={this.props.loading}
                                                   dispatch={this.props.dispatch}
                                                   coorpDeptList={this.props.coorpDeptList}
                                                   deptBudgetTableData={this.props.deptBudgetTableData}
                                                   allDeptList={this.props.allDeptList}
                                                   predictTimeTotal={this.props.predictTimeTotal}
                                                   isShowTabINFullCost={this.props.isShowTabINFullCost}
                                                   tabListArr={this.props.tabListArr}
                                                   squareTabKey={this.props.squareTabKey}
                                />
                            }

                        </TabPane>
                        {
                            typeof(taskUuid) === 'string'
                                ?
                                <TabPane tab={<span>审批环节</span>} key="4">
                                    <ExamineLink ref="examineLink"
                                                 dispatch={dispatch}
                                                 projChangeLog={projChangeLog}
                                                 projId={projId}
                                                 flag={flag}
                                                 goCheckDetail={this.goCheckDetail}
                                                 roleTag={roleTag}/>
                                </TabPane>
                                : ''
                        }
                    </Tabs>
                </div>
            </Spin>
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loading.models.projChangeCheck,
        ...state.projChangeCheck
    }
}

export default connect(mapStateToProps)(ProjCheckMainPage);
