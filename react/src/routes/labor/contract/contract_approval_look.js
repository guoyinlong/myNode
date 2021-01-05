/**
 * 作者：王福江
 * 创建日期：2019-09-12
 * 邮箱：wangfj80@chinaunicom.cn
 * 功能：合同续签审批
 */
import React, { Component } from "react";
import { Button, Row, Form, Input, Card, Table } from "antd";
const FormItem = Form.Item;


import { connect } from "dva";
import { routerRedux } from "dva/router";
import styles from "../../overtime/style.less";

class contract_approval_look extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible3: true,
      dataListScore: [],
      dataListScoreResult: [],
    };
  }
  columns = [
    { title: '序号', dataIndex: 'key' },
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    {
      title: '部门名称', dataIndex: 'dept_name',
      render: (text, record, index) => {
        return (record.dept_name.split('-')[1]);
      }
    },
    { title: '项目组名称', dataIndex: 'team_name' },
    { title: '合同类型', dataIndex: 'contract_type' },
    { title: '合同期限（月）', dataIndex: 'contract_time' },
    { title: '起始日期', dataIndex: 'start_time' },
    { title: '截止日期', dataIndex: 'end_time' },
    { title: '已签合同数', dataIndex: 'sign_number' },
    { title: '距离合同续签天数', dataIndex: 'end_day' },
  ];


  //结束关闭
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/labor/staffLeave_index'
    }));
  }

  render() {
    //样式
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
    //信息
    const dataInfoList = this.props.dataInfoList;
    //意见列表
    const { approvalHiList } = this.props;
    const hidataList = approvalHiList.map(item =>
      <FormItem label={item.task_name} hasFeedback {...formItemLayout}>
        <Input style={{ color: '#000' }} value={item.task_detail} disabled={true}></Input>
      </FormItem>
    );
    if (approvalHiList.length !== 0) {
      this.state.visible3 = "none";
    }

    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h2>合同续签审批驳回信息</h2></Row>
        <br />
        <Card title="合同信息列表" className={styles.r}>
          <br />
          <Table
            columns={this.columns}
            dataSource={dataInfoList}
            pagination={false}
          />
          <br />
        </Card>

        <Card title="审批信息">
          <span style={{ textAlign: 'center' }}>
            {hidataList}
          </span>
        </Card>

        <br /><br />
        <div style={{ textAlign: "center" }}>
          <Button onClick={this.gotoHome} type="dashed">关闭</Button>
        </div>

      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.leave_approval_model,
    ...state.leave_approval_model
  };
}
contract_approval_look = Form.create()(contract_approval_look);
export default connect(mapStateToProps)(contract_approval_look);
