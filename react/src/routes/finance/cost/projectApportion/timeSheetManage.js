/**
 * 作者：张楠华
 * 日期：2017-10-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：工时管理页面展示
 */
import React from 'react';
import { connect } from 'dva';
import { Select,Table,Button,DatePicker,message,Tooltip,Input,Icon,Popconfirm,Spin } from 'antd';
import styles from '../../../../components/finance/table.less'
import Style from '../../../../components/finance/finance.less'
import s from '../costCommon.css'
import { exportExlTimeSheet } from './exportExlTimeSheet'
import config from '../../../../utils/config'
const Option = Select.Option;
const { MonthPicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {TagDisplay} from "../costCommon";
moment.locale('zh-cn');
/**
 * 作者：张楠华
 * 创建日期：2017-10-18
 * 功能：格式化数据
 */
function MoneyComponent({text}) {
  if(text === '0.0'){
    return (<div style={{textAlign:'right',letterSpacing:1}}>-</div>)
  }else{
    return (<div style={{textAlign:'right',letterSpacing:1}}>{text}</div>)
  }
}
/**
 * 作者：张楠华
 * 创建日期：2017-10-16
 * 功能：展示工时管理页面
 */
class deptApportionManage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      ou:localStorage.ou,
      timeSheetMonth:null,
      statisticType:'1',
    };
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择组织单元
   */
  selectOu=(value)=>{
    const { dispatch } = this.props;
    let { statisticType,timeSheetMonth } =this.state;
    this.setState({
      ou:value,
    });
    dispatch({
      type:'timeSheetManage/timeSheetDataQuery',
      ou:value,
      timeSheetMonth:timeSheetMonth !== null ? timeSheetMonth : this.props.recentMonth,
      statisticType:statisticType,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改变月份
   */
  changeMonth=(value)=>{
    const { dispatch } = this.props;
    let { ou,statisticType} =this.state;
    this.setState({
      timeSheetMonth:value,
    });
    dispatch({
      type:'timeSheetManage/timeSheetDataQuery',
      ou:ou,
      timeSheetMonth:value,
      statisticType:statisticType,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择统计类型
   */
  selectStatisticType=(value)=>{
    const { dispatch } = this.props;
    let { ou,timeSheetMonth } =this.state;
    this.setState({
      statisticType:value
    });
    dispatch({
      type:'timeSheetManage/timeSheetDataQuery',
      ou:ou,
      timeSheetMonth:timeSheetMonth !== null ? timeSheetMonth : this.props.recentMonth,
      statisticType:value,
    });
  };
  //同步工时情况
  synTimeSheet=()=>{
    const { dispatch } = this.props;
    const { ou,timeSheetMonth,statisticType } = this.state;
    if( ou === ''){
      message.info('OU不能为空');
      return null;
    }else{
      dispatch({
        type:'timeSheetManage/synTimeSheet',
        ou,
        timeSheetMonth:timeSheetMonth !== null ? timeSheetMonth : this.props.recentMonth,
        statisticType
      });
    }
  };
  expExl=(e,list)=>{
    const { deptList } = this.props;
    if(list !== null && list.length !== 0){
      exportExlTimeSheet(list, "工时数据", deptList)
    }else{
      message.info("查询结果为空！")
    }
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：清除条件
   */
  clearFilter=()=>{
    let s=this.state;
    let noSearch={};
    for(let k in s){
      if(s[k]!==null&&typeof s[k]==='object'&&s[k].searchText){
        let {searchInput}=s[k];
        searchInput.refs.input.value='';
        noSearch[k]={...s[k],searchText:'',filtered:false,searchInput}
      }
    }
    this.setState({
      ...noSearch,
    })
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：通过该方法，给表头添加搜索
   */
  setSearchComponent(key){
    if(!this.state[key]){
      this.state[key]={}
    }
    return {
      filterDropdown: (
        <div className={Style.filterDropdown}>
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
  };
  onSearch = (key)=>() => {
    const { searchText } = this.state[key];
    this.setState({[key]:{
      ...this.state[key],
      filterDropdownVisible: false,
      filtered: !!searchText,}
    });
  };
  onInputChange =(key)=> (e) => {
    this.state[key].searchText=e.target.value
  };
  needSearch=['proj_code','proj_name'];
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：控制权限
   */
  rightControlSyn=()=>{
    const { rightData } =this.props;
    let flag = false;
    for(let i=0;i<rightData.length;i++){
      if(rightData[i].fullurl === config.sync){
        flag =true;
        break;
      }
    }
    return flag;
  };
  componentDidMount(){
    this.state.boxWidth=document.getElementById('table1').clientWidth;
  }
  /**
   * 作者：张楠华
   * 创建日期：2017-11-8
   * 功能：限定月份
   */
  disabledDate=(value)=>{
    if(value){
      let lastDate =  moment().valueOf();
      return value.valueOf() > lastDate
    }
  };
  render() {
    const { loading,ouList,stateParamList,deptList,recentMonth } = this.props;
    let { list } =this.props;
    const { ou,timeSheetMonth } = this.state;
    //手动给每一个list一个key，不然表格数据会报错
    if (list.length) {
      list.map((i, index) => {
        i.key = index;
      })
    }
    //组织单元列表
    let ouList1;
    if(ouList.length !== 0){
      ouList1 = ouList.map((item) => {
        return (
          <Option key={item.dept_name}>
            {item.dept_name}
          </Option>
        )
      });
    }
    //统计类型参数
    let stateParam;
    if(stateParamList.length !== 0){
      stateParam = stateParamList.map((item) => {
        return (
          <Option key={item.state_code}>
            {item.state_name}
          </Option>
        )
      });
    }
    //表头参数
    let deptListData;
    let columns=[];
    let columns1=[];
    let columns2=[];
    let columns3=[];
    if(deptList.length !== 0){
      deptListData = deptList.map((item) => {
        return (
          <Option key={item}>
            {item}
          </Option>
        )
      });
      //表格数据
      for(let i=0;i<deptListData.length;i++){
        columns2[i] ={
          title: deptListData[i].key.split('-')[1],
          dataIndex: deptListData[i].key,
          key:deptListData[i].key,
          width:'180px',
          render:(text,record)=><MoneyComponent text={record[deptListData[i].key]}/>
        };
      }
      if(deptList.length<=3){
        columns1 = [
          {
            title: '序号',
            dataIndex: 'key',
            width:50,
            render: (text)=>{return <div>{text+1}</div>}
          },
          {
            title:  '项目名称',
            dataIndex: 'proj_name',
            key:'proj_name',
            width:220,
            render:(text, record) => {
              if(record.proj_code === '项目工时合计' || record.proj_code === '总有效工时'){
                return {
                  children:
                    <div style={{textAlign:'left'}}>{record.proj_name}</div>,
                  props:{ colSpan:0 }
                }
              }else{
                return {
                  children:
                    <div style={{textAlign:'left'}}>{record.proj_name}</div>,
                }
              }
            },
          },
          {
            title: '项目编号',
            dataIndex:'proj_code',
            key:'proj_code',
            width:130,
            render:(text, record) => {
              if(record.proj_code === '项目工时合计' || record.proj_code === '总有效工时'){
                return {
                  children:<div style={{textAlign:'left'}}>{record.proj_code}</div>,
                  props:{ colSpan:4}
                }
              }else{
                return {
                  children:<div style={{textAlign:'left'}}>{record.proj_code}</div>,
                }
              }
            },
          },
          {
            title:  'pms编码',
            dataIndex: 'pms_code',
            key:'pms_code',
            width:130,
            render:(text, record) => {
              if(record.proj_code === '项目工时合计' || record.proj_code === '总有效工时'){
                return {
                  children:
                    <div style={{textAlign:'left'}}>{record.pms_code}</div>,
                  props:{ colSpan:0 }
                }
              }else{
                return {
                  children:
                    <div style={{textAlign:'left'}}>{record.pms_code}</div>,
                }
              }
            },
          },
          {
            title:  '项目状态',
            dataIndex: 'proj_tag',
            width:90,
            render:(text, record) => {
              if(record.proj_code === '项目工时合计' || record.proj_code === '总有效工时'){
                return {
                  children:
                    <div style={{textAlign: 'center'}}><TagDisplay  proj_tag={text}/></div>,
                  props:{ colSpan:0 }
                }
              }else{
                return {
                  children:
                    <div style={{textAlign: 'center'}}><TagDisplay  proj_tag={text}/></div>,
                }
              }
            },
          },
        ];
        columns3 = [
          {
            title: '总计',
            dataIndex: 'total',
            key:'total',
            width:100,
            render:(text)=>{ return <div style={{textAlign : 'right'}}>{text}</div> }
          }
        ];
      }else{
        columns1 = [
          {
            title: '序号',
            dataIndex: 'key',
            width:50,
            fixed: 'left',
            render: (text)=>{return <div>{text+1}</div>}
          },
          {
            title:  '项目名称',
            dataIndex: 'proj_name',
            key:'proj_name',
            width:220,
            fixed:'left',
            render:(text, record) => {
              if(record.proj_code === '项目工时合计' || record.proj_code === '总有效工时'){
                return {
                  children:
                    <div style={{textAlign:'left'}}>{record.proj_name}</div>,
                  props:{ colSpan:0}
                }
              }else{
                return {
                  children:
                    <div style={{textAlign:'left'}}>{record.proj_name}</div>,
                }
              }
            },
          },
          {
            title: '项目编号',
            dataIndex:'proj_code',
            key:'proj_code',
            width:130,
            fixed:'left',
            render:(text, record) => {
              if(record.proj_code === '项目工时合计' || record.proj_code === '总有效工时'){
                return {
                  children:<div style={{textAlign:'left'}}>{record.proj_code}</div>,
                  props:{ colSpan:4}
                }
              }else{
                return {
                  children:<div style={{textAlign:'left'}}>{record.proj_code}</div>,
                }
              }
            },
          },
          {
            title:  'pms编码',
            dataIndex: 'pms_code',
            key:'pms_code',
            width:130,
            fixed: 'left',
            render:(text, record) => {
              if(record.proj_code === '项目工时合计' || record.proj_code === '总有效工时'){
                return {
                  children:
                    <div style={{textAlign:'left'}}>{record.pms_code}</div>,
                  props:{ colSpan:0 }
                }
              }else{
                return {
                  children:
                    <div style={{textAlign:'left'}}>{record.pms_code}</div>,
                }
              }
            },
          },
          {
            title:  '项目状态',
            dataIndex: 'proj_tag',
            width:90,
            fixed: 'left',
            render:(text, record) => {
              if(record.proj_code === '项目工时合计' || record.proj_code === '总有效工时'){
                return {
                  children:<div style={{textAlign: 'center'}}><TagDisplay  proj_tag={text}/></div>,
                  props:{ colSpan:0 }
                }
              }else{
                return {
                  children:
                    <div style={{textAlign: 'center'}}><TagDisplay  proj_tag={text}/></div>,
                }
              }
            },
          },
        ];
        columns3 = [
          {
            title: '总计',
            dataIndex: 'total',
            key:'total',
            width:100,
            fixed:'right',
            render:(text)=>{ return <div style={{textAlign : 'right'}}>{text}</div> }
          }
        ];
      }
      columns = columns1.concat(columns2);
      columns = columns.concat(columns3);
    }
    let objScroll={
      x:this.state.boxWidth,
      y:500
    };

    objScroll.x=720+deptList.length*180;

    //添加表头搜索
    //i代表map里面的每一项，目前是两项staff_name,proj_name。k代表表头信息。
    //遍历表头，如果存在staff_name,proj_name，执行setSearchComponent。
    if(this.needSearch && columns.length !== 0){
      this.needSearch.map(i=> {
        columns.map((k,index)=>{
          if(k.dataIndex===i&&!k.filterDropdown){
            columns[index]={...k,...this.setSearchComponent(i)}
          }
        });
        //点击onSearch进入该方法，通过正则过滤信息，使得list过滤出来。
        //如果filtered为true，即有查询条件的时候即进入该方法。list做出相应的改变。
        if (this.state[i].filtered) {
          const reg = new RegExp(this.state[i].searchText, 'gi');
          list = list.filter(record =>{
            if(reg.lastIndex !== 0){
             reg.lastIndex = 0;
            }
            return reg.test(record[i]);
          });
        }
      });
    }
    let text;
    if(timeSheetMonth !== null){
      text =`确定同步${timeSheetMonth.format(dateFormat).split("-")[0]}${timeSheetMonth.format(dateFormat).split("-")[1]}'${ou}'的工时情况吗?`;
    }else if(recentMonth.length !== 0){
      text =`确定同步${recentMonth.format(dateFormat).split("-")[0]}${recentMonth.format(dateFormat).split("-")[1]}'${ou}'的工时情况吗?`;
    }
    return (
      <Spin tip="Loading..." spinning={loading}>
      <div className={s.container}>
        <div style={{textAlign: 'left'}}>
          OU：
          <Select showSearch style={{ width: 160}} value={this.state.ou} onSelect={this.selectOu} placeholder="请选择OU">
            {ouList1}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          月份：
          <MonthPicker style={{ width: 120}} format='YYYY-MM' value={moment(timeSheetMonth !== null ? timeSheetMonth : recentMonth,'YYYY-MM')} onChange={(value)=>this.changeMonth(value)} disabledDate={this.disabledDate}/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          统计类型：
          <Select showSearch style={{ width: 120}} value={this.state.statisticType} onSelect={this.selectStatisticType} placeholder="请选择类型">
            {stateParam}
          </Select>
          {/*&nbsp;&nbsp;&nbsp;&nbsp;*/}
          {/*<Button type="primary" onClick={this.queryTimeSheet}>查询</Button>*/}
          &nbsp;&nbsp;&nbsp;&nbsp;
          {
            this.rightControlSyn() ?
              <Popconfirm title={text} onConfirm={this.synTimeSheet} okText="确定" cancelText="取消">
                <Button type="primary">同步</Button>
              </Popconfirm>
              :
              null
          }
          &nbsp;&nbsp;&nbsp;&nbsp;
          {
            list.length !== 0 ?
              <Button type="primary" onClick={(e)=>this.expExl(e,list)}>导出</Button>
              :
              <Button disabled onClick={(e)=>this.expExl(e,list)}>导出</Button>
          }
        </div>
        <div style={{marginTop:'10px',float:'left',marginBottom:'10px'}}>
          {
            !this.needSearch || columns.length === 0 ?
              null
              :
              this.state['proj_name'].filtered || this.state['proj_code'].filtered ?
                <span><Button type="primary" onClick={this.clearFilter}>清空筛选条件</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                :
                <span><Button disabled onClick={this.clearFilter}>清空筛选条件</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          }
        </div>
        {
          list.length !== 0 ?
            <div style={{marginTop:'15px'}}><strong>状态：</strong><span style={{color:'red'}}>已发布</span></div>
            :
            null
        }
        {
          list.length !== 0 ?
            <div id="table1" style={{ marginTop:'20px'}}>
              <Table columns={columns}
                     dataSource={list}
                     pagination={false}
                     //loading={loading}
                     scroll={objScroll}
                     className={styles.financeTable_smallSize}
              />
            </div>
            :
            <div id="table1" style={{ marginTop:'50px'}}>
              <Table columns={columns}
                     dataSource={list}
                     pagination={false}
                     //loading={loading}
                     scroll={objScroll}
                     className={styles.financeTable_smallSize}
              />
            </div>
        }

      </div>
      </Spin>
    );
  }
}

function mapStateToProps (state) {
  const { list,ouList,stateParamList,deptList,rightData,recentMonth } = state.timeSheetManage;
  return {
    loading: state.loading.models.timeSheetManage,
    list,
    ouList,
    stateParamList,
    deptList,
    rightData,
    recentMonth
  };
}

export default connect(mapStateToProps)(deptApportionManage);
