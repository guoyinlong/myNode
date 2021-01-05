/**
 *  作者: 崔晓林
 *  创建日期: 2020-4-22
 *  邮箱：cuixl@itnova.com.cn
 *  文件说明：项目变更，基本信息没有变化的页面（此处在历史项目中也有引用）
 */
import React from 'react';
import { Row, Col, Input ,Table} from 'antd';
import config from '../../../../utils/config';
import styles from '../../../commonApp/message/projChangeCheck/projCheck.less';
import { checkProjLabel, checkProjType } from '../../projConst.js';




/**
 *  作者: 崔晓林
 *  创建日期: 2020-4-22
 * 功能：将文本中<br>标签替换成\r\n
 * @param value 参数值
 */
function changeBr2RD(value) {
    if (value !== undefined) {
        return value.replace(/<br>/g, '\r\n');
    } else {
        return '';
    }
};

/**
 *   作者: 崔晓林
 *  创建日期: 2020-4-22
 *  功能：tabs中基本信息页面
 */
class NotChangeBasicInfo extends React.Component {

        //投资替代额的表格
        columns = [
            {
                title: '年份',
                dataIndex: 'year',
                render: (value, row, index) => {
                    return {
                        children: value,
                        props: {rowSpan: row.yearRowSpan, colSpan: row.yearColSpan},
                    };
                }
            },
            {
                title: '费用项（万元）',
                dataIndex: 'feeName'
            },
            {
                title: '第一季度',
                dataIndex: 'seasonOne',
                render: (value, row, index) => {
                    return {
                        children: Number(value) === 0 ? '-' : Number(value) / 10000,
                        props: {rowSpan: row.seasonOneRowSpan, colSpan: row.seasonOneColSpan},
                    };
                }
            },
            {
                title: '第二季度',
                dataIndex: 'seasonTwo',
                render: (value, row, index) => {
                    return {
                        children: Number(value) === 0 ? '-' : Number(value) / 10000,
                        props: {rowSpan: row.seasonTwoRowSpan, colSpan: row.seasonTwoColSpan},
                    };
                }
            },
            {
                title: '第三季度',
                dataIndex: 'seasonThree',
                render: (value, row, index) => {
                    return {
                        children: Number(value) === 0 ? '-' : Number(value) / 10000,
                        props: {rowSpan: row.seasonThreeRowSpan, colSpan: row.seasonThreeColSpan},
                    };
                }
            },
            {
                title: '第四季度',
                dataIndex: 'seasonFour',
                render: (value, row, index) => {
                    return {
                        children: Number(value) === 0 ? '-' : Number(value) / 10000,
                        props: {rowSpan: row.seasonFourRowSpan, colSpan: row.seasonFourColSpan},
                    };
                }
            }, {
                title: '小计',
                dataIndex: 'totalSeason',
                render: (value, row, index) => {
                    return {
                        children: Number(value) === 0 ? '-' : Number(value) / 10000,
                        props: {rowSpan: row.totalSeasonRowSpan, colSpan: row.totalSeasonColSpan},
                    };
                }
            }
        ];






    state = {
        visible: false,
        proj_label: ''
    }

