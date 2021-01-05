/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：代办详情
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Tabs, Icon, Pagination, Breadcrumb, Button, Modal, Table, Tooltip } from 'antd';
import styles from './taskPartner.less';
import ResonModal from './taskPartnerModal';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：代办详情主页
 */
function taskPartner({dispatch, loading, projDetail, taskDetail, query, service_standarts, historyDetail, role, visible}) {
    const columns = [{
        title: '序号',
        dataIndex: 'id',
        render: (text, record, index) => {
            return index + 1;
        },
        width: '5%'
      },{
        title: '合作方',
        dataIndex: 'name',
      },{
        title:'服务质量评价',
        children:service_standarts
      },{
        title: '实际发生工作量',
        children:[{
            title: '人/日',
            dataIndex: 'work_cnt',
            width: '10%'
        },{
            title: '人/月',
            dataIndex: 'month_work_cnt',
            width: '10%'
        }]
      }];
    const historyColumns = [
        {
          title: '序号',
          dataIndex: 'index',
          render: (text, record, index) => index+1,
          width: '10%'
        },{
          title: '状态',
          dataIndex: 'state_type',
          width: '10%'
        },{
          title: '环节名称',
          dataIndex: 'state_show',
          width: '15%'
        },{
          title: '审批人',
          dataIndex: 'create_by_name',
          width: '10%'
        },{
          title:'审批类型',
          dataIndex:'state',
          width: '15%'
        },{
          title:'审批意见',
          dataIndex:'reason',
          width: '20%'
        },{
          title:'审批时间',
          dataIndex:'create_time',
          width: '20%'
        }
    ];
    const tabChange = (key) => {
        dispatch({
            type:'taskPartner/tabChange',
            payload:{
                activeKey:key,
                arg_batchid:query.arg_batchid,
                arg_proj_id:query.arg_proj_id,
                arg_state:query.arg_state,
                arg_year_month:query.arg_year_month,
                flag:query.flag
            }
        });
    }
    const nextClick = (key) => {
        confirm({
            title: '确定通过审核吗？',
            onOk() {
                const partners = taskDetail.map((item) => {
                    return {'arg_partner_id':item.partner_id}
                });
                let userRole = null;
                switch (role) {
                    case '1':
                        userRole = 1;
                        break;
                    case '3':
                        userRole = 3;
                        break;
                    case '4':
                        userRole = 2;
                        break;
                }
                dispatch({
                    type:'taskPartner/taskPass',
                    payload:{
                        arg_userid:query.arg_userid,
                        arg_partner_id:JSON.stringify(partners),
                        arg_year_month:query.arg_year_month,
                        arg_proj_id:query.arg_proj_id,
                        arg_batchid:query.arg_batchid,
                        arg_flag:userRole,
                    }
                });
            }
        });
    }
    const backClick = (key) => {
        dispatch({
            type:'taskPartner/showModal'
        })
    }
    const editClick = (key) => {
        confirm({
            title: '确定要提交评价单吗？',
            onOk() {
                let flag = true;
                for (let i = 0; i < taskDetail.length; i++) {
                    if (!taskDetail[i].stability_score || !taskDetail[i].attend_score || !taskDetail[i].delivery_score || !taskDetail[i].quality_score || !taskDetail[i].manage_score) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    dispatch({
                        type : 'taskPartner/serviceAddBatServlet'
                    });
                } else {
                    message.error('评价结果不能为空');
                }
            }
        });
    }

    const okClickModal = (value) => {
        const partners = value.map((item) => {
            return {'arg_partner_id':item.id,'arg_reason':item.value}
        });
        let userRole = null;
        switch (role) {
            case '1':
                userRole = 1;
                break;
            case '3':
                userRole = 3;
                break;
            case '4':
                userRole = 2;
                break;
        }
        dispatch({
            type:'taskPartner/taskBack',
            payload:{
                arg_userid:query.arg_userid,
                arg_year_month:query.arg_year_month,
                arg_proj_id:query.arg_proj_id,
                arg_batchid:query.arg_batchid,
                arg_flag:userRole,
                arg_info:JSON.stringify(partners)
            }
        });
    };
    const cancelClickModal = () => {
        dispatch({
            type:'taskPartner/hideModal'
        });
    };
    const reason = taskDetail.filter(i=>i.reason).map((item, index) => {
        return(
            <li key={item.id}>{item.name+": "+item.reason}</li>
        )
    });

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
                        <h2 style={{textAlign:'center',paddingTop:10,paddingBottom:10}}>{query.arg_year_month} 合作伙伴服务确认单</h2>
                        <ul style={{textAlign:'center'}}>
                            <li><b>项目经理</b>：{projDetail.mgr_name}</li>
                            <li><b>项目名称</b>：{projDetail.proj_name}</li>
                            <li><b>操作时间</b>：{taskDetail[0] ? taskDetail[0].create_time : null}</li>
                        </ul>
                        <ul style={{textAlign:'center'}}>
                            <li><b>当前环节</b>：{taskDetail[0] ? taskDetail[0].next_check_state : null}</li>
                            <li><b>上一环节</b>：{taskDetail[0] ? taskDetail[0].state_show : null}</li>
                            {
                                reason.length
                                ?
                                <li><Tooltip title={<ul>{reason}</ul>}><a><b>退回原因</b></a></Tooltip></li>
                                :
                                null
                            }
                        </ul>
                    </div>
                </Col>
            </Row>
            <Tabs
                tabBarExtraContent={
                    query.flag === '0'
                    ?
                    (
                        role === '2'
                        ?
                        <div>
                            <Button type="primary" style={{marginRight:10}} onClick={editClick}>提交</Button>
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
                activeKey={query.activeKey}
                onChange={tabChange}
            >
                <TabPane tab="评分详情" key="0">
                    <Table
                        className = {styles.orderTable}
                        loading = {loading}
                        rowKey = {record => record.id}
                        columns = {columns}
                        dataSource = {taskDetail}
                        pagination = {false}
                    />
                </TabPane>
                <TabPane tab="审批环节" key="1">
                    <Table
                        className = {styles.orderTable}
                        loading = {loading}
                        rowKey = {record => record.index}
                        columns = {historyColumns}
                        dataSource = {historyDetail}
                        pagination = {false}
                    />
                </TabPane>
            </Tabs>
            <ResonModal data={taskDetail} okClick={okClickModal} cancelClick={cancelClickModal} isShow={visible}></ResonModal>
        </div>
    );
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.taskPartner,
        ...state.taskPartner,
    };
}
export default connect(mapStateToProps)(taskPartner);
