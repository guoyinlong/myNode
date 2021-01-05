/**
 *  作者: 卢美娟
 *  创建日期: 2018-04-10
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：实现二维码卡片展示功能
 */
import React from 'react';
import {Icon, Card,Row,Col,Button,Modal,Tooltip,Checkbox,Spin,message,Pagination} from 'antd';
import styles from './QRCode.less';
import CommonModalLiving from '../../components/QRSystem/commonModalLiving.js';
import CommonModalLocation from '../../components/QRSystem/commonModalLocation.js';
import CommonModalOffice from '../../components/QRSystem/commonModalOffice.js';
import { connect } from 'dva';
import Cookie from 'js-cookie';

class QRCard extends React.Component {

  state = {
    isEditVisible:false,
    tempRecord:[],
    checkAll:false,
    checkedList:[],
    indeterminate: true,
    flag:'',
    checked:[],
    currentpage: this.props.current,
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.temp != this.props.temp){
      this.setState({
        checked:[],
        checkedList:[],
      })
    }
  }

  editOR = (record) => {
    this.setState({
      flag:'edit2',
      isEditVisible:true,
      tempRecord:record,
    })
  }

  hideEditModel = (assetid,values) => {
    const {temp} = this.props;
     if(values.assetNum){
       var len = 0;
       for(var i = 0; i < values.assetNum.length; i++){
         var a = values.assetNum.charAt(i);
         if(a.match(/[^\x00-\xff]/ig) != null){
           len += 2;
         }else{
           len += 1;
         }
       }
       if(len > 32){
         message.info("资产编号过长，请修改！");
         return;
       }
     }
     var startTime = values.startTime.format('YYYY-MM-DD');
     const {dispatch} = this.props;
     this.setState({
       isEditVisible:false,
     })

     var data = {
       asset_name: values.assetName,
       activate_date: startTime,
       floor: values.floor,
       location: values.location,
       station: values.station,
       type_id1: temp,
       type_id2: values.type_id[0],
       creater_id: Cookie.get('staff_id'),
       creater_name: Cookie.get('username'),
       charger_id: values.charger_name == undefined ? '' : (values.charger_name.userid == '空'?'':values.charger_name.userid),
       charger_name: values.charger_name == undefined ? '' : (values.charger_name.username == '空'?'':values.charger_name.username),
       charger_dept_id: values.charger_dept_name == undefined ? '' : (values.charger_dept_name.userid == '空'?'':values.charger_dept_name.userid),
       charger_dept_name: values.charger_dept_name == undefined ? '' : (values.charger_dept_name.username == "---"?'':values.charger_dept_name.username),
       assetuser_id: values.assetuser_name == undefined ? '' : (values.assetuser_name.userid == '空'?'':values.assetuser_name.userid),
       assetuser_name: values.assetuser_name == undefined ? '' : (values.assetuser_name.username == '空'?'':values.assetuser_name.username),
       user_dept_id:values.user_dept_name == undefined ? '' : (values.user_dept_name.userid == '空'?'':values.user_dept_name.userid),
       user_dept_name: values.user_dept_name == undefined ? '' : (values.user_dept_name.username == "---"?'':values.user_dept_name.username),
     }
     if(temp == 'type1'){
       data.asset_number = values.assetNum;
       data.specification = values.normalizedForm;
       data.brand = values.brand;
       data.type_id3 = values.type_id[1];
     }else if(temp == 'type2'){
       data.asset_number = values.assetNum;
       data.specification = values.normalizedForm;
       data.type_id3 = values.type_id[1];
       data.brand = values.brand;
     }else{
       data.asset_number = values.assetName; //此处将资产编号和资产名称设为一样的，目的是为了让场地的资产名称不能重复
     }
     if(this.state.flag == 'add' ){
       //此处是单条新增，表格页面和卡片页面，都是这一个新增,
       dispatch({
         type:'qrCodeCommon/assetsAdd',
         data,
       })
       this.setState({
         currentpage: 1,
       })
       return 1;
     }else{
         //调用服务 此处是表格页面的编辑
         data.asset_id = assetid;
         dispatch({
           type:'qrCodeCommon/assetsUpdate',
           data,
           currentpage: this.state.currentpage,
         })
         return 1;
     }
  }

  hideCancelModel = () =>{
   this.setState({
     isEditVisible:false,
   })
 }

  disabledQE = (record) => {
   var {dispatch,temp}=this.props;
   var that = this;
   Modal.confirm({
     title: '您确定要废弃此条二维码信息?',
     onOk() {
       dispatch({
         type:'qrCodeCommon/assetsDisabled',
         assetsId: record.asset_id,
         assetsState: 0,
         param: temp,
         currentpage: that.state.currentpage,
       })
     },
     onCancel() {
       console.log('Cancel');
     },
   });
 }

  downloadQR = (record) => {
   const mode = 'stream';
   window.open('/assetsmanageservice/assetsmanage/assets/assetsQrcodeQuery?assetsId='+record.asset_id+'&mode='+mode)
 }

  onSingleChange = (index,assetid)=>(e)=>{
   let data=this.state.checked;
   data[index]=e.target.checked
   //console.log(data.some(i=>i))
   //console.log(data.every(i=>i))
   this.setState({
     checked:[...data],
     indeterminate:data.some(i=>i),
     checkAll:data.every(i=>i)&&data.length===this.props.carddata.length
   })
   var temparr = [];
   temparr = this.state.checkedList;
   if(temparr.indexOf(assetid) == -1){
     temparr.push(assetid);
     this.setState({
       checkedList: temparr
     })
   }else{
     var tempcheckedlist = [];
     if(this.state.checkedList != undefined){
       for(let i = 0; i < this.state.checkedList.length; i++){
         if(this.state.checkedList[i] != assetid){
           tempcheckedlist.push(this.state.checkedList[i])
         }
       }
     }
     this.setState({
       checkedList: tempcheckedlist,
     })
   }
  }

  onCheckAllChange = (e) => {
   let c=e.target.checked
   const{carddata}=this.props
   this.setState({
     checked:carddata.map(i=>c),
     checkAll:c,
     indeterminate:c
   })
   //将页面所有的assetsNum放入checkedList中
   var checkedtempList = [];
   if(this.props.carddata != undefined){
     for(let i = 0; i < this.props.carddata.length; i++){
       checkedtempList.push(this.props.carddata[i].asset_id);
     }
   }

   this.setState({
     checkedList: e.target.checked ? checkedtempList : [],
     indeterminate: false,
     checkAll: e.target.checked,
   })
  }

  batchDownload = () =>{
     if(this.state.checkedList.length == 0){
       message.info("目前尚无内容，无法批量下载！");
       return;
     }
     var downloadList = JSON.stringify(this.state.checkedList);
     const mode = 'stream';
     window.open('/assetsmanageservice/assetsmanage/assets/assetsQrcodeQuery?assetsIdList='+downloadList+'&mode='+mode)
   }

  batchDisabled = () => {
     if(this.state.checkedList.length == 0){
       message.info("目前尚无内容，无法批量废弃！");
       return;
     }
     var {dispatch,temp}=this.props;
     var tempIds = '';
     for(let i = 0; i < this.state.checkedList.length; i++){
       tempIds = tempIds + '"' + this.state.checkedList[i] + '"' + ',';
     }
     tempIds = tempIds.substring(0,tempIds.length-1);
     var data = {
       arg_asset_ids: tempIds,
       arg_state_code: 0,
       arg_user_id: Cookie.get('userid'),
     }
     var that = this;
     Modal.confirm({
       title: '您确定要废弃这批二维码信息?',
       onOk() {
         dispatch({
           type:'qrCodeCommon/assetsBatchDisabled',
           data,
           temp,
           callback:(data) => {
             if(data == '1'){
               that.setState({
                 checkAll: false,
                 checked: [],
                 checkedList: [],
               })
             }
           }
         })
       },
       onCancel() {
         console.log('Cancel');
       },
     });
   }

  handlePageChange = (page) => {
    const {temp,onPageChange} = this.props;
    onPageChange(page)
    //from here
    let c=false
    const{carddata}=this.props
    this.setState({
      checked:carddata.map(i=>c),
      checkAll:c,
      indeterminate:c
    })
    //将页面所有的assetsNum放入checkedList中
    var checkedtempList = [];
    if(this.props.carddata != undefined){
      for(let i = 0; i < this.props.carddata.length; i++){
        checkedtempList.push(this.props.carddata[i].asset_id);
      }
    }

    this.setState({
      // checkedList: false? checkedtempList : [],
      checkedList: [],
      indeterminate: false,
      checkAll: false,
    })

    //to here 这里是相当于点击全选按钮

     this.setState({
       currentpage: page,
     })

     const {dispatch} = this.props;

     var data = {
       // argAssetsName: this.props.AssetName,
       argPageSize: 12,
       argPageCurrent: page,
       argAssetsState:1, // 0-禁用；1-启用
       argTypeId1: temp, //场地
     }
     dispatch({
       type:"qrCodeCommon/assetsQuery",
       data,
     });
    }

  goAddPage = () => {
   this.setState({
     flag:'add',
     tempRecord:[],
     isEditVisible:true,
   })
  }

  render(){
    const {checked}=this.state;
    const {temp} = this.props;
    window.locDeptValue = '';  //注意这里哦，
    window.locChargerValue = '';
    window.locUserValue = '';
    window.userlocDeptValue = '';

    let cardDataList = [];
    if(this.props.assetList != undefined){
      for(let i = 0; i < this.props.assetList.length; i++){
        cardDataList.push(
          <div style={{display:'inline-block',marginLeft:30,marginTop:30,width:400,height:235}} key = {i}>
            <Card title = {this.props.assetList[i].asset_name} className = {styles.antcard}
             extra={<div><Tooltip title = "编辑"><Icon type = "edit" onClick = {()=>this.editOR(this.props.assetList[i])}/></Tooltip>&nbsp;
              <Tooltip title = "废弃"><Icon type = "close-circle-o" onClick = {()=>this.disabledQE(this.props.assetList[i])}/></Tooltip>&nbsp;
              <Tooltip title = "下载"><Icon type = "download" onClick = {()=>this.downloadQR(this.props.assetList[i])}/></Tooltip>&nbsp;&nbsp;
              <Checkbox onChange = {this.onSingleChange(i,this.props.assetList[i].asset_id)} checked={checked[i]}>选择</Checkbox>
              </div>}>

              <div style = {{float:'left',width:'60%',overflow:'hidden'}}>
                {temp == 'type3' ?
                  <div style = {{float:'left',width:'60%',overflow:'hidden'}}>
                    <p style = {{padding:10}} className = {styles.overflow}>级别分类： <Tooltip title = {this.props.assetList[i].type_id2_name}> {this.props.assetList[i].type_id2_name}</Tooltip></p>
                    <p style = {{padding:10}} className = {styles.overflow}>所属部门： <Tooltip title = {this.props.assetList[i].charger_dept_name}>{this.props.assetList[i].charger_dept_name}</Tooltip></p>
                    <p style = {{padding:10}} className = {styles.overflow}>所属区域： <Tooltip title = {this.props.assetList[i].location}>{this.props.assetList[i].location}</Tooltip></p>
                    <p style = {{padding:10}} className = {styles.overflow}>使用人： <Tooltip title = {this.props.assetList[i].assetuser_name}>{this.props.assetList[i].assetuser_name}</Tooltip></p>
                  </div>
                  :
                  temp == 'type1'?
                    <div style = {{float:'left',width:'60%',overflow:'hidden'}}>
                      <p style = {{padding:10}} className = {styles.overflow}>资产名称： <Tooltip title = {this.props.assetList[i].asset_name}> {this.props.assetList[i].asset_name}</Tooltip></p>
                      <p style = {{padding:10}} className = {styles.overflow}>品牌： <Tooltip title = {this.props.assetList[i].brand}>{this.props.assetList[i].brand}</Tooltip></p>
                      <p style = {{padding:10}} className = {styles.overflow}>规格型号： <Tooltip title = {this.props.assetList[i].specification}>{this.props.assetList[i].specification}</Tooltip></p>
                      <p style = {{padding:10}} className = {styles.overflow}>归属部门： <Tooltip title = {this.props.assetList[i].charger_dept_name}>{this.props.assetList[i].charger_dept_name}</Tooltip></p>
                    </div>
                    :
                    temp == 'type2'?
                      <div style = {{float:'left',width:'60%',overflow:'hidden'}}>
                        <p style = {{padding:10}} className = {styles.overflow}>资产名称： <Tooltip title = {this.props.assetList[i].asset_name}> {this.props.assetList[i].asset_name}</Tooltip></p>
                        <p style = {{padding:10}} className = {styles.overflow}>品牌： <Tooltip title = {this.props.assetList[i].brand}>{this.props.assetList[i].brand}</Tooltip></p>
                        <p style = {{padding:10}} className = {styles.overflow}>规格型号： <Tooltip title = {this.props.assetList[i].specification}>{this.props.assetList[i].specification}</Tooltip></p>
                        <p style = {{padding:10}} className = {styles.overflow}>归属部门： <Tooltip title = {this.props.assetList[i].charger_dept_name}>{this.props.assetList[i].charger_dept_name}</Tooltip></p>
                      </div>
                      :
                      ''
                }

              </div>
              <div style = {{marginLeft:40}}>
              {
                this.props.assetList[i].assetsQrcode == ''?
                <div style = {{marginTop:30,marginLeft:'53%',width :'50%',height:120}}><Spin tip="Loading..." ></Spin></div>
                :
                <img alt="example" width="50%" style = {{width:'37%',marginLeft:'8%'}} src={this.props.assetList[i].assetsQrcode} />
              }

              </div>
            </Card>

          </div>
        )
      }
    }


    return(
      <div >
        <Button type = "primary" style = {{float:'right', marginLeft:10}} onClick = {this.goAddPage}>添加</Button>
        <div style = {{marginBottom:16}}>
          <Button type = "primary"  disabled = {!this.state.checkedList.length > 0 && (!this.state.checkAll)} onClick = {this.batchDownload}>批量下载二维码</Button>&nbsp;&nbsp;
          <Button type = "primary" disabled = {!this.state.checkedList.length > 0 && (!this.state.checkAll)} onClick = {this.batchDisabled}>批量废弃</Button>
        </div>
        {
          (this.state.checkAll)?
          <div style = {{marginLeft:30}}><Checkbox indeterminate={this.state.indeterminate} onChange={this.onCheckAllChange} checked={this.state.checkAll}> 全选</Checkbox>
          选中<b>{this.state.checkedList.length}</b> 条</div>
          :
          <div style = {{marginLeft:30}}><Checkbox indeterminate={this.state.indeterminate} onChange={this.onCheckAllChange} checked={this.state.checkAll}> 全选</Checkbox>
          </div>
        }

        {
          (this.props.assetList.length == 0)? <div style = {{textAlign:'center',marginTop:30}}>暂无数据</div> :''
        }

        {cardDataList}

        <div style = {{textAlign:'center',marginTop:50}}>
          <Pagination defaultCurrent={1} total={parseInt(this.props.RowCount)} pageSize={12} onChange={this.handlePageChange} current = {this.state.currentpage}/>
        </div>

        {temp == 'type3'?
          <CommonModalLocation  okClick = {this.hideEditModel} cancelClick = {this.hideCancelModel} visible={this.state.isEditVisible} data = {this.state.tempRecord} flag = {this.state.flag}/>
          :
          temp == 'type1'?
          <CommonModalOffice  okClick = {this.hideEditModel} cancelClick = {this.hideCancelModel} visible={this.state.isEditVisible} data = {this.state.tempRecord} flag = {this.state.flag}/>
          :
          temp == 'type2'?
          <CommonModalLiving  okClick = {this.hideEditModel} cancelClick = {this.hideCancelModel} visible={this.state.isEditVisible} data = {this.state.tempRecord} flag = {this.state.flag}/>
          :
          ''
        }

      </div>
    )
  }
}

// export default QRCard;

function mapStateToProps (state) {
  const { assetList,PageCount,RowCount,assetTypeList,checkerList2,temp} = state.qrCodeCommon;  //lumj
  return {
    loading: state.loading.models.qrCodeCommon,
    assetList,
    PageCount,
    RowCount,
    assetTypeList,
    checkerList2,
    temp,
  };
}


export default connect(mapStateToProps)(QRCard);
