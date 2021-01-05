 /**
 * 文件说明：查看请假管理已办信息
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-04-27
 */
import React from 'react';
import {Form,Row,Col,Input,Button, DatePicker, Select, Modal, TreeSelect, message, Card, Radio, Transfer, Table} from 'antd';
import { routerRedux } from "dva/router";
import { connect } from "dva";
import styles from './style.less';
 import ExcelImportYear from "./excelImportYear";
 import Cookie from "js-cookie";


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const auth_ou = Cookie.get("OU");
class year_import extends React.Component {
  constructor(props) {
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
  columns = [
    { title: '序号', dataIndex: 'rowKey'},
    { title: '组织机构', dataIndex: 'deptname'},
    { title: '员工编号', dataIndex: 'user_id'},
    { title: '员工姓名', dataIndex: 'user_name' },
    { title: '年度', dataIndex: 'curr_year' },
    { title: '工龄计算起始日期', dataIndex: 'work_start_time'},
    { title: '已使用年假天数', dataIndex: 'break_used'},
    { title: '剩余年假天数', dataIndex: 'break_remain'},
  ];
   //更新状态
  updateVisible = (value) =>{
    if(value === true){
      this.setState({
        showTablesDataFlag: 1,
        saveFlag: false,
      });
    }
  };
  //结束关闭
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/absence/yearpersoninfo'
    }));
  }
  //导入保存
  saveAction = () => {
    this.setState({ isSaveClickable: false });
    const{dispatch} = this.props;
    let yearImportData = this.props.yearImportData;
    /*非空校验*/
    if(yearImportData.length < 1){
      message.error('导入合同信息为空，请填写后提交');
      this.setState({ isSaveClickable: true });
      return;
    }

    return new Promise((resolve) => {
      dispatch({
        //合同信息保存
        type:'year_person_info_model/yearImportSubmit',
        yearImportData,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        this.setState({ isSaveClickable: false });
        this.setState({ isSuccess: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/absence/yearpersoninfo'}));
        },500);
      }
      if(resolve === 'false')
      {
        this.setState({ isSaveClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/absence/yearpersoninfo'}));
    });
  };
  //结束关闭
  gotoHome = () => {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/absence/yearpersoninfo'
    }));
  };
  render() {
    let importYearData = this.props.yearImportData;
    return (
      <div>
        <br/><br/>
        <br/>
        <div style={{ float: 'left'}}>
          <span> 组织单元： </span>
          <Select style={{width: 160}} defaultValue={auth_ou} disabled={true}>
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="/filemanage/download/needlogin/hr/yearAbsenceModel.xlsx" ><Button disabled={this.state.isSaveClickable ? false : (this.state.isSuccess ? false :  true)}>{'员工年假导入模板下载'}</Button></a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {
            this.state.isSaveClickable ?
              <ExcelImportYear dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
              : (this.state.isSuccess ?
                <ExcelImportYear dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
                :
                null
              )
          }
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <br/><br/>
        <br/>

        <Row span={2} style={{textAlign: 'center'}}><h2>{this.state.ou_name+"人员年休假信息"}</h2></Row>
        <br/>

        <Card >
          <br/>
          <Table
            columns={this.columns}
            dataSource={importYearData }
            pagination={true}
          />
        </Card>

        <br/>

        <div style={{ textAlign: 'center'}}>
          <Button onClick={this.gotoHome} disabled={this.state.isSaveClickable ? false : (this.state.isSuccess ? false :  true)}>关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.saveAction} disabled={!this.state.isSaveClickable} disabled={this.state.saveFlag}>{this.state.isSaveClickable ? '提交' : (this.state.isSuccess ? '已成功同步' :  '正在处理中...')}</Button>

        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.year_person_info_model,
    ...state.year_person_info_model,
  };
}

year_import = Form.create()(year_import);
export default connect(mapStateToProps)(year_import)
