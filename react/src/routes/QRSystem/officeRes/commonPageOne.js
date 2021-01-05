/**
  * 作者： 卢美娟
  * 创建日期： 2018-08-22
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 办公资源-指示图
  */

import React from 'react';
import { connect } from 'dva';
import {Table, Row, Col, message, Tag, Button, Form, Input, Checkbox, Radio, Modal, Spin,Tooltip} from 'antd';
import moment from 'moment';;
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import styles from './officeRes.less';
import seatImg from './img/seat.png';
import northPic from './img/north.png';
import StaffList from './staffChoose';
import UsersList from './userChoose';
import DeptList from './deptChoose';
import request from '../../../utils/request';
import ConnectModal from './modalConnect.js';
import ConnectEW from './modalConnectEW.js'
import HistoryModal from './history.js';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Search = Input.Search;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 9 },
};


class CommonPageOne extends React.Component{

  state = {
    flag: 0,
    assetName:'',
    floor:'',
    region:'',
    seat:'',
    dept:'',
    chargername:'',
    username:'',
    userList:[],
    editButton:false,
    occupyState: '长期',
    ownEquipment:'',
    modalVisible: false,
    findResFlag: '-1', //是否查询到关联资产； 0-没有关联资产， 1- 有关联资产
    item_id:'', //具体某一个工位的id
    asset_id:'',
    charger_dept_id:'', //归属部门id
    user_dept_id:'', //使用部门id
    assetuser_id:'',
    charger_id:'',
    resList:[],
    isEditVisible:false,
    historyVisible:false,
    ewData:[],
    infratypeId:'',
    canManageProp:null,
    historyList:[],
    showPeopleModal:false,
    listData:[],
    selectid:'',
    parentid:'',
    can_operate: '0',
    typeLevelEdit: true, //级别分类是否可编辑
  }

  componentDidMount(){
    this.props.form.validateFields();
    //获取负责人/使用人
    let postData2 = {
      // arg_deptname:'',
    };
    let oudata2=request('/microservice/serviceauth/p_getusers',postData2);
    oudata2.then((data)=>{

      this.setState({
        userList:data.DataRows,
      })
    })
    this.setState({canManageProp:null,typeLevelEdit:true})
  }

  componentWillMount(){
    const {dispatch} = this.props;
    var data = {
      arg_infra_id: this.props.location.query.param,
    }
    dispatch({
      type:'CommonPageOne/infraQuery',
      data,
    })

    //查询 用户是否可以操作厂商
    let oudata2=request('/assetsmanageservice/assetsmanage/assets/canOperateVendor');
    oudata2.then((data)=>{
      if(data.RetCode == '1'){
        this.setState({can_operate: data.can_operate})
      }
    }).catch(()=>{
      message.error("查询是否可以操作厂商错误")
    })
  }

  testClick = (param,id,typeid,canManage) => {
    this.props.form.resetFields();

    if(param === null){
      param={};
      param.item_id=id
      param.occupyState='闲置';
      param.editButton=false;
      param.alreaySelected=1;
      param.assetuser_name='';
      param.ownEquipment='';
      param.user_type=''; //外部人员
      param.typeLevelEdit=true;
      param.charger_dept_id='';
      param.user_dept_id='';
    }else{
      param.item_id=id;
      param.editButton=true;
      param.alreaySelected=1;
      param.typeLevelEdit=false;

      if(param.assetuser_usedassets !== []){
        var useDassets = param.assetuser_usedassets;
        var usetemp = '';
        if(useDassets){{
          for(let i = 0; i < useDassets.length; i++){
            usetemp += useDassets[i].asset_name + ' ';
          }
        }}

      }
      param.ownEquipment=usetemp?usetemp.substring(0,usetemp.length-1):'';
      param.occupyState=(param.can_use==='0')?'不可用': (param.useinfo_type?param.useinfo_type:'闲置');
    }
    if(canManage === 1){
      param.canManage=1;
    }else if(canManage === 0){
      param.canManage=0;
    }
    param.canManageProp = param?param.can_manage_prop:null;

    this.setState({infratypeId: typeid});
    var divs = document.querySelectorAll('.test'), i;
    if(divs){
      for (i = 0; i < divs.length; ++i) {
        divs[i].style.borderWidth = "0px";
      }
    }

    document.getElementById(id).style.borderColor = 'yellow';
    document.getElementById(id).style.borderStyle = 'solid';
    document.getElementById(id).style.borderWidth = '1px';
    this.setState({
      isEditVisible:true,
      item_id:id,
      ewData:param
    })
  }

