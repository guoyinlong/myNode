/**
 * 作者：邓广晖
 * 创建日期：2017-11-5
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目变更审核里程碑的预览
 */
import React from 'react';
import { Row,Col,Progress,Tooltip } from 'antd';
import styles from '../../../project/startup/projAdd/mileStoneCards.less';

/**
 * 作者：邓广晖
 * 创建日期：2017-11-5
 * 功能：每一张卡片的组件
 */
class CheckMilestoneOneCard extends React.PureComponent{
  state={
    mileNameMaxLength:7
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-11-5
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

    return (
      <div   style={{float:'left',paddingRight:'30px',paddingBottom:'30px'}}>
        <div  className={styles.cardShadow} >
          <div className={styles.card} style={{width:370}}>
            {this.props.has_data === '0'?
              <div style={{height:130}}>{''}</div>
              :
              <div className='top'>
                <div className="info">
                  <div >
                    {this.props.mile_name.length <= this.state.mileNameMaxLength?
                      <span style={{color:this.props.mile_name_is_diff === '0'?'black':'red'}}>
                      {this.props.mile_name}
                      </span>
                      :
                      <Tooltip title={this.props.mile_name}>
                        <span style={{color:this.props.mile_name_is_diff === '0'?'black':'red'}}>
                        {this.cutString(this.props.mile_name,this.state.mileNameMaxLength,'...')}
                        </span>
                      </Tooltip>
                    }
                  </div>
                  <div >
                    <span style={{color:this.props.plan_begin_time_is_diff === '0'?'black':'red'}}>{'开始时间：'}</span>
                    <span >{this.props.plan_begin_time}</span>
                  </div>
                  <div >
                    <span style={{color:this.props.plan_end_time_is_diff === '0'?'black':'red'}}>{'结束时间：'}</span>
                    <span>{this.props.plan_end_time}</span>
                  </div>
                  <div >
                    <span  style={{color:this.props.plan_workload_is_diff === '0'?'black':'red'}}>{'计划工作量：'}</span>
                    <span>{this.props.plan_workload}</span>
                  </div>
                </div>
                <div className="avt">
                  {this.props.is_delete && this.props.is_delete === '1'?
                    <div style={{color:'red',fontWeight:'bold',fontSize:20,marginLeft:20,marginTop:31}}>已删除</div>
                    :
                    <Progress width={100}
                              type="circle"
                              percent={Number(this.props.mile_month_progress)}
                              format={percent=>`${percent}%`}
                              status="success"
                    />
                  }
                </div>
              </div>
            }
            {/*tag显示，绝地定位*/}
            {this.props.mile_file_tag_show && this.props.mile_file_tag_show.length > 3?
              <div style={{position:'absolute',left:'77%',top:'20px',color:'red',fontWeight:'bold',transform:'rotate(30deg)'}}>
                {this.props.mile_file_tag_show}
              </div>
              :
              <div style={{position:'absolute',left:'85%',top:'15px',color:'red',fontWeight:'bold',transform:'rotate(30deg)'}}>
                {this.props.mile_file_tag_show}
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

/**
 * 作者：邓广晖
 * 创建日期：2017-11-5
 * 功能：变更项目审核里程碑
 */
class ProjCheckMilestone extends React.PureComponent {
  constructor(props) {super(props);}

  render(){

    let checkMilestonePre = this.props.checkMilestonePreData.map((item,index)=>{
      return(<CheckMilestoneOneCard  {...item}/>);
    });
    let checkMilestoneNew = this.props.checkMilestoneNewData.map((item,index)=>{
      return(<CheckMilestoneOneCard  {...item}/>);
    });
    return(
      <Row>
        <Col className="gutter-box" span={12} style={{paddingLeft:'5%'}}>
          <div style={{paddingLeft:'33%',fontWeight:'bold',fontSize:18,marginBottom:6}}>原值</div>
          <div style={{fontSize:17,marginBottom:10,marginLeft:37}}>
            <span>预估工作量</span>
            <span style={{color:'red'}}>{this.props.old_fore_workload}</span>
            <span>人月</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>剩余工作量</span>
            <span style={{color:'red'}}>{this.props.old_remain_workload}</span>
            <span>人月</span>
          </div>
          <div>{checkMilestonePre}</div>
        </Col>
        <Col className="gutter-box" span={12} style={{paddingLeft:'5%',borderLeft:'1px solid #CCCCCC'}}>
          <div style={{paddingLeft:'33%',fontWeight:'bold',fontSize:18,marginBottom:6}}>新值</div>
          <div style={{fontSize:17,marginBottom:10,marginLeft:37}}>
            <span>预估工作量</span>
            <span style={{color:'red'}}>{this.props.new_fore_workload}</span>
            <span>人月</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>剩余工作量</span>
            <span style={{color:'red'}}>{this.props.new_remain_workload}</span>
            <span>人月</span>
          </div>
          <div>{checkMilestoneNew}</div>
        </Col>
      </Row>
    );
  }
}

export default ProjCheckMilestone;
