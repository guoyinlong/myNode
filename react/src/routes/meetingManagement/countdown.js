/**
 * 作者：韩爱爱
 * 日期：2020-3-02
 * 邮箱：1010788276@qq.com
 * 功能：议题倒计时
 */
import React, {Component} from 'react';
import {connect } from 'dva';
import styles from './countdown.less'
import { Button } from 'antd';
class Countdown extends Component{
  constructor(props){
    super(props)
  };
  // 进入全屏页面
  screenPage =()=>{
    this.props.dispatch({
      type:'countdown/screenPage',
    })
  };
  //结束本次会议
  endMeeting =()=>{
    this.props.dispatch({
      type:'countdown/endMeeting',
    })
  };
  // render() {
  //   const {lastIssue, nextIssue, meetingMinute, meetingSecond, countdownText, marginDistance}= this.props;
  //   return(
  //     <dvi style={{background: '#fff',borderRadius: '6px', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}  id="content">
  //       <div style={{ height: "100vh"}}>
  //         <div className={styles.timeCase}>
  //           <div className={styles.timeTop}>
  //             当前议题
  //             <span style={{width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
  //             <span onClick={this.screenPage}>{lastIssue}</span>
  //           </div>
  //           <div  className={styles.timeMiddle}>
  //             <div style={{fontSize:"30px",textAlign: 'left',marginLeft:marginDistance}}>
  //               汇报时长
  //               {
  //                 countdownText ==='0'?
  //                   <span>
  //                     <span style={{color:'#000',marginLeft:'20px'}}>倒计时</span>
  //                     <span style={{width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
  //                   </span>
  //                   :
  //                   <span>
  //                     <span style={{color:'#f00',marginLeft:'20px'}}>超时</span>
  //                     <span style={{width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
  //                   </span>
  //               }
  //             </div>
  //             <div className={styles.bgy}>
  //               {meetingMinute.length !='0'?
  //                 <div className={styles.allBox}>
  //                     <span className={styles.all}>{meetingMinute[0]}</span>
  //                     <span className={styles.all}>{meetingMinute[1]}</span>
  //                 </div>
  //                 :
  //                 <div className={styles.allBox}>
  //                   <span className={styles.all}>0</span>
  //                   <span className={styles.all}>0</span>
  //                 </div>
  //             }
  //               <div className={styles.bs}>
  //                 <i className={styles.oCircle}></i>
  //                 <i className={styles.oCircle}></i>
  //               </div>
  //               {meetingSecond.length !='0'?
  //                 <div className={styles.allBox}>
  //                     <span className={styles.all}>{meetingSecond[0]}</span>
  //                     <span className={styles.all}>{meetingSecond[1]}</span>
  //                 </div>
  //                 :
  //                 <div className={styles.allBox}>
  //                   <span className={styles.all}>0</span>
  //                   <span className={styles.all}>1</span>
  //                </div>
  //               }
  //             </div>
  //           </div>
  //           <div className={styles.timeBottot}>
  //             <div>
  //               下一个议题
  //               <span style={{width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
  //               <span style={{color:'#000'}}>{nextIssue}</span>
  //               请准备
  //             </div>
  //             <div style={{textAlign: 'right',marginRight:'40px'}}>
  //               <Button onClick={()=>{this.endMeeting()}}>结束本次会议</Button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </dvi>
  //   )
  // }

  render() {
    const {lastIssue, nextIssue, meetingMinute, meetingSecond, countdownText, marginDistance}= this.props;
    return(
      <div style={{background: '#fff',borderRadius: '6px', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}} id="content">
        <div style={{ height: "100vh"}}>
          <div className={styles.timeCase}>
             <div className={styles.timeTop}>
               当前议题
               <span style={{width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
               <span onClick={this.screenPage}>{lastIssue}</span>
             </div>
            <div className={styles.timeTop}  style={{marginTop:'3%'}}>
              <div className={styles.reportingTime}>
                汇报时长
                {
                  countdownText ==='0'?
                    <span>
                      <span style={{color:'#000',marginLeft:'20px'}}>倒计时</span>
                      <span style={{width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                    </span>
                    :
                    <span>
                      <span style={{color:'#f00',marginLeft:'20px'}}>超时</span>
                      <span style={{width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                    </span>
                  }
              </div>
              <div className={styles.reportingTime}>
                <div className={styles.bgy}>
                  <div>
                    {meetingMinute.length !='0'?
                      <div className={styles.allBox}>
                        <span className={styles.all}>{meetingMinute[0]}</span>
                        <span className={styles.all}>{meetingMinute[1]}</span>
                      </div>
                      :
                      <div className={styles.allBox}>
                        <span className={styles.all}>0</span>
                        <span className={styles.all}>0</span>
                      </div>
                    }
                  </div>
                  <div className={styles.allCircle}>
                    <i className={styles.oCircle}></i>
                    <i className={styles.oCircle}></i>
                  </div>
                  <div>
                     {meetingSecond.length !='0'?
                        <div className={styles.allBox}>
                          <span className={styles.all}>{meetingSecond[0]}</span>
                          <span className={styles.all}>{meetingSecond[1]}</span>
                        </div>
                        :
                        <div className={styles.allBox}>
                          <span className={styles.all}>0</span>
                          <span className={styles.all}>1</span>
                       </div>
                     }
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.timeTop}>
               下一个议题
               <span style={{width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
               <span style={{color:'#000'}}>{nextIssue}</span>
               请准备
              <div style={{textAlign: 'right',marginRight:'40px'}}>
                <Button onClick={()=>{this.endMeeting()}}>结束本次会议</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
 }
}
function countdownProps(state){
  return{
    loading : state.loading.models.countdown,
    ...state.countdown
  }
}
export default connect(countdownProps)(Countdown);