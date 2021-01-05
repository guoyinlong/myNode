/**
 * 作者： 卢美娟
 * 创建日期： 2017-08-20
 * 邮箱: lumj14@chinaunicom.cn
 * 功能： 会议列表页面
 */
import React from 'react';
import {connect } from 'dva';
import { Table,  Menu, Icon, DatePicker,message ,Select,Button,Tooltip} from 'antd';
import moment from 'moment';
import {timeMap,getToday} from '../../../components/meetSystem/meetConst.js'
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;
import styles from '../../../components/meetSystem/myOrder.less'
import Error from '../errorPage/index';
import Cookie from 'js-cookie';
/**
 * 作者：卢美娟
 * 创建日期：2017-08-20
 * 功能：实现会议类型、预定日期、会议室名称、会议名称、员工姓名、参会人数、开始时间的渲染功能
 *  @param text
 *  @param record 会议列表的返回数据
 *  @param index  这条数据的索引
 *  @param col 略
 */

function showOrderday (text, record,index,col) {
  return <div>{record.book_day}</div>
}
function showMeetroom (text, record,index,col) {
  return <div>{record.room_name}{record.room_id}</div>
}
function showMeetname (text, record,index,col) {
  // return <div>{text}</div>

  return <div  className={styles.meetName}>
  <Tooltip title = {text}>
     {text}
   </Tooltip>
   </div>
}
function showStuff (text, record,index,col) {
  return <div>{record.booker_name}</div>
}
function showNumpeople (text, record,index,col) {
  return <div>{record.numpeople}</div>
}
function showStarttime (text, record,index,col) {
  if(record.start_time == ''||record.start_time == undefined){
      return <div></div>
  }
  else{
    return <div>{record.start_time.split(" ")[1].split('.')[0]}</div>
  }

}


/**
 * 作者：卢美娟
 * 创建日期：2017-08-20
 * 功能：实现会议列表功能
 */
class meetList extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      meet_type: null
    }
  }
  /**
   * 作者：卢美娟
   * 创建日期：2017-08-20
   * 功能：设置不可选的会议日期
   *  @param value 选择的日期
   */
  disabledDate=(value) => {
    var today = moment(getToday()).valueOf();
    return value.valueOf() < today
  }
  /**
   * 作者：卢美娟
   * 创建日期：2017-08-20
   * 功能：选择会议类别
   *  @param value 会议室类型
   */
  handleChange = (value)=> {
    this.setState({
      meet_type: value,
    })
  }
  /**
   * 作者：卢美娟
   * 创建日期：2017-08-20
   * 功能：查询预定的会议室条数
   */
  showMeetList = () => {
    const {dispatch} = this.props;
    dispatch({
      // type:'meetList/meetListSearch',   //此处的myorder是src/models/myorder/myOrder.js中的namespace
      type:'meetList/meetListSearchNew',   //此处的myorder是src/models/myorder/myOrder.js中的namespace

      // arg_ou_id:'044764b004c411e88955008cfa0519e1',
      arg_ou_id: Cookie.get('OUID'),
      arg_room_type_id:this.state.meet_type,
      arg_meeting_date:this.state.selecttime,

    })
  }
  /**
   * 作者：卢美娟
   * 创建日期：2017-08-20
   * 功能：更改查询的会议时间
   *  @param date dateString 选择的会议时间
   */
  changetime = (date, dateString) => {
      const {dispatch} =this.props

      this.setState({
        selecttime: dateString
      })

      // dispatch({
      //   type:'meetList/meetListSearch',   //此处的myorder是src/models/myorder/myOrder.js中的namespace
      //   arg_select_time: dateString,
      //   arg_meet_type: this.state.meet_type
      // })

      dispatch({
        type:'meetList/meetListSearchNew',   //此处的myorder是src/models/myorder/myOrder.js中的namespace

        arg_ou_id:'044764b004c411e88955008cfa0519e1',
        arg_room_type_id:this.state.meet_type,
        arg_meeting_date:dateString,

      })
  }

  columns = [
    {
      title: '会议室类型',
      dataIndex: 'type_name',
    },
    {
      title: '会议室',
      dataIndex: 'room_name',
      //render: (text, record, index) => showMeetroom (text, record, index,'t3'),
    },
    {
      title: '会议名称',
      dataIndex: 'title',
      // render: (text, record, index) => <div className={styles.meetName}>{text}</div>,
      render: (text, record, index) => showMeetname (text, record, index,'t5'),
      width: 250,
      className: styles.nameTitle
    },
    {
      title: '参会人数',
      dataIndex: 'number',
      //render: (text, record, index) => showNumpeople (text, record, index,'t6'),
    },
    {
      title: '会议开始时间',
      dataIndex: 'start_time',
      // render: (text, record, index) => this.showseeopeartion (text, record, index,'t7',this),
      render: (text, record, index) =>showStarttime (text, record, index,'t7'),
    },
    {
      title: '预订人',
      dataIndex: 'booker_name',
      //render: (text, record, index) => showStuff (text, record, index,'t5'),
    },
    {
      title: '预定日期',
      dataIndex: 'book_day',
      // render: (text, record, index) => showOrderday (text, record, index,'t2'),
    },

];



  render() {
    var OPTIONS = [];
    for(let key in this.props.typeNameList){
      // OPTIONS.push(this.props.typeNameList[key]);
      OPTIONS.push(key+ ' ' +this.props.typeNameList[key])
    }
    const options = OPTIONS.map((option,index)=>{
      return <Option value = {option.split(" ")[0]}>{option.split(" ")[1]}</Option>
    })
    var {loading,query,list} = this.props
    // console.log("此处返回list的值：" + JSON.stringify(list))
    if(list.length){
      list.map((i,index) => {
        i.key = index;
      })
    }

    if(this.props.isErrorPage == 1){
      return(
        <Error/>
      )
    }
    else{
      return (
        <div className = {styles.meetWrap}>
           请选择日期：
           <DatePicker style = {{marginBottom:'20px'}} allowClear = {false} value = {moment(query.arg_select_time, dateFormat)}
            disabledDate = {this.disabledDate} onChange = {this.changetime}/>&nbsp;&nbsp;&nbsp;&nbsp;
           会议室类别：
          <Select style = {{width: 200}} placeholder = "请选择会议室类别" onSelect = {this.handleChange}>{options}</Select>
           &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type = "primary" icon = "search" onClick = {this.showMeetList}>查询</Button>
          <br/>
           <Table columns = {this.columns}
                   dataSource = {list}
                   // bordered  //是否展示外边框和列边框
                   pagination = {true} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                   loading = {loading}
                   className = {styles.orderTable}
                   />
        </div>
      );
    }

  }

}

function mapStateToProps (state) {
  const { list, query, typeNameList,isErrorPage} = state.meetList;  //lumj

  return {
    loading: state.loading.models.meetList,
    list,
    query,
    typeNameList,
    isErrorPage
  };
}


export default connect(mapStateToProps)(meetList);
// export default MeetList;
