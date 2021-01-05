/**
  * 作者： 王均超
  * 创建日期：2019-07-02
  * 邮箱:  wangjc@itnova.com.cn
  * 功能： 申请工位
  */
import React from 'react';
import styles from './applyWorkstation.less';
import { Button, Modal, Input, Table, message, DatePicker, Row, Col, Radio, Icon } from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

class ApplyWorkstation extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      isShowDetailModal: false,
      // 申请原因
      applyReason: false,
      // 申请开始时间
      applyStartDate: null,
      // 申请结束时间
      applyEndDate: null,
      // 申请时间段  是个数组[Date, Date]
      applyRangeDate: null,
      // 到期时间段  是个数组[Date, Date]
      dueDateRange: null,
      // 查看详情选中的 modal
      detailObj: null,
      // 选中表格的对象数组
      tableSelected: [],
      tableColumns: [
        {
          title: '项目组名称',
          dataIndex: 'ex_project_name',
          width: 100,
        },
        {
          title: '项目所属部门名称',
          dataIndex: 'ex_project_dept_name',
          width: 100,
        },
        {
          title: '项目经理/负责人',
          dataIndex: 'ex_project_charger_name',
          width: 100,
        },
        {
          title: '项目负责人电话',
          dataIndex: 'tel',
          width: 100,
        },
        {
          title: '性质',
          dataIndex: 'prop',
          width: 100,
        },
        {
          title: '姓名',
          dataIndex: 'user_name',
          width: 100,
        },
        {
          title: '操作',
          width: 150,
          render: (text, record) => (
            <span>
              <a href="javascript:;" onClick={this.showDetailModal.bind(this, record)}>查看</a>
            </span>
          )
        },
      ],


    };
  }


  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/adminApp/compRes/officeResMain',
    }));
  }
  changeOpt = (e) => {
    this.setState({ flag: e.target.value })
  }
  showDetailModal = (itemObj) => {
    this.setState({
      isShowDetailModal: true,
      detailObj: itemObj
    });
  };

  handleOk = e => {
    this.setState({
      isShowDetailModal: false
    });
  };

  handleCancel = e => {
    this.setState({
      isShowDetailModal: false
    });
  };

  // 申请开始时间
  applyStartDateChange(date, dateString) {
    this.setState({
      applyStartDate: date
    })
  }

  // 申请结束时间
  applyEndDateChange(date, dateString) {
    this.setState({
      applyEndDate: date
    })
  }

  // 申请时间 段
  applyRangeDateChange(dateArr, dateString) {
    this.setState({
      applyRangeDate: dateArr
    })
  }
  // 到期时间 段
  dueDateRangeChange(dateArr, dateString) {
    this.setState({
      dueDateRange: dateArr
    })
  }

  // 申请原因说明
  userInputAction(type, eventObj) {
    var value = eventObj.target.value;
    this.setState({
      [type]: value
    })
  }




  getDetailModalHtml() {
    const { detailObj, isShowDetailModal } = this.state;
    if (isShowDetailModal) {
      return (
        <Modal
          title="人员详情表"
          visible={this.state.isShowDetailModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width='720px'
        >
          <div>
            <Row className={styles.rowStyle}>
              <Col span={12}>单位名称：{detailObj.ex_vendor}</Col>
              <Col span={12}>负责人：{detailObj.ex_charger_name}</Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={12}>负责人电话：{detailObj.ex_charger_tel}</Col>
              <Col span={12}>项目组名称：{detailObj.ex_project_name}</Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={12}>项目组编号：{detailObj.ex_project_id}</Col>
              <Col span={12}>项目所属部门：{detailObj.ex_project_dept_name}</Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={12}>项目经理/负责人：{detailObj.ex_project_charger_name}</Col>
              <Col span={12}>项目负责人电话：{detailObj.ex_project_charger_tel}</Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={12}>性质：{detailObj.prop}</Col>
              <Col span={12}>姓名：{detailObj.user_name}</Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={12}>身份证号：{detailObj.user_id}</Col>
              <Col span={12}>联系电话：{detailObj.tel}</Col>
            </Row>
          </div>
        </Modal>
      );
    } else {
      return "";
    }
  }




  render() {
    const that = this;
    const { applyList } = this.props;
    const { tableColumns, tableSelected } = this.state;
    const modalHtml = this.getDetailModalHtml();
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        that.setState({
          tableSelected: selectedRows
        });
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <div className={styles.wrapper + ' ' + styles.applyWorkstation}>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }} >申请工位</h2>

        <div >

          <Button type="primary" onClick={this.goBack} style={{ float: 'right' }}>返回</Button>
          <Button type="primary" style={{ float: 'right', marginRight: 40 }}>申请查询记录</Button>
        </div>

        <div>
          <Radio.Group defaultValue="seat" onChange={this.changeOpt}>
            <Radio.Button value="seat">流动人员</Radio.Button>
            <Radio.Button value="external">正式人员</Radio.Button>
          </Radio.Group>
        </div>

        <div className={styles['date-container']}>
          <div className={styles['apply-count']}>
            <span className={styles['label']}>申请数量: </span>
            <span className={styles['count']}>{tableSelected.length}</span>
          </div>
          <div className={styles['apply-start']} >
            申请开始时间：<DatePicker onChange={this.applyStartDateChange.bind(this)} />
          </div>
          <div className={styles['apply-end']}>
            申请到期时间：<DatePicker onChange={this.applyEndDateChange.bind(this)} />
          </div>
        </div>

        <div className={styles['apply-desc']}>
          <div className={styles['label']}>
            申请原因:
              </div>
          <div className={styles['text-area']}>
            <TextArea rows={3} onChange={this.userInputAction.bind(this, 'applyReason')} />
          </div>
        </div>

        <div className={styles['date-range']}>
          <span>
            申请人员:
           </span>
          <div>
            <a>
              <Button style={{ marginRight: 40 }} onClick={this.goAddPage}><Icon type='download' />模板下载</Button>
            </a>
            <Button type="primary" >导入</Button>
          </div>
        </div>

        <div className={styles['table-container']}>
          <Table rowSelection={rowSelection} columns={tableColumns} rowKey="detail_id" dataSource={applyList} className={styles.orderTable} />
        </div>
        {modalHtml}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { query, applyList } = state.applyWorkstation;
  return {
    loading: state.loading.models.applyWorkstation,
    query,
    applyList
  };
}

export default connect(mapStateToProps)(ApplyWorkstation);
