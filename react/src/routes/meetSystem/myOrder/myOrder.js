/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-31
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 我的预定页面
  */

import React from 'react';
import { connect } from 'dva';
import { Table,  Menu, Icon, DatePicker,Modal,Popconfirm,message,Tooltip } from 'antd';

import moment from 'moment';  //时间
import { routerRedux } from 'dva/router';
import styles from '../../../components/meetSystem/myOrder.less'
import nowTime from '../../../components/common/getnowtime.js'
import ModalDetail from './seeDetail.js'
import telSearch from '../../../services/meetSystem/meetSystem.js';
//test123


// import styles from './Aa.css';
// import Lutable from '..../components/mytable.js'
/**
 * 作者： 卢美娟
 * 创建日期： 2017-08-10
 * 功能： 显示预定日期
 */
function showorderday (text, record,index,col) {
  // return <a onClick={(e)=>e.preventDefault() }   name={col}>{record.starttime}</a>
  return <div>{record.book_day}</div>
}
/**
 * 作者： 卢美娟
 * 创建日期： 2017-08-10
 * 功能： 显示预定开始时间
 */
function showsTime (text, record,index,col) {
  // return <a onClick={(e)=>e.preventDefault() }   name={col}>{record.starttime}</a>
  if(record.start_time == ''||record.start_time == undefined){
      return <div></div>
  }else{
      return <div>{record.start_time.split(" ")[1].split('.')[0]}</div>
  }

}
/**
 * 作者： 卢美娟
 * 创建日期： 2017-08-10
 * 功能： 显示预定结束时间
 */
function showeTime (text, record,index,col) {
  return <div>{record.endtime}</div>
}
/**
 * 作者： 卢美娟
 * 创建日期： 2017-08-10
 * 功能： 显示星期
 */
function showweek (text, record,index,col) {
  var temp = new Date(record.book_day).getDay();
  var week = '';
  if(temp == 0) week = "周日";
  if(temp == 1) week = "周一";
  if(temp == 2) week = "周二";
  if(temp == 3) week = "周三";
  if(temp == 4) week = "周四";
  if(temp == 5) week = "周五";
  if(temp == 6) week = "周六";
  return <div>{week}</div>
}
/**
 * 作者： 卢美娟
 * 创建日期： 2017-08-10
 * 功能： 显示会议室名称
 */
function showmeetroomname (text, record,index,col) {
  return <div className={styles.roomnamestyle}>{record.room_name}</div>
}
/**
 * 作者： 卢美娟
 * 创建日期： 2017-08-10
 * 功能： 显示会议名称
 */
function showmeetname (text, record,index,col) {
  // return <div className={styles.meetName} >{record.conferencetitle}</div>
  return <div  className={styles.meetName}>
  <Tooltip title={record.title} style={{width:'30%'}}>
     {record.title}
   </Tooltip>
   </div>
}
/**
 * 作者： 卢美娟
 * 创建日期： 2017-08-10
 * 功能： 显示使用状态
 */
function showusestate (text, record,index,col) {
  var myDate = new Date();  //国际标准时间
  var y = myDate.getFullYear();
  var m = myDate.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = myDate.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = myDate.getHours();
  h = h < 10 ? ('0' + h) : h;
  var mi = myDate.getMinutes();
  mi = mi < 10 ? ('0' + mi) : mi;
  var nowDay = y + '-' + m + '-' + d + ' ' + h + ':' + mi;
 if(record.start_time > nowDay){
   return <div className = {styles["unused"]}>未使用</div>
 }
 if(record.start_time < nowDay){
   return <div className = {styles["used"]}>已使用</div>
 }

}
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-31
  * 功能： 我的预定页面,查看预定操作功能
  * @param text 略
  * @param record 我的预定的数据项
  */
function showseeopeartion (text, record,index,col,ss) {
  let canCom;

  var myDate = new Date();  //国际标准时间
  var y = myDate.getFullYear();
  var m = myDate.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = myDate.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = myDate.getHours();
  var mi = myDate.getMinutes();
  var nowDay = y + '-' + m + '-' + d + ' ' + h + ':' + mi;
  if(/*record.orderstate =='0' &&*/ record.start_time > nowDay){   //注意：此地方应该让新服务增加一个返回字段orderstate!!!
    canCom = <Popconfirm title="您确定要取消此预定吗？" onConfirm={()=>ss.confirm(record)} onCancel={ss.cancel} okText="Yes" cancelText="No">
      <a className = {styles["canc-detail"]+' '+styles.bookTag} href="#">取消预定</a>
    </Popconfirm>
  }
  if(record.meeting_state =='0' && record.start_time < nowDay){
      canCom= <div className = {`${styles.bookTag} ${styles.canceled}`}>取消预定</div>
  }
  if(record.meeting_state =='2'){
    canCom= <div className = {`${styles.bookTag} ${styles.canceled}`}>已取消</div>
  }
  if(record.meeting_state =='3'){
    // return <div className = {styles["forcecanceled"]}>被强制取消</div>

    canCom=
      <Tooltip overlay='' title={record.cancel_reason}>
        <span className = {`${styles.bookTag} ${styles.canceled}`}>被强制取消</span>
      </Tooltip>
  }


  return <div style={{textAlign:'left'}} >
    <div className={styles.btnWrap} style={{textAlign:'right',width:'33%'}}>
      <a  className = {styles["book-detail"]+' '+styles.bookTag} onClick={()=>ss.refs.modetail.showModal(record)}   name={col}>{'查看'}</a>
    </div>
    <div className={styles.btnWrap} style={{width:'66%'}}>
      {canCom}
    </div>

    </div>
}

