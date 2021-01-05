/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：指标查询UI页面
 */

import React from 'react'
import { Table,Input,Button,Icon,Select } from 'antd'
import styles from '../../../../components/employer/employer.less'
import tableStyle from '../../../../components/finance/table.less'
import AdjustAccount from './adjustAccount'
const Option = Select.Option;
export  default  class SearchUI extends React.Component{
  constructor(props){
    super(props);
    const{thead,needSearch}=this.props;
    this.state={};
    if(thead){
      this.thead=thead
    }
    if(needSearch){
      this.needSearch=needSearch
    }
  }
  //外部覆盖
  getHeader=()=>{
    if(this.needSearch&&!this.needSearch.length){
      return [...this.thead]
    }
  };
  needSearch=[];
  needFilter=[];


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

  clearFilter=()=>{
    let s=this.state;let noSearch={};
    for(let k in s){
      if(s[k]!==null&&typeof s[k]==='object'&&s[k].searchText){
        let {searchInput}=s[k];
        searchInput.refs.input.value=''
        noSearch[k]={...s[k],searchText:'',filtered:false,searchInput}
      }
    }
    this.setState({
      ...noSearch,
      filterInfo:null
    })
  };
  onChangeDatePicker=(value)=>{
    const { flag,dispatch }= this.props;
    if(flag === '0'){
      dispatch({
        type:'commonSearch/initPerson',
        year:value,
      })
    }
    if(flag === '1'){
      dispatch({
        type:'commonSearch/initTeam',
        year:value,
      })
    }
    if(flag === '2'){
      dispatch({
        type:'commonSearch/initDept',
        year:value,
      })
    }
    if(flag === '3'){
      dispatch({
        type:'commonSearch/initBranchFinance',
        year:value,
      })
    }
    if(flag === '4'){
      dispatch({
        type:'commonSearch/initFinance',
        year:value,
      })
    }
  };
  render(){
    let { list,loading,year }=this.props;
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
    return(
      <div className={styles.wrap}>
        <h2 style={{textAlign:'center'}}>资金计划报销查询</h2>
        <span>年度：
          <Select showSearch style={{ width: 70}}  value={year} onSelect={this.onChangeDatePicker}>
            <Option value={ (new Date().getFullYear()-2).toString() }>{ (new Date().getFullYear()-2).toString() }</Option>
            <Option value={ (new Date().getFullYear()-1).toString() }>{ (new Date().getFullYear()-1).toString() }</Option>
            <Option value={ (new Date().getFullYear()).toString() }>{ (new Date().getFullYear()).toString() }</Option>
          </Select>&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
        {
        this.needFilter.length !== 0||this.needSearch.length !== 0?
          <Button type='primary' onClick={this.clearFilter} style={{marginBottom:'10px'}}>清空条件</Button>
          :
          null
        }
        {
          this.props.flag === '4' ?
            <Button type='primary' onClick={()=>this.refs.adjustAccount.showModal()} style={{marginLeft:'10px',marginBottom:'10px'}}>调账</Button>
            :
            null
        }
        <div style={{float:'right',fontSize:'16px'}}>{this.props.tag !== '' ? this.props.tag : ''}</div>
        <Table
          pagination={true}
          columns={thead}
          dataSource={list}
          className={tableStyle.financeTable}
          loading={loading}/>
        <AdjustAccount ref="adjustAccount" summarys={this.props.subjectName} teamNames={this.props.departInfo} depts={this.props.deptInfo} dispatch={this.props.dispatch}/>
      </div>
    )
  }
}

