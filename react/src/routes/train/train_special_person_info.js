/**
 * 文件说明：特殊人群设置
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-02-20
 **/
import React, { Component } from 'react';
import { Table, Input, Icon, message, Row, Button, Modal, Form, Select, DatePicker, Popconfirm, Tree } from 'antd';
import { connect } from "dva";
import Cookie from "js-cookie";
const { TextArea } = Input;
const { TreeNode } = Tree;
import styles from "../appraise/style.less";
import ExcelImportPersonGrade from "./ExcelImportSpecialPerson";
const FormItem = Form.Item;

class train_special_person_info extends Component {
  constructor(props) {
    super(props);
    let ou_id = Cookie.get('OUID');
    this.state = {
      ou_id: ou_id,
      personString: '',
      selectPersonString: '',
      personList: [],
      modalVisible: false,
      modalVisible2: false,
      modalVisibleEdit: false,
      trainSettingsGroupSource: [],
      personVisible: false,
      indexValue: 0,
      submitFlag: true,
      //预算
      budgetValue: 0,
      //提交弹窗,下一步
      nextVisible: false,
      nextStep: '',
      importDataList: []
    }
  };
  train_special_settings_columns = [
    { title: '序号', dataIndex: 'indexID', width: '8%' },
    { title: '特定群体名称', dataIndex: 'train_group', width: '20%' },
    { title: '特定群体人员', dataIndex: 'train_person', width: '32%' },
    { title: '特定群体类型', dataIndex: 'remake', width: '20%' },
    {
      title: '操作', dataIndex: '', width: '20%',
      render: (text, record) => {
        return (
          <div>
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
  setModalVisible = (modalType, record) => {
    if (modalType === 'edit') {
      this.setState({
        edit_id: record.id,
        edit_train_group: record.train_group,
        edit_train_person: record.train_person,
        edit_remark: record.remark,
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
  setModalVisible2 = () => {
    this.setState({
      modalVisible2: true
    });
  }
  freshButton = () => {
    //刷新
    const { dispatch } = this.props;
    dispatch({
      type: 'trainSpecialPersonModel/initQuery'
    });
  };
  handleConcel = () => {
    this.setState({
      modalVisible: false
    });
  };
  handleConcel2 = () => {
    this.setState({
      modalVisible2: false
    });
  };
  handleOK = () => {
    let arg_train_manage_id = Cookie.get('userid') + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    let basicOutPlanApplyPersonData = [];
    basicOutPlanApplyPersonData = this.state.personList;
    let formData = this.props.form.getFieldsValue();
    let arg_param = {};
    arg_param['arg_train_manage_id'] = arg_train_manage_id;
    arg_param['arg_train_group'] = formData.train_group;
    arg_param['arg_remark'] = formData.remark;
    arg_param['arg_ou_id'] = this.state.ou_id;
    this.setState({
      modalVisible: false
    });
    if (arg_param['arg_train_group'] === '' || arg_param['arg_train_person'] === '' || arg_param['arg_ou_id'] === '') {
      message.error("必填信息不能为空");
    } else {
      const { dispatch } = this.props;
      dispatch({
        type: 'trainSpecialPersonModel/groupPersonAdd',
        arg_param: arg_param,
        basicOutPlanApplyPersonData
      });
    }
    this.props.form.resetFields(['train_group', 'remark'], []);
    this.setState({
      selectPersonString: []
    });

  };
  handleOK2 = () => {
    let arg_train_manage_id = Cookie.get('userid') + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    let importDataList = this.state.importDataList;
    let formData = this.props.form.getFieldsValue();
    let arg_param = {};
    arg_param['arg_train_manage_id'] = arg_train_manage_id;
    arg_param['arg_train_group'] = formData.train_group;
    arg_param['arg_remark'] = formData.remark;
    arg_param['arg_ou_id'] = this.state.ou_id;
    this.setState({
      modalVisible: false
    });
    const { dispatch } = this.props;
    this.setState({
      modalVisible2: false
    });
    dispatch({
      type: 'trainSpecialPersonModel/groupPersonImport',
      arg_param: arg_param,
      importDataList
    });
    this.setState({
      modalVisible2: false
    });
  };
  deleteInfo = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'trainSpecialPersonModel/groupPersonDel',
      arg_param: record
    });
  };
  //选择参与人员确定
  handlePersonOk = () => {
    this.setState({
      selectPersonString: this.state.personString,
      personVisible: false,
    });
  };
  //选择参与人员结束
  handlePersonCancel = () => {
    this.setState({
      personVisible: false,
    });
  };
  //添加选择人员
  onCheck = (checkedKeys, info) => {
    this.setState({
      personList: [],
    });
    let selperson = '';
    let personListTemp = [];
    for (let i = 0; i < info.checkedNodes.length; i++) {
      if (info.checkedNodes[i].props.children === null || info.checkedNodes[i].props.children === '' || info.checkedNodes[i].props.children === undefined) {
        let person = { personname: info.checkedNodes[i].props.title.split('-')[1] };
        personListTemp.push(person);
        selperson = selperson + '  (' + (i + 1) + ')' + info.checkedNodes[i].props.title;
      }
    }
    this.setState({
      personList: personListTemp,
    })
    this.state.personString = selperson;

  };
  //选择参加人员，多选，人员数据为本院，按照部门展示
  personChange = () => {
    this.setState({
      personVisible: true,
    });
  };
  person_import_columns = [
    { title: '序号', dataIndex: 'index_id' },
    { title: '特定群体名称', dataIndex: 'train_group' },
    { title: '用户名', dataIndex: 'user_name' },
    { title: '工号', dataIndex: 'user_id' },
    { title: '特定群体类型', dataIndex: 'remake' },
  ];
  //导入成绩更新状态
  updateVisible = (value) => {
    if (value) {
      //导入认证考试成绩显示
      const importPersonDataList = this.props.importPersonDataList;
      if (!importPersonDataList) {
        message.error("请检查录入的信息是否有误");
      } else {
        this.setState({
          importDataList: importPersonDataList,
        });
      }
    }
  }
  render() {
    const { queryDataList } = this.props;
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
    const { person_list } = this.props;
    let personListDate = [];

    if (person_list && person_list.length) {
      personListDate.push(person_list.map(item => {
        let deptdate;
        if (item.tree_num === '0' || item.tree_num === 0) {
          deptdate = item.list.map(item2 => {
            let personlistdate;
            if (item2.tree_num === '1' || item2.tree_num === 1) {
              personlistdate = item2.list.map(item3 => {
                return (<TreeNode title={item3.key_name} key={item3.key_num} />)
              })
            }
            return (
              <TreeNode title={item2.key_name} key={item2.key_num}>
                {personlistdate}
              </TreeNode>
            )
          })
        }
        return (
          <TreeNode title={item.key_name} key={item.key_num}>
            {deptdate}
          </TreeNode>
        )
      }
      ));
    }
    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>培训特定人群维护</h1></Row>
        <br />
        <div>
          <Button type='primary' onClick={() => this.setModalVisible('add')}>
            新增
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type='primary' onClick={() => this.setModalVisible2('add')}>
            批量导入
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="/filemanage/download/needlogin/hr/training_special_person.xlsx" ><Button type='primary'>{'模板下载'}</Button></a>

          <span style={{ float: 'right' }}>
            <Button onClick={this.freshButton} type='primary'>
              <Icon type="reload" />{'刷新'}
            </Button>
          </span>
        </div>
        <div style={{ marginTop: 4 }}>
          <Table
            pagination={{ pageSize: 20 }}
            dataSource={queryDataList}
            columns={this.train_special_settings_columns}
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
            <FormItem label='培训特定群体' {...formItemLayout2}>
              {getFieldDecorator('train_group', {
                rules: [{
                  required: true,
                  message: '必填',
                  whitespace: true
                }],
                initialValue: ''
              })(<Input />)}
            </FormItem>
            <FormItem label="培训人员：" hasFeedback {...formItemLayout}>
              <TextArea
                style={{ minHeight: 32 }}
                value={this.state.selectPersonString}
                autosize={{ maxRows: 10 }}
                onClick={this.personChange}
              />
            </FormItem>
            <FormItem label="群体设置类型" {...formItemLayout2}>
              {getFieldDecorator('remark', {
                rules: [{
                  required: true,
                  message: '群体设置类型是必选项'
                }],
              })
                (<Select>
                  <Select.Option value="培训任务设定">培训任务设定</Select.Option>
                  <Select.Option value="统计查询">统计查询</Select.Option>
                  <Select.Option value="必修课人员名单">必修课人员名单</Select.Option>
                </Select>)}
            </FormItem>
          </Form>
        </Modal>

        <Modal
          onOk={() => this.handleOK2()}
          onCancel={() => this.handleConcel2()}
          width={'600px'}
          visible={this.state.modalVisible2}
          title={'导入'}
        >
          <Row style={{ textAlign: 'center' }}>
            <ExcelImportPersonGrade dispatch={this.props.dispatch} updateVisible={this.updateVisible} importType={this.state.train_import_type} />
          </Row>
          <Table
            columns={this.person_import_columns}
            dataSource={this.state.importDataList}
            pagination={true}
            //scroll={{x: '100%', y: 500}}
            width={'100%'}
            bordered={true}
          />
        </Modal>

        <Modal
          title="选择人员"
          visible={this.state.personVisible}
          onOk={this.handlePersonOk}
          onCancel={this.handlePersonCancel}
        >
          <Tree
            checkable
            onCheck={this.onCheck}
          >
            {personListDate}
          </Tree>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.trainSpecialPersonModel,
    ...state.trainSpecialPersonModel
  };
}
train_special_person_info = Form.create()(train_special_person_info);
export default connect(mapStateToProps)(train_special_person_info);


