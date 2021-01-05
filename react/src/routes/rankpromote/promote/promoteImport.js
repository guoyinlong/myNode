/**
 *  作者: 郭西杰
 *  创建日期: 2020-01-07
 *  邮箱：guoxj116@chinaunicom.cn
 *  文件说明：员工晋升晋档信息导入维护
 */
import React, { Component } from 'react';
import { connect } from "dva";
import { Button, Spin, Card, Col, Icon, DatePicker, Form, Input, message, Modal, Popconfirm, Row, Select, Table } from "antd";
import { routerRedux } from "dva/router";
import Cookie from "js-cookie";
import styles from './style.less';

import ExcelImportPromote from "../../rankpromote/promote/excelImportPromote";
import exportExl from "../../cost/exportExlForImportLabor";
import ExcelImportTalentInfo from "../../talent/excelImportTalentInfo";
import moment from 'moment';
const FormItem = Form.Item;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;

class promoteImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalVisibleEdit: false,
      isSaveClickable: true,
      isSuccess: false,
      personPromoteDataList: [],
      ou_name: Cookie.get("OU"),
      user_id: Cookie.get("userid"),
      dept_id: Cookie.get("dept_id"),
      //显示：1：导入显示，2：查询显示，默认是查询显示
      showTablesDataFlag: '2',
      saveFlag: true,
      text: '',
      visible: false,
      user_name: '',
      dept_name: '',
      year: '',
      join_time: '',
      edit_rank_sequence_before: '',
      edit_rank_grade_before: '',
      edit_rank_level_before: '',
      edit_rank_sequence: '',
      edit_rank_level: '',
      edit_rank_grade: '',
      edit_effective_time: '',
      edit_promotion_path: '',
      edit_talents_name: '',
      edit_new_user_path: '',
    }
  }

  //批量导入保存
  saveAction = () => {

  }

  handleDeptChange = (e) => {
    this.setState({
      dept_id: e,
    });

    let arg_param = {
      arg_dept_id: e,
      arg_ou_id: Cookie.get('OUID'),
      arg_text: this.state.text
    };
    const { dispatch } = this.props;
    dispatch({
      //全院级必修课保存
      type: 'promoteImportModel/PromoteSearch',
      arg_param: arg_param
    });
  };
  //更新状态
  updateVisible = (value) => {
  };

  // 点击导入按钮
  importTable = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/rankpromote/promoteimport/promoteImportData'
    }));
  }
  //模糊查询
  handleTextChange = (e) => {
    this.setState({
      text: e.target.value
    })
  };
  // 点击查询按钮
  queryPromote = () => {
    console.log("queryPromote");
    let arg_param = {
      arg_dept_id: this.state.dept_id,
      arg_ou_id: Cookie.get('OUID'),
      arg_text: this.state.text
    };
    const { dispatch } = this.props;
    dispatch({
      //全院级必修课保存
      type: 'promoteImportModel/PromoteSearch',
      arg_param: arg_param
    });
  }

  // 点击提交同步
  submitPromote = () => {
    let arg_param = {
      arg_year: new Date().getFullYear(),
    };
    const { dispatch } = this.props;
    dispatch({
      //全院级必修课保存
      type: 'promoteImportModel/PromoteSubmit',
      arg_param: arg_param
    });
  }
  // 删除
  deleteInfo = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'promoteImportModel/PromoteInfoDel',
      arg_param: record
    });
  };
  // 修改
  promoteUpdate = (modalType, record) => {
    if (modalType === 'edit') {
      this.setState({
        user_id: record.user_id,
        user_name: record.user_name,
        dept_name: record.dept_name,
        year: record.year,
        join_time: record.join_time,

        edit_rank_sequence_before: record.rank_sequence_before,
        edit_rank_grade_before: record.rank_grade_before,
        edit_rank_level_before: record.rank_level_before,
        edit_rank_sequence: record.rank_sequence,
        edit_rank_level: record.rank_level,
        edit_rank_grade: record.rank_grade,
        edit_effective_time: record.effective_time,
        edit_promotion_path: record.promotion_path,
        edit_talents_name: record.talents_name,
        edit_new_user_path: record.new_user_path,
      });
      this.setState({
        modalVisibleEdit: true
      });
    } else {
      this.setState({
        modalVisible: true
      });
    }
  };
  handleOKEdit = () => {
    let formData = this.props.form.getFieldsValue();
    let arg_param = {};
    arg_param['arg_user_id'] = this.state.user_id;
    arg_param['arg_user_name'] = this.state.user_name;
    arg_param['arg_rank_sequence_before'] = formData.edit_rank_sequence_before;
    arg_param['arg_rank_grade_before'] = formData.edit_rank_grade_before;
    arg_param['arg_rank_level_before'] = formData.edit_rank_level_before;
    arg_param['arg_rank_sequence'] = formData.edit_rank_sequence;
    arg_param['arg_rank_level'] = formData.edit_rank_level;
    arg_param['arg_rank_grade'] = formData.edit_rank_grade;
    arg_param['arg_effective_time'] = this.state.edit_effective_time;
    arg_param['arg_promotion_path'] = formData.edit_promotion_path;
    arg_param['arg_talents_name'] = formData.edit_talents_name;
    arg_param['arg_new_user_path'] = formData.edit_new_user_path;
    this.setState({
      modalVisibleEdit: false
    });
    if (arg_param['arg_user_id'] == '' || arg_param['arg_user_name'] == '' || arg_param['arg_effective_time'] == '' || arg_param['arg_talents_name'] == '' || arg_param['arg_new_user_path'] == '') {
      message.error("必填信息不能为空");
    } else {
      const { dispatch } = this.props;
      dispatch({
        type: 'promoteImportModel/PromoteInfoEdit',
        arg_param: arg_param
      });
    }
  };
  handleConcelEdit = () => {
    this.setState({
      modalVisibleEdit: false
    });
  };
  onChange2 = (date, dateString) => {
    this.setState({
      edit_effective_time: dateString
    });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  person_promote_columns = [
    { title: '序号', dataIndex: 'indexID', width: '80px', },
    { title: '员工编号', dataIndex: 'user_id', width: '100px' },
    { title: '姓名', dataIndex: 'user_name', width: '100px' },
    { title: '所属部门', dataIndex: 'dept_name', width: '150px' },
    { title: '入职日期', dataIndex: 'join_time', width: '150px' },
    { title: '晋升年份', dataIndex: 'year', width: '100px' },
    { title: '之前职级薪档', dataIndex: 'rank_sequence_before', width: '180px' },
    { title: '之前职级', dataIndex: 'rank_level_before', width: '90px' },
    { title: '之前薪档', dataIndex: 'rank_grade_before', width: '90px' },
    { title: '当前职级薪档', dataIndex: 'rank_sequence', width: '180px' },
    { title: '当前职级', dataIndex: 'rank_level', width: '90px' },
    { title: '当前薪档', dataIndex: 'rank_grade', width: '90px' },
    { title: '剩余积分', dataIndex: 'bonus_points', width: '90px' },
    { title: '生效日期', dataIndex: 'effective_time', width: '150px' },
    { title: '晋升路径', dataIndex: 'promotion_path', width: '240px' },
    { title: '是否走新员工晋级', dataIndex: 'new_user_path', width: '150px' },
    { title: '人才标识', dataIndex: 'talents_name', width: '100px' },
    {
      title: '操作', dataIndex: '', width: '200px',
      render: (text, record, index) => {
        return (
          <div>
            <Button
              type='primary'
              size='small'
              onClick={() => this.promoteUpdate('edit', record)}
            >{'修改'}
            </Button>
            &nbsp;&nbsp;&nbsp;
        <Popconfirm
              title="确定删除吗？"
              onConfirm={() => this.deleteInfo(record)}
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
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
      style: { marginBottom: 8 }
    };
    const formItemLayout2 = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
      style: { marginBottom: 8 }
    };
    const { ouList, deptList, searchPromoteDataList} = this.props;
    let ouOptionList = '';
    if (ouList.length) {
      ouOptionList = ouList.map(item =>
        <Option key={item.OU}>{item.OU}</Option>
      );
    };
    const auth_ou = Cookie.get("OU");
    let deptOptionList = '';
    if (deptList.length) {
      deptOptionList = deptList.map(item =>
        <Option key={item.court_dept_id}>{item.court_dept_name}</Option>
      );
    };
    const initdeptID = Cookie.get("dept_name");

    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h2>职级晋升信息导入维护</h2></Row>
        <br />
        <div style={{ marginBottom: '15px' }}>
          <span> 组织单元： </span>
          <Select style={{ width: 160 }} defaultValue={auth_ou} disabled={true}>
            {ouOptionList}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span> 部门： </span>
          <Select style={{ width: 160 }} defaultValue={initdeptID} onSelect={this.handleDeptChange}>
            <Option key='all'>全部</Option>
            {deptOptionList}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Input style={{ width: 200 }} placeholder="姓名/员工编号" onChange={this.handleTextChange} value={this.state.text} />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         <Button type="primary" onClick={this.importTable}>批量导入</Button>&nbsp;&nbsp;
             &nbsp;&nbsp;&nbsp;&nbsp;
         <a href="/filemanage/download/needlogin/hr/rank_temp.xlsx" ><Button >{'模板下载'}</Button></a>&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.queryPromote}>查询</Button>&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.submitPromote}>提交</Button>&nbsp;&nbsp;
          </div>
        <Table
          columns={this.person_promote_columns}
          dataSource={searchPromoteDataList}
          pagination={false}
          scroll={{ x: 2330, y: 450 }}
          bordered={true}
          className={styles.tableStyle}
        />

        <Modal
          onOk={() => this.handleOKEdit()}
          onCancel={() => this.handleConcelEdit()}
          width={'600px'}
          visible={this.state.modalVisibleEdit}
          title={'编辑'}
        >
          <FormItem label='员工编号' {...formItemLayout2} >
            {getFieldDecorator('user_id', {
              rules: [{
                required: true,
                message: '必填',
                whitespace: true,
                disabled: true
              }],
              initialValue: this.state.user_id
            })(<Input disabled={true} />)}
          </FormItem>
          <FormItem label='姓名' {...formItemLayout2}>
            {getFieldDecorator('user_name', {
              rules: [{
                required: true,
                message: '必填',
                whitespace: true
              }],
              initialValue: this.state.user_name
            })(<Input disabled={true} />)}
          </FormItem>

          <FormItem label='所属部门' {...formItemLayout2}>
            {getFieldDecorator('dept_name', {
              rules: [{
                required: true,
                message: '必填',
                whitespace: true
              }],
              initialValue: this.state.dept_name
            })(<Input disabled={true} />)}
          </FormItem>
          <FormItem label='之前职级薪档' {...formItemLayout}>
            {getFieldDecorator('edit_rank_sequence_before', {
              rules: [{
                required: true,
                message: '必填',
                whitespace: true
              }],
              initialValue: this.state.edit_rank_sequence_before
            })(<Input />)}
          </FormItem>
          <FormItem label='之前职级' {...formItemLayout}>
            {getFieldDecorator('edit_rank_level_before', {
              rules: [{
                required: true,
                message: '必填',
                whitespace: true
              }],
              initialValue: this.state.edit_rank_level_before
            })(<Select disabled={false} style={{ width: '68%' }}>
              <Option value="T1.1">T1.1</Option>
              <Option value="T1.2">T1.2</Option>
              <Option value="T1.3">T1.3</Option>
              <Option value="T2.1">T2.1</Option>
              <Option value="T2.2">T2.2</Option>
              <Option value="T2.3">T2.3</Option>
            </Select>)}
          </FormItem>
          <FormItem label='当前薪档' {...formItemLayout}>
            {getFieldDecorator('edit_rank_grade_before', {
              rules: [{
                required: true,
                message: '必填',
                whitespace: true
              }],
              initialValue: this.state.edit_rank_grade_before
            })(<Select disabled={false} style={{ width: '68%' }}>
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
            </Select>)}
          </FormItem>
          <FormItem label='当前职级薪档' {...formItemLayout}>
            {getFieldDecorator('edit_rank_sequence', {
              rules: [{
                required: true,
                message: '必填',
                whitespace: true
              }],
              initialValue: this.state.edit_rank_sequence
            })(<Input />)}
          </FormItem>
          <FormItem label='当前职级' {...formItemLayout}>
            {getFieldDecorator('edit_rank_level', {
              rules: [{
                required: true,
                message: '必填',
                whitespace: true
              }],
              initialValue: this.state.edit_rank_level
            })(<Select disabled={false} style={{ width: '68%' }}>
              <Option value="T1.1">T1.1</Option>
              <Option value="T1.2">T1.2</Option>
              <Option value="T1.3">T1.3</Option>
              <Option value="T2.1">T2.1</Option>
              <Option value="T2.2">T2.2</Option>
              <Option value="T2.3">T2.3</Option>
            </Select>)}
          </FormItem>
          <FormItem label='当前薪档' {...formItemLayout}>
            {getFieldDecorator('edit_rank_grade', {
              rules: [{
                required: true,
                message: '必填',
                whitespace: true
              }],
              initialValue: this.state.edit_rank_grade
            })(<Select disabled={false} style={{ width: '68%' }}>
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
            </Select>)}
          </FormItem>
          <FormItem label='生效日期' {...formItemLayout}>
            <DatePicker value={moment(this.state.edit_effective_time, dateFormat)} format={dateFormat} onChange={this.onChange2} />
          </FormItem>
          <FormItem label='晋升路径' {...formItemLayout}>
            {getFieldDecorator('edit_promotion_path', {
              rules: [{
                required: true,
                message: '必填',
                whitespace: true
              }],
              initialValue: this.state.edit_promotion_path
            })(<Select disabled={false} style={{ width: '68%' }}>
              <Option value="应用绩效积分等调整薪档">应用绩效积分等调整薪档</Option>
              <Option value="专业序列员工低于岗位职级带宽下限快速晋级">专业序列员工低于岗位职级带宽下限快速晋级</Option>
              <Option value="专业序列员工岗位职级带宽内常速晋级">专业序列员工岗位职级带宽内常速晋级</Option>
              <Option value="专业序列员工薪档达D/G档后晋级">专业序列员工薪档达D/G档后晋级</Option>
              <Option value="管理人员低于岗位职级带宽下限快速晋级">管理人员低于岗位职级带宽下限快速晋级</Option>
              <Option value="管理人员岗位职级带宽内常速晋级">管理人员岗位职级带宽内常速晋级</Option>
              <Option value="长期突出贡献管理人员晋级">长期突出贡献管理人员晋级</Option>
              <Option value="成为领军、专家或骨干人才快速晋级/G档后晋级">成为领军、专家或骨干人才快速晋级/G档后晋级</Option>
              <Option value="聘任至更高级岗位">聘任至更高级岗位</Option>
            </Select>)}
          </FormItem>
          <FormItem label='人才标识' {...formItemLayout}>
            {getFieldDecorator('edit_talents_name', {
              rules: [{
                required: true,
                message: '必填',
                whitespace: true
              }],
              initialValue: this.state.edit_talents_name
            })(<Select disabled={false} style={{ width: '68%' }}>
              <Option value="普通员工">普通员工</Option>
              <Option value="新锐人才">新锐人才</Option>
              <Option value="骨干人才">骨干人才</Option>
              <Option value="专家人才">专家人才</Option>
              <Option value="领军人才">领军人才</Option>
            </Select>)}
          </FormItem>
          <FormItem label='是否走新员工晋级' {...formItemLayout}>
            {getFieldDecorator('edit_new_user_path', {
              rules: [{
                required: true,
                message: '必填',
                whitespace: true
              }],
              initialValue: this.state.edit_new_user_path
            })(<Select disabled={false} style={{ width: '68%' }}>
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>)}
          </FormItem>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.promoteImportModel,
    ...state.promoteImportModel
  };
}

promoteImport = Form.create()(promoteImport);
export default connect(mapStateToProps)(promoteImport);
