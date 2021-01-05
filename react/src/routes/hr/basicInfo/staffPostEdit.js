/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-11
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现员工职务信息维护功能
 */
import React from 'react';
import {connect } from 'dva';
import { Table,Popconfirm,message,Tabs,Modal,Form,Input,Select,Button,Pagination } from 'antd';
import styles from './staffPost.less';
import DataSyncTips from "../../../components/hr/dataSyncTips";
import Cookie from 'js-cookie';
import 'moment/locale/zh-cn';
import {OU_HQ_NAME_CN,OU_NAME_CN,HR_ADMIN} from '../../../utils/config'
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
let flag_tab = '0'; //标记是哪个tab，从而改变查询按钮传参arg_post_type
/**
 * 作者：耿倩倩
 * 创建日期：2017-09-11
 * 功能：实现修改职务的表单
 */
class ModifyForm extends React.Component{

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：核对职务名称
   */
  checkPostName = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value === form.getFieldValue('pre_post_name')) {
      callback('不能和之前职务一样!');
    } else {
      callback();
    }
  };

  render(){
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 7
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 11
        }
      }
    };

    return (
      <Form>
        <FormItem label="姓名" {...formItemLayout}>
          {getFieldDecorator('username',{
            initialValue:this.props.username})(<Input disabled={true}/>)}
        </FormItem>
        {/*<FormItem label="部门" {...formItemLayout}>*/}
          {/*{getFieldDecorator('deptname',{*/}
            {/*initialValue:this.props.deptname.split('-')[1]})(<Input disabled={true}/>)}*/}
        {/*</FormItem>*/}
        <FormItem label="当前职务" {...formItemLayout}>
          {getFieldDecorator('pre_post_name',{
            initialValue:this.props.post_name})(<Input disabled={true}/>)}
        </FormItem>
        <FormItem label="新职务" {...formItemLayout}>
          {getFieldDecorator('new_post_name',{
            rules: [{
              required: true
            }, {
              validator:this.checkPostName
            }]
            })(
            <Select disabled={false}>
              {this.props.postOptionList}
            </Select>)}
        </FormItem>
      </Form>
    );
  }
}

/**
 * 作者：耿倩倩
 * 创建日期：2017-09-11
 * 功能：实现修改职务的对话框
 */
class ModifyPostModal extends React.Component{
  constructor(props){ super(props);}
  state = { visible: false };
  showModal = (record) => {
    //添加职务选择列表
    let postOptionListTemp = [];
    for (let i = 0; i < this.props.postList.length; i++) {
      postOptionListTemp.push(<Option key={this.props.postList[i].post_name}>{this.props.postList[i].post_name}</Option>);
    }
    //let post_type = (record.post_type===0)?'主岗':'兼职';
    this.setState({
      visible: true,
      staff_id:record.staff_id,
      username:record.username,
      post_name:record.post_name,
      deptname:record.deptname,
      uuid:record.uuid,
      postOptionList:postOptionListTemp
    });

  };

