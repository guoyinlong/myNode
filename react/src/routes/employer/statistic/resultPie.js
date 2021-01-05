/**
 * 作者：张楠华
 * 日期：2017-09-20
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：个人考核考核结果饼图显示
 */
import React from 'react';
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/grid';
/**
 * 作者：张楠华
 * 创建日期：2017-09-20
 * 功能：个人考核考核结果饼图显示
 */
class ResultPie extends React.Component {
  constructor(props){
    super(props);
  }
  /**
   * 作者：张楠华
   * 创建日期：2017-09-20
   * 功能：统计等级数据和
   * @param data 考核结果等级
   */
  resultNum=(data)=>{
    const { resultList } = this.props;
    let i=0,j2=0;
    let len = resultList.length;
    for(i=0;i<len;i++){
      if(resultList[i].rank===data){
        j2++;
      }
    }
    return j2;
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-20
   * 功能：通过componentWillReceiveProps实现饼图展示
   */
  componentWillReceiveProps(){
    let myChart;
    const { temp,resultList }=this.props;
    if(temp === false){
      myChart=echarts.init(document.getElementById('main'));
      myChart.setOption({
        tooltip : {
          trigger: 'item',
          formatter: "{b} <br/> 个数：{c}"
        },
        color:['#f3627a','#fbd536','#3aa1ff','#975ee5','#4ecb72'],
        legend: {
          orient: 'vertical',
          y:'center',
          right:10,
          itemGap:25,
          formatter:function (name) {
            if(resultList.length !== 0){
              let j=0;
              let len = resultList.length;
              let name1 =name;
              if(name === '未考核'){
                name1 = '';
              }else if( name === 'D/E'){
                name1 = 'D';
              }
              for(let i=0;i<len;i++){
                if(resultList[i].rank === name1){
                  j++;
                }
              }
              return name +'  :  '+ (j/len * 100).toFixed(2) + ' %';
            }else{
              return name +'  :  0.00 %';
            }
          },
          data: [
            {
              name: 'A',
              // 强制设置图形为圆。
              icon: 'circle',
              textStyle:{
                //color:'#f3627a',
                fontSize: '20',
                //fontWeight: 'bold'
              }
            },
            {
              name: 'B',
              // 强制设置图形为圆。
              icon: 'circle',
              // 设置文本为红色.
              textStyle:{
                //color:'#fbd536',
                fontSize: '20',
                //fontWeight: 'bold'
              }
            },
            {
              name: 'C',
              // 强制设置图形为圆。
              icon: 'circle',
              textStyle:{
               // color:'#3aa1ff',
                fontSize: '20',
                //fontWeight: 'bold'
              }
            },
            {
              name: 'D/E',
              // 强制设置图形为圆。
              icon: 'circle',
              textStyle:{
               // color:'#975ee5',
                fontSize: '20',
                //fontWeight: 'bold'
              }
            },
            {
              name: '未考核',
              // 强制设置图形为圆。
              icon: 'circle',
              textStyle:{
               // color:'#4ecb72',
                fontSize: '20',
                //fontWeight: 'bold'
              }
            }
          ],
        },
        toolbox: {
          show : true,
          feature : {
            mark : {show: true},
            magicType : {show: true, type: ['pie', 'funnel']},
            saveAsImage : {show: true}
          },
          right:'40px'
        },
        calculable : true,
        series : [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.resultNum('A'),
                name: 'A',
              },
              {
                value: this.resultNum('B'),
                name: 'B',
              },
              {
                value: this.resultNum('C'),
                name: 'C',
              },
              {
                value: this.resultNum('D')+this.resultNum('E'),
                name: 'D/E',
              },
              {
                value: this.resultNum(''),
                name: '未考核',
              }
            ],
          }]
      });
    }
  };

  render() {
    return(
        <div id='main' style = {{ width: 800, height: 350}}>
        </div>
    )
  }
}
export default ResultPie;
