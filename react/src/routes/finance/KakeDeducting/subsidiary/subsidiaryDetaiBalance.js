/*
 * 作者：陈红华
 * 日期：2017-10-26
 * 邮箱：1045825949@qq.com
 * 文件说明：财务加计扣除研发支出辅助账详情页面：期初期末余额
 */

import React from 'react';
import {Collapse, Row, Col, Tooltip, Form} from 'antd';

const Panel = Collapse.Panel;
const FormItem = Form.Item; //定义表单中item组件
export default class BalanceData extends React.Component {

  render() {
    const {dataList, tableHead} = this.props.data;
    const formItemLayout = {
      colon: false,
      style: {marginBottom: 0},
      labelCol: {span: 12, style: {fontWeight: 'bold', paddingRight: 10}},
      wrapperCol: {span: 12},
    };
    let tableHeadName = tableHead[0] ? tableHead[0].list.map((item, index) =>
        <Panel header={item.name} key={index + 1}>
          {item.list?item.list.map((cell, cellIndex) =>
            cell.list ? cell.list.map((child, childIndex) =>
                <Col span={12} key={childIndex}>
                  <FormItem {...formItemLayout} label={child.name}>
                    <p><span style={{width: 120, float: 'left'}}>{dataList[0]?dataList[0][child['englishName'] + '_open']:[]}</span> <span
                      style={{width: 120, float: 'left'}}>{dataList[0]?dataList[0][child['englishName'] + '_close']:[]}</span></p>
                  </FormItem>
                </Col>)
              :
              <Col span={12} key={cellIndex}>
                <FormItem {...formItemLayout} label={cell.name}>
                  <p><span style={{width: 120, float: 'left'}}>{dataList[0]?dataList[0][cell['englishName'] + '_open']:[]}</span> <span
                    style={{width: 120, float: 'left'}}>{dataList[0]?dataList[0][cell['englishName'] + '_close']:[]}</span></p>
                </FormItem>
              </Col>):[]
          }
        </Panel>
      )
      : null;

    return (
      <div className='balanceContainer'>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label=' '>
              <p><span style={{width: 120, float: 'left', fontWeight: 'bold'}}>期初余额</span> <span
                style={{width: 120, float: 'left', fontWeight: 'bold'}}>期末余额</span></p>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label=' '>
              <p><span style={{width: 120, float: 'left', fontWeight: 'bold'}}>期初余额</span> <span
                style={{width: 120, float: 'left', fontWeight: 'bold'}}>期末余额</span></p>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Collapse defaultActiveKey={['0']} accordion>
            <Panel header='基本信息' key='0'>
              <Col span={12} key='0'>
                <FormItem {...formItemLayout} label='余额'>
                  <p>{dataList[0] ? dataList[0].total_open : ''}</p>
                </FormItem>
              </Col>
            </Panel>
            {tableHeadName}
          </Collapse>
        </Row>


      </div>
    );
  }

}
