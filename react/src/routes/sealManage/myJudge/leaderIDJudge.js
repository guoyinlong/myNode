/**
 * 作者：贾茹
 * 日期：2019-9-12
 * 邮箱：m18311475903@163.com
 * 功能：院领导身份证复印件使用审核
 */
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from '../sealApply/sealApply.less';
import { Input, Modal, Button,Table } from "antd";

const { TextArea } = Input;
//获取当天日期
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const strDate = date.getDate();

const currentdate = year + '-' + month + '-' + strDate;

class LeaderIDJudge extends React.Component {
  state = {

  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'leaderIDJudge/'+value,
        record : value2,
      })
    }else{
      /* console.log('aaa');*/
      this.props.dispatch({
        type:'leaderIDJudge/'+value,
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
    console.log(record);
    let url =record.upload_url;
    window.open(url);
  };



  render(){
    /*console.log(this.props.dataInfo);*/
    return (
      <div className={styles.outerField}>

        <div className={styles.out}>

          <div className={styles.title}>
            院领导身份证复印件使用申请审批
          </div>
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
              需使用身份证复印件名称
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
             复印件的用途
            </span>
            <span className={styles.lineColon3}>:</span>
            <aside style={{width:'76%',float:'right'}}>
              <p>
                本证照复印件仅供&nbsp;
                {this.props.dataInfo.form_actual_usename}&nbsp;
                （注：实际使用的单位名称或实际使用的自然人姓名) ；
              </p>
              <p className={styles.lineP}>
                用于办理&nbsp;
                {this.props.dataInfo.form_reason}&nbsp;
                （ 注：用途) ；
              </p>
              <p className={styles.lineP}>
                需使用&nbsp;
                {this.props.dataInfo.form_copy_quantity}&nbsp;份
                有效期&nbsp;
                {this.props.dataInfo.form_use_day} &nbsp;天 ；
              </p>
              <p className={styles.linePred}>
                本人保证对复印件的使用结果承担一切法律责任。
              </p>
            </aside>
            <div style={{clear:'both'}}></div>
          </div>
          <div style={{margin:'15px auto',display:this.props.isFileDisplay}}>
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
          <div className={styles.buttonOut}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" className={styles.buttonSave} onClick={()=>this.returnModel('approval')}>同意</Button>
              <Button type="primary" className={styles.buttonSubmit} onClick={()=>this.returnModel('modalDisplay')}>退回</Button>
              <Modal
                title="* 请填写退回原因"
                visible={this.props.visible}
                onOk={()=>this.returnModel('handleModalOk')}
                onCancel={()=>this.returnModel('handleModalCancel')}
              >
                <textarea placeholder="请输入退回原因" style={{width:'490px',height:'130px'}} value={this.props.returnReason} onChange={(e)=>this.returnModel('returnReason',e)}></textarea>
              </Modal>
            </div>
          </div>
        </div>


      </div>

    )
  }
}
function mapStateToProps (state) {

  return {
    loading: state.loading.models.leaderIDJudge,
    ...state.leaderIDJudge
  };
}
export default connect(mapStateToProps)(LeaderIDJudge);
