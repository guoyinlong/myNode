/**
 *  作者: 张楠华
 *  创建日期: 2018-8-22
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：项目工时查询PMS详情页。
 */
import React from 'react';
import {Button,Modal,Tabs} from 'antd';
import ReactEcharts from 'echarts-for-react';
import style from '../review/review.less'
const TabPane = Tabs.TabPane;
class PMSDetail extends React.Component {
  state = {
    visible:false,              //是否发送钉钉通知
  };
  pmsDetail=(dispatch,state,projCode)=> {
    this.setState({ visible: true });
    dispatch({
      type:'timeQuery/queryPMSDetail',
      projCode,
      date: state.date,
    });
  };
  onCancel=()=>{
    this.setState({
      visible:false
    });
    this.props.dispatch({
      type:'timeQuery/clearData',
    });
  };
  getOption=(i)=>{
    let option = {
      title:{
        text:'',
        x: 'center',
      },
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          data : [],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel :{
            interval:0
          }
        }
      ],
      yAxis : [
        {
          type : 'value',
        }
      ],
      series : [
        {
          name:'工时',
          type:'bar',
          barWidth: '60%',
          data : [],
        }
      ]
    };
    option.xAxis[0].data=JSON.parse(i.activity_hours_list).map((i)=>{
      return (i.activity_name)
    });
    option.series[0].data=JSON.parse(i.activity_hours_list).map((i)=>{
      return {
        value:parseFloat(i.total_hours), name:i.activity_name
      }
    });
    return option;
  };
  render(){
    const {pmsDetailData,dispatch,state,projCode} = this.props;


    return(
      <div style={{display:'inline',marginLeft:'10px'}}>
        <Button onClick={()=>this.pmsDetail(dispatch,state,projCode)}>PMS详情</Button>
        <Modal
          visible={this.state.visible}
          onCancel={this.onCancel}
          footer={null}
          width="900px"
          title='活动类型工时分布'
        >
          <div>
          {
            pmsDetailData.length !==0?
              <Tabs defaultActiveKey="1" >
                {
                  pmsDetailData.map((i,index)=>{
                    return(
                      <TabPane key={index} tab={i.pms_name} style={{position:'relative'}}>
                        <ReactEcharts
                          option={this.getOption(i)}
                          style={{height: 300}}
                        />
                        <div className={style.totalHour}>
                          <div><b>合计使用工时：</b>{i.whole_hours}(小时)</div>
                        </div>
                      </TabPane>
                    )
                  })
                }
              </Tabs>
              :
              '暂无数据'
          }
          </div>
        </Modal>
      </div>
    )
  }
}

export default  PMSDetail




