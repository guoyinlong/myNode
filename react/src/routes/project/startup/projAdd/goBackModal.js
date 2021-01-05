/**
 * 作者：邓广晖
 * 创建日期：2018-06-28
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：返回模态框
 */
import React from 'react';
import { Modal, Icon } from 'antd';

/**
 * 作者：邓广晖
 * 创建日期：2018-06-28
 * 功能：返回模态框
 */
class GoBackModal extends React.PureComponent {
    constructor(props) {super(props);}
    state = {
        modalVisible: false,
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-28
     * 功能：显示模态框
     */
    showModal = () => {
        this.setState({
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
            this.props.goBack();
            this.setState({
                modalVisible: false
            });
        } else {
            this.setState({
                modalVisible: false
            });
        }
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
                    {'返回将不保存当前数据，确定返回吗?'}
                </div>
            </Modal>

        );
    }
}
export default GoBackModal;
