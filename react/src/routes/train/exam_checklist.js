/**
 * 文件说明：导入认证考试清单
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-05-27
 **/
import React ,{Component} from 'react';
import {connect} from "dva";
import {Button, Card, Form, message, Row, Table} from "antd";
import Excel from "../train/Excel";
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
import UpFile from "../train/upFile";

class exam_checklist extends Component{
  constructor (props) {
    super(props);
    let user_name = Cookie.get('username');
    this.state = {
      user_name:user_name,
      isSaveClickable:true,
      isSuccess:false,
      importType : 'certificationList',
    }
  }

  //当前时间
  getCurrentDate(){
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}-${month<10?`0${month}`:`${month}`}-${date<10?`0${date}`:`${date}`}`
  }

  //结束关闭
  gotoHome = () => {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/train/trainPlanAndImport'
    }));
  };

  //认证考试批量导入保存
  saveAction = () => {
    this.setState({ isSaveClickable: false });
    const{dispatch} = this.props;
    let planList = this.props.importaExamDataList;
    /*非空校验*/
    if(planList.length < 1)
    {
      message.error('导入的认证考试信息为空，请填写后提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    /*封装基本信息，即overtime_team_apply表数据 begin */
    let plan_id = Cookie.get('userid') + Number(Math.random().toString().substr(3,7) + Date.now()).toString(32);

    /*封装课程信息，即train_class_center表数据 begin */
    let certificationList = [];
    planList.map((item) => {
      let planData = {
        //认证年份
        arg_curr_year: item.exam_year,
        //认证考试名称
        arg_certification_name: item.exam_name,
        //认证考试单位
        arg_certification_unit:item.exam_unit,
      };
      certificationList.push(planData);
    });
    /*封装课程信息 end */
    return new Promise((resolve) => {
      dispatch({
        //全院级必修课保存
        type:'exam_checklist_model/examChecklistSubmit',
        certificationList,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        this.setState({ isSaveClickable: false });
        this.setState({ isSuccess: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/train/trainPlanAndImport'}));
        },500);
      }
      if(resolve === 'false')
      {
        this.setState({ isSaveClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/train/trainPlanAndImport'}));
    });
  };

  class_columns = [
    { title: '序号', dataIndex: 'indexID' },
    { title: '年份', dataIndex: 'exam_year' },
    { title: '认证名称', dataIndex: 'exam_name' },
    { title: '认证单位', dataIndex: 'exam_unit' },
  ];

  render() {
    const examDataList = this.props.importaExamDataList;
    let fileList = [];
    let name = '';
    let url = '';
    return(
      <div>
        <br/>
        <div style={{ float: 'left'}}> 
          <a href="/filemanage/download/needlogin/hr/exam_list.xlsx" ><Button >{'认证考试清单模板下载'}</Button></a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Excel dispatch={this.props.dispatch} importType = {this.state.importType} />
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <br/><br/>
        <br/>

        <Row span={2} style={{textAlign: 'center'}}><h2>{new Date().getFullYear()}年认证考试清单</h2></Row>
        <br/>

        <Card title="认证考试清单">
          <br/>
          <br/>
          <Table
            columns={this.class_columns}
            dataSource={examDataList}
            pagination={true}
            //scroll={{x: '100%', y: 450}}
            width={'100%'}
            bordered= {true} 
          />
        </Card>
        <br/><br/>
        <br/><br/>
        <div style={{ textAlign: 'center'}}>
          <Button onClick={this.gotoHome}>关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.saveAction} disabled={!this.state.isSaveClickable}>{this.state.isSaveClickable ? '保存并同步' : (this.state.isSuccess ? '已成功同步' :  '正在处理中...')}</Button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.exam_checklist_model,
    ...state.exam_checklist_model
  };
}

exam_checklist = Form.create()(exam_checklist);
export default connect(mapStateToProps)(exam_checklist); 
