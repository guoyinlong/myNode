/**
 * 文件说明：组织绩效考核指标详情
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-12-20
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import reportMainStyle from './reportDetailMain.less';
import statusColorStyle from '../common/statusColor.less';
import {Button, Modal, Spin, message, Tabs, Table} from 'antd';
import {unitMap, indexTypeMap} from '../common/mapInformation';
import IndexItem from '../common/IndexItem';
import {clearInterval, setInterval} from 'timers';

const {TabPane} = Tabs;

class ReportDetailCopy extends PureComponent {
    constructor(props) {
        super(props);
    }
    // tab标签内容
    getTabpane = (indexTypesDetailList = []) => indexTypesDetailList.map((v, i) => {
        let completed = true;
        if (v.indexItems && v.type !== 4) {
            completed = v.indexItems.every(f => f.completion);
        }
        const tab = (
            <div>
                <span>{indexTypeMap[v.type]}</span>
                <span
                    className={v.allCompleted && completed
                        ? statusColorStyle.status2
                        : statusColorStyle.status0}
                    >({v.completedCount}/{v.allItemCount})</span>
            </div>
        )
        return (
            <TabPane key={v.id} tab={tab}>
                {this.getIndexType(v, i)}
            </TabPane>
        );
    })
    // indexType获取
    getIndexType = (indextype, typeIndex) => {
        const {loading} = this.props;
        return (
            <Spin spinning={loading}>
                <div
                    className={reportMainStyle.indexPanel}
                    style={{height: document.body.clientHeight - 267, overflow: 'auto'}}
                >
                    {this.getHeader(indextype.indexItems)}
                    <section>
                        {this.getIndexItem(typeIndex, indextype.type, indextype.indexItems)}
                    </section>
                </div>
            </Spin>
        )
    }
    // 指标类型标题
    getHeader = (indexItems = []) => {
        return (
            <header className={reportMainStyle.panelHeader} style={{marginBottom: 5}}>
                {this.getScoreTable(indexItems)}
            </header>
        )
    }
    // 指标分数表格
    getScoreTable = (indexItems = []) => {
        let columns = [
            {
                title: '总得分',
                dataIndex: 'scoreTotal',
                key: 'scoreTotal',
                fixed: 'left',
                width: 80
            }
        ];
        let dataSourceItem = {};
        let scoreArr = [];
        indexItems.forEach((v, i) => {
            columns.push({
                title: '指标' + (i + 1),
                dataIndex: `score${i + 1}`,
                key: `score${i + 1}`,
                width: 80
            });
            const score = parseFloat(v.score);
            if (!Number.isNaN(score)) scoreArr.push(score);
            dataSourceItem[`score${i + 1}`] = Number.isNaN(score) ? '--' : score ;
        });
        const dataSource = [
            {
                ...dataSourceItem,
                scoreTotal: scoreArr.length > 0 ? this.sum(scoreArr) : '--',
                key: 'score',
            }
        ]
        return (
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                size="small"
                className={`${reportMainStyle.indexTable} ${indexItems.length < 12 ? reportMainStyle.shortIndexTable : ''}`}
                scroll={{x: columns.length * 80}}
            />
        )
    }
    // 数组内数字相加
    sum = scoreArr => {
        let num = 0;
        scoreArr.forEach(v => {
            const float = v.toString().split('.')[1];
            const len = float ? float.length : 0;
            num = len > num ? len : num;
        })
        const weight = Math.pow(10, num);
        let sum = 0;
        scoreArr.forEach(v => {
            sum += v * weight;
        })
        return sum / weight;
    }
    // 小指标获取
    getIndexItem = (typeIndex, type, indexItem = []) => {
        const {location} = this.props;
        const {status, tag, indexId} = location.query;
        return indexItem.map((v, i) => {
            const indexItemData = {
                ...v,
                index: i + 1
            }
            return (
                <IndexItem
                    indexItem={indexItemData}
                    key={indexItemData.index}
                    itemIndex={i}
                    typeIndex={typeIndex}
                    status={status}
                    indexShowType={0}
                    type={type}
                    tag={tag}
                    indexId={indexId}
                    location={location}
                />
            )
        });
    }
    // 切换指标类型
    indexTypeChange = id => {
        const {dispatch, indexTypesDetailList} = this.props;
        if (indexTypesDetailList.some(v => v.id === id && v.indexItems)) return;
        dispatch({
            type: 'indexModel/getIndexTypeDetail',
            payload: {
                typeId: id,
                year: this.props.location.query.year
            }
        });
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
    // 确认提交
    confirmSubmit = () => {
        const {dispatch, location} = this.props;
        dispatch({
            type: 'indexModel/submitIndex',
            payload: {
                indexId: location.query.indexId,
                year: location.query.year
            }
        })
        dispatch({
            type: 'indexModel/modalVisibleSave',
            payload: {
                submitModalConfirmLoading: true
            }
        })
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
        const {dispatch, indexTypesDetailList, mutualData} = this.props;
        let passAble = true;
        let mutualComplete = mutualData.every(m => m.status == 2);
        let allCompleted = indexTypesDetailList.every(v => {
            if (v.type !== 4 && !v.indexItems) {
                return v.allCompleted;
            }
            return true;
        });
        this.delayLoading(() => {
            for (let type of indexTypesDetailList || []) {
                if (type.type !== 4) {
                    for (let item of type.indexItems || []) {
                        if (item.reportWarning === 0) {
                            passAble && (passAble = false);
                        } else if (!item.completion) {
                            item.reportWarning = 0
                            passAble && (passAble = false);
                        } else {
                            item.reportWarning = 1
                        }
                    }
                }
            }
            if (mutualComplete) {
                if (passAble && allCompleted) {
                    this.showModal('submitModalVisible');
                } else {
                    dispatch({
                        type: 'indexModel/saveJsonParse',
                        payload: {
                            listName: 'indexTypesDetailList',
                            listDate: this.props.indexTypesDetailList
                        }
                    })
                    message.error('提交失败，请填写完所有指标');
                }
            } else {
                message.error('提交失败，专业化指标支撑协同互评打分未完成');
            }
            
        })
    }
    // 保存
    indexSave = () => {
        const {dispatch, reportIsChange} = this.props;
        if (reportIsChange) {
            dispatch({
                type: 'indexModel/save',
                payload: {
                    reportIsChange: false
                }
            });
        } else {
            message.error('请填写或更改指标后再保存')
        }
    }
    // 获取提示信息内容
    getInfoContent = () => {
        const {reportInfoData} = this.props;
        let res = reportInfoData.map(v1 => (
            <div key={v1.typeId}>
                <span>{indexTypeMap[v1.type]}：</span>
                <div>
                    {v1.indexItems.map((v2, i) => (
                        <span key={i}>
                            {`${i + 1}、${v2.content}`}
                        </span>
                    ))}
                </div>
            </div>))
        return (
            <div className={reportMainStyle.reportInfoWrap}>
                <div>部分指标后期会自动导入，当前只需填报以下指标：</div>
                <div>{res}</div>
            </div>
        )
    }
    // 关闭提示信息
    reportInfoClose = () => {
        this.props.dispatch({
            type: 'indexModel/save',
            payload: {
                reportInfoVisible: false
            }
        })
    }

    render() {
        const {modalVisible, location, indexTypesDetailList, reportInfoVisible} = this.props;
        const {unit, score, totalScore, status} = location.query;

        return (
            <div className={reportMainStyle.wrap}>
                <header className={reportMainStyle.reportMainHeader}>
                    <div>
                        <h1>{unitMap[unit]}-业绩指标</h1>
                        <p>
                            <span>当前得分：{score ? score : '--'}</span>/
                            <span>目标分值：{totalScore}</span>
                        </p>
                    </div>
                </header>
                <div className={reportMainStyle.indexWrap}>
                    <Tabs
                        size="small"
                        tabBarExtraContent={
                            status == 0
                            ? <div className={reportMainStyle.btn}>
                                <Button
                                    size="small"
                                    onClick={this.indexSave}
                                >保存</Button>
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={this.indexSubmit}
                                >提交</Button>
                              </div>
                            : ''
                        }
                        onChange={this.indexTypeChange}
                    >
                        {this.getTabpane(indexTypesDetailList)}
                    </Tabs>
                </div>
                <Modal
                    visible={modalVisible.submitModalVisible}
                    onOk={this.confirmSubmit}
                    onCancel={this.cancelSubmit}
                    confirmLoading={modalVisible.submitModalConfirmLoading}
                >
                    <sapn>确认提交？</sapn>
                </Modal>
                <Modal
                    visible={reportInfoVisible}
                    width={500}
                    onCancel={this.reportInfoClose}
                    footer={null}
                >
                    {this.getInfoContent()}
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = ({indexModel, loading}) => ({
    ...indexModel,
    loading: loading.models.indexModel
})

export default connect(mapStateToProps)(ReportDetailCopy);
