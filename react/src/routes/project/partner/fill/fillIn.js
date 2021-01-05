/**
 * 作者：张枫
 * 日期：2019-01-13
 * 邮箱：zhangf142@chinaunicom.cn
 * 说明：合作伙伴-信息填报保存提交
**/
import React from 'react';
import {connect} from 'dva';
import {Tabs,Button,Card,Col,Row,Modal,InputNumber,Checkbox,DatePicker,Table,Tooltip  } from 'antd';
import WorkloadServiceModal from './workloadModal.js'
import workLoadServiceTable from '../submitPreviewModal.js'
import styles from '../partner.less';
import moment from 'moment';
const TabPane = Tabs.TabPane;
const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
class InfoFill extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    paramState :[],
  }
  // 提交预览表格
  columns=[{
    title:'年月',
    dataIndex:'year_month',
    width:'70',
    fixed:'left',
    render: (text) => {
      return <p>{text}</p>
    }
  },{
    title:'项目名称',
    width:'180',
    fixed:'left',
    dataIndex:'proj_name',
    render: (text) => {
      return <p>{text}</p>
    }
  },{
    title:'合作伙伴',
    width:'75',
    fixed:'left',
    dataIndex:'partner_name',
    render: (text) => {
      return <p>{text}</p>
    }
  },{
    title:'高级工作量',
    children:[{
      title:'标准',
      dataIndex:'month_work_cnt_h',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'额外',
      dataIndex:'other_month_work_cnt_h',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'合计',
      dataIndex:'workload_sum_h',
      render: (text) => {
        return <p>{text}</p>
      }
    }],
  },{
    title:'中级工作量',
    children:[{
      title:'标准',
      dataIndex:'month_work_cnt_m',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'额外',
      dataIndex:'other_month_work_cnt_m',
      key:'',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'合计',
      dataIndex:'workload_sum_m',
      key:'',
      render: (text) => {
        return <p>{text}</p>
      }
    }],
  },{
    title:'初级工作量',
    children:[{
      title:'标准',
      dataIndex:'month_work_cnt_l',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'额外',
      dataIndex:'other_month_work_cnt_l',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'合计',
      dataIndex:'workload_sum_l',
      render: (text) => {
        return <p>{text}</p>
      }
    }],
  },{
    title:'资源稳定性',
    dataIndex:'stability_score',
    render: (text) => {
      return <p>{text}</p>
    }
  },{
    title:'资源覆盖率',
    dataIndex:'attend_score',
    render: (text) => {
      return <p>{text}</p>
    }
  },{
    title:'交付及时率',
    dataIndex:'delivery_score',
    render: (text) => {
      return <p>{text}</p>
    }
  },{
    title:'交付质量',
    dataIndex:'quality_score',
    render: (text) => {
      return <p>{text}</p>
    }
  },{
    title:'管理规范性',
    dataIndex:'manage_score',
    render: (text) => {
      return <p>{text}</p>
    }
  },{
    title:'资源投入率',
    dataIndex:'invest_score',
    render: (text) => {
      return <p>{text}</p>
    }
  },{
    title:'服务评价',
    dataIndex:'service_sum',
    render: (text) => {
      return <p>{text}</p>
    }
  }];
  /**
   * 作者：张枫
   * 日期：2019-02-20
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：工作量填报服务评价模态框控制展示
   **/
  showWorkloadServiceModal = (partner_name, partner_id, visible,saveProjList)=> {

      this.props.dispatch({
        type: 'infoFill/showWorkloadServiceModal',
        partner_name: partner_name,
        partner_id: partner_id,
        partner_param:saveProjList,
      });
  }
  /**
   * 作者：张枫
   * 日期：2019-02-20
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：勾选合作伙伴
   **/
  selectPartner = (e, partnerName,partnerId)=> {

    this.props.dispatch({
      type: 'infoFill/selectPartner',
      partnerName: partnerName,
      partnerId : partnerId,
      value: e.target.checked,
    });
  }
  //时间组件函数
  selectDateTime = (date, dateString)=> {
    this.props.dispatch({
      type: 'infoFill/selectYearMonth',
      dateTime: dateString,
    });
  }
  //切换tab标题
  changeTabs = (key)=> {
    this.props.dispatch({
      type: 'infoFill/changeTabs',
      proj_code: key,
    });
  }
  disabledMonth = (current, time)=> {
    //判断如果返回的时间为空，则展示全部时间
    if (JSON.parse(time).length == 0) {
      return current && current > moment().endOf('day');
    }
      else {
        //如果返回的时间不为空，则不展示返回的已经填报的时间日期
        let yearMonthList = [];
        time = JSON.parse(time);//注意呦，后期learn    //拼接’‘2019-01’格式的日期
        time.map((item)=> {
          if (item.total_month != '10' || item.total_month != '11' || item.total_month != '12') {
            yearMonthList.push(item.total_year + '-' + '0' + item.total_month);
          } else {
            yearMonthList.push(item.total_year + '-' + item.total_month);
          }
        })
        let temp;
        for (let i = 0; i < yearMonthList.length; i++) {
          if (moment().format(yearMonthList[i]) == current.format('YYYY-MM').valueOf()) {
            temp = true;
          }
          if(current && current > moment().endOf('day')){
            temp = true;
          }
        }
        return temp;
      }
    /*
    //判断如果返回的时间为空，则展示全部时间
    if (time == '') {
      return false;
    } else {
      //如果返回的时间不为空，则不展示返回的已经填报的时间日期
      let yearMonthList = [];
      time = JSON.parse(time);//注意呦，后期learn    //拼接’‘2019-01’格式的日期
      time.map((item)=> {
        if (item.total_month != '10' || item.total_month != '11' || item.total_month != '12') {
          yearMonthList.push(item.total_year + '-' + '0' + item.total_month);
        } else {
          yearMonthList.push(item.total_year + '-' + item.total_month);
        }
      })
      let temp;
      for (let i = 0; i < yearMonthList.length; i++) {
        if (moment().format(yearMonthList[i]) == current.format('YYYY-MM').valueOf()) {
          temp = true;
        }
      }
      return temp;
    }
    */
  }
  //提交合作伙伴
  isPreviewSubmitModalVisible = ()=> {
    this.props.dispatch({
      type: 'infoFill/isPreviewSubmitModalVisible',
    });
  }
  submitWorkloadService=()=>{
    this.props.dispatch({
      type: 'infoFill/submitWorkloadService',
    });
  }
  cancelPreviewSubmitModalVisible=()=>{
    this.props.dispatch({
      type: 'infoFill/cancelPreviewSubmitModalVisible',
    });
  }
  /**
   * 作者：张枫
   * 日期：2019-02-20
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：删除卡片
   **/
  deleteCard = ()=>{
    this.props.dispatch({
      type: 'infoFill/deleteCard',
    });
  }
  /**
   * 作者：张枫
   * 日期：2019-02-20
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：取消删除卡片
   **/
  cancelDeleteCard = ()=>{
    this.props.dispatch({
      type: 'infoFill/cancelDeleteCard',
    });
  }
  /**
   * 作者：张枫
   * 日期：2019-02-20
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：保存模态框数据
   **/
  saveWorkloadService = () => {
    this.refs.ceshi.validateFields((err, values) => {
      if(err){
        return;
      }else {
        this.props.dispatch({
          type: 'infoFill/setSave',
          values: values,
        });
      }
      this.props.dispatch({
        type:'infoFill/cancelWorkloadServiceModal',
      });
    });
  };

  /**
   * 作者：张枫
   * 日期：2019-02-20
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：关闭模态框
   **/
  cancelWorkloadServiceModal=()=>{
    this.props.dispatch({
      type:'infoFill/cancelWorkloadServiceModal',
    });
  }

  render() {
    const { partnerList,saveProjList,saveProjList2} = this.props;
    const datas = Number(this.props.defaultDate.slice(5))
    //以下部分为最新修改
    let partner_card_list = []; // 空合作伙伴卡片
    //合作伙伴列表  将数据添加至数组
    let partner_list = [];
    for (let i = 0; i < partnerList.length; i++) {
      partner_list.push(
        <span>
          <Checkbox
            //disabled = {this.props.isCheckboxDisabled}
            disabled = {"disabled" in partnerList[i] ? partnerList[i].disabled : true}
            checked={partnerList[i].visible}
            onChange={(e)=>this.selectPartner(e,partnerList[i].partner_name,partnerList[i].partner_id)}>{partnerList[i].partner_name}
          </Checkbox>
          </span>
      );
      //saveProjList  保存的合作伙伴数据 partnerList 总体合作伙伴列表
      if (partnerList[i].visible == true)
      {
        if (saveProjList.length != 0) // 有保存数据，名称一致展示数据  不一致展示空卡片
        {
          let findPartner = false;
          for (let j = 0; j < saveProjList.length; j++)
          {// 卡片 数据类型 state 2为保存数据  state 3 为退回数据
           // saveProjList[j].state == 2 ? (this.state.paramState[j]="草稿"):(saveProjList[j].state == 4?(this.state.paramState[j]="退回"):(this.state.paramState[j]="已提交"))
            if(saveProjList[j].state == 2){this.state.paramState[j]="草稿"}
            else if(saveProjList[j].state == 3){this.state.paramState[j]="已提交"}
            else if(saveProjList[j].state == 4){this.state.paramState[j]="退回"}
            else if (saveProjList[j].state == 0){this.state.paramState[j]="已审核"}
            const work_load = JSON.parse(saveProjList[j].work_load); // 处理工作量填报的数据格式  展示备用
            if(saveProjList[j].partner_name == partnerList[i].partner_name)
            {
              if( partnerList[i].disabled == true)
              {
                partner_card_list.push(
                  // 如果判断为  合作伙伴数据不展示  则卡片数据也不展示
                );
                findPartner = true;
              }
              else
              {
                partner_card_list.push(
                  <div style={{display:'inline-block',marginLeft:30,marginTop:30,width:420,height:250,verticalAlign:"top"}}>
                    <Card
                      title={partnerList[i].partner_name+"("+this.state.paramState[j]+")"}
                      className={styles.card}
                      extra={
                      <a onClick={()=>this.showWorkloadServiceModal(partnerList[i].partner_name,partnerList[i].partner_id,'visible',saveProjList[j])}>工作量填报及服务评价</a>
                      }
                    >
                      <div style={{float:'left',width:'68%',overflow:'hidden'}}>
                        <p style={{padding:10}}>工作量（单位：人月)</p>
                        <p style={{padding:10}}>
                          高级：
                        <span style={{fontSize:"8px",fontFamily:"黑体"}}>
                        {
                          work_load.map((item)=> {
                            if (item.level_id == 'A') {
                              return item.workload_sum;
                            }
                          })
                        }
                          <span style={{mariginLeft:'4px'}}> 标准：</span>
                          {
                            work_load.map((item)=> {
                              if (item.level_id == 'A') {
                                return item.month_work_cnt;
                              }
                            })
                          }
                          <span style={{mariginLeft:'4px'}}> 额外：</span>
                          {
                            work_load.map((item)=> {
                              if (item.level_id == 'A') {
                                return item.other_month_work_cnt;
                              }
                            })
                          }
                       </span>
                        </p>
                        <p style={{padding:10}}>

                          中级：
                        <span style={{fontSize:"8px",fontFamily:"黑体"}}>
                        {
                          work_load.map((item)=> {
                            if (item.level_id == 'B') {
                              return item.workload_sum;
                            }
                          })
                        }
                          <span style={{mariginLeft:'4px'}}> 标准：</span>
                          {
                            work_load.map((item)=> {
                              if (item.level_id == 'B') {
                                return item.month_work_cnt;
                              }
                            })
                          }
                          <span style={{mariginLeft:'4px'}}> 额外：</span>
                          {
                            work_load.map((item)=> {
                              if (item.level_id == 'B') {
                                return item.other_month_work_cnt;
                              }
                            })
                          }
                        </span>
                        </p>
                        <p style={{padding:10}}>
                          初级：
                        <span style={{fontSize:"8px",fontFamily:"黑体"}}>
                        {

                          work_load.map((item)=> {
                            if (item.level_id == 'C') {
                              return item.workload_sum;
                            }
                          })
                        }
                          <span style={{mariginLeft:'4px'}}> 标准：</span>
                          {
                            work_load.map((item)=> {
                              if (item.level_id == 'C') {
                                return item.month_work_cnt;
                              }
                            })
                          }
                          <span style={{mariginLeft:'4px'}}> 额外：</span>
                          {
                            work_load.map((item)=> {
                              if (item.level_id == 'C') {
                                return item.other_month_work_cnt;
                              }
                            })
                          }
                        </span>
                        </p>
                      </div>
                      {
                        datas <= 6?
                      <div style={{marginLeft:180}}>
                        <p style={{padding:10}}>服务评价分数</p>
                        <div style={{padding:10,fontSize:'35px'}}>
                          {saveProjList[j].service_sum}
                          <Tooltip
                            title = {
                          <div>
                           <p>团队能力表现{saveProjList[j].stability_score}</p>
                           <p>出勤率{saveProjList[j].attend_score}</p>
                           <p>交付及时率{saveProjList[j].delivery_score}</p>
                           <p>交付质量{saveProjList[j].quality_score}</p>
                           <p>内部管理能力{saveProjList[j].manage_score}</p>
                          </div>
                          }
                          >
                            <span style={{mariginLeft:"5px",color: '#FA7252',fontSize:'12px'}}>详情</span>
                          </Tooltip>
                        </div>
                      </div>
                      :
                      <div style={{marginLeft:180}}>
                        <p style={{padding:10}}>服务评价分数</p>
                        <div style={{padding:10,fontSize:'35px'}}>
                          {saveProjList[j].service_sum}
                          <Tooltip
                            title = {
                          <div>
                           <p>资源投入率{saveProjList[j].invest_score}</p>
                           <p>资源稳定性{saveProjList[j].stability_score}</p>
                           <p>资源覆盖率{saveProjList[j].attend_score}</p>
                           <p>交付及时率{saveProjList[j].delivery_score}</p>
                           <p>交付质量{saveProjList[j].quality_score}</p>
                           <p>管理规范性{saveProjList[j].manage_score}</p>
                          </div>
                          }
                          >
                            <span style={{mariginLeft:"5px",color: '#FA7252',fontSize:'12px'}}>详情</span>
                          </Tooltip>
                        </div>
                      </div>
              }
                    </Card>
                  </div>
                );
                findPartner = true;
              }
            }
          }
          if (findPartner === false)
          {
            partner_card_list.push(
              <div style={{display:'inline-block',marginLeft:30,marginTop:30,width:420,height:250,verticalAlign:"top"}}>
                <Card
                  title={partnerList[i].partner_name}
                  className={styles.card}

                  extra={<a onClick={()=>this.showWorkloadServiceModal(partnerList[i].partner_name,partnerList[i].partner_id,'visible',"")}>工作量填报及服务评价</a>}
                >
                  <div style={{float:'left',width:'68%',overflow:'hidden'}}>
                    <p style={{padding:10}}>工作量（单位：人月)</p>
                    <p style={{padding:10}}>高级：<span style={{color:"#FF6600"}}>未填报</span></p>
                    <p style={{padding:10}}>中级：<span style={{color:"#FF6600"}}>未填报</span></p>
                    <p style={{padding:10}}>初级：<span style={{color:"#FF6600"}}>未填报</span></p>
                  </div>
                  <div style={{marginLeft:"200px"}}>
                    <p style={{padding:10}}>服务评价分数</p>
                    <div style={{padding:10,color:"#FF6600",fontSize:'25px'}}>
                      {"未评价"}
                    </div>
                  </div>
                </Card>
              </div>
            );
          }
        }
        else  // 没有保存数据  勾选直接展示空卡片
        {
          partner_card_list.push(
            <div style={{display:'inline-block',marginLeft:30,marginTop:30,width:420,height:250,verticalAlign:"top"}}>
              <Card
                title={partnerList[i].partner_name}
                className={styles.card}

                extra={<a onClick={()=>this.showWorkloadServiceModal(partnerList[i].partner_name,partnerList[i].partner_id,'visible',"")}>工作量填报及服务评价</a>}
              >
                <div style={{float:'left',width:'68%',overflow:'hidden'}}>
                  <p style={{padding:10}}>工作量（单位：人月)</p>
                  <p style={{padding:10}}>高级：<span style={{color:"#FF6600"}}>未填报</span></p>
                  <p style={{padding:10}}>中级：<span style={{color:"#FF6600"}}>未填报</span></p>
                  <p style={{padding:10}}>初级：<span style={{color:"#FF6600"}}>未填报</span></p>
                </div>
                <div style={{marginLeft:"200px"}}>
                  <p style={{padding:10}}>服务评价分数</p>
                  <div style={{padding:10,color:"#FF6600",fontSize:'25px'}}>
                    {"未评价"}
                  </div>
                </div>
              </Card>
            </div>
          );
        }
      }
    }
    const projList = this.props.projList.map((item)=> {
      //  <div style ={{marginTop:"48px",marginLeft:"150px",width:'2px',height:'100px',backgroundColor:'#CCCCCC'}}></div>   竖线
      return (
        <TabPane tab={item.proj_name} key={item.proj_code}>
          <div>
            <div>
              <span>{'日期：'}</span>
              <MonthPicker
                format={this.monthFormat }
                value = {this.props.defaultDate === '' ? null : moment(this.props.defaultDate)}
                onChange={this.selectDateTime}
                disabledDate={(current)=>this.disabledMonth(current,item.filled_time)}
              >
              </MonthPicker>
            </div>

            <div style={{marginTop:'20px'}}>{'合作伙伴：'}
              {partner_list}
                  <div
                    style={{display:'inline-block',color: '#FA7252'}}
                  >
                    {'温馨提示：取消勾选可删除数据！'}
                  </div>


            </div>
            <div>
              {partner_card_list}
            </div>
          </div>
        </TabPane>
      )
    });
    return (
      <div className={styles.container}>
        <Tabs onChange={(key)=>this.changeTabs(key)} style={{ margin: '0 10px'}}>
          {projList}
        </Tabs>

        <Modal
          title={this.props.partner_name_modal}
          key = {this.props.workloadModalKey}
          visible = {this.props.isWorkloadServiceVisible}
          onOk = {this.saveWorkloadService}
          onCancel = {this.cancelWorkloadServiceModal}
          okText = {"保存"}
          width = {"800px"}
        >
          {/* 模态框组件 */}
         {
           datas <=6 ?
           < WorkloadServiceModal
           status={'y'}
           param={this.props.partner_param}
           ref = {'ceshi'}
         />:
         < WorkloadServiceModal
           status={'n'}
           param={this.props.partner_param}
           ref = {'ceshi'}
         />
         }
         
        </Modal>
        {
          saveProjList2.length != 0 ?
          <div style={{textAlign:'center',paddingTop:'20px'}}>
            <Button type="primary" onClick={this.isPreviewSubmitModalVisible}>提交</Button>
          </div>
            :
            ""
        }
        <Modal
          title = {"预览"}
          visible={this.props.isPreviewSubmitModalVisible}
          onOk = {this.submitWorkloadService}
          onCancel = {this.cancelPreviewSubmitModalVisible}
          width = '1000px'
        >
          <Table
            columns={this.columns}
            dataSource = {this.props.saveProjList2}
            className = {styles.table}
            bordered = {true}
            scroll = {{x:1600}}
          >
          </Table>
        </Modal>
        <Modal
          title = '确定'
          visible={this.props.isCardVisible}
          onOk = {this.deleteCard}
          onCancel = {this.cancelDeleteCard}
          width = '350px'
        >
          <p>确定删除该合作伙伴数据吗？</p>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state){
  return{
    loading:state.loading.models.infoFill,
    ...state.infoFill
  }
}
export default connect(mapStateToProps)(InfoFill);
