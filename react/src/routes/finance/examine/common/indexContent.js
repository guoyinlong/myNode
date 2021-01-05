/**
 * 文件说明：指标内容
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2020-8-26
 */
import {PureComponent} from 'react';
import {Button, Tabs, Table, Input, message, Modal, Spin} from 'antd';
import indexContent from './indexContent.less';
import {unitMap, statusMap} from './mapInformation';
import statusColorStyle from './statusColor.less';
import statusColor from './statusColor.less';
import indexDetail from './indexDetail.less';
import reportMainStyle from '../report/reportDetailMain.less';

const TextArea = Input.TextArea;
const TabPane = Tabs.TabPane;

class IndexContent extends PureComponent {
    constructor(props) {
        super(props);
        this.currentFill = '';
    }
    getTabContent = data => {
        const {keyType} = this.props;
        return (
            <div>
                <span>{keyType ? data.examineIndex : data.content}</span>
                <span
                    className={data.allCompleted
                        ? statusColorStyle.status2
                        : statusColorStyle.status0}
                    >({data.completedCount}/{data.allItemCount})</span>
            </div>
        )
    }
    // 获取TabPane
    getTabPanes = (data = []) => {
        const {showScore, loading, keyType} = this.props;
        return data.map((v, i) => (
            <TabPane key={keyType ? v[keyType] : v.id} tab={this.getTabContent(v)}>
                <Spin spinning={loading}>
                    <div
                        className={indexContent.indexTypeWrap}
                        style={{height: document.body.clientHeight - 267, overflow: 'auto'}}
                    >
                        {showScore
                            ? <div className={indexContent.indexTypeTable + ' ' + reportMainStyle.panelHeader}>
                                {this.getScoreTable(v.indexItemData)}
                            </div>
                            : false}
                        <div className={indexContent.indexType}>
                            {this.getIndexItems(v.id, i, v.type, v.indexItemData)}
                        </div>
                    </div>
                </Spin>
            </TabPane>
        ));
    }
    // 获取indexItem
    getIndexItems = (indexTypeId, indexTypeIndex, indexType, data = []) => {
        const {showScore, isEvaluate, status, keyType, evaluateBlur, type, tag} = this.props;
        return data.map((v, i) => (
            <div key={v.id} className={indexContent.indexItem}>
                <div className={indexContent.indexItemFirst}>
                    <div
                        style={{width: '80%'}}
                        className={`${v.fillComplete || (v.fillComplete === undefined && v.completion) ? statusColorStyle.status2 : ''}`}
                    >
                        <div style={{whiteSpace: 'nowrap'}}>指标{i + 1}：</div>
                        <div>{v.content}</div>
                    </div>
                    {showScore
                        ? <div className={indexContent.score}>
                            <div style={{whiteSpace: 'nowrap'}}>得分：</div>
                            {isEvaluate && status == '1' && tag == '1'
                                ? <div style={{whiteSpace: 'nowrap'}}>
                                    <Input
                                        value={v.score}
                                        onChange={e => this.evaluateChange(e.target.value, v.totalScore, indexTypeIndex, i)}
                                        onBlur={e => evaluateBlur(e.target.value, v.id, indexTypeIndex, i)}
                                        style={{width: 80}}
                                        className={v.evaluateComplete === 0 ? indexDetail.causeReportWarning : v.evaluateComplete === 1 ? indexDetail.reportSuccess : ''}
                                    /> / {v.totalScore}
                                </div>
                                : <div style={{whiteSpace: 'nowrap'}}>{v.score || v.score == 0 ? v.score : '--'} / {v.totalScore}</div>}
                        </div>
                        : false}
                </div>
                <div className={indexContent.indexItemOther}>
                    <div>完成目标</div>：
                    <div>{v.goal}</div>
                </div>
                <div className={indexContent.indexItemOther}>
                    <div>计分方法</div>：
                    <div>{v.scoreMethod}</div>
                </div>
                {type === 'it'
                ? false
                : <div className={indexContent.indexItemOther}>
                    <div>打分主体</div>：
                    <div>{keyType ? unitMap[v.indexSubject] : v.examinerName}</div>
                </div>}
                {indexType == 6 && !isEvaluate
                    ? false
                    : <div className={indexContent.indexItemOther}>
                        <div>状态</div>：
                        <div className={statusColor['status' + v.status]}>{statusMap[v.status]}</div>
                    </div>
                }
                {indexType != 6 && (v.completion || this.reportAble())
                ? <div className={indexContent.indexItemOther}>
                    <div>完成情况</div>：
                    {this.reportAble()
                        ? <TextArea
                            autosize={{minRows: 4}}
                            style={{
                                resize: 'vertical'
                            }}
                            value={v.completion}
                            onChange={e => this.fillChange(e, indexTypeIndex, i)}
                            onBlur={e => this.fillBlur(indexTypeId, v.id, e, indexTypeIndex, i)}
                            onFocus={this.fillFocus}
                            className={v.fillComplete === 0 ? indexDetail.causeReportWarning : v.fillComplete === 1 ? indexDetail.reportSuccess : ''}
                        />
                        : <div>{v.completion}</div>
                    }
                </div>
                : false}
            </div>
        ))
    }
    // 评分改变
    evaluateChange = (score, totalScore, indexTypeIndex, itemIndex) => {
        if (totalScore < 0) {
            if (score >= totalScore && score <= 0 || score === '-') {
                this.props.evaluateChange(this.strToNumber(score), indexTypeIndex, itemIndex)
            }
        } else {
            if (score <= totalScore && score >= 0) {
                this.props.evaluateChange(this.strToNumber(score), indexTypeIndex, itemIndex)
            }
        }
        
    }
    // 字符串转数字
    strToNumber = (str) => {
        let res1 = str.replace(/[^-^\.^\d]/g, '');
        let res2 = res1.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        let res2Split = res2.split('.');
        if (res2Split[1] && res2Split[1].length > 4) {
            res2Split[1] = res2Split[1].substring(0, 4);
            res2= res2Split.join('.');
        }
        return res2;
    }
    // 填报获取焦点时
    fillFocus = e => {
        const {reportChange} = this.props;
        this.currentFill = e.target.value;
        reportChange && reportChange(false);
    }
    // 填报改变时
    fillChange = (e, indexTypeIndex, indexItemIndex) => {
        const value = e.target.value;
        if (value.length > 3000) {
            message.info('最多填写3000个字符');
        } else {
            this.props.fillChange(value, indexTypeIndex, indexItemIndex);
        }
    }
    // 填报框失焦时验证
    fillBlur = (indexTypeId, indexItemId, e, indexTypeIndex, indexItemIndex) => {
        const {reportChange} = this.props;
        const value = e.target.value;
        if (value === this.currentFill) {
            reportChange && reportChange(false);
        } else {
            reportChange && reportChange(true);
            this.props.fillBlur(indexTypeId, indexItemId, value, indexTypeIndex, indexItemIndex);
        }
    }
    // 操作按钮
    getHandleBtn = () => {
        const {isEvaluate, showScore, leftBtnClick, rightBtnClick, ableRefuse} = this.props;
        let rightBtnText = '';
        if (showScore) {
            rightBtnText = '提交';
        } else {
            if (isEvaluate) {
                rightBtnText = '通过';
            } else {
                rightBtnText = '提交';
            }
        }
        return (
            <div>
                {ableRefuse 
                    ? <Button
                        size="small"
                        onClick={leftBtnClick}
                    >{isEvaluate ? '退回' : '保存'}</Button>
                    : false
                }
                <Button
                    type="primary"
                    size="small"
                    onClick={rightBtnClick}
                    style={{marginLeft: 10}}
                >{rightBtnText}</Button>
            </div>
        )
    }
    // 按钮显示
    btnShow = () => {
        const {isEvaluate, status, notShowBtn} = this.props;
        if ((isEvaluate && status == 1 && !notShowBtn) || (!isEvaluate && status == 0) && !notShowBtn) {
            return true;
        }
    }
    // 是否可填报
    reportAble = () => {
        const {isEvaluate, status} = this.props;
        if (!isEvaluate && status == 0) return true;
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
        let weightScoreItem = {};
        let scoreArr = [];
        let weigthScoreArr = [];
        indexItems.forEach((v, i) => {
            columns.push({
                title: '指标' + (i + 1),
                dataIndex: `score${i + 1}`,
                key: `score${i + 1}`,
                width: 80
            });
            const score = parseFloat(v.score);
            if (!Number.isNaN(score)) scoreArr.push(score);
            dataSourceItem[`score${i + 1}`] = Number.isNaN(score) ? '--' : score;
            if (this.props.hasWeight) {
                const weightScore = Number.isNaN(score) ? '--' : this.multiply([score, v.weights]);
                if (typeof(weightScore) === 'number') weigthScoreArr.push(weightScore);
                weightScoreItem[`score${i + 1}`] = weightScore;
            }
        });
        let dataSource = [];
        if (this.props.hasWeight) {
            dataSource = [
                {
                    ...dataSourceItem,
                    scoreTotal: scoreArr.length > 0 ? this.sum(scoreArr) : '--',
                    key: 'score',
                },
                {
                    ...weightScoreItem,
                    scoreTotal: weigthScoreArr.length > 0 ? this.sum(weigthScoreArr) : '--',
                    key: 'weightScore'
                }
            ]
        } else {
            dataSource = [
                {
                    ...dataSourceItem,
                    scoreTotal: scoreArr.length > 0 ? this.sum(scoreArr) : '--',
                    key: 'score'
                }
            ]
        }
        return (
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                size="small"
                className={`${reportMainStyle.indexTable} ${indexItems.length < 12 ? reportMainStyle.shortIndexTable : ''}`}
                scroll={{x: columns.length * 75}}
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
    // 浮点数相乘
    multiply = scoreArr => {
        let num = 0;
        scoreArr.forEach(v => {
            const float = v.toString().split('.')[1];
            const len = float ? float.length : 0;
            num = len > num ? len : num;
        })
        const weight = Math.pow(10, num);
        const weightTotal = Math.pow(weight, scoreArr.length);
        let sum = 1;
        scoreArr.forEach(v => {
            sum *= v * weight;
        })
        return sum / weightTotal;
    }

    render() {
        const {score, totalScore, indexTypeData, title, showScore, activeKey, indexTypeChange, modalVisible, modalKey,
            modalTitle, confirmBtn, cancelBtn, modalContent, loading, indexTypeDataLoading, hasTitle} = this.props;
        return (
            <div className={indexContent.wrap}>
                {hasTitle ? <header className={indexContent.indexTitle}>
                    <div>{title}</div>
                    {showScore
                        ? <div>
                            <div>当前得分：{score || score == 0 ? score : '--'}</div>/
                            <div>目标得分：{totalScore}</div>
                          </div>
                        : false}
                </header>
                : false}
                <Spin spinning={indexTypeDataLoading}>
                    <div className={indexContent.tabsWrap}>
                        <Tabs
                            activeKey={activeKey}
                            onChange={indexTypeChange}
                            size="default"
                            tabBarExtraContent={this.btnShow() ? this.getHandleBtn() : ''}
                        >
                            {this.getTabPanes(indexTypeData)}
                        </Tabs>
                    </div>
                </Spin>
                <Modal
                    title={modalTitle}
                    key={modalKey}
                    visible={modalVisible}
                    onOk={confirmBtn}
                    onCancel={cancelBtn}
                    confirmLoading={loading}
                >
                    {modalContent}
                </Modal>
            </div>
        )
    }
}

export default IndexContent;
