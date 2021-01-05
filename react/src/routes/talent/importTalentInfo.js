/**
 * 文件说明：导入人才信息
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-09-19
 **/
import React ,{Component} from 'react';
import {connect} from "dva";
import {Button, Card, Form, Row, Select, Table, Input, Modal, message, Col } from "antd";
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
import ExcelImportTalentInfo from "./excelImportTalentInfo";
const { Option } = Select;

class ImportTalentInfo extends Component{
  constructor (props) {
    super(props);
    this.state = {
      isSaveClickable:true,
      isSuccess:false,
      personPostDataList:[],
      ou_name : Cookie.get("OU"),
      user_id : Cookie.get("userid"),
      level_id : 'all',
      //显示：1：导入显示，2：查询显示，默认是查询显示
      showTablesDataFlag : '2',
      saveFlag : true,
      //个人信息
      detail_visible:false,
      //导入还是查询显示控制
      searchFlag:false,
    }
  }

  //更新状态
  updateVisible = (value) =>{
    if(value === true){
      this.setState({
        showTablesDataFlag: 1,
        saveFlag: false,
      });
    }
  };

  dateFormatcheck(dataStr) {
    let date = dataStr;
    let result = date.match(/^(\d{4})(-|\/)(\d{2})\2(\d{2})$/);

    if (result == null)
    {
      return false;
    }
    console.log("result[4] : " + result[4]);
    let d = new Date(result[1], result[3] -1, result[4]);
    console.log("date : " + d);
    return (d.getFullYear() == result[1] && (d.getMonth()+1) == result[3] && d.getDate() == result[4]);
  }

  dateValuecheck(start_time,end_time) {
    start_time = start_time.replace(/\-/g,"");
    end_time = end_time.replace(/\-/g,"");
    if(start_time > end_time){
      return true;
    }else{
      return false;
    }
  }
  //人才信息批量导入保存
  saveAction = () => {
      this.setState({ isSaveClickable: false });

      const{dispatch} = this.props;
      let importTalentDataList = this.props.importTalentDataList;

      /*非空校验*/
      if(importTalentDataList.length < 1)
      {
        message.error('导入人才信息为空，请填写后提交');
        this.setState({ isSaveClickable: true });
        return;
      }

      let talent_import_id = this.state.user_id + Number(Math.random().toString().substr(3,7) + Date.now()).toString(32);

      /*封装批量导入信息 begin */
      let transferTalentData = [];
      let dateCheckR = true;
      let dateValueCheck = true;

      importTalentDataList.map((item) => {
        /*加班日期格式必须是YYYY-MM-DD*/
        let Q = this.dateFormatcheck(item.start_time);
        let A = this.dateFormatcheck(item.quit_time);
        let Z = this.dateFormatcheck(item.end_time);
        if(Q === false || A === false || Z === false )
        {
          dateCheckR = false;
        }

        /*入选日期不能小于等于退出时间*/
        let rt = this.dateValuecheck(item.start_time, item.end_time);
        if(rt === true)
        {
          dateValueCheck = false;
        }

        let tempData = {
            //用户ID
            arg_user_id: item.user_id,
            arg_create_person_id: Cookie.get("userid"),
            //用户名
            arg_user_name: item.user_name,
            //组织
            arg_dept_name: item.dept_name,
            //人才级别
            arg_talent_level:item.talent_level,
            //专业
            arg_talent_major:item.talent_major, 
            //开始时间
            arg_start_time:item.start_time,
            //退出时间
            arg_quit_time:item.quit_time,
            //聘期结束时间
            arg_end_time:item.end_time,
            //备注
            arg_remark:item.remark,
            //批量导入ID
            arg_import_id : talent_import_id,
        };
        transferTalentData.push(tempData);
      });
      /*封装批量导入信息 end */

      if(dateCheckR === false)
      {
        message.error('日期格式不是YYYY-MM-DD，请修改后再保存提交');
        this.setState({ isSaveClickable: true });
        return;
      }
      if(dateValueCheck === false)
      {
        message.error('退出时间必须大于入选时间，请修改后再保存提交');
        this.setState({ isSaveClickable: true });
        return;
      }

      return new Promise((resolve) => {
        dispatch({
          //合同信息保存
          type:'talentInfoImportModel/importTalenttDataSubmit',
          transferTalentData,
          resolve
        });
      }).then((resolve) => {
        if(resolve === 'success')
        {
          this.setState({ isSaveClickable: false });
          this.setState({ isSuccess: true });
          setTimeout(() => {
            dispatch(routerRedux.push({
              pathname:'/humanApp/talent/importTalentInfo'}));
          },500);
        }
        if(resolve === 'false')
        {
          this.setState({ isSaveClickable: true });
        }
      }).catch(() => {
        dispatch(routerRedux.push({
          pathname:'/humanApp/talent/importTalentInfo'}));
      });
  };

