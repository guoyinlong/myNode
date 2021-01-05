/**
 * 文件说明：组织绩效考核指标填报
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-9-16
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Table, Select, Input, Button} from 'antd';
import tableStyle from '../../../../components/finance/table.less';
import wrapStyle from '../../../../components/finance/finance.less';
import statusStyle from '../common/statusColor.less';
import evaluteStyle from '../evaluate/evaluateStyle.less';
import reportStyle from './reportStyle.less';
import {statusMap, unitMap} from '../common/mapInformation';
let timer = null;

class Report extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            rules: {
                year: new Date().getFullYear() + '',
                unit: '',
                applicantName: '',
                status: '',
                pageNo: 1,
            }
        }
    }

    getColums = () => ([
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
            render: text => unitMap[text]
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
            render: (text, record) => (
                <span className={statusStyle[record.statusClass]}>{statusMap[text]}</span>
            )
        },
        {
            title: '得分',
            dataIndex: 'score',
            key: 'score'
        },
        {
            title: '操作',
            dataIndex: 'handle',
            key: 'handle',
            render: (text, record) => (
                <Button
                    type="primary"
                    onClick={e => this.exportExl(e, record)}
                    disabled={record.status == 0 ? true : false}
                >导出</Button>
            )
        }
    ])
    // 导出指标
    exportExl = (e, record) => {
        e.stopPropagation()
        window.open('/examineservice/index/indexservlet/exportExcel?indexId=' + record.id);
    }
    // 点击行
    onRowClick = (record) => {
        const {id, totalScore, score, status, unit, year} = record;
        const {dispatch, location} = this.props;
        const pathname = location.pathname === '/financeApp/examine/query'
            ? '/financeApp/examine/query/queryDetail'
            : '/financeApp/examine/report/reportDetail';
        dispatch(routerRedux.push({
            pathname,
            query: {
                indexId: id,
                totalScore,
                score,
                status,
                unit,
                year
            }
        }));
    }
    // 获取dataSource
    getDataSource = (list = []) => list.map((v, i) => ({
        ...v,
        index: i + 1 + '',
        key: v.id,
        status: v.status,
        unit: v.unit,
        statusClass: 'status' + v.status
    }))
    // 获取年份数据
    getYearData = () => {
        const currentYear = new Date().getFullYear();
        let optionDate = [];
        for (let i = 2019; i <= currentYear; i++) {
            optionDate.push({
                key: i + '',
                value: i + '',
                text: i
            })
        }
        return {
            type: 'select',
            title: '年份',
            key: 'year',
            options: optionDate,
            width: '80%',
            value: this.state.rules.year
        };
    }
    // 获取部门数据
    getUnitData = () => {
        const optionData = unitMap.map((v, i) => ({
            key: i + '',
            value: i + '',
            text: v
        }));
        optionData.unshift({
            key: 'all',
            value: '',
            text: '全部'
        });
        return {
            type: 'select',
            title: '部门（分院）',
            key: 'unit',
            options: optionData,
            width: '80%',
            value: this.state.rules.unit
        }
    }
    // 获取姓名数据
    getNameData = () => ({
        type: 'input',
        title: '姓名',
        key: 'applicantName',
        width: '80%',
        value: this.state.rules.applicantName
    })
    // 获取状态数据
    getStatusData = () => {
        const optionData = ['待评价', '评价完成'].map((v, i) => ({
            key: i + 1 + '',
            value: i + 1 + '',
            text: v
        }));
        optionData.unshift({
            key: 'all',
            value: '',
            text: '全部'
        })
        return {
            type: 'select',
            title: '状态',
            key: 'status',
            options: optionData,
            width: '80%',
            value: this.state.rules.status
        }
    }

    // 筛选列表
    getFilter = (filterData = []) => filterData.map(v => {
        return (
            <li key={v.key}>
                <span>{v.title}：</span>
                {
                    v.type === 'select'
                        ? <Select
                            onChange={value => this.indexSelect(value, v.key)}
                            style={{width: v.width}}
                            value={v.value}
                        >
                            {v.options.map(item => (
                                <Select.Option
                                    value={item.value}
                                    key={item.key}
                                >
                                    {item.text}
                                </Select.Option>
                            ))}
                          </Select>
                        : <Input
                            onChange={e => this.indexSelect(e.target.value, v.key)}
                            style={{width: v.width}}
                            value={v.value}
                        />
                }
            </li>
        )
    })
    // 选择时
    indexSelect = (value, key) => {
        const {dispatch} = this.props;
        const rules = {
            ...this.state.rules,
            [key]: value
        };
        this.setState({
            rules: {
                ...rules
            },
        }, () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const payload = this.clearNullParams(this.state.rules);
                dispatch({
                    type: 'indexModel/getIndexList',
                    payload
                });
            }, 500)
            
        });
    }
    // 获取筛选列表数据
    getFilterData = () => {
        const {location} = this.props;
        const pathname = location.pathname;
        if (pathname === '/financeApp/examine/query') {
            return [this.getYearData(), this.getUnitData(), this.getNameData(), this.getStatusData()];
        } else {
            return [this.getYearData()];
        }
    }
    // 获取pagination
    getPagination = () => {
        const {location, indexTotalCount} = this.props;
        const pathname = location.pathname;
        return pathname === '/financeApp/examine/query'
            ? {
                total: indexTotalCount,
                onChange: pageNo => {
                    const {dispatch} = this.props;
                    this.setState({
                        rules: {
                            ...this.state.rules,
                            pageNo
                        }
                    }, () => {
                        dispatch({
                            type: 'indexModel/getIndexList',
                            payload: {
                                ...this.clearNullParams(this.state.rules)
                            }
                        });
                    });
                }
              }
            : false
    }
    // 清除条件
    clearRules = () => {
        const {dispatch} = this.props;
        this.setState({
            rules: {
                ...this.state.rules,
                year: '2019',
                unit: '',
                applicantName: '',
                status: ''
            }
        }, () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                dispatch({
                    type: 'indexModel/getIndexList',
                    payload: {
                        ...this.clearNullParams(this.state.rules)
                    }
                });
            }, 500);
        });
    }
    // 清除空选项
    clearNullParams = params => {
        let options = {};
        for (let v in params) {
            if (params[v]) {
                options[v] = params[v]
            }
        }
        return options;
    }
    
    render() {
        const {indexList, loading, location} = this.props;
        const columns = this.getColums();
        const dataSource = this.getDataSource(indexList);
        return (
            <div className={wrapStyle.wrap}>
                <ul className={reportStyle.searchList}>
                    {this.getFilter(this.getFilterData())}
                    {location.pathname === '/financeApp/examine/query'
                        ? <li>
                            <Button type="primary" onClick={this.clearRules}>重置条件</Button>
                          </li>
                        : false}
                </ul>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    className={tableStyle.financeTable + ' ' + evaluteStyle.pointTable}
                    onRowClick={this.onRowClick}
                    pagination={this.getPagination()}
                    loading={loading}
                />
            </div>
        )
    }
}

const mapStateToProps = ({indexModel, loading}) => ({
    loading: loading.models.indexModel,
    ...indexModel
})

export default connect(mapStateToProps)(Report);
