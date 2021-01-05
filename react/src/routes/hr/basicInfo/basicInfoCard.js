/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-11
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现员工信息查询卡片展示功能
 */
import React from 'react';
import {Icon} from 'antd';
import styles from './basicInfoCard.less';
//import defaultAvt from '../../../assets/Images/unicom_logo_bg.png'
/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-11
 *  功能：实现员工信息查询卡片展示功能
 */
class OneCard extends React.Component{
  state = {
    infoHidden:true,
    user_name:this.props.data.username,
    staff_id:this.props.data.staff_id,
    dept_name:this.props.data.deptname.split('-')[1],
    post_name:this.props.data.post_name,
    post_type:this.props.data.post_type === '0' ? '主岗':'兼职',
    employ_type:this.props.data.employ_type,
    tel:this.props.data.tel,
    email:this.props.data.email
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-19
   * 功能：卡片的折叠和展开
   */
  stretchSwitch = ()=> {
    this.setState({
      infoHidden:!this.state.infoHidden
    });
  };
  render() {
    return (
        <div className={styles.cardWrap}>
          <div className={styles.card}>
            <div className="avt">
            </div>
            <div className="info">
                <div className="name">
                  {this.state.user_name}
                </div>
                <div className="content">
                   <div className="notStretch">
                     <div>
                       <Icon type="biaoqian" className={styles.formData}/> {this.state.staff_id}
                     </div>
                     <div>
                       <Icon type="bumen" className={styles.formData}/> {this.state.dept_name}
                     </div>
                     <div>
                       <Icon type="youxiang" className={styles.email}/> {this.state.email}
                     </div>
                     <div>
                       <Icon type="dianhua" className={styles.formData}/> {this.state.tel}
                     </div>
                   </div>
                  {this.state.infoHidden ?
                    null
                    :
                    <div className="stretch">
                      <div>
                        <Icon type="zhiwumingcheng" className={styles.formData}/> {this.state.post_name}
                      </div>
                      <div>
                        <Icon type="yonggongleixing" className={styles.formData}/> {this.state.employ_type}
                      </div>
                      <div>
                        <Icon type="zhiwuleixing" className={styles.formData}/> {this.state.post_type}
                      </div>
                    </div>
                  }
                </div>
                <div className="foot">
                {this.state.infoHidden?
                  <Icon type="caret-down" style={{color:'#999999'}} onClick={this.stretchSwitch}/>
                  :
                  <Icon type="caret-up" style={{color:'#999999'}} onClick={this.stretchSwitch}/>
                }
               </div>
            </div>
          </div>
        </div>
      )
  }
}

/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-11
 *  功能：实现员工信息查询卡片展示功能，展示所有查询结果的卡片形式
 */
class basicInfoCard extends React.Component{
  render(){
    let cardListTemp = [];
    //用key来唯一标识一张卡片
    for(let i = 0; i < this.props.tableDataList.length ; i++){
      cardListTemp.push(<OneCard key={this.props.tableDataList[i].staff_id+
                                      this.props.tableDataList[i].deptname+
                                      this.props.tableDataList[i].post_name+
                                      this.props.tableDataList[i].post_type+
                                      this.props.tableDataList[i].employ_type}
                                 data={this.props.tableDataList[i]}/>);
    }

    return (
      <div >
      <div className={styles.cardFlex}>
        {cardListTemp}
      </div>
      </div>
    )
  }
}

export default basicInfoCard;
