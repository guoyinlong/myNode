/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：待办附件
 */
import React, { Component } from 'react';
import { Button, Icon, message ,Table} from 'antd';
import styles from '../../project/startup/projStartMain/projStartMain.less';
/**
 * 作者：任华维
 * 创建日期：2017-10-21.
 * 文件说明：待办附件主页
 */
function TaskLog({data,flag,checkId,handleClick}) {
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：声明变量
     */
    const columns = [
        {
          title: '序号',
          dataIndex:'',
          render:(text,record,index)=>{return index + 1;},
          width: '5%'
        },{
          title:'状态',
          dataIndex:'current_state',
          width: '10%'
        },{
          title: '环节名称',
          dataIndex:'current_link_name',
          width: '20%'
        },{
          title: '审批人',
          dataIndex: 'current_link_username',
          width: '10%'
        },{
          title: '审批类型',
          dataIndex: 'current_opt_flag_show',
          width: '10%'
        },{
          title: '审批意见',
          dataIndex: 'current_opt_comment',
          render:(text,record,index)=>{return record.current_opt_flag !== '1' ?text:null},
          width: '25%'
        },{
          title: '审批时间',
          dataIndex: 'current_opt_handle_time',
          width: '20%'
        }
     ];

    return (
        <Table columns={columns}
            rowKey='his_id'
            bordered={true}
            dataSource={data}
            pagination={false}
            className={styles.checkLogTable}
            onRowClick={(e)=>{handleClick(e,flag,checkId)}}
        />
    );
}
export default TaskLog;
