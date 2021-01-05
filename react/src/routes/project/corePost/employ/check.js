/**
 * 作者：靳沛鑫
 * 日期：2019-06-14
 * 邮箱：1677401802@qq.com
 * 文件说明：竞聘审核
 */
import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import {Table, Select, Icon, Input, Tooltip, Button, Tabs, Pagination, Row, Col, DatePicker, Modal, Breadcrumb} from 'antd';
import styles from '../corePosts.less';
//import moment from 'moment';
const TabPane = Tabs.TabPane;

const Search = Input.Search;
const Option = Select.Option;
/*const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';*/

class Query extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
          visible1: false,
        };
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
        width: '15%',
    },{
        title: '项目/小组名称',
        dataIndex: 'projectName',
        sorter: true,
        width: '15%',
    },{
        title: '团队系数',
        dataIndex: 'teamCoefficient',
        width: '10%',
    },{
        title:'核心岗位',
        dataIndex:'name',
        width: '10%',
    },{
        title:'等级',
        dataIndex:'rank',
        width: '8%',
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
        width: '20%',
    },{
        title:'文件',
        dataIndex:'fileName',
        width: '10%',
        render: (text, record, index) => {
          return <a style={{textAlign: 'center'}} onClick = {() => this.downloadUpload(record)}>{text}</a>;
        }
    }];
    //文件下载
    downloadUpload = (record) =>{
      let url =record.fileUrl;
      window.open(url);
    };

    hiscolumns = [{
        title: '序号',
        dataIndex: 'i',
        width: '5%',
        render: (text, record, index) => {
          return <div>{index + 1}</div>;
      }
    },{
        title: '环节状态',
        dataIndex: 'status',
        width: '15%',
        render: (text) => {
          return <p>
            {
             text == '0' ? '代办' : (text == '1' ? '办毕' : (text == '2'? '办结':"他人办"))
            }
          </p>
        }
    },{
        title: '环节名称',
        dataIndex: 'role',
        width: '15%',
    },{
        title: '操作人',
        dataIndex: 'operateName',
        width: '10%',
    },{
        title:'审批类型',
        dataIndex:'operateType',
        width: '10%',
        render: (text) => {
          return <p>
            {
              text== '0'? '':( text == '1' ? '提交' : (text == '2' ? '通过' : (text == '3' ? '退回' : '终止')))
            }
          </p>
        }
    },{
        title:'操作意见',
        dataIndex:'opinion',
        width: '10%',
    },{
        title:'审批时间',
        dataIndex:'reviewTime',
        width: '20%',
    }];
  /**
   * 作者：靳沛鑫
   * 日期：2019-06-18
   * 邮箱：1677401802@qq.com
   * 文件说明：退回和通过审核
   */
  resetCond =(ele)=>{
    if(ele==='postRefuse'){
       this.setState({
         visible1: true,
         title:'审核(退回)意见',
         message:'必填',
         ele,
       });
    }else if(ele==='postPass'){
       this.setState({
         visible1: true,
         title:'审核意见',
         message:'可选',
         ele,
       });
    }
  }
  //模态窗取消
  handleCancel1 = () =>{
    this.setState({
      visible1:false
    })
  };
  //全部下载
  allDownload =()=>{
     const Link = document.createElement('a');
     this.props.checkInfoList.map((iteam)=>{
       document.body.appendChild(Link);
       Link.style.display='none';
       Link.href = iteam.fileUrl;
       Link.download = iteam.fileName;
       Link.click();
       document.body.removeChild(Link);
     })
  }
  //审核建议
  changedText = (value) =>{
    const {dispatch} = this.props
    dispatch({type: 'employCheckQuery/changedText',
      value: value.target.value,
    });
  }
  //模态窗确定
  addResetPosts = () =>{
    const {dispatch} = this.props
    dispatch({type: 'employCheckQuery/addResetPosts',
      ele:this.state.ele,
      callback:(res)=>{
        if(res=='1'){
          this.setState({
            visible1:false})
        }
      }
    });
  }
    render(){
        const { checkInfoList, historyList, query } = this.props;
        // 这里为每一条记录添加一个key，从0开始
        if(checkInfoList.length){
            checkInfoList.map((i,index)=>{
                i.key=index;
            })
        }

        return (
            <div className={styles['pageContainer']}>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                  <Breadcrumb.Item><Link to='/taskList'>任务列表</Link></Breadcrumb.Item>
                  <Breadcrumb.Item>{'竞聘审核'}</Breadcrumb.Item>
                </Breadcrumb>
                <div><p style={{textAlign: 'center', fontSize: '20px', marginBottom: '10px'}}>竞聘审核</p></div>
                <div><p style={{textAlign: 'center', marginBottom: '10px'}}>生产业务部门：{checkInfoList.length ? checkInfoList[0].departmentName : ''}</p></div>

                <Tabs >
                    <TabPane tab="审核" key="1">
                        {
                          query.task_status=='true' && checkInfoList.length != 0 ?
                                <div style={{marginTop: 10, marginBottom: 15, paddingLeft: 10,paddingRight: 10, textAlign:'right'}}>
                                    <Button onClick={()=>this.resetCond('postRefuse')}>退回</Button>
                                    <Button type="primary" onClick={()=>this.resetCond('postPass')}>通过</Button>
                                    <Button type="primary" onClick={this.allDownload} style={{float:'left'}}>全部下载</Button>
                                </div>
                                : null
                        }
                        <Table
                            columns={this.columns}
                            dataSource={checkInfoList}
                            pagination={false}
                            className={styles.table}
                            bordered={true}
                            rowKey={record => record.id}
                        >
                        </Table>
                    </TabPane>
                    <TabPane tab="审核记录" key="2">
                        <Table
                          columns={this.hiscolumns}
                          dataSource={historyList}
                          pagination={false}
                          className={styles.table}
                          bordered={true}
                          rowKey={record => record.id}>
                        </Table>
                    </TabPane>
                </Tabs >
              <Modal
                title={this.state.title}
                visible={this.state.visible1}
                onCancel={this.handleCancel1}
                onOk={this.addResetPosts}
                width="700px"
              >
                <Input placeholder={this.state.message} onChange={(value)=> this.changedText(value)}/>
              </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loading.models.employCheckQuery,
        ...state.employCheckQuery
    };
}

export default connect(mapStateToProps)(Query);
