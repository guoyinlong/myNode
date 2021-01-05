/**
 * 作者：张楠华
 * 日期：2018-3-28
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：财务调账功能
 */
import { Input,Row, Col,Select,DatePicker,Modal,message } from 'antd';
import moment from 'moment';
const Option = Select.Option;
const { TextArea } = Input;
export default class AdjustAccount extends React.Component {
  state = {
    arg_pay_time:moment(),
    ou:'',
    arg_dept_name:'',
    arg_team_name:'',
    arg_pay_money:'',
    arg_summary:'',
    visible:false,
    deptId : '',
    teamId : '',
  };
  //改变日期
  DatePickerChange=(value)=>{
    this.setState({
      arg_pay_time:value,
    });
  };
  // 改变OU，获取部门
  selectHandleChangeOU=(value)=>{
    this.setState({
      ou:value,
      arg_dept_name:'',
      arg_team_name:'',
    });
    this.props.dispatch({
      type : 'commonSearch/GetDepartProjInfo',
      ou : value,
    });
  };
  // 改变部门，获取小组
  selectHandleChangeDept=(value,props)=>{
    this.setState({
      arg_dept_name:value,
      arg_team_name:'',
    });
    this.props.dispatch({
      type : 'commonSearch/GetDepartInfo',
      ou : this.state.ou,
      deptName : value,
    });
    this.getDeptId(value,props);
  };
  getDeptId=(value,props)=>{
    const { depts } = props;
    let deptid = '';
    for(let i=0;i<depts.length;i++){
      if(depts[i].deptname === value){
        deptid = depts[i].deptid;
      }
    }
    this.setState({
      deptId : deptid,
    })
  };
  //改变团队
  selectHandleChangeTeam=(value,props)=>{
    this.getTeamId(value,props);
    this.setState({
      arg_team_name:value,
    });
  };
  //得到团队的id
  getTeamId=(value,props)=>{
    let teamid = '';
    const { teamNames } = props;
    for(let i=0;i<teamNames.length;i++){
      if(teamNames[i].team_name === value){
        teamid = teamNames[i].id;
      }
    }
    this.setState({
      teamId : teamid,
    })
  };
  //输入金额
  InputChange=(e)=>{
    let value = e.target.value;
    let isMinus = false;
      //如果以 — 开头
      if (value.indexOf('-') === 0) {
        isMinus = true;
      }

    //先将非数值去掉
    value = value.replace(/[^\d.]/g, '');
    //如果以小数点开头，或空，改为0
    if (value === '.') { value = '0'}
    //如果输入两个小数点，去掉一个
    if (value.indexOf('.') !== value.lastIndexOf('.')) {
      value = value.substring(0, value.lastIndexOf('.'))
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
      //费用项，最多2位小数
      value = value.substring(0, value.indexOf('.') + 3);
    }
    if(isMinus === true){
      value = '-' + value;
    }
    this.setState({
      arg_pay_money:value
    })
  };
  // 输入摘要
  InputChangeSummary=(e)=>{
    let value1 = e.target.value;
    if(value1.length >= 32){
      value1 = value1.substring(0,32)
    }
    this.setState({
      arg_summary:value1,
    });
  };
  adjustAccount=()=>{
    let { arg_pay_time,ou,arg_dept_name, arg_pay_money }=this.state;
    const {dispatch}=this.props;
    if(!arg_pay_time){
      message.warn('支付日期不能为空');
      return;
    }
    if(!ou){
      message.warn('组织单元不能为空');
      return;
    }
    if(!arg_dept_name){
      message.warn('部门不能为空');
      return;
    }
    if(!arg_pay_money){
      message.warn('支付金额不能为空');
      return;
    }
    dispatch({
      type:'commonSearch/adjustAccount',
      ...this.state,
    });
    this.props.dispatch({
      type:'commonSearch/clearDeptAndTeam'
    });
    this.setState({
      arg_pay_time:moment(),
      ou:'',
      arg_dept_name:'',
      arg_team_name:'',
      arg_pay_money:'',
      arg_summary:'',
      visible:false,
      deptId : '',
      teamId : '',
    })
  };
  showModal=()=>{
    this.setState({
      visible:true
    })
  };
  handleCancel=()=>{
    this.props.dispatch({
      type:'commonSearch/clearDeptAndTeam'
    });
    this.setState({
      arg_pay_time:moment(),
      ou:'',
      arg_dept_name:'',
      arg_team_name:'',
      arg_pay_money:'',
      arg_summary:'',
      visible:false,
      deptId : '',
      teamId : '',
    })
  };

