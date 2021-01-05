/**
 * 作者：贾茹
 * 日期：2019-9-17
 * 邮箱：m18311475903@163.com
 * 功能：院领导名章使用申请修改
 */
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from '../sealApply/sealApply.less';
import DeptRadioGroup from './leaderDeptModal.js';
import { Select, Input, Modal, Radio, Button, Table, Popconfirm} from "antd";
import FileUpload from './leaderFileUpload.js';        //上传功能组件


const RadioGroup = Radio.Group;
const { Option } = Select;
const { TextArea } = Input;
//获取当天日期
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const strDate = date.getDate();

const currentdate = year + '-' + month + '-' + strDate;

class SealLeaderReset extends React.Component {
  state = {
    isUploadingFile: false, // 是否正在上传文件
  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'sealLeaderReset/'+value,
        record : value2,
      })
    }else{
      console.log('aaa');
      this.props.dispatch({
        type:'sealLeaderReset/'+value,
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
  //保存份数
  saveNum=(e,index)=>{
    this.props.dispatch({
      type:'sealLeaderReset/saveNum',
      e,index
    })
  }
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
      title: '盖章份数',
      dataIndex: 'upload_number',
      width: '8%',
      editable: true,
      key:'number',
      render: (text, record, index) => {
        return (
          <Input onChange={(e) => this.saveNum(e,index)} value={text}/>
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
            &nbsp;&nbsp;

            <Popconfirm
              title="确定删除该文件吗?"
              /* onConfirm={(e) => this.deleteUpload(e,record)}*/
              onConfirm={(e) => this.deleteUpload(e,record)}
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

  //获取选中印章的类型id
  getSealTypeId = (value)=>{
    //console.log(value);
    this.props.dispatch({
      type:'sealLeaderReset/getSealTypeId',
      record : value,
    })

  };

  //点击下载附件
  downloadUpload = (e,record) =>{
    let url =record.upload_url;
    window.open(url);
  };

  //点击删除附件
  deleteUpload= (e,record)=>{
    /*console.log(record);*/
    if(record.upload_id){
      this.props.dispatch({
        type:'sealLeaderReset/deleteUpload',
        record:record
      })
    }else{
      this.props.dispatch({
        type:'sealLeaderReset/localDeleteUpload',
        record:record
      })
    }

  };

  render(){
    return (
      <div className={styles.outerField}>
        <div className={styles.out}>
          <div className={styles.title}>
            院领导名章使用申请修改
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
               需使用名章名称
            </span>
            <span className={styles.lineColon}>:</span>
            <Select  className={styles.lineSelect} onChange={this.getSealTypeId} value={this.props.sealNameId.seal_details_name}>
              {this.props.sealList.map((i)=><Option value={JSON.stringify(i)} key={i.seal_details_name}>{i.seal_details_name}</Option>)}
            </Select>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
               <b className={styles.lineStar}>*</b>
               使用名章事由
              </span>
            <span className={styles.lineColon3}>:</span>
            <TextArea style={{width:'570px'}} value={this.props.useReason} autosize onChange={(e)=>this.returnModel('useReason',e)}/>
          </div>
          {/* <div className={styles.lineOut}>
                      <span className={styles.lineKey}>
                         <b className={styles.lineStar}>*</b>
                         时间
                      </span>
                      <span className={styles.lineColon2}>:</span>
                      <RangePicker onChange={this.onChange} />
                    </div>*/}
          <div className={styles.lineOut}>
             <span className={styles.lineKey}>
                <b className={styles.lineStar}>*</b>
                用印材料是否涉密
            </span>
            <span className={styles.lineColon}>:</span>
            <RadioGroup onChange={(e)=>this.returnModel('isFileSecret',e)} value={this.props.isSecret}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
            <Modal
              title="请问您确认要修改该选项吗？"
              visible={this.props.resetFileModal}
              onOk={()=>this.returnModel('clearSecretFile')}
              onCancel={()=>this.returnModel('seceretIsCancel')}
            >
              <p>如果继续，您之前提交的上会材料将会被删除</p>
            </Modal>
            <Modal
              title="请问您确认要修改该选项吗？"
              visible={this.props.resetReasonModal}
              onOk={()=>this.returnModel('deleteSecretReason')}
              onCancel={()=>this.returnModel('seceretIsCancel')}
            >
              <p>如果继续，您的泄密原因说明将会被删除</p>
            </Modal>
          </div>
          <div style={{margin:'15px auto',display:this.props.isReasonDisplay}}>
            <span className={styles.lineKey2}>
               <b className={styles.lineStar}>*</b>
               涉密原因
            </span>
            <span className={styles.lineColon3}>:</span>
            <TextArea
              style={{width:'570px'}}
              value={this.props.secretReason}
              autosize
              onChange={(e)=>this.returnModel('getSecretReason',e)}
            />
          </div>
          {
            this.props.isSecret === 3 || this.props.isSecret === 0 ||this.props.tableUploadFile.length!==0 ?
              <div style={{margin:'15px auto'}}>
             <span className={styles.lineKey}>
                  <b className={styles.lineStar}>*</b>
                  用印材料
             </span>
                <span className={styles.lineColon}>:</span>
                <FileUpload
                  dispatch={this.props.dispatch}
                  passFuc = {this.saveData}
                />

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
          <div className={styles.buttonOut}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" className={styles.buttonSave} onClick={()=>this.returnModel('sealSubmit','保存')} disabled={this.props.isSave}>保存</Button>
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
    loading: state.loading.models.sealLeaderReset,
    ...state.sealLeaderReset
  };
}
export default connect(mapStateToProps)(SealLeaderReset);
