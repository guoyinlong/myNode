/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：代办详情
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Tabs, Icon, Pagination, Breadcrumb, Button, Modal, Table } from 'antd';
import styles from './taskTeamManage.less';
import ResonModal from './taskDetailModal';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：代办详情主页
 */
function TaskTeamManage({dispatch, loading, teamData, projData, activeKey, arg_opt,optId,queryType,flag, visible, historyList, teamBatchid}) {
    /**
    * 变更项目成员table
    */
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            render: (text, record, index) => index+1,
            width: '10%'
        },{
            title: '主建单位',
            dataIndex: 'ouName',
            render:(text)=>{
                return text.includes('-') ?text.split('-')[1]:text;
            },
            width: '20%'
        },{
            title: '主建部门',
            dataIndex: 'deptName',
            render:(text)=>{
                return text.includes('-') ?text.split('-')[1]:text;
            },
            width: '25%'
        },{
            title: '员工编号',
            dataIndex: 'staffId',
            width: '15%'
        },{
            title:'姓名',
            dataIndex:'staffName',
            width: '15%'
        },{
            title:'类型',
            dataIndex:'type',
            render:(text)=>{
                return (text === '0' ? '主责' : '配合')
            },
            width: '10%'
        },{
            title:'操作',
            dataIndex:'opt',
            render:(text)=>{
                let str = ''
                switch(text){
                    case 'insert':
                        str = '加入';
                        break;
                    case 'delete':
                        str = '退出';
                        break;
                }
                return str;
            },
            width: '5%'
        }
    ];
    const tabChange = (key) => {
        dispatch({
            type:'taskTeamManage/tabChange',
            payload:{
              'projId':projData.projId,
              'activeKey':key,
              'optId': optId,
              'flag':flag,
              'teamBatchid':teamBatchid,
              'queryType':queryType
            }
        });
    }
    const nextClick = (key) => {
        confirm({
            title: '确定通过审核吗？',
            onOk() {
                dispatch({
                    type:'taskTeamManage/projTeamPass',
                    payload:{
                        'staffId':teamData[0].staffId,
                        'opt':arg_opt,
                        'deptName':teamData[0].deptName,
                        'projId':teamData[0].proj.id,
                        'ou':teamData[0].ouName
                    }
                });
            }
        });
    }
    const backClick = (key) => {
        dispatch({
            type:'taskTeamManage/showModal'
        });
    }
    const editClick = (key) => {
        dispatch({
            type:'taskTeamManage/projTeamEdit',
            payload:{
                'arg_opt':arg_opt,
                'projId':projData.projId,
                'projName':projData.projName,
                'projMainDep':projData.projMainDep,
                'createBy':projData.createBy,
                'ouDefineName':projData.ouDefineName,
                'marId':projData.marId,
                'marName':projData.marName
            }
        });
    }
    const okClickModal = (value) => {
        dispatch({
            type:'taskTeamManage/projTeamBack',
            payload:{
                'staffId':teamData[0].createBy,
                'opt':arg_opt,
                'projId':teamData[0].proj.id,
                'reason':value.reson
            }
        });
    };
    const cancelClickModal = () => {
        dispatch({
            type:'taskTeamManage/hideModal'
        });
    };

    const historyColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => index+1,
            width: '10%'
        },{
            title: '状态',
            dataIndex: 'tag',
            width: '10%'
        },{
            title: '环节名称',
            dataIndex: 'createBy',
            width: '15%'
        },{
            title: '审批人',
            dataIndex: 'updateBy',
            width: '10%'
        },{
            title:'审批类型',
            dataIndex:'checkState',
            render:(text)=>{
                let str = ''
                switch(text){
                    case '1':
                        str = '提交';
                        break;
                    case '2':
                        str = '部门经理通过';
                        break;
                    case '3':
                        str = '部门经理退回';
                        break;
                    case '4':
                        str = '提交到TMO';
                        break;
                    case '5':
                        str = 'TMO通过';
                        break;
                    case '6':
                        str = 'TMO退回';
                        break;
                }
                return str;
            },
            width: '15%'
        },{
            title:'审批意见',
            dataIndex:'reason',
            width: '20%'
        },{
            title:'审批时间',
            dataIndex:'updateTime',
            width: '20%'
        }
    ];
    const handleClick = (record) => {
        if (record.batchid) {
            dispatch({
                type:'taskTeamManage/turnToHistoryPage',
                payload:{'arg_opt':record.batchid,'arg_proj_id':record.proj_id}
            });
        }
    }
    return (
        <div className={styles['pageContainer']}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/taskList'>任务列表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>任务详情</Breadcrumb.Item>
            </Breadcrumb>
            <Row className={styles.headerInfo}>
                <Col span={24} className={styles['middle-box']}>
                    <div className={styles['middle-inner']}>
                        <h2 style={{textAlign:'center',paddingTop:10,paddingBottom:10}}>{projData.projName}</h2>
                        <ul style={{textAlign:'center'}}>
                            <li><b>项目经理</b>：{projData.marName}</li>
                            <li><b>创建时间</b>：{teamData.length ? teamData[0].createTime : null}</li>
                            {
                                teamData[0] && (teamData[0].checkState === '3' || teamData[0].checkState === '6')
                                ?
                                <li><b>退回原因</b>：{historyList[historyList.length - 2].reason}</li>
                                :
                                null
                            }
                        </ul>
                    </div>
                </Col>
            </Row>
            <Tabs
                tabBarExtraContent={
                    flag === '0' && teamBatchid
                    ?
                    (
                        teamData[0] && (teamData[0].checkState === '3' || teamData[0].checkState === '6')
                        ?
                        <div>
                            <Button type="primary" style={{marginRight:10}} onClick={editClick}>编辑</Button>
                        </div>
                        :
                        <div>
                            <Button type="primary" style={{marginRight:10}} onClick={nextClick}>通过</Button>
                            <Button type="primary" style={{marginRight:10}} onClick={backClick}>退回</Button>
                        </div>
                    )
                    :
                    <div></div>
                }
                activeKey={activeKey}
                onChange={tabChange}
            >
                <TabPane tab="变更人员信息" key="0">
                    <Table
                        className = {styles.orderTable}
                        loading = {loading}
                        rowKey = {record => record.staffId}
                        columns = {columns}
                        dataSource = {teamData}
                        pagination = {false}
                    />
                </TabPane>
                {
                    teamBatchid
                    ?
                    <TabPane tab="审批环节" key="1">
                        <Table
                            className = {styles.orderTable}
                            loading = {loading}
                            rowKey = {record => record.index}
                            columns = {historyColumns}
                            dataSource = {historyList}
                            pagination = {false}
                            onRowClick={handleClick}
                        />
                    </TabPane>
                    :
                    null
                }
            </Tabs>
            <ResonModal okClick={okClickModal} cancelClick={cancelClickModal} isShow={visible}></ResonModal>
        </div>
    );
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.taskTeamManage,
        ...state.taskTeamManage,
    };
}
export default connect(mapStateToProps)(TaskTeamManage);
