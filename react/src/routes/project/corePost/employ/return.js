/**
 * 作者：靳沛鑫
 * 日期：2019-06-19
 * 邮箱：1677401802@qq.com
 * 文件说明：竞聘退回
 */
import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import {
  Table, Select, Icon, Tooltip, Button, Pagination, Row, Col, DatePicker, Input, Upload, message, Modal, Popconfirm, Breadcrumb} from 'antd';
import styles from '../corePosts.less';
import Cookie from "js-cookie";
//import moment from 'moment';

//const Search = Input.Search;
const Option = Select.Option;

class Info extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
          reload:false
        }
    }
    uploads = {
        name: 'file',
        showUploadList: false,
        action: '/filemanage/fileupload',
        data:{
            argappname:'responsFileUpdate',
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
         width: '11%',
    },{
        title: '项目/小组名称',
        dataIndex: 'projectName',
        sorter: true,
        width: '11%',
    },{
        title: '团队系数',
        dataIndex: 'teamCoefficient',
        width: '10%',
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
        width: '10%',
    },{
        title:'文件',
        dataIndex:'fileName',
        width: '10%',
        render: (text, record, index) => {
          return <a style={{textAlign: 'center'}} onClick = {() => this.downloadUpload(record)}>{text}</a>;
        }
    },{  title:'操作',
        //dataIndex:'do',
        width: '10%',
        render: (text, record, index)=> {
                return (
                    <div style={{textAlign: 'center'}}>
                        <Upload {...this.uploads} onChange={(info) => this.upDataReturn(info, record.id, index) } style={{marginRight: 10}}>
                            <Button type='primary' disabled={this.props.numBox[index]=='0'} style={{marginLeft: 0}}>{'上传'}</Button>
                        </Upload>
                    </div>
                )
            }
    }];
   //文件下载
   downloadUpload = (record) =>{
     let url =record.fileUrl;
     window.open(url);
   };
   /**
   * 作者：靳沛鑫
   * 日期：2019-06-19
   * 邮箱：1677401802@qq.com
   * 文件说明：提交上传信息
   */
    upDataReturn = (info, elem, index) => {
      const {dispatch} = this.props;
      dispatch({
        type: 'checkReturn/changeNum',
        num:index
      });
      this.setState({
        reload:true})
      if (info.file.status === 'done') {
        dispatch({
          type: 'checkReturn/upDataReturn',
          corepositionId: elem,
          name: info.file.name,
          url: info.file.response.file.RelativePath,
          num: index,
          callback:(res)=>{
            if(res=='1'){
              this.setState({
                reload:false})
            }
          }
        });
      } else if(info.fileList[info.fileList.length-1].status === 'error'){
        message.error(`${info.file.name} 上传失败！.`);
      }
    }
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
  //模态窗确认
    sureAwnser = () => {
      const {dispatch} = this.props;
      const elem=this.state.elem
      dispatch({type: 'checkReturn/resetCond',elem});
    };
    render(){
        const { returnList, params, query } = this.props;
        if(query.task_status=='false'){
          this.columns.splice(9,1)
        }
        // 这里为每一条记录添加一个key，从0开始
        if(returnList.length){
            returnList.map((i,index)=>{
                i.key=index;
            })
        }
        return (
            <div className={styles['pageContainer']}>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                  <Breadcrumb.Item><Link to='/taskList'>任务列表</Link></Breadcrumb.Item>
                  <Breadcrumb.Item>{'竞聘退回'}</Breadcrumb.Item>
                </Breadcrumb>
                <div><p style={{textAlign: 'center', fontSize: '20px', marginBottom: '10px'}}>竞聘申请退回</p></div>
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
                          {query.task_status=='true' ? <Button type="primary" disabled={this.state.reload} onClick={()=>this.resetCond(true)} style={{marginRight:'10px'}}>提交</Button>
                            : null}
                        </Popconfirm>
                    </Col>
                </Row>
                <Modal
                  title={this.state.title}
                  visible={this.state.expand}
                  onCancel={this.handleCancel1}
                  onOk={this.sureAwnser}
                  width="500px"
                >
                  <p>请问您确认{this.state.title}么</p>
                </Modal>
               <Table
                    columns={this.columns}
                    dataSource={returnList}
                    pagination={false}
                    className={styles.table}
                    //rowSelection={rowSelection}
                    //pagination={true}
                    //onRowClick={this.goHistoryDetail}
                    bordered={true}>
                </Table>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loading.models.checkReturn,
        ...state.checkReturn
    };
}

export default connect(mapStateToProps)(Info);
