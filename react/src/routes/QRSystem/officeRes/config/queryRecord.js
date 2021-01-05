/**
  * 作者： 王均超
  * 创建日期：2019-07-02
  * 邮箱:  wangjc@itnova.com.cn
  * 功能： 查询记录
  */
import React from 'react';

import { Button, Modal, Input, Table, message, DatePicker, Row, Col } from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

class QueryRecord extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            isShowDetailModal: false,
            // 申请时间段  是个数组[Date, Date]
            applyRangeDate: null,
            // 到期时间段  是个数组[Date, Date]
            dueDateRange: null,
            tableColumns: [
                {
                    title: '申请时间',
                    dataIndex: 'apply_time',
                    width: 100,
                },
                {
                    title: '申请数量',
                    dataIndex: 'num',
                    width: 100,
                },

                {
                    title: '申请天数',
                    dataIndex: 'days',
                    width: 100,
                },
                {
                    title: '开始时间',
                    dataIndex: 'begin_time',
                    width: 100,
                },
                {
                    title: '到期时间',
                    dataIndex: 'end_time',
                    width: 100,
                },
                {
                    title: '申请类型',
                    dataIndex: 'type_id',
                    width: 100,
                },
                {
                    title: '申请状态',
                    dataIndex: 'state',
                    width: 100,
                },
            
            ],


        };
    }

    // 申请时间 段
    applyRangeDateChange(dateArr, dateString) {
        this.setState({
            applyRangeDate: dateArr
        })
    }
    // 到期时间 段
    dueDateRangeChange(dateArr, dateString) {
        this.setState({
            dueDateRange: dateArr
        })
    }

    getStateAction() {
        const { applyRangeDate, dueDateRange,  } = this.state;
        const userInput = { applyRangeDate, dueDateRange,  };
        console.dir(userInput);
    }

    render() {
        const { queryList } = this.props;
        const { tableColumns } = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        return (
            <div className={styles.wrapper + ' ' + styles.delayWorkstation}>
                <h2 style={{ textAlign: 'center', marginBottom: 30 }} >申请记录查询</h2>
                <div className={styles.buttonWrapper}>
                    <div>
                        部门：<span>公共平台与架构研发事业部</span>
                    </div>
                    <div >
                        <Button type="primary" onClick={this.getStateAction.bind(this)} style={{ float: 'right', marginRight: -19 }}>返回</Button>
                    </div>
                </div>          
                <div className={styles['date-range']}>
                    <div className={styles['apply-date']}>
                        申请时间查询：<RangePicker onChange={this.applyRangeDateChange.bind(this)} />
                    </div>
                    <div className={styles['due-date']}>
                        到期时间查询：<RangePicker onChange={this.dueDateRangeChange.bind(this)} />
                    </div>
                </div>

                <div className={styles['table-container']}>
                    <Table rowSelection={rowSelection} columns={tableColumns} rowKey="apply_id" dataSource={queryList} className={styles.orderTable} />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { query, queryList } = state.queryRecord  ;
    return {
        loading: state.loading.models.queryRecord  ,
        query,
        queryList
    };
}

export default connect(mapStateToProps)(QueryRecord);
