/**
 *  作者: 仝飞
 *  创建日期: 2017-9-23
 *  邮箱：tongf5@chinaunicom.cn
 *  文件说明：实现展示风险详情的功能
 */
import React from 'react'
import { Modal, Row, Col, Button } from 'antd';

/**
 *  作者: 仝飞
 *  创建日期: 2017-9-10
 *  功能：实现展示风险详情的功能
 */
class CheckIssueTrackModal extends React.Component {
    state = { visible: false };
    //查看风险模态框
    showModal = (record, result, category, state) => {

        //问题类别
        if (record.category == 1) {
            category = "需求";
        } else if (record.category == 2) {
            category = "设计";
        } else if (record.category == 3) {
            category = "编码";
        } else if (record.category == 4) {
            category = "测试";
        } else if (record.category == 5) {
            category = "开发环境";
        } else if (record.category == 6) {
            category = "人员";
        } else if (record.category == 7) {
            category = "客户";
        } else if (record.category == 8) {
            category = "管理";
        } else if (record.category == 9) {
            category = "质量";
        } else if (record.category == 10) {
            category = "其他";
        }

        //问题状态
        if (record.state == 1) {
            state = "跟踪";
        } else if (record.state == 2) {
            state = "关闭";
        }

        //老系统遗留的bug，默认时间是1999-01-01
        let resolve_time = "";
        if (record.resolve_time === "1999-01-01") {
            resolve_time = "";
        } else if (record.resolve_time === "1999-01-01") {
            resolve_time = "";
        } else {
            resolve_time = record.resolve_time;
        }

        this.setState({
            visible: true,
            issue: record.issue,
            result: result,
            staff_name: record.staff_name,
            risk_uid: record.risk_uid,
            risk: record.risk,
            category: category,
            state: state,
            props: record.props,
            range: record.range,
            recog_date: record.recog_date,
            plan_time: record.plan_time,
            resolve_time: resolve_time,
            range_desc: record.range_desc,
            track_progress: record.track_progress,
            measure: record.measure,
        });
    };
    //模态框中点击确定按钮
    handleOk = (e) => {

    };
    //隐藏模态框
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const textItemCol = {
            Col2: { span: 2 },
            Col3: { span: 3 },
            Col5: { span: 5 },
            Col6: { span: 6 },
            Col9: { span: 9 },
            Col21: { span: 21 }
        };
        return (
            <div>
                <Modal
                    title="问题详情"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={960}
                    bodyStyle={{ paddingLeft:30,paddingRight:30 }}
                    footer={[
                        <Button key="back" type="primary" onClick={this.handleCancel}>关闭</Button>
                    ]}
                >
                <div style={{borderStyle: 'solid',borderColor: '#CDC5BF',borderWidth:1,background:'#e9f0f5',paddingLeft:10,paddingRight:10,paddingTop:10 }}>
                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>问题描述:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col21}><span>{this.state.issue}</span>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>关联风险:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col21}><span>{this.state.risk}</span>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>责任人:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col5}><span>{this.state.staff_name}</span>
                        </Col>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>问题类别:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col5}><span>{this.state.category}</span>
                        </Col>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>问题状态:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col5}><span>{this.state.state}</span>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>识别日期:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col5}><span>{this.state.recog_date}</span>
                        </Col>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>计划解决日期:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col5}><span>{this.state.plan_time}</span>
                        </Col>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>实际解决日期:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col5}><span>{this.state.resolve_time}</span>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>影响范围描述:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col21}><span>{this.state.range_desc}</span>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>应对措施:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col21}><span>{this.state.measure}</span>
                        </Col>
                    </Row>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default CheckIssueTrackModal;
