/**
 * 作者：张楠华
 * 日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：dw科目tab页面
 */
import React from 'react';
import {Modal,Form,Input,Select,Table,Popconfirm,Button } from 'antd';
import tableStyle from '../../../../components/common/table.less';
import TableSearch from './tableSearch';
const FormItem = Form.Item;
const Option = Select.Option;

class DWListAdd extends React.Component {

  render() {
    const { form } = this.props;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const { getFieldDecorator } = form;
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="会计科目" >
          {getFieldDecorator('accountingSubject',{rules: [{required: true, message: '请输入会计科目!'}]})(<Input style={{ width: '100%'}}/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="会计科目编码" >
          {getFieldDecorator('subjectCode',{rules: [{required: true, message: '请输入会计科目编码!'}]})(<Input style={{ width: '100%'}}/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="科目描述" >
          {getFieldDecorator('subjectDec',{rules: [{required: true, message: '请输入科目描述!'}]})(<Input style={{ width: '100%'}}/>)}
        </FormItem>
      </Form>
    );
  }
}
class DWListEdit extends React.Component {

  render() {
    const { form,editData } = this.props;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const { getFieldDecorator } = form;
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="会计科目" >
          {getFieldDecorator('accountingSubjectEdit',{rules: [{required: true, message: '请输入会计科目!'}],initialValue:editData.dw_fee_name})(<Input style={{ width: '100%'}}/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="会计科目编码" >
          {getFieldDecorator('subjectCodeEdit',{rules: [{required: true, message: '请输入会计科目编码!'}],initialValue:editData.dw_fee_code})(<Input style={{ width: '100%'}}/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="科目描述" >
          {getFieldDecorator('subjectDecEdit',{rules: [{required: true, message: '请输入科目描述!'}],initialValue:editData.dw_fee_desc})(<Input style={{ width: '100%'}}/>)}
        </FormItem>
      </Form>
    );
  }
}
export default class DWListMgt extends React.Component{
  constructor(props){
    super(props)
  }
  state = {
    visible:false,
    visibleEdit:false,
  };

  showModal = () =>{
    this.setState({
      visible:true,
    });
  };
  showModalEdit = (record) =>{
    this.setState({
      visibleEdit:true,
      editData : record,
    });
  };
  handleCancel = () => {
    this.setState({
      visible:false,
    });
  };
  handleCancelEdit = () => {
    this.setState({
      visibleEdit:false,
    });
  };
  delDWList = (record) => {
    this.props.dispatch({
      type:'costMgt/delDWList',
      record,
    });
  };
  handleOk = (flag) => {
    if(flag === 'DWListAdd'){
      this.refs.DWListAdd.validateFields((err, values) => {
        if (err) {
          return null;
        }else{
          this.setState({visible:false});
          let addDWList = {
            accountingSubject:values.accountingSubject,
            subjectDec:values.subjectDec,
            subjectCode:values.subjectCode,
          };

          this.props.dispatch({
            type:'costMgt/addDWList',
            addDWList,
          });
        }
      })
    }else if(flag === 'DWListEdit'){
      this.refs.DWListEdit.validateFields((err, values) => {
        if (err) {
          return null;
        }else{
          this.setState({visibleEdit:false});
          let editDWList = {
            accountingSubject:values.accountingSubjectEdit,
            subjectDec:values.subjectDecEdit,
            subjectCode:values.subjectCodeEdit,
            dwFeeId : this.state.editData.dw_fee_id,
          };
          this.props.dispatch({
            type:'costMgt/editDWList',
            editDWList,
          });
        }
      })
    }
  };
  render() {
    const { DWList } = this.props.data;
    if (DWList.length) {
      DWList.map((i, index) => {
        i.key = index;
      })
    }
    const DWDataAdd = Form.create()(DWListAdd);
    const DWDataEdit = Form.create()(DWListEdit);
    const columns = [];
    columns.push(
      {
        title: '会计科目',
        key: 'dw_fee_name',
        dataIndex: 'dw_fee_name',
        render:(text)=>{return(<div style={{textAlign:'left'}}>{text}</div>)}
      },
      {
        title: '会计科目编码',
        key: 'dw_fee_code',
        dataIndex: 'dw_fee_code',
        render:(text)=>{return(<div style={{textAlign:'left'}}>{text}</div>)}
      },
      {
        title: '科目描述',
        key: 'dw_fee_desc',
        dataIndex: 'dw_fee_desc',
        render:(text)=>{return(<div style={{textAlign:'left'}}>{text}</div>)}
      },
      {
        title: '操作',
        key: '',
        dataIndex: '',
        render: (text,record) => {
          return (
            <div style={{textAlign:'center'}}>
              <Popconfirm title={'确定要删除吗？'} onConfirm= {() => this.delDWList(record)}>
                <Button
                  size='small'
                  type="primary">
                  {'删除'}
                </Button>
              </Popconfirm>&nbsp;&nbsp;
              <Button
                size='small'
                type="primary" onClick={() => this.showModalEdit(record)}>
                {'编辑'}
              </Button>
            </div>
          )
        }
      }
    );
    const needSearch=['dw_fee_name','dw_fee_code'];
    return (
      <div>
        <div style={{overflow:'hidden'}}>
          <Button style={{float:'right'}} type="primary" onClick={() => this.showModal()}>{'新增'}</Button>
        </div>
        <div style={{marginTop:'-30px'}}><TableSearch columns = {columns} dataSource={DWList} needSearch={needSearch}/></div>
        {/*<Table className={tableStyle.orderTable} columns={columns} dataSource={DWList}/>*/}
        <Modal
          title={'添加DW科目'}
          visible={this.state.visible}
          onOk={()=>this.handleOk('DWListAdd')}
          onCancel={this.handleCancel}
          width={640}
          maskClosable={false}
        >
          <DWDataAdd
            ref="DWListAdd"
            DWList={DWList}
          />
        </Modal>
        <Modal
          title={'修改DW科目'}
          visible={this.state.visibleEdit}
          onOk={()=>this.handleOk('DWListEdit')}
          onCancel={this.handleCancelEdit}
          width={640}
          maskClosable={false}
        >
          <DWDataEdit
            ref="DWListEdit"
            DWList={DWList}
            editData = {this.state.editData}
          />
        </Modal>
      </div>
    );
  }
}

