/**
 * 文件说明：线上培训与认证考试培训成绩导入
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-08-30
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Table , Select, message, Card } from 'antd';
import Cookie from "js-cookie";
import {routerRedux} from "dva/router";
import {connect} from "dva";
import styles from "../overtime/style.less";
import CheckFile from "./checkFile";


const FormItem = Form.Item;
const { Option } = Select;

class ImportTrainOnlineExamGradeLook extends React.Component {
  constructor (props) {
    super(props);
    let user_name = Cookie.get('username');
    let user_id = Cookie.get('userid');
    let dept_id = Cookie.get('dept_id');
    let dept_name = Cookie.get('deptname');
    this.state = {
      staff_name:user_name,
      dept_name:dept_name,
      user_id : user_id,
      dept_id : dept_id,
      train_import_type:'onlineTrain',
      onlinePersonClassGradeDataList:[],
      examPersonClassGradeDataList:[],
      isSubmitClickable: true,
      personClassGradeVisible:false
    }
  }

  //结束关闭
  goBack = () => {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/train/train_do'
    }));
  }

  person_online_class_grade_columns = [
    { title: '序号', dataIndex: 'index_id',width: 50 },
    { title: '参训人员', dataIndex: 'login_name',width: 50 },
    { title: '用户名', dataIndex: 'user_name',width: 50 },
    { title: '是否完成', dataIndex: 'if_pass',width: 50 },
    { title: '课程类型', dataIndex: 'train_import_type',width: 50 },
    { title: '完成时间', dataIndex: 'create_time',width: 50 },
    { title: '培训课时', dataIndex: 'train_hour',width: 50 },
    { title: '课程名称', dataIndex: 'class_name',width: 150 },
    { title: '课程来源', dataIndex: 'train_kind' ,width: 50},
  ];
  person_exam_class_grade_columns = [
    { title: '序号', dataIndex: 'index_id',width: 50 },
    { title: '参训人员', dataIndex: 'login_name',width: 80 },
    { title: '用户名', dataIndex: 'user_name',width: 80 },
    { title: '是否通过', dataIndex: 'if_pass',width: 50 },
    { title: '报销费用', dataIndex: 'exam_fee',width: 50 },
    { title: '是否考试清单', dataIndex: 'exam_if_in',width: 80 },
    { title: '认证名称', dataIndex: 'class_name',width: 200 },
  ];

  render() {

    let approvalInfoRecord = this.props.applyInfoRecord;
    let examAndOnlineGradeList = this.props.examAndOnlineGradeList;
    if(examAndOnlineGradeList){
      for(let i=0; i<examAndOnlineGradeList.length ; i++){
        examAndOnlineGradeList[i]["index_id"] = i+1;
        if(examAndOnlineGradeList[i]["if_pass"]=='0'){
          examAndOnlineGradeList[i]["if_pass"] = '否';
        }else if(examAndOnlineGradeList[i]["if_pass"]=='是'||examAndOnlineGradeList[i]["if_pass"]=='否'){

        }else{
          examAndOnlineGradeList[i]["if_pass"] = '是';
        }
      }
    }

    const inputstyle = {color:'#000'};
    //获取下载文件列表
    let filelist = this.props.fileDataList;
    for (let i=0;i<filelist.length;i++){
      filelist[i].uid = i+1;
      filelist[i].status = "done";
    }
    const { getFieldDecorator } = this.props.form;
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
    const approvalHiList = this.props.approvalHiList;
    const hidataList = approvalHiList.map(item =>
      <FormItem label={item.task_name} hasFeedback {...formItemLayout3}>
        <Input style={{color:'#000'}} value= {item.task_detail} disabled={true}></Input>
      </FormItem>
    );

    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>线上培训&认证考试培训情况审批查看</h1></Row>
        <br/>
        <Form>
          <Card title="培训信息" className={styles.r}>
            <Row  gutter={12} >
                {/*姓名*/}
                <Col span={12} style={{ display : 'block' }}>
                  <FormItem label={'提交人'} {...formItemLayout2}>
                    {getFieldDecorator('staff_name',{
                      initialValue:approvalInfoRecord.create_person_name
                    })(<Input style={inputstyle}  placeholder = '' disabled={true}/>)}
                  </FormItem>
                </Col>
                {/*部门*/}
                <Col span={12} style={{ display : 'block' }}>
                  <FormItem label={'部门'} {...formItemLayout3}>
                    {getFieldDecorator('dept_name',{
                      initialValue:approvalInfoRecord.deptname
                    })(<Input  style={inputstyle}  placeholder = '' disabled={true}/>)}
                  </FormItem>
                </Col>
              </Row>
            {/* 培训课程 */}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="请选择类型" hasFeedback {...formItemLayout}>
              {getFieldDecorator('trainImportType',{
                    initialValue:approvalInfoRecord.train_class_type,
                  })(
                    <Select style={{color:'#000'}} placeholder="请选择类型" defaultValue='onlineTrain' disabled={true}>
                      <Option value="onlineTrain">线上培训</Option>
                      <Option value="examTrain">认证考试</Option>
                    </Select>
                )}
              </FormItem>
            </Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button type="primary" onClick={this.goBack}>{'关闭'}</Button>
              </Col>
          </Card>
          <Card title="查看附件" >
              <CheckFile filelist = {filelist}/>
          </Card>
          <Card title="审批信息">
                <span style={{ textAlign: 'left' }}>
                  {hidataList}
                </span>
          </Card>
          <Card title="培训人员成绩信息" >
              <div>
                {
                  approvalInfoRecord.train_class_type == 'examTrain' ?
                    <Table
                      columns={this.person_exam_class_grade_columns}
                      dataSource={examAndOnlineGradeList}
                      pagination={true}
                      scroll={{x: '60%', y: 200}}
                      width={'60%'}
                      bordered={true}
                    />
                    :
                    <Table
                      columns={this.person_online_class_grade_columns}
                      dataSource={examAndOnlineGradeList}
                      pagination={true}
                      scroll={{x: '60%', y: 200}}
                      width={'60%'}
                      bordered={true}
                    />
                }
              </div>
          </Card>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.importGradeModel,
    ...state.importGradeModel,
  };
}

ImportTrainOnlineExamGradeLook = Form.create()(ImportTrainOnlineExamGradeLook);
export default connect(mapStateToProps)(ImportTrainOnlineExamGradeLook)
