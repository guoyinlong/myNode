/**
 * 作者：贾茹
 * 日期：2019-9-3
 * 邮箱：m18311475903@163.com
 * 功能：印章使用申请填报
 */
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from './sealApply.less';
import DeptRadioGroup from './deptModal.js';
import RelativeDeptRadioGroup from './relativeDeptModal.js';
import { Select, Input, Modal, DatePicker, Radio, Button, Icon, Table, Popconfirm, Tooltip,Form} from "antd";
import FileUpload from './fileUpload.js';        //上传功能组件


const RadioGroup = Radio.Group;


const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
//获取当天日期
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const strDate = date.getDate();
const currentdate = year + '-' + month + '-' + strDate;


class SealComApply extends React.Component {
  state = {
    isUploadingFile: false, // 是否正在上传文件
    iconModal: false,
  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'sealComApply/'+value,
        record : value2,
      })
    }else{
      console.log('aaa');
      this.props.dispatch({
        type:'sealComApply/'+value,
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

  saveUploadNum=(record)=>{
    console.log(record);
  }
  saveNum=(e,index)=>{
    this.props.dispatch({
      type:'sealComApply/saveNum',
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

  //获取选中印章的类型id
  getSealTypeId = (value)=>{
    //console.log(value);
    this.props.dispatch({
      type:'sealComApply/getSealTypeId',
      record : value,
    })

  };

  //点击下载附件
  downloadUpload = (e,record) =>{
    let url =record.RelativePath;
    window.open(url);
  };
  showModal = () => {
    this.setState({
      iconModal: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      iconModal: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      iconModal: false,
    });
  };
  render(){
//console.log(this.props.sealSpacialType);
    return (
      <div className={styles.outerField}>
        <div className={styles.out}>
          <div className={styles.title}>
            印章使用申请填报
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
                <DeptRadioGroup
                  dept = {this.props.dept}
                />
              </div>
            </Modal>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               <b className={styles.lineStar}>*</b>
               需使用印章名称
            </span>
            <span className={styles.lineColon}>:</span>
            <Select  className={styles.lineSelect} onChange={this.getSealTypeId}>
              {this.props.sealList.map((i)=><Option key={i.seal_details_name} value={i.seal_details_id}>{i.seal_details_name}</Option>)}
            </Select>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
               <b className={styles.lineStar}>*</b>
               用印事由
            </span>
            <span className={styles.lineColon3}>:</span>
            <TextArea style={{width:'570px'}} value={this.props.useReason} autosize onChange={(e)=>this.returnModel('useReason',e)}/>
          </div>
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
          <div style={{margin:'15px auto',display:this.props.isFileDisplay}}>
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
          </div>
          <div style={{margin:'15px auto',display:this.props.isRelativeDisplay}}>
            <span className={styles.lineKey}>
              <b className={styles.lineStar}>*</b>
              会签部门
            </span>
            <span className={styles.lineColon}>:</span>
            <TextArea
              style={{width:'300px'}}
              value={this.props.rDept.join('    ')}
              onClick={()=>this.returnModel('handleRelativeDeptModal')}
              autosize
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
                <RelativeDeptRadioGroup
                  relativeDeptID = {this.props.relativeDeptID}
                />
              </div>
            </Modal>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               <b className={styles.lineStar}>*</b>
               文件接收方
            </span>
            <span className={styles.lineColon}>:</span>
            <Select
              className={styles.spacialSelect}
              onChange={(value)=>this.returnModel('submitObject',value)}
            >
              <Option value="0">软研院内部</Option>
              <Option value="1">软研院外部</Option>
              <Option value="2">软研院外简化流程</Option>
            </Select>
            <Icon type="question-circle" style={{color:'#08c',marginLeft:'10px'}} onClick={this.showModal}/>
            <Modal
              title="请仔细阅读"
              visible={this.state.iconModal}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              width={'900px'}
            >
              <div style={{width:"900"}}>
                <div style={{width:"80%",margin:'0 auto',border:'1px solid #222',textAlign:'center'}}>
                  <div style={{height:'35px',lineHeight:'35px'}}><b>会签提示</b></div>
                  <div style={{position:'relative',borderTop:'1px solid #111',height:'35px',lineHeight:'35px'}}>
                    <span style={{display:'inline-block',width:'25%',borderRight:'1px solid #111'}}><b>类别</b></span>
                    <span style={{display:'inline-block',width:'38%',borderRight:'1px solid #111'}}><b>事项</b></span>
                    <span style={{display:'inline-block',width:'36%'}}><b>是否选择会签</b></span>
                  </div>
                  <div style={{position:'relative',borderTop:'1px solid #111',height:'35px',lineHeight:'35px'}}>
                    <span style={{display:'inline-block',width:'25%',borderRight:'1px solid #111'}}>软研院内部</span>
                    <span style={{display:'inline-block',width:'38%',borderRight:'1px solid #111'}}>盖章材料提交方为软研院内部</span>
                    <span style={{display:'inline-block',width:'36%'}}>根据盖章材料是否涉及其他会签部门确定</span>
                  </div>
                  <div style={{position:'relative',borderTop:'1px solid #111',height:'35px',lineHeight:'35px'}}>
                    <span style={{display:'inline-block',width:'25%',borderRight:'1px solid #111'}}>软研院外部</span>
                    <span style={{display:'inline-block',width:'38%',borderRight:'1px solid #111'}}>盖章材料提交方为软研院外部</span>
                    <span style={{display:'inline-block',width:'36%'}}>根据盖章材料是否涉及其他会签部门确定</span>
                  </div>
                  <div style={{position:'relative',borderTop:'1px solid #111',clear:'both',height:'287px'}}>
                    <div style={{width:'15%',float:'left',marginTop:'100px'}}>
                      软研院外简化流程
                    </div>
                    <div style={{float:'right',width:'85%',borderLeft:'1px solid #111',}}>
                      <div style={{borderBottom:'1px solid #111'}}>
                        <div style={{display:'inline-block',width:'11%'}}>个人事项</div>
                        <div style={{display:'inline-block',borderLeft:'1px solid #111',borderRight:'1px solid #111',width:'45%',}}>
                          <p style={{borderBottom:'1px solid #111',}}>个人申领生育津贴</p>
                          <p style={{borderBottom:'1px solid #111',}}>个人办理社保</p>
                          <p style={{borderBottom:'1px solid #111',}}>个人办理养老保险</p>
                          <p>个人办理医疗变更</p>
                        </div>
                        <div style={{display:'inline-block',width:'42.2%'}}>
                          <p style={{borderBottom:'1px solid #111',}}>是，需人力资源部会签</p>
                          <p style={{borderBottom:'1px solid #111',}}>是，需人力资源部会签</p>
                          <p style={{borderBottom:'1px solid #111',}}>是，需人力资源部会签</p>
                          <p>是，需人力资源部会签</p>
                        </div>
                      </div>
                      <div>
                        <div style={{display:'inline-block',width:'11%',}}>其他简化流程事项</div>
                        <div style={{display:'inline-block',borderLeft:'1px solid #111',borderRight:'1px solid #111',width:'45%',}}>
                          <p style={{borderBottom:'1px solid #111',}}>人力资源部统一办理公积金、社保</p>
                          <p style={{borderBottom:'1px solid #111',}}>人力资源部统一办理劳动合同盖章</p>
                          <p style={{borderBottom:'1px solid #111',}}>采购部“招标项目委托通知单”、“采购项目委托通知单”、“终止招标函”</p>
                          <p style={{borderBottom:'1px solid #111',}}>财务部增值税汇总传递单及相关附件</p>
                          <p style={{borderBottom:'1px solid #111',}}>项目管理部软件著作权申请</p>
                          <p style={{borderBottom:'1px solid #111',}}>办公室月度通信费缴费确认函</p>
                          <p style={{borderBottom:'1px solid #111',}}>上线合格证书、项目验收合格证书、交资表</p>
                          <p>到货验收证明、决算表</p>
                        </div>
                        <div style={{display:'inline-block',width:'42.2%',}}>
                          <p style={{borderBottom:'1px solid #111',}}>否</p>
                          <p style={{borderBottom:'1px solid #111',}}>否</p>
                          <p style={{borderBottom:'1px solid #111',height:'43px',lineHeight:'43px'}}>否</p>
                          <p style={{borderBottom:'1px solid #111',}}>否</p>
                          <p style={{borderBottom:'1px solid #111',}}>否</p>
                          <p style={{borderBottom:'1px solid #111',}}>否</p>
                          <p style={{borderBottom:'1px solid #111',}}>否</p>
                          <p>否</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </Modal>
            <Select  style={{width:'230px',marginLeft:'10px',display:this.props.spacialSealDisplay}} value={this.props.spacialName} onChange={(value)=>this.returnModel('getSpacialID',value)}>
              {this.props.sealSpacialList.map((i)=><Option key={JSON.stringify(i)} value={JSON.stringify(i)}>{i.seal_special_matters}</Option>)}
            </Select>
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

const form1 = Form.create()(SealComApply);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.sealComApply,
    ...state.sealComApply
  };
}
export default connect(mapStateToProps)(form1);
