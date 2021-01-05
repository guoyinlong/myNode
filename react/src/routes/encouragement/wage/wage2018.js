/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 文件说明：2018年首页信息模板
 */
import Cookie from 'js-cookie'
import Style from './wage.less'
import Title from '../../../components/encouragement/Title'
import HUMAN from '../../../assets/Images/encouragement/pic17.png'
import echarts from "echarts/lib/echarts";
import React from "react";
import  'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/grid';
import SecondLogin from './second_login.js'
import {waterMark,preventCopy,timeStamp,unLockCopy} from "../../../utils/func.js";
function getContent() {
  const text = <div>
    <p className={Style.row}>根据集团级软研院的经营管理理念，软研院构建“多劳多得，多效多得”的市场化全面薪酬体系，从各方方面面保障员工生活，激发员工动力。</p>
  </div>
  return text;
}

function resultNum(info,data){
  if(data == '基本工资'){
    return info.total_basic || 0;
  }else if(data == '激励工资'){
    return info.total_encourage || 0;
  }else if(data == '六险三金'){
    return ((parseFloat(info.total_insurance_company)+parseFloat(info.total_enterprise_company)
     + parseFloat(info.total_enterprise_add_company)+ parseFloat(info.total_supplementary_medical)+ 
     parseFloat(info.special_medical_fund)) || 0)
  }else if(data == '福利补贴'){
    return (parseFloat(info.total_welfare)+parseFloat(info.total_points)) || 0;
  }else if(data == '培训费用'){
    return info.training_fees || 0;
  }else if(data == '其他'){
    return info.annual_tax || 0;
  }else {
    return 0;
  }
};
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 功能：2018年首页信息模板
 */
class TrainingInfoComponent extends React.Component {
  state = {
    pay:''
  }
  /**
   * 功能：组件渲染完后执行操作
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-07-20
   */
  componentDidMount(){
    var myDate = new Date();
    let new_Date=timeStamp(myDate.getTime())
    let temp=`${Cookie.get('username')}${new_Date}`
    waterMark({watermark_txt:temp},this.wage_div)
    preventCopy()

    if(Cookie.get('second_login')=="1"){
      this.init(this.props)
      this.localEmployess(this.props)
    }
  }

  componentWillUnmount(){
    unLockCopy()
  }

  /**
   * 功能：父组件变化后执行操作
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-07-20
   */
  componentWillReceiveProps(nextProps){
    if(Cookie.get('second_login')=="1"){
    this.init(nextProps)
    this.localEmployess(nextProps)
    }
  }

