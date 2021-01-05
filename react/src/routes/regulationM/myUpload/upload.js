/**
  * 作者： 卢美娟
  * 创建日期： 2018-07-05
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 规章制度-上传
  */

import React from 'react';
import { connect } from 'dva';
import { Table,  Menu, Icon, DatePicker,Modal,Popconfirm,message,Tooltip ,Input,Button,Checkbox,Radio,TreeSelect,Select} from 'antd';
const { Option, OptGroup } = Select;
import moment from 'moment';;
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import styles from './../ruleRegulation/regulationM.less';
import FileUpload from './fileUpdata.js';
import AttachmentUpdata from './attachmentUpdata.js';
import DeptSelectShow from '../../../components/commonApp/deptSelectShow.js';
import AssignDept from '../../../components/commonApp/assignDept.js';
// import AssignDocType from '../../../components/commonApp/assignDocType.js';
import {getUuid} from '../../../components/commonApp/commonAppConst.js';
import request from '../../../utils/request';
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY/MM/DD';
import {corp_id, agent_id} from '../const.js';

class Upload extends React.Component{
  state={
    deptVisible:false,
    docTypeVisible:false, //lumj
    docTypeShow:'', //规章制度类别(一级类别)
    docLevelShow:'',//规章制度级别
    docSystemsShow:'', //体系类别
    docQualityShow:'',//规章制度性质
    docPostApproval:'',//发文文号
    issuedTime:'',//印发时间
    keyword:'',//关键字
    tempkeyword:'',
    abstract:'',//摘要
    deptSelectShowData:{},
    checkDeptList:[],
    titileFlag: 0, //0-自填标题；1-使用正文作为标题
    title:'88', //标题
    editflag: 0, // 0-新增；1-编辑
    samePageSaveFlag:0,
    treeValue: '',
    seceret: '-1', //加密
    loading:false,
    loading2:false,
  }

