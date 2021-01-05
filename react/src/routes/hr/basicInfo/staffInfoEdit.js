/**
 *  作者: 耿倩倩
 *  创建日期: 2017-08-11
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现个人信息维护功能
 */
import React from 'react';
import {connect } from 'dva';
import {Button,Form,Input,Icon,Tooltip} from 'antd';
import styles from './basicInfo.less';
import Cookie from 'js-cookie';
import DataSyncTips from "../../../components/hr/dataSyncTips";
const FormItem = Form.Item;
/**
 * 作者：耿倩倩
 * 创建日期：2017-09-11
 * 功能：实现个人信息修改的表单功能
 */
class ModifyForm extends React.Component{
  handleOk = () =>{
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        if(values.username && values.tel){
          let postData_c = {};
          postData_c["arg_userid"] = values.staff_id;        //通过form的validateFields获取
          postData_c["arg_username"] = values.username;      //通过form的validateFields获取
          postData_c["arg_tel"] = values.tel;               //通过form的validateFields获取
          this.props.handleOk(postData_c);
        }
      }
    });
  };

  render(){
    const {getFieldDecorator} = this.props.form;
    const {tableDataList,editDisabled} =  this.props;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 9
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 11
        }
      },
      style :{marginBottom:10}
    };

    return (
      <Form style={{marginTop:26}}>
        <FormItem label="姓名" {...formItemLayout}>
          {getFieldDecorator('username',{
            initialValue:tableDataList[0].username})(<Input disabled={editDisabled}/>)}
        </FormItem>
        <FormItem label="手机" {...formItemLayout}>
          {getFieldDecorator('tel', {
            rules: [
              {
                pattern:/^(1)[0-9]{10}$/,
                message: '请输入正确的手机号码！'
              }
            ],
            initialValue:tableDataList[0].tel
          })(<Input  disabled={editDisabled}/>)}
        </FormItem>
        <FormItem label="员工编号" {...formItemLayout} >
           {getFieldDecorator('staff_id',{
           initialValue:tableDataList[0].staff_id})(<Input disabled={true}/>)}
        </FormItem>

        <FormItem label="部门" {...formItemLayout}>
          {getFieldDecorator('deptname',{
            initialValue:tableDataList[0].deptname.split('-')[1]})(<Input disabled={true}/>)}
        </FormItem>
        <FormItem label="职务" {...formItemLayout}>
          {getFieldDecorator('post_name',{
            initialValue:tableDataList[0].post_name})(<Input disabled={true}/>)}
        </FormItem>
        <FormItem label="职务类型" {...formItemLayout}>
          {getFieldDecorator('post_type',{
            initialValue:tableDataList[0].post_type === '0'?'主岗':'兼职'})(<Input disabled={true}/>)}
        </FormItem>
        <FormItem label="邮箱" {...formItemLayout}>
          {getFieldDecorator('email',{
            initialValue:tableDataList[0].email})(<Input disabled={true}/>)}
        </FormItem>
        {editDisabled?
          <div style={{marginLeft:335,marginBottom:10}}>
            <Button style={{color:'white',backgroundColor:'#c0c0c0',borderColor:'c0c0c0',cursor:'default'}}>{'取消'}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button style={{color:'white',backgroundColor:'#c0c0c0',borderColor:'c0c0c0',cursor:'default'}}>{'保存'}</Button>
          </div>
          :
          <div style={{marginLeft:335,marginBottom:10}}>
            <Button type="primary" onClick={()=>this.props.handleCancel()}>{'取消'}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.handleOk}>{'保存'}</Button>
          </div>
        }

      </Form>
    );
  }
}

/**
 * 作者：耿倩倩
 * 创建日期：2017-09-11
 * 功能：实现个人信息修改的编辑功能
 */
class staffInfoEdit extends React.Component {

  constructor(props) {super(props);}

  state = {editDisabled:true};

  //编辑按钮是否可用
  startEdit = () =>{
    this.setState({
      editDisabled:false
    });
  };

  handleCancel = () =>{
    this.setState({
      editDisabled:true
    });
  };

  handleOk = (data) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'staffInfoEdit/staffInfoModify',
      param:data
    });
    this.setState({
      editDisabled:true
    });
  };

  render() {
    const {tableDataList,postData,flag_change,dispatch} = this.props;
    // 这里为每一条记录添加一个key，从0开始
    if(tableDataList.length){
      tableDataList.map((i,index)=>{
        i.key=index;
      })
    }
    const auth_ou = Cookie.get('OU');
    const ModifyFormNew = Form.create()(ModifyForm);
    return (
      <div className={styles.meetWrap}>
        <div className={styles.headerName}>{'个人信息维护'}</div>
        <div style={{marginBottom:'40px'}}>
          <div style={{float:'left',marginTop:'12px',marginLeft:'5px'}}>组织单元：{auth_ou}</div>
        </div>
        {tableDataList.length>0?
            <div style={{width:500,margin:'0 auto',border:'1px solid',borderRadius:8,position:'relative'}}>
              <ModifyFormNew
                ref = "modifyForm"
                tableDataList = {tableDataList}
                editDisabled = {this.state.editDisabled}
                handleOk = {(data)=>this.handleOk(data)}
                handleCancel = {()=>this.handleCancel()}
              />
              {this.state.editDisabled?
                <Tooltip title="编辑">
                  <Icon type='bianji'
                        style={{position:'absolute',top:6,right:6,fontSize:20,color:'grey',cursor:'pointer'}}
                        onClick={this.startEdit}
                  />
                </Tooltip>
                :
                <Icon type='bianji'
                      style={{position:'absolute',top:6,right:6,fontSize:20,color:'grey'}}
                />
              }

            </div>
          :
          null
        }

        {/*数据同步提示*/}
        <DataSyncTips
          ref="dataSyncTips"
          dispatch = {dispatch}
          postData = {postData}
          param_service = {'staffInfoEdit/staffInfoSearch'}
          param_setFlag = {'staffInfoEdit/setFlag'}
          flag_change = {flag_change}
        />
      </div>
    );
  }
}
function mapStateToProps (state) {
  const {tableDataList,postData,flag_change} = state.staffInfoEdit;
  return {
    loading: state.loading.models.staffInfoEdit,
    tableDataList,
    postData,
    flag_change
  };
}

export default connect(mapStateToProps)(staffInfoEdit);
