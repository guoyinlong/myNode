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

class VendorModal extends React.Component {

  state = {
    addNameVisible:false,
    vendorName:'',
  }

  componentWillMount(){
    //获取厂商
    let oudata3=request('/assetsmanageservice/assetsmanage/assets/vendorQuery');

    oudata3.then((data)=>{
      this.setState({
        vendorList:data.DataRows,
      })
    })
  }

  addVendor = (name) => {
    if(name == '' || name == null || name == undefined){
      message.info("厂商名称不能为空");
      return;
    }
    if(name.replace(/\s+/g,'') == '' || name.replace(/\s+/g,'') == null || name.replace(/\s+/g,'') == undefined){
      message.info("厂商名称不能为空格！");
      return;
    }
    let postData = {
      arg_vendor_name: name,
    };
    let oudata=request('/assetsmanageservice/assetsmanage/assets/vendorAdd',postData);
    oudata.then((data)=>{

      if(data.RetCode == '1'){
        message.success("添加成功")
        //刷新
        let oudata3=request('/assetsmanageservice/assetsmanage/assets/vendorQuery');
        oudata3.then((data)=>{
          this.setState({
            vendorList:data.DataRows,
          })
        })
      }
      else{
          message.error(data.RetVal);
      }
    })
    .catch((data)=>{
      message.error('名称不能重复，添加失败')
    })
    this.setState({addNameVisible:false})
  }

  deleteVendor = (id) => {
    let postData = {
      arg_id: id,
    };
    let oudata=request('/assetsmanageservice/assetsmanage/assets/vendorDel',postData);
    oudata.then((data)=>{
      if(data.RetCode == '1'){
        message.success("删除成功")
        //刷新
        let oudata3=request('/assetsmanageservice/assetsmanage/assets/vendorQuery');
        oudata3.then((data)=>{
          this.setState({
            vendorList:data.DataRows,
          })
        })
      }else{
        message.info(data.RetVal);
      }
    })
  }

  showAddName = () => {
    this.setState({addNameVisible: true})
  }

  addNameCancel = () => {
    this.setState({addNameVisible:false})
  }

  changeName = (e) => {
    this.setState({vendorName: e.target.value})
  }

  render(){

    let vendorContent = [];
    if(this.state.vendorList){
      for(let i = 0; i < this.state.vendorList.length; i++){
          vendorContent.push(
            <div className = {antdStyles.vendorStyle}>
              <span style = {{fontWeight:'bold'}}>{this.state.vendorList[i].vendor_name}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <Tooltip title = '删除'><Icon  type = 'delete' onClick = {()=>this.deleteVendor(this.state.vendorList[i].id)}/></Tooltip>
            </div>
          )
      }
    }
    return(
      <div>
        <Modal
           title="编辑厂商" visible={this.props.visible} width='800' onCancel={this.props.onClose}
           footer={<Button type = 'primary' onClick = {this.props.onClose}>关闭</Button>}
        >
          <div style = {{height:350,overflow:'auto',width:779}}>
            {vendorContent}
          </div>
          <Button type = 'primary' onClick = {this.showAddName} style = {{marginTop:10,marginLeft:370}}>+</Button>
        </Modal>

        <Modal visible={this.state.addNameVisible} width='600px' title='添加厂商' onCancel={this.addNameCancel}   onOk={()=>this.addVendor(this.state.vendorName)}>
          <span>厂商名称：</span>
          <Input  maxLength={10} onChange = {this.changeName} style = {{marginTop:20,marginBottom:20}} value = {this.state.vendorName}/>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(VendorModal);
