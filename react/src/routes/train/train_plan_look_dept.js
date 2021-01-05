/**
 * 文件说明：培训计划审批
 * 作者：王福江
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2019-07-14
 */
import React, { Component }from "react";
import { Form, Card,  Row, Input, Button,Table } from 'antd';
import {routerRedux} from "dva/router";
import { connect } from 'dva';
import Cookie from 'js-cookie';
import styles from './trainPlanChangeBasicInfo.less';

const FormItem = Form.Item;
const TextArea = Input;

class train_plan_look_dept extends Component {
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

  
columns = [
  {
      title:'名称',
      dataIndex: 'module',
      width:'15%',
      render: (value, row, index) => {
          return {
              children: value,
              props: {rowSpan:row.rowSpan},
          };
      },
  },
  {
      title:'调整项',
      dataIndex: 'modifyItem',
      width:'15%',
      render: (value, row, index) => {
          if(row.is_diff === '1'){
              return(<div style={{color:'red',textAlign:'left'}}>{value}</div>);
          }else{
              return(<div style={{textAlign:'left'}}>{value}</div>);
          }
      }
  },
  {   title:'原值',
      dataIndex: 'oldValue',
      width:'30%',
      render: (value, row, index) => {
          if ('isTextArea' in row && row.isTextArea === '1') {
              return (
                  <TextArea
                      value={value}
                      autosize={{minRows: 2, maxRows: 6}}
                      disabled={true}
                      className={styles.textAreaStyle}>
                  </TextArea>
              )
          } else {
              return(<div style={{textAlign:'left'}}>{value}</div>);
          }
      }
  },
  { title:'新值',
      dataIndex: 'newValue',
      width:'30%',
      render: (value, row, index) => {
          if(row.is_diff === '1'){
              if ('isTextArea' in row && row.isTextArea === '1') {
                  return (
                      <TextArea
                          value={value}
                          autosize={{minRows: 2, maxRows: 6}}
                          disabled={true}
                          style={{color:'red'}}
                      />
                  )
              } else {
                  return(<div style={{color:'red',textAlign:'left'}}>{value}</div>);
              }

          }else{
              if ('isTextArea' in row && row.isTextArea === '1') {
                  return (
                      <TextArea
                          value={value}
                          autosize={{minRows: 2, maxRows: 6}}
                          disabled={true}
                          style={{color:'black'}}
                      />
                  )
              } else {
                  return(<div style={{textAlign:'left'}}>{value}</div>);
              }
          }
      }
  }
];


//结束关闭
  gotoHome = () => {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/train/train_do'
    }));
  }

  render() {
    //课程信息
    const { dataInfoList, changeReason, trainType } = this.props;

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

    //意见列表
    const {approvalHiList} = this.props;
    const hidataList = approvalHiList.map(item =>
      <FormItem label={item.task_name} hasFeedback {...formItemLayout }>
        <Input style={{ textAlign: 'left' }} placeholder= {item.task_detail} disabled={true}></Input>
      </FormItem>
    );


    return (
      <div>
        <Row span={2} style={{textAlign: 'center'}}><h2>{new Date().getFullYear()}年 {trainType === '1' ? '全院必修' : (trainType === '2' ? '全院选修' : trainType === '3' ? '通用' : trainType === '4' ? '认证考试' : '' ) }计划调整查看</h2></Row>
        
        <br/>

          <div style={{marginLeft: 20}}>
            <span style={{fontWeight: 'bold', fontSize: 16}}>调整原因：</span>
            <TextArea 
              value={changeReason}
              autosize={{minRows: 1, maxRows: 4}}
              style={{width: '90%', verticalAlign: 'top', color: 'black'}}
              disabled={true}
            >
            </TextArea>
          </div>

          <br/>

          <Table dataSource={dataInfoList}
            columns={this.columns}
            pagination={false}
            className={styles.fullCostDeptTable}
          />
        
        <br/>
        <Card title="审批信息" style={{ textAlign: 'left' }}>
          <span >
              {hidataList}
          </span>
        </Card>

        <br/>
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

train_plan_look_dept = Form.create()(train_plan_look_dept);
export default connect(mapStateToProps)(train_plan_look_dept);
