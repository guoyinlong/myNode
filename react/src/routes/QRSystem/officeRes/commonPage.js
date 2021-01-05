/**
 * 作者： 卢美娟
 * 创建日期： 2018-08-22
 * 邮箱: lumj14@chinaunicom.cn
 * 功能： 办公资源-指示图
 */

import React from 'react';
import { connect } from 'dva';
// import Draggable from 'react-draggable';
import { Table, Row, Col, message,Tag,Button,Form,Input,Checkbox,Radio,Modal,Spin,Tooltip,Cascader,Icon,Select } from 'antd';
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
import HistoryModal from './history.js';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 9 },
};
const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];



class CommonPage extends React.Component{

  state = {
    flag: 0,
    assetName:'',
    type_id:'',
    floor:'',
    region:'',
    seat:'',
    dept:'',
    userdept:'',
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
    infratypeId:'',
    canManage: 0,
    canManageProp:null,
    alreaySelected: 0,
    moveX:0,
    moveY:0,
    initX:0,
    initY:0,
    assetTypeList:[],
    myOptions:[],
    myLocationOption:[],
    // levelType:'',
    levelType:'type3_1', //工位
    historyVisible:false,
    historyList:[],
    showPeopleModal:false,
    listData:[],
    selectid:'',
    parentid:'',
    AccuracyLocationInfo:'',
    typeLevelEdit: true, //级别分类是否可编辑
    displayWay: 'usestate', //usestate-以使用状态展示，deptstate-以部门展示
    initDept:[], //选中的部门
    color_img_src:'', //闲置
    color_img_src1:'',//长期
    color_img_src2:'',//临时
    color_img_src3:'',//不可用
    color_img_dept:[],
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
    this.setState({canManage:0,canManageProp:null,typeLevelEdit:true})

    //获取级别分类
    let postData = {
    };
    let oudata=request('/assetsmanageservice/assetsmanage/assets/assetsTypeQuery',postData);

    oudata.then((data)=>{
      this.setState({
        assetTypeList:data.my_child,
      },()=>{
        var myOptions = [];
        if(this.state.assetTypeList != undefined){
          this.state.assetTypeList.forEach(i => {
              //注意这里哦，有问题，真实数据还没改过来
            if(i.type_name == '场地'){
              if(i.my_child != undefined){
                i.my_child.forEach(j => {
                  myOptions.push({value:j.type_id, label:j.type_name})
                })
                this.setState({type_id:i.my_child[0].type_id})
              }
            }
          })
        }
        this.setState({
          myLocationOption:myOptions
        })
      })
    })
  }

  componentWillReceiveProps(nextProps){
    const {infraContent} = this.props;
    var infra_color_config = [];
    var temp_color_dept = [];
    if(infraContent){
      infra_color_config = infraContent[0].infra_color_config;
      if(infra_color_config){
        for(let i = 0; i < infra_color_config.length; i++){
          if(infra_color_config[i].colorcode == 'colorcode_img_src'){
            this.setState({color_img_src:infra_color_config[i].colorvalue})
          }else if(infra_color_config[i].colorcode == 'colorcode_img_src1'){
            this.setState({color_img_src1:infra_color_config[i].colorvalue})
          }else if(infra_color_config[i].colorcode == 'colorcode_img_src2'){
            this.setState({color_img_src2:infra_color_config[i].colorvalue})
          }else if(infra_color_config[i].colorcode == 'colorcode_img_src3'){
            this.setState({color_img_src3:infra_color_config[i].colorvalue})
          }else if(infra_color_config[i].colorcode == 'colorcode_color_1'){
            temp_color_dept[0] = infra_color_config[i].colorvalue;
            this.setState({color_img_dept:temp_color_dept})
          }else if(infra_color_config[i].colorcode == 'colorcode_color_2'){
            temp_color_dept[1] = infra_color_config[i].colorvalue;
            this.setState({color_img_dept:temp_color_dept})
          }else if(infra_color_config[i].colorcode == 'colorcode_color_3'){
            temp_color_dept[2] = infra_color_config[i].colorvalue;
            this.setState({color_img_dept:temp_color_dept})
          }else if(infra_color_config[i].colorcode == 'colorcode_color_4'){
            temp_color_dept[3] = infra_color_config[i].colorvalue;
            this.setState({color_img_dept:temp_color_dept})
          }
        }
      }
    }
    // 获取选中部门
    var initDept = [];
    if(this.props.deptOption){
      for(let i = 0; i < this.props.deptOption.length; i++){
        initDept.push(this.props.deptOption[i].value)  //id
      }
    }
    setInterval(this.setState({initDept}),1000)
  }

