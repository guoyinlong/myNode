/**
 * 作者：郭西杰
 * 创建日期：2020-07-07
 * 邮箱：guoxj116@chinaunicom.cn
 * 功能：实现创建项目组考勤审批流程查看功能
 */ 
import React, { Component } from "react";
import { Button, Select, Modal, message, Table,Form, Row, Card, Col, Input } from "antd";
const FormItem = Form.Item;
const { TextArea } = Input;
import { routerRedux } from "dva/router";
import { connect } from 'dva';
import styles from "./style.less";

const Option = Select.Option;
class attend_proj_approval_look extends Component {
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
    const personFullDataList = this.props.personFullDataList;
    const personAbsenceDataList = this.props.personAbsenceDataList;
    const personTravelDataList = this.props.personTravelDataList;
    const personOutDataList = this.props.personOutDataList;
    return (
      <div>
        <br />
        <Row span={1} style={{ textAlign: 'center' }}>
               <h2><font size="6" face="arial">中国联通济南软件研究院</font></h2>
               <h2><font size="6" face="arial">项目组考勤统计单</font></h2></Row>
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

                <Row style={{ textAlign: 'center' }}>
                <FormItem label="项目名称" {...formItemLayout}>
                 {getFieldDecorator('proj_id', {
                   initialValue:applyInfo.proj_name
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
            </span>
        </Card>
          <br></br>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button onClick={this.goBack}>{'返回'}</Button>
          </Col>
          <br></br>
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
attend_proj_approval_look = Form.create()(attend_proj_approval_look);
export default connect(mapStateToProps)(attend_proj_approval_look)

