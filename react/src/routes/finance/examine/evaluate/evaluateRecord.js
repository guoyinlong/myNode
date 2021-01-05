/**
 * 文件说明：组织绩效考核指标评分记录
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-9-19
 */
import {PureComponent} from 'react';
import {Table} from 'antd';
import {flowStatusMap, operateTypeMap} from '../common/mapInformation';
import tableStyle from '../../../../components/finance/table.less';

class EvaluateRecord extends PureComponent {
    constructor(props) {
        super(props);
    }
    // 小于10的数字前面加0
    numberSwitch = num => {
        return num < 10 ? '0' + num : num;
    }
    // 日期格式转换
    dateSwitch = dateString => {
        if (dateString) {
            const date = new Date(dateString);
            return `${
                        this.numberSwitch(date.getFullYear())
                    }-${
                        this.numberSwitch(date.getMonth() + 1)
                    }-${
                        this.numberSwitch(date.getDate())
                    } ${
                        this.numberSwitch(date.getHours())
                    }:${
                        this.numberSwitch(date.getMinutes())
                    }:${
                        this.numberSwitch(date.getSeconds())}`;
        }
        return '';
    }
    // 获取表头
    getColumns = () => ([
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record) => ({
                children: text,
                props: {
                    rowSpan: record.rowSpan
                }
            })
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => ({
                children: flowStatusMap[text],
                props: {
                    rowSpan: record.rowSpan
                }
            })
        },
        {
            title: '审批环节',
            dataIndex: 'role',
            key: 'role'
        },
        {
            title: '打分情况',
            dataIndex: 'operateType',
            key: 'operateType',
            render: text => ({
                children: operateTypeMap[text]
            })
        },
        {
            title: '打分意见',
            dataIndex: 'opinion',
            key: 'opinion',
            width: 300
        },
        {
            title: '审核时间',
            dataIndex: 'reviewTime',
            key: 'reviewTime',
            render: text => ({
                children: this.dateSwitch(text)
            })
        }
    ])
    // 获取表格数据
    getDataSource = () => {
        const {evaluateRecordList} = this.props;
        return this.addRowSpan(evaluateRecordList);
    }
    // 添加rowSpan属性
    addRowSpan = (list = []) => {
        let arr = [];
        let count = 0;
        let flowLinkUsersCount = 0;
        for (let i = 0, len = list.length; i < len; i++) {
            const flowLinkUsers = list[i].flowLinkUsers;
            const flowLinkUsersLen = flowLinkUsers.length;
            for (let item of flowLinkUsers || []) {
                if (count === flowLinkUsersCount) {
                    arr.push({
                        ...item,
                        index: i + 1,
                        status: list[i].status,
                        rowSpan: flowLinkUsersLen,
                        key: item.id
                    });
                } else {
                    arr.push({
                        ...item,
                        index: i + 1,
                        status: list[i].status,
                        rowSpan: 0,
                        key: item.id
                    })
                }
                count++;
            }
            flowLinkUsersCount += flowLinkUsersLen;
        }
        return arr;
    }

    render() {
        return (
            <Table
                className={tableStyle.financeTable}
                columns={this.getColumns()}
                dataSource={this.getDataSource()}
                pagination={false}
            />
        )
    }
}

export default EvaluateRecord;
