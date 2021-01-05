/**
 * 作者：王超
 * 日期：2018-03-19
 * 邮箱：wangc235@chinaunicom.cn
 * 功能：项目考核待办功能
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import BaseInfo from './detail';
import { Row, Col, Tabs, Breadcrumb, Spin, Button } from 'antd';
import LogInfo from './taskProKpiHistory';
import styles from './task.less';
import ResonModal from './taskDetailModal';

const TabPane = Tabs.TabPane;


class TaskProKPIDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    handleReturnClick = () => {
        const {dispatch} = this.props;
        dispatch({
            type:'taskDeatilTMO/taskShowModal'
        });

    };
    handleModalCancelClick = () => {
        const {dispatch} = this.props;
        dispatch({
            type:'taskDeatilTMO/taskHideModal'
        });

    };

    handleModalOkClick = (value) => {
        const {dispatch} = this.props;

        dispatch({
            type:'taskDeatilTMO/taskReturnDM',
            params:{
                arg_role:'TMO',
                arg_check_id:this.props.taskObj.task_staff_id_to,
                arg_check_name:this.props.taskObj.task_staff_name_to,
                arg_proj_id:JSON.parse(this.props.taskObj.task_param).arg_proj_id,
                arg_proj_name:JSON.parse(this.props.taskObj.task_content).content,
                arg_pm_id:JSON.parse(this.props.taskObj.task_content).create_byid,
                arg_pm_name:JSON.parse(this.props.taskObj.task_content).create_byname,
                arg_year:JSON.parse(this.props.taskObj.task_param).arg_year,
                arg_season:JSON.parse(this.props.taskObj.task_param).arg_season,
                arg_comment:value.reson,
                arg_taskParam:this.props.taskObj.task_param
            }
        });

    };

    // 初始化数据
    componentWillMount(){
        const {dispatch} = this.props;
        dispatch({
            type:'taskDeatilTMO/cleanManagerDetail',
            params:{}
        });
        dispatch({
            type:'taskDeatilTMO/getManagerTitle',
            params:{
                arg_mgr_id:this.props.location.query.pm_id||"",
                arg_season:this.props.location.query.season,
                arg_year:this.props.location.query.year,
                arg_proj_id:this.props.location.query.pro_id
            }
        });
    }

    //数据处理
    judgment = () => {
        let kpiDetail = this.props.managerDetailObj.kpi_detail
        for(let i in kpiDetail) {
            if(kpiDetail[i].length>0) {
              for(let j=0; j<kpiDetail[i].length; j++){
                  if(kpiDetail[i][j].kpi_name == "自主研发（运维）占比"){
                      let ownReach = kpiDetail[i][j]
                      if(ownReach.kpi_assessment==="0"){
                          return true
                      }else{
                          return false
                      }
                  }
              }
            }
        }
    }

    render() {
        let titleObj = {};
        let proName = "";
        let pmName = "";

        if(this.props.managerTitleObj.length>0) {
            proName = this.props.managerTitleObj[0].proj_name;
            pmName = this.props.managerTitleObj[0].mgr_name;
        }

        if(this.props.historys.length>0) {
            titleObj = this.props.historys[this.props.historys.length-2]
        }
        return (
            <div className={styles['pageContainer']}>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to='/taskList'>任务列表</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{'待办任务详情'}</Breadcrumb.Item>
                </Breadcrumb>
                <Spin tip="处理中..." spinning={this.props.loading}>
                    <Row className={styles.headerInfo}>
                        <Col span={24} className={styles['middle-box']}>
                            <div className={styles['middle-inner']}>
                                <h2 style={{textAlign:'center',paddingTop:10,paddingBottom:10}}>{proName}</h2>
                                <ul style={{textAlign: 'center'}}>
                                    <li><b>项目经理</b>：{pmName}</li>
                                    <li><b>上一环节</b>：项目经理&lt;反馈&gt;</li>
                                    <li><b>当前环节</b>：TMO&lt;审批+评价 &gt;</li>
                                    {
                                        /*headInfo.pre_opt_flag == 3
                                        ?
                                        <li><b>退回原因</b>：{headInfo.pre_opt_comment}</li>
                                        :
                                        <li></li>*/
                                    }

                                </ul>
                            </div>
                        </Col>
                    </Row>

                    {
                        this.judgment()&& (titleObj.next_link_name== "TMO<审批+评价>") ?
                        <Row style = {{textAlign:"center"}}>
                            <span style =  {{fontSize:"13"}}>该项目已申请【自主研发（运维）占比】指标由事业部经理全权打分，不受平台考核结果影响，特此提醒。</span>
                        </Row>
                        :
                        null
                    }

                     <Tabs tabBarExtraContent={
                        <div>

                            </div>} defaultActiveKey="1" style={{marginTop:'15px'}}>
                        <TabPane forceRender={true} tab={<span>基本信息</span>} key="1">
                            <BaseInfo data={this.props.location.query}></BaseInfo>
                        </TabPane>
                        <TabPane forceRender={true} tab="审批环节" key="5">
                            <LogInfo></LogInfo>
                        </TabPane>
                    </Tabs>
                    <ResonModal okClick={(value)=>{this.handleModalOkClick(value)}} cancelClick={()=>{this.handleModalCancelClick()}} isShow={this.props.modalVisible}></ResonModal>
                </Spin>
            </div>
        );
    }

}
function mapStateToProps (state) {
    const {loading,historys,modalVisible,taskObj,managerDetailObj,managerTitleObj} = state.taskDeatilTMO;
    return {
        loading,
        historys,
        modalVisible,
        taskObj,
        managerDetailObj,
        managerTitleObj
    };
}
export default connect(mapStateToProps)(TaskProKPIDetail);
