/**
 *  作者: 夏天
 *  创建日期: 2018-09-19
 *  邮箱：1348744578@qq.com
 *  文件说明：项目历史-详情-周报月报(文件拷贝于项目执行-项目周报)
 */
import React from 'react';
import { Table, Tabs, Collapse, Button, Spin } from 'antd';
// import styles from '../../../startup/projStartMain/projStartMain.less';

import styles from '../../../execute/report/projReport.less';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

class ProjWeekReport extends React.Component {
    constructor(props) {
        super(props);
        // this.monthReport = this.monthReport.bind(this);
    }
    /**
     * 功能：跳转到月报页面
     */
    monthReport = () => {
        this.props.dispatch({
            type: 'projHistoryDetail/initMonthReport',
        });
    };
    /**
     * 作者：邓广晖
     * 创建日期：2017-11-09
     * 功能：折叠面板切换
     * @param key 面板的索引key
     */
    switchPane = (key) => {
        if (key !== undefined) {
            this.props.dispatch({
                type: 'projHistoryDetail/switchPane',
                yearIndex: key,
            });
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-09
     * 功能：tab切换
     * @param key tab的索引
     */
    switchTab = (key) => {
        this.props.dispatch({
            type: 'projHistoryDetail/switchMonthTabTable',
            monthIndex: key,
        });
    };


    colomns = [
        {
            title: '周次',
            dataIndex: '',
            render: (value, row) => {
                return (<div>第 {(row.week).toString()} 周</div>);
            },
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
        },
        {
            title: '状态',
            dataIndex: 'state_show',
            render: (value, record) => {
                if (record.state === '1') {
                    return value;
                } else {
                    return <div style={{ color: 'red' }}>{value}</div>;
                }
            },
        },
        {
            title: '操作',
            dataIndex: '',
            render: (value, record) => {
                if (record.state === '1') {
                    return (
                        <div>
                            <p style={{ lineHeight: '17px' }}>{record.fileName}</p><br />
                            <a href={record.relativePath}>下载</a>
                        </div>
                    );
                } else {
                    return (
                        <Button disabled>下载</Button>
                    );
                }
            },
        },
    ];

    render() {
        let panelList = [];
        for (let j = 0; j < this.props.collapsePanelList.length; j++) {
            let tabPaneList = [];
            for (let i = parseInt(this.props.oneYearMonthStart); i <= parseInt(this.props.oneYearMonthEnd); i++) {
                let tabPaneName = (i).toString() + '月';
                tabPaneList.push(
                    <TabPane tab={tabPaneName} key={i}>
                        <div className={styles.addReport}>
                            {this.props.monthHaveReport ?
                                <Button type="primary" onClick={() => this.monthReport()}>查看月报</Button>
                                :
                                <Button type="primary" disabled>查看月报</Button>
                            }
                        </div>
                        <Table
                            dataSource={this.props.dateTableList}
                            columns={this.colomns}
                            pagination={false}
                            bordered
                            className={styles.reportInfoTable}
                        />
                    </TabPane >
                );
            }
            panelList.push(
                <Panel
                    header={this.props.collapsePanelList[j] + '年'}
                    key={this.props.collapsePanelList[j]}
                    className={styles.panelStyle}
                >
                    <Tabs type="card" onTabClick={this.switchTab} activeKey={this.props.monthTabIndex}>
                        {tabPaneList}
                    </Tabs>
                </Panel>
            );
        }

        return (
            <Spin spinning={this.props.tableDataLoadSpin}>
                {this.props.collapsePanelList.length ?
                    <Collapse
                        defaultActiveKey={this.props.collapsePanelList[0]}
                        accordion
                        onChange={this.switchPane}
                    >
                        {panelList}
                    </Collapse>
                    :
                    null
                }
            </Spin>
        );
    }
}

export default ProjWeekReport;
