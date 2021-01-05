/**
  * 作者： 卢美娟
  * 创建日期： 2018-08-22
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 办公资源-七层分布图
  */

import React from 'react';
import { connect } from 'dva';
import { Table, Row, Col, message,Tag,Button,Tooltip,Input,Modal,Spin} from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import styles from './officeRes.less';
import mainPic from './img/main2.png';
const clientWidth = document.body.clientWidth;
const picWidth = clientWidth * 0.6;
const Search = Input.Search;

class OfficeRes extends React.Component{

  state = {
    modalDeleteVisible: false,
    deleteReason: '',
    deleteid: '',
    B2Opacity:0,
    B1Opacity:0,
    B4Opacity:0,
    A2Opacity:0,
    A3Opacity:0,
    A4Opacity:0,
    T001Opacity:0,
    showModal: false,
    listData:[],
    selectid:'',
    parentid:'',
    opacityArr:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  }

  commonIn = (id) => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/compRes/officeResMain/commonPage',
      query:{param: id},
    }));
  }

  commonMouseEnter = (i) => {
    var temp = [];
    for(let j = 0; j < this.state.opacityArr.length; j++){
      if(i == j){
        temp[j] = 0.5;
      }else{
        temp[j] = 0;
      }
    }
    this.setState({
      opacityArr: temp,
    })
  }

  commonMouseOut = (i) => {
    var temp = [];
    for(let j = 0; j < this.state.opacityArr.length; j++){
      temp[j] = 0;
    }
    this.setState({
      opacityArr: temp,
    })
  }

  goBack = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/compRes/officeResMain',
    }));
  }

  getSelectid = (parent_id,id) => {
    this.setState({
      parentid:parent_id,
      selectid: id,
    })
  }

  searchPos = (value) => {
    if(value == '' || value == null || value == undefined){
     message.info("使用人姓名不能为空！");
     return;
    }
    if(value.replace(/\s+/g,'') == '' || value.replace(/\s+/g,'') == null || value.replace(/\s+/g,'') == undefined){
      message.info("使用人姓名不能为空格！");
      return;
     }
    const {dispatch} = this.props;
    var data = {
      arg_username_list: value,
    }
    dispatch({
      type:'officeRes/searchPos',
      data,
      callback:(data) => {
        this.setState({listData:data})
        if(data.length > 0){
          this.setState({showModal: true})
        }
      }
    })
  }

  handleOk = (e) => {
    const {dispatch} = this.props;
    if(this.state.selectid == ''){
      message.info("请选择查询人员");
      return;
    }
    if(this.state.parentid == 'nw' || this.state.parentid == 'ew'){
      dispatch(routerRedux.push({
        pathname:'/adminApp/compRes/officeResMain/commonPageOne',
        query:{id:this.state.selectid,param:this.state.parentid},
      }));
      this.setState({showModal: false},()=>{
        var data = {
          arg_infra_id: this.props.location.query.param,
        }
        dispatch({
          type:'CommonPageOne/infraQuery',
          data,
        })
      });
    }else{
      dispatch(routerRedux.push({
        pathname:'/adminApp/compRes/officeResMain/commonPage',
        query:{id:this.state.selectid,param:this.state.parentid},
      }));
      this.setState({showModal: false});
    }

  }

  handleCancel = (e) => {this.setState({showModal: false});}

  render(){
    const {infraContent,statisContent} =  this.props;

    let ListCard = [];
    if(this.state.listData){
      for(let i = 0; i < this.state.listData.length; i++){
        ListCard.push(
            <div style={{display:'inline-block',marginLeft:30,marginTop:30,width:260,height:170}} key = {i} className = {(this.state.listData[i].id==this.state.selectid)?styles.antcardIn:styles.antcard}
              onClick = {()=>this.getSelectid(this.state.listData[i].parent_id,this.state.listData[i].id)}>
              <div className = {styles.antcardbordered}>
                <div className = {styles.antcardhead}>
                  <div className = {styles.antcardheadtitle}>{this.state.listData[i].id}</div>
                </div>
                <div style = {{float:'left',width:'60%',overflow:'hidden',}}>
                  <p style = {{padding:10}} className = {styles.overflow}>归属部门： <Tooltip title = {this.state.listData[i].charger_dept_name}>{this.state.listData[i].charger_dept_name}</Tooltip></p>
                  <p style = {{padding:10}} className = {styles.overflow}>使用人： <Tooltip title = {this.state.listData[i].assetuser_name}>{this.state.listData[i].assetuser_name}</Tooltip></p>
                </div>

              </div>
            </div>

        )
      }
    }

    var renderData = () => {
      let res = []
      if(infraContent && statisContent){
        if(infraContent[0]){
          if(infraContent[0].children){
            for(let i = 0; i < infraContent[0].children.length;i++){
              var temp = infraContent[0].children[i];

              if(infraContent[0].children[i].is_container == 1 && statisContent[i]){
                res.push(
                  <div style={{opacity:this.state.opacityArr[i]}} onMouseEnter={()=>this.commonMouseEnter(i)} onMouseLeave={()=>this.commonMouseOut(i)}>
                    <Tooltip  title = {`${temp.abbr_name}共有工位${statisContent[i].all_station_count}个，其中长期使用${statisContent[i].longterm_station_count}个，
                    临时使用${statisContent[i].temporary_station_count}个，闲置${statisContent[i].free_station_count}个，
                    不可用${statisContent[i].cant_use_station_count}个`}>
                      <a onClick={()=>this.commonIn(infraContent[0].children[i].id)}
                        style = {temp.shape_info.position}>
                      </a>
                    </Tooltip>
                  </div>
                )
              }else if(infraContent[0].children[i].is_container == 0){
                res.push(
                  <div style={{opacity:this.state.opacityArr[i]}} onMouseEnter={()=>this.commonMouseEnter(i)} onMouseLeave={()=>this.commonMouseOut(i)}>
                    <Tooltip title={temp.abbr_name}>
                      <a style = {temp.shape_info.position}></a>
                    </Tooltip>
                  </div>
                )
              }

            }
          }
        }
      }

      return res;
    }
    if(infraContent){
      return(
        <Spin tip="加载中..." spinning={this.props.loading}>
          <div className = {styles.pageContainer}>
            <h2 style = {{textAlign:'center'}}>{infraContent?infraContent[0].infra_name:''}</h2>
            <Search
             placeholder="请输入使用人姓名搜索"
             onSearch={value => this.searchPos(value)}
             style={{width:'20%',marginTop:'1%',marginLeft:'67%'}}
             maxLength = {10}
             enterButton
             />
            <Button type = 'primary' style = {{marginLeft:'95%',position:"relative",zIndex:1}} onClick = {this.goBack}>返回</Button>
            <div style = {{textAlign:'center',marginTop:80,position:'relative',width:picWidth,marginLeft:clientWidth*0.1}}>
              <img src = {mainPic} width={picWidth}/>
              {renderData()}
            </div>

            <Modal title = '请选择查询人员' width='925' height='600' visible = {this.state.showModal} onOk={this.handleOk} onCancel={this.handleCancel}>
               <div style={{height:'460',overflow:'auto'}}>
                 {ListCard}
               </div>
            </Modal>
          </div>
        </Spin>
      )
    }else{
      return(
        <div></div>
      )
    }
  }

}

function mapStateToProps (state) {
  const {query,infraContent,statisContent} = state.officeRes;  //lumj
  return {
    loading: state.loading.models.officeRes,
    query,
    infraContent,
    statisContent
  };
}


export default connect(mapStateToProps)(OfficeRes);
