/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：指标查询UI页面
 */

import React from 'react'
import { Table,Input,Button,Icon } from 'antd'
import styles from '../../../../components/employer/employer.less'
import tableStyle from '../../../../components/finance/table.less'
export  default  class TableSearch extends React.Component{
  constructor(props){
    super(props);
    this.state={};
  }
  setSearchComponent(key){
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
      filterIcon: <Icon type="search" style={{ color: this.state[key] && this.state[key].filtered ? '#FA7252' : null}}/>,
      filterDropdownVisible: this.state[key] && this.state[key].filterDropdownVisible||false,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          [key]:{...this.state[key],filterDropdownVisible: visible}
        });
      },
    }
  }
  onInputChange =(key)=> (e) => {
    this.state[key].searchText=e.target.value
  };
  onSearch = (key)=>() => {
    const { searchText } = this.state[key];
    this.setState(
      {
        [key]: {
          ...this.state[key],
          filterDropdownVisible: false,
          filtered: !!searchText
        }
      }
    );
  };
  clearFilter=()=>{
    let s=this.state;
    let noSearch={};
    for(let k in s){
      if( s[k]!==null && typeof s[k]==='object' && s[k].searchText){
        let { searchInput }= s[k];
        searchInput.refs.input.value = '';
        noSearch[k]={...s[k],searchText:'',filtered:false,searchInput}
      }
    }
    this.setState({
      ...noSearch,
      filterInfo:null
    });
  };
  disabled=()=>{
    let flag = true;
    for( let k in this.state){
      if(this.state[k] && this.state[k].hasOwnProperty('filtered') && this.state[k].filtered === true){
        flag = false;
        break;
      }else{
        flag = true;
      }
    }
    return flag;
  };
  render(){
    let {dataSource,loading,columns,needSearch}=this.props;
    let isDisable = this.disabled();
    //给头部添加搜索组件
    if(columns){
      //加自定义搜索
      if(needSearch && needSearch.length){//如果needSearch有值
        needSearch.map(i=>{
          columns.map((k,index)=>{
            //如果needSearch的值等于colunms里的值，证明这一个可以搜索，给这一个添加搜索框setSearchComponent
            if(k.dataIndex===i){
              columns[index]={...k,...this.setSearchComponent(i)}
            }
          });
          if(this.state[i] && this.state[i].filtered){
            const reg = new RegExp(this.state[i].searchText, 'gi');
            dataSource=dataSource.filter(item=>{
              if(reg.lastIndex !== 0){
                reg.lastIndex = 0;
              }
              return reg.test(item[i])
            }).map(item=>{
              const match = item[i].match(reg);
              if (!match) {
                return null;
              }
              return {
                ...item,
                [i]: <span>{item[i].split(reg).map((text, index) => (index > 0 ? [<span className={styles.highlight}>{match[0]}</span>, text] : text))}</span>
              }
            })
          }
        })
      }
    }
    return(
      <div>
        {
          needSearch.length !== 0?
            <Button type='primary' disabled={isDisable} onClick={this.clearFilter} style={{marginBottom:'10px'}}>清空条件</Button>
            :
            null
        }
        <Table
          columns={this.props.columns}
          dataSource={dataSource}
          className={tableStyle.financeTable}
          scroll={this.props.scroll}
          loading={loading}/>
      </div>
    )
  }
}

