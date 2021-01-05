/**
 * 作者：晏学义
 * 日期：2019-06-25
 * 邮箱：yanxy65@chinaunicom.cn
 * 功能：离职清算创建
 */
import React, {Component} from "react";
import {Button, Row, Form, Input, Card, Table, Select, message} from "antd/lib/index";
import {connect} from "dva/index"
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
const FormItem = Form.Item;

class CreateLeaveSettle extends Component{
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
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/labor/staffLeave_index'
    }));
  }

  submitApproval = () => {
    /* 调用创建服务 */
    this.setState({
      isClickable : false
    });
    let orig_apply_task_id = this.state.user_id + Number(Math.random().toString().substr(3,7) + Date.now()).toString(32);
    let create_person = this.state.user_id;
    let create_name = this.state.user_name;
    let core_post = this.props.form.getFieldValue("core_post");
    const{dispatch} = this.props;
    return new Promise((resolve) => {
      dispatch({
        type:'createLeaveSettleModel/createLeaveSettle',
        orig_apply_task_id,
        create_person,
        create_name,
        core_post,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        this.setState({ isClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/labor/staffLeave_index'}));
        },500);
      }
      if(resolve === 'false')
      {
        this.setState({ isClickable: true });
      }
    }).catch(() => {
      this.setState({ isClickable: true });
      dispatch(routerRedux.push({
        pathname:'/humanApp/labor/staffLeave_index'}));
    });

  }

  render() {
    const inputstyle = {color:'#000'};
    const { getFieldDecorator } = this.props.form;
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
    let leaveSettleRecord = this.props.leaveSettleRecord;
    return (
      <div>
        <p>当前处理环节：<span>{leaveSettleRecord.step}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          当前处理人：<span>{leaveSettleRecord.user_name}</span></p>
        <Row span={2} style={{textAlign: 'center'}}><h2>{leaveSettleRecord.task_name}申请表</h2></Row>
        <Card title="基本信息" >
          <Form style={{marginTop: 10}}>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('user_name', {
                initialValue: leaveSettleRecord.create_name })
              (<Input style={inputstyle} placeholder='' disabled={true}/>)
              }
            </FormItem>
            <FormItem label="部门" {...formItemLayout}>
              {getFieldDecorator('deptname', {
                initialValue: leaveSettleRecord.deptName})
              (<Input style={inputstyle} placeholder='' disabled={true}/>)
              }
            </FormItem>
            <FormItem label="项目组" {...formItemLayout}>
              {getFieldDecorator('create_proj', {
                initialValue: leaveSettleRecord.create_proj})
              (<Input style={inputstyle} placeholder='' disabled={true}/>)
              }
            </FormItem>
            <FormItem label="计划离职日期" {...formItemLayout}>
              {getFieldDecorator('leave_time', {
                initialValue: leaveSettleRecord.leave_time})
              (<Input style={inputstyle} placeholder='' disabled={true}/>)
              }
            </FormItem>
            <FormItem label="工作岗位" {...formItemLayout}>
              {getFieldDecorator('position_title', {
                initialValue: leaveSettleRecord.position_title})
              (<Input style={inputstyle} placeholder='' disabled={true}/>)
              }
            </FormItem>
            <FormItem label="是否核心岗" {...formItemLayout}>
              {getFieldDecorator('core_post', {
                initialValue: leaveSettleRecord.core_post
              })(
                <Select size="large" style={{width: '100%',color:'#000'}}  disabled={true}>
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>
              )}
            </FormItem>
          </Form>
        </Card>
        <Card title="操作" >
          <div style={{textAlign: "center"}}>
            <Button onClick={this.gotoHome} type="dashed">关闭</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" htmlType="submit" onClick={this.submitApproval} disabled={!this.state.isClickable}>{this.state.isClickable ? '提交' : '正在处理中...'}</Button>
          </div>
        </Card>
      </div>

    )

  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.createLeaveSettleModel,
    ...state.createLeaveSettleModel
  };
}

CreateLeaveSettle = Form.create()(CreateLeaveSettle);
export default connect(mapStateToProps)(CreateLeaveSettle);
