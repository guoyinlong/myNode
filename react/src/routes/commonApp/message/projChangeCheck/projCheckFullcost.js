/**
 * 作者：邓广晖
 * 创建日期：2017-11-5
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目变更审核全成本的预览
 */
import {Table, Icon, Spin} from 'antd';
import styles from './projCheck.less';
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
 * 创建日期：2017-11-5
 * 功能：变更项目审核全成本
 */
class ProjCheckFullcost extends React.PureComponent {
    coorpColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (value, row, index) => {
                return {
                    children: value,
                    props: {rowSpan: row.rowSpan},
                };
            },
        },
        {
            title: '标题',
            dataIndex: 'name',
            render: (value, row, index) => {
                return (<div style={{textAlign: 'left', color: row.newColor}}>{value}</div>);
            }
        },
        {
            title: '原内容',
            dataIndex: 'oldContent',
            render: (value, row, index) => {
                if (row.is_delete === '1') {
                    return (<del style={{color: 'red', textAlign: 'left'}}>
                        <div style={{color: '#345669'}}>{value}</div>
                    </del>);
                } else {
                    return (<div style={{textAlign: 'left'}}>{value}</div>);
                }
            }
        },
        {
            title: '新内容',
            dataIndex: 'newContent',
            render: (value, row, index) => {
                return (<div style={{color: row.newColor, textAlign: 'left',}}>{value}</div>);
            }
        }
    ];
    budgetColumns = [
        {
            title: '部门',
            dataIndex: 'deptName',
            width: '13%',
            render: (value, row, index) => {
                if ('feeIsDelete' in row && row.feeIsDelete === true) {
                    return {
                        children: <del style={{color: 'red', textAlign: 'left'}}>
                            <div style={{color: '#345669'}}>{value}</div>
                        </del>,
                        props: {rowSpan: row.deptRowSpan},
                    };
                } else {
                    return {
                        children: <div style={{textAlign: 'left'}}>{value}</div>,
                        props: {rowSpan: row.deptRowSpan},
                    };
                }
            },
        }, {
            title: '年度',
            dataIndex: 'year',
            render: (value, row, index) => {
                return {
                    children: value,
                    props: {rowSpan: row.yearRowSpan},
                };
            }
        }, {
            title: '费用类型',
            dataIndex: 'feeType',
            render: (value, row, index) => {
                if (Number(row.newMoney) !== Number(row.oldMoney) || row.isAdd || row.feeIsDelete) {
                    return (
                        <div style={{textAlign: 'left', paddingLeft: row.deptNamePadLeft, color: 'red'}}>{value}</div>);
                } else {
                    return (<div style={{textAlign: 'left', paddingLeft: row.deptNamePadLeft}}>{value}</div>);
                }

            }
        }, {
            title: '原值',
            dataIndex: 'oldMoney',
            render: (value, row, index) => {
                if(row.isAdd){
                    return (<div style={{textAlign: 'right'}}>-</div>);
                }else if ('feeIsDelete' in row && row.feeIsDelete === true ) { // 删除条件 Number(value) !== 0
                    if (row.kindOfFee === '1') {
                        return (
                            <del style={{color: 'red', textAlign: 'right'}}>
                                <div style={{color: '#345669'}}>{change2Thousands(value)}</div>
                            </del>
                        );
                    } else {
                        return (
                            <del style={{color: 'red', textAlign: 'right'}}>
                                <div style={{color: '#345669'}}>{value}</div>
                            </del>
                        );
                    }
                } else {
                    if (row.kindOfFee === '1') {
                        return (<div style={{textAlign: 'right'}}>{change2Thousands(value)}</div>);
                    } else {
                        return (<div style={{textAlign: 'right'}}>{value}</div>);
                    }

                }
            }
        }, {
            title: '新值',
            dataIndex: 'newMoney',
            render: (value, row, index) => {
                if(row.feeIsDelete){
                    return (<div style={{textAlign: 'right'}}>-</div>);
                }else if (Number(value) !== Number(row.oldMoney) || row.isAdd) { // 新增的0费用项显示红色
                    if (row.kindOfFee === '1') {
                        return (<div style={{color: 'red', textAlign: 'right'}}>{change2Thousands(value)}</div>);
                    } else {
                        return (<div style={{color: 'red', textAlign: 'right'}}>{value}</div>);
                    }
                } else {
                    if (row.kindOfFee === '1') {
                        return (<div style={{textAlign: 'right'}}>{change2Thousands(value)}</div>);
                    } else {
                        return (<div style={{textAlign: 'right'}}>{value}</div>);
                    }
                }
            }
        }, {
            title: '对比',
            dataIndex: 'compare',
            render: (value, row, index) => {
                if (row.newMoney !== row.oldMoney && row.oldMoney !== '') {
                    if (Number(row.newMoney) === 0 || Number(row.oldMoney) === 0) {
                        return ('');
                    }
                    let rate = (Number(row.newMoney) - Number(row.oldMoney)) / Number(row.oldMoney);
                    let rateShow = (rate * 100).toFixed(2) + '%';
                    if (rate > 0) {
                        return (
                            <div style={{color: 'red'}}>
                                <span style={{color: 'red'}}>{rateShow}</span>
                                <Icon type={'arrow-up'}/>
                            </div>
                        );
                    } else if (rate < 0) {
                        return (
                            <div style={{color: 'green'}}>
                                <span style={{color: 'green'}}>{rateShow}</span>
                                <Icon type={'arrow-down'}/>
                            </div>
                        );
                    }
                } else {
                    return ('');
                }
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

    constructor(props) {
        super(props);
    }

    render() {
        let {isShowTabINFullCost, tabListArr, squareTabKey} = this.props;
        // let tabListItem = tabListArr.filter(item=>item.tab_name === squareTabKey)[0]

        // 全成本子tab
        let tabListDiv = []; // 子tab的各个标签div
        if (isShowTabINFullCost === '1') {
            tabListDiv = tabListArr.map((item, index) => {
                if (item.tab_flag === '0' || item.tab_flag === '2') {
                    return <div name={item.tab_name}
                                value={item.tab_name}
                                // styleFlag={item.tab_flag_change} //没变化 0,在tab页面显示灰色
                                // delLine={item.is_del_pms} // 是否有删除线
                                className={item}
                                key={item.tab_name}/>
                } else if (item.tab_flag === '1') {
                    return <div name={`PMS${index}预算`}
                                value={item.tab_name}
                                // styleFlag={item.tab_flag_change} //没变化 0,在tab页面显示灰色
                                // delLine={item.is_del_pms} // 是否有删除线
                                className={item}
                                key={item.tab_name}>
                        <span>PMS编码：{item.pms_code} （ {item.pms_name} ） </span>
                    </div>
                }
            })
        }

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

                <div className={styles.coorpDept}>{config.COORP_DEPT_INFO}</div>
                <Table dataSource={this.props.coorpDeptCompList}
                       columns={this.coorpColumns}
                       pagination={false}
                       className={styles.fullCostDeptTable}
                />
                <br/><br/>
                <div className={styles.coorpDept}>{config.DEPT_BUDGET_INFO}</div>
                <Table dataSource={this.props.compBudgetTableData}
                       columns={this.budgetColumns}
                       pagination={false}
                       className={styles.fullCostDeptTable}
                />
            </div>
        )
    }
}

export default ProjCheckFullcost;
