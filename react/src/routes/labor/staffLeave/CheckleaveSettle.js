/**
 * 文件说明：查看离职清算
 * 作者：师庆培
 * 邮箱：shiqp3@chinaunicom.cn
 * 创建日期：2019-06-27
 */
import React, {Component} from "react";
import {Button, Row, Form, Input, Card, Table, Select, message,Col} from "antd/lib/index";
import {connect} from "dva/index"
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
// import styles from './index.less';
import styles from './leave.less';


const FormItem = Form.Item;

class CheckLeaveSettle extends Component{
  constructor (props) {
    super(props);
    let user_id = Cookie.get('userid');
    let user_name = Cookie.get('username');
    this.state = {
      isClickable:true,
      user_id:user_id,
      user_name:user_name,
    };
  }

  gotoHome = () => {
    history.back();
  }

  
  
  
/**打印的列名 */  //TODO  数组方法  根据deptid判断是否是0
  
  renderContent = (value) => {
    const obj = {
      children: value,
      props: {},
    };
    return obj;
  };

  //打印
  print = () => {
    window.document.body.innerHTML = window.document.getElementById('leaveSettlePrint').innerHTML;
    window.print();
    window.location.reload();
  }


  render() {
    
    /**定义三个数组来判断 */
    let depArray =[];
    let deptmgrArray=[];


    let columsPrint=[
      {
        title:'交接部门',
        dataIndex:'dept_name',
        width:'10%',
        render: (value,row)=>{
          const obj = {
            children: value,
            props: {},
          };
          if(depArray.indexOf(row.dept_id)===-1){
            /**未找到 */
            depArray.push(row.dept_id);
            obj.props.rowSpan = row.deptSpanValue;
          }else{
            /**找到 */
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },{
        title:'交接手续',
        dataIndex:'task_name',
        width:'10%',
        render:this.renderContent
      },{
        title:'办理人',
        dataIndex:'user_name',
        width:'10%',
        render:this.renderContent
      },{
        title:'办理人签字',
        dataIndex:'user_sign',
        width:'10%',
        render:this.renderContent
      },{
        title:'部门经理签字',
        dataIndex:'dept_mgr_sign',
        width:'10%',
        render:(value,row)=>{
          const obj = {
            children: value,
            props: {},
          };
          if(deptmgrArray.indexOf(row.dept_id)===-1){
            /**未找到 */
            deptmgrArray.push(row.dept_id);
            obj.props.rowSpan = row.deptMgrSpanValue;
          }else{
            /**找到 */
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      }
    ];


    const{leaveSettleInfo} = this.props;
    const { getFieldDecorator } = this.props.form;

    const {settleApprovalDetail} = this.props;
    
    for (let i=0;i<settleApprovalDetail.length;i++) {
      settleApprovalDetail[i].key = i+1;
    }
    
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 9
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 8
        }
      },
      style :{marginBottom:10}
    };


    return (
      <div>
        <div id="leaveSettlePrint">
        <Row span={2} style={{textAlign: 'center'}}><h2>离职手续交接单</h2></Row>
        <br></br>
          <Form style={{marginTop: 10}}>
            <Row gutter={12}>
              <Col style={{ display : 'block' }}>
                {/* <FormItem label="姓名" {...formItemLayout2}>
                  {getFieldDecorator('create_name', {
                    initialValue: leaveSettleInfo.create_name })
                  (<Input placeholder='' disabled={true}/>)
                  }
                </FormItem> */}
                <div>
                  <Col span="6" offset="4">
                    <label>姓名： </label>
                    <label>{leaveSettleInfo.create_name}</label>
                  </Col>
                </div>
              </Col>
              <Col style={{ display : 'block' }}>
                {/* <FormItem label="部门" {...formItemLayout3}>
                  {getFieldDecorator('dept_name', {
                    initialValue: leaveSettleInfo.dept_name})
                  (<Input placeholder='' disabled={true}/>)
                  }
                </FormItem> */}
                <div>
                  <Col span="6" offset="4">
                    <label>部门： </label>
                    <label>{leaveSettleInfo.dept_name}</label>
                  </Col>
                </div>
              </Col>
            </Row>
            <br></br>
            <Row gutter={12}>
              <Col style={{ display : 'block' }}>
                {/* <FormItem label="工作岗位" {...formItemLayout2}>
                  {getFieldDecorator('position_title', {
                    initialValue: leaveSettleInfo.position_title})
                  (<Input placeholder='' disabled={true}/>)
                  }
                </FormItem> */}
                <div>
                  <Col span="6" offset="4">
                    <label>工作岗位： </label>
                    <label>{leaveSettleInfo.position_title}</label>
                  </Col>
                </div>
              </Col>
              <Col  style={{ display : 'block' }}>
                {/* <FormItem label="是否核心岗" {...formItemLayout3}>
                  {getFieldDecorator('core_post', {
                    initialValue: leaveSettleInfo.core_post
                  })(
                    <Select size="large" style={{width: '100%'}}  disabled={true}>
                      <Option value="true">是</Option>
                      <Option value="false">否</Option>
                    </Select>
                  )}
                </FormItem> */}
                <div>
                  <Col span="6" offset="4">
                    <label>是否核心岗： </label>
                    <label>{leaveSettleInfo.core_post==='false'?
                    '否'
                    :
                    '是'
                            }</label>
                  </Col>
                </div>
              </Col>
            </Row>
            <Row style={{display: "none"}}>
              
                <FormItem  {...formItemLayout} style={{display:"none"}}>
                  {getFieldDecorator('quit_settle_id',{
                    initialValue:leaveSettleInfo.quit_settle_id
                  })(<Input style={{color:'#000'}} placeholder = "" style={{display:"none"}}/>)}
                </FormItem>
            </Row>
           
            <Row style={{display: "none"}}>
                <FormItem  {...formItemLayout} style={{display:"none"}}>
                  {getFieldDecorator('create_person',{
                    initialValue:leaveSettleInfo.create_person
                  })(<Input style={{color:'#000'}} placeholder = "" style={{display:"none"}}/>)}
                </FormItem>
            </Row>

          </Form>
          <br></br>
          <div className={styles.boxW} style={{display:'block'}}>
          <Table dataSource={settleApprovalDetail} columns={columsPrint} pagination={false} bordered size="small">
          </Table>
          </div>
          

       <br></br>
            <Row gutter={12}>
              <Col  style={{ display : 'block' }}>
                {/* <FormItem label="离职（劳动合同解除）时间:" {...formItemLayout2}>
                  {getFieldDecorator('official_time', {
                    initialValue: '' })
                  (<span>_________________</span>)
                  }
                </FormItem> */}
                <div>
                  <Col span="10" offset="2">
                    <label>离职（劳动合同解除）时间： </label>
                    <label>______________</label>
                  </Col>
                </div>
              </Col>
              <Col  style={{ display : 'block' }}>
                {/* <FormItem label="本人签字" {...formItemLayout3}>
                  {getFieldDecorator('self_sign', {
                    initialValue: ''})
                  (<span>_________________</span>)
                  }
                </FormItem> */}
                <div>
                  <Col span="6" offset="2">
                    <label>本人签字： </label>
                    <label>___________</label>
                  </Col>
                </div>
              </Col>
            </Row>
        

        </div>
        
          <div style={{textAlign: "center"}}>
            <Button onClick={this.gotoHome} type="dashed">关闭</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary"  onClick={this.print.bind(this)} >打印</Button>
          </div>
        
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

CheckLeaveSettle = Form.create()(CheckLeaveSettle);
export default connect(mapStateToProps)(CheckLeaveSettle);
