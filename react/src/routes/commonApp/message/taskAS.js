/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：代办详情
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Tabs, Icon, Pagination, Breadcrumb, Button, Modal, Table, Spin } from 'antd';
import AsDetail from '../../project/standard/projAssessmentStandardDetail/projAssessmentStandardDetail';
import styles from '../../project/standard/projAssessmentStandard.less';
import ResonModal from './taskDetailModal';
import moment from 'moment';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：代办详情主页
 */
function TaskAS({dispatch, loading, year,
  season, batch, current, task, exe, next, wf, detail, userId,
  userName, role, flag, record, historys, activeKey, modalVisible,list}) {
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：提交Click事件
     * @param e 点击事件默认参数
     */
    const setflag = (data = []) => {
        let flag = false;
        flag = data.some((v,i) => { return v.kpi_assessment == "0"})
        return flag
    }
    const handleApprovalClick = e => {
        dispatch({
            type:'projAssessmentStandardDetail/kpiPass',
            payload:{
                arg_dm_id:userId,
                arg_dm_name:userName,
                arg_proj_id:detail.proj_id,
                arg_proj_code:detail.proj_code,
                arg_proj_name:detail.proj_name,
                arg_proj_deptName:detail.dept_name,
                arg_pm_id:detail.mgr_id,
                arg_pm_name:detail.mgr_name,
                arg_year:year,
                arg_season:season,
                arg_task_uid:task,
                arg_exe_id:exe,
                arg_task_next_id:next,
                arg_task_batch_id:batch,
                arg_task_wf_batchid:wf,
            }
        });
    };
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：退回Click事件
     * @param e 点击事件默认参数
     */
    const handleReturnClick = e => {
        dispatch({
            type:'projAssessmentStandardDetail/modalShow'
        });

    };
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：修改Click事件
     * @param e 点击事件默认参数
     */
    const handleUpdateClick = e => {
        dispatch({
            type:'projAssessmentStandardDetail/projAssessmentStandardDetailPage',
            payload:{
                flag:flag,
                year:year,
                season:season,
                id:detail.proj_id,
                current:current,
                task:task,
                wf:wf,
                next:next,
                exe:exe,
                batch:batch,
            }
        });
    };
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：提示
     */
    const showConfirm = () => {
        confirm({
            title: '确定通过审核吗？',
            onOk() {
                handleApprovalClick();
            }
        });
    }
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：ok按钮Click事件
     * @param value 原因内容
     */
    const handleModalOkClick = value => {
        dispatch({
            type:'projAssessmentStandardDetail/kpiNotPass',
            payload:{
                arg_check_id:userId,
                arg_check_name:userName,
                arg_proj_id:detail.proj_id,
                arg_proj_name:detail.proj_name,
                arg_pm_id:detail.mgr_id,
                arg_pm_name:detail.mgr_name,
                arg_year:year,
                arg_season:season,
                arg_comment:value.reson,
                arg_task_uid:task,
                arg_exe_id:exe,
                arg_task_next_id:next,
                arg_task_batch_id:batch,
                arg_task_wf_batchid:wf,

            }
        });
        dispatch({
            type:'projAssessmentStandardDetail/modalHide'
        });
    };
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：关闭Click事件
     * @param e 默认参数
     */
    const handleModalCancelClick = e => {
        dispatch({
            type:'projAssessmentStandardDetail/modalHide'
        });
    };
    const handleTabClick = e => {
        dispatch({
            type:'projAssessmentStandardDetail/tabChange',
            payload:{'activeKey' : e}
        });
    };
    let breadcrumb = '';
    switch (flag) {
        case '0':
            breadcrumb = '待办任务详情'
            break;
        case '1':
            breadcrumb = '已办任务详情'
            break;
        case '3':
            breadcrumb = '办结任务详情'
            break;
    }

    const columns = [
        {
          title: '序号',
          dataIndex:'',
          render:(text,record,index)=>{return index + 1;}
        },{
          title:'状态',
          dataIndex:'check_flag',
          render:(text,record,index)=>{
              if (record.check_flag === '1' && !record.current_opt_flag) {
                  return '办理中……'
              } else {
                  if (record.check_flag === '-1') {
                      return '办结'
                  } else {
                      return '办毕'
                  }
              }
          }
        },{
          title: '角色',
          dataIndex:'current_link_roleid'
        },{
          title: '审批人',
          dataIndex: 'current_link_username'
        },{
          title: '审批类型',
          dataIndex: 'current_opt_flag',
          render:(text,record,index)=>{
              let str = ''
              switch (record.current_opt_flag) {
                  case '1':
                      str = '提交'
                      break;
                  case '2':
                      str = '同意'
                      break;
                  case '3':
                      str = '退回'
                      break;
              }
              return str
          }
        },{
          title: '审批意见',
          dataIndex: 'current_opt_comment',
          render:(text,record,index)=>{
              let str = ''
              switch (record.current_opt_flag) {
                  case '1':
                      str = '提交'
                      break;
                  case '2':
                      str = '同意'
                      break;
                  case '3':
                      str = record.current_opt_comment
                      break;
              }
              return str
          }
        },{
          title: '审批时间',
          dataIndex: 'current_opt_handle_time',
          render:(text)=>{
              return text ? moment(text).format("YYYY-MM-DD hh:mm:ss") : null;
          }
        }
     ];

    return (
        <div className={styles['pageContainer']}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/taskList'>任务列表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>{breadcrumb}</Breadcrumb.Item>
            </Breadcrumb>
            <Row className={styles.headerInfo}>
                <Col span={24} className={styles['middle-box']}>
                    <div className={styles['middle-inner']}>
                        {
                            record
                            ?
                            record.next_link_name === '部门经理<审批+评价>' ||record.next_link_name === 'TMO<审批+评价>' ||record.next_link_name ==='项目经理<反馈>'?
                            <h2 style={{textAlign:'center',paddingTop:10,paddingBottom:10}}>项目考核指标评价</h2>
                            :
                            <h2 style={{textAlign:'center',paddingTop:10,paddingBottom:10}}>项目考核指标审核</h2>
                            :
                            <h2 style={{textAlign:'center',paddingTop:10,paddingBottom:10}}>项目考核指标</h2>
                        }
                        {/* <h2 style={{textAlign:'center',paddingTop:10,paddingBottom:10}}>项目考核指标审核</h2> */}
                        {
                            record
                            ?
                            <ul>
                                <li>提交人：{record.current_link_username ? record.current_link_username : ''}</li>
                                <li>团队名称：{detail.proj_name}</li>
                                <li>创建时间：{record.current_opt_handle_time ? moment(record.current_opt_handle_time).format("YYYY-MM-DD hh:mm:ss") : ''}</li>
                                {
                                    record.current_opt_flag === '3' ? <li>上一环节：{record.current_link_roleid}退回</li> : <li>上一环节：{record.current_link_roleid+record.current_opt_comment}</li>
                                }
                                {
                                    record.current_opt_flag === '3' ? <li>退回原因：{record.current_opt_comment}</li> : <li></li>
                                }

                            </ul>
                            :
                            null
                        }
                    </div>
                </Col>
            </Row>
            {
                record
                ?
                setflag(list) && flag === '0' && role != 1 && (record.current_link_roleid+record.current_opt_comment == "项目经理提交")
                ?
                <Row style = {{textAlign:"center"}}>
                    <span style = {{fontSize:"13"}}>该项目申请【自主研发（运维）占比】指标由事业部经理全权打分，不受平台考核结果影响，请审批</span>
                </Row>
                :
                ""
                :
                null
            }
            <Tabs tabBarExtraContent={
                flag === '0'
                ?
                    (role === 1
                    ?
                        <Spin spinning={loading}>
                            <Button type="primary" onClick={handleUpdateClick}>修改</Button>
                        </Spin>
                    :
                        <Spin spinning={loading}>
                            <div className={styles['btn']}>
                                <Button type="primary" onClick={showConfirm}>通过</Button>
                                <Button type="primary" onClick={handleReturnClick}>退回</Button>
                            </div>
                        </Spin>)
                :
                    <div></div>} 
                activeKey={activeKey} onTabClick={handleTabClick}
                >
                    <TabPane forceRender={true} tab="指标信息" key="0">
                        <AsDetail state={flag}/>
                    </TabPane>
                    <TabPane forceRender={true} tab="审核历史" key="1">
                        <Table columns={columns}
                            rowKey='check_auto_id'
                            bordered={true}
                            dataSource={historys}
                            pagination={false}
                            className={styles.checkLogTable}
                        />
                    </TabPane>
            </Tabs>
            <ResonModal okClick={handleModalOkClick} cancelClick={handleModalCancelClick} isShow={modalVisible}></ResonModal>
        </div>
    );
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.projAssessmentStandardDetail,
        ...state.projAssessmentStandardDetail,
    };
}
export default connect(mapStateToProps)(TaskAS);
