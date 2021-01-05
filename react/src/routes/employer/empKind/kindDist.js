/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：员工类型分配页面
 */
import { connect } from 'dva';
import React from 'react'
import CardGroup from '../../../components/employer/empCard'
import styles from '../../../components/employer/employer.less'
import {Popconfirm,Badge} from 'antd'


//import KindDist from './kindUI'
/**
 * 作者：李杰双
 * 功能：员工分配页面的容器组件
 */
class KindDist extends React.Component{
  state={
    showState:'0',
    checked:[],
    indeterminate:false,
    checkAll:false
  }
  showMap={
    0:'项目考核人员',
    1:'综合考核人员',
    '':'待分配考核人员'
  }
  btnTextMap={
    0:'调整至项目考核',
    1:'调整至综合考核',
    '':''
  }
  /**
   * 作者：李杰双
   * 功能：计算每个类别的人数
   */
  getPeopleNum(flag){
    let {list}=this.props;

    list=list.filter(i=>{
      if(!flag){
        return i.emp_type===undefined
      }
      return i.emp_type===flag
    });
    return list.length
  }
  /**
   * 作者：李杰双
   * 功能：根据类别返回卡片底部的按钮
   */
  getFoot=(states)=>(uuid)=>{

    //debugger
    let foot=[]
    states.forEach((i,index)=>{
      if(i!==''){
        foot.push(
          <Popconfirm title={`确定${this.btnTextMap[i]}?`} key={index} onConfirm={()=>{
            const {dispatch}=this.props
            dispatch({
              type:'empKind/update_persion_type',
              emptype:i,
              uuid,
            });
            this.refs.cards.resetState()
          }} okText="确定" cancelText="取消">
            <a >{this.btnTextMap[i]}</a>
          </Popconfirm>
        )
      }
    })
    return foot
  }
  /**
   * 作者：李杰双
   * 功能：切换显示类别
   */
  changeType(i){
    this.setState({
      showState:i,
      checked:[],
      indeterminate:false,
      checkAll:false
    })
  }
  /**
   * 作者：李杰双
   * 功能：批量操作功能
   */
  changeTypeAll=(type,list,checked)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'empKind/update_persion_type_all_new',
      emptype:type,
      list,
      checked
    })
  }
  render(){
    let {list,loading}=this.props;
    const {showState}=this.state
    list=list.filter(i=>{
      if(!showState){
        return i.emp_type===undefined
      }
      return i.emp_type===showState
    })
    return (
      <div className={styles.wrap}>
        <div className={styles.kindHead}>
          <h2>{this.showMap[showState]}</h2>

          <div className="subHead">
            {
              Object.keys(this.showMap).filter((i)=>i!==showState)
                .map((i,index)=><Badge showZero={true} count={this.getPeopleNum(i)} key={index}>
                    <a
                      onClick={(e)=>{e.preventDefault();this.changeType(i)}}>
                      {this.showMap[i]}
                    </a>
                  </Badge>)
            }

          </div>
        </div>
        <hr/>
        <div style={{paddingTop:'20px'}}>
          <CardGroup
            ref="cards"
            list={list}
            foot={this.getFoot(Object.keys(this.showMap).filter((i)=>i!==showState))}
            changeTypeAll={this.changeTypeAll}
            key={showState}
            showState={showState}
            loading={loading}
            />
          {/*{list.map((i,index)=><EmpCard*/}
            {/*{...i}*/}
            {/*changeHandle={this.changeHandle(index)}*/}
            {/*checked={checked[index]}*/}
            {/*key={index}*/}
            {/*foot={this.getFoot(Object.keys(this.showMap).filter((i)=>i!==showState),i.uuid)}*/}
          {/*/>)}*/}

        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { list} = state.empKind;

  return {
    list,
    loading: state.loading.models.empKind,
  };
}
export default connect(mapStateToProps)(KindDist);
