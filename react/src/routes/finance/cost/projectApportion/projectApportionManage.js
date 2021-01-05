/**
 * 作者：张楠华
 * 日期：2017-10-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：项目分摊页面展示
 */
import React from 'react';
import { connect } from 'dva';
import { Select,Table,Button,DatePicker,message,Tooltip,Popconfirm,Input,Icon,Spin } from 'antd';
import styles from '../../../../components/finance/table.less'
import Style from '../../../../components/finance/finance.less'
import s from './../costCommon.css'
import { exportExlTimeSheet } from './exportExlTimeSheet'
import  ProjectApportionCrl  from './projectApportionCrl'
const Option = Select.Option;
const { MonthPicker } = DatePicker;
import config from '../../../../utils/config'
import moment from 'moment';
import 'moment/locale/zh-cn';
import cost_budget from "../cost_budget/cost_budget";
moment.locale('zh-cn');
const dateFormat = 'YYYY-MM';
/**
 * 作者：张楠华
 * 创建日期：2017-11-3
 * 功能：点击修改，弹出模态框，进行修改
 */
function operationNum (text, record,ss){
  if(record.hasOwnProperty("dept_name")){
    if(record.dept_name === '部门小计' || record.dept_name === '合计'){
      return null;
    }else{
      return (
        <div>
          <a onClick={()=>ss.refs.projectApportionCrl.showModal(record)}>{'编辑'}</a>
        </div>
      )
    }
  }
}
/**
 * 作者：张楠华
 * 创建日期：2017-10-18
 * 功能：格式化数据
 */
