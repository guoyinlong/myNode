/**
 * 作者：窦阳春
 * 日期：2020-10-27
 * 邮箱：douyc@itnova.com.cn
 * 文件说明：新闻共享平台-舆情管理新增页面
 */
import React from 'react';
import {connect } from 'dva';
import { DatePicker, Spin, Modal, Button, Input, Row, Col, message, InputNumber, Select, TreeSelect, Icon  } from 'antd';
const { RangePicker } = DatePicker;
const {Option, OptGroup} = Select;
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
import styles from '../../newsOne/style.less'

class OpinionAdd extends React.Component{
  constructor(props){
    super(props)
    this.state={
      channelTwoVisble: [false],
    }
  }
  saveChange = (flag, value, time) => {
    if( time==undefined && flag.indexOf('channelValue') > -1 ) {
      this.props.dispatch({
        type: 'opinionAdd/queryChannelInPubSentiment',
        value, index: flag.slice(-1), flag
      })
    }
    this.props.dispatch({
      type: 'opinionAdd/saveValue',
      value: (typeof(value) == 'string' && value.length>200) ? value.substring(0,200) : value,
      flag,
      time
    })
  } 
  setVisible = (index, flag) => {
    const {channelTwoVisble} = this.state
    for(var i=0; i++; i<channelTwoVisble.length) {channelTwoVisble[i] = false}
    if(flag == 'out') {
      channelTwoVisble[index] = true
    }else{
      channelTwoVisble[index] = false
    }
    this.setState({
      channelTwoVisble
    })
  }
  action = (flag) => {
    this.props.dispatch({
      type: 'opinionAdd/action', todo: flag
    })
  }
  addTypeDiv = () => {
    this.props.dispatch({
      type: 'opinionAdd/addTypeDiv'
    })
  };
  addChannelTwoDiv = (twoIndex, i) => {
    this.props.dispatch({
      type: 'opinionAdd/addChannelTwoDiv', i
    })
  };
  addChannelDiv = () => {
    let {channelTwoVisble} = this.state;
    this.props.dispatch({ //点击一级新增的时候给新增那行的二级选择框数组加值
      type: 'opinionAdd/addChannelTwoListData'
    })
    if(this.props.channelLength < 2) {
      this.setState({
        channelTwoVisble: [...channelTwoVisble, false],
      })
    }else {return}
  };
  removeTypeDiv = (i) => {
    this.props.dispatch({
      type: 'opinionAdd/removeTypeDiv', index: i
    })
  }
  removeChannelTwoDiv = (twoIndex, i) => { //二级减少按钮
    this.props.dispatch({
      type: 'opinionAdd/removeChannelTwoDiv', twoIndex, index: i
    })
  }
  removeChannelDiv = (i) => {
    this.props.dispatch({
      type: 'opinionAdd/removeChannelDiv', index: i
    })
  }
  cancel = () => {
    this.props.dispatch({
      type: 'opinionAdd/cancel'
    })
  }
  render() {
    let {deptData, titleTime, deptValue, publishTime, superviseStartTime, superviseEndTime, id,
      superviseNum, insideGoodSupervise, insideBadSupervise, outSideGoodSupervise, outSideBadSupervise, goodAction, badAction,
      pubChannelList, titleName, divNum, channelDivNum, length, channelLength, channelTwoNum, channelTwoLength} = this.props;
    let pubTypeDiv = divNum.length == 0 ? [] : divNum.map((v, i)=>{
      return (
      <span key={i+'a'}>
          <Col span={20} className={styles.colRight}>
            <Select value={this.props.pubTypeValue[i]} placeholder='请选择' style={{ width: 150 }} onChange={(value)=>this.saveChange('pubTypeValue'+i, value)}>
              <Option value="思想作风"  key='11'>思想作风</Option>
              <Option value="服务中心"  key='12'>服务中心</Option>
              <Option value="企业文化"  key='13'>企业文化</Option>
            </Select> &nbsp;
            <InputNumber min={1} value={this.props.pubTypeNum[i]} onChange={(value)=>this.saveChange('pubTypeNum'+[i], value)} /> &nbsp;
            <Icon type="plus-circle" onClick = {()=>this.addTypeDiv()} style={{marginRight:"10px"}}/>
            {
              i > 0 || length > 0 ?
              <Icon onClick = {()=>this.removeTypeDiv(i)}
                className="dynamic-delete-button"
                type="minus-circle-o" /> : ''
            }
          </Col>
      </span>
    )
  })
  let pubChannelDiv = channelDivNum.length == 0 ? [] : channelDivNum.map((v, i) => {
    return (
      <span key={i+'b'}>
        <Col span={20} className={styles.colRight}>
            <span>
              <Select value={this.props.channelValue[i]} placeholder='请选择' style={{ width: 150 }} onChange={(value)=>this.saveChange('channelValue'+i, value)}>
                {
                  pubChannelList.length == 0 ? [] : pubChannelList.map((item, index) => {
                    return (
                        <Option value={item.channelName} key={index+'11'}>{item.channelName}</Option>
                    )
                  })
                }
              </Select> &nbsp;
              <InputNumber min={1} value={this.props.channeloneNum[i]} onChange={(value)=>this.saveChange('channeloneNum'+i, value)} /> &nbsp;
              <a href="javascript: void(0)" onClick={()=>this.setVisible(i, 'out')}>其中</a> &nbsp;
              <Icon type="plus-circle" onClick = {()=>this.addChannelDiv(i)} style={{marginRight:"10px"}} />
              {
                i > 0 || channelLength > 0 ?
                <Icon onClick = {()=>this.removeChannelDiv(i)}
                  className="dynamic-delete-button"
                  type="minus-circle-o" /> : ''
              }
              <Modal  
              title = '请选择宣传渠道'
              visible={this.state.channelTwoVisble[i]} 
              onCancel = {()=>this.setVisible(i, 'hide')}
              onOk = {()=>this.setVisible(i, 'hide')}
              maskStyle = {{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}
              >
              {
              channelTwoNum.length == 0 ? [] : channelTwoNum[i].map((v, twoIndex) => {
              return (
              <span  key={twoIndex +'b22'}>
              <Row>
               <Col className={styles.colRight} span={10}>
                <span>
                <Select 
                value={this.props.channelTwo[i][twoIndex]} 
                placeholder='请选择' style={{ width: '100%' }}
                onChange={(value)=>this.saveChange('channelTwo'+ i + twoIndex, value)}>
                {
                  this.props.channelTwoList.length > 0 ? this.props.channelTwoList[i].map((vv, ii)=> {
                    return (
                      <Option value={vv}  key={'3'+ ii}>{vv}</Option> 
                    )
                  })
                  : ''
                }
                </Select> &nbsp;
                </span>
               </Col>
               <Col>&nbsp;
                  <InputNumber span={6} min={1} value={this.props.channelNum[i][twoIndex]} onChange={(value)=>this.saveChange('channelNum'+i+twoIndex, value)} /> &nbsp;
                  <Icon type="plus-circle" onClick = {()=>this.addChannelTwoDiv(twoIndex, i)} style={{marginRight:"10px"}}/>
                  {
                    twoIndex > 0 || channelTwoLength[i] > 0 ?
                    <Icon onClick = {()=>this.removeChannelTwoDiv(twoIndex, i)}
                      className="dynamic-delete-button"
                      type="minus-circle-o" /> : ''
                  }
               </Col>
               </Row>
                </span>
                )
                })
              }
              </Modal>
            </span>
          </Col>
      </span>
    )
  })
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
      <div className={styles.pageContainer}>
        <h2 style = {{textAlign:'center',marginBottom:30}}>{id=='addPage' ? '舆情填报' : titleName + '修改'}</h2>
        <div className={styles.opinionAddRoeDiv}>
        <Row>
          <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>标题时间：</Col>
          <Col span={20} className={styles.colRight}>
            <DatePicker 
              format={dateFormat}
              placeholder = '选择时间'
              value={titleTime == '' ? null : moment(titleTime, dateFormat)}
              // disabledDate={this.disabledDate}
              onChange={(value, dateString)=>this.saveChange(value, dateString, 'titleTime')}
            />
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>反馈单位：</Col>
          <Col span={20} className={styles.colRight}>
            <Select
              allowClear
              style={{ minWidth: "315px" }}
              value = {deptValue}
              onChange={(item)=>this.saveChange('deptValue', item)} 
            >
              {
                deptData.length == 0 ?  [] : deptData.map((v, i) => {
                  return (
                    <OptGroup label={v.deptName} key = {i+'deptData1'}>
                      {v.children.map((item, index)=> {
                        return (
                          <Option key={index+'deptData'} value={item.deptId}  onChange={(value)=>this.saveChange('deptValue', value)}>{item.deptName}</Option>
                        )
                      })}
                    </OptGroup> 
                  )
                })
              }
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>发布时间：</Col>
          <Col span={20} className={styles.colRight}>
            <DatePicker 
              format={dateFormat}
              placeholder = '选择时间'
              value={publishTime == '' || publishTime == null ? null : moment(publishTime, dateFormat)}
              onChange={(value, dateString)=>this.saveChange(value, dateString, 'publishTime')}
            />
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>宣传类型：</Col>
          <Col span={20}>{pubTypeDiv}</Col>
        </Row>
        <Row>
          <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>宣传渠道：</Col>
          <Col span={20}>{pubChannelDiv}</Col>
        </Row>
        <Row>
          <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>舆情监督情况时间：</Col>
          <Col span={20} className={styles.colRight}>
            <RangePicker  
              format={dateFormat}
              style = {{width:200, marginRight:10}}
              value={   
                superviseStartTime == '' || superviseEndTime =='' || superviseStartTime == null || superviseEndTime == null ? null 
                : [moment(superviseStartTime, dateFormat), moment(superviseEndTime, dateFormat)]}
              onChange={(value, dateString)=>this.saveChange(value, dateString, 'start_end')}
              />
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>舆情监督情况次数：</Col>
          <Col span={20} className={styles.colRight}>
            <InputNumber min={0} value={superviseNum} onChange={(value)=>this.saveChange('superviseNum', value)}/>
            <span style={{color: '#f00'}}> ! </span>请填写数字
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>对内了解舆情：</Col>
          <Col span={20} className={styles.colRight}>
            正面舆情：<Input value={insideGoodSupervise} style={{width: '60%'}} onChange={(e)=>this.saveChange('insideGoodSupervise', e.target.value)}/>
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.colLeft}></Col>
          <Col span={20} className={styles.colRight}>
            负面舆情：<Input value={insideBadSupervise} style={{width: '60%'}} onChange={(e)=>this.saveChange('insideBadSupervise', e.target.value)}/>
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>对外了解舆情：</Col>
          <Col span={20} className={styles.colRight}>
            正面舆情：<Input value={outSideGoodSupervise} style={{width: '60%'}} onChange={(e)=>this.saveChange('outSideGoodSupervise', e.target.value)}/>
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.colLeft}></Col>
          <Col span={20} className={styles.colRight}>
            负面舆情：<Input value={outSideBadSupervise} style={{width: '60%'}} onChange={(e)=>this.saveChange('outSideBadSupervise', e.target.value)}/>
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>网络监督采取措施：</Col>
          <Col span={20} className={styles.colRight}>
            针对正面舆情：<Input value={goodAction} style={{width: '60%'}} onChange={(e)=>this.saveChange('goodAction', e.target.value)}/>
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.colLeft}></Col>
          <Col span={20} className={styles.colRight}>
            针对负面舆情：<Input value={badAction} style={{width: '60%'}} onChange={(e)=>this.saveChange('badAction', e.target.value)}/>
          </Col>
        </Row>
        <div style={{textAlign: "center"}}>
          <Button style={{marginRight: 10}} type='primary' onClick={()=>this.action('save')}>保存</Button>
          <Button style={{marginRight: 10}} type='primary' onClick={()=>this.action('submit')}>提交</Button>
          <Button type='primary' onClick={()=>this.cancel()}>
            <a href="javascript:history.back(-1);">取消</a>
          </Button>
        </div>
        </div>
      </div>
     </Spin>
    );
  }
}

function mapStateToProps (state) {
   
  return {
    loading: state.loading.models.opinionAdd,
    ...state.opinionAdd
  };
}
export default connect(mapStateToProps)(OpinionAdd);
