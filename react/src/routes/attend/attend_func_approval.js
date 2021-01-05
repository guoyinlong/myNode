 /**
 * 作者：郭西杰
 * 创建日期：2020-07-07
 * 邮箱：guoxj116@chinaunicom.cn
 * 功能：实现创建职能部门考勤审批流程功能
 */
import React, { Component } from "react";
import { Button, Select, Modal, Table,message, Form, Row, Card, Col, Input } from "antd";
const FormItem = Form.Item;
const { TextArea } = Input;
import { routerRedux } from "dva/router";
import { connect } from 'dva';
import styles from "./style.less";

const Option = Select.Option;
class attend_func_approval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isSubmitClickable: true, 
      isSaveClickable: true,
      isClickable: true,
      choiseOpinionFlag: "none",
      now_post_name: '',
      if_end_task: 0,
    }
  }
  //结束关闭
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/attend/index'
    }));
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  handleOk = () => {
    let attendDataSource = this.props.applyPersonInfo;
    this.setState({ isClickable: false });
    this.setState({
      visible: false,
    }); 
    let orig_proc_inst_id = this.props.proc_inst_id;
    let orig_proc_task_id = this.props.proc_task_id;
    let apply_id = this.props.apply_id;
    let approval_if = this.props.form.getFieldValue("rejectIf");
    let approval_advice = this.props.form.getFieldValue("rejectAdvice");
    let nextstepPerson = this.props.form.getFieldValue("nextstepPerson");
    let now_post_name = this.state.now_post_name;
    let nextpostid = this.state.next_post_id;
    const { dispatch } = this.props;
    return new Promise((resolve) => {
      dispatch({
        type: 'attend_approval_model/attendDeptApprovalSubmit',
        approval_if,
        apply_id,
        approval_advice,
        orig_proc_inst_id,
        orig_proc_task_id,
        nextstepPerson,
        nextpostid,
        now_post_name,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/attend/index'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ isClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index'
      }));
    });
  }
  submitcheck = () => {
    let approval_if = this.props.form.getFieldValue("rejectIf");
    if (approval_if == '不同意') {
      this.setState({ isClickable: false });
      let orig_proc_inst_id = this.props.proc_inst_id;
      let orig_proc_task_id = this.props.proc_task_id;
      let apply_id = this.props.apply_id;
      let approval_if = this.props.form.getFieldValue("rejectIf");
      let approval_advice = this.props.form.getFieldValue("rejectAdvice");  
      let nextstepPerson = '';
      let nextpostid = this.state.next_post_id;
      const { dispatch } = this.props;

      if (approval_if === '不同意' && approval_advice === '') {
        this.setState({ isClickable: true });
        message.error('意见不能为空');
      } else {
        return new Promise((resolve) => {
          dispatch({
            type: 'attend_approval_model/attendDeptApprovalSubmit',
            approval_if,
            apply_id,
            approval_advice,
            orig_proc_inst_id,
            orig_proc_task_id,
            nextstepPerson,
            nextpostid,
            resolve
          });
        }).then((resolve) => {
          if (resolve === 'success') {
            this.setState({ isClickable: true });
            setTimeout(() => {
              dispatch(routerRedux.push({
                pathname: '/humanApp/attend/index'
              }));
            }, 500);
          }
          if (resolve === 'false') {
            this.setState({ isClickable: true });
          }
        }).catch(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/attend/index'
          }));
        });
      }


    } else {
      /*最后一步*/
      if (this.state.if_end_task == '1') {
        this.setState({ isClickable: false });
        let apply_id = this.props.apply_id;
        let orig_proc_inst_id = this.props.proc_inst_id;
        let orig_proc_task_id = this.props.proc_task_id;
        let approval_if = this.props.form.getFieldValue("rejectIf");
        let approval_advice = this.props.form.getFieldValue("rejectAdvice");
        let nextstepPerson = '';
        let nextpostid = this.state.next_post_id;
        const { dispatch } = this.props;

        return new Promise((resolve) => {
          dispatch({
            type: 'attend_approval_model/attendDeptApprovalEnd',
            approval_if,
            apply_id,
            approval_advice,
            orig_proc_inst_id,
            orig_proc_task_id, 
            nextstepPerson,
            nextpostid,
            resolve
          });
        }).then((resolve) => {
          if (resolve === 'success') {
            this.setState({ isClickable: true });
            setTimeout(() => {
              dispatch(routerRedux.push({
                pathname: '/humanApp/attend/index'
              }));
            }, 500);
          }
          if (resolve === 'false') {
            this.setState({ isClickable: true });
          }
        }).catch(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/attend/index'
          }));
        });
      } else {
        this.setState({
          visible: true,
        });
      }
    }
  }
  //选择不同意，显示驳回意见信息
  choiseOpinion = (value) => {
    if (value === "不同意") {
      this.setState({
        choiseOpinionFlag: "",
      })
    } else {
      this.setState({
        choiseOpinionFlag: "none",
      })
    }
  }
  full_attend_columns = [ 
    {
      title: '序号',
      dataIndex: 'indexID',
      key: 'indexID',
      width: 50,
      render: (text, record, index) => {
        return <span>{index + 1}</span> 
      },
    },   
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
  ];
  absence_columns = [ 
    {
      title: '序号',
      dataIndex: 'indexID',
      key: 'indexID',
      width: 50,
      render: (text, record, index) => {
        return <span>{index + 1}</span> 
      },
    }, 
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    { title: '请假类型', dataIndex: 'absence_type' },
    { title: '请假天数', dataIndex: 'absence_days' },
    { title: '请假详情', dataIndex: 'absence_details' },
  ];
  business_trip_columns = [
    {
      title: '序号',
      dataIndex: 'indexID',
      key: 'indexID',
      width: 50,
      render: (text, record, index) => {
        return <span>{index + 1}</span> 
      },
    },       
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    { title: '出差天数', dataIndex: 'travel_days' },
    { title: '出差详情', dataIndex: 'travel_details' },
  ];    
  out_trip_columns = [
    {
      title: '序号',
      dataIndex: 'indexID',
      key: 'indexID',
      width: 50,
      render: (text, record, index) => {
        return <span>{index + 1}</span> 
      },
    }, 
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    { title: '因公外出天数', dataIndex: 'away_days' },
    { title: '因公外出详情', dataIndex: 'away_details' },
  ];

  render() {
    const inputstyle = { color: '#000' };
    const { getFieldDecorator } = this.props.form;
    const formItemLayout2 = {
      labelCol: {
        sm: { span: 14 },
      },
      wrapperCol: {
        md: { span: 7 },//input框长度
      },
    };
    const formItemLayout3 = {
      labelCol: {
        sm: { span: 3 },
      },
      wrapperCol: {
        md: { span: 7 },//input框长度
      },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const { approvalNowList, approvalHiList, applyPersonInfo } = this.props;
    let applyInfo = {};
    if (applyPersonInfo.length > 0) {
      applyInfo = applyPersonInfo[0];
    }
    const hidataList = approvalHiList.map(item =>
      <FormItem >
        {item.task_name}: &nbsp;&nbsp;{item.task_detail}
      </FormItem>
    );
    //评论信息
    let nowdataList = approvalNowList.map(item =>
      <span>
        <FormItem label={item.task_name} {...formItemLayout}>
          {getFieldDecorator('rejectIf', {
            initialValue: "同意",
          })(
            <Select size="large" style={{ width: 200 }} placeholder="请选择审批意见" disabled={false} onChange={this.choiseOpinion}>
              <Option value="同意">同意</Option>
              <Option value="不同意">不同意</Option>
            </Select>
          )}
        </FormItem>

        <FormItem label="审批驳回意见" {...formItemLayout} style={{ display: this.state.choiseOpinionFlag }}>
          {getFieldDecorator('rejectAdvice', {
            initialValue: "驳回原因",
            rules: [
              {
                required: true,
                message: '请填写驳回意见'
              },
            ],
          })(
            <TextArea
              style={{ minHeight: 32 }}
              placeholder="请填写驳回意见"
              rows={2}
            />
          )}
        </FormItem>
      </span>
    );
   
    if (approvalNowList.length > 0) {
      let i = approvalNowList.length -1;
      this.state.now_post_name = approvalNowList[i].task_name;
      if (approvalNowList[i].task_name !== '部门负责人审批') { 
        this.state.if_end_task = '1';
        nowdataList = '';
      }
    }
    const personFullDataList = this.props.personFullDataList;
    const personAbsenceDataList = this.props.personAbsenceDataList;
    const personTravelDataList = this.props.personTravelDataList;
    const personOutDataList = this.props.personOutDataList;

    //选择一下处理人信息
    let nextDataList = this.props.nextDataList;
    let nextpostname = '';
    let initperson = '';
    if (nextDataList.length > 0) {
      initperson = nextDataList[0].submit_user_id;
      nextpostname = nextDataList[0].submit_post_name;
      this.state.next_post_id = '1000000000001';
    }
    const nextdataList = nextDataList.map(item =>
      <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
    );

    return (
      <div>
        <br />
        <Row span={1} style={{ textAlign: 'center' }}>
               <h2><font size="6" face="arial">中国联通济南软件研究院</font></h2>
               <h2><font size="6" face="arial">职能部门考勤统计单</font></h2></Row>
               <p style={{ textAlign: 'right' }}>申请日期：<span><u>{applyInfo.create_time}</u></span></p>
              <br></br>
        <Form>
          <Card title="基本信息：" className={styles.r}>
                <Form style={{ marginTop: 10 }}>
                <Row style={{ textAlign: 'center' }}>
                <FormItem label="部门名称" {...formItemLayout}>
                 {getFieldDecorator('deptname', {
                   initialValue: applyInfo.dept_name
                  })
                  (<Input style={inputstyle} value='' disabled={true} />)
                 }
                </FormItem> 
                </Row> 
                <Row>
                <FormItem label="考勤月份" {...formItemLayout}>
                {getFieldDecorator('attend_month', {
                   initialValue: applyInfo.cycle_code
                  })
                  (<Input style={inputstyle} value='' disabled={true} />)
                 }
                 </FormItem>
                </Row>
                <br />
               </Form>
              </Card>
          <Card title="*全勤类">
               <Table
                 columns={this.full_attend_columns}
                 dataSource={personFullDataList}
                 pagination={true}
                //scroll={{x: '100%', y: 450}}
                 width={'100%'}
                 bordered= {true}
                />
               </Card> 
          <Card title="*请假类"> 

               <Table
                 columns={this.absence_columns}
                 dataSource={personAbsenceDataList}
                 pagination={false}
                //scroll={{x: '100%', y: 450}}
                 width={'100%'}
                 bordered= {true}
                />
               </Card> 
          <Card title="*出差类"> 
               <Table
                 columns={this.business_trip_columns}
                 dataSource={personTravelDataList}
                 pagination={true}
                //scroll={{x: '100%', y: 450}}
                 width={'100%'}
                 bordered= {true}
                />
               </Card>
          <Card title="*因公外出类">         
               <Table
                 columns={this.out_trip_columns}
                 dataSource={personOutDataList}
                 pagination={true}
                //scroll={{x: '100%', y: 450}}
                 width={'100%'}
                 bordered= {true}
                />
               </Card>
        </Form>
        <Card title="审批信息">
            <span style={{ textAlign: 'left', color: '#000' }}>
              {hidataList}
              {nowdataList}
            </span>
          </Card>
          <br></br>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button onClick={this.goBack}>{'返回'}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" htmlType="submit" onClick={this.submitcheck} disabled={!this.state.isClickable}>{this.state.isClickable ? '提交' : '正在处理中...'}</Button>
          </Col>
          <br></br>
        <Modal
          title="流程处理"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Form>
              <FormItem label={'下一步环节'} {...formItemLayout}>
                <Input style={inputstyle} value={nextpostname} disabled={true} />
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson', {
                  initialValue: initperson
                })(
                  <Select size="large" style={{ width: '100%' }} initialValue={initperson} placeholder="请选择处理人">
                    {nextdataList}
                  </Select>)}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.attend_approval_model,
    ...state.attend_approval_model,
  };
}
attend_func_approval = Form.create()(attend_func_approval);
export default connect(mapStateToProps)(attend_func_approval)

