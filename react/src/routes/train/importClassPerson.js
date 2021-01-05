/**
 * 文件说明：培训管理-分院、部门级通用认证计划-导入对应人员
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-07-23
 **/
import React, { Component } from 'react';
import { connect } from "dva";
import { Button, Card, Form, Row, Select, Table } from "antd";
import { routerRedux } from "dva/router";
import Cookie from "js-cookie";
const Option = Select.Option;

class ImportClassPerson extends Component {
  constructor(props) {
    super(props);
    let user_name = Cookie.get('username');
    this.state = {
      user_name: user_name,
      isSaveClickable: true,
      personVisible: false,
      importType: 'branch_department',
      importStateFlag: false,
      returnRecord: '',
      selectGroupData: [],
      reSelectFlag: false
    };
  };

  //结束关闭
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_index'
    }));
  };

  //选择培训人群
  trainGroupSelect(record, train_group) {
    let changePlan = this.props.BranchAndDepartmentClassDataList;
    changePlan[record.indexID - 1]["train_group"] = train_group;
  };

  //重新选择培训人群
  reSelect() {
    this.setState({
      reSelectFlag: false
    })
  };

  //提交本条信息
  submit(record, aaa) {
    let groupParam = {
      arg_group_name: record.train_group,
      arg_train_class_id: record.train_class_id,
      arg_update_flag: record.is_imported_flag,
    };
    this.setState({
      reSelectFlag: true
    })
    const { dispatch } = this.props;

    return new Promise((resolve) => {
      dispatch({
        //全院级必修课保存
        type: 'train_create_model/updateGroupInfo',
        groupParam,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/importClassPerson'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/importClassPerson'
        }));
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/importClassPerson'
      }));
    });

  };

  class_columns = [
    { title: '序号', dataIndex: 'indexID', width: '5%', },
    { title: '培训级别', dataIndex: 'train_level', width: '5%', },
    { title: '课程级别', dataIndex: 'class_level', width: '5%', },
    { title: '课程名称/方向', dataIndex: 'class_name', width: '25%', },
    {
      title: '培训对象',
      dataIndex: 'train_group',
      key: 'train_group',
      width: '20%',
      render: (text, record, index) => {
        const groupData = this.props.groupData;
        let groupDataList = [];
        let initGroup = record.train_group;

        if (groupData.length) {
          // for (let i = 0; i < groupData.length; i++) {
          //   groupDataList.push(<Option value={groupData[i].train_manage_id.toString()}>{groupData[i].train_group}</Option>);
          // }

          groupDataList = groupData.map(item =>
            <Option value={item.train_group}>{item.train_group}</Option>
          );
        }

        return <Select size="large" style={{ width: '100%' }} defaultValue={initGroup} onSelect={this.trainGroupSelect.bind(this, record)} >
          {groupDataList}
        </Select>
      }
    },
    {
      title: '状态',
      dataIndex: '',
      key: '',
      width: '10%',
      render: (text, record) => {
        return (
          <span>{record.is_imported_flag === '1' ? '已提交' : '待提交'}</span>
        );
      },
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      width: '10%',
      render: (text, record) => {
        return (
          <span>
            {
              <span>
                <a onClick={this.submit.bind(this, record)} >提交(可重复修改)</a>
              </span>
            }
          </span>
        );
      },
    }
  ];


  render() {
    const classDataList = this.props.BranchAndDepartmentClassDataList;
    for (let i = 0; i < classDataList.length; i++) {
      classDataList[i].key = i;
      classDataList[i].indexID = i + 1;
    }

    return (
      <div>
        <br />
        <Row span={2} style={{ textAlign: 'center' }}><h2>{new Date().getFullYear()}年 核心班课程培训对象</h2></Row>
        <br />
        {
          (classDataList && classDataList.length > 0) ?
            <Card title="核心班培训计划课程信息">
              <br />
              <Table
                columns={this.class_columns}
                dataSource={classDataList}
                pagination={true}
                scroll={{ y: 400 }}
              />
            </Card>
            :
            <Card title="核心班培训计划课程信息">
              <br />
              <h2>未查到核心班课程，请检查课程！</h2>
            </Card>
        }
        <br />

        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.gotoHome}>关闭</Button>
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

ImportClassPerson = Form.create()(ImportClassPerson);
export default connect(mapStateToProps)(ImportClassPerson);
