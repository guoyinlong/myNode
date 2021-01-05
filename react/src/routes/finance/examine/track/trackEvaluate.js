/**
 * 文件说明：组织绩效考核指标追踪评价
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
import moment from 'moment';
moment.locale('zh-cn');
const TabPane = Tabs.TabPane;

class TrackEvaluate extends PureComponent {
    constructor(props) {
        super(props);
    }
    // 切换tab
    tabChange = value => {
        this.props.dispatch({
            type: 'trackModel/save',
            payload: {
                evaluateActiveKey: value
            }
        })
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
            dataIndex: 'type',
            key: 'type',
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
        key: v.flowId,
        index: i + 1,
        ableRefuse: v.ableRefuse,
        flowId: v.flowId,
        flowLinkId: v.flowLinkId,
        tag: v.tag,
        taskBatchid: v.taskBatchid,
        taskUUID: v.taskUUID,
        year: v.year,
        month: v.month,
        unit: v.unit,
        name: v.name,
        applicantName: v.applicantName,
        status: v.status,
        indexId: v.id,
        type: v.type
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
    getQuarterDataScore = (data =[]) => data.map((v, i) => ({
        key: v.flowId,
        index: i + 1,
        ableRefuse: v.ableRefuse,
        flowId: v.flowId,
        flowLinkId: v.flowLinkId,
        tag: v.tag,
        taskBatchid: v.taskBatchid,
        taskUUID: v.taskUUID,
        year: v.year,
        quarter: v.quarter,
        unit: v.unit,
        name: v.name,
        applicantName: v.applicantName,
        status: v.status,
        indexId: v.id,
        type: v.type
    }))
    // 获取年度填报表格columns
    yearTableColumns = [
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
        },
        {
            title: '得分',
            dataIndex: 'totalScore',
            key: 'totalScore'
        },
    ]
    // 获取年度表格dataScore
    getYearDataScore = (data = []) => data.map((v, i) => ({
        key: v.id,
        index: i + 1,
        year: v.year,
        unit: v.unit,
        name: v.name,
        applicantName: v.applicantName,
        status: v.status,
        indexId: v.id,
        totalScore: v.totalScore
    }))
    // 筛选选择选项
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
        const {monthEvaluateDate, monthEvaluateUnit, monthEvaluateName, monthEvaluateStatus} = this.props;
        return [
            {
                type: 'monthPicker',
                value: monthEvaluateDate,
                onChange: value => {
                    // if (value <= new Date()) {
                        this.selectItem(value, 'monthEvaluateDate')
                    // } else {
                    //     message.error('选择的时间超出可选范围');
                    // };
                },
                format: 'YYYY-MM',
                title: '年月',
                span: 6,
                width: 140
            },
            {
                type: 'select',
                value: monthEvaluateUnit,
                onChange: value => this.selectItem(value, 'monthEvaluateUnit'),
                options: [
                    {
                        key: 'all',
                        name: '全部'
                    },
                    ...mapInformation.unitMap.map((v, i) => ({
                        key: i + '',
                        name: v
                    }))
                ],
                title: '部门（分院）',
                span: 7,
                width: 150
            },
            {
                type: 'input',
                value: monthEvaluateName,
                onChange: e => this.selectItem(e.target.value, 'monthEvaluateName'),
                title: '姓名',
                span: 5,
                width: 130
            },
            {
                type: 'select',
                value: monthEvaluateStatus,
                onChange: value => this.selectItem(value, 'monthEvaluateStatus'),
                options: [
                    {
                        key: 'all',
                        name: '全部'
                    },
                    ...mapInformation.statusMap.map((v, i) => ({
                        key: i + '',
                        name: v
                    }))
                ],
                title: '状态',
                span: 6,
                width: 150
            },
            {
                type: 'button',
                options: [
                    {
                        onClick: () => {
                            this.props.dispatch({
                                type: 'trackModel/getToDoMonthIndex',
                                payload: {
                                    pageNo: 1
                                }
                            })
                        },
                        btnType: 'primary',
                        title: '查询'
                    },
                    {
                        onClick: () => {
                            this.props.dispatch({
                                type: 'trackModel/save',
                                payload: {
                                    monthEvaluateDate: moment(),
                                    monthEvaluateUnit: 'all',
                                    monthEvaluateName: '',
                                    monthEvaluateStatus: 'all'
                                }
                            })
                        },
                        btnType: 'primary',
                        title: '重置'
                    }
                ],
                span: 6,
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
        const {quarterEvaluateYear, quarterEvaluateQuarter, quarterEvaluateUnit, quarterEvaluateName, quarterEvaluateStatus} = this.props;
        return [
            {
                type: 'select',
                value: quarterEvaluateYear,
                onChange: value => {
                    let quarterList = this.getQuarterList(value);
                    if (value == new Date().getFullYear()) {
                        this.selectItem(quarterList[quarterList.length - 1].key, 'quarterEvaluateQuarter');
                    }
                    this.selectItem(value, 'quarterEvaluateYear')
                },
                options: [
                    {
                        key: '2019',
                        name: '2019'
                    },
                    {
                        key: '2020',
                        name: '2020'
                    }
                ],
                title: '年份',
                span: 6,
                width: 150
            },
            {
                type: 'select',
                value: quarterEvaluateQuarter,
                onChange: value => this.selectItem(value, 'quarterEvaluateQuarter'),
                options: [
                    ...this.getQuarterList(quarterEvaluateYear)
                ],
                title: '季度',
                span: 6,
                width: 150
            },
            {
                type: 'select',
                value: quarterEvaluateUnit,
                onChange: value => this.selectItem(value, 'quarterEvaluateUnit'),
                options: [
                    {
                        key: 'all',
                        name: '全部'
                    },
                    ...mapInformation.unitMap.map((v, i) => ({
                        key: i + '',
                        name: v
                    }))
                ],
                title: '部门（分院）',
                span: 7,
                width: 150
            },
            {
                type: 'input',
                value: quarterEvaluateName,
                onChange: e => this.selectItem(e.target.value, 'quarterEvaluateName'),
                title: '姓名',
                span: 5,
                width: 130
            },
            {
                type: 'select',
                value: quarterEvaluateStatus,
                onChange: value => this.selectItem(value, 'quarterEvaluateStatus'),
                options: [
                    {
                        key: 'all',
                        name: '全部'
                    },
                    ...mapInformation.statusMap.map((v, i) => ({
                        key: i + '',
                        name: v
                    }))
                ],
                title: '状态',
                span: 6,
                width: 150
            },
            {
                type: 'button',
                options: [
                    {
                        onClick: () => {
                            this.props.dispatch({
                                type: 'trackModel/getToDoQuarterIndex',
                                payload: {
                                    pageNo: 1
                                }
                            })
                        },
                        btnType: 'primary',
                        title: '查询'
                    },
                    {
                        onClick: () => {
                            this.props.dispatch({
                                type: 'trackModel/save',
                                payload: {
                                    quarterEvaluateYear: new Date().getFullYear() + '',
                                    quarterEvaluateQuarter: 'all',
                                    quarterEvaluateUnit: 'all',
                                    quarterEvaluateName: '',
                                    quarterEvaluateStatus: 'all'
                                }
                            })
                        },
                        btnType: 'primary',
                        title: '重置'
                    }
                ],
                span: 6,
            }
        ]
    }
    // 月度指标行点击
    monthIndexRowClick = record => {
        this.props.dispatch(routerRedux.push({
            pathname: '/financeApp/examine/trackEvaluate/monthEvaluateDetail',
            query: {
                ableRefuse: record.ableRefuse,
                flowId: record.flowId,
                flowLinkId: record.flowLinkId,
                tag: record.tag,
                taskBatchid: record.taskBatchid,
                taskUUID: record.taskUUID,
                year: record.year,
                month: record.month,
                unit: record.unit,
                name: record.name,
                applicantName: record.applicantName,
                status: record.status,
                indexId: record.indexId,
                type: record.type
            }
        }))
    }
    // 季度指标行点击
    quarterIndexRowClick = record => {
        this.props.dispatch(routerRedux.push({
            pathname: '/financeApp/examine/trackEvaluate/quarterEvaluateDetail',
            query: {
                ableRefuse: record.ableRefuse,
                flowId: record.flowId,
                flowLinkId: record.flowLinkId,
                tag: record.tag,
                taskBatchid: record.taskBatchid,
                taskUUID: record.taskUUID,
                year: record.year,
                quarter: record.quarter,
                unit: record.unit,
                name: record.name,
                applicantName: record.applicantName,
                status: record.status,
                indexId: record.indexId,
                type: record.type
            }
        }))
    }
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

    render() {
        const {evaluateActiveKey, monthCurrentPage, quarterCurrentPage, monthtIndexData, quarterIndexData, monthtIndexDataLoading, quarterIndexDataLoading, 
            evaluateUserKeys} = this.props;
        return (
            <div className={wrapStyle.wrap}>
                <Tabs
                    activeKey={evaluateActiveKey}
                    onChange={this.tabChange}
                >
                    {evaluateUserKeys.some(v => v.key === '1')
                    ? <TabPane tab="月度评价" key="1" style={{padding: '0 20px'}}>
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
                        />
                    </TabPane>
                    : false}
                    {evaluateUserKeys.some(v => v.key === '2')
                    ? <TabPane tab="季度评价" key="2">
                        <FilterBox
                            filterData={this.getQuarterFilterBoxData()}
                        />
                        <Table
                            columns={this.quarterTableColumns}
                            dataSource={this.getQuarterDataScore(quarterIndexData.DataRows)}
                            className={tableStyle.financeTable + ' ' + evaluteStyle.pointTable}
                            pagination={{
                                current: quarterCurrentPage,
                                onChange: page => this.pageChange(page, 'month'),
                                total: quarterIndexData.totalCount
                            }}
                            style={{marginTop: 15}}
                            loading={quarterIndexDataLoading}
                            onRowClick={this.quarterIndexRowClick}
                        />
                    </TabPane>
                    : false}
                </Tabs>
            </div>
        )
    }
}

const mapStateToProps = ({trackModel, loading}) => ({
    loading: loading.models.trackModel,
    ...trackModel
})

export default connect(mapStateToProps)(TrackEvaluate);