/**
 *  作者: 夏天
 *  创建日期: 2018-09-18
 *  邮箱：1348744578@qq.com
 *  文件说明：项目历史-详情-团队查询
 */
import React from 'react';
import { Table } from 'antd';
import styles from '../../../startup/projStartMain/projStartMain.less';

class TeamQuery extends React.Component {
    columns = [
        {
            title: '序号',
            dataIndex: '',
            width: '3%',
            render: (text, record, index) => {
                return <div>{index + 1}</div>;
            },
            key: '1'
        }, {
            title: '员工编号',
            dataIndex: 'staff_id',
            key: 'staff_id',
            width: '5%',
        }, {
            title: '姓名',
            dataIndex: 'staff_name',
            key: 'staff_name',
            width: '5%',
        }, {
            title: '类型',
            dataIndex: 'person_type',
            key: 'person_type',
            width: '5%',
        }, {
            title: '主建单位',
            dataIndex: 'ou',
            key: 'ou',
            width: '9%',
        }, {
            title: '主建部门',
            dataIndex: 'dept_name',
            key: 'dept_name',
            width: '11%',
        },
    ]

    render() {
        return (
            <div>
                <Table
                    columns={this.columns}
                    dataSource={this.props.teamList}
                    bordered
                    className={styles.mileStoneTable}
                    rowKey="staff_id"
                />
            </div>
        );
    }
}

export default TeamQuery;
