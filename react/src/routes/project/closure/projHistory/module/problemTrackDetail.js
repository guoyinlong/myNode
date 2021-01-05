/**
 *  作者: 夏天
 *  创建日期: 2018-10-10
 *  邮箱：1348744578@qq.com
 *  文件说明：问题详情
 */
import React from 'react'
import { Row, Col } from 'antd';


class ProblemTrackDetail extends React.Component {

    render() {
        const { problemTrackDetail } = this.props;
        const textItemCol = {
            Col2: { span: 2 },
            Col3: { span: 3 },
            Col5: { span: 5 },
            Col6: { span: 6 },
            Col9: { span: 9 },
            Col21: { span: 21 }
        };
        let problemMoadl = '  ';
        if (problemTrackDetail[0] !== undefined) {
            problemMoadl = (
                <div style={{borderStyle: 'solid',borderColor: '#CDC5BF',borderWidth:1,background:'#e9f0f5',paddingLeft:10,paddingRight:10,paddingTop:10 }}>
                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40  }}>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>问题描述:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col21}><span>{problemTrackDetail[0].issue}</span>
                        </Col>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>关联风险:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col21}><span>{problemTrackDetail[0].risk}</span>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40  }}>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>责任人:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col5}><span>{problemTrackDetail[0].staff_name}</span>
                        </Col>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>问题类别:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col5}><span>{problemTrackDetail[0].category}</span>
                        </Col>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>问题状态:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col5}><span>{problemTrackDetail[0].state}</span>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40  }}>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>识别日期:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col5}><span>{problemTrackDetail[0].recog_date}</span>
                        </Col>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>计划解决日期:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col5}><span>{problemTrackDetail[0].plan_time}</span>
                        </Col>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>实际解决日期:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col5}><span>{problemTrackDetail[0].resolve_time}</span>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: '5px', minHeight: 40  }}>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>影响范围描述:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col21}><span>{problemTrackDetail[0].range_desc}</span>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: '5px' , minHeight: 40 }}>
                        <Col className="gutter-row" {...textItemCol.Col3}>
                            <span className="gutter-box" style={{ float: 'right', fontWeight: 800 }}>应对措施:</span>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col21}><span>{problemTrackDetail[0].measure}</span>
                        </Col>
                    </Row>
                </div>
            );
        }
        return (
            <div>{problemMoadl}</div>
        );
    }
}

export default ProblemTrackDetail;
