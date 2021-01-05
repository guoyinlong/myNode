/**
 * 作者：张枫
 * 创建日期：2019-09-06
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：我的待办-审批（部门经理审批页面）
 */
import React from 'react';
import { connect } from 'dva';
import {Table,Button,Pagination,Card,Col,Row,Modal,Input} from "antd";
import style from "./apply.less";
import { routerRedux } from "dva/router";
class Examine extends React.PureComponent {
  constructor(props) {super(props);}
  state = {
    isDetailVisible : false,
    details:"",//人员详情信息
    isReturnVisible:false,//退回原因模态框是否显示

  };
  // 审批延期工位
  columns = [
    {
      title:"序号",
      dataIndex:"key",
      render  :(index)=>{return(<div>{index+1}</div>)}
    },

    {
      title:"项目组名称",
      dataIndex:"ex_project_name",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"ex_project_charger_name",
      title:"项目经理/负责人",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"ex_project_charger_tel",
      title:"项目负责人联系电话",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"user_name",
      title:"员工姓名",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"prop",
      title:"性质",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"",
      title:"操作",
      render  :(record)=>{return(<div><Button type="primary" size="small" onClick = {()=>this.goToDetail(record)}>查看</Button></div>)}
    }
  ]
  //常驻工位表头
  oftenColumns = [
    {
      title:"序号",
      dataIndex:"key",
      render:(index)=>{return(<div>{index+1}</div>)}
    },
    {
      title:"姓名",
      dataIndex:"user_name",
      render:(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"user_id",
      title:"员工编号",
      render:(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"in_email",
      title:"邮箱",
      render:(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"tel",
      title:"电话",
      render:(text)=>{return(<div>{text}</div>)}
    },
    /**
    {
      dataIndex:"ex_project_dept_name",
      title:"部门",
      render:(text)=>{return(<div>{text}</div>)}
    },
     **/
    {
      dataIndex:"prop",
      title:"性质",
      render:(text)=>{return(<div>{text}</div>)}
    },
    /**
    {
      dataIndex:"",
      title:"操作",
      render  :(record)=>{return(<div><Button type="primary" size="small" onClick = {()=>this.goToDetail(record)}>查看</Button></div>)}
    }
     **/
  ]

  //返回我的待办列表
  goBack =()=>{
    this.props.dispatch(
      routerRedux.push({
        pathname:"/adminApp/compRes/todoList"
      })
    )
  }
  //设置模态框显示隐藏
  setVisible = ()=> {
    this.setState({isDetailVisible: false,isReturnVisible:false})
  }
  //查看人员详情
  goToDetail=(record)=>{
    this.setState({isDetailVisible:true,details:record})
  }
  // 审核
  gotoCheck = (data)=>{
    if(data==="0"){
      this.setState({isReturnVisible:false})
    }else if(data ==="1"){
      this.setState({isDetailVisible:false})
    }
    this.props.dispatch({
      type:"examine/reviewAssetsApply",
      data:data,
    })
  }
  // 点击退回
  setReturn =(data)=>{
    if(data==="0"){ this.setState({isReturnVisible:true})}
    else if(data==="1"){this.setState({isReturnVisible:false})}
  }
  // 保存退回原因
  saveReason =(e)=>{
    this.props.dispatch({type:"examine/saveReason",data:e.target.value})
  }
  render(){
    const { details } = this.state;
    const {staffList} = this.props;
    return (
      <div className = {style.page}>
        <div className = { style.title }>{"工位审批"}</div>
        <div style={{textAlign:"right"}}>
          <Button type="primary"  style={{marginRight:"3px",textAlign:"right"}} onClick = {()=>this.gotoCheck("1")}>同意</Button>
          <Button type="primary" style={{ marginRight:"3px",textAlign:"right"}} onClick = {()=>this.setReturn("0")}>退回</Button>
          <Button onClick = {this.goBack} type="primary">返回</Button>
        </div>
        <div style={{marginTop:"10px"}}>
          <div style={{float:"left",marginLeft:"2%"}}>
            <div><span  className = {style.apply}>申请人员：</span><span  className = {style.apply}>{this.props.staffData.user_name}</span></div>
            <div><span  className = {style.apply}>申请时间：</span><span  className = {style.apply}>{this.props.staffData.apply_time}</span></div>
            <div><span  className = {style.apply}>开始时间：</span>
              <span  className = {style.apply}>{this.props.staffData.begin_time}</span>
            </div>
            <div><span  className = {style.apply}>申请类型：</span>
              <span  className = {style.apply}>{this.props.staffData.type_id == "0"?"初次申请":"延期申请"}</span>
            </div>
            <div><span  className = {style.apply}>申请原因：</span><span  className = {style.apply}>{this.props.staffData.reason}</span></div>
            <div><span  className = {style.apply}>申请人员：</span></div>
          </div>
          <div style={{float:"right",marginRight:"25%"}}>
            <div><span  className = {style.apply}>申请部门：</span><span  className = {style.apply}>{this.props.staffData.dept_name}</span></div>
            <div><span  className = {style.apply}>申请数量：</span><span  className = {style.apply}>{this.props.staffData.num}</span></div>
            <div><span  className = {style.apply}>到期时间：</span><span  className = {style.apply}>{this.props.staffData.end_time}</span></div>
            <div><span  className = {style.apply}>申请时长：</span><span  className = {style.apply}>{this.props.staffData.days}</span></div>
          </div>
      </div>
        {
          this.props.prop ==="0" ?
            <Table
              columns = { this.columns }
              dataSource = {staffList}
              pagination = { false }
              className = {style.table }
              style = {{clear:"both",marginTop:"5px"}}
            />
            :
              <Table
                columns = { this.oftenColumns }
                dataSource  = {staffList}
                pagination = { false }
                className = {style.table }
                style = {{clear:"both"}}
              />
        }
            <Modal
              title = {"人员详情表"}
              onOk = {this.setVisible}
              onCancel = { this.setVisible }
              visible = { this.state.isDetailVisible }
              width = "800px"
            >
              <Row>
                <Col span = {5} style={{textAlign:"right"}}>单位名称：</Col>
                <Col span = {5}>{details.ex_vendor}</Col>
                <Col span = {4} style={{textAlign:"right"}}> 负责人：</Col>
                <Col span = {10}>{details.ex_charger_name}</Col>
              </Row>
              <Row>
                <Col span = {5} style={{textAlign:"right"}}>负责人电话：</Col>
                <Col span = {5}>{details.ex_charger_tel}</Col>
                <Col span = {4} style={{textAlign:"right"}}>项目组名称：</Col>
                <Col span = {10}>{details.ex_project_name}</Col>
              </Row>
              <Row>
                <Col span = {5} style={{textAlign:"right"}}>项目组编号：</Col>
                <Col span = {5}>{details.ex_project_id}</Col>
                <Col span = {4} style={{textAlign:"right"}}>项目组所属部门：</Col>
                <Col span = {10}>{details.ex_project_dept_name}</Col>
              </Row>
              <Row>
                <Col span = {5} style={{textAlign:"right"}}>项目经理/负责人：</Col>
                <Col span = {5}>{details.ex_charger_name}</Col>
                <Col span = {4} style={{textAlign:"right"}}>项目负责人电话：</Col>
                <Col span = {10}>{details.ex_project_charger_tel}</Col>
              </Row>
              <Row>
                <Col span = {5} style={{textAlign:"right"}}>性质：</Col>
                <Col span = {5}>{details.prop}</Col>
                <Col span = {4} style={{textAlign:"right"}}>姓名：</Col>
                <Col span = {10}>{details.user_name}</Col>
              </Row>
              <Row>
                <Col span = {5} style={{textAlign:"right"}}>身份证号：</Col>
                <Col span = {5}>{details.user_id}</Col>
                <Col span = {4} style={{textAlign:"right"}}>联系电话：</Col>
                <Col span = {10}>{details.tel}</Col>
              </Row>
            </Modal>
        <Modal
          title = {"请填写退回原因"}
          onOk = {()=>this.gotoCheck("0")}
          onCancel = { ()=>this.setReturn("1") }
          visible = { this.state.isReturnVisible }
        >
          <Input
            onChange = {this.saveReason}
          />
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading:state.loading.models.examine,
    ...state.examine
  }
}

export default connect(mapStateToProps)(Examine);
