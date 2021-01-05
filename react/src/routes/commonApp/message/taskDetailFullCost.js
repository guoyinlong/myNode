/**
 * 作者：邓广晖
 * 创建日期：2018-01-09
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目启动中已立项的全成本页面
 */

import { Table } from 'antd';
import styles from '../../project/startup/projAdd/projStartFullCost.less';
import config from '../../../utils/config';
import SquareTab from '../../project/monitor/change/projChangeApply/squareTab';

/**
 * 作者：邓广晖
 * 创建日期：2018-01-17
 * 功能：转变为千分位
 * @param value 输入的值
 */
function change2Thousands (value) {
    if(value !== undefined){
        return value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    }else{
        return '';
    }
}

/**
 * 作者：邓广晖
 * 创建日期：2018-01-09
 * 功能：已立项项目的全成本
 */
class ProjFullCost extends React.PureComponent {


    /**
     * 作者：邓广晖
     * 创建日期：2018-12-04
     * 功能：全成本tab中点击PMS
     * @param value 点中的tab的value
     */
    tabChangeClick = (value) => {
        if (value !== this.props.fullCostPmsTab.tabConvertName) {
            this.props.dispatch({
                type:'task/fullCostPmsTabClick',
                value
            });
        }
    };


    render(){
        let columns = [
            {
                title:'序号',
                dataIndex:'',
                render: (value,row,index) =>{return(index+1);}
            },
            {
                title: '配合部门',
                dataIndex: 'dept_name',
                render: (value,row,index) =>{
                    return (<div style={{textAlign:'left'}}>{value + row.NewOldFlag}</div>);
                }
            },
            {
                title: '配合方联系人',
                dataIndex: 'mgr_name',
                render: (value,row,index) =>{
                    // 在合计预算里面，配合方联系人可能返回多个，用 mgr 代表多个人
                    if (this.props.fullCostPmsTab.tab_flag === '2') {
                        return (<div style={{textAlign: 'left'}}>{row.mgr}</div>);
                    } else {
                        let showMgrName = row.mgr_name;
                        if (row.mgr_id !== null && row.mgr_id !== '' && row.mgr_id !== undefined) {
                            showMgrName += "(" + row.mgr_id + ")";
                        }
                        return (<div style={{textAlign:'left'}}>{showMgrName}</div>);
                    }
                }
            }
        ];

        let budgetColumns = [
            {
                title:'年度',
                dataIndex:'year',
                fixed: 'left',
                width:100,
                render: (value, row, index) => {
                    if('yearOptType' in row && row.yearOptType === 'total'){
                        return value;
                    }else{
                        return {
                            children:value,
                            props: {rowSpan:row.yearRowSpan},
                        };
                    }
                },
            },
            {
                title: '费用类别',
                dataIndex: 'fee_name',
                fixed: 'left',
                width:350,
                render: (value, row, index) => {
                    return (<div style={{textAlign:'left',paddingLeft:row.padLeft}}>{value}</div>);
                },
            },
        ];

        for(let i = 0 ;i < this.props.allDeptList.length; i++){
            budgetColumns.push({
                title:this.props.allDeptList[i].dept_name + this.props.allDeptList[i].NewOldFlag,
                dataIndex:'dept' + i.toString(),
                render: (value, row, index) => {
                    //如果是预算项，保留千分位，并且为两位小数
                    if(row.feeType === '1'){
                        return (<div style={{textAlign:'right'}}>{change2Thousands(value)}</div>);
                    }else{
                        return (<div style={{textAlign:'right'}}>{value}</div>);
                    }
                },
            });
        }
        budgetColumns.push({
            title: '小计',
            dataIndex: 'total',
            fixed: 'right',
            width: config.FULLCOST_TOTAL,
            render:(value,row,index)=>{
                //如果是预算项，保留千分位，并且为两位小数
                if(row.feeType === '1'){
                    return (<div style={{textAlign:'right'}}>{change2Thousands(value)}</div>);
                }else{
                    return (<div style={{textAlign:'right'}}>{value}</div>);
                }
            }
        });


        const pmsTabsList = this.props.fullCostPmsListData.map((item,index)=>{
            let pmsInfo = '';
            if (item.tab_flag === '1') {
                pmsInfo = 'PMS编码 : ' + item.pms_code + ' （ ' + item.pms_name + ' ）';
            }
            return (
                <div name={item.tabConvertName} value={item.tabConvertName} key={index}>
                    <span>{pmsInfo}</span>
                </div>
            )
        });

        return(
            <div>
                {
                    this.props.fullCostShowPmsTab === '1'
                        ?
                        <SquareTab
                            activeKey={this.props.fullCostPmsTab.tabConvertName}
                            onTabsClick={this.tabChangeClick}
                        >
                            {pmsTabsList}
                        </SquareTab>
                        :
                        ''
                }
                <div className={styles.predictTime}><span>{config.PREDICT_TIME_TOTAL}</span><span>{this.props.predictTimeTotal}</span>{'人月'}</div>
                <h2 className={styles.headerName}>{config.COORP_DEPT_INFO}</h2>
                <Table
                    columns={columns}
                    dataSource={this.props.coorpDeptList}
                    pagination={false}
                    className={styles.fcTable+' '+styles.deptsTable}
                />
                <br/>
                <h2 className={styles.headerName}>{config.DEPT_BUDGET_INFO}</h2>
                <Table
                    columns={budgetColumns}
                    dataSource={this.props.deptBudgetTableData}
                    pagination={false}
                    className={styles.fcTable+' '+styles.deptsTable}
                    scroll={{ x: 300*this.props.allDeptList.length }}
                />
            </div>
        );
    }
}

export default ProjFullCost;

