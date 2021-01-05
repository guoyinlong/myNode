/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-11
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现员工信息查询功能
 */
import React from 'react';
import {connect} from 'dva';
import {Table,Button,Pagination,Select,Input,Tooltip,Icon,Row,Col} from 'antd';
import styles from './basicInfo.less';
// import SeeDetail from './seeDetail';
// import QueryInfo from './queryInfo.js';
import BasicInfoCard from './basicInfoCard';
import Cookie from 'js-cookie';
import {OU_NAME_CN,OU_HQ_NAME_CN} from '../../../utils/config';
const Option = Select.Option;
const auth_tenantid = Cookie.get('tenantid');
/**
 * 作者：耿倩倩
 * 创建日期：2017-09-11
 * 功能：实现员工信息查询功能
 */
class staffInfoSearch extends React.Component {
  constructor(props) {super(props);}
  state = {
    displayWay:'table',
    ou:null,
    dept:'',
    post:'',
    text:''
  };

  //导出应该是根据当前搜索的条件，查询完后再导出
  exportExcel = () => {
    let queryParams = this.props.postData;
    // let exportUrl = '/microservice/hrmanage/hr/hrExport';
    //新的导出服务地址2017.09.11改
    let exportUrl = '/microservice/hrmanage/hr/hrInformationExport';
    //let postDataURI ='';
    let postDataURI = exportUrl + '?arg_tenantid=' + auth_tenantid;
    //添加 arg_ouname 参数 在选择
    if(this.state.ou !== 'all'){
      postDataURI += '&arg_ouname='+ queryParams.arg_ou_name;
    }
    //全部
    //postDataURI += '&arg_ouname='+ queryParams.arg_ou_name;
    //添加 arg_deptname 参数
    if( queryParams.arg_dept_name !== undefined){
      postDataURI += '&arg_deptname='+ queryParams.arg_dept_name;
    }
    //添加 arg_postname 参数
    if( queryParams.arg_post_name !== undefined){
      postDataURI += '&arg_postname='+ queryParams.arg_post_name;
    }
    //添加 arg_all 参数
    if( queryParams.arg_all !== undefined){
      postDataURI += '&arg_all='+ queryParams.arg_all;
    }
    // //添加 arg_staff_id 参数
    // if(queryParams.arg_user_id !== undefined){
    //   postDataURI += '&arg_staff_id=' + queryParams.arg_user_id;
    // }
    // //添加 arg_username 参数
    // if(queryParams.arg_user_name){
    //   postDataURI += '&arg_username=' + queryParams.arg_user_name;
    // }
    // //添加 arg_employ_type 参数
    // if(queryParams.arg_employ_type !== undefined){
    //   postDataURI += '&arg_employ_type=' + queryParams.arg_employ_type;
    // }
    //window.open(exportUrl+'?arg_ouname='+export_arg_ouname+'&arg_tenantid='+auth_tenantid);
    if(this.props.tableDataList.length){
      window.open(postDataURI);
    }
    //window.open(postDataURI);
  };

