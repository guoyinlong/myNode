/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-31
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 综合资源首页
  */

import React from 'react';
import { connect } from 'dva';
import { Table,  Menu, Icon, DatePicker,Modal,Popconfirm,message,Tooltip,Button,Input,Upload,Pagination,Select,Cascader,Spin } from 'antd';
import styles from './QRCode.less';
import { routerRedux } from 'dva/router';
import QRCard from './QRCard.js';
import CommonModalLiving from '../../components/QRSystem/commonModalLiving.js';
import CommonModalLocation from '../../components/QRSystem/commonModalLocation.js';
import CommonModalOffice from '../../components/QRSystem/commonModalOffice.js';
const Search = Input.Search;
import Cookie from 'js-cookie';
import request from '../../utils/request';

function showseeopeartion (text, record,index,that) {
    return <div style={{textAlign:"center",}}>
      <div style = {{float:'left'}}><Tooltip title = "编辑"><Icon type = 'edit' onClick={()=>that.editOR(index,record)}/></Tooltip></div>
      <div style = {{float:'left',marginLeft:5}}><Tooltip title = "废弃"><Icon type="close-circle-o" onClick={()=>that.disabledQE(index,record)}/></Tooltip></div>
      <div style = {{float:'left',marginLeft:5}}><Tooltip title = "下载"><Icon type="download"  onClick={()=>that.downloadQR(index,record)}/></Tooltip></div>
    </div>
}

function showChargerDept (text, record,index,that) {
    return <div style={{textAlign:"center",}}>
      <div style = {{float:'left'}}>{record.charger_dept_name}</div>
    </div>
}

class QRCodeCommon extends React.Component{
  state = {
    selectedRowKeys:[],
    loading:false,
    isEditVisible:false,
    displayWay:'card',
    tempRecord:[],
    flag:'',
    myLocationOptionLoc:[], //场地资源
    myLocationOptionOff:[], //办公设备
    myLocationOptionLiv:[], //生活设施
    myRegionOption:[],
    myFloorOption:[], //所属楼层
    myFloor:'',
    TypeId2:'', //按类型,
    TypeId3: '',
    AssetName:'',
    currentpage:1,
  }

  componentWillReceiveProps(nextProps){
    if(this.props.temp != nextProps.temp){
      this.setState({
        selectedRowKeys:[],
      })
    }
  }
  //切换显示方式
  switchDisplay = () => {
    this.setState({
      displayWay:this.state.displayWay === 'table'? 'card':'table'
    });
  };

  onSelectChange = (selectedRowKeys) => {
   this.setState({selectedRowKeys})
  }

  editOR = (index,record) => {
     this.setState({
       flag:'edit2',
       isEditVisible:true,
       tempRecord:record,
     })
    }

