/**
 * 作者：张枫
 * 创建日期：2019-09-06
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：管理员审批办理页面
 */
import React from 'react';
import { connect } from 'dva';
import {Table,Button,Pagination,Card,Col,Row,Modal,Input,Spin,Tag,Tooltip,img,message} from "antd";
import style from "./apply.less";
import northPic from './img/north.png';
import { routerRedux } from "dva/router";
import check from "./img/check.png";
class AssignPageSevenDetails extends React.PureComponent {
  constructor(props) {super(props);}
  state = {


  };
// 工位区域
  testtest3 = (item) => {
    return(
      <Tooltip title = {(item.refer_assets_info==null)?'':item.refer_assets_info.assetuser_name}>
        <div
          className='test'
          id={item.id}
          style = {item.shape_info.position}
          onClick = {()=>this.testClick(item)}
        >
          {
            <img   // 0 未关联 （灰色） src3  1 长期使用 （浅粉）src1   2 临时使用（深粉色）src2  3 闲置（绿色）src  4 不可用（灰色）src3
              src ={
                (item.state==0 ||item.state==4)?
                  item.shape_info.img_src3
                  :
                  (item.state==1? item.shape_info.img_src1:(item.state==2?item.shape_info.img_src2:
                  (item.state==3?item.shape_info.img_src:
                  (item.state==5?check:""
                  ))))
              }
              width = '100%'
              height = '100%'
            />
          }
        </div>
      </Tooltip>
    )
  }
  //点击工位 改变工位状态
  testClick = ( item )=>{
    if(item.state == 0 || item.state == 1  || item.state == 2 ||item.state == 4  ){
      message.info("非闲置资源，不可选择！")
    }else{
      this.props.dispatch({
        type:"adminExamine/saveWorkplace",
        data:item
      })
    }
  }
  // 保存选择的工位
  saveSelect = ()=>{
    this.props.dispatch({
      type:"adminExamine/saveSelect",
    })
  }
  // 返回审批页面
  goBack = ()=>{
    this.props.dispatch(
      routerRedux.push({
        pathname:"/adminApp/compRes/todoList/adminExamine/assignPageSeven",
       // query:this.props.queryRec,
       // query:{beginTime:this.props.beginTime,endTime:this.props.endTime,applyId:this.props.applyId},
        query:{beginTime:this.props.beginTime,endTime:this.props.endTime,applyId:this.props.applyId,id:this.props.id},
      })
    )
  }
  render(){
    const {infraContentData} = this.props;
    // 区域工位图
    const renderData = () => {
      let res = []
      if(infraContentData){
        for(let i = 0; i < infraContentData.length;i++){
          const constItem = this.testtest3(infraContentData[i]);
          res.push(constItem);
        }
      }
      return res;
    }
    return (
      <Spin tip = "加载中..." spinning={this.props.loading}>
        <div className= {style.page}>
          <div style={{textAlign:"right"}}>
            <Button type = "primary" onClick = {this.saveSelect} >保存</Button>
            <Button type = "primary" onClick = {this.goBack} style={{marginLeft:"5px"}}>返回</Button>
          </div>
          <div>
            <div>已选工位：<span>{this.props.selectedNum}</span></div>
            <div>未选工位：<span>{this.props.sumNum - this.props.selectedNum}</span></div>
          </div>
          <div style = {{textAlign:'center'}}>
            <Tag  color="#FFC497" style = {{height:15}}></Tag>长期使用&nbsp;&nbsp;
            <Tag  color="#A0522D" style = {{height:15}}></Tag>临时使用&nbsp;&nbsp;
            <Tag  color="#598E8E" style = {{height:15}}></Tag>闲置资源&nbsp;&nbsp;
            <Tag  color="#E0E0E0" style = {{height:15}}></Tag>不可用资源
          </div>
          <div
           // style = {{width:document.body.clientWidth*0.8, height:document.body.clientWidth*0.8*0.6,position:'relative',top:"0%"}}
            style = {{textAlign:"center",width:document.body.clientWidth*0.8, height:document.body.clientWidth*0.8*0.6,position:'relative',top:"0%"}}
          >
              {renderData()}
          </div>
        </div>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading:state.loading.models.adminExamine,
    ...state.adminExamine
  }
}

export default connect(mapStateToProps)(AssignPageSevenDetails);
