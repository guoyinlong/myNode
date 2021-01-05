/**
 * 作者：罗玉棋
 * 创建日期：2019-9-11
 * 邮箱：809590923@qq.com
 * 文件说明:表格数据-修改对比-通用组件
 * 
  CompareInfo组件需要传的4个参数
  category_name:信息类名
  dataList:全部数据
  tbList:每个格子改变的数据
  loading:加载的状态
  UidMap:用来确定唯一id的数组
 */
import React from "react";
import { Table } from "antd";
import {bookObj,urlMap} from "./book.js"

export  default class CompareInfo extends React.Component{
  state={
    columns: [],
    width: "1400",
  }

  componentWillMount(){
    let category_name=this.props.category_name
    this.setState({
      columns: urlMap[category_name].columns,
      width:urlMap[category_name].width||"auto"
    });
  }

  render(){
  const { columns} = this.state;
  let { dataList,tbList,UidMap,opt }=this.props;

  tbList.forEach((item) => {
    let key;
    UidMap.forEach((table)=>{
      if(table.field_uid.indexOf(item.field_uid)>=0){
        key=table.table_uid;
      }
    })
     dataList = dataList.filter(row => {
      return tbList.some(td => row[key]==td.data_uid );//some满足其中的一个就好了
    });

    dataList.forEach((row,index) => {
      row.key=""+index
      if(opt=="insert"){
       if(tbList[0].year==undefined){
        row["staff_name"]=<span>{tbList[0].username}</span>
        row["staff_id"]=<span>{tbList[0].staff_id}</span>
       }else{
        row["staff_name"]=<span>{tbList[0].username}</span>
        row["staff_id"]=<span>{tbList[0].staff_id}</span>
        row["year"]=<span  >{tbList[0].year}</span>
       }
     }
      
    if (item.data_uid === row[key]) {
        item.new_data==""? item.new_data='"  "' :item.new_data
        row[bookObj[item.field_name]]=(item.pre_data==undefined)||((item.pre_data.replace(/\s*/g,"")).length==0)?
        <div>
        {item.ischeck=="1"?
        <span style={{color:"red",marginLeft:5}}>{item.new_data}</span>
        :
        item.ischeck=="2"?
        <span><span style={{color:"red",marginLeft:5}}>{item.new_data}</span><span style={{color:"red",marginLeft:5}}>{item.ispass=="1"?"(已通过审核)":"(未通过审核)"}</span></span>
        :
        item.ispass=="1"?
        <span style={{color:"#345669",marginLeft:5}}>{item.new_data}</span>
        :
        <span>{item.new_data}</span>
        }
        </div>
        :
        <div>
        {item.ischeck=="1"?
        <span><del>{item.pre_data}</del><span style={{color:"red",marginLeft:5}}>{item.new_data}</span></span>
        :
        item.ischeck=="2"?
        <span><del>{item.pre_data}</del><span style={{color:"red",marginLeft:5}}>{item.new_data}</span><span style={{color:"red",marginLeft:5}}>{item.ispass=="1"?"(已通过审核)":"(未通过审核)"}</span></span>
        :
        item.ispass=="1"?
        <span><del>{item.pre_data}</del><span style={{color:"#458B00",marginLeft:5}}>{item.new_data}</span></span>
        :
        <span>{item.pre_data}</span>
        }
         </div>
        
      }
  
    })

    if(dataList.length==0&&tbList.length>0){
      let record={}
      tbList[0].year==undefined?
      record={
        staff_name:<span>{tbList[0].username}</span>,
        staff_id:<span>{tbList[0].staff_id}</span>,
      }
      :
       record={
        staff_name:<span>{tbList[0].username}</span>,
        staff_id:<span>{tbList[0].staff_id}</span>,
        year:<span>{tbList[0].year}</span>
      }

      tbList.forEach((cell)=>{
       record[bookObj[cell.field_name]]=<span style={{color:cell.ischeck=="1"?"#FF4040":cell.ischeck=="2"?"#FF4040":"#345669"}}>
       {cell.ischeck=="1"?cell.new_data :
       cell.ischeck=="2"?
       cell.ispass=="1"?cell.new_data +" (已通过审核)":cell.new_data +" (未通过审核)"
        :
        cell.new_data 
      }
       </span>})
      dataList=[record]

    }
  })



  return(
    <Table
    columns={columns}
    scroll={{ x: this.state.width=="auto"?"auto":parseInt(this.state.width) }}
    dataSource={dataList}
    loading={this.props.loading}
    pagination={false}
     />
  )
  }

}