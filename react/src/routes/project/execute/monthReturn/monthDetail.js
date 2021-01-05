/**
 * 作者：夏天
 * 创建日期：2018-10-18
 * 邮件：1348744578@qq.com
 * 文件说明：周报月报-月报详细（退回页面）
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Modal, Select, Table, Pagination, Spin, Row, Col, Popconfirm } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../../startup/projStartUp.less';
import config from '../../../../utils/config';

const Option = Select.Option;
const confirm = Modal.confirm;
class MonthDetail extends React.Component {

    /**
 * 作者：夏天
 * 创建日期：2018-10-18
 * 功能：跳转到月报详细页面
 * @param record 表格的一条记录
 */
    goBack = () => {
        const { dispatch } = this.props;
        dispatch(routerRedux.push({
            pathname: '/projectApp/projExecute/weekAndMonth',
            query: {
                payload: JSON.stringify({
                    ou_name: this.props.ou_name,
                    pu_deptid: this.props.pu_deptid,
                    proj_label: this.props.proj_label,
                    proj_code: this.props.proj_code,
                    proj_name: this.props.proj_name,
                    dept_name: this.props.dept_name,
                    mgr_name: this.props.mgr_name,
                    proj_type: this.props.proj_type,
                    staff_id: this.props.staff_id,
                    page: this.props.page,
                    condCollapse: this.props.condCollapse
                })
            }
        }));
    };
    // 保存搜索框中数据
    setSelectShow = (key) => {
        this.props.dispatch({
            type: 'monthDetail/setProjTag',
            value: key
        });
    };
    // 退回月报
    returnMonth = (record) => {
        const { dispatch } = this.props;
        confirm({
            title: '确定退回该项目' + record.proj_year + '年' + record.proj_month + '月的月报到草稿状态吗？',
            content: '一旦退回将无法恢复',
            onOk() {
                dispatch({
                    type: 'monthDetail/returnOrDeleteMonth',
                    record: record,
                    arg_flag: '0',
                });
            },
            onCancel() { },
            width: 500
        })
    };
    // 删除月报
    deleteMonth = (record) => {
        const { dispatch } = this.props;
        confirm({
            title: '确定删除该项目' + record.proj_year + '年' + record.proj_month + '月的月报吗？',
            content: '一旦删除将无法恢复',
            onOk() {
                dispatch({
                    type: 'monthDetail/returnOrDeleteMonth',
                    record: record,
                    arg_flag: '1',
                });
            },
            onCancel() { },
            width: 500
        })
    }
    columns = [
        {
            title: '序号',
            dataIndex: '',
            width: '2%',
            render: (text, record, index) => {
                return <div>{index + 1}</div>;
            },
        }, {
            title: '年份',
            dataIndex: 'proj_year',
            width: '5%',
        }, {
            title: '月份',
            dataIndex: 'proj_month',
            width: '5%',
        }, {
            title: '状态',
            dataIndex: 'tag_show',
            width: '5%',
            render: (text, record, index) => {
                if (record.tag_show === '未填写') {
                    return (<div style={{ color: '#FF0000' }}>{record.tag_show}</div>)
                } else if (record.tag_show === '已保存') {
                    return (<div style={{ color: 'orange' }}>{record.tag_show}</div>)
                } else if (record.tag_show === '已提交') {
                    return (<div style={{ color: 'green' }}>{record.tag_show}</div>)
                }
            }
        }, {
            title: '操作',
            dataIndex: '',
            width: '5%',
            render: (text, record, index) => {
                return (
                    <div>
                        <Button
                            size="small"
                            type="primary"
                            disabled={!(record.tag == '1' && this.props.is_edit == '1')}
                            onClick={() => this.returnMonth(record)}
                        >
                            退回
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                            size='small'
                            type="primary"
                            disabled={!(record.tag != '2' && this.props.is_edit == '1')}
                            onClick={() => this.deleteMonth(record)}
                        >
                            删除
                        </Button>
                    </div >
                )
            }
        },
    ]
    render() {
        const { monthDetailList, monthTypeList } = this.props;
        const typeOption = monthTypeList.map((item, index) => {
            return (
                <Option key={item.tag} value={item.tag}>{item.tag_show}</Option>
            )
        });
        return (
            <Spin tip={config.IS_LOADING} spinning={this.props.loading}>
                <div style={{ paddingTop: 13, paddingBottom: 16, background: 'white', paddingLeft: 15, paddingRight: 15 }}>
                    <div><p style={{ textAlign: 'center', fontSize: '20px', marginBottom: '10px' }}>{this.props.proj_name_title}</p></div>
                    <div style={{ marginBottom: 5, marginTop: 25 }}>
                        <span >月报状态：</span>
                        <Select
                            showSearch
                            style={{ width: 180 }}
                            value={this.props.type_tag}
                            onSelect={(key) => this.setSelectShow(key)}
                        >
                            {typeOption}
                        </Select>
                    </div>
                    <div style={{ textAlign: 'right', marginBottom: 5, marginTop: 5 }}>
                        <Button
                            onClick={() => this.goBack()}
                            type="primary"
                        >
                            返回
                            </Button>
                    </div>

                    <Table
                        columns={this.columns}
                        dataSource={monthDetailList}
                        className={styles.orderTable}
                        bordered={true}
                        pagination={false}
                        style={{ marginTop: '10px' }}
                        rowKey="key"
                    />
                </div>
            </Spin>
        )
    }
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.monthDetail,
        ...state.monthDetail
    }
}

export default connect(mapStateToProps)(MonthDetail);