  componentWillMount(){
    const {dispatch} = this.props;

    var data = {
      arg_infra_id: this.props.location.query.param,
    }
    dispatch({
      type:'CommonPage/infraQuery',
      data,
    })
  }

  testClick = (param,id,typeid,canManage) => {
    this.props.form.resetFields();
    if(param){
      this.setState({typeLevelEdit: false})
    }else{
      this.setState({typeLevelEdit: true})
    }

    if(canManage === 1){
      this.setState({canManage: 1,alreaySelected:1})
    }else if(canManage === 0){
      this.setState({canManage: 0,alreaySelected:1})
    }
    this.setState({canManageProp: param?param.can_manage_prop:null})

    this.props.form.resetFields();
    if(param === null){
      this.setState({
        floor: '',
        region: '',
        seat: '',
        dept: '',
        userdept:'',
        chargername: '',
        username: '',
        editButton: false,
        ownEquipment: '',
        occupyState: '闲置',
        item_id: id,
        assetName: '',
        charger_dept_id:'',
        user_dept_id:'',
        assetuser_id:'',
        charger_id:'',
        infratypeId:typeid,
      })
    }else{
      if(param.assetuser_usedassets !== []){
        var useDassets = param.assetuser_usedassets;
        var usetemp = '';
        if(useDassets){{
          for(let i = 0; i < useDassets.length; i++){
            usetemp += useDassets[i].asset_name + '，';
          }
        }}

      }

      this.setState({
        floor: param.floor,
        region: param.location,
        seat: param.station,
        dept: param.charger_dept_name,
        userdept:param.user_dept_name,
        chargername: param.charger_name,
        username: param.assetuser_name,
        editButton: true,
        ownEquipment: usetemp?usetemp.substring(0,usetemp.length-1):'',
        //occupyState: param.useinfo_type?param.useinfo_type:'闲置',
        occupyState: (param.can_use==='0')?'不可用': (param.useinfo_type?param.useinfo_type:'闲置'),
        asset_id: param.asset_id,
        item_id: id,
        assetName: param.asset_name,
        charger_dept_id: param.charger_dept_id,
        user_dept_id: param.user_dept_id,
        assetuser_id: param.assetuser_id,
        charger_id: param.charger_id,
        infratypeId: typeid,
        levelType: param.type_id2,
      })
    }

    var divs = document.querySelectorAll('.test'), i;
    if(divs){
      for (i = 0; i < divs.length; ++i) {
        divs[i].style.borderWidth = "0px";
      }
    }

      document.getElementById(id).style.borderColor = 'yellow';
      document.getElementById(id).style.borderStyle = 'solid';
      document.getElementById(id).style.borderWidth = '1px';
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
      pathname:'/adminApp/compRes/officeResMain/officeRes',
    }));
  }

  onChangeOccupy = (e) => {
    this.setState({
      occupyState: e.target.value,
    })
    if(e.target.value === '闲置' || e.target.value === '不可用'){
      this.setState({
        assetuser_id:'',
        username: '',
        ownEquipment: '',
      })
    }
  }

  editOfficeRes = () => {
    const { validateFieldsAndScroll } = this.props.form;
    const {dispatch} = this.props;
    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      //this.props.form.resetFields();
      this.props.form.validateFields();
      if(values.assetName == '' || values.assetName == null || values.assetName == undefined){
        message.info("请输入正确的资产名称！");
        return;
      }
      if(values.assetName.replace(/\s+/g,'') == '' || values.assetName.replace(/\s+/g,'') == null || values.assetName.replace(/\s+/g,'') == undefined){
        message.info("请输入正确的资产名称！");
        return;
      }
      // okClick(assetid,values);
      var data2 = {};
      var emptyObj = {};
      if(this.state.occupyState === '闲置'){
        data2 = {
          asset_id: this.state.asset_id,
          // asset_number: this.state.asset_id,
          asset_number:  values.assetName?values.assetName:'',
          asset_name: values.assetName?values.assetName:'',
          charger_id: values.chargername? (values.chargername.userid?values.chargername.userid:this.state.charger_id) : '',
          charger_name: values.chargername?(values.chargername.username?values.chargername.username:values.chargername):'',
          charger_dept_id: values.dept?(values.dept.userid?values.dept.userid:this.state.charger_dept_id):'',
          charger_dept_name: values.dept?(values.dept.username?values.dept.username:values.dept):'',
          user_dept_id: values.userdept?(values.userdept.userid?values.userdept.userid:this.state.user_dept_id):'',
          user_dept_name: values.userdept?(values.userdept.username?values.userdept.username:values.userdept):'',
          floor: values.floor?values.floor:'',
          location: values.region?values.region:'',
          station: values.seat?values.seat:'',
          assetuser_info:emptyObj,
          can_use:'1',
          type_id2:values.type_id[0],
          assetuser_type:'内部人员',
        }
      }
      else if(this.state.occupyState === '不可用'){
        data2 = {
         asset_id: this.state.asset_id,
         // asset_number: this.state.asset_id,
         asset_number: values.assetName?values.assetName:'',
         asset_name: values.assetName?values.assetName:'',
         charger_id: values.chargername?(values.chargername.userid?values.chargername.userid:this.state.charger_id):'',
         charger_name: values.chargername?(values.chargername.username?values.chargername.username:values.chargername):'',
         charger_dept_id: values.dept?(values.dept.userid?values.dept.userid:this.state.charger_dept_id):'',
         charger_dept_name: values.dept?(values.dept.username?values.dept.username:values.dept):'',
         user_dept_id: values.userdept?(values.userdept.userid?values.userdept.userid:this.state.user_dept_id):'',
         user_dept_name: values.userdept?(values.userdept.username?values.userdept.username:values.userdept):'',
         floor: values.floor?values.floor:'',
         location: values.region?values.region:'',
         station: values.seat?values.seat:'',
         assetuser_info:emptyObj,
         can_use:'0',
         type_id2:values.type_id[0],
         assetuser_type:'内部人员',
       }
      }
      else{
        if(values.username == null || values.username == undefined || values.username == ''){
          message.info("请选择使用人");
          return;
        }

        data2 = {
          asset_id: this.state.asset_id,
          // asset_number: this.state.asset_id,
          asset_number: values.assetName?values.assetName:'',
          asset_name: values.assetName?values.assetName:'',
          charger_id: values.chargername?(values.chargername.userid?values.chargername.userid:this.state.charger_id):'',
          charger_name: values.chargername?(values.chargername.username?values.chargername.username:values.chargername):'',
          charger_dept_id: values.dept?(values.dept.userid?values.dept.userid:this.state.charger_dept_id):'',
          charger_dept_name: values.dept?(values.dept.username?values.dept.username:values.dept):'',
          user_dept_id: values.userdept?(values.userdept.userid?values.userdept.userid:this.state.user_dept_id):'',
          user_dept_name: values.userdept?(values.userdept.username?values.userdept.username:values.userdept):'',
          floor: values.floor?values.floor:'',
          location: values.region?values.region:'',
          station: values.seat?values.seat:'',
          assetuser_type:'内部人员',
          assetuser_info:{
            assetuser_id:values.username.userid?values.username.userid:this.state.assetuser_id,
            assetuser_name:values.username.username?values.username.username: values.username,
            assetuser_type:'内部人员',
            assetuser_term:this.state.occupyState,
          },
          can_use:'1',
          type_id2:values.type_id[0],
        }
      }

      if(values.type_id[0] == null || values.type_id[0] == undefined){
        message.info("请选择级别分类");
        return;
      }

      dispatch({
        type:'CommonPage/assetsUpdateV2',
        data2,
        paramPage: this.props.location.query.param,
      })
      // setTimeout(this.props.form.resetFields(),3000)
      // this.props.form.resetFields();
    });


  }

  showModal = () => {
    if(this.state.item_id === ''){
      message.info("请选择要关联的工位/办公室");
      return;
    }

     this.setState({
       modalVisible: true,
     });
   }

  hideOkModel = (assetid) => {
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
      type: 'CommonPage/infraUpdateAsset',
      data2,
      paramPage: this.props.location.query.param,
    })
    this.setState({
      modalVisible: false,
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
      }
    })
  }

  ceateRes = () => {

    const { validateFieldsAndScroll } = this.props.form;
    const {dispatch} = this.props;
    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      var temp = values.type_id[0]?values.type_id[0].split('_')[0]:'';

      if(values.assetName === null || values.assetName == undefined || values.assetName == ''){
        message.info("请输入正确的资产名称！");
        return;
      }
      if(values.assetName.replace(/\s+/g,'') == '' || values.assetName.replace(/\s+/g,'') == null || values.assetName.replace(/\s+/g,'') == undefined){
        message.info("请输入正确的资产名称！");
        return;
      }
      if(values.type_id[0] == null){
        message.info("请选择级别分类")
      }

      this.props.form.validateFields();
      // okClick(assetid,values);
      var data3 = {
        asset_number: values.assetName,
        asset_name: values.assetName,
        charger_id: values.chargername.userid?values.chargername.userid:'',
        charger_name: values.chargername.username?values.chargername.username:'',
        charger_dept_id: values.dept.userid?values.dept.userid:'',
        charger_dept_name: values.dept.username?values.dept.username:'',
        user_dept_id: values.userdept.userid?values.userdept.userid:'',
        user_dept_name: values.userdept.username?values.userdept.username:'',
        floor: values.floor,
        location: values.region,
        station: values.seat,
        can_use: (this.state.occupyState == '不可用')?'0':'1',
        assetuser_type:values.username.userid?'内部人员':'',
        assetuser_info:{
          assetuser_id:values.username.userid,
          assetuser_name:values.username.username,
          assetuser_type:values.username.userid?'内部人员':'',
          assetuser_term:this.state.occupyState,
        },
        type_id1:temp,
        type_id2:values.type_id[0],
      }
      if(this.state.occupyState == '长期' || this.state.occupyState == '临时'){
        if(values.username.userid == undefined || values.username.userid == null || values.username.userid == ''){
          message.info("请选择使用人");
          return;
        }
      }

      dispatch({
        type:'CommonPage/assetsAddV2',
        data3,
        item_id: this.state.item_id,
        paramPage: this.props.location.query.param,
      })
      this.props.form.resetFields();
    });
  }

  changeUser = (param)=> {
    let postData = {
      arg_user_id: param.userid,
      arg_user_name: param.username,
    };
    let oudata=request('/assetsmanageservice/assetsmanage/assets/usedAssetsInfoQuery',postData);
    oudata.then((data)=>{
      var userEquip = data.DataRows;
      var usetemp = '';
      if(userEquip){{
        for(let i = 0; i < userEquip.length; i++){
          usetemp += userEquip[i].asset_name + '，';
        }
      }}
      this.setState({
        ownEquipment: usetemp?usetemp.substring(0,usetemp.length-1):'',
      })
    })
  }

  showHistory = () => {
   this.setState({
     historyVisible: true,
   });
   // this.state.asset_id
   let postData = {
     arg_assets_id: this.state.asset_id,
   };
   let oudata=request('/assetsmanageservice/assetsmanage/assets/assetsUserHistory',postData);
   oudata.then((data)=>{
     if(data.RetCode == '1'){
       this.setState({
         historyList:data.DataRows
       })
     }
   })
 };
  onClose = () => {
   this.setState({
     historyVisible: false,
   });
 };

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
     type:'CommonPage/searchPos',
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
         type:'commonPageOne/infraQuery',
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
   var data2 = {
     arg_infra_id: this.state.item_id,
     arg_asset_id: '', // null或空字符串为取消关联
   }

   dispatch({
     type: 'CommonPage/cancelOfficeRes',
     data2,
     paramPage: this.props.location.query.param,
   })
 }
  changeDept = (checkedList) => {
    this.setState({initDept:checkedList})
  }

  changeDisplay = (param) => {
    this.setState({displayWay: param})
  }

  testtest1 = (childItem) => {
    return(
      <Tooltip title = {(childItem.refer_assets_info==null)?'':childItem.refer_assets_info.assetuser_name}><div className='test' id={childItem.id} style = {childItem.shape_info.position}
      onClick = {()=>this.testClick(childItem.refer_assets_info,childItem.id,childItem.infra_type_id,childItem.can_manage)}>
      {<img src = {childItem.shape_info.img_src_placeholder} width = '100%' height = '100%'/>}</div></Tooltip>
    )
  }

  testtest2 = (childItem) => {
    return(
      <div className='test' id={childItem.id} style = {childItem.shape_info.position}
        onClick = {()=>this.testClick(childItem.refer_assets_info,childItem.id,childItem.infra_type_id,childItem.can_manage)}>
      {<img src = {childItem.shape_info.img_src_placeholder} width = '100%' height = '100%'/>}</div>
    )
  }

  testtest4 = (childItem) => {
    return(
      <Tooltip title = {(childItem.refer_assets_info==null)?'':childItem.refer_assets_info.assetuser_name}><div className='test' id={childItem.id} style = {childItem.shape_info.position}
      onClick = {()=>this.testClick(childItem.refer_assets_info,childItem.id,childItem.infra_type_id,childItem.can_manage)}>
      {<img src = {(childItem.refer_assets_info==null)?
        childItem.shape_info.img_src:(childItem.refer_assets_info.can_use=='0'?childItem.shape_info.img_src3:(childItem.refer_assets_info.useinfo_type=='长期'?
        childItem.shape_info.img_src1:(childItem.refer_assets_info.useinfo_type=='临时'?
        childItem.shape_info.img_src2:childItem.shape_info.img_src)))}
        width = '100%' height = '100%'/>}</div></Tooltip>
    )
  }

  testtest5 = (childItem,testDataRows) => {
    return(
      <Tooltip title = {(childItem.refer_assets_info==null)?'':childItem.refer_assets_info.assetuser_name}><div className='test' id={childItem.id} style = {childItem.shape_info.position}
        onClick = {()=>this.testClick(childItem.refer_assets_info,childItem.id,childItem.infra_type_id,childItem.can_manage)}>

          {<img src = {(childItem.refer_assets_info==null)?
             childItem.shape_info.img_src_placeholder:
             (childItem.refer_assets_info.user_dept_id==(testDataRows.station_user_depts[0]?testDataRows.station_user_depts[0].dept_id:'')?childItem.shape_info.img_src_color_1:
             (childItem.refer_assets_info.user_dept_id==(testDataRows.station_user_depts[1]?testDataRows.station_user_depts[1].dept_id:'')?childItem.shape_info.img_src_color_2:
             (childItem.refer_assets_info.user_dept_id==(testDataRows.station_user_depts[2]?testDataRows.station_user_depts[2].dept_id:'')?childItem.shape_info.img_src_color_3:
             (childItem.refer_assets_info.user_dept_id==(testDataRows.station_user_depts[3]?testDataRows.station_user_depts[3].dept_id:'')?childItem.shape_info.img_src_color_4:
               childItem.shape_info.img_src_placeholder))))}
            width = '100%' height = '100%'/>}
        </div>
     </Tooltip>
    )
  }

  render(){
    const { getFieldDecorator} = this.props.form;
    const {infraContent} = this.props;
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

          if(childItem.refer_assets_info){
            if(this.state.initDept.indexOf(childItem.refer_assets_info.user_dept_id) !== -1){
              const constItem = this.testtest4(childItem);
              res.push(constItem);
            }

            else if(childItem.refer_assets_info.user_dept_id == null || childItem.refer_assets_info.user_dept_id == undefined || childItem.refer_assets_info.user_dept_id == ''){ //关联了资产，但是使用部门为空的
              const constItem = this.testtest1(childItem);
              res.push(constItem);
            }
          }else { //没有关联资产的
            const constItem = this.testtest2(childItem);
            res.push(constItem);
          }
        }
      }

      return res;
    }

    var renderNum = () => {
      let res = [];
      if(testDataRows.station_user_depts){
        for(let i = 0; i < testDataRows.station_user_depts.length; i++){
          res.push(
            <div style={{fontSize:15,paddingBottom:10}}>{testDataRows.station_user_depts[i].dept_name} :
            长期使用 <font className = {styles.fontStyle}>{testDataRows.station_user_depts[i].statistics_info_station.longterm_station_count}</font> 个,
            临时使用 <font className = {styles.fontStyle}>{testDataRows.station_user_depts[i].statistics_info_station.temporary_station_count}</font> 个,
            闲置 <font className = {styles.fontStyle}>{testDataRows.station_user_depts[i].statistics_info_station.free_station_count}</font> 个,
            不可用 <font className = {styles.fontStyle}>{testDataRows.station_user_depts[i].statistics_info_station.cant_use_station_count}</font> 个,
            共 <font className = {styles.fontStyle}>{testDataRows.station_user_depts[i].statistics_info_station.all_station_count}</font> 个,
            </div>
          )
        }
      }

      return res;
    }

    var renderDept = () => {
      let res = [];
      if(testDataRows.station_user_depts){
        for(let i = 0; i < testDataRows.station_user_depts.length; i++){
          res.push(
                <font><Tag  color= {this.state.color_img_dept[i]} style = {{height:15}}></Tag>{testDataRows.station_user_depts[i].dept_name}&nbsp;&nbsp;</font>
          )
        }
      }
      return res;
    }

    var renderDataDept = () => {
      let res = [];
      if(testDataRows.children){
        for(let i = 0; i < testDataRows.children.length;i++){
          const childItem = testDataRows.children[i];
          var tempStyle = childItem.shape_info.position;
          if(this.props.location.query.id === testDataRows.children[i].id){
              tempStyle.boxShadow = '0 0 15px rgb(231, 22, 26)';
          }
          if(childItem.refer_assets_info){
            if(this.state.initDept.indexOf(childItem.refer_assets_info.user_dept_id) !== -1){
              const constItem = this.testtest5(childItem,testDataRows);
              res.push(constItem);
            }else if(childItem.refer_assets_info.user_dept_id == null || childItem.refer_assets_info.user_dept_id == undefined || childItem.refer_assets_info.user_dept_id == ''){ //关联了资产，但是使用部门为空的
              const constItem = this.testtest1(childItem);
              res.push(constItem);
            }
          }
          else{
            const constItem = this.testtest1(childItem);
            res.push(constItem);
          }

        }
      }

      return res;
    }

    const children = [];

    if(this.props.deptOption){
      for(let i = 0; i < this.props.deptOption.length; i++){
        children.push(<Option key={this.props.deptOption[i].value}>{(this.props.deptOption[i].label.indexOf('-')==-1)?this.props.deptOption[i].label:this.props.deptOption[i].label.split('-')[1]}</Option>)
        // children.push(<Option key={this.props.deptOption[i].value}>{this.props.deptOption[i].label}</Option>)
      }
    }

    if(infraContent){
      return(
        <Spin tip="加载中..." spinning={this.props.loading}>
          <div style = {testDataRows.shape_container.shape_property}>
            <h2 style = {{textAlign:'center'}}>{infraContent[0].infra_name}</h2>
            <Select
             mode="multiple"
             style={{ width: '40%',marginLeft:'4%',marginTop:'1%' }}
             placeholder="请选择查看的部门"
             value={this.state.initDept}
             onChange={this.changeDept}
           >
             {children}
           </Select>

            {this.state.displayWay === 'usestate' ?
              <Tooltip title="部门状态显示">
                <Icon type = 'qiapian' style={{float:'right',marginRight:20,fontSize:20,cursor:'pointer',}} onClick = {()=>this.changeDisplay('deptstate')}/>
              </Tooltip>
              :
              <Tooltip title="工位状态显示">
                <Icon type = 'liebiao' style={{float:'right',marginRight:20,fontSize:20,cursor:'pointer',}} onClick = {()=>this.changeDisplay('usestate')}/>
              </Tooltip>
            }
            <Search
             placeholder="请输入使用人姓名搜索"
             onSearch={value => this.searchPos(value)}
             style={{width:'20%',marginTop:'1%',marginLeft:'67%'}}
             maxLength = {10}
             enterButton
             />
            <Button type = 'primary' style = {{marginLeft:'95%',position:"relative",zIndex:1}} onClick = {this.goBack}>返回</Button>
            <div style = {testDataRows.shape_container.north_poperty}><img src = {northPic} height = '70px'/></div>
            {this.state.displayWay === 'usestate'?
              <div>
                  <div style = {{textAlign:'center'}}>
                      <Tag  color={this.state.color_img_src1} style = {{height:15}}></Tag>长期使用&nbsp;&nbsp;
                      <Tag  color= {this.state.color_img_src2} style = {{height:15}}></Tag>临时使用&nbsp;&nbsp;
                      <Tag  color= {this.state.color_img_src} style = {{height:15}}></Tag>闲置资源&nbsp;&nbsp;
                      <Tag  color={this.state.color_img_src3} style = {{height:15}}></Tag>不可用资源
                  </div>
                  <div style = {{width:document.body.clientWidth*0.8, height:document.body.clientWidth*0.8*0.6,position:'relative',top:"0%"}}>
                    {renderData()}
                    <div style = {{width: "2px",height: "65%",background: "#eee",top: "1%",position: "absolute",left: "57%"}}></div>
                    <div style = {{position:'absolute',top:'76%',left:'4%',width:'50%'}}>
                      {renderNum()}
                    </div>
                  </div>
              </div>
              :
              <div>
                <div style = {{textAlign:'center'}}>
                    {renderDept()}
                </div>
                <div style = {{width:document.body.clientWidth*0.8, height:document.body.clientWidth*0.8*0.6,position:'relative',top:"0%"}}>
                  {renderDataDept()}
                  <div style = {{width: "2px",height: "65%",background: "#eee",top: "1%",position: "absolute",left: "57%"}}></div>
                  <div style = {{position:'absolute',top:'76%',left:'4%'}}>
                    {renderNum()}
                  </div>
                </div>
              </div>
            }


            <div>
              <div className = {styles.content} style={{width:document.body.clientWidth*0.4}}>
                 <FormItem {...formItemLayout} label = '资产名称'>
                     {getFieldDecorator('assetName',{initialValue: this.state.assetName})(
                       (this.state.canManage =='1')?
                         <Input  maxLength={16}/>:
                         <Input disabled  maxLength={16}/>
                     )}
                 </FormItem>
                 <FormItem {...formItemLayout} label = '级别分类'>
                     {getFieldDecorator('type_id',{initialValue:[this.state.levelType],rules:[{required: true}]})(
                       (this.state.canManage =='1' && this.state.typeLevelEdit)?
                         <Cascader style = {{width:'100%'}} placeholder='请选择' options={this.state.myLocationOption} />:
                         <Cascader disabled style = {{width:'100%'}} placeholder='请选择' options={this.state.myLocationOption} />
                     )}
                 </FormItem>
                 <FormItem {...formItemLayout} label = '所属楼/层'>
                  {getFieldDecorator('floor',{initialValue: this.state.floor})(
                    (this.state.canManage =='1')?
                      <Input  maxLength={16}/>:
                      <Input disabled maxLength={16}/>
                  )}
                 </FormItem>
                 <FormItem {...formItemLayout} label = '所属区域'>
                  {getFieldDecorator('region',{initialValue: this.state.region})(
                    (this.state.canManage =='1')?
                    <Input  maxLength={16}/>:
                    <Input disabled maxLength={16}/>
                  )}
                 </FormItem>
                 <FormItem {...formItemLayout} label = '所属工位'>
                  {getFieldDecorator('seat',{initialValue: this.state.seat})(
                    (this.state.canManage =='1')?
                    <Input  maxLength={16}/>:
                    <Input disabled  maxLength={16}/>
                  )}
                 </FormItem>
                 <FormItem {...formItemLayout} label = '归属部门'>
                  {getFieldDecorator('dept',{initialValue:this.state.dept})(
                    <DeptList ifdisabled={(this.state.canManage =='1')} list={this.state.userList} style = {{width:'100%'}} onChange={this.checkerChange} initialData = {this.state.dept}/>
                  )}
                 </FormItem>

                 <FormItem {...formItemLayout} label = '使用部门'>
                  {getFieldDecorator('userdept',{initialValue:this.state.userdept})(
                    <DeptList ifdisabled={(this.state.canManageProp!== null || this.state.canManage=='1')} list={this.state.userList} style = {{width:'100%'}} onChange={this.checkerChange} initialData = {this.state.userdept}/>
                  )}
                 </FormItem>

                 <FormItem {...formItemLayout} label = '负责人'>
                  {getFieldDecorator('chargername',{initialValue: this.state.chargername})(
                    <StaffList ifdisabled={(this.state.canManageProp!== null || this.state.canManage=='1')} list={this.state.userList} style = {{width:'100%'}} onChange={this.checkerChange}  initialData = {this.state.chargername}/>
                  )}
                 </FormItem>

                 <FormItem {...formItemLayout} label = '使用人'>
                  {getFieldDecorator('username',{initialValue: this.state.username})(
                    <UsersList ifdisabled={(this.state.canManageProp!== null || this.state.canManage=='1')} list={this.state.userList} onChange={this.changeUser} style = {{width:'100%'}}  initialData={this.state.username}
                    occupyState={this.state.occupyState}/>)}
                 </FormItem>

                <div style = {{marginTop:30,marginBottom:30,marginLeft:90}}>
                  <RadioGroup onChange={this.onChangeOccupy} value={this.state.occupyState} >
                    <Radio value='长期'>长期占用</Radio>
                    <Radio value='临时'>机动备用</Radio>
                    <Radio value='闲置'>闲置</Radio>
  		              <Radio value='不可用'>不可用</Radio>
                  </RadioGroup>
                </div>

               <FormItem {...formItemLayout} label = '名下办公设备'>
            	      <Tooltip title = {this.state.ownEquipment}>
            	      {
            	      (this.state.ownEquipment.length>50)?
            	      `${this.state.ownEquipment.substring(0,49)} 。。。。`
            	      :
            	      this.state.ownEquipment
            	      }
            	      </Tooltip>
          	    </FormItem>


                   {
                     (this.state.alreaySelected === 1)?
                       (this.state.canManage === 1)?
                           (!this.state.editButton)?
                           <div style = {{marginTop:'3%'}}>
                              <Button type = 'primary' style = {{marginLeft:'10%'}} onClick = {this.showModal}>关联已有资源</Button>
                              <Button type = 'primary' style = {{marginLeft:'3%'}} onClick = {this.ceateRes}>创建并关联</Button>
                           </div>
                          :
                          <div style = {{marginTop:'3%'}}>
                            <Button type = 'primary' style = {{marginLeft:'10%'}} onClick = {this.editOfficeRes}>修改</Button>
                            <Button type = 'primary' style = {{marginLeft:'3%'}} onClick = {this.showHistory}>查询使用历史</Button>
                            <Button type = 'primary' style = {{marginLeft:'3%'}} onClick = {this.cancelOfficeRes}>取消关联</Button>
                          </div>
                      :
                      (this.state.canManageProp !== null)?
                      <div style = {{marginTop:'3%'}}>
                        <Button type = 'primary' style = {{marginLeft:'10%'}} onClick = {this.editOfficeRes}>修改</Button>
                        <Button type = 'primary' style = {{marginLeft:'10%'}} onClick = {this.showHistory}>查询使用历史</Button>
                      </div>
                      :
                      <div style = {{marginTop:'3%'}}>
                        <Button type = 'primary' style = {{marginLeft:'10%'}} onClick = {this.showHistory}>查询使用历史</Button>
                      </div>
                     :
                     null
                   }


               </div>
             </div>

             <ConnectModal  okClick = {this.hideOkModel} cancelClick = {this.hideCancelModel} infratypeId = {infratypeId} infra_refer_location={infra_refer_location} resList = {this.state.resList} findRes = {this.findRes} findResFlag = {this.state.findResFlag} visible={this.state.modalVisible}/>


             <HistoryModal visible={this.state.historyVisible} historyList={this.state.historyList} onClose={this.onClose} />

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
  const {query,infraContent,equipContent,deptOption} = state.CommonPage;  //lumj
  return {
    loading: state.loading.models.CommonPage,
    query,
    infraContent,
    equipContent,
    deptOption,
  };
}

const WrappedHorizontalLoginForm = Form.create()(CommonPage);
export default connect(mapStateToProps) (WrappedHorizontalLoginForm);
