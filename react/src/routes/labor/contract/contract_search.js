/**
 *  作者: 王福江
 *  创建日期: 2019-09-03
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：实现劳动合同查询功能
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Button, Pagination, Select, Input, Tooltip, Icon, DatePicker, Modal, Form } from 'antd';
const FormItem = Form.Item;
import styles from './basicInfo.less';
import Cookie from 'js-cookie';
import { OU_HQ_NAME_CN, OU_NAME_CN } from "../../../utils/config";
import message from "../../../components/commonApp/message";
const Option = Select.Option;
const auth_tenantid = Cookie.get('tenantid');
import moment from 'moment'

class contract_search extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    ou: '',
    dept: Cookie.get('dept_id'),
    visible: false,
    visible2: false,
    del_name: '',
    del_user_id: '',
  };

  //导出应该是根据当前搜索的条件，查询完后再导出
  exportExcel = () => {

  }

  //改变OU，触发查询部门和职务的服务，重新获取该OU下的部门和职务列表。
  handleOuChange = (value) => {

  };
  //选择部门
  handleDeptChange = (value) => {
    this.setState({
      dept: value
    })
  };
  //查询
  search = () => {
    let arg_params = {};
    arg_params["arg_page_size"] = 20;
    arg_params["arg_page_current"] = 1;
    arg_params["arg_ou_id"] = Cookie.get('OUID');
    if (this.state.dept !== '') {
      arg_params["arg_dept_id"] = this.state.dept; //部门传参加上前缀
    }
    arg_params["arg_person_name"] = this.props.form.getFieldValue("person_name");
    const { dispatch } = this.props;
    dispatch({
      type: 'contract_list_model/contractSearch',
      arg_param: arg_params
    });
  }
  //处理分页
  handlePageChange = (page) => {
    let queryParams = this.props.postData;
    queryParams.arg_page_current = page;  //将请求参数设置为当前页
    const { dispatch } = this.props;
    dispatch({
      type: 'contract_list_model/contractSearch',
      arg_param: queryParams
    });
  };
  //置失效
  handleEffective = (record) => {
    this.setState({ del_name: record.user_name });
    this.setState({ del_user_id: record.user_id });
    this.setState({ visible2: true });
  };
  //合同历史
  contractHistory = (record) => {
    let arg_user_id = record.user_id;
    const { dispatch } = this.props;
    dispatch({
      type: 'contract_list_model/contractPersonSearch',
      arg_user_id
    });
    this.setState({ visible: true });
  };

  columns = [
    { title: '序号', dataIndex: 'key', width: '5%' },
    { title: '员工编号', dataIndex: 'user_id', width: '7%' },
    { title: '员工姓名', dataIndex: 'user_name', width: '7%' },
    {
      title: '部门名称', dataIndex: 'dept_name', width: '8%',
      render: (text, record, index) => {
        return (record.dept_name.split('-')[1]);
      }
    },
    { title: '项目组名称', dataIndex: 'team_name', width: '20%' },
    { title: '合同类型', dataIndex: 'contract_type', width: '7%' },
    { title: '合同期限', dataIndex: 'contract_time', width: '5%' },
    { title: '起始日期', dataIndex: 'start_time', width: '8%' },
    { title: '截止日期', dataIndex: 'end_time', width: '8%' },
    { title: '已签合同数', dataIndex: 'sign_number', width: '7%' },
    { title: '合同状态', dataIndex: 'contract_state', width: '6%' },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record) => (
        <span>
          <span>
            <a onClick={() => this.contractHistory(record)}>合同记录</a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          {
            this.props.if_human == false ?
              <span>
                <a onClick={() => this.handleEffective(record)}>合同解除</a>
              </span>
              :
              null
          }
        </span>
      )
    },
  ];
  columns2 = [
    { title: '序号', dataIndex: 'key' },
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    {
      title: '部门名称', dataIndex: 'dept_name',
      render: (text, record, index) => {
        return (record.dept_name.split('-')[1]);
      }
    },
    { title: '项目组名称', dataIndex: 'team_name' },
    { title: '合同类型', dataIndex: 'contract_type' },
    { title: '合同期限', dataIndex: 'contract_time' },
    { title: '起始日期', dataIndex: 'start_time' },
    { title: '截止日期', dataIndex: 'end_time' },
    { title: '合同状态', dataIndex: 'contract_state' }
  ];

  handleOk2 = () => {
    let arg_user_id = this.state.del_user_id;
    const { dispatch } = this.props;
    dispatch({
      type: 'contract_list_model/contractPersonEffective',
      arg_user_id
    });
    this.setState({ visible2: false });
    this.search();
  };
  handleCancel2 = () => {
    this.setState({ visible2: false });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  render() {
    const { loading, tableDataList, historyDataList, ouList, deptList, if_human } = this.props;
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
    if (if_human === false) {
      auth_user = '';
    }
    /*this.setState ({
      dept: auth_dept
    })*/



    return (
      <div className={styles.meetWrap}>
        <div className={styles.headerName} style={{ marginBottom: '15px' }}>{'劳动合同查询'}</div>
        <div style={{ marginBottom: '15px' }}>
          <span>组织单元：</span>
          <Select style={{ width: 160 }} onSelect={this.handleOuChange} defaultValue={auth_ou} disabled={true}>
            {ouOptionList}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;部门：
          <Select style={{ width: 200 }} onSelect={this.handleDeptChange} defaultValue={auth_dept} disabled={if_human}>
            <Option key=' '>全部</Option>
            {deptOptionList}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;员工姓名:
          {getFieldDecorator('person_name', {
            initialValue: auth_user
          })(
            <Input style={{ width: 200 }} disabled={if_human} />
          )}

          <div className={styles.btnLayOut}>
            <Button type="primary" onClick={() => this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;
          </div>
        </div>

        <Table
          columns={this.columns}
          dataSource={tableDataList}
          pagination={false}
          loading={loading}
          bordered={true}
          scroll={{ x: '100%', y: 450 }}
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
          title="劳动合同"
          visible={this.state.visible}
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

        <Modal
          title="项目组-劳动合同续签申请单"
          visible={this.state.visible2}
          onOk={this.handleOk2}
          onCancel={this.handleCancel2}
          width={'500px'}
        >
          <div>
            <Form>
              <span>您确定将 <strong>{this.state.del_name}</strong> 的合同解除么？</span>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const {
    tableDataList,
    historyDataList,
    ouList,
    deptList,
    postData,
    total,
    currentPage,
    if_human
  } = state.contract_list_model;
  return {
    loading: state.loading.models.contract_list_model,
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
contract_search = Form.create()(contract_search);
export default connect(mapStateToProps)(contract_search);
