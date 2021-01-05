/**
 *  作者: 张楠华
 *  创建日期: 2018-8-22
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：单个卡片样式。
 */
import React from 'react';
import styles from './timeManageCard.less'
import Style from './review.less'
import { Checkbox,Icon ,Tooltip,Table,Input } from 'antd';
import { Modal, message } from 'antd';
import { mergeCom,mergeSum } from '../common';
const { TextArea } = Input;
/**
 * 作者：张楠华
 * 日期：2017-11-21
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：单个卡片展示
 */
class TimeManageCard extends React.Component {
  state = {
    visible: false,
    reason:'',
    visiblePms:false,
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：实现活动类型数据加一
   */
  changNum=()=>{
    const {timeNum,record_list,index} = this.props;
    let recordList = JSON.parse(record_list);
    let timeNum1 = timeNum;
    if(timeNum[index] >=recordList.length-1 ){
      timeNum1[index] = recordList.length-2;
    }else{
      timeNum1[index] = timeNum[index];
    }
    const { dispatch } = this.props;
    dispatch({
      type:'review/changeNum',
      num:timeNum1,
      index:index,
    });
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：实现活动类型数据减一.
   */
  changNumS=()=>{
    const {timeNum,index} = this.props;
    let timeNum2 = timeNum;
    if(timeNum[index] <=1 ){
      timeNum2[index] = 1;
    }else{
      timeNum2[index] = timeNum[index];
    }
    const { dispatch } = this.props;
    dispatch({
      type:'review/changeNumS',
      num:timeNum2,
      index:index
    });
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：实现活动类型数据展示
   */
  eachTypeTimeManage=(i,index,changeNum,changeNumS,whole)=>{
    const {record_list} = this.props;
    let recordList = JSON.parse(record_list);
    let result = mergeSum(JSON.parse(JSON.stringify(recordList)));
    return(
      <div style={{width:'100%'}}>
        <div style={{marginLeft:'20px',marginTop:'20px',height:'90px'}}>
          <div style={{display:'inline',float:'left',marginRight:'50px',background:'#F2F2F2',padding:'10px'}}>
            <div style={{fontSize:'32px'}}>{whole}</div>
            <div style={{marginTop:'10px'}}>工时总数</div>
          </div>
          <div style={{display:'inline'}}>
            <div style={{paddingTop:'15px'}}>
              {
                this.props.timeNum[index] <1?
                  <div  style={{display:'inline',marginRight:'3px'}}><Icon type="left" /></div>
                  :
                  <div onClick={changeNumS} style={{display:'inline',cursor:'pointer',marginRight:'3px'}}><Icon style={{color:'grey'}} type="left" /></div>
              }
              <Tooltip title={result[i[index]].activity_name}>
                <div style={{display:'inline-block',verticalAlign:'bottom',textAlign:'center'}} className={Style.abbreviation1}>{result[i[index]].activity_name}</div>
              </Tooltip>
              {
                this.props.timeNum[index] >= result.length-1?
                  <div  style={{display:'inline',marginLeft:'3px'}}><Icon type="right" /></div>
                  :
                  <div onClick={changeNum} style={{display:'inline',cursor:'pointer',marginLeft:'3px'}}><Icon style={{color:'grey'}} type="right" /></div>
              }
            </div>
            <div style={{marginLeft:'145px',fontSize:'32px',marginTop:'10px'}}>
              {parseFloat(result[i[index]].onesum).toFixed(1)}
            </div>
            { this.props.has_pms === '1' ? <span className={Style.pmsBod} onClick={this.showPmsDetail}><span className={Style.pms}>pms</span></span>:[]}
          </div>
        </div>
        <div style={{marginTop:'10px',textAlign:'center'}}>({result[i[index]].begin_time}～{result[i[index]].end_time})</div>
        <div style={{marginTop:'10px',fontSize:'8px',textAlign:'center'}}>
          周一（{result[i[index]].mon}）|
          周二（{result[i[index]].tues}）|
          周三（{result[i[index]].wed}）|
          周四（{result[i[index]].thur}）
        </div>
        <div style={{marginTop:'5px',fontSize:'8px',textAlign:'center'}}>
          周五（{result[i[index]].fri}）|
          周六（{result[i[index]].sat}）|
          周日（{result[i[index]].sun}）
        </div>
      </div>
    )
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：单个通过
   */
  pass=()=>{
    const { dispatch,timeNum,index } = this.props;
    const { record_list } = this.props;
    let recordList = JSON.parse(record_list);
    let ids=[];
    for(let i=0;i<recordList.length;i++){
      ids.push({
        id : recordList[i].id,
        rowType : recordList[i].row_type,
      });
    }
    dispatch({
      type:'review/pass',
      ids:ids,
    });
    timeNum[index] = 0;
  };

  /**
   * 作者：张楠华
   * 创建日期：2017-11-22
   * 功能：单个退回
   */
  returnReasonCrl=()=>{
    const { dispatch,timeNum,index,tag } = this.props;
    let reason=this.state.reason||'';
    const { record_list } = this.props;
    let recordList = JSON.parse(record_list);
    let ids=[];
    for(let i=0;i<recordList.length;i++){
      ids.push(recordList[i].id);
    }
    if(!reason.trim()){
      message.error('请输入退回原因！');
      return
    }
    if(reason.length >100){
      message.info('退回原因不能超过100个字');
      return;
    }
    dispatch({
      type:tag === 0?'review/returnReasonCrl':'review/returnMakeUpReasonCrl',
      reason,
      ids
    });
    timeNum[index] = 0;
    this.setState({ visible: false,reason:''});

  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：弹出模态框
   */
  showModal=()=>{
    this.setState({
      visible:true,
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：取消模态框
   */
  handleCancel=()=>{
    this.setState({
      visible:false
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：输入不通过理由
   */
  seasonHandle=(e)=>{
    this.setState({
      reason:e.target.value
    })
  };
  columns = [
    { title: '活动类型', dataIndex: 'activity_name', key: 'activity_name'},
    { title: '周一', dataIndex: 'mon', key: 'mon'},
    { title: '周二', dataIndex: 'tues', key: 'tues'},
    { title: '周三', dataIndex: 'wed', key: 'wed'},
    { title: '周四', dataIndex: 'thur', key: 'thur'},
    { title: '周五', dataIndex: 'fri', key: 'fri'},
    { title: '周六', dataIndex: 'sat', key: 'sat'},
    { title: '周日', dataIndex: 'sun', key: 'sun'},
    { title: '合计', dataIndex: 'onesum', key: 'onesum'},
  ];
  showPmsDetail=()=>{
    this.setState({
      visiblePms : true
    })
  };
  handleCancel1=()=>{
    this.setState({
      visiblePms:false
    })
  };
  render(){
    const {changeHandle,full_name,deptname,checked,whole,proj_name,record_list}=this.props;
    const { reason } =this.state;
    let recordList = JSON.parse(record_list);
    if(recordList.length !==0){
      recordList.map((i,index)=>{
        i.key = index;
      });
    }
    let recordListPMS = mergeCom(recordList);
    return (
      <div className={styles.cardWrap}>
        <div>
          <Checkbox onChange={changeHandle} checked={checked}>
          </Checkbox>
        </div>
        <div className={styles.cardShadow}>
          <div className={styles.card}>
            <div className="top">
              <div className="info">
                <div style={{display:'inline',width:'25%',fontSize:'20px',verticalAlign:'top',marginTop:'10px'}}>
                  <Icon type="xingming" style={{color:'#A8CCEE',verticalAlign:'top',marginTop:'3px'}}/>&nbsp;{full_name}
                </div>&nbsp;&nbsp;
                <div style={{display:'inline-block',width:'50%',position : 'absolute'}}>
                  <Tooltip title={deptname.split('-')[1]} style={{width:'30%'}}>
                    <div style={{display:'inline'}} className={Style.abbreviation}>{deptname.split('-')[1]}</div>
                  </Tooltip>
                  <Tooltip title={proj_name} style={{width:'30%'}}>
                    <div style={{marginTop:'5px'}} className={Style.abbreviation}>{proj_name}</div>
                  </Tooltip>
                </div>
              </div>
              {this.eachTypeTimeManage(this.props.timeNum,this.props.index,this.changNum,this.changNumS,whole)}
            </div>
            <div className="foot">
              <div className="twoBtns">
                {/*<Popconfirm title="确定通过审核吗?"  onConfirm={this.pass} okText="确定" cancelText="取消">*/}
                {/*<a>通过</a>*/}
                {/*</Popconfirm>*/}
                <a onClick={this.pass}>通过</a>
                <a onClick={this.showModal}>退回</a>
              </div>
            </div>
          </div>
        </div>

        <Modal
          title="退回原因"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onOk={this.returnReasonCrl}
        >
          <TextArea rows={4} value={reason} onChange={this.seasonHandle} placeholder="字数限制在100字以内" maxLength="100"/>
        </Modal>
        <Modal
          title="pms详情"
          visible={this.state.visiblePms}
          onCancel={this.handleCancel1}
          cancelText='返回'
          footer={null}
          width='820px'
        >
          {
            recordListPMS.map((i,index)=>{
              return(
                <div key={index}>
                  <div style={{margin:'8px 0',fontSize:'16px'}}>{i.pms_code?i.pms_name+'('+i.proj_code+'/'+i.pms_code+')':<span>{i.proj_name+'('+i.proj_code+')'}</span>}</div>
                  <Table dataSource={i.data} columns={this.columns} pagination={false}/>
                </div>
              )
            })
          }
          {/*<Table dataSource={recordList} columns={this.columns} className={styleTable.financeTable} pagination={false}/>*/}
        </Modal>
      </div>
    )
  }
}
export default TimeManageCard;
