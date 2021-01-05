/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-19
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现员工部门信息维护功能
 */
import React from 'react';
import {connect } from 'dva';
import {Table,Button,Pagination,Select,Input,Modal} from 'antd';
import styles from './staffPost.less';
import StaffDeptChangeModal from './staffDeptChangeModal.js';
import DataSyncTips from "../../../components/hr/dataSyncTips";
import Cookie from 'js-cookie';
import {OU_NAME_CN,OU_HQ_NAME_CN,HR_ADMIN} from '../../../utils/config';
const Option = Select.Option;
import DeptEdit from '../common/depedit.js'
/**
*  作者: 耿倩倩
*  创建日期: 2017-09-19
*  功能：实现员工部门信息维护功能
*/
class staffDeptEdit extends React.Component {
  constructor(props) {super(props);}
  state = {
    ou:null,
    dept:'',
    post:'',
    text:'',
    pVisible:false
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-20
   * 功能：改变OU，触发查询部门和职务的服务，重新获取该OU下的部门和职务列表
   * @param value 传入的值
   */
  handleOuChange = (value) => {
    this.setState ({
      ou: value,
      dept:'',
      post:'',
      text:''
    });
    const {dispatch} = this.props;
    dispatch({
      type:'staffDeptEdit/getDept',
      arg_param: value
    });
    dispatch({
      type:'staffDeptEdit/getPost',
      arg_param: value
    });
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-08-20
   * 功能：处理部门切换
   * @param value 传入的值
   */
  handleDeptChange = (value) => {
    this.setState ({
      dept: value
    })
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-20
   * 功能：处理职务切换
   * @param value 传入的值
   */
  handlePostChange = (value) => {
    this.setState ({
      post: value
    })
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-20
   * 功能：处理文本框的模糊查询输入
   * @param e 事件
   */
  handleTextChange = (e) => {
    this.setState ({
      text: e.target.value
    })
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-20
   * 功能：清空查询条件，只保留OU
   */
  clear = () => {
    this.setState ({
      dept:'',
      post:'',
      text:''
    });
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-20
   * 功能：查询
   */
  search = () => {
    const auth_tenantid = Cookie.get('tenantid');
    const auth_ou = Cookie.get('OU');
    let ou_search = this.state.ou;
    if(this.state.ou === null){
      ou_search = auth_ou;
    }
    if(ou_search === OU_HQ_NAME_CN){ //选中联通软件研究院本部，传参：联通软件研究院
      ou_search = OU_NAME_CN;
    }
    let arg_params = {};
    arg_params["arg_tenantid"] = auth_tenantid;
    arg_params["arg_allnum"] = 0; //固定参数
    arg_params["arg_page_size"] = 10;
    arg_params["arg_page_current"] = 1;
    arg_params["arg_ou_name"] = ou_search;
    arg_params["arg_post_type"] = '0';
    arg_params["arg_employ_type"] = '正式';
    if(this.state.dept !== ''){
      arg_params["arg_dept_name"] = ou_search + '-' + this.state.dept; //部门传参加上前缀
    }
    if(this.state.post !== ''){
      arg_params["arg_post_name"] = this.state.post;
    }
    if(this.state.text !== ''){
      arg_params["arg_all"] = this.state.text;
    }
    const {dispatch} = this.props;
    dispatch({
      type: 'staffDeptEdit/staffDeptSearch',
      arg_param: arg_params
    });
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-20
   * 功能：点击分页
   * @param page 页码
   */
  handlePageChange = (page) => {
    let queryParams = this.props.postData;
    queryParams.arg_page_current = page;  //将请求参数设置为当前页
    const {dispatch} = this.props;
    dispatch({
      type: 'staffDeptEdit/staffDeptSearch',
      arg_param: queryParams
    });
  };

  handleOk = e => {
    this.setState({
      pVisible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      pVisible: false,
    });
  };

  showbatch = () => {
    this.setState({
      pVisible: true,
    });
  };

  columns = [
    {
      title:'员工编号',
      dataIndex:'staff_id'
    },
    {
      title:'姓名',
      dataIndex:'username'
    },
    {
      title:'部门',
      dataIndex:'deptname',
      render:(text, record)=>{
        return (record.deptname.split('-')[1]);
      }
    },
    {
      title:'职务',
      dataIndex:'post_name'
    },
    {
      title:'用工类型',
      dataIndex:'employ_type'
    },
    {
      title:'操作类型',
      dataIndex:'',
      render:(text, record, index)=>{
        return <div style={{textAlign:"center"}}>
          <div>
            <Button type="danger"
                    onClick={()=>this.refs.staffDeptChangeModal.showModal(record,this.props.dispatch)}>
              变更部门</Button>
          </div>
        </div>
      }
    }
  ];

  render() {
    const{loading, tableDataList, ouList, deptList, postList, dispatch, postData, flag_change, staffDeptChangeDate} = this.props;
    const ouOptionList = ouList.map((item) => {
      return (
        <Option key={item.OU}>
          {item.OU}
        </Option>
      )
    });
    const deptOptionList = deptList.map((item) => {
      return (
        <Option key={item}>
          {item}
        </Option>
      )
    });
    const postOptionList = postList.map((item) => {
      return (
        <Option key={item.post_name}>
          {item.post_name}
        </Option>
      )
    });
    // 这里为每一条记录添加一个key，从0开始
    if(tableDataList.length){
      tableDataList.map((i,index)=>{
        i.key=index;
      })
    }
    const auth_userid = Cookie.get('userid');
    const auth_ou = Cookie.get('OU');
    return (
      <div className={styles.meetWrap}>
        {/*<div className={styles.headerName}>{'变更部门'}</div>*/}
        <div style={{marginBottom:'15px'}}>
          <span>组织单元：</span>
          {auth_userid !== HR_ADMIN ?
            <Select style={{width: 160}}  onSelect={this.handleOuChange} defaultValue={auth_ou} disabled>
              {ouOptionList}
            </Select>
            :
            <Select style={{width: 160}}  onSelect={this.handleOuChange} defaultValue={auth_ou}>
              {ouOptionList}
            </Select>
          }
          &nbsp;&nbsp;&nbsp;部门：
          <Select style={{width: 200}}  onSelect={this.handleDeptChange} value={this.state.dept}>
            {deptOptionList}
          </Select>
          &nbsp;&nbsp;&nbsp;职务：
          <Select style={{width: 120}}  onSelect={this.handlePostChange} value={this.state.post}>
            {postOptionList}
          </Select>
          &nbsp;&nbsp;&nbsp;
          <Input style={{width: 200}} placeholder="姓名/员工编号/邮箱前缀/手机" onChange={this.handleTextChange} value={this.state.text}/>
          <div className={styles.btnLayOut}>
           {/* <Button type="primary" onClick={()=>this.showbatch()} >{'批量修改'}</Button> */}
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={()=>this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={()=>this.clear()}>{'清空'}</Button>
          </div>
        </div>
        <Table columns={this.columns}
               dataSource={tableDataList}
               pagination={false}
               className={styles.orderTable}
               loading={loading}
               //style = {{cursor:"pointer"}}
               bordered={true}
        />
        {/*加载完才显示页码*/}
        {loading !== true ?
          <Pagination current={this.props.currentPage}
                      total={Number(this.props.total)}
                      showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
                      pageSize={10}
                      onChange={this.handlePageChange}
                      className={styles.pagination}
          />
          :
          null
        }

        {/*变更部门对话框*/}
        <StaffDeptChangeModal
          loading={loading}
          ref='staffDeptChangeModal'
          dispatch={dispatch}
          postData={postData}
          deptList={deptList}
          staffDeptChangeDate = {staffDeptChangeDate}
        />

        {/*数据同步提示框*/}
        <DataSyncTips
          ref="dataSyncTips"
          dispatch = {dispatch}
          flag_change = {flag_change}
          param_service = {'staffDeptEdit/staffDeptSearch'}
          param_setFlag = {'staffDeptEdit/setFlag'}
          postData = {postData}
        />
         {/* 批量修改部门弹出框 */}
         <Modal
          title="批量修改"
          visible={this.state.pVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
       <DeptEdit></DeptEdit>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const {
    tableDataList,
    ouList,
    deptList,
    postList,
    postData,
    total,
    currentPage,
    flag_change,
    staffDeptChangeDate
  } = state.staffDeptEdit;
  return {
    loading: state.loading.models.staffDeptEdit,
    tableDataList,
    ouList,
    deptList,
    postList,
    postData,
    total,
    currentPage,
    flag_change,
    staffDeptChangeDate
  };
}

export default connect(mapStateToProps)(staffDeptEdit);
