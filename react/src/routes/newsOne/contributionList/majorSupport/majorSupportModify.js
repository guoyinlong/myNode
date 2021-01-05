/**
 * 作者：韩爱爱
 * 日期：2020-11-25
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：全院新闻工作贡献清单-重大活动支撑首页-修改
 */
import React, { Component }  from  'react'
import {connect} from "dva";
import moment from 'moment';
import styles from "../../index.less";
import {Button, Checkbox, Col, DatePicker, Input, message, Modal, Popconfirm, Table, Tabs, Upload} from "antd";
import Cookie from "js-cookie";
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { TextArea } = Input;
const { TabPane } = Tabs;
class majorSupportModify extends  Component{
  constructor(){
    super();
    this.state = {
      uploadFile:{
        name: 'filename',
        multiple: true,
        showUploadList: false,
        action: '/filemanage/fileupload',
        data:{
          argappname:'writeFileUpdate',
          argtenantid:Cookie.get('tenantid'),
          arguserid:Cookie.get('userid'),
          argyear:new Date().getFullYear(),
          argmonth:new Date().getMonth()+1,
          argday:new Date().getDate()
        },
      },
    }
  }
  handleMole = (value,value1,value2,value3) =>{
    if(value1!==undefined){
      this.props.dispatch({
        type:'majorSupportModify/'+value,
        record : value1,
        name:value2,
        text:value3
      })
    }else{
      this.props.dispatch({
        type:'majorSupportModify/'+value,
      })
    }
  };
  changeDate = (date,dateString) => {
    this.props.dispatch({
      type:'majorSupportModify/changeDate',
      startTime: dateString,
    })
  };
  beforeUpload =(file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' ||file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('您只能上传JPG / PNG文件!');
    }
    return isJpgOrPng
  };
  eventVlaue = (e) => {
    this.props.dispatch({
      type:'majorSupportModify/eventVlaue',
      record: e,
    })
  };
  render() {
    const  fileColumns =[
      {
        title: '序号',
        dataIndex: 'index',
        width: '12%',
        key:'index',
        render: (text, record, index) => {
          return (<span>{index+1}</span>);
        },
      },
      {
        title: '图片',
        dataIndex: 'RelativePath',
        key:'RelativePath',
        width: '60%',
        render: (text,record) => {
          return <div style={{ textAlign: 'center' }}>
            <img src={text}
                 style={{ width:'100px',height:'100px'}}
                 onClick={(e)=>this.handleMole('handlePreview','打开',e,record)}
            />
            <Modal
              visible={this.props.previewVisible}
              footer={null}
              onCancel={(e)=>this.handleMole('handlePreview','关闭',e,record)}
            >
              <img src={text} style={{ width:'80%',height:'80hv', cursor: "pointer"}} />
            </Modal>
          </div>;
        },
      },
      {
        title: '操作',
        dataIndex: 'opration',
        key:'opration',
        width: '22%',
        render: (text, record) => {
          return <div style={{ textAlign: 'left' }}>
            <Popconfirm
              title="确定删除该文件吗?"
              onConfirm={(e) => this.handleMole('trainingDelete',record)}
            >
              <Button
                type="primary"
                size="small"
              >
                删除
              </Button>
            </Popconfirm>
          </div>;
        },
      }
    ];
    return(
      <div  className={styles.outerField}>
        <div className={styles.out}>
          <h2 style={{margin:'0 auto',width:'800px',textAlign:'center',fontSize:'20px'}}>重大活动支撑数据修改</h2>
          <div style={{marginTop:'20px'}}>
             <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                <b style={{color:"red",marginRight:'5px'}}>*</b>
                活动名称
             </span>
             <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px'}}>:</span>
             <Input style={{width:'570px',marginLeft:'10px',resize:"none"}} value={this.props.mobileName} onChange={(e) =>this.handleMole("mobileVlaue",e)}/>
          </div>
          <div style={{marginTop:'20px'}}>
            <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
              <b style={{color:"red",marginRight:'5px'}}>*</b>
              活动时间
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px',marginRight:'10px',}}>:</span>
            <DatePicker
              style={{width:'170px',}}
              showTime={{ defaultValue: moment('YYYY/MM/DD HH:mm:ss') }}
              placeholder="培训时间"
              format="YYYY-MM-DD HH:mm:ss"
              value={this.props.cobileTime == '' ? null :moment(this.props.cobileTime, dateFormat)}
              onChange = {this.changeDate}
            />
          </div>
          <div style={{marginTop:'20px'}}>
             <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                <b style={{color:"red",marginRight:'5px'}}>*</b>
                 活动中担任工作
             </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px'}}>:</span>
            <div style={{display:'inline-block',marginLeft:'10px'}}>
              <Checkbox.Group
                options={ this.props.eventWork}
                defaultValue={this.props.evenArrQue}
                onChange={(e)=>this.eventVlaue(e)}
                className={ styles.oCheckbox }
              />
              {this.props.eventNum != false?
                <Input value={this.props.wenInput}
                       style={{width:'100px',resize:"none",float: 'left'}}
                       size="small"
                       onChange={(e) =>this.handleMole("otherVlaue",e)}
                />
                :
                null
              }
            </div>
          </div>
          <div style={{marginTop:'20px'}}>
             <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                <b style={{color:"red",marginRight:'5px'}}>*</b>
                活动证明材料上传
             </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px',marginRight:'10px'}}>:</span>
            <Upload  {...this.state.uploadFile}
                     onChange = {(e)=>this.handleMole("pictureChange",e)}
                     beforeUpload={this.beforeUpload}
            >
              <Button type="primary">上传</Button>
              <i style={{color:"red",marginLeft:'15px',fontStyle:"normal"}}>推荐上传截图、图片等</i>
            </Upload>
            <Table
              columns={fileColumns }
              loading={ this.props.loading }
              dataSource={ this.props.shareResult }
              className={ styles.tableStyle }
              pagination = { false }
              style={{marginTop:'10px',width:'500px',marginLeft:'185px'}}
              bordered={ true }
            />
          </div>
          <div style={{width:'250px',margin:'20px auto'}}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" style={{marginRight:'10px'}} onClick={()=>this.handleMole('submission','保存')}>保存</Button>
              <Button type="primary" style={{marginRight:'10px'}} onClick={()=>this.handleMole('submission','提交')}>提交</Button>
              <Button type="primary"  onClick={()=>this.handleMole('submission','取消')}>取消</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.majorSupportModify,
    ...state.majorSupportModify
  };
}

export default connect(mapStateToProps)(majorSupportModify);