/**
 * 文件说明：导入劳动合同
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-09-16
 **/
import React ,{Component} from 'react';
import {connect} from "dva";
import {Button, Card, Form, Row, Select, Table} from "antd";
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
import ExcelImportContract from "./excelImportContract";
const { Option } = Select;

class ImportContract extends Component{
  constructor (props) {
    super(props);
    this.state = {
      isSaveClickable:true,
      isSuccess:false,
      personPostDataList:[],
      ou_name : Cookie.get("OU"),
      user_id : Cookie.get("userid"),
      dept_id : '',

      //显示：1：导入显示，2：查询显示，默认是查询显示
      showTablesDataFlag : '2',
      saveFlag : true,
    }
  }
  //查询本院人员合同信息计划
  queryAllPostInfo = () =>{
    this.setState({
      showTablesDataFlag: 2,
    });
    const{dispatch} = this.props;
    let param = {
      arg_dept_id : this.state.dept_id,
      arg_ou_id : Cookie.get('OUID'),
    };
    return new Promise((resolve) => {
      dispatch({
        //全院级必修课保存
        type:'importPersonPost/allPostSearch',
        param,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success'){
          this.setState({
            personPostDataList: this.props.allPostDataList,
          });
      }
      if(resolve === 'false'){
        error.message('查询失败');
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/train/claim_class'}));
    });

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

    //培训计划批量导入保存
    saveAction = () => {
      this.setState({ isSaveClickable: false });
  
      const{dispatch} = this.props;
      let importContractDataList = this.props.importContractDataList;

      /*非空校验*/
      if(importContractDataList.length < 1)
      {
        message.error('导入合同信息为空，请填写后提交');
        this.setState({ isSaveClickable: true });
        return;
      }

      let contract_import_id = this.state.user_id + Number(Math.random().toString().substr(3,7) + Date.now()).toString(32);

      /*封装批量导入信息 begin */
      let transferContractData = [];

      importContractDataList.map((item) => {
        let tempData = {
            //用户ID
            arg_user_id: item.user_id,
            //用户名
            arg_user_name: item.user_name,
            //单位名称
            arg_ou_name: item.ou_name,
            //部门名称
            arg_dept_name: item.dept_name,
            //合同类型
            arg_contract_type:item.contract_type,
            //合同时间
            arg_contract_time:item.contract_time,
            //合同开始时间
            arg_start_time:item.start_time,
            //合同结束时间
            arg_end_time:item.end_time,
            //合同状态
            arg_state:item.state,
            //续签状态
            arg_if_sign:item.if_sign,
            //签订合同次数
            arg_sign_number:item.sign_number,
            //培训批量导入ID
            arg_import_id : contract_import_id,
        };
        transferContractData.push(tempData);
      });
      /*封装批量导入信息 end */

      return new Promise((resolve) => {
        dispatch({
          //合同信息保存
          type:'importContractModel/importContractDataSubmit',
          transferContractData,
          resolve
        });
      }).then((resolve) => {
        if(resolve === 'success')
        {
          this.setState({ isSaveClickable: false });
          this.setState({ isSuccess: true });
          setTimeout(() => {
            dispatch(routerRedux.push({
              pathname:'/humanApp/labor/contractListSearch'}));
          },500);
        }
        if(resolve === 'false')
        {
          this.setState({ isSaveClickable: true });
        }
      }).catch(() => {
        dispatch(routerRedux.push({
          pathname:'/humanApp/labor/contractListSearch'}));
      });
    };

  handlePostChange = (e) =>{ 
    this.setState({
      dept_id: e,
    });
  };

  //结束关闭
  gotoHome = () => {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/labor/contractListSearch'
    }));
  };

  person_post_columns = [
    { title: '序号', dataIndex: 'indexID',width:'5%',},
    { title: '姓名', dataIndex: 'user_name' ,width:'5%',},
    { title: '员工编号', dataIndex: 'user_id' ,width:'5%',},
    { title: '所属单位', dataIndex: 'ou_name' ,width:'15%',},
    { title: '所属部门', dataIndex: 'dept_name' ,width:'15%',},
    { title: '合同类型', dataIndex: 'contract_type' ,width:'10%',},
    { title: '合同周期', dataIndex: 'contract_time' ,width:'5%',},
    { title: '合同开始时间', dataIndex: 'start_time' ,width:'10%',},
    { title: '合同终止时间', dataIndex: 'end_time' ,width:'10%',},
    { title: '合同状态', dataIndex: 'state' ,width:'5%',},
    { title: '续签状态', dataIndex: 'if_sign' ,width:'10%',},
    { title: '签订合同次数', dataIndex: 'sign_number' ,width:'5%',},
  ];


  render() {
    // const deptList = this.props.deptList;
    // let deptListData = '';
    // let initdeptID = '';
    // if(deptList !== undefined)
    // {
    //     initdeptID = deptList[0].court_dept_id;
    //     deptListData = deptList.map(item =>
    //         <Option key={item.court_dept_id}>{item.court_dept_name}</Option>
    //   );
    // };

    const ouList = this.props.ouList;
    let ouOptionList = '';
    if(ouList.length){
      ouOptionList = ouList.map(item =>
        <Option key={item.OU}>{item.OU}</Option>
      );
    };
    const auth_ou = Cookie.get("OU");

    let importContractData = this.props.importContractDataList;

    return(
      <div>
        <br/><br/>
        <br/>
        <div style={{ float: 'left'}}>

        <span> 组织单元： </span>
        <Select style={{width: 160}} defaultValue={auth_ou} disabled={true}>
            {ouOptionList}
        </Select>

        {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span> 部门： </span>
        <Select style={{ width: 160 }} defaultValue= {initdeptID} onSelect={this.handlePostChange} >
          {deptListData}
        </Select> */}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

        {/* <Button type="primary" onClick={this.queryAllPostInfo} disabled={this.state.isSaveClickable ? false : (this.state.isSuccess ? false :  true)}>查询</Button> */}
        {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
        <a href="/filemanage/download/needlogin/hr/contractModel.xlsx" ><Button disabled={this.state.isSaveClickable ? false : (this.state.isSuccess ? false :  true)}>{'劳动合同模板下载'}</Button></a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {
            this.state.isSaveClickable ? 
            <ExcelImportContract dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
            : (this.state.isSuccess ? 
              <ExcelImportContract dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
              : 
              null
              )  
            }
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <br/><br/>
        <br/>

        <Row span={2} style={{textAlign: 'center'}}><h2>{this.state.ou_name+"人员合同信息"}</h2></Row>
        <br/>

        <Card >
          <br/>
          <Table
            columns={this.person_post_columns}
            dataSource={importContractData }
            pagination={true}
            scroll={{y: 400}}
          />
        </Card>

        <br/>

        <div style={{ textAlign: 'center'}}>
          <Button onClick={this.gotoHome} disabled={this.state.isSaveClickable ? false : (this.state.isSuccess ? false :  true)}>关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.saveAction} disabled={!this.state.isSaveClickable} disabled={this.state.saveFlag}>{this.state.isSaveClickable ? '提交' : (this.state.isSuccess ? '已成功同步' :  '正在处理中...')}</Button>

        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.importContractModel,
    ...state.importContractModel
  };
}

ImportContract = Form.create()(ImportContract);
export default connect(mapStateToProps)(ImportContract);
