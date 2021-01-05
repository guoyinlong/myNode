/**
 * 作者：邓广晖
 * 创建日期：2018-06-13
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：变更原因，为了处理基本信息表单撤回原值的解决方案而设计
 */
import React from 'react';
import { Input, Modal, message} from 'antd';
const TextArea = Input.TextArea;


/**
 * 作者：邓广晖
 * 创建日期：2018-06-13
 * 功能：角变更原因
 */
class ChangeReason extends React.PureComponent {
    constructor(props) {super(props);}
    state = {
        reasonVisible:false,           //修改原因模态框显示
        reasonValue:'',                //修改原因
        currentTabKey: '',
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
    showModal = (currentTabKey) => {
        this.setState({
            reasonVisible:true,           //修改原因模态框显示
            reasonValue:'',               //修改原因
            currentTabKey : currentTabKey,
        })
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-13
     * 功能：处理模态框隐藏
     * @param flag 确定或者取消标志位
     */
    hideReasonModal = (flag) => {
        const { currentTabKey } = this.state;
        if (flag === 'confirm') {
            if(this.state.reasonValue.trim() === ''){
                message.error('变更原因不能为空');
                return;
            }else{
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
        }
        this.setState({
            currentTabKey : '',
            reasonVisible: false,
        });
    };

    render(){
        //console.log(this.props.changeReason);
        return (
            <Modal visible={this.state.reasonVisible}
                   title={'变更原因'}
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
                    <div style={{color:'#fa7252'}}>
                        {'确定要提交项目基本信息,里程碑,全成本信息吗？一旦提交将进入审核流程！'}
                    </div>
                </div>
            </Modal>
        );
    }
}

export default ChangeReason;