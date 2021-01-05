/*
 * 作者：刘东旭
 * 日期：2017-10-30
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：一点看全-饼状图组件
 */
import React from 'react'; //引入react
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie' //引入饼状图表
import 'echarts/lib/component/tooltip' //图表提示
import 'echarts/lib/component/toolbox' //图表提示色点

import request from '../../../utils/request';

//导入echarts
// let echarts = require('echarts/lib/echarts');

//定义名为Pie的饼状图组件
export default class Pie extends React.PureComponent {

  //配置状态
  constructor(props) {
    super(props);
  }


  //配置图表属性及基本样式
  setPieOption = (data) => {
    return {
      tooltip: {
        trigger: 'item',
        formatter:  function (params) {
          return [params.data.justName] + '<br/>项目类型 : ' + [params.data.type] + '<br/>项目数量 : ' + [params.data.value] + '<br/>资金(万元) : ' + [params.data.replaceMoney]
        }
      },
      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series: {
        name: '详情',
        type: 'pie',
        radius : '55%',
        center: ['50%', '50%'],
        data:data.length?
          data.map(function (item) {
            return (
              {
                value: item.proj_type_count,
                name: item.proj_type_name + '('+ item.proj_type_count + ')',
                replaceMoney: item.replace_money,
                type: item.proj_type_code,
                justName: item.proj_type_name,
              }
            )
          }).sort(function (a, b) { return a.value - b.value; })
          :
          [],
        roseType: 'radius',
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    }//return结束
  };

  //生命周期进行中
  componentDidMount() {
    let postData = {'arg_ou': '联通软件研究院'};
    let queryData = request('/microservice/overview/search_proj_type_distribute',postData);
    queryData.then(projectTypeData=>{
      if (projectTypeData.RetCode === '1') {
        let data = projectTypeData.DataRows;
        let myChart = echarts.init(this.refs.pieReact); //初始化echarts
        let options = this.setPieOption(data);//要定义一个setPieOption函数将data传入option里面
        myChart.setOption(options) //设置options
      }
    });
  }

  //渲染到DOM，此处宽高为相对单位，便于做自适应
  render() {
    return (
      <div ref="pieReact" style={{width: "100%", height: "30vh"}}></div>
    )
  } //渲染结束

} //组件结束
