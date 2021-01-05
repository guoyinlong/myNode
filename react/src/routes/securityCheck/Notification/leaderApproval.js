 /**
 * 作者：郭银龙
 * 日期：2020-5-8
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：领导审批意见 
 */
import React from 'react';
import {connect } from 'dva';
import styles from './tjstyle.less';
import {Form,Radio,Button,Card,Modal} from "antd";
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
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
import ReactEcharts from 'echarts-for-react'
import PicShow from './picShow';
import { routerRedux } from 'dva/router';
class lingdaoshenpiyijian extends React.Component {
  state =  {
    previewVisible: false,
    previewImage: '',
  
};
handleCancel = () => this.setState({ previewVisible: false })
handlePreview = (file) => {
  this.setState({
    previewImage: file.url || file.thumbUrl,
    previewVisible: true,
  });
}


goBackPage = () => {
  // console.log(this.props.taskList[0].noticeState,this.props.taskList[0])
  this.props.dispatch( routerRedux.push({
    pathname:'/adminApp/securityCheck/Notification',
    query: {
      ontabs:JSON.parse(JSON.stringify(this.props.taskList[0].noticeState))
    }
  }));
   
}
  render(){
    const{taskList,examineImgId}=this.props
// console.log(this.props.taskList[0],12345);
var getOptionAxis = () => {


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
              data: ["西安软件研究院",
              "广州软件研究院",
              "南京软件研究院",
              "济南软件研究院",
              "哈尔滨软件研究院"], //this.props.reportList!=""?this.props.reportList[0].ourHospital.xAxis[0].data[0]:""  , ////this.props.reportList.ourHospital.xAxis[0].data
                axisLabel : {//坐标轴刻度标签的相关设置。
                  interval:0,
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
     
          title: {
              text: '本院各部门合格数据统计',
             
          },
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

            title: {
                text: '本院各部门不合格数据统计',
              
            },
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

          title: {
              text: '本院各部门安全隐患数据统计',
            
          },
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
              "需求分析部"], //this.props.reportList!=""?this.props.reportList[0].ourHospital.xAxis[0].data[0]:""  , ////this.props.reportList.ourHospital.xAxis[0].data
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
            series:
         this.props.taskList.length>0?this.props.taskList[0].ourHospital.series:""  ,
    
        
  };
};
    return (
      <div className={styles.outerField}>

        <div className={styles.out}>
          <div className={styles.title}>
          通报意见征求
          </div>
          <Button style = {{float: 'right',marginRight:"15%"}} size="default" type="primary"  onClick={this.goBackPage}>
									<a >返回</a>
							</Button>
              {taskList.length>0?
          <div>
          
          <div className={styles.lineOut1}>
                <span className={styles.lineKey}>
                审批意见
                </span>
                <span className={styles.lineColon}>:</span>
                <span className={styles.colo}>{taskList[0].opinion}</span>

            </div>
          
          <div className={styles.bgc}>
          <div className={styles.lineOutcenter1}>
            <div className={styles.lineOut2}>
                <span className={styles.lineKey}>
                发布人
                </span>
                <span className={styles.lineColon}>:</span>
                <span>{taskList[0].createUserName}</span>
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
                <span>{taskList[0].startTime.substring(0,16)}～{taskList[0].endTime.substring(0,16)}</span>
            </div>
            </div>
          <div className={styles.lineOut3}>
                <span className={styles.lineKey}>
                检查结果
                </span>
                <span className={styles.lineColon}>:</span>
                
          </div>
          <div className={styles.lineOut3}>
            <div className={styles.jieguo}>
               {taskList[0].statisticResult}
            </div>
               
          </div>
            <div className={styles.lineOutimg}>
           
                <span>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
								<img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
							</Modal>
							<div style={{width:420, overflow:"heidden", marginLeft: 200}}>
							<PicShow 
									fileList = {examineImgId!=undefined?examineImgId:[]} 
									visible = {this.state.previewVisible} 
									handlePreview = {this.handlePreview}/>
							</div>
                </span>
            </div>
          </div>
          
          <div >
          <div className={styles.lineOut3}>
{taskList[0].ou?


          <Card style = {{marginBottom:10}} title={
                                    <span style = {{fontWeight:900}}>
                                      <h2>各分院数据统计:</h2>
                                      
                                      </span>
                                    }
                                    >
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
            </div>:""}
            {taskList[0].ourHospital?
            <Card style = {{marginBottom:10}} title={
                                    <span style = {{fontWeight:900}}>
                                      <h2>本部各部门数据统计:</h2>
                                      </span>
                                    }
                                    >
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

          :""}
        </div>
      </div>
    )
  }
}

const form1 = Form.create()(lingdaoshenpiyijian);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.lingdaoshenpiyijian,
    ...state.lingdaoshenpiyijian
  };
}
export default connect(mapStateToProps)(form1);
