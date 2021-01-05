/**
 * 作者：翟金亭
 * 创建日期：2019-05-21
 * 邮箱：zhaijt3@chinaunicom.cn
 * 功能：实现项目组加班信息查看功能
 * 入参：项目组申请的ID
 */
import React, { Component } from 'react';
import {Button, Card, Form, Input, Modal, Row, Select, Table} from "antd";
import {connect} from "dva";
import {routerRedux} from "dva/router";
import exportExcel from "./exportExcel";
import DowmFile from "./downFile";

class ShowTeamDetails extends Component{
  constructor(props){
    super(props);
  };

  team_details_columns = [
    { title: '序号', dataIndex: 'indexID'},
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '姓名', dataIndex: 'user_name' },
    { title: '加班日期', dataIndex: 'overtime_time' },
    { title: '加班原因', dataIndex: 'overtime_reson' },
    { title: '加班地点', dataIndex: 'overtime_place' },
    { title: '天数', dataIndex: 'remark' },
  ];

  //返回加班管理界面
  gotoBack = () => {
    if(this.props.return_type==='2'){
      const {dispatch}=this.props;
      dispatch(routerRedux.push({
        pathname:'/humanApp/overtime/overtime_search'
      }));
    }else{
      const {dispatch}=this.props;
      dispatch(routerRedux.push({
        pathname:'/humanApp/overtime/overtime_index'
      }));
    }

  }

  //页面加载时将各个项目组的数据存储起来,调用一键导出方法
  //导出当前职能部门下的数据
  expExl=()=>{
    //调用组件导出
    const deptName = this.props.deptName;
    const personDataListExport = this.props.personDataList;
    if(personDataListExport.length !== 0){
      exportExcel(personDataListExport,deptName);
    }else{
      message.info("无"+deptName+"加班数据");
    }
  };

  print = () => {
    window.document.body.innerHTML = window.document.getElementById('billDetails').innerHTML;
    window.print();
    window.location.reload();
  }

  render() {
    //该条记录的部门
    const deptName = this.props.deptName;
    //当前审批环节
    const step = this.props.location.query.step;
    //当前处理人
    //传递该条记录是什么类型的加班流程申请
    const approvType = this.props.location.query.approvType;
    //该条记录的节假日
    const holiday_name = this.props.holiday_name;
    //该条记录的创建时间
    const create_time = this.props.create_time;
    //审批过程中首页查看项目组加班申请人员详细信息
    let team_data = this.props.personDataList;
    for (let i=0; i<team_data.length;i++){
      team_data[i].key=i;
      team_data[i].indexID=i+1;
    }
    //项目组信息
    let initProject = this.props.proj_id;
    const userProjectDataList = this.props.userProjectDataList;
    for(let i=0; i<userProjectDataList.length; i++){
      if(userProjectDataList[i].proj_id ===  initProject){
        var initProjectName = userProjectDataList[i].proj_name;
      }
    }
    //显示项目组名称控制
    const apply_type = this.props.apply_type;
    //项目组列表对应的审批信息,团队负责人审批意见
    let approvalHiList = this.props.approvalHiList;
    const hidataList = approvalHiList.map(item =>
      <Row span={1} style={{textAlign: 'left'}}>
        <h4><p>{item.task_name}：<span>{item.task_detail}</span></p></h4>
      </Row>
    );
    //附件信息
    //获取下载文件列表
    let filelist = this.props.fileDataList;
    for (let i=0;i<filelist.length;i++){
      filelist[i].uid = i+1;
      filelist[i].status = "done";
    }

    return(
      <div>
        <p>当前环节：<span>{step}</span></p>
        <div id={'billDetails'} className="color:#00FF00">
          <Row span={2} style={{textAlign: 'center'}}><h2>{approvType}审批表</h2></Row>
          <Card title="基本信息"  width={"70%"} >
            <Row span={2} style={{textAlign: 'left'}}>
              <h4><p>部 门：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{deptName}</span></p></h4>
            </Row>
            <Row span={2} style={{textAlign: 'left'}} style={{display: (apply_type==='5' || apply_type === '6')? "none" : "" }}>
              <h4><p>项目\运营小组：<span>{initProjectName}</span></p></h4>
            </Row>
            <Row span={2} style={{textAlign: 'left'}}>
              <h4><p>节 假 日：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{holiday_name}</span></p></h4>
            </Row>
            <Row span={2} style={{textAlign: 'left'}}>
              <h4><p>申请日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{create_time.split(' ')[0]}</span></p></h4>
            </Row>
          </Card>
          <Card title= {<div style={{textAlign: "left"}}>{approvType}详细信息</div>} size="default"  width={"70%"}  extra={<a icon="download" onClick={this.expExl} disabled="" style={{display:step==="人力资源专员归档"?"":"none"}}>一键导出</a>}>
              <Table
                columns={this.team_details_columns}
                dataSource={team_data}
                pagination={false}
                size='small'
              />
          </Card>
          <Card size="small" title="审批意见" width={"70%"} bordered={true}>
            {/*循环展示之前所有环节的审批意见*/}
            {hidataList}
          </Card>
        </div>
        {
          approvType === "项目组加班统计" || approvType === "部门加班统计"
            ?
            <Card title="附件下载"  width={"70%"}>
              <DowmFile filelist = {filelist}/>
            </Card>
            :
            null
        }
        <br/>
        <div style={{textAlign: "center"}}>
          <Button onClick={this.gotoBack} >返回</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.print.bind(this)} style={{marginRight: '5px'}} type="primary">打印</Button>
          <br/><br/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.show_team_details_model,
    ...state.show_team_details_model,
  };
}
ShowTeamDetails = Form.create()(ShowTeamDetails);
export default connect(mapStateToProps)(ShowTeamDetails);
