/**
 * 作者：张枫
 * 创建日期：2019-07-04
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：议题统计
 */
 import React from 'react';
 import { connect }  from 'dva';
 import styles from './meetingStyle.less';
 import { Table,Select,Button,Spin,Pagination,DatePicker,Input,Row,Col,message,TreeSelect} from 'antd';
 import  {exportExlTopic} from './exportExlTopicSta.js'
 import moment from 'moment';
 const { MonthPicker } = DatePicker ;
 const { Option } = Select;
 const dateFormat = 'YYYY-MM';
 class TopicStatistics extends React.PureComponent{
   constructor(props) {super(props);}
   state = {
     BeginData : "",
   };
   columns = [
     {
       title : '序号',
       dataIndex : 'key',
       key : '',
       width : "4%",
       render :( index )=>{
         return (
           <div>{ index+1 }</div>
         )
       }
     },{
       title : '会议',
       dataIndex : 'note_name',
       key : '',
       render :( text )=>{
         return (
           <div>{ text }</div>
         )
       }
     },{
       title : '时间',
       dataIndex : 'time',
       key : '',
       render :( text )=>{
         return (
           <div>{ text }</div>
         )
       }
     },{
       title : '议题名称',
       dataIndex : 'topic_name',
       key : '',
       render :( text )=>{
         return (
           <div>{ text }</div>
         )
       }
     },{
       title : '申请单位',
       dataIndex : 'dept_name',
       key : '',
       render :( text )=>{
         return (
           <div>{ text }</div>
         )
       }
     },{
       title : '会议类型',
       dataIndex : 'type_name',
       key : '',
       render :( text )=>{
         return (
           <div>{ text }</div>
         )
       }
     },{
       title : '是否为三重一大',
       dataIndex : 'topic_if_important',
       key : '',
       render :( text )=>{
         return (
           <div>{ text }</div>
         )
       }
     },{
       title : '归档材料',
       dataIndex : 'topic_file_state_desc',
       key : '',
       render :( text )=>{
         return (
           <div>{ text }</div>
         )
       }
     }
   ];
   //修改开始时间
   changeBeginTime =( date,dateString )=>{
     const { dispatch } = this.props;
     this.setState({
       BeginData:dateString,
     });
     dispatch ({
       type : 'topicStatistics/changeBeginTime',
       dateString : dateString,
     });
     dispatch({type : 'topicStatistics/initPage',})

   };
   disabledMonth = ( current)=>{
     return current.valueOf() <moment(this.state.BeginData,dateFormat);

    // return current && current.valueOf() > moment().endOf('day');;
   };
   // 修改结束时间
   changeEndTime = ( date ,dateString )=>{
     const { dispatch } = this.props;
     dispatch ({
       type : 'topicStatistics/changeEndTime',
       dateString : dateString,
     });
     dispatch({type : 'topicStatistics/initPage',})
   };
   // 切换选择的会议类型
   changeType = (value )=>{
     const { dispatch } = this.props;
     dispatch ({
       type : 'topicStatistics/changeType',
       value : value,
     });
     dispatch({type : 'topicStatistics/initPage',})
   };
   // 改变输入框内容  议题标题
   changeInput = ( e )=>{
     const { dispatch } = this.props;
     dispatch ({
       type : 'topicStatistics/changeInput',
       value : e.target.value,
     });
     dispatch({type : 'topicStatistics/initPage',})
   };
   // 清空查询
   clearQuery = ()=>{
     const { dispatch } = this.props;
     dispatch ({
       type : 'topicStatistics/chearQuery',
     });
     dispatch ({
       type : 'topicStatistics/queryAllTopic',
     })
   };
   // 改变是否三重一大
   changeImportant =(value)=>{
     const { dispatch } = this.props;
     dispatch ({
       type : 'topicStatistics/changeImportant',
       value : value,
     });
     dispatch({type : 'topicStatistics/initPage',})
   };
   // 改变是否归档状态
   changeState =( value )=>{
     const { dispatch } = this.props;
     dispatch ({
       type : 'topicStatistics/changeState',
       value : value,
     });
     dispatch({type : 'topicStatistics/initPage',})
   };
   // 下载
   download = () =>{
     const list= this.props.topicAllList;
     // console.log(111,list);
     let header=["序号","会议","时间","议题名称","申请单位","列席部门","会议类型","是否为三重一大","归档材料"];
     let headerKey=["i","note_name","time","topic_name","dept_name","other_dept_name","type_name","topic_if_important","topic_file_state_desc"];
     if(list !== null && list.length !== 0){
       exportExlTopic(list,'议题统计',header,headerKey,1);
     }else{
       message.info("查询结果无数据，无法导出！")
     }
   };
   // 修改页码
   changePage = ( page )=>{
     const { dispatch } = this.props;
     dispatch({
        type : 'topicStatistics/changePage',
        page : page,
     })
   };
   //选择汇报部门
   changeReportDept = ( value,label,extra)=>{
     const { dispatch } = this.props;
     dispatch ({
       type : 'topicStatistics/changeReportDept',
       value :value,
       label:label,
     })
   };
   //查询议题统计列表
   queryList =()=>{
     const { dispatch } = this.props;
     dispatch ({
       type : 'topicStatistics/queryTopic',
     });
     dispatch ({
       type : 'topicStatistics/queryAllTopic',
     })
   };
   //三重一大总数据导出
   dataExport =()=>{
     const { dispatch } = this.props;
     dispatch ({
       type : 'topicStatistics/dataExport',
     })
   };
   render(){
     const { topicList,typeList,Param ,imporList,stateList,page,pageSize,rowCounts,deptList} = this.props;
     const showStartTime = Param.start_year + '-' + Param.start_month;
     const showEndTime = Param.end_year + '-' + Param.end_month;
     return(
       <div style={{padding:'13px 15px 16px 15px',background:'white'}}>
          <p style={{textAlign:'center',fontSize:'20px',marginBottom:'10px'}}>议题统计</p>
          <div>
            <Row>
            <Col span = {2}><span>会议时间:</span></Col>
            <Col span = {6}>
              <MonthPicker
                placeholder = '开始年月'
                format = 'YYYY-MM'
                onChange = { this.changeBeginTime}
                style = {{ width : '100px'}}
                value = {showStartTime !== '-'?moment(showStartTime):null}
              >
              </MonthPicker>
              <span>~</span>
              <MonthPicker
                placeholder = '结束年月'
                format = 'YYYY-MM'
                disabledDate = { this.disabledMonth }
                onChange = { this.changeEndTime }
                style = {{ width : '100px'}}
                value = {showEndTime !== '-'?moment(showEndTime):null}
              >
              </MonthPicker>
            </Col>
            <Col span = {2}><span>会议类型:</span></Col>
            <Col span = {6}>
              <Select
                defaultValue = "全部"
                value = { Param.topic_type_id }
                onChange = { (value)=>this.changeType(value) }
                style = {{ width : '250px'}}
              >
                {
                  typeList.length && typeList.map(( item,index)=>{
                    return (
                      <Option key = {item.type_id} value = {item.type_id}>
                      { item.type_name }
                      </Option>
                    )
                  })
                }
              </Select>
            </Col>
            <Col span = {2}><span>是否为三重一大:</span></Col>
            <Col span = {6}>
              <Select
                style = {{ width : '100px'}}
                onChange = { (value)=>this.changeImportant(value)}
                value = { Param.topic_if_important === '' ? '全部' : (Param.topic_if_important === '1'?"是":"否")}
              >
                {
                  imporList.length && imporList.map((item,index)=>{
                    return (
                      <Option key = {item.key} value = { item.key}>
                        { item.name }
                      </Option>
                    )
                  })
                }
              </Select>
            </Col>
            </Row>
            <Row style ={{marginTop:'5px'}}>
              <Col span = {2}><span>议题名称:</span></Col>
              <Col span = {6}>
                <Input
                  value = { Param.topic_name }
                  onChange = { (e)=>this.changeInput(e)}
                  style = {{ width :'210px'}}
                  maxLength = {"35"}
                >
                </Input>
              </Col>
              <Col span = {2}>
                <span>汇报部门：</span>
              </Col>
              <Col span = {6}>
                {
                  this.props.deptList.length ?
                  <TreeSelect
                    //defaultValue = "全部"
                    style = {{ width : '250px'}}
                    value = { Param.topic_dept_name }
                    treeData = { deptList }
                  //  treeDefaultExpandAll
                    onChange = { this.changeReportDept}
                  >
                  </TreeSelect>
                  :
                  <TreeSelect
                    treeData = { [] }
                    style = {{ width : '250px'}}
                  >
                  </TreeSelect>

                }
              </Col>
              <Col span = {2}>  <span>是否归档：</span></Col>
              <Col span = {6}>
                <Select
                  style ={{width:'100px'}}
                  onChange = { (value)=>this.changeState(value)}
                  value = { Param.topic_file_state === '' ? '全部' : (Param.topic_file_state === '1'?"是":"否")}
                >
                  {
                    stateList.length && stateList.map((item,index)=>{
                      return (<Option key = {item.key} value = {item.key}>{item.name}</Option>)
                    })
                  }
                </Select>
              </Col>
            </Row>
          </div>
          <div style = {{textAlign:'right',marginBottom:'10px',marginTop:'10px'}}>
            <Button type = 'primary'  onClick = { this.dataExport }> 三重一大总数据导出</Button>
          </div>
          <div style = {{textAlign:'right',marginBottom:'10px',marginTop:'10px'}}>
            <Button type ="primary" onClick = { this.queryList } style = {{marginRight:'10px'}}>查询</Button>
            <Button onClick = { this.clearQuery } type = 'primary' style = {{marginRight:'10px'}}> 清空</Button>
            <Button type = 'primary'  onClick = { this.download }> 导出</Button>
          </div>
          <div>
            <Table
              columns = { this.columns }
              dataSource = { topicList }
              pagination={false}
              bordered={true}
              className={ styles.tableStyle }
            >
            </Table>
            <Pagination
              pageSize = { pageSize }
              onChange = {(page)=>this.changePage(page) }
              total = { Number(rowCounts) }
              current = { Number(page) }
              style = {{textAlign:'center',marginTop:'15px'}}
            >
            </Pagination>
          </div>
       </div>
     )
   }
 }

 function mapStateToProps(state) {
     return {
         loading:state.loading.models.topicStatistics,
         ...state.topicStatistics
     }
 }
 export default connect(mapStateToProps)(TopicStatistics);