  // 确定上传按钮
  handleOk = (flag) => {
    //console.log(this.state.docSystemsShow)
    const {dispatch,arg_id}=this.props;

    var uploadList=this.refs.fileUploadList.getData(); //正文list

    var uploadAttachList=this.refs.attachmentUploadList.getData(); //附件List

    const {checkDeptList}=this.state;

    if(uploadList.length==0){
      message.info('请选择上传正文文件！');
      return;
    }
    if(this.state.docTypeShow == '' || this.state.docTypeShow == undefined || this.state.docTypeShow ==null){
      message.info("请选择规章制度类别！");
      return;
    }
    if(this.state.docSystemsShow == ''){
      message.info("请选择规章制度体系！");
      return;
    }
    if(this.state.docLevelShow == ''){
      message.info("请选择规章制度级别！");
      return;
    }
    if(this.state.docQualityShow == ''){
      message.info("请选择规章制度性质！");
      return;
    }
    if(this.state.seceret === '-1'){
      message.info("请选择密级！");
      return;
    }
    if(flag == '1'){
      if(this.state.keyword.match(/^\s+$/)){
        console.log("all space or \\n");
        message.info("请输入关键字！");
        return;
      }
      if(this.state.keyword.match(/^[ ]+$/)){
        console.log("all space")
        message.info("请输入关键字！");
        return;
      }
      if(this.state.keyword.match(/^[ ]*$/)){
        console.log("all space or empty")
        message.info("请输入关键字！");
        return;
      }
      if(this.state.keyword.match(/^\s*$/)){
        console.log("all space or \\n or empty")
        message.info("请输入关键字！");
        return;
      }
    }

    var checkDeptId = [];
    var deptID2ouID = [];
    var topid = 'e65bfe1c179e11e6880d008cfa0427c4';
    var leaveid = '';
    for(var r=0;r<checkDeptList.length;r++){
      if(checkDeptList[r].dept_name_p == undefined){
        topid = checkDeptList[r].dept_id; //非叶子节点（总结点）
      }
      else if(checkDeptList[r].dept_name.indexOf('-') == -1){
        checkDeptId.push(checkDeptList[r].dept_id);
        topid = checkDeptId.join(','); //非叶子节点（一级节点）
      }
      else{
        deptID2ouID.push(checkDeptList[r].dept_id);
        leaveid = deptID2ouID.join(','); //叶子节点
        topid = '';
      }
    }

    var attachments = [];
    if(uploadAttachList){
      for(var i =0;i<uploadAttachList.length;i++){
        var item = {}
        item.filename = uploadAttachList[i].OriginalFileName,
        item.fileid = uploadAttachList[i].FileId,
        attachments.push(item)
      }
    }

    if(this.state.docTypeShow){
      var categoryid1;
      var categoryid2;
      if(this.state.docTypeShow.indexOf('-') !== '-1'){
         categoryid1 = this.state.docTypeShow.split('-')[0];
         categoryid2 = this.state.docTypeShow.split('-')[1];
      }else{
         categoryid1 = this.state.docTypeShow;
         categoryid2 = '';
      }
    }
    var data = {};

    var title = '';
    if(uploadList[0].OriginalFileName){
      var index = uploadList[0].OriginalFileName.lastIndexOf('.');
      title = uploadList[0].OriginalFileName.substring(0, index);
    }

    if(this.state.samePageSaveFlag == '1'){  //在upload页面，点击保存之后会返回arg_id，做了修改，再点击保存按钮时
       data = {
        arg_id:arg_id,
        arg_title: title,
        arg_sys_id: this.state.docSystemsShow,
        arg_level_id: this.state.docLevelShow,
        arg_kind_id: this.state.docQualityShow,
        arg_doc_num: this.state.docPostApproval,
        arg_is_secret: this.state.seceret,
        arg_category1_id: categoryid1,
        arg_category2_id: categoryid2,
        arg_print_time: this.state.issuedTime,
        arg_summary: this.state.abstract,
        arg_keywords: this.state.tempkeyword,
        arg_mainfile_name: uploadList[0].OriginalFileName,
        arg_mainfile_id: uploadList[0].FileId,
        arg_attachments: JSON.stringify(attachments),
        arg_dept_id: leaveid,
        arg_ou_id2: topid,
      }
    }
    else if(this.props.location.query.arg_id){ //从我的上传的编辑，以及我的退回的重新编辑
       data = {
        arg_id:this.props.location.query.arg_id,
        arg_title: title,
        arg_sys_id: this.state.docSystemsShow,
        arg_level_id: this.state.docLevelShow,
        arg_kind_id: this.state.docQualityShow,
        arg_doc_num: this.state.docPostApproval,
        arg_is_secret: this.state.seceret,
        arg_category1_id: categoryid1,
        arg_category2_id: categoryid2,
        arg_print_time: this.state.issuedTime,
        arg_summary: this.state.abstract,
        arg_keywords: this.state.tempkeyword,
        arg_mainfile_name: uploadList[0].OriginalFileName,
        arg_mainfile_id: uploadList[0].FileId,
        arg_attachments: JSON.stringify(attachments),
        arg_dept_id: leaveid,
        arg_ou_id2: topid,
      }
    }
    else {
       data = {
        // arg_title: this.state.title,
        arg_title: title,
        arg_sys_id: this.state.docSystemsShow,
        arg_level_id: this.state.docLevelShow,
        arg_kind_id: this.state.docQualityShow,
        arg_doc_num: this.state.docPostApproval,
        arg_is_secret: this.state.seceret,
        arg_category1_id: categoryid1,
        arg_category2_id: categoryid2,
        arg_print_time: this.state.issuedTime,
        arg_summary: this.state.abstract,
        arg_keywords: this.state.tempkeyword,
        arg_mainfile_name: uploadList[0].OriginalFileName,
        arg_mainfile_id: uploadList[0].FileId,
        arg_attachments: JSON.stringify(attachments),
        arg_dept_id: leaveid,
        arg_ou_id2: topid,
      }
    }

    if(flag === '0'){ //保存
      this.setState({
        samePageSaveFlag: 1, //同个页面，保存状态
      },()=>{
        dispatch({
          type:'upload/saveUploadFile',
          data,
        })
      })
    }
    else if(flag === '1'){ //提交审核
      this.setState({
        loading2:true,
      })
      dispatch({
        type:'upload/submitUploadFile',
        data,
        samePageSaveFlag: this.state.samePageSaveFlag,
      })
    }

  }

