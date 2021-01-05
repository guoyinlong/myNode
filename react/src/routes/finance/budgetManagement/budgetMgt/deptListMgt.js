/**
 * 作者：张楠华
 * 日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：成本中心维护tab页面
 */
import React from 'react';
import { Modal,Form,Input,Select,Table,Popconfirm,Button,Switch,Checkbox,Tag,InputNumber } from 'antd';
import tableStyle from '../../../../components/common/table.less';
import cookie from 'js-cookie';
const FormItem = Form.Item;
const Option = Select.Option;

class DeptListAddOrEdit extends React.Component {

  render() {
    const { form,editData={},ou,addOrEdit } = this.props;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    const { getFieldDecorator } = form;
    return (
      <Form>
        <FormItem
          style={{display:'none'}}
          {...formItemLayout}
          label="OUId" >
          {getFieldDecorator('arg_ou_id',{initialValue:editData.ou_id?editData.ou_id:ou.split(',')[0]})(<Input style={{ width: '100%'}}/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="OU名称" >
          {getFieldDecorator('arg_ou_name',{initialValue:editData.ou_name?editData.ou_name:ou.split(',')[1]})(<Input disabled style={{ width: '100%'}}/>)}
        </FormItem>
        <FormItem
          style={{display:'none'}}
          {...formItemLayout}
          label="部门Id" >
          {getFieldDecorator('arg_dept_id',{initialValue:editData.dept_id})(<Input style={{ width: '100%'}}/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="部门名称" >
          {getFieldDecorator('arg_dept_name',{rules: [{required: true, message: '请输入部门名称!'}],initialValue:editData.dept_name})(<Input style={{ width: '100%'}}/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="部门编码" >
          {getFieldDecorator('arg_dept_code',{rules: [{required: true, message: '请输入部门编码!'}],initialValue:editData.dept_code})(<InputNumber style={{ width: '100%'}}/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="备注" >
          {getFieldDecorator('arg_dept_remark',{initialValue:editData.remark})(<Input style={{ width: '100%'}}/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="部门顺序" >
          {getFieldDecorator('arg_dept_index',{rules: [{required: true, message: '请输入部门顺序!'}],initialValue:editData.dept_index})(<InputNumber style={{ width: '100%'}}/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="部门状态" >
          {getFieldDecorator('arg_state_code', {valuePropName: 'checked',initialValue:editData.state_code?editData.state_code === '1':true})(
            <Switch/>
          )}
        </FormItem>
        {
          addOrEdit === '1' &&
          <FormItem {...tailFormItemLayout}>
            {getFieldDecorator('arg_is_update_rule', {valuePropName: 'checked',initialValue:false})(
              <Checkbox>是否选择全部费用项</Checkbox>
            )}
          </FormItem>
        }
      </Form>
    );
  }
}
export default class DeptListMgt extends React.Component{
  constructor(props){
    super(props)
  }
  state = {
    visible:false,
    addOrEdit:'',
    ou:cookie.get('OUID')+','+cookie.get('OU'),
    editData:{}
  };
  showModal = (flag,record) =>{
    this.setState({
      addOrEdit:flag,
      visible:true,
      editData : record,
    });
  };
  handleCancel = () => {
    this.setState({
      visible:false,
    });
  };
  delDeptList = (record) => {
    this.props.dispatch({
      type:'costMgt/delDeptList',
      record,
      ou:this.state.ou,
    });
  };
  queryDeptList = () => {
    this.props.dispatch({
      type:'costMgt/queryDeptList',
      ou:this.state.ou,
    });
  };
  changeSelect = (value,key) =>{
    this.setState({
      [key] : value
    })
  };
  handleOk = () => {
    const { validateFields,resetFields } = this.refs.deptListAddOrEdit;
      validateFields((err, values) => {
        if (err) {
          return;
        }else{
          this.setState({visible:false});
          this.props.dispatch({
            type:this.state.addOrEdit === '1'?'costMgt/addDeptList':'costMgt/editDeptList',
            values,
            ou:this.state.ou,
          });
          resetFields();
        }
      })

  };
  render() {
    const { costCenterList=[],ouList=[] } = this.props.data;
    costCenterList.length && costCenterList.forEach((i, index) => {i.key = index});
    const DeptListAddOrEditM = Form.create()(DeptListAddOrEdit);
    const columns = [];
    columns.push(
      // {
      //   title: 'OU',
      //   key: 'ou_name',
      //   dataIndex: 'ou_name',
      //   render:(text)=>{return(<div style={{textAlign:'left'}}>{text}</div>)}
      // },
      {
        title: '部门名称',
        key: 'dept_name',
        dataIndex: 'dept_name',
        render:(text)=>{return(<div style={{textAlign:'left'}}>{text}</div>)}
      },
      {
        title: '部门编码',
        key: 'dept_code',
        dataIndex: 'dept_code',
        render:(text)=>{return(<div style={{textAlign:'left'}}>{text}</div>)}
      },
      {
        title: '备注',
        key: 'remark',
        dataIndex: 'remark',
        render:(text)=>{return(<div style={{textAlign:'left'}}>{text}</div>)}
      },
      {
        title: '部门顺序',
        key: 'dept_index',
        dataIndex: 'dept_index',
      },
      {
        title: '部门状态',
        key: 'state_code',
        dataIndex: 'state_code',
        render:(text)=>{return(<div>{text === '1'?<Tag style={{cursor: 'default'}} color="#87d068">开启</Tag>:<Tag style={{cursor: 'default'}} color="#f50">关闭</Tag>}</div>)}
      },
      {
        title: '操作',
        key: '',
        dataIndex: '',
        render: (text,record) => {
          return (
            <div style={{textAlign:'center'}}>
              <Popconfirm title={'确定要删除吗？'} onConfirm= {() => this.delDeptList(record)}>
                <Button size='small' type="primary">{'删除'}</Button>
              </Popconfirm>&nbsp;&nbsp;
              <Button size='small' type="primary" onClick={() => this.showModal('2',record)}>{'编辑'}</Button>
            </div>
          )
        }
      }
    );
    return (
      <div>
        <div style={{overflow:'hidden',height:'40px'}}>
          <Select showSearch style={{ width: 200}}  value={this.state.ou} onSelect={(value)=>this.changeSelect(value,'ou')} >
            {ouList.map((item) => <Option key={item.dept_id+','+item.dept_name}>{item.dept_name}</Option>)}
          </Select>&nbsp;&nbsp;
          <Button type="primary" onClick={this.queryDeptList}>{'查询'}</Button>
          <Button style={{float:'right'}} type="primary" onClick={() => this.showModal('1')}>{'新增'}</Button>
        </div>
        <Table className={tableStyle.orderTable} columns={columns} dataSource={costCenterList}/>
        <Modal
          title={this.state.addOrEdit === '1'?'添加成本中心':'编辑成本中心 '}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <DeptListAddOrEditM
            ref="deptListAddOrEdit"
            costCenterList={costCenterList}
            editData={this.state.editData}
            ou={this.state.ou}
            addOrEdit={this.state.addOrEdit}
          />
        </Modal>
      </div>
    );
  }
}

