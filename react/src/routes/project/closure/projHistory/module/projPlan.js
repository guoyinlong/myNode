/**
 *  作者: 夏天
 *  创建日期: 2018-09-19
 *  邮箱：1348744578@qq.com
 *  文件说明：项目历史-详情-团队查询
 */
import React from 'react';
import { Select, Table } from 'antd';
import styles from '../../../startup/projStartMain/projStartMain.less';

const Option = Select.Option;

class ProjPlan extends React.Component {
    /**
     * 功能：设置是选择框的值
     * @param key 选择的key
     */
    setSelectShow = (key) => {
        this.props.dispatch({
            type: 'projHistoryDetail/setSelectShow',
            value: key,
        });
    };
    columns = [
        {
            title: '序号',
            dataIndex: '',
            width: '2%',
            render: (text, record, index) => {
                return <div>{index + 1}</div>;
            },
        }, {
            title: '文档名称',
            dataIndex: 'ppd_doc_name',
            width: '6%',
            render: (text) => {
                return <div style={{ textAlign: 'left' }}>{text}</div>;
            },
        }, {
            title: '文档类型',
            dataIndex: 'ppd_doc_type',
            width: '5%',
        }, {
            title: '上传者',
            dataIndex: 'ppd_doc_usrname',
            width: '2%',
        }, {
            title: '上传时间',
            dataIndex: 'ppd_upload_time',
            width: '3%',
        },
    ]

    render() {
        const docTypeOption = (this.props.projPlanDoc || '').map((item) => {
            return (
                <Option key={item.ppd_doc_type} value={item.ppd_doc_type}>{item.ppd_doc_type}</Option>
            );
        })
        return (
            <div>
                <div style={{ marginBottom: 10 }}>
                    <span>文档类型：</span>
                    <Select
                        showSearch
                        optionFilterProp="children"
                        style={{ width: 300 }}
                        value={this.props.arg_ppd_doc_type}
                        onSelect={(key) => this.setSelectShow(key)}
                    >
                        <Option value="">全部类型</Option>
                        {docTypeOption}
                    </Select>
                </div>
                <Table
                    columns={this.columns}
                    dataSource={this.props.projPlanList}
                    bordered
                    className={styles.mileStoneTable}
                    rowKey="ppd_doc_name"
                />
            </div>
        );
    }
}

export default ProjPlan;
