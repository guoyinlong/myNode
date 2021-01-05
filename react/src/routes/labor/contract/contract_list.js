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

class contract_list extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    ou:'',
    dept: '',
    time: '',
    end_days:'0',
    selectedRowKeys:[],
    visible:false,
    searchDataList:[],
    selectDataList:[],
    nextstep:'',
    isClickable:true
  };

  //导出应该是根据当前搜索的条件，查询完后再导出
  exportExcel = () => {

  }

  //改变OU，触发查询部门和职务的服务，重新获取该OU下的部门和职务列表。
  handleOuChange = (value) => {

  };
  //选择部门
  handleDeptChange = (value) => {
    this.setState ({
      dept: value
    })
  };
  //选择时间
  handleTimeChange = (value) => {
    this.setState ({
      time: value.format("YYYY-MM-DD")
    });

    let nowtime = moment().format('YYYY-MM-DD')
    let endtime = value.format("YYYY-MM-DD");
    let diffdays = this.DateDiff(nowtime,endtime);
    this.setState ({
      end_days: diffdays
    });
    //console.log(nowtime+"===="+endtime+"==="+diffdays);
  };

  DateDiff=(sDate1,  sDate2) => {    //sDate1和sDate2是2006-12-18格式
    var  aDate,  oDate1,  oDate2,  iDays
    aDate  =  sDate1.split("-")
    oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2006格式
    aDate  =  sDate2.split("-")
    oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数
    return  iDays
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
    arg_params["arg_page_size"] = 20;
    arg_params["arg_page_current"] = 1;
    arg_params["arg_ou_id"] = Cookie.get('OUID');
    if(this.state.dept !== ''){
      arg_params["arg_dept_id"] = this.state.dept; //部门传参加上前缀
    }
    if(this.state.time !== ''){
      arg_params["arg_end_time"] = this.state.time; //部门传参加上前缀
    }else{
      message.info("时间不能为空！");
      return;
    }
    //console.log("arg_params==="+JSON.stringify(arg_params));
    const {dispatch} = this.props;
    dispatch({
      type: 'contract_list_model/contractListSearch',
      arg_param: arg_params
    });
  }
  //处理分页
  handlePageChange = (page) => {
    //console.log("page==="+page);
    let queryParams = this.props.postData;
    //console.log("queryParams==="+JSON.stringify(queryParams));
    queryParams.arg_page_current = page;  //将请求参数设置为当前页
    const {dispatch} = this.props;
    dispatch({
      type: 'contract_list_model/contractListSearch',
      arg_param: queryParams
    });
  };

  columns = [
    { title: '序号', dataIndex: 'key',width: '5%'},
    { title:'员工编号', dataIndex:'user_id',width: '7%'},
    { title:'员工姓名', dataIndex:'user_name',width: '7%'},
    { title:'部门名称', dataIndex:'dept_name',width: '8%',
      render:(text, record, index)=>{
        return (record.dept_name.split('-')[1]);
      }},
    { title:'项目组名称', dataIndex:'team_name',width: '25%'},
    { title:'合同类型', dataIndex:'contract_type',width: '7%'},
    { title:'合同期限', dataIndex:'contract_time',width: '5%'},
    { title:'起始日期', dataIndex:'start_time',width: '8%'},
    { title:'截止日期', dataIndex:'end_time',width: '8%'},
    { title:'已签合同数', dataIndex:'sign_number',width: '7%'},
    { title:'距离合同续签天数', dataIndex:'end_day',width: '7%'},
    { title:'合同状态', dataIndex:'contract_state',width: '6%'}
  ];
  columns2 = [
    { title: '序号', dataIndex: 'key'},
    { title:'员工编号', dataIndex:'user_id'},
    { title:'员工姓名', dataIndex:'user_name'},
    { title:'部门名称', dataIndex:'dept_name',
      render:(text, record, index)=>{
        return (record.dept_name.split('-')[1]);
      }},
    { title:'项目组名称', dataIndex:'team_name'},
    { title:'合同类型', dataIndex:'contract_type'},
    { title:'起始日期', dataIndex:'start_time'},
    { title:'截止日期', dataIndex:'end_time'},
  ];
  //选择多人进行提交
  onSelectChange = (selectedRowKeys) => {
    //console.log("selectedRowKeys changed:"+selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  addcontract = () => {
    //console.log("this.state.selectedRowKeys:"+JSON.stringify(this.state.selectedRowKeys));
    //console.log("this.state.searchDataList:"+JSON.stringify(this.state.searchDataList));
    if(this.state.selectedRowKeys.length<=0){
      message.error("请选择续签合同人员！");
      return;
    }
    //console.log("selectedRowKeys changed==="+this.state.selectedRowKeys);
    let deptname = '';
    let teamname = '';
    /*this.setState ({
      selectDataList: []
    });*/
    let sellist = [];
    for (let i=0;i<this.state.selectedRowKeys.length;i++) {
      if(i===0){
        deptname = this.state.searchDataList[this.state.selectedRowKeys[i]-1].dept_name;
        teamname = this.state.searchDataList[this.state.selectedRowKeys[i]-1].team_name;
      }
      if(deptname===this.state.searchDataList[this.state.selectedRowKeys[i]-1].dept_name&&
         teamname===this.state.searchDataList[this.state.selectedRowKeys[i]-1].team_name){
         sellist.push(this.state.searchDataList[this.state.selectedRowKeys[i]-1]);
         if(this.state.searchDataList[this.state.selectedRowKeys[i]-1].contract_state==='续签中'){
           message.error("所选人员正在续签中，请重新选择！");
           return;
         }
      }else{
        message.error("所选人员应该为同一部门或项目组！");
        return;
      }
    }
    //console.log("sellist==="+JSON.stringify(sellist));
    this.setState ({
      selectDataList: sellist
    });
    const {dispatch} = this.props;
    dispatch({
      type: 'contract_list_model/submitPersonList',
      selDataList: sellist
    });

    //console.log("this.state.selectDataList==="+JSON.stringify(this.state.selectDataList));

    this.setState ({
      visible: true
    });
  };
  handleOk = () => {
    //console.log("this.state.selectDataList==="+this.state.selectDataList);
    let nextstep = this.state.nextstep;
    let nextstepPerson = this.props.form.getFieldValue("nextstepPerson");
    let contracttime = this.props.form.getFieldValue("contracttime");
    let selectPersonList = this.state.selectDataList;
    this.setState ({ visible: false});
    this.setState({ isClickable: false });
    const{dispatch} = this.props;
    return new Promise((resolve) => {
      dispatch({
        type:'contract_list_model/submitContractContinue',
        nextstep,
        nextstepPerson,
        selectPersonList,
        contracttime,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        message.info("合同续签成功");
        this.setState({ isClickable: true });
        setTimeout(() => {
          let arg_params = {};
          arg_params["arg_page_size"] = 20;
          arg_params["arg_page_current"] = 1;
          arg_params["arg_ou_id"] = Cookie.get('OUID');
          if(this.state.dept !== ''){
            arg_params["arg_dept_id"] = this.state.dept; //部门传参加上前缀
          }
          if(this.state.time !== ''){
            arg_params["arg_end_time"] = this.state.time; //部门传参加上前缀
          }else{
            message.info("时间不能为空！");
            return;
          }
          //console.log("arg_params==="+JSON.stringify(arg_params));
          const {dispatch} = this.props;
          dispatch({
            type: 'contract_list_model/contractListSearch',
            arg_param: arg_params
          });
          this.setState({ selectedRowKeys:[] });
        },1000);
      }
      if(resolve === 'false')
      {
        message.info("处理异常！");
        this.setState({ isClickable: true });
      }
    }).catch(() => {
      message.info("处理异常！");
      this.setState ({ isClickable: true });
    });
  };
  handleCancel = () => {
    this.setState ({
      visible: false
    });
  };
  render() {
    const{loading, tableDataList, ouList, deptList} = this.props;
    const { getFieldDecorator } = this.props.form;
    this.state.searchDataList = tableDataList;
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

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 9
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 8
        }
      },
      style :{marginBottom:10}
    };
    const inputstyle = {color:'#000'};
    //选择一下处理人信息
    let nextDataList = this.props.nextPersonList;
    let nextpostname = '';
    let initperson = '';
    if (nextDataList.length>0){
      initperson = nextDataList[0].submit_user_id;
      nextpostname = nextDataList[0].submit_post_name;
      this.state.nextstep = nextpostname;
    }
    const nextdataList = nextDataList.map(item =>
      <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
    );

    return (
      <div className={styles.meetWrap}>
        <div className={styles.headerName} style={{marginBottom:'15px'}}>{'劳动合同查询'}</div>
        <div style={{marginBottom:'15px'}}>
          <span>组织单元：</span>
          <Select style={{width: 160}}  onSelect={this.handleOuChange} defaultValue={auth_ou} disabled={true}>
            {ouOptionList}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;部门：
          <Select style={{width: 160}}  onSelect={this.handleDeptChange} defaultValue='全部'>
            <Option key=' '>全部</Option>
            {deptOptionList}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;截止
          <DatePicker
            placeholder="到期日期"
            style={{ width: 160 }}
            disabled={false}
            format="YYYY-MM-DD"
            onChange={(value)=>this.handleTimeChange(value)}
          />
          合同到期
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;距当前日期{this.state.end_days}天
          &nbsp;&nbsp;&nbsp;
          <div className={styles.btnLayOut}>
            <Button type="primary" onClick={()=>this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={()=>this.addcontract()}  disabled={!this.state.isClickable}>{'合同续签'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={()=>this.clear()}>{'清空'}</Button>
          </div>
        </div>

        <Table rowSelection={rowSelection}
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
          title="劳动合同续签"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={'500px'}
        >
          <div>
            <Form>
              <Form>
                <FormItem label={'续签合同周期'} {...formItemLayout}>
                  {getFieldDecorator('contracttime',{
                    initialValue: '36'
                  })(
                  <Select size="large" style={{width: 200}} initialValue='36' placeholder="请选择续签合同期限">
                    <Option key='0'>永久合同</Option>
                    <Option key='12'>1年</Option>
                    <Option key='24'>2年</Option>
                    <Option key='36'>3年</Option>
                    <Option key='48'>4年</Option>
                    <Option key='60'>5年</Option>
                    <Option key='72'>6年</Option>
					<Option key='84'>7年</Option>
                  </Select>)}
                </FormItem>
                <FormItem label={'下一步环节'} {...formItemLayout}>
                  <Input style={inputstyle} value = {nextpostname} disabled={true}/>
                </FormItem>
                <FormItem label={'下一处理人'} {...formItemLayout}>
                  {getFieldDecorator('nextstepPerson',{
                    initialValue: initperson
                  })(
                    <Select size="large" style={{width: 200}} initialValue={initperson} placeholder="请选择团队负责人">
                      {nextdataList}
                    </Select>)}
                </FormItem>
              </Form>
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
    selectDataList,
    nextPersonList,
    ouList,
    deptList,
    postData,
    total,
    currentPage
  } = state.contract_list_model;
  return {
    loading: state.loading.models.contract_list_model,
    tableDataList,
    selectDataList,
    nextPersonList,
    ouList,
    deptList,
    postData,
    total,
    currentPage
  };
}
contract_list = Form.create()(contract_list);
export default connect(mapStateToProps)(contract_list);
