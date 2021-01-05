/**
 * 作者：卢美娟
 * 日期：2017/9/1
 * 邮件：lumj14@chinaunicom.cn
 * 文件说明：会议室预定页面
 */
import { connect } from 'dva';
import { Table,  Menu, DatePicker,message,Button,Modal,Input,Tabs  } from 'antd';
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
import moment from 'moment';
import { routerRedux } from 'dva/router';
import NewOrder from '../../components/meetSystem/newOrder.js'
import styles from '../../components/meetSystem/roomOrder.less'
import {getToday,deptname,adminstuffid,otherstuffid} from '../../components/meetSystem/meetConst.js'
import '../../components/meetSystem/iconfont'
import Cookie from 'js-cookie';
import React from 'react'
import MeetOrderContent from './../../components/meetSystem/meetOrderContent.js'
import Error from './errorPage/index';
import Error1 from './errorPage/index1';
import Error2 from './errorPage/index2';
import Error3 from './errorPage/index3';
import Error5 from './errorPage/index5';
import GuildlineModal from '../../components/meetSystem/operationGuideline.js';

const dateFormat = 'YYYY-MM-DD';

/**
 * 作者：卢美娟
 * 功能：动态生成表格格子内容
 */
function orderText (col) {
  return (function(text, record, index){
    let name='',showText='';
    if(text){
      name=text.split('/')[1]
      showText=name
      // }
      // if(name.length>5){
      //   //showText=name.slice(0,5)+'...'
      //   showText=name
      // }else{
      //   showText=name
      // }
    }

    return <a style={{background:text?'#ADC7D5':'',color:'#7BA3BA'}} title={name} onClick={(e)=>e.preventDefault() } className={styles.fTd}  name={col}>
      {text ? <svg className={styles.icon+' '+styles.icon_small} aria-hidden="true" name={col}>
        {col}
        <use xlinkHref="#icon-yiyudingai" name = {col}></use>
      </svg> :''}
      {text ? showText : ''}&#160;
    </a>
  })
}



/**
 * 作者：卢美娟
 * 功能：会议预定表格
 */
class RoomOrder extends React.Component{

  constructor(props){
    super(props)
  };

  state={
      noticeModal: false,
      isGuidelineVisible: false,
      current: '',
      mytypeFlag: 0, // 0-一般会议室； 1-特殊会议室
    }

  /**
   * 作者：卢美娟
   * 功能：根据room id查询
   */

  componentDidMount(){

     const {dispatch} =this.props;
     let arg_staff_id=Cookie.get('staff_id');
     if(!arg_staff_id){
       //todo  没有获取到staff_id 怎么出处理
       dispatch(routerRedux.push({
           pathname:'/'
         }
       ))
       return
     }
     dispatch({
       type:'meet/limitSearch',
       arg_staff_id,
     })

   }

  componentWillMount(){
     const {dispatch} =this.props;
     //查询时间配置
     let arg_ou = Cookie.get('OU');  //暂时写死
     let arg_time_type = 0; //暂时写死  //here 有问题
     dispatch({
       type:'meet/timeSearch2',
       arg_ou,
       arg_time_type
     })
     //查询会议室类型配置
     dispatch({
       type:'meet/meetroomTypeSearch',
       arg_ou,
     })

     //查询上午、下午、晚上的配置
     dispatch({
       type:'meet/sxwSearch',
       arg_ou,
     })
   }

  room_idHandler(date, dateString) {  //选择会议时间查询
    const {dispatch,meetroomTypeRes} =this.props
    dispatch({
      type:'meet/fetch',
      query:{
            arg_ou: Cookie.get("ou"),
            arg_time_type:global.stateFlag?global.stateFlag:0,
            arg_typeid: this.state.current ? this.state.current.split(',')[0] : meetroomTypeRes[0].type_id,
            // arg_typeFlag:meetroomTypeRes[0].type_flag, //新增，会议室类型是否是特殊会议室
            arg_typeFlag: this.state.mytypeFlag,
            arg_weekday: dateString,
          }
    })
  }

