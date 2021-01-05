/*
 * 作者：王福江
 * 创建日期：2019-11-13
 * 邮件：wangfj80@chinaunicom.cn
 * 文件说明：评议人信息管理
 */
import React from 'react';
import {connect} from 'dva';
import { Table, Spin, Modal, Form, Popconfirm, Button, Input, Icon, Select } from 'antd';
import styles from './style.less';
import message from "../../components/commonApp/message";

const FormItem = Form.Item;
const { Option } = Select;

class personInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalVisibleEdit: false,
      edit_id: '',
      edit_user_id: '',
      edit_user_name: '',
      edit_post_name: '',
      edit_person_type: ''
    }
  }
  columns = [
    { title: '序号', dataIndex: 'indexID',width: '5%'},
    { title: '员工编号', dataIndex: 'user_id' ,width: '15%'},
    { title: '姓名', dataIndex: 'user_name' ,width: '15%'},
    { title: '现任单位', dataIndex: 'ou_name' ,width: '15%'},
    { title: '现任职务', dataIndex: 'post_name' ,width: '15%'},
    { title: '隶属群体', dataIndex: 'appraise_person_type' ,width: '15%'},
    { title: '操作', dataIndex: '', width: '20%',
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
              title="确定置失效吗？"
              onConfirm={()=>this.deleteInfo(record)}
            >
              <Button
                type='primary'
                size='small'
              >{'置失效'}
              </Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];
  setModalVisible = (modalType, record) => {
    if(modalType==='edit'){
      this.setState({
        modalVisibleEdit: true
      });
      this.setState({
        edit_id: record.id,
        edit_user_id: record.user_id,
        edit_user_name: record.user_name,
        edit_post_name: record.post_name,
        edit_person_type: record.appraise_person_type
      });
    }else{
      this.setState({
        modalVisible: true
      });
    }
  };
  deleteInfo = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'manageInfoModel/deletePersonInfo',
      arg_param: record
    });
  };
  freshButton = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'manageInfoModel/initPersonQuery'
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
    arg_param['arg_user_id'] = formData.user_id;
    arg_param['arg_user_name'] = formData.user_name;
    arg_param['arg_post_name'] = formData.post_name;
    arg_param['arg_person_type'] = formData.person_type;
    this.setState({
      modalVisible: false
    });
    if(arg_param['arg_user_id']===''||arg_param['arg_user_name']===''||arg_param['arg_post_name']==='' ||arg_param['arg_person_type']===''){
      message.error("必填信息不能为空");
    }else{
      const {dispatch} = this.props;
      dispatch({
        type: 'manageInfoModel/addPersonInfo',
        arg_param: arg_param
      });
    }
    this.props.form.resetFields(['user_id','user_name','post_name','person_type'],[]);
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
    arg_param['arg_user_id'] = formData.edit_user_id;
    arg_param['arg_user_name'] = formData.edit_user_name;
    arg_param['arg_post_name'] = formData.edit_post_name;
    arg_param['arg_person_type'] = formData.edit_person_type;
    this.setState({
      modalVisibleEdit: false
    });
    if(arg_param['arg_user_id']===''||arg_param['arg_user_name']===''||arg_param['arg_post_name']===''||arg_param['arg_person_type']===''){
      message.error("必填信息不能为空");
    }else{
      const {dispatch} = this.props;
      dispatch({
        type: 'manageInfoModel/updatePersonInfo',
        arg_param: arg_param
      });
    }
  };

  render() {
    const { personDataList } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8},
      wrapperCol: { span: 12},
      style: {marginBottom: 8}
    };
    const formItemLayout2 = {
      labelCol: { span: 8},
      wrapperCol: { span: 8},
      style: {marginBottom: 8}
    };
    return (
      <Spin tip={'加载中…'} spinning={this.props.loading}>
        <div style={{padding: '13px 15px 16px 15px', background: 'white'}}>
          <div>
            <Button type='primary' onClick={() => this.setModalVisible('add')}>
              新增
            </Button>
            &nbsp;&nbsp;
            <span>
                <span>总共有 </span>
                <span style={{color: 'red', fontWeigh: 'bold'}}>{personDataList.length}</span>
                <span> 条</span>
            </span>
            <span style={{float: 'right'}}>
                <Button onClick={this.freshButton} type='primary'>
                    <Icon type="reload"/>{'刷新'}
                </Button>
            </span>
          </div>
          <div style={{marginTop: 4}}>
            <Table
              scroll={{y: 500}}
              pagination={{pageSize: 20}}
              dataSource={personDataList}
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
              <FormItem label='员工编号' {...formItemLayout2}>
                {getFieldDecorator('user_id', {
                  rules: [{
                    required: true,
                    message: '必填',
                    whitespace: true
                  }],
                  initialValue: ''
                })(<Input/>)}
              </FormItem>
              <FormItem label='姓名' {...formItemLayout2}>
                {getFieldDecorator('user_name', {
                  rules: [{
                    required: true,
                    message: '必填',
                    whitespace: true
                  }],
                  initialValue: ''
                })(<Input/>)}
              </FormItem>
              <FormItem label='现任职务' {...formItemLayout}>
                {getFieldDecorator('post_name', {
                  rules: [{
                    required: true,
                    message: '必填',
                    whitespace: true
                  }],
                  initialValue: ''
                })(<Input/>)}
              </FormItem>
              <FormItem label='隶属群体' {...formItemLayout}>
                {getFieldDecorator('person_type', {
                  rules: [{
                    required: true,
                    message: '必填',
                    whitespace: true
                  }],
                  initialValue: '请选择隶属群体'
                })(<Select disabled={false}>
                  <Option value="0">单位班子成员</Option>
                  <Option value="1">单位中层人员</Option>
                  <Option value="2">其他</Option>
                </Select>)}
              </FormItem>
            </Form>

          </Modal>
          <Modal
            onOk={() => this.handleOKEdit()}
            onCancel={() => this.handleConcelEdit()}
            width={'40%'}
            visible={this.state.modalVisibleEdit}
            title={'编辑'}
          >

            <FormItem label='员工编号' {...formItemLayout2}>
              {getFieldDecorator('edit_user_id', {
                rules: [{
                  required: true,
                  message: '必填',
                  whitespace: true
                }],
                initialValue: this.state.edit_user_id
              })(<Input/>)}
            </FormItem>
            <FormItem label='姓名' {...formItemLayout2}>
              {getFieldDecorator('edit_user_name', {
                rules: [{
                  required: true,
                  message: '必填',
                  whitespace: true
                }],
                initialValue: this.state.edit_user_name
              })(<Input/>)}
            </FormItem>
            <FormItem label='现任职务' {...formItemLayout}>
              {getFieldDecorator('edit_post_name', {
                rules: [{
                  required: true,
                  message: '必填',
                  whitespace: true
                }],
                initialValue: this.state.edit_post_name
              })(<Input/>)}
            </FormItem>
            <FormItem label='隶属群体' {...formItemLayout}>
              {getFieldDecorator('edit_person_type', {
                rules: [{
                  required: true,
                  message: '必填',
                  whitespace: true
                }],
                initialValue: this.state.edit_person_type,
              })(
              <Select disabled={false}  style={{ width: '68%' }}>
                <Option value="0">单位班子成员</Option>
                <Option value="1">单位中层人员</Option>
                <Option value="2">其他</Option>
              </Select>
              )}
            </FormItem>
          </Modal>
        </div>
      </Spin>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.manageInfoModel,
    ...state.manageInfoModel
  };
}
personInfo = Form.create()(personInfo);
export default connect(mapStateToProps)(personInfo);

