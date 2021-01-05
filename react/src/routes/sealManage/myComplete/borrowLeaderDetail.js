/**
 * 作者：贾茹
 * 日期：2019-9-12
 * 邮箱：m18311475903@163.com
 * 功能：院领导名章外借申请审核详情
 */
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from '../sealApply/sealApply.less';
import { Input, Modal, Button,Tabs, Table } from "antd";
import {routerRedux} from "dva/router";

const { TextArea } = Input;
const { TabPane } = Tabs;
//获取当天日期
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const strDate = date.getDate();

const currentdate = year + '-' + month + '-' + strDate;

class BorrowLeaderDetail extends React.Component {
  state = {

  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'borrowLeaderDetail/'+value,
        record : value2,
      })
    }else{
      console.log('aaa');
      this.props.dispatch({
        type:'borrowLeaderDetail/'+value,
      })
    }

  };
  //审批的table   columns
  judgecolumns=[
    {
      title: '序号',
      dataIndex: '',
      width: '8%',
      render: (text, record, index) => {
        return (<span>{index+1}</span>);
      },
    }, {
      title: '状态',
      dataIndex: 'process_state',
      width: '8%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '环节名称',
      dataIndex: 'process_name',
      width: '18%',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批人',
      dataIndex: 'approval_person',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批类型',
      dataIndex: 'approval_type',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批意见',
      dataIndex: 'approval_desc',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批时间',
      dataIndex: 'approval_datetime',
      width: '12%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    },
  ];

  //附件表格数据
  columns = [
    {
      title: '序号',
      dataIndex: '',
      width: '8%',
      key:'index',
      render: (text, record, index) => {
        return (<span>{index+1}</span>);
      },
    }, {
      title: '文件名称',
      dataIndex: 'upload_name',
      key:'key',
      width: '60%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    },{
      title: '文件描述',
      dataIndex: 'upload_type',
      width: '16%',
      editable: true,
      key:'type',
      render: (text, record, index) => {
        return (
          <div style={{ textAlign: 'left' }}>{text}</div>
        );
      },
    },{
      title: '操作',
      dataIndex: '',
      key:'opration',
      width: '24%',
      render: (text, record) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="small"
              onClick={(e) => this.downloadUpload(e,record)}
            >下载
            </Button>
          </div>
        );
      },
    }, ];
  render(){
    /*console.log(this.props.dataInfo);*/
    return (


      <div className={styles.outerField}>
        <div className={styles.title}>
          院领导名章外借申请审批详情
        </div>
        <div>
          <Button type="primary" className={styles.deteilReturn} onClick={()=>this.returnModel('return')}>返回</Button>
          <div style={{clear:'both'}}></div>
        </div>
        <div className={styles.detailOut}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="申请详情" key="1">
                <div className={styles.out}>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    申请时间
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.screateDate.substring(0,19)}</span>
                  </div>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    申请人
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.screate_user_name}</span>
                  </div>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    借用部门
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{Cookie.get('OU')}</span>
                    <span>-</span>
                    <span>{Cookie.get('dept_name')}</span>

                  </div>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    需借用领导名章
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.seal_details_name}</span>
                  </div>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey3}>
                    借用事由及时间
                    </span>
                    <span className={styles.lineColon4}>:</span>
                    <aside style={{width:'76%',float:'right'}}>
                      <p style={{lineHeight:'25px'}}>
                        因 &nbsp;
                        {this.props.dataInfo.form_reason}&nbsp;
                        工作需要，需申请借用  &nbsp;{this.props.dataInfo.seal_details_name}&nbsp; 名章。
                      </p>
                      <p className={styles.lineP}>
                        借用时间为 &nbsp;&nbsp;&nbsp;
                        {this.props.borrowTime}，
                        &nbsp;&nbsp;&nbsp;
                        预计归还时间为 &nbsp;&nbsp;&nbsp;
                        {this.props.returnTime}。
                      </p>
                      <p className={styles.linePred}>
                        在名章外借期间，本人保证将名章用于申请事由，并对使用结果承担一切法律责任。
                      </p>
                    </aside>
                    <div style={{clear:'both'}}></div>
                  </div>
                  {
                    this.props.tableUploadFile.length !==0?
                      <div style={{margin:'15px auto'}}>
                   <span className={styles.lineKey}>
                        用印材料
                   </span>
                        <span className={styles.lineColon}>:</span>
                        <Table
                          columns={ this.columns }
                          loading={ this.props.loading }
                          dataSource={ this.props.tableUploadFile }
                          className={ styles.tableStyle }
                          pagination = { false }
                          style={{marginTop:'10px'}}
                          bordered={ true }
                        />
                      </div>
                      :
                      null
                  }
                </div>
              <Button type="primary" onClick={()=>this.returnModel('downPage')} style={{marginLeft: "50%"}} disabled={this.props.isDown}>下载申请单</Button>
            </TabPane>
            <TabPane tab="审批环节" key="2">
              <Table
                className = { styles.tableStyle }
                dataSource = { this.props.judgeTableSource }
                columns = { this.judgecolumns }
                style = {{ marginTop: "20px" }}
                bordered={true}
                /*pagination={ false }*/
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {

  return {
    loading: state.loading.models.borrowLeaderDetail,
    ...state.borrowLeaderDetail
  };
}
export default connect(mapStateToProps)(BorrowLeaderDetail);
