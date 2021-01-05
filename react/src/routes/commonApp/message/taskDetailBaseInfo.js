/**
 *  作者: 胡月
 *  创建日期: 2017-9-19
 *  邮箱：huy61@chinaunicom.cn
 *  文件说明：已立项项目的信息展示-基本信息
 */
import React from 'react';
import {Row, Col, Icon, Input, Table, Tooltip, Modal} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import styles from '../../project/startup/projStartMain/projStartMain.less';
import { getuuid, changeBr2RN, checkProjLabel, checkProjType } from '../../project/projConst.js';

const {TextArea} = Input;


/**
 *  作者: 胡月
 *  创建日期: 2017-9-19
 *  功能：tabs中基本信息页面
 */
class ProjInfoQuery extends React.Component {

    render() {
        const { projectInfo } = this.props;

        const textItemCol = {
            label1LeftSpan: {span: 1},       //第一个标签左侧栅格
            label2LeftSpan: {span: 2},       //第二个标签左侧栅格
            labelSpan: {span: 4},            //标签的栅格
            labelValueSpan: {span: 6},       //标签值的栅格
            extraInfoSpan: {span: 17},       //其他信息的文本输入框占据的栅格数
        };

        //pms编码列表
        let pmsContentList = [];
        let { pms_list } = this.props;
        for (let i = 0; i < pms_list.length; i++) {
            pmsContentList.push(
                <Row key={i}
                     style={{
                         margin:'0 auto',
                         marginBottom: 10,
                         width:'95%',
                         paddingBottom:5,
                         borderBottom:'1px solid gainsboro'
                     }}
                >
                    <Col className="gutter-row" span={4} style={{textAlign:'right'}}>
                        <span className={styles.leftTitle}>{'PMS项目编码：'}</span>
                    </Col>
                    <Col className="gutter-row" span={5}>
                        <span>{pms_list[i].pms_code}</span>
                    </Col>
                    <Col className="gutter-row" span={3} style={{textAlign:'right'}}>
                        <span className={styles.leftTitle}>{'PMS项目名称：'}</span>
                    </Col>
                    <Col className="gutter-row" span={7}>
                        <span>{pms_list[i].pms_name}</span>
                    </Col>
                    <Col className="gutter-row" span={2} style={{marginLeft:30}}>
                        <span style={{fontWeight:'bold'}}>{'期数：'}</span>
                        <span >{pms_list[i].pms_stage}</span>
                    </Col>
                </Row>
            );
        }
        return (
            <div>
                <div className={styles.titleBox}>
                    <div>


                    <div className={styles.titleOneBox}>
                            <div className={styles.titleOneStyles}>迭代或关联信息</div>
                        </div>
                        <Row gutter={16} className={styles.titleRowStyles} style={{marginBottom: '20px'}}>
                        <Col className="gutter-box" {...textItemCol.label1LeftSpan}></Col>
                        <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>是否关联/迭代:</span>
                        </Col>
                     

                        <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                        <span className="gutter-box">
                                    {projectInfo.is_relation === '0' ? '否' : '是'}
                                </span>
                            </Col>
                         </Row>
                        {projectInfo.is_relation === '1' ? 
                       
                        <Row gutter={16} className={styles.titleRowStyles} style={{marginBottom: '20px'}}>
                        <Col className="gutter-box" {...textItemCol.label1LeftSpan}></Col>
                        <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>关联/迭代项目:</span>
                        </Col>
                     

                        <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span className="gutter-box">
                                    {projectInfo.re_proj_name}
                                </span>
                                
                            </Col>
                        </Row>
                        :
                        null
                        }


                        <div className={styles.titleOneBox}>
                            <div className={styles.titleOneStyles}>基础信息</div>
                        </div>
                        <Row gutter={16} className={styles.titleRowStyles} style={{marginBottom: '20px'}}>
                            <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>项目分类:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span className="gutter-box">
                                    {checkProjLabel(projectInfo.proj_label)}
                                </span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.label2LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>是否主项目:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span className="gutter-box">
                                    {projectInfo.is_primary === '0' ? '是' : '否'}
                                </span>
                            </Col>
                        </Row>
                        {/*如果是子项目，需要显示主项目信息，包括主项目名称，主项目编码*/}
                        {projectInfo.is_primary === '1' ?
                            <Row gutter={16} className={styles.titleRowStyles}>
                                <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                                </Col>
                                <Col className="gutter-box" {...textItemCol.labelSpan}>
                                    <span className={styles.leftTitle}>主项目名称:</span>
                                </Col>
                                <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                    <span className="gutter-box">
                                        {projectInfo.primary_proj_name}
                                    </span>
                                </Col>
                                <Col className="gutter-box" {...textItemCol.label2LeftSpan}>
                                </Col>
                                <Col className="gutter-box" {...textItemCol.labelSpan}>
                                    <span className={styles.leftTitle}>主项目编码:</span>
                                </Col>
                                <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                    <span className="gutter-box">
                                        {projectInfo.primary_proj_code}
                                    </span>
                                </Col>
                            </Row>
                            :
                            null
                        }

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>生产编码:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span className="gutter-box">{projectInfo.proj_code}</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.label2LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>项目简称:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span className="gutter-box">{projectInfo.proj_shortname}</span>
                            </Col>
                        </Row>


                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>项目类型:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span>{projectInfo.proj_type_show}</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.label2LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>团队系数:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span>{projectInfo.proj_ratio}</span>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>预估投资替代额:</span>
                            </Col>
                            {projectInfo.replace_money ?
                                <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                    <span>{projectInfo.replace_money}万元</span>
                                </Col>
                                :
                                <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                </Col>
                            }
                            <Col className="gutter-box" {...textItemCol.label2LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>预估工作量:</span>
                            </Col>
                            {projectInfo.fore_workload ?
                                <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                    <span>{projectInfo.fore_workload}人月</span>
                                </Col>
                                :
                                <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                </Col>
                            }
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>开始时间:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span>{projectInfo.begin_time}</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.label2LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>结束时间:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span>{projectInfo.end_time}</span>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>主建部门:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span className="gutter-box">{projectInfo.dept_name}</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.label2LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>项目经理:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span className="gutter-box">{projectInfo.mgr_name}</span>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>归属部门:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span>{projectInfo.pu_dept_name}</span>
                            </Col>
                        </Row>
                    </div>

                    <div>
                        <div className={styles.titleTwoBox}>
                            <div className={styles.titleOneStyles}>PMS信息</div>
                        </div>
                        <div style={{marginTop:20,marginBottom:20}}>
                            {
                                pmsContentList.length
                                    ?
                                    <div>{pmsContentList}</div>
                                    :
                                    <Row gutter={16} className={styles.titleRowStyles}>
                                        <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                                        </Col>
                                        <Col className="gutter-box" {...textItemCol.labelSpan}>
                                            <span className={styles.leftTitle}>{'PMS项目编码:'}</span>
                                        </Col>
                                        <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                        </Col>
                                        <Col className="gutter-box" {...textItemCol.label2LeftSpan}>
                                        </Col>
                                        <Col className="gutter-box" {...textItemCol.labelSpan}>
                                            <span className={styles.leftTitle}>{'PMS项目名称:'}</span>
                                        </Col>
                                        <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                        </Col>
                                    </Row>
                            }
                        </div>
                    </div>
                    {/**
                     * 作者：刘洪若
                     * 时间：2020-4-20
                     * 功能：注释掉委托方信息
                     */}
                    {/* <div>
                        <div className={styles.titleTwoBox}>
                            <div className={styles.titleOneStyles}>委托方信息</div>
                        </div>
                        <Row gutter={16} style={{marginBottom: '20px'}}>
                            <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>委托方:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span>{projectInfo.client}</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.label2LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>委托方联系人:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span>{projectInfo.mandator}</span>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>委托方电话:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span>{projectInfo.client_tel}</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.label2LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>委托方E-mail:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelValueSpan}>
                                <span>{projectInfo.client_mail}</span>
                            </Col>
                        </Row>
                    </div> */}

                    <div>
                        <div className={styles.titleTwoBox}>
                            <div className={styles.titleOneStyles}>其他信息</div>
                        </div>
                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>项目目标:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.extraInfoSpan}>
                                <TextArea
                                    value={changeBr2RN(projectInfo.work_target)}
                                    autosize={{minRows: 2, maxRows: 6}}
                                    disabled={true}
                                    className={styles.textAreaStyle}>
                                </TextArea>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>项目范围/建设内容:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.extraInfoSpan}>
                                <TextArea
                                    value={changeBr2RN(projectInfo.proj_range)}
                                    autosize={{minRows: 2, maxRows: 6}}
                                    className={styles.textAreaStyle}
                                    disabled={true}>
                                </TextArea>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>技术/质量目标:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.extraInfoSpan}>
                                <TextArea
                                    value={changeBr2RN(projectInfo.quality_target)}
                                    autosize={{minRows: 2, maxRows: 6}}
                                    disabled={true}
                                    className={styles.textAreaStyle}>
                                </TextArea>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles}>
                            <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>考核指标及验收标准:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.extraInfoSpan}>
                                <TextArea
                                    value={changeBr2RN(projectInfo.proj_check)}
                                    autosize={{minRows: 2, maxRows: 6}}
                                    disabled={true}
                                    className={styles.textAreaStyle}>
                                </TextArea>
                            </Col>
                        </Row>

                        <Row gutter={16} className={styles.titleRowStyles} style={{paddingBottom: '5px'}}>
                            <Col className="gutter-box" {...textItemCol.label1LeftSpan}>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.labelSpan}>
                                <span className={styles.leftTitle}>备注:</span>
                            </Col>
                            <Col className="gutter-box" {...textItemCol.extraInfoSpan}>
                                <TextArea
                                    value={changeBr2RN(projectInfo.proj_repair)}
                                    autosize={{minRows: 2, maxRows: 6}}
                                    disabled={true}
                                    className={styles.textAreaStyle}>
                                </TextArea>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

        );
    }
}

export default ProjInfoQuery;
