/**
 * 作者：贾茹
 * 日期：2019-9-17
 * 邮箱：m18311475903@163.com
 * 功能：刻章申请修改
 */
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from '../sealApply/sealApply.less';
import { Select, Input, Radio, Button,Modal} from "antd";
import DeptRadioGroup from './markDept.js';

const RadioGroup = Radio.Group;
const { Option } = Select;
const { TextArea } = Input;
//获取当天日期
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const strDate = date.getDate();

const currentdate = year + '-' + month + '-' + strDate;

class MarkSealReset extends React.Component {
  state = {
    isUploadingFile: false, // 是否正在上传文件
  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'markSealReset/'+value,
        record : value2,
      })
    }else{
      console.log('aaa');
      this.props.dispatch({
        type:'markSealReset/'+value,
      })
    }

  };





  render(){
    console.log(this.props.Dept)
    return (
      <div className={styles.outerField}>
        <div className={styles.out}>
          <div className={styles.title}>
            刻章申请修改
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               <b className={styles.lineStar}>*</b>
               申请时间
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{this.props.screateDate.substring(0,19)}</span>
          </div>
          <div className={styles.lineOut}>
                <span className={styles.lineKey}>
                <b className={styles.lineStar}>*</b>
                申请人
                </span>
            <span className={styles.lineColon}>:</span>
            <span>{Cookie.get('username')}</span>
          </div>
          <div className={styles.lineOut}>
                <span className={styles.lineKey}>
                  <b className={styles.lineStar}>*</b>
                  申请部门
                </span>
            <span className={styles.lineColon}>:</span>
            <span>{Cookie.get('OU')}</span>
            <span>-</span>
            <span>{Cookie.get('dept_name')}</span>

          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey3}>
             <b className={styles.lineStar}>*</b>
             申请原因
            </span>
            <span className={styles.lineColon4}>:</span>
            <aside style={{width:'76%',float:'right'}}>
              <p style={{lineHeight:'25px'}}>
                因
                <TextArea className={styles.lineText} autosize value={this.props.markReason} onChange={(e)=>this.returnModel('getMarkReason',e)}/>
                工作需要，
              </p>
              <p className={styles.lineP}>
                需刻制
                <TextArea className={styles.lineText} autosize value={this.props.sealName} onChange={(e)=>this.returnModel('getSealName',e)}/>
                （印章名称）
              </p>
              <p className={styles.lineP}>
                印章的规格及要求
                <TextArea className={styles.lineText} autosize value={this.props.sealSize} onChange={(e)=>this.returnModel('getSealSize',e)}/>
                （印章名称）
              </p>
              <p className={styles.linePred}>
                本人保证对印章的使用结果承担一切法律责任。
              </p>
            </aside>
            <div style={{clear:'both'}}></div>
          </div>
          <div className={styles.lineOut}>
             <span className={styles.lineKey2}>
                <b className={styles.lineStar}>*</b>
                是否需要相关部门会签
            </span>
            <span className={styles.lineColon}>:</span>
            <RadioGroup
              onChange={(e)=>this.returnModel('isRelativeDept',e)}
              value={this.props.isRelativeDept}
            >
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
            <Modal
              title="请问您确认要修改该选项吗？"
              visible={this.props.deptModal}
              onOk={()=>this.returnModel('deptIsOk')}
              onCancel={()=>this.returnModel('deptIsCancel')}
            >
              <p>如果继续，您之前选择的的会签部门将会被删除</p>
            </Modal>
          </div>
          <div style={{margin:'15px auto',display:this.props.deptDisplay}}>
            <span className={styles.lineKey2}>
              <b className={styles.lineStar}>*</b>
              会签部门
            </span>
            <span className={styles.lineColon3}>:</span>
            <TextArea
              style={{width:'350px'}}
              value={this.props.Dept}
              autosize
              onClick={()=>this.returnModel('handleRelativeDeptModal')}
            />
            {/*<Icon type="close-circle" style={{marginLeft:'10px',color:'#ccc'}} onClick={this.iconClear}/>*/}
            <Modal
              title="选择会签部门"
              visible={ this.props.relativeDeptModal }
              onCancel = { ()=>this.returnModel('handleRelativeDeptCancel')}
              width={'1000px'}
              onOk={()=>this.returnModel('handleRelativeDeptOk')}
            >
              <div>
                <DeptRadioGroup/>
              </div>
            </Modal>
          </div>
          <div className={styles.buttonOut}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" className={styles.buttonSave} onClick={()=>this.returnModel('sealSave')} disabled={this.props.isSave}>保存</Button>
              <Button type="primary" className={styles.buttonSubmit} onClick={()=>this.returnModel('sealSubmit')}>提交</Button>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
function mapStateToProps (state) {

  return {
    loading: state.loading.models.markSealReset,
    ...state.markSealReset
  };
}
export default connect(mapStateToProps)(MarkSealReset);
