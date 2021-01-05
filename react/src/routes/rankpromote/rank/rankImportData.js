/**
 * 文件说明：导入劳动合同
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-09-16
 **/
import React ,{Component} from 'react';
import {connect} from "dva";
import {Button, Card, Form, Input, Row, Select,message, Table} from "antd";
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
import ExcelImportRank from "../../rankpromote/rank/excelImportRank";

const { Option } = Select;

class rankImportData extends Component{
  constructor (props) {
    super(props);
    this.state = {
      isSaveClickable:true,
      isSuccess:false,
      personRankDataList:[],
      ou_name : Cookie.get("OU"),
      user_id : Cookie.get("userid"),
      dept_id : Cookie.get("dept_id"),
      //显示：1：导入显示，2：查询显示，默认是查询显示
      showTablesDataFlag : '2',
      saveFlag : true,
      text: '',
    }
  }
  person_rank_columns = [
    { title: '序号', dataIndex: 'indexID',width:'50px',},
    { title: '姓名', dataIndex: 'user_name',width:'80px'},
    { title: '员工编号', dataIndex: 'user_id',width:'80px'},
    { title: '所属单位', dataIndex: 'ou_name',width:'120px'},
    { title: '所属部门', dataIndex: 'dept_name',width:'100px'},
    { title: '年度', dataIndex: 'year' ,width:'60px'},
    { title: '加入联通时间', dataIndex: 'join_time',width:'110px'},
    { title: '现职级薪档', dataIndex: 'rank_sequence_before',width:'100px'},
    { title: '调整后职级薪档', dataIndex: 'rank_sequence',width:'120px'},
    { title: '剩余考核积分', dataIndex: 'bonus_points',width:'110px'},
    { title: '生效日期', dataIndex: 'effective_time',width:'110px'},
    { title: '晋升路径', dataIndex: 'promotion_path',width:'150px'},
    { title: '人才标识', dataIndex: 'talents_name',width:'100px'}
  ];
  //批量导入保存
  saveAction = () => {
    this.setState({ isSaveClickable: false });
    let importRankDataList = this.props.importRankDataList;
    /*非空校验*/
    if(importRankDataList.length < 1)
    {
      message.error('导入信息为空，请重新导入后提交');
      this.setState({ isSaveClickable: true });
      return;
    }

    const{dispatch} = this.props;
    return new Promise((resolve) => {
      dispatch({
        //合同信息保存
        type:'rankImportModel/importRankDataSubmit',
        importRankDataList,
        resolve
      });
    }).then((resolve) => {
      console.log("resolve==="+resolve);
      if(resolve === "success"){
        this.setState({ isSaveClickable: false });
        this.setState({ isSuccess: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/rankpromote/rankImport'
          }));
        },500);
      }
      if(resolve === "erro"){
		    message.error("导入失败！请检查导入信息！");
        this.setState({ isSaveClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/rankpromote/rankImport'}));
    });
  }
  //结束关闭
  gotoHome = () => {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/rankpromote/rankImport'
    }));
  };
  //更新状态
  updateVisible = (value) =>{
    if(value === true){
      this.setState({
        showTablesDataFlag: 1,
        saveFlag: false,
      });
    }
  };

  render() {
    const {importRankDataList} = this.props;
    return(
      <div>
        <Row span={2} style={{textAlign: 'center'}}><h2>职级信息查询导入</h2></Row>
        <br/>
        <div style={{ float: 'left'}}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {
            this.state.isSaveClickable ?
              <ExcelImportRank dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
              : (this.state.isSuccess ?
                <ExcelImportRank dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
                :
                null
              )
          }
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.saveAction} disabled={this.state.saveFlag}>{this.state.isSaveClickable ? '提交' : (this.state.isSuccess ? '已成功同步' :  '正在处理中...')}</Button>
          <br/><br/>
          <Table
              columns={this.person_rank_columns}
              dataSource={importRankDataList}
              pagination={true}
              scroll={{y: 400}}
            />
        </div>
        <div style={{ textAlign: 'center'}}>
          <Button onClick={this.gotoHome}>关闭</Button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.rankImportModel,
    ...state.rankImportModel
  };
}

rankImportData = Form.create()(rankImportData);
export default connect(mapStateToProps)(rankImportData);