  // 重新发布规章制度送审核
  reHandleOk = () => {
    const {dispatch}=this.props;
    var uploadList=this.refs.fileUploadList.getData(); //正文list

    var uploadAttachList=this.refs.attachmentUploadList.getData(); //附件List

    const {checkDeptList}=this.state;


    if(uploadList.length==0){
      message.info('请选择上传正文文件！');
      return;
    }
    if(this.state.docTypeShow == '' || this.state.docTypeShow == undefined || this.state.docTypeShow ==null){
      message.info("请选择规章制度类别！");
      return;
    }
    if(this.state.docSystemsShow == ''){
      message.info("请选择规章制度体系！");
      return;
    }
    if(this.state.docLevelShow == ''){
      message.info("请选择规章制度级别！");
      return;
    }
    if(this.state.docQualityShow == ''){
      message.info("请选择规章制度性质！");
      return;
    }
    if(this.state.tempkeyword == ''){
      message.info("请输入关键字！");
      return;
    }
    if(this.state.seceret == '-1'){
      message.info("请选择密级！");
      return;
    }

    var checkDeptId = [];
    var deptID2ouID = [];
    var topid = 'e65bfe1c179e11e6880d008cfa0427c4';
    var leaveid = '';
    for(var r=0;r<checkDeptList.length;r++){
      if(checkDeptList[r].dept_name_p == undefined){
        topid = checkDeptList[r].dept_id; //非叶子节点（总结点）
      }
      else if(checkDeptList[r].dept_name.indexOf('-') == -1){
        checkDeptId.push(checkDeptList[r].dept_id);
        topid = checkDeptId.join(','); //非叶子节点（一级节点）
      }
      else{
        deptID2ouID.push(checkDeptList[r].dept_id);
        leaveid = deptID2ouID.join(','); //叶子节点
        topid = '';
      }
    }

    var attachments = [];
    if(uploadAttachList){
      for(var i =0;i<uploadAttachList.length;i++){
        var item = {}
        item.filename = uploadAttachList[i].OriginalFileName,
        item.fileid = uploadAttachList[i].FileId,
        attachments.push(item)
      }
    }


    if(this.state.docTypeShow){
      var categoryid1;
      var categoryid2;
      if(this.state.docTypeShow.indexOf('-') !== '-1'){
         categoryid1 = this.state.docTypeShow.split('-')[0];
         categoryid2 = this.state.docTypeShow.split('-')[1];
      }else{
         categoryid1 = this.state.docTypeShow;
         categoryid2 = '';
      }
    }

    var title = '';
    if(uploadList[0].OriginalFileName){
      var index = uploadList[0].OriginalFileName.lastIndexOf('.');
      title = uploadList[0].OriginalFileName.substring(0, index);
    }
    var data = {
      arg_id:this.props.location.query.arg_id,
      arg_todo_item_id:this.props.location.query.arg_todo_item_id,
      arg_record_id:this.props.location.query.arg_record_id,
      arg_title: title,
      arg_systems_id: this.state.docSystemsShow,
      arg_level_id: this.state.docLevelShow,
      arg_kind_id: this.state.docQualityShow,
      arg_doc_num: this.state.docPostApproval,
      arg_is_secret: this.state.seceret,
      arg_category1_id: categoryid1,
      arg_category2_id: categoryid2,
      arg_print_time: this.state.issuedTime,
      arg_summary: this.state.abstract,
      arg_keywords: this.state.tempkeyword,
      arg_mainfile_name: uploadList[0].OriginalFileName,
      arg_mainfile_id: uploadList[0].FileId,
      arg_attachments: JSON.stringify(attachments),
      arg_dept_id: leaveid,
      arg_ou_id2: topid,
      arg_corp_id: corp_id,
      arg_agent_id: agent_id,
    }

    this.setState({
      loading: true,
    })

    dispatch({
      type:'upload/publishRegulationResendReview',
      data,
    })
  }