  disabledQE = (index,record) => {
   var {dispatch, temp}=this.props;
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

  downloadQR = (index,record) => {
    const mode = 'stream';
    window.open('/assetsmanageservice/assetsmanage/assets/assetsQrcodeQuery?assetsId='+record.asset_id+'&mode='+mode)
  }

  gotoImport = () => {
     const {dispatch,temp}=this.props;
     var query = {
       temp,
     }
     if(temp == 'type3'){
       dispatch(routerRedux.push({
         pathname:'/adminApp/compRes/qrcode_locationres/qrbulkImport',
         query,
       }));
     }
     if(temp == 'type1'){
       dispatch(routerRedux.push({
         pathname:'/adminApp/compRes/qrcode_office_equipment/qrbulkImport',
         query,
       }));
     }
     if(temp == 'type2'){
       dispatch(routerRedux.push({
         pathname:'/adminApp/compRes/qrcode_living_facilities/qrbulkImport',
         query,
       }));
     }
   }

  gotoAbandon = () => {
     const {dispatch,temp}=this.props;
     var query = {
       temp,
     }
     if(temp == 'type3'){
       dispatch(routerRedux.push({
         pathname:'/adminApp/compRes/qrcode_locationres/qrAbandon',
         query,
       }));
     }
     if(temp == 'type1'){
       dispatch(routerRedux.push({
         pathname:'/adminApp/compRes/qrcode_office_equipment/qrAbandon',
         query,
       }));
     }
     if(temp == 'type2'){
       dispatch(routerRedux.push({
         pathname:'/adminApp/compRes/qrcode_living_facilities/qrAbandon',
         query,
       }));
     }
   }

  goAddPage = () => {
   this.setState({
     flag:'add',
     tempRecord:[],
     isEditVisible:true,
   })
  }
  //跳转资产借还信息页面
  goAssetsInformation = () => {
    const { dispatch } =this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/compRes/qrcode_office_equipment/assetLendingInformation',    //地址需要修改
    }));
  }
  hideEditModel = (assetid,values) => {
    const {dispatch,temp} = this.props;
    values.assetName = values.assetName.replace(/(^\s*)|(\s*$)/g, "");
    if(values.assetNum){
      values.assetNum = values.assetNum.replace(/(^\s*)|(\s*$)/g, "");
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

     this.setState({
       isEditVisible:false,
     })
     var startTime = values.startTime.format('YYYY-MM-DD');
     var data = {
       asset_number: values.assetNum,
       asset_name: values.assetName,
       specification: values.normalizedForm,
       activate_date: startTime,
       floor: values.floor,
       location: values.location,
       station: values.station,
       type_id1: temp,
       type_id2: values.type_id[0],
       brand: values.brand,
       creater_id: Cookie.get('staff_id'),
       creater_name: Cookie.get('username'),
       charger_id: values.charger_name == undefined ? '' : values.charger_name.userid,
       charger_name: values.charger_name == undefined ? '' : values.charger_name.username,
       charger_dept_id: values.charger_dept_name == undefined ? '' : values.charger_dept_name.userid,
       charger_dept_name: values.charger_dept_name == undefined ? '' : values.charger_dept_name.username,
       assetuser_id: values.assetuser_name == undefined ? '' : values.assetuser_name.userid,
       assetuser_name: values.assetuser_name == undefined ? '' : values.assetuser_name.username,
       user_dept_id:values.user_dept_name == undefined ? '' : values.user_dept_name.userid,
       user_dept_name: values.user_dept_name == undefined ? '' : values.user_dept_name.username,
     }
     if(temp == 'type3'){
       data.asset_number = values.assetName;
     }else if(temp == 'type1' || temp == 'type2'){
       data.asset_number = values.assetNum;
       data.type_id3 =  values.type_id[1];
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
      }else{
       //调用服务 此处是表格页面的编辑
       data.asset_id = assetid;
       dispatch({
         type:'qrCodeCommon/assetsUpdate',
         data,
         currentpage: this.state.currentpage,
       })
     }

  }

  hideCancelModel = () =>{
    this.setState({
      isEditVisible:false,
    })
  }

  handlePageChange = (page) => {
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
      });
    }, 10);
    this.setState({
      currentpage: page,
    })
    const {dispatch,temp} = this.props;
    var data = {
      argAssetsName: this.state.AssetName,
      argPageSize: 12,
      argPageCurrent: page,
      argAssetsState:1, // 0-禁用；1-启用
    }
    if(temp == 'type3'){
      data.argTypeId1 = 'type3';
    }else if(temp == 'type1'){
      data.argTypeId1 = 'type1';
    }else if(temp == 'type2'){
      data.argTypeId1 = 'type2';
    }
    dispatch({
      type:"qrCodeCommon/assetsQuery",
      data,
    });
   }

  assetsChange = (value) => {
     this.setState({
       AssetName: value,
     })
   }

  batchDownload = () =>{
    this.setState({ loading: true });
     setTimeout(() => {
       this.setState({
         selectedRowKeys: [],
         loading: false,
       });
     }, 1000);

   var downloadList = [];
   for(let i = 0; i < this.state.selectedRowKeys.length; i++){
     downloadList.push(this.props.assetList[i].asset_id)
   }
   downloadList = JSON.stringify(downloadList)
   const mode = 'stream';
   window.open('/assetsmanageservice/assetsmanage/assets/assetsQrcodeQuery?assetsIdList='+downloadList+'&mode='+mode)
  }

  assetSearch = (value) => {
    const {dispatch,temp} = this.props;
    this.setState({
      AssetName: value,
      currentpage:1,
    })
    var data = {
      argAssetsName: value,
      argPageSize:12,
      argPageCurrent:1,
      argAssetsState:1,
    }
    if(temp == 'type3'){
      data.argTypeId1 = 'type3';
    }else if(temp == 'type1'){
      data.argTypeId1 = 'type1';
    }else if(temp == 'type2'){
      data.argTypeId1 = 'type2';
    }
    if(this.state.TypeId2){
      data.argTypeId2 = this.state.TypeId2;
    }
    if(this.state.TypeId3){
      data.argTypeId3 = this.state.TypeId3;
    }
    if(this.state.myFloor){
      data.argAccuracyFloor = this.state.myFloor;
    }

    dispatch({
      type:"qrCodeCommon/assetsQuery",
      data,
    });
  }

  FloorChange = (value) => {
    this.setState({
      myFloor: value[0],
    })
    var data = {
      argPageSize:12,
      argPageCurrent:1,
      argAssetsState:1,
      argAccuracyFloor:value[0],
    }
    const {dispatch,temp} = this.props;
    if(temp == 'type3'){
      data.argTypeId1 = 'type3';
    }else if(temp == 'type1'){
      data.argTypeId1 = 'type1';
    }else if(temp == 'type2'){
      data.argTypeId1 = 'type2';
    }
    if(this.state.AssetName){
      data.argAssetsName = this.state.AssetName;
    }
    if(this.state.TypeId2){
      data.argTypeId2 = this.state.TypeId2;
    }
    if(this.state.TypeId3){
      data.argTypeId3 = this.state.TypeId3;
    }

    dispatch({
      type:"qrCodeCommon/assetsQuery",
      data,
    });
  }

  RegionChange = (value) =>{
    var typeid2 = value[0];
    var typeid3 = ''
    this.setState({
      TypeId2:value[0],
      TypeId3:value[1]
    })
    var data = {
      argTypeId2: typeid2,
      argPageSize:12,
      argPageCurrent:1,
      argAssetsState:1,
    }
    if(value[1]) {
      typeid3 = value[1]
      data.argTypeId3 = typeid3
    }
    // else {
    //   typeid3 = ''
    // }
    const {dispatch,temp} = this.props;
    if(temp == 'type3'){
      data.argTypeId1 = 'type3';
    }else if(temp == 'type1'){
      data.argTypeId1 = 'type1';
    }else if(temp == 'type2'){
      data.argTypeId1 = 'type2';
    }
    if(this.state.myFloor){
      data.argAccuracyFloor = this.state.myFloor;
    }
    if(this.state.AssetName){
      data.argAssetsName = this.state.AssetName;
    }

    dispatch({
      type:"qrCodeCommon/assetsQuery",
      data,
    });
  }


  onPageChange = (page) => {
    this.setState({
      currentpage: page,
    })
  }

  componentDidMount(){
    // //获取级别分类
    let postData = {
    };
    let oudata=request('/assetsmanageservice/assetsmanage/assets/assetsTypeQuery',postData);
    oudata.then((data)=>{
      this.setState({
        assetTypeList:data.my_child,
      },()=>{

        var first = 0;
        var second = 0;
        if(this.state.assetTypeList != undefined){
          this.state.assetTypeList.forEach(i => {
              var myOptions;
            if(i.type_name == '办公设备'){
              myOptions = [];
              myOptions.push({value:i.type_id, label:i.type_name, children:[]})
              if(i.my_child != undefined){
                i.my_child.forEach(j => {
                  myOptions[0].children.push({value:j.type_id, label:j.type_name, children:[]}) // 二级数据
                  if(j.my_child!= undefined){
                    j.my_child.forEach(k => {
                      myOptions[0].children[second].children.push({value:k.type_id, label:k.type_name})
                    })
                  }
                  second ++;
                })
                second = 0;
              }
              this.setState({
                myLocationOptionOff:myOptions[0].children
              })
            }
            else if(i.type_name == '场地'){
               myOptions = [];
              if(i.my_child != undefined){
                i.my_child.forEach(j => {
                  myOptions.push({value:j.type_id, label:j.type_name})
                })
              }
              this.setState({
                myLocationOptionLoc:myOptions
              })
            }
            else if(i.type_name == '生活设施'){
              myOptions = [];
              myOptions.push({value:i.type_id, label:i.type_name, children:[]})
              if(i.my_child != undefined){
                i.my_child.forEach(j => {
                  myOptions[first].children.push({value:j.type_id, label:j.type_name, children:[]})
                  if(j.my_child!= undefined){
                    j.my_child.forEach(k => {
                      myOptions[first].children[second].children.push({value:k.type_id, label:k.type_name})
                    })
                  }
                  second ++;
                })
                second = 0;
              }
              // first ++;
              this.setState({
                myLocationOptionLiv:myOptions[0].children
              })
            }
          })
        }

      })
    })

    //获取所在区域
    let oudata3=request('/assetsmanageservice/assetsmanage/assets/assetsLocationQuery',[]);
    oudata3.then((data)=>{
      var tempData = [];
      data.DataRows.forEach(i => {
        tempData.push({value:i, label:i})
      })
      this.setState({
        myRegionOption:tempData,
      })
    })

    //获取所属楼/层
    let oudata4=request('/microservice/assetmanage/floorquery',[]);
    oudata4.then((data)=>{
      var tempData = [];
      data.DataRows.forEach(i => {
        tempData.push({value:i.floor, label:i.floor})
      })
      this.setState({
        myFloorOption:tempData,
      })
    })

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
  }

  render(){
    const {loading, selectedRowKeys} = this.state;
    let {assetList,RowCount ,temp} = this.props;
    RowCount = parseInt(RowCount);

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const hasSelected = selectedRowKeys.length > 0;
    var columns = [];
    if(temp == 'type3'){
       columns = [{
          title: '资产名称',
          dataIndex: 'asset_name',
          width:200,
        }, {
          title: '启用日期',
          dataIndex: 'activate_date',
          width:100,
        }, {
          title: '所属楼/层',
          dataIndex: 'floor',
          width:100,
        },{
          title: '所属工位',
          dataIndex: 'station',
          width:100,
        }, {
          title: '归属部门',
          render: (text, record, index) =>showChargerDept (text, record, index,this),
          width:200,
        },{
          title: '负责人',
          dataIndex: 'charger_name',
          width:100,
        },{
          title: '使用人',
          dataIndex: 'assetuser_name',
          width:100,
        },{
          title: '操作',
          render: (text, record, index) =>showseeopeartion (text, record, index,this),
          width:100,
        }];
    }
    else if(temp == 'type1' || temp == 'type2'){
      columns = [{
         title: '品牌',
         dataIndex: 'brand',
         width: 100,
       },{
         title: '资产编号',
         dataIndex: 'asset_number',
         width: 100,
       }, {
         title: '资产名称',
         dataIndex: 'asset_name',
         width: 200,
       }, {
         title: '规格型号',
         dataIndex: 'specification',
         width: 100,
       }, {
         title: '启用日期',
         dataIndex: 'activate_date',
         width: 100,
       }, {
         title: '所属楼/层',
         dataIndex: 'floor',
         width: 100,
       },{
         title: '所属工位',
         dataIndex: 'station',
         width: 100,
       }, {
         title: '归属部门',
         // dataIndex: 'charger_dept_name',
         render: (text, record, index) =>showChargerDept (text, record, index,this),
         width: 200,
       }, {
         title: '操作',
         render: (text, record, index) =>showseeopeartion (text, record, index,this),
         width: 100,
       }];
    }

    return(
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className = {styles.pageContainer}>
          <div style = {{marginBottom:10}}>
             <a style = {{float:'right',cursor:'pointer',marginLeft:15}} onClick = {this.gotoAbandon}>我的废弃</a>
              {this.state.displayWay === 'table' ?
                <Tooltip title="卡片显示">
                  <Icon type = 'qiapian' style={{float:'right',fontSize:20,cursor:'pointer',}} onClick={this.switchDisplay}/>
                </Tooltip>
                :
                <Tooltip title="表格显示">
                  <Icon type = 'liebiao' style={{float:'right',fontSize:20,cursor:'pointer',}} onClick={this.switchDisplay}/>
                </Tooltip>
              }
            </div>

           <h2 style = {{textAlign:'center'}}>综合资源{temp == 'type3'?'(场地资源)':temp == 'type1'?'(办公设备)':temp == 'type2'?'(生活设施)':''}</h2>
           <div style = {{float:'right', marginLeft:10}}><Button type = "primary" onClick = {this.gotoImport}><Icon type='upload'/>批量导入</Button></div>

           <Search
             placeholder="资产名称" maxLength = {'15'} style = {{float:'right', width:200, marginLeft:10}} onSearch={value=>this.assetSearch(value)}  onChange={value=>this.assetsChange(value)}/>
           <Cascader style={{float:'right', width: 120, marginLeft:10}} options={this.state.myFloorOption} onChange={this.FloorChange}  placeholder = "所属楼层"/>

           <Cascader style={{float:'right', width: 120, marginLeft:10}}
            options={temp == 'type3'? this.state.myLocationOptionLoc:temp == 'type1'?this.state.myLocationOptionOff:temp == 'type2'?this.state.myLocationOptionLiv:''}
            onChange={this.RegionChange} changeOnSelect placeholder = "按分类"/>

           {
             this.state.displayWay === 'table' ?
             <div>
               <Button type = "primary" style = {{float:'right', marginLeft:10}} onClick = {this.goAddPage}>添加</Button>
               <Button type = "primary" style = {{float:'right', marginLeft:10}} onClick = {this.goAssetsInformation}>资产信息查询</Button>
               <div style = {{marginBottom:16}}>
                 <Button type = "primary" onClick = {this.batchDownload} disabled = {!hasSelected} loading = {loading}>批量下载二维码</Button>
                 <span style = {{marginLeft:8}}>{hasSelected ? `选中 ${selectedRowKeys.length}条` : ''}</span>
               </div>
               <Table bordered rowSelection = {rowSelection} columns = {columns} dataSource = {assetList} pagination = {false}  className={styles.orderTable}/>
               <div style = {{textAlign:'center',marginTop:50}}>
                 <Pagination defaultCurrent={1} total={RowCount} pageSize={12} onChange={this.handlePageChange} current = {this.state.currentpage}/>
               </div>
             </div>
             :
             <div style = {{marginTop:0}}>
              <QRCard carddata = {assetList} dispatch = {this.props.dispatch} RowCount = {RowCount} current = {this.state.currentpage} onPageChange = {this.onPageChange}/>
             </div>
           }

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
     </Spin>
    );
  }
}

function mapStateToProps (state) {
  const { list, query,assetList,PageCount,RowCount,assetTypeList,checkerList2,temp} = state.qrCodeCommon;  //lumj
  return {
    loading: state.loading.models.qrCodeCommon,
    list,
    query,
    assetList,
    PageCount,
    RowCount,
    assetTypeList,
    checkerList2,
    temp
  };
}


export default connect(mapStateToProps)(QRCodeCommon);
