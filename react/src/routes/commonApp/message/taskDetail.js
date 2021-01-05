/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：代办详情
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Tabs, Icon, Pagination, Breadcrumb, Button, Modal, Spin, } from 'antd';
import BaseInfo from './taskDetailBaseInfo';
import MileInfo from './taskDetailMilestone';
import ProjFullCost from './taskDetailFullCost';
//import ProjFullCost from '../../project/startup/projStartMain/projFullCost';
import AttachmentInfo from './taskDetailAttachment';
import LogInfo from './taskDetailLog';
import ResonModal from './taskDetailModal';
import styles from './task.less';
import CheckApproveModal from './projAdd/checkApproveModal';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：代办详情主页
 */
class TaskDetail extends React.Component {
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：通过
     * @param approveValue 通过时的备注信息
     */
    handleApprovalClick = (approveValue) => {
        const {taskDetail,userid,username} = this.props;
        this.props.dispatch({
            type:'task/taskApproval',
            payload:{
                arg_proj_uid: taskDetail.proj_uid,
                arg_opt_byid: userid,
                arg_opt_byname: username,
                arg_bussiness_batchid: taskDetail.bussiness_batchid,
                arg_check_id: this.props.checkId,
                arg_check_batch_id: taskDetail.check_batchid,
                arg_exe_id: taskDetail.exe_id,
                arg_link_id: taskDetail.link_id,
                arg_link_name: taskDetail.link_name,
                arg_role_id: taskDetail.role_id,
                arg_task_uuid: this.props.taskUuid,
                arg_task_batchid: this.props.taskBatchid,
                arg_task_wf_batchid: this.props.taskWfBatchid,
                arg_opt_content: approveValue
            }
        });
    };

    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：退回Click事件
     * @param e 点击事件默认参数
     */
    handleReturnClick = (e) => {
        this.props.dispatch({
            type:'task/taskShowModal'
        });
    };

    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：修改Click事件
     * @param e 点击事件默认参数
     */
    handleUpdateClick = (e) => {
        this.props.dispatch({
            type:'task/taskUpdatePage',
            payload:{
                arg_check_id: this.props.checkId,
                arg_task_uuid: this.props.taskUuid,
                arg_task_batchid: this.props.taskBatchid,
                arg_task_wf_batchid: this.props.taskWfBatchid,
                arg_task_tab: this.props.isShowAllTab,
                is_check: '1',
            }
        });
    };

    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：提示
     */
    showConfirm = () => {
        this.refs.checkApproveModal.showModal();
    }

    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：ok按钮Click事件
     * @param value 原因内容
     */
    handleModalOkClick = (value) => {
        const {taskDetail,userid,username} = this.props;
        this.props.dispatch({
            type:'task/taskReturn',
            payload:{
                arg_proj_uid: taskDetail.proj_uid,
                arg_opt_byid: userid,
                arg_opt_byname: username,
                arg_bussiness_batchid: taskDetail.bussiness_batchid,
                arg_check_id: this.props.checkId,
                arg_check_batch_id: taskDetail.check_batchid,
                arg_exe_id: taskDetail.exe_id,
                arg_link_id: taskDetail.link_id,
                arg_link_name: taskDetail.link_name,
                arg_role_id: taskDetail.role_id,
                arg_task_uuid: this.props.taskUuid,
                arg_task_batchid: this.props.taskBatchid,
                arg_task_wf_batchid: this.props.taskWfBatchid,
                arg_create_byid: this.props.createId,
                arg_create_byname: this.props.createName,
                arg_opt_content:value.reson
            }
        });
    };

    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：关闭Click事件
     * @param e 默认参数
     */
    handleModalCancelClick = (e) => {
        this.props.dispatch({
            type:'task/taskHideModal'
        });
    };

    handleTabClick = (e) => {
        this.props.dispatch({
            type:'task/tabChange',
            payload:e
        });
    };

    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：tableClick事件
     * @param e 点击事件默认参数
     * @param flag 待办标记
     */
    handleLogTableClick = (e,flag) => {
        if (e.current_opt_flag) {
            this.props.dispatch({
                type:'task/taskDetailPage',
                payload:{
                    arg_flag:flag,
                    arg_check_id:e.check_id
                }
            });
        }
    };

