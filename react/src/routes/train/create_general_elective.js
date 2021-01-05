/**
 * 文件说明：培训管理-创建全院（选修课）培训计划
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

class Create_general_elective extends Component{
  constructor (props) {
    super(props);
    let user_name = Cookie.get('username');
    this.state = {
      user_name:user_name,
      isSaveClickable:true,
      isSuccess:false,
      importType : 'elective',
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
      pathname:'/humanApp/train/train_index'
    }));
  };

  //培训计划批量导入保存
  saveAction = () => {
    this.setState({ isSaveClickable: false });

    const{dispatch} = this.props;
    let planList = this.props.importCenterClassElectiveDataList;
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
    planList.map((item) => {
      let planData = {
        //计划ID
        arg_plan_id: plan_id,
        //培训级别
        arg_train_level: item.train_level,
        //课程级别
        arg_class_level:item.class_level,
        //课程名称/方向
        arg_class_name:item.class_name,
        //岗位
        arg_train_person:item.train_person,
        //计划培训时长
        arg_train_hour:item.train_hour,
        //培训类型
        arg_train_kind: item.train_kind,
        //赋分规则
        arg_assign_score: item.assign_score,
        //课程来源-师资
        arg_train_teacher: item.train_teacher,
        //责任部门
        arg_center_dept: item.center_dept,
        //分院院主责部门
        arg_court_dept: '',
        //费用预算
        arg_train_fee: item.train_fee,
        //学分值
        arg_class_grade: item.class_grade,
        // 是否落地
        arg_plan_land: item.plan_land,
        // 落地组织机构
        arg_plan_branch: item.plan_branch,
        //备注
        arg_remark:item.remark,
        //培训计划类型（1、总院计划、2、济南分院  3、西安分院  4、哈尔滨分院   5 广州分院）
        arg_train_type: '1',
        //状态：（1、保存  2、提交审批中  3、审批完成   4、培训完成  5、课程结束）默认审批完成
        arg_state: '3',
        arg_if_claim : '',
      };
      transferPlanList.push(planData);
    });
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
        type:'train_create_model/centerClassElectiveSubmit',
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

  class_columns = [
    { title: '序号', dataIndex: 'number1' },
    { title: '培训级别', dataIndex: 'train_level' },
    { title: '课程级别', dataIndex: 'class_level' },
    { title: '课程名称/方向', dataIndex: 'class_name' },
    { title: '受训部门/岗位', dataIndex: 'train_person' },
    { title: '计划培训时长', dataIndex: 'train_hour' },
    { title: '培训类型', dataIndex: 'train_kind' },
    { title: '赋分规则', dataIndex: 'assign_score' },
    { title: '课程来源/师资', dataIndex: 'train_teacher' },
    { title: '责任部门', dataIndex: 'center_dept' },
    { title: '费用预算', dataIndex: 'train_fee' },
    { title: '学分值', dataIndex: 'class_grade' },
    { title: '是否落地', dataIndex: 'plan_land' },
    { title: '落地组织机构', dataIndex: 'plan_branch' },
    { title: '备注', dataIndex: 'remark' },
  ];

  render() {
    const classDataList = this.props.importCenterClassElectiveDataList;

    //附件信息
    let fileList = [];
    let name = '';
    let url = '';

    return(
      <div>
        <br/>
        <div style={{ float: 'left'}}>
          <a href="/filemanage/download/needlogin/hr/elective_class_plan.xls" ><Button >{'全院级（选修）培训计划模板下载'}</Button></a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Excel dispatch={this.props.dispatch} importType = {this.state.importType} />
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <br/><br/>
        <br/>

        <Row span={2} style={{textAlign: 'center'}}><h2>{new Date().getFullYear()}年全院级（选修课）培训计划</h2></Row>
        <br/>

        <Card title="全院级（选修课）培训计划课程信息">
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
          <Button onClick={this.saveAction} disabled={!this.state.isSaveClickable}>{this.state.isSaveClickable ? '保存并同步' : (this.state.isSuccess ? '已成功同步' :  '正在处理中...')}</Button>
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

Create_general_elective = Form.create()(Create_general_elective);
export default connect(mapStateToProps)(Create_general_elective);
