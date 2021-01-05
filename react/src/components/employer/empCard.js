/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：员工卡片组件
 */

import { Checkbox,Icon ,Button,Spin,Popconfirm} from 'antd';
import styles from './empCard.less'
import React from 'react'
import defaultAvt from '../../assets/Images/unicom_logo_bg.png'

/**
 * 作者：李杰双、
 * 功能：单个卡片的UI组件
 */
function EmpCard(props) {
  const {changeHandle,staff_name,dept_name,checked,foot,tel,loginname,relative_url}=props
 // debugger
  ///filemanage/upload/systemAvatar/10010/2017/8/22/allSystemAvatar/avatar_4.png
  return <div className={styles.cardWrap}>

    <div><Checkbox onChange={changeHandle} checked={checked}></Checkbox></div>
    <div className={styles.cardShadow}>
      <div className={styles.card}>
        <div className='top'>
          <div className="avt"><img src={relative_url?relative_url:defaultAvt}/></div>
          <div className="info">
            <div >
              <span><Icon type="xingming" style={{color:'#A8CCEE'}}/></span>
              {staff_name}
            </div>
            <div>
              <span><Icon type="bumen" style={{color:'#A8CCEE'}}/></span>
              {dept_name.split('-')[1]}
            </div>
            <div>
              <span><Icon type="dianhua" style={{color:'#A8CCEE'}}/></span>

              {tel}
            </div>
            <div >
              <span><Icon type="biaoqian" style={{color:'#A8CCEE'}}/></span>

              {loginname}
            </div>

          </div>
        </div>
        <div className="foot">
          {foot.length===1?<div className="oneBtn">{foot}</div>:<div className="twoBtns">{foot}</div>}
        </div>
      </div>
    </div>

  </div>
}
/**
 * 作者：李杰双、
 * 功能：卡片组组件
 */
export default class CardGroup extends React.Component{
  state={
    indeterminate:false,
    checkAll:false,
    checked:[]
  }
  /**
   * 作者：李杰双、
   * 功能：选中卡片功能
   */
  changeHandle=(index)=>(e)=>{
    //debugger
    let data=this.state.checked;
    data[index]=e.target.checked
    //console.log(data.some(i=>i))
    //console.log(data.every(i=>i))

    this.setState({
      checked:[...data],
      indeterminate:data.some(i=>i),
      checkAll:data.every(i=>i)&&data.length===this.props.list.length
    })
  }
  /**
   * 作者：李杰双、
   * 功能：卡片全选功能
   */
  onCheckAllChange=(e)=>{
    let c=e.target.checked
    const{list}=this.props

    this.setState({
      checked:list.map(i=>c),
      checkAll:c,
      indeterminate:c
    })
  }
  /**
   * 作者：李杰双、
   * 功能：重置state
   */
  resetState=()=>{
    this.setState({
      indeterminate:false,
      checkAll:false,
      checked:[]
    })
  }
  /**
   * 作者：李杰双、
   * 功能：卡片全选功能
   */
  changeTypeAll=(type)=>()=>{
    const {changeTypeAll,list} = this.props;
    const {checked}=this.state;
    changeTypeAll(type,list,checked)
    this.resetState()
  }
  /**
   * 作者：李杰双、
   * 功能：根据类别生成卡片按钮
   */
  getBatch=(state)=>{
    let {checked}=this.state;
    let disbled=checked.some(i=>i)

    let en=<Popconfirm title="确认批量调整至项目考核?" onConfirm={this.changeTypeAll('0')} okText="确定" cancelText="取消">
      <Button disabled={!disbled} style={{marginRight:'10px'}}>批量项目考核</Button>
    </Popconfirm>,
      lv=<Popconfirm title="确认批量调整至综合考核?"  onConfirm={this.changeTypeAll('1')} okText="确定" cancelText="取消">
          <Button disabled={!disbled}>批量综合考核</Button>
        </Popconfirm>

    if(state===''){
      return <span>{en}{lv}</span>
    }
    if(state==='1'){
      return en
    }
    return lv
  }
  render() {
    const {indeterminate,checkAll,checked}=this.state
    const {list,foot,showState,loading} = this.props;
    return (
      <Spin tip="Loading..." spinning={loading}>
        <div >
          <div className={styles.batch}>
            <Checkbox
              indeterminate={indeterminate}
              checked={checkAll}
              onChange={this.onCheckAllChange}
            >
              全选
            </Checkbox>
            {this.getBatch(showState)}
          </div>
          <div className={styles.cardFlex}>
            {
              !list.length&&!loading
                ?<p className={styles.empty}><Icon type="frown-o" />&nbsp;暂无数据</p>
                :list.map((i,index)=><EmpCard
                  {...i}
                  changeHandle={this.changeHandle(index)}
                  checked={checked[index]}
                  key={index}
                  foot={foot(i.uuid)}
                />)
            }

          </div>

        </div>
      </Spin>

    )
  }
}
