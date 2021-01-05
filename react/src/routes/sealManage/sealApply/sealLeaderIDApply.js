/**
 * 作者：贾茹
 * 日期：2019-9-5
 * 邮箱：m18311475903@163.com
 * 功能：院领导复印件使用申请填报
 */
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from './sealApply.less';
import DeptRadioGroup from './sealLeaderIDDeptModal.js';
import { Select, Input, Modal, Radio, Button, Table, Popconfirm} from "antd";
import FileUpload from './sealLeaderIDFileUpload.js';        //上传功能组件


const RadioGroup = Radio.Group;
const { Option } = Select;
const { TextArea } = Input;
//获取当天日期
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const strDate = date.getDate();

const currentdate = year + '-' + month + '-' + strDate;

class SealLeaderIDApply extends React.Component {
  state = {
    isUploadingFile: false, // 是否正在上传文件
  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'sealLeaderIDApply/'+value,
        record : value2,
      })
    }else{
      console.log('aaa');
      this.props.dispatch({
        type:'sealLeaderIDApply/'+value,
      })
    }

  }
  /*  onChange=(date, dateString)=> {
      console.log(date, dateString);
    }*/

  //上传需要
  saveData = (values) => {
    this.setState({
      showData:values,
      importDataLength:values.length,
    })
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
            &nbsp;&nbsp;

            <Popconfirm
              title="确定删除该文件吗?"
              /* onConfirm={(e) => this.deleteUpload(e,record)}*/
              onConfirm={()=>this.returnModel('deleteUpload',record)}
            >
              <Button
                type="primary"
                size="small"
              >
                删除
              </Button>
            </Popconfirm>


          </div>
        );
      },
    }, ];

  //点击下载附件
  downloadUpload = (e,record) =>{
    let url =record.RelativePath;
    window.open(url);
  };

  //获取选中印章的类型id
  getSealTypeId = (value)=>{
    this.props.dispatch({
      type:'sealLeaderIDApply/getSealTypeId',
      record : value,
    })
  };

  render(){
    return (
      <div className={styles.outerField}>
        <div className={styles.out}>
          <div className={styles.title}>
            院领导身份证复印件使用申请填报
          </div>
          <div className={styles.lineOut}>
                  <span className={styles.lineKey}>
                     <b className={styles.lineStar}>*</b>
                     申请时间
                  </span>
            <span className={styles.lineColon}>:</span>
            <span>{currentdate}</span>
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
            <Input style={{width:'300px'}} value={this.props.deptName} onClick={()=>this.returnModel('handleDeptModal')}/>
            {/*<Icon type="close-circle" style={{marginLeft:'10px',color:'#ccc'}} onClick={this.iconClear}/>*/}
            <Modal
              title="选择部门"
              visible={ this.props.deptModal }
              onCancel = { ()=>this.returnModel('handleDeptCancel')}
              width={'1000px'}
              onOk={()=>this.returnModel('handleDeptOk')}
            >
              <div>
                <DeptRadioGroup/>
              </div>
            </Modal>
          </div>
          <div className={styles.lineOut}>
                <span className={styles.lineKey}>
                   <b className={styles.lineStar}>*</b>
                   需使用身份证领导名称
                </span>
            <span className={styles.lineColon}>:</span>
            <Select  className={styles.lineSelect} onChange={this.getSealTypeId}>
              {this.props.sealList.map((i)=><Option key={i.seal_details_name} value={i.seal_details_id}>{i.seal_details_name}</Option>)}
            </Select>
          </div>
          <div className={styles.lineOut}>
                <span className={styles.lineKey}>
                   <b className={styles.lineStar}>*</b>
                   所提交对方单位
                  </span>
            <span className={styles.lineColon}>:</span>
            <Input style={{width:'570px'}} value={this.props.targetDept} onChange={(e)=>this.returnModel('targetDept',e)}/>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
             <b className={styles.lineStar}>*</b>
             复印件的用途及时间
            </span>
            <span className={styles.lineColon3}>:</span>
            <aside style={{width:'76%',float:'right'}}>
              <p>
                本证照复印件仅供
                <Input style={{width:'300px',marginLeft:'10px'}} value={this.props.userDept} onChange={(e)=>this.returnModel('userDept',e)}/>
                （ 注：实际使用的单位名称或实际使用的自然人姓名) ；
              </p>
              <p className={styles.lineP}>
                用于办理
                <TextArea style={{width:'400px',marginLeft:'10px'}} autosize value={this.props.use} onChange={(e)=>this.returnModel('use',e)}/>
                （ 注：用途 200字以内) ；
              </p>
              <p className={styles.lineP}>
                需使用
                <Input className={styles.lineUseInput} value={this.props.fileNumber} onChange={(e)=>this.returnModel('getFileNumber',e)}/>份
                有效期
                <Input className={styles.lineUseInput} value={this.props.fileDay} onChange={(e)=>this.returnModel('getFileDay',e)}/>天 ；
              </p>
              <p className={styles.linePred}>
                本人保证对复印件的使用结果承担一切法律责任。
              </p>
            </aside>
            <div style={{clear:'both'}}></div>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
                用印文件
             </span>
            <span className={styles.lineColon}>:</span>
            <FileUpload dispatch={this.props.dispatch} passFuc = {this.saveData}/>

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
              <Button type="primary" className={styles.buttonSave} onClick={()=>this.returnModel('sealSubmit','保存')}>保存</Button>
              <Button type="primary" className={styles.buttonSubmit} onClick={()=>this.returnModel('sealSubmit','提交')}>提交</Button>
              <Button type="primary" className={styles.buttonCancel} onClick={()=>this.returnModel('sealCancel')}>取消</Button>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
function mapStateToProps (state) {

  return {
    loading: state.loading.models.sealLeaderIDApply,
    ...state.sealLeaderIDApply
  };
}
export default connect(mapStateToProps)(SealLeaderIDApply);
