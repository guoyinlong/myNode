/**
 * 作者：贾茹
 * 日期：2019-9-16
 * 邮箱：m18311475903@163.com
 * 功能：刻章审核详情
 */
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from '../sealApply/sealApply.less';
import { Input, Button,Table, Tabs, } from "antd";
import {routerRedux} from "dva/router";
const { TextArea } = Input;
const { TabPane } = Tabs;
//获取当天日期
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const strDate = date.getDate();

const currentdate = year + '-' + month + '-' + strDate;

class MarkSealDetail extends React.Component {
  state = {

  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'markSealDetail/'+value,
        record : value2,
      })
    }else{
      /* console.log('aaa');*/
      this.props.dispatch({
        type:'markSealDetail/'+value,
      })
    }

  };
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
    let url =record.RelativePath;
    window.open(url);
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



  render(){
    /*console.log(this.props.dataInfo);*/
    return (
      <div className={styles.outerField}>
        <div className={styles.title}>
          刻章申请审批详情
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
                  <span className={styles.lineKey3}>
                  申请原因
                  </span>
                  <span className={styles.lineColon4}>:</span>
                  <aside style={{width:'76%',float:'right'}}>
                    <p style={{lineHeight:'25px'}}>
                      因&nbsp;
                      {this.props.dataInfo.form_reason}
                      工作需要，需刻制&nbsp; {this.props.dataInfo.form_name} 。
                    </p>
                    <p className={styles.lineP}>
                      印章的规格及要求为：&nbsp;{this.props.dataInfo.form_seal_demand}
                    </p>
                    <p className={styles.linePred}>
                      本人保证对印章的使用结果承担一切法律责任。
                    </p>
                  </aside>
                  <div style={{clear:'both'}}></div>
                </div>
                <div className={styles.lineOut}>
                   <span className={styles.lineKey2}>

                      是否需要相关部门会签
                  </span>
                  <span className={styles.lineColon}>:</span>
                  <span>
              {this.props.dataInfo.form_if_sign === '0' ?
                <span>否</span>
                :
                this.props.dataInfo.form_if_sign === '1' ?
                  <span>是</span>
                  :
                  null
              }
            </span>
                </div>
                <div style={{margin:'15px auto',display:this.props.deptDisplay}}>
                  <span className={styles.lineKey2}>
                    会签部门
                  </span>
                  <span className={styles.lineColon3}>:</span>
                  <span>{this.props.dataInfo.dept_name}</span>

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
    loading: state.loading.models.markSealDetail,
    ...state.markSealDetail
  };
}
export default connect(mapStateToProps)(MarkSealDetail);
