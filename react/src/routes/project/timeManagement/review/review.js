/**
 * 作者：张楠华
 * 日期：2017-11-21
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：实现工时审核界面展示
 */
import React from 'react';
import styles from './timeManageCard.less'
import Style from './review.less'
import { Checkbox,Icon ,Button,Spin,Modal, Input,message,Popconfirm } from 'antd';
import TimeManageCard from './timeManageCard'
import {ReviewTitle} from './reviewTitle.js'
import ReviewBottom from './reviewBottom.js'
const { TextArea } = Input;

/**
 * 作者：张楠华
 * 日期：2017-11-21
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：界面展示
 */
class TimeReview extends React.Component{
  constructor(props){
    super(props)
  }
  state={
    indeterminate:false,
    checkAll:false,
    checked:[],
    reason:'',
    listOwn:[],
    listPartner:[]
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：选中卡片
   */
  changeHandle=(index)=>(e)=>{
    let data=this.state.checked;
    data[index]=e.target.checked;
    this.setState({
      checked:[...data],
      indeterminate:data.some(i=>i),
      checkAll:data.every(i=>i)&&data.length===this.props.list.length
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：卡片全选
   */
  onCheckAllChange=(e)=>{
    let c=e.target.checked;
    const{list}=this.props;
    this.setState({
      checked:list.map(i=>c),
      checkAll:c,
      indeterminate:c
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：重置
   */
  resetState=()=>{
    this.setState({
      indeterminate:false,
      checkAll:false,
      checked:[],
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：批量通过
   */
  allPass=()=>{
    const {list,timeNum} = this.props;
    const {checked}=this.state;
    const {dispatch}=this.props;
    let recordList ;
    let ids=[];
    checked.map((i,index)=>{
      if(i){
        recordList = JSON.parse(list[index].record_list);
        for(let i=0;i<recordList.length;i++){
          ids.push({
            id : recordList[i].id,
            rowType : recordList[i].row_type,
          });
        }
        timeNum[index] = 0;
      }
    });
    dispatch({
      type:'review/pass',
      ids
    });
    this.resetState();
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：批量退回
   */
  returnReasonCrl=()=>{
    const { dispatch,timeNum,tag } = this.props;
    const { reason,checked} = this.state;
    const { list } = this.props;
    let recordList ;
    let ids=[];
    checked.map((i,index)=>{
      if(i){
        recordList = JSON.parse(list[index].record_list);
        for(let i=0;i<recordList.length;i++){
          ids.push(recordList[i].id);
        }
        timeNum[index] = 0;
      }
    });
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
      ids,
      reason
    });
    this.resetState();
    this.setState({
      visible: false,
      reason:''
    });
  };
  /**
   * 作者：张楠华1
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：弹出模态框
   */
  showModal=()=>{
    this.setState({
      visible:true
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：导出
   */
  exportExl=()=>{
    const {list,timeNum} = this.props;
    const {checked}=this.state;
    const {dispatch}=this.props;
    let recordList ;
    let ids=[];
    checked.map((i,index)=>{
      if(i){
        recordList = JSON.parse(list[index].record_list);
        for(let i=0;i<recordList.length;i++){
          ids.push(recordList[i].id);
        }
        timeNum[index] = 0;
      }
    });
    dispatch({
      type:'review/exportExl',
      ids
    });
    this.resetState();
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：模态框取消
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
   * 功能：模态框中输入不通过理由
   */
  seasonHandle=(e)=>{
    this.setState({
      reason:e.target.value
    })
  };
  componentWillReceiveProps(){
    if(this.props.resetState === true){
      this.resetState();
    }
  }
  render() {
    const {indeterminate,checkAll,checked,reason}=this.state;
    const {list,loading,titleList,tag} = this.props;
    let disabled=checked.some(i=>i);
    let listOwn = [];
    let listPartner = [];
    for(let i=0;i<list.length;i++){
      if(list[i].row_type === '0' || list[i].row_type === '1'){
        listOwn.push(list[i])
      }else{
        listPartner.push(list[i])
      }
    }
    let listAll = listOwn.concat(listPartner);
    return (
      <Spin tip="Loading..." spinning={loading}>
        <div className={Style.wrap}>
          <ReviewTitle projInfo={this.props.projInfo} titleList = {titleList} tag={tag} dispatch={this.props.dispatch} titleTime={this.props.titleTime}/>
          <div className={styles.batch}>
            <Checkbox
              indeterminate={indeterminate}
              checked={checkAll}
              onChange={this.onCheckAllChange}
            >
              全选
            </Checkbox>
            <Popconfirm title="确认批量通过审核吗?"  onConfirm={this.allPass} okText="确定" cancelText="取消">
              <Button type="primary" disabled={!disabled}>批量通过</Button>
            </Popconfirm>&nbsp;&nbsp;
            <Button onClick={this.showModal} type="primary" disabled={!disabled}>批量退回</Button>&nbsp;&nbsp;
            <Button onClick={this.exportExl} type="primary" disabled={!disabled}>导出</Button>&nbsp;&nbsp;&nbsp;&nbsp;
            <span>{list.length}条待审核</span>
          </div>
          {/*{this.changeList()}*/}
          <ReviewBottom allDetail={this.props.allDetail} dispatch={this.props.dispatch} tag={tag}/>
          <div className={styles.cardFlex}>
            <div>
              {
                !listOwn.length&&!loading
                  ?<p className={styles.empty}><Icon type="frown-o" />&nbsp;暂无数据</p>
                  :listOwn.map((i,index)=><TimeManageCard
                    {...i}
                    changeHandle={this.changeHandle(index)}
                    checked={checked[index]}
                    key={index}
                    index={index}
                    timeNum={this.props.timeNum}
                    dispatch={this.props.dispatch}
                    tag={this.props.tag}
                  />)
              }
            </div>
            <div>
              {
                listPartner.length !== 0?
                  <h2>外包人员</h2>
                  :
                  []
              }
              {

                listAll.map((i,index)=>{
                  if(index>=listOwn.length){
                    return(
                      <TimeManageCard
                        {...i}
                        changeHandle={this.changeHandle(index)}
                        checked={checked[index]}
                        key={index}
                        index={index}
                        timeNum={this.props.timeNum}
                        dispatch={this.props.dispatch}
                        tag={this.props.tag}
                      />
                    )
                  }
                })
              }
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
        </div>
      </Spin>
    )
  }
}
export default TimeReview;
