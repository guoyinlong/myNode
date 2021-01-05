/**
* 文件说明：查看请假管理已办信息
* 作者：郭西杰
* 邮箱：guoxj116@chinaunicom.cn
* 创建日期：2020-04-27
*/
import React from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Select, Modal, TreeSelect, message, Card, Radio, Transfer, Table } from 'antd';
import { routerRedux } from "dva/router";
import { connect } from "dva";
import styles from './style.less';

 
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


class absence_approve_look extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isSubmitClickable: true,
      isSaveClickable: true,
      leave_apply_id_save: '',
      absence_apply_id_save: '',
    }
  }

  //结束关闭
  goBack = () => {
    const { dispatch,editAble} = this.props;
    if (editAble === 'true'){
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/personalSearch'
      }))
    }else{
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex'
      }))
    }
  }
  breakOffInfo = [
    { title: '序号', dataIndex: 'indexID' },
    { title: '调休人姓名', dataIndex: 'absence_user_name' },
    { title: '调休人员工编号', dataIndex: 'absence_user_id' },
    { title: '起始日期', dataIndex: 'absenct_st' },
    { title: '结束日期', dataIndex: 'absenct_et' },
    { title: '调休天数', dataIndex: 'absence_days' },
    { title: '申请理由', dataIndex: 'absenct_reason' },
  ];
  render() {
    const inputstyle = { color: '#000' };
    const { approvalHiList, personsList, applyPersonInfo } = this.props;
    let applyInfo = {};
    if (applyPersonInfo.length > 0) {
      applyInfo = applyPersonInfo[0];
    }

    const hidataList = approvalHiList.map(item =>
      <FormItem >
        {item.task_name}: &nbsp;&nbsp;{item.task_detail}
      </FormItem>
    );

    //销假信息
    let ifabsence = true;
    for (let i = 0; i < approvalHiList.length; i++) {
      if (approvalHiList[i].task_name == '申请人销假') {
        ifabsence = false;
      }
    }
    let absence_real_days = '';
    let absence_real_st = '';
    let absence_real_et = '';
    if (applyPersonInfo.length > 0) {
      applyInfo = applyPersonInfo[0];
      absence_real_days = applyInfo.absence_real_days;
      absence_real_st = applyInfo.absence_real_st;
      absence_real_et = applyInfo.absence_real_et;
    }

    //传过来的信息
    const { getFieldDecorator } = this.props.form;
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
    return (
      <div>
        <Row span={1} style={{ textAlign: 'center' }}>
          <h2><font size="6" face="arial">中国联通济南软件研究院员工调休申请表</font></h2></Row>
        <p style={{ textAlign: 'right' }}>申请日期：<span><u>{applyInfo.create_time}</u></span></p>
        <br /><br />
        <Form>
          <Card title="基本信息" className={styles.r}>
            <Form style={{ marginTop: 10 }}>
              <Row>
                <Col span="24">
                  <FormItem label="员工编号" {...formItemLayout}>
                    {getFieldDecorator('userid', {
                      initialValue: applyInfo.create_person_id
                    })
                      (<Input style={inputstyle} value='' disabled={true} />)
                    }
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="姓名" {...formItemLayout}>
                    {getFieldDecorator('username', {
                      initialValue: applyInfo.create_person_name
                    })
                      (<Input style={inputstyle} value='' disabled={true} />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <FormItem label="所在部门" {...formItemLayout}>
                {getFieldDecorator('deptname', {
                  initialValue: applyInfo.dept_name
                })
                  (<Input style={inputstyle} value='' disabled={true} />)
                }
              </FormItem>
              <FormItem label="所在项目" {...formItemLayout}>
                {getFieldDecorator('proj_id', {
                  initialValue: applyInfo.proj_name
                })(<Input style={inputstyle} value='' disabled={true} />)}
              </FormItem>
              <FormItem label="请假类型" {...formItemLayout}>
                {getFieldDecorator('absencetype', {
                  initialValue: applyInfo.absence_type
                })
                  (<Input style={inputstyle} value='' disabled={true} />)
                }
              </FormItem>
            </Form>
          </Card>

          <Card title="申请信息" className={styles.r} >
            <div>
            </div>
            <br></br>
            <Table style={{}}
              columns={this.breakOffInfo}
              dataSource={personsList}
              pagination={false}
              bordered={true}
            />
          </Card>

          <Card title="销假信息" className={styles.r} width={'100%'} hidden={ifabsence}>
            <Form>
              <FormItem label={'实际调休天数'} {...formItemLayout}>
                <Input placeholder="调休天数" value={absence_real_days} style={{ width: '150', color: '#000' }} name="absence_days" disabled={true} />
              </FormItem>
              <FormItem label={'实际调休日期'} {...formItemLayout}>
                <Input placeholder="开始日期" value={absence_real_st} style={{ width: '150', color: '#000' }} name="rel_start_date" disabled={true} />
                &nbsp;--&nbsp;
                    <Input placeholder="结束日期" value={absence_real_et} style={{ width: '150', color: '#000' }} name="rel_end_date" disabled={true} />
              </FormItem>
            </Form>
          </Card>

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
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.absence_approve_look_model,
    ...state.absence_approve_look_model,
  };
}

absence_approve_look = Form.create()(absence_approve_look);
export default connect(mapStateToProps)(absence_approve_look)
