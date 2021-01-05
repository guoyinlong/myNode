/**
 * 文件说明：组织绩效考核指标详情小指标项
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-9-18
 */
import {PureComponent} from 'react';
import {Input, Row, Col, Icon, message, Modal, Button, Popconfirm} from 'antd';
import {connect} from 'dva';
import {statusMap} from './mapInformation';
import indexStyle from './indexDetail.less';
import statusStyle from './statusColor.less';
import {clearInterval, setInterval} from 'timers';
import IndexContent from './indexContent';

class IndexItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentReport: '',
            itReportVisible: false,
            itEvaluateVisible: false,
            mutualVisible: false,
            mutualKey: '',
            mutualStatus: '0'
        }
        this.mutualId = '';
        this.examineObject = '';
        this.mutualIndex = 0;
    }
    // 获取分数
    getIndexScore = () => {
        const {indexItem, flag, tag, status, indexShowType, indexTypeData, itActiveKey, indexTypeDataLoading, loading, location} = this.props;
        let scoreElem = '';
        let params = status == 1 ? {} : {footer: null};
        if (indexShowType === 1 && (flag == 0 || flag === undefined) && tag === 1 && status == 1) {
            let scoreStyle = '';
            let dataMark = '';
            switch (indexItem.checkWarning) {
                case 0:
                    scoreStyle = indexStyle.causeReportWarning;
                    dataMark = 'evaluateWarnning'
                    break;
                case 1:
                    scoreStyle = indexStyle.reportSuccess;
                    break;
            }
            scoreElem = indexItem.content === '支撑协同互评'
            ? parseFloat(indexItem.score) || '--'
            : (
                <Col>
                    <Input
                        value={indexItem.score}
                        onChange={e => this.onInputValueChange(e, indexItem.totalScore, indexItem.content)}
                        onBlur={e => this.onEvaluateBlur(e, indexItem.totalScore)}
                        style={{width: 70}}
                        className={scoreStyle}
                        data-mark={dataMark}
                        onClick={this.itClick}
                    />
                </Col>
            )
        } else {
            if (indexItem.content === 'IT专业线运营支撑' && location.pathname === '/financeApp/examine/evaluate/evaluateDetail') {
                scoreElem = (
                    <Col>
                        <span
                            className={indexStyle.itScore}
                            onClick={this.itClick}
                        >
                            {indexItem.score || indexItem.score === 0 ? indexItem.score : '--'}
                        </span>
                    </Col>
                )
            } else if (indexItem.content === '支撑协同互评') {
                scoreElem = <Col>{indexItem.score ? indexItem.score : '--'}</Col>
            } else {
                scoreElem = <Col>{indexItem.score || indexItem.score === 0 ? indexItem.score : '--'}</Col>
            }
        }
        return (
            <Row type="flex" align="middle" justify="space-between" gutter={16}>
                <Col>得分：</Col>
                {scoreElem}/
                <Col>
                    {indexItem.totalScore}
                    <Modal
                        visible={this.state.itEvaluateVisible}
                        onCancel={() => this.modalClose('itEvaluateVisible')}
                        bodyStyle={{padding: '15px 0', borderRadius: 5}}
                        width='80%'
                        closable={false}
                        okText='分数合计'
                        onOk={this.getItScore}
                        {...params}
                    >
                        <div>
                            <IndexContent
                                hasTitle={false}
                                indexTypeData={indexTypeData}
                                activeKey={itActiveKey}
                                indexTypeDataLoading={indexTypeDataLoading}
                                status={status}
                                isEvaluate={true}
                                showScore={true}
                                loading={loading}
                                evaluateChange={this.evaluateChange}
                                evaluateBlur={this.evaluateItBlur}
                                notShowBtn={true}
                                indexTypeChange={this.indexEvaluateTypeChange}
                                type="it"
                                hasWeight={true}
                                tag={tag}
                            />
                        </div>
                    </Modal>
                </Col>
            </Row>
        );
    }
    // it专业线运营支撑点击
    itClick = () => {
        const {dispatch, indexEvaluateDetailList, indexItem} = this.props;
        if (indexItem.content === 'IT专业线运营支撑') {
            this.setState({
                itEvaluateVisible: true
            });
            dispatch({
                type: 'indexModel/getYearCount',
                payload: {
                    indexId: indexEvaluateDetailList.id,
                    year: indexEvaluateDetailList.year
                }
            })
        }
    }
    // it专业线tab切换
    indexEvaluateTypeChange = key => {
        const {dispatch, indexTypeData, indexEvaluateDetailList} = this.props;
        let hasIndexItemData = indexTypeData.some(v => v.id === key && v.indexItemData);
        let type = '';
        for (let v of indexTypeData) {
            if (v.id === key) {
                type = v.type;
                break;
            }
        }
        if (!hasIndexItemData) {
            dispatch({
                type: 'indexModel/getYearDetail',
                payload: {
                    indexId: indexEvaluateDetailList.id,
                    year: indexEvaluateDetailList.year,
                    type,
                    id: key
                }
            });
        }
        dispatch({
            type: 'indexModel/save',
            payload: {
                itActiveKey: key
            }
        });
    }
    // it分数保存
    evaluateItBlur = (value, itemId, indexTypeIndex, indexItemIndex) => {
        const {dispatch} = this.props;
        if (value.length > 0) {
            dispatch({
                type: 'indexModel/markITItem',
                payload: {
                    itemId,
                    score: value,
                    indexTypeIndex,
                    indexItemIndex
                }
            })
        } else {
            dispatch({
                type: 'indexModel/indexItemSave',
                payload: {
                    indexTypeIndex,
                    indexItemIndex,
                    key: 'evaluateComplete',
                    value: 0
                }
            });
            dispatch({
                type: 'indexModel/indexTypeCompleteSave',
                payload: {
                    indexTypeIndex: indexTypeIndex,
                    checkKey: 'score',
                    key: 'evaluateComplete'
                }
            });
            message.error('不能为空');
        }
    }
    // it分数合计
    getItScore = () => {
        const {dispatch, indexEvaluateDetailList, typeIndex, itemIndex, indexItem} = this.props;
        let timer = setInterval(() => {
            if (!this.props.loading) {
                const {indexTypeData} = this.props;
                let submitAble = true;
                for (let v1 of indexTypeData) {
                    if (v1.indexItemData) {
                        for (let v2 of v1.indexItemData) {
                            if (!v2.score && v2.score !== 0) {
                                v2.evaluateComplete = 0;
                            }
                            if (submitAble && v2.evaluateComplete === 0) {
                                submitAble = false;
                            }
                        }
                        if (submitAble && !v1.allCompleted) {
                            submitAble = false;
                        }
                    }
                }
                dispatch({
                    type: 'indexModel/save',
                    payload: {
                        indexTypeData: JSON.parse(JSON.stringify(indexTypeData))
                    }
                });
                if (submitAble) {
                    dispatch({
                        type: 'indexModel/getItScore',
                        payload: {
                            indexId: indexEvaluateDetailList.id,
                            itemId: indexItem.id,
                            typeIndex,
                            itemIndex
                        }
                    });
                    let timer1 = setInterval(() => {
                        if (!this.props.loading) {
                            this.modalClose('itEvaluateVisible');
                            clearInterval(timer1);
                        }
                    }, 200);
                } else {
                    message.error('请正确填写所有打分项再提交');
                }
                clearInterval(timer);
            }
        }, 200)
    }
    // 获取完成情况
    getIndexCompletion = () => {
        const {indexItem, flag, status, indexShowType, itActiveKey, indexTypeDataLoading, indexTypeData, loading, location} = this.props;
        if (indexItem.content === 'IT专业线运营支撑') {
            let params = status == 0 ? {} : {footer: null};
            return (
                <span
                    className={indexStyle.clickReport}
                    onClick={this.itReportModalShow}
                >
                    <span
                        className={indexItem.completion ? statusStyle.status2 : statusStyle.status0 + ' ' + indexStyle.mutualStyle}
                        style={{cursor: location.pathname === '/financeApp/examine/evaluate/evaluateDetail' ? 'default' : 'pointer'}}
                    >{location.pathname === '/financeApp/examine/evaluate/evaluateDetail' ? '已填报' : indexItem.completion ? '点击查看' : '点击填报'}</span>
                    <Modal
                        visible={this.state.itReportVisible}
                        onCancel={() => this.modalClose('itReportVisible')}
                        bodyStyle={{padding: '15px 0', borderRadius: 5}}
                        width='80%'
                        closable={false}
                        okText='保存'
                        onOk={this.itReportSave}
                        {...params}
                    >
                        <IndexContent
                            hasTitle={false}
                            indexTypeData={indexTypeData}
                            indexTypeChange={this.indexReportTypeChange}
                            activeKey={itActiveKey}
                            indexTypeDataLoading={indexTypeDataLoading}
                            isEvaluate={false}
                            showScore={true}
                            loading={loading}
                            status={status}
                            fillBlur={this.fillBlur}
                            fillChange={this.fillChange}
                            notShowBtn={true}
                            type="it"
                        />
                    </Modal>
                </span>
            );
        } else if (indexItem.content.substring(0, 6) === '关键任务协同') {
            const completion = indexItem.completion ? indexItem.completion.replace(/\n/g, '<br>') : '等待主责部门完成填报';
            return (
                <span
                    dangerouslySetInnerHTML={{__html: completion}}
                    className={indexItem.completion ? '' : statusStyle.status0}
                ></span>
            )
        }
        if (indexShowType === 1 || status != 0 || (flag != 0 && flag !== undefined)) {
            const completion = indexItem.completion ? indexItem.completion.replace(/\n/g, '<br>') : '';
            return (
                <span dangerouslySetInnerHTML={{__html: completion}}></span>
            )
        }
        let reportStyle = '';
        let dataMark = '';
        switch(indexItem.reportWarning) {
            case 0:
                reportStyle = indexStyle.causeReportWarning;
                dataMark = 'reportWarnning'
                break;
            case 1:
                reportStyle = indexStyle.reportSuccess;
                break;
        }
        return (
            <div style={{
                width: '100%'
            }}>
                <Input.TextArea
                    defaultValue={indexItem.completion ? indexItem.completion : ''}
                    autosize={{minRows: 4}}
                    style={{
                        resize: 'vertical'
                    }}
                    onFocus={this.onReportFocus}
                    onBlur={this.onReportBlur}
                    className={reportStyle}
                    data-mark={dataMark}
                />
            </div>
        )
    }
    // it专业线运营支撑弹窗
    itReportModalShow = () => {
        const {indexItem, location} = this.props;
        if (location.pathname !== '/financeApp/examine/evaluate/evaluateDetail') {
            this.setState({
                itReportVisible: true
            });
            this.props.dispatch({
                type: 'indexModel/getCount',
                payload: {
                    itemId: indexItem.id
                }
            })
        }
    }
    // it专业线tab切换
    indexReportTypeChange = key => {
        const {dispatch, indexTypeData} = this.props;
        let hasIndexItemData = indexTypeData.some(v => v.id === key && v.indexItemData);
        let type = '';
        let typeId = '';
        for (let v of indexTypeData) {
            if (v.id === key) {
                type = v.type;
                typeId = v.typeId;
                break;
            }
        }
        if (!hasIndexItemData) {
            dispatch({
                type: 'indexModel/getItIndexDetail',
                payload: {
                    type,
                    itemId: typeId,
                    id: key
                }
            });
        }
        dispatch({
            type: 'indexModel/save',
            payload: {
                itActiveKey: key
            }
        });
    }
    // 弹窗关闭
    modalClose = modalName => {
        this.setState({
            [modalName]: false
        })
    }
    // it填报改变时
    fillChange = (value, indexTypeIndex, indexItemIndex) => {
        this.props.dispatch({
            type: 'indexModel/indexItemSave',
            payload: {
                indexTypeIndex,
                indexItemIndex,
                key: 'completion',
                value
            }
        })
    }
    // it单一指标保存
    fillBlur = (indexTypeId, indexItemId, value, indexTypeIndex, indexItemIndex) => {
        const {dispatch} = this.props;
        if (value) {
            dispatch({
                type: 'indexModel/fillInYearItem',
                payload: {
                    itemId: indexItemId,
                    completion: value,
                    indexTypeIndex,
                    indexItemIndex
                }
            })
        } else {
            dispatch({
                type: 'indexModel/indexItemSave',
                payload: {
                    indexTypeIndex,
                    indexItemIndex,
                    key: 'fillComplete',
                    value: 0
                }
            });
            dispatch({
                type: 'indexModel/indexTypeCompleteSave',
                payload: {
                    indexTypeIndex,
                    checkKey: 'completion',
                    key: 'fillComplete'
                }
            });
            message.error('不能为空');
        }
    }
    // it填报完成后保存
    itReportSave = () => {
        const {dispatch, indexItem, indexId, tag, indexEvaluateDetailList, typeIndex, itemIndex} = this.props;
        let timer = setInterval(() => {
            if (!this.props.loading) {
                const {indexTypeData} = this.props;
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
                    type: 'indexModel/save',
                    payload: {
                        indexTypeData: JSON.parse(JSON.stringify(indexTypeData))
                    }
                });
                if (submitAble) {
                    let indexId1 = '';
                    if (tag) {
                        indexId1 = indexEvaluateDetailList.id
                    } else {
                        indexId1 = indexId
                    }
                    dispatch({
                        type: 'indexModel/saveITItem',
                        payload: {
                            indexId: indexId1,
                            itemId: indexItem.id,
                            tag,
                            typeIndex,
                            itemIndex
                        }
                    })
                    this.modalClose('itReportVisible')
                } else {
                    message.error('请正确填写所有填报项后再保存');
                }
                clearInterval(timer);
            }
        }, 200)
    }
    // 填报获取焦点后
    onReportFocus = e => {
        const {dispatch} = this.props;
        dispatch({
            type: 'indexModel/save',
            payload: {
                reportIsChange: false
            }
        })
        this.setState({
            currentReport: e.target.value
        })
    }
    // 填报失焦后
    onReportBlur = e => {
        const {dispatch, indexItem, typeIndex, itemIndex, tag} = this.props;
        const inputValue = e.target.value;
        const listName = tag === undefined ? 'indexTypesDetailList' : 'indexEvaluateDetailList';
        const updateMethod = tag === undefined ? 'updateIndexTypes' : 'updateIndexDetail';
        if (inputValue !== this.state.currentReport) {
            dispatch({
                type: 'indexModel/save',
                payload: {
                    reportIsChange: true
                }
            });
            if (inputValue.length <= 3000) {
                dispatch({
                    type: 'indexModel/indexItemReport',
                    payload: {
                        itemId: indexItem.id,
                        completion: inputValue,
                        typeIndex,
                        itemIndex,
                        listName,
                        updateMethod
                    }
                });
                dispatch({
                    type: 'indexModel/' + updateMethod,
                    payload: {
                        typeIndex,
                        itemIndex,
                        indexProp: {
                            completion: inputValue
                        },
                        listName
                    }
                });
            } else {
                message.error('字符数不能超过3000');
            }
        }
    }
    // 评分失焦后
    onEvaluateBlur = (e, targetScore) => {
        const {dispatch, indexItem, typeIndex, itemIndex, type} = this.props;
        let currentScoreStr = e.target.value;
        if (currentScoreStr.charAt(currentScoreStr.length - 1) === '.') {
            currentScoreStr = currentScoreStr.substring(0, currentScoreStr.length - 1);
        }
        dispatch({
            type: 'indexModel/updateIndexDetail',
            payload: {
                indexProp: {
                    score: currentScoreStr
                },
                typeIndex,
                itemIndex,
                listName: 'indexEvaluateDetailList'
            }
        })
        const currentScore = /^\s*$/.test(currentScoreStr) ? currentScoreStr : Number(currentScoreStr);
        if (typeof currentScore === 'number' && !Number.isNaN(currentScore)) {
            if (targetScore < 0) {
                if (currentScore < targetScore) {
                    message.error('减分项不能小于目标分数')
                } else if (currentScore <= 0) {
                    dispatch({
                        type: 'indexModel/indexItemEvaluate',
                        payload: {
                            itemId: indexItem.id,
                            score: currentScore,
                            targetScore,
                            weights: indexItem.weights,
                            typeIndex,
                            itemIndex,
                            listName: 'indexEvaluateDetailList'
                        }
                    })
                    return;
                } else {
                    message.error('减分项评分不能大于0');
                }
            } else {
                if (currentScore > targetScore && type !== 1) {
                    message.error('评分不能大于目标分数');
                } else if (currentScore >= 0) {
                    dispatch({
                        type: 'indexModel/indexItemEvaluate',
                        payload: {
                            itemId: indexItem.id,
                            score: currentScore,
                            targetScore,
                            weights: indexItem.weights,
                            typeIndex,
                            itemIndex,
                            listName: 'indexEvaluateDetailList'
                        }
                    })
                    return;
                } else {
                    message.error('评分不能小于0');
                }
            }
        } else if (!/^\s*$/.test(currentScore)) {
            message.error('评分必需是数字');
        }
        dispatch({
            type: 'indexModel/updateIndexDetail',
            payload: {
                indexProp: {
                    checkWarning: 0
                }, 
                typeIndex,
                itemIndex,
                listName: 'indexEvaluateDetailList'
            }
        })
    }
    // 填写评分时
    onInputValueChange = (e, targetScore, content) => {
        if (content === 'IT专业线运营支撑') return;
        const {typeIndex, itemIndex, dispatch} = this.props;
        const score = this.strToNumber(e.target.value, targetScore);
        dispatch({
            type: 'indexModel/updateIndexDetail',
            payload: {
                indexProp: {
                    score
                },
                typeIndex,
                itemIndex,
                listName: 'indexEvaluateDetailList'
            }
        })
    }
    // 字符串转数字
    strToNumber = (str, targetScore) => {
        let t = str.charAt(0);
        let res1 = str.replace(/[^\.^\d]/g, '');
        let res2 = res1.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        let res2Split = res2.split('.');
        if (res2Split[1] && res2Split[1].length > 4) {
            res2Split[1] = res2Split[1].substring(0, 4);
            res2= res2Split.join('.');
        }
        if (t === '-' && targetScore < 0) {
            return '-' + res2;
        } else {
            return res2;
        }
    }
    // 回到顶部
    backTop = () => {
        const scrollToTop = setInterval(() => {
            let target = document.querySelector('#main_container');
            let pos = target.scrollTop;
            if (pos > 0) {
                target.scrollTo(0, pos - 100);
            } else {
                clearInterval(scrollToTop);
            }
        }, 16);
    }
    // 获取支撑协同互评
    getMutual = () => {
        const {mutualData, mututalActiveKey, indexTypeData, indexTypeDataLoading, loading, indexItem, location} = this.props;
        if (location.pathname === '/financeApp/examine/evaluate/evaluateDetail') {
            if (indexItem.score) {
                return <span>互评打分已完成</span>
            } else {
                return <span>等待各部门完成互评打分</span>
            }
        } else {
            const {mutualVisible, mutualKey, mutualStatus} = this.state;
            let footer = null;
            if (mutualStatus == 1) {
                footer = (
                    <div>
                        <Button
                            onClick={() => this.modalClose('mutualVisible')}
                        >取消</Button>
                        <Popconfirm
                            title="提交后无法更改，是否确认提交？"
                            onConfirm={this.mutualSubmit}
                        >
                            <Button
                                type="primary"
                            >提交</Button>
                        </Popconfirm>
                    </div>
                )
            }
            return (
                <span>
                    {mutualData.map((v, i) => {
                        let itemStatus = null;
                        switch (v.status) {
                            case '1':
                                itemStatus = statusStyle.status0;
                                break;
                            case '2':
                                itemStatus = statusStyle.status2;
                                break;
                        }
                        if (i === mutualData.length - 1) {
                            return (
                                <span
                                    key={v.examineObject}
                                    className={itemStatus + ' ' + indexStyle.mutualStyle}
                                    onClick={() => this.mutalClick(v.id, v.examineObject, v.status, i)}
                                >{v.examineObject}</span>
                            )
                        } else {
                            return (
                                <span key={v.examineObject}>
                                    <span
                                        className={itemStatus + ' ' + indexStyle.mutualStyle}
                                        onClick={() => this.mutalClick(v.id, v.examineObject, v.status, i)}
                                    >{v.examineObject}</span>，
                                </span>
                            )
                        }
                    })}
                    <Modal
                        visible={mutualVisible}
                        key={mutualKey}
                        onCancel={() => this.modalClose('mutualVisible')}
                        bodyStyle={{padding: '15px 0', borderRadius: 5}}
                        width='80%'
                        closable={false}
                        okText='提交'
                        onOk={this.mutualSubmit}
                        footer={footer}
                    >
                        <IndexContent
                            hasTitle={false}
                            indexTypeData={indexTypeData}
                            activeKey={mututalActiveKey}
                            indexTypeDataLoading={indexTypeDataLoading}
                            isEvaluate={true}
                            showScore={true}
                            loading={loading}
                            status={mutualStatus}
                            notShowBtn={true}
                            keyType='examineIndex'
                            indexTypeChange={this.indexTypeChange}
                            evaluateChange={this.evaluateChange}
                            evaluateBlur={this.evaluateBlur}
                            tag="1"
                        />
                    </Modal>
                </span>
            )
        }
    }
    // 点击互评
    mutalClick = (mutualId, examineObject, status, index) => {
        const {dispatch, location} = this.props;
        this.setState({
            mutualStatus: status,
            mutualVisible: true
        });
        this.mutualId = mutualId;
        this.examineObject = examineObject;
        this.mutualIndex = index;
        dispatch({
            type: 'indexModel/getMutualItemIndexs',
            payload: {
                mutualId,
                examineObject,
                year: location.query.year
            }
        });
    }
    // 指标类型切换
    indexTypeChange = key => {
        const {dispatch, indexTypeData, location} = this.props;
        let hasIndexItemData = indexTypeData.some(v => v.examineIndex === key && v.indexItemData);
        if (!hasIndexItemData) {
            dispatch({
                type: 'indexModel/getMutualDetail',
                payload: {
                    mutualId: this.mutualId,
                    examineObject: this.examineObject,
                    examineIndex: key,
                    year: location.query.year
                }
            });
        }
        dispatch({
            type: 'indexModel/save',
            payload: {
                mututalActiveKey: key
            }
        });
    }
    // 分数填写
    evaluateChange = (value, indexTypeIndex, indexItemIndex) => {
        this.props.dispatch({
            type: 'indexModel/indexItemSave',
            payload: {
                indexTypeIndex,
                indexItemIndex,
                key: 'score',
                value
            }
        })
    }
    // 分数保存
    evaluateBlur = (value, itemId, indexTypeIndex, indexItemIndex) => {
        const {dispatch, location} = this.props;
        if (value.length > 0) {
            dispatch({
                type: 'indexModel/supportMarkItem',
                payload: {
                    itemId,
                    score: value,
                    indexTypeIndex,
                    indexItemIndex,
                    year: location.query.year
                }
            })
        } else {
            dispatch({
                type: 'indexModel/indexItemSave',
                payload: {
                    indexTypeIndex,
                    indexItemIndex,
                    key: 'evaluateComplete',
                    value: 0
                }
            });
            dispatch({
                type: 'indexModel/indexTypeCompleteSave',
                payload: {
                    indexTypeIndex: indexTypeIndex,
                    checkKey: 'score',
                    changeKey: 'evaluateComplete'
                }
            });
            message.error('不能为空');
        }
        
    }
    // 互评提交
    mutualSubmit = () => {
        const {indexItem, typeIndex, itemIndex, location} = this.props;
        let timer = setInterval(() => {
            if (!this.props.loading) {
                const {indexTypeData, dispatch} = this.props;
                let submitAble = true;
                for (let v1 of indexTypeData) {
                    if (v1.indexItemData) {
                        for (let v2 of v1.indexItemData) {
                            if (!v2.score) {
                                v2.evaluateComplete = 0;
                            }
                            if (submitAble && v2.evaluateComplete === 0) {
                                submitAble = false;
                            }
                        }
                    }
                    if (submitAble && !v1.allCompleted) {
                        submitAble = false;
                    }
                }
                dispatch({
                    type: 'supportModel/save',
                    payload: {
                        indexTypeData: JSON.parse(JSON.stringify(indexTypeData))
                    }
                });
                if (submitAble) {
                    this.props.dispatch({
                        type: 'indexModel/supportSubmitIndex',
                        payload: {
                            mutualId: this.mutualId,
                            examineObject: this.examineObject,
                            mutualIndex: this.mutualIndex,
                            itemId: indexItem.id,
                            typeIndex,
                            itemIndex,
                            year: location.query.year
                        }
                    });
                    this.setState({
                        mutualVisible: false
                    });
                } else {
                    message.error('请正确填写所有打分项再提交');
                }
                clearInterval(timer);
            }
        }, 200)
    }

    render() {
        const {indexItem, type, tag} = this.props;
        return (
            <div className={indexStyle.indexItem}>
                <header>
                    <h3 className={indexItem.completion ? statusStyle.status2 : ''}>
                        <span>指标{indexItem.index}：</span>
                        <span dangerouslySetInnerHTML={{__html: indexItem.content}}></span>
                    </h3>
                    {this.getIndexScore()}
                </header>
                <section>
                    <span>完成目标</span>：
                    <span dangerouslySetInnerHTML={{__html: indexItem.goal}}></span>
                </section>
                <section>
                    <span>计分方法</span>：
                    <span dangerouslySetInnerHTML={{__html: indexItem.scoreMethod}}></span>
                </section>
                <section>
                    <span>打分主体</span>：
                    <span dangerouslySetInnerHTML={{__html: indexItem.examinerName}}></span>
                </section>
                {type === 4 ? null : <section>
                    <span>状态</span>：
                    <span className={statusStyle['status' + indexItem.status]}>{statusMap[indexItem.status]}</span>
                </section>}
                {indexItem.content === '支撑协同互评'
                ? <section>
                    <span>互评打分</span>：
                    {this.getMutual()}
                </section> 
                : <section>
                    <span>完成情况</span>：
                    {type === 4
                        ? <span className={statusStyle.status0}>此项指标无需填写完成情况</span>
                        : this.getIndexCompletion()}
                </section>}
                {tag === undefined ? null : <span onClick={this.backTop} className={indexStyle.backTop}><Icon type="arrow-up" />回到顶部</span>}
            </div>
        )
    }
}

const mapStateToProps = ({indexModel, loading}) => ({
    loading: loading.models.indexModel,
    ...indexModel
})

export default connect(mapStateToProps)(IndexItem);
