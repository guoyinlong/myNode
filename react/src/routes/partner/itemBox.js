/**
 * 文件说明：合作伙伴
 * 作者：王超
 * 邮箱：wangc235@chinaunicom.cn
 * 创建日期：2017-08-20
 */
import { Row, Col,Collapse,Input,InputNumber,Popconfirm,Icon } from 'antd';
import Style from './partnerItem.less';

const { TextArea } = Input;
class ItemDom extends React.Component {
    
    onChange = (value)=> {
        this.props.handlChangeScore(value,this.props.itemIndex);
    }
    
    render() {
        if(this.props.isEdit == true) {
            return (
                <Col span={12}>
                    <div className={Style.kpiBox}>
                        <Popconfirm title="确定删除该项指标吗?" onConfirm={()=>{this.props.handlDel(this.props.itemIndex)}} onCancel={this.cancel} okText="确定" cancelText="取消">
                            <Icon className={Style.delKpi} type='shijuan-shanchuzhibiao' />
                        </Popconfirm>
                        <div className={Style.kpiItemTitle}>
                            <Input name='kpiName' defaultValue={this.props.data.kpi_name} placeholder="请输入指标名称" />
                            <div>
                                    目标分值：<InputNumber defaultValue ={this.props.data.target_score} name={'kpiScore'} formatter={value => value.replace(/^(\d+\.?\d?).*/g, '$1')} parser={value => value.replace(/^(\d+\.?\d?).*/g, '$1')} onChange={this.onChange} min={1} step={0.1} max={100} />
                            </div>
                        </div>
                        <div>
                            <span>完成目标：</span>
                            <span><TextArea maxLength={1000} defaultValue={this.props.data.kpi_content} name='kpiFinish' rows={2} /></span>
                        </div>
                        <div>
                            <span>评价标准：</span>
                            <span><TextArea maxLength={1000} defaultValue={this.props.data.formula} name='kpiAssessment' rows={2} /></span>
                        </div>
                        <div>
                            <span>考  核  人：</span>
                            <span name='checkerName'>{this.props.checkerName}</span>
                            <span className={Style.hide} name='checkerId'>{this.props.checkerId}</span>
                        </div>
                    </div>
                </Col>
            )
        } else if(this.props.isEdit == false){
            return(
                <Col span={12}>
                    <div className={Style.kpiBox}>
                        <div className={Style.kpiItemTitle}>
                            <div>{this.props.data.kpi_name}</div>
                            <div>
                                {'得分：'}<span>--</span>/{this.props.data.target_score}
                            </div>
                        </div>
                        <div>
                            <span>完成目标：</span>
                            <span><p className={Style.targetCon}>{this.props.data.kpi_content}</p></span>
                        </div>
                        <div>
                            <span>评价标准：</span>
                            <span><p className={Style.targetCon}>{this.props.data.formula}</p></span>
                        </div>
                        <div>
                            <span>考  核  人：</span>
                            <span><p className={Style.targetCon}>{this.props.checkerName}</p></span>
                        </div>
                    </div>
                </Col>
            )
        } else {
            return (
                <Col span={12}>
                    <div className={Style.kpiBox}>
                        <div className={Style.kpiItemTitle}>
                            <div>{this.props.data.kpi_name}</div>
                            {
                                this.props.isEdit == 'assess1'?
                                <div>
                                        得分：<InputNumber disabled={true} min={0.1} max={parseInt(this.props.data.target_score)} defaultValue={this.props.data.score} name={'kpiScore'} formatter={value => value.replace(/^(\d+\.?\d?).*/g, '$1')} parser={value => value.replace(/^(\d+\.?\d?).*/g, '$1')} onChange={this.onChange} step={0.1}/>
                                </div>:
                                <div>
                                         得分：<InputNumber min={0.1} max={parseInt(this.props.data.target_score)} defaultValue={this.props.data.target_score} name={'kpiScore'} formatter={value => value.replace(/^(\d+\.?\d?).*/g, '$1')} parser={value => value.replace(/^(\d+\.?\d?).*/g, '$1')} onChange={this.onChange} step={0.1}/>
                                </div>
                            }
                            
                        </div>
                        <div>
                            <span>完成目标：</span>
                            <span><p className={Style.targetCon}>{this.props.data.kpi_content}</p></span>
                        </div>
                        <div>
                            <span>评价标准：</span>
                            <span><p className={Style.targetCon}>{this.props.data.formula}</p></span>
                        </div>
                        <div>
                            <span>权重：</span>
                            <span><p className={Style.targetCon}>{`${this.props.data.target_score}%`}</p></span>
                        </div>
                        <div>
                            <span>考  核  人：</span>
                            <span name='checkerName'>{this.props.checkerName}</span>
                        </div>
                    </div>
                </Col>
            )
        }
    }
}


export default ItemDom