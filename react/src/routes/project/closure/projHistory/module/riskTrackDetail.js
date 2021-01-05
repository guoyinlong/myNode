/**
 *  作者: 夏天
 *  创建日期: 2018-10-09
 *  邮箱：1348744578@qq.com
 *  文件说明：风险详情
 */
import React from 'react'
import { Row, Col } from 'antd';

class RiskTrackDetail extends React.Component {

    render() {
        const riskDetail = this.props.riskTrackDetail[0];
        const textItemCol = {
            Col1: { span: 3 },
            Col2: { span: 5 },
            Col3: { span: 21 }
        };
        let riskMoadl = '  ';
        if (riskDetail !== undefined) {
            let probability = ''; // 发生概率
            let range = ''; // 影响范围
            if (riskDetail.props == '1') {
                probability = '1（0.4~0.2，不含0.2）';
            } else if (riskDetail.props === '2') {
                probability = '2（0.4~0.2，不包含0.4）';
            } else if (riskDetail.props === '3') {
                probability = '3（0.6~0.4，不包含0.6）';
            } else if (riskDetail.props === '4') {
                probability = '4（0.8~0.6，不包含0.8）';
            } else if (riskDetail.props === '5') {
                probability = '5（1.0~0.8）';
            }

            if (riskDetail.frange == '1') {
                range = '1（范围变化微小；成本增加小于5%；进度延迟小于5%；质量降低不明显）';
            } else if (riskDetail.frange === '2') {
                range = '2（范围的次要部门受到影响；成本增加5%~10%；进度延迟5%~10%；只有质量要求高的应用受影响）';
            } else if (riskDetail.frange === '3') {
                range = '3（范围的主要部门受到较小程度的影响；成本增加11%~20%；进度延迟11%~20%；必须用户批准的质量降低）';
            } else if (riskDetail.frange === '4') {
                range = '4（范围的主要部门受到较大程度的影响；成本增加21%~30%；进度延迟21%~30%；用户不能接受的质量降低）';
            } else if (riskDetail.frange === '5') {
                range = '5（范围变化不被接受；成本增加大于30%；进度延迟大于30%；项目最终产品实际上很难使用）';
            }
            riskMoadl = (
                <div style={{ borderStyle: 'solid', borderColor: '#CDC5BF', borderWidth: 1, background: '#e9f0f5', paddingLeft: 10, paddingRight: 10, paddingTop: 10 }}>
                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                        <Col className="gutter-row" {...textItemCol.Col1}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>风险项:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col3}><span>{riskDetail.risk}</span>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                        <Col className="gutter-row" {...textItemCol.Col1}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>责任人:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col2}><span>{riskDetail.staff_name}</span>
                        </Col>
                        <Col className="gutter-row" {...textItemCol.Col1}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>风险系数:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col2}><span>{riskDetail.coffi}</span>
                        </Col>
                        <Col className="gutter-row" {...textItemCol.Col1}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>风险类别:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col2}><span>{riskDetail.category}</span>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>

                        <Col className="gutter-row" {...textItemCol.Col1}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>风险状态:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col2}><span>{riskDetail.state}</span>
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
                        <Col className="gutter-box" {...textItemCol.Col2}><span>{riskDetail.recog_date}</span>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                        <Col className="gutter-row" {...textItemCol.Col1}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>计划解决日期:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col2}><span>{riskDetail.plan_time}</span>
                        </Col>
                        <Col className="gutter-row" {...textItemCol.Col1}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>实际解决日期:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col2}><span>{riskDetail.resolve_time}</span>
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
                        <Col className="gutter-box" {...textItemCol.Col3}><span>{riskDetail.range_desc}</span>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                        <Col className="gutter-row" {...textItemCol.Col1}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>跟踪进展情况:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col3}><span>{riskDetail.track_progress}</span>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40 }}>
                        <Col className="gutter-row" {...textItemCol.Col1}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>缓解措施:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col3}><span>{riskDetail.measure}</span>
                        </Col>
                    </Row>
                </div>
            );
        }
        return (
            <div>{riskMoadl}</div>
        )
    }
}

export default RiskTrackDetail;
