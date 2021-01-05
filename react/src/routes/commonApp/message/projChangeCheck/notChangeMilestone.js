/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：已立项里程碑
 */
import React from 'react';
import { Progress,Tooltip} from 'antd';
import styles from '../../../project/startup/projAdd/mileStoneCards.less';
import config from '../../../../utils/config';

/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 功能：每一张卡片的组件
 */
class OneCard extends React.Component{

  state={ mileNameMaxLength:7};
  /**
   * 作者：邓广晖
   * 创建日期：2017-10-11
   * 功能：剪切字符串
   * @param s 输入字符串
   * @param l 能显示的最大字符串长度
   * @param tag 代替超出的字符串
   */
  cutString = (s, l, tag) => {
    if (s.length > l) {
      return s.substring(0, l) + tag;
    } else {
      return s;
    }
  };

  render(){
    //const percent = parseFloat((parseFloat(this.state.plan_workload)/Number(this.state.fore_workload)*100).toFixed(2));
    return (
      <div   style={{float:'left',paddingRight:'25px',paddingBottom:'30px'}}>
        <div  className={styles.cardShadow} >
          <div className={styles.card}>
            <div className='top'>
              <div className="info">
                <div >
                  {this.props.mile_name.length <= this.state.mileNameMaxLength?
                    <span >{this.props.mile_name}</span>
                    :
                    <Tooltip title={this.props.mile_name}>
                      <span >{this.cutString(this.props.mile_name,this.state.mileNameMaxLength,'...')}</span>
                    </Tooltip>
                  }
                </div>
                <div >
                  <span>{'开始时间：'}</span>
                  <span >{this.props.plan_begin_time}</span>
                </div>
                <div >
                  <span >{'结束时间：'}</span>
                  <span>{this.props.plan_end_time}</span>
                </div>
                <div >
                  <span>{'计划工作量：'}</span>
                  <span>{this.props.plan_workload}</span>
                </div>
              </div>
              <div className="avt">
                {this.props.mile_month_progress?
                  <Progress width={100}
                            type="circle"
                            percent={Number(this.props.mile_month_progress)}
                            format={percent=>`${percent}%`}
                            status="success"
                  />
                  :
                  <Progress width={100}
                            type="circle"
                            percent={0}
                            format={percent=>`${percent}%`}
                            status="success"
                  />
                }
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
 * 创建日期：2017-10-11
 * 功能：tabs中里程碑页面
 */
class NotChangeMilestone extends React.Component {
  render() {
    let mileStoneInfoList = this.props.notChangeMileInfo.map((item,index)=>{
      return(<OneCard  {...item} key={index}/>);
    });
    return (<div>
             {
               this.props.isFinanceLink==='0'?
                 <div style={{fontWeight:'bold',fontSize:17,color:'red',textAlign:'center',marginBottom:13}}>{config.PROJ_IS_CHANGE}</div>
                 :null
             }
            {mileStoneInfoList}
          </div>);
  }
}

export default NotChangeMilestone;
