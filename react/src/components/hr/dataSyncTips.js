/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-11
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现数据同步提示功能
 */
import React from 'react';
import { Modal,Form } from 'antd';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
/**
 * 作者：耿倩倩
 * 创建日期：2017-09-11
 * 功能：实现数据同步提示功能
 */
class DataSyncTips extends React.Component{
  constructor (props) {
    super(props);
  }
  state = {
    times: 0,
    visible: false
  };

  interval = null;
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        times:this.state.times - 1
      });
      if (!this.state.times) {
        this.setState({
          visible:false,
        });//倒计时结束后模态框不可见,并触发设置flag_change=false的服务setFlag
        const {dispatch,param_setFlag} = this.props;
        dispatch({
          // type: 'staffInfoEdit/setFlag'
          type: param_setFlag
        });
      }
    }, 1000);
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      visible: nextProps.flag_change, //flag_change=true，可见。
      times: nextProps.flag_change?30:0 //同步需要的秒数根据后台数据库同步需要的时间而定。
    })
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    this.setState({
      visible: false,
      //times: 0
    });
    const {dispatch,param_setFlag} = this.props;
    dispatch({
      // type: 'staffInfoEdit/setFlag'
      type: param_setFlag
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
      //times: 0
    });
    const {dispatch,param_setFlag} = this.props;
    dispatch({
      // type: 'staffInfoEdit/setFlag'
      type: param_setFlag
    });
  };

  //模态框彻底关闭后的回掉函数，组件个性化之处。
  feedback = () => {
    const {dispatch,param_service,postData} = this.props;
    dispatch({
      //type: 'staffInfoEdit/staffInfoSearch'
      type: param_service,
      arg_param: postData
    });
  };

  render() {
    let tips = "数据同步将在" + this.state.times + "秒后完成。";
    return (
      <Modal
        visible = {this.state.visible}
        onOk = {this.handleOk}
        okText = "确定"
        onCancel = {this.handleCancel}
        afterClose = {this.feedback}
      >
        <p style={{'fontSize':20}}>{tips}</p>
      </Modal>
    );
  }
}

export default DataSyncTips;
