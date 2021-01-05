/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：选中部门后展示
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import {Menu, Dropdown, Icon} from 'antd';

class DeptSelectShow extends Component {

  render() {
    const {data}=this.props;
    console.log("data....");
    console.log(JSON.stringify(data))
    var showElem=[];
    var menuItem={};
    for(var key in data){
      menuItem[key]=[];
      var overlayData = (
        <Menu>
          {data[key].map((item,index)=>
            <Menu.Item key={index}>
              {item.split('-')[1]}
            </Menu.Item>)}
        </Menu>
      );
      menuItem[key].push(overlayData)
      showElem.push(
        <Dropdown overlay={menuItem[key][0]} key={key}>
          <span className="ant-dropdown-link" style={{display:'inline-block',padding:'8px',margin:'0 10px'}}>
            {key=='联通软件研究院'?'全部':key} <Icon type={data[key].length==0?'':"down"} />
          </span>
        </Dropdown>)
    }
    return (
      <div style={{display:'inline-block'}}>
        {showElem}
      </div>
    );
  }
}

export default DeptSelectShow;