  // 选择部门模态框显示
  showDeptModel=()=>{
    this.setState({deptVisible:true})
  }

  // 选择部门模态框关闭
  hideDeptModel=(flag)=>{
    if(flag=='confirm'){
      var deptSelectData=this.refs.assignDeptComp.getData();
      var deptSelectShow={};
      for(var i=0;i<deptSelectData.length;i++){
        if(deptSelectData[i].dept_name.indexOf('-')>0){
          var key=deptSelectData[i].dept_name.split('-')[0]=='联通软件研究院'?'联通软件研究院本部':deptSelectData[i].dept_name.split('-')[0]
          if(deptSelectShow[key]==undefined){
              deptSelectShow[key]=[]
          }
          deptSelectShow[key].push(deptSelectData[i].dept_name)
        }else{
          deptSelectShow[deptSelectData[i].dept_name]=[];
        }
      }

      this.setState({deptSelectShowData:deptSelectShow,checkDeptList:deptSelectData})
    }

    this.setState({deptVisible:false})

  }

  onChangeType = (e) => {
    // alert(JSON.stringify(e.target))
    this.setState({
      docTypeShow: e.target.value,
    });
  }
  onChangeTree = (value) => {
    this.setState({docTypeShow: value})
  }
  onChangeSystems = (e) => {
    console.log(e.target.value)
    this.setState({
      docSystemsShow: e.target.value,
    })
  }

  onChangeLevel = (e) => {
    this.setState({
      docLevelShow: e.target.value,
    })
  }

  onChangeQuality = (e) => {
    this.setState({
      docQualityShow: e.target.value,
    })
  }

  onChangeKeyword = (e) => {
    var ori = e.target.value;
    var oritemp = ori.split(' ');
    var destemp = [];
    for(let i = 0; i < oritemp.length; i++){
      if(oritemp[i] !== ''){
        destemp.push(oritemp[i]);
      }
    }
    var des = destemp.join(',')
    this.setState({
      tempkeyword: des
    })
    this.setState({
      keyword: ori
    })
  }

  onChangeAbstract = (e) => {
    this.setState({
      abstract: e.target.value,
    })
  }

  goBack = () => {
    const {dispatch} = this.props;
    if(this.props.location.query.oriPage === 'myUpload'){
      dispatch(routerRedux.push({
        pathname:'/adminApp/regulationM/myUpload',
      }));
    }
    else if(this.props.location.query.oriPage === 'myBack'){
      dispatch(routerRedux.push({
        pathname:'/adminApp/regulationM/myBack',
      }));
    }
  }

  getDocPost = (e) => {
    this.setState({
      docPostApproval: e.target.value
    })
  }

  getTime = (date, dateString) => {
    this.setState({
      issuedTime: dateString
    })
  }

  onChangeSeceret = (e) => {
    this.setState({seceret: e.target.value})
  }

  componentWillMount = () => {
    // alert(this.props.location.query.arg_id)
    if(this.props.location.query.arg_id === undefined){
      this.setState({editflag: 0})
    }else{
      this.setState({editflag: 1})
    }
    const {dispatch} = this.props;
    var data = {
      arg_id: this.props.location.query.arg_id,
    }
    dispatch({
      type:'upload/myRegulationQuery',
      data,
    })
  }