  handleOk = (e) => {
    e.preventDefault();
    this.refs.modifyFormNew.validateFieldsAndScroll((error, values) => {
      if (!error) {
        let auth_tenantid = Cookie.get('tenantid');
        let postData_c = {};
        postData_c["arg_tenantid"] = auth_tenantid;
        postData_c["arg_userid"] = this.state.staff_id;
        postData_c["arg_uuid"] = this.state.uuid;
        postData_c["arg_deptname"] = this.state.deptname;
        postData_c["arg_postname"] = values.new_post_name;   //通过form的validateFields获取
        const {dispatch} = this.props;
        dispatch({
          type:'staffPostEdit/modifyPost',
          param:postData_c,
        });
        this.setState({visible: false});
      }
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const ModifyFormNew = Form.create()(ModifyForm);
    return (
      <Modal
        title="修改职务"
        visible={this.state.visible}
        onOk={this.handleOk}
        okText = "确定"
        onCancel={this.handleCancel}
      >
        <ModifyFormNew
          ref = "modifyFormNew"
          visible = {this.state.visible}
          staff_id = {this.state.staff_id}
          username = {this.state.username}
          deptname = {this.state.deptname}
          post_name = {this.state.post_name}
          postOptionList = {this.state.postOptionList}
        />
      </Modal>
    );
  }
}

/**
 * 作者：耿倩倩
 * 创建日期：2017-09-11
 * 功能：实现新增兼职的对话框
 */
class AddPostModal extends React.Component{
  state = { visible: false };
  showModal = (record) => {
    //添加职务选择列表
    let postOptionListTemp = [];
    for (let i = 0; i < this.props.postList.length; i++) {
      postOptionListTemp.push(<Option key={this.props.postList[i].post_name}>{this.props.postList[i].post_name}</Option>);
    }

    //添加部门选择列表
    let deptOptionListTemp = [];
    for (let i = 0; i < this.props.deptList.length; i++){
      deptOptionListTemp.push(<Option key={this.props.deptList[i]}>{this.props.deptList[i]}</Option>);
    }
    //let post_type = (record.post_type==0)?'主岗':'兼职';
    this.setState({
      visible: true,
      staff_id:record.staff_id,
      username:record.username,
      deptname:record.deptname.split('-')[1],
      deptname_pre:record.deptname.split('-')[1],
      post_name:record.post_name,
      post_name_pre:record.post_name,
      post_type:'1',
      postOptionList:postOptionListTemp,
      deptOptionList:deptOptionListTemp
    });
  };

  handleOk = () => {
    let auth_tenantid = Cookie.get("tenantid");
    let pre_ou = Cookie.get('OU');
    if(pre_ou === OU_HQ_NAME_CN){
      pre_ou = OU_NAME_CN; //取 联通软件研究院
    }
    let postData = {};
    postData["arg_tenantid"] = auth_tenantid;
    postData["arg_user_id"] = this.state.staff_id;
    postData["arg_dept_name"] = pre_ou + '-' + this.state.deptname;
    postData["arg_post"] = this.state.post_name;
    //如果部门和职务都没有发生变化，则提示修改其中一项
    if(this.state.deptname === this.state.deptname_pre && this.state.post_name === this.state.post_name_pre ){
      message.warning("部门或者职务需要修改一项！");
    }else{
      const{dispatch} = this.props;
      dispatch({
        type:'staffPostEdit/newAddPartTimeJob',
        param:postData,
        //queryParams:this.props.queryParams
      });
      this.setState({visible: false});
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  setDeptName = (value) =>{this.setState({deptname:value});};

  setPostName =(value)=>{this.setState({post_name:value});};

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 7
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 11
        }
      }
    };
    //const tabsData= this.getTabsData(this.state.time_quantum)
    return (
      <div>
        <Modal
          title="新增兼职"
          visible={this.state.visible}
          onOk={this.handleOk}
          okText = "确定"
          onCancel={this.handleCancel}
        >
          <Form  className="login-form">
            {/*<FormItem label="员工编号" {...formItemLayout}>*/}
              {/*<Input disabled={true}  value={this.state.staff_id}/>*/}
            {/*</FormItem>*/}
            <FormItem label="姓名" {...formItemLayout}>
              <Input disabled={true}  value={this.state.username}/>
            </FormItem>
            <FormItem label="部门" {...formItemLayout} >
              {/*<DeptTreeSelect ref="setDeptName" value={this.state.deptname} />*/}
              <Select onSelect={this.setDeptName} value={this.state.deptname}>
                {this.state.deptOptionList}
              </Select>
            </FormItem>
            <FormItem label="职务" {...formItemLayout}>
              <Select onSelect={this.setPostName} value={this.state.post_name}>
                {this.state.postOptionList}
              </Select>
            </FormItem>
            {/*<FormItem label="职务类型" {...formItemLayout}>*/}
              {/*<Input disabled={true}  value={"兼职"}/>*/}
            {/*</FormItem>*/}
          </Form>
        </Modal>
      </div>
    );
  }
}

/**
 * 作者：耿倩倩
 * 创建日期：2017-09-11
 * 功能：实现员工职务信息维护页面表格
 */
