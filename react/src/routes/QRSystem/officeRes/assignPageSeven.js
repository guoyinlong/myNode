/**
 * 作者：张枫
 * 创建日期：2019-10-16
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：工位暂存页面-本部七层
 */
import React from 'react';
import { connect } from 'dva';
import {Table,Button,Pagination,Card,Col,Row,Modal,Input,Spin,Tag,Tooltip,img} from "antd";
import mainPic from './img/main2.png';
import style from "./apply.less";
import { routerRedux } from "dva/router";
const clientWidth = document.body.clientWidth;
const picWidth = clientWidth * 0.6;
class AssignPageSeven extends React.PureComponent {
  constructor(props) {super(props);}
  state = {

  };
  // 点击工位区域
  commonIn = (id) => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/compRes/todoList/adminExamine/assignPageSevenDetails',
     //query:{id: id,beginTime:this.props.beginTime,endTime:this.props.endTime,applyId:this.props.applyId,pageName:"assignPageSeven"},
      query:{id:id,beginTime:this.props.beginTime,endTime:this.props.endTime,applyId:this.props.applyId,pageName:"assignPageSeven"},
    }));
  }
  // 返回至待办分配页面
  goBack=()=>{
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/compRes/todoList/adminExamine',
      query:this.props.queryRec,
    }));
    /**
     *  <div>
     <a
     onClick={()=>this.commonIn(infraContentDataSeven[i].id)}
     style = {temp.shape_info.position}
     >
     </a>
     </div>
     */
  }
  render(){
    const {infraContentDataSeven} = this.props;
    console.log("七层工位区域图形展示");
    console.log("infraContentDataSeven");
    console.log(infraContentDataSeven)
    // 七层 工位区域
    var renderData = () => {
      let res = []
      if(infraContentDataSeven.length !=0){
        for(let i = 0; i<infraContentDataSeven.length;i++){
          var temp = infraContentDataSeven[i];
          if(infraContentDataSeven[i].is_container == 1 ){
            res.push(
              <div style={{opacity:0}}>
                <a
                  onClick={()=>this.commonIn(infraContentDataSeven[i].id)}
                  style = {temp.shape_info.position}
              >
                </a>
              </div>
            )
          }else if(infraContentDataSeven[i].is_container  == 0){
            res.push(
              <div></div>
            )
          }
        }
      }
      return res;
    }
    return(
      <Spin tip = "加载中..." spinning={this.props.loading}>
        <div className = {style.page}>
          <div style ={{textAlign:"right"}}><Button type="primary" onClick = {this.goBack}>返回</Button></div>
          <h2 style = {{textAlign:'center'}}>二号楼7层</h2>
          <div style = {{textAlign:'center',marginTop:80,position:'relative',width:picWidth,marginLeft:clientWidth*0.1}}>
            <img src = {mainPic} width={picWidth}/>
            {renderData()}
          </div>
        </div>
      </Spin>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading:state.loading.models.adminExamine,
    ...state.adminExamine
  }
}

export default connect(mapStateToProps)(AssignPageSeven);
