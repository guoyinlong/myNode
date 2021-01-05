   /**
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-07-02
 * 文件说明：业务部门考勤统计审批查看
 * */ 
   
import React,{Component} from 'react';
import{Button,Form,Row,Input,Card,Select,Table,DatePicker,message,Modal,Col} from 'antd';
import styles from './style.less';
import {connect} from "dva";
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
import moment from 'moment';
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker 
const FormItem  = Form.Item;
const {Option} = Select;

class attend_dept_approval_look extends Component{
    constructor(props){
      let dept_name = Cookie.get('dept_name');
        super(props);
        this.state = {
            visible:false,
            submitFlag:true,
            attend_apply_id_save:'',
            attend_apply_id:'',
            isSubmitClickable:true,
            dept_name: dept_name,
            choiseMonth:"none",
            selectedRowKeys:[],
            personvisible:false,
            worktime_team_apply_id: Cookie.get("userid") + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
        };
    }
     //结束关闭
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/attend/index'
    }));
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  handleOk3 = () => {
    this.setState({
      personvisible: false,
    });
    }
  handleCancel3 = () => {
        this.setState({
          personvisible: false,
        });
    }    
  gotoTeamDetails = (record) => {
        if ((record.worktime_team_apply_id !== null) && (record.worktime_team_apply_id !== " ") && (record.worktime_team_apply_id !== undefined)) {
          const {dispatch} = this.props;
          let param = {
            arg_worktime_team_apply_id:record.worktime_team_apply_id,
            arg_cycle_code:record.cycle_code,
          };
          dispatch({
            type: 'attend_approval_model/queryTeamList', 
            param,
          });
        }
        this.setState({
          personvisible: true,
        });
    } 
  full_attend_columns = [ 
    {
      title: '序号',
      dataIndex: 'indexID',
      key: 'indexID',
      width: 50,
      render: (text, record, index) => {
        return <span>{index + 1}</span> 
      },
    },   
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
  ];
  absence_columns = [ 
    {
      title: '序号',
      dataIndex: 'indexID',
      key: 'indexID',
      width: 50,
      render: (text, record, index) => {
        return <span>{index + 1}</span> 
      },
    }, 
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    { title: '请假类型', dataIndex: 'absence_type' },
    { title: '请假天数', dataIndex: 'absence_days' },
    { title: '请假详情', dataIndex: 'absence_details' },
  ];
  business_trip_columns = [
    {
      title: '序号',
      dataIndex: 'indexID',
      key: 'indexID',
      width: 50,
      render: (text, record, index) => {
        return <span>{index + 1}</span> 
      },
    },       
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    { title: '出差天数', dataIndex: 'travel_days' },
    { title: '出差详情', dataIndex: 'travel_details' },
  ];    
  out_trip_columns = [
    {
      title: '序号',
      dataIndex: 'indexID',
      key: 'indexID',
      width: 50,
      render: (text, record, index) => {
        return <span>{index + 1}</span> 
      },
    }, 
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    { title: '因公外出天数', dataIndex: 'away_days' },
    { title: '因公外出详情', dataIndex: 'away_details' },
  ];
  dept_columns = [
    { title: '编号', dataIndex: 'key'},
    { title: '项目组', dataIndex: 'proj_name' },
    { title: '操作', dataIndex: '',  key: 'x', render: (text,record,index) => (
        <span>
        {
            <a onClick={()=>this.gotoTeamDetails(record)}>查看</a>
        }
        </span>
    )},
  ]; 
    render(){    
      const { getFieldDecorator } = this.props.form;
      const personFullDataList = this.props.personFullDataList;
      const personAbsenceDataList = this.props.personAbsenceDataList;
      const personTravelDataList = this.props.personTravelDataList;
      const personOutDataList = this.props.personOutDataList;
      const { approvalNowList, approvalHiList,teamDataList,applyPersonInfo} = this.props;
      const personDataApprovalInfo = this.props.personDataApprovalInfo;
      const hidataListTeam = personDataApprovalInfo.map(item =>
        <FormItem >
          {item.task_name}: &nbsp;&nbsp;{item.task_detail}
        </FormItem>
      ); 
        const hidataList = approvalHiList.map(item =>
        <FormItem >
          {item.task_name}: &nbsp;&nbsp;{item.task_detail}
        </FormItem>
      );
      let applyInfo = {}; 
      if (applyPersonInfo.length > 0) {
        applyInfo = applyPersonInfo[0];
      }
        const inputstyle = { color: '#000' };
        const formItemLayout2 = {
            labelCol: {
              sm: { span: 14 },
            },
            wrapperCol: {
              md: { span: 7 },//input框长度
            },
          };
          const formItemLayout3 = {
            labelCol: {
              sm: { span: 3 },
            },
            wrapperCol: {
              md: { span: 7 },//input框长度
            },
          };
          const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 7 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 12 },
              md: { span: 10 },
            },
          };
          return(  
            <div>
             <Row span={1} style={{ textAlign: 'center' }}>
               <h2><font size="6" face="arial">中国联通济南软件研究院</font></h2>
               <h2><font size="6" face="arial">业务部门考勤统计单</font></h2></Row>
               <p style={{ textAlign: 'right' }}>申请日期：<span><u>{applyInfo.create_time}</u></span></p>
              <br></br>
              <Card title="基本信息：" className={styles.r}>
                <Form style={{ marginTop: 10 }}>
                <Row style={{ textAlign: 'center' }}>
                <FormItem label="部门名称" {...formItemLayout}>
                 {getFieldDecorator('deptname', {
                   initialValue: applyInfo.dept_name
                  })
                  (<Input style={inputstyle} value='' disabled={true} />)
                 }
                </FormItem> 
                </Row> 
                <Row>
                <FormItem label="考勤月份" {...formItemLayout}>
                {getFieldDecorator('attend_month', {
                   initialValue: applyInfo.cycle_code
                  })
                  (<Input style={inputstyle} value='' disabled={true} />)
                 }
                 </FormItem>
                </Row>
                <br />
               </Form>
              </Card>

              <Card title="考勤统计汇总" className={styles.r} >
              <Table
                columns={this.dept_columns}
                //这里的信息是点击节假日查询出来的列表信息
                dataSource={teamDataList}
                pagination={false}
             />
              </Card>
              <Modal
               title="考勤人员列表"
                visible={this.state.personvisible}
                onOk={this.handleOk3}
                onCancel={this.handleCancel3}
                width={"75%"}
              >
            <div>
            <Card title="*全勤类">
               <br/>
               <Table
                 columns={this.full_attend_columns}
                 dataSource={personFullDataList}
                 //pagination={true}
                //scroll={{x: '100%', y: 450}}
                 width={'100%'}
                 bordered= {true}
                />
             </Card>
            <Card title="*请假类">
               <Table
                 columns={this.absence_columns}
                 dataSource={personAbsenceDataList}
                // pagination={true}
                //scroll={{x: '100%', y: 450}}
                 width={'100%'}
                 bordered= {true}
                />
               </Card>
            <Card title="*出差类"> 
               <Table
                 columns={this.business_trip_columns}
                 dataSource={personTravelDataList}
              //   pagination={true}
                 width={'100%'}
                 bordered= {true}
                />
               </Card>
            <Card title="*因公外出类"> 
               <Table
                 columns={this.out_trip_columns}
                 dataSource={personOutDataList}
               //  pagination={true}
                //scroll={{x: '100%', y: 450}}
                 width={'100%'}
                 bordered= {true}
                />
               </Card>
            <Card title="审批信息">
            <span style={{ textAlign: 'left', color: '#000' }}>
              {hidataListTeam}
            </span>
           </Card>
            </div>
            </Modal> 
               <br/>
               <br/>
               <Card title="审批信息">
            <span style={{ textAlign: 'left', color: '#000' }}>
              {hidataList}
            </span>
        </Card>
        <br></br>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button onClick={this.goBack}>{'返回'}</Button>
          </Col>
          <br></br>
              </div> 
          )
    } 
}
function mapStateToProps(state) {
    return {
      loading: state.loading.models.attend_approval_model,
      ...state.attend_approval_model
    };
  }     

  attend_dept_approval_look = Form.create()(attend_dept_approval_look);
  export default connect(mapStateToProps)(attend_dept_approval_look);
  