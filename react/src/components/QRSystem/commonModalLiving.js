/**
 *  作者: 卢美娟
 *  创建日期: 2018-04-11
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：通用模态框，add，edit等
 */
import React from 'react';
import { Icon, DatePicker,Modal,Popconfirm,message,Tooltip,Button,Input,Upload,Pagination,Form,Cascader,Row,Col } from 'antd';
import request from '../../utils/request';
const FormItem = Form.Item;
import moment from 'moment';
import DeptRadioGroup from '../common/deptRadio.js';
import MgrRadioGroup from '../common/mgrRadio.js';
import DeptList from '../QRSystem/deptChoose';
import UserDeptList from '../QRSystem/userdeptChoose';
import StaffList from '../QRSystem/staffChoose';
import UsersList from '../QRSystem/userChoose';
const dateFormat = 'YYYY-MM-DD';
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 9 },
};
const itemStyle = {
  width:216,marginLeft:10
}


class CommonModal extends React.Component {

  state = {
    assetNum:'',
    assetName:'',
    normalizedForm:this.props.data.normalizedForm,
    location:this.props.data.location,
    assetTypeList:[],
    myOptions:[],
    myLocationOption:[],
    userList:[],
  }

  handleCancel = (e) => {
      e.preventDefault();
      const { cancelClick } = this.props;
      const { validateFieldsAndScroll } = this.props.form;
      validateFieldsAndScroll((errors, values) => {
        // if (errors) return;
        this.props.form.validateFields();
        cancelClick();
        setTimeout(this.props.form.resetFields(),3000)
      });
  }

  handleSubmit = (assetid) =>(e)=> {
      e.preventDefault();
      const { okClick } = this.props;
      const { validateFieldsAndScroll } = this.props.form;
      validateFieldsAndScroll((errors, values) => {
        if (errors) return;
        this.props.form.validateFields();
        okClick(assetid,values);
        setTimeout(this.props.form.resetFields(),3000)
      });
  }

