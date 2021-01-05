/**
 * 作者：张楠华
 * 日期：2018-1-23
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：会议室配置
 */
import React from 'react';
import { Button } from 'antd';
import style from '../css/meetroomDetail.less'

class MeetroomDetail extends React.Component{
  toList = () => {
    history.back();
  };
  render(){
    const {query} = this.props.location;
    const stateMap = {
      0: "可用",
      1: "不可用"
    };
    return(
      <div  className={style.meetWrap}>
        <Button type="primary" className={style.buttonStyle} onClick = {()=>this.toList()}>返回</Button>
        <div className={style.container}>
          <h1 style={{minWidth: 220}}>{query.room}会议室详情（{stateMap[query.state]}）</h1>
          <div className={style.contentContainer}>
            <div className={style.detailItem}>
              <div>
                <div><span className={style.tittle}>会议室名称：</span><span>{query.room}</span></div>
                <div><span className={style.tittle}>容量：</span><span>{query.capacity}人</span></div>
                <div><span className={style.tittle}>配套设施：</span><span>{query.equipment}</span></div>
                <div><span className={style.tittle}>会议室类型：</span><span>{query.type}</span></div>
                <div><span className={style.tittle}>会前需求：</span><span>{query.need}</span></div>
              </div>
            </div>
            <img src={query.url} className={style.roomImage}/>
          </div>
        </div>
      </div>
    );
  }
}
export default MeetroomDetail;