  //改变OU，触发查询部门和职务的服务，重新获取该OU下的部门和职务列表。
  handleOuChange = (value) => {
    this.setState ({
      ou: value,
      dept:'',
      post:'',
      //text:''
    });
    const {dispatch} = this.props;
    dispatch({
      type:'staffInfoSearch/init',
      deptList: [],
      postList: []
    });

    if(value !== 'all'){  // 在组织单元选择全部时不查部门和职务
      dispatch({
        type:'staffInfoSearch/getDept',
        arg_param: value
      });
      dispatch({
        type:'staffInfoSearch/getPost',
        arg_param: value
      });
    }

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

  //模糊查询
  handleTextChange = (e) => {
    this.setState ({
      text: e.target.value.replace(/\s+/g,'')
    })
  };

  //清空查询条件，只保留OU ==》 【修改】ou不保留 添加全部
  clear = () => {
    this.setState ({
      dept:'',
      post:'',
      text:'',
      OU: ''
    });
  };

  //查询
  search = () => {
    let ou_search = this.state.ou;
    if(ou_search === null){
      ou_search = Cookie.get('OU');
    }
    if(ou_search === OU_HQ_NAME_CN){ //选中联通软件研究院本部，传参：联通软件研究院
      ou_search = OU_NAME_CN;
    }

    let arg_params = {};
    arg_params["arg_tenantid"] = auth_tenantid;
    arg_params["arg_allnum"] = 0; //固定参数
    arg_params["arg_page_size"] = 9;
    arg_params["arg_page_current"] = 1;

    if(ou_search!== 'all'){  // 没有选择组织单元 不需要这个参数
      arg_params["arg_ou_name"] = ou_search;
    }

    if(this.state.dept !== ''){
      arg_params["arg_dept_name"] = ou_search + '-' + this.state.dept; //部门传参加上前缀
    }
    if(this.state.post !== ''){
      arg_params["arg_post_name"] = this.state.post;
    }
    if(this.state.text !== ''){
      arg_params["arg_all"] = this.state.text.replace(/\s+/g,'');
    }
    const {dispatch} = this.props;


    if(ou_search === 'all'){
      dispatch({
        type: 'staffInfoSearch/allStaffInfoSearch',
        arg_param: arg_params
      });
    }else{
      dispatch({
        type: 'staffInfoSearch/staffInfoSearch',
        arg_param: arg_params
      });
    }
  };

  //处理分页
  handlePageChange = (page) => {
    // 查全部的分页和各个分院的分页不一样
    if(this.state.ou !== 'all'){
      let queryParams = this.props.postData;
      queryParams.arg_page_current = page;  //将请求参数设置为当前页
      const {dispatch} = this.props;
      dispatch({
        type: 'staffInfoSearch/staffInfoSearch',
        arg_param: queryParams
      });
    } else {
      let queryParams = this.props.postData;
      queryParams.arg_page_current = page;
      const {dispatch} = this.props;
      dispatch({
        type: 'staffInfoSearch/allStaffInfoSearch',
        arg_param: queryParams
      });
    }
  };

  //切换显示方式
  switchDisplay = () => {
    this.setState({
      displayWay:this.state.displayWay === 'table'? 'card':'table'
    });
  };

  columns = [
    {
      title:'员工编号',
      dataIndex:'staff_id',
      width: 100
    },
    {
      title:'姓名',
      dataIndex:'username',
      width: 100
    },
    {
      title:'组织单元',
      dataIndex:'ou',
      width: 200,
    },
    {
      title:'部门',
      dataIndex:'deptname',
      render:(text, record, index)=>{
        return (record.deptname.split('-')[1]);
      },
      width: 150
    },
    {
      title:'职务',
      dataIndex:'post_name',
      width: 100
    },
    {
      title:'职务类型',
      dataIndex:'post_type',   //  post_type=0时，为“主岗”，post_type = 1 时，为“兼职”
      render:(text,record)=>{
        return (record.post_type==='0')?'主岗':'兼职';
      },
      width: 100
    },
    {
      title:'手机',
      dataIndex:'tel',
      width: 150
    },
    {
      title:'邮箱',
      dataIndex:'email',
      width: 200
    }
    // {
    //   title:'用工类型',
    //   dataIndex:'employ_type'
    // }
  ];

  render() {
    const{loading, tableDataList, ouList, deptList, postList} = this.props;
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
    const auth_ou = Cookie.get('OU');

    return (
      <div className={styles.meetWrap}>
        {this.state.displayWay === 'table' ?
          <Tooltip title="卡片显示">
            <Icon type = 'qiapian' style={{float:'right',fontSize:20,cursor:'pointer'}} onClick={this.switchDisplay}/>
          </Tooltip>
          :
          <Tooltip title="表格显示">
            <Icon type = 'liebiao' style={{float:'right',fontSize:20,cursor:'pointer'}} onClick={this.switchDisplay}/>
          </Tooltip>
        }
        <div className={styles.headerName} style={{marginBottom:'15px'}}>{'员工信息查询'}</div>

        <div style={{marginBottom:'15px'}}>
          {/*<div style={{float:'left',marginTop:'12px',marginLeft:'5px'}}>组织单元：{this.props.ouSelectValue}</div>*/}
          <Row>
          <Col span={5} style={{minWidth: 245}}  >
          <span>组织单元：</span>
          <Select style={{width: 160}}  onSelect={this.handleOuChange} defaultValue={auth_ou} dropdownMatchSelectWidth={false}>
            <Option key={'all'} value={'all'}>
              {'全部'}
            </Option>
            {ouOptionList}
          </Select>
          </Col>

          <Col span={6} style={{minWidth: 260}} >
           部门：
          <Select style={{width: 200}}  onSelect={this.handleDeptChange} value={this.state.dept} dropdownMatchSelectWidth={false}>
            {deptOptionList}
          </Select>
          </Col>

          <Col span={4} style={{minWidth: 185}} >
           职务：
          <Select style={{width: 120}}  onSelect={this.handlePostChange} value={this.state.post} dropdownMatchSelectWidth={false}>
            {postOptionList}
          </Select>
          
          </Col>

          <Col span={9} style={{minWidth: 400}} >
           搜索：
          <Input style={{width: 200}} placeholder="姓名/员工编号/邮箱前缀/手机" onChange={this.handleTextChange} value={this.state.text}/>
           &nbsp;&nbsp; <Button type="primary" onClick={()=>this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={()=>this.clear()}>{'清空'}</Button>
          </Col>

          </Row>
        </div>
        {this.state.displayWay === 'table'?
          <Table columns={this.columns}
                 dataSource={tableDataList}
                 pagination={false}
                 className={styles.orderTable}
                 loading={loading}
                 bordered={true}
                 scroll={{ x: 1300 }}
                 //style = {{cursor:"pointer"}}
                 // onRowClick={(record,e)=>{this.refs.seeDetail.showModal(record)}}
          />
          :
          <BasicInfoCard tableDataList={tableDataList} />
        }

        {/*加载完才显示页码*/}
        {loading !== true ?
          <Pagination current={this.props.currentPage}
                      total={Number(this.props.total)}
                      showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
                      pageSize={9}
                      onChange={this.handlePageChange}
          />
          :
          null
        }
        <div style={{textAlign:'right'}}>
          <Button type="primary" onClick={this.exportExcel} style={{marginRight:'8px'}}>{'导出'}</Button>
        </div>
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
    currentPage
  } = state.staffInfoSearch;
  return {
    loading: state.loading.models.staffInfoSearch,
    tableDataList,
    ouList,
    deptList,
    postList,
    postData,
    total,
    currentPage
  };
}

export default connect(mapStateToProps)(staffInfoSearch);
