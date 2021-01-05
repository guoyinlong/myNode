/**
  * 作者： 卢美娟
  * 创建日期： 2018-04-13
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 批量导入功能
  */

import React from 'react';
import { connect } from 'dva';
import { Table,  Menu, Icon, DatePicker,Modal,Popconfirm,message,Tooltip ,Row,Col,Input,Button,Upload} from 'antd';
import styles from './QRCode.less';
import moment from 'moment';
import CommonModalLiving from '../../components/QRSystem/commonModalLiving.js';
import CommonModalLocation from '../../components/QRSystem/commonModalLocation.js';
import CommonModalOffice from '../../components/QRSystem/commonModalOffice.js';
import FileUpload from './import.js';
import { routerRedux } from 'dva/router';

function showseeopeartion (text, record,index,that) {
    return <div style={{textAlign:"center",}}>
      <div style = {{float:'left'}}><Button type="primary" onClick={()=>that.editOR(index,record)}> 修改</Button></div>
    </div>
}


class QRBulkImport extends React.Component{

  state = {
    assetNum:'',
    assetName:'',
    normalizedForm:'',
    startTime:'',
    location:'',
    isEditVisible:false,
    tempRecord:[],
    importDataLength:0,
    showData:[],
  }
  clearData = () => {
    //清空预览表格数据
    this.setState({
      importDataLength:0,
      showData:[],
    })
  }

  editOR = (index,record) => {
     this.setState({
       flag:'fackEdit',
       isEditVisible:true,
       tempRecord:record,
     })
   }

  hideEditModel = (assetid,values) => {
     this.setState({
       isEditVisible:false,
     })
     var temp = this.props.location.query;
     //更改this.state.showData的值
     var temptime = new Date(values.startTime);
     var tempShowData = [];
     tempShowData = this.state.showData;
     for(let i = 0; i < tempShowData.length; i++){
       if(temp.temp == 'type3'){ 
         if(!values.assetNum){  //因为场地资源没有资产编号，但有资产名称，且场地资源名称等同于其他的资产编号，不能为空
             tempShowData[i].asset_name = values.assetName;
             tempShowData[i].asset_number = values.assetName;
             tempShowData[i].assetuser_name = values.assetuser_name?(values.assetuser_name.username?values.assetuser_name.username:values.assetuser_name):'';
             tempShowData[i].charger_name = values.charger_name?(values.charger_name.username?values.charger_name.username:values.charger_name):'';
             tempShowData[i].charger_dept_name = values.charger_dept_name?(values.charger_dept_name.username?values.charger_dept_name.username:values.charger_dept_name):'';
             tempShowData[i].brand = values.brand;
             tempShowData[i].floor = values.floor;
             tempShowData[i].location = values.location;
             tempShowData[i].specification = values.normalizedForm;
             tempShowData[i].station = values.station;
             tempShowData[i].activate_date = moment(temptime).format('YYYY-MM-DD');
             tempShowData[i].type_id1_name = values.type_id[0];
             tempShowData[i].type_id2_name = values.type_id[1];
             tempShowData[i].type_id3_name = values.type_id[2];
           }
       }else{ 
           tempShowData[i].asset_name = values.assetName;
           tempShowData[i].asset_number = values.assetNum;
           tempShowData[i].assetuser_name = values.assetuser_name?(values.assetuser_name.username?values.assetuser_name.username:values.assetuser_name):'';
           tempShowData[i].charger_name = values.charger_name?(values.charger_name.username?values.charger_name.username:values.charger_name):'';
           tempShowData[i].charger_dept_name = values.charger_dept_name?(values.charger_dept_name.username?values.charger_dept_name.username:values.charger_dept_name):'';
           tempShowData[i].brand = values.brand;
           tempShowData[i].floor = values.floor;
           tempShowData[i].location = values.location;
           tempShowData[i].specification = values.normalizedForm;
           tempShowData[i].station = values.station;
           tempShowData[i].activate_date = moment(temptime).format('YYYY-MM-DD');
           tempShowData[i].type_id1_name = values.type_id[0];
           tempShowData[i].type_id2_name = values.type_id[1];
           tempShowData[i].type_id3_name = values.type_id[2];
       }

     }
     this.setState({
       showData:tempShowData,
     })
  }

  hideCancelModel = () => {
    this.setState({
      isEditVisible:false,
    })
  }

  batchAssetsAdd = (addList) => {
    // console.log(addList, 'this.state.showData')
    const {dispatch } = this.props;
    dispatch({
      type:'qrbulkImportCommon/assetsAdd2',
      addList,
    })
  }

  saveData = (values) => {
    var temp = this.props.location.query;
    if(temp.temp == 'type3'){
      for(let i = 0; i < values.length; i++){
        values[i].asset_number = values[i].asset_name;
      }
    }
    this.setState({
      showData:values,
      importDataLength:values.length,
    })
  }
  goBack = () =>{
    const {dispatch}=this.props;
    var temp = this.props.location.query.temp;
    if(temp == 'type3'){
      dispatch(routerRedux.push({
        pathname:'/adminApp/compRes/qrcode_locationres'
      }));
    }
    if(temp == 'type1'){
      dispatch(routerRedux.push({
        pathname:'/adminApp/compRes/qrcode_office_equipment'
      }));
    }
    if(temp == 'type2'){
      dispatch(routerRedux.push({
        pathname:'/adminApp/compRes/qrcode_living_facilities'
      }));
    }
  }


