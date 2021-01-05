/**
 * 作者：郭银龙
 * 日期：2020-5-18
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：创建报告
 */  
import React from 'react'; 
import {connect } from 'dva';
import {Form,Table, Modal, Input, Button, DatePicker, Row, Col, Select, TreeSelect, Radio, message,Card} from 'antd';
import { Pagination } from 'antd';
const { Search,TextArea } = Input;
import styles from './tjstyle.less';
import { routerRedux } from 'dva/router';
import FileUpload from '../myNews/setFileUoload.js'; 
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
// 引入柱状图
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'; 
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox'; 
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';
import  'echarts/lib/chart/bar';//柱状图
import 'echarts/lib/chart/line';//折线图
import 'echarts/lib/chart/pie';//饼状图

class newReport extends React.Component {
  
  
  state={
    value:0,//年度/半年
    sevalue:"",//年份
    sevalue2:"",//月份
    sevalue3:"",//通知对象
    sevalue4:"",//主管对象
    showNewReport: 'none',
    showNewReport2:"none",
    showNewReport3:"none",
    textipt:"",//检查结果,
    // visible:  false,
    tjlist:this.props.reportList==""?"":this.props.reportList,
    showyuefen:"none",
    kongzhi1:"none",//安委办领导
    kongzhi2:"none",//安委办 //副院长。。。 
  }


//创建报告
  submit =()=>{
    if(this.state.sevalue==""){
      message.info("年份不能为空");
      return;
    }
    if(this.state.value==0){
      this.setState({
        sevalue2:""
      })
    }else if(this.state.value==1){
      if(this.state.sevalue2==""){
        message.info("月份不能为空");
        return;
      }
    }
    const{value,sevalue,sevalue2}=this.state
    // console.log(value,sevalue,sevalue2,this.props.reportList)
    const { dispatch} = this.props
    dispatch({
      type:"newReport/submitReport",
      // payload:{
        niandu:value,
        nianfen:sevalue,
        yuefen:sevalue2
      // }
    })
    dispatch({
      type:"newReport/zhuguanfuyanzhang",
    }) 
    if(this.props.roleType == '1' || this.props.roleType == '2'){
      this.setState({
        tjlist:this.props.reportList,
        showNewReport : "block",
        kongzhi1:"inline-block",
       
      })
    }else if(this.props.roleType == '3' || this.props.roleType == '4'){
      this.setState({
        tjlist:this.props.reportList,
        showNewReport : "block",
        kongzhi2:"inline-block",
       
      })
    } 
  };
 

  //监听年份
  handleChange=(value)=>{
// console.log(` ${value}`,"年份")
this.setState({
  sevalue:`${value}`
})

  }
   //监听月份
   handleChange2=(value)=>{
// console.log(`${value}`,"月份")
this.setState({
  sevalue2:`${value}`
})
  }
// /监听全部通知对象
handleChange3=(value)=>{
  // console.log(` ${value}`,"对象")
  this.setState({
    sevalue3:`${value}`
  })
}
// /监听主管副院长通知对象
handleChange4=(value)=>{
  // console.log(` ${value}`,"主管对象")
  this.setState({
    sevalue4:`${value}`
  })
}
  //监听检查结果
  textinpu=e=>{
// console.log(e.target.value)
this.setState({
  textipt:e.target.value
})
  }