class StaffPostTable extends React.Component {
  constructor(props) {super(props);}
  state = {
    ou:null,
    dept:'',
    post:'',
    text:''
  };

//改变OU，触发查询部门和职务的服务，重新获取该OU下的部门和职务列表。
  handleOuChange = (value) => {
    this.setState ({
      ou: value,
      dept:'',
      post:'',
      text:''
    });
    const {dispatch} = this.props;
    dispatch({
      type:'staffPostEdit/getDept',
      arg_param: value
    });
    dispatch({
      type:'staffPostEdit/getPost',
      arg_param: value
    });
  };

  //选择部门
  handleDeptChange = (value) => {
    this.setState ({
      dept: value
    })
  };

  //选择职务
  handlePostChange = (value) => {
    this.setState ({
      post: value
    })
  };

  //模糊查询框
  handleTextChange = (e) => {
    this.setState ({
      text: e.target.value
    })
  };

  //清空查询条件，只保留OU
  clear = () => {
    this.setState ({
      dept:'',
      post:'',
      text:''
    });
  };

  //按条件查询人员
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
    //根据tab给arg_post_type赋值
    if(flag_tab === '0'){
      arg_params["arg_post_type"] = '0';
    } else{
      arg_params["arg_post_type"] = '1';
    }
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
      type: 'staffPostEdit/search',
      arg_param: arg_params
    });
  };

  //处理分页
  handlePageChange = (page) => {
    let queryParams = this.props.postData;
    queryParams.arg_page_current = page;  //将请求参数设置为当前页
    const {dispatch} = this.props;
    dispatch({
      type: 'staffPostEdit/search',
      arg_param: queryParams
    });
  };

  //删除兼职
  confirm=(record,queryParams)=> {
    let auth_tenantid = Cookie.get('tenantid');
    let postData = {};
    postData["arg_tenantid"] = auth_tenantid;
    postData['arg_uuid'] = record.uuid;

    const {dispatch} = this.props;
    dispatch({
      type:'staffPostEdit/deletePartTimeJob',
      param:postData,
      queryParams:queryParams
    })
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
      render:(text, record, index)=>{
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
        switch (this.props.operateType) {
          case "newAddPartTimeJob":
            return(
              <Button type="danger" onClick={()=>{ this.refs.addPostModal.showModal(record)}}>新增兼职</Button>
            );
          case "deletePartTimeJob":
            return(
              <Popconfirm title="确定要删除这条信息吗？"
                          onConfirm={()=>this.confirm(record,this.props.postData)}
                          okText="确定"
                          cancelText="取消">
                <Button type="danger">删除兼职</Button>
              </Popconfirm>
            );
          case "modifyPost":
            return(
              <Button type="danger" onClick={()=>{ this.refs.modifyPostModal.showModal(record);}}>修改职务</Button>
            );
        }
      }
    }
  ];

   render (){
     const{loading,tableDataList,ouList,deptList,postList,dispatch,postData,flag_change,total,currentPage,flag_post_type} = this.props;
     let ouOptionList;
     if(ouList){
       ouOptionList = ouList.map((item,index) => {
         return (
           <Option key={item.OU}>
             {item.OU}
           </Option>
         )
       });
     }

     let deptOptionList;
     if(deptList){
       deptOptionList = deptList.map((item,index) => {
         return (
           <Option key={item}>
             {item}
           </Option>
         )
       });
     }

     let postOptionList;
     if(postList){
       postOptionList = postList.map((item,index) => {
         return (
           <Option key={item.post_name}>
             {item.post_name}
           </Option>
         )
       });
     }

     // 这里为每一条记录添加一个key，从0开始
     if(tableDataList){
       tableDataList.map((i,index)=>{
         i.key=index;
       })
     }
     const auth_userid = Cookie.get('userid');
     const auth_ou = Cookie.get('OU');

     if(flag_post_type === '1'){//兼职
       postData.arg_post_type = '1';
     }else{
       postData.arg_post_type = '0';
     }

     return (
       <div className={styles.meetWrap}>
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
                loading={loading}
                bordered={true}
         />
         {/* 新增兼职对话框*/}
         <AddPostModal ref='addPostModal'
                       dispatch = {dispatch}
                       postList = {postList}
                       //current_ou_name = {this.props.current_ou_name}
                       deptList = {deptList}
                       //queryParams = {this.props.queryParams}
         />
         {/* 修改职务对话框*/}
         <ModifyPostModal ref='modifyPostModal'
                          dispatch = {dispatch}
                          postList = {postList}
                          //queryParams = {postData}
                          //current_ou_name = {this.props.current_ou_name}
         />
         {/*加载完才显示页码*/}
         {loading !== true ?
           <Pagination current={currentPage}
                       total={Number(total)}
                       showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
                       pageSize={10}
                       onChange={this.handlePageChange}
                       className={styles.pagination}
           />
           :
           null
         }

         {/*数据同步提示框*/}
         <DataSyncTips
           ref="dataSyncTips"
           dispatch = {dispatch}
           flag_change = {flag_change}
           param_service = {'staffPostEdit/search'}
           param_setFlag = {'staffPostEdit/setFlag'}
           postData = {postData}
         />
       </div>
     );
   }
}

