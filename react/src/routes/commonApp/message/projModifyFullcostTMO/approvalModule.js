/**
 * 作者：邓广晖
 * 日期：2018-04-11
 * 邮箱：dengh6@chinaunicom.cn
 * 文件说明：通过
 */
import React from 'react';
import { Radio,Input,Row,Col} from 'antd';
const RadioGroup = Radio.Group;
const { TextArea } = Input;

class ApprovalModule extends React.PureComponent {

  state = {
    emailValue:'0',              //是否发送邮件
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

    return(
      <div>
        <RadioGroup
          onChange={(e)=>this.choseEmail(e)}
          value={this.state.emailValue}
          style={{width:'100%',marginTop:15}}
        >
          <Row>
            <Col span={8}>
              {'是否发送邮件给申请人?'}
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

export default ApprovalModule;
