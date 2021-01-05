   /**
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-07-02
 * 文件说明：业务部门考勤统计审批
 * */ 
   
import React,{Component} from 'react';
import{Button,Form,Row,Input,Card,Select,Table,DatePicker,message,Modal,Col} from 'antd';
import styles from './style.less';
const { TextArea } = Input;
import {connect} from "dva";
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker 
const FormItem  = Form.Item;
const {Option} = Select;

class attend_dept_approval extends Component{
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
            choiseOpinionFlag: "none",
            isClickable: true,
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
  handleOk = () => {
    let attendDataSource = this.props.applyPersonInfo;
    this.setState({ isClickable: false });
    this.setState({
      visible: false,
    }); 
    let orig_proc_inst_id = this.props.proc_inst_id;
    let orig_proc_task_id = this.props.proc_task_id; 
    let apply_id = this.props.apply_id;
    let approval_if = this.props.form.getFieldValue("rejectIf");
    let approval_advice = this.props.form.getFieldValue("rejectAdvice");
    let nextstepPerson = this.props.form.getFieldValue("nextstepPerson");
    let now_post_name = this.state.now_post_name;
    let nextpostid = this.state.next_post_id;
    const { dispatch } = this.props;
    return new Promise((resolve) => {
      dispatch({
        type: 'attend_approval_model/attendDeptApprovalSubmit',
        approval_if,
        apply_id,
        approval_advice,
        orig_proc_inst_id,
        orig_proc_task_id,
        nextstepPerson,
        nextpostid,
        now_post_name,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/attend/index'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ isClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index'
      }));
    });
  }
  submitcheck = () => {
    let approval_if = this.props.form.getFieldValue("rejectIf");
    if (approval_if == '不同意') {
      this.setState({ isClickable: false });
      let orig_proc_inst_id = this.props.proc_inst_id;
      let orig_proc_task_id = this.props.proc_task_id;
      let apply_id = this.props.apply_id;
      let approval_if = this.props.form.getFieldValue("rejectIf");
      let approval_advice = this.props.form.getFieldValue("rejectAdvice");
      let nextstepPerson = '';
      let nextpostid = this.state.next_post_id;
      const { dispatch } = this.props;

      if (approval_if === '不同意' && approval_advice === '') {
        this.setState({ isClickable: true });
        message.error('意见不能为空');
      } else {
        return new Promise((resolve) => {
          dispatch({
            type: 'attend_approval_model/attendDeptApprovalSubmit',
            approval_if,
            apply_id,
            approval_advice,
            orig_proc_inst_id,
            orig_proc_task_id,
            nextstepPerson,
            nextpostid,
            resolve
          });
        }).then((resolve) => {
          if (resolve === 'success') {
            this.setState({ isClickable: true });
            setTimeout(() => {
              dispatch(routerRedux.push({
                pathname: '/humanApp/attend/index'
              }));
            }, 500);
          }
          if (resolve === 'false') {
            this.setState({ isClickable: true });
          }
        }).catch(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/attend/index'
          }));
        });
      }
    } else {
      /*最后一步*/
      if (this.state.if_end_task == '1') {
        this.setState({ isClickable: false });
        let orig_proc_inst_id = this.props.proc_inst_id;
        let orig_proc_task_id = this.props.proc_task_id;
        let apply_id = this.props.apply_id;
        let approval_if = this.props.form.getFieldValue("rejectIf");
        let approval_advice = this.props.form.getFieldValue("rejectAdvice");
        let nextstepPerson = '';
        let nextpostid = this.state.next_post_id;
        const { dispatch } = this.props;

        return new Promise((resolve) => {
          dispatch({
            type: 'attend_approval_model/attendDeptApprovalEnd',
            approval_if,
            approval_advice,
            orig_proc_inst_id,
            orig_proc_task_id,
            apply_id,
            nextstepPerson,
            nextpostid,
            resolve
          });
        }).then((resolve) => {
          if (resolve === 'success') {
            this.setState({ isClickable: true });
            setTimeout(() => {
              dispatch(routerRedux.push({
                pathname: '/humanApp/attend/index'
              }));
            }, 500);
          }
          if (resolve === 'false') {
            this.setState({ isClickable: true });
          }
        }).catch(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/attend/index'
          }));
        });
      } else {
        this.setState({
          visible: true,
        });
      }
    }
  }
  //选择不同意，显示驳回意见信息 
  choiseOpinion = (value) => {
    if (value === "不同意") {
      this.setState({
        choiseOpinionFlag: "",
      })
    } else {
      this.setState({
        choiseOpinionFlag: "none",
      })
    }
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
      const { approvalNowList, approvalHiList, applyPersonInfo,teamDataList} = this.props;
      const personDataApprovalInfo = this.props.personDataApprovalInfo;
      const hidataListTeam = personDataApprovalInfo.map(item =>
        <FormItem >
          {item.task_name}: &nbsp;&nbsp;{item.task_detail}
        </FormItem>
      ); 
      let applyInfo = {};
      if (applyPersonInfo.length > 0) { 
        applyInfo = applyPersonInfo[0];
      }
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
      const hidataList = approvalHiList.map(item =>
        <FormItem >
          {item.task_name}: &nbsp;&nbsp;{item.task_detail}
        </FormItem>
      );
      //评论信息
      let nowdataList = approvalNowList.map(item =>
        <span>
          <FormItem label={item.task_name} {...formItemLayout}>
            {getFieldDecorator('rejectIf', {
              initialValue: "同意",
            })(
              <Select size="large" style={{ width: 200 }} placeholder="请选择审批意见" disabled={false} onChange={this.choiseOpinion}>
                <Option value="同意">同意</Option>
                <Option value="不同意">不同意</Option>
              </Select>
            )}
          </FormItem>
  
          <FormItem label="审批驳回意见" {...formItemLayout} style={{ display: this.state.choiseOpinionFlag }}>
            {getFieldDecorator('rejectAdvice', {
              initialValue: "驳回原因",
              rules: [
                {
                  required: true,
                  message: '请填写驳回意见'
                },
              ],
            })(
              <TextArea
                style={{ minHeight: 32 }}
                placeholder="请填写驳回意见"
                rows={2}
              />
            )}
          </FormItem>
        </span>
      );
      if (approvalNowList.length > 0) {
        this.state.now_post_name = approvalNowList[0].task_name;
        if (approvalNowList[0].task_name === '人力资源专员归档') { 
          this.state.if_end_task = '1';
          nowdataList = '';
        }
      }
      //选择一下处理人信息
      let nextDataList = this.props.nextDataList;
      let nextpostname = '';
      let initperson = '';
      if (nextDataList.length > 0) {
        initperson = nextDataList[0].submit_user_id;
        nextpostname = nextDataList[0].submit_post_name;
        this.state.next_post_id = '1000000000001';
      }
      const nextdataList = nextDataList.map(item =>
        <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
      );
        const inputstyle = { color: '#000' };
          return( 
            <div>
             <Row span={1} style={{ textAlign: 'center' }}>
               <h2><font size="6" face="arial">中国联通济南软件研究院</font></h2>
               <h2><font size="6" face="arial">业务部门考勤统计单</font></h2></Row>
               <p style={{ textAlign: 'right' }}>申请日期：<span><u>{applyInfo.create_time}</u></span></p>
              <br></br>
              <Form>
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
              </Form>
          <Card title="审批信息">
            <span style={{ textAlign: 'left', color: '#000' }}>
              {hidataList}
              {nowdataList}
            </span>
          </Card>
          <br></br>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button onClick={this.goBack}>{'返回'}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" htmlType="submit" onClick={this.submitcheck} disabled={!this.state.isClickable}>{this.state.isClickable ? '提交' : '正在处理中...'}</Button>
          </Col>
          <br></br>
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
                <br/>
             </Card>
            <Card title="*请假类">
               <br/>
               <Table
                 columns={this.absence_columns}
                 dataSource={personAbsenceDataList}
                // pagination={true}
                //scroll={{x: '100%', y: 450}}
                 width={'100%'}
                 bordered= {true}
                />
                <br/>
               </Card>
            <Card title="*出差类"> 
               <br/>
               <Table
                 columns={this.business_trip_columns}
                 dataSource={personTravelDataList}
              //   pagination={true}
                 width={'100%'}
                 bordered= {true}
                />
                <br/>
               </Card>
            <Card title="*因公外出类"> 
               <br/>
               <Table
                 columns={this.out_trip_columns}
                 dataSource={personOutDataList}
               //  pagination={true}
                //scroll={{x: '100%', y: 450}}
                 width={'100%'}
                 bordered= {true}
                />
                <br/>
               </Card>
               <Card title="审批信息">
            <span style={{ textAlign: 'left', color: '#000' }}>
              {hidataListTeam}
            </span>
           </Card>
            </div>
            </Modal> 
               <Modal
          title="流程处理"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Form>
              <FormItem label={'下一步环节'} {...formItemLayout}>
                <Input style={inputstyle} value = {nextpostname} disabled={true}/>
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson',{
                  initialValue: initperson
                })(
                  <Select size="large" style={{width: '100%'}} initialValue={initperson} placeholder="请选择团队负责人">
                    {nextdataList}
                  </Select>)}
              </FormItem>
            </Form>
          </div>
        </Modal>
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
  
  attend_dept_approval = Form.create()(attend_dept_approval);
  export default connect(mapStateToProps)(attend_dept_approval);
  