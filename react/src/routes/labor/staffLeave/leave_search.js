/**
 *  作者: 王福江
 *  创建日期: 2019-09-26
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：实现员工离职查看
 */
import React ,{ Component }from "react";
import {Button, Tabs, Table, Select, Pagination} from "antd";
import {routerRedux} from "dva/router";
import { connect } from 'dva';
import Cookie from 'js-cookie';
import styles from "../../labor/contract/basicInfo.less";
const Option = Select.Option;

class leave_search extends Component{
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      dept:Cookie.get('dept_id'),
      flow_type:'',
      flow_state:'1'
    }
  }
  //选择部门
  handleDeptChange = (value) => {
    this.setState ({
      dept: value
    })
  };
  handleTypeChange = (value) => {
    this.setState ({
      flow_type: value
    })
  };
  handleStateChange = (value) => {
    this.setState ({
      flow_state: value
    })
  };
  //查询
  search = () => {
    let arg_params = {};
    arg_params["arg_page_size"] = 20;
    arg_params["arg_page_current"] = 1;
    arg_params["arg_ou_id"] = Cookie.get('OUID');
    arg_params["arg_dept_id"] = this.state.dept;
    arg_params["arg_flow_type"] = this.state.flow_type;
    arg_params["arg_flow_state"] = this.state.flow_state;
    const {dispatch} = this.props;
    dispatch({
      type: 'leave_search_model/leaveFlowSearch',
      arg_param: arg_params
    });
  }
  //处理分页
  handlePageChange = (page) => {
    let arg_params = {};
    arg_params["arg_page_size"] = 20;
    arg_params["arg_page_current"] = page;
    arg_params["arg_ou_id"] = Cookie.get('OUID');
    arg_params["arg_dept_id"] = this.state.dept;
    arg_params["arg_flow_type"] = this.state.flow_type;
    arg_params["arg_flow_state"] = this.state.flow_state;
    const {dispatch} = this.props;
    dispatch({
      type: 'leave_search_model/leaveFlowSearch',
      arg_param: arg_params
    });
  }
  //查看按钮跳转到申请信息查看页面，包括审批过程
  gotoIndex = (record) =>{
    let query = record;
    query["return_type"] = '2';
    //根据不同的申请类型，跳到不同的界面
    if(record.apply_type === '1'){
      //离职申请
      const {dispatch}=this.props;
      dispatch(routerRedux.push({
        pathname:'/humanApp/labor/index/LeavePrint',
        query: query
      }));

    }else if(record.apply_type==='2'){
      //工作交接申请
      const {dispatch}=this.props;
      dispatch(routerRedux.push({
        pathname:'/humanApp/labor/index/HandOverPrint',
        query: query
      }));
    }else if(record.apply_type==='3'){
      //离职结算
        const {dispatch}=this.props;
        dispatch(routerRedux.push({
          pathname:'/humanApp/labor/index/CheckleaveSettle',
          query: query
        }));
    }else if(record.apply_type==='4'){
      // 劳动合同查看
      const {dispatch}=this.props;
      dispatch(routerRedux.push({
        pathname:'/humanApp/labor/staffLeave_index/contractApproveInform',
        query: query
      }));
    }
  }

  columns = [
    { title: '审批流程名称', dataIndex: 'task_name' },
    { title: '申请部门', dataIndex: 'dept_name', },
    { title: '申请人', dataIndex: 'user_name', },
    { title: '创建日期', dataIndex: 'create_time', },
    { title: '下一环节', dataIndex: 'next_name', },
    { title: '下一环节处理人', dataIndex: 'next_person', },
    { title: '审批状态', dataIndex: 'task_type', },
    { title: '操作', dataIndex: '', key: 'x', render: (text,record) => (
        <a onClick = {()=>this.gotoIndex(record)}>查看</a>)},
  ];

  render(){
    const{loading, tableDataList , deptList ,if_human} = this.props;
    const deptOptionList = deptList.map((item) => {
      return (
        <Option key={item.deptid}>
          {item.deptname}
        </Option>
      )
    });
    const auth_ou = Cookie.get('OU');
    const auth_dept = Cookie.get('dept_name');

    console.log("if_human==="+if_human);

    return (
      <div className={styles.meetWrap}>
        <div className={styles.headerName} style={{marginBottom:'15px'}}>{'离职流程查询'}</div>
        <div style={{marginBottom:'15px'}}>
          <span>组织单元：</span>
          <Select style={{width: 160}} defaultValue={auth_ou} disabled={true}>

          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;部门：
          <Select style={{width: 200}}  onSelect={this.handleDeptChange} defaultValue={auth_dept} disabled={if_human}>
            <Option key=' '>全部</Option>
            {deptOptionList}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;离职类型
          <Select style={{width: 200}}  onSelect={this.handleTypeChange} defaultValue='全部'>
            <Option key='全部'>全部</Option>
            <Option key='离职申请'>离职申请</Option>
            <Option key='离职交接'>离职交接</Option>
            <Option key='离职清算'>离职清算</Option>
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;审批状态
          <Select style={{width: 200}}  onSelect={this.handleStateChange} defaultValue='审批中'>
            <Option key=' '>全部</Option>
            <Option key='1'>审批中</Option>
            <Option key='2'>审批完成</Option>
            <Option key='3'>审批驳回</Option>
          </Select>

          <div className={styles.btnLayOut}>
            <Button type="primary" onClick={()=>this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;
          </div>
        </div>

        <Table
          columns={this.columns}
          dataSource={tableDataList}
          pagination={false}
          loading={loading}
          bordered={true}
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
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.leave_search_model,
    ...state.leave_search_model,
  };
}
export default connect(mapStateToProps)(leave_search)
