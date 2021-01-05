/**
 * 作者：张楠华
 * 日期：2017-10-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：工时管理页面展示
 */
import React from 'react';
import { connect } from 'dva';
import { Select,Table,Button,DatePicker,message,Tooltip,Input,Icon } from 'antd';
import styles from '../../../../components/finance/table.less'
import Style from '../../../../components/finance/finance.less'
import { exportExlTimeSheet } from './exportExlTimeSheet'
const Option = Select.Option;
const { MonthPicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
/**
 * 作者：张楠华
 * 创建日期：2017-10-19
 * 功能：展示工时管理页面
 */
class deptApportionManage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      ou:'',
      timeSheetYear:'',
      timeSheetMonth:'',
      statisticType:'',
    };
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择组织单元
   */
  selectOu=(value)=>{
    this.setState({
      ou:value,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改变年份
   */
  changeYear=(value)=>{
    this.setState({
      timeSheetYear:value,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改变月份
   */
  changeMonth=(value)=>{
    this.setState({
      timeSheetMonth:value,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择统计类型
   */
  selectStatisticType=(value)=>{
    this.setState({
      statisticType:value
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：查询项目分摊情况
   */
  deptApportionChange=()=>{
    const { dispatch } = this.props;
    const { ou,timeSheetYear,timeSheetMonth,statisticType } = this.state;
    if( ou === ''){
      message.info('OU不能为空');
      return null;
    }
    if( timeSheetYear === ''){
      message.info('年份不能为空');
      return null;
    }if( timeSheetMonth === ''){
      message.info('月份不能为空');
      return null;
    }else{
      dispatch({
        type:'timeSheetManage/timeSheetDataQuery',
        ou,
        timeSheetYear,
        timeSheetMonth,
        statisticType,
      });
    }
  };
  expExl=(e,list)=>{
    const { deptList } = this.props;
    console.log(list);
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
  render() {
    const { loading,ouList,stateParamList,deptList } = this.props;
    let { list } =this.props;
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
          width:'220px',
        };
      }
      columns1 = [
        {
          title: '项目名称',
          dataIndex: 'proj_name',
          key:'proj_name',
          width:'250px',
          fixed:'left',
          render:(text, record) => {
            if(record.proj_code === '项目工时合计' || record.proj_code === '总有效工时'){
              return {
                children:
                  <Tooltip title={record.proj_name} style={{width:'30%'}}>
                    <div className={Style.timeSheetAbbreviation}>{record.proj_name}</div>
                  </Tooltip>,
                props:{ colSpan:0}
              }
            }else{
              return {
                children:
                  <Tooltip title={record.proj_name} style={{width:'30%'}}>
                    <div className={Style.timeSheetAbbreviation}>{record.proj_name}</div>
                  </Tooltip>,
              }
            }
          },
        },
        {
          title: '项目编号',
          dataIndex:'proj_code',
          key:'proj_code',
          width:'160px',
          fixed:'left',
          render:(text, record) => {
            if(record.proj_code === '项目工时合计' || record.proj_code === '总有效工时'){
              return {
                children:<div style={{textAlign:'left'}}>{record.proj_code}</div>,
                props:{ colSpan:2}
              }
            }else{
              return {
                children:<div style={{textAlign:'left'}}>{record.proj_code}</div>,
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
          width:'100px',
          fixed:'right',
        }
      ];
      columns = columns1.concat(columns2);
      columns = columns.concat(columns3);
    }
    let objScroll={
      x:1100,
      y:400
    };
    if(deptList.length>3){
      objScroll.x=510+deptList.length*220;
    }
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
          list = list.filter(record => reg.test(record[i]));
        }
      });
    }
    return (
      <div className={Style.wrap}>
        <div style={{textAlign: 'left'}}>
          部门/OU：
          <Select showSearch style={{ width: 160}}  onSelect={this.selectOu} placeholder="请选择OU">
            {ouList1}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          年份：
          <DatePicker style={{ width: 160}} format='YYYY' onChange={(value)=>this.changeYear(value)} placeholder="请选择年份"/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          月份：
          <MonthPicker style={{ width: 160}} onChange={(value)=>this.changeMonth(value)} placeholder="请选择月份"/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          统计类型：
          <Select showSearch style={{ width: 160}}  onSelect={this.selectStatisticType} placeholder="请选择统计类型">
            {stateParam}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.deptApportionChange}>查询</Button>
          {this.needSearch && columns.length !== 0? <div style={{marginTop:'5px',textAlign:'right'}}><Button size="small" onClick={this.clearFilter}>清空条件</Button></div>:null}
          <div id="table1" style={{marginTop:'10px'}}>
            <Table columns={columns}
                   dataSource={list}
                   pagination={false}
                   loading={loading}
                   scroll={objScroll}
                   className={styles.financeTable}
            />
          </div>
          <div style={{textAlign:"right", marginTop:'10px'}}><Button type="primary" onClick={(e)=>this.expExl(e,list)}>导出</Button></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const { list,ouList,stateParamList,deptList} = state.timeSheetManage;
  return {
    loading: state.loading.models.timeSheetManage,
    list,
    ouList,
    stateParamList,
    deptList
  };
}

export default connect(mapStateToProps)(deptApportionManage);
