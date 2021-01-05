import React, { Component } from 'react'
import {connect } from 'dva';
import { Row, Col, InputNumber, DatePicker, Input, Select, Radio, Modal, Icon, Button, Spin } from 'antd';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD HH:mm';
const RadioGroup = Radio.Group;    
const { Option, OptGroup } = Select; 
import styles from '../../carsManage/carsManage.less'

class carsApplyInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iconModal: false,
    }
  }
  // ---------------------------------------------------------
  saveChange = (flag, value, time) => {
    this.props.dispatch({
      type: 'carsApplyInput/saveValue',
      value: (typeof(value) == 'string' && value.length>50) ? value.substring(0,50) : value,
      flag,
      time
    })
  } 
  showModal = () => {
    this.setState({
      iconModal: true,
    });
  };
  handleOk = () => {
    this.setState({
      iconModal: false,
    });
  };
  handleCancel = () => {
    this.setState({
      iconModal: false,
    });
  };
  submit = (flag)=> { //保存 提交
    this.props.dispatch({
      type: 'carsApplyInput/submit',
      flag,
    })
  }
  // --日期只能选择当日以及之前的----------------------------------------------------------------------
  disabledDate = (current) => {
		return  current <= moment().subtract(1, 'days');
  }
  render() {
    const {pageKey, peopleNum, pickTime, lineStart1, lineStart2, lineEnd1, lineEnd2, radioValue, resaonChoose, carsExplainNotes,
      carsDemander, carsDemanderPick, carsTogetherPick, carsManager, carsManagerPick, pageFlag} = this.props;
    let reasonList = [
      {reasonId: '机要通信', reasonName: '机要通信'},
      {reasonId: '商务活动', reasonName: '商务活动'},
      {reasonId: '公务接待', reasonName: '公务接待'},
      {reasonId: '市场营销', reasonName: '市场营销'},
      {reasonId: '工程维护', reasonName: '工程维护'},
      {reasonId: '应急保障', reasonName: '应急保障'},
      {reasonId: '抗灾抢险', reasonName: '抗灾抢险'},
      {reasonId: '跨区域调研', reasonName: '跨区域调研'},
      {reasonId: '集体通勤', reasonName: '集体通勤'},
      {reasonId: '其他保障', reasonName: '其他保障'},
    ]
		let carsReasonList = reasonList.length == 0 ? [] : reasonList.map((item) => { // 通知对象
			return <Option key={item.reasonId} value={item.reasonId}>{item.reasonName}</Option>
    })
    let carsManagerList = carsManager.length == 0 ? [] : carsManager.map((item) => { // 车管员
      return <Option key={item.userId} value={item.userId + '-' + item.userName}>{item.userName}</Option>
    })
    const title  
    = pageKey == 'normalBusiness' ? '正常生产经营业务支撑用车申请' 
    : pageKey == 'workOnBusiness' ? '因公出差接送站用车申请' 
    : pageKey == 'specialMatters' ? '个人特殊事宜临时用车申请' : ''
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={styles.pageContainer}>
         <h2 style = {{textAlign:'center',marginBottom:30}}>{pageFlag == 'modify' ? title+'修改' : title}</h2>
        <Button style = {{float: 'right', marginTop: -30}} size="default" type="primary" >
          <a href="javascript:history.back(-1)">返回</a>
        </Button>
         <div style={{width: '80%', margin: '0 auto', border: '1px solid #000', }}>
         <Row>
          <Col span={5} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>用车需求人：</Col>
          <Col span={19} className={styles.colRight}>
          <Select style={{width:'300px'}} placeholder="请选择"
          value={carsDemanderPick} onChange={(item)=>this.saveChange('carsDemanderPick', item)} allowClear={ true } mode='multiple'>
          {carsDemander.length > 0 ? carsDemander.map((i,index)=>
            <OptGroup label={i.deptName} key={index}>
              {(i.children).map((item)=>
                <Option value={(item.userId + '-' + item.userName)} key={item.userId}>{item.userName}</Option>
              )}
            </OptGroup>
          ) : []}
          </Select>
          </Col>
        </Row>
         <Row>
           {
             pageKey == 'normalBusiness' ?
             <div>
              <Col span={5} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>乘车人数：</Col>
              <Col span={19} className={styles.colRight}>
                <InputNumber min={1} value={peopleNum} onChange={(value)=>this.saveChange('peopleNum', value)} />
              </Col>
             </div>
             :
             <div>
              <Col span={5} className={styles.colLeft}>同车同乘人：</Col>
              <Col span={19} className={styles.colRight}>
              <Select style={{width:'300px'}} placeholder="请选择"
              value={carsTogetherPick} onChange={(item)=>this.saveChange('carsTogetherPick', item)} allowClear={ true } mode='multiple'>
              {carsDemander.length > 0 ?  carsDemander.map((i,index)=>
                <OptGroup label={i.deptName} key={index}>
                  {(i.children).map((item)=>
                    <Option value={item.userId + '-' + item.userName} key={item.userId}>{item.userName}</Option>
                  )}
                </OptGroup> 
              ): []}
              </Select>
              </Col>
             </div>
           }
        </Row>
         <Row>
          <Col span={5} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>用车时间：</Col>
          <Col span={19} className={styles.colRight}>
          <DatePicker 
            showTime = {{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder = '选择时间'
            value={pickTime == '' ? null : moment(pickTime, dateFormat)}
            disabledDate={this.disabledDate}
            onChange={(value, dataString)=>this.saveChange(value, dataString, 'time')}
          />
          </Col>
        </Row>
         <Row>
          <Col span={5} className={styles.colLeft}>行车路线：</Col>
          <Col span={19} className={styles.colRight}><span style={{color: '#f00'}}>* </span>
            起点1： <Input placeholder="不超过50字" value={lineStart1} onChange={(e)=>this.saveChange('lineStart1', e.target.value)} style={{width: '80%'}}/>
          </Col>
        </Row>
         <Row>
          <Col span={5}></Col>
          <Col span={19} className={styles.colRight}><span style={{color: '#f00'}}>* </span>
           终点1： <Input placeholder="不超过50字" value={lineEnd1}  onChange={(e)=>this.saveChange('lineEnd1', e.target.value)} style={{width: '80%'}}/>
          </Col>
        </Row>
         <Row>
          <Col span={5}></Col>
          <Col span={19} className={styles.colRight}>&nbsp; 
          起点2： <Input placeholder="不超过50字" value={lineStart2}  onChange={(e)=>this.saveChange('lineStart2', e.target.value)} style={{width: '80%'}}/>
          </Col>
        </Row>
         <Row>
          <Col span={5}></Col>
          <Col span={19} className={styles.colRight}>&nbsp; 
          终点2： <Input placeholder="不超过50字" value={lineEnd2}  onChange={(e)=>this.saveChange('lineEnd2', e.target.value)} style={{width: '80%'}}/>
          </Col>
        </Row>
        <Row>
          {
            pageKey == 'normalBusiness' ?
            <div>
            <Col span={5} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>是否返程：</Col>
            <Col span={19} className={styles.colRight}>
              <RadioGroup onChange={(e)=>this.saveChange('radioValue', e.target.value)} value={radioValue}>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            </Col>
           </div> : ''
          }
        </Row>
        <Row>
          {
            pageKey == 'normalBusiness' ?
            <div>
            <Col span={5} className={styles.colLeft}><span style={{color: '#f00'}}>* </span> 用车事由（支撑事项）：</Col>
            <Col span={19} className={styles.colRight}>
              <Select value={resaonChoose} style={{ width: 120 }}  onChange={(value)=>this.saveChange('resaonChoose',value)}>
                {carsReasonList}
              </Select>
              <span onClick={this.showModal}>
                <Icon type="question-circle" style={{color:'#08c',marginLeft:'10px'}}/>
                <a style={{fontSize: 12}}> 用车服务支撑内容</a>
              </span>
            </Col>
            <Modal
              title="用车服务支撑内容"
              visible={this.state.iconModal}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              width={'900px'}
            >
              <table className = {styles.tabsCarManage}>
                <tbody>
                <tr className={styles.tabHead}>
                  <td>支撑事项</td>
                  <td>用车服务支撑内容</td>
                </tr>
                <tr>
                  <td>机要通信</td>
                  <td>指为取送各类机要保密文件材料、财务相关文件材料、人力资源相关文件材料提供的用车服务保障。</td>
                </tr>
                <tr>
                  <td>商务活动</td>
                  <td>指为与集团内外部单位开展商务洽谈、商务交流等商务事项提供的用车服务保障。</td>
                </tr>
                <tr>
                  <td>公务接待</td>
                  <td>指为接待与软研院开展公务活动的软研院以外人员提供的用车服务保障。（含软研院接待陪同人员）</td>
                </tr>
                <tr>
                  <td>市场营销</td>
                  <td>指为软研院人员参与市场营销活动或为市场营销活动提供现场支撑等事项提供的用车服务保障。</td>
                </tr>
                <tr>
                  <td>工程维护</td>
                  <td>指为生产研发环境改造、生产运行维护等事项提供的用车服务保障。</td>
                </tr>
                <tr>
                  <td>应急保障</td>
                  <td>指为重要应急通信、重大故障抢修等应急事项提供的用车服务保障。</td>
                </tr>
                <tr>
                  <td>抗灾抢险</td>
                  <td>指为地震、水灾、爆炸、火灾、人身伤害等突发事件抗灾抢险提供的用车服务保障。</td>
                </tr>
                <tr>
                  <td>跨区域调研</td>
                  <td>指为因生产经营需要开展的跨区域调研活动（北京市五环路外）提供的用车服务保障。</td>
                </tr>
                <tr>
                  <td>集体通勤</td>
                  <td>指为多人因公往返亦庄与集团公司、联通学院、西单、硅谷亮城及北京分公司等集中办公区集体通勤提供的用车服务保障。（多人原则上指2人及以上）</td>
                </tr>
                <tr>
                  <td>其它保障</td>
                  <td>指为单位统一组织的重大活动、重要事项提供的用车服务保障。</td>
                </tr>
                </tbody>
              </table>
            </Modal>
           </div> :
           <div>
           <Col span={5} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>用车事由：</Col>
           <Col span={19} className={styles.colRight}>
             <Input placeholder="不超过50字" value={resaonChoose}  onChange={(e)=>this.saveChange('resaonChoose', e.target.value)} style={{width: '80%'}}/>
           </Col>
          </div>
          }
        </Row>
        {
          pageKey != 'normalBusiness' ?
          <Row>
            <Col span={5} className={styles.colLeft} style={{fontSize: 13, color: '#f00'}}>用车核定扣缴费用标准：</Col>
            <Col span={19} className={styles.colRight} style={{fontSize: 13, color: '#f00'}}> 
              临时用车参照本地网约车市场价格，按照每公里 2 元的标准计算从本人交通费报销额度中扣除。多人同乘一车的共同分摊费用并分别从其交通费报销额度中扣除。
            </Col>
          </Row> : ''
        }
        <Row>
          {
            pageKey == 'normalBusiness' ?
            <div>
            <Col span={5} className={styles.colLeft}>用车说明事项：</Col>
            <Col span={19} className={styles.colRight}>
              <Input placeholder="不超过50字" value={carsExplainNotes}  onChange={(e)=>this.saveChange('carsExplainNotes', e.target.value)} style={{width: '80%'}}/>
            </Col>
           </div> : ''
          }
        </Row>
        <Row>
          {
            pageKey == 'specialMatters' ?
            <Col span={5} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>报送办公室审核确定：</Col> :
            <Col span={5} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>报送车管员约车：</Col>
          }
          <Col span={19} className={styles.colRight}>
            <Select value={carsManagerPick} style={{ width: 120 }}  onChange={(value)=>this.saveChange('carsManagerPick',value)}>
              {carsManagerList}
            </Select>
          </Col>
        </Row>
        </div>
        <div style = {{textAlign:'center'}}>
          <Button style = {{margin: '10px 10px'}} size="default" type="primary" onClick={()=>this.submit('保存')}>保存</Button>
          <Button style = {{margin: '10px 10px'}} size="default" type="primary" onClick={()=>this.submit('提交')}>提交</Button>
        </div>
        </div>
      </Spin>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.carsApplyInput, 
    ...state.carsApplyInput
  };
}

// carsApplyInput = Form.create()(carsApplyInput);
export default connect(mapStateToProps)(carsApplyInput);