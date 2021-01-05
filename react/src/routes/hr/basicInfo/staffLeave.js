/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-07
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现员工离职功能
 */
import React from 'react';
import {connect } from 'dva';
import {Table,Button,Pagination,Select,Input} from 'antd';
import styles from './staffPost.less';
import StaffLeaveModal from './staffLeaveModal.js';
import DataSyncTips from "../../../components/hr/dataSyncTips";
import Cookie from 'js-cookie';
import {OU_NAME_CN,OU_HQ_NAME_CN,HR_ADMIN} from '../../../utils/config';
const Option = Select.Option;
/**
 * 作者：耿倩倩
 * 创建日期：2017-09-07
 * 功能：实现员工离职功能
 */
class staffLeave extends React.Component {
  constructor(props) { super(props);}
  state = {
    ou:null,
    dept:'',
    post:'',
    text:''
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-07
   * 功能：改变OU，触发查询部门和职务的服务，重新获取该OU下的部门和职务列表
   * @param value 传入的OU值
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
      type:'staffLeave/getDept',
      arg_param: value
    });
    dispatch({
      type:'staffLeave/getPost',
      arg_param: value
    });
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-07
   * 功能：处理改变部门
   * @param value 传入的OU值
   */
  handleDeptChange = (value) => {
    this.setState ({
      dept: value
    })
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-07
   * 功能：处理改变职务
   * @param value 传入的OU值
   */
  handlePostChange = (value) => {
    this.setState ({
      post: value
    })
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-07
   * 功能：处理模糊查询文本框的输入
   * @param e 事件
   */
  handleTextChange = (e) => {
    this.setState ({
      text: e.target.value
    })
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-07
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
   * 创建日期：2017-09-07
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
      type: 'staffLeave/staffLeaveSearch',
      arg_param: arg_params
    });
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-07
   * 功能：处理点击分页
   */
  handlePageChange = (page) => {
    let queryParams = this.props.postData;
    queryParams.arg_page_current = page;  //将请求参数设置为当前页
    const {dispatch} = this.props;
    dispatch({
      type: 'staffLeave/staffLeaveSearch',
      arg_param: queryParams
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
      render:(text, record)=>{
        return <div style={{textAlign:"center"}}>
          <div>
            <Button type="danger" onClick={()=>this.refs.staffLeaveModal.showModal(record,this.props.dispatch)}>办理离职</Button>
          </div>
        </div>
      }
    }
  ];

  render() {
    const{loading, tableDataList, ouList, deptList, postList, dispatch, postData, flag_change} = this.props;
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
        {/*<div className={styles.headerName}>{'员工离职'}</div>*/}
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
            <Button type="primary" onClick={()=>this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={()=>this.clear()}>{'清空'}</Button>
          </div>
        </div>
        <Table columns={this.columns}
               dataSource={tableDataList}
               pagination={false}
               className={styles.orderTable}
               bordered={true}
               loading={loading}
               style = {{cursor:"pointer"}}
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

        {/*办理离职对话框*/}
        <StaffLeaveModal
          loading={loading}
          ref='staffLeaveModal'
          dispatch={dispatch}
          postData={postData}
        />

        {/*数据同步提示框*/}
        <DataSyncTips
          ref="dataSyncTips"
          dispatch = {dispatch}
          flag_change = {flag_change}
          param_service = {'staffLeave/staffLeaveSearch'}
          param_setFlag = {'staffLeave/setFlag'}
          postData = {postData}
        />
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
    flag_change} = state.staffLeave;
  return {
    loading: state.loading.models.staffLeave,
    tableDataList,
    ouList,
    deptList,
    postList,
    postData,
    total,
    currentPage,
    flag_change
  };
}

export default connect(mapStateToProps)(staffLeave);
