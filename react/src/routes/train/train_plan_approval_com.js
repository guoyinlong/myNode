/**
 * 文件说明：培训计划审批
 * 作者：王福江
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2019-07-14
 */
import React ,{ Component }from "react";
import { Form, Card,  Row, Col, Input, Button, Modal, Select, Radio} from 'antd';
import {routerRedux} from "dva/router";
import { connect } from 'dva';
import Cookie from 'js-cookie';
import styles from '../train/train.less';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class train_plan_approval_com extends React.Component {
  constructor (props) {
    super(props);
    let auth_ouname = Cookie.get('deptname').split('-')[1];
    this.state = {
      auth_ouname:auth_ouname,
      choiseOpinionFlag:"none",
      isClickable: true,
      visible:false,
      nextstep:'',
      endstepflag:false,
      if_budget:'',
    }
  }

  //选择不同意，显示驳回意见信息
  choiseOpinion = (value) =>{
    if(value==="不同意") {
      this.setState({
        choiseOpinionFlag: "",
      })
    }else {
      this.setState({
        choiseOpinionFlag: "none",
      })
    }
  }
  //提交下一环节
  selectNext = () => {
    let approval_if = this.props.form.getFieldValue("rejectIf");
    console.log("selectNext===approval_if==="+approval_if);

    if (approval_if==='不同意'){
      this.setState({
        nextstep: "驳回至申请人",
      });
    }else{
      this.setState({
        nextstep: "",
      });
    }
    this.setState({
      visible: true,
    });
  }

  //提交弹窗
  handleOk = (e) => {
    this.setState({ isClickable: false });
    let orig_proc_inst_id = this.props.proc_inst_id;
    let orig_proc_task_id = this.props.proc_task_id;
    let orig_apply_task_id = this.props.apply_task_id;
    let create_person_id = this.props.create_person_id;
    let approval_if = this.props.form.getFieldValue("rejectIf");
    let approval_advice = this.props.form.getFieldValue("rejectAdvice");
    let nextstepPerson = this.props.form.getFieldValue("nextstepPerson");
    let nextstep = this.state.nextstep;
    let approval_type = '1';
    let if_budget = this.state.if_budget;

    const{dispatch} = this.props;
    this.setState({
      visible: false,
    });
    if(approval_if==='不同意'&&approval_advice===''){
      this.setState({ isClickable: true });
      //message.error('意见不能为空');
    }else {
      return new Promise((resolve) => {
        dispatch({
          type:'train_plan_approval_model/submitApproval',
          approval_if,
          approval_advice,
          nextstepPerson,
          nextstep,
          orig_proc_inst_id,
          orig_proc_task_id,
          orig_apply_task_id,
          approval_type,
          create_person_id,
          if_budget,
          resolve
        });
      }).then((resolve) => {
        if(resolve === 'success')
        {
          this.setState({ isClickable: true });
          setTimeout(() => {
            dispatch(routerRedux.push({
              pathname:'/humanApp/train/train_do'}));
          },500);
        }
        if(resolve === 'false')
        {
          this.setState({ isClickable: true });
        }
      }).catch(() => {
        dispatch(routerRedux.push({
          pathname:'/humanApp/train/train_do'}));
      });
    }
  }
  //取消弹窗
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
//结束关闭
  gotoHome = () => {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/train/train_do'
    }));
  }
  render() {
    const {getFieldDecorator } = this.props.form;
    //样式
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

    //课程信息
    const { dataInfoList} = this.props;
    let oldinfo = {};
    let newinfo = {};
    let old_class_name = '';
    let old_train_level = '';
    let old_train_hour = '';
    let old_train_year = '';
    let old_train_time = '';
    let old_assign_score = '';
    let old_train_fee = '';
    let old_court_dept = '';

    let new_class_name = '';
    let new_train_level = '';
    let new_train_hour = '';
    let new_train_year = '';
    let new_train_time = '';
    let new_assign_score = '';
    let new_train_fee = '';
    let new_court_dept = '';

    let if_budget = '未超出预算';
    let if_off = '取消课程';
    let reason = '';
    this.state.if_budget = false;
    if(dataInfoList.length>1){
      oldinfo = dataInfoList[0];
      newinfo = dataInfoList[1];
      old_class_name = oldinfo.class_name;
      old_train_level = oldinfo.train_level;
      old_train_hour = oldinfo.train_hour;
      old_train_year = oldinfo.train_year;
      old_train_time = oldinfo.train_time;
      old_assign_score = oldinfo.assign_score;
      old_train_fee = oldinfo.train_fee;
      old_court_dept = oldinfo.duty_dept;
      reason = oldinfo.remark;
      this.state.if_budget = true;
      if_off= '修改课程';
      if(oldinfo.if_budget==='1'||oldinfo.if_budget===1){
        if_budget= '超出预算';
        this.state.if_budget = true;
      }

      new_class_name = newinfo.class_name;
      new_train_level = newinfo.train_level;
      new_train_hour = newinfo.train_hour;
      new_train_year = newinfo.train_year;
      new_train_time = newinfo.train_time;
      new_assign_score = newinfo.assign_score;
      new_train_fee = newinfo.train_fee;
      new_court_dept = newinfo.duty_dept;
    }else if(dataInfoList.length===1){
      oldinfo = dataInfoList[0];
      old_class_name = oldinfo.class_name;
      old_train_level = oldinfo.train_level;
      old_train_hour = oldinfo.train_hour;
      old_train_year = oldinfo.train_year;
      old_train_time = oldinfo.train_time;
      old_assign_score = oldinfo.assign_score;

      old_train_fee = oldinfo.train_fee;
      old_court_dept = oldinfo.duty_dept;
      reason = oldinfo.remark;
      if(oldinfo.if_budget==='1'||oldinfo.if_budget===1){
        if_budget= '超出预算';
      }
    }
    console.log("oldinfo==="+JSON.stringify(oldinfo));
    //意见列表
    const {approvalHiList,approvalNowList} = this.props;
    //下一环节
    const {nextPersonList} = this.props;
    console.log("nextPersonList==="+nextPersonList);
    let initperson = '';
    let nextdataList = '';
    if(this.state.nextstep!=='驳回至申请人'){
      if(nextPersonList.length){
        this.state.nextstep = nextPersonList[0].submit_post_name;
        initperson = nextPersonList[0].submit_user_id;
        nextdataList = nextPersonList.map(item =>
          <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
        );
      }
    }else{
      const {create_person} = this.props;
      console.log("create_person==="+create_person);
      if(create_person.length){
        initperson = create_person[0].create_person_id;
        nextdataList = create_person.map(item =>
          <Option value={item.create_person_id}>{item.create_person_name}</Option>
        );
      }
    }
    let nowdataList = '';
    console.log('this.state.nextstep==='+this.state.nextstep);
    console.log('approvalNowList==='+JSON.stringify(approvalNowList));
    if(approvalNowList.length>0&&approvalNowList[0].task_name.endsWith("归档")){
      nowdataList = '';
    }else{
      if(this.state.nextstep.endsWith("结束")){
        nowdataList = '';
      }else{
        nowdataList = approvalNowList.map(item =>
            <span>
        <FormItem label={item.task_name} {...formItemLayout}>
          {getFieldDecorator('rejectIf', {
            initialValue: "同意",
          })(
            <Select size="large" style={{width: 200}} placeholder="请选择审批意见" disabled={false} onChange={this.choiseOpinion}>
              <Option value="同意">同意</Option>
              <Option value="不同意">不同意</Option>
            </Select>
          )}
        </FormItem>

        <FormItem label="审批驳回意见" {...formItemLayout} style={{display: this.state.choiseOpinionFlag}}>
          {getFieldDecorator('rejectAdvice',{
            initialValue:"驳回原因",
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
      }
    }
    const hidataList = approvalHiList.map(item =>
      <FormItem label={item.task_name} hasFeedback {...formItemLayout}>
        <Input style={{color:'#000'}} value= {item.task_detail} disabled={true}></Input>
      </FormItem>
    );


    return (
    <div>
      <Row span={2} style={{textAlign: 'center'}}><h2>{new Date().getFullYear()}年总院必修培训计划审批</h2></Row>

      <p>当前申请环节：<span>审批</span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        当前处理人：<span>{Cookie.get('username')}</span></p>
      <br></br>

      <Card>
        <div>
          <div className={styles.className1}>
            {/**原来的数据 */}
            <div className={styles.leftDis}>
              <Form>
                <Row style={{textAlign: 'center'}}><h3>调整前</h3></Row>
                <Row >
                  <Col span={12} style={{ display : 'block'}}>
                    <FormItem label="课程名称" hasFeedback {...formItemLayout}>
                      <Input style={{color:'#000'}} value={old_class_name} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label="培训级别" hasFeedback {...formItemLayout}>
                      <Input style={{color:'#000'}} value={old_train_level} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label="计划类型" hasFeedback {...formItemLayout}>
                      <Input style={{color:'#000'}} value='总院必修' placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label={'培训时长'} {...formItemLayout}>
                      <Input style={{color:'#000'}} value={old_train_hour} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label={'培训年份'} {...formItemLayout}>
                      <Input style={{color:'#000'}} value={old_train_year} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label={'培训季度'} {...formItemLayout}>
                      <Input style={{color:'#000'}} value={old_train_time} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label={'赋分规则'} {...formItemLayout}>
                      <Input style={{color:'#000'}} value={old_assign_score} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label={'培训预算'} {...formItemLayout}>
                      <Input style={{color:'#000'}} value={old_train_fee} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label={'责任部门'} {...formItemLayout}>
                      <Input style={{color:'#000'}} value={old_court_dept} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <div className={styles.className2}>
            {/**修改后的数据 */}
            <div className={styles.leftDis}>
              <Form>
                <Row style={{textAlign: 'center'}}><h3>调整后</h3></Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label="课程名称" hasFeedback {...formItemLayout}>
                      <Input style={{color:'#000'}} value={new_class_name} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label="培训级别" hasFeedback {...formItemLayout}>
                      <Input style={{color:'#000'}} value={new_train_level} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label="计划类型" hasFeedback {...formItemLayout}>
                      <Input style={{color:'#000'}} value='总院必修' placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label={'培训时长'} {...formItemLayout}>
                      <Input style={{color:'#000'}} value={new_train_hour} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label={'培训年份'} {...formItemLayout}>
                      <Input style={{color:'#000'}} value={new_train_year} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label={'培训季度'} {...formItemLayout}>
                      <Input style={{color:'#000'}} value={new_train_time} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label={'赋分规则'} {...formItemLayout}>
                      <Input style={{color:'#000'}} value={new_assign_score} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label={'培训预算'} {...formItemLayout}>
                      <Input style={{color:'#000'}} value={new_train_fee} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={12} style={{ display : 'block' }}>
                    <FormItem label={'责任部门'} {...formItemLayout}>
                      <Input style={{color:'#000'}} value={new_court_dept} placeholder = "" disabled={true}/>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className={styles.bottomClass} style={{textAlign: 'center'}}>
          <Row span={24}>
            <span>课程是否取消： </span>
            <Input value={if_off} placeholder = "" disabled={true} style={{width:400,color:'#000'}}/>
          </Row>
          <br></br>
          <Row span={24}>
            <span>预算情况：</span>
            <Input value={if_budget} placeholder = "" disabled={true} style={{width:400,color:'#000'}}/>
          </Row>
          <br></br>

          <Row span={24}>
            <span>调整原因：</span>
            <Input disabled={false} value={reason} style={{width:400,color:'#000'}} disabled={true}/>
          </Row>
          <br></br>
        </div>
      </Card>

      <Card title="审批信息">
          <span style={{ textAlign: 'center' }}>
              {hidataList}
          </span>
        <span style={{ textAlign: 'center' }}>
              {nowdataList}
          </span>
      </Card>

      <br/><br/>
      <div style={{textAlign: "center"}}>
        <Button onClick={this.gotoHome} type="dashed">关闭</Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" htmlType="submit" onClick={this.selectNext} disabled={!this.state.isClickable}>{this.state.isClickable ? '提交' : '正在处理中...'}</Button>
      </div>

      <Modal
        title="流程处理"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div>
          <Form>
            <FormItem label={'下一步环节'} {...formItemLayout}>
              <Input style={{color:'#000'}} value = {this.state.nextstep} disabled={true}/>
            </FormItem>
            <FormItem label={'下一处理人'} {...formItemLayout}>
              {getFieldDecorator('nextstepPerson',{
                initialValue: initperson
              })(
                <Select size="large" style={{width: '100%'}} initialValue={initperson} placeholder="请选择负责人">
                  {nextdataList}
                </Select>)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.train_plan_approval_model,
    ...state.train_plan_approval_model
  };
}

train_plan_approval_com = Form.create()(train_plan_approval_com);
export default connect(mapStateToProps)(train_plan_approval_com);
