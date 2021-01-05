/**
 * 文件说明：组织绩效考核指标追踪填报表格
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2020-8-4
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Table, Tabs} from 'antd';
import StatusColor from '../common/statusColor.less';
import tableStyle from '../../../../components/finance/table.less';
import wrapStyle from '../../../../components/finance/finance.less';
import evaluteStyle from '../evaluate/evaluateStyle.less';
import FilterBox from '../common/filterBox';
import * as mapInformation from '../common/mapInformation';
import trackStyle from './trackStyle.less';

const TabPane = Tabs.TabPane;

class TrackReport extends PureComponent {
    constructor(props) {
        super(props);
    }
    // 切换tab
    tabChange = value => {
        this.props.dispatch({
            type: 'trackModel/save',
            payload: {
                reportActiveKey: value
            }
        })
    }
    // 选择选项
    selectItem = (value, item) => {
        this.props.dispatch({
            type: 'trackModel/save',
            payload: {
                [item]: value
            }
        })
    }
    // 获取月度筛选框
    getMonthFilterBoxData = () => {
        const {monthReportYear} = this.props;
        return [
            {
                type: 'select',
                value: monthReportYear,
                onChange: value => {
                    this.selectItem(value, 'monthReportYear');
                    this.props.dispatch({
                        type: 'trackModel/getMonthIndex',
                        payload: {
                            year: value,
                            pageNo: 1
                        }
                    })
                },
                options: [
                    ...mapInformation.yearMap().map(v => ({
                        key: v,
                        name: v
                    }))
                ],
                title: '年份',
                span: 6,
                width: 150
            }
        ]
    }
    // 获取季度选项
    getQuarterList = year => {
        let quarterList = [];
        const quarterListAll = mapInformation.quarterMap.map((v, i) => ({
            key: i + 1 + '',
            name: v
        }))
        if (year < new Date().getFullYear()) {
            quarterList = quarterListAll;
        } else {
            quarterList = quarterListAll.slice(0, Math.ceil((new Date().getMonth() + 1) / 3));
        }
        return quarterList;
    }
    // 获取季度筛选框
    getQuarterFilterBoxData = () => {
        const {quarterReportYear} = this.props;
        return [
            {
                type: 'select',
                value: quarterReportYear,
                onChange: value => {
                    this.selectItem(value, 'quarterReportYear');
                    this.props.dispatch({
                        type: 'trackModel/getQuarterIndex',
                        payload: {
                            year: value, 
                            pageNo: 1
                        }
                    })
                },
                options: [
                    ...mapInformation.yearMap().map(v => ({
                        key: v,
                        name: v
                    }))
                ],
                title: '年份',
                span: 6,
                width: 150
            }
        ]
    }
    // 月度填报表格columns
    monthTableColums = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index'
        },
        {
            title: '年度',
            dataIndex: 'year',
            key: 'year'
        },
        {
            title: '月份',
            dataIndex: 'month',
            key: 'month'
        },
        {
            title: '部门（分院）',
            dataIndex: 'unit',
            key: 'unit',
            render: text => mapInformation.unitMap[text]
        },
        {
            title: '指标',
            dataIndex: 'name',
            key: 'name',
            render: text => mapInformation.indexTypeMap[text]
        },
        {
            title: '姓名',
            dataIndex: 'applicantName',
            key: 'applicantName'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: text => (
                <span className={StatusColor['status' + text]}>{mapInformation.statusMap[text]}</span>
            )
        }
    ]
    // 获取月度表格dataScore
    getMonthDataScore = (data = []) => data.map((v, i) => ({
        key: v.id,
        index: i + 1,
        year: v.year,
        month: v.month,
        unit: v.unit,
        name: v.name,
        applicantName: v.applicantName,
        status: v.status,
        indexId: v.indexId
    }))
    // 获取季度填报表格columns
    quarterTableColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index'
        },
        {
            title: '年度',
            dataIndex: 'year',
            key: 'year'
        },
        {
            title: '季度',
            dataIndex: 'quarter',
            key: 'quarter',
            render: text => mapInformation.quarterMap[text - 1]
        },
        {
            title: '部门（分院）',
            dataIndex: 'unit',
            key: 'unit',
            render: text => mapInformation.unitMap[text]
        },
        {
            title: '姓名',
            dataIndex: 'applicantName',
            key: 'applicantName'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: text => (
                <span className={StatusColor['status' + text]}>{mapInformation.statusMap[text]}</span>
            )
        }
    ]
    // 获取季度表格dataScore
    getQuarterDataScore = (data = []) => data.map((v, i) => ({
        key: v.id,
        index: i + 1,
        year: v.year,
        quarter: v.quarter,
        unit: v.unit,
        applicantName: v.applicantName,
        status: v.status,
        indexId: v.indexId, 
        name: v.name
    }))
    // 页码变化时
    pageChange = (page, flag) => {
        let type = '';
        switch (flag) {
            case 'month':
                type = 'trackModel/getMonthIndex';
                break;
            case 'quarter':
                type = 'trackModel/getQuarterIndex';
                break;
        }
        this.props.dispatch({
            type,
            payload: {
                pageNo: page
            }
        })
    }
    // 月度指标行点击
    monthIndexRowClick = record => {
        this.props.dispatch(routerRedux.push({
            pathname: '/financeApp/examine/trackReport/monthReportDetail',
            query: {
                indexId: record.indexId,
                month: record.month,
                year: record.year,
                applicantName: record.applicantName,
                name: record.name,
                unit: record.unit,
                status: record.status
            }
        }))
    }
    // 季度指标行点击
    quarterIndexRowClick = record => {
        this.props.dispatch(routerRedux.push({
            pathname: '/financeApp/examine/trackReport/quarterReportDetail',
            query: {
                indexId: record.indexId,
                quarter: record.quarter,
                year: record.year,
                applicantName: record.applicantName,
                name: record.name,
                unit: record.unit,
                status: record.status
            }
        }))
    }

    render() {
        const {reportActiveKey, monthCurrentPage, quarterCurrentPage, monthtIndexDataLoading, quarterIndexDataLoading,
            monthtIndexData, quarterIndexData} = this.props;
        return (
            <div className={wrapStyle.wrap}>
                <Tabs
                    activeKey={reportActiveKey}
                    onChange={this.tabChange}
                >
                    <TabPane tab="月度填报" key="1" style={{padding: '0 20px'}}>
                        <FilterBox
                            filterData={this.getMonthFilterBoxData()}
                        />
                        <Table
                            columns={this.monthTableColums}
                            dataSource={this.getMonthDataScore(monthtIndexData.DataRows)}
                            className={tableStyle.financeTable + ' ' + evaluteStyle.pointTable}
                            pagination={{
                                current: monthCurrentPage,
                                onChange: page => this.pageChange(page, 'month'),
                                total: monthtIndexData.totalCount
                            }}
                            style={{marginTop: 15}}
                            loading={monthtIndexDataLoading}
                            onRowClick={this.monthIndexRowClick}
                            rowClassName={record => record.status == '1' ? trackStyle.trackTable : ''}
                        />
                    </TabPane>
                    <TabPane tab="季度填报" key="2">
                        <FilterBox
                            filterData={this.getQuarterFilterBoxData()}
                        />
                        <Table
                            columns={this.quarterTableColumns}
                            dataSource={this.getQuarterDataScore(quarterIndexData.DataRows)}
                            className={tableStyle.financeTable + ' ' + evaluteStyle.pointTable}
                            pagination={{
                                current: quarterCurrentPage,
                                onChange: page => this.pageChange(page, 'quarter'),
                                total: quarterIndexData.totalCount
                            }}
                            style={{marginTop: 15}}
                            loading={quarterIndexDataLoading}
                            onRowClick={this.quarterIndexRowClick}
                            rowClassName={record => record.status == '1' ? trackStyle.trackTable : ''}
                        />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

const mapStateToProps = ({trackModel, loading}) => ({
    loading: loading.models.trackModel,
    ...trackModel
})

export default connect(mapStateToProps)(TrackReport);