  room_typeHandler = (e) => {
    const {dispatch,query} =this.props
    this.setState({
      current: e.key,
    })
    if(e.key){
      this.setState({
        mytypeFlag: this.props.meetroomTypeRes[e.key.split(',')[1]].type_flag,
      })
      dispatch({
        type:'meet/fetch',
        query:{
              arg_ou: Cookie.get("ou"),
              arg_time_type:0,
              // arg_typeid:item.key,
              arg_typeid: e.key.split(',')[0],
              arg_typeFlag:this.props.meetroomTypeRes[e.key.split(',')[1]].type_flag, //menu.item中的key用逗号传两个东西过来，一个typeid，一个typeflag
              arg_weekday: query.arg_weekday,
            }
      })
    }
  }

  room_typeHandler2 = (e) => {
    const {dispatch,query} =this.props
    this.setState({
      current: e.key,
    })
    if(e.key){
      this.setState({
        mytypeFlag: this.props.meetroomTypeRes[e.key.split(',')[1]].type_flag,
      })
      dispatch({
        type:'meet/fetch',
        query:{
              arg_ou: Cookie.get("ou"),
              arg_time_type:1,
              arg_typeid: e.key.split(',')[0],
              arg_typeFlag:this.props.meetroomTypeRes[e.key.split(',')[1]].type_flag, //menu.item中的key用逗号传两个东西过来，一个typeid，一个typeflag
              arg_weekday: query.arg_weekday,
            }
      })
    }

  }

  room_typeHandler3 = (e) => {
    const {dispatch,query} =this.props
    this.setState({
      current: e.key,
    })
    if(e.key){
      this.setState({
        mytypeFlag: this.props.meetroomTypeRes[e.key.split(',')[1]].type_flag,
      })
      dispatch({
        type:'meet/fetch',
        query:{
              arg_ou: Cookie.get("ou"),
              arg_time_type:2,
              arg_typeid: e.key.split(',')[0],
              arg_typeFlag:this.props.meetroomTypeRes[e.key.split(',')[1]].type_flag, //menu.item中的key用逗号传两个东西过来，一个typeid，一个typeflag
              arg_weekday: query.arg_weekday,
            }
      })
    }
  }

  room_typeHandler4 = (e) => {
    const {dispatch,query} =this.props
    this.setState({
      current: e.key,
    })
    if(e.key){
      this.setState({
        mytypeFlag: this.props.meetroomTypeRes[e.key.split(',')[1]].type_flag,
      })
      dispatch({
        type:'meet/fetch',
        query:{
              arg_ou: Cookie.get("ou"),
              arg_time_type:3,
              arg_typeid: e.key.split(',')[0],
              arg_typeFlag:this.props.meetroomTypeRes[e.key.split(',')[1]].type_flag, //menu.item中的key用逗号传两个东西过来，一个typeid，一个typeflag
              arg_weekday: query.arg_weekday,
            }
      })
    }
  }

  room_typeHandler5 = (e) => {
    const {dispatch,query} =this.props
    this.setState({
      current: e.key,
    })
    if(e.key){
      this.setState({
        mytypeFlag: this.props.meetroomTypeRes[e.key.split(',')[1]].type_flag,
      })
      dispatch({
        type:'meet/fetch',
        query:{
              arg_ou: Cookie.get("ou"),
              arg_time_type:4,
              arg_typeid: e.key.split(',')[0],
              arg_typeFlag:this.props.meetroomTypeRes[e.key.split(',')[1]].type_flag, //menu.item中的key用逗号传两个东西过来，一个typeid，一个typeflag
              arg_weekday: query.arg_weekday,
            }
      })
    }
  }

  /**
   * 作者：卢美娟
   * 功能：根据上午、下午查询
   */
  room_timeHandler(item) {
    const {dispatch,query,meetroomTypeRes} =this.props;
    let arg_ou = Cookie.get('OU');
    let arg_time_type;
    switch (item - 1) {
      case -1:
        arg_time_type = 3;
        break;

      case 3:
        arg_time_type = 4;
        break;

      default:
          arg_time_type = item-1;
        break;
    }
    global.stateFlag = arg_time_type;

    dispatch({  //注意：此处设计异步？回调？要点击两下下午才能取到正确的数据，即数据有延后
      type:'meet/timeSearch2',
      arg_ou,
      arg_time_type
    })

    dispatch({
      type:'meet/fetch',
      query:{
            arg_ou: Cookie.get('OU'),
            arg_time_type:arg_time_type,
            arg_typeid: this.state.current ? this.state.current.split(',')[0] : meetroomTypeRes[0].type_id,
            // arg_typeFlag:meetroomTypeRes[0].type_flag, //新增，会议室类型是否是特殊会议室
            arg_typeFlag: this.state.mytypeFlag,
            arg_weekday: query.arg_weekday,
          }
    })
  }

