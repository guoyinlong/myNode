/**
 *  作者: 夏天
 *  创建日期: 2018-09-19
 *  邮箱：1348744578@qq.com
 *  文件说明：项目历史-详情-项目结项
 */

import React from 'react';
import { Button, Collapse, Table } from 'antd';
import styles from '../../../startup/projStartMain/projStartMain.less';

const Panel = Collapse.Panel;

class ProjDelivery extends React.Component {
    // 下载按钮
    download = (param) => {
        window.open(param);
    };

    columns = [{
        title: '文档名称',
        dataIndex: 'document_name',
        width: '4%',
    }, {
        title: '文档说明',
        dataIndex: 'document_description',
        width: '7%',
    }, {
        title: '已上传文件',
        dataIndex: 'file_list',
        width: '5%',
        render: (text, record, index) => {
            if (record.file_list === 'NaN') {
                return (<div></div>);
            } else {
                let arr = [];
                record.file_list.map((item) => {
                    arr.push(<div key={item.file_name} style={{ marginTop: 10 }}>{item.file_name}</div>);
                });
                return (arr);
            }
        },
    }, {
        title: '备注',
        dataIndex: 'remark',
        width: '4%',
        render: (text, record, index) => {
            if (record.remark === 'NaN') {
                return (<div></div>);
            }
        },
    }, {
        title: '操作',
        width: '5%',
        render: (text, record, index) => {
            if (record.file_list === 'NaN') {
                return (<Button type="primary" size="small" disabled>下载</Button>);
            } else {
                let arr = [];
                record.file_list.map((item) => {
                    arr.push(
                        <div key={item.file_name} style={{ marginTop: 5 }}>
                            <p>{item.file_name}&nbsp;</p>
                    <Button type="primary" size="small" onClick={() => this.download(item.file_url)}>下载</Button>
                        </div>
                    );
                });
                return (arr);
            }
        },
    }];

    render() {
        const { projDeliveryList } = this.props;
        return (
            <div style={{ paddingTop: 5, paddingBottom: 16 }} >
                <div style={{ paddingLeft: 15, paddingRight: 15 }}>
                    <Collapse defaultActiveKey={['1']}>
                        {
                            projDeliveryList.map((i, item) => {
                                let str = i.type_list;
                                str = str.replace(/\"\[/g, '\[');
                                str = str.replace(/\]\"/g, '\]');
                                return (
                                    <Panel header={i.process_stage_name} key={item + 1}>
                                        <Table
                                            bordered
                                            columns={this.columns}
                                            pagination={false}
                                            dataSource={JSON.parse(str)}
                                            className={styles.mileStoneTable}
                                            rowKey="document_name"
                                        />
                                    </Panel>
                                );
                            })
                        }
                    </Collapse>
                </div>
            </div >
        );
    }
}


export default ProjDelivery;
