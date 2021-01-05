/**
 * 作者：郭银龙
 * 日期：2020-10-13
 * 邮箱：guoyl@itnova.com.cn
 * 功能：统计报表
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
    class Statistics extends React.Component{
    //配置状态
    
    constructor(props) {
        super(props);
      }
    
    componentDidMount() {
      var that=this
      let myChart = echarts.init(this.refs.capacityReact); //初始化
      let {statisticsData} = this.props
      statisticsData.xAxis.axisLabel={interval: 0, rotate:20}
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
      }) 
      myChart.on("click", function (param) {
        that.props.dispatch({
            type:'statisticalReport/onMyChart',
            value:param.name
          })
    })
    }
    componentDidUpdate() {
      var that=this
      let myChart = echarts.init(this.refs.capacityReact); //初始化
      let {statisticsData} = this.props
      statisticsData.xAxis.axisLabel={interval: 0, rotate:20}
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
      }) 
  
    }

    
    render() {
      return (
        <div ref="capacityReact" style={{width: "100%", height: 400}}></div>
      )
    } 
  
  } 
  export default Statistics;