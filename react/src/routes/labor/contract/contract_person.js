/**
 *  作者: 王福江
 *  创建日期: 2019-09-03
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：实现劳动合同查询功能
 */
import React from 'react';
import {connect} from 'dva';
import {Table,Button,Pagination,Select,Input,Tooltip,Icon,DatePicker,Modal,Form} from 'antd';
const FormItem = Form.Item;
import styles from './basicInfo.less';
import Cookie from 'js-cookie';
import {OU_HQ_NAME_CN, OU_NAME_CN} from "../../../utils/config";
import message from "../../../components/commonApp/message";
const Option = Select.Option;
const auth_tenantid = Cookie.get('tenantid');
import moment from 'moment'

class contract_person extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {

  };


  //清空查询条件，只保留OU
  clear = () => {
    this.setState ({
      dept:'',
      time:'',
    });
  };
  //查询
  search = () => {
    let arg_params = {};
    const {dispatch} = this.props;
    dispatch({
      type: 'contract_person_model/contractPersonSearch',
      arg_param: arg_params
    });
  }
  //处理分页
  handlePageChange = (page) => {
    /*let queryParams = this.props.postData;
    queryParams.arg_page_current = page;  //将请求参数设置为当前页
    const {dispatch} = this.props;
    dispatch({
      type: 'staffInfoSearch/staffInfoSearch',
      arg_param: queryParams
    });*/
  };

  columns = [
    { title: '序号', dataIndex: 'key'},
    { title:'员工编号', dataIndex:'user_id'},
    { title:'员工姓名', dataIndex:'user_name'},
    { title:'部门名称', dataIndex:'dept_name',
      render:(text, record, index)=>{
        return (record.dept_name.split('-')[1]);
      }},
    { title:'项目组名称', dataIndex:'team_name'},
    { title:'合同类型', dataIndex:'contract_type'},
    { title:'合同期限', dataIndex:'contract_time'},
    { title:'起始日期', dataIndex:'start_time'},
    { title:'截止日期', dataIndex:'end_time'}
  ];

  render() {
    const{loading, tableDataList} = this.props;
    const auth_ou = Cookie.get('OU');
    const dept_name = Cookie.get('dept_name');
    const staff_name = Cookie.get('username');

    return (
      <div className={styles.meetWrap}>
        <div className={styles.headerName} style={{marginBottom:'15px'}}>{'员工合同查询'}</div>
        <div style={{marginBottom:'15px'}}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>组织单元：</span>
          <Input style={{width: 160,color:'#000'}} defaultValue={auth_ou} disabled={true}></Input>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>部门：</span>
          <Input style={{width: 160,color:'#000'}} defaultValue={dept_name} disabled={true}></Input>   
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>姓名：</span>
          <Input style={{width: 160,color:'#000'}} defaultValue={staff_name} disabled={true}></Input>       
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={()=>this.search()}>{'查询'}</Button>

        </div>
        <br/>
        <Table
               columns={this.columns}
               dataSource={tableDataList}
               pagination={false}
               loading={loading}
               bordered={true}
        />

        <div style={{textAlign:'right'}}>
        </div>

      </div>
    );
  }
}
function mapStateToProps (state) {
  const {
    tableDataList
  } = state.contract_person_model;
  return {
    loading: state.loading.models.contract_person_model,
    tableDataList
  };
}
contract_person = Form.create()(contract_person);
export default connect(mapStateToProps)(contract_person);
