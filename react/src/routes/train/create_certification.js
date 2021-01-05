/**
 * 文件说明：培训管理-创建分院、部门级通用认证计划
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-07-09
 **/
import React ,{Component} from 'react';
import {connect} from "dva";
import {Button, Card, Form, message, Row, Table} from "antd";
import Excel from "../train/Excel";
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
import UpFile from "../train/upFile";

class Create_certification extends Component{
  constructor (props) {
    super(props);
    let user_name = Cookie.get('username');
    this.state = {
      user_name:user_name,
      isSaveClickable:true,
      isSuccess:false,
      importType : 'certification',
    }
  }
  //校验时间
  dateFormatcheck(dataStr) {
    let date = dataStr;
    let result = date.match(/^(\d{4})(-|\/)(\d{2})\2(\d{2})$/);

    if (result == null)
    {
      return false;
    }
    let d = new Date(result[1], result[3] -1, result[4]);
    return (d.getFullYear() == result[1] && (d.getMonth()+1) == result[3] && d.getDate() == result[4]);
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
      pathname:'/humanApp/train/train_index'
    }));
  };

  //培训计划批量导入保存
  saveAction = () => {
    this.setState({ isSaveClickable: false });

    const{dispatch} = this.props;
    let planList = this.props.importCreateCertificationDataList;
    /*非空校验*/
    if(planList.length < 1)
    {
      message.error('导入的课程信息为空，请填写后提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    /*封装基本信息，即overtime_team_apply表数据 begin */
    let plan_id = Cookie.get('userid') + Number(Math.random().toString().substr(3,7) + Date.now()).toString(32);

    /*封装课程信息，即train_class_center表数据 begin */
    let transferPlanList = [];
/*
    let dateCheckR = true;
*/
    planList.map((item) => {
/*    let return_date = this.dateFormatcheck(item.exam_time);
      if(return_date === false)
      {
        dateCheckR = false;
      }*/
      let planData = {
        //计划ID
        arg_plan_id: plan_id,
        //dept name
        arg_dept_name: item.dept_name,
        //认证名称
        arg_exam_name: item.exam_name,
        //考试人员
        arg_exam_person_name:item.exam_person_name,
        //考试人员id
        arg_exam_person_id : '',
        //报销标准
        arg_claim_fee:item.claim_fee,
        //计划考试时间
        arg_exam_time:item.exam_time,
        //考试费预算
        arg_exam_fee: item.exam_fee,
        //学分
        arg_exam_grade:item.exam_grade,
        //状态：（1、保存  2、提交审批中  3、审批完成   4、培训完成  5、课程结束）默认审批完成
        arg_state: '3',
        //ou_id
        arg_ou_id : Cookie.get('OUID'),
      };
      transferPlanList.push(planData);
    });
/*    if(dateCheckR === false)
    {
      message.error('日期格式不是YYYY-MM-DD，请修改后再保存提交');
      this.setState({ isSaveClickable: true });
      return;
    }*/

    /*封装课程信息 end */

    /*封装基本信息，即train_plan表数据 begin */
    let trainPlanData = {};
    //创建人ID
    trainPlanData["arg_create_person_id"] = this.state.user_id;
    //创建人姓名
    trainPlanData["arg_create_person_name"] = this.state.user_name;
    //创建时间
    trainPlanData["arg_create_time"] = this.getCurrentDate();
    //培训类型（1、总院计划   2、分院计划  3、部门计划）
    trainPlanData["arg_train_type"] = '1';
    //是否超值（0：正常  1：超支）
    trainPlanData["arg_if_budget"] ='0';
    //状态（:0：保存未提交   1：审批过程中  2：审批完成  3：驳回）
    trainPlanData["arg_state"] = '2';
    //添加文件信息
    trainPlanData["arg_pf_url"] = this.props.pf_url;
    trainPlanData["arg_file_relative_path"] = this.props.file_relativepath;
    trainPlanData["arg_file_name"] = this.props.file_name;
    /*封装基本信息，即train_plan表数据 end */

    return new Promise((resolve) => {
      dispatch({
        //全院级必修课保存
        type:'train_create_model/examSubmit',
        transferPlanList,
        trainPlanData,
        plan_id,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        this.setState({ isSaveClickable: false });
        this.setState({ isSuccess: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/train/train_index'}));
        },500);
      }
      if(resolve === 'false')
      {
        this.setState({ isSaveClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/train/train_index'}));
    });
  };

  // class_columns = [
  //   { title: '序号', dataIndex: 'indexID'},
  //   { title: '部门名称', dataIndex: 'dept_name'},
  //   { title: '认证名称', dataIndex: 'exam_name'},
  //   { title: '考试人员', dataIndex: 'exam_person_name'},
  //   { title: '报销标准', dataIndex: 'claim_fee'},
  //   { title: '计划考试时间', dataIndex: 'exam_time'},
  //   { title: '考试费预算', dataIndex: 'exam_fee'},
  //   { title: '学分', dataIndex: 'exam_grade'},
  // ];
  class_columns = [
    { title: '序号', dataIndex: 'indexID',width:'%5'},
    { title: '部门名称', dataIndex: 'dept_name',width:'%15'},
    { title: '认证名称', dataIndex: 'exam_name' ,width:'%20'},
    { title: '考试人员', dataIndex: 'exam_person_name' ,width:'%10'},
    { title: '报销标准', dataIndex: 'claim_fee' ,width:'%10'},
    { title: '计划考试时间', dataIndex: 'exam_time' ,width:'%15'},
    { title: '考试费预算', dataIndex: 'exam_fee' ,width:'%15'},
    { title: '学分', dataIndex: 'exam_grade' ,width:'%10'},
  ];

  render() {
    const classDataList = this.props.importCreateCertificationDataList;
    let fileList = [];
    let name = '';
    let url = '';

    return(
      <div>
        <br/>
        <div style={{ float: 'left'}}>
          <a href="/filemanage/download/needlogin/hr/exam_class_plan.xlsx" ><Button >{'认证考试计划模板下载'}</Button></a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Excel dispatch={this.props.dispatch} importType = {this.state.importType} />
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <br/><br/>
        <br/>

        <Row span={2} style={{textAlign: 'center'}}><h2>{new Date().getFullYear()}年认证考试计划</h2></Row>
        <br/>

        <Card title="认证考试计划课程信息">
          <br/>
          <br/>
          <Table
            columns={this.class_columns}
            dataSource={classDataList}
            pagination={true}
            //scroll={{x: '100%', y: 450}}
            width={'100%'}
            bordered= {true}
          />
        </Card>
        <br/><br/>

        <Card title="附件信息">
          <UpFile filelist = {fileList}
                  name={name}
                  url={url}/>
        </Card>

        <br/><br/>

        <div style={{ textAlign: 'center'}}>
          <Button onClick={this.gotoHome}>关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.saveAction} disabled={!this.state.isSaveClickable}>{this.state.isSaveClickable ? '保存' : (this.state.isSuccess ? '已成功保存' :  '正在处理中...')}</Button>

        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.train_create_model,
    ...state.train_create_model
  };
}

Create_certification = Form.create()(Create_certification);
export default connect(mapStateToProps)(Create_certification);