  componentWillReceiveProps(newProps){
    if(newProps.itemDetailList){
      if(newProps.itemDetailList.length > 0){
        var kkword = newProps.itemDetailList[0].keywords;
        var kkwordString = '';
        if(kkword){
          for(let i = 0; i < kkword.length; i++){
            kkwordString = kkwordString + kkword[i] + ' '
          }
        }

        this.setState({
          docTypeShow: newProps.itemDetailList[0].category2_id ? newProps.itemDetailList[0].category1_id + '-'+newProps.itemDetailList[0].category2_id : newProps.itemDetailList[0].category1_id,
          docSystemsShow:newProps.itemDetailList[0].id,
          docLevelShow: newProps.itemDetailList[0].level_id,
          docQualityShow: newProps.itemDetailList[0].kind_id,
          docPostApproval: newProps.itemDetailList[0].doc_num,
          issuedTime: newProps.itemDetailList[0].print_time?newProps.itemDetailList[0].print_time:'',
          keyword: kkwordString,
          seceret: newProps.itemDetailList[0].is_secret,
          tempkeyword: kkwordString,
          abstract: newProps.itemDetailList[0].summary,
          // deptSelectShowData: {"联通软件研究院本部":["联通软件研究院本部-管理层",'联通软件研究院本部-财务部'],"哈尔滨软件研究院":["哈尔滨软件研究院-管理层"]},
        })

        if(this.state.editflag == 1){
          var defaultDept = JSON.parse(newProps.itemDetailList[0].visible_depts);
          if(defaultDept){
            let oudata=request('/microservice/userauth/deptquery',{argtenantid:10010});
            var ouDeptList={};
            oudata.then((data)=>{
               if(defaultDept&&defaultDept.length>0){
                 for(let d=0;d<defaultDept.length;d++){
                   //  获取全部
                  for(let i =0;i<data.DataRows.length;i++){
                    data.DataRows[i].checkedFlag=false;
                    if(data.DataRows[i].dept_name=='联通软件研究院'){
                      ouDeptList['all']=data.DataRows[i]
                      ouDeptList['all'].child=[];
                    }
                    for(let dd=0;dd<defaultDept.length;dd++){
                      if(defaultDept[dd]==data.DataRows[i].dept_id){
                        data.DataRows[i].checkedFlag=true;
                      }
                    }
                  }
                 }
               }else{
                 //  获取全部
                for(let i =0;i<data.DataRows.length;i++){
                  data.DataRows[i].checkedFlag=false;
                  if(data.DataRows[i].dept_name=='联通软件研究院'){
                    ouDeptList['all']=data.DataRows[i]
                    ouDeptList['all'].child=[];
                  }
                }
               }

             //  获取OU
              for(let r=0;r<data.DataRows.length;r++){
                 if(data.DataRows[r].dept_pid==ouDeptList['all'].dept_id){
                //  if(data.DataRows[r].deptname_p==ouDeptList['all'].dept_name){
                   if(ouDeptList['all'].checkedFlag==true){
                     data.DataRows[r].checkedFlag=true;
                   }
                   data.DataRows[r].child=[];
                   ouDeptList['all'].child.push(data.DataRows[r]);
                 }
              }
             //  获取三级部门
              for(let s=0;s<ouDeptList['all'].child.length;s++){
                 for(let t=0;t<data.DataRows.length;t++){
                   if(data.DataRows[t].deptname_p && (data.DataRows[t].dept_name).split('-').length==2){
                     var p_dept=(data.DataRows[t].deptname_p).split('-')[1];
                     if(p_dept==ouDeptList['all'].child[s].dept_name){
                       if(ouDeptList['all'].child[s].checkedFlag==true){
                         data.DataRows[t].checkedFlag=true;
                       }
                       ouDeptList['all'].child[s].child.push(data.DataRows[t]);
                     }
                   }
                 }
              }

              // alert(JSON.stringify(ouDeptList))
              var deptCheckedData=[];
              if(ouDeptList.all.checkedFlag==true){
                let allIdName={
                  dept_id:ouDeptList.all.dept_id,
                  dept_name:ouDeptList.all.dept_name,
                  dept_name_p:ouDeptList.all.deptname_p
                }
                deptCheckedData.push(allIdName)
              }else{
                for(var i=0;i<ouDeptList.all.child.length;i++){
                  if(ouDeptList.all.child[i].checkedFlag==true){
                    let OuIdName={
                      dept_id:ouDeptList.all.child[i].dept_id,
                      dept_name:ouDeptList.all.child[i].dept_name,
                      dept_name_p:ouDeptList.all.child[i].deptname_p
                    };
                    deptCheckedData.push(OuIdName)
                  }else{
                    for(var r=0;r<ouDeptList.all.child[i].child.length;r++){
                      if(ouDeptList.all.child[i].child[r].checkedFlag==true){
                        let deptIdName={
                          dept_id:ouDeptList.all.child[i].child[r].dept_id,
                          dept_name:ouDeptList.all.child[i].child[r].dept_name,
                          dept_name_p:ouDeptList.all.child[i].deptname_p
                        };
                        deptCheckedData.push(deptIdName)
                      }
                    }
                  }
                }
              }
              // alert(JSON.stringify(deptCheckedData) )

              var deptSelectShow={};
              if(deptCheckedData){
                for(var q=0;q<deptCheckedData.length;q++){
                  if(deptCheckedData[q].dept_name.indexOf('-')>0){
                    var key=deptCheckedData[q].dept_name.split('-')[0]=='联通软件研究院'?'联通软件研究院本部':deptCheckedData[q].dept_name.split('-')[0]
                    if(deptSelectShow[key]==undefined){
                        deptSelectShow[key]=[]
                    }
                    deptSelectShow[key].push(deptCheckedData[q].dept_name)
                  }else{
                    deptSelectShow[deptCheckedData[q].dept_name]=[];
                  }
                }
                // alert(JSON.stringify(deptSelectShow));
                // this.setState({deptSelectShowData:deptSelectShow})
                this.setState({deptSelectShowData:deptSelectShow,checkDeptList:deptCheckedData})
              }

            })

          }
        }
      }
    }



    if(this.props.location.query.arg_id === undefined && this.state.samePageSaveFlag !== 1 ){  //新增的时候置空
      this.setState({
        docTypeShow: '',
        docSystemsShow:'',
        docLevelShow: '',
        docQualityShow: '',
        docPostApproval: '',
        issuedTime: '',
        keyword: '',
        tempkeyword: '',
        seceret: '-1',
        abstract: '',
      })
    }
  }