/**
 * 作者：耿倩倩
 * 创建日期：2017-09-11
 * 功能：实现员工职务信息维护页面的修改职务/新增兼职/删除兼职三个tab页
 */
class staffPostEdit extends React.Component {
  constructor(props) {super(props);}

  postOperateType = (key) =>{
    const{dispatch} = this.props;
    switch(key){
      case "1":
        dispatch({
          type:'staffPostEdit/init'
        });
        dispatch({
          type:'staffPostEdit/searchPostModify'
        });
        flag_tab = '0';
        break;
      case "2":
        dispatch({
          type:'staffPostEdit/init'
        });
        dispatch({
          type:'staffPostEdit/searchPostAdd'
        });
        flag_tab = '0';
        break;
      case "3":
        dispatch({
          type:'staffPostEdit/init'
        });
        dispatch({
          type:'staffPostEdit/searchPostDelete'
        });
        flag_tab = '1';
        break;
    }
  };

  render() {
    const{loading,tableDataList,ouList,deptList,postList,dispatch,postData,
      flag_change,total,currentPage,flag_post_type} = this.props;
    // 这里为每一条记录添加一个key，从0开始
    if(tableDataList.length){
      tableDataList.map((i,index)=>{
        i.key=index;
      })
    }
    return (
      <Tabs defaultActiveKey="1" onChange={this.postOperateType}>
        <TabPane tab="修改职务" key="1">
          <StaffPostTable tableDataList = {tableDataList}
                          loading = {loading}
                          //current_ou_name = {current_ou_name}
                          operateType = "modifyPost"
                          dispatch = {dispatch}
                          ouList = {ouList}
                          postList = {postList}
                          deptList = {deptList}
                          total = {total}
                          currentPage = {currentPage}
                          postData = {postData}
                          flag_change = {flag_change}
                          flag_post_type = {flag_post_type}
          />
        </TabPane>
        <TabPane tab="新增兼职" key="2">
          <StaffPostTable tableDataList = {tableDataList}
                          loading = {loading}
                          //current_ou_name = {current_ou_name}
                          operateType = "newAddPartTimeJob"
                          dispatch = {dispatch}
                          ouList = {ouList}
                          postList = {postList}
                          deptList = {deptList}
                          total = {total}
                          currentPage = {currentPage}
                          postData = {postData}
                          flag_change = {flag_change}
                          flag_post_type = {flag_post_type}
          />
        </TabPane>
        <TabPane tab="删除兼职" key="3">
          <StaffPostTable tableDataList = {tableDataList}
                          loading = {loading}
                          //current_ou_name = {current_ou_name}
                          operateType = "deletePartTimeJob"
                          dispatch = {dispatch}
                          ouList = {ouList}
                          postList = {postList}
                          deptList = {deptList}
                          total = {total}
                          currentPage = {currentPage}
                          postData = {postData}
                          flag_change = {flag_change}
                          flag_post_type = {flag_post_type}
          />
        </TabPane>
      </Tabs>
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
    flag_post_type} = state.staffPostEdit;
  return {
    loading: state.loading.models.staffPostEdit,
    tableDataList,
    ouList,
    deptList,
    postList,
    postData,
    total,
    currentPage,
    flag_change,
    flag_post_type
  };
}

export default connect(mapStateToProps)(staffPostEdit);
