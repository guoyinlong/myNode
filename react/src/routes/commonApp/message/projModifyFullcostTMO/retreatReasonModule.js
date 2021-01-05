/**
 * 作者：邓广晖
 * 日期：2018-04-11
 * 邮箱：dengh6@chinaunicom.cn
 * 文件说明：撤回原因
 */
import React from 'react';
import { Radio,Input,Row,Col,Tooltip,Icon} from 'antd';
const RadioGroup = Radio.Group;
const { TextArea } = Input;

class RetreatReasonModule extends React.PureComponent {

  state = {
    retreatValue:'',
    //是否发送邮件,show和able都为1时，默认为是，且不可点击
    emailValue:this.props.titleData.handing_send_email_select_show === '1' &&
               this.props.titleData.handing_send_email_select_able === '0' ? '1':'0',
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

    const {titleData} = this.props;

    return(
      <div>
        <div style={{color:'red',display:'inline-block',verticalAlign:'top',marginRight:5}}>{"*"}</div>
        <div style={{display:'inline-block',width:'97%'}}>
          <TextArea rows={4} onChange={(e)=>this.setInputValue(e,'retreatValue')} placeholder={'请输入撤回原因'} maxLength='200'/>
        </div>
        {/*是否显示给审核人发邮件，如果不显示，默认emailValue = 0*/}
        {titleData.handing_send_email_select_show === '1'?
          <RadioGroup
            onChange={(e)=>this.choseEmail(e)}
            value={this.state.emailValue}
            style={{width:'100%',marginTop:15}}
            disabled={titleData.handing_send_email_select_able === '0'}
          >
            <Row>
              <Col span={8}>
                {'是否发送邮件给审核人?'}
              </Col>
              <Col span={3} offset={1}>
                <Radio value={'1'}>{'是'}</Radio>
              </Col>
              <Col span={3} offset={1}>
                <Radio value={'0'}>{'否'}</Radio>
              </Col>
              {titleData.handing_send_email_select_able === '0'?
                <Col span={3} offset={1}>
                  <Tooltip placement="right" title={titleData.handing_send_email_select_disable_reason}>
                    <Icon type="question-circle" style={{fontSize: 16, color: '#08c'}}/>
                  </Tooltip>
                </Col>
                :
                null
              }

            </Row>
          </RadioGroup>
          :
         null
        }
      </div>
    );
  }
}

export default RetreatReasonModule;
