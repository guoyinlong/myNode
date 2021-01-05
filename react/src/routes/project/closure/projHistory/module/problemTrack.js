/**
 *  作者: 夏天
 *  创建日期: 2018-09-26
 *  邮箱：1348744578@qq.com
 *  文件说明：项目历史-详情-问题跟踪
 */
import React from 'react';
import { Table, Modal, Button } from 'antd';
import ProblemTrackDetail from './problemTrackDetail';

import styles from '../../../startup/projStartMain/projStartMain.less';

class ProblemTrack extends React.Component {
    state = {
        visible: false,
    };
    showModal = (id) => {
        this.props.dispatch({
            type: 'projHistoryDetail/queryProblemDetail',
            argId: id,
        });
        this.setState({
            visible: true,
        });
    }
    handleOkOrCancel = () => {
        this.setState({
            visible: false,
        })
    }
    columns = [{
        title: '序号',
        dataIndex: '',
        width: '2%',
        render: (text, record, index) => {
            return <div>{index + 1}</div>;
        },
    }, {
        title: '问题id',
        dataIndex: 'id',
        width: '3%',
    }, {
        title: '问题类别',
        dataIndex: 'category',
        width: '3%',
    }, {
        title: '问题描述',
        dataIndex: 'issue',
        width: '4%',
    }, {
        title: '识别日期',
        dataIndex: 'recog-date',
        width: '3%',
    }, {
        title: '影响范围描述',
        dataIndex: 'range-desc',
        width: '4%',
    }, {
        title: '应对措施',
        dataIndex: 'measure',
        width: '3%',
    }, {
        title: '责任人',
        dataIndex: 'staff_name',
        width: '2%',
    }, {
        title: '问题状态',
        dataIndex: 'state',
        width: '3%',
    }, {
        title: '计划完成日期',
        dataIndex: 'plan_time',
        width: '4%',
    }, {
        title: '实际完成日期',
        dataIndex: 'resolve_time',
        width: '4%',
    }, {
        title: '操作',
        width: '3%',
        render: (text, record, index) => {
            return (<Button onClick={() => this.showModal(record.id)}>查看</Button>);
        },
    }]

    render() {
        return (
            <div>
                <Table
                    columns={this.columns}
                    dataSource={this.props.problemTrackList}
                    bordered
                    className={styles.mileStoneTable}
                    rowKey="id"
                />
                <Modal
                    title="问题详情"
                    visible={this.state.visible}
                    onOk={this.handleOkOrCancel}
                    onCancel={this.handleOkOrCancel}
                    width={960}
                    bodyStyle={{ paddingLeft:30,paddingRight:30 }}
                    footer={[
                        <Button key="back" type="primary" onClick={this.handleOkOrCancel}>关闭</Button>
                    ]}
                >
                    <ProblemTrackDetail
                        riskTrackDetail={this.props.riskTrackDetail}
                        problemTrackDetail={this.props.problemTrackDetail}
                    />
                </Modal>
            </div>
        );
    }
}

export default ProblemTrack;
