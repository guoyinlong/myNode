/**
 *  作者: 胡月
 *  创建日期: 2017-9-23
 *  邮箱：huy61@chinaunicom.cn
 *  文件说明：实现展示风险详情的功能
 */
import React from 'react'
import { Modal, Row, Col, Button } from 'antd';

/**
 *  作者: 胡月
 *  创建日期: 2017-9-10
 *  功能：实现展示风险详情的功能
 */
class CheckRiskModal extends React.Component {
    state = { visible: false };
    //查看风险模态框
    showModal = (record, result, category, state) => {
        //风险级别
        if (record.props * record.range >= 16) {
            result = "高";
        } else if (record.props * record.range >= 9 && record.props * record.range < 16) {
            result = "中";
        } else if (record.props * record.range >= 1 && record.props * record.range < 9) {
            result = "低";
        }
        //风险类别
        if (record.category === '1') {
            category = "管理";
        } else if (record.category === '2') {
            category = "技术";
        } else if (record.category === '3') {
            category = "商业";
        }
        //风险状态
        if (record.state === '1') {
            state = "识别";
        } else if (record.state === '2') {
            state = "预防";
        } else if (record.state === '3') {
            state = "转为问题";
        } else if (record.state === '4') {
            state = "关闭";
        }

        this.setState({
            visible: true,
            risk: record.risk,
            result: result,
            staff_name: record.staff_name,
            category: category,
            state: state,
            props: record.props,
            range: record.range,
            recog_date: record.recog_date,
            plan_time: record.plan_time,
            resolve_time: record.resolve_time,
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
            Col1: { span: 3 },
            Col2: { span: 5 },
            Col3: { span: 21 }
        };
        let probability = ''; // 发生概率
        let range = ''; // 影响范围
        if (this.state.props == '1') {
            probability = '1（0.4~0.2，不含0.2）';
        } else if (this.state.props === '2') {
            probability = '2（0.4~0.2，不包含0.4）';
        } else if (this.state.props === '3') {
            probability = '3（0.6~0.4，不包含0.6）';
        } else if (this.state.props === '4') {
            probability = '4（0.8~0.6，不包含0.8）';
        } else if (this.state.props === '5') {
            probability = '5（1.0~0.8）';
        }

        if (this.state.range == '1') {
            range = '1（范围变化微小；成本增加小于5%；进度延迟小于5%；质量降低不明显）';
        } else if (this.state.range === '2') {
            range = '2（范围的次要部门受到影响；成本增加5%~10%；进度延迟5%~10%；只有质量要求高的应用受影响）';
        } else if (this.state.range === '3') {
            range = '3（范围的主要部门受到较小程度的影响；成本增加11%~20%；进度延迟11%~20%；必须用户批准的质量降低）';
        } else if (this.state.range === '4') {
            range = '4（范围的主要部门受到较大程度的影响；成本增加21%~30%；进度延迟21%~30%；用户不能接受的质量降低）';
        } else if (this.state.range === '5') {
            range = '5（范围变化不被接受；成本增加大于30%；进度延迟大于30%；项目最终产品实际上很难使用）';
        }
        return (
            <div >
                <Modal
                    title="风险详情"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" type="primary" onClick={this.handleCancel}>关闭</Button>
                    ]}
                    width={960}
                    bodyStyle={{ paddingLeft:30,paddingRight:30 }}
                >
                    <div style={{borderStyle: 'solid',borderColor: '#CDC5BF',borderWidth:1,background:'#e9f0f5',paddingLeft:10,paddingRight:10,paddingTop:10 }}>
                        <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                            <Col className="gutter-row" {...textItemCol.Col1}>
                                <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>风险项:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.state.risk}</span>
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                            <Col className="gutter-row" {...textItemCol.Col1}>
                                <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>责任人:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col2}><span>{this.state.staff_name}</span>
                            </Col>
                            <Col className="gutter-row" {...textItemCol.Col1}>
                                <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>风险系数:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col2}><span>{this.state.result}</span>
                            </Col>
                            <Col className="gutter-row" {...textItemCol.Col1}>
                                <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>风险类别:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col2}><span>{this.state.category}</span>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>

                            <Col className="gutter-row" {...textItemCol.Col1}>
                                <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>风险状态:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col2}><span>{this.state.state}</span>
                            </Col>
                            <Col className="gutter-row" {...textItemCol.Col1}>
                                <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>发生概率:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                                <span>
                                    {probability}
                                </span>
                            </Col>
                            <Col className="gutter-row" {...textItemCol.Col1}>
                                <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>识别日期:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col2}><span>{this.state.recog_date}</span>
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                            <Col className="gutter-row" {...textItemCol.Col1}>
                                <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>计划解决日期:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col2}><span>{this.state.plan_time}</span>
                            </Col>
                            <Col className="gutter-row" {...textItemCol.Col1}>
                                <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>实际解决日期:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col2}><span>{this.state.resolve_time}</span>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                            <Col className="gutter-row" {...textItemCol.Col1}>
                                <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>影响范围:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}><span>{range}</span>
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                            <Col className="gutter-row" {...textItemCol.Col1}>
                                <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>影响范围描述:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.state.range_desc}</span>
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                            <Col className="gutter-row" {...textItemCol.Col1}>
                                <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>跟踪进展情况:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.state.track_progress}</span>
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                            <Col className="gutter-row" {...textItemCol.Col1}>
                                <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>缓解措施:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.state.measure}</span>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default CheckRiskModal;
