/**
 * 作者：夏天
 * 创建日期：2017-11-07
 * 邮件：1348744578@qq.com
 * 文件说明：每月每周项目报告信息(文件拷贝于项目执行-项目月报)
 */
import React from 'react';
import moment from 'moment';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/grid';
import { Table, Input, Progress, Button, Spin } from 'antd';
import styles from '../../../execute/report/projReport.less';
import request from '../../../../../utils/request';

moment.locale('zh-cn');

const TextArea = Input.TextArea;

/**
 * 作者：邓广晖
 * 创建日期：2018-01-17
 * 功能：转变为千分位
 * @param value 输入的值
 */
function change2Thousands(value) {
    if (value !== undefined) {
        return value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    } else {
        return '';
    }
}


class ProjMonthReport extends React.Component {

    componentWillUpdate(nextProps) {
        // 如果是查看月报
        let evLineChart = echarts.init(document.getElementById('statisticsChart'));
        let xAxisName = [];
        let acValue = [];
        let evValue = [];
        let pvValue = [];
        const earnPostData = {
            transjsonarray: JSON.stringify({
                condition: {
                    proj_id: this.props.projId,
                    tag: '2',
                },
                sequence: [{ 'year': '0' }, { 'month': '0' }]
            }),
        };
        const earnResData = request('/microservice/standardquery/project/monthevdataquery', earnPostData);
        earnResData.then((earnData) => {
            if (earnData.RetCode === '1') {
                // 所有pv值
                const pvPostData = {
                    transjsonarray: JSON.stringify({
                        condition: {
                            proj_id: this.props.projId,
                            tag: '0',
                        },
                        sequence: [{ 'year': '0' }, { 'month': '0' }]
                    }),
                };
                const pvResData = request('/microservice/standardquery/project/monthevdataquery', pvPostData);
                pvResData.then((pvData) => {
                    for (let j = 0; j < pvData.DataRows.length; j++) {
                        xAxisName.push(pvData.DataRows[j].month);
                        pvValue.push((Number(pvData.DataRows[j].pv) / 10000).toFixed(2));
                        let acValueData = '0';
                        let evValueData = '0';
                        for (let i = 0; i < earnData.DataRows.length; i++) {
                            if (pvData.DataRows[j].month === earnData.DataRows[i].month) {
                                acValueData = (Number(earnData.DataRows[i].ac) / 10000).toFixed(2);
                                evValueData = (Number(earnData.DataRows[i].ev) / 10000).toFixed(2);
                                break;
                            }
                        }
                        acValue.push(acValueData);
                        evValue.push(evValueData);
                    }
                    const option = {
                        title: { text: '挣值分析图', subtext: '' },
                        tooltip: { trigger: 'axis' },
                        legend: { data: ['AC', 'EV', 'PV'] },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                magicType: { show: true, type: ['line', 'bar'] },
                                restore: { show: true },
                                saveAsImage: { show: true },
                            },
                        },
                        calculable: true,
                        xAxis: [{ type: 'category', boundaryGap: false, data: xAxisName, name: '月' }],
                        yAxis: [
                            {
                                type: 'value',
                                axisLabel: {
                                    formatter: '{value}',
                                },
                                name: '万元',
                            },
                        ],
                        series: [
                            { name: 'AC', type: 'line', data: acValue },
                            { name: 'EV', type: 'line', data: evValue },
                            { name: 'PV', type: 'line', data: pvValue },
                        ]
                    };
                    evLineChart.setOption(option);
                });
            }
        });
    }
    // 返回周报页
    goBack = () => {
        this.props.dispatch({
            type: 'projHistoryDetail/goToWeek',
        });
    };
    columns = [
        {
            title: '年份',
            dataIndex: 'year',
        }, {
            title: '月份',
            dataIndex: 'month',
        }, {
            title: 'PV',
            dataIndex: 'pv',
        }, {
            title: 'EV',
            dataIndex: 'ev',
        }, {
            title: 'AC',
            dataIndex: 'ac',
        }, {
            title: 'SPI',
            dataIndex: 'spi',
            render: (value) => {
                if (value === 'Infinity' || value === 'NaN') {
                    return '-';
                } else {
                    return value;
                }
            },
        }, {
            title: 'CPI',
            dataIndex: 'cpi',
            render: (value) => {
                if (value === 'Infinity' || value === 'NaN') {
                    return '-';
                } else {
                    return value;
                }
            },
        },
    ];

    render() {
        let mileStoneProgress = (this.props.mileStoneList || '').map((item, index) => {
            return (
                <div key={index} style={{ margin: '10px 10px 20px 10px' }}>
                    <div>{(index + 1).toString() + '.' + item.mile_name}</div>
                    {/* 查看月报的时候乘以100 */}
                    <Progress
                        percent={Number((Number(item.initVal) * 100).toFixed(2))}
                        format={percent => `${percent}%`}
                        style={{ height: 20 }}
                    />
                </div>
            );
        });

        let purchaseColumns = [{
            title: '',
            dataIndex: 'intro',
        }];

        for (let i = 0; i < this.props.purchaseCostTypeList.length; i++) {
            purchaseColumns.push({
                title: this.props.purchaseCostTypeList[i],
                dataIndex: 'fee' + i.toString(),
                render: (value) => {
                    return (<div>{change2Thousands(value)}</div>);
                },
            });
        }

        let operateColumns = [{
            title: '',
            dataIndex: 'intro',
        }];

        for (let i = 0; i < this.props.operateCostTypeList.length; i++) {
            operateColumns.push({
                title: this.props.operateCostTypeList[i],
                dataIndex: 'fee' + i.toString(),
                render: (value) => {
                    return (<div>{change2Thousands(value)}</div>);
                },
            });
        }

        let carryOutColumns = [{
            title: '',
            dataIndex: 'intro',
        }];

        for (let j = 0; j < this.props.carryOutCostTypeList.length; j++) {
            carryOutColumns.push({
                title: this.props.carryOutCostTypeList[j],
                dataIndex: 'fee' + j.toString(),
                render: (value) => {
                    return (<div>{change2Thousands(value)}</div>);
                },
            });
        }

        return (
            <div>
                <div style={{ textAlign: 'right', marginBottom: 5 }}>
                    <Button type="primary" onClick={() => this.goBack()}>返回周报</Button>
                </div>
                {/* 第一块区域 */}
                <div className={styles.firstSection}>
                    <div className={styles.reportAddWorkPlan}>
                        {/* 工作计划 */}
                        <div>工作计划</div>
                        <p>本月主要工作</p>
                        <TextArea
                            rows={8}
                            disabled
                            value={this.props.workPlanThisMonth}
                            className={styles.textAreaStyle}
                        />
                        <br /><br />
                        <p>下月工作计划</p>
                        <TextArea
                            rows={8}
                            disabled
                            value={this.props.workPlanNextMonth}
                            className={styles.textAreaStyle}
                        />
                    </div>
                    <div className={styles.reportMileStone}>
                        {/* 里程碑 */}
                        <div>
                            <span>里程碑完成情况</span>
                            &nbsp;&nbsp;&nbsp;
                            <span style={{ color: 'red' }}>{this.props.mileStoneFinishState + '%'}</span>
                        </div>
                        <Spin tip={'加载中…'} spinning={this.props.mileDataLoading}>
                            {mileStoneProgress}
                        </Spin>
                    </div>
                </div>
                {/* 第二块区域 */}
                <div className={styles.secondSection}>
                    {/* 表格区域 */}
                    <div className={styles.dataStatisticTable}>
                        <div>挣值数据统计(万元)</div>
                        <Table
                            dataSource={this.props.earnData}
                            columns={this.columns}
                            bordered
                            pagination={false}
                        />
                    </div>
                    {/* 图表区域 */}
                    <div className={styles.dataStatisticChart} id='statisticsChart'>
                    </div>
                </div>

                {/* 第三块区域 */}
                <div className={styles.thirdSection}>
                    {/* 直接成本管理 */}
                    <div>直接成本管理</div>
                    {/* 采购成本 */}
                    <div style={{ padding: 10 }}>
                        <div className={styles.beforeTable}>采购成本</div>
                        <div style={{ display: 'inline-block', width: '90%' }}>
                            {this.props.purchaseCostTypeList.length ?
                                <Table
                                    dataSource={this.props.purchaseCostTableData}
                                    columns={purchaseColumns}
                                    bordered
                                    pagination={false}
                                    className={styles.commonTable}
                                />
                                :
                                <span>本月无数据</span>
                            }

                        </div>
                    </div>
                    {/* 运行成本 */}
                    <div style={{ padding: 10 }}>
                        <div className={styles.beforeTable}>运行成本</div>
                        <div style={{ display: 'inline-block', width: '90%' }}>
                            {this.props.operateCostTypeList.length ?
                                <Table
                                    dataSource={this.props.operateCostTableData}
                                    columns={operateColumns}
                                    bordered
                                    pagination={false}
                                    className={styles.commonTable}
                                />
                                :
                                <span>本月无数据</span>
                            }

                        </div>
                    </div>
                    {/* 实施成本 */}
                    <div style={{ padding: 10 }}>
                        <div className={styles.beforeTable}>实施成本</div>
                        <div style={{ display: 'inline-block', width: '90%' }}>
                            {this.props.carryOutCostTypeList.length ?
                                <Table
                                    dataSource={this.props.carryOutCostTableData}
                                    columns={carryOutColumns}
                                    bordered
                                    pagination={false}
                                    className={styles.commonTable}
                                />
                                :
                                <span>本月无数据</span>
                            }
                        </div>
                    </div>
                    {/* 人工成本 */}
                    <div style={{ padding: 10 }}>
                        <div className={styles.beforeTable}>人工成本</div>
                        <div style={{ display: 'inline-block', width: '90%' }}>
                            {this.props.humanCostData.length ?
                                <div>
                                    <span>本月人工成本：</span><span>{change2Thousands(this.props.humanCostData[0].month_fee)}</span>
                                    <span style={{ marginLeft: '50px' }}>累计人工成本：</span><span>{change2Thousands(this.props.humanCostData[0].fee)}</span>
                                </div>
                                :
                                <span>本月无数据</span>
                            }
                        </div>
                    </div>
                </div>

                {/* 第四块区域 */}
                <div className={styles.forthSection}>
                    <div className={styles.shareCostAndMemberManage}>
                        {/* 分摊成本 */}
                        <div>
                            <span style={{ fontWeight: 'bold' }}>分摊成本</span>
                            <span style={{ marginLeft: '25px' }}>本期分摊成本：</span><span>{change2Thousands(this.props.shareCostThis)}</span>
                            <span style={{ marginLeft: '50px' }}>累计分摊成本：</span><span>{change2Thousands(this.props.shareCostAll)}</span>
                        </div>

                        {/* 人员管理 */}
                        <div>
                            <span style={{ fontWeight: 'bold' }}>人员管理</span>
                            <span style={{ marginLeft: '25px' }}>上期人员数量：</span><span>{change2Thousands(this.props.staffTotalLast)}</span>
                            <span style={{ marginLeft: '20px' }}>本期人员数量：</span><span>{change2Thousands(this.props.staffTotalThis)}</span>
                            <span style={{ marginLeft: '20px' }}>本期人员变化：</span><span>{change2Thousands(this.props.staffTotalChange)}</span>
                        </div>
                    </div>
                    <div className={styles.divationAnalysis}>
                        {/* 偏差分析 */}
                        <div>偏差分析</div>
                        <p>成本偏差分析</p>
                        <TextArea
                            rows={5}
                            disabled
                            value={this.props.costOffset}
                            className={styles.textAreaStyle}
                        />
                        <br /><br />
                        <p>进度偏差分析</p>
                        <TextArea
                            rows={5}
                            disabled
                            value={this.props.progressOffset}
                            className={styles.textAreaStyle}
                        />
                    </div>
                </div>

                {/* 备注区域 */}
                <div style={{ background: 'white', marginTop: 17, padding: 10 }}>
                    <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: 10 }}>备注</div>
                    <TextArea
                        rows={3}
                        disabled
                        value={this.props.mark}
                        className={styles.textAreaStyle}
                    />
                </div>
            </div>
        );
    }
}


export default ProjMonthReport;
