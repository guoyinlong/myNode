/**
 * 文件说明：离职清算打印，已经集成到checkleavesettle中去
 * 作者：师庆培
 * 邮箱：shiqp3@chinaunicom.cn
 * 创建日期：2019-06-27
 */
import React, {Component} from "react";
import {Button, Row, Form, Input, Card, Table, Select, message} from "antd/lib/index";
import {connect} from "dva/index"
import {routerRedux} from "dva/router";
const FormItem = Form.Item;

class LeaveSettlePrint extends Component{
  constructor (props) {
    super(props);
    this.state = {
      isClickable:true,
      sign:'',
    };
  }

  gotoHome = () => {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/labor/staffLeave_index'
    }));
  }

  onChange(e){
    console.log("sign : " +  e.target.value);
    this.setState({
      sign : e.target.value
    })
  }
  renderContent = (value) => {
    const obj = {
      children: value,
      props: {},
    };
    return obj;
  };

  columns = [{
    title: '交接部门',
    dataIndex: 'dept_name',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      return obj;
    },
  }, {
    title: '交接手续',
    dataIndex: 'task_name',
    render: this.renderContent,
  }, {
    title: '办理人',
    dataIndex: 'user_name',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      return obj;
    },
  }, {
    title: '办理人签字',
    dataIndex: 'user_sign',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      /* return input组件还是 return文本 */
      if(row.isEdit == '1')
      {
        return <Input placeholder="办理人签字"  name="user_sign" onChange ={this.onChange.bind(this) } />;
      }
      return obj;
    },
  }];

  columns1 = [{
    title: '交接部门',
    dataIndex: 'dept_name',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.rowSpan = row.deptnameRowSpan;
      return obj;
    },
   }, {
    title: '交接手续',
    dataIndex: 'task_name',
    render: this.renderContent,
  }, {
    title: '办理人',
    dataIndex: 'user_name',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.rowSpan = row.usernameRowSpan;
      return obj;
    },
  }, {
    title: '办理人签字',
    dataIndex: 'user_sign',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.rowSpan = row.usersignRowSpan;
      return obj;
    },
  }, {
    title: '部门经理',
    dataIndex: 'dept_mgr',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.rowSpan = row.deptmgrRowSpan;
      return obj;
    },
  }, {
    title: '部门经理签字',
    dataIndex: 'dept_mgr_sign',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.rowSpan = row.deptmgrsignRowSpan;
      return obj;
    },
  }];

  /**打印的列名 */
  columsPrint=[
    {
      title:'交接部门',
      dataIndex:'dept_name',
      render: (value,row)=>{
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = row.deptSpanValue;
        return obj;
      }
    },{
      title:'交接手续',
      dataIndex:'task_name',
      render:this.renderContent
    },{
      title:'办理人',
      dataIndex:'user_name',
      render:(value,row)=>{
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = row.userspanValue;
        return obj;
      }
    },{
      title:'办理人签字',
      dataIndex:'user_sign',
      render:(value,row)=>{
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = row.userspanValue;
        return obj;
      }
    },{
      title:'部门经理签字',
      dataIndex:'dept_mgr_sign',
      render:(value,row)=>{
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = row.deptMgrSpanValue;
        return obj;
      }
    }
  ];


  //打印
  print = () => {
    window.document.body.innerHTML = window.document.getElementById('settlePrint').innerHTML;
    window.print();
    window.location.reload();
  }



  submitApproval = () => {
    /* 调用审批服务 */
    this.setState({
      isClickable : false
    });
    let theEnd = this.props.theEnd;
    let orig_proc_inst_id = this.props.proc_inst_id;
    let orig_proc_task_id = this.props.proc_task_id;
    let orig_apply_task_id = this.props.apply_task_id;
    let approval_advice = this.state.sign;
    const{dispatch} = this.props;
    return new Promise((resolve) => {
      dispatch({
        type:'quit_settle_approval_model/quitSettleApproval',
        approval_advice,
        orig_proc_inst_id,
        orig_proc_task_id,
        orig_apply_task_id,
        theEnd,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        this.setState({ isClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/overtime/overtime_index'}));
        },500);
      }
      if(resolve === 'false')
      {
        this.setState({ isClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/overtime/overtime_index'}));
    });

  }

  render() {
    const inputstyle = {color:'#000'};
    let dataSourcePrint = [
      {
        "dept_name":'共享资源中心',
        "task_name":'注销VPN账号、4A账号',
        "user_name":'周颖',
        "user_sign":'周颖',
        "dept_mgr_sign":'徐茂红',
        "deptSpanValue":'0',
	      "userspanValue":'0',
	      "deptMgrSpanValue":'0' 
      },
      {
        "dept_name":'工作部门',
        "task_name":'办公用品及设备',
        "user_name":'部门资产管理员',
        "user_sign":'周颖',
        "dept_mgr_sign":'徐茂红',
        "deptSpanValue":'2',
	      "userspanValue":'0',
	      "deptMgrSpanValue":'2'
      },
      {
        "dept_name":'工作部门',
        "task_name":'取消业务系统登录权限及其他生产系统账号',
        "user_name":'项目经理或部门经理',
        "user_sign":'周颖',
        "dept_mgr_sign":'徐茂红',
        "deptSpanValue":'0',
	      "userspanValue":'0',
	      "deptMgrSpanValue":'0'
      },
      {
        "dept_name":'党群部',
        "task_name":'党组织关系',
        "user_name":'刘铭',
        "user_sign":'刘铭',
        "dept_mgr_sign":'徐茂红',
        "deptSpanValue":'2',
	      "userspanValue":'0',
	      "deptMgrSpanValue":'2'
      },
      {
        "dept_name":'党群部',
        "task_name":'工会关系',
        "user_name":'高晓娟',
        "user_sign":'高小娟',
        "dept_mgr_sign":'徐茂红',
        "deptSpanValue":'0',
	      "userspanValue":'0',
	      "deptMgrSpanValue":'0'
      }
    ];

    const {leaveSettleInfo} = this.props.form;
    const { getFieldDecorator } = this.props.form;
   
    


    const formItemLayout2 = {
        labelCol: {
          sm: { span: 14 },
        },
        wrapperCol: {
          md: { span: 7 },//input框长度
        },
      };

    let taskRecord = this.props.taskRecord;
    console.log("taskRecord : " + taskRecord);
    
    return (
      <div id="settlePrint">
        <Row span={2} style={{textAlign: 'center'}}><h2>{leaveSettleInfo.create_name}离职手续交接单</h2></Row>
        <Card title="基本信息" >
          <Form style={{marginTop: 10}}>
            <FormItem label="姓名" {...formItemLayout2}>
              {getFieldDecorator('user_name', {
                initialValue: leaveSettleInfo.create_name })
              (<Input style={inputstyle} placeholder='' disabled={true}/>)
              }
            </FormItem>
              <FormItem label="所在部门" {...formItemLayout2}>
                {getFieldDecorator('deptname', {
                  initialValue: leaveSettleInfo.dept_name})
                (<Input style={inputstyle} placeholder='' disabled={true}/>)
                }
              </FormItem>
              <FormItem label="工作岗位" {...formItemLayout2}>
                {getFieldDecorator('position_title', {
                  initialValue: leaveSettleInfo.position_title})
                    (<Input style={inputstyle} placeholder='' disabled={true}/>)
                }
              </FormItem>
              <FormItem label="是否核心岗" {...formItemLayout2}>
              {getFieldDecorator('core_post', {
                initialValue: leaveSettleInfo.core_post === '1'? '是':'否'
              })(<Input style={inputstyle} placeholder='' disabled={true}/>)}
            </FormItem>
          </Form>
        </Card>
        <Card title="交接手续" >
          <Table dataSource={dataSourcePrint} colums={this.columsPrint} pagination={false}></Table>
          
          
          
          {/* {
            theEnd == "1"
              ?
              <Table dataSource={dataSource} columns={this.columns1} pagination={false}> </Table>
              :
              <Table dataSource={dataSource} columns={this.columns} pagination={false}> </Table>
          } */}
        </Card>
        <Card title="操作" >
          <div style={{textAlign: "center"}}>
            <Button onClick={this.gotoHome} type="dashed">关闭</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.print.bind(this)} >打印</Button>
          </div>
        </Card>
      </div>

    )

  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.staff_leave_index_model,
    ...state.staff_leave_index_model
  };
}

LeaveSettlePrint = Form.create()(LeaveSettlePrint);
export default connect(mapStateToProps)(LeaveSettlePrint);