  render(){
    window.locDeptValue = '';  //注意这里哦，
    window.locChargerValue = '';
    window.locUserValue = '';
    window.userlocDeptValue = '';
    var temp = this.props.location.query;
    var downloadurl = '';
    var columns = [];
    if(temp.temp == 'type3'){ 
      downloadurl = '/filemanage/download/assetstemplate/场地资源导入模版.xlsx';
      columns = [{
          title: '资产名称',
          dataIndex: 'asset_name',
        }, {
          title: '启用日期',
          dataIndex: 'activate_date',
        }, {
          title: '所属楼/层',
          dataIndex: 'floor',
        },{
          title: '所属工位',
          dataIndex: 'station',
        }, {
          title: '归属部门',
          dataIndex: 'charger_dept_name',
        },{
          title: '负责人',
          dataIndex: 'charger_name',
        },{
          title: '使用人',
          dataIndex: 'assetuser_name',
        },{
          title: '操作',
          render: (text, record, index) =>showseeopeartion (text, record, index,this),
        }];
    }
    if(temp.temp == 'type1'){
      downloadurl = '/filemanage/download/assetstemplate/办公设备导入模版.xlsx';
      columns = [{
          title: '品牌',
          dataIndex: 'brand',
        },{
          title: '资产编号',
          dataIndex: 'asset_number',
        }, {
          title: '资产名称',
          dataIndex: 'asset_name',
        }, {
          title: '规格形式',
          dataIndex: 'specification',
        }, {
          title: '启用日期',
          dataIndex: 'activate_date',
        }, {
          title: '所属楼/层',
          dataIndex: 'floor',
        },{
          title: '所属工位',
          dataIndex: 'station',
        }, {
          title: '归属部门',
          dataIndex: 'charger_dept_name',
        },{
          title: '负责人',
          dataIndex: 'charger_name',
        },{
          title: '操作',
          render: (text, record, index) =>showseeopeartion (text, record, index,this),
        }];
    }
    if(temp.temp == 'type2'){
      downloadurl = '/filemanage/download/assetstemplate/生活设施导入模版.xlsx';
      columns = [{
          title: '品牌',
          dataIndex: 'brand',
        },{
          title: '资产编号',
          dataIndex: 'asset_number',
        }, {
          title: '资产名称',
          dataIndex: 'asset_name',
        }, {
          title: '规格形式',
          dataIndex: 'specification',
        }, {
          title: '启用日期',
          dataIndex: 'activate_date',
        }, {
          title: '所属楼/层',
          dataIndex: 'floor',
        },{
          title: '所属工位',
          dataIndex: 'station',
        }, {
          title: '归属部门',
          dataIndex: 'charger_dept_name',
        },{
          title: '负责人',
          dataIndex: 'charger_name',
        },{
          title: '操作',
          render: (text, record, index) =>showseeopeartion (text, record, index,this),
        }];
    }

    return(
       <div className = {styles.pageContainer}>
         <h2 style = {{textAlign:'center'}}>二维码库</h2>
         <div style = {{float:'right', marginLeft:10}}><FileUpload dispatch={this.props.dispatch} passFuc = {this.saveData}/></div> {/*导入按钮 imports文件*/}
         <a href= {downloadurl}>
           <Button style = {{float:'right', marginLeft:10}}>
           <Icon type = 'download'/>模板下载</Button>
         </a>
         <div style = {{marginTop:50}}>
             <Table bordered columns = {columns} dataSource = {this.state.showData} className={styles.orderTable}/>
         </div>

         {this.state.importDataLength > 0 ?
           <div style = {{textAlign:'right',marginTop:30}}>
                <Button onClick = {this.goBack}>返回</Button>&nbsp;&nbsp;
                <Button onClick = {this.clearData}>清空</Button>&nbsp;&nbsp;
                <Button type = 'primary' onClick = {()=>this.batchAssetsAdd(this.state.showData)}>提交</Button>
           </div>
           :
           <div style = {{textAlign:'right',marginTop:30}}>
                <Button onClick = {this.goBack}>返回</Button>
           </div>
         }

         {temp.temp == 'type3'? 
          <CommonModalLocation okClick = {this.hideEditModel} cancelClick = {this.hideCancelModel} visible={this.state.isEditVisible} data = {this.state.tempRecord} flag = {this.state.flag}/>
           :
           temp.temp == 'type1'? 
             <CommonModalOffice okClick = {this.hideEditModel} cancelClick = {this.hideCancelModel} visible={this.state.isEditVisible} data = {this.state.tempRecord} flag = {this.state.flag}/>
             :
             temp.temp == 'type2'?
               <CommonModalLiving okClick = {this.hideEditModel} cancelClick = {this.hideCancelModel} visible={this.state.isEditVisible} data = {this.state.tempRecord} flag = {this.state.flag}/>
               :
                null         
         } 

      </div>
    );
  }

}

function mapStateToProps (state) {
  const {query} = state.qrbulkImportCommon;  //lumj
  return {
    loading: state.loading.models.qrbulkImportCommon,
    query
  };
}


export default connect(mapStateToProps)(QRBulkImport);
