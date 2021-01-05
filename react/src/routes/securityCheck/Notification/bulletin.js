 /**
 * 作者：郭银龙
 * 日期：2020-5-8
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：通报意见
 */
import React from 'react';
import {connect } from 'dva';
import styles from './tjstyle.less'; 
import {Form,Radio,Button,Modal,Card} from "antd";
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
import ReactEcharts from 'echarts-for-react';
import PicShow from './picShow';
import { routerRedux } from 'dva/router';
class tongbaoyijianla extends React.Component {
  state =  {
    value:1,
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

// console.log(taskList[0])

var getOptionAxis = () => {


  return { 
    title: { text: '本院各部门数据统计:' },
            // 鼠标移入显示数据
    　　    tooltip : { trigger: 'axis' },
            legend: { 
              data:['表扬','不合格'] 
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
              
              data: taskList.length>0?taskList[0].ourHospital.xAxis[0].data:"",
              // ["西安软件研究院",  "广州软件研究院",  "南京软件研究院",  "济南软件研究院",  "哈尔滨软件研究院"],
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
            series:   taskList.length>0?taskList[0].ourHospital.series:"",
      
        
  };
}; 



    return (
      <div className={styles.outerField}>

        <div className={styles.out}>
          <div className={styles.title}>
          通报意见
          </div>
           <Button style = {{float: 'right',marginRight:"15%"}} size="default" type="primary"  onClick={this.goBackPage}>
									<a >返回</a>
							</Button>
          
{taskList.length>0?



          <div>
          <div className={styles.lineOutcenter1}>
            <div className={styles.lineOut1}>
                <span className={styles.lineKey}>
                发布人
                </span>
                <span className={styles.lineColon}>:</span>
                <span>{taskList[0].createUserName}</span>
            </div>
            <div className={styles.lineOut1}>
                <span className={styles.lineKey}>
                检查时间
                </span>
                <span className={styles.lineColon}>:</span>
                <span>{taskList[0].startTime.substring(0,16)}～{taskList[0].endTime.substring(0,16)}</span>
            </div>
            <div className={styles.lineOut1}>
                <span className={styles.lineKey}>
                检查主题
                </span>
                <span className={styles.lineColon}>:</span>
                <span>{taskList[0].taskTitle}</span>
            </div>
            <div className={styles.lineOut1}>
                <span className={styles.lineKey}>
                检查方式
                </span>
                <span className={styles.lineColon}>:</span>
                <span>
                 
              {taskList[0].taskType==="safeCheck"?"安委办统查"
                    :(taskList[0].taskType==="safeSpotCheck"?"安委办抽查"
                      :(taskList[0].taskType==="specialCheck"?"专项检查"
                          :(taskList[0].taskType==="branchSpecialCheck"?"分院专项检查"
                                  :(taskList[0].taskType==="deptSelfCheck"?"部门自查"
                                          :(taskList[0].taskType==="deptEoCheck"?"部门间互查"
                                                :(taskList[0].taskType==="deptSafeCheck"?"部门统查"
                                                        :(taskList[0].taskType==="deptSportCheck"?"部门抽查"
                                                            :(taskList[0].taskType==="staffSelfCheck"?"员工自查"
                                                                :(taskList[0].taskType==="workNotified"?"工作通知":null)
                                                          )
                                                      )
                                                  )
                                            )
                                      )
                                )
                        )
                    )
                }</span>
            </div>
            <div className={styles.lineOut1}>
                <span className={styles.lineKey}>
                检查对象
                </span>
                <span className={styles.lineColon}>:</span>
                <span>{taskList[0].examineObj}</span>
            </div>

          </div>
          <div className={styles.lineOut2}>
                <span className={styles.lineKey}>
                检查结果
                </span>
                <span className={styles.lineColon}>:</span>
                <div className={styles.jieguo}>
                <div style={{marginTop:10}}> 
                  任务结果：{taskList[0].content} 
                  </div>
                  <div style={{marginTop:10}}> 
                  下一步要求：{taskList[0].nextRequest} 。
                  </div>
                  <div style={{marginTop:10}}> 
                  检查内容：{taskList[0].examContent} 。
                  </div>
                  </div>
            </div>
            <div className={styles.lineOutimg}>
                
                <span>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
								<img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
							</Modal>
							<div style={{width:420,  marginLeft: 200}}>
							<PicShow 
									fileList = {examineImgId!=undefined?examineImgId:[]} 
									visible = {this.state.previewVisible} 
									handlePreview = {this.handlePreview}/>
							</div>
                </span>
            </div>
         
          <div className={styles.lineOut3}>
            {taskList[0].ourHospital?
            
          <Card style = {{marginBottom:10}} title={
                                    <span style = {{fontWeight:900}}>
                                      <h2>本院各部门数据统计:</h2>
                                      
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
            </div>
           
           </div>
           :<div style={{textAlign:"center"}}>暂无数据</div>}
        
        </div>
      </div>
    )
  }
}

const form1 = Form.create()(tongbaoyijianla);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.tongbaoyijianla,
    ...state.tongbaoyijianla
  };
}
export default connect(mapStateToProps)(form1);
