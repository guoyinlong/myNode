/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目启动的里程碑功能
 */
import React from 'react';
import { Table } from 'antd';
import styles from '../../project/startup/projAdd/attachment.less';

/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 功能：实现里程碑页面展示
 */
class MileStone extends React.Component {

    render() {
        const { mileStoneList } = this.props;
        let columns = [
            {
                title: '序号',
                dataIndex: '',
                width: '5%',
                render: (text, record, index) => {
                    return (<div>{index + 1}</div>)
                }
            }, {
                title: '里程碑名称',
                dataIndex: 'mile_name',
                width: '30%',
                render: (text, record, index) => {
                    return <div style={{textAlign: 'left'}}>{text}</div>
                }
            }, {
                title: '开始时间',
                dataIndex: 'plan_begin_time',
                width: '15%'
            }, {
                title: '结束时间',
                dataIndex: 'plan_end_time',
                width: '15%'
            },{
                title: '计划工作量（人月）',
                dataIndex: 'plan_workload',
                width:'15%'
            }
        ];
        return (
            <div style={{marginTop:5}}>
                <Table
                    columns={columns}
                    dataSource={mileStoneList}
                    className={styles.orderTable}
                    bordered={false}
                />
            </div>
        );
    }
}

export default MileStone;
