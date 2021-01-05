/**
 *  作者: 仝飞
 *  创建日期: 2017-9-19
 *  邮箱：tongf5@chinaunicom.cn
 *  文件说明：已立项项目的信息展示-基本信息
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Icon, Input, Button, DatePicker, message ,Select,Modal} from 'antd';
import { checkProjLabel, checkProjType } from '../../projConst.js';
import Cookie from 'js-cookie';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

/**
 *  作者: 仝飞
 *  创建日期: 2017-9-19
 *  功能：tabs中基本信息页面
 */
class ProjInfoQuery extends React.Component {
  state = {
    visible: false,
    proj_label: ''
  }

  render() {
    const textItemCol = {
      Col1: {span: 2},
      Col2: {span: 3},
      Col3: {span: 4},
      Col4: {span: 14},
    };
    const { TextArea } = Input;
    return (
      <div>
        <Row gutter={16} style={{marginBottom:'20px'}}>
          <Col className="gutter-box" {...textItemCol.Col2}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>项目分类:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box">{checkProjLabel(this.props.projectInfo.proj_label)}</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col1}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>是否主项目:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box">{this.props.projectInfo.is_primary == '0' ? '主项目' : '非主项目'}</span>
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom:'20px'}}>
          <Col className="gutter-box" {...textItemCol.Col2}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>生产编码:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box">{this.props.projectInfo.proj_code}</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col1}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>PMS项目编码:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box">{this.props.projectInfo.old_proj_code_14}</span>
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom:'20px'}}>
          <Col className="gutter-box" {...textItemCol.Col2}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>项目简称:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box">{this.props.projectInfo.proj_shortname}</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col1}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>项目经理:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box">{this.props.projectInfo.mgr_name}</span>
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom:'20px'}}>
          <Col className="gutter-box" {...textItemCol.Col2}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>项目类型:</span>
          </Col>
          <Col
            className="gutter-box" {...textItemCol.Col3}><span>{this.props.projectInfo.proj_type_show}</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col1}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>项目系数:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.projectInfo.proj_ratio}</span>
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom:'20px'}}>
          <Col className="gutter-box" {...textItemCol.Col2}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>预估投资替代额:</span>
          </Col>
          {this.props.projectInfo.replace_money ?
            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.projectInfo.replace_money}万元</span>
            </Col>
            :
            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.projectInfo.replace_money}</span>
            </Col>
          }
          <Col className="gutter-box" {...textItemCol.Col1}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>预估工作量:</span>
          </Col>
          {this.props.projectInfo.fore_workload ?
            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.projectInfo.fore_workload}人月</span>
            </Col>
            :
            <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.projectInfo.fore_workload}</span>
            </Col>
          }
        </Row>

        <Row gutter={16} style={{marginBottom:'20px'}}>
          <Col className="gutter-box" {...textItemCol.Col2}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>开始时间:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.projectInfo.begin_time}</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col1}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>结束时间:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.projectInfo.end_time}</span>
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom:'20px'}}>
          <Col className="gutter-box" {...textItemCol.Col2}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>主建部门:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.projectInfo.dept_name}</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col1}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>归属部门:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.projectInfo.pu_dept_name}</span>
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom:'20px'}}>
          <Col className="gutter-box" {...textItemCol.Col2}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>委托方:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.projectInfo.client}</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col1}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>委托方联系人:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.projectInfo.mandator}</span>
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom:'20px'}}>
          <Col className="gutter-box" {...textItemCol.Col2}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>委托方电话:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.projectInfo.client_tel}</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col1}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>委托方E-mail:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}><span>{this.props.projectInfo.client_mail}</span>
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom:'20px'}}>
          <Col className="gutter-box" {...textItemCol.Col2}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>项目目标:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col4}>
            <TextArea value={this.props.projectInfo.work_target} autosize={{ minRows: 2, maxRows: 6 }}></TextArea>
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom:'20px'}}>
          <Col className="gutter-box" {...textItemCol.Col2}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>项目范围/建设内容:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col4}>
            <TextArea value={this.props.projectInfo.proj_range} autosize={{ minRows: 2, maxRows: 6 }}></TextArea>
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom:'20px'}}>
          <Col className="gutter-box" {...textItemCol.Col2}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>技术/质量目标:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col4}>
            <TextArea value={this.props.projectInfo.quality_target} autosize={{ minRows: 2, maxRows: 6 }}></TextArea>
          </Col>
        </Row>
        <Row gutter={16} style={{marginBottom:'20px'}}>
          <Col className="gutter-box" {...textItemCol.Col2}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>考核指标及验收标准:</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col4}>
            <TextArea value={this.props.projectInfo.proj_check} autosize={{ minRows: 2, maxRows: 6 }}></TextArea>
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom:'20px'}}>
          <Col className="gutter-box" {...textItemCol.Col2}>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col3}>
            <span className="gutter-box" style={{fontWeight:800}}>备注</span>
          </Col>
          <Col className="gutter-box" {...textItemCol.Col4}>
            <TextArea value={this.props.projectInfo.proj_repair} autosize={{ minRows: 2, maxRows: 6 }}></TextArea>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ProjInfoQuery;
