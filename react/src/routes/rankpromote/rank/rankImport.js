/**
 * 文件说明：导入职级信息
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-09-16
 **/
import React ,{Component} from 'react';
import {connect} from "dva";
import {Button, Card, Form, Input, message, Modal, Popconfirm, Row, Select, Table} from "antd";
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
import ExcelImportRank from "../../rankpromote/rank/excelImportRank";
import exportExl from "../../cost/exportExlForImportLabor";

const { Option } = Select;

class rankImport extends Component{
  constructor (props) {
    super(props);
    this.state = {
      isSaveClickable:true,
      isSuccess:false,
      personRankDataList:[],
      ou_name : Cookie.get("OU"),
      user_id : Cookie.get("userid"),
      dept_id : Cookie.get("dept_id"),
      //显示：1：导入显示，2：查询显示，默认是查询显示
      showTablesDataFlag : '2',
      saveFlag : true,
      text: '',
      visible: false,
    }
  }

  //批量导入保存
  saveAction = () => {

  }

  handleDeptChange = (e) =>{
    this.setState({
      dept_id: e,
    });

    let param = {
      arg_dept_id : e,
      arg_ou_id : Cookie.get('OUID'),
      arg_text: this.state.text
    };
    const{dispatch} = this.props;
    dispatch({
      //全院级必修课保存
      type:'rankImportModel/rankQuery',
      param: param
    });
  };
  //更新状态
  updateVisible = (value) =>{
  };