  //监听年度/半年
  shenpi=(e)=>{
    // console.log(e.target.value)
    this.setState({
      value:e.target.value
    })
    if(this.state.value==0){
      this.setState({
        showyuefen:"inline-block"
      })
    }else{
      this.setState({
        showyuefen:"none"
      })
    }
  }
   //检查通报
   bsyzsubmit=()=>{ 
    this.setState({
      showNewReport3 : "inline-block",
      showNewReport2 : "none"
    })
  }
  //报送院长
  jcsubmit3=()=>{
    // console.log("报送安委办领导",
    this.props.dispatch({
      type:"newReport/baoSongZhuGuanFuYuanZhang",
       arg_statistics_id :this.props.reportList[0].statisticsId,//| varchar(32) | 是       | 统计任务的id |
       arg_user_ids:this.state.sevalue4,  //通知对象
       arg_result_content:this.state.textipt==""?this.props.reportList[0].inspectionResults:this.state.textipt,
       arg_result_img:this.props.examineImgId
    })
  }
  //报送安委办领导
  bssubmit=()=>{
    // console.log("报送安委办领导",
    this.props.dispatch({
      type:"newReport/baoSongLingDao",
      // payload:{
        arg_statistics_id :this.props.reportList[0].statisticsId,
       arg_result_content:this.state.textipt==""?this.props.reportList[0].inspectionResults:this.state.textipt,
       arg_result_img:this.props.examineImgId
      // }
    })
  }
  //检查通报
  jcsubmit=()=>{ 
    this.setState({
      showNewReport2 : "inline-block",
      showNewReport3 : "none"
    })
  }
  //检查通报
  jcsubmit2=()=>{
    // console.log("检查通报",this.state.textipt,this.state.sevalue3)
    this.props.dispatch({
      type:"newReport/jianChaTongBao",
      // payload:{
        arg_statistics_id :this.props.reportList[0].statisticsId,
       arg_result_content:this.state.textipt==""?this.props.reportList[0].inspectionResults:this.state.textipt,
       arg_result_img:this.props.examineImgId
      // }
    })

   
  }
  
  //信息发布
  fbsubmit=()=>{
    // console.log("信息发布",this.state.textipt)
    this.props.dispatch({
      type:"newReport/xinXiFaBu",
      // payload:{
        arg_statistics_id :this.props.reportList[0].statisticsId,
       arg_result_content:this.state.textipt==""?this.props.reportList[0].inspectionResults:this.state.textipt,
       arg_result_img:this.props.examineImgId
      // }
    })
   
  }
  //上传需要
saveData = (values) => {
  this.setState({
    showData:values,
    importDataLength:values.length,
  })
};
  returnModel =(value,value2)=>{
    let saveData = {
      startTime: this.state.beginTime,
      endTime: this.state.endTime,
      otherOu: this.state.value
    }
    saveData['otherOu'] = (this.props.roleType == '1' || this.props.roleType == '2' ) ? 0 : 1 //除安委办之外涉及分院字段都为0
    if(value2!==undefined){
      this.props.dispatch({
        type:'newReport/'+value,
        record : value2,
        saveData,
        arg_result_content:this.state.textipt==""?this.props.reportList[0].inspectionResults:this.state.textipt,
       arg_result_img:this.props.examineImgId
      })
    }else{
      this.props.dispatch({
        type:'newReport/'+value,
      })
    }
  };

