/*
 * 作者：王福江
 * 创建日期：2019-11-13
 * 邮件：wangfj80@chinaunicom.cn
 * 文件说明：干部信息管理
 */
import React from 'react';
import {connect} from 'dva';
import { Table, Spin, Modal, Form, Popconfirm, Button, Input, Icon } from 'antd';
import styles from './style.less';
import { DatePicker } from 'antd';
import message from "../../components/commonApp/message";
import moment from 'moment';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';

class cadreInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalVisibleEdit: false,
      add_recognation_time: '',
      add_birth: '',
      edit_id: '',
      edit_user_id: '',
      edit_user_name: '',
      edit_before_post: '',
      edit_now_post: '',
      edit_recognation_time: '',
      edit_birth: '',
    }
  }
  columns = [
    { title: '序号', dataIndex: 'indexID',width: '4%'},
    { title: '姓名', dataIndex: 'user_name' ,width: '8%'},
    { title: '组织机构', dataIndex: 'ou_name' ,width: '11%'},
    { title: '出生日期', dataIndex: 'birth' ,width: '10%'},
    { title: '原任单位及职务', dataIndex: 'before_post' ,width: '12%'},
    { title: '现任单位及职务', dataIndex: 'now_post' ,width: '12%'},
    { title: '任职日期', dataIndex: 'recognation_time' ,width: '10%'},
    { title: '状态', dataIndex: '' ,width: '10%',
      render: (text, record, index) => {
        if(record.state==='1'){
          return (
            <span>未首次评议</span>
          );
        }else if(record.state==='11'){
          return (
            <span>首次评议进行中</span>
          );
        }else if(record.state==='2'){
          return (
            <span>未复评</span>
          );
        }else if(record.state==='22'){
          return (
            <span>复评进行中</span>
          );
        }else if(record.state==='3'){
          return (
            <span>评议完成</span>
          );
        }
      }
    },
    { title: '操作', dataIndex: '', width: '18%',
      render: (text, record) => {
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
        edit_id: record.id,
        edit_user_id: record.user_id,
        edit_user_name: record.user_name,
        edit_before_post: record.before_post,
        edit_now_post: record.now_post,
        edit_recognation_time: record.recognation_time,
        edit_birth: record.birth
      });
      this.setState({
        modalVisibleEdit: true
      });
    }else{
      this.setState({
        modalVisible: true
      });
    }
  };
  deleteInfo = (record) => {
    //console.log("record==="+JSON.stringify(record));
    const {dispatch} = this.props;
    dispatch({
      type: 'manageInfoModel/deleteCadreInfo',
      arg_param: record
    });
  };
  freshButton = () => {
    //刷新
    const {dispatch} = this.props;
    dispatch({
      type: 'manageInfoModel/initCadreQuery'
    });
  };
  handleConcel = () => {
    this.setState({
      modalVisible: false
    });
  };
  handleOK = () => {
    //console.log("handleOK");
    let formData = this.props.form.getFieldsValue();
    let arg_param = {};
    arg_param['arg_cadre_id'] = formData.user_id + Number(Math.random().toString().substr(3,7) + Date.now()).toString(32);;
    arg_param['arg_user_id'] = formData.user_id;
    arg_param['arg_user_name'] = formData.user_name;
    arg_param['arg_before_post'] = formData.before_post;
    arg_param['arg_now_post'] = formData.now_post;
    arg_param['arg_recognation_time'] = formData.recognation_time.format("YYYY-MM-DD");
    arg_param['arg_birth'] = formData.birth_data.format("YYYY-MM-DD");
    this.setState({
      modalVisible: false
    });
    if(arg_param['arg_cadre_id']===''|| arg_param['arg_user_id']===''||arg_param['arg_user_name']===''||arg_param['arg_before_post']===''||arg_param['arg_now_post']===''||arg_param['arg_recognation_time']===''||arg_param['arg_birth']===''){
      message.error("必填信息不能为空");
    }else{
      const {dispatch} = this.props;
      dispatch({
        type: 'manageInfoModel/addCadreInfo',
        arg_param: arg_param
      });
    }
    this.props.form.resetFields(['user_id','user_name','before_post','now_post','birth_data','recognation_time'],[]);
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
    arg_param['arg_before_post'] = formData.edit_before_post;
    arg_param['arg_now_post'] = formData.edit_now_post;
    arg_param['arg_recognation_time'] = this.state.edit_recognation_time;
    arg_param['arg_birth'] = this.state.edit_birth;
    this.setState({
      modalVisibleEdit: false
    });
    if(arg_param['arg_user_id']===''||arg_param['arg_user_name']===''||arg_param['arg_before_post']===''||arg_param['arg_now_post']===''||arg_param['arg_recognation_time']===''||arg_param['arg_birth']===''){
      message.error("必填信息不能为空");
    }else{
      const {dispatch} = this.props;
      dispatch({
        type: 'manageInfoModel/updateCadreInfo',
        arg_param: arg_param
      });
    }
  };
  onChange = (date, dateString) => {
    this.setState({
      add_recognation_time: dateString
    });
  };
  onChange2 = (date, dateString) => {
    this.setState({
      edit_recognation_time: dateString
    });
  };
  onChangeBirth = (date, dateString) => {
    this.setState({
      add_birth: dateString
    });
  };
  onChangeBirth2 = (date, dateString) => {
    this.setState({
      edit_birth: dateString
    });
  };

  render() {
    const { cadreDataList } = this.props;
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
    return(
      <Spin tip={'加载中…'} spinning={this.props.loading}>
        <div style={{padding: '13px 15px 16px 15px', background: 'white'}}>
          <div>
            <Button  type='primary' onClick={() => this.setModalVisible('add')}>
              新增
            </Button>
            &nbsp;&nbsp;
            <span>
                <span>总共有 </span>
                <span style={{color: 'red', fontWeigh: 'bold'}}>{cadreDataList.length}</span>
                <span> 条</span>
            </span>
            <span style={{float:'right'}}>
                <Button onClick={this.freshButton} type='primary'>
                    <Icon type="reload" />{'刷新'}
                </Button>
            </span>
          </div>
          <div style={{marginTop: 4}}>
            <Table
              scroll={{y: 500 }}
              pagination={{ pageSize: 20 }}
              dataSource={cadreDataList}
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
              <FormItem label='出生日期' {...formItemLayout}>               
              {getFieldDecorator('birth_data', {
                  initialValue:'',
                  rules: [{
                    required: true,
                    message: '请选择出生日期',
                  }],
                // })(<DatePicker onChange={this.onChangeBirth.bind(this)} />)}                
                })(                
                  <DatePicker
                    placeholder="出生日期"
                    style={{ width: '100%' }}
                    getPopupContainer={trigger => trigger.parentNode}
                    disabled={false}
                  />
                )}                
              </FormItem>
              <FormItem label='原任单位及职务' {...formItemLayout}>
                {getFieldDecorator('before_post', {
                  rules: [{
                    required: true,
                    message: '必填',
                    whitespace: true
                  }],
                  initialValue: ''
                })(<Input/>)}
              </FormItem>
              <FormItem label='现任单位及职务' {...formItemLayout}>
                {getFieldDecorator('now_post', {
                  rules: [{
                  required: true,
                  message: '必填',
                  whitespace: true
                }],
                  initialValue: ''
                })(<Input/>)}
              </FormItem>
              
              <FormItem label='任职日期' {...formItemLayout}>
              {getFieldDecorator('recognation_time', {
                  initialValue:'',
                  rules: [{
                    required: true,
                    message: '任职日期',
                  }],
                // })(<DatePicker onChange={this.onChangeBirth.bind(this)} />)}                
                })(                
                  <DatePicker
                    placeholder="任职日期"
                    style={{ width: '100%' }}
                    getPopupContainer={trigger => trigger.parentNode}
                    disabled={false}
                  />
                )}                  
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
                initialValue:  this.state.edit_user_name
              })(<Input/>)}
            </FormItem>
            <FormItem label='出生日期' {...formItemLayout}>
              <DatePicker  value={moment(this.state.edit_birth, dateFormat)} format={dateFormat} onChange={this.onChangeBirth2} />
            </FormItem>
            <FormItem label='原任单位及职务' {...formItemLayout}>
              {getFieldDecorator('edit_before_post', {
                rules: [{
                  required: true,
                  message: '必填',
                  whitespace: true
                }],
                initialValue: this.state.edit_before_post
              })(<Input/>)}
            </FormItem>
            <FormItem label='现任单位及职务' {...formItemLayout}>
              {getFieldDecorator('edit_now_post', {
                rules: [{
                  required: true,
                  message: '必填',
                  whitespace: true
                }],
                initialValue: this.state.edit_now_post
              })(<Input/>)}
            </FormItem>
            <FormItem label='任职日期' {...formItemLayout}>
              <DatePicker  value={moment(this.state.edit_recognation_time, dateFormat)} format={dateFormat} onChange={this.onChange2} />
            </FormItem>
          </Modal>
        </div>
      </Spin>
    )
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.manageInfoModel,
    ...state.manageInfoModel
  };
}
cadreInfo = Form.create()(cadreInfo);
export default connect(mapStateToProps)(cadreInfo);
