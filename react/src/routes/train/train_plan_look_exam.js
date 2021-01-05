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

class train_plan_look_exam extends React.Component {
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
    let old_train_year = '';
    let old_claim_fee = '';
    let old_exam_person_name = '';
    let old_train_time = '';
    let old_exam_fee = '';

    let new_class_name = '';
    let new_train_year = '';
    let new_claim_fee = '';
    let new_exam_person_name = '';
    let new_train_time = '';
    let new_exam_fee = '';

    let if_budget = '未超出预算';
    let if_off = '取消课程';
    let reason = '';
    this.state.if_budget = false;
    if(dataInfoList.length>1){
      oldinfo = dataInfoList[0];
      newinfo = dataInfoList[1];
      old_class_name = oldinfo.exam_name;
      old_train_year = oldinfo.exam_year;
      old_claim_fee = oldinfo.claim_fee;
      old_exam_person_name = oldinfo.exam_person_name;
      old_train_time = oldinfo.exam_time;
      old_exam_fee = oldinfo.exam_fee;

      reason = oldinfo.remark;
      if_off= '修改课程';
      if(oldinfo.if_budget==='1'||oldinfo.if_budget === 1){
        if_budget= '超出预算';
        this.state.if_budget = true;
      }

      new_class_name = newinfo.exam_name;
      new_train_year = newinfo.exam_year;
      new_claim_fee = newinfo.claim_fee;
      new_exam_person_name = newinfo.exam_person_name;
      new_train_time = newinfo.exam_time;
      new_exam_fee = newinfo.exam_fee;

    }else if(dataInfoList.length===1){
      oldinfo = dataInfoList[0];
      old_class_name = oldinfo.exam_name;
      old_train_year = oldinfo.exam_year;
      old_claim_fee = oldinfo.claim_fee;
      old_exam_person_name = oldinfo.exam_person_name;
      old_train_time = oldinfo.exam_time;
      old_exam_fee = oldinfo.exam_fee;

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
        <Row span={2} style={{textAlign: 'center'}}><h2>{new Date().getFullYear()}认证考试查看</h2></Row>

        <Card>
          <div>
            <div className={styles.className1}>
              {/**原来的数据 */}
              <div className={styles.leftDis}>
                <Form>
                  <Row style={{textAlign: 'center'}}><h3>调整前</h3></Row>
                  <Row >
                    <Col span={12} style={{ display : 'block'}}>
                      <FormItem label="认证考试名称" hasFeedback {...formItemLayout}>
                        <Input style={{color:'#000'}} value={old_class_name} placeholder = "" disabled={true}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row >
                    <Col span={12} style={{ display : 'block' }}>
                      <FormItem label="考试人员" hasFeedback {...formItemLayout}>
                        <TextArea style={{color:'#000'}} value={old_exam_person_name}
                          placeholder="填写考试人员" disabled={true}
                        ></TextArea>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row >
                    <Col span={12} style={{ display : 'block' }}>
                      <FormItem label="报销标准" hasFeedback {...formItemLayout}>
                        <Input style={{color:'#000'}} value={old_claim_fee} placeholder = "" disabled={true}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row >
                    <Col span={12} style={{ display : 'block' }}>
                      <FormItem label={'考试年份'} {...formItemLayout}>
                        <Input style={{color:'#000'}} value={old_train_year} placeholder = "" disabled={true}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row >
                    <Col span={12} style={{ display : 'block' }}>
                      <FormItem label={'考试时间'} {...formItemLayout}>
                        <Input style={{color:'#000'}} value={old_train_time} placeholder = "" disabled={true}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row >
                    <Col span={12} style={{ display : 'block' }}>
                      <FormItem label={'考试费用预算'} {...formItemLayout}>
                        <Input style={{color:'#000'}} value={old_exam_fee} placeholder = "" disabled={true}/>
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
                    <Col span={12} style={{ display : 'block'}}>
                      <FormItem label="认证考试名称" hasFeedback {...formItemLayout}>
                        <Input style={{color:'#000'}} value={new_class_name} placeholder = "" disabled={true}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row >
                    <Col span={12} style={{ display : 'block' }}>
                      <FormItem label="考试人员" hasFeedback {...formItemLayout}>
                        <TextArea style={{color:'#000'}} value={new_exam_person_name}
                                  placeholder="填写考试人员" disabled={true}
                        ></TextArea>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row >
                    <Col span={12} style={{ display : 'block' }}>
                      <FormItem label="报销标准" hasFeedback {...formItemLayout}>
                        <Input style={{color:'#000'}} value={new_claim_fee} placeholder = "" disabled={true}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row >
                    <Col span={12} style={{ display : 'block' }}>
                      <FormItem label={'考试年份'} {...formItemLayout}>
                        <Input style={{color:'#000'}} value={new_train_year} placeholder = "" disabled={true}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row >
                    <Col span={12} style={{ display : 'block' }}>
                      <FormItem label={'考试时间'} {...formItemLayout}>
                        <Input style={{color:'#000'}} value={new_train_time} placeholder = "" disabled={true}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row >
                    <Col span={12} style={{ display : 'block' }}>
                      <FormItem label={'考试费用预算'} {...formItemLayout}>
                        <Input style={{color:'#000'}} value={new_exam_fee} placeholder = "" disabled={true}/>
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

train_plan_look_exam = Form.create()(train_plan_look_exam);
export default connect(mapStateToProps)(train_plan_look_exam);
