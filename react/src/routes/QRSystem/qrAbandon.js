/**
 *  作者: 卢美娟
 *  创建日期: 2018-04-23
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：我的废弃
 */
import React from 'react';
import {Icon, Card,Row,Col,Button,Modal,Tooltip,Checkbox,Spin,Table,Pagination} from 'antd';
import { connect } from 'dva';
import styles from './QRCode.less';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';

function showChargerDept (text, record,index,that) {
    return <div style={{textAlign:"center",}}>
      {/*<div style = {{float:'left'}}>{record.charger_dept_name?record.charger_dept_name.split('-')[1]:''}</div>*/}
      <div style = {{float:'left'}}>{record.charger_dept_name}</div>
    </div>
}
class QRAbandon extends React.Component {
  state = {
    argPageCurrent:1,
  }

  handlePageChange = (page) => {
    var temp = this.props.location.query;
    const {dispatch} = this.props;
    var data = {
      argPageSize: 12,
      argPageCurrent: page,
      argAssetsState: 0, // 0-禁用；1-启用
      argTypeId1: temp,
    }
    dispatch({
      type:"qrAbandonCommon/assetsQuery",
      data,
    });
   }

   goBack = () => {
     const {dispatch}=this.props;
     dispatch(routerRedux.push({
       pathname:'/adminApp/compRes/qrcode_locationres'
     }));
   }

   restartQE = (index,record) => {
    var {dispatch}=this.props;
    var temp = this.props.location.query;
    var passdata = {
      arg_asset_ids: JSON.stringify(record.asset_id),
      arg_state_code: 1,
      arg_user_id: Cookie.get('userid'),
    }
    Modal.confirm({
      title: '您确定要重启此条二维码信息?',
      onOk() {
        dispatch({
          type:'qrAbandonCommon/assetsRestart',
          passdata,
          temp,
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
   }

  render(){
    let {assetList,RowCount } = this.props;

    const columns = [{
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
      },{
        title: '归属部门',
        render: (text, record, index) =>showChargerDept (text, record, index,this),
      },{
        title: '负责人',
        dataIndex: 'charger_name',
      },{
        title: '使用人',
        dataIndex: 'assetuser_name',
      }, {
        title: '操作',
        render: (text, record, index) =>{
          return(
            <a style = {{float:'center'}} onClick={()=>this.restartQE(index,record)}>重启</a>
          )
        },
      }];

    return(
      <div >
        <h2 style = {{textAlign:'center'}}>我的废弃</h2>
        <div style = {{marginTop:30}}>
          <Table bordered columns = {columns} dataSource = {assetList} pagination = {false}  className={styles.orderTable}/>
        </div>
        <div style = {{textAlign:'center',marginTop:50}}>
          <Pagination defaultCurrent={1} total={RowCount} pageSize={12} onChange={this.handlePageChange}/>
        </div>
        <div style = {{textAlign:'right'}}>
             <Button type = "primary" onClick = {this.goBack}>返回</Button>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { list, query,assetList,PageCount,RowCount} = state.qrAbandonCommon;  //lumj
  return {
    loading: state.loading.models.qrAbandonCommon,
    list,
    query,
    assetList,
    PageCount,
    RowCount
  };
}


export default connect(mapStateToProps)(QRAbandon);
