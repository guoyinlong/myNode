/**
 * 作者：张楠华
 * 日期：2017-10-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：项目分摊查询页面展示
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
 * 功能：展示项目分摊页面
 */
class projectApportionQuery extends React.Component{
  constructor(props){
    super(props);
    this.state={
      ou:'',
      projectApportionYear:'',
      projectApportionMonth:'',
      statisticType:'',
      boxWidth:1100
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
      projectApportionYear:value,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改变月份
   */
  changeMonth=(value)=>{
    this.setState({
      projectApportionMonth:value,
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
  projectApportionChange=()=>{
    const { dispatch } = this.props;
    const { ou,projectApportionYear,projectApportionMonth,statisticType } = this.state;
    if( ou === ''){
      message.info('OU不能为空');
      return null;
    }
    if( projectApportionYear === ''){
      message.info('年份不能为空');
      return null;
    }if( projectApportionMonth === ''){
      message.info('月份不能为空');
      return null;
    }else{
      dispatch({
        type:'projectApportionManage/queryProjectApportion',
        ou,
        projectApportionYear,
        projectApportionMonth,
        statisticType,
      });
    }
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：导出数据
   */
  expExl=(e,list)=>{
    const {headerName} = this.props;
    if(list !== null && list.length !== 0){
      exportExlTimeSheet(list, "项目分摊数据", headerName)
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
  componentDidMount(){
    this.state.boxWidth=document.getElementById('table1').clientWidth;
  }

  render() {
    const { loading,ouList,stateParamList,headerName } = this.props;
    let { list } = this.props;
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
    let headerNameData;
    let columns=[];
    let columns1=[];
    let columns2=[];
    let columns3=[];
    if(headerName.length !== 0){
      headerNameData = headerName.map((item) => {
        return (
          <Option key={item}>
            {item}
          </Option>
        )
      });
      //表格数据
      for(let i=0;i<headerNameData.length;i++){
        columns2[i] ={
          title: headerNameData[i].key,
          dataIndex: headerNameData[i].key,
          key:headerNameData[i].key,
          width:'150px'
        };
      }
      columns1 = [
        {
          title: '部门名称',
          dataIndex: 'dept_name',
          key:'dept_name',
          width:'200px',
          fixed:'left',
          render: (text, record) => {
            if(record.hasOwnProperty("dept_name")){
              if(record.dept_name === '部门小计' || record.dept_name === '合计'){
                return{
                  children :
                    <div style={{textAlign:"left",whiteSpace:'normal'}}>
                      <strong>{record.dept_name}</strong>
                    </div>,
                  props:{ colSpan:3}
                }
              }else{
                return{
                  children :
                    <div style={{textAlign:"left",whiteSpace:'normal'}}>
                      {record.dept_name.split('-')[1]}
                    </div>,
                  props:{rowSpan:record.rowSpan}
                };
              }
            }
          },
        },
        {
          title: '项目名称',
          dataIndex: 'proj_name',
          key:'proj_name',
          width:'200px',
          fixed:'left',
          render:(text, record) => {
            if(record.hasOwnProperty("dept_name")){
              if(record.dept_name === '部门小计' || record.dept_name === '合计'){
                return {
                  children :
                    <Tooltip title={record.proj_name} style={{width:'30%'}}>
                      <div className={Style.projectAbbreviation}>{record.proj_name}</div>
                    </Tooltip>,
                  props:{ colSpan:0}
                }
              }else{
                return {
                  children :
                    <Tooltip title={record.proj_name} style={{width:'30%'}}>
                      <div className={Style.projectAbbreviation}>{record.proj_name}</div>
                    </Tooltip>,
                }
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
            if(record.hasOwnProperty("dept_name")){
              if(record.dept_name === '部门小计' || record.dept_name === '合计'){
                return {
                  children : <div style={{textAlign:'left'}}>{record.proj_code}</div>,
                  props:{ colSpan:0}
                }
              }else{
                return {
                  children : <div style={{textAlign:'left'}}>{record.proj_code}</div>,
                }
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
          width:'120px',
          fixed:'right',
        }
      ];
      columns = columns1.concat(columns2);
      columns = columns.concat(columns3);
    }
    let objScroll={
      x:this.state.boxWidth,
      y:400
    };
    if(headerName.length>3){
      objScroll.x=680+headerName.length*150;
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
          list= list.filter(record => reg.test(record[i]));
        }
      });
    }
    //遍历list给list加一个rowSpan字段：合并单元格
    // let rowSpanNum=0;
    // let rowSpanArray = [];
    // for(let i=0;i<list.length;i++){
    //   if(list[i].dept_name === "部门小计" || list[i].dept_name === "合计"){
    //     rowSpanArray.push(rowSpanNum);
    //     rowSpanNum = 0;
    //   }else{
    //     rowSpanNum++;
    //   }
    // }
    //第一种情况：最后一行是部门小计或者合计，
    //第二种情况，最后一行不是合计是项目：项目与上一个相同，
    let rowSpanNum = 1;
    let rowSpanArray = [];
    let i=1;
    for(i=1;i<list.length;i++){
      if(list[i].hasOwnProperty("proj_code") || list[i].hasOwnProperty('proj_name') || i===list.length-1){
        if(list[i].dept_name !== list[i-1].dept_name || i===list.length-1){
          if( list[i].dept_name !== list[i-1].dept_name || i !== list.length-1){
            rowSpanArray.push(rowSpanNum)
          }
          else if(i===list.length-1 && list[i].hasOwnProperty("proj_code")) {
            rowSpanArray.push(++rowSpanNum);
          }else if(i===list.length-1 && !list[i].hasOwnProperty("proj_code")){
            rowSpanArray.push(rowSpanNum);
          }
          rowSpanNum = 1;
        }else{
          rowSpanNum++;
        }
      }
    }
    //部门小计与合计不加rowSpan，重复的加rowSpan=0，不重复的（第一个）加rowSpan=null。
    for(let i=1;i<list.length;i++){
      if(list[i].hasOwnProperty("proj_code") || list[i].hasOwnProperty('proj_name')){
        list[0].rowSpan = null;
        if(list[i].dept_name === "部门小计" || list[i].dept_name === "合计"){
          list[i].rowSpan = 0;
        }else{
          if(list[i].dept_name === list[i-1].dept_name){
            list[i].rowSpan = 0;
          }else{
            list[i].rowSpan = null;
          }
        }
      }
    }
    let j=0;
    for(let i=0;i<list.length;i++){
      if(list[i].rowSpan === null){
        list[i].rowSpan = rowSpanArray[j];
        j++;
      }
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
          <DatePicker ref="year" style={{ width: 160}} format='YYYY' onChange={(value)=>this.changeYear(value)} placeholder="请选择年份"/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          月份：
          <MonthPicker style={{ width: 160}} onChange={(value)=>this.changeMonth(value)} placeholder="请选择月份"/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          统计类型：
          <Select showSearch style={{ width: 160}}  onSelect={this.selectStatisticType} placeholder="请选择统计类型">
            {stateParam}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.projectApportionChange}>查询</Button>
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
          <div style={{textAlign:"right", marginTop:'10px'}}><Button type="primary" onClick={e=>this.expExl(e,list)}>导出</Button></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const { list,ouList,stateParamList,headerName} = state.projectApportionManage;
  return {
    loading: state.loading.models.projectApportionManage,
    list,
    ouList,
    stateParamList,
    headerName
  };
}

export default connect(mapStateToProps)(projectApportionQuery);
