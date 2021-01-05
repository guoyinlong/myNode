/**
 * 文件说明：
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-01-08
 **/
import React from 'react';
import {connect} from 'dva';
import {Table,Card,Popconfirm,Button,Pagination,Select,Input,Tooltip,Icon,DatePicker,Modal,Form} from 'antd';
import styles from './basicInfo.less';
const FormItem = Form.Item;
import Cookie from 'js-cookie';
import {routerRedux} from "dva/router";
import {OU_HQ_NAME_CN, OU_NAME_CN} from "../../../utils/config";
import message from "../../../components/commonApp/message";
const Option = Select.Option;
const auth_tenantid = Cookie.get('tenantid');
import moment from 'moment'
import exportExl from "../../cost/exportExlForImportLabor";
class promoteInfo extends React.Component{
  constructor(props) {
    super(props);
  }
  state = {
    ou:'',
    dept: Cookie.get('dept_id'),
    visible:false,
    visible2:false,
    del_name:'',
    del_user_id:'',
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
  //查询
  search = () => {
    let arg_params = {};
    arg_params["arg_page_size"] = 20;
    arg_params["arg_page_current"] = 1;
    arg_params["arg_ou_id"] = Cookie.get('OUID');
    if(this.state.dept !== ''){
      arg_params["arg_dept_id"] = this.state.dept; //部门传参加上前缀
    }
    arg_params["arg_person_name"] = this.props.form.getFieldValue("person_name");
    const {dispatch} = this.props;
    dispatch({
      type: 'promoteListModel/promoteSearch',
      arg_param: arg_params
    });
  }
  //处理分页
  handlePageChange = (page) => {
    let queryParams = this.props.postData;
    queryParams.arg_page_current = page;  //将请求参数设置为当前页
    const {dispatch} = this.props;
    dispatch({
      type: 'promoteListModel/promoteSearch',
      arg_param: queryParams
    });
  };
  exportTable=()=>{
    let  ou_name = Cookie.get("OU");
    var tableName = ou_name+'-晋升信息';

    //数据源
    const {tableDataList} = this.props;
    if(tableDataList !== null && tableDataList.length !== 0){
      exportExl( tableDataList, tableName, this.export_rank_columns)
    }else{
      message.info("导出数据为空！")
    }
  }
  //晋升历史
  promoteHistory = (record) => {
    console.log("record==="+JSON.stringify(record));
    let arg_user_id = record.user_id;
    const {dispatch} = this.props;
    dispatch({
      type: 'promoteListModel/promotePersonSearch',
      arg_user_id
    });
    this.setState ({visible: true});
  };
  columns = [
    { title: '序号', dataIndex: 'indexID',width:'90px',},
    { title: '姓名', dataIndex: 'user_name',width:'150px'},
    { title: '员工编号', dataIndex: 'user_id',width:'150px'},
    { title:'部门名称', dataIndex:'dept_name',width: '10%',
      render:(text, record, index)=>{
        return (record.dept_name.split('-')[1]);
      }},
    { title: '年度', dataIndex: 'year' ,width:'100px'},
    { title: '前职级薪档', dataIndex: 'rank_sequence_before',width:'150px'},
    { title: '现职级薪档', dataIndex: 'rank_sequence',width:'150px'},
    { title: '推荐晋升路径', dataIndex: 'promote_path',width:'150px'},
    { title: '操作', dataIndex: '', width:'150px', key: 'x', render: (text,record) => (
        <span>
        <span>
        <a onClick={()=>this.promoteHistory(record)}>晋升记录</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span>
</span>
) },
];
columns2 = [
  { title: '序号', dataIndex: 'indexID',width:'50px',},
  { title: '姓名', dataIndex: 'user_name',width:'80px'},
  { title: '员工编号', dataIndex: 'user_id',width:'80px'},
  { title:'部门名称', dataIndex:'dept_name',width: '8%',
    render:(text, record, index)=>{
      return (record.dept_name.split('-')[1]);
    }},
  { title: '年度', dataIndex: 'year' ,width:'60px'},
  { title: '前职级薪档', dataIndex: 'rank_sequence_before',width:'100px'},
  { title: '现职级薪档', dataIndex: 'rank_sequence',width:'120px'},
  { title: '推荐晋升路径', dataIndex: 'promote_path',width:'100px'},
];

export_rank_columns = [
  { title: '序号', dataIndex: 'indexID',width:'50px',},
  { title: '姓名', dataIndex: 'user_name',width:'80px'},
  { title: '员工编号', dataIndex: 'user_id',width:'80px'},
  { title:'部门名称', dataIndex:'dept_name',width: '8%'},
  { title: '年度', dataIndex: 'year' ,width:'60px'},
  { title: '前职级薪档', dataIndex: 'rank_sequence_before',width:'100px'},
  { title: '现职级薪档', dataIndex: 'rank_sequence',width:'120px'},
  { title: '推荐晋升路径', dataIndex: 'promote_path',width:'100px'},
];
handleCancel = () => {
  this.setState ({visible: false});
};
render() {
  const{loading, tableDataList,historyDataList, ouList, deptList, if_human} = this.props;
  console.log("historyDataList==="+JSON.stringify(historyDataList));
  const { getFieldDecorator } = this.props.form;
  const ouOptionList = ouList.map((item) => {
    return (
      <Option key={item.OU}>
      {item.OU}
      </Option>
  )
  });
  const deptOptionList = deptList.map((item) => {
    return (
      <Option key={item.deptid}>
      {item.deptname}
      </Option>
  )
  });
  const auth_ou = Cookie.get('OU');
  const auth_dept = Cookie.get('dept_name');
  let auth_user = Cookie.get('username');
  if(if_human===false){
    auth_user = '';
  }
  /*this.setState ({
    dept: auth_dept
  })*/
  return (
    <div className={styles.meetWrap}>
    <div className={styles.headerName} style={{marginBottom:'15px'}}>{'职级晋升查询'}</div>
  <div style={{marginBottom:'15px'}}>
<span>组织单元：</span>
  <Select style={{width: 160}}  onSelect={this.handleOuChange} defaultValue={auth_ou} disabled={true}>
    {ouOptionList}
    </Select>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;部门：
<Select style={{width: 200}}  onSelect={this.handleDeptChange} defaultValue={auth_dept} disabled={if_human}>
    <Option key=' '>全部</Option>
  {deptOptionList}
</Select>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;员工姓名：
  {getFieldDecorator('person_name',{
    initialValue: auth_user
  })(
  <Input style={{width: 200}}  disabled={if_human}/>
  )}

<div className={styles.btnLayOut}>
    <Button type="primary" onClick={()=>this.search()}>{'查询'}</Button>
  &nbsp;&nbsp;&nbsp;
    <Button type="primary" disabled={tableDataList[0]?false:true} onClick={this.exportTable}>导出</Button>&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;
</div>
  </div>

  <Table
  columns={this.columns}
  dataSource={tableDataList}
  pagination={false}
  loading={loading}
  bordered={true}
  scroll={{x: '100%', y: 450}}
  />

  {/*加载完才显示页码*/}
  {loading !== true ?
  <Pagination current={this.props.currentPage}
    total={Number(this.props.total)}
    showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
    pageSize={20}
    onChange={this.handlePageChange}
    />
  :
    null
  }

  {/* <div style={{textAlign:'right'}}>
          <Button type="primary" onClick={this.exportExcel} style={{marginRight:'8px'}}>{'导出'}</Button>
        </div>*/}
<Modal
  title="职级晋升记录"
  visible={this.state.visible}
  onCancel={this.handleCancel}
  width={'1200px'}
  footer={[
    <Button key="submit" type="primary" size="large" onClick={this.handleCancel}>
    关闭
    </Button>
]}
>
<div>
  <Form>
  <Table
  columns={this.columns2}
  dataSource={historyDataList}
  pagination={false}
  bordered={true}
  />
  </Form>
  </div>
  </Modal>
  </div>
);
}
}
function mapStateToProps (state) {
  const {
    tableDataList,
    historyDataList,
    ouList,
    deptList,
    postData,
    total,
    currentPage,
    if_human
  } = state.promoteListModel;
  return {
    loading: state.loading.models.promoteListModel,
    tableDataList,
    historyDataList,
    ouList,
    deptList,
    postData,
    total,
    currentPage,
    if_human
  };
}
promoteInfo = Form.create()(promoteInfo);
export default connect(mapStateToProps)(promoteInfo);
