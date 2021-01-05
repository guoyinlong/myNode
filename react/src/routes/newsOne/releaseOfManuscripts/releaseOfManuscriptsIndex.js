/**
 * 作者：郭银龙
 * 创建日期： 2020-9-28
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 稿件发布情况首页
 */

import React  from 'react';
import {connect } from 'dva';
import { Collapse, Button,DatePicker, Pagination, Input } from 'antd'
import styles from './setNewstyle.less'
import { routerRedux } from 'dva/router';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
const {RangePicker} = DatePicker;
const { Panel } = Collapse;
class releaseHome extends React.PureComponent {
	state = {
        beginTime:"",
        endTime:"",
        inputvalue3:"",
    }
    //发布稿件名称：
    gaojian=e=>{
        this.setState({
       inputvalue3:e.target.value
     })
   }
     //得到时间保存时间 
     changeDate = (date,dateString) => {
    const beginTime = dateString[0];
    const endTime = dateString[1];
    this.setState({
        beginTime,
        endTime,
    });
        };
        //清空
        empty=()=>{
            this.setState({
                beginTime: '', 
                endTime: '',
                inputvalue3:"",
            })
            this.props.dispatch({
                type: "releaseHome/queryUserInfo", 
            })
        }
        //搜索
        sousuo=()=>{
            const{beginTime,endTime,inputvalue3}=this.state
            this.props.dispatch({
                type: "releaseHome/queryUserInfo", 
                    beginTime,
                    endTime,
                    inputvalue3
            })
        }
        //新增
        newAdd=(e)=>{
            this.props.dispatch(routerRedux.push({
                pathname:'/adminApp/newsOne/releaseOfManuscripts/feedbackFilling',
                id:e.newsId
              }));
        }
        //查看详情/跳转反馈
        goDetail=(item)=>{
            //已反馈过的跳转详情页面
            if(item.releaseNewsName){
                this.props.dispatch(routerRedux.push({
                    pathname:'/adminApp/newsOne/releaseOfManuscripts/releaseOfManuscriptsDetails',
                    query: {
                      id:JSON.parse(JSON.stringify(item.materiaId))
                    }
                  }));
            }else{  //未反馈的跳转反馈页面
                this.props.dispatch(routerRedux.push({
                    pathname:'/adminApp/newsOne/releaseOfManuscripts/feedbackFilling',
                    query: {
                      id:JSON.parse(JSON.stringify(item.materiaId))
                    }
                  }));
            }
            
        }
        callback=(e)=>{
        }
 //分页
 ChangePage=(page)=>{
       this.props.dispatch({
        type: "releaseHome/queryUserInfo",
         page
    })
 }
 
	//----------------------页面渲染----------------------//
	render() {
    const {qingkuangfankuiList } = this.props;
    const collspanlist =qingkuangfankuiList.length == 0 ? [] : qingkuangfankuiList.map((item, index) => {
    item.key = index; //一级加key值
    item.id=item.id;
    let itemList=item.children
    let childList = itemList.length === 0 ? [] : itemList.map((item,i) => { 
        return  <p key={i} onClick={()=>this.goDetail(item)}>  
                   {
                       item.releaseNewsName?
                        <span style={{marginLeft: '5px' ,withWidth:"80vw",cursor:"pointer",}}>
                        { item.releaseNewsName } 在 <b>{ item.releaseChannel }</b>&nbsp; 发布的新闻反馈情况
                                <span style={{float:"right"}}>
                                        <b>{item.createTime==null?"":item.createTime.substring(0,16)}</b>
                                </span>
                        </span>
                        :
                        <span style={{marginLeft: '5px' ,withWidth:"80vw",cursor:"pointer",}}>
                            您有接受处理发布后的稿件待反馈
                                <span style={{float:"right"}}>
                                        <b>{item.createTime==null?"":item.createTime.substring(0,16)}</b>
                                </span>
                        </span>
                   }
                     
                </p>
    })
    const path = (
        <Panel
            header={
                //第一行折叠面板数据
                (<div >
                    <span  > {item.newsName } </span>&nbsp;&nbsp;<span>{item.state}</span>
                </div>)
                }
            key = {index}
        >
      {childList}
        </Panel>    
    )
    return path
});
		return(
            <div className={styles.pageContainer}>
						<h2 style = {{textAlign:'center',marginBottom:30}}>稿件发布情况首页</h2>
                        <div style = {{overflow:"hidden",margin:"20px" }}>
                                发布稿件名称： <Input
                                                 value={this.state.inputvalue3}
                                                    style={{ width: 200,marginBottom:20,marginRight:20}}
                                                     onChange ={this.gaojian }
                                                     placeholder={"发布稿件名称"}
                                                     />
                               时间：<RangePicker  onChange = {this.changeDate}  style = {{width:200, marginRight:10}}
                                            value={   // 判断开始时间和结束时间是不是''是就显示null， 否则显示自己设置的值
                                            this.state.beginTime=== ''
                                            || this.state.endTime===''
                                            ? null : [moment(this.state.beginTime, dateFormat), moment(this.state.endTime, dateFormat)]}
                                            format={dateFormat}/>
                                    <div style= {{float: "right"}}>
                                    <Button size="default" type="primary" onClick={this.empty} style= {{marginRight: "10px"}}>清空</Button>
                                    <Button size="default" type="primary" onClick={this.sousuo} style= {{marginRight: "10px"}}>查询</Button>
                                    <Button size="default" type="primary" onClick={this.newAdd} style= {{marginRight: "10px"}} disabled = {this.props.qingkuangfankuiList.length == 0 ? true : false}>素材反馈</Button>
                                    </div>
                                    {qingkuangfankuiList.length>0?
                                    <div>
                                      <Collapse
                                     onChange={(e)=>this.callback(e)}
                                     > 
                                    {collspanlist} 
                                    </Collapse>
                                    <Pagination
                                        current = {this.props.pageCurrent !=""?this.props.pageCurrent:1}
                                        pageSize = {10}
                                        onChange = {this.ChangePage}
                                        total = {this.props.allCount!=""?this.props.allCount:1}
                                        style = {{textAlign: 'center', marginTop: '20px'}}
                                    />  
                                    </div>
                                :
                                <div style={{textAlign:"center" , color:"#b0b1b0"}}>
                                    暂无数据
                                </div>
                                }
                                    
                        </div>
            </div>
		)
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.releaseHome, 
    ...state.releaseHome
  };
}
export default connect(mapStateToProps)(releaseHome);
