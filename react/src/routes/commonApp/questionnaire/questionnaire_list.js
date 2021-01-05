/**
 * 作者：李杰双
 * 日期：2017/10/27
 * 邮件：282810545@qq.com
 * 文件说明：问卷列表页
 */
import React from 'react'
import {Table, Button, Breadcrumb, message, Spin} from 'antd'
import { Link, routerRedux, } from 'dva/router';

import Styles from '../../../components/commonApp/questionnaire.less'
import * as servive from '../../../services/commonApp/questionnaire'

const stateColor={
  0:'#FA7252',
  1:'#108DE9'
}
const stateURL={
  0:'questionnaire_detail',
  1:'questionnaire_result'
}
export default class Questionnaire_list extends React.Component{
  state={
    list:[],
    loading:true
  }
  textfilter=(text)=>{
    return text.replace(/\\t/g,'').replace(/\\n/g,'')
  }
  thead=[
    {
      title: 'title',
      dataIndex: 'info_title',
      render:(text,record)=><div className={Styles.questionTitle}><h3>{text}</h3><p title={this.textfilter(record.info_content)}>{this.textfilter(record.info_content)}</p></div>
    },
    // {
    //   title: 'state',
    //   dataIndex: 'write_flag',
    //   render:(text,record)=>text?<section className={Styles.questionState}><span style={{color:stateColor[text]}}>●</span>{record.write_flag_show}</section>:null
    // },
    {
      title: 'time',
      dataIndex: 'info_end_time',
      render:(text)=><span style={{color:'#999'}}>{`结束时间：${text}`}</span>
    },
    {
      title: 'do',
      dataIndex: 'user_type_flag',
      render:(text,record)=><div><Button type='primary' onClick={this.goQuestion(record.info_id,text)}>{record.button_show}</Button></div>
    }
  ]

  goQuestion=(id,state)=>()=>{

    console.log(this.props)
    // routerRedux.push({
    //   pathname:'/commonApp/questionnaire',
    //   query:{
    //     arg_infoid:text
    //   }
    // })
    this.props.history.push({
      pathname:'/commonApp/questionnaire/'+stateURL[state],
      query:{
        arg_infoid:id
      }
    })
  }
  async componentDidMount(){


    try{
      let {DataRows:list}=await servive.question_list_query({
        arg_userid: window.localStorage.sys_userid
      })
      this.setState({
        list,
        loading:false
      })
    }catch (e){
      message.error('参数错误！请返回')
      this.setState({

        loading:false
      })
    }
  }
  render(){
    return(
      <Spin spinning={this.state.loading}>
      <div className={Styles.wrap}>
        {
          //<div>
          //  <Breadcrumb separator=">">
          //    <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          //    <Breadcrumb.Item>问卷调查</Breadcrumb.Item>
          //  </Breadcrumb>
          //</div>
        }
        <div className={Styles.title}>问卷调查</div>
        <div className={Styles.questionList}>
          <Table showHeader={false}  columns={this.thead} dataSource={this.state.list} />
        </div>
      </div>
      </Spin>
    )
  }
}
