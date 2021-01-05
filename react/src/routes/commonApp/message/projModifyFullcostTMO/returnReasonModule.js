/**
 * 作者：邓广晖
 * 日期：2018-04-11
 * 邮箱：dengh6@chinaunicom.cn
 * 文件说明：退回原因
 */
import React from 'react';
import { Radio,Input,Row,Col} from 'antd';
const RadioGroup = Radio.Group;
const { TextArea } = Input;

class ReturnReasonModule extends React.PureComponent {

  state = {
    returnValue:'',
    emailValue:'0',              //是否发送邮件
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：设置输入型框的值
   * @param e 输入事件
   * @param inputType 输入的类型
   */
  setInputValue = (e,inputType) =>{
    this.state[inputType] = e.target.value;
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
        <div style={{color:'red',display:'inline-block',verticalAlign:'top',marginRight:5}}>{"*"}</div>
        <div style={{display:'inline-block',width:'97%'}}>
          <TextArea rows={4} onChange={(e)=>this.setInputValue(e,'returnValue')} placeholder={'请输入退回原因'} maxLength='200'/>
        </div>
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

export default ReturnReasonModule;
