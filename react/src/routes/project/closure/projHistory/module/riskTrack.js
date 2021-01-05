/**
 *  作者: 夏天
 *  创建日期: 2018-09-25
 *  邮箱：1348744578@qq.com
 *  文件说明：项目历史-详情-风险跟踪
 */
import React from 'react';
import { Table, Modal, Button } from 'antd';
import RiskTrackDetail from './riskTrackDetail';
import styles from '../../../startup/projStartMain/projStartMain.less';

class RiskTrack extends React.Component {
    state = {
        visible: false,
    };
    showModal = (id) => {
        this.props.dispatch({
            type: 'projHistoryDetail/riskDetailQuery',
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
    columns = [
        {
            title: '序号',
            dataIndex: '',
            width: '2%',
            render: (text, record, index) => {
                return <div>{index + 1}</div>;
            },
        }, {
            title: '风险id',
            dataIndex: 'id',
            width: '3%',
        }, {
            title: '风险项',
            dataIndex: 'risk',
            width: '3%',
        }, {
            title: '风险状态',
            dataIndex: 'state',
            width: '3%',
        }, {
            title: '责任人',
            dataIndex: 'staff_name',
            width: '3%',
        }, {
            title: '风险系数',
            dataIndex: 'coffi',
            width: '3%',
        }, {
            title: '识别日期',
            dataIndex: 'recog_date ',
            width: '3%',
        }, {
            title: '计划解决日期',
            dataIndex: 'plan_time',
            width: '3%',
        }, {
            title: '操作',
            width: '3%',
            render: (text, record, index) => {
                return (<Button size="small" onClick={() => this.showModal(record.id)}>查看</Button>);
            },
        },
    ]

    render() {
        return (
            <div>
                <Table
                    columns={this.columns}
                    dataSource={this.props.riskTrackList}
                    bordered
                    className={styles.mileStoneTable}
                    rowKey="id"
                />
                <Modal
                    title="风险详情"
                    visible={this.state.visible}
                    onOk={this.handleOkOrCancel}
                    onCancel={this.handleOkOrCancel}
                    footer={[
                        <Button key="back" type="primary" onClick={this.handleOkOrCancel}>关闭</Button>
                    ]}
                    width={960}
                    bodyStyle={{ paddingLeft:30,paddingRight:30 }}
                >
                    <RiskTrackDetail
                        riskTrackDetail={this.props.riskTrackDetail}
                    />
                </Modal>
            </div>
        );
    }
}

export default RiskTrack;
