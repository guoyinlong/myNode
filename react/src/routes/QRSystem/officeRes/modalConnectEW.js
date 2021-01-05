/**
 *  作者: 卢美娟
 *  创建日期: 2018-04-11
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：通用模态框，add，edit等
 */
import React from 'react';
import { Icon,Modal,Popconfirm,message,Tooltip,Button,Input,Form,Row,Col,Card,Checkbox,Radio,Cascader,Select } from 'antd';
import styles from './officeRes.less';
import DeptList from "./deptChoose";
import StaffList from "./staffChoose";
import UsersList from "./userChoose";
import request from '../../../utils/request';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 9 },
};
class ModalConnect extends React.Component {

  state = {
    resValue:'',
    selectAssetid:'',
    occupyState:'长期',
    myLocationOption:[],
    isVendor:false, //是否是外部人员  falsee-内部人员；true-外部人员
    ownEquipment:'',
    isWaibu:false,
  }

  componentWillReceiveProps(nextProps){
    if(this.props.EWdata !== nextProps.EWdata){
      this.setState({
        ownEquipment:nextProps.EWdata.ownEquipment,
      })
      if(nextProps.EWdata.user_type == '外部人员'){
        this.setState({isVendor: true})
      }else{
        this.setState({isVendor:false})
      }

      this.props.form.setFieldsValue({
        assetName: nextProps.EWdata.asset_name,
        type_id:nextProps.EWdata.type_id2,
        floor:nextProps.EWdata.floor,
        region:nextProps.EWdata.location,
        seat:nextProps.EWdata.station,
      });

    }
  }


  componentDidMount(){
    this.props.form.validateFields();
    //获取负责人/使用人
    let postData2 = {
      // arg_deptname:'',
    };
    let oudata2=request('/microservice/serviceauth/p_getusers',postData2);
    oudata2.then((data)=>{
      this.setState({
        userList:data.DataRows,
      })
    })
    this.setState({canManage: 0})

    //获取级别分类
    let postData = {
    };
    let oudata=request('/assetsmanageservice/assetsmanage/assets/assetsTypeQuery',postData);

    oudata.then((data)=>{
      this.setState({
        assetTypeList:data.my_child,
      },()=>{
        var myOptions = [];
        if(this.state.assetTypeList != undefined){
          this.state.assetTypeList.forEach(i => {
              //注意这里哦，有问题，真实数据还没改过来
            if(i.type_name == '场地'){
              if(i.my_child != undefined){
                i.my_child.forEach(j => {
                  myOptions.push({value:j.type_id, label:j.type_name})
                })
                this.setState({type_id:i.my_child[0].type_id})
              }
            }
          })
        }
        this.setState({
          myLocationOption:myOptions
        })
      })
    })
  }

  handleCancel = () => {
    const {cancelClick} = this.props;
    cancelClick();
  }

  showModal = () => {
    const {showModal} = this.props;
    showModal();

  }

  ceateRes=(e)=>{
    e.preventDefault();
    const { ceateRes} = this.props;
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((errors, values) => {

      if (errors) return;
      //this.props.form.resetFields();
      this.props.form.validateFields();
      ceateRes(values);
    });

  }

  onChangeOccupy=(e)=>{
    const {onChangeOccupy} = this.props;
    if(e.target.value === '闲置' || e.target.value === '不可用'){
      this.state.ownEquipment = '';
      this.props.form.setFieldsValue({
        username1: '',
      });
      this.setState({
        isVendor: false,
      })
    }
    onChangeOccupy(e);
  }