  /**
   * 作者：卢美娟
   * 功能：动态生成表格表头
   */
  createCol22(titleTimeRes){
      let res=[{
      title: '',
      width:'96px',
      dataIndex: 'room_name',
            render:(text)=><div>
                        <svg className={styles.icon+' '+styles.icon_small} aria-hidden="true">
                          <use xlinkHref="#icon-huiyishiai"></use>
                        </svg><br/>
                        <span style={{fontSize:'12px',overflow:'hidden',wordBreak:'keep-all'}} title={text}>{text}</span>
                      </div>

      }];
      for(let k in titleTimeRes){
        // var temp = 't' + k.split('')[1];
        // var temp2 = k;
        res.push({
          title: <div style = {{whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden'}}>
                      <svg className={styles.icon+' '+styles.icon_small} aria-hidden="true" >
                        <use xlinkHref="#icon-shijianai" style = {{fontSize:'1px'}}></use>
                      </svg>
                      <br/>
                      <span style = {{fontSize:'12px'}}>{titleTimeRes[k]}</span>
                 </div>,
          // dataIndex: 'mt'+k.split('')[1],
          // dataIndex: 'title'+k.split('')[1],
          // dataIndex: 't'+k.split('')[1],
          key:k,
          dataIndex:k,
          render: orderText(k),
          onCellClick:(record, event)=>this.orderHandle(record, event),
          className:styles['fTable'],
          width:'150px',
        })
      }
      return res
  }

  /**
   * 作者：卢美娟
   * 功能：申请会议室功能
   */
  orderHandle(record, event){
    const {titleTimeRes,meetTypeRes,dispatch,query,userState} =this.props; //将动态的时间段传递到模态框
    dispatch({
      type:'meet/searchequipment',
      arg_room_id: record.room_id,
    })
    if(!userState){
      message.warn('被限制用户无法申请会议室！');
    }
    // const tName=event.target.nodeName==='svg'?event.target.textContent:event.target.name;
    const tName=event.target.nodeName==='svg'?event.target.textContent:event.target.getAttribute('name');
    let timer={[tName]:'1'}
    if(record&&record[tName]&&record[tName]!=""){ //change
      const {dispatch} =this.props
      let meet_id = record[tName].split('/')[0];
      let arg_ou = Cookie.get('OU');
      let callback=(resData,flag)=>this.refs.mod.showModal(meetTypeRes,titleTimeRes,resData,timer,query.arg_weekday,query.arg_typeFlag,record,flag)
      dispatch({
        type:'meet/searchordered',
        arg_meeting_id:meet_id,
        arg_ou,
        callback
      })
    }else{
      this.refs.mod.showModal(meetTypeRes,titleTimeRes,record,timer,query.arg_weekday,query.arg_typeFlag)
    }
  }
  /**
   * 作者：卢美娟
   * 功能：控制日期可选范围
   */
  disabledDate=(value)=>{
    var perioidTIme = this.props.period_time
    let today = moment(getToday()).valueOf();
    let end=moment(getToday()).add(perioidTIme,'days').valueOf()
    return value.valueOf() < today||value.valueOf() > end
  }
  orderSubmit=(formData,callback,flag)=>{
    const {dispatch} = this.props;
    dispatch({
      type:'meet/insertroommeetingNew',
      formData,
      callback,
      flag
    })
  };

  orderUpdate=(formData,callback)=>{
    const {dispatch} = this.props;
    dispatch({
      type:'meet/orderUpdate',
      formData,
      callback
    })
  }

  orderCancel=(formData,callback)=>{
    const {dispatch} = this.props;
    dispatch({
      type:'meet/orderCancel',
      formData,
      callback
    })
  }

  noticeEdit=()=>{
    let cont=this.notiveCont.textAreaRef.value;
    const {dispatch} =this.props;
    dispatch({
      type:'meet/noticeInsert',
      notice_content:cont,
      callback:()=>this.setState({noticeModal:false})
    })
  }

  hideGuildModal = () => {
    this.setState({
      isGuidelineVisible: false
    })
  }
  /**
   * 作者：卢美娟
   * 功能：申请权限查询功能
   */




  render(){
    let {loading,query,list,modalVisible,userState,notice,searchTimeRes,meetroomTypeRes,titleTimeRes,equipment,basicEquimpent,datepickerWaring,errorDescription,vipList} = this.props
    this.columns = this.createCol22(titleTimeRes);
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var time = year+"-"+month+"-"+day;
    var moring = {};
    var afternoon = {};
    var night = {};
    var k1 = 1;
    var k2 = 1;
    var k3 = 1;
    for(let i = 0; i < searchTimeRes.length; i++){
      let timeRes = searchTimeRes[i];
      let stime = timeRes.start_time;
      let mintime = timeRes.min_time;
      var d1 = new Date(time + " " + timeRes.start_time);
      var d2 = new Date(time + " "  + timeRes.end_time);
      let count = (d2.getTime() - d1.getTime())/(1000*60*mintime)
      for(let i = 0; i < count; i++){
        d1 = new Date(new Date(time + " " + stime).getTime() + i * mintime * 60 * 1000);
        let h1 = d1.getHours()<10?'0'+d1.getHours():d1.getHours();
        let m1 = d1.getMinutes()<10?'0'+d1.getMinutes():d1.getMinutes();
        d2 = new Date(new Date(time + " " + stime).getTime() + (i+1) * mintime * 60 * 1000);
        let h2 = d2.getHours()<10?'0'+d2.getHours():d2.getHours();
        let m2 = d2.getMinutes()<10?'0'+d2.getMinutes():d2.getMinutes();
        if(h2 <= 12){
          moring['t' + k1] = h1 + ":" + m1 + '-' + h2 + ":" + m2;
          k1++;
        }
        else if(h2 > 12 && h2 <= 18){
          afternoon['t' + k2] = h1 + ":" + m1 + '-' + h2 + ":" + m2;
          k2++;
        }
        else if(h2 > 18){
          night['t' + k3] = h1 + ":" + m1 + '-' + h2 + ":" + m2;
          k3++;
        }
      }
    }

    let {noticeModal}=this.state
    if(list.length){
      list.map((i,index)=>{
        i.key=index;
      })
    }

    var listMenu = () => {
      var res = [];
      for(var i = 0; i < meetroomTypeRes.length; i++){
        if(Cookie.get('dept_id') == 'e65c07d7179e11e6880d008cfa0427c4' || Cookie.get('staff_id') == '0864957' ){
          res.push(
            <Menu.Item key={meetroomTypeRes[i].type_id+','+i}>
              <svg className={styles.icon} aria-hidden="true">
                <use xlinkHref="#icon-xiaoxinghuiyishiai"></use>
              </svg>
              {meetroomTypeRes[i].type_name}
            </Menu.Item>
          )
        }
        else{
            if(meetroomTypeRes[i].type_name != "专用会议室"){
              res.push(
                <Menu.Item key={meetroomTypeRes[i].type_id+','+i}>
                  <svg className={styles.icon} aria-hidden="true">
                    <use xlinkHref="#icon-xiaoxinghuiyishiai"></use>
                  </svg>
                  {meetroomTypeRes[i].type_name}
                </Menu.Item>
              )
            }
          }
        }
      return res
    }

    if(this.props.isErrorPage1 == '1'){
      return(
        <Error1/>
      )
    }
    else if(this.props.isErrorPage2 == '1'){
      return(
        <Error2/>
      )
    }
    else if(this.props.isErrorPage3 == '1'){
      return(
        <Error3/>
      )
    }
    else if(this.props.isErrorPage5 == '1'){
      return(
        <Error5/>
      )
    }
    else{
      return(
        <div className={styles.meetWrap}>
          <div style={{paddingBottom:'20px'}}>
            <div style = {{float:'left'}}> 会议日期：<DatePicker style={{verticalAlign:'middle'}}
            disabledDate={Cookie.get('dept_id') == 'e65c07d7179e11e6880d008cfa0427c4'?false:this.disabledDate} allowClear={false}
             value={moment(query.arg_weekday, dateFormat)} onChange={(date, dateString)=>this.room_idHandler(date, dateString)}/>
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div style = {{color:'#ef5555',marginLeft: 340,marginTop:-5}}>
              温馨提示：晚上无会服人员及视频系统支撑人员服务
            </div>
          </div>

          <Tabs defaultActiveKey="1" onTabClick={(item)=>this.room_timeHandler(item)}>

          <TabPane tab="凌晨" key="0">
             <Menu
               selectedKeys={[this.state.current]}
               mode="horizontal"
               style={{marginBottom:'20px'}}
               onClick={this.room_typeHandler4}
               className={styles.menu}
             >
             {listMenu()}

             </Menu>
             <Table
               columns={this.columns}
               dataSource={list}
               bordered
               pagination={false}
               loading={loading}
               className={styles.otable}
               />
           </TabPane>

           <TabPane tab="上午" key="1">
             <Menu
               selectedKeys={[this.state.current]}
               mode="horizontal"
               style={{marginBottom:'20px'}}
               onClick={this.room_typeHandler}
               className={styles.menu}
             >
             {listMenu()}

             </Menu>
             <Table
               columns={this.columns}
               dataSource={list}
               bordered
               pagination={false}
               loading={loading}
               className={styles.otable}
               />
           </TabPane>

           <TabPane tab="下午" key="2">
              <Menu
               selectedKeys={[this.state.current]}
                mode="horizontal"
                style={{marginBottom:'20px'}}
                onClick={this.room_typeHandler2}
                className={styles.menu}
              >
              {listMenu()}

              </Menu>
              <Table
                columns={this.columns}
                dataSource={list}
                bordered
                pagination={false}
                loading={loading}
                className={styles.otable}
                />
            </TabPane>


            <TabPane tab="晚上" key="3">
            <Menu
              selectedKeys={[this.state.current]}
              mode="horizontal"
              style={{marginBottom:'20px'}}
              onClick={this.room_typeHandler3}
              className={styles.menu}
            >
            {listMenu()}

            </Menu>
            <Table
              columns={this.columns}
              dataSource={list}
              bordered
              pagination={false}
              loading={loading}
              className={styles.otable}
              />
          </TabPane>
         </Tabs>


          <NewOrder
            loading={loading}
            ref='mod'
            onSubmit={this.orderSubmit}
            visible={modalVisible}
            orderCancel={this.orderCancel}
            orderUpdate={this.orderUpdate}
            userState={userState}
            titleTimeRes = {titleTimeRes}
            dispatch = {this.dispatch}
            equipment = {equipment}  //将设备情况传递到组件NewOrder
            basicEquimpent = {basicEquimpent} //将设备基础情况传给组件NewOrder
            datepickerWaring={datepickerWaring}
            errorDescription={errorDescription}
            vipList = {vipList}
          />
          {query.arg_typeFlag==='1'
            ?<div>
              <h4 style={{paddingTop:'20px'}}>操作指引：</h4>
              {notice?<p className={styles.notice} dangerouslySetInnerHTML={{__html:notice.replace(/\n/g,'<br/>')}}></p>:null}

            </div>
            :null
          }
          {(query.arg_typeFlag==='1' && Cookie.get('dept_id') == 'e65c07d7179e11e6880d008cfa0427c4')
            ?<div>
              <Button type="primary" onClick={()=>this.setState({noticeModal:true})}>编辑指引</Button>
              <Modal  width='930px' height = '600px' title="编辑"  visible={noticeModal} onOk={this.noticeEdit} onCancel={()=>this.setState({noticeModal:false})}>
                <TextArea ref={e=>this.notiveCont=e} rows={25} defaultValue={notice}/>
              </Modal>
            </div>
            :null
          }

          <GuildlineModal  visible={this.state.isGuidelineVisible} confirmClick = {this.hideGuildModal}/>

        </div>

      )
    }

  }
}


function mapStateToProps(state) {
  const { list, query,modalVisible,userState,notice,searchTimeRes,meetroomTypeRes,sxwTimeRes,titleTimeRes,meetTypeRes,period_time,isErrorPage1,isErrorPage2,isErrorPage3,isErrorPage5,equipment,basicEquimpent,datepickerWaring,errorDescription,vipList } = state.meet;
  return {
    loading: state.loading.models.meet,
    list,
    query,
    modalVisible,
    userState,
    notice,
    searchTimeRes,
    meetroomTypeRes,
    sxwTimeRes,
    titleTimeRes,
    meetTypeRes,
    period_time,
    isErrorPage1,
    isErrorPage2,
    isErrorPage3,
    isErrorPage5,
    equipment,
    basicEquimpent,
    errorDescription,
    datepickerWaring,
    vipList
  };
}
export default connect(mapStateToProps)(RoomOrder);