  // 点击导出按钮
  /*
  exportTable=()=>{
    let ou_name = Cookie.get('OU');
    var tableName=ou_name;

    //数据源
    const {importRankDataList} = this.props;

    if(importRankDataList !== null && importRankDataList.length !== 0){
      //exportExl( importRankDataList, tableName, this.export_rank_columns )
    }else{
      message.info("导出数据为空！")
    }
  }*/
  // 点击导入按钮
  importTable=()=>{
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/rankpromote/rankImport/rankImportData'
    }));
  }
  //模糊查询
  handleTextChange = (e) => {
    this.setState ({
      text: e.target.value
    })
  };
  // 点击查询按钮
  queryRank=()=>{
    console.log("queryRank");
    let param = {
      arg_dept_id : this.state.dept_id,
      arg_ou_id : Cookie.get('OUID'),
      arg_text: this.state.text
    };
    const{dispatch} = this.props;
    dispatch({
      //全院级必修课保存
      type:'rankImportModel/rankQuery',
      param: param
    });
  }
  //职级历史
  rankHistory = (record) => {
    let arg_user_id = record.user_id;
    const {dispatch} = this.props;
    dispatch({
      type: 'rankImportModel/rankPersonSearch',
      arg_user_id
    });
    this.setState ({visible: true});
  };
  handleCancel = () => {
    this.setState ({visible: false});
  };
  exportTable=()=>{
    let  ou_name = Cookie.get("OU");
    var tableName = ou_name+'-职级信息';

    //数据源
    const {searchRankDataList} = this.props;
    if(searchRankDataList !== null && searchRankDataList.length !== 0){
      exportExl( searchRankDataList, tableName, this.export_rank_columns)
    }else{
      message.info("导出数据为空！")
    }
  }

  person_rank_columns = [
    { title: '序号', dataIndex: 'indexID',width:'50px',},
    { title: '姓名', dataIndex: 'user_name',width:'80px'},
    { title: '员工编号', dataIndex: 'user_id',width:'80px'},
    { title: '所属单位', dataIndex: 'ou_name',width:'120px'},
    { title: '所属部门', dataIndex: 'dept_name',width:'100px'},
    { title: '年度', dataIndex: 'year' ,width:'60px'},
    { title: '加入联通时间', dataIndex: 'join_time',width:'110px'},
    { title: '现职级薪档', dataIndex: 'rank_sequence_before',width:'100px'},
    { title: '调整后职级薪档', dataIndex: 'rank_sequence',width:'120px'},
    { title: '剩余考核积分', dataIndex: 'bonus_points',width:'110px'},
    { title: '生效日期', dataIndex: 'effective_time',width:'110px'},
    { title: '晋升路径', dataIndex: 'promotion_path',width:'150px'},
    { title: '人才标识', dataIndex: 'talents_name',width:'100px'},
    {
      title: '操作', dataIndex: '', width: '100px',
      render: (text, record, index) => {
        return (
          <div>
            <Button
              type='primary'
              size='small'
              onClick={() => this.rankHistory(record)}
            >{'职级记录'}
            </Button>
            &nbsp;&nbsp;&nbsp;
          </div>
        );
      }
    }
  ];
  export_rank_columns = [
    { title: '序号', dataIndex: 'indexID',width:'50px',},
    { title: '姓名', dataIndex: 'user_name',width:'80px'},
    { title: '员工编号', dataIndex: 'user_id',width:'80px'},
    { title: '所属单位', dataIndex: 'ou_name',width:'120px'},
    { title: '所属部门', dataIndex: 'dept_name',width:'100px'},
    { title: '年度', dataIndex: 'year' ,width:'60px'},
    { title: '加入联通时间', dataIndex: 'join_time',width:'110px'},
    { title: '现职级薪档', dataIndex: 'rank_sequence_before',width:'100px'},
    { title: '调整后职级薪档', dataIndex: 'rank_sequence',width:'120px'},
    { title: '剩余考核积分', dataIndex: 'bonus_points',width:'110px'},
    { title: '生效日期', dataIndex: 'effective_time',width:'110px'},
    { title: '晋升路径', dataIndex: 'promotion_path',width:'150px'},
    { title: '人才标识', dataIndex: 'talents_name',width:'100px'}
  ];

  render() {
    const {ouList,deptList,searchRankDataList,historyDataList} = this.props;
    let ouOptionList = '';
    if(ouList.length){
      ouOptionList = ouList.map(item =>
        <Option key={item.OU}>{item.OU}</Option>
      );
    };
    const auth_ou = Cookie.get("OU");
    let deptOptionList = '';
    if(deptList.length){
      deptOptionList = deptList.map(item =>
        <Option key={item.court_dept_id}>{item.court_dept_name}</Option>
      );
    };
    const initdeptID = Cookie.get("dept_name");

    return(
      <div>
        <Row span={2} style={{textAlign: 'center'}}><h2>职级信息查询导入</h2></Row>
        <br/>
        <div style={{ float: 'left'}}>
          <span> 组织单元： </span>
          <Select style={{width: 160}} defaultValue={auth_ou} disabled={true}>
            {ouOptionList}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span> 部门： </span>
          <Select style={{ width: 160 }} defaultValue= {initdeptID} onSelect={this.handleDeptChange}>
            <Option key= 'all'>全部</Option>
            {deptOptionList}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Input style={{width: 200}} placeholder="姓名/员工编号" onChange={this.handleTextChange} value={this.state.text}/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.importTable}>批量导入</Button>&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="/filemanage/download/needlogin/hr/rank_temp.xlsx" ><Button >{'模板下载'}</Button></a>&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" disabled={searchRankDataList[0]?false:true} onClick={this.exportTable}>导出</Button>&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.queryRank}>查询</Button>&nbsp;&nbsp;
          <br/><br/>
          <Table
              columns={this.person_rank_columns}
              dataSource={searchRankDataList}
              pagination={true}
              scroll={{y: 400}}
            />
        </div>
        <Modal
          title="职级信息"
          visible={this.state.visible}
          width={'1200px'}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.handleCancel}>
              关闭
            </Button>
          ]}
        >
          <div>
            <Form>
              <Table
                columns={this.export_rank_columns}
                dataSource={historyDataList}
                pagination={false}
                bordered={true}
              />
            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.rankImportModel,
    ...state.rankImportModel
  };
}

rankImport = Form.create()(rankImport);
export default connect(mapStateToProps)(rankImport);