    render() {
        const {
            activeKey, loading, modalVisible, checkId, flag,
            taskUuid, headInfo, taskDetail, pms_list,
            taskMilestone, taskLog, taskAttachment, isUserOwner,
            isShowAllTab, isChecked
        } = this.props;
        const tabColorStyle = (
            ( flag == '1' || flag =='3' )
                ?
                'black'
                :
                isShowAllTab === '-1'
                    ?
                    'black'
                    :
                    '#d6d0d0'
        );

        return (
            <div className={styles['pageContainer']}>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to='/taskList'>任务列表</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {
                            typeof(taskUuid) == 'string'
                                ?
                                (
                                    flag == '0'
                                        ? '待办任务详情'
                                        : (
                                            flag == '1'
                                                ?'已办任务详情'
                                                : (flag=='3'? '办结任务详情' : '任务详情')
                                        )
                                )
                                :
                                '审核历史'
                        }
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Spin tip="处理中..." spinning={loading}>
                    <Row className={styles.headerInfo}>
                        <Col span={24} className={styles['middle-box']}>
                            <div className={styles['middle-inner']}>
                                <h3 style={{textAlign:'center',paddingTop:10,paddingBottom:10}}>{taskDetail.proj_name}</h3>
                                <ul>
                                    <li><b>项目经理</b>：{taskDetail.mgr_name}</li>
                                    <li><b>项目简称</b>：{taskDetail.proj_shortname}</li>
                                    <li><b>创建时间</b>：{taskDetail.create_time}</li>
                                    <li><b>上一环节</b>：{headInfo.pre_link_name}</li>
                                    <li><b>当前环节</b>：{taskDetail.link_name}</li>
                                    {
                                        headInfo.pre_opt_flag == 3
                                            ?
                                            <li><b>退回原因</b>：{headInfo.pre_opt_comment}</li>
                                            :
                                            <li></li>
                                    }

                                </ul>
                            </div>
                        </Col>
                    </Row>
                    <CheckApproveModal
                        ref={'checkApproveModal'}
                        handleApprovalClick={this.handleApprovalClick}
                    />
                    <Tabs
                        tabBarExtraContent={
                            isChecked == 1
                                ?
                                <div>
                                    <Button
                                        type="primary"
                                        style={{marginRight:10}}
                                        onClick={ isUserOwner == 1 ? this.handleUpdateClick : this.showConfirm}
                                    >
                                        {isUserOwner == 1 ? '修改' : '通过'}
                                    </Button>
                                    <Button
                                        type="primary"
                                        style={{
                                            marginRight:10,
                                            display:isUserOwner == 1 ? 'none' : ''
                                        }}
                                        onClick={this.handleReturnClick}
                                    >退回
                                    </Button>
                                </div>
                                :
                                ''
                        }
                        activeKey={activeKey}
                        onTabClick={this.handleTabClick}
                    >
                        <TabPane
                            tab={<span style={{color: tabColorStyle}}>基本信息</span>}
                            key="1"
                        >
                            <BaseInfo
                                projectInfo={taskDetail}
                                pms_list={pms_list}
                            />
                        </TabPane>
                        <TabPane
                            tab={<span style={{color: tabColorStyle}}>里程碑</span>}
                            key="2"
                        >
                            <MileInfo
                                mileStoneList={taskMilestone}
                            />
                        </TabPane>
                        <TabPane tab="全成本" key="3">
                            <ProjFullCost
                                dispatch={this.props.dispatch}
                                deptBudgetTableData={this.props.deptBudgetTableData}
                                coorpDeptList={this.props.coorpDeptList}
                                allDeptList={this.props.allDeptList}
                                predictTimeTotal={this.props.predictTimeTotal}
                                fullCostPmsTab={this.props.fullCostPmsTab}
                                fullCostShowPmsTab={this.props.fullCostShowPmsTab}
                                fullCostPmsListData={this.props.fullCostPmsListData}
                            />
                        </TabPane>
                        <TabPane
                            tab={<span style={{color: tabColorStyle}}>附件信息</span>}
                            key="4"
                        >
                            <AttachmentInfo data={taskAttachment}/>
                        </TabPane>
                        {
                            typeof(taskUuid) == 'string'
                                ?
                                <TabPane forceRender={true} tab="审批环节" key="5">
                                    <LogInfo
                                        data={taskLog}
                                        flag={flag=='0'?'1':flag}
                                        checkId={checkId}
                                        handleClick={this.handleLogTableClick}/>
                                </TabPane>
                                :
                                ''
                        }
                    </Tabs>
                    <ResonModal
                        okClick={this.handleModalOkClick}
                        cancelClick={this.handleModalCancelClick}
                        isShow={modalVisible}
                    >
                    </ResonModal>
                </Spin>
            </div>
        );
    }
}
/*function TaskDetail(
    {
        isUserFinance, activeKey, dispatch, loading,
        userid, username, createId, createName,
        modalVisible, checkId, flag,
        taskUuid, taskBatchid, taskWfBatchid, headInfo,
        taskDetail, pms_list, predictTimeTotal, taskMilestone,
        taskLog, taskDept, taskAllDept, taskBudget,
        taskAttachment, isUserOwner, isShowAllTab, isChecked
    }) {
    /!**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：提交Click事件
     * @param e 点击事件默认参数
     *!/
    const handleApprovalClick = e => {
        dispatch({
            type:'task/taskApproval',
            payload:{
                arg_proj_uid:taskDetail.proj_uid,
                arg_opt_byid:userid,
                arg_opt_byname:username,
                arg_bussiness_batchid:taskDetail.bussiness_batchid,
                arg_check_id:checkId,
                arg_check_batch_id:taskDetail.check_batchid,
                arg_exe_id:taskDetail.exe_id,
                arg_link_id:taskDetail.link_id,
                arg_link_name:taskDetail.link_name,
                arg_role_id:taskDetail.role_id,
                arg_task_uuid:taskUuid,
                arg_task_batchid:taskBatchid,
                arg_task_wf_batchid:taskWfBatchid
            }
        });
    };
    /!**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：退回Click事件
     * @param e 点击事件默认参数
     *!/
    const handleReturnClick = e => {
        dispatch({
            type:'task/taskShowModal'
        });

    };
    /!**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：修改Click事件
     * @param e 点击事件默认参数
     *!/
    const handleUpdateClick = e => {
        dispatch({
            type:'task/taskUpdatePage',
            payload:{
                arg_check_id:checkId,
                arg_task_uuid:taskUuid,
                arg_task_batchid:taskBatchid,
                arg_task_wf_batchid:taskWfBatchid,
                arg_task_tab:isShowAllTab,
            }
        });

    };
    /!**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：提示
     *!/
    const showConfirm = () => {
        confirm({
            title: '确定通过审核吗？',
            onOk() {
                handleApprovalClick();
            }
        });
    }
    /!**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：ok按钮Click事件
     * @param value 原因内容
     *!/
    const handleModalOkClick = value => {
        dispatch({
            type:'task/taskReturn',
            payload:{
                arg_proj_uid:taskDetail.proj_uid,
                arg_opt_byid:userid,
                arg_opt_byname:username,
                arg_bussiness_batchid:taskDetail.bussiness_batchid,
                arg_check_id:checkId,
                arg_check_batch_id:taskDetail.check_batchid,
                arg_exe_id:taskDetail.exe_id,
                arg_link_id:taskDetail.link_id,
                arg_link_name:taskDetail.link_name,
                arg_role_id:taskDetail.role_id,
                arg_task_uuid:taskUuid,
                arg_task_batchid:taskBatchid,
                arg_task_wf_batchid:taskWfBatchid,
                arg_create_byid:createId,
                arg_create_byname:createName,
                arg_opt_content:value.reson
            }
        });

    };
    /!**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：关闭Click事件
     * @param e 默认参数
     *!/
    const handleModalCancelClick = e => {
        dispatch({
            type:'task/taskHideModal'
        });

    };
    const handleTabClick = e => {
        dispatch({
            type:'task/tabChange',
            payload:e
        });

    };
    /!**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：tableClick事件
     * @param e 点击事件默认参数
     * @param flag 待办标记
     *!/
     const handleLogTableClick = (e,flag) => {
         if (e.current_opt_flag) {
             dispatch({
                 type:'task/taskDetailPage',
                 payload:{
                     arg_flag:flag,
                     arg_check_id:e.check_id
                 }
             });
         }
     };

     const tabColorStyle = (
         ( flag == '1' || flag =='3' )
             ?
                'black'
             :
                isShowAllTab === '-1'
                    ?
                        'black'
                    :
                        '#d6d0d0'
     );
    return (
        <div className={styles['pageContainer']}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/taskList'>任务列表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>
                    {
                        typeof(taskUuid) == 'string'
                            ?
                            (
                                flag == '0'
                                    ? '待办任务详情'
                                    : (
                                        flag == '1'
                                            ?'已办任务详情'
                                            : (flag=='3'? '办结任务详情' : '任务详情')
                                    )
                            )
                            :
                            '审核历史'
                    }
                </Breadcrumb.Item>
            </Breadcrumb>
            <Spin tip="处理中..." spinning={loading}>
                <Row className={styles.headerInfo}>
                    <Col span={24} className={styles['middle-box']}>
                        <div className={styles['middle-inner']}>
                            <h3 style={{textAlign:'center',paddingTop:10,paddingBottom:10}}>{taskDetail.proj_name}</h3>
                            <ul>
                                <li><b>项目经理</b>：{taskDetail.mgr_name}</li>
                                <li><b>项目简称</b>：{taskDetail.proj_shortname}</li>
                                <li><b>创建时间</b>：{taskDetail.create_time}</li>
                                <li><b>上一环节</b>：{headInfo.pre_link_name}</li>
                                <li><b>当前环节</b>：{taskDetail.link_name}</li>
                                {
                                    headInfo.pre_opt_flag == 3
                                    ?
                                    <li><b>退回原因</b>：{headInfo.pre_opt_comment}</li>
                                    :
                                    <li></li>
                                }

                            </ul>
                        </div>
                    </Col>
                </Row>
                <Tabs
                    tabBarExtraContent={
                        isChecked == 1
                            ?
                            <div>
                                <Button
                                    type="primary"
                                    style={{marginRight:10}}
                                    onClick={ isUserOwner == 1 ? handleUpdateClick : showConfirm}
                                >
                                    {isUserOwner == 1 ? '修改' : '通过'}
                                </Button>
                                <Button
                                    type="primary"
                                    style={{
                                        marginRight:10,
                                        display:isUserOwner == 1 ? 'none' : ''
                                    }}
                                    onClick={handleReturnClick}
                                >退回
                                </Button>
                            </div>
                        :
                        ''
                    }
                    activeKey={activeKey}
                    onTabClick={handleTabClick}
                >
                        <TabPane
                            tab={<span style={{color: tabColorStyle}}>基本信息</span>}
                            key="1"
                        >
                            <BaseInfo
                                projectInfo={taskDetail}
                                pms_list={pms_list}
                            />
                        </TabPane>
                        <TabPane
                            tab={<span style={{color: tabColorStyle}}>里程碑</span>}
                            key="2"
                        >
                            <MileInfo
                                mileStoneList={taskMilestone}
                            />
                        </TabPane>
                        <TabPane tab="全成本" key="3">
                            <ProjFullCost
                                deptBudgetTableData={taskBudget}
                                coorpDeptList={taskDept}
                                allDeptList={taskAllDept}
                                predictTimeTotal={predictTimeTotal}
                            />
                        </TabPane>
                        <TabPane
                            tab={<span style={{color: tabColorStyle}}>附件信息</span>}
                            key="4"
                        >
                            <AttachmentInfo data={taskAttachment}/>
                        </TabPane>
                        {
                            typeof(taskUuid) == 'string'
                            ?
                            <TabPane forceRender={true} tab="审批环节" key="5">
                                <LogInfo
                                    data={taskLog}
                                    flag={flag=='0'?'1':flag}
                                    checkId={checkId}
                                    handleClick={handleLogTableClick}/>
                            </TabPane>
                            :
                            ''
                        }
                </Tabs>
                <ResonModal
                    okClick={handleModalOkClick}
                    cancelClick={handleModalCancelClick}
                    isShow={modalVisible}
                >
                </ResonModal>
            </Spin>
        </div>
    );
}*/
function mapStateToProps(state) {
    return {
        loading: state.loading.models.task,
        ...state.task
    };
}
export default connect(mapStateToProps)(TaskDetail);
