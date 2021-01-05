/*
*人员查询
*Author: 任金龙
*Date: 2017年11月1日
*Email: renjl33@chinaunicom.cn
*/
import React from 'react';
import {connect} from 'dva';
import {Tooltip,Row, Col, Table,Select,Icon, Button , Menu,Tabs,Pagination,Input,message} from 'antd';
import styles from './memberInfo.less';
import Cookie from 'js-cookie';
import {OU_HQ_NAME_CN,OU_HQ_NAME_CN_PREFIX} from '../../../utils/config';
import OuMemberCount from './ouMemberCount.js';
import AllProjMemberCount from './allProjMemberCount.js';
import DeptAllProjMenberCount from './deptAllProjMemberCount';
import  {exportExlMember} from './exportExlMember.js'
const TabPane = Tabs.TabPane;

const Option = Select.Option;
const auth_tenantid = Cookie.get('tenantid');

/**
 * 序号
 * @param record
 * @param index
 * @returns {*}
 */
function projIndex(record, index) {
  if(record.level == 0 ){
    return index + 1;
  }else{
    return ((index + 1).toString());
  }
}

class memberQuery extends React.Component {
  constructor(props) {super(props);}
  state = {
    ou:'',
    dept:'',
    deptProj:'',
  };
  exportExcel = () => {
  console.log("this.props.memberList")
    console.log(this.props.memberList)
      const list= this.props.memberList;
      let header=["序号","单位","员工部门","员工编号","员工姓名","角色"	,"主责项目","是否为项目经理"];
      let headerKey=["i","ou","dept_name","staff_id","staff_name","role_name"	,"proj_name","is_mgr"];

      if(list !== null && list.length !== 0){
        exportExlMember(list,'人员信息表',header,headerKey,1);
      }else{
        message.info("查询结果为空！")
      }
  };

  /**
   * 当组织部门发生改变时，部门和相关的项目也发生改变
   */
  handleOuChange = (value) => {
    this.setState ({
      ou: value,
      dept:'',
      deptProj:'',
    });
    const {dispatch} = this.props;
    dispatch({
      type:'memberQuery/init',
      deptList: [],
      deptProjList: []
    });
    //获取部门
    dispatch({
      type:'memberQuery/getDept',
      arg_param: value
    });
    //导出表格
    let arg_params = {};
    arg_params["arg_ou"] = value;
    dispatch({
      type: 'memberQuery/memberList',
      arg_param: arg_params,
    })
  };

  /**
   * 部门发生改变时,项目发生变化
   */
  handleDeptChange = (value) => {
    this.setState ({
      dept: value,
      deptProj:''
    });
    const {dispatch} = this.props;
    dispatch({
      type:'memberQuery/projInit',
      deptProjList: []
    });

    let query_param={};
    query_param["ou"]=this.state.ou;
    query_param["deptName"]=value;
    //console.log(query_param.deptName+"   "+query_param.ou)
    dispatch({
      type:'memberQuery/getDeptProj',
      arg_param: query_param
    });
    //导出表格
    let arg_params = {};
    arg_params["arg_tenantid"] = auth_tenantid;
    arg_params["arg_ou"] = this.state.ou;
    arg_params["arg_dept_name"] =value; 
    dispatch({
      type: 'memberQuery/memberList',
      arg_param: arg_params,
    })
  };

  /**
   * 项目发生变化
   */
  handleDeptProjChange = (key) => {
    this.setState ({
      deptProj: key
    });
    const {dispatch} = this.props;
    let arg_params = {};
    arg_params["arg_tenantid"] = auth_tenantid;
    arg_params["arg_page_num"] = 10;
    arg_params["arg_start"] = 1;
    arg_params["arg_ou"] = this.state.ou;
    arg_params["arg_dept_name"] =this.state.dept; //部门传参加上前缀

   // console.log(value)
    arg_params["arg_proj_id"] = key;

    dispatch({
      type: 'memberQuery/memberInfoSearch',
      arg_param: arg_params,
      arg_page_current:1
    });
    //导出表格
    dispatch({
      type: 'memberQuery/memberList',
      arg_param: arg_params,
    })
  };

  handlePageChange = (page) => {
    let queryParams = this.props.postData;
    if(page==1){
      queryParams.arg_start=1;
    }else {
      queryParams.arg_start=(page-1)*queryParams.arg_page_num
    }
    //console.log(queryParams)
    let arg_page_current = page;  //将请求参数设置为当前页

    const {dispatch} = this.props;
    dispatch({
      type: 'memberQuery/memberInfoSearch',
      arg_param: queryParams,
      arg_page_current:arg_page_current
    });
  };

