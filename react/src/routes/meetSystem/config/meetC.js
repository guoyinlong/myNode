/**
 * 作者：张楠华
 * 日期：2018-1-23
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：会议室配置
 */
import React from 'react';
import { connect } from 'dva';
import Style from './baseConfig.less'
import MeetCard from '../../../components/meetSystem/meetCard.js'
import addressImg from '../../../assets/meetingSet/address3.png'
import phoneImg from '../../../assets/meetingSet/phone1.png'
import desImg from '../../../assets/meetingSet/introduction1.png'
import logo from '../../../assets/meetingSet/logo.png';
import style from '../css/meetC.less'
import plusImg from '../../../assets/meetingSet/add.png';
import zhouqi from '../../../assets/meetingSet/zhouqi.png'
import { routerRedux } from 'dva/router';
import Error from './errorPage/noData';

class MeetC extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  //新增
  addData = () => {
    const query = {
      flag : 0,
    };
    const{dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/meetSystem/meeting_setting/meetroomConfig',query
    }));
  };
  render(){
    const {  list,companyList } = this.props;
    console.log("2222222list");
    console.log(list);
    const desCard = companyList.map((item, index) => (
      <div className={style.titleContainer} key={index}>
        <div className={style.middleStyle}>
          <img src={item.url} className={style.imgContainer}/>
          <div className={style.textContainer}>
            <h2 style={{marginBottom: 30}}><img src={logo} className={style.logIconStyle}/><span style={{verticalAlign:'top'}}>中国联通软件研究院（{item.ou_name || ''}）</span></h2>
            <p style={{marginBottom: 10}}><img src={addressImg} className={style.iconStyle}/><span className ={Style.textStyle}>地址：{item.ou_address || ''}</span></p>
            <p style={{marginBottom: 10}}><img src={phoneImg} className={style.iconStyle}/><span className ={Style.textStyle}>联系电话：{item.ou_tel || ''}</span></p>
            <p style={{marginBottom: 10}}><img src={zhouqi} className={style.iconStyle}/><span className ={Style.textStyle}>预定周期（天）：{item.period_time || ''}</span></p>
            <p style={{marginBottom: 10}}><img src={desImg} className={style.iconStyle}/><span className ={Style.textStyle}>简介：{item.ou_description || ''}</span></p>
          </div>
        </div>
      </div>
    ));
    const  meetingList = list.length !== 0? list.map((item,index)=>
      <MeetCard key = {index}
                id = {item.hasOwnProperty('room_id')?item.room_id:null}
                room={item.hasOwnProperty('room_name')?item.room_name:[]}
                time={item.hasOwnProperty('create_time')?item.create_time:null}
                type={item.hasOwnProperty('type_name')?item.type_name:null}
                typeId = {item.hasOwnProperty('type_id')?item.type_id:null}
                capacity={item.hasOwnProperty('room_capacity')?item.room_capacity:null}
                equipment={item.hasOwnProperty('room_equipment')?item.room_equipment:[]}
                basicequipment={item.hasOwnProperty('room_basic_equipment')?item.room_basic_equipment:[]}
                state={item.hasOwnProperty('room_tag')?item.room_tag:null}
                need={item.hasOwnProperty('room_description')?item.room_description:null}
                url={item.hasOwnProperty('url')?item.url:null}
                photo_id={item.hasOwnProperty('photo_id')?item.photo_id:null}
                dispatch = {this.props.dispatch}
      />) : [];
    return(
      <div style={{minWidth: 700}}>
        {
          this.props.RetNum ==='0'?
            <div  className={Style.wrap} style={{minWidth: 700}}>
              <Error/>
            </div>
            :
            <div  className={Style.wrap} style={{minWidth: 700}}>
              {desCard}
              <div>
                {
                  desCard.length !== 0 ?
                    <div style={{display:'inline-block',verticalAlign: 'top',marginLeft:30,marginTop:20,width:430,height:235}} className={style.cardStyle}>
                      <div onClick={()=>this.addData()}>
                        <div className={style.plusStyle}>
                          <img src={plusImg}/>
                          <p>请添加</p>
                        </div>
                      </div>
                    </div>
                    :
                    []
                }
                {meetingList}
              </div>
            </div>
        }
      </div>
    );
  }
}
function mapStateToProps (state) {
  return {
    ...state.meetC
  };
}
export default connect(mapStateToProps)(MeetC);
