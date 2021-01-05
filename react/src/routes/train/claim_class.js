/**
 * 文件说明：培训管理-分院认领全院级（必修课）培训计划
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-07-09
 **/

import React, { Component } from 'react';
import { connect } from "dva";
import { Button, Card, Form, message, Row, Table, Select, Input } from "antd";
import { routerRedux } from "dva/router";
import Cookie from "js-cookie";

const { Option } = Select;
const FormItem = Form.Item;

class Claim_class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaveClickable: true,
      classType: 'compulsory',
      year: new Date().getFullYear(),
      //分院落地部门
      tempCourtDate: [],
      //分院落地费用预算
      tempTrainFeeData: [],
      claimFeeFlag: false,
      indexValue: 0,
      classCompulsoryDataList: [],
      classElectiveDataList: [],
      classCommonDataList: [],
    };
  }

  //结束关闭
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_index'
    }));
  };

  //培训计划批量导入保存
  saveAction = () => {
    this.setState({ isSaveClickable: false });
    const { dispatch } = this.props;
    this.props.form.validateFields((err) => {
      if (err) {
        message.error("请选择所有课程在本院的落地部门及培训落地预算！");
        this.setState({ isSaveClickable: true });
      } else {
        const tempCourtDate = this.state.tempCourtDate;
        const trainFeeDate = this.state.tempTrainFeeData;//this.state.tempTrainFeeData
        console.log(trainFeeDate);

        const class_type = this.state.classType;
        return new Promise((resolve) => {
          dispatch({
            //全院级、通用落地保存
            type: 'train_create_model/centerClassResolution',
            tempCourtDate,
            trainFeeDate,
            class_type,
            resolve
          });
        }).then((resolve) => {
          if (resolve === 'success') {
            this.setState({ isSaveClickable: true });
            this.setState({
              claimFeeFlag: false
            });
            setTimeout(() => {
              dispatch(routerRedux.push({
                pathname: '/humanApp/train/trainPlanAndImport/claim_class'
              }));
            }, 500);
          }
          if (resolve === 'false') {
            this.setState({ isSaveClickable: true });
          }
        }).catch(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/trainPlanAndImport/claim_class'
          }));
        });
      }
    });
  };

  //选择课程类型
  handleClassChange = (value, indexID) => {
    this.setState({
      classType: value
    });
  };

  //选择年份
  handleYearChange = (value) => {
    this.setState({
      year: value
    })
  };

  //查询全院级计划
  queryClass = () => {
    const { dispatch } = this.props;
    let param = {
      year: this.state.year,
      class_type: this.state.classType
    };

    return new Promise((resolve) => {
      dispatch({
        //全院级必修课保存
        type: 'train_create_model/centerClassQuery',
        param,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        if (param.class_type === 'compulsory') {
          this.setState({
            classCompulsoryDataList: this.props.classDataList,
            classElectiveDataList: [],
            classCommonDataList: [],
          });
        }
        if (param.class_type === 'elective') {
          this.setState({
            classCompulsoryDataList: [],
            classElectiveDataList: this.props.classDataList,
            classCommonDataList: [],
          });
        }
        if (param.class_type === 'common') {
          this.setState({
            classCompulsoryDataList: [],
            classElectiveDataList: [],
            classCommonDataList: this.props.classDataList,
          });
        }
      }
      if (resolve === 'false') {
        error.message('该年度课程已经全部落地到本院');
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/trainPlanAndImport/claim_class'
      }));
    });

  };

  //修改分院部门
  itemSelect(value, value1) {
    let tempData = this.props.classDataList;
    let train_class_id = value.train_class_id;
    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i].train_class_id === train_class_id) {
        tempData[i].court_dept = value1;
        break;
      }
    }
    this.setState({
      tempCourtDate: tempData
    });
  };

  //如果预算是第一次修改，则可以提交，如果是已经修改了，则不允许修改
  itemInpt(record, e) {
    console.log(e.target.value);
    this.setState({
      claimFeeFlag: true
    });
    let tempData = this.props.classDataList;
    let train_class_id = record.train_class_id;
    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i].train_class_id === train_class_id) {
        tempData[i].claim_train_fee = e.target.value;
        break;
      }
    }
    this.setState({
      tempTrainFeeData: tempData
    });
  };

  class_columns_compulsory = [
    { title: '序号', dataIndex: 'indexID', width: '5%', },
    { title: '培训级别', dataIndex: 'train_level', width: '10%' },
    { title: '培训班名称/课程方向', dataIndex: 'class_name', width: '12%' },
    { title: '受训部门/岗位', dataIndex: 'train_person', width: '10%' },
    { title: '培训类型', dataIndex: 'train_kind', width: '13%' },
    { title: '计划培训时间', dataIndex: 'train_time', width: '10%' },
    { title: '责任部门', dataIndex: 'center_dept', width: '10%' },
    {
      title: '分院主责部门', dataIndex: 'court_dept', width: '10%', key: 'court_department',
      render: (text, record, index) => {
        const { form: { getFieldDecorator } } = this.props;
        const formItemLayout = {
          labelCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 9
            }
          },
          wrapperCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 24
            }
          },
          style: { marginBottom: 10 }
        };
        //选择落地部门
        let courtDeptDataList = this.props.courtDeptDataList;
        let courtDeptName = '';

        if (courtDeptDataList !== undefined) {
          courtDeptName = courtDeptDataList.map(item =>
            <Option value={item.court_dept_id}>{item.court_dept_name}</Option>
          );
        }
        return (
          <Form>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('court_dept' + record.key, {
                initialValue: record.court_dept,
                rules: [
                  {
                    required: true,
                    message: '请选择本院落地部门!'
                  },
                ],
              })(
                <Select style={{ width: '100%' }} id={index} onSelect={this.itemSelect.bind(this, record)} >
                  {courtDeptName}
                </Select>
              )}
            </FormItem>
          </Form>
        );
      }
    },
    { title: '原费用预算（元）', dataIndex: 'train_fee', width: '10%' },
    {
      title: '落地费用预算', dataIndex: 'claim_train_fee', width: '10%', key: 'claimTrainFee',
      render: (text, record, index) => {
        const { form: { getFieldDecorator } } = this.props;
        const formItemLayout = {
          labelCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 9
            }
          },
          wrapperCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 24
            }
          },
          style: { marginBottom: 10 }
        };
        return (
          <Form>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('claim_train_fee' + record.key + 'compulsory', {
                initialValue: record.claim_train_fee,
                rules: [
                  {
                    required: true,
                    pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
                    message: '0或最多2位小数-元'
                  },
                ],
              })(
                <Input placeholder="落地一次，再次走调整" style={{ color: '#000' }} name="claim_train_fee" id={index} onChange={this.itemInpt.bind(this, record)} disabled={(!this.state.claimFeeFlag && record.claim_train_fee) ? true : false} />
              )}
            </FormItem>
          </Form>
        );
      }
    },
  ];
  class_columns_elective = [
    { title: '序号', dataIndex: 'indexID', width: '10%' },
    { title: '培训级别', dataIndex: 'train_level', width: '10%' },
    { title: '课程级别', dataIndex: 'class_level', width: '10%' },
    { title: '培训班名称/课程方向', dataIndex: 'class_name', width: '12%' },
    { title: '受训部门/岗位', dataIndex: 'train_person', width: '10%' },
    { title: '培训类型', dataIndex: 'train_kind', width: '10%' },
    { title: '责任部门', dataIndex: 'center_dept', width: '10%' },
    {
      title: '分院主责部门', dataIndex: 'court_dept', width: '10%', key: 'court_department',
      render: (text, record) => {
        const { form: { getFieldDecorator } } = this.props;
        const formItemLayout = {
          labelCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 9
            }
          },
          wrapperCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 24
            }
          },
          style: { marginBottom: 10 }
        };
        //选择落地部门
        let courtDeptDataList = this.props.courtDeptDataList;
        let courtDeptName = '';
        if (courtDeptDataList !== undefined) {
          courtDeptName = courtDeptDataList.map(item =>
            <Option value={item.court_dept_id}>{item.court_dept_name}</Option>
          );
        }
        return (
          <Form>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('court_dept' + record.key + record.indexID, {
                initialValue: record.court_dept,
                rules: [
                  {
                    required: true,
                    message: '请填写本院落地部门!'
                  },
                ],
              })(
                <Select style={{ width: '100%' }} onSelect={this.itemSelect.bind(this, record)}>
                  {courtDeptName}
                </Select>
              )}
            </FormItem>
          </Form>
        );
      }
    },
    { title: '原费用预算（元）', dataIndex: 'train_fee', width: '10%' },
    {
      title: '落地费用预算', dataIndex: 'claim_train_fee', width: '10%', key: 'claimTrainFee',
      render: (text, record, index) => {
        const { form: { getFieldDecorator } } = this.props;
        const formItemLayout = {
          labelCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 9
            }
          },
          wrapperCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 24
            }
          },
          style: { marginBottom: 10 }
        };
        return (
          <Form>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('claim_train_fee' + record.key + 'elective', {
                initialValue: record.claim_train_fee,
                rules: [
                  {
                    required: true,
                    pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
                    message: '0或最多2位小数-元'
                  },
                ],
              })(
                <Input placeholder="落地一次，再次走调整" style={{ color: '#000' }} name="claim_train_fee" id={index} onChange={this.itemInpt.bind(this, record)} disabled={(!this.state.claimFeeFlag && record.claim_train_fee) ? true : false} />
              )}
            </FormItem>
          </Form>
        );
      }
    },
  ];
  class_columns_common = [
    { title: '序号', dataIndex: 'indexID', width: '10%' },
    { title: '培训级别', dataIndex: 'train_level', width: '10%' },
    { title: '课程级别', dataIndex: 'class_level', width: '15%' },
    { title: '培训班名称/课程方向', dataIndex: 'class_name', width: '10%' },
    { title: '培训类型', dataIndex: 'train_kind', width: '15%' },
    { title: '责任部门', dataIndex: 'center_dept', width: '10%' },
    {
      title: '分院主责部门', dataIndex: 'court_dept', width: '10%', key: 'court_department',
      render: (text, record) => {
        const formItemLayout = {
          labelCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 9
            }
          },
          wrapperCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 24
            }
          },
          style: { marginBottom: 10 }
        };
        const { form: { getFieldDecorator } } = this.props;
        //选择落地部门
        let courtDeptDataList = this.props.courtDeptDataList;
        let courtDeptName = '';
        if (courtDeptDataList !== undefined) {
          courtDeptName = courtDeptDataList.map(item =>
            <Option value={item.court_dept_id}>{item.court_dept_name}</Option>
          );
        }
        return (
          <Form>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('court_dept' + record.key + record.indexID, {
                initialValue: record.court_dept,
                rules: [
                  {
                    required: true,
                    message: '请填写本院落地部门!'
                  },
                ],
              })(
                <Select style={{ width: '100%' }} onSelect={this.itemSelect.bind(this, record)}>
                  {courtDeptName}
                </Select>
              )}
            </FormItem>
          </Form>
        );
      }
    },
    { title: '原费用预算（元）', dataIndex: 'train_fee', width: '10%' },
    {
      title: '落地费用预算', dataIndex: 'claim_train_fee', width: '10%', key: 'claimTrainFee',
      render: (text, record, index) => {
        const { form: { getFieldDecorator } } = this.props;
        const formItemLayout = {
          labelCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 9
            }
          },
          wrapperCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 24
            }
          },
          style: { marginBottom: 10 }
        };
        return (
          <Form>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('claim_train_fee' + record.key + 'common', {
                initialValue: record.claim_train_fee,
                rules: [
                  {
                    required: true,
                    pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
                    message: '0或最多2位小数-元'
                  },
                ],
              })(
                <Input placeholder="落地一次，再次走调整" style={{ color: '#000' }} name="claim_train_fee" id={index} onChange={this.itemInpt.bind(this, record)} disabled={(!this.state.claimFeeFlag && record.claim_train_fee) ? true : false} />
              )}
            </FormItem>
          </Form>
        );
      }
    },
  ];

  render() {
    const classCompulsoryDataList = this.state.classCompulsoryDataList;
    const classElectiveDataList = this.state.classElectiveDataList;
    const classCommonDataList = this.state.classCommonDataList;
    //获取前三年的年份
    let date = new Date;
    console.log(date.getFullYear());
    let yearArray = [];
    for (let i = 0; i < 3; i++) {
      yearArray.push(date.getFullYear() - i);
    }
    const currentDate = date.getFullYear();
    console.log(yearArray);

    const yearList = yearArray.map((item) => {
      return (
        <Option key={item} value={item.toString()}>
          {item}
        </Option>
      )
    });

    for (let i = 0; i < classCompulsoryDataList.length; i++) {
      classCompulsoryDataList[i].key = i;
      classCompulsoryDataList[i].indexID = i + 1;
    }
    for (let i = 0; i < classElectiveDataList.length; i++) {
      classElectiveDataList[i].key = i;
      classElectiveDataList[i].indexID = i + 1;
    }
    for (let i = 0; i < classCommonDataList.length; i++) {
      classCommonDataList[i].key = i;
      classCommonDataList[i].indexID = i + 1;
    }

    return (
      <div>
        <br />
        <span> 请选择年度： </span>
        <Select style={{ width: 120 }} onSelect={this.handleYearChange} defaultValue={currentDate}>
          {yearList}
        </Select>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span> 请选择课程类型： </span>
        <Select defaultValue="全院级-必修课" style={{ width: 160 }} onChange={this.handleClassChange}>
          <Option value="compulsory">全院级-必修课</Option>
          <Option value="elective">全院级-选修课</Option>
          <Option value="common">全院级-其他课</Option>
        </Select>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

        <Button type="primary" onClick={this.queryClass}>查询全院级计划</Button>
        <br />
        <br />
        <Row span={2} style={{ textAlign: 'center' }}><h2>{this.state.year}年全院级培训计划落地</h2></Row>
        <br />

        <Card style={{ display: this.state.classType === 'compulsory' ? "" : "none" }} width={'100%'}>
          <Table
            columns={this.class_columns_compulsory}
            dataSource={classCompulsoryDataList}
            pagination={false}
            scroll={{ x: '100%', y: '480' }}
            width={'100%'}
          />
        </Card>
        <Card style={{ display: this.state.classType === 'elective' ? "" : "none" }} width={'100%'}>
          <Table
            columns={this.class_columns_elective}
            dataSource={classElectiveDataList}
            pagination={false}
            scroll={{ x: '100%', y: '480' }}
            width={'100%'}
          />
        </Card>
        <Card style={{ display: this.state.classType === 'common' ? "" : "none" }} width={'100%'}>
          <Table
            columns={this.class_columns_common}
            dataSource={classCommonDataList}
            pagination={false}
            scroll={{ x: '100%', y: '480' }}
            width={'100%'}
          />
        </Card>
        <br /><br />

        <div style={{ textAlign: 'center' }}>
          <Button onClick={this.gotoHome}>关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.saveAction} disabled={!this.state.isSaveClickable}>{this.state.isSaveClickable ? '保存提交' : '正在处理中...'}</Button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.train_create_model,
    ...state.train_create_model
  };
}

Claim_class = Form.create()(Claim_class);
export default connect(mapStateToProps)(Claim_class);