  columns = [
    {
      title:'序号',
      dataIndex: 'i',
      render: (text, record, index) => projIndex(record, index)
    },
    {
      title:'员工单位',
      dataIndex:'ou'
    },
    {
      title:'员工部门',
      dataIndex:'dept_name',
    },
    {
      title:'员工编号',
      dataIndex:'staff_id'
    },
    {
      title:'员工姓名',
      dataIndex:'staff_name',
    },
    {
      title:'角色',
      dataIndex:'role_name',
    },
    {
      title: '主责项目',
      dataIndex: 'proj_name'
    },
    {
      title: '是否为\n' +
      '项目经理',
      dataIndex: 'is_mgr'
    }
  ];

  render() {
    const{loading,dispatch, tableDataList,ouList,deptList, deptProjList,ouMemberCountList,memberList,projMemberCount} = this.props;
    const ouOptionList = ouList.map((item,index) => {
      return (
        <Option key={item.OU}>
          {item.OU}
        </Option>
      )
    });
    const deptOptionList = deptList.map((item,index) => {
      return (
        <Option key={item} value={item}>
          <Tooltip title= {item}  placement="right">
            <span> {item}</span>
          </Tooltip>
        </Option>
      )
    });
    const deptProjOptionList = deptProjList.map((item,index) => {
      return (
        <Option key={item.proj_id} str={item.proj_name}>
          <Tooltip title= {item.proj_name}  placement="right">
            <span> {item.proj_name}</span>
          </Tooltip>
        </Option>
      )
    });

    // 这里为每一条记录添加一个key，从0开始
    if(tableDataList.length){
      tableDataList.map((i,index)=>{
        i.key=index;
      })
    }
    if(ouMemberCountList.length){
      ouMemberCountList.map((i,index)=>{
        i.key=index;
      })
    }
    const auth_ou = Cookie.get('OU');
    return (
      <div className={styles.meetWrap}>
        <Tabs >
          <TabPane tab="人员查询" key="1">
            <div>
                 <div style={{marginBottom:'15px'}}>
                <span>主建单位：</span>
                <Select showSearch style={{width: 160}} optionFilterProp="children" notFoundContent="无法找到" searchPlaceholder="输入关键词" onSelect={this.handleOuChange} value={this.state.ou} >
                  <Option value="">
                    全部
                  </Option>
                  {ouOptionList}
                </Select>
                &nbsp;&nbsp;&nbsp;主建部门：
                <Select showSearch style={{width: 260}}  optionFilterProp="value" notFoundContent="无法找到" searchPlaceholder="输入关键词" onSelect={this.handleDeptChange} value={this.state.dept} >
                  <Option value="">
                    全部
                  </Option>
                  {deptOptionList}
                </Select>
                &nbsp;&nbsp;&nbsp;团队名称：
                <Select showSearch style={{width: 290}} optionFilterProp="str" notFoundContent="无法找到" searchPlaceholder="输入关键词" onSelect={this.handleDeptProjChange} value={this.state.deptProj} >
                  <Option value="">
                    全部
                  </Option>
                  {deptProjOptionList}
                </Select>
              </div>
                 <div id="tabMemInfo">
                 <Table columns={this.columns}
                       dataSource={tableDataList}
                       pagination={false}
                       className={styles.orderTable}
                       loading={loading}
                       bordered={true}
                />
              </div>
              {/*加载完才显示页码*/}
              {loading !== true ?
                <div className={styles.page}>
                <Pagination current={this.props.currentPage}
                            total={Number(this.props.total)}
                            showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
                            pageSize={10}
                            onChange={this.handlePageChange}
                />
                </div>
                :
                null
              }
              <div style={{textAlign:'right'}}>
                <Button type="primary" onClick={this.exportExcel} style={{marginRight:'8px'}}>{'导出'}</Button>
              </div>
            </div>
          </TabPane>
          <TabPane tab="单位人数汇总" key="2">
            <OuMemberCount
            ref="ouMemberCount" dispatch={dispatch}
            ouMemberCountList={ouMemberCountList}
          />
          </TabPane>
          <TabPane tab="所有人数项目汇总" key="5">
            <AllProjMemberCount
              ref="allProjMemberCount"
              projMemberCount={projMemberCount}
            />
          </TabPane>
          <TabPane tab="部门项目人员汇总" key="6">
            <DeptAllProjMenberCount
                deptMemberList={this.props.deptMemberList}
            /> 
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
function mapStateToProps (state) {
  const {
    tableDataList,
    ouList,
    deptList,
    deptProjList,
    postData,
    memberList,
    ouMemberCountList,
    projMemberCount,
    total,
    currentPage,
    deptMemberList
  } = state.memberQuery;
  return {
    loading: state.loading.models.memberQuery,
    tableDataList,
    ouList,
    deptList,
    deptProjList,
    memberList,
    ouMemberCountList,
    projMemberCount,
    postData,
    total,
    currentPage,
    deptMemberList
  };
}

export default connect(mapStateToProps)(memberQuery);
