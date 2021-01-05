/**
 *  作者: 张楠华
 *  创建日期: 2017-11-28
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：工时管理普通角色界面。
 */
import React from 'react';
import { Button,Modal,Table } from 'antd';
import style from './manHourCard.less';
import { mergeCom } from '../common'
/**
 *  作者: 张楠华
 *  创建日期: 2017-11-28
 *  邮箱：zhangnh6@chinaunicom.cn
 *  功能：工时管理普通角色界面
 */
class ManHourCard extends React.Component{
  constructor(props){
    super(props)
  }
  state={
    visible:false
  };
  timeSheetDetail=(i,date)=>{
    const {flag,dispatch} = this.props;
   dispatch({
     type:'manHourQuery/timeSheetDetail',
     staffid : i.staff_id,
     flag,
     date
   });
    this.setState({
      visible:true
    })
  };
  onCancel=()=>{
    this.setState({
      visible:false
    });
    this.props.dispatch({
      type:'manHourQuery/clearData',
    });
  };
  render(){
    let columns = [
      { title: '活动类型', dataIndex: 'activity_name', key: 'activity_name'},
      { title: '周一', dataIndex: 'mon', key: 'mon'},
      { title: '周二', dataIndex: 'tues', key: 'tues'},
      { title: '周三', dataIndex: 'wed', key: 'wed'},
      { title: '周四', dataIndex: 'thur', key: 'thur'},
      { title: '周五', dataIndex: 'fri', key: 'fri'},
      { title: '周六', dataIndex: 'sat', key: 'sat'},
      { title: '周日', dataIndex: 'sun', key: 'sun'},
      { title: '合计', dataIndex: 'onesum', key: 'onesum'},
    ];
    let columnsOther = [
      { title: '开始时间', dataIndex: 'begin_time', key: 'begin_time'},
      { title: '结束时间', dataIndex: 'end_time', key: 'end_time'},
      { title: '团队/PMS名称', dataIndex: 'proj_show_name', key: 'proj_show_name'},
      { title: '工时', dataIndex: 'whole_hours', key: 'whole_hours'},
      { title: '状态', dataIndex: 'approved_status_show', key: 'approved_status_show'},
    ];
    const {list,detailData,flag }= this.props;
    let detailDataMerge = mergeCom(detailData);
    if(detailData.length!==0){
      detailData.map((i,index)=>{
        detailData.key = index;
      })
    }
    let titleName = flag === '1'?"本周工时详情":flag ==='2'?'本月工时详情':flag==='3'?'本季度工时详情':"工时详情";
    return (
      <div>
        {
          list.length !==0?
            flag ==='1'?
              list.map((i,index)=>{
                return(
                  <div className={style.manHourCard} key={index}>
                    <div>
                      <b>{i.staff_name}</b>
                      <span>（员工编号：<div className={style.staffId}>{i.staff_id}</div>）</span>
                    </div>
                    <div>
                      <span>本周工时：{i.whole_hours}</span>&nbsp;&nbsp;
                      <Button style={{marginLeft:'10px'}} onClick={()=>this.timeSheetDetail(i)}>详情</Button>
                    </div>
                    <div className={style.rightStyle}>{i.show_status.split(' ')[0]}</div>
                  </div>
                )
              })
              :
              flag ==='2'?
                list.map((i,index)=>{
                  return(
                    <div className={style.manHourCard} key={index}>
                      <div>
                        <b>{i.staff_name}</b>
                        <span>（员工编号：<div className={style.staffId}>{i.staff_id}</div>）</span>
                      </div>
                      <div>
                        <span>本月工时：{i.month_total_hours}</span>&nbsp;&nbsp;
                        <Button style={{marginLeft:'10px'}} onClick={()=>this.timeSheetDetail(i)}>详情</Button>
                      </div>
                      <div className={style.rightStyle}>{i.show_status}</div>
                    </div>
                  )
                })
                :
                flag ==='3'?
                  list.map((i,index)=>{
                    return(
                      <div className={style.manHourCard} key={index}>
                        <div>
                          <b>{i.staff_name}</b>
                          <span>（员工编号：<div className={style.staffId}>{i.staff_id}</div>）</span>
                        </div>
                        <div>
                          <span>本季度工时：{i.season_total_hours}</span>&nbsp;&nbsp;
                          <Button style={{marginLeft:'10px'}} onClick={()=>this.timeSheetDetail(i)}>详情</Button>
                        </div>
                        <div className={style.rightStyle}>{i.show_percent}</div>
                      </div>
                    )
                  })
                  :
                  flag ==='4'?
                    list.map((i,index)=>{
                      return(
                        <div className={style.manHourCard} key={index}>
                          <div>
                            <b>{i.staff_name}</b>
                            <span>（员工编号：<div className={style.staffId}>{i.staff_id}</div>）</span>
                          </div>
                          <div>
                            <span>工时总数：{i.userdefined_total_hours}</span>&nbsp;&nbsp;
                            <Button style={{marginLeft:'10px'}} onClick={()=>this.timeSheetDetail(i,this.props.date)}>详情</Button>
                          </div>
                        </div>
                      )
                    })
                    :
                    ''
            :
            []
        }
        <Modal
          title={titleName}
          visible={this.state.visible}
          onCancel={this.onCancel}
          footer={null}
          width={900}
        >
          {
            flag === '1'?
              detailDataMerge.length !==0?
                  detailDataMerge.map((i,index)=>{
                    return(
                      <div key={index}>
                        <div style={{margin:'8px 0',fontSize:'16px'}}>{i.proj_name}</div>
                        <Table dataSource={i.data} columns={columns} pagination={true}/>
                      </div>
                    )
                  })
                :
                <Table columns={columns} pagination={false}/>
              :
              <Table dataSource={detailData} columns={columnsOther} pagination={true}/>
          }
        </Modal>
      </div>
    )
  }
}
export default ManHourCard;
