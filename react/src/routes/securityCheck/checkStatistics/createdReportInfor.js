 /** 
 * 作者：郭银龙
 * 日期：2020-6-9
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：创建报告详情 
 */
import React from 'react';
import {connect } from 'dva';
import styles from './tjstyle.less';
import {Form,Table, Modal, Input, Button, DatePicker, Row, Col, Select, TreeSelect, Radio, message,Card} from "antd";
const { Search,TextArea } = Input;
import PicShow from '../Notification/picShow';
import { routerRedux } from 'dva/router';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import FileUpload from './fileUpload';
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

class chaungjianbaogaoxiangqing extends React.Component {
      
  state={
    sevalue3:"",//通知对象
    sevalue4:"",//主管对象
    showNewReport: 'none',
    showNewReport2:"none",
    showNewReport3:"none",
    textipt:this.props.taskList.length>0?this.props.taskList[0].inspectionResults:"",//检查结果,
    tjlist:this.props.reportList==""?"":this.props.reportList,
    previewVisible: false,
    previewImage: '',
  }
  handleCancel = () => this.setState({ previewVisible: false })
handlePreview = (file) => {
  this.setState({
    previewImage: file.url || file.thumbUrl,
    previewVisible: true,
  });
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
    //保存图片和检查结果
    bcsubmit=()=>{
      this.props.dispatch({
        type:"chaungjianbaogaoxiangqing/baocunjieguo",
        // payload:{
         arg_statistics_id :this.props.location.query.argNotificationId,//| varchar(32) | 是       | 统计任务的id |
         arg_result_content:this.state.textipt==""?this.props.taskList[0].inspectionResults:this.state.textipt,
         arg_result_img:this.props.examineImgId
        // }
      })
    }
       //检查通报
   bsyzsubmit=()=>{ 
    this.setState({
      showNewReport3 : "inline-block",
      showNewReport2 : "none"
    })
  }

  //检查通报
  jcsubmit3=()=>{
    // console.log("报送安委办领导",this.state.textipt==""?this.props.reportList[0].inspectionResults:this.state.textipt)
    this.props.dispatch({
      type:"chaungjianbaogaoxiangqing/baoSongZhuGuanFuYuanZhang",
      // payload:{
       arg_statistics_id :this.props.location.query.argNotificationId,//| varchar(32) | 是       | 统计任务的id |
       
      // }
    })
  }
  //报送安委办领导
  bssubmit=()=>{
    console.log("报送安委办领导",this.props)
    this.props.dispatch({
      type:"chaungjianbaogaoxiangqing/baoSongLingDao",
      arg_statistics_id:this.props.location.query.argNotificationId,
      
     
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
    console.log("检查通报")
    this.props.dispatch({
      type:"chaungjianbaogaoxiangqing/jianChaTongBao",
      arg_statistics_id:this.props.location.query.argNotificationId,
      
    })

   
  }
  
  //信息发布
  fbsubmit=()=>{
    // console.log("信息发布",this.state.textipt)
    this.props.dispatch({
      type:"chaungjianbaogaoxiangqing/xinXiFaBu",
      arg_statistics_id:this.props.location.query.argNotificationId,
    
    })
   
  }
  goBackPage=()=>{
    this.props.dispatch({
      type:"chaungjianbaogaoxiangqing/goBack",
    })
  }
  returnModel =(value,value2)=>{
    // console.log(value,value2,"23")
   
    if(value2!==undefined){
      this.props.dispatch({
        type:'chaungjianbaogaoxiangqing/'+value,
        record : value2,
       
        
      })
    }else{
      this.props.dispatch({
        type:'chaungjianbaogaoxiangqing/'+value,
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


  render(){
 
  
    const{taskList,reportList,checkObjectAndContentList,checkZhuGuanFuYanZhangList,roleList,examineImgId,roleType,roleObject,roleObject2}=this.props
    // console.log(this.props.taskList,examineImgId,"examineImgId",this.props.loading)

 

let objectAndContentList = checkObjectAndContentList.length === 0 ? [] : checkObjectAndContentList.map((item) => { //全部通知对象
return <Select.Option  key={item.roleId} value={item.roleId}>{item.roleName}</Select.Option>
})
// let roleListData = roleList.length == 0 ? [] : roleList.map((item) => { // 全部通知对象
//   return <Option key={item.roleId} value={item.roleId}>{item.roleName}</Option>
// })
let zhuGuanFuYanZhangList = checkZhuGuanFuYanZhangList.length === 0 ? [] : checkZhuGuanFuYanZhangList.map((item) => { //通知主管副院长
return <Select.Option key={item.roleId} value={item.roleId}>{item.roleName}</Select.Option>
})



var getOptionAxis = () => {


  return { 
       
              // 鼠标移入显示数据
      　　    tooltip : { trigger: 'axis' },
              legend: { 
                data:['表扬','不合格','安全隐患'] 
              },
              grid: {
                bottom: '20%',
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
              data:   this.props.taskList.length>0?this.props.taskList[0].ou.xAxis[0].data:"",
              // ["西安软件研究院", "广州软件研究院", "南京软件研究院", "济南软件研究院", "哈尔滨软件研究院"] , 
                axisLabel : {//坐标轴刻度标签的相关设置。
                  interval:0,//强制显示所有
                  // rotate:"45" 
              },
            },
            yAxis: [
              　{
                　　　　　　type : 'value'
                　　　　}
            ],
            series:   this.props.taskList.length>0?this.props.taskList[0].ou.series:"",
      
        
  };
}; 


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
              // data:  this.props.taskList.length>0?this.props.taskList[0].PieChart.series[0].data:""
           
          },
          series : [
              {
                  name:'合格',
                  type:'pie',
                  selectedMode: 'single',
                radius: ['35%', '55%'],
                label: {
                  normal: {
                    position: 'inner',
                    show : false
                 }
                  },
              labelLine: {
                  show: false
              },
    
               
                  data:  this.props.taskList.length>0?this.props.taskList[0].PieChart.series[0].data:""  ,
               
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
                // data: 
                
                // ["党群部（党委宣传部）",
                // "采购部",
                // "项目管理部",
                // "公众研发事业部",
                // "创新与合作研发事业部",
                // "公共平台与架构研发事业部",
                // "运营保障与调度中心",
                // "计费结算中心",
                // "集客与行业研发事业部",
                // "共享资源中心",
                // "纪委",
                // "政企与行业研发事业部",
                // "创新与能力运营事业部",
                // "客户服务研发事业部",
                // "公共平台与架构部",
                // "软件开发部",
                // "项目与质量支撑部",
                // "运营支撑部",
                // "管理层",
                // "办公室（党委办公室）",
                // "财务部",
                // "人力资源部（党委组织部）",
                // "需求分析部"]
            },
            series : [
              
                {
                  name:'不合格',
                  type:'pie',
                  selectedMode: 'single',
                  radius: ['35%', '55%'],
                  label: {
                    normal: {
                      position: 'inner',
                      show : false
                   }
                    },
                labelLine: {
                    show: false
                },
            
                  data:  this.props.taskList.length>0?this.props.taskList[0].PieChart.series[1].data:""  ,
               
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
              // data: 
              // ["党群部（党委宣传部）",
              // "采购部",
              // "项目管理部",
              // "公众研发事业部",
              // "创新与合作研发事业部",
              // "公共平台与架构研发事业部",
              // "运营保障与调度中心",
              // "计费结算中心",
              // "集客与行业研发事业部",
              // "共享资源中心",
              // "纪委",
              // "政企与行业研发事业部",
              // "创新与能力运营事业部",
              // "客户服务研发事业部",
              // "公共平台与架构部",
              // "软件开发部",
              // "项目与质量支撑部",
              // "运营支撑部",
              // "管理层",
              // "办公室（党委办公室）",
              // "财务部",
              // "人力资源部（党委组织部）",
              // "需求分析部"]
          },
          series : [
            
            
            {
              name:'安全隐患',
              type:'pie',
              selectedMode: 'single',
              radius: ['35%', '55%'],
              label: {
                normal: {
                  position: 'inner',
                  show : false
               }
                },
            labelLine: {
                show: false
            },
              data: 
              this.props.taskList.length>0?this.props.taskList[0].PieChart.series[2].data:""  ,
           
          },
          ]
  
        
      }}

// 绘制柱状图
const getOptionAxis6 = () => {

  return {
   
              // 鼠标移入显示数据
      　　    tooltip : { trigger: 'axis' },
              legend: { 
                data:['表扬','不合格','安全隐患'] 
              },
              grid: {
                bottom: '20%',
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
              data: this.props.taskList.length>0?this.props.taskList[0].ourHospital.xAxis[0].data:""  ,
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
            series:  this.props.taskList.length>0?this.props.taskList[0].ourHospital.series:""  ,
    
        
  };
};
    return (
      
      <div className={styles.outerField}>
        <div className={styles.out}>
          <div className={styles.title} style={{marginBottom:"20px"}}>
          统计报告详情
          </div>
          
          <div display={{height:"20px"}}>
          <Button onClick={this.goBackPage} style = {{float: 'right'}} size="default" type="primary" >
									<a href="javascript:history.back(-1)">返回</a>
							</Button>
              
         
          </div>
         
          
          {
          this.props.taskList.length>0?( this.props.taskList[0].statisticsStatus=="0"?
           ( <div >
            {this.props.usename==this.props.taskList[0].publisher?

                <div>
                      {this.props.roleType == '1' ?
                    (<div >
                        {/* 总院 */}
                          <Button type="primary" className={styles.buttonSubmit} onClick={this.bssubmit}>报送安委办领导</Button>
                          <Button type="primary" className={styles.buttonSubmit} onClick={this.jcsubmit}>检查通报</Button>
                          <Button type="primary" className={styles.buttonSubmit} onClick={this.fbsubmit}>信息发布</Button>
                          <Button type="primary" className={styles.buttonSubmit} onClick={this.bcsubmit}>保存</Button>
                      </div >)
                    :""}
                      {this.props.roleType == '2' ?( 
                      < div >
                        {/* 分院 */}
                          <Button type="primary" className={styles.buttonSubmit} onClick={this.bssubmit}>报送安委办</Button>
                          <Button type="primary" className={styles.buttonSubmit} onClick={this.bsyzsubmit}>报送办公室/主管副院长</Button>
                          <Button type="primary" className={styles.buttonSubmit} onClick={this.jcsubmit}>检查通报</Button>
                          <Button type="primary" className={styles.buttonSubmit} onClick={this.fbsubmit}>信息发布</Button>
                          <Button type="primary" className={styles.buttonSubmit} onClick={this.bcsubmit}>保存</Button>
                      </div>)
                      :""}
                      </div>
                        :""}
          
           
              <span style={{display: this.state.showNewReport2,marginTop:"10px"}}>
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

                <span style={{display: this.state.showNewReport3,marginTop:"10px"}}>
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
          </div>
          ):""
          ):""
          }
          
        

        
                    {taskList.length > 0 ?
                     <div className={styles.bgc}>
                     <div className={styles.lineOutcenter1}>
                       <div className={styles.lineOut2}>
                           <span className={styles.lineKey}>
                           发布人
                           </span>
                           <span className={styles.lineColon}>:</span>
                           <span>{taskList[0].publisher}</span>
                       </div>
                       <div className={styles.lineOut2}>
                           <span className={styles.lineKey}>
                           标题
                           </span>
                           <span className={styles.lineColon}>:</span>
                           <span>{taskList[0].title}</span>
                       </div>
                       <div className={styles.lineOut2}>
                           <span className={styles.lineKey}>
                           检查时间范围
                           </span>
                           <span className={styles.lineColon}>:</span>
                           <span>{taskList[0].theTimeStart.substring(0,16)}～{taskList[0].theTimeEnd.substring(0,16)}</span>
                       </div>
                       </div>
                     <div className={styles.lineOut2}>
                           <span className={styles.lineKey}>
                           检查结果
                           </span>
                           <span className={styles.lineColon}>:</span>
                             <div className={styles.textdiv}>
                                           <TextArea
                                           placeholder="请输入" 
                                            defaultValue={taskList[0].inspectionResults}
                                           onChange={this.textinpu}
                                           />
                                           
                            </div>
                            </div>
                    <div className={styles.lineOutimg}>
                        {taskList[0].statisticsStatus=="0"? 
                         <span>
                            

                              {
                                
                            examineImgId!=undefined&&examineImgId.length>0?
                            <div style = {{width: 300,marginLeft: 90, marginTop: 13}}>
                            <FileUpload dispatch={this.props.dispatch} fileList ={examineImgId}  loading = {this.props.loading}
                            pageName='chaungjianbaogaoxiangqing' len = {this.props.examineImgId && this.props.examineImgId.length}/>
                          </div>
                          : examineImgId!=undefined&&examineImgId.length==0?
                          <div style = {{width: 300,marginLeft: 90, marginTop: 13}}>
                          <FileUpload dispatch={this.props.dispatch} fileList ={[]}  loading = {true} flag={'nullData'}
                          pageName='chaungjianbaogaoxiangqing' len = {this.props.examineImgId && this.props.examineImgId.length}/>
                          </div>
                          :null
                          
                          }
                          <Modal visible={this.props.previewVisible} footer={null} onCancel={()=>this.returnModel('handleCancel')}>
                                  <img alt="example" style={{ width: '100%' }} src={this.props.previewImage} />
                              </Modal>
                          </span>
                          

                        :
                        <span>
                           <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                      </Modal>
                      <div style={{width:420,overflow:"hidden", marginLeft: 90}}>
                      <PicShow 
                          fileList = {examineImgId!=undefined?examineImgId:[]} 
                          visible = {this.state.previewVisible} 
                          handlePreview = {this.handlePreview}/>
                      </div>
                        </span>
                        }
                       
                    </div>  
                    

         
          <div >
            <div className={styles.lineOut3}>
                   
            {taskList[0].ou?
                    <Card style = {{marginBottom:10}} title={
                                    <span style = {{fontWeight:900}}>
                                      <h2>各分院数据统计:</h2>
                                      
                                      </span>
                                    }
                                    extra={<h4 style={{display:"inlinblock"}} onClick={this.gefenyuan}> <a style={{marginLeft:'25px'}}>详情</a> </h4>}>
                               <ReactEcharts option={getOptionAxis(  )}
                              style={{
                                  width: '100%',
                                  height:'400px'
                                 }}
                              />
                            </Card> 
                     :""}
                     {taskList[0].PieChart?
                     <div>
                      <Card style = {{marginBottom:10}} title={
                                    <span style = {{fontWeight:900}}>
                                      <h2>本院各部门合格数据统计:</h2>
                                      
                                      </span>
                                    }
                                    >
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
                                    }
                                    >
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
                                    }
                                    >
                               <ReactEcharts option={getOptionAxis5(  )}
                              style={{
                                  width: '100%',
                                  height:'400px'
                                 }}
                              />
                            </Card> 
                
                         </div> :""}
                         {taskList[0].ourHospital?
                            <Card style = {{marginBottom:10}} title={
                                    <span style = {{fontWeight:900}}>
                                      <h2>本院各部门数据统计:</h2>
                                      
                                      </span>
                                    }
                                    extra={<h4 style={{display:"inlinblock"}} onClick={this.gebumen}> <a style={{marginLeft:'25px'}}>详情</a> </h4>}>
                               <ReactEcharts option={getOptionAxis6(  )}
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
                     
                    :<div style={{textAlign:"cente"}}>暂无数据</div>}
        </div>
      </div>
    )
  }
}

const form1 = Form.create()(chaungjianbaogaoxiangqing);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.chaungjianbaogaoxiangqing,
    ...state.chaungjianbaogaoxiangqing
  };
}
export default connect(mapStateToProps)(form1);
