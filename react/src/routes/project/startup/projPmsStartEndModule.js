/**
 * 作者：邓广晖
 * 日期：2018-06-11
 * 邮箱：dengh6@chinaunicom.cn
 * 文件说明：发送钉钉通知
 */
import React from 'react';
import { Radio,Input,Row,Col} from 'antd';
const RadioGroup = Radio.Group;

class ProjPmsStartEndModule extends React.PureComponent {

    state = {
        sendDingDing:'0',              //是否发送钉钉通知
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-08
     * 功能：选择是否发送dingding
     * @param e 勾选事件
     */
    choseDingDing = (e) => {
        this.setState({
            sendDingDing: e.target.value
        });
    };

    render(){

        const { startOrEnd, record } = this.props;
        let showContent = '';
        if (startOrEnd === '0') {
            showContent = '资本化开始生效日期为：' + record.next_date;
        } else if (startOrEnd === '1'){
            showContent = '资本化结束生效日期为：' + record.next_date;
        }
        return(
            <div>
                <div>
                    {showContent}
                </div>
                <RadioGroup
                    onChange={(e)=>this.choseDingDing(e)}
                    value={this.state.sendDingDing}
                    style={{width:'100%',marginTop:15}}
                >
                    <Row>
                        <Col span={8}>
                            {'是否发送钉钉通知?'}
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

export default ProjPmsStartEndModule;
