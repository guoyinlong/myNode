 /**
   * 作者： 卢美娟
   * 创建日期： 2017-07-27
   * 邮箱: lumj14@chinaunicom.cn
   * 功能： 预定查询页面
   */

import { Modal, Button, Select,Table,Popconfirm,message,Tooltip } from 'antd';
const {Option, OptGroup} = Select;
import { connect } from 'dva';
import styles from './orderSearch.less'
import ModalDetail from './seeDetail.js'
import ModalForce from './forceModal.js'
import ModalLimit from './limitModal.js'
import nowTime from '../../../components/common/getnowtime.js'
import Cookie from 'js-cookie';
import Error from '../errorPage/index';
import Error2 from '../errorPage/index4';
/**
 * 作者：卢美娟
 * 创建日期：2017-08-20
 * 功能：实现预定日期、开始时间、结束时间、员工姓名、会议室名称、会议名称、使用状态、查看操作、取消详情、强制取消、限制预定操作
 *  @param text
 *  @param record 会议列表的返回数据
 *  @param index  这条数据的索引
 *  @param col 略
 */
function showsorderday (text, record,index,col) {
  // return <a onClick={(e)=>e.preventDefault() }   name={col}>{record.starttime}</a>
  return <div>{record.book_day}</div>
}
function showsTime (text, record,index,col) {
  // return <a onClick={(e)=>e.preventDefault() }   name={col}>{record.starttime}</a>
  return <div>{record.start_time}</div>
}
function showeTime (text, record,index,col) {
  // return <div>{record.endtime}</div>  //未写
}
function showstuffname (text, record,index,col) {
  return <div>{record.booker_name}</div>
}
function showmeetroomname (text, record,index,col) {
  return <div>{record.room_name}</div>
}
function showmeetname (text, record,index,col) {
  // return <div className={styles.meetName} >{record.conferencetitle}</div>
  return <div  className={styles.meetName}>
  <Tooltip title={record.title} style={{width:'30%'}}>
     {record.title}
   </Tooltip>
   </div>
}
function showusestate (text, record,index,col) {

   var myDate = new Date();  //国际标准时间
   var y = myDate.getFullYear();
   var m = myDate.getMonth() + 1;
   m = m < 10 ? '0' + m : m;
   var d = myDate.getDate();
   d = d < 10 ? ('0' + d) : d;
   var h = myDate.getHours();
   var mi = myDate.getMinutes();
   var nowDay = y + '-' + m + '-' + d + ' ' + h + ':' + mi;
  if(record.start_time > nowDay){
    return <div className = {styles["unused"]}>未使用</div>
  }
  if(record.start_time < nowDay){
    return <div className = {styles["used"]}>已使用</div>
  }
}
function showseeopeartion (text, record,index,col,ss,deptIdList) {

    if(deptIdList.indexOf(Cookie.get('dept_id')) != -1 || Cookie.get('userid') =='0864957'){
      return <div style={{textAlign:"center",}}>
        <div className={styles.btnWrap} style={{textAlign:'right'}}>
          <a  className = {styles["book-detail"]+' '+styles.bookTag} onClick={()=>ss.refs.modetail1.showModal(record)}   name={col}>{'查看'}</a>
        </div>
        <div className={styles.btnWrap}>
          {showlimitopeartion(text,record,index,col,ss)}
        </div>
        <div className={styles.btnWrap} style={{width:'50%',textAlign:'left'}}>
          {showforcecancopeartion(text,record,index,col,ss)}
        </div>
      </div>
    }
    else{
      return <div className={styles.btnWrap2} style={{textAlign:'center'}}>
        <a  className = {styles["book-detail"]+' '+styles.bookTag} onClick={()=>ss.refs.modetail1.showModal(record)}   name={col}>{'查看'}</a>
      </div>
    }

}
function seecancelDetail(record){
  return <Alert message={record.cancelreason} type="info" />
}
function showforcecancopeartion (text, record,index,col,dd) {  //此处返回结果要有orderstate
  if(record.meeting_state == 0){
      return <a style={{minWidth:"50%",textAlign:'center'}}  className = {styles["canc-detail"]+' '+styles.bookTag} onClick={()=>dd.refs.modalforce.showModal(record)}>强制取消</a>
  }
  if(record.meeting_state == 2){
      return <div style={{minWidth:"50%",textAlign:'center'}} className = {`${styles.bookTag} ${styles.canceled}`}>已取消</div>
  }
  if(record.meeting_state == 3){
      // return(
      // // < className = {styles["forcecanceled"]} >
      // <Tooltip overlay='' title={record.cancel_reason}>
      //   <span>被强制取消</span>
      // </Tooltip>)
      // // </div>

      return <div style={{minWidth:"50%",textAlign:'center'}} className = {`${styles.bookTag} ${styles.canceled}`}>
      <Tooltip overlay='' title={record.cancel_reason}>
         <span>被强制取消</span>
       </Tooltip></div>
  }
}
function showlimitopeartion (text, record,index,col,ss) {
  return <a style={{minWidth:"50%",textAlign:'center'}} className = {styles.btnSuss+' '+styles.bookTag} onClick={()=>ss.refs.modallimit.showModal(record)}>限制</a>
}


