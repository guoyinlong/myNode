/**
 * 作者：贾茹
 * 日期：2019-9-11
 * 邮箱：m18311475903@163.com
 * 功能：刻章申请审核
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

class MarkSealJudge extends React.Component {
  state = {

  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'markSealJudge/'+value,
        record : value2,
      })
    }else{
      /* console.log('aaa');*/
      this.props.dispatch({
        type:'markSealJudge/'+value,
      })
    }

  };






  render(){
    /*console.log(this.props.dataInfo);*/
    return (
      <div className={styles.outerField}>

        <div className={styles.out}>

          <div className={styles.title}>
            刻章申请审批
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
            <span className={styles.lineKey3}>
            申请原因
            </span>
            <span className={styles.lineColon4}>:</span>
            <aside style={{width:'76%',float:'right'}}>
              <p style={{lineHeight:'25px'}}>
                因&nbsp;
                {this.props.dataInfo.form_reason}&nbsp;
                工作需要，需刻制 &nbsp;{this.props.dataInfo.form_name} 。
              </p>
              <p className={styles.lineP}>
                印章的规格及要求为：{this.props.dataInfo.form_seal_demand}
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
    loading: state.loading.models.markSealJudge,
    ...state.markSealJudge
  };
}
export default connect(mapStateToProps)(MarkSealJudge);