/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-31
  * 功能： 我的预定页面,取消预定操作功能
  * @param text 略
  * @param record 我的预定的数据项
  */
function showcancelopeartion (text, record,index,col,confirm,cancel) {
  if(record.orderstate =='0'){
    return <Popconfirm title="您确定要取消此预定吗？"   onConfirm={()=>confirm(record)} onCancel={cancel} okText="Yes" cancelText="No">
      <a  className = {styles["canc-detail"]+' '+styles.bookTag} href="#">取消预定</a>
    </Popconfirm>
  }
  if(record.orderstate =='2'){
    return <div className = {styles["canceled"]+' '+styles.bookTag}>已取消</div>
  }
  if(record.orderstate =='3'){
    // return <div className = {styles["forcecanceled"]}>被强制取消</div>

          return <div >
          <Tooltip overlay='' title={record.cancel_reason}>
             <span style={{width:'50%'}}  className = {styles["canceled"]+' '+styles.bookTag}>被强制取消</span>
           </Tooltip></div>
  }
}

/**
 * 作者： 卢美娟
 * 创建日期： 2017-08-10
 * 功能： 我的预定模块类
 */
class MyOrder extends React.Component{

//   confirm=(record)=> {
//     // message.success('您取消了预定');
//     //此处写dispatch
//     const {dispatch} = this.props;
//     dispatch({
//       type:'myorder/cancelOrder',   //此处的myorder是src/models/myorder/myOrder.js中的namespace
//       // type:'myorder/orderCancel',
//       arg_meetid:record.meetid,
//       arg_time_quantum:record.time_quantum,
//       arg_roomname:record.roomname,
//       arg_orderday:record.orderday
//     })
// }
//新的
confirm=(record)=> {
  // message.success('您取消了预定');
  //此处写dispatch
  const {dispatch} = this.props;
  dispatch({
    type:'myorder/cancelOrderNew',   //此处的myorder是src/models/myorder/myOrder.js中的namespace
    arg_meeting_id:record.meeting_id,
  })
}

 cancel=(e) => {
  message.error('您放弃取消预定');
}

    columns = [
  {
    title: '预定日期',
    dataIndex: 'orderday',
    render: (text, record, index) => showorderday (text, record, index,'t1'),
  },
  {
    title: '开始时间',
    dataIndex: 'sTime',
    render: (text, record, index) => showsTime (text, record, index,'t1'),
  },
  // {
  //   title: '结束时间',
  //   dataIndex: 'eTime',
  //   render: (text, record, index) => showeTime (text, record, index,'t2'),
  // },
  {
    title: '星期',
    dataIndex: 'week',
    render: (text, record, index) => showweek (text, record, index,'t3'),
  },
  {
    title: '会议室',
    dataIndex: 'meetroomname',
    render: (text, record, index) => showmeetroomname (text, record, index,'t4'),

  },
  {
    title: '会议名称',
    dataIndex: 'meetname',
    render: (text, record, index) => showmeetname (text, record, index,'t5'),
    width:250,
    className:styles.nameTitle
  },
  {
    title: '使用状态',
    dataIndex: 'usestate',
    render: (text, record, index) => showusestate (text, record, index,'t6'),
  },
  {
    title: '操作',
    dataIndex: 'seeopeartion',
    // render: (text, record, index) => this.showseeopeartion (text, record, index,'t7',this),
      render: (text, record, index) =>showseeopeartion (text, record, index,'t7',this),
  },
  // {
  //   title: '取消操作',
  //   dataIndex: 'caneloperation',
  //   render: (text, record, index) => showcancelopeartion (text, record, index,'t8',this.confirm,this.cancel),
  // }
  ];


  render(){
    var {loading,list} = this.props
    if(list.length){
      list.map((i,index)=>{
        i.key=index;
      })
    }
    return(
       <div /*className = {styles["topclass"]}*/ className={styles.meetWrap}>
       <div style={{}} className={styles.lightInfo}>
         温馨提示：如因故不能到场，请提前1小时取消预订
       </div>
       <div /*className = {styles["secondclass"]}*/>
       <Table columns={this.columns}
               dataSource={list}
               // bordered  //是否展示外边框和列边框
               pagination={true} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
               loading={loading}
               className={styles.orderTable}
               />

       </div>
       <ModalDetail ref='modetail' onSubmit={this.orderSubmit} />
      </div>
    );
  }
}

/**
 * 作者： 卢美娟
 * 创建日期： 2017-08-10
 * 功能： 建立外部state对象到UI组件的props对象的映射关系
 */
function mapStateToProps (state) {
  const { list, query} = state.myorder;  //lumj
  return {
    loading: state.loading.models.myorder,
    list,
    query
  };
}


export default connect(mapStateToProps)(MyOrder);
