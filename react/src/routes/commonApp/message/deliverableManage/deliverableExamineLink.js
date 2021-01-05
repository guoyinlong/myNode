/**
 * 作者：胡月
 * 创建日期：2017-12-18
 * 邮件：huy61@chinaunicom.cn
 * 文件说明：实现待办中交付物审批环节的功能
 */
import React, { Component } from 'react';
import { Button, Icon, message ,Table} from 'antd';
import styles from './deliverableManage.less';
import { routerRedux } from 'dva/router';
/**
 * 作者：胡月
 * 创建日期：2017-12-29.
 * 文件说明：审批环节
 */
class DeliverableExamineLink extends React.PureComponent {

  /**
   * 作者：胡月
   * 创建日期：2017-12-19
   * 功能：审批环节表格数据
   */
  columns = [
    {
      title: '序号',
      dataIndex: '',
      render: (text, record, index)=> {
        return index + 1;
      }
    }, {
      title: '状态',
      dataIndex: 'current_state'
    }, {
      title: '环节名称',
      dataIndex: 'current_link_name'
    }, {
      title: '审批人',
      dataIndex: 'current_link_username'
    }, {
      title: '审批类型',
      dataIndex: 'current_opt_flag_show'
    }, {
      title: '审批意见',
      dataIndex: 'current_opt_comment'
    }, {
      title: '审批时间',
      dataIndex: 'current_opt_handle_time'
    }
  ];
  render() {

    if (this.props.projChangeLog.length) {
      this.props.projChangeLog.map((i, index)=> {
        i.key = index;
      })
    }
    return (
      <Table columns={this.columns}
             bordered={true}
             dataSource={this.props.projChangeLog}
             pagination={false}
             loading={this.props.loading}
             className={styles.checkLogTable}
      />
    );
  }
}
export default DeliverableExamineLink;