  handleChange = (e) => {
    var newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState)
  }

  onChange = (value) => {
    // alert(value)
  }


  componentDidMount(){
    //获取级别分类
    let postData = {
    };
    let oudata=request('/assetsmanageservice/assetsmanage/assets/assetsTypeQuery',postData);
    oudata.then((data)=>{
      this.setState({
        assetTypeList:data.my_child,
      },()=>{
        var myOptions = [];
        var first = 0;
        var second = 0;
        if(this.state.assetTypeList != undefined){
          this.state.assetTypeList.forEach(i => {
              //注意这里哦，有问题，真实数据还没改过来
            if(i.type_name == '生活设施'){
              myOptions.push({value:i.type_id, label:i.type_name, children:[]})
              if(i.my_child != undefined){
                i.my_child.forEach(j => {
                  myOptions[first].children.push({value:j.type_id, label:j.type_name, children:[]})
                  if(j.my_child!= undefined){
                    j.my_child.forEach(k => {
                      myOptions[first].children[second].children.push({value:k.type_id, label:k.type_name})
                    })
                  }
                  second ++;
                })
                second = 0;
              }
              first ++;
            }

          })
        }
        this.setState({
          myOptions:myOptions,
          myLocationOption:myOptions[0].children
        })
      })
    })

    //获取负责人/使用人
    let postData2 = {
      // arg_deptname:'',
    };
    let oudata2=request('/microservice/serviceauth/p_getusers',postData2);
    var tempList = [];
    oudata2.then((data)=>{
      tempList = data.DataRows;
      tempList.push({deptsort:55000000,ousort:55000000,loginname:'空',ou:'空',staff_id:'空',deptid:'空',userid:'空',username:'空',deptname:'空'})
      this.setState({
        // userList:data.DataRows,
        userList:tempList,
      },()=>{
        // console.log(this.state.userList);
      })
    })
  }

  render(){
    const { getFieldDecorator} = this.props.form;
    var currentDay = '';
    if(this.props.data.activate_date == undefined){
      currentDay = moment().format('YYYY-MM-DD');
    }else{
      currentDay = this.props.data.activate_date;
    }

    return(
      <Modal visible={this.props.visible} width='730px' height = '600px'  title={(this.props.flag === 'add')?'添加-生活设施':'编辑-生活设施'}   onCancel={this.handleCancel}   onOk={this.handleSubmit(this.props.data.asset_id)}>

          <Form>

            <Row  gutter={28}>
              <Col span={12}>
                <FormItem {...formItemLayout} label = '资产编号'>
                  {getFieldDecorator('assetNum',{initialValue:this.props.data.asset_number, rules: [{required: true, message: '请输入资产编号'}]}) ((this.props.flag==='fackEdit')?
                    <Input disabled style = {{...itemStyle}}/>:<Input  style = {{...itemStyle}} maxLength={'16'}/>)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label = '资产名称'>
                {getFieldDecorator('assetName',{initialValue:this.props.data.asset_name, rules: [{required: true, message: '请输入资产名称'}]})(<Input style = {{...itemStyle}} maxLength={'16'}/>)}
                </FormItem>
              </Col>
            </Row>

            <Row  gutter={28}>
              <Col span={12}>
                <FormItem {...formItemLayout} label = '级别分类'>
                    {getFieldDecorator('type_id',{initialValue:[ this.props.data.type_id2, this.props.data.type_id3]})(<Cascader placeholder='请选择' style = {{...itemStyle}} options={this.state.myLocationOption} onChange={this.onChange} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label = '品牌'>
                {getFieldDecorator('brand',{initialValue:this.props.data.brand})(<Input style = {{...itemStyle}} maxLength={'16'}/>)}
                </FormItem>
              </Col>
            </Row>

            <Row  gutter={28}>
              <Col span={12}>
                <FormItem {...formItemLayout} label = '规格型号'>
                {getFieldDecorator('normalizedForm',{initialValue:this.props.data.specification})(<Input style = {{...itemStyle}} maxLength={'16'}/>)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label = '所属楼/层'>
                {getFieldDecorator('floor',{initialValue:this.props.data.floor})(<Input style = {{...itemStyle}} maxLength={'16'}/>)}
                </FormItem>
              </Col>
            </Row>

            <Row  gutter={28}>
              <Col span={12}>
                <FormItem {...formItemLayout} label = '所属区域'>
                {getFieldDecorator('location',{initialValue:this.props.data.location})(<Input style = {{...itemStyle}} maxLength={'16'}/>)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label = '所属工位'>
                {getFieldDecorator('station',{initialValue:this.props.data.station})(<Input style = {{...itemStyle}} maxLength={'16'}/>)}
                </FormItem>
              </Col>
            </Row>

            <Row  gutter={28}>
              <Col span={12}>
                <FormItem {...formItemLayout} label = '归属部门'>
                {getFieldDecorator('charger_dept_name',{initialValue:this.props.data.charger_dept_name})(
                  <DeptList list={this.state.userList} style={{...itemStyle}}  onChange={this.checkerChange} initialData = {this.props.data.charger_dept_name}/>
                )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label = '使用部门'>
                {getFieldDecorator('user_dept_name',{initialValue:this.props.data.user_dept_name})(
                  <UserDeptList list={this.state.userList} style={{...itemStyle}} initialData = {this.props.data.user_dept_name}/>
                )}
                </FormItem>
              </Col>
            </Row>

            <Row  gutter={28}>
              <Col span={12}>
                <FormItem {...formItemLayout} label = '负责人'>
                {getFieldDecorator('charger_name',{initialValue:this.props.data.charger_name})(
                  <StaffList list={this.state.userList} style={{...itemStyle}}  onChange={this.checkerChange}  initialData = {this.props.data.charger_name}/>
                )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label = '使用人'>
                {getFieldDecorator('assetuser_name',{initialValue:this.props.data.charger_name})(
                  <UsersList list={this.state.userList} style={{...itemStyle}}  onChange={this.checkerChange} initialData = {this.props.data.assetuser_name}/>
                )}
                </FormItem>
              </Col>
            </Row>
            <Row  gutter={28}>
              <Col span={12}>
                <FormItem {...formItemLayout} label = '启用日期'>
                {getFieldDecorator('startTime',{initialValue:moment(currentDay, dateFormat)})(
                  <DatePicker style={{verticalAlign:'middle',...itemStyle}}  allowClear = {false}/>
                )}
                </FormItem>
              </Col>
            </Row>

          </Form>

      </Modal>
    )

  }
}

export default Form.create()(CommonModal);
