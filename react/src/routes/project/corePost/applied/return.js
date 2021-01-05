/**
 * 作者：靳沛鑫
 * 日期：2019-06-19
 * 邮箱：1677401802@qq.com
 * 文件说明：续聘退回
 */
import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import {Table, Select, Breadcrumb, Icon, Tooltip, Button, Pagination, Row, Col, DatePicker, Input, Upload, message, Modal, Popconfirm} from 'antd';
import styles from '../corePosts.less';
import Cookie from "js-cookie";
//import moment from 'moment';

//const Search = Input.Search;
const Option = Select.Option;

class Info extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
          visible1: false
        }
    }
    uploads = {
        name: 'file',
        showUploadList: false,
        action: '/filemanage/fileupload',
        data:{
            argappname:'appFileUpdate',
            argtenantid:'10010',
            arguserid:Cookie.get('userid'),
            argyear:new Date().getFullYear(),
            argmonth:new Date().getMonth()+1,
            argday:new Date().getDate()
        }
      }
    columns = [{
        title: '序号',
        dataIndex: 'i',
        width: '5%',
        render: (text, record, index) => {
            return <div>{index + 1}</div>;
        }
    },{
         title: '生产业务部门',
         dataIndex: 'departmentName',
         sorter: true,
         width: '12%',
    },{
        title: '项目/小组名称',
        dataIndex: 'projectName',
        sorter: true,
        width: '12%',
    },{
        title: '团队系数',
        dataIndex: 'teamCoefficient',
        width: '7%',
    },{
        title: '核心岗位',
        dataIndex: 'name',
        width: '10%',
    },{
        title:'等级',
        dataIndex:'rank',
        width: '5%',
        render: (text) => {
          return <p>
            {
              text == '0' ? '普通' : (text > 1 ? '总监' : '高级')
            }
          </p>
        }
    },{
        title:'目标绩效职级',
        dataIndex:'targetPerformanceRank',
        width: '10%',
    },{
        title:'备注',
        dataIndex:'note',
        width: '8%',
    },{
        title:'姓名',
        dataIndex:'corepositionUserName',
        width: '6%',
    },{
        title:'人员所属院',
        dataIndex:'affiliatedAcademy',
        width: '9%',
    },{  title:'操作',
        //dataIndex:'do',
        width: '10%',
        render: (record)=> {
                return (
                    <div style={{textAlign: 'center'}}>
                        <Button type='primary'  onClick = {(e)=>this.addPerson(record,e)}>{'添加人'}</Button>
                    </div>
                )
            }
    }];

    /**
     * 作者：靳沛鑫
     * 日期：2019-06-13
     * 邮箱：1677401802@qq.com
     * 文件说明：提交或者终止
     */
    resetCond = (elem) => {
      if(elem){
        this.setState({
          title:'提交',
          elem
        })
      }else{
        this.setState({
          title:'终止流程',
          elem
        })
      }
    };
  //提交终止二次确认
    sureAwnser = () => {
        const {dispatch} = this.props;
        const elem=this.state.elem
        dispatch({type: 'appCheckReturn/resetCond',elem});
    };
    /**
     * 作者：靳沛鑫
     * 日期：2019-8-2
     * 邮箱：1677401802@qq.com
     * 文件说明：添加人模态窗
     */
    addPerson =(record, e) => {
      this.setState({
        visible1: true })
      const {dispatch} = this.props
      dispatch({
        type: 'appCheckReturn/addPerson',
        record
      });
    }
    /**
     * 作者：靳沛鑫
     * 日期：2019-8-2
     * 邮箱：1677401802@qq.com
     * 文件说明：模态窗取消
     */
    handleCancel1 = () =>{
      this.setState({
        visible1:false,
      })
    };
    /**
     * 作者：靳沛鑫
     * 日期：2019-8-2
     * 邮箱：1677401802@qq.com
     * 文件说明：模态窗确定
     */
    addCorePosts = () =>{
      const {dispatch} = this.props
      dispatch({
        type: 'appCheckReturn/addCorePosts',
        callback:(res)=>{
          if(res=='1'){
            this.setState({
              visible1:false})
          }
        }
      });
    }
    /**
     * 作者：靳沛鑫
     * 日期：2019-8-2
     * 邮箱：1677401802@qq.com
     * 文件说明：查询人员及其所属院
     */
    userAndAcademyNames = (id) =>{
      const {dispatch} = this.props
      dispatch({
        type:'appCheckReturn/userAndAcademyNames',id
      })
    }

    render(){
        const { returnList, params, query, userNameList} = this.props;
        if(query.task_status=='false'){
          this.columns.splice(10,1)
        }
        // 这里为每一条记录添加一个key，从0开始
        if(returnList.length){
            returnList.map((i,index)=>{
                i.key=index;
            })
        }
        //员工名单
        const userName_List = userNameList.map((item, index) => {
          return (
            <Option value={item.username+item.userId} key={index} title={item.username}>{item.username}</Option>
          )
        })

        return (
            <div className={styles['pageContainer']}>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                  <Breadcrumb.Item><Link to='/taskList'>任务列表</Link></Breadcrumb.Item>
                  <Breadcrumb.Item>{'续聘退回'}</Breadcrumb.Item>
                </Breadcrumb>
                <div><p style={{textAlign: 'center', fontSize: '20px', marginBottom: '10px'}}>续聘申请退回</p></div>
                <div><p style={{textAlign: 'center', marginBottom: '10px'}}>生产业务部门：{returnList.length ? returnList[0].departmentName : ''}</p></div>
                <Row gutter={20}>
                    <Col span={18}>
                        <span className={styles.label}>退回原因：
                            <Button>{params.opition}</Button>
                        </span>
                    </Col>
                    <Col span={6} style={{textAlign:'right'}}>
                        <Popconfirm
                          title={'请问您确认'+this.state.title+'么？'}
                          okText="是"
                          cancelText="否"
                          onConfirm={this.sureAwnser}
                        >
                          {query.task_status=='true' ? <Button type="primary" onClick={()=>this.resetCond(false)}>终止流程</Button>
                               : null}
                        </Popconfirm>
                        <Popconfirm
                          title={'请问您确认'+this.state.title+'么？'}
                          okText="是"
                          cancelText="否"
                          onConfirm={this.sureAwnser}
                        >
                          {query.task_status=='true' ? <Button type="primary" onClick={()=>this.resetCond(true)} style={{marginLeft:'10px'}}>提交</Button>
                              : null}
                        </Popconfirm>
                    </Col>
                </Row>

               <Table
                    columns={this.columns}
                    dataSource={returnList}
                    pagination={false}
                    className={styles.table}
                    //rowSelection={rowSelection}
                    //pagination={true}
                    bordered={true}>
                </Table>
                <Modal
                  title='添加人信息'
                  visible={this.state.visible1}
                  onCancel={this.handleCancel1}
                  onOk={this.addCorePosts}
                  width="700px"
                >
                  <Row style={{marginTop:'20px', textAlign:'right', lineHeight:'30px'}}>
                    <Col span={5}><span style={{color:'red'}}>*</span>姓&emsp;&emsp;&emsp;&emsp;&emsp;名：</Col>
                    <Col span={5}>
                      <Select style={{width: 150}} showSearch placeholder={'必选'} value={params.username} onChange={(value)=> this.userAndAcademyNames(value)}>{userName_List}</Select>
                    </Col>
                    <Col span={5}>人&ensp;员&ensp;所&ensp;属&ensp;院：</Col>
                    <Col span={5}>
                      <p style={{textAlign:'left'}}>{params.affiliatedAcademy}</p>
                    </Col>
                  </Row>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loading.models.appCheckReturn,
        ...state.appCheckReturn
    };
}

export default connect(mapStateToProps)(Info);
