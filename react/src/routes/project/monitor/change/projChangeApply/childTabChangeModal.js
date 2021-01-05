/**
 * 作者：王旭东
 * 创建日期：2018-11-15
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明：全成本页面内tab的切换弹窗
 */
import React from 'react';
import { Modal, Icon, Button } from 'antd';

class ChildTabChangeModal extends React.PureComponent {
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
      modalVisible: true,
    });
  };

  /**
   *
   * @param flag  用于标志关闭页面 close confirm cancel
   */
  handleModal = (flag) => {
    let { currentTabKey, nextTab } = this.state;
    // console.log(currentTabKey,nextTab)
    if (flag === 'confirm') {

      // 点击确认保存  如果当前不是合计预算  都要保存
      if (currentTabKey !== '合计预算') {
        this.props.saveOrSubmitCostBudget('save','1','t3',nextTab) // 全成本的 t3,此处为子tab的 nextTab
        // this.props.directChildTabChangeClick(nextTab,flag); // 然后执行内存tab的切换
      }else {
        this.props.directChildTabChangeClick(nextTab,flag);
      }
    } else if(flag === 'cancel' ) {
      this.props.directChildTabChangeClick(nextTab,flag);
    } else if(flag === 'close'){
      // 不需要操作直接关闭
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
export default ChildTabChangeModal;
