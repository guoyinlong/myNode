/**
 * 作者：邓广晖
 * 创建日期：2018-06-28
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：审核通过时模态框
 */
import React from 'react';
import { Modal, Input, Icon } from 'antd';
const { TextArea } = Input;

/**
 * 作者：邓广晖
 * 创建日期：2018-06-28
 * 功能：审核通过时模态框
 */
class CheckApproveModal extends React.PureComponent {
    constructor(props) {super(props);}
    state = {
        approveValue: '',
        modalVisible: false,
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-28
     * 功能：显示模态框
     */
    showModal = (currentTabKey) => {
        this.setState({
            approveValue: '',
            modalVisible: true
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-28
     * 功能：处理模态框
     * @param flag 标志位
     */
    handleModal = (flag) => {
        if (flag === 'confirm') {
            this.props.handleApprovalClick(this.state.approveValue.trim());
        }
        this.setState({
            modalVisible: false
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-22
     * 功能：设置输入型框的值
     * @param e 输入事件
     * @param inputType 输入的类型
     */
    setInputValue = (e,inputType) =>{
        this.setState({
            [inputType]: e.target.value
        });
        //this.state[inputType] = e.target.value;
    };

    render(){

        return (
            <Modal
                onOk={() => this.handleModal('confirm')}
                onCancel={() => this.handleModal('cancel')}
                width={'500px'}
                visible={this.state.modalVisible}
                maskClosable={false}
            >
                <div style={{fontWeight:'bold',fontSize:20,marginTop:20,textAlign:'center'}}>
                    <Icon
                        type='question-circle-o'
                        style={{fontSize:20,color:'#ffbf00'}}
                    />
                    &nbsp;&nbsp;
                    {'确定通过审核吗？'}
                </div>
                <div>
                    <TextArea
                        rows={4}
                        value={this.state.approveValue}
                        onChange={(e)=>this.setInputValue(e,'approveValue')}
                        placeholder={'（选填）填写备注信息，限100字'}
                        maxLength='100'
                    />
                </div>
            </Modal>

        );
    }
}
export default CheckApproveModal;
