/**
 * 作者：邓广晖
 * 创建日期：2018-04-08
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：TMO修改全成本时，选择审核人
 */

import React from 'react';
import {Row,Col,Radio} from 'antd';
const RadioGroup = Radio.Group;

/**
 * 作者：邓广晖
 * 创建日期：2018-03-06
 * 功能：TMO修改全成本时，选择审核人
 */
class ChoseVerifier extends React.PureComponent {
  state = {
    verifierValue:this.props.verifierDefaultId,      //审核人的值
    emailValue:'0',                                  //是否发送邮件的值,默认为0（否）
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-04-08
   * 功能：选择审核人
   * @param e 勾选事件
   */
  choseVerifier = (e) => {
    this.setState({
      verifierValue:e.target.value
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-04-08
   * 功能：选择是否发送邮件
   * @param e 勾选事件
   */
  choseEmail = (e) => {
    this.setState({
      emailValue:e.target.value
    });
  };

  render(){
    let showList = this.props.verifierList.map((item,index)=>{
      return (
        <Col span={7} offset={1} key={index}>
          <Radio value={item.userid}>{item.username}</Radio>
        </Col>
      );
    });
    return(
      <div>
        <RadioGroup
          onChange={(e)=>this.choseVerifier(e)}
          value={this.state.verifierValue}
          style={{
            width:'100%',
            borderBottom:'solid 1px gainsboro',
            marginBottom: '2px',
            paddingBottom: '9px'
          }}
        >
          <Row>
            {showList}
          </Row>
        </RadioGroup>
        <RadioGroup
          onChange={(e)=>this.choseEmail(e)}
          value={this.state.emailValue}
          style={{width:'100%'}}
        >
          <Row>
            <Col span={8} offset={1}>
              {'是否发送邮件给审核人?'}
            </Col>
            <Col span={3} offset={1}>
              <Radio value={'1'}>{'是'}</Radio>
            </Col>
            <Col span={3} offset={1}>
              <Radio value={'0'}>{'否'}</Radio>
            </Col>
          </Row>
        </RadioGroup>
      </div>
    );
  }
}

export default ChoseVerifier;
