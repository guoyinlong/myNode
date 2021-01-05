/**
 * 文件说明：组织绩效考核指标填报详情
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-9-16
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import wrapStyle from '../../../../components/finance/finance.less';
import indexStyle from '../common/indexDetail.less';
import {Icon, Tabs, Button, Modal, Input, Spin, message, Checkbox, Breadcrumb} from 'antd';
import IndexType from '../common/IndexType';
import EvaluateRecord from './evaluateRecord';
import {unitMap} from '../common/mapInformation';
import {clearInterval, setInterval} from 'timers';

class EvaluateDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            backModalVisible: false,
            passModalVisible: false,
            backCause: '退回',
            passCause: '同意',
            backWarning: {
                status: false,
                text: ''
            },
            passWarning: {
                status: false,
                text: ''
            },
            activeKey: 'indexType',
            modalLoading: false,
            passChecked: false
        }
    }
    // 退回
    back = () => {
        this.setState({
            modalLoading: true
        });
        this.delayLoading(() => {
            this.setState({
                modalLoading: false
            });
            this.showModal('backModalVisible');
        })
    }
    // 确认退回
    confirmBack = () => {
        if (this.state.backWarning.status) return;
        const {dispatch, location} = this.props;
        const {flowId, flowLinkId, taskUUID, taskBatchid, tag, year}  = location.query
        dispatch({
            type: 'indexModel/refuseIndex',
            payload: {
                flowId,
                flowLinkId,
                taskUUID,
                taskBatchid,
                opinion: this.state.backCause,
                tag,
                year
            }
        })
        dispatch({
            type: 'indexModel/modalVisibleSave',
            payload: {
                backModalConfirmLoading: true
            }
        })
    }
    // 取消退回
    cancelBack = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'indexModel/modalVisibleSave',
            payload: {
                backModalVisible: false
            }
        });
    }
    // 退回原因输入
    backInputValue = e => {
        this.setState({
            backCause: e.target.value
        })
        if (this.state.backCause.length <= 3000) {
            this.setState({
                backWarning: {
                    ...this.state.backWarning,
                    status: false
                }
            })
        } else {
            this.setState({
                backWarning: {
                    status: true,
                    text: '字数不能超过3000'
                }
            })
        }
    }
    // 延时loading
    delayLoading = cb => {
        const timer = setInterval(() => {
            let loading = this.props.loading;
            if (!loading) {
                cb();
                clearInterval(timer);
            }
        }, 200);
    }
    // 弹出模态框
    showModal = visibleName => {
        const {dispatch} = this.props;
        dispatch({
            type: 'indexModel/modalVisibleSave',
            payload: {
                [visibleName]: true
            }
        });
    }
    // 通过
    pass = () => {
        const {dispatch, indexEvaluateDetailList, location, activeKey} = this.props;
        const {tag}  = location.query
        let passAble = true;
        let shouldActiveKey = [];
        this.setState({
            modalLoading: true
        });
        this.delayLoading(() => {
            this.setState({
                modalLoading: false
            });
            if (tag !== '0') {
                for (let type of indexEvaluateDetailList.indexTypes || []) {
                    const typeId = type.id;
                    for (let item of type.indexItems || []) {
                        if (item.checkWarning === 0) {
                            passAble && (passAble = false);
                            shouldActiveKey.push(typeId);
                        } else if (item.score === undefined) {
                            item.checkWarning = 0
                            passAble && (passAble = false);
                            shouldActiveKey.push(typeId);
                        } else {
                            item.checkWarning = 1
                        }
                    }
                }
            }
            if (passAble) {
                this.showModal('passModalVisible')
            } else {
                dispatch({
                    type: 'indexModel/saveJsonParse',
                    payload: {
                        listName: 'indexEvaluateDetailList',
                        listDate: indexEvaluateDetailList
                    }
                })
                message.error('提交失败，请正确填写标红部分')
                dispatch({
                    type: 'indexModel/save',
                    payload: {
                        activeKey: [...new Set([...activeKey, ...shouldActiveKey])]
                    }
                });
                let evaluateBox = document.querySelector("[data-mark='evaluateWarnning']");
                if (evaluateBox) {
                    setTimeout(() => {
                        this.scroll(this.getOffsetTop(evaluateBox) - 200);
                    }, 100)
                }
            }
        })
    }
    // 滚动到固定位置
    scroll = offset => {
        const target = document.querySelector('#main_container');
        let scrollTop = target.scrollTop;
        const scrollToTop = setInterval(() => {
            if (scrollTop > offset) {
                scrollTop -= 500;
                if (scrollTop <= offset) {
                    scrollTop = offset;
                    clearInterval(scrollToTop);
                }
            } else {
                scrollTop += 50;
                if (scrollTop >= offset) {
                    scrollTop = offset;
                    clearInterval(scrollToTop);
                }
            }
            target.scrollTo(0, scrollTop);
        }, 16);
    }
    // 获取元素到顶部的距离
    getOffsetTop = e => {
        let y = 0;
        while (e != null) {
            y += e.offsetTop;
            e = e.offsetParent;
        }
        return y;
    }
    // 确认通过
    confirmPass = () => {
        const {indexEvaluateDetailList} = this.props;
        if (indexEvaluateDetailList.indexTypes
            && indexEvaluateDetailList.indexTypes.length > 0
            && indexEvaluateDetailList.indexTypes[0].type === 6
            && !this.state.passChecked) {
            this.setState({
                passWarning: {
                    status: true,
                    text: '请确认总办会已决议'
                }
            })
            return;
        }
        if (this.state.passWarning.status) return;
        const {dispatch, location} = this.props;
        const {flowId, flowLinkId, taskUUID, taskBatchid, tag, year}  = location.query
        dispatch({
            type: 'indexModel/passIndex',
            payload: {
                flowId,
                flowLinkId,
                taskUUID,
                taskBatchid,
                tag,
                opinion: this.state.passCause,
                year
            }
        });
        dispatch({
            type: 'indexModel/modalVisibleSave',
            payload: {
                passModalConfirmLoading: true
            }
        });
    }
    // 取消通过
    cancelPass = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'indexModel/modalVisibleSave',
            payload: {
                passModalVisible: false
            }
        });
    }
    // 通过原因输入
    passInputValue = e => {
        this.setState({
            passCause: e.target.value
        });
        if (this.state.passCause.length <= 3000) {
            this.setState({
                passWarning: {
                    ...this.state.passWarning,
                    status: false
                }
            })
        } else {
            this.setState({
                passWarning: {
                    status: true,
                    text: '字数不能超过3000'
                }
            })
        }
        
    }
    // 退回和通过按钮
    backAndPassBtn = () => {
        const {location} = this.props;
        const flag = location.query.flag;
        const ableRefuse = JSON.parse(location.query.ableRefuse ? location.query.ableRefuse : false);
        const status = this.getStatus()
        return (
            <div className={indexStyle.gradeDetailBtn}>
                {ableRefuse && status === 1 && (flag == 0 || flag === undefined) ? <Button onClick={this.back}>退回</Button> : ''}
                {status === 1 && (flag == 0 || flag === undefined) ? <Button type="primary" onClick={this.pass}>通过</Button> : ''}
            </div>
        )
    }
    // tab的切换
    tabPaneSwitch = key => {
        this.setState({
            activeKey: key
        })
    }
    // 获取当前状态
    getStatus = () => {
        const {indexEvaluateDetailList} = this.props;
        let status = 0;
        if (indexEvaluateDetailList.indexTypes && indexEvaluateDetailList.indexTypes.length > 0) {
            if (indexEvaluateDetailList.indexTypes[0].type === 6
                && indexEvaluateDetailList.indexTypes[0].indexItems 
                && indexEvaluateDetailList.indexTypes[0].indexItems.length > 0) {
                status = indexEvaluateDetailList.indexTypes[0].indexItems[0].status
            } else {
                status = indexEvaluateDetailList.indexTypes[0].status
            }
        }
        return status;
    }
    // 总办会决议变化
    passCheckboxChange = e => {
        this.setState({
            passChecked: e.target.checked
        })
        if (e.target.checked) {
            this.setState({
                passWarning: {
                    status: false
                }
            })
        }
    }
    // 面包屑
    breadcrumbGet = (flag) => {
        if (flag == 1 || flag == 3) {
            return (
                <Breadcrumb style={{marginBottom: '10px'}}>
                    <Breadcrumb.Item key="commonApp">
                        <Link to="/commonApp">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item key="taskList">
                        <Link to="/taskList">工作台</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item key="evaluateDetail">指标详情</Breadcrumb.Item>
                </Breadcrumb>
            )   
        }
    }

    render() {
        const {indexEvaluateDetailList, evaluateRecordList, location, modalVisible, indexDetailLoading, opinion} = this.props;
        const flag = location.query.flag
        const tag = location.query.tag - 0;
        const {backWarning, passWarning, activeKey, modalLoading, passChecked} = this.state;
        const status = this.getStatus()
        return (
            <div className={wrapStyle.wrap} style={{overflow: 'hidden'}}>
                <Spin spinning={modalLoading}>
                    {this.breadcrumbGet(flag)}
                    <div className={indexStyle.wrap}>
                        <header className={indexStyle.indexHeader}>
                            <div>
                                <h1>{unitMap[indexEvaluateDetailList.unit]}-业绩指标</h1>
                                <div>
                                    <span>{indexEvaluateDetailList.year}</span>
                                    <span>
                                        <Icon
                                            type="user"
                                        />
                                        {indexEvaluateDetailList.applicantName}
                                    </span>
                                </div>
                            </div>
                            {
                                activeKey === 'indexType'
                                ? <div className={indexStyle.targetScore}>
                                    <span>目标分值：{indexEvaluateDetailList.totalScore}</span>
                                </div>
                                : ''
                            }
                        </header>
                        {opinion.opinion && flag != 3 && flag != 1
                            ? <p className={indexStyle.opinionStyle}>
                                <span>审核意见：</span>
                                <span>{opinion.opinion}</span>
                              </p>
                            : null}
                        <Tabs
                            onChange={this.tabPaneSwitch}
                        >
                            <Tabs.TabPane
                                tab="评分内容"
                                key="indexType"
                            >
                                <Spin spinning={indexDetailLoading}>
                                    <IndexType
                                        indexTypes={indexEvaluateDetailList.indexTypes}
                                        indexShowType={1}
                                        flag={flag}
                                        loading={indexDetailLoading}
                                        status={status}
                                        tag={tag}
                                        location={location}
                                    />
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab="审核记录"
                                key="indexRecord"
                            >
                                <EvaluateRecord evaluateRecordList = {evaluateRecordList} />
                            </Tabs.TabPane>
                        </Tabs>
                        <Modal
                            title="确认退回？"
                            visible={modalVisible.backModalVisible}
                            onOk={this.confirmBack}
                            onCancel={this.cancelBack}
                            confirmLoading={modalVisible.backModalConfirmLoading}
                            maskClosable={false}
                        >
                            <Input.TextArea
                                onChange={this.backInputValue}
                                autosize={{minRows: 4}}
                                style={{
                                    resize: 'vertical'
                                }}
                                placeholder="退回原因（选填）"
                                className={backWarning.status ? indexStyle.causeReportWarning : ''}
                            />
                            {backWarning.status ? <p style={{color: '#f04134', marginTop: '10px'}}>{backWarning.text}</p> : ''}
                        </Modal>
                        <Modal
                            title="确认通过？"
                            visible={modalVisible.passModalVisible}
                            onOk={this.confirmPass}
                            onCancel={this.cancelPass}
                            confirmLoading={modalVisible.passModalConfirmLoading}
                            maskClosable={false}
                        >
                            <Input.TextArea
                                onChange={this.passInputValue}
                                autosize={{minRows: 4}}
                                style={{
                                    resize: 'vertical'
                                }}
                                placeholder="审核意见（选填）"
                                className={passWarning.status ? indexStyle.causeReportWarning : ''}
                            />
                            <div className={indexStyle.passRules}>
                                {(indexEvaluateDetailList.indexTypes && indexEvaluateDetailList.indexTypes.length > 0 && indexEvaluateDetailList.indexTypes[0].type === 6)
                                    ? <div className={indexStyle.passChecked}>
                                        <Checkbox
                                            onChange={this.passCheckboxChange}
                                            checked={passChecked}
                                        >总办会已决议</Checkbox>
                                      </div>
                                    : false}
                                {passWarning.status ? <p>{passWarning.text}</p> : false}
                            </div>
                        </Modal>
                    </div>
                    {activeKey === 'indexType' ? this.backAndPassBtn() : ''}
                </Spin>
            </div>
        )
    }
}

const mapStateToProps = ({indexModel, loading}) => ({
    ...indexModel,
    loading: loading.models.indexModel
})

export default connect(mapStateToProps)(EvaluateDetail);
