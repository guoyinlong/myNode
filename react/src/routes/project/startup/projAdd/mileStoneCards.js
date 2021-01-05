/**
 * 作者：邓广晖
 * 创建日期：2017-9-13
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目启动的里程碑卡片
 */
import React from 'react';
import { Progress,Tooltip} from 'antd';
import moment from 'moment';
import styles from './mileStoneCards.less';

/**
 * 作者：邓广晖
 * 创建日期：2017-9-13
 * 功能：一张里程碑卡片的组件
 */
class OneMileCard extends React.Component{
  state={
    mileNameMaxLength:7
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-9-13
   * 功能：剪切文字超过指定字数时的前面文字
   * @param s 输入的文字
   * @param l 指定的长度
   * @param tag 指定省略号
   */
  cutString = (s, l, tag) => {
    if (s.length > l) {
      return s.substring(0, l) + tag;
    } else {
      return s;
    }
  };

  render(){
    const{mile_name,plan_begin_time,plan_end_time,plan_workload,editMile,deleteCard}=this.props;
    const percent = parseFloat((parseFloat(this.props.plan_workload)/Number(this.props.fore_workload)*100).toFixed(2));
    return (
      <div   style={{float:'left',paddingRight:'25px',paddingBottom:'30px'}}>
        <div  className={styles.cardShadow} >
          <div className={styles.card}>
            <div className='top'>
              <div className="info">
                <div >
                  {mile_name.length <= this.state.mileNameMaxLength?
                    <span >{mile_name}</span>
                    :
                    <Tooltip title={mile_name}>
                      <span >{this.cutString(mile_name,this.state.mileNameMaxLength,'...')}</span>
                    </Tooltip>
                  }

                </div>
                <div >
                  <span>{'开始时间：'}</span>
                  <span >{moment(plan_begin_time).format('YYYY-MM-DD')}</span>
                </div>
                <div >
                  <span >{'结束时间：'}</span>
                  <span>{moment(plan_end_time).format('YYYY-MM-DD')}</span>
                </div>
                <div >
                  <span>{'计划工作量：'}</span>
                  <span>{Number(plan_workload)}</span>
                </div>
              </div>
              <div className="avt">
                {percent <= 100?
                  <Progress width={100}
                            type="circle"
                            percent={percent}
                            format={percent=>`${percent}%`}
                            status="success"
                  />
                  :
                  <Progress width={100}
                            type="circle"
                            percent={percent}
                            status="exception"
                  />
                }

              </div>
            </div>
            <div className="foot">
              <div className="twoBtns">
                <a onClick={editMile}>编辑</a>
                <a onClick={deleteCard}>删除</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

/**
 * 作者：邓广晖
 * 创建日期：2017-9-13
 * 功能：里程碑列表卡片组件
 */
class MileStoneCards extends React.Component{

  /**
   * 作者：邓广晖
   * 创建日期：2017-9-13
   * 功能：编辑里程碑
   * @param data 当前里程碑数据
   * @param index 里程碑索引
   */
  editMile = (data,index)=>{
    this.props.editMile(data,index);
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-9-13
   * 功能：删除里程碑
   * @param index 里程碑索引
   */
  deleteCard = (index) =>{
    this.props.deleteCard(index);
  };

  render() {
    let mileListTemp = [];
    for(let i = 0; i < this.props.mileStoneList.length ; i++){
      if(this.props.mileStoneList[i].opt_type !== 'delete'){
        mileListTemp.push(
          <OneMileCard key={this.props.mileStoneList[i].key}
                       {...JSON.parse(JSON.stringify(this.props.mileStoneList[i]))}
                       fore_workload={this.props.fore_workload}
                       remainWorkLoad={this.props.remainWorkLoad}
                       editMile = {()=>this.editMile(this.props.mileStoneList[i],this.props.mileStoneList[i].key)}
                       deleteCard = {()=>this.deleteCard(this.props.mileStoneList[i].key)}
          />);
      }
    }
    return(
      <div>
        {mileListTemp}
      </div>
    )
  }
}
export default MileStoneCards;