  editOfficeRes = (id) =>(e)=> {
    e.preventDefault();
    const { editOfficeRes} = this.props;
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      //this.props.form.resetFields();
      this.props.form.validateFields();
      editOfficeRes(id,values);
      // setTimeout(this.props.form.resetFields(),3000)
    });
  }

  showHistory = (assetid) =>(e)=> {
    const {showHistory} = this.props;
    showHistory(assetid);
  }


  onChangeVendor = (e) => {
    // this.props.form.setFieldsValue({
    //   username: '',
    // });
    if(this.props.EWdata.occupyState == '闲置'||this.props.EWdata.occupyState == '不可用'){
      message.info("请将闲置状态修改为长期占用或机动备用");
      return;
    }
    this.setState({
      isVendor: e.target.checked,
    })
    if(e.target.checked){
      this.setState({ownEquipment:''})
    }
    const {userReset} = this.props;
    userReset();

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

  cancelOfficeRes = () => {
    const {cancelOfficeRes} = this.props;
    cancelOfficeRes()
  }

  render(){
    const { getFieldDecorator} = this.props.form;
    console.log("1111111111");
    console.log(this.props.EWdata);
    return(
      <Modal visible={this.props.visible}  title="编辑" onCancel={this.handleCancel} footer={null} width={800}>
        <Row gutter={16}>
          <Col span={11} push={1}>
            <FormItem {...formItemLayout} label = '资产名称'>
              {getFieldDecorator('assetName',{initialValue: this.props.EWdata.asset_name})(
                (this.props.EWdata.canManage == '1')?
                <Input  style = {{width:216}} maxLength={16}/>:
                <Input disabled style = {{width:216}} maxLength={16}/>
              )}
            </FormItem>
          </Col>
          <Col span={11} push={2}>
          {/*
            <FormItem {...formItemLayout} label = '级别分类'>
                {getFieldDecorator('type_id',{initialValue:[this.props.EWdata.type_id2]})(
                  <Cascader style = {{width:216}} placeholder='请选择' options={this.state.myLocationOption} />
                )}
            </FormItem>
          */}
            <FormItem {...formItemLayout} label = '级别分类'>
                {getFieldDecorator('type_id',{initialValue:"type3_1",rules:[{required:true}]})(
                  (this.props.EWdata.canManage == '1' && this.props.EWdata.typeLevelEdit)?
                  <Select  style={{ width: 216 }}>
                    <Option value="type3_1">工位</Option>
                    <Option value="type3_2">办公室</Option>
                    <Option value="type3_3">会议室</Option>
                    <Option value="type3_4">配套用房</Option>
                  </Select>
                  :
                  <Select disabled  style={{ width: 216 }}>
                    <Option value="type3_1">工位</Option>
                    <Option value="type3_2">办公室</Option>
                    <Option value="type3_3">会议室</Option>
                    <Option value="type3_4">配套用房</Option>
                  </Select>
                )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={11} push={1}>
            <FormItem {...formItemLayout} label = '所属楼/层'>
              {getFieldDecorator('floor',{initialValue: this.props.EWdata.floor})(
                (this.props.EWdata.canManage == '1')?
                <Input  maxLength={16} style = {{width:216}}/>:
                <Input disabled maxLength={16} style = {{width:216}}/>
              )}
            </FormItem>
          </Col>
          <Col span={11} push={2}>
            <FormItem {...formItemLayout} label = '所属区域'>
              {getFieldDecorator('region',{initialValue: this.props.EWdata.location})(
                (this.props.EWdata.canManage == '1')?
                <Input  maxLength={16} style = {{width:216}}/>:
                <Input disabled maxLength={16} style = {{width:216}}/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={11} push={1}>
            <FormItem {...formItemLayout} label = '所属工位'>
              {getFieldDecorator('seat',{initialValue: this.props.EWdata.station})(
                (this.props.EWdata.canManage == '1')?
                <Input  maxLength={16} style = {{width:216}}/>:
                <Input disabled maxLength={16} style = {{width:216}}/>
              )}
            </FormItem>
          </Col>
          <Col span={11} push={2}>
            <FormItem {...formItemLayout} label = '归属部门'>
              {getFieldDecorator('dept',{initialValue:this.props.EWdata.charger_dept_name})(
                <DeptList ifdisabled={(this.props.EWdata.canManage =='1')} list={this.props.userList} style = {{width:216}} onChange={this.checkerChange} initialData = {this.props.EWdata.charger_dept_name}/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={11} push={1}>
            <FormItem {...formItemLayout} label = '使用部门'>
              {getFieldDecorator('userdept',{initialValue: this.props.EWdata.user_dept_name})(
                <DeptList ifdisabled={(this.state.canManageProp!== null || this.state.canManage=='1')} list={this.state.userList} style = {{width:216}} onChange={this.checkerChange} initialData = {this.props.EWdata.user_dept_name}/>
              )}
            </FormItem>
          </Col>
          <Col span={11} push={2}>
            <FormItem {...formItemLayout} label = '负责人'>
              {getFieldDecorator('chargername',{initialValue: this.props.EWdata.charger_name})(
                <StaffList ifdisabled={(this.props.EWdata.canManageProp!== null || this.props.EWdata.canManage=='1')} list={this.props.userList} style = {{width:216}} onChange={this.checkerChange}  initialData = {this.props.EWdata.charger_name}/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={11} push={1}>
            {this.state.isVendor?
              <FormItem {...formItemLayout} label = '使用人'>
                {getFieldDecorator('username1',{initialValue: [this.props.EWdata.vendor_id,this.props.EWdata.project_id,this.props.EWdata.staff_id]})(
                  <Cascader options={this.props.externalList} style = {{width:216}} />
                )}
              </FormItem>
              :
              <FormItem {...formItemLayout} label = '使用人'>
                {getFieldDecorator('username',{initialValue: this.props.EWdata.assetuser_name})(
                  <UsersList ifdisabled={(this.props.EWdata.canManageProp!== null || this.props.EWdata.canManage=='1')} list={this.props.userList} style = {{width:216}} onChange={this.changeUser}
                  initialData = {this.props.EWdata.assetuser_name} occupyState={this.props.EWdata.occupyState}/>
                )}
              </FormItem>
            }

          </Col>
          {(this.props.can_operate == '1') ?
            <div>
              <Col span={4} push={2}>
                <Checkbox onChange={this.onChangeVendor} checked={(this.state.isVendor)}>外部人员</Checkbox>
              </Col>

            </div>
          :
            null
          }

        </Row>

        <Row gutter={16}>
          <Col span={14} push={1}>
            <div style = {{height:40}}>
              <RadioGroup onChange={this.onChangeOccupy} value={this.props.EWdata.occupyState} >
                <Radio value='长期'>长期占用</Radio>
                <Radio value='临时'>机动备用</Radio>
                <Radio value='闲置'>闲置</Radio>
                <Radio value='不可用'>不可用</Radio>
              </RadioGroup>
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={14} push={1}>
            <FormItem {...formItemLayout} label = '名下办公设备'>
              <Tooltip title = {this.state.ownEquipment}>
                {
                  this.state.ownEquipment.length>50?
                  `${this.state.ownEquipment.substring(0,49)} 。。。。`
                  :
                  this.state.ownEquipment
                }
              </Tooltip>
            </FormItem>
          </Col>
        </Row>

        {
           (this.props.EWdata.alreaySelected === 1)?
               (this.props.EWdata.canManage === 1)?
               (!this.props.EWdata.editButton)?
               <div style = {{marginTop:'3%',marginBottom:'3%'}}>
                  <Button type = 'primary' style = {{marginLeft:'10%'}} onClick = {this.showModal}>关联已有资源</Button>
                  <Button type = 'primary' style = {{marginLeft:'3%'}} onClick = {this.ceateRes}>创建并关联</Button>
               </div>
               :
               <div style = {{marginTop:'3%'}}>
                 <Button type = 'primary' style = {{marginLeft:'10%'}} onClick = {this.editOfficeRes(this.props.EWdata.asset_id)}>修改</Button>
                 <Button type = 'primary' style = {{marginLeft:'3%'}} onClick = {this.showHistory(this.props.EWdata.asset_id)}>查询使用历史</Button>
                 <Button type = 'primary' style = {{marginLeft:'3%'}} onClick = {this.cancelOfficeRes}>取消关联</Button>
               </div>
              :
              (this.props.EWdata.canManageProp !== null) ?
              <div>
                <Button type = 'primary' style = {{marginLeft:'10%'}} onClick = {this.editOfficeRes(this.props.EWdata.asset_id)}>修改</Button>
                <Button type = 'primary' style = {{marginLeft:'3%'}} onClick = {this.showHistory(this.props.EWdata.asset_id)}>查询使用历史</Button>
              </div>
              :
              <Button type = 'primary' style = {{marginLeft:'10%'}} onClick={this.showHistory(this.props.EWdata.asset_id)}>查询使用历史</Button>
           :
           null
        }

      </Modal>
    )

  }
}

export default Form.create()(ModalConnect);
