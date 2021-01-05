/**
 *  作者: 卢美娟
 *  创建日期: 2018-04-11
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：通用模态框，add，edit等
 */
import React from 'react';
import { Icon,Modal,Popconfirm,message,Tooltip,Button,Input,Form,Row,Col,Card,Checkbox,Radio,Spin} from 'antd';
import styles from './officeRes.less';
import antdStyles from './editAntd.less';
import request from '../../../utils/request';

class HistoryModal extends React.Component {

  state = {
  }

  componentDidMount(){

  }

  searchHis = ()=> {
    let {onOk} = this.props;
    onOk();
  }

  render(){
    let historyContent = [];
    if(this.props.historyList){
      for(let i = 0; i < this.props.historyList.length; i++){
          historyContent.push(
            <div className = {antdStyles.listStyle}>
              <span style = {{fontWeight:'bold'}}>{this.props.historyList[i].user_name}</span>&nbsp;&nbsp;({this.props.historyList[i].user_type})&nbsp;&nbsp;
              <span>{this.props.historyList[i].type}使用</span>&nbsp;&nbsp;
              <div style = {{marginTop:10}}>
                <span style = {{fontWeight:'bold'}}>使用时间：</span>
                <span>{this.props.historyList[i].start_date}</span> &nbsp;&nbsp;
                <span> - </span> &nbsp;&nbsp;
                <span>{this.props.historyList[i].end_date}</span> &nbsp;&nbsp;
              </div>
            </div>
          )
      }
    }

    if(this.props.historyList !== []){
      return(
        <Modal
           title="查询使用历史" visible={this.props.visible} width='925' onCancel={this.props.onClose}
           footer={<Button type = 'primary' onClick = {this.props.onClose}>关闭</Button>}
        >
          {historyContent}
        </Modal>
      )
    }else{
      return(
        <div>没有历史使用记录</div>
      )
    }

  }
}

export default Form.create()(HistoryModal);
