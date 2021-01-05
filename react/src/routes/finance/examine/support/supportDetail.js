/**
 * 文件说明：组织绩效考核服务评价
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-10-22
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import Questionnaire from '../../../../components/employer/Questionnaire';
import Style from '../../../../components/employer/employer.less';
import {unitMap} from '../common/mapInformation';
import {Button, Popconfirm, Spin, message} from 'antd';

class SupportDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }
    // 获取打分列表
    getQuestionnaire = (list = []) => {
        const query = this.props.location.query;
        return list.map(v => {
            const item = {
                key: v.id,
                item: {
                    dept_name: '-' + unitMap[v.unit],
                    kpi_target: v.goal,
                    score: v.score
                },
                onChange: e => this.markScore(e, v.id),
                edit: query.status == 0 ? false : true
            }
            return <Questionnaire {...item} />;
        });
    }
    // 打分变化时
    markScore = (e, supportItemId) => {
        const {dispatch, supportItem} = this.props;
        const score = e.target.value;
        dispatch({
            type: 'supportModel/markScore',
            payload: {
                supportItemId,
                score
            }
        });
        supportItem.forEach(v => {
            if (v.id === supportItemId) {
                v.score = score;
            }
        });
        dispatch({
            type: 'supportModel/jsonSave',
            payload: {
                key: 'supportItem',
                value: supportItem
            }
        });
    }
    // 点击提交
    onClick = () => {
        const {supportItem, loading} = this.props;
        if (!loading) {
            const passAble = supportItem.some(v => {
                return v.score !== undefined;
            });
            if (passAble) {
                this.setState({
                    visible: true
                })
            } else {
                message.error('您至少要给一个指标打分');
            }
        } else {
            message.error('打分保存中，请等待完成后再提交');
        }
    }
    // 确认提交
    onConfirm = () => {
        const {dispatch, location} = this.props;
        dispatch({
            type: 'supportModel/submitScore',
            payload: {
                supportId: location.query.supportId
            }
        });
        this.setState({
            visible: false
        });
    }
    // 取消
    onCancel = () => {
        this.setState({
            visible: false
        })
    }

    render() {
        const {supportItem, location, submitLoading} = this.props;
        const {status} = location.query;

        return (
            <div className={Style.wrap} style={{overflow: 'hidden'}}>
                <Spin spinning={submitLoading}>
                    <div style={{"marginBottom":'30px', textAlign: 'center', fontSize: 'larger'}}>
                        <h3>支撑服务满意度评价</h3>
                    </div>
                    {this.getQuestionnaire(supportItem)}
                    <Popconfirm
                        title="确认提交？"
                        visible={this.state.visible}
                        onConfirm={this.onConfirm}
                        onCancel={this.onCancel}
                    >
                        {
                            status == 0
                            ? <Button
                                type="primary"
                                style={{float: 'right', clear: 'both'}}
                                onClick={this.onClick}
                            >提交</Button>
                            : ''
                        }
                    </Popconfirm>
                </Spin>
            </div>
        )
    }
}

const mapStateToProps = ({supportModel, loading}) => ({
    ...supportModel,
    loading: loading.models.supportModel
});

export default connect(mapStateToProps)(SupportDetail);
