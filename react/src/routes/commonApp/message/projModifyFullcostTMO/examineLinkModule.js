/**
 * 作者：邓广晖
 * 日期：2018-04-11
 * 邮箱：dengh6@chinaunicom.cn
 * 文件说明：TMO变更全成本中，审核人查看项目经理变更的申请，该tab为审批环节tab
 */
import React from 'react';
import {Table} from 'antd';
import styles from '../projChangeCheck/projCheck.less';
import { routerRedux } from 'dva/router';
/**
 * 作者：邓广晖
 * 日期：2018-04-11
 * 文件说明：审批环节
 */
class ExamineLinkModule extends React.PureComponent {
  /**
   * 作者：邓广晖
   * 日期：2018-04-11
   * 功能：点击审批环节某一行进入项目变更详细信息
   */
  handleLogTableClick = (record) => {
    //  如果是审核环节表格的最后一行，不能点击进入详情页
    if(record.key !== this.props.projChangeLog.length-1 ){
      let is_first = record.key === 0 ? '1':'0';
      const {dispatch} = this.props;
      dispatch({
        type: 'projFullcostView/changeTabKey',
        payload:{ key:'1'}
      });
      dispatch(routerRedux.push({
        pathname: '/projFullcostView',
        query:{
          arg_proj_id:this.props.arg_proj_id,
          arg_check_id:record.check_id,
          arg_handle_flag:this.props.arg_handle_flag,
          arg_tag:this.props.arg_tag,
          arg_is_first:is_first,
          arg_check_detail_flag:'1'
        }
      }));
    }
  };

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
export default ExamineLinkModule;