  render(){

    const {checkDeptList}=this.state;
    const {categoryTypeList,systemsList,reguLevelList,reguKindList,itemDetailList} = this.props;
    console.log(systemsList)
    const treeData = [];
    if(categoryTypeList){
      for(let i = 0; i < categoryTypeList.length; i++){
        if(categoryTypeList[i].children){
          var subCategory = JSON.parse(categoryTypeList[i].children);
          var children = [];
          for(let j = 0; j < subCategory.length; j++){
            children.push({label: subCategory[j].categoryname, value: categoryTypeList[i].id + '-' + subCategory[j].id, key: categoryTypeList[i].id + '-' + subCategory[j].id})
          }
          treeData.push({label: categoryTypeList[i].categoryname, value: categoryTypeList[i].id, key: categoryTypeList[i].id, children:children})
        }
        else{
          treeData.push({label: categoryTypeList[i].categoryname, value: categoryTypeList[i].id, key: categoryTypeList[i].id})
        }

      }
    }

    if( this.props.location.query.arg_id !== undefined){
      var fileLists = [];
      var attachmentLists = [];
      if(itemDetailList){

        fileLists.push({name:itemDetailList[0].main_filename,uid:itemDetailList[0].main_fileid,FileId:itemDetailList[0].main_fileid,OriginalFileName:itemDetailList[0].main_filename}) //正文
        if(itemDetailList[0].attachments){ //附件
          for (var i = 0; i < itemDetailList[0].attachments.length; i++) {
            attachmentLists.push({name:itemDetailList[0].attachments[i].filename,uid:getUuid(32,62),FileId:itemDetailList[0].attachments[i].fileid,OriginalFileName:itemDetailList[0].attachments[i].filename})
          }
        }
      }


    }

    var deptSelectDefult=[];
    if(this.state.editflag == 0){ //新增
      for(var e=0;e<checkDeptList.length;e++){
        deptSelectDefult.push(checkDeptList[e].dept_id)
      }
     }
     else if(this.state.editflag == 1){ //编辑
      if(itemDetailList){
        var temp = JSON.parse(itemDetailList[0].visible_depts) ;
        deptSelectDefult = temp;
      }
    }
    var systemsRadio = () =>{
      var res = [];
      
      if(systemsList){
        for(let i = 0; i < systemsList.length; i++){
          res.push(<Radio style={{lineHeight:3}} value = {systemsList[i].id}>{systemsList[i].sysname}</Radio>)
        }
      }
      return res;
    }

    var levelRadio = () => {
      var res = [];
      if(reguLevelList){
        for(let i = 0; i < reguLevelList.length; i++){
          res.push(<Radio style={{lineHeight:3}} value = {reguLevelList[i].id}>{reguLevelList[i].levelname}</Radio>)
        }
      }
      return res;
    }

    var kindRadio = () => {
      var res = [];
      if(reguKindList){
        for(let i = 0; i < reguKindList.length; i++){
          res.push(<Radio style={{lineHeight:3}} value = {reguKindList[i].id}>{reguKindList[i].kindname}</Radio>)
        }
      }
      return res;
    }


    return(
       <div className = {styles.pageContainer}>
          <h2 style={{textAlign:'center'}}>上传规章制度</h2>
          <Button type = 'primary' style = {{marginLeft:'95%'}} onClick = {this.goBack}>返回</Button>
          <div style={{marginTop:'10px',background:'#e9f1f5',padding:'15px',borderRadius:'5px'}}>
            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>可见部门：</span>
            <DeptSelectShow data={this.state.deptSelectShowData} />
            <Button type="primary" onClick={this.showDeptModel}>+</Button>
          </div>

          <Modal visible={this.state.deptVisible} width='820px' key={getUuid(20,62)}  title="选择部门" onCancel={()=>this.hideDeptModel('cancel')}
              footer={[<Button key="back" size="large" onClick={()=>this.hideDeptModel('cancel')}>关闭</Button>,
              <Button key="submit" type="primary" size="large" onClick={()=>this.hideDeptModel('confirm')}>确定</Button>]}
            >
              <div>
                <AssignDept ref='assignDeptComp'  defaultDept={deptSelectDefult}/>
              </div>
          </Modal>

          <div style={{marginTop:'10px',background:'#e9f1f5',padding:'15px',borderRadius:'5px'}}>



            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>类别：<span style = {{color:'red'}}>*</span></span>
            <div style={{display:'inline-block',padding:'5px'}}>
              <TreeSelect
                style={{ width: 300 }}
                value={this.state.docTypeShow}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                placeholder="请选择类别"
                treeDefaultExpandAll
                onChange={this.onChangeTree}
              />
            </div>
            <div></div>
            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>体系：<span style = {{color:'red'}}>*</span></span>
            <div style={{display:'inline-block',padding:'5px'}}>
              <RadioGroup onChange = {this.onChangeSystems} value = {this.state.docSystemsShow}>
                {systemsRadio()}
              </RadioGroup>
            </div>
            <div></div>
            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>级别：<span style = {{color:'red'}}>*</span></span>
            <div style={{display:'inline-block',padding:'5px'}}>
              <RadioGroup onChange = {this.onChangeLevel} value = {this.state.docLevelShow}>
                {levelRadio()}
              </RadioGroup>
            </div>
            <div></div>
            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>性质：<span style = {{color:'red'}}>*</span></span>
            <div style={{display:'inline-block',padding:'5px'}}>
              <RadioGroup onChange = {this.onChangeQuality} value = {this.state.docQualityShow}>
                {kindRadio()}
              </RadioGroup>
            </div>

            <div></div>
            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>密级：<span style = {{color:'red'}}>*</span></span>
            <div style={{display:'inline-block',padding:'5px'}}>
              <RadioGroup onChange = {this.onChangeSeceret} value = {this.state.seceret}>
                <Radio style={{lineHeight:3}} disabled>国家秘密-绝密</Radio>
                <Radio style={{lineHeight:3}} disabled>国家秘密-机密</Radio>
                <Radio style={{lineHeight:3}} disabled>国家秘密-秘密</Radio>
                <Radio style={{lineHeight:3}} disabled>核心商业秘密</Radio>
                <Radio style={{lineHeight:3}} value = '1'>普通商业秘密</Radio>
                <Radio style={{lineHeight:3}} value = '0'>无</Radio>
              </RadioGroup>
            </div>
          </div>

          <div style={{marginTop:'10px',background:'#e9f1f5',padding:'15px',borderRadius:'5px'}}>
            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>发文文号：</span>
            <div style={{display:'inline-block',padding:'5px'}}>
              <Input value = {this.state.docPostApproval} onChange = {this.getDocPost} value = {this.state.docPostApproval}/>
            </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>印发时间：</span>
            <div style={{display:'inline-block',padding:'5px'}}>
              <DatePicker onChange = {this.getTime} value = {(this.state.issuedTime == '') ? '' : moment(this.state.issuedTime, dateFormat)} format={dateFormat}/>
            </div>
          </div>

          <div style={{marginTop:'15px',background:'#e9f1f5',padding:'15px',borderRadius:'5px'}}>
            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>选择文件：</span>
            <span style={{display:'inline-block',width:'90%',verticalAlign:'middle',background:'#fff',borderRadius:'3px'}}>
              <FileUpload ref = 'fileUploadList'  fileLists = {fileLists}/>
            </span>
            <div style = {{marginTop:10, marginLeft:'10%'}}>
              <span style={{display:'inline-block',width:'100%',verticalAlign:'middle',background:'#fff',borderRadius:'3px'}}>
                <AttachmentUpdata ref = 'attachmentUploadList'  fileLists = {attachmentLists}/>
              </span>
            </div>
          </div>

          <div style={{marginTop:'15px',background:'#e9f1f5',padding:'15px',borderRadius:'5px'}}>
            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>关键字(空格分隔)：<span style = {{color:'red'}}>*</span></span>
            <div style={{display:'inline-block',padding:'5px'}}>
              <Input type = "textarea" rows = {2} cols = {170} onChange = {this.onChangeKeyword} value = {this.state.keyword}/>
            </div>
            <div></div>
            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>摘要：</span>
            <div style={{display:'inline-block',padding:'5px'}}>
              <Input type = "textarea" rows = {4} cols = {170} onChange = {this.onChangeAbstract} value = {this.state.abstract}/>
            </div>
          </div>

          <div style = {{marginTop:20, marginLeft:'40%'}}>

              {(this.props.location.query.arg_todo_item_id !== undefined) ?
                <Button type="primary" size="large" style = {{marginLeft:30}} onClick={()=>this.reHandleOk()} loading = {this.state.loading}>提交审核</Button>
                :

                  (this.props.location.query.newflag === '0') ?
                  <div>
                    <Button type="primary" size="large" onClick={()=>this.handleOk('1')} style = {{marginLeft:30}} loading = {this.state.loading2}>提交审核</Button>
                  </div>
                  :
                  <div>
                    <Button type="primary" size="large" onClick={()=>this.handleOk('0')}>保存</Button>
                    <Button type="primary" size="large" onClick={()=>this.handleOk('1')} style = {{marginLeft:30}} loading = {this.state.loading2}>提交审核</Button>
                  </div>

              }

          </div>

       </div>
    );
  }

}

function mapStateToProps (state) {
  const {query,categoryTypeList,systemsList,reguLevelList,reguKindList,arg_id,itemDetailList} = state.upload;  //lumj
  return {
    loading: state.loading.models.upload,
    query,
    categoryTypeList,
    systemsList,
    reguLevelList,
    reguKindList,
    arg_id,
    itemDetailList,
  };
}


export default connect(mapStateToProps)(Upload);
