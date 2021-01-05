/**
 * 作者：韩爱爱
 * 日期：2020-11-18
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：培训备案-培训备案修改
 */
import React, { Component }  from  'react'
import {connect} from "dva";
import moment from 'moment';
import {Input, DatePicker, TreeSelect, Radio, Button, Upload, Table, Popconfirm, message, Modal} from 'antd';
import styles from "../../index.less";
import Cookie from "js-cookie";
const dateFormat = 'YYYY-MM-DD';
class trainRecordModify extends Component {
  constructor(props){
    super(props);
    this.state= {
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
  handleMole = (value,value1,value2) =>{
    if(value1!==undefined){
      this.props.dispatch({
        type:'trainRecordUpload/'+value,
        record : value1,
        text:value2
      })
    }else{
      this.props.dispatch({
        type:'trainRecordUpload/'+value,
      })
    }
  };
  changeDate = (date,dateString) => {
    this.props.dispatch({
      type: 'trainRecordUpload/changeDate',
      startTime: dateString,
    })
  };
  //图片格式
  beforeUpload =(file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' ||file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('您只能上传JPG / PNG文件!');
    }
    return isJpgOrPng
  };
  render() {
    const {cultosiName, staffName,cultiTime, checkObject,checkObjectAndContentList, typeValue, pictureList} =this.props;
    //  考试题目回答情况
    const  trainingColumns =[
      {
        title: '序号',
        dataIndex: '',
        width: '12%',
        key:'index',
        render: (text, record, index) => {
          return (<span>{index+1}</span>);
        },
      },
      {
        title: '图片',
        dataIndex: 'RelativePath',
        key:'key',
        width: '60%',
        render: (text) => {
          return <div style={{ textAlign: 'center' }}>
            <img src={text} style={{ width:'100px',height:'100px'}}/>
          </div>;
        },
      },
      {
        title: '操作',
        dataIndex: '',
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
    //调查问卷
    const  questionnaireColumns =[
      {
        title: '序号',
        dataIndex: '',
        width: '12%',
        key:'index',
        render: (text, record, index) => {
          return (<span>{index+1}</span>);
        },
      },
      {
        title: '图片',
        dataIndex: 'RelativePath',
        key:'key',
        width: '60%',
        render: (text) => {
          return <div style={{ textAlign: 'center' }}>
            <img src={text} style={{ width:'100px',height:'100px'}}/>
          </div>;
        },
      },
      {
        title: '操作',
        dataIndex: '',
        key:'opration',
        width: '22%',
        render: (record) => {
          return <div style={{ textAlign: 'left' }}>
            <Popconfirm
              title="确定删除该文件吗?"
              onConfirm={(e) => this.handleMole("questionnaireDelete",record)}
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
          <h2 style={{margin:'0 auto',width:'800px',textAlign:'center',fontSize:'20px'}}>培训备案修改</h2>
          <div style={{marginTop:'20px'}}>
             <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                <b style={{color:"red",marginRight:'5px'}}>*</b>
                培训名称
             </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px'}}>:</span>
            <Input style={{width:'570px',marginLeft:'10px',resize:"none"}} value={cultosiName} onChange={(e) =>this.handleMole("cultiVlaue",e)}/>
          </div>
          <div style={{marginTop:'20px'}}>
            <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                <b style={{color:"red",marginRight:'5px'}}>*</b>
                培训时间
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px',marginRight:'10px',}}>:</span>
            <DatePicker
              // showTime={{ defaultValue: moment('YYYY/MM/DD') }}
              onChange = {this.changeDate}
              placeholder="培训时间"
              format="YYYY-MM-DD"
              style = {{width:200, marginRight:10}}
              value={this.props.cultiTime == '' ? null : moment(this.props.cultiTime, dateFormat)}

            />

          </div>
          {/* <div style={{marginTop:'20px'}}>
            <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
              <b style={{color:"red",marginRight:'5px'}}>*</b>
              人员名字
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px'}}>:</span>
            <Input style={{width:'570px',marginLeft:'10px'}}  disabled ={true}  value={staffName} onChange={(e) =>this.handleMole("staffVlaue",e)}/>
          </div>
          <div style={{marginTop:'20px'}}>
             <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                <b style={{color:"red",marginRight:'5px'}}>*</b>
                单位
             </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px'}}>:</span>
            <TreeSelect
              showSearch
              value={checkObject}
              disabled ={true}
              dropdownStyle={{ maxHeight: 500, minHeight: 200, overflow: 'auto' }}
              style={{width:'570px',marginLeft:'10px'}}
              placeholder="请选择"
              treeData={checkObjectAndContentList}
              allowClear
              multiple
              treeDefaultExpandAll
              onChange={(e)=>this.handleMole('onObjectChange',e)}
            >
            </TreeSelect>
          </div>
           */}
          <div style={{marginTop:'20px'}}>
             <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
               <b style={{color:"red",marginRight:'5px'}}>*</b>
               培训类型
             </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px',marginRight:'10px'}}>:</span>
            <Radio.Group onChange={(e)=>this.handleMole('typeChange',e)} value={Number(typeValue)}>
              <Radio value={0}>线上</Radio>
              <Radio value={1}>线下</Radio>
            </Radio.Group>
          </div>
          <div style={{marginTop:'20px'}}>
            {
              typeValue <=0 ?
                <div>
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    考试题目回答情况
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px',marginRight:'10px'}}>:</span>
                  <Upload  {...this.state.uploadFile} onChange = {(e)=>this.handleMole("trainingMaterialChange",e)}>
                    <Button type="primary">上传</Button>
                    <i style={{color:"red",marginLeft:'15px',fontStyle:"normal"}}>推荐上传截图、图片等</i>
                  </Upload>
                  <Table
                    columns={trainingColumns}
                    loading={ this.props.loading }
                    dataSource={ this.props.trainingMaterial }
                    className={ styles.tableStyle }
                    pagination = { false }
                    style={{marginTop:'10px',width:'500px',marginLeft:'185px'}}
                    bordered={ true }
                  />
                </div>
                :
                <div>
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                       <b style={{color:"red",marginRight:'5px'}}>*</b>
                   调查问卷
                   </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px',marginRight:'10px'}}>:</span>
                  <Upload   {...this.state.uploadFile} onChange = {(e)=>this.handleMole("questionnaireChange",e)}>
                    <Button type="primary">上传</Button>
                    <i style={{color:"red",marginLeft:'15px',fontStyle:"normal"}}>推荐上传截图、图片等</i>
                  </Upload>
                  <Table
                    columns={questionnaireColumns }
                    loading={ this.props.loading }
                    dataSource={ this.props.questionnaire }
                    className={ styles.tableStyle }
                    pagination = { false }
                    style={{marginTop:'10px',width:'500px',marginLeft:'185px'}}
                    bordered={ true }
                  />
                </div>
            }
          </div>
          <div style={{width:'250px',margin:'20px auto'}}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" style={{marginRight:'30px'}} onClick={()=>this.handleMole('submission','提交')}>提交</Button>
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
    loading: state.loading.models.trainRecordModify,
    ...state.trainRecordModify
  };
}

export default connect(mapStateToProps)(trainRecordModify);