/**
 * 文件说明：组织绩效考核指标详情
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-9-16
 */
import {PureComponent} from 'react';
import {Link} from 'dva/router'
import {connect} from 'dva';
import wrapStyle from '../../../../components/finance/finance.less';
import indexStyle from '../common/indexDetail.less';
import {Icon, Button, Modal, Spin, Breadcrumb, message} from 'antd';
import IndexType from '../common/IndexType';
import {unitMap} from '../common/mapInformation';
import {clearInterval, setInterval} from 'timers';

class ReportDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalLoading: false
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
    // 指标提交
    indexSubmit = () => {
        const {dispatch, location, activeKey} = this.props;
        let indexDetailList = []
        const query = location.query;
        if (query.tag == 2) {
            indexDetailList = this.props.indexEvaluateDetailList
        } else {
            indexDetailList = this.props.indexDetailList
        }
        let passAble = true;
        let shouldActiveKey = [];
        this.setState({
            modalLoading: true
        });
        this.delayLoading(() => {
            this.setState({
                modalLoading: false
            });
            for (let type of indexDetailList.indexTypes || []) {
                if (type.type !== 4) {
                    const typeId = type.id;
                    for (let item of type.indexItems || []) {
                        if (item.reportWarning === 0) {
                            passAble && (passAble = false);
                            shouldActiveKey.push(typeId)
                        } else if (!item.completion) {
                            item.reportWarning = 0
                            passAble && (passAble = false);
                            shouldActiveKey.push(typeId)
                        } else {
                            item.reportWarning = 1
                        }
                    }
                }
            }
            if (passAble) {
                this.showModal('submitModalVisible');
            } else {
                dispatch({
                    type: 'indexModel/saveJsonParse',
                    payload: {
                        listName: query.tag === undefined ? 'indexDetailList' : 'indexEvaluateDetailList',
                        listDate: indexDetailList
                    }
                })
                message.error('提交失败，请正确填写标红部分');
                dispatch({
                    type: 'indexModel/save',
                    payload: {
                        activeKey: [...new Set([...activeKey, ...shouldActiveKey])]
                    }
                });
                let reportBox = document.querySelector("[data-mark='reportWarnning']");
                if (reportBox) {
                    setTimeout(() => {
                        this.scroll(this.getOffsetTop(reportBox) - 200);
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
    // 确认提交
    confirmSubmit = () => {
        const {dispatch, location} = this.props;
        let indexDetailList = []
        const query = location.query;
        if (query.tag == 2) {
            indexDetailList = this.props.indexEvaluateDetailList
        } else {
            indexDetailList = this.props.indexDetailList
        }
        let params = {}
        if (query.tag === '2') {
            params = {
                flowId: query.flowId,
                taskUUID: query.taskUUID,
                flowLinkId: query.flowLinkId,
                taskBatchid: query.taskBatchid,
                year: indexDetailList.year
            }
        } else {
            params = {
                indexId: indexDetailList.id,
                year: query.year
            }
        }
        dispatch({
            type: 'indexModel/submitIndex',
            payload: {
                params,
                tag: query.tag 
            }
        })
        dispatch({
            type: 'indexModel/modalVisibleSave',
            payload: {
                submitModalConfirmLoading: true
            }
        })
    }
    // 取消提交
    cancelSubmit = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'indexModel/modalVisibleSave',
            payload: {
                submitModalVisible: false
            }
        });
    }
    // 面包屑获取
    breadcrumbGet = (tag) => {
        if (tag == 2) {
            return (
                <Breadcrumb style={{marginBottom: '10px'}}>
                    <Breadcrumb.Item key="commonApp">
                        <Link to="/commonApp">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item key="taskList">
                        <Link to="/taskList">工作台</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item key="reportDetail">填报详情</Breadcrumb.Item>
                </Breadcrumb>
            )   
        }
    }
    // 获取当前状态
    getStatus = data => {
        const tag = this.props.location.query.tag;
        if (data.indexTypes && data.indexTypes.length > 0 && tag == 2) {
            if (data.indexTypes[0].type === 6 && data.indexTypes[0].indexItems && data.indexTypes[0].indexItems.length > 0) {
                status = data.indexTypes[0].indexItems[0].status
            } else {
                status = data.indexTypes[0].status
            }
        } else {
            status = data.status;
        }
        return status;
    }

    render() {
        const {modalVisible, location, indexDetailLoading, opinion} = this.props;
        const {tag, flag} = location.query;
        let indexDetailList = [];
        if (tag == 2) {
            indexDetailList = this.props.indexEvaluateDetailList;
        } else {
            indexDetailList = this.props.indexDetailList;
        }
        const status = this.getStatus(indexDetailList);

        return (
            <div className={wrapStyle.wrap} style={{overflow: 'hidden'}}>
                <Spin spinning={this.state.modalLoading}>
                    {this.breadcrumbGet(tag)}
                    <div className={indexStyle.wrap}>
                        <header className={indexStyle.indexHeader}>
                            <div>
                                <h1>{unitMap[indexDetailList.unit]}-业绩指标</h1>
                                <div>
                                    <span>{indexDetailList.year}</span>
                                    <span>
                                        <Icon
                                            type="user"
                                        />
                                        {indexDetailList.applicantName}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p>
                                    <span>当前得分：{indexDetailList.score ? indexDetailList.score : '--'}</span>/
                                    <span>目标分值：{indexDetailList.totalScore}</span>
                                </p>
                            </div>
                        </header>
                        {opinion.opinion && tag == 2 && flag == 0
                            ? <p className={indexStyle.opinionStyle}>
                                <span>审核意见：</span>
                                <span>{opinion.opinion}</span>
                              </p>
                            : null}
                        <Spin spinning={indexDetailLoading}>
                            <IndexType
                                indexTypes={indexDetailList.indexTypes}
                                indexShowType={0}
                                flag={flag}
                                loading={indexDetailLoading}
                                status={status}
                                tag={tag}
                                location={location}
                            />
                        </Spin>
                        <Modal
                            visible={modalVisible.submitModalVisible}
                            onOk={this.confirmSubmit}
                            onCancel={this.cancelSubmit}
                            confirmLoading={modalVisible.submitModalConfirmLoading}
                        >
                            <sapn>确认提交？</sapn>
                        </Modal>
                    </div>
                    <div className={indexStyle.gradeDetailBtn}>
                        {status != 0 || (flag != 0 && flag !== undefined) ? '' : <Button type="primary" onClick={this.indexSubmit}>提交</Button>}
                    </div>
                </Spin>
            </div>
        )
    }
}

const mapStateToProps = ({indexModel, loading}) => ({
    ...indexModel,
    loading: loading.models.indexModel
})

export default connect(mapStateToProps)(ReportDetail);
