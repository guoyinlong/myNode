/**
 *  作者: 卢美娟
 *  创建日期: 2018-04-11
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：通用模态框，add，edit等
 */
import React from 'react';
import { Icon,Modal,Popconfirm,message,Tooltip,Button,Input,Form,Row,Col,Card,Checkbox,Radio,Spin,Select,Cascader} from 'antd';
import styles from './../officeRes.less';
import request from '../../../../utils/request';
import UsersList from "./userChoose";
const RadioGroup = Radio.Group;
const Search = Input.Search;
const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 9 },
};
class SeatModal extends React.Component {

  state = {
    userList:[],
    initusename: this.props.allotRecord.user_name,
    dataFlag: 0, //0-表明userChosse中的value取this.props.initialData ,1-取this.state.value
    isVendor:false,
  }

  handleOk = (allotId) => {
    const {okClick} = this.props;
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      //this.props.form.resetFields();
      this.props.form.validateFields();
      var ret = okClick(allotId,values);
      if(ret == 1){
        setTimeout(this.props.form.resetFields(),3000);
        this.setState({dataFlag: 0})
      }
    });

  }

  handleCancel = () => {
    const {cancelClick} = this.props;
    cancelClick();
    setTimeout(this.props.form.resetFields(),3000);
    this.setState({dataFlag:0})
  }

  changeUser = (param)=> {
    let postData = {
      arg_user_id: param.userid,
      arg_user_name: param.username,
    };
    let oudata=request('/assetsmanageservice/assetsmanage/assets/usedAssetsInfoQuery',postData);
    oudata.then((data)=>{
      if(data.RetCode == '1'){
        var userEquip = data.DataRows;
        var usetemp = '';
        if(userEquip){{
          for(let i = 0; i < userEquip.length; i++){
            usetemp += userEquip[i].asset_name + '，';
          }
        }}
        this.setState({
          ownEquipment: usetemp?usetemp.substring(0,usetemp.length-1):'',
        })
      }else{
        message.error(data.RetVal)
      }
    })
    .catch(()=>{
      message.error("修改出错")
    }
    )
  }

  componentDidMount(){
    this.props.form.validateFields();
    //获取负责人/使用人
    let postData2 = {
      // arg_tenantid:'10010',
      // arg_ou:'联通软件研究院本部',
    };
    let oudata2=request('/microservice/serviceauth/p_getusers',postData2);
    // let oudata2=request('/microservice/project/projmembersinfoquery',postData2);
    oudata2.then((data)=>{
      this.setState({
        userList:data.DataRows,
      })
    })
  }

  onUserChange = () => {
    this.setState({dataFlag: 1})
  }

  onChangeVendor = (e) => {
    this.setState({isVendor: e.target.checked})
  }

  componentWillReceiveProps(nextProps){
    if(this.props.allotRecord !== nextProps.allotRecord){
      if(this.props.allotRecord.user_type == 1){
        this.setState({isVendor: true})
      }else{
        this.setState({isVendor:false})
      }
    }


  }


  render(){

    const { getFieldDecorator} = this.props.form;
    return(
      <Modal title = '添加配置' width = '800px' visible = {this.props.visible} onOk = {()=>this.handleOk(this.props.allotRecord.allot_id)} onCancel = {this.handleCancel}>
        <Row gutter={16}>
          <Col span={11} push={1}>
          {(this.state.isVendor&&(this.props.allotRecord.user_type?(this.props.allotRecord.user_type == '1'):1))?
            <FormItem {...formItemLayout} label = '申请人'>
              {getFieldDecorator('applyStaff1',{initialValue: []})(
                <Cascader options={this.props.externalList} style = {{width:216}} placeholder = '请选择'/>
              )}
            </FormItem>
            :
            <FormItem {...formItemLayout} label = '申请人'>
              {getFieldDecorator('applyStaff')(
                <UsersList ifdisabled = {this.props.operationFlag == 'add'} list={this.state.userList} style = {{width:216}}
                initialData = {this.props.allotRecord.user_name} onUserChange = {this.onUserChange} dataFlag = {this.state.dataFlag}/>
              )}
            </FormItem>
          }

          </Col>
          <div>
            {this.props.operationFlag == 'add' ?
              <Col span={4} push={2}>
                <Checkbox onChange={this.onChangeVendor} checked={(this.state.isVendor)}>外部人员</Checkbox>
              </Col>
              :
              null
            }

          </div>
        </Row>
        <Row gutter={16}>
          <Col span={11} push={1}>
            <FormItem {...formItemLayout} label = '申请工位数'>
              {getFieldDecorator('applyNum',{initialValue: this.props.allotRecord.station_amount} )(
                <Input style = {{width:216}} type = 'number'/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={11} push={1}>
            <FormItem {...formItemLayout} label = '申请原因'>
              {getFieldDecorator('applyReason',{initialValue: this.props.operationFlag == 'add'?'':this.props.allotRecord.apply_reason})(
                <textarea rows='4' cols='88' maxLength = {500} placeholder = '申请原因不得超过五百字'></textarea>
              )}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    )

  }
}

export default Form.create()(SeatModal);