function MoneyComponent({text}) {
  if(text === '0.0'){
    return (
      <div style={{textAlign:'right',letterSpacing:1}}>-</div>
    )
  }else{
    return (
      <div style={{textAlign:'right',letterSpacing:1}}>{text?format(parseFloat(text)):text}</div>
    )
  }
}
function format (num) {
  return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
/**
 * 作者：张楠华
 * 创建日期：2017-10-19
 * 功能：展示项目分摊页面
 */
class projectApportionQuery extends React.PureComponent{
  constructor(props){
    super(props);
    this.state={
      ou:localStorage.ou,
      projectApportionMonth: null ,
      statisticType:'1',
    };
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-11-11
   * 功能：选择组织单元
   */
  apportionCrl=(value,record,ou)=>{
    const { dispatch } = this.props;
    let { statisticType,projectApportionMonth } =this.state;
    dispatch({
      type:'projectApportionManage/editProjectApportion',
      value:value,
      record,
      ou,
      projectApportionMonth:projectApportionMonth !== null ? projectApportionMonth : this.props.recentMonth,
      statisticType:statisticType,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择组织单元
   */
  selectOu=(value)=>{
    const { dispatch } = this.props;
    let { statisticType,projectApportionMonth } =this.state;
    this.setState({
      ou:value,
    });
    dispatch({
      type:'projectApportionManage/queryProjectApportionManage',
      ou:value,
      projectApportionMonth:projectApportionMonth !== null ? projectApportionMonth : this.props.recentMonth,
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
    let { ou,statisticType } =this.state;
    this.setState({
      projectApportionMonth:value,
    });
    dispatch({
      type:'projectApportionManage/queryProjectApportionManage',
      ou:ou,
      projectApportionMonth:value,
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
    let { ou,projectApportionMonth } =this.state;
    this.setState({
      statisticType:value
    });
    dispatch({
      type:'projectApportionManage/queryProjectApportionManage',
      ou:ou,
      projectApportionMonth:projectApportionMonth !== null ? projectApportionMonth : this.props.recentMonth,
      statisticType:value,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：生成项目分摊数据
   */
  generateData=()=>{
    const { dispatch } = this.props;
    const { ou,projectApportionMonth,statisticType } = this.state;
    if(ou.length === 0){
      message.info('部门不能为空');
    }else{
      dispatch({
        type:'projectApportionManage/generateData',
        ou,
        projectApportionMonth:projectApportionMonth !== null ? projectApportionMonth : this.props.recentMonth,
        statisticType
      });
    }
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：发布项目分摊数据
   */
  publicData=()=>{
    const { dispatch } = this.props;
    const { ou,projectApportionMonth,statisticType } = this.state;
    if(ou.length === 0){
      message.info('部门不能为空');
    }else{
      dispatch({
        type:'projectApportionManage/publicData',
        ou,
        projectApportionMonth:projectApportionMonth !== null ? projectApportionMonth : this.props.recentMonth,
        statisticType
      });
    }
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：撤销发布项目分摊数据
   */
  cancelPublicData=()=>{
    const { dispatch } = this.props;
    const { ou,projectApportionMonth,statisticType } = this.state;
    if(ou.length === 0){
      message.info('部门不能为空');
    }else{
      dispatch({
        type:'projectApportionManage/cancelPublicData',
        ou,
        projectApportionMonth:projectApportionMonth !== null ? projectApportionMonth : this.props.recentMonth,
        statisticType
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
  /**
   * 作者：张楠华
   * 创建日期：2017-10-27
   * 功能：控制权限
   */
  rightControlGenerate=()=>{
    const { rightData } =this.props;
    let flag = false;
    for(let i=0;i<rightData.length;i++){
      if(rightData[i].fullurl === config.generateProjectData){
        flag =true;
        break;
      }
    }
    return flag;
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-27
   * 功能：控制权限
   */
  rightControlPublic=()=>{
    const { rightData } =this.props;
    let flag = false;
    for(let i=0;i<rightData.length;i++){
      if(rightData[i].fullurl === config.publicProjectData){
        flag =true;
        break;
      }
    }
    return flag;
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-27
   * 功能：控制权限
   */
  rightControlUnPublic=()=>{
    const { rightData } =this.props;
    let flag = false;
    for(let i=0;i<rightData.length;i++){
      if(rightData[i].fullurl === config.cancelPublicProjectData){
        flag =true;
        break;
      }
    }
    return flag;
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-27
   * 功能：判断是否只为查询
   */
  isOnlySelect=()=>{
    return !this.rightControlUnPublic() && !this.rightControlPublic() && !this.rightControlGenerate()
  };
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
    const { loading,ouList,stateParamList,headerName,stateFlag,recentMonth } = this.props;
    let { list } = this.props;
    const { ou,projectApportionMonth} = this.state;
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
    let columns4=[];
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
        headerNameData[i].key === '通用资产折旧摊销-其它'?

        columns2[i] ={
          title: headerNameData[i].key,
          dataIndex: '通用资产折旧摊销',
          key:'通用资产折旧摊销',
          width:160,
          render:(text,record)=><MoneyComponent text={record['通用资产折旧摊销']}/>
        }
        : columns2[i] ={
            title: headerNameData[i].key,
            dataIndex: headerNameData[i].key,
            key:headerNameData[i].key,
            width:160,
            render:(text,record)=><MoneyComponent text={record[headerNameData[i].key]}/>
          }
      }
      columns1 = [
        {
          title: '部门名称',
          dataIndex: 'dept_name',
          key:'dept_name',
          width:150,
          fixed:'left',
          render: (text, record) => {
            if(record.hasOwnProperty("dept_name")){
              if(record.dept_name === '部门小计' || record.dept_name === '合计'){
                return{
                  children :
                    <div style={{textAlign:"left",whiteSpace:'normal'}}>
                      <strong>{record.dept_name}</strong>
                    </div>,
                  props:{ colSpan:4}
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
          width:200,
          fixed:'left',
          render:(text, record) => {
            if(record.hasOwnProperty("dept_name")){
              if(record.dept_name === '部门小计' || record.dept_name === '合计'){
                return {
                  children :
                      <div style={{textAlign:'left'}}>{record.proj_name}</div>,
                  props:{ colSpan:0}
                }
              }else{
                return {
                  children :
                      <div style={{textAlign:'left'}}>{record.proj_name}</div>,
                }
              }
            }
          },
        },
        {
          title: '项目编号',
          dataIndex:'proj_code',
          key:'proj_code',
          width:160,
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
        {
          title: 'pms编码',
          dataIndex:'pms_code',
          key:'pms_code',
          width:160,
          fixed:'left',
          render:(text, record) => {
            if(record.hasOwnProperty("dept_name")){
              if(record.dept_name === '部门小计' || record.dept_name === '合计'){
                return {
                  children : <div style={{textAlign:'left'}}>{record.pms_code}</div>,
                  props:{ colSpan:0}
                }
              }else{
                return {
                  children : <div style={{textAlign:'left'}}>{record.pms_code}</div>,
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
          width:140,
          fixed:'right',
          render:(text,record)=><MoneyComponent text={text}/>
        }
      ];
      columns4 = [
        {
          title: '操作',
          dataIndex: 'operationNum',
          key:'operationNum',
          width:60,
          fixed:'right',
          render:(text,record)=>operationNum(text,record,this)
        }
      ];
      columns = columns1.concat(columns2);
      columns = columns.concat(columns3);
      if(stateFlag === '2'){
        columns = columns.concat(columns4);
      }
    }
    let text1;
    let text2;
    let text3;
    if(projectApportionMonth !== null){
      text1 =`确定生成${projectApportionMonth.format(dateFormat).split("-")[0]}${projectApportionMonth.format(dateFormat).split("-")[1]}'${ou}'的项目分摊情况吗?`;
      text2 =`确定发布${projectApportionMonth.format(dateFormat).split("-")[0]}${projectApportionMonth.format(dateFormat).split("-")[1]}'${ou}'的项目分摊情况吗?`;
      text3 =`确定撤销${projectApportionMonth.format(dateFormat).split("-")[0]}${projectApportionMonth.format(dateFormat).split("-")[1]}'${ou}'的项目分摊情况吗?`;
    }else if(recentMonth.length !== 0){
      text1 =`确定生成${recentMonth.format(dateFormat).split("-")[0]}${recentMonth.format(dateFormat).split("-")[1]}'${ou}'的部门分摊情况吗?`;
      text2 =`确定发布${recentMonth.format(dateFormat).split("-")[0]}${recentMonth.format(dateFormat).split("-")[1]}'${ou}'的部门分摊情况吗?`;
      text3 =`确定撤销${recentMonth.format(dateFormat).split("-")[0]}${recentMonth.format(dateFormat).split("-")[1]}'${ou}'的部门分摊情况吗?`;
    }
    let objScroll={
      x:1260,
      y:500
    };
    if(headerName.length>3){
      if(stateFlag === 2){
        objScroll.x=870+headerName.length*160;
      }else{
        objScroll.x=810+headerName.length*160;
      }
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
          list = list.filter(record =>{
            if(reg.lastIndex !== 0){
              reg.lastIndex = 0;
            }
            return reg.test(record[i]);
          });
        }
      });
    }
    //第一种情况：最后一行与上个项目相同
    //第二种情况，最后一行与上个项目不同,最后一行如果是部门小计有可能没有proj_code，
    let rowSpanNum = 1;
    let rowSpanArray = [];
    let i=1;
    for(i=1;i<list.length;i++){
      if(list[i].hasOwnProperty("proj_code") || list[i].hasOwnProperty('proj_name') || i===list.length-1){
        if(list[i].dept_name !== list[i-1].dept_name || i===list.length-1){
          if( list[i].dept_name !== list[i-1].dept_name ){
            rowSpanArray.push(rowSpanNum)
          }
          else if(i===list.length-1 && list[i].hasOwnProperty("proj_code")) {
            rowSpanArray.push(++rowSpanNum);
          }
          if(i===list.length-1 && list[i].dept_name !== list[i-1].dept_name){
             rowSpanArray.push(1);
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
    // let state_name;
    // if(stateFlag === '0'){
    //   state_name='已发布';
    // }else if(stateFlag === '2'){
    //   state_name='待审核';
    // }else if(stateFlag ==='3'){
    //   state_name='待生成';
    // }
    return (
      <Spin tip="Loading..." spinning={loading}>
      <div className={s.container}>
        <div style={{textAlign: 'left'}}>
          OU：
          <Select showSearch style={{ width: 160}} value={this.state.ou} onChange={this.selectOu} placeholder="请选择OU">
            {ouList1}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          月份：
          <MonthPicker style={{ width: 160}} format='YYYY-MM'
                       value={recentMonth ? moment(projectApportionMonth !== null ? projectApportionMonth : this.props.recentMonth,"YYYY-MM"):null}
                       onChange={(value)=>this.changeMonth(value)}
                       disabledDate={this.disabledDate}
                       placeholder="请选择年月"/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          统计类型：
          <Select showSearch
                  style={{ width: 160}}
                  value={stateParamList[0] ? this.state.statisticType:null}
                  onChange={this.selectStatisticType}
                  placeholder="请选择统计类型">
            {stateParam}
          </Select>
            {/*<Button type="primary" onClick={this.projectApportionChange}>查询</Button>*/}
            {
                this.rightControlGenerate() ?
                  stateFlag.length === 0 || stateFlag === "0" ?
                    <span style={{display:'inline-block',marginLeft:'10px'}}>
                      <Popconfirm title={text1} onConfirm={this.generateData} okText="确定" cancelText="取消">
                        <Button disabled>生成</Button>
                      </Popconfirm>
                    </span>
                    :
                    <span style={{display:'inline-block',marginLeft:'10px'}}>
                      <Popconfirm title={text1} onConfirm={this.generateData} okText="确定" cancelText="取消">
                        <Button type="primary">生成</Button>
                      </Popconfirm>
                    </span>
                  :
                  null
            }
            {
              this.rightControlPublic() ?
                stateFlag.length === 0 || stateFlag === "0"  || stateFlag === '3'?
                  <span style={{display:'inline-block',marginLeft:'10px'}}>
                    <Popconfirm title={text2} onConfirm={this.publicData} okText="确定" cancelText="取消">
                      <Button disabled>发布</Button>
                    </Popconfirm>
                  </span>
                  :
                  <span style={{display:'inline-block',marginLeft:'10px'}}>
                    <Popconfirm title={text2} onConfirm={this.publicData} okText="确定" cancelText="取消">
                      <Button type="primary">发布</Button>
                    </Popconfirm>
                  </span>
                :
                null
            }
            {
              this.rightControlUnPublic() ?
                stateFlag.length === 0 || stateFlag === "2"  || stateFlag === "3" ?
                  <span style={{display:'inline-block',marginLeft:'10px'}}>
                    <Popconfirm title={text3} onConfirm={this.cancelPublicData} okText="确定" cancelText="取消">
                      <Button disabled>撤销</Button>
                    </Popconfirm>
                  </span>
                  :
                  <span style={{display:'inline-block',marginLeft:'10px'}}>
                    <Popconfirm title={text3} onConfirm={this.cancelPublicData} okText="确定" cancelText="取消">
                      <Button type="primary">撤销</Button>
                    </Popconfirm>
                  </span>
                :
                null
            }
            {
              list.length !== 0  ?
                <span style={{display:'inline-block',marginLeft:'10px'}}>
                  <Button  type="primary" onClick={e=>this.expExl(e,list)}>导出</Button>
                </span>
                :
                <span style={{display:'inline-block',marginLeft:'10px'}}>
                  <Button disabled onClick={e=>this.expExl(e,list)}>导出</Button>
                </span>
            }
        </div>
        <div style={{marginTop:'10px',marginBottom:'10px',float:'left'}}>
          {
            !this.needSearch || columns.length === 0 || (this.isOnlySelect() && stateFlag === '2')?
              null
              :
              this.state['proj_name'].filtered || this.state['proj_code'].filtered ?
                <Button type="primary" onClick={this.clearFilter}>清空筛选条件</Button>
                :
                <Button disabled onClick={this.clearFilter}>清空筛选条件</Button>
          }
        </div>
        <div style={{marginTop:'15px'}}>
          {
            stateFlag.length === 0 || stateFlag === '3' ||(this.isOnlySelect() && stateFlag === '2')?
              null
              :
              (
                stateFlag === "0" ?
                  <div style={{marginLeft:'15px',float:'left'}}><strong>状态：</strong><span style={{color:'red'}}>已发布</span></div>
                  :
                  <div style={{marginLeft:'15px',float:'left'}}><strong>状态：</strong><span style={{color:'blue'}}>待审核</span></div>
              )
          }
          {/*{*/}
            {/*stateFlag.length === 0 ||(this.isOnlySelect() && stateFlag === '2')?*/}
              {/*null*/}
              {/*:*/}
              {/*<div style={{marginLeft:'15px',float:'left'}}><strong>状态：</strong><span style={{color:'red'}}>{state_name}</span></div>*/}
          {/*}*/}
          <div style={{textAlign:'right'}}>金额单位：元</div>
        </div>
        {
          this.isOnlySelect() && stateFlag === '2' ?
            null
            :
            <div id="table1" style={{marginTop:'20px'}}>
              <Table columns={columns}
                     dataSource={list}
                     pagination={false}
                     //loading={loading}
                     scroll={objScroll}
                     className={styles.financeTable}
              />
            </div>
        }
       <ProjectApportionCrl ref='projectApportionCrl' ou={ou} headerName={headerName} apportionCrl={this.apportionCrl}/>
      </div>
      </Spin>
    );
  }
}

function mapStateToProps (state) {
  const { list,ouList,stateParamList,headerName,stateFlag,rightData,recentMonth } = state.projectApportionManage;
  return {
    loading: state.loading.models.projectApportionManage,
    list,
    ouList,
    stateParamList,
    headerName,
    stateFlag,
    rightData,
    recentMonth

  };
}

export default connect(mapStateToProps)(projectApportionQuery);
