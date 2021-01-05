/*
 * 作者：刘东旭
 * 日期：2017-11-16
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：一点看全-投入产出比饼状图组件
 */
import React from 'react'; //引入react
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie' //引入饼状图表
import 'echarts/lib/component/title' //图表标题
import 'echarts/lib/component/tooltip' //图表提示
import 'echarts/lib/component/toolbox' //图表提示色点
import request from '../../../utils/request';

//导入echarts
// let echarts = require('echarts/lib/echarts');

//定义组件
export default class InputOutput extends React.PureComponent {

  //配置状态
  constructor(props) {
    super(props);
  }

  //配置图表属性及基本样式
  setInputOutputOption = (data) => {
    return {
      title : {
        text: '投入产出比(投资替代额/全成本)',
        left:'center',
        bottom: 'bottom',
        textStyle:{
          fontWeight: 'normal',
          color: '#666666',
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return [params.data.tipName] + '<br/>比值 : ' + [params.data.value]
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
      calculable : true,
      series: {
        name: '详情',
        type: 'pie',
        radius: '55%',
        center: ['50%', '45%'],
        data: data.length ?
          data.map(function (item) {
            return (
              {
                value: item.input_output_Ratio,
                name: item.proj_type_code + '(' + item.input_output_Ratio + ')',
                tipName: item.proj_type_name,
              }
            )
          }).sort(function (a, b) {
            return a.value - b.value;
          })
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
    let queryData = request('/microservice/overview/search_proj_type_input_output_ratio', postData);
    queryData.then(projectTypeData => {
      if (projectTypeData.RetCode === '1') {
        let data = projectTypeData.DataRows;
        let myChart = echarts.init(this.refs.inputOutputReact); //初始化echarts
        let options = this.setInputOutputOption(data);//要定义一个setInputOutputOption函数将data传入option里面
        myChart.setOption(options) //设置options
      }
    });
  }

  //渲染到DOM，此处宽高为相对单位，便于做自适应
  render() {
    return (
      <div ref="inputOutputReact" style={{width: "100%", height: "30vh"}}></div>
    )
  } //渲染结束
} //组件结束
