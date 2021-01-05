/**
 * 文件说明：组织绩效考核指标追踪月度填报详情
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2020-8-4
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import {message} from 'antd';
import IndexContent from '../common/indexContent';
import {unitMap, indexTypeMap} from '../common/mapInformation';

class MonthReportDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            modalKey: 'submit'
        }
        this.reportIsChange = false;
    }
    // 指标类型切换
    indexTypeChange = key => {
        const {location, dispatch, indexTypeData, professTypeId} = this.props;
        const {indexId, month, tag} = location.query;
        let hasIndexItemData = indexTypeData.some(v => v.id === key && v.indexItemData);
        if (!hasIndexItemData) {
            if (tag == 2) {
                dispatch({
                    type: 'trackModel/getToDoMonthIndexDetail',
                    payload: {
                        type: 'month',
                        typeId: professTypeId,
                        itemId: key,
                        month
                    }
                });
            } else {
                dispatch({
                    type: 'trackModel/getMonthIndexDetail',
                    payload: {
                        indexId,
                        month,
                        itemMonthId: key
                    }
                });
            }
        }
        dispatch({
            type: 'trackModel/save',
            payload: {
                activeKey: key
            }
        });
    }
    // 指标填写
    fillChange = (value, indexTypeIndex, indexItemIndex) => {
        this.props.dispatch({
            type: 'trackModel/indexItemSave',
            payload: {
                indexTypeIndex,
                indexItemIndex,
                key: 'completion',
                value
            }
        })
    }
    // 指标保存
    fillBlur = (indexTypeId, indexItemId, value, indexTypeIndex, indexItemIndex) => {
        const {dispatch, location} = this.props;
        const month = location.query.month;
        if (value) {
            dispatch({
                type: 'trackModel/monthFillInItem',
                payload: {
                    itemId: indexTypeId,
                    completion: value,
                    month,
                    itemMonthId: indexItemId,
                    indexTypeIndex,
                    indexItemIndex,
                    key: 'month'
                }
            })
        } else {
            dispatch({
                type: 'trackModel/indexItemSave',
                payload: {
                    indexTypeIndex,
                    indexItemIndex,
                    key: 'fillComplete',
                    value: 0
                }
            });
            dispatch({
                type: 'trackModel/indexTypeCompleteSave',
                payload: {
                    indexTypeIndex,
                    checkKey: 'completion',
                    key: 'fillComplete'
                }
            });
            message.error('不能为空');
        }
    }
    // 填报修改
    reportChange = value => {
        this.reportIsChange = value;
    }
    // 左侧按钮点击
    leftBtnClick = () => {
        if (!this.reportIsChange) {
            message.info('请填写或更改指标后再保存');
        }
        this.reportIsChange = false;
    }
    // 右侧按钮点击
    rightBtnClick = () => {
        let timer = setInterval(() => {
            if (!this.props.loading) {
                const {indexTypeData, dispatch} = this.props;
                let submitAble = true;
                for (let v1 of indexTypeData) {
                    if (v1.indexItemData) {
                        for (let v2 of v1.indexItemData) {
                            if (!v2.completion) {
                                v2.fillComplete = 0;
                            }
                        }
                    }
                    if (!v1.allCompleted && submitAble) {
                        submitAble = false;
                    }
                }
                dispatch({
                    type: 'trackModel/save',
                    payload: {
                        indexTypeData: JSON.parse(JSON.stringify(indexTypeData))
                    }
                });
                if (submitAble) {
                    this.setState({
                        modalVisible: true
                    });
                } else {
                    message.error('请正确填写所有填报项后再提交');
                }
                clearInterval(timer);
            }
        }, 200)
    }
    // 确认按钮
    confirmBtn = () => {
        const {indexId, month, tag, flowId, flowLinkId, taskUUID, taskBatchid} = this.props.location.query;
        if (tag == 2) {
            this.props.dispatch({
                type: 'trackModel/reSubmitMonthFlow',
                payload: {
                    flowId,
                    flowLinkId,
                    taskUUID,
                    taskBatchid,
                    month,
                    key: 'month'
                }
            });
        } else {
            this.props.dispatch({
                type: 'trackModel/submitMonthIndex',
                payload: {
                    indexId,
                    month,
                    key: 'month'
                }
            });
        }
        this.setState({
            modalVisible: false
        });
    }
    // 取消按钮
    cancelBtn = () => {
        this.setState({
            modalVisible: false
        });
    }
    // 弹窗内容
    modalContent = (
        <span>确认提交？</span>
    )
    // 一些因tag获取的数据
    getMsg = () => {
        const {indexMsg, location, indexTypeData} = this.props;
        const {tag, unit, status, name} = location.query;
        let msg = {};
        if (tag == 2) {
            msg = {
                unit: indexMsg.unit,
                status: indexTypeData.length > 0 && indexTypeData[0].indexItemData ? indexTypeData[0].indexItemData[0].status : '1',
                name: indexMsg.name
            }
        } else {
            msg = {
                unit,
                status,
                name
            }
        }
        return msg;
    }

    render() {
        const {indexTypeData, location, activeKey, loading, indexTypeDataLoading} = this.props;
        const {score, totalScore, month, tag} = location.query;
        const {modalVisible, modalKey} = this.state;
        const {unit, status, name} = this.getMsg();
        return (
            <div>
                <IndexContent
                    unit={unit}
                    name={name}
                    score={score}
                    totalScore={totalScore}
                    status={status}
                    indexTypeData={indexTypeData}
                    indexTypeDataLoading={indexTypeDataLoading}
                    title={tag == 2 ? `${name}-${month}月填报指标` : `${unitMap[unit]}-${indexTypeMap[name]}-${month}月填报指标`}
                    isEvaluate={false}
                    showScore={false}
                    leftBtnClick={this.leftBtnClick}
                    rightBtnClick={this.rightBtnClick}
                    indexTypeChange={this.indexTypeChange}
                    activeKey={activeKey}
                    fillChange={this.fillChange}
                    fillBlur={this.fillBlur}
                    modalVisible={modalVisible}
                    confirmBtn={this.confirmBtn}
                    cancelBtn={this.cancelBtn}
                    modalContent={this.modalContent}
                    reportChange={this.reportChange}
                    loading={loading}
                    modalKey={modalKey}
                    ableRefuse={true}
                    hasTitle={true}
                />
            </div>
        )
    }
}

const mapStateToProps = ({trackModel, loading}) => ({
    loading: loading.models.trackModel,
    ...trackModel
})

export default connect(mapStateToProps)(MonthReportDetail);