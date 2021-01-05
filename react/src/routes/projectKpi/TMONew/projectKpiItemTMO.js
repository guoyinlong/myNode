/**
 * 作者：王超
 * 创建日期：2018-3-14
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import Style from '../searchDetail.less';
import { connect } from 'dva';
import { Input,InputNumber  } from 'antd';
const { TextArea } = Input;

class KpiItem extends React.Component {
    constructor(props) {
        super(props);
    }

    setInputNumber = ()=> {
        if(this.props.kpi.kpi_flag == '2') {
            if(this.props.kpi.kpi_name.indexOf('减分项') != -1) {
                return (
                    <div>
                        <InputNumber onBlur={()=>{this.onBlur(this.props.kpi.kpi_id,this.props.kpi.kpi_ratio)}} onChange={(value)=>{this.changeScore(this.props.kpi.kpi_id,value,this.props.kpi.kpi_ratio)}} id={this.props.kpi.kpi_id} min={-10} step={0.1} max={0} defaultValue={this.props.kpi.percentile_score}/><span style={{color:'red'}}>（注:只能输入负值)</span>
                    </div>
                )
            } else {
                return (
                    <div>
                        <InputNumber onBlur={()=>{this.onBlur(this.props.kpi.kpi_id,this.props.kpi.kpi_ratio)}} onChange={(value)=>{this.changeScore(this.props.kpi.kpi_id,value,this.props.kpi.kpi_ratio)}} id={this.props.kpi.kpi_id} min={0} step={0.1} max={20}  defaultValue={this.props.kpi.percentile_score}/>
                    </div>
                )
            }
        } else {
            return (
                <div>
                    <InputNumber onBlur={()=>{this.onBlur(this.props.kpi.kpi_id,this.props.kpi.kpi_ratio)}} onChange={(value)=>{this.changeScore(this.props.kpi.kpi_id,value,this.props.kpi.kpi_ratio)}} id={this.props.kpi.kpi_id} min={0} step={0.1} max={100}  defaultValue={this.props.kpi.percentile_score}/>
                </div>
            )
        }
    }

    onBlur = (domId,ratio)=> {
        let dom = document;
        if(dom.getElementById(domId).value == "") {
            dom.getElementById(domId).value = 0;
            this.changeScore(domId,0,ratio);
        }
    }

    // 分数自动计算
    changeScore = (othis,value,ratio)=>{
        const {dispatch} = this.props;
        let dom = document;
        let subScore = 0;
        //let kpiItem = [];
        let myData = this.props.managerDetailObj.kpi_detail || null;
        let totalScore = 0;

        if(value === "") {
            return;
        }

        if(dom.getElementsByName(othis).length>0) {
            dom.getElementsByName(othis)[0].innerHTML = (parseFloat(value)*parseFloat(ratio)/100).toFixed(2);
        }

        if(dom.getElementsByName('span_'+othis).length>0) {
            dom.getElementsByName('span_'+othis)[0].innerHTML = (parseFloat(value)*parseFloat(ratio)/100).toFixed(2);
        }

        if(myData) {
            for(let i in myData) {
                if(dom.getElementsByName(i).length>0) {
                    for(let j=0; j<myData[i].length; j++) {
                        if(myData[i][j].kpi_type == i) {
                            if(dom.getElementsByName(myData[i][j].kpi_id)[0].innerHTML != '--') {
                                subScore += parseFloat(dom.getElementsByName(myData[i][j].kpi_id)[0].innerHTML);
                            }
                        }
                    }
                    dom.getElementsByName(i)[0].innerHTML = subScore.toFixed(2);
                    totalScore+= subScore;
                    subScore = 0;
                }
            }
        }

        dispatch({
            type:'taskDeatilTMO/setTotalScore',
            score:totalScore.toFixed(2)
        });
    }
    //百分数转小数
    toPoint = (percent)=>{
        let  str=percent.replace("%","");
        str = str/100;
        return str;
    }

    render() {

        return (
            <div className={Style.kpiBox}>
                <div className={Style.kpiItemTitle}>
                    <div>{this.props.kpi.kpi_name}</div>
                    {   (this.props.kpi.tag && this.props.kpi.tag === '1')?
                        <div>得分：<span name={'span_'+this.props.kpi.kpi_id}></span></div>
                        :<div>得分：<span name={'span_'+this.props.kpi.kpi_id}>{this.props.kpi.kpi_score}</span></div>
                    }
                </div>
                {
                    this.props.kpi.kpi_name === "自主研发（运维）占比" &&this.props.kpi.kpi_assessment === '0' &&this.toPoint(this.props.comScoreObj.ownResearchRate) <0.52?
                    <div>
                        <p style={{color:'red'}}>截止本季度，实际达成值为{this.props.comScoreObj.ownResearchRate}，已交由事业部经理打分，特此提醒。</p>
                    </div>
                    :''
                }
                <div>
                    <span>指标说明：</span>
                    <span>{this.props.kpi.formula}</span>
                </div>
                <div>
                    <span>指标定义：</span>
                    <span>{this.props.kpi.kpi_content}</span>
                </div>
                {
                    this.props.kpi.kpi_flag === "0"  && this.props.kpi.kpi_assessment != undefined?
                    <div style = {{display:'flex',alignItems:"center"}}>
                        <span style = {{whiteSpace: "nowrap",width:'auto'}}>考核方式变更：</span>
                        {
                            this.props.kpi.kpi_assessment === "0" ? "是" : "否"
                        }
                    </div>
                    :
                    ""
                }
                {
                    this.props.kpi.kpi_flag === "0" && this.props.kpi.kpi_assessment === "0"?
                    <div style = {{display:'flex',alignItems:'center'}}>
                        <span style = {{whiteSpace:"nowrap",width:'auto'}}>申请变更理由：</span>
                        {
                            this.props.kpi.reason
                        }
                    </div>
                    :
                    ""
                }
                <div>
                    <span>目标值：</span>
                    <span>{this.props.kpi.target}</span>
                </div>
                {   (this.props.kpi.kpi_flag === "1" ||(this.props.kpi.kpi_name === "自主研发（运维）占比" &&this.props.kpi.kpi_assessment === '0' ))?
                    <div>
                        <span>完成值：</span>
                        <span>{this.props.kpi.pm_finish}</span>
                    </div>
                    :''
                }
                {
                    ((this.props.kpi.kpi_flag === "0" && this.props.kpi.tag != 0) )?
                      (this.props.kpi.kpi_name !== "自主研发（运维）占比" &&this.props.kpi.kpi_assessment !== '0')?
                     <div>
                        <span>审核意见：</span>
                        <span>
                        {
                            (this.props.kpi.score_state ==='3' || this.props.kpi.score_state ==='7') ?
                            <span>{this.props.kpi.finish}</span>
                            :<div><TextArea maxLength={1000} name={'f_'+this.props.kpi.kpi_id} defaultValue={this.props.kpi.finish} autosize autosize={{ minRows: 4}}/><span>(最多1000字)</span></div>
                        }
                        </span>
                    </div>
                    :<span name={'f_'+this.props.kpi.kpi_id}></span>
                      :<span name={'f_'+this.props.kpi.kpi_id}></span>
                }

                {
                    ((this.props.kpi.kpi_flag === "0" && this.props.kpi.tag != 0) )?
                      (this.props.kpi.kpi_name !== "自主研发（运维）占比" &&this.props.kpi.kpi_assessment !== '0')?
                        <div>
                            <span>得分：</span>
                            <span name={'span_'+this.props.kpi.kpi_id}>
                            {
                                this.setInputNumber()
                            }
                            </span><i>(百分制)</i>
                        </div>

                    :''
                      :''
                }
                {
                    this.props.kpi.kpi_flag == 2?
                    <div style={{display: 'none'}}>
                        <span>权重：</span>
                        <span>{this.props.kpi.kpi_ratio}</span>
                    </div>
                    :<div>
                        <span>权重：</span>
                        <span>{this.props.kpi.kpi_ratio}</span>
                    </div>
                }
            </div>
        );
    }
}

function mapStateToProps (state) {
    const {managerDetailObj,comScoreObj} = state.taskDeatilTMO;
    return {
        managerDetailObj,
        comScoreObj
    };
}

export default connect(mapStateToProps)(KpiItem);
