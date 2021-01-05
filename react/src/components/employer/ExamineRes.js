/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-05
 * 文件说明：员工考核结果卡片式组件
 */
import Cookie from 'js-cookie';
import {Progress,Tooltip,Icon} from 'antd'
import Style from './employer.less'
const text = <span>年度考核得分计算规则：<br/>
              1.季度考核占比90%，员工互评占比10%。<br/>
              2.季度考核成绩A:1.25  B:1.1  C:1  D:0.6  E:0。<br/>
              3.四季度占比分别为2、2、2、4，未参与考核的季度占比平分至其余季度。<br/>
            </span>;
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-05
 * 功能：员工考核结果卡片式组件，展示考核周期、考核结果、考核得分、贡献度
 */
class ExamineRes extends React.Component {
  seasonMap={
    0:'年度考核',
    1:'第一季度',
    2:'第二季度',
    3:'第三季度',
    4:'第四季度',
  }
  seasonMapColor={
    1:'res_spring',
    2:'res_summer',
    3:'res_autumn',
    4:'res_winner',
  }
  stateMap={
    0:{state:'待提交',percent:20},
    1:{state:'待审核',percent:40},
    2:{state:'审核未通过',percent:40},
    A:{state:'完成情况未填报',percent:50},
    3:{state:'待评价',percent:60},
    4:{state:'待确认',percent:60},
    5:{state:'复议',percent:60},
    6:{state:'待评级',percent:80},
    7:{state:'待评级',percent:90},
    8:{state:'待评级',percent:90},
    9:{state:'待评级',percent:90},
    10:{state:'考核完成',percent:100}
  };
/*<div className={season? Style[this.seasonMapColor[season]]:'' }>*/
  render(){
    const{season,state,score,cont_degree,rank,cardClickHandle,adjust_reason,mutual_score}=this.props;
    return(
      <div className={Style.res_div} onClick={cardClickHandle}>
        {state?<div>
            <div className={Style.resCardTop}>
              <div>
                <div>
                  <p>{state == '10' ?rank :'?'}</p>
                </div>
                <div>
                  {season == '0' ?
                    <p style={{"color":'#FA7252'}}>{season?this.seasonMap[season]:''}</p>
                    :
                    <p>{season?this.seasonMap[season]:''}</p>
                  }

                </div>

              </div>
              <div>
                <Progress className={Style.progress} style={{color:state == '2'?'red':null}} gapPosition = {'bottom'} width={96} strokeWidth={6}  type="circle" percent={state? this.stateMap[state].percent:0} format={()=>state?this.stateMap[state].state:''} />
              </div>
            </div>

            <div className={Style.resCardBottom}>
              {season == '0'?
                <div className={Style.annualScore}>
                  <p>员工互评得分<span></span>{state == '10'?mutual_score:'?'}</p>
                  <p>年度考核得分<span></span>{state == '10'?score:'?'}</p>
                  <Tooltip  title={text} placement="bottomLeft"><Icon style={{marginLeft:'5px'}} type="question-circle"/></Tooltip>
                </div>
                :
                <div>
                  <p>考核得分<span></span>{state == '10'?score:'?'}</p>
                </div>
              }
              <div>
                <p>贡献度<span></span>{state == '10'?cont_degree:'?'}</p>
                {state == '10'?<Tooltip  title={"贡献度调整说明："+adjust_reason} placement="bottomLeft"><Icon style={{marginLeft:'5px'}} type="question-circle"/></Tooltip>:null}

              </div>
            </div>
          </div>
          :<div className={Style.div_addKpi}>+</div>
        }

      </div>
    )
  }
}
export default ExamineRes;