    render() {
        const textItemCol = {
            Col1: { span: 2 },
            Col2: { span: 1 },
            Col3: { span: 6 },
            Col4: { span: 17 },
            Col5: { span: 4 },
        };



        
        //pms编码列表
        let pmsContentList = [];
        let { pms_list } = this.props;
        for (let i = 0; i < pms_list.length; i++) {
            pmsContentList.push(
                <Row key={i}
                    style={{
                        margin: '0 auto',
                        marginBottom: 10,
                        width: '95%',
                        paddingBottom: 5,
                        borderBottom: '1px solid gainsboro'
                    }}
                >
                    <Col className="gutter-row" span={4} style={{ textAlign: 'right' }}>
                        <span className={styles.leftTitle}>{'PMS项目编码：'}</span>
                    </Col>
                    <Col className="gutter-row" span={5}>
                        <span>{pms_list[i].pms_code}</span>
                    </Col>
                    <Col className="gutter-row" span={3} style={{ textAlign: 'right' }}>
                        <span className={styles.leftTitle}>{'PMS项目名称：'}</span>
                    </Col>
                    <Col className="gutter-row" span={7}>
                        <span>{pms_list[i].pms_name}</span>
                    </Col>
                    <Col className="gutter-row" span={2} style={{ marginLeft: 30 }}>
                        <span style={{ fontWeight: 'bold' }}>{'期数：'}</span>
                        <span >{pms_list[i].pms_stage}</span>
                    </Col>
                </Row>
            );
        }
        
        const { TextArea } = Input;
        return (
            <div>
                {
                    this.props.isFinanceLink === '0' ?
                        <div style={{ fontWeight: 'bold', fontSize: 17, color: 'red', textAlign: 'center' }}>{config.PROJ_IS_CHANGE}</div>
                        : null
                }
                <div className={styles.titleBox}>
                    <div>




                    <div className={styles.titleOneBox}>
                            <div className={styles.titleOneStyles}>迭代或关联信息</div>
                        </div>
                        <Row gutter={16} className={styles.titleRowStyles} style={{marginTop: '20px'}}>
                        
                        <Col className="gutter-box" {...textItemCol.Col2}>
                        </Col>
                        <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>是否关联/迭代:</span>
                        </Col>
                     

                        <Col className="gutter-box" {...textItemCol.Col3}>
                        <span className="gutter-box">
                                    {this.props.notChangeBasicInfo.is_relation === '0' ? '否' : '是'}
                                </span>
                            </Col>
                         </Row>
                        {this.props.notChangeBasicInfo.is_relation === '1' ? 
                       
                        <Row gutter={16} className={styles.titleRowStyles} style={{marginBottom: '20px'}}>
                        <Col className="gutter-box" {...textItemCol.Col2}></Col>
                        <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>关联/迭代项目:</span>
                        </Col>
                     

                        <Col className="gutter-box" {...textItemCol.Col3}>
                                <span className="gutter-box">
                                    {this.props.notChangeBasicInfo.re_proj_name}
                                </span>
                                
                            </Col>
                        </Row>
                        :
                        null
                        }



                        <div className={styles.titleOneBox}>
                            <div className={styles.titleOneStyles}>基础信息</div>
                        </div>
                        <Row gutter={16} className={styles.titleRowStyles} style={{ marginTop: '20px' }}>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>项目分类:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}>
                                <span className="gutter-box">{checkProjLabel(this.props.notChangeBasicInfo.proj_label)}</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col1}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>是否主项目:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}>
                                <span className="gutter-box">{this.props.notChangeBasicInfo.is_primary == '0' ? '主项目' : '非主项目'}</span>
                            </Col>
                        </Row>


                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>生产编码:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}>
                                <span className="gutter-box">{this.props.notChangeBasicInfo.proj_code}</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col1}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>项目简称:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}>
                                <span className="gutter-box">{this.props.notChangeBasicInfo.proj_shortname}</span>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>项目类型:</span>
                            </Col>
                            <Col
                                className="gutter-box" {...textItemCol.Col3}><span>{this.props.notChangeBasicInfo.proj_type}</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col1}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>团队系数:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.notChangeBasicInfo.proj_ratio}</span>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>预估投资替代额:</span>
                            </Col>
                            {this.props.notChangeBasicInfo.replace_money ?
                                <Col
                                    className="gutter-box" {...textItemCol.Col3}><span>{this.props.notChangeBasicInfo.replace_money}万元</span>
                                </Col>
                                :
                                <Col
                                    className="gutter-box" {...textItemCol.Col3}><span>{this.props.notChangeBasicInfo.replace_money}</span>
                                </Col>
                            }
                            <Col className="gutter-box" {...textItemCol.Col1}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>预估工作量:</span>
                            </Col>
                            {this.props.notChangeBasicInfo.fore_workload ?
                                <Col
                                    className="gutter-box" {...textItemCol.Col3}><span>{this.props.notChangeBasicInfo.fore_workload}人月</span>
                                </Col>
                                :
                                <Col
                                    className="gutter-box" {...textItemCol.Col3}><span>{this.props.notChangeBasicInfo.fore_workload}</span>
                                </Col>
                            }
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>开始时间:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.notChangeBasicInfo.begin_time}</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col1}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>结束时间:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.notChangeBasicInfo.end_time}</span>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>主建部门:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}>
                                <span>{this.props.notChangeBasicInfo.dept_name}</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col1}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>项目经理:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}>
                                <span>{this.props.notChangeBasicInfo.mgr_name}</span>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>归属部门:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}>
                                <span>{this.props.notChangeBasicInfo.pu_dept_name}</span>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <div className={styles.titleTwoBox}>
                            <div className={styles.titleOneStyles}>PMS信息</div>
                        </div>
                        <div style={{ marginTop: 20, marginBottom: 20 }}>
                            {pmsContentList == false ?
                                <Row gutter={16} className={styles.titleRowStyles}>
                                    <Col className="gutter-box" {...textItemCol.Col2}>
                                    </Col>
                                    <Col className="gutter-box" {...textItemCol.Col5}>
                                        <span className={styles.leftTitle}>{'PMS项目编码:'}</span>
                                    </Col>
                                    <Col className="gutter-box" {...textItemCol.Col3}>
                                        <span>无</span>
                                    </Col>
                                    <Col className="gutter-box" {...textItemCol.Col1}>
                                    </Col>
                                    <Col className="gutter-box" {...textItemCol.Col5}>
                                        <span className={styles.leftTitle}>{'PMS项目名称:'}</span>
                                    </Col>
                                    <Col className="gutter-box" {...textItemCol.Col3}>
                                        <span>无</span>
                                    </Col>
                                </Row>
                                :
                                <div>{pmsContentList}</div>
                            }
                        </div>
                    </div>

                    <div>
                        <div className={styles.titleTwoBox}>
                            <div className={styles.titleOneStyles}>委托方信息</div>
                        </div>
                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>委托方:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.notChangeBasicInfo.client}</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col1}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>委托方联系人:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.notChangeBasicInfo.mandator}</span>
                            </Col>
                        </Row>


                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>委托方电话:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.notChangeBasicInfo.client_tel}</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col1}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>委托方E-mail:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.notChangeBasicInfo.client_mail}</span>
                            </Col>
                        </Row>
                    </div>

                    <div>
                        <div className={styles.titleTwoBox}>
                            <div className={styles.titleOneStyles}>其他信息</div>
                        </div>
                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>项目目标:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col4}>
                                <TextArea value={changeBr2RD(this.props.notChangeBasicInfo.work_target)}
                                    autosize={{ minRows: 2, maxRows: 6 }} disabled={true} className={styles.textAreaStyle}>
                                </TextArea>
                            </Col>
                        </Row>


                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>项目范围/建设内容:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col4}>
                                <TextArea value={changeBr2RD(this.props.notChangeBasicInfo.proj_range)}
                                    disabled={true} autosize={{ minRows: 2, maxRows: 6 }}
                                    className={styles.textAreaStyle}>
                                </TextArea>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>技术/质量目标:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col4}>
                                <TextArea value={changeBr2RD(this.props.notChangeBasicInfo.quality_target)} autosize={{ minRows: 2, maxRows: 6 }}
                                    disabled={true} className={styles.textAreaStyle}>
                                </TextArea>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>考核指标及验收标准:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col4}>
                                <TextArea value={changeBr2RD(this.props.notChangeBasicInfo.proj_check)} autosize={{ minRows: 2, maxRows: 6 }}
                                    disabled={true} className={styles.textAreaStyle}>
                                </TextArea>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles} style={{ paddingBottom: '5px' }}>
                            <Col className="gutter-box" {...textItemCol.Col2}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col5}>
                                <span className={styles.leftTitle}>备注</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.Col4}>
                                <TextArea value={changeBr2RD(this.props.notChangeBasicInfo.proj_repair)} autosize={{ minRows: 2, maxRows: 6 }}
                                    disabled={true} className={styles.textAreaStyle}>
                                </TextArea>
                            </Col>
                        </Row>
                    </div>
                </div>
                {/* 添加新模块 */}
                <div style={{
                    textAlign: 'center',
                    fontSize: '25px',
                    fontWeight: 'bold',
                    fontFamily: '宋体'}}
                >
                    {'已确认投资替代额'}
                </div>
                <Table columns={this.columns}
                       dataSource={this.props.replaceMoneyList}
                       pagination={false}
                       loading={this.props.loading}
                       className={styles.replaceMoneyTable}
                />
            
            </div>
        );
    }
}

export default NotChangeBasicInfo;


