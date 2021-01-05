/**
 * 文件说明：组织绩效考核月度指标追踪评价详情
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2020-8-4
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import {Input} from 'antd';
import IndexContent from '../common/indexContent';
import indexDetailStyle from '../common/indexDetail.less';

class MonthEvaluatetDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            modalKey: 'submit',
            modalTitle: '',
            opinion: '',
            warnningShow: false,
            warnningContent: '',
            placeholder: ''
        }
    }
    // 指标类型切换
    indexTypeChange = key => {
        const {location, dispatch, indexTypeData, professTypeId} = this.props;
        const {month} = location.query;
        let hasIndexItemData = indexTypeData.some(v => v.id === key && v.indexItemData);
        if (!hasIndexItemData) {
            dispatch({
                type: 'trackModel/getToDoMonthIndexDetail',
                payload: {
                    typeId: professTypeId,
                    month,
                    itemId: key,
                    type: 'month'
                }
            });
        }
        dispatch({
            type: 'trackModel/save',
            payload: {
                activeKey: key
            }
        });
    }
    // 左侧按钮点击
    leftBtnClick = () => {
        const {modalKey} = this.state;
        if (modalKey !== 'back') {
            this.setState({
                modalTitle: '确认退回？',
                placeholder: '退回意见（选填）',
                modalKey: 'back',
                opinion: '',
                warnningShow: false,
                warnningContent: ''
            })
        }
        this.setState({
            modalVisible: true,
        });
    }
    // 右侧按钮
    rightBtnClick = () => {
        const {modalKey} = this.state;
        if (modalKey !== 'pass') {
            this.setState({
                modalKey: 'pass',
                modalTitle: '确认通过？',
                placeholder: '审核意见（选填）',
                opinion: '',
                warnningShow: false,
                warnningContent: ''
            })
        }
        this.setState({
            modalVisible: true,
            
        });
    }
    // 确认按钮
    confirmBtn = () => {
        const {warnningShow, opinion, modalKey} = this.state;
        const {month, flowId, flowLinkId, taskUUID, taskBatchid, tag} = this.props.location.query;
        const params = {
            month,
            type: 'month',
            opinion,
            flowId,
            flowLinkId,
            taskUUID,
            taskBatchid,
            tag
        };
        if (!warnningShow) {
            switch (modalKey) {
                case 'pass':
                    this.props.dispatch({
                        type: 'trackModel/passMonthIndex',
                        payload: {
                            ...params
                        }
                    });
                    this.setState({
                        modalVisible: false
                    });
                    break;
                case 'back':
                    // if (opinion.length === 0) {
                    //     this.setState({
                    //         warnningShow: true,
                    //         warnningContent: '退回原因不能为空'
                    //     });
                    // } else {
                        this.props.dispatch({
                            type: 'trackModel/refuseMonthIndex',
                            payload: {
                                ...params
                            }
                        });
                        this.setState({
                            modalVisible: false
                        });
                    // }
                    break;
            }
        }
    }
    // 取消按钮
    cancelBtn = () => {
        this.setState({
            modalVisible: false
        });
    }
    // 弹窗内容
    modalContent = () => {
        const {opinion, warnningContent, warnningShow, placeholder} = this.state;
        return (
            <div>
                <Input.TextArea
                    onChange={this.opinionChange}
                    value={opinion}
                    autosize={{minRows: 4}}
                    style={{
                        resize: 'vertical'
                    }}
                    placeholder={placeholder}
                    className={warnningShow ? indexDetailStyle.causeReportWarning : ''}
                />
                {warnningShow
                    ? <div style={{color:'#f04134'}}>{warnningContent}</div>
                    : false}
            </div>
        )
    }
    // 通过原因输入
    opinionChange = e => {
        const {modalKey} = this.state;
        const text = e.target.value
        if (text.length > 3000) {
            this.setState({
                warnningShow: true,
                warnningContent: '字数不能超过3000'
            });
        } else {
            if (modalKey === 'back' && text.length === 0) {
                this.setState({
                    opinion: text,
                    warnningShow: true,
                    warnningContent: '退回原因不能为空'
                });
            } else {
                this.setState({
                    opinion: text,
                    warnningShow: false
                });
            }
        }
    }

    render() {
        const {indexTypeData, indexMsg, location, activeKey, loading, indexTypeDataLoading} = this.props;
        const {month} = location.query;
        const {unit, status, name} = indexMsg;
        const {modalVisible, modalKey, modalTitle} = this.state;
        return (
            <div>
                <IndexContent
                    unit={unit}
                    name={name}
                    status={status}
                    indexTypeData={indexTypeData}
                    indexTypeDataLoading={indexTypeDataLoading}
                    title={`${name}-${month}月评价指标`}
                    isEvaluate={true}
                    showScore={false}
                    leftBtnClick={this.leftBtnClick}
                    rightBtnClick={this.rightBtnClick}
                    indexTypeChange={this.indexTypeChange}
                    activeKey={activeKey}
                    modalVisible={modalVisible}
                    confirmBtn={this.confirmBtn}
                    cancelBtn={this.cancelBtn}
                    modalContent={this.modalContent()}
                    loading={loading}
                    modalKey={modalKey}
                    modalTitle={modalTitle}
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

export default connect(mapStateToProps)(MonthEvaluatetDetail);