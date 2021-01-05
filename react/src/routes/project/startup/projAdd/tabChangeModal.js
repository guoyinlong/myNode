/**
 * 作者：邓广晖
 * 创建日期：2018-06-28
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：tab切换模态框
 */
import React from 'react';
import { Modal, Icon, Button } from 'antd';

/**
 * 作者：邓广晖
 * 创建日期：2018-06-28
 * 功能：tab切换模态框
 */
class TabChangeModal extends React.PureComponent {
    constructor(props) {super(props);}
    state = {
        modalVisible: false,
        nextTab: '',
        currentTabKey: '',
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-28
     * 功能：显示模态框
     */
    showModal = (currentTabKey,nextTab) => {
        this.setState({
            currentTabKey : currentTabKey,
            nextTab: nextTab,
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
        let { currentTabKey, nextTab } = this.state;
        if (flag === 'confirm') {
            if (currentTabKey === 't1') {
                this.props.saveOrSubmitBasicInfo('save','1',nextTab);
            }
            else if (currentTabKey === 't2') {
                this.props.saveOrSubmitMilestone('save','1',nextTab);
            }
            else if (currentTabKey === 't3') {
                this.props.saveOrSubmitCostBudget('save','1',nextTab);
            }
            else if (currentTabKey === 't4') {
                this.props.saveOrSubmitAttach('save','1',nextTab);
            }
        } else {
            this.props.directTabChangeClick(nextTab,flag);
        }
        this.setState({
            currentTabKey: '',
            nextTab: '',
            modalVisible: false
        });
    };

    render(){

        return (
            <Modal
                onCancel={() => this.handleModal('close')}
                width={'500px'}
                visible={this.state.modalVisible}
                maskClosable={false}
                footer={[
                    <Button
                        key="cancel"
                        type="primary"
                        onClick={() => this.handleModal('cancel')}
                    >取消
                    </Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        onClick={() => this.handleModal('confirm')}
                    >确定
                    </Button>,
                ]}
            >
                <div style={{fontWeight:'bold',fontSize:20,marginTop:20,textAlign:'center'}}>
                    <Icon
                        type='question-circle-o'
                        style={{fontSize:20,color:'#ffbf00'}}
                    />
                    &nbsp;&nbsp;
                    {'选项卡切换，是否保存当前选项卡数据?'}
                </div>
            </Modal>
        );
    }
}
export default TabChangeModal;
