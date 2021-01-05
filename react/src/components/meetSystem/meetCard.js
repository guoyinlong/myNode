/**
 * 作者：石宇菁
 * 日期：2018/01/23
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：会议室卡片组件
 */
import React from 'react'
import { Card, Icon,Row,Col,Tooltip,Modal } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './meetCard.less';
import zhuangshi from '../../assets/meetingSet/zhuangsi.png';
import del from '../../assets/meetingSet/del.png';
import edit from '../../assets/meetingSet/edit.png';
import Style from '../../routes/meetSystem/config/baseConfig.less'
const confirm = Modal.confirm;
class MeetCard extends React.Component{
    constructor(props) {
        super(props);
      }
    //详情页
    toList = (params)=>{
        const query = {
            id: params.id,
            room : params.room,
            need: params.need,
            type : params.type,
            capacity : params.capacity,
            equipment : params.equipment,
            basicequipment: params.basicequipment,
            state : params.state,
            url : params.url,
        };
        const{dispatch}=this.props;
        dispatch(routerRedux.push({
            pathname:'/adminApp/meetSystem/meetroomDetail', query
        }));
    };
    //编辑
    editData = (params)=>{
        // alert(params.basicequipment);
        const query = {
            id: params.id,
            room : params.room,
            need: params.need,
            type : params.type,
            capacity : params.capacity,
            equipment : params.equipment,
            basicequipment: params.basicequipment,
            state : params.state,
            url : params.url,
            flag : 1,
            typeId:params.typeId,
            photo_id:params.photo_id,
        };
        const{dispatch}=this.props;
        dispatch(routerRedux.push({
            pathname:'/adminApp/meetSystem/meeting_setting/meetroomConfig', query
        }));
    };
    //删除
    deleteData = (id) => {
      const{dispatch}=this.props;
      dispatch({
        type:'meetC/deleteMeeting',
        id
      });
    };
  showConfirmDeleteData=(e,id,room)=> {
    e.stopPropagation();
    let thisMe = this;
    confirm({
      title: '确定删除'+room+'会议室吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        thisMe.deleteData(id)
      },
    });
  };
    render(){
        const { id, room, time, type, capacity, equipment, basicequipment, state, need, url, typeId, photo_id } = this.props;
        const detail = { id, room, need, type, capacity, equipment,basicequipment, state,url,typeId,photo_id };
        // const result = (room !== undefined ) ?
        // <Card
        //     title={<div style={{color: '#fa7152',cursor:'pointer'}} onClick={()=>this.toList(detail)} >{room}</div>}
        //     extra={<div className={styles.grayStyle}>更新时间：{time}</div>}
        //     actions={[<div onClick={()=>this.editData(detail)}><Icon type="edit" style={{marginRight: 10}}/>编辑</div>,
        //                 <div onClick={()=>this.deleteData(id)}><Icon type="delete" style={{marginRight: 10}}/>删除</div>]}
        // >
        // <Meta
        //      description={
        //         <div style={{display: 'flex'}}>
        //             <img className={styles.meetingAvata} src={url} />
        //             <div className={styles.meetingText}>
        //                  <div><span>类型：</span><span className={styles.equipmentText} style={{Width: 70}}>{type}</span></div>
        //                  <div><span>容量：</span><span>{capacity}人</span></div>
        //                 {/*<div>*/}
        //                      {/*<span>内置设备：</span>*/}
        //                      {/*<div className={styles.equipmentText} style={{width: 115}}>*/}
        //                          {/*<Tooltip title={equipment} placement="leftTop">{equipment}</Tooltip>*/}
        //                      {/*</div>*/}
        //                  {/*</div>*/}
        //                  <div><span>状态：</span><span>{state === '0'?'可用':'不可用'}</span></div>
        //            </div>
        //         </div>
        //      }
        // />
        // </Card>
        //   :
        // <Card onClick={()=>this.addData()}>
        //     <Meta
        //     description={
        //         <div style={{height: 208}}><img src={plusImg} className={styles.plus}/></div>
        //     }
        //     />
        // </Card>;
        return (
          <div style={{display:'inline-block',marginLeft:30,marginTop:20,width:430,height:235}} className={styles.cardStyle}>
            <div>
              <div style={{float:'left'}}>
                <img src={zhuangshi}/>
                <span style={{cursor:'pointer',fontSize:'18px',marginBottom:10}} className={styles.title}  onClick={()=>this.toList(detail)}>{room}</span>
                </div>
              <div className={styles.grayStyle} style={{float:'right',marginTop:10,marginRight:10}}>更新时间：{time}</div>
            </div>
              <div style={{display: 'flex',marginTop:45,marginLeft:30}}>
                <img className={styles.meetingAvata} src={url} />
                <div className={styles.meetingText}>
                  <div className={styles.typeStyle} style={{marginBottom: 10,marginRight:10}}><span>类型：</span><span className={styles.equipmentText} style={{width: 70}}>{type}</span></div>
                  <div style={{marginBottom: 10,marginRight:10}}><span>容量：</span><span>{capacity}人</span></div>
                  <div style={{marginBottom: 10,marginRight:10}}>
                  <div className={styles.equipmentText}>
                    <Tooltip title={equipment} placement="leftTop">内置设备：{equipment}</Tooltip>
                  </div>
                  </div>
                  <div style={{marginBottom: 10,marginRight:10}}><span>状态：</span><span>{state === '0'?'可用':'不可用'}</span></div>
                </div>
              </div>
              <hr style={{marginTop:15,backgroundColor: '#D4D4D4',height: 1, border:'none'}}/>
              <Row style={{marginTop:15}}>
                <Col offset={5} span={6}><a onClick={()=>this.editData(detail)} style={{cursor:'pointer'}}><img src={edit}/><span className ={Style.textStyle} style={{marginLeft:10}}>编辑</span></a></Col>
                <Col span={1}><div style={{float: 'right',width: 1, height: 20, background: '#D4D4D4'}}></div></Col>
                <Col offset={4} span={6}><a onClick={(e)=>this.showConfirmDeleteData(e,id,room)} style={{cursor:'pointer'}}><img src={del}/><span className ={Style.textStyle} style={{marginLeft:10}}>删除</span></a></Col>
              </Row>
            </div>
        );
    }
}
export default MeetCard;
