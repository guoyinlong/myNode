/**
 * 文件说明：组织绩效考核指标评价
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-9-16
 */

import {PureComponent} from 'react';
import {Table, Button} from 'antd';
import SearchBox from './searchBox';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {statusMap, unitMap, indexTypeMap} from '../common/mapInformation';
import tableStyle from '../../../../components/finance/table.less';
import wrapStyle from '../../../../components/finance/finance.less';
import statusStyle from '../common/statusColor.less';
import evaluateStyle from './evaluateStyle.less';

class Evaluate extends PureComponent {
    constructor(props) {
        super(props);
    }
    // 获取表头
    getColumns = () => ([
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
            key: 'unit'
        },
        {
            title: '指标类型',
            dataIndex: 'type',
            key: 'type'
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
                <span className={statusStyle[record.statusClass]}>{text}</span>
            )
        },
        {
            title: '得分',
            dataIndex: 'score',
            key: 'score'
        }
    ])
    // 获取表数据
    getDataScore = (list = []) => list.map((v, i) => ({
        ...v,
        index: i + 1 + '',
        status: statusMap[v.status],
        unit: unitMap[v.unit],
        type: indexTypeMap[v.type],
        key: i,
        statusClass: 'status' + v.status
    }))
    // 点击行
    onRowClick = (record) => {
        const {flowId, flowLinkId, tag, taskUUID, taskBatchid, ableRefuse, year} = record;
        const {dispatch} = this.props;
        const query = {
            flowId,
            flowLinkId,
            tag,
            taskUUID,
            taskBatchid,
            ableRefuse,
            year
        }
        dispatch(routerRedux.push({
            pathname: '/financeApp/examine/evaluate/evaluateDetail',
            query
        }))
    }

    render() {
        const {indexEvaluateList, totalCount, dispatch} = this.props;
        const columns = this.getColumns();
        const dataSource = this.getDataScore(indexEvaluateList);
        const pagination = {
            defaultCurrent: 1,
            total: totalCount,
            onChange(pageNo) {
                dispatch({
                    type: 'indexModel/getSearchRules',
                    rules: {
                        pageNo
                    }
                })
            }
        };

        return (
            <div className={wrapStyle.wrap}>
                <SearchBox />
                <div id="gradeTableWrap">
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        className={tableStyle.financeTable + ' ' + evaluateStyle.pointTable}
                        onRowClick={this.onRowClick}
                        pagination={pagination}
                        loading={this.props.indexEvaluateListLoading}
                    />
                </div>
            </div>
        )
    }
}

const mapStatesToProps = ({indexModel, loading}) => ({
    ...indexModel,
    loading: loading.models.indexModel
})

export default connect(mapStatesToProps)(Evaluate);