/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 会议室预定查询类
  */
class orderSearch extends React.Component {
  showRoomOrder=()=>{
    const {dispatch} = this.props;
    dispatch({
      type:'orderSearch/orderSearchNew',  //此处的orderSearch是命名空间
      arg_room_id:this.state.room_name
    })
  }
  handleChange=(value)=> {
    this.setState({
      room_name:value
    })

  }
  onCancel=(meetid,txt,roomid)=>{
    const {dispatch} = this.props;
    dispatch({
      type:'orderSearch/forceCancel',
      arg_meeting_id:meetid,
      arg_cancel_reason:txt,
      arg_room_id:roomid,
    })
  }
  limitSubmit = (meetid,txt,roomid,roomname,title,staffid) => {
    const {dispatch} = this.props;
    var paramdata = {
      arg_staff_id:staffid,
      arg_meeting_id:meetid,
      arg_limit_reason:txt,
      arg_room_id:roomid,
      arg_room_name:roomname,
      arg_title:title
    }
    dispatch({
      type:'orderSearch/dolimitBooker',   //此处的myorder是src/models/myorder/myOrder.js中的namespace
      paramdata,
    })
  }

  cancel=(e) => {
   message.error('您取消了限制预定');
  }

  columns = [
      {
          title: '预定日期',
          dataIndex: 'orderday',
          render: (text, record, index) => showsorderday (text, record, index,'t1'),
        },
      // {
      //   title: '开始时间',
      //   dataIndex: 'sTime',
      //   render: (text, record, index) => showsTime (text, record, index,'t1'),
      // },
      // {
      //   title: '结束时间',
      //   dataIndex: 'eTime',
      //   render: (text, record, index) => showeTime (text, record, index,'t2'),
      // },
      {
        title: '预订人',
        dataIndex: 'oderstuff',
        render: (text, record, index) => showstuffname (text, record, index,'t3'),
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
          render: (text, record, index) =>showseeopeartion (text, record, index,'t7',this, this.props.deptIdList),
      },
      // {
      //   title: '强制取消',
      //   dataIndex: 'caneloperation',
      //   render: (text, record, index) => showforcecancopeartion (text, record, index,'t8',this),
      // },
      // {
      //   title: '限制操作',
      //   dataIndex: 'limitoperation',
      //   render: (text, record, index) => showlimitopeartion (text, record, index,'t9',this.confirm,this.cancel),
      // }
      ];
// state={
//    initialRoomName:this.props.initialRoomName,
//  }


  render() {
   const Option = Select.Option;
   var {loading,list,roomTypeRes,roomNameRes,isErrorPage,isErrorPage2} = this.props

   if(list.length){
     list.map((i,index)=>{
       i.key=index;
     })
   }

   const listOption = () => {
     var res = [];
     for(let i = 0; i < roomTypeRes.length; i++){
       // alert(roomTypeRes.length)
       var hahaha = ()=>{
         var res2 = [];
         for(let j = 0; j < roomNameRes.length; j++){
           if(roomNameRes[j].type_name == roomTypeRes[i].type_name){
               res2.push(
                  <Option value= {roomNameRes[j].room_id}>{roomNameRes[j].room_name}</Option>
               )
           }
         }
           return res2;
       }

       res.push(
         <OptGroup label={roomTypeRes[i].type_name}>
            {hahaha()}
         </OptGroup>
       )
     }

     return res
   }
   if(isErrorPage == 1){
     return(
       <Error/>
     )
   }
   else if(isErrorPage2 == 1){
     return(
       <Error2/>
     )
   }
   else{
     return (

         <div className={styles.meetWrap}>
           <span>&nbsp;会议室：</span>
           <Select  defaultValue = "请选择会议室"  onSelect={this.handleChange} style={{width:200,marginBottom:'20px'}} ref="selectme">
             {listOption()}
          </Select>
           &nbsp;&nbsp;&nbsp;&nbsp;
           <Button type="primary" icon="search" onClick={this.showRoomOrder}>查询</Button>

           <div>
             <Table dataSource={list} columns={this.columns} className={styles.orderTable} loading={loading}/>
           </div>
           <ModalDetail ref='modetail1' onSubmit={this.orderSubmit} />
           <ModalForce ref='modalforce' onSubmit={this.orderSubmit} onCancel={this.onCancel}/>
           <ModalLimit ref='modallimit' submitLimit={this.limitSubmit} onCancel={this.onCancel}/>
           </div>


     );
   }

  }
}

/**
 * 作者： 卢美娟
 * 创建日期： 2017-08-10
 * 功能： 建立外部state对象到UI组件的props对象的映射关系
 */
function mapStateToProps (state) {
  const { list, query,roomTypeRes,roomNameRes,initialRoomName,isErrorPage,isErrorPage2,deptIdList} = state.orderSearch;  //lumj

  return {
    loading: state.loading.models.orderSearch,
    list,
    query,
    roomTypeRes,
    roomNameRes,
    initialRoomName,
    isErrorPage,
    isErrorPage2,
    deptIdList
  };
}


export default connect(mapStateToProps)(orderSearch);
