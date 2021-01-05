/**
 * 作者：邓广晖
 * 创建日期：2018-06-28
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：新增时提交模态框
 */
import React from 'react';
import { Modal, Icon } from 'antd';

/**
 * 作者：邓广晖
 * 创建日期：2018-06-28
 * 功能：提交模态框
 */
class StartSubmitModal extends React.PureComponent {
    constructor(props) {super(props);}
    state = {
        modalVisible: false,
        currentTabKey: '',
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-28
     * 功能：显示模态框
     */
    showModal = (currentTabKey) => {
        this.setState({
            currentTabKey : currentTabKey,
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
        const { currentTabKey } = this.state;
        if (flag === 'confirm') {
            if (currentTabKey === 't1') {
                this.props.saveOrSubmitBasicInfo('submit','0');
            }
            else if (currentTabKey === 't2') {
                this.props.saveOrSubmitMilestone('submit','0');
            }
            else if (currentTabKey === 't3') {
                this.props.saveOrSubmitCostBudget('submit','0');
            }
            else if (currentTabKey === 't4') {
                this.props.saveOrSubmitAttach('submit','0');
            }
        }
        this.setState({
            currentTabKey : '',
            modalVisible: false
        });
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
                    {'确定要提交项目基本信息,里程碑,全成本,附件信息吗？一旦提交将进入审核流程！'}
                </div>
            </Modal>

        );
    }
}
export default StartSubmitModal;
