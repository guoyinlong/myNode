/**
 * 作者：贾茹
 * 日期：2019-9-9
 * 邮箱：m18311475903@163.com
 * 功能：营业执照原件外借申请审核
 */
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from '../sealApply/sealApply.less';
import { Input, Modal, Button, } from "antd";

const { TextArea } = Input;
//获取当天日期
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const strDate = date.getDate();

const currentdate = year + '-' + month + '-' + strDate;

class BorrowBusinessJudge extends React.Component {
  state = {

  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'borrowBusinessJudge/'+value,
        record : value2,
      })
    }else{
      console.log('aaa');
      this.props.dispatch({
        type:'borrowBusinessJudge/'+value,
      })
    }

  };






  render(){
/*console.log(this.props.dataInfo);*/
    return (
      <div className={styles.outerField}>

          <div className={styles.out}>

          <div className={styles.title}>
          营业执照外借申请审批
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
          借用部门
          </span>
          <span className={styles.lineColon}>:</span>
          <span>{Cookie.get('OU')}</span>
          <span>-</span>
          <span>{Cookie.get('dept_name')}</span>

          </div>
          <div className={styles.lineOut}>
          <span className={styles.lineKey}>
          需借用证照名称
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
          因&nbsp;
           {this.props.dataInfo.form_reason}&nbsp;
          工作需要，需申请借用营业执照原件。
          </p>
            <p className={styles.lineP}>
              借用时间为 &nbsp;&nbsp;&nbsp;
              {this.props.borrowTime};
              &nbsp;&nbsp;&nbsp;
              预计归还时间为 &nbsp;&nbsp;&nbsp;
              {this.props.returnTime}。
            </p>
          <p className={styles.linePred}>
          在营业执照原件外借期间，本人保证将营业执照原件用于申请事由，并对使用结果承担一切法律责任。
          </p>
          </aside>
          <div style={{clear:'both'}}></div>
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
    loading: state.loading.models.borrowBusinessJudge,
    ...state.borrowBusinessJudge
  };
}
export default connect(mapStateToProps)(BorrowBusinessJudge);
