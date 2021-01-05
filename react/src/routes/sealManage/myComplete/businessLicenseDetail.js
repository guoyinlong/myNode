/**
 * 作者：贾茹
 * 日期：2019-9-12
 * 邮箱：m18311475903@163.com
 * 功能：营业执照复印件使用申请审核详情
 */
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from '../sealApply/sealApply.less';
import { Input, Button,Tabs, Table } from "antd";
import {routerRedux} from "dva/router";

const { TextArea } = Input;
const { TabPane } = Tabs;
//获取当天日期
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const strDate = date.getDate();

const currentdate = year + '-' + month + '-' + strDate;

class BusinessLicenseDetail extends React.Component {
  state = {

  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'businessLicenseDetail/'+value,
        record : value2,
      })
    }else{
      console.log('aaa');
      this.props.dispatch({
        type:'businessLicenseDetail/'+value,
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
      width: '50%',
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

  //点击下载附件
  downloadUpload = (e,record) =>{
    let url =record.upload_url;
    window.open(url);
  };

  render(){
    /*console.log(this.props.dataInfo);*/
    return (
      <div className={styles.outerField}>
        <div className={styles.title}>
          营业执照复印件使用申请审批详情
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
                    申请部门
                  </span>
                  <span className={styles.lineColon}>:</span>
                  <span>{this.props.dataInfo.form_dept_name}</span>
                </div>
                <div className={styles.lineOut}>
                  <span className={styles.lineKey}>
                    需使用证照名称
                  </span>
                  <span className={styles.lineColon}>:</span>
                  <span>{this.props.dataInfo.seal_details_name}</span>
                </div>
                <div className={styles.lineOut}>
                  <span className={styles.lineKey}>
                    所提交的对方单位
                  </span>
                  <span className={styles.lineColon}>:</span>
                  <span>{this.props.dataInfo.form_out_company}</span>
                </div>
                <div className={styles.lineOut}>
                  <span className={styles.lineKey2}>
                   复印件的用途及时间
                  </span>
                  <span className={styles.lineColon3}>:</span>
                  <aside style={{width:'76%',float:'right'}}>
                    <p>
                      本证照复印件仅供&nbsp;
                      {this.props.dataInfo.form_actual_usename}
                      （ 注：实际使用的单位名称或实际使用的自然人姓名) ；
                    </p>
                    <p className={styles.lineP}>
                      用于办理&nbsp;
                      {this.props.dataInfo.form_reason}
                      （ 注：用途) ；
                    </p>
                    <p className={styles.lineP}>
                      需使用&nbsp;
                      {this.props.dataInfo.form_copy_quantity} 份
                      有效期&nbsp;
                     {this.props.dataInfo.form_use_day}  天 ；
                    </p>
                    <p className={styles.linePred}>
                      本人保证对复印件的使用结果承担一切法律责任。
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
            <TabPane tab="审批流程" key="2">
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
    loading: state.loading.models.businessLicenseDetail,
    ...state.businessLicenseDetail
  };
}
export default connect(mapStateToProps)(BusinessLicenseDetail);