  testMouseEnter = () => {
    this.setState({flag: 1})
  }

  testMouseLeave = () => {
    this.setState({flag: 0})
  }

  goBack = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/compRes/officeResMain',
    }));
  }

  onChangeOccupy = (e) => {
    this.state.ewData.occupyState=e.target.value;
    if(e.target.value === '闲置' || e.target.value === '不可用'){
      this.state.ewData.assetuser_id =' ';
      this.state.ewData.assetuser_name =' ';
      this.state.ewData.ownEquipment = '';
    }
    this.setState({
      ewData:this.state.ewData
    })
  }

  editOfficeRes = (assetid,values) => {
    const {dispatch} = this.props;
    if(values.assetName === null || values.assetName == undefined || values.assetName == ''){
      message.info("请输入正确的资产名称！");
      return;
    }
    if(values.assetName.replace(/\s+/g,'') == '' || values.assetName.replace(/\s+/g,'') == null || values.assetName.replace(/\s+/g,'') == undefined){
      message.info("请输入正确的资产名称！");
      return;
    }
      var data2 = {};
      var emptyObj = {};
      if(this.state.ewData.occupyState === '闲置'){
        data2 = {
          asset_id: assetid,
          // asset_number: assetid,
          asset_number:values.assetName?values.assetName:'',
          asset_name: values.assetName?values.assetName:'',
          charger_id: values.chargername? (values.chargername.userid?values.chargername.userid:this.state.ewData.charger_id) : '',
          charger_name: values.chargername?(values.chargername.username?values.chargername.username:values.chargername):'',
          charger_dept_id: values.dept?(values.dept.userid?values.dept.userid:this.state.ewData.charger_dept_id):'',
          charger_dept_name: values.dept?(values.dept.username?values.dept.username:values.dept):'',
          user_dept_id: values.userdept?(values.userdept.userid?values.userdept.userid:this.state.ewData.user_dept_id):'',
          user_dept_name: values.userdept?(values.userdept.username?values.userdept.username:values.userdept):'',
          floor: values.floor?values.floor:'',
          location: values.region?values.region:'',
          station: values.seat?values.seat:'',
          assetuser_info:emptyObj,
          can_use:'1',
          // type_id2:values.type_id[0],
          type_id2:values.type_id, //级别分类变成select后修改的
          assetuser_type:'内部人员',
        }
      }
      else if(this.state.ewData.occupyState === '不可用'){
        data2 = {
          asset_id: assetid,
          // asset_number: assetid,
          asset_number:values.assetName?values.assetName:'',
          asset_name: values.assetName?values.assetName:'',
          charger_id: values.chargername? (values.chargername.userid?values.chargername.userid:this.state.ewData.charger_id) : '',
          charger_name: values.chargername?(values.chargername.username?values.chargername.username:values.chargername):'',
          charger_dept_id: values.dept?(values.dept.userid?values.dept.userid:this.state.ewData.charger_dept_id):'',
          charger_dept_name: values.dept?(values.dept.username?values.dept.username:values.dept):'',
          user_dept_id: values.userdept?(values.userdept.userid?values.userdept.userid:this.state.ewData.user_dept_id):'',
          user_dept_name: values.userdept?(values.userdept.username?values.userdept.username:values.userdept):'',
          floor: values.floor?values.floor:'',
          location: values.region?values.region:'',
          station: values.seat?values.seat:'',
          can_use:'0',
          // type_id2:values.type_id[0],
          type_id2:values.type_id, //级别分类变成select后修改的
          assetuser_type:'内部人员',
        }
      }
      else{
        if (!values.username1) {
          if(!values.username){
            message.info("请选择使用人");
            return;
          }
          data2 = {
          asset_id: assetid,
          // asset_number: assetid,
          asset_number:values.assetName?values.assetName:'',
          asset_name: values.assetName?values.assetName:'',
          charger_id: values.chargername?(values.chargername.userid?values.chargername.userid:this.state.ewData.charger_id):'',
          charger_name: values.chargername?(values.chargername.username?values.chargername.username:values.chargername):'',
          charger_dept_id: values.dept?(values.dept.userid?values.dept.userid:this.state.ewData.charger_dept_id):'',
          charger_dept_name: values.dept?(values.dept.username?values.dept.username:values.dept):'',
          user_dept_id: values.userdept?(values.userdept.userid?values.userdept.userid:this.state.ewData.user_dept_id):'',
          user_dept_name: values.userdept?(values.userdept.username?values.userdept.username:values.userdept):'',
          floor: values.floor?values.floor:'',
          location: values.region?values.region:'',
          station: values.seat?values.seat:'',
          assetuser_type:'内部人员',
          assetuser_info:{
            assetuser_id:values.username.userid?values.username.userid:this.state.ewData.assetuser_id,
            assetuser_name:values.username.username?values.username.username: values.username,
            assetuser_type:'内部人员',
            assetuser_term:this.state.ewData.occupyState,
          },
          can_use:'1',
          // type_id2:values.type_id[0],
          type_id2:values.type_id, //级别分类变成select后修改的
        }
        }
        else{

          if(values.username1){
            if(values.username1.length== 0){
              message.info("请选择使用人");
              return;
            }
          }
          data2 = {
           asset_id: assetid,
           // asset_number: assetid,
           asset_number:values.assetName?values.assetName:'',
           asset_name: values.assetName?values.assetName:'',
           charger_id: values.chargername?(values.chargername.userid?values.chargername.userid:this.state.ewData.charger_id):'',
           charger_name: values.chargername?(values.chargername.username?values.chargername.username:values.chargername):'',
           charger_dept_id: values.dept?(values.dept.userid?values.dept.userid:''):'',
           charger_dept_name: values.dept?(values.dept.username?values.dept.username:values.dept):'',
           user_dept_id: values.userdept?(values.userdept.userid?values.userdept.userid:''):'',
           user_dept_name: values.userdept?(values.userdept.username?values.userdept.username:values.userdept):'',
           floor: values.floor?values.floor:'',
           location: values.region?values.region:'',
           station: values.seat?values.seat:'',
           assetuser_type:'外部人员',
           assetuser_info:{
             assetuser_type:'外部人员',
             assetuser_term:this.state.ewData.occupyState,
             user_id:values.username1[2]
           },
           can_use:'1',
           // type_id2:values.type_id[0],
           type_id2:values.type_id, //级别分类变成select后修改的
         }
        }
      }
      // if(values.type_id[0] == null || values.type_id[0] == undefined){
      //   message.info("请选择级别分类");
      //   return;
      // }
      if(values.type_id == null || values.type_id == undefined){
        message.info("请选择级别分类");
        return;
      }

      if(this.state.ewData.occupyState == '长期' || this.state.ewData.occupyState == '临时'){
        if((!values.username) && (!values.username1)){
            message.info("请选择使用人！");
            return;
          }
      }
      dispatch({
        type:'CommonPageOne/assetsUpdateV2',
        data2,
        paramPage: this.props.location.query.param,
      })
      this.props.form.resetFields();


  }

  showModal = () => {
     this.setState({
       modalVisible: true,
     });
   }

  hideOkModel = (assetid) => {
    if(this.state.item_id === ''){
      message.info("请选择要关联的工位/办公室");
      return;
    }
    if(assetid == undefined || assetid == null || assetid == ''){
      message.info("请选择要关联的综合资源");
      return;
    }

    //关联资产
    const {dispatch} = this.props;
    var data2 = {
      arg_infra_id: this.state.item_id,
      arg_asset_id: assetid,
    }

    dispatch({
      type: 'CommonPageOne/infraUpdateAsset',
      data2,
      paramPage: this.props.location.query.param,
    })
    this.setState({
      modalVisible: false,
      isEditVisible:false,
      findResFlag: '-1',
      resList:[],
    });
  }

  hideCancelModel = (e) => {

      this.setState({
        modalVisible: false,
        findResFlag: '-1',
        resList:[],
      });
    }
  hideCancelModelEW = (e) => {
    this.setState({
      isEditVisible: false,
    });
  }
  findRes = (value) => {
    let postData = {
      argAssetsName: value,
      argTypeId: this.state.infratypeId,
      argReferInfraState: 0,
      argOrderRule: 'byName',
    };

    if(this.state.infratypeId == null){
      message.info("输入搜索条件与资产类型不符，请重新输入");
      return;
    }
    let oudata=request('/assetsmanageservice/assetsmanage/assets/assetsQuery',postData);
    oudata.then((data)=>{
      if(data.RetCode == '1'){
        this.setState({resList: data.DataRows});
      }else{
        message.info(data.RetVal);
        this.setState({resList:[]})
      }
    })
  }

  ceateRes = (values) => {
    const {dispatch} = this.props;
    var temp = values.type_id?values.type_id.split('_')[0]:'';
    if(values.assetName === null || values.assetName == undefined || values.assetName == ''){
      message.info("请输入正确的资产名称！");
      return;
    }
    if(values.assetName.replace(/\s+/g,'') == '' || values.assetName.replace(/\s+/g,'') == null || values.assetName.replace(/\s+/g,'') == undefined){
      message.info("请输入正确的资产名称！");
      return;
    }
    // if(values.type_id[0] == null){
    //   message.info("请选择级别分类");
    //   return;
    // }
    if(values.type_id== null){
      message.info("请选择级别分类");
      return;
    }

    this.props.form.validateFields();

    var data3 = {
      asset_number: values.assetName,
      asset_name: values.assetName,
      charger_id: values.chargername?(values.chargername.userid?values.chargername.userid:''):'',
      charger_name: values.chargername?(values.chargername.username?values.chargername.username:''):'',
      charger_dept_id: values.dept?(values.dept.userid?values.dept.userid:''):'',
      charger_dept_name: values.dept?(values.dept.username?values.dept.username:''):'',
      user_dept_id: values.userdept?values.userdept.userid?values.userdept.userid:'':'',
      user_dept_name: values.userdept?values.userdept.username?values.userdept.username:'':'',
      floor: values.floor,
      location: values.region,
      station: values.seat,
      can_use: (this.state.ewData.occupyState == '不可用')?'0':'1',
      assetuser_type: values.username1?'外部人员':(values.username.userid?'内部人员':''),
      assetuser_info:{
        assetuser_id:values.username?(values.username.userid):'',
        assetuser_name:values.username?(values.username.username):'',
        assetuser_type: values.username1?'外部人员':(values.username.userid?'内部人员':''),
        assetuser_term:this.state.ewData.occupyState,
        user_id:values.username?'':(values.username1?values.username1[2]:''),
      },
      // type_id2:values.type_id[0],
      type_id1:temp,
      type_id2:values.type_id,
    }

    if(this.state.ewData.occupyState == '长期' || this.state.ewData.occupyState == '临时'){
      if(!values.username){
        if(values.username1){
          if(!values.username1[2]){
            message.info("请选择使用人！");
            return;
          }
        }
      }
    }

    dispatch({
      type:'CommonPageOne/assetsAddV2',
      data3,
      item_id: this.state.item_id,
      paramPage: this.props.location.query.param,
    })

  }

  showHistory = (assetid) => {
    this.setState({historyVisible:true})
    let postData = {
      arg_assets_id: assetid,
    };
    let oudata=request('/assetsmanageservice/assetsmanage/assets/assetsUserHistory',postData);
    oudata.then((data)=>{
      if(data.RetCode == '1'){
        this.setState({
          historyList:data.DataRows
        })
      }
    })
  }

  onClose = () => {this.setState({historyVisible:false})}

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
     type:'CommonPageOne/searchPos',
     data,
     callback:(data) => {
       this.setState({listData:data})
       if(data){
         if(data.length > 0){
           this.setState({showPeopleModal: true})
         }
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
     dispatch(routerRedux.replace({
       pathname:'/adminApp/compRes/officeResMain/commonPageOne',
       query:{id:this.state.selectid,param:this.state.parentid},
     }));
     this.setState({showPeopleModal: false},()=>{
       var data = {
         arg_infra_id: this.props.location.query.param,
       }
       dispatch({
         type:'CommonPageOne/infraQuery',
         data,
       })
     });
   }else{
     dispatch(routerRedux.replace({
       pathname:'/adminApp/compRes/officeResMain/commonPage',
       query:{id:this.state.selectid,param:this.state.parentid},
     }));
     this.setState({showPeopleModal: false},()=>{
       var data = {
         arg_infra_id: this.props.location.query.param,
       }
       dispatch({
         type:'CommonPage/infraQuery',
         data,
       })
     });
   }
 }
  handleCancel = (e) => {this.setState({showPeopleModal: false});}
  getSelectid = (parent_id,id) => {
    this.setState({
      parentid:parent_id,
      selectid: id,
    })
  }
  cancelOfficeRes = () => {
    const {dispatch} = this.props;
    var data7 = {
      arg_infra_id: this.state.item_id,
      arg_asset_id: '', // null或空字符串为取消关联
    }

    dispatch({
      type: 'CommonPageOne/cancelOfficeRes',
      data7,
      paramPage: this.props.location.query.param,
    })
  }
  userReset = () => {
    var temp = this.state.ewData;
    temp.assetuser_name = '';
    this.setState({ewData:temp})
  }

  testtest3 = (childItem) => {
    return(
      <Tooltip title = {(childItem.refer_assets_info==null)?'':childItem.refer_assets_info.assetuser_name}>
        <div className='test' id={childItem.id} style = {childItem.shape_info.position}
       onClick = {()=>this.testClick(childItem.refer_assets_info,childItem.id,childItem.infra_type_id,childItem.can_manage)}>
        {<img src = {(childItem.refer_assets_info==null)?
          childItem.shape_info.img_src:(childItem.refer_assets_info.can_use=='0'?childItem.shape_info.img_src3:(childItem.refer_assets_info.useinfo_type=='长期'?
            childItem.shape_info.img_src1:(childItem.refer_assets_info.useinfo_type=='临时'?
              childItem.shape_info.img_src2:childItem.shape_info.img_src)))}
              width = '100%' height = '100%'/>}</div></Tooltip>
    )
  }

  render(){

    const {infraContent} = this.props;
    // const testDataRows = testData.DataRows[0];
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
    var testDataRows = {};
      var infra_refer_location = '';
    if(infraContent){
      testDataRows = infraContent[0];
      infra_refer_location = infraContent[0].infra_refer_location;
    }
    var infratypeId = '';
    if(this.state.infratypeId){
      infratypeId = this.state.infratypeId
    }
    var renderData = () => {
      let res = []
      if(testDataRows.children){
        for(let i = 0; i < testDataRows.children.length;i++){

          const childItem = testDataRows.children[i];
          var tempStyle = childItem.shape_info.position;
          if(this.props.location.query.id === testDataRows.children[i].id){
              tempStyle.boxShadow = '0 0 15px rgb(231, 22, 26)';
          }
          const constItem = this.testtest3(childItem);
          res.push(constItem);
        }
      }
      return res;
    }

    if(infraContent){
      return(
        <Spin tip="加载中..." spinning={this.props.loading}>
           <div style = {testDataRows.shape_container.shape_property}>
             <h2 style = {{textAlign:'center'}}>{infraContent[0].infra_name}</h2>
             <Search
              placeholder="请输入使用人姓名搜索"
              onSearch={value => this.searchPos(value)}
              style={{width:'20%',marginTop:'1%',marginLeft:'67%'}}
              maxLength = {10}
              enterButton
              />
             <Button type = 'primary' style = {{marginLeft:'95%',position:"relative",zIndex:1}} onClick = {this.goBack}>返回</Button>
             <div style = {{textAlign:'center'}}>
               <Tag  color="#FFC497" style = {{height:15}}></Tag>长期使用&nbsp;&nbsp;
               <Tag  color="#859AB8" style = {{height:15}}></Tag>临时使用&nbsp;&nbsp;
               <Tag  color="#598E8E" style = {{height:15}}></Tag>闲置资源&nbsp;&nbsp;
               <Tag  color="#E0E0E0" style = {{height:15}}></Tag>不可用资源
             </div>
             <div style = {testDataRows.shape_container.north_poperty}><img src = {northPic} height = '70px'/></div>
             <div style = {{width:document.body.clientWidth*0.7, height:document.body.clientWidth*0.7*1.5,top:'-12%',position:'relative'}}>
               <div style = {{width:'100%'}}>
                 {renderData()}
                 {/*  <div style = {{width: "17%",height: "2px",background: "#eee",top: "10%",position: "absolute",left: "78%"}}></div>
                 <div style = {{width: "2px",height: "50%",background: "#eee",top: "10%",position: "absolute",left: "78%"}}></div>
                 <div style = {{width: "2px",height: "50%",background: "#eee",top: "10%",position: "absolute",left: "95%"}}></div>
                 <div style = {{width: "17%",height: "2px",background: "#eee",top: "60%",position: "absolute",left: "78%"}}></div>
                 <h2 style = {{top: "12%",position: "absolute",left: "78%", width:"17%",textAlign:"center"}}>临时工位区域</h2>
                 */ }
               </div>
               <div>
                 <div className = {styles.content1}>
                    <ConnectEW visible={this.state.isEditVisible} showHistory={this.showHistory} cancelClick = {this.hideCancelModelEW}
                     EWdata = {this.state.ewData} userList={this.state.userList} showModal={this.showModal} ceateRes={this.ceateRes}
                     onChangeOccupy={this.onChangeOccupy} editOfficeRes={this.editOfficeRes} can_operate={this.state.can_operate}
                     cancelOfficeRes={this.cancelOfficeRes} userReset={this.userReset} externalList={this.props.externalList}/>

                 </div>
               </div>
             </div>

             <ConnectModal  okClick = {this.hideOkModel} cancelClick = {this.hideCancelModel} infratypeId = {infratypeId}
             infra_refer_location={infra_refer_location} resList = {this.state.resList} findRes = {this.findRes}
             findResFlag = {this.state.findResFlag} visible={this.state.modalVisible} />

             <HistoryModal visible={this.state.historyVisible}  historyList={this.state.historyList} onClose={this.onClose}/>

             <Modal title = '请选择查询人员' width='925' height='600' visible = {this.state.showPeopleModal} onOk={this.handleOk} onCancel={this.handleCancel}>
                <div style={{height:'460',overflow:'auto'}}>
                  {ListCard}
                </div>
             </Modal>

           </div>
        </Spin>
      );
    }
    else{
      return(
        <div></div>
      )
    }

  }

}

function mapStateToProps (state) {
  const {query,infraContent,externalList} = state.CommonPageOne;  //lumj
  return {
    loading: state.loading.models.CommonPageOne,
    query,
    infraContent,
    externalList
  };
}

const WrappedHorizontalLoginForm = Form.create()(CommonPageOne);
export default connect(mapStateToProps) (WrappedHorizontalLoginForm);
