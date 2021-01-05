/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划开启
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../../../components/employer/employer.less'
import { Table,Input,Button,Icon,Modal,message,Form,Select,DatePicker } from 'antd'
import styles from '../../../components/employer/employer.less'
import tableStyle from '../../../components/finance/table.less'
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const { MonthPicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
function operation (text, record,ss){
  if(record.stateCode === '2'){
    return (
      <div>
        <Button style={{margin: '0 5px'}} size='small' onClick={()=>ss.showEditModal(record)}>{'编辑'}</Button>
        <Button style={{margin: '0 5px'}} size='small' type="danger" ghost onClick={(e)=>ss.showConfirm(e,record)}>{'删除'}</Button>
        <Button style={{margin: '0 5px'}} size='small' onClick={(e)=>ss.showEndState(e,record)}>{'立即结束'}</Button>
      </div>
    )
  }if(record.stateCode === '1'){
    return(
      <div>
        <Button style={{margin: '0 5px'}} size='small' disabled>{'编辑'}</Button>
        <Button style={{margin: '0 5px'}} size='small' disabled ghost>{'删除'}</Button>
        <Button style={{margin: '0 5px'}} size='small' disabled>{'立即结束'}</Button>
      </div>
    )
  }
}
class FundingPlanStart extends React.Component{
  constructor(props){
    super(props);
    const{thead,needSearch}=this.props;
    this.state={
      visible1 : false,
      visible2 : false,
      fillTimeEdit : '',
      beginTimeEdit:moment(),
      endTimeEdit:moment(),
      year:'',
      month:'',
      batchNumber:''
    };
    if(thead){
      this.thead=thead
    }
    if(needSearch){
      this.needSearch=needSearch
    }
  }

  showAddModal=()=>{
    this.setState({
      visible1 : true
    })
  };
  showEditModal=(record)=>{
    this.setState({
      visible2 : true,
      fillTimeEdit:record.reportType ==='1'? '预填报资金计划':'调整资金计划',
      beginTimeEdit:moment(record.startTime),
      endTimeEdit:moment(record.endTime),
      year:record.planYear,
      month:record.planMonth,
      batchNumber:record.batch_number,
    })
  };
  addCancel=()=>{
    const { resetFields } = this.props.form;
    resetFields();
    this.setState({visible1 : false})
  };
  editCancel=()=>{
    const { resetFields } = this.props.form;
    resetFields();
    this.setState({ visible2: false });

  };
  addTime=()=>{
    const { validateFields,resetFields } = this.props.form;
    let that = this;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      if(!values.fillTime){
        message.info('填报阶段不能为空');
        return;
      }
      if(!values.yearMonth){
        message.info('年月不能为空');
        return;
      }
      if(!values.beginTime){
        message.info('开始时间不能为空');
        return;
      }
      if(!values.endTime){
        message.info('结束时间不能为空');
        return;
      }
      if(values.endTime - values.beginTime < 0){
        message.info('开始时间不能大于结束时间');
        return;
      }
      that.props.dispatch({
        type:'fundingPlanStart/addTime',
        values,
      });
      resetFields();
      this.setState({ visible1: false });
    });
  };
  editTime=()=>{
    const { validateFields,resetFields } = this.props.form;
    let that = this;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      if(!values.beginTimeEdit){
        message.info('开始时间不能为空');
        return;
      }
      if(!values.endTimeEdit){
        message.info('结束时间不能为空');
        return;
      }
      if(values.endTimeEdit - values.beginTimeEdit < 0){
        message.info('开始时间不能大于结束时间');
        return;
      }
      that.props.dispatch({
        type:'fundingPlanStart/editTime',
        values,
        ...that.state,
      });
      resetFields();
      this.setState({ visible2: false });
    });
  };
  showConfirm=(e,record)=> {
    e.stopPropagation();
    let thisMe = this;
    confirm({
      title: '确定删除吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        thisMe.delTime(record)
      },
    });
  };
  showEndState=(e,record)=> {
    e.stopPropagation();
    let thisMe = this;
    confirm({
      title: '确定结束该阶段吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        thisMe.endState(record)
      },
    });
  };
  endState=(record)=>{
    this.props.dispatch({
      type:'fundingPlanStart/endState',
      batchNumber : record.batch_number
    });
  };
  delTime=(record)=>{
    this.props.dispatch({
      type:'fundingPlanStart/delTime',
      batchNumber : record.batch_number
    });
  };
  needSearch=['planMonth'];
  //需要筛选的字段，key-value值需与后台返回的字段一致。key-value-text
  needFilter=[
    {
      key:'planYear',
      filters: [
        {text: (new Date().getFullYear()-2).toString(), value: (new Date().getFullYear()-2).toString(),},
        {text: (new Date().getFullYear()-1).toString(), value: (new Date().getFullYear()-1).toString(),},
        {text: new Date().getFullYear().toString(), value: new Date().getFullYear().toString(),},
      ]
    },
    {
      key:'reportType',
      filters: [
        {text: '预填报资金计划', value: '1',},
        {text: '调整资金计划', value: '2',},
      ]
    }
  ];
  //表格中的数据
  getHeader=()=>{
    return [
      {
        title: '序号',
        dataIndex: '',
        key:'index',
        render: (text, record,index) => {return (index+1)},
      },
      {
        title:'年度',
        dataIndex:'planYear'
      },
      {
        title:'月份',
        dataIndex:'planMonth',
      },
      {
        title:'填报阶段',
        dataIndex:'reportType',
        render:(text)=>{ return(text ==='1'? '预填报资金计划':'调整资金计划') }
      },
      {
        title:'开始时间',
        dataIndex:"startTime",
      },
      {
        title:'结束时间',
        dataIndex:"endTime",
      },
      {
        title:'操作',
        dataIndex:"opt",
        render:(text,record)=>operation(text,record,this)
      }
    ];
  };


  setSearchComponent(key){
    if(!this.state[key]){
      this.state[key]={}
    }
    return {
      filterDropdown: (
        <div className={styles.filterDropdown}>
          <Input
            ref={ele => this.state[key].searchInput = ele}
            onChange={this.onInputChange(key)}
            onPressEnter={this.onSearch(key)}
          />
          <Button type="primary" onClick={this.onSearch(key)}>搜索</Button>
        </div>
      ),
      filterIcon: <Icon type="search" style={{ color: this.state[key].filtered ? '#FA7252' : null}} />,
      filterDropdownVisible: this.state[key].filterDropdownVisible||false,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          [key]:{...this.state[key],filterDropdownVisible: visible,}
        },() => this.state[key].searchInput.focus());
      },
    }
  }

  onInputChange =(key)=> (e) => {
    this.state[key].searchText=e.target.value
  };

  onSearch = (key)=>() => {
    const { searchText } = this.state[key];
    this.setState({[key]:{
      ...this.state[key],
      filterDropdownVisible: false,
      filtered: !!searchText,}
    });
  };

  pagination={
    //showQuickJumper:true,
    showSizeChanger:true,
  };

  clearFilter=()=>{
    let s=this.state;let noSearch={};
    for(let k in s){
      if(s[k]!==null&&typeof s[k]==='object'&&s[k].searchText){
        let {searchInput}=s[k];
        searchInput.refs.input.value='';
        noSearch[k]={...s[k],searchText:'',filtered:false,searchInput}
      }
    }
    this.setState({
      ...noSearch,
      filterInfo:null
    })
  };

  tableChangeHandle=(pagination, filters)=>{
    this.setState({
      filterInfo:filters
    })
  };
  disabledDate=(value)=>{
    if(value){
      let lastDate =  moment();
      return value.valueOf() < lastDate.valueOf();
    }
  };
  render(){
    let {list,loading}=this.props;
    let disableAdd = false;
    if(list.length){
      for(let i=0;i<list.length;i++){
        if(list[i].stateCode === '2'){
          disableAdd = true;
          break;
        }
      }
    }
    let thead=this.thead||this.getHeader();
    if(list.length){
      list.map((i,index)=>{
        i.key=index;
      })
    }
    //给头部添加搜索组件
    if(!this.thead){
      //加自定义搜索
      if(this.needSearch&&this.needSearch.length){
        this.needSearch.map(i=>{
          thead.map((k,index)=>{
            if(k.dataIndex===i&&!k.filterDropdown){
              thead[index]={...k,...this.setSearchComponent(i)}
            }
          });
          if(this.state[i].filtered){
            const reg = new RegExp(this.state[i].searchText, 'gi');
            list=list.filter(item=>{
              if(reg.lastIndex !== 0){
                reg.lastIndex = 0;
              }
              return reg.test(item[i])
            }).map(item=>{
              const match = item[i].match(reg);
              for(let key=0;key<thead.length;key++){
                if(thead[key].dataIndex===i&&thead[key].render){
                  return item
                }
              }
              return {...item,[i]:<span>
              {item[i].split(reg).map((text, index) => (
                index > 0 ? [<span className={styles.highlight}>{match[0]}</span>, text] : text
              ))}
            </span>}
            })
          }
        })
      }
      //加自定义过滤
      if(this.needFilter&&this.needFilter.length){
        this.needFilter.map(i=>{
          thead.map(k=>{
            if(i.key===k.dataIndex){
              k.filters=i.filters;
              k.onFilter=(value,record)=>record[i.key].indexOf(value) === 0;
              if(i.onFilter){
                k.onFilter=i.onFilter
              }
              k.filteredValue=this.state.filterInfo?this.state.filterInfo[k.dataIndex]:[]
            }
          })
        })
      }
    }
    const { getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return(
      <div className={styles.wrap}>
        {
          this.needFilter.length !== 0||this.needSearch.length !== 0?
            <Button type='primary' onClick={this.clearFilter} style={{marginBottom:'10px'}}>清空条件</Button>
            :
            null
        }
        <Button type='primary' onClick={this.showAddModal} style={{marginBottom:'10px',float:'right'}} disabled={disableAdd}>新增</Button>
        <Table
          onChange={this.tableChangeHandle}
          pagination={this.pagination}
          columns={thead}
          dataSource={list}
          className={tableStyle.financeTable}
          loading={loading}/>
        <Modal
          visible={this.state.visible1}
          title="新增开放时间"
          onCancel={this.addCancel}
          onOk={this.addTime}
          maskClosable={false}
        >
          <Form>
            <FormItem label="填报阶段" {...formItemLayout}>
              {getFieldDecorator('fillTime')(
                <Select showSearch style={{width: 200}} placeholder="请选择填报阶段">
                  <Option value="1">预填报资金计划</Option>
                  <Option value="2">调整资金计划</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="年月" {...formItemLayout}>
              {getFieldDecorator('yearMonth')(
                <MonthPicker  format="YYYY-MM"  style={{width:'200px'}}/>
              )}
            </FormItem>
            <FormItem label="开始时间" {...formItemLayout}>
              {getFieldDecorator('beginTime')(
                <DatePicker  format="YYYY-MM-DD" allowClear={false}  style={{width:'200px'}}/>
              )}
            </FormItem>
            <FormItem label="结束时间" {...formItemLayout}>
              {getFieldDecorator('endTime')
              (<DatePicker disabledDate={this.disabledDate}  allowClear={false} format="YYYY-MM-DD" style={{width:'200px'}}/>
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          visible={this.state.visible2}
          title={"修改开放时间"+'（'+this.state.year+'-'+this.state.month+'）'}
          onCancel={this.editCancel}
          onOk={this.editTime}
          maskClosable={false}
        >
          <Form>
            <FormItem label="填报阶段" {...formItemLayout}>
              {getFieldDecorator('fillTimeEdit')(
                <div>{this.state.fillTimeEdit}</div>
              )}
            </FormItem>
            <FormItem label="开始时间" {...formItemLayout}>
              {getFieldDecorator('beginTimeEdit', {
                initialValue:this.state.beginTimeEdit,
              })(
                <DatePicker  format="YYYY-MM-DD" allowClear={false} style={{width:'200px'}}/>
              )}
            </FormItem>
            <FormItem label="结束时间" {...formItemLayout}>
              {getFieldDecorator('endTimeEdit',{
                initialValue:this.state.endTimeEdit,
              })
              (<DatePicker disabledDate={this.disabledDate} allowClear={false} format="YYYY-MM-DD" style={{width:'200px'}}/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.fundingPlanStart,
    ...state.fundingPlanStart
  };
}
const FundingPlanStartFrom = Form.create()(FundingPlanStart);
export default connect(mapStateToProps)(FundingPlanStartFrom);