  render() {
    const dataStyle={
      type:"flex",
      align:"middle",
      style:{margin:'10px 0'}
    };
    const colStyle1={
      xs:6,sm:6,style:{textAlign:'right'}
    };
    const colStyle2={
      xs:16,sm:16
    };
    return (
      <Modal
        title="调账"
        visible={this.state.visible}
        onCancel={this.handleCancel}
        onOk={this.adjustAccount}
      >
        <div style={{paddingRight:'20px'}}>
          <Row {...dataStyle}>
            <Col {...colStyle1}><span style={{color:'red'}}>*</span>支付日期：</Col>
            <Col {...colStyle2}>
              <DatePicker value={this.state.arg_pay_time}  style = {{width:'310px'}} onChange={this.DatePickerChange}/>
            </Col>
          </Row>
          <Row {...dataStyle}>
            <Col {...colStyle1}><span style={{color:'red'}}>*</span>组织单元：</Col>
            <Col {...colStyle2}>
              <Select value={this.state.ou} style={{width:'100%'}} onChange={this.selectHandleChangeOU} placeholder="请选择组织单元">
                {this.props.ouList.map((i)=>{return(<Option value={i.ou_name} key={i.ou_name}>{i.ou_name}</Option>)})}
              </Select>
            </Col>
          </Row>
          <Row {...dataStyle}>
            <Col {...colStyle1}><span style={{color:'red'}}>*</span>部门：</Col>
            <Col {...colStyle2}>
              <Select value={this.state.arg_dept_name} style={{width:'100%'}} onChange={(value)=>this.selectHandleChangeDept(value,this.props)}>
                {
                  (this.props.depts && this.props.depts.length !==0)? this.props.depts.map((i,index)=> <Option key={index} value={i.deptname}>{i.deptname.split('-')[1]}</Option>)
                    :
                    null
                }
              </Select>
            </Col>
          </Row>
          <Row {...dataStyle}>
            <Col {...colStyle1}>团队：</Col>
            <Col {...colStyle2}>
              <Select value={this.state.arg_team_name} style={{width:'100%'}} onChange={(value)=>this.selectHandleChangeTeam(value,this.props)}>
                {
                  this.props.teamNames && this.props.teamNames.length !==0 ? this.props.teamNames.map((i,index)=> <Option key={index} value={i.team_name}>{i.team_name}</Option>)
                    :
                    null
                }
              </Select>
            </Col>
          </Row>
          <Row {...dataStyle}>
            <Col {...colStyle1}><span style={{color:'red'}}>*</span>报销申请人：</Col>
            <Col {...colStyle2}>
              财务调账
            </Col>
          </Row>
          <Row {...dataStyle}>
            <Col {...colStyle1}><span style={{color:'red'}}>*</span>支付金额：</Col>
            <Col {...colStyle2}>
              <Input value={this.state.arg_pay_money} onChange={this.InputChange}/>
            </Col>
          </Row>
          <Row {...dataStyle}>
            <Col {...colStyle1}>摘要：</Col>
            <Col {...colStyle2}>
              <TextArea value={this.state.arg_summary} onChange={this.InputChangeSummary} rows={4} placeholder="字数不能超过32"/>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}