  handleLevelChange = (e) =>{ 
    this.setState({
      level_id: e,
    });
  };

  //结束关闭
  gotoHome = () => {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/labor/contractListSearch'
    }));
  };

  //查询
  search = () => {
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    console.log(this.state.level_id);
    console.log(this.props.form.getFieldValue("person_name"));
    console.log(Cookie.get('OUID'));
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    let arg_params = {};
    arg_params["arg_ou_id"] = Cookie.get('OUID');
    if(this.state.dept !== ''){
      arg_params["arg_talent_level"] = this.state.level_id; 
    }
    arg_params["arg_person_name"] = this.props.form.getFieldValue("person_name");
    const {dispatch} = this.props;

    return new Promise((resolve) => {
      dispatch({
        type: 'talentInfoImportModel/talentSearch',
        arg_param: arg_params,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        this.setState({
          searchFlag : true
        })
      }
      if(resolve === 'false')
      {
        message.error("无该类型人才!");
        this.setState({
          searchFlag : false
        })
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/talent/importTalentInfo'}));
    });
  }

  show_talent_info_columns = [
    { title: '序号', dataIndex: 'indexID',width:'5%',},
    { title: '员工编号', dataIndex: 'user_id' ,width:'5%',},
    { title: '员工姓名', dataIndex: 'user_name' ,width:'5%',},
    { title: '组织', dataIndex: 'dept_name' ,width:'15%',},
    { title: '人才级别', dataIndex: 'talent_level' ,width:'15%',},
    { title: '专业', dataIndex: 'talent_major' ,width:'10%',},
    { title: '聘期结束日期', dataIndex: 'end_time' ,width:'10%',},
    { title: '备注', dataIndex: 'remark' ,width:'10%',},
  ];
  search_talent_info_columns = [
    { title: '序号', dataIndex: 'indexID',width:'5%',},
    { title: '员工编号', dataIndex: 'user_id' ,width:'5%',},
    { title: '员工姓名', dataIndex: 'user_name' ,width:'5%',},
    { title: '组织', dataIndex: 'dept_name' ,width:'15%',},
    { title: '人才级别', dataIndex: 'talent_level' ,width:'15%',},
    { title: '专业', dataIndex: 'talent_major' ,width:'10%',},
    { title: '聘期结束日期', dataIndex: 'end_time' ,width:'10%',},
    { title: '备注', dataIndex: 'remark' ,width:'10%',},
    { title: '操作', dataIndex: 'operation', key: 'operation',width:'5%', render: (text,record) => (
      <span>
        <a onClick={()=>this.talentInfoDetail(record)}>详情</a>
      </span>
    ) },
  ];
  show_detail_talent_info_columns = [
    { title: '序号', dataIndex: 'indexID',width:'5%',},
    { title: '员工编号', dataIndex: 'user_id' ,width:'5%',},
    { title: '员工姓名', dataIndex: 'user_name' ,width:'5%',},
    { title: '组织', dataIndex: 'dept_name' ,width:'15%',},
    { title: '入选时间', dataIndex: 'start_time' ,width:'10%',},
    { title: '退出时间', dataIndex: 'quit_time' ,width:'10%',},
    { title: '人才级别', dataIndex: 'talent_level' ,width:'15%',},
    { title: '专业', dataIndex: 'talent_major' ,width:'10%',},
    { title: '聘期结束日期', dataIndex: 'end_time' ,width:'10%',},
    { title: '备注', dataIndex: 'remark' ,width:'10%',},
  ];
  talentInfoDetail = (record) => {
    console.log("record==="+JSON.stringify(record));
    let arg_user_id = record.user_id;
    const {dispatch} = this.props;

    return new Promise((resolve) => {
      dispatch({
        type: 'talentInfoImportModel/talentInfoDetailSearch',
        arg_user_id,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        this.setState ({
          detail_visible: true,
          
        });
      }
      if(resolve === 'false')
      {
        message.error("出错了!");
        this.setState({
          detail_visible : false
        })
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/talent/importTalentInfo'}));
    });
  };
  
  //取消弹窗
  handleCancel = () => {
    this.setState({
      detail_visible: false,
    });
  };
  //取消弹窗
  handOk = () => {
    this.setState({
      detail_visible: false,
    });
  };

  render() {
    let auth_user = Cookie.get('username');
    const { getFieldDecorator } = this.props.form;

    const ouList = this.props.ouList;
    let ouOptionList = '';
    if(ouList.length){
      ouOptionList = ouList.map(item =>
        <Option key={item.OU}>{item.OU}</Option>
      );
    };
    const auth_ou = Cookie.get("OU");
    let importTalentData = this.props.importTalentDataList;
    if(importTalentData){
      for(let i=0; i<importTalentData.length ; i++){
        importTalentData[i]["indexID"] = i+1;
      }
    }
    let searchTalentData = this.props.searchTalentDataList;
    if(searchTalentData){
      for(let i=0; i<searchTalentData.length ; i++){
        searchTalentData[i]["indexID"] = i+1;
      }
    }
    let detailTalentData = this.props.detailTalentDataList;
    if(detailTalentData){
      for(let i=0; i<detailTalentData.length ; i++){
        detailTalentData[i]["indexID"] = i+1;
      }
    }
      console.log(detailTalentData)
    return(
      <div>
        
        
        <Row span={2} style={{textAlign: 'center'}}><h2>{this.state.ou_name+" 人才信息"}</h2></Row>

        <br/>
        <div>
        <span> 组织单元： </span>
        <Select style={{width: 160}} defaultValue={auth_ou} disabled={true}>
            {ouOptionList}
        </Select>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span> 人才级别： </span>
        <Select style={{ width: 160 }} defaultValue = 'all' onSelect={this.handleLevelChange} >
          <Option key={"all"}>全部</Option>
          <Option key={"leading"}>领军人才</Option>
          <Option key={"expert"}>专家人才</Option>
          <Option key={"special"}>骨干人才</Option>
          <Option key={"new"}>新锐人才</Option>
        </Select>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

        <span> 员工姓名： </span>
        {getFieldDecorator('person_name',{
            initialValue: auth_user
          })(
            <Input style={{width: 200}}  disabled={!this.props.roleFlag ? true : false}/>
          )}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

        <Button type="primary" onClick={()=>this.search()} disabled={this.state.isSaveClickable ? false : (this.state.isSuccess ? false :  true)}>查询</Button>
        
        {
          this.props.roleFlag  
          ?
            <Col>
            <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a href="/filemanage/download/needlogin/hr/talentModel.xlsx" >
              <Button disabled={this.state.isSaveClickable ? false : (this.state.isSuccess ? false :  true)}>{'人才信息模板下载'}</Button>
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            { 
              this.state.isSaveClickable 
              ? 
                <ExcelImportTalentInfo dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
              : 
                (
                  this.state.isSuccess 
                  ? 
                    <ExcelImportTalentInfo dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
                  : 
                    null
                )
            }
            </Col>
          :
            null
        }
        
        </div>
        <br/>
        <Card >
          {
            this.state.searchFlag 
              ?
                <Table
                columns={this.search_talent_info_columns}
                dataSource={searchTalentData }
                pagination={true}
                scroll={{y: 400}}
              />
            :
              <Table
              columns={this.show_talent_info_columns}
              dataSource={importTalentData }
              pagination={true}
              scroll={{y: 400}}
          />
          }
        </Card>

        <br/>
        <div style={{ textAlign: 'center'}}>
          <Button onClick={this.gotoHome} disabled={this.state.isSaveClickable ? false : (this.state.isSuccess ? false :  true)}>关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.saveAction} disabled={!this.state.isSaveClickable} disabled={this.state.saveFlag}>{this.state.isSaveClickable ? '提交' : (this.state.isSuccess ? '已成功提交可再次提交' :  '正在处理中...')}</Button>
        </div>

        <Modal
        title="个人人才信息"
        visible={this.state.detail_visible}
        onOk={this.handOk}
        onCancel={this.handleCancel}
        width={'80%'}
      >
        <div>
          <Table
            columns={this.show_detail_talent_info_columns}
            dataSource={detailTalentData }
            pagination={true}
            width={'100%'}
          />
        </div>
      </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.talentInfoImportModel,
    ...state.talentInfoImportModel
  };
}

ImportTalentInfo = Form.create()(ImportTalentInfo);
export default connect(mapStateToProps)(ImportTalentInfo);
