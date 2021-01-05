/**
 * 作者：贾茹
 * 日期：2019-9-16
 * 邮箱：m18311475903@163.com
 * 功能：院领导名章外借申请修改
 */
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from '../sealApply/sealApply.less';
import { Select, Input, DatePicker, Radio, Button, } from "antd";
import moment from 'moment';
const dateFormat = 'YYYY/MM/DD HH:mm:ss';


const RadioGroup = Radio.Group;
const { Option } = Select;
const { TextArea } = Input;
//获取当天日期
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const strDate = date.getDate();

const currentdate = year + '-' + month + '-' + strDate;

class BorrowLeaderReset extends React.Component {
  state = {
    isUploadingFile: false, // 是否正在上传文件
  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'borrowLeaderReset/'+value,
        record : value2,
      })
    }else{
      console.log('aaa');
      this.props.dispatch({
        type:'borrowLeaderReset/'+value,
      })
    }

  };

  //获取所选开始时间
  getStartTime=(value, dateString)=>{
    /* console.log(value, dateString);*/
    this.props.dispatch({
      type:'borrowLeaderReset/getStartTime',
      record : dateString,
    })
  };
//获取所选归还时间
  getEndTime=(value, dateString)=>{
    /* console.log(value, dateString);*/
    this.props.dispatch({
      type:'borrowLeaderReset/getEndTime',
      record : dateString,
    })
  };


  //获取选中印章的类型id
  getSealTypeId = (value)=>{
    this.props.dispatch({
      type:'borrowLeaderReset/getSealTypeId',
      record : value,
    })
  };
//不可选当前时间之前的时间
  range=(start, end)=> {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  disabledDate=(current)=> {
    // Can not select days before today and today
    return current && current <  moment(Date.now()).add(-1, 'd')
  };

  render(){
    const { startTime,endTime } = this.props;
    return (
      <div className={styles.outerField}>
        <div className={styles.out}>
          <div className={styles.title}>
            院领导名章外借申请修改
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
                  借用部门
                </span>
            <span className={styles.lineColon}>:</span>
            <span>{Cookie.get('OU')}</span>
            <span>-</span>
            <span>{Cookie.get('dept_name')}</span>

          </div>
          <div className={styles.lineOut}>
              <span className={styles.lineKey}>
                 <b className={styles.lineStar}>*</b>
                 需借用领导名章
              </span>
            <span className={styles.lineColon}>:</span>
            <Select  className={styles.lineSelect} onChange={this.getSealTypeId} value={this.props.sealNameId.seal_details_name}>
              {this.props.sealList.map((i)=><Option value={JSON.stringify(i)} key={i.seal_details_name}>{i.seal_details_name}</Option>)}
            </Select>
          </div>

          <div className={styles.lineOut}>
            <span className={styles.lineKey3}>
             <b className={styles.lineStar}>*</b>
             借用事由及时间
            </span>
            <span className={styles.lineColon4}>:</span>
            <aside style={{width:'76%',float:'right'}}>
              <p style={{lineHeight:'25px'}}>
                因
                <TextArea style={{width:'400px',marginLeft:'10px'}} autosize value={this.props.use} onChange={(e)=>this.returnModel('use',e)}/>
                工作需要，需申请借用   名章。
              </p>
              <p className={styles.lineP}>
                借用时间为
                {startTime === "" ?
                  <DatePicker
                    disabledDate={this.disabledDate}
                    //disabledTime={this.disabledDateTime}
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    placeholder="开始时间"
                    format={dateFormat}
                    style={{marginLeft:'10px',width:'180px'}}
                    onChange={this.getStartTime}
                    /*onOk={this.sureStartTime}*/
                  />
                  :
                  <DatePicker
                    disabledDate={this.disabledDate}
                    //disabledTime={this.disabledDateTime}
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    value={moment(startTime, dateFormat)}
                    placeholder="开始时间"
                    format={dateFormat}
                    style={{marginLeft:'10px',width:'180px'}}
                    onChange={this.getStartTime}
                    /*onOk={this.sureStartTime}*/
                  />
                }

                &nbsp;&nbsp;&nbsp;
                预计归还时间为
                {
                  endTime === "" ?
                    <DatePicker
                      showTime
                      placeholder="归还时间"
                      format={dateFormat}
                      style={{marginLeft:'10px',width:'180px'}}
                      onChange={this.getEndTime}
                      disabledDate={this.disabledDate}
                      /*onOk={this.sureStartTime}*/
                    />
                    :
                    <DatePicker
                      showTime
                      value={moment(endTime, dateFormat)}
                      placeholder="归还时间"
                      format={dateFormat}
                      style={{marginLeft:'10px',width:'180px'}}
                      onChange={this.getEndTime}
                      disabledDate={this.disabledDate}
                      /*onOk={this.sureStartTime}*/
                    />
                }

              </p>
              <p className={styles.linePred}>
                在名章外借期间，本人保证将名章用于申请事由，并对使用结果承担一切法律责任。
              </p>
            </aside>
            <div style={{clear:'both'}}></div>
          </div>

          <div className={styles.buttonOut}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" className={styles.buttonSave} onClick={()=>this.returnModel('sealSave')} disabled={this.props.isSave}>保存</Button>
              <Button type="primary" className={styles.buttonSubmit} onClick={()=>this.returnModel('sealSubmit')}>提交</Button>
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
    loading: state.loading.models.borrowLeaderReset,
    ...state.borrowLeaderReset
  };
}
export default connect(mapStateToProps)(BorrowLeaderReset);
