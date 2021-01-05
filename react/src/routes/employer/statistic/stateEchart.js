/**
 * 作者：张楠华
 * 日期：2017-09-20
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：个人考核考核结果柱状图
 */
import React, {Component} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/grid';
import {OU_HQ_NAME_CN} from '../../../utils/config'
/**
 * 作者：张楠华
 * 创建日期：2017-09-20
 * 功能：个人考核考核结果柱状图展示
 */
class StateEchart extends Component {
  constructor(props) {
    super(props);
  }
  /**
   * 作者：张楠华
   * 创建日期：2017-09-20
   * 功能：通过componentWillReceiveProps实现柱状图展示
   */
  componentWillReceiveProps() {
    // 基于准备好的dom，初始化echarts实例
    var myChart;
    const {checkList, valueList,temp,ischeck} = this.props;
    // 绘制图表
    if (ischeck == 1 && temp == false) {
      myChart = echarts.init(document.getElementById('main'));
      myChart.resize();

      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['未填报', '已填报', '待审核', '已审核'],
        },
        toolbox: {
          show: true,
          //orient: 'vertical',
          feature: {
            mark: {show: true},
            dataView: {show: false, readOnly: false},
            magicType: {show: true, type: ['stack', 'tiled']},
            restore: {show: true},
            saveAsImage: {show: true},
          },
          right:'43px'
        },
        grid: {
          x:180,
          x2: 150,
          y2: 150,
        },
        calculable: true,
        xAxis: [
          {
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: (function () {
              let res = [];
              let i = 0;
              let len = checkList.length;
              for (i = len-2; i >= 0; i--) {
                res.push(checkList[i].deptname.split("-")[1]);
              }
              return res;
            })(),
            //设置字体倾斜
            axisLabel: {
              interval: 0,
              //rotate: 36,//倾斜度 -90 至 90 默认为0
              // formatter:function(val){
              //   return val.split("").join("\n");
              // }
            },
          }
        ],
        series: [
          {
            name: '未填报',
            type: 'bar',
            stack: '总量',
            itemStyle: {normal: {label: {show: false}}},
            data: (function () {
              let res = [];
              let i = 0;
              let len = checkList.length;
              for (i = len-2; i >= 0; i--) {
                res.push(checkList[i].noFill);
              }
              return res;
            })()
          },
          {
            name: '已填报',
            type: 'bar',
            stack: '总量',
            itemStyle: {normal: {label: {show: false}}},
            data: (function () {
              let res = [];
              let i = 0;
              let len = checkList.length;
              for (i = len-2; i >= 0; i--){
                res.push(checkList[i].numdept);
              }
              return res;
            })()
          },
          {
            name: '待审核',
            type: 'bar',
            stack: '总量',
            itemStyle: {normal: {label: {show: false}}},
            data: (function () {
              let res = [];
              let i = 0;
              let len = checkList.length;
              for (i = len-2; i >= 0; i--){
                res.push(checkList[i].Pending_audit);
              }
              return res;
            })()
          },
          {
            name: '已审核',
            type: 'bar',
            stack: '总量',
            itemStyle: {normal: {label: {show: false}}},
            data: (function () {
              let res = [];
              let i = 0;
              let len = checkList.length;
              for (i = len-2; i >= 0; i--) {
                res.push(checkList[i].Audited);
              }
              return res;
            })()
          },
        ]
      });
    }

    if (ischeck == 0 && temp == false) {
      myChart = echarts.init(document.getElementById('main'));
      myChart.resize();
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['完成情况已填报', '待评价', '待评级', '考核完成']
        },
        toolbox: {
          show: true,
          //orient: 'vertical',
          feature: {
            mark: {show: true},
            dataView: {show: false, readOnly: false},
            magicType: {show: true, type: ['stack', 'tiled']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        grid: {
          x1:180,
          x2: 150,
          y2: 150,
        },
        calculable: true,
        xAxis: [
          {
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: (function () {
              let res = [];
              let i = 0;
              let len = valueList.length;
              for (i = len-2; i >= 0; i--) {
                res.push(valueList[i].deptname.split("-")[1]);
              }
              return res;
            })(),
            //设置字体倾斜
            axisLabel: {
              interval: 0,
              //rotate: 45,//倾斜度 -90 至 90 默认为0
              // formatter:function(val){
              //   return val.split("").join("\n");
              // }
            },
          }
        ],
        series: [
          {
            name: '完成情况已填报',
            type: 'bar',
            stack: '总量',
            itemStyle: {normal: {label: {show: false}}},
            data: (function () {
              let res = [];
              let i = 0;
              let len = valueList.length;
              for (i = len-2; i >= 0; i--) {
                res.push(valueList[i].finishperson);
              }
              return res;
            })()
          },
          {
            name: '待评价',
            type: 'bar',
            stack: '总量',
            itemStyle: {normal: {label: {show: false}}},
            data: (function () {
              let res = [];
              let i = 0;
              let len = valueList.length;
              for (i = len-2; i >= 0; i--){
                res.push(valueList[i].pending_evaluation);
              }
              return res;
            })()
          },
          {
            name: '待评级',
            type: 'bar',
            stack: '总量',
            itemStyle: {normal: {label: {show: false}}},
            data: (function () {
              let res = [];
              let i = 0;
              let len = valueList.length;
              for (i = len-2; i >= 0; i--) {
                res.push(valueList[i].evaluation_completion);
              }
              return res;
            })()
          },
          {
            name: '考核完成',
            type: 'bar',
            stack: '总量',
            itemStyle: {normal: {label: {show: false}}},
            data: (function () {
              let res = [];
              let i = 0;
              let len = valueList.length;
              for (i = len-2; i >= 0; i--){
                res.push(valueList[i].assessment_completed);
              }
              return res;
            })()
          },
        ]
      });
    }

  }

  render() {
    const {ou} = this.props;
    const style1 = (ou === OU_HQ_NAME_CN) ? {width: 900, height: 550, marginTop: 10} : {
      width: 900,
      height: 551,
      marginTop: 10
    };
    return (
      <div id='main' style={style1}>
      </div>
    )
  }
}

export default StateEchart;
