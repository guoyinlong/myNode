/*
 * 作者：刘东旭
 * 日期：2017-11-16
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：一点看全-人均产能组件
 */
import React from 'react'; //引入react
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar' //引入柱状图表
import 'echarts/lib/chart/line' //引入折线图表
import 'echarts/lib/component/tooltip' //图表提示
import 'echarts/lib/component/toolbox' //图表提示色点
import request from '../../../utils/request';


//导入echarts
// let echarts = require('echarts/lib/echarts');

//定义组件
export default class Capacity extends React.PureComponent {
  //配置状态
  constructor(props) {
    super(props);
  }

  //配置图表属性及基本样式
  setCapacityOption = (data) => {
    return {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        y: 40,
        y2: 25
      },
      toolbox: {
        show: true,
        feature: {
          magicType: {show: true, type: ['line', 'bar']},
        }
      },
      calculable: true,
      xAxis: [
        {
          show: true,
          type: 'category',
          data: JSON.parse(data.xAxis)
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: {
        name: data.DataRows[0].name,
        type: 'bar',
        barGap: '10%',
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        barWidth: '40%',
        itemStyle: {
          normal: {
            color: function (params) {
              // build a color map as your need.
              let colorList = [
                '#c4ccd3', '#d48265', '#c23531'
              ];
              return colorList[params.dataIndex]
            }
          }
        },
        data: JSON.parse(data.DataRows[0].data).map(function (num) {
          let newNum;
          newNum = JSON.parse(num).toFixed(2).replace(/\,/ig, '');
          return newNum
        })
      }
    }//return结束
  };

  //生命周期进行中
  componentDidMount() {
    let postData = {'arg_ou': '联通软件研究院'};
    let queryData = request('/microservice/overview/search_dept_per_capacity', postData);
    queryData.then(capacityData => {
      if (capacityData.RetCode === '1') {
        let data = capacityData;
        let myChart = echarts.init(this.refs.capacityReact); //初始化echarts
        let options = this.setCapacityOption(data);//要定义一个setCapacityOption函数将data传入option里面
        myChart.setOption(options) //设置options
      }
    });
  }

  //渲染到DOM，此处宽高为相对单位，便于做自适应
  render() {
    return (
      <div ref="capacityReact" style={{width: "100%", height: "30vh"}}></div>
    )
  } //渲染结束
} //组件结束