  //查看各分院详情跳转
  gefenyuan=()=>{
    this.props.dispatch(routerRedux.push({
      pathname:'/adminApp/securityCheck/checkStatistics/reportInFor', 
      query: {
        arg_statistics_id:JSON.parse(JSON.stringify(this.props.location.query.argNotificationId)),//统计id
        arg_yard_state:1,//0:总院分院,1分院 
        // arg_item_state:"0",//0:表扬，1:不合格
   
      }
    }));
  }
   //查看本部各部门详情跳转
   gebumen=()=>{
    this.props.dispatch(routerRedux.push({
      pathname:'/adminApp/securityCheck/checkStatistics/reportInFor', 
      query: {
        arg_statistics_id:JSON.parse(JSON.stringify(this.props.location.query.argNotificationId)),//统计id
        arg_yard_state:0,//0:总院分院,1分院 
        // arg_item_state:"0",//0:表扬，1:不合格
   
      }
    }));
  }

   
    render() { 
            const{ taskList,reportList,checkObjectAndContentList,checkZhuGuanFuYanZhangList,roleList,examineImgId,roleType,roleObject,roleObject2}=this.props
                  // console.log(roleType,"xx",reportList,checkZhuGuanFuYanZhangList,taskList)

            let objectAndContentList = checkObjectAndContentList.length === 0 ? [] : checkObjectAndContentList.map((item) => { //全部通知对象
              return <Option key={item.roleId} value={item.roleId}>{item.roleName}</Option>
            })
            // let roleListData = roleList.length == 0 ? [] : roleList.map((item) => { // 全部通知对象
            //   return <Option key={item.roleId} value={item.roleId}>{item.roleName}</Option>
            // })
            let zhuGuanFuYanZhangList = checkZhuGuanFuYanZhangList.length === 0 ? [] : checkZhuGuanFuYanZhangList.map((item) => { //通知主管副院长
              return <Option key={item.roleId} value={item.roleId}>{item.roleName}</Option>
            })
            
// 绘制柱状图
const getOptionAxis = () => {

  return {
      
            
              // 鼠标移入显示数据
      　　    tooltip : { trigger: 'axis' },
              legend: { 
                data:['表扬','不合格','安全隐患'] 
              },
              toolbox: {
              　　　　show : true,
              　　　　feature : {
              　　　　　　mark : {show: true},
              　　　　　　dataView : {show: true, readOnly: false},
              　　　　　　magicType : {show: true, type: ['line', 'bar']},
              　　　　　　restore : {show: true},
              　　　　　　saveAsImage : {show: true}
              　　　　}
              　　},
              calculable : true,
            xAxis: {
              data:  this.props.reportList.length>0?this.props.reportList[0].ourHospital.xAxis[0].data:[], 
                axisLabel : {//坐标轴刻度标签的相关设置。
                  interval:0,
                  rotate:"25" 
              },
            },
            yAxis: [
              　{
                　　　　　　type : 'value'
                　　　　}
            ],
            series: this.props.reportList!=""?this.props.reportList[0].ourHospital.series:""  ,
       
        
  };
};
const  getOptionAxis2=()=>{
 
  
  return{
 
      // 鼠标移入显示数据
　　    tooltip : { trigger: 'axis' },
      legend: { 
        data:['表扬','不合格','安全隐患'] 
      },
      toolbox: {
        　　　　show : true,
        　　　　feature : {
        　　　　　　mark : {show: true},
        　　　　　　dataView : {show: true, readOnly: false},
        　　　　　　magicType : {show: true, type: ['line', 'bar']},
        　　　　　　restore : {show: true},
        　　　　　　saveAsImage : {show: true}
        　　　　}
        　　},
      calculable : true,
     xAxis: 
     {
      data:  this.props.reportList.length>0?this.props.reportList[0].ou.xAxis[0].data:[], 
         axisLabel : {//坐标轴刻度标签的相关设置。
           interval:0,//强制显示所有
          //  rotate:30,//让坐标值旋转一定的角度
          
       },
     },
     yAxis: {},
     series: this.props.reportList!=""?this.props.reportList[0].ou.series:""  ,

  }
}
//绘制饼状图
const  getOptionAxis3=()=>{

  return{
     
         
          tooltip : {
              trigger: 'item',
              //提示框浮层内容格式器，支持字符串模板和回调函数形式。
              formatter: "{a} <br/>{b} : {c} ({d}%)" 
          },
          
          legend: {
              orient: 'vertical',
              top:20,
              left:10,
              data: ["党群部（党委宣传部）",
              "采购部",
              "项目管理部",
              "公众研发事业部",
              "创新与合作研发事业部",
              "公共平台与架构研发事业部",
              "运营保障与调度中心",
              "计费结算中心",
              "集客与行业研发事业部",
              "共享资源中心",
              "纪委",
              "政企与行业研发事业部",
              "创新与能力运营事业部",
              "客户服务研发事业部",
              "公共平台与架构部",
              "软件开发部",
              "项目与质量支撑部",
              "运营支撑部",
              "管理层",
              "办公室（党委办公室）",
              "财务部",
              "人力资源部（党委组织部）",
              "需求分析部"]
          },
          series : [
              {
                  name:'合格量',
                  type:'pie',
                  selectedMode: 'single',
                radius: ['35%', '55%'],
                // center: ["85%", "50%"], //图的位置
                label: {
                  normal: {
                    position: 'inner',
                    show : false
                 }
                  },
              labelLine: {
                  show: false
              },
    
                
               
                  data:  this.props.reportList.length>0?this.props.reportList[0].PieChart.series[0].data:[]
               
              },
          
          ]
       

  }}
  const  getOptionAxis4=()=>{
    
  
    return{

           
            tooltip : {
                trigger: 'item',
                //提示框浮层内容格式器，支持字符串模板和回调函数形式。
                formatter: "{a} <br/>{b} : {c} ({d}%)" 
            },
            legend: {
                orient: 'vertical',
                top:20,
                left:10,
                data: ["党群部（党委宣传部）",
              "采购部",
              "项目管理部",
              "公众研发事业部",
              "创新与合作研发事业部",
              "公共平台与架构研发事业部",
              "运营保障与调度中心",
              "计费结算中心",
              "集客与行业研发事业部",
              "共享资源中心",
              "纪委",
              "政企与行业研发事业部",
              "创新与能力运营事业部",
              "客户服务研发事业部",
              "公共平台与架构部",
              "软件开发部",
              "项目与质量支撑部",
              "运营支撑部",
              "管理层",
              "办公室（党委办公室）",
              "财务部",
              "人力资源部（党委组织部）",
              "需求分析部"]
            },
            series : [
              
                {
                  name:"不合格量",
                  type:'pie',
                  selectedMode: 'single',
                  radius: ['35%', '55%'],
                  // center: ["85%", "50%"], //图的位置
                  label: {
                    normal: {
                      position: 'inner',
                      show : false
                   }
                    },
                labelLine: {
                    show: false
                },
            
                data:  this.props.reportList.length>0?this.props.reportList[0].PieChart.series[1].data:[]
               
              },
            ]
      
      
    }}
    const  getOptionAxis5=()=>{

      
      return{

        
          tooltip : {
              trigger: 'item',
              //提示框浮层内容格式器，支持字符串模板和回调函数形式。
              formatter: "{a} <br/>{b} : {c} ({d}%)" 
          },
          legend: {
              orient: 'vertical',
              top:20,
              left:10,
              data: 
              ["党群部（党委宣传部）",
              "采购部",
              "项目管理部",
              "公众研发事业部",
              "创新与合作研发事业部",
              "公共平台与架构研发事业部",
              "运营保障与调度中心",
              "计费结算中心",
              "集客与行业研发事业部",
              "共享资源中心",
              "纪委",
              "政企与行业研发事业部",
              "创新与能力运营事业部",
              "客户服务研发事业部",
              "公共平台与架构部",
              "软件开发部",
              "项目与质量支撑部",
              "运营支撑部",
              "管理层",
              "办公室（党委办公室）",
              "财务部",
              "人力资源部（党委组织部）",
              "需求分析部"]
          },
          series : [
            
            
            {
              name:"安全隐患量",
              type:'pie',
              selectedMode: 'single',
              radius: ['35%', '55%'],
              // center: ["85%", "50%"], //图的位置
              label: {
                normal: {
                  position: 'inner',
                  show : false
               }
                },
            labelLine: {
                show: false
            },
              data:  this.props.reportList.length>0?this.props.reportList[0].PieChart.series[2].data:[]
           
          },
          ]
  
        
      }}



        
        return (
          
          <div className={styles.outerField}>
    
            <div className={styles.out}>
              <div className={styles.title}>
              创建报告
              </div>
              <div>
              <Button style = {{float: 'right'}} size="default" type="primary" >
									<a href="javascript:history.back(-1)">返回</a>
							</Button>
              <div className={styles.lineOut1}>
                    <span className={styles.lineKey}>
                    创建
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <Radio.Group onChange={this.shenpi} value={this.state.value}>
                      <Radio value={0}>年度</Radio>
                      <Radio value={1}>半年</Radio>
                    </Radio.Group>
                    <span>
                    报告
                    </span>

                    {/* <div className={styles.lineOut2}> */}
                        <span className={styles.lineKey}>
                        年份
                        </span>
                        <span className={styles.lineColon}>:</span>
                        <span>
                              <Select Value={this.state.sevalue} style={{ width: 100 }} onChange={this.handleChange}>
                                  <Option value={2019}>2019</Option>
                                  <Option value={2020}>2020</Option>
                                  <Option value={2021}>2021</Option>
                                </Select>
                          </span>
                    {/* </div> */}
                    <div style={{display: this.state.showyuefen}}>
                        <span className={styles.lineKey}>
                        月份
                        </span>
                        <span className={styles.lineColon}>:</span>
                        <span>
                        <Select Value={this.state.sevalue2} style={{ width: 100 }} onChange={this.handleChange2}>
                                  <Option value="0">上半年</Option>
                                  <Option value="1">下半年</Option>
                                </Select>
                          
                        </span>
                    </div>
                    <Button type="primary" className={styles.buttonSubmit} onClick={this.submit}>创建报告</Button>
    
                </div>
              </div>
                {/* {this.state.visible ? ( */}
              <div className={styles.showNewReport} style={{display: this.state.showNewReport}}
               >
             {this.props.reportList.length>0?
             <div>

           
            {this.props.usename==this.props.reportList[0].publisher?

        <div>
              {this.props.roleType == '1' ?
            (<div >
                {/* 总院 */}
                   <Button type="primary" className={styles.buttonSubmit} onClick={this.bssubmit}>报送安委办领导</Button>
                  <Button type="primary" className={styles.buttonSubmit} onClick={this.jcsubmit}>检查通报</Button>
                  <Button type="primary" className={styles.buttonSubmit} onClick={this.fbsubmit}>信息发布</Button>
              </div >)
            :""}
              {this.props.roleType == '2' ?( 
              < div >
                {/* 分院 */}
                   <Button type="primary" className={styles.buttonSubmit} onClick={this.bssubmit}>报送安委办</Button>
                   <Button type="primary" className={styles.buttonSubmit} onClick={this.bsyzsubmit}>报送办公室/主管副院长</Button>
                  <Button type="primary" className={styles.buttonSubmit} onClick={this.jcsubmit}>检查通报</Button>
                  <Button type="primary" className={styles.buttonSubmit} onClick={this.fbsubmit}>信息发布</Button>
              </div>)
              :""}
              </div>
                 :""}
                 </div>
             :""}  
              <span style={{display: this.state.showNewReport2,marginTop:10}}>
                     <span className={styles.lineKey}> 通知对象</span>
                        <span className={styles.lineColon}>:</span>
                      <span>
                      <Select mode="multiple"
                        value={roleObject}
                        style={{ width: 200 }} 
                        onChange={(e)=>this.returnModel('roleListData',e)}
                        placeholder = "请选择">
                                  	{objectAndContentList}
                                </Select>
                          
                      </span>
                      <Button type="primary" className={styles.buttonSubmit} onClick={this.jcsubmit2}>通报</Button>
                </span>
                <span style={{display: this.state.showNewReport3,marginTop:10}}>
                     <span className={styles.lineKey}> 通知对象</span>
                        <span className={styles.lineColon}>:</span>
                      <span>
                      <Select mode="multiple"
                        value={roleObject2}
                        style={{ width: 200 }} 
                        onChange={(e)=>this.returnModel('roleListData2',e)}
                        placeholder = "请选择">
                                  	{zhuGuanFuYanZhangList}
                                </Select>
                          
                      </span>
                      <Button type="primary" className={styles.buttonSubmit} onClick={this.jcsubmit3}>通报</Button>
                </span>
{reportList.length>0? 
<div>


                  <div className={styles.bgc}>
                  <div className={styles.lineOutcenter1}>
                    <div className={styles.lineOut2}>
                        <span className={styles.lineKey}>
                        发布人
                        </span>
                        <span className={styles.lineColon}>:</span>
                        <span>
                          {
                            reportList[0].publisher
                            
                          }
                          
                          </span>
                    </div>
                    <div className={styles.lineOut2}>
                        <span className={styles.lineKey}>
                        检查时间
                        </span>
                        <span className={styles.lineColon}>:</span>
                        <span>
                          { reportList[0].theTimeStart.substring(0,16) }～ {reportList[0].theTimeEnd.substring(0,16) }
                          </span>
                    </div>
                    <div className={styles.lineOut2}>
                        <span className={styles.lineKey}>
                        检查主题
                        </span>
                        <span className={styles.lineColon}>:</span>
                        <span>
                          {/* {this.props.reportList[0].title} */}
                          {
                            reportList!=""? reportList[0].title:""
                            
                          }
                          </span>
                    </div>
                
                  </div>
                  <div className={styles.lineOut2}>
                        <span className={styles.lineKey}>
                        检查结果
                        </span>
                        <span className={styles.lineColon}>:</span>
                              
                              <div className={styles.textdiv}>
                                <TextArea
                                defaultValue={ this.props.reportList!=""?reportList[0].inspectionResults:"" }
                                onChange={this.textinpu}
                                />
                              </div>
                    </div>
                    <div className={styles.lineOutimg}>
                        
                        <span>
                       {/* 图片上传 */}
                                      
                       <div style = {{width: 570,marginLeft: 100, marginTop: 18}}>
                          <FileUpload dispatch={this.props.dispatch}  fileList ={examineImgId} loading = {this.props.loading} pageName='newReport'
                          len = {this.props.examineImgId && this.props.examineImgId.length} />
                        </div>
                        <Modal visible={this.props.previewVisible} footer={null} onCancel={()=>this.returnModel('handleCancel')}>
                          <img alt="example" style={{ width: '100%' }} src={this.props.previewImage} />
                        </Modal>
                        </span>
                    </div>
                  </div> 
                
                  <div >
                    <div style={{display:this.state.kongzhi1}}  className={styles.lineOuttu}>
                  {reportList[0].ourHospital?
                    <Card style = {{marginBottom:10}} title={
                                    <span style = {{fontWeight:900}}>
                                      <h2>本院各部门数据统计:</h2>
                                      
                                      </span>
                                    }
                                    extra={<h4 style={{display:"inlinblock"}} onClick={this.gebumen}> <a style={{marginLeft:'25px'}}>详情</a> </h4>}>
                               <ReactEcharts option={getOptionAxis(  )}
                              style={{
                                  width: '100%',
                                  height:'400px'
                                 }}
                              />
                            </Card> 
                            :""}
                            {reportList[0].PieChart?
                            <div>
                              
                            
                            <Card style = {{marginBottom:10}} title={
                                    <span style = {{fontWeight:900}}>
                                      <h2>本院各部门合格数据统计:</h2>
                                      
                                      </span>
                                    }>
                               <ReactEcharts option={getOptionAxis3(  )}
                              style={{
                                  width: '100%',
                                  height:'400px'
                                 }}
                              />
                            </Card> 
                            <Card style = {{marginBottom:10}} title={
                                    <span style = {{fontWeight:900}}>
                                      <h2>本院各部门不合格数据统计:</h2>
                                      
                                      </span>
                                    }>
                               <ReactEcharts option={getOptionAxis4(  )}
                              style={{
                                  width: '100%',
                                  height:'400px'
                                 }}
                              />
                            </Card> 
                            <Card style = {{marginBottom:10}} title={
                                    <span style = {{fontWeight:900}}>
                                      <h2>本院各部门安全隐患数据统计:</h2>
                                      
                                      </span>
                                    }>
                               <ReactEcharts option={getOptionAxis5(  )}
                              style={{
                                  width: '100%',
                                  height:'400px'
                                 }}
                              />
                            </Card> 
                            </div>
                            :""}
                            {reportList[0].ou?
                            <Card style = {{marginBottom:10}} title={
                                    <span style = {{fontWeight:900}}>
                                      <h2>各分院数据统计:</h2>
                                      
                                      </span>
                                    }
                                    extra={<h4 style={{display:"inlinblock"}} onClick={this.gefenyuan}> <a style={{marginLeft:'25px'}}>详情</a> </h4>}>
                               <ReactEcharts option={getOptionAxis2(  )}
                              style={{
                                  width: '100%',
                                  height:'400px'
                                 }}
                              />
                            </Card> 
                            :""}
                    </div> 
                 
                
                  </div>
                  
</div>
:""}


               </div>
               	{/* ) : ""} */}
            </div>
          </div>
        )
    }
}

// export default newReport;
const form1 = Form.create()(newReport);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.newReport,
    ...state.newReport
  };
}
export default connect(mapStateToProps)(form1);