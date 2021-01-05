/**
 * 文件说明：导入劳动合同
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-09-16
 **/
import React ,{Component} from 'react';
import {connect} from "dva";
import {Button, Card, Form, Input, Row, Select,message, Table} from "antd";
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
import ExcelImportPromote from "../../rankpromote/promote/excelImportPromote";
import styles from "./style.less";

const { Option } = Select;

class promoteImportData extends Component{
  constructor (props) {
    super(props);
    this.state = {
      isSaveClickable:true,
      isSuccess:false,
      personPromoteDataList:[],
      ou_name : Cookie.get("OU"),
      user_id : Cookie.get("userid"),
      dept_id : Cookie.get("dept_id"),
      //显示：1：导入显示，2：查询显示，默认是查询显示
      showTablesDataFlag : '2',
      saveFlag : true,
      text: '',
    }
  }
  person_promote_columns = [
    { title: '序号', dataIndex: 'indexID',width:'80px',},
    { title: '员工编号', dataIndex: 'user_id',width:'100px'},
    { title: '姓名', dataIndex: 'user_name',width:'100px'},
    { title: '所属部门', dataIndex: 'dept_name',width:'180px'},
    { title: '入职日期', dataIndex: 'join_time' ,width:'180px'},
    { title: '晋升年份', dataIndex: 'year' ,width:'100px'},
    { title: '之前职级薪档', dataIndex: 'rank_sequence_before' ,width:'180px'},
    { title: '之前职级', dataIndex: 'rank_level_before' ,width:'100px'},
    { title: '之前薪档', dataIndex: 'rank_grade_before' ,width:'100px'},
    { title: '当前职级薪档', dataIndex: 'rank_sequence' ,width:'180px'},
    { title: '当前职级', dataIndex: 'rank_level' ,width:'100px'},
    { title: '当前薪档', dataIndex: 'rank_grade' ,width:'100px'},
    { title: '生效日期', dataIndex: 'effective_time' ,width:'180px'},
    { title: '晋升路径', dataIndex: 'promotion_path' ,width:'240px'},
    { title: '是否走新员工晋级', dataIndex: 'new_user_path' ,width:'180px'},
    { title: '人才标识', dataIndex: 'talents_name' ,width:'100px'},
  ];
  //批量导入保存
  saveAction = () => {
    this.setState({ isSaveClickable: false });
    let importPromoteDataList = this.props.importPromoteDataList;
    /*非空校验*/
    if(importPromoteDataList.length < 1)
    {
      message.error('导入信息为空，请重新导入后提交');
      this.setState({ isSaveClickable: true });
      return;
    }

    /*封装批量导入信息 begin */
    let transferPromoteData = [];

    importPromoteDataList.map((item) => {
      let tempData = {
        //用户ID
        arg_user_id: item.user_id,
        arg_user_name: item.user_name,
        arg_dept_name: item.dept_name,
        arg_year: item.year,
        arg_rank_sequence_before:item.rank_sequence_before,
        arg_rank_grade_before:item.rank_grade_before,
        arg_rank_level_before:item.rank_level_before,
        arg_rank_sequence:item.rank_sequence,
        arg_rank_level:item.rank_level,
        arg_rank_grade:item.rank_grade,
        arg_effective_time:item.effective_time,
        arg_join_time:item.join_time,
        arg_promotion_path:item.promotion_path,
        arg_talents_name:item.talents_name,
        arg_new_user_path:item.new_user_path,
      };
      transferPromoteData.push(tempData);
    });

    const{dispatch} = this.props;
    return new Promise((resolve) => {
      dispatch({
        //合同信息保存
        type:'promoteImportModel/importPromoteDataSubmit',
        transferPromoteData,
        resolve
      });
    }).then((resolve) => {
      console.log("resolve==="+resolve);
      if(resolve === "success"){
        this.setState({ isSaveClickable: false });
        this.setState({ isSuccess: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/rankpromote/promoteimport'
          }));
        },500);
      }
      if(resolve === "erro"){
		    message.error("导入失败！请检查导入信息！");
        this.setState({ isSaveClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/rankpromote/promoteimport'}));
    });
  }
  //结束关闭
  gotoHome = () => {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/rankpromote/promoteimport'
    }));
  };
  //更新状态
  updateVisible = (value) =>{
    if(value === true){
      this.setState({
        showTablesDataFlag: 1,
        saveFlag: false,
      });
    }
  };

  render() {
    const {importPromoteDataList} = this.props;
    console.log("ooooooooooooooooooooooo");
    console.log(importPromoteDataList);
    console.log("ooooooooooooooooooooooo");
    return(
      <div>
        <Row span={2} style={{textAlign: 'center'}}><h2>晋升信息导入</h2></Row>
        <br/>
        <div style={{ float: 'left'}}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {
            this.state.isSaveClickable ?
              <ExcelImportPromote dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
              : (this.state.isSuccess ?
                <ExcelImportPromote dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
                :
                null
              )
          }
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.saveAction} disabled={this.state.saveFlag}>{this.state.isSaveClickable ? '提交' : (this.state.isSuccess ? '已成功同步' :  '正在处理中...')}</Button>
          <br/><br/>
          <div style={{ width: "1400" }}>
          <Table
              columns={this.person_promote_columns}
              dataSource={importPromoteDataList}
              pagination={true}
              className={styles.tableStyle}
              scroll={{ x: 2330, y: 450 }}
              bordered={true}
            />
          </div>
        </div>
        <div style={{ textAlign: 'center'}}>
          <Button onClick={this.gotoHome}>关闭</Button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.promoteImportModel,
    ...state.promoteImportModel
  };
}

promoteImportData = Form.create()(promoteImportData);
export default connect(mapStateToProps)(promoteImportData);
