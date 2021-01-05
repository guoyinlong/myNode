/**
 * 作者：邓广晖
 * 创建日期：2018-10-30
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：TMO修改时修改原因
 */
import React from 'react';
import { Input, Modal, message} from 'antd';
const TextArea = Input.TextArea;


/**
 * 作者：邓广晖
 * 创建日期：2018-06-13
 * 功能：修改原因
 */
class TmoModifyReason extends React.PureComponent {
    constructor(props) {super(props);}
    state = {
        reasonVisible:false,           //修改原因模态框显示
        reasonValue:'',                //修改原因
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-13
     * 功能：改变原因
     * @param e 输入事件
     */
    setChangeReason = (e) => {
        this.setState({
            reasonValue: e.target.value
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-13
     * 功能：显示模态框
     */
    showModal = () => {
        this.setState({
            reasonVisible:true,           //修改原因模态框显示
            reasonValue:'',               //修改原因
        })
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-13
     * 功能：处理模态框隐藏
     * @param flag 确定或者取消标志位
     */
    hideReasonModal = (flag) => {
        if (flag === 'confirm') {
            if(this.state.reasonValue.trim() === ''){
                message.error('修改原因不能为空');
                return;
            }else{
                this.props.hideReasonModal();
            }
        }
        this.setState({
            reasonVisible: false,
        });
    };

    render(){
        //console.log(this.props.changeReason);
        return (
            <Modal visible={this.state.reasonVisible}
                   title={'修改原因'}
                   onOk={() => this.hideReasonModal('confirm')}
                   onCancel={() => this.hideReasonModal('cancel')}
            >
                <div>
                    <div style={{
                        color: 'red',
                        display: 'inline-block',
                        verticalAlign: 'top',
                        marginRight: 5
                    }}>{"*"}</div>
                    <div style={{display: 'inline-block', width: '97%'}}>
                        <TextArea
                            placeholder="最多输入200字"
                            maxLength='200'
                            rows={4}
                            value={this.state.reasonValue}
                            onChange={this.setChangeReason}
                        />
                    </div>
                    {this.props.showFlag === '3'?
                        <div>
                            <span style={{color:'red'}}>{this.props.showVal}</span>
                        </div>
                        :
                        null
                    }
                </div>
            </Modal>
        );
    }
}

export default TmoModifyReason;