/**
 * 作者：翟金亭
 * 创建日期：2019-04-15
 *  邮箱：zhaijt3@chinaunicom.cn
 * 功能：实现创建项目组加班审批流程功能
 */
import React, {Component} from "react";
import {Button, Row, Form, Input, Card, Table, Select, message, Modal} from "antd";
const FormItem = Form.Item;
import {connect} from "dva";
import {routerRedux} from "dva/router";
import exportExcel from "./exportExcel";

const { TextArea } = Input;

class ShowApprovalDetails extends Component{
  constructor (props) {
    super(props);
    this.state = {
      post_name:"",
      dateFlag:false,
      saveViewFlag:false,
      approvalFlag:false,
      teamsum:'',
      personvisible:false,
    };
  }

  //查看按钮跳转到加班管理界面----弹框显示
  gotoTeamDetails = (record) =>{
    const approvalType = this.props.location.query.approvalType;
    let apply_type = '';
    //
    let apply_type_approval = '';
    if (approvalType === '2') {
      apply_type = 1;
      apply_type_approval = 1;
    }else if(approvalType === '4'){
      apply_type = 2;
      apply_type_approval = 3;
    }
    const {dispatch} = this.props;
    let query = {};

      query["arg_apply_id"] = record.apply_id;
      query["arg_apply_type"] = apply_type;
      query["arg_apply_approval_type"] = apply_type_approval;
      query["projectName"] = record.proj_name;
      query["holiday_name"] = this.props.holiday_name;
      query["deptName"] = this.props.location.query.deptName;
      query["create_time"] = this.props.create_time.split(' ')[0];
      query["approvType"] = this.props.location.query.approvType;;
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index/showTeamDetailsAndApproval',
        query: query
      }));
  }

  dept_columns = [
    { title: '编号', dataIndex: 'key'},
    { title: '项目组', dataIndex: 'proj_name' },
    { title: '操作', dataIndex: '',  key: 'x', render: (text,record,index) => (

        <span>
        {
          record.file_relativepath
            ?
            <span>
                    <a onClick={()=>this.gotoTeamDetails(record)}>查看</a> &nbsp;&nbsp;
              <a href={record.file_relativepath}>附件</a>
              </span>
            :
            <a onClick={()=>this.gotoTeamDetails(record)}>查看</a>
        }
        </span>

      )},
  ];
  /*加班人员详情*/
  team_details_columns = [
    { title: '序号', dataIndex: 'indexID'},
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '姓名', dataIndex: 'user_name' },
    { title: '加班日期', dataIndex: 'overtime_time' },
    { title: '加班原因', dataIndex: 'overtime_reson' },
    { title: '加班地点', dataIndex: 'overtime_place' },
    { title: '天数', dataIndex: 'remark' },
  ];

  //结束关闭，返回加班管理界面
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
  handleOk = () => {
    this.setState({
      personvisible: false,
    });
  }
  handleCancel = () => {
    this.setState({
      personvisible: false,
    });
  }

  //页面加载时将各个项目组的数据存储起来,调用一键导出方法
  //导出当前部门下所有的项目组内加班申请详情
  expExl=()=>{
    //调用组件导出
    const deptName = this.props.location.query.deptName;
    const personDataListExport = this.props.personDataListExport;
    if(personDataListExport.length !== 0){
      exportExcel(personDataListExport,deptName);
    }else{
      message.info("无"+deptName+"加班申请数据");
    }
  };
  //打印
  print = () => {
    window.document.body.innerHTML = window.document.getElementById('deptPrint').innerHTML;
    window.print();
    window.location.reload();
  }

  render() {
      //该条记录的部门
      const deptName = this.props.location.query.deptName;
      //当前审批环节
      const step = this.props.location.query.step;
      //当前处理人
      //传递该条记录是什么类型的加班流程申请
      const approvType = this.props.location.query.approvType;
      //该条记录的节假日
      const holiday_name = this.props.holiday_name;
      //该条记录的创建时间
      const create_time = this.props.create_time;
      //审批过程中首页查看项目组加班申请人员详细信息，只查看，不做操作
      //显示项目组列表
      let team_data = this.props.teamDataList;
      for (let i=0; i<team_data.length;i++){
        team_data[i].key=i+1;
        team_data[i].indexID=i+1;
      }
      //加班人员详情
      let personDataList = this.props.personDataList;
      for (let i=0;i<personDataList.length;i++) {
        personDataList[i].indexID = i+1;
      }
      //评论信息
      let approvalTeamList = this.props.approvalTeamList;
      //团队负责人意见
      this.state.teamsum = '';
    for (let j=0; j<approvalTeamList.length;j++){
      this.state.teamsum += approvalTeamList[j].task_detail+"\n";
    }
    this.state.teamsum +="\n";

    //项目组列表对应的审批信息
      let approvalHiList = this.props.approvalHiList;
      const hidataList = approvalHiList.map(item =>
        <Row span={1} style={{textAlign: 'left'}}>
          <h4><p>{item.task_name}：<span>{item.task_detail}</span></p></h4>
        </Row>
/*        <FormItem label={item.task_name}>
          <Input placeholder= {item.task_detail} disabled={true}></Input>
        </FormItem>*/
      );
    //获取下载文件列表
    let filelist = this.props.fileDataList;
    for (let i=0;i<filelist.length;i++){
      filelist[i].uid = i+1;
      filelist[i].status = "done";
    }

    //取得所有项目组加班人员详情
    const personDataListExport = this.props.personDataListExport;
    for(let i=0;i<personDataListExport.length; i++){
      personDataListExport[i].indexID = i+1;
    }
          return (
            <div>
              <br/>
              <p>当前环节：<span>{step}</span></p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <div id={'deptPrint'}>
              <Row span={2} style={{textAlign: 'center'}}><h2>{approvType}审批表</h2></Row>
                <br/>
                <Card title="基本信息"  width={"70%"} >
                  <Row span={2} style={{textAlign: 'left'}}>
                    <h4><p>部 门：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{deptName}</span></p></h4>
                  </Row>
                  <Row span={2} style={{textAlign: 'left'}}>
                    <h4><p>节 假 日：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{holiday_name}</span></p></h4>
                  </Row>
                  <Row span={2} style={{textAlign: 'left'}}>
                    <h4><p>申请日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{create_time.split(' ')[0]}</span></p></h4>
                  </Row>
                </Card>
              <Card   title={<div style={{textAlign: "left"}}>{approvType}详情</div>} extra={<a icon="download" onClick={this.expExl} disabled="" style={{display:step==="人力资源专员归档"?"":"none"}}>一键导出</a>} >
                <Table
                  columns={this.dept_columns}
                  dataSource={team_data}
                  pagination={false}
                />
              </Card>
              <Modal
                title="加班人员列表"
                visible={this.state.personvisible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width={"75%"}
              >
                <div>
                  <Card title="加班申请汇总">
                    <Table
                      columns={this.team_details_columns}
                      dataSource={personDataList}
                      pagination={false}
                      size='small'
                    />
                  </Card>
                </div>
              </Modal>
              <Card title={<div style={{textAlign: "left"}}>审批意见</div>} width={"70%"}  bordered={true} style={{display: ''}}>
                {/*循环展示之前所有环节的审批意见*/}
                <FormItem label="团队负责人审核">
                  <TextArea
                    style={{ minHeight: 32,color:'#000' }}
                    value={this.state.teamsum}
                    autosize={{ maxRows: 10 }}
                    disabled={true}
                  />
                </FormItem>
                {hidataList}
              </Card>
              </div>

              <br/>
              <div style={{textAlign: "center"}}>
                <Button onClick={this.gotoBack} >返回</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={this.print.bind(this)} style={{marginRight: '5px'}} type="primary">打印</Button>
                <br/><br/>
              </div>
            </div>
          )
        }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.show_approval_details_model,
    ...state.show_approval_details_model
  };
}

ShowApprovalDetails = Form.create()(ShowApprovalDetails);
export default connect(mapStateToProps)(ShowApprovalDetails);
