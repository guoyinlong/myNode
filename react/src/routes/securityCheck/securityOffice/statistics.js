/**
 * 作者：窦阳春
 * 日期：2020-6-6
 * 邮箱：douyc@itnova.com.cn
 * 功能：安委办检查模块检查结果统计
 */ 
import React from 'react'; //引入react
import echarts from "echarts/lib/echarts";
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox'; 
import 'echarts/lib/chart/bar' //引入柱状图表
import 'echarts/lib/chart/line';//折线图
import 'echarts/lib/chart/pie';//饼状图
//定义组件
export default class Statistics extends React.PureComponent {
    //配置状态
    constructor(props) {
      super(props);
    }
    componentDidMount() {
      let myChart = echarts.init(this.refs.capacityReact); //初始化
      let {statisticsData} = this.props
      statisticsData.xAxis[0].axisLabel={interval: 0, rotate:20}
      myChart.setOption({
        legend: {},
        tooltip: {},
        toolbox: {
          show: true,
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
            }
        },
        xAxis : statisticsData.xAxis,
    　　yAxis : statisticsData.yAxis,
        series : statisticsData.series
      }) //设置options
    }
    //渲染到DOM，此处宽高为相对单位，便于做自适应
    render() {
      return (
        <div ref="capacityReact" style={{width: "100%", height: "30vh"}}></div>
      )
    } //渲染结束
  
  } //组件结束
  