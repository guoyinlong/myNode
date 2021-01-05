/**
 * 作者：李杰双
 * 日期：2017/10/27
 * 邮件：282810545@qq.com
 * 文件说明：问卷结果统计
 */

import React from 'react'
import { Tabs, Card, Col, Row, Collapse, Table, Modal, Button, Spin, Pagination  } from 'antd';
import { connect } from 'dva';
import exportExl from '../../../components/commonApp/exportExl'
import ReactEcharts from 'echarts-for-react';
import Styles from '../../../components/commonApp/questionnaire.less'
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

function exportFixedTable(wrap,name) {
  let thead=wrap.querySelector('.ant-table-scroll .ant-table-header table thead').cloneNode(true);
  let tbody=wrap.querySelector('.ant-table-scroll .ant-table-body table tbody').cloneNode(true);
  let tds=tbody.querySelectorAll('td.textNumber');
  tds.forEach((i,index)=>{
    let ot=tds[index].outerHTML
    tds[index].outerHTML=ot.replace(/td/, "td style='vnd.ms-excel.numberformat:@'")

  })
  let expTable=document.createElement('table');
  expTable.appendChild(thead);
  expTable.appendChild(tbody);
  exportExl()(expTable,name)
}
class SelectWrap extends React.Component{
  constructor(props){
    super(props)
    this.state={
      showModal:false,
      extText:{},
      select_id:''
    }


  }
  getOtion=(res)=> {
    let option = {
      tooltip : {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)"
      },

      series : [
        {

          type: 'pie',
          radius : '60%',
          selectedMode: 'single',
          labelLine:{
            normal:{length:5,length2:10}
          },
          data:[

          ],
          label:{
            normal:{
              formatter:'{d}%\n{b}'
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    option.series[0].data=JSON.parse(res).map((i)=>{
      return {
        value:i.iqo_count, name:i.opt_content,arg_iqoid:i.iqo_id,arg_type:i.iqo_type
      }
    })

    return option
  }
  getOtherAnswers=(params)=>{
    console.log(params.data)
    let {arg_type,arg_iqoid}=params.data
    if(arg_type==='1'){
      if(!this.props.select_text[arg_iqoid]){
        this.props.dispatch({
          type:'questionnaire_result/getOtherAnswers',
          arg_iqoid,
          callback:()=>{
            this.setState({
              showModal:true,
              select_id:arg_iqoid
            })
          }
        })
      }else{
        this.setState({
          showModal:true,
          select_id:arg_iqoid
        })
      }

    }

  }
  modalCloseHandle=()=>{
    this.setState({
      showModal:false
    })
  }
  render(){
    let {showModal, select_id}=this.state;
    let {data ,select_text}=this.props;
    return (

        <div >
          <Card title={data.ques_content} >
            <ReactEcharts
              option={this.getOtion(data.select_result)}
              style={{height: 300}}
              onEvents={{'click': this.getOtherAnswers}}
            />

          </Card>
          <Modal visible={showModal} title={data.ques_content} onCancel={this.modalCloseHandle} footer={<Button onClick={this.modalCloseHandle}>关闭</Button>}>
            {
              select_text[select_id]?select_text[select_id].map((i,index)=> <p key={index} className={Styles.answer}>{(index+1)+'.'+i.uas_text}</p>):null

            }
          </Modal>
        </div>


    )
  }
}
function ChoiceQuestion({data,dispatch,select_text}) {
  let types=[...new Set(data.map((i)=>i.ec_name_show))];

  return(
    <div>
      <Tabs
        defaultActiveKey="1"
        tabPosition={'top'}
      >
        {
          types.map((i,index)=><TabPane tab={i} key={index+1}>
            <Row gutter={16}>

              {data.map((k,ind)=>{
                if(k.ec_name_show===i){
                  return (
                    <Col span={12} style={{marginBottom:'20px'}} key={ind}>
                      <SelectWrap select_text={select_text} data={k} key={ind} dispatch={dispatch}/>
                    </Col>
                  )
                }
              })
              }
            </Row>
          </TabPane>)
        }

      </Tabs>

    </div>
  )
}

class AnswersWrap extends React.Component{
  state={
    pageSize:10,
    currentPage:1
  };
  render(){
    let{data}=this.props;
    let {pageSize, currentPage}=this.state;
    return(
      <div>
        {data.map((k,index)=>{
          if(index>=(currentPage-1)*pageSize&&index<currentPage*pageSize){
            return <p key={index} className={Styles.answer}>{(index+1)+'.'+JSON.parse(k.uat_text).uat_text}</p>
          }
          return
        })}
        <div style={{textAlign:'center'}}>
          <Pagination current={currentPage} pageSize={pageSize} total={data.length} onChange={(page)=>this.setState({currentPage:page})}/>
        </div>
      </div>
    )
  }
}
function QAQuestion({data,onChange}) {
  console.log(data)
  let types=[...new Set(data.map((i)=>i.ec_name_show))];
  return(
    <div>
      {
        types.map((t,tnd)=>{
          return <div key={tnd} className={Styles.textWrap}>
            <h2 >{t}</h2>
            <Collapse accordion onChange={onChange}>
              {data.filter(o=>o.ec_name_show===t).map((i)=><Panel header={i.ques_content} key={i.iq_id}>
                  {
                    i.answers?<AnswersWrap data={i.answers}/>:null
                  }


              </Panel>)}
            </Collapse>

          </div>
        })
      }

    </div>

  )
}
class AnswerPeople extends React.Component{
  state={
    showModal:false,
    showDeptInfo:{
      ou:'',
      deptname:'',

    },
    showState:'0'
  }
  columns=(colSpanArr)=>{
    console.log(colSpanArr)
    let indexArr=[]
    colSpanArr.forEach((i)=>{
      let kk=new Array(i).fill(0)
      kk[0]=i
      indexArr=indexArr.concat(kk)
    })
    console.log(indexArr)
    return [
      {
        title:'OU',
        dataIndex:'ou_shortname',
        width:'15%',
        render:(value, row, index)=>{
          console.log(indexArr[index])
          return {
            children: <div style={{textAlign:'center'}}>{value}</div>,
            props: {rowSpan:indexArr[index],colSpan:value==='总计'?2:1},
          };

        }
      },
      {
        title:'部门',
        dataIndex:'deptname',
        width:'25%',
        render:(value,row)=>{
          return {
            children: value,
            props: {colSpan:row.ou_shortname==='总计'?0:1},
          };
        }
      },
      {
        title:'未填报',
        dataIndex:'notSubmitDeptCount',
        width:'15%',
        render:(text,record)=>parseInt(text)
          ?record.ou_shortname==='总计'?text:<a onClick={this.userDetailSearch(record) } className='argtype_0'>{text}</a>
          :text,

      },
      {
        title:'已填报',
        dataIndex:'submitDeptCount',
        width:'15%',
        render:(text,record)=>parseInt(text)
          ?record.ou_shortname==='总计'?text:<a onClick={this.userDetailSearch(record) } className='argtype_1'>{text}</a>
          :text,

      },
      {
        title:'合计',
        width:'15%',
        dataIndex:'totalCount',
        render:(text,record)=>text?text:record.submitDeptCount+record.notSubmitDeptCount
      },
    ];
  }
  people_detail_columns={
    '0':[
      {
        title:'OU',
        dataIndex:'ou',
        width:180
      },
      {
        title:'部门',
        dataIndex:'deptname',
        width:200
      },
      {
        title:'人员编号',
        dataIndex:'userid',
        width:100,
        className:'textNumber',
      },
      {
        title:'姓名',
        dataIndex:'username',
        width:100
      },


    ],
    '1':[
      {
        title:'OU',
        dataIndex:'ou',
        width:180
      },
      {
        title:'部门',
        dataIndex:'deptname',
        width:200
      },
      {
        title:'人员编号',
        dataIndex:'uc_userid',
        width:100,
        className:'textNumber',
      },
      {
        title:'姓名',
        dataIndex:'username',
        width:100
      },
      {
        title:'填写时间',
        dataIndex:'uc_create_time',
        width:150
      },

    ]
  }
  userDetailSearch=(record)=>(e)=>{
    e.preventDefault();
    console.log(e.target.className)
    let arg_type=e.target.className.split('_')[1];
    let{deptid:arg_deptid,ou,deptname}=record
    this.props.dispatch({
      type:'questionnaire_result/userDetailSearch',
      arg_infoid:this.props.arg_infoid,
      arg_deptid,
      arg_type,
      callback:()=>{
        this.setState({
          showModal:true,
          showDeptInfo:{
            ou,
            deptname,
          },
          showState:arg_type
        })
      }
    })


  }
  modalCloseHandle=()=>{
    this.setState({
      showModal:false
    })
  }
  render(){
    let {data,people_detail}=this.props;
    let {ou, deptname}=this.state.showDeptInfo;
    let colSpanArr=[]
    let types=[...new Set(data.map(i=>i.ou))];
    console.log(data)
    types.forEach(i=>{
      colSpanArr.push(data.filter(k=>k.ou===i).length)
    })
    return(
      <div id='people_num' className={Styles.orderTable}>
        <Table  dataSource={data} columns={this.columns(colSpanArr)} pagination={false} scroll={{ y: 500 }} />
        <div style={{textAlign:'right',paddingTop:'15px'}}>
          <Button type={'primary'} disabled={!data.length} onClick={()=>exportFixedTable(document.querySelector('#people_num'),'填写问卷人员统计')}>导出</Button>
        </div>
        <Modal
          title={`${ou}-${deptname}-${this.state.showState==='0'?'未填报':'已填报'}`}
          visible={this.state.showModal}
          width={'50%'}
          footer={[<Button onClick={this.modalCloseHandle}>关闭</Button>,
            <Button type={'primary'} onClick={()=>exportFixedTable(document.querySelector('#people_detail'),`${ou}-${deptname}-${this.state.showState==='0'?'未填报':'已填报'}人员统计`)}>导出</Button>
          ]}
          onCancel={this.modalCloseHandle}
        >
          <div id='people_detail' className={Styles.orderTable}>
            <Table rowKey='userid' dataSource={people_detail} columns={this.people_detail_columns[this.state.showState]}  pagination={false} scroll={{ y: 300 }}  />
          </div>


        </Modal>
      </div>

    )
  }
}

const fetchMap={
  2:'statistics_text',
  3:'statistics_answered'
}
class Questionnaire_result extends React.Component{
  tabsChange=(key)=>{
    this.props.dispatch({
      type:'questionnaire_result/'+fetchMap[key],
      arg_infoid:this.props.location.query.arg_infoid,
      arg_questype:key
    })
  }
  getAnswerDetail=(key)=>{
    console.log(key)
    if(!key){
      return
    }
    if(!this.props.statistics_text.some(i=>(i.iq_id===key)&&i.answers)){
      this.props.dispatch({
        type:'questionnaire_result/ques_getAnswers',
        arg_iqid:key,
        arg_infoid:this.props.location.query.arg_infoid
      })
    }

  }
  componentWillUnmount=()=>{
    this.props.dispatch({
      type:'questionnaire_result/clearAll',
    })
  }
  render(){
    let {selectData, statistics_text, AnswersPeople, dispatch, people_detail ,location, loading, select_text} = this.props
    return(
      <Spin spinning={loading} >
        <div className={Styles.wrap}>
          <div className={Styles.title}>问卷统计</div>
          <div>
            <Tabs defaultActiveKey="1" onChange={this.tabsChange} >
              <TabPane tab="选择题统计" key="1"><ChoiceQuestion data={selectData} dispatch={dispatch} select_text={select_text}/></TabPane>
              <TabPane tab="问答题统计" key="2"><QAQuestion data={statistics_text} onChange={this.getAnswerDetail}/></TabPane>
              <TabPane tab="填写问卷人员统计" key="3"><AnswerPeople arg_infoid={location.query.arg_infoid} people_detail={people_detail} data={AnswersPeople} dispatch={dispatch}/></TabPane>
            </Tabs>
          </div>
        </div>
      </Spin>
    )
  }
}
function mapStateToProps(state) {
  const { list,selectData,statistics_text,AnswersPeople,people_detail,select_text} = state.questionnaire_result;

  return {
    list,
    selectData,
    statistics_text,
    AnswersPeople,
    people_detail,
    select_text,
    loading: state.loading.models.questionnaire_result,
  };
}
export default connect(mapStateToProps)(Questionnaire_result)
