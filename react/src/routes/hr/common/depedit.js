/**
 *  作者: 罗玉棋
 *  创建日期: 2020-02-18
 *  邮箱：809590923@qq.com
 *  文件说明：员工部门变更通用组件
 */

import React from 'react';
import { TreeSelect } from 'antd';
import Cookie from 'js-cookie';
import {OU_HQ_NAME_CN,OU_NAME_CN} from '../../../utils/config';
const auth_tenantid = Cookie.get('tenantid');
const { SHOW_PARENT } = TreeSelect;
import request from '../../../utils/request';
import * as hrService from '../../../services/hr/hrService.js';

class DeptEdit extends React.Component{

  state = {
    treeData:[],
    value:""
  };

  onChange = value => {
    console.log('onChange ', value);
    this.setState({ value });
  };

  componentDidMount(){
    this.getDeptList()
  }

  getDeptList=async()=>{
    const auth_ou = Cookie.get('OU');
    let auth_ou_flag = auth_ou;
    let treeData=[]
    if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
      auth_ou_flag = OU_NAME_CN;
    }
    let postData_getDept = {};
    postData_getDept["argtenantid"] = auth_tenantid;
    const {DataRows: getDeptData} = await hrService.getDeptInfo(postData_getDept);
    const {DataRows:personInfo} = await hrService.basicInfoQuery({
      "arg_tenantid": 10010,
      "arg_ou_name": '联通软件研究院',
      "arg_allnum": 0,
      "arg_post_type": 0,
      "arg_employ_type": '正式'
    });
    let pureDeptData = [];//存储去除前缀后的部门数据
    for (let i = 0; i < getDeptData.length; i++) {
      if (getDeptData[i].dept_name.split('-')[0] === auth_ou_flag && getDeptData[i].dept_name.split('-')[1]) {
        if(!getDeptData[i].dept_name.split('-')[2]){ //去重
          pureDeptData.push(getDeptData[i].dept_name.split('-')[1]);
        }
      }
    }

    pureDeptData.forEach(item=>{

     let obj={
       title: item+'',
       value: item,
       key: item+'',
       children: []
     }
   
     personInfo.forEach(per=>{
      if(item==per.deptname.split("-")[1]){
        obj.children.push({
       title: per.username+'',
       value: per.staff_id,
       key: per.staff_id+'',
       children: []
        })
      }
     })
     treeData.push(obj)
    })
    this.setState({
      treeData:treeData
    })
  }


render (){
  const tProps = {
    treeData:this.state.treeData,
    value: this.state.value,
    onChange: this.onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    searchPlaceholder: 'Please select',
    style: {
      width: '100%',
    },
  };
  return <TreeSelect {...tProps} />;
}




}
export default DeptEdit;