  init = (props) =>{
    let myChart;
    const { info }=props;

    myChart=echarts.init(document.getElementById('main'));
    myChart.setOption({
      tooltip : {
        trigger: 'item',
        formatter: "{b} <br/> 元：{c}"
      },
      color:['#f3627a','#fbd536','#3aa1ff','#975ee5','#4ecb72','#00009C'],
      legend: {
        orient: 'vertical',
        y:'center',
        right:10,
        itemGap:25,
        formatter:function (name) {
          return name +'  :  ' + (info.total_wage ? (resultNum(info,name)*100/info.total_wage).toFixed(2) : '0') + ' %';
        },
        data: [
          {
            name: '基本工资',
            // 强制设置图形为圆。
            icon: 'circle',
            textStyle:{
              //color:'#f3627a',
              fontSize: '20',
              //fontWeight: 'bold'
            }
          },
          {
            name: '激励工资',
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
            name: '六险三金',
            // 强制设置图形为圆。
            icon: 'circle',
            textStyle:{
              // color:'#3aa1ff',
              fontSize: '20',
              //fontWeight: 'bold'
            }
          },
          {
            name: '福利补贴',
            // 强制设置图形为圆。
            icon: 'circle',
            textStyle:{
              // color:'#975ee5',
              fontSize: '20',
              //fontWeight: 'bold'
            }
          },
          {
            name: '培训费用',
            // 强制设置图形为圆。
            icon: 'circle',
            textStyle:{
              // color:'#4ecb72',
              fontSize: '20',
              //fontWeight: 'bold'
            }
          },
          // {
          //   name: '其他',
          //   // 强制设置图形为圆。
          //   icon: 'circle',
          //   textStyle:{
          //     // color:'#4ecb72',
          //     fontSize: '20',
          //     //fontWeight: 'bold'
          //   }
          // }
        ],
      },
      toolbox: {
        show : true,
        feature : {
          mark : {show: true},
          magicType : {show: true, type: ['pie', 'funnel']},
          saveAsImage : {show: false}
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
              value: resultNum(info,'基本工资'),
              name: '基本工资',
            },
            {
              value: resultNum(info,'激励工资'),
              name: '激励工资',
            },
            {
              value: resultNum(info,'六险三金'),
              name: '六险三金',
            },
            {
              value: resultNum(info,'福利补贴'),
              name: '福利补贴',
            },
            {
              value: resultNum(info,'培训费用'),
              name: '培训费用',
            },
            // {
            //   value: resultNum(info,'其他'),
            //   name: '其他',
            // }
          ],
        }]
    });
  }

  localEmployess = (props) => {
    const auth_ou = Cookie.get('OU');
    const {year,info} = props
    const moneyPay = info.avg_wage?parseFloat(info.avg_wage)+'*12='+parseFloat(info.avg_wage)*12+'元':''
    switch (auth_ou) {
      case '联通软件研究院本部':
        this.setState({
          pay:`北京${year-1}年全口径城镇单位就业人员平均工资为：${moneyPay?moneyPay:`${year == 2020 ? '':'94258元'}`}（年）`
        })
        break;
      case '济南软件研究院':
        this.setState({
          pay:`${year-1}年济南市（区划调整后）法人单位在岗职工平均工资为：${moneyPay?moneyPay:`${year == 2020 ? '':'71124元'}`}（年）`
        })
        break;
      case '哈尔滨软件研究院':
        this.setState({
          pay:`哈尔滨市城镇${year-1}年度全省员工平均工资为：${moneyPay?moneyPay:`${year == 2020 ? '':'71772元'}`}（年）`
        })
        break;
      case '广州软件研究院':
        this.setState({
          pay:`广州市${year-1}年度职工平均工资为：${moneyPay?moneyPay:`${year == 2020 ? '':'89400元'}`}元（年）`
        })
        break;
      case '西安软件研究院':
        this.setState({
          pay:`西安市${year-1}年全口径城镇单位就业人员平均工资为：${moneyPay?moneyPay:`${year == 2020 ? '':'71800元'}`}（年）`
        })
        break;
      case '南京软件研究院':
        this.setState({
          pay:`江苏省城镇非私营单位就业人员平均为：${moneyPay?moneyPay:`${year == 2020 ? '':'84688元'}`}（年）`
        })
        break;
    }    

  }
  render(){
    const {info,year,onChange}=this.props;
    const {pay} = this.state
    return(
      <div className={Style.main} ref={(ref)=>this.wage_div=ref}>
        {
          Cookie.get('second_login')=="1"?
          <div>
          <Title title="整体薪酬报告" year = {year} onChange={onChange}
          message={getContent()} imgSrc = {HUMAN}></Title>
  
          <div className={Style.middle}>
            <div className={Style.left}>
              <div className={Style.content}>
                <p>{year}年，您从企业获得的货币总价值如下：</p>
                <div className={Style.classify}>
                  <div>基本工资</div>
                  <div>
                    <p className={Style.total}>共：<span className={Style.line}>{info.total_basic}</span>元，含：</p>
                    <p>岗位工资：<span className={Style.line}>{info.basic_wage}</span>元</p>
                    <p>月度绩效工资：<span className={Style.line}>{info.monthly_performance_pay}</span>元</p>
                    <p>综合补贴：<span className={Style.line}>{info.comprehensive_subsidy}</span>元</p>
                  </div>
                </div>
                <div className={Style.classify}>
                  <div>激励工资</div>
                  <div>
                    <p className={Style.total}>共：<span className={Style.line}>{info.total_encourage}</span>元，含：</p>
                    <p>季度绩效工资：<span className={Style.line}>{info.quarterly_performance_pay}</span>元</p>
                    <p>年度绩效工资：<span className={Style.line}>{info.annual_performance_pay}</span>元</p>
                    <p>专项奖励：<span className={Style.line}>{info.special_reward}</span>元</p>
                    <p>其他：<span className={Style.line}>{info.other_reward}</span>元</p>
                  </div>
                </div>
                <div className={Style.classify}>
                  <div>六险三金</div>
                  <div>
                    <p>五险一金(公司)：<span className={Style.line}>{info.total_insurance_company}</span>元</p>
                    <p>企业年金(公司)：<span className={Style.line}>{info.total_enterprise_company}</span>元</p>
                    <p>企业年金补缴(公司)：<span className={Style.line}>{info.total_enterprise_add_company}</span>元</p>
                    <p>补充医疗保险：<span className={Style.line}>{info.total_supplementary_medical}</span>元</p>
                    <p>特需医疗基金：<span className={Style.line}>{info.special_medical_fund}</span>元</p>
                  </div>
                </div>
                <div className={Style.classify}>
                  <div>福利</div>
                  <div>
                    <p>福利补贴：<span className={Style.line}>{info.total_welfare}</span>元</p>
                    <p>弹性福利积点：<span className={Style.line}>{info.total_points}</span>元</p>
                  </div>
                </div>
                <div className={Style.classify}>
                  <div>培训</div>
                  <div>
                    <p>培训费用：<span className={Style.line}>{info.training_fees}</span>元</p>
                  </div>
                </div>
                <div className={Style.classify}>
                  <div>其他</div>
                  <div>
                    <p>代扣代缴个人所得税：<span className={Style.line}>{info.annual_tax}</span>元</p>
                    <p>五险一金(个人)：<span className={Style.line}>{info.total_insurance_personal}</span>元</p>
                    <p>企业年金(个人)：<span className={Style.line}>{info.total_enterprise_personal}</span>元</p>
                    <p>企业年金补缴(个人)：<span className={Style.line}>{info.total_enterprise_add_personal}</span>元</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={Style.right}>
              <div className={Style.content}>
                <p className={Style.tip +' '+ Style.center}>{year}年度，您的整体货币总价值结构如下</p>
                <div id='main' style = {{ width: 800, height: 350,marginLeft:-240,marginBottom:100}}>
                </div>
                <p className={Style.tip+ ' ' + Style.center}>{year}年度，您从企业获得的货币总价值：{info.total_wage?info.total_wage+'元':''}</p>
                <p className={Style.tip + ' ' + Style.center}>{pay?pay:''}</p>
              </div>
            </div>
          </div>
          </div>
          :
        <SecondLogin></SecondLogin>
        }
      </div>
    )
  }
}
export default TrainingInfoComponent;
