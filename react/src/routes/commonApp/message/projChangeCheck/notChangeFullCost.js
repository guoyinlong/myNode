/**
 * 作者：邓广晖
 * 创建日期：2017-11-16
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目变更里面的全成本功能
 */
import {Table} from 'antd';
import styles from '../../../project/monitor/change/projChangeApply/projChangeFullCost.less';
import config from '../../../../utils/config';
import SquareTab from '../../../project/monitor/change/projChangeApply/squareTab';

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

/**
 * 作者：邓广晖
 * 创建日期：2017-11-16
 * 功能：实现项目变更全程本
 */
class NotChangeFullCost extends React.PureComponent {

    columns = [
        {
            title: '序号',
            dataIndex: '',
            render: (value, row, index) => {
                return (index + 1);
            }
        },
        {
            title: '配合部门',
            dataIndex: 'dept_name',
            render: (value, row, index) => {
                return (<div style={{textAlign: 'left'}}>{value + row.NewOldFlag}</div>);
            }
        },
        {
            title: '配合方联系人',
            dataIndex: 'mgr_name',
            render: (value, row, index) => {
                return (<div style={{textAlign: 'left'}}>{value}</div>);
            }
        }
    ];

    /**
     * 点击子tab的切换
     * @param key
     */
    childTabChangeClick = (key) => {
        this.props.dispatch({
            type: 'projChangeCheck/childTabChangeClick',
            key,
        });
    }


    render() {

        let {isShowTabINFullCost, tabListArr, squareTabKey} = this.props;
        // let tabListItem = tabListArr.filter(item=>item.tab_name === squareTabKey)[0]

        // 全成本子tab
        let tabListDiv = []; // 子tab的各个标签div
        if (isShowTabINFullCost === '1') {
            tabListDiv = tabListArr.map((item, index) => {
                if (item.tab_flag === '0' || item.tab_flag === '2') {
                    return <div
                        name={item.tab_name}
                        value={item.tab_name}
                        // styleFlag={item.tab_flag_change} //没变化 0,在tab页面显示灰色
                        // delLine={item.is_del_pms} // 是否有删除线
                        key={item.tab_name}
                        className={item}
                    />
                } else if (item.tab_flag === '1') {
                    return <div
                        name={`PMS${index}预算`}
                        value={item.tab_name}
                        // styleFlag={item.tab_flag_change} //没变化 0,在tab页面显示灰色
                        // delLine={item.is_del_pms} // 是否有删除线
                        key={item.tab_name}
                        className={item}
                    >
                        <span>PMS编码：{item.pms_code} （ {item.pms_name} ） </span>
                    </div>
                }
            })
        }

        let budgetColumns = [
            {
                title: '年度',
                dataIndex: 'year',
                fixed: 'left',
                width: 100,
                render: (value, row, index) => {
                    if ('yearOptType' in row && row.yearOptType === 'total') {
                        return value;
                    } else {
                        return {
                            children: value,
                            props: {rowSpan: row.yearRowSpan},
                        };
                    }
                },
            },
            {
                title: '费用类别',
                dataIndex: 'fee_name',
                fixed: 'left',
                width: 350,
                render: (value, row, index) => {
                    return (<div style={{textAlign: 'left', paddingLeft: row.padLeft}}>{value}</div>);
                },
            },
        ];

        for (let i = 0; i < this.props.allDeptList.length; i++) {
            budgetColumns.push({
                title: this.props.allDeptList[i].dept_name + this.props.allDeptList[i].NewOldFlag,
                dataIndex: 'dept' + i.toString(),
                render: (value, row, index) => {
                    //如果是预算项，保留千分位，并且为两位小数
                    if (row.feeType === '1') {
                        return (<div style={{textAlign: 'right'}}>{change2Thousands(value)}</div>);
                    } else {
                        return (<div style={{textAlign: 'right'}}>{value}</div>);
                    }
                },
            });
        }
        budgetColumns.push({
            title: '小计',
            dataIndex: 'total',
            fixed: 'right',
            width: config.FULLCOST_TOTAL,
            render: (value, row, index) => {
                //如果是预算项，保留千分位，并且为两位小数
                if (row.feeType === '1') {
                    return (<div style={{textAlign: 'right'}}>{change2Thousands(value)}</div>);
                } else {
                    return (<div style={{textAlign: 'right'}}>{value}</div>);
                }
            }
        });

        return (
            <div>
                <div>
                    <SquareTab
                        activeKey={squareTabKey}
                        onTabsClick={(key) => this.childTabChangeClick(key)}
                    >
                        {tabListDiv}
                    </SquareTab>
                </div>
                <div style={{
                    fontWeight: 'bold',
                    fontSize: 17,
                    color: 'red',
                    textAlign: 'center',
                    marginBottom: 13
                }}>{config.PROJ_IS_CHANGE}</div>
                <div className={styles.predictTime}>
                    <span>{config.PREDICT_TIME_TOTAL}</span><span>{this.props.predictTimeTotal}</span>{'人月'}</div>
                <h2 className={styles.headerName}>{config.COORP_DEPT_INFO}</h2>
                <Table columns={this.columns}
                       dataSource={this.props.coorpDeptList}
                       pagination={false}
                       className={styles.fcTable + ' ' + styles.deptsTable}
                />
                <br/>
                <h2 className={styles.headerName}>{config.DEPT_BUDGET_INFO}</h2>
                <Table columns={budgetColumns}
                       dataSource={this.props.deptBudgetTableData}
                       pagination={false}
                       loading={this.props.loading}
                       className={styles.fcTable + ' ' + styles.deptsTable}
                       scroll={{x: 300 * this.props.allDeptList.length}}
                />

            </div>
        );
    }
}

export default NotChangeFullCost;
