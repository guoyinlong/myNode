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

class train_plan_approval_ele extends React.Component {
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

//结束关闭
  gotoHome = () => {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/train/train_do'
    }));
  }
  render() {
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
    //let old_train_hour = '';
    let old_train_year = '';
    //let old_train_time = '';
    let old_train_fee = '';
    let old_court_dept = '';

    let new_class_name = '';
    let new_train_level = '';
    //let new_train_hour = '';
    let new_train_year = '';
    //let new_train_time = '';
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
      //old_train_hour = oldinfo.train_hour;
      old_train_year = oldinfo.train_year;
      old_train_fee = oldinfo.train_fee;
      old_court_dept = oldinfo.duty_dept;
      reason = oldinfo.remark;
      if_off= '修改课程';
      if(oldinfo.if_budget==='1'||oldinfo.if_budget === 1){
        if_budget= '超出预算';
        this.state.if_budget = true;
      }

      new_class_name = newinfo.class_name;
      new_train_level = newinfo.train_level;
      //new_train_hour = newinfo.train_hour;
      new_train_year = newinfo.train_year;
      new_train_fee = newinfo.train_fee;
      new_court_dept = newinfo.duty_dept;
    }else if(dataInfoList.length===1){
      oldinfo = dataInfoList[0];
      old_class_name = oldinfo.class_name;
      old_train_level = oldinfo.train_level;
      //old_train_hour = oldinfo.train_hour;
      old_train_year = oldinfo.train_year;
      old_train_fee = oldinfo.train_fee;
      old_court_dept = oldinfo.duty_dept;
      reason = oldinfo.remark;
      if(oldinfo.if_budget==='1'||oldinfo.if_budget === 1){
        if_budget= '超出预算';
      }
    }
    console.log("oldinfo==="+JSON.stringify(oldinfo));
    //意见列表
    const {approvalHiList} = this.props;
    const hidataList = approvalHiList.map(item =>
      <FormItem label={item.task_name} hasFeedback {...formItemLayout}>
        <Input placeholder= {item.task_detail} disabled={true}></Input>
      </FormItem>
    );

    return (
      <div>
        <Row span={2} style={{textAlign: 'center'}}><h2>{new Date().getFullYear()}年总院选修培训计划查看</h2></Row>

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
                        <Input style={{color:'#000'}} value='总院选修' placeholder = "" disabled={true}/>
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
                        <Input style={{color:'#000'}} value='总院选修' placeholder = "" disabled={true}/>
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
        </Card>

        <br/><br/>
        <div style={{textAlign: "center"}}>
          <Button onClick={this.gotoHome} type="dashed">关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>

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

train_plan_approval_ele = Form.create()(train_plan_approval_ele);
export default connect(mapStateToProps)(train_plan_approval_ele);
