/*
 * 作者：王福江
 * 创建日期：2019-10-24
 * 邮件：wangfj80@chinaunicom.cn
 * 文件说明：人工成本工资项配置
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Spin, Modal, Form, Popconfirm, Button, Input, Icon } from 'antd';
import styles from './style.less';
import watermark from 'watermark-dom';

const FormItem = Form.Item;
const { TextArea } = Input;

class manageCenter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalVisibleEdit: false,
      edit_id: '',
      edit_cost_cname: '',
      edit_cost_ename: ''
    }
  }
  componentDidMount = () => {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let hour = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();

    let waterName = Cookie.get("username") + ' ' + `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : ` ${date}`}  ${hour}:${minutes}:${seconds}`
    watermark.load({ watermark_txt: waterName });
  }
  columns = [
    { title: '序号', dataIndex: 'indexID', width: '10%' },
    { title: '工资项名称', dataIndex: 'cost_cname', width: '25%' },
    { title: '工资项英文名称', dataIndex: 'cost_ename', width: '25%' },
    { title: '类型', dataIndex: 'cost_type', width: '20%' },
    {
      title: '操作', dataIndex: '', width: '20%',
      render: (text, record, index) => {
        return (
          <div>
            <Button
              type='primary'
              size='small'
              onClick={() => this.setModalVisible('edit', record)}
            >{'修改'}
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Popconfirm
              title="确定删除吗？"
              onConfirm={() => this.deleteWorkTime(record)}
            >
              <Button
                type='primary'
                size='small'
              >{'删除'}
              </Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];
  setModalVisible = (modalType, record) => {
    if (modalType === 'edit') {
      this.setState({
        modalVisibleEdit: true
      });
      this.setState({
        edit_id: record.id,
        edit_cost_cname: record.cost_cname,
        edit_cost_ename: record.cost_ename
      });
    } else {
      this.setState({
        modalVisible: true
      });
    }
  };
  deleteWorkTime = (record) => {
    //console.log("record==="+JSON.stringify(record));
    const { dispatch } = this.props;
    dispatch({
      type: 'manageCenterModel/deleteManageCenter',
      arg_param: record
    });
  };
  freshButton = () => {
    //刷新
    const { dispatch } = this.props;
    dispatch({
      type: 'manageCenterModel/initManageQuery'
    });
  };
  handleConcel = () => {
    this.setState({
      modalVisible: false
    });
  };
  handleOK = () => {
    let formData = this.props.form.getFieldsValue();
    let arg_param = {};
    arg_param['arg_cost_cname'] = formData.cost_cname;
    arg_param['arg_cost_ename'] = formData.cost_ename;
    arg_param['arg_cost_type'] = '人工成本';
    const { dispatch } = this.props;
    dispatch({
      type: 'manageCenterModel/addManageCenter',
      arg_param: arg_param
    });
    this.setState({
      modalVisible: false
    });
  };
  handleConcelEdit = () => {
    this.setState({
      modalVisibleEdit: false
    });
  };
  handleOKEdit = () => {
    let formData = this.props.form.getFieldsValue();
    let arg_param = {};
    arg_param['arg_id'] = this.state.edit_id;
    arg_param['arg_cost_cname'] = formData.edit_cost_cname;
    arg_param['arg_cost_ename'] = formData.edit_cost_ename;
    arg_param['arg_cost_his_cname'] = this.state.edit_cost_cname;

    const { dispatch } = this.props;
    dispatch({
      type: 'manageCenterModel/updateManageCenter',
      arg_param: arg_param
    });
    this.setState({
      modalVisibleEdit: false
    });
  };
  render() {
    const { titleDataList } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
      style: { marginBottom: 8 }
    };
    return (
      <Spin tip={'加载中…'} spinning={this.props.loading}>
        <div style={{ padding: '13px 15px 16px 15px', background: 'white' }}>
          <div>
            <Button type='primary' onClick={() => this.setModalVisible('add')}>
              新增
            </Button>
            &nbsp;&nbsp;
            <span>
              <span>总共有 </span>
              <span style={{ color: 'red', fontWeigh: 'bold' }}>{titleDataList.length}</span>
              <span> 条</span>
            </span>
            <span style={{ float: 'right' }}>
              <Button onClick={this.freshButton} type='primary'>
                <Icon type="reload" />{'刷新'}
              </Button>
            </span>
          </div>
          <div style={{ marginTop: 4 }}>
            <Table
              scroll={{ y: 500 }}
              pagination={{ pageSize: 50 }}
              dataSource={titleDataList}
              columns={this.columns}
              className={styles.tableStyle}
              bordered={true}
            />
          </div>
          <Modal
            onOk={() => this.handleOK()}
            onCancel={() => this.handleConcel()}
            width={'600px'}
            visible={this.state.modalVisible}
            title={'新增'}
          >
            <Form>
              <FormItem label='工资项名称' {...formItemLayout}>
                {getFieldDecorator('cost_cname', {
                  rules: [{
                    required: true,
                    message: '必填',
                    whitespace: true
                  }],
                  initialValue: ''
                })(<Input />)}
              </FormItem>
              <FormItem label='工资项英文名称' {...formItemLayout}>
                {getFieldDecorator('cost_ename', {
                  rules: [{
                    whitespace: true
                  }],
                  initialValue: ''
                })(<Input disabled='true' />)}
              </FormItem>
              <FormItem label='类型' {...formItemLayout}>
                <Input value={'人工成本'} />
              </FormItem>
            </Form>

          </Modal>
          <Modal
            onOk={() => this.handleOKEdit()}
            onCancel={() => this.handleConcelEdit()}
            width={'600px'}
            visible={this.state.modalVisibleEdit}
            title={'编辑'}
          >
            <FormItem label='工资项名称' {...formItemLayout}>
              {getFieldDecorator('edit_cost_cname', {
                rules: [{
                  required: true,
                  message: '必填',
                  whitespace: true
                }],
                initialValue: this.state.edit_cost_cname
              })(<Input />)}
            </FormItem>
            <FormItem label='工资项英文名称' {...formItemLayout}>
              {getFieldDecorator('edit_cost_ename', {
                rules: [{
                  whitespace: true
                }],
                initialValue: this.state.edit_cost_ename
              })(<Input disabled='true' />)}
            </FormItem>
            <FormItem label='类型' {...formItemLayout}>
              <span>{'人工成本'}</span>
            </FormItem>
          </Modal>
        </div>
      </Spin>
    )
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.manageCenterModel,
    ...state.manageCenterModel
  };
}
manageCenter = Form.create()(manageCenter);
export default connect(mapStateToProps)(manageCenter);

