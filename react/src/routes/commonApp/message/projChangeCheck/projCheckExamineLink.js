/**
 * 作者：胡月
 * 日期：2017-11-22
 * 邮箱：huy61@chinaunicom.cn
 * 文件说明：项目变更中，审核人查看项目经理变更的申请，该tab为审批环节tab
 */
import React from 'react';
import {Table} from 'antd';
import styles from './projCheck.less';
import { routerRedux } from 'dva/router';
/**
 * 作者：胡月
 * 创建日期：2017-11-22.
 * 文件说明：审批环节
 */
class ExamineLink extends React.PureComponent {
  /**
   * 作者：胡月
   * 创建日期：2017-11-24
   * 功能：点击审批环节某一行进入项目变更详细信息
   */
  handleLogTableClick = (record) => {
    //  如果是审核环节表格的最后一行，不能点击进入详情页
    if(record.key !== this.props.projChangeLog.length-1 ){
      let is_first = record.key === 0 ? '1':'0';
      const {dispatch} = this.props;
      dispatch(routerRedux.push({
        pathname: '/projChangeCheck',
        query:{
          arg_proj_id:this.props.projId,
          arg_check_id:record.check_id,
          arg_handle_flag:this.props.flag,
          arg_tag:this.props.roleTag,
          arg_is_first:is_first,
          arg_check_detail_flag:'1'
        }
      }));
      this.props.goCheckDetail();
    }
  };

    /**
     * 作者：胡月
     * 创建日期：2017-11-24
     * 功能：审批环节表格数据
     */
    columns = [
      {
        title: '序号',
        dataIndex: '',
        width: '6%',
        render: (text, record, index)=> {
          return index + 1;
        }
      }, {
        title: '状态',
        dataIndex: 'current_state',
        width: '7%'
      }, {
        title: '环节名称',
        dataIndex: 'current_link_name',
        width: '13%'
      }, {
        title: '审批人',
        dataIndex: 'current_link_username',
        width: '8%',
      }, {
        title: '审批类型',
        dataIndex: 'current_opt_flag_show',
        width: '6%',
      }, {
        title: '审批意见',
        dataIndex: 'current_opt_comment',
        width: '28%',
        render: (value,row,index) =>{
          return (<div style={{textAlign:'left'}}>{value}</div>);
        }
      }, {
        title: '审批时间',
        dataIndex: 'current_opt_handle_time',
        width: '12%',
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
             dataSource={this.props.projChangeLog}
             pagination={false}
             loading={this.props.loading}
             className={styles.checkLogTable}
             onRowClick={this.handleLogTableClick}
      />
    );
  }
}
export default ExamineLink;
