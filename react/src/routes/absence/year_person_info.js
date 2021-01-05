 /**
 * 文件说明：查看请假管理已办信息
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-04-27
 */
import React from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  Select,
  Modal,
  TreeSelect,
  message,
  Card,
  Radio,
  Transfer,
  Table,
  Pagination
} from 'antd';
import { routerRedux } from "dva/router";
import { connect } from "dva";
import styles from './basicInfo.less';
import Cookie from "js-cookie";
import exportExl from '../../components/commonApp/exportExl';


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


class year_person_info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ou:Cookie.get('OUID'),
      dept: Cookie.get('dept_id'),
      visible:false,
      isClickable:true,
    }
  }
  columns = [
    { title: '序号', dataIndex: 'rowKey'},
    { title: '部门', dataIndex: 'deptname'},
    { title: 'HR编号', dataIndex: 'user_id'},
    { title: '姓名', dataIndex: 'user_name' },
    { title: '工龄计算起始日期', dataIndex: 'work_start_time'},
    { title: '工龄（年）', dataIndex: 'work_year' },
    { title: '年度', dataIndex: 'curr_year' },
    { title: '本年度天数额度', dataIndex: 'break_quota'},
    { title: '已使用年假天数', dataIndex: 'break_used'},
    { title: '剩余年假天数', dataIndex: 'break_remain'},
  ];

  //导出应该是根据当前搜索的条件，查询完后再导出
  exportExcel = () => {
    if(this.props.yearPersonList.length>0){
      let tab=document.querySelector('#table1 table');
      exportExl()(tab,'员工年休假信息');
    }
  }
  //选择部门
  handleDeptChange = (value) => {
    this.setState ({
      dept: value
    })
  };
  //查询
  search = () => {
    let arg_params = {};
    arg_params["arg_ou_id"] = Cookie.get('OUID');
    if(this.state.dept !== ''){
      arg_params["arg_dept_id"] = this.state.dept; //部门传参加上前缀
    }
    arg_params["arg_user_name"] = this.props.form.getFieldValue("user_name");
    const {dispatch} = this.props;
    dispatch({
      type: 'year_person_info_model/yearPersonInfoSearch',
      arg_param: arg_params
    });
  }
  yearCalculate = () => {
    this.setState({isClickable: false,});
    const{dispatch} = this.props;
    return new Promise((resolve) => {
      dispatch({
        type: 'year_person_info_model/yearCalculate',
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        message.info("处理完成！")
        this.setState({ isClickable: true });
        let arg_params = {};
        arg_params["arg_ou_id"] = Cookie.get('OUID');
        if(this.state.dept !== ''){
          arg_params["arg_dept_id"] = this.state.dept; //部门传参加上前缀
        }
        arg_params["arg_user_name"] = this.props.form.getFieldValue("user_name");
        const {dispatch} = this.props;
        dispatch({
          type: 'year_person_info_model/yearPersonInfoSearch',
          arg_param: arg_params
        });
      }
      if(resolve === 'false')
      {
        message.error("处理失败！")
        this.setState({ isClickable: true });
      }
    }).catch(() => {
      message.error("处理失败！")
    });
  }
  yearImport = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/absence/yearpersoninfo/yearimport',
    }));
  }
  //处理分页
  handlePageChange = (page) => {
    let queryParams = this.props.postData;
    queryParams.arg_page_current = page;  //将请求参数设置为当前页
    const {dispatch} = this.props;
    dispatch({
      type: 'year_person_info_model/yearPersonInfoSearch',
      arg_param: queryParams
    });
  };

  render() {
    const {yearPersonList,deptList,ouList} = this.props;
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

    return (
      <div  id="table1" className={styles.meetWrap}>
        <div className={styles.headerName} style={{marginBottom:'15px'}}>{'员工年假查询'}</div>
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
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;员工姓名/编号:
          {getFieldDecorator('user_name',{
            initialValue: ''
          })(
            <Input style={{width: 200}}/>
          )}

          <div className={styles.btnLayOut}>
            <Button type="primary" onClick={()=>this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={()=>this.yearCalculate()}  style={{marginRight:'8px'}} disabled={!this.state.isClickable}>{this.state.isClickable ? '本年度年假计算' : '正在处理中...'}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={()=>this.yearImport()} style={{marginRight:'8px'}}>{'批量导入'}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.exportExcel} style={{marginRight:'8px'}}>{'导出'}</Button>
            &nbsp;&nbsp;&nbsp;
          </div>
        </div>

        <Table
          columns={this.columns}
          dataSource={yearPersonList}
          pagination={{ pageSize: 20 }}
          bordered={true}
        />
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

year_person_info = Form.create()(year_person_info);
export default connect(mapStateToProps)(year_person_info)
