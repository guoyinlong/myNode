/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：已立项里程碑
 */
import React from 'react';
import { Progress,Tooltip} from 'antd';
import styles from '../../startup/projAdd/mileStoneCards.less';

/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 功能：每一张卡片的组件
 */
class OneCard extends React.Component{
  state={
    mileNameMaxLength:7
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-10-11
   * 功能：剪切字符串
   * @param s 输入字符串
   * @param l 能显示的最大字符串长度
   * @tag 代替超出的字符串
   */
  cutString = (s, l, tag) => {
    if (s.length > l) {
      return s.substring(0, l) + tag;
    } else {
      return s;
    }
  };

  render(){
    const {data} = this.props;
    const percent = parseFloat((parseFloat(data.plan_workload)/Number(this.props.fore_workload)*100).toFixed(2));
    return (
      <div   style={{float:'left',paddingRight:'25px',paddingBottom:'30px'}}>
        <div  className={styles.cardShadow} >
          <div className={styles.card}>
            <div className='top'>
              <div className="info">
                <div >
                  {data.mile_name.length <= this.state.mileNameMaxLength?
                    <span >{data.mile_name}</span>
                    :
                    <Tooltip title={data.mile_name}>
                      <span >{this.cutString(data.mile_name,this.state.mileNameMaxLength,'...')}</span>
                    </Tooltip>
                  }
                </div>
                <div >
                  <span>{'开始时间：'}</span>
                  <span >{data.plan_begin_time}</span>
                </div>
                <div >
                  <span >{'结束时间：'}</span>
                  <span>{data.plan_end_time}</span>
                </div>
                <div >
                  <span>{'计划工作量：'}</span>
                  <span>{data.plan_workload}</span>
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
class MileInfoQuery extends React.Component {
  render() {
    let mileTemp = [];
    for(let i = 0; i < this.props.mileInfoList.length ; i++){
      mileTemp.push(
        <OneCard
          key={i}
          data={this.props.mileInfoList[i]}
          fore_workload={this.props.fore_workload}
        />);
    }
    return (<div> {mileTemp} </div>);
  }
}

export default MileInfoQuery;
