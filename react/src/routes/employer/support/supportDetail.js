/**
 * 文件说明：中层考核-支撑满意度评价页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-25
 */
import React from 'react'
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import { connect } from 'dva';
import * as service from '../../../services/leader/leaderservices';
import Style from '../../../components/employer/employer.less'
import Questionnaire from '../../../components/employer/Questionnaire'
import PageSubmit from '../../../components/employer/PageSubmit'
import message from '../../../components/commonApp/message'
/**
 * 功能：中层考核-判断员工是否全部评价完中层支撑服务满意度
 * 作者:陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-11-04
 * @param list 待评价领导
 */
function hasNullScore(list) {
  let hasNull = false;
  for(let i = 0; list && i < list.length;i++){
    let score=list[i].score;
    if(score === undefined || score === null || score === ''){
      hasNull = true;
    }
  }
  return hasNull;
}

/**
 * 功能：中层考核-支撑满意度评价
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-25
 */
class SupportDetail extends React.Component {
  state = {
    hasNull:true
  }
  /**
   * 功能：组件渲染完后执行操作
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-11-04
   */
  componentDidMount(){
    this.init();
  }
  /**
   * 功能：父组件变化后执行操作
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-11-04
   */
  componentWillReceiveProps(){
    this.init();
  }
  /**
   * 功能：获取中层考核数据，以及初始化
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   */
  init = () =>{
    const {list} = this.props;
    this.setState({
      hasNull:hasNullScore(list)
    })
  }

  /**
   * 功能：保存打分数据
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-11-04
   */
  save=async()=>{
    let postData=[];
    const {detailList}=this.props
    detailList.map((i,index)=>{
      if(i.score !== undefined && i.score !== null && i.score !== ''){
        let data={update:{score:i.score},condition:{id:i.id}}
        postData.push(data)
      }
    })
    if(postData && postData.length){
      try{
        let res=await service.empSupportDetailsUpdate({
          transjsonarray:JSON.stringify(postData)
        })
        if(res.RetCode==='1'){
          message.success('保存成功！')
        }else{
          message.error('保存失败')
        }
      }catch (e){
        message.error(e.message)
      }
    }

  }
  /**
   * 功能：提交打分数据
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-11-04
   */
  submit=async()=>{
    const { detailList } =this.props
    let hasNull = false;
    let kpis=detailList.map((i,index)=>{
      if(i.score !== undefined && i.score !== null && i.score !== ''){
        return {id:i.id,dm_id:i.dm_id,score:i.score.toString(),service_name:i.service_name}
      }else{
        hasNull = true;
      }
    })
    if(hasNull){
        message.warning("尚有评价项未打分，请评价完成后提交！");
        return
    }
    let postData={
      kpis:JSON.stringify(kpis),
      arg_year:detailList[0].year,
      arg_staff_id:Cookie.get("userid")
    };

    try{
      let res=await service.empSupportDetailsValue(postData)
      if(res.RetCode==='1'){
        message.success('提交成功！')
        this.props.history.goBack()
      }else{
        message.error('提交失败')
      }
    }catch (e){
      message.error(e.message)
    }
  }
  /**
   * 功能：评价分数变化触发事件
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-11-04
   * @param item 待评价记录
   * @param e radio对象
   */
  onChange = (item,e) =>{
    item.score = e.target.value
    this.init();
  }
  render(){
    const {detailList,tag} = this.props;
    const {hasNull} = this.state;
     return (
      <div className={Style.wrap + ' ' +Style.support}>
        <div style={{"marginBottom":'30px'}}>
          <h3>支撑服务满意度评价</h3>
        </div>
        {detailList.map((item,index) =>
          <Questionnaire item = {item} onChange={this.onChange.bind(this,item)} edit={tag && tag == '1' ? true :false}/>
          )
        }

          <div style={{"clear":'both'}}>
            {detailList && detailList.length && tag == '0'?
            <PageSubmit title = "确定提交支撑评价结果吗？" subState={!hasNull} donotTips = "未评价完成，不能提交！"
                        save={this.save} submit={this.submit}/>
              :null}
          </div>
      </div>
    )
  }
}
/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-25
 * @param state 状态树
 */
function mapStateToProps(state) {
  const { detailList,tag} = state.support;
  if(detailList.length){
    detailList.map((i,index)=>i.key=index)
  }
  return {
    detailList,
    tag,
    loading: state.loading.models.support,
  };
}
export default connect(mapStateToProps)(SupportDetail)
