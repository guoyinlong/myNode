//废弃的网页

import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from './xqstyle.less';
import { Select, Input, DatePicker, Radio, Button, Icon, Popconfirm, Tooltip,Form,Upload} from "antd";
import FileUpload from './fileUpload.js';        //上传功能组件


const RadioGroup = Radio.Group;


const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
  console.log(`selected ${value}`);
}

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker ,onChange} = DatePicker;
const { TextArea } = Input;
//获取当天日期
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const strDate = date.getDate();
const currentdate = year + '-' + month + '-' + strDate;

 


class SealComApply extends React.Component {
  state = {
    "RetCode":"0/1",
    "RetVal":"...",
    "DataRows":[
      {
        "createUserName":"薛刚",  //--发布人
        "startTime":"2020-04-05",
        "endTime":"2020-04-06",
        "taskTitle":"检查主题",
        "taskType":0,//(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知)",
        "examineObj":"", //--检查对象
        "belongUserName":"",//--通知对象
        "otherOu":"...", //--是否涉及分院
        "examineContent":"...", // --检查内容
        "demand":"..." ,//--检查要求
        "examineImg":"..." //--检查规范
      }
    ]
  }

 onChange=(date, dateString)=> {
    console.log(date, dateString);
  }

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
        新建检查任务
          </div>
         
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               <b className={styles.lineStar}>*</b>
               发布人
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{Cookie.get('username')}</span>
          </div>
           <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               <b className={styles.lineStar}>*</b>
               检查时间
            </span>
            <span className={styles.lineColon}>:</span>
            <span><RangePicker onChange={onChange} /></span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
              <b className={styles.lineStar}>*</b>
              检查主题
            </span>
            <span className={styles.lineColon}>:</span>
             <Input style={{width:'320px'}} value={this.props.deptName} />
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               <b className={styles.lineStar}>*</b>
            检查方式
            </span>
            <span className={styles.lineColon}>:</span>
            <Select  className={styles.lineSelect} onChange={this.getSealTypeId}>
              {this.props.sealList.map((i)=><Option key={i.seal_details_name} value={i.seal_details_id}>{i.seal_details_name}</Option>)}
            </Select>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
               <b className={styles.lineStar}>*</b>
               检查对象
            </span>
            <span className={styles.lineColon3}>:</span>
            <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Please select"
                  defaultValue={['a10', 'c12']}
                  onChange={handleChange}
                >
                   {children}
            </Select>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               <b className={styles.lineStar}>*</b>
            检查内容
            </span>
            <span className={styles.lineColon}>:</span>
            <Select  className={styles.lineSelect} onChange={this.getSealTypeId}>
              {this.props.sealList.map((i)=><Option key={i.seal_details_name} value={i.seal_details_id}>{i.seal_details_name}</Option>)}
            </Select>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               <b className={styles.lineStar}>*</b>
            检查要求
            </span>
            <span className={styles.lineColon}>:</span>
            <Select  className={styles.lineSelect} onChange={this.getSealTypeId}>
              {this.props.sealList.map((i)=><Option key={i.seal_details_name} value={i.seal_details_id}>{i.seal_details_name}</Option>)}
            </Select>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               <b className={styles.lineStar}>*</b>
            检查规范
            </span>
            <span className={styles.lineColon}>:</span>
            <div className={styles.pupload}>
                <Upload {...props2}>
                <Button>
                    <Icon type="upload" /> 上传
                </Button>
                </Upload>
            </div>
          </div>
        
        
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               <b className={styles.lineStar}>*</b>
               通知对象
            </span>
            <span className={styles.lineColon}>:</span>
            <Select
              className={styles.spacialSelect}
            //   onChange={(value)=>this.returnModel('submitObject',value)}
            >
              <Option value="0">软研院内部</Option>
              <Option value="1">软研院外部</Option>
              <Option value="2">软研院外简化流程</Option>
            </Select>
          
           
          </div>
          <div className={styles.buttonOut}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" className={styles.buttonSave} onClick={()=>this.returnModel('sealSubmit','保存')}>保存</Button>
              <Button type="primary" className={styles.buttonSubmit} onClick={()=>this.returnModel('sealSubmit','提交')}>提交</Button>
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
