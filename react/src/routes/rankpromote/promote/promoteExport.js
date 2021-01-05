/**
 *  作者: 王福江
 *  创建日期: 2020-02-18
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：员工晋升晋档路径生成导出
 */
import React from 'react';
import {connect} from 'dva';
import {Table,Card,Popconfirm,Button,Pagination,Select,Input,Tooltip,Icon,DatePicker,Modal,Form} from 'antd';
import styles from './style.less';
const FormItem = Form.Item;
import Cookie from 'js-cookie';
import {routerRedux} from "dva/router";
import {OU_HQ_NAME_CN, OU_NAME_CN} from "../../../utils/config";
import message from "../../../components/commonApp/message";
const Option = Select.Option;
const auth_tenantid = Cookie.get('tenantid');
import moment from 'moment'
import exportExl from "./exportRankPath";

class promoteExport extends React.Component{
  constructor(props) {
    super(props);
  }
  state = {
    ou:'',
    dept: Cookie.get('dept_id'),
    path: '',
    isClickable: true,
  };
  //改变OU，触发查询部门和职务的服务，重新获取该OU下的部门和职务列表。
  handleOuChange = (value) => {

  };
  //选择部门
  handleDeptChange = (value) => {
    this.setState ({
      dept: value
    })
  };
  //选择路径
 /* handlePathChange = (value) => {
    this.setState ({
      path: value
    })
  };*/
  //查询
  search = () => {
    let arg_params = {};
    arg_params["arg_ou_id"] = Cookie.get('OUID');
    if(this.state.dept !== ''){
      arg_params["arg_dept_id"] = this.state.dept; //部门传参加上前缀
    }
    /*if(this.state.path !== ''){
      arg_params["arg_path"] = this.state.path; //部门传参加上前缀
    }*/
    const {dispatch} = this.props;
    dispatch({
      type: 'promoteExportModel/PromotePathSearch',
      arg_param: arg_params
    });
  }
  //导出数据
  exportTable=()=>{
    let  ou_name = Cookie.get("OU");
    var tableName = ou_name+'-晋升路径信息';
    //数据源
    const {searchDataList} = this.props;
    if(searchDataList !== null && searchDataList.length !== 0){
      exportExl( searchDataList, tableName, this.columns)
    }else{
      message.info("导出数据为空！")
    }
  }
  //生成路径数据
  getPromotePath=()=>{
    let arg_params = {};
    arg_params["arg_ou_id"] = Cookie.get('OUID');
    let year = new Date().getFullYear();
    arg_params["arg_year"] = year-1;
    arg_params["arg_now_year"] = year;

    const {dispatch} = this.props;
    this.setState({ isClickable: false });
    return new Promise((resolve) => {
      dispatch({
        type:'promoteExportModel/doPromotePath',
        arg_param: arg_params,
        resolve,
      });
    }).then((resolve) => {
        this.setState({ isClickable: true });
    }).catch(() => {
      this.setState({ isClickable: true });
    });
  }

  columns = [
    { title: '序号', dataIndex: 'indexID',width:'50px',},
    { title: '姓名', dataIndex: 'user_name',width:'80px'},
    { title: '员工编号', dataIndex: 'user_id',width:'80px'},
    { title:'部门名称', dataIndex:'dept_name',width: '8%',
      render:(text, record, index)=>{
        return (record.dept_name.split('-')[1]);
      }},
    { title: '年度', dataIndex: 'year' ,width:'60px'},
    { title: '前职级薪档', dataIndex: 'rank_before'},
    { title: '上年度考核', dataIndex: 'last_year_rank'},
    { title: '人才标识', dataIndex: 'talent_name'},
    { title: '符合人才路径', dataIndex: 'talent_path_if'},
    /*{ title: '职级薪档-1', dataIndex: 'talent_path_rank'},*/
    { title: '符合保底晋级', dataIndex: 'guarantee_path_if'},
    /*{ title: '职级薪档-2', dataIndex: 'guarantee_path_rank'},*/
    { title: '符合GD档封顶晋级', dataIndex: 'gdtop_path_if'},
    { title: '晋级后职级薪档', dataIndex: 'path_rank'},
    /*{ title: '职级薪档-3', dataIndex: 'gdtop_path_rank'},*/
    { title: '符合调整薪档', dataIndex: 'normal_path_if'},
    { title: '调整薪档后职级薪档', dataIndex: 'normal_path_rank'},
    { title: '备注', dataIndex: 'remark'}
  ];

  render() {
    const{loading, searchDataList, ouList, deptList} = this.props;
    console.log("deptList:"+JSON.stringify(deptList));
    const ouOptionList = ouList.map((item) => {
      return (
        <Option key={item.OU}>
          {item.OU}
        </Option>
      )
    });
    const deptOptionList = deptList.map((item) => {
      return (
        <Option key={item.court_dept_id}>
          {item.court_dept_name}
        </Option>
      )
    });
    /*const pathOptionList = pathList.map((item) => {
      return (
        <Option key={item.path_name}>
          {item.path_name}
        </Option>
      )
    });*/
    const auth_ou = Cookie.get('OU');
    const auth_dept = Cookie.get('dept_name');

    return (
      <div className={styles.meetWrap}>
        <div className={styles.headerName} style={{marginBottom:'15px'}}>{'职级晋升查询'}</div>
        <div style={{marginBottom:'15px'}}>
          <span>组织单元：</span>
          <Select style={{width: 160}}  onSelect={this.handleOuChange} defaultValue={auth_ou} disabled={true}>
            {ouOptionList}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;部门：
          <Select style={{width: 200}}  onSelect={this.handleDeptChange} defaultValue={auth_dept}>
            <Option key='all'>全部</Option>
            {deptOptionList}
          </Select>
          {/*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;路径：
          <Select style={{width: 300}}  onSelect={this.handlePathChange} defaultValue= '全部'>
            <Option key='all'>全部</Option>
            {pathOptionList}
          </Select>*/}

          <div className={styles.btnLayOut}>
            <Button type="primary" onClick={()=>this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" disabled={searchDataList[0]?false:true} onClick={this.exportTable}>导出</Button>&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary"  onClick={this.getPromotePath} disabled={!this.state.isClickable}>{this.state.isClickable ? '生成晋升路径' : '正在处理中...'}</Button>&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>

        <Table
          columns={this.columns}
          dataSource={searchDataList}
          pagination={true}
          loading={loading}
          bordered={true}
          className={styles.tableStyle}
        />
      </div>
    );
  }
}
function mapStateToProps (state) {
  const {
    searchDataList,
    ouList,
    deptList
  } = state.promoteExportModel;
  return {
    loading: state.loading.models.promoteExportModel,
    searchDataList,
    ouList,
    deptList
  };
}
promoteExport = Form.create()(promoteExport);
export default connect(mapStateToProps)(promoteExport);
