/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目启动的里程碑功能
 */
import React from 'react';
import { Row, Col, Modal, Table, message, Button } from 'antd';
import MileAddOrEdit from '../../../startup/projAdd/mileAddOrEdit';
import styles from '../../../startup/projAdd/attachment.less';
import { getUuid } from '../../../../../components/commonApp/commonAppConst.js';
const dateFormat = 'YYYY-MM-DD';

/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 功能：实现里程碑页面展示
 */
class MileStone extends React.Component {

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-01
     * 功能：模态框显示
     * @param modalType 模态框类型
     * @param mileStoneRecord 记录
     */
    showMileModal = (modalType, mileStoneRecord) => {
        this.props.dispatch({
            type: 'projChangeApply/showMileModal',
            modalType,
            mileStoneRecord
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-01
     * 功能：删除里程碑
     * @param record 表格的一条记录
     */
    deleteMilestone = (record) => {
        //删除时，可能需要有限制
        this.props.dispatch({
            type: 'projChangeApply/deleteMilestone',
            deleteMileRecord: record
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-21
     * 功能：添加里程碑模态框关闭
     * @param flag 关闭模态框时的标志，为confirm，cancel
     */
    hideMileModal = (flag) => {
        if (flag === 'confirm') {
            this.refs.mileAddOrEdit.validateFields((err, values) => {
                if (err) {
                    message.info('请检查输入项是否满足规则');
                    return;
                } else {
                    const {dispatch} = this.props;
                    dispatch({
                        type: 'projChangeApply/hideMileModal',
                        flag,
                        mileParams: {
                            mile_name: values.mile_name.trim(),
                            plan_begin_time: values.plan_begin_time.format(dateFormat),
                            plan_end_time: values.plan_end_time.format(dateFormat),
                            plan_workload: Number(values.plan_workload)
                        },
                    });
                }
            });
        } else if (flag === 'cancel') {
            this.props.dispatch({
                type: 'projChangeApply/hideMileModal',
                flag,
            });
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：获取里程碑页面信息
     * @param tag 保存或者提交标志位
     */
    getMileStoneInfo = (tag) => {
        const {mileStoneList} = this.props;
        let array_milestone = [];
        //提交时需要加时间和工作量的验证,包括opt_type为search的
        if (tag === 'submit') {
            if (mileStoneList.length) {
                //如果有里程碑
                let errorMilestoneIndex = 1;
                for (let i = 0; i < mileStoneList.length; i++) {
                    if (mileStoneList[i].opt_type !== 'delete') {
                        if (mileStoneList[i].plan_begin_time < this.props.begin_time) {
                            message.error(`第${errorMilestoneIndex}个里程碑开始时间小于项目的开始时间`);
                            return;
                        }
                        if (mileStoneList[i].plan_end_time > this.props.end_time) {
                            message.error(`第${errorMilestoneIndex}个里程碑结束时间大于项目的结束时间`);
                            return;
                        }
                        if (Number(this.props.remainWorkLoad) !== 0) {
                            message.error('有里程碑时，待分配工作量必须等于0');
                            return;
                        }
                        errorMilestoneIndex += 1;
                    }
                }
            }
        }
        for (let i = 0; i < mileStoneList.length; i++) {
            let obj = {};
            switch (mileStoneList[i].opt_type) {
                case 'insert':
                    obj.flag = 'insert';
                    obj.proj_uid = this.props.projNewUid;
                    obj.mile_uid = mileStoneList[i].mile_uid;
                    obj.mile_name = mileStoneList[i].mile_name;
                    obj.plan_begin_time = mileStoneList[i].plan_begin_time;
                    obj.plan_end_time = mileStoneList[i].plan_end_time;
                    obj.plan_workload = mileStoneList[i].plan_workload.toString();
                    obj.progress = (mileStoneList[i].plan_workload / this.props.fore_workload * 100).toFixed(2);
                    array_milestone.push(obj);
                    break;
                case 'update':
                    //经过model里面的判断，如果为update类型，则至少有一个值发生变化
                    //所以此处传的值不会传空字段
                    obj.flag = 'update';
                    obj.mile_uid = mileStoneList[i].mile_uid;                   //此处和启动不一样
                    //如果里程碑名称改变了，传值
                    if (mileStoneList[i].mile_name !== this.props.mileStoneListOriginal[i].mile_name) {
                        obj.mile_name = mileStoneList[i].mile_name;
                    }
                    //如果里程碑计划开始时间改变了，传值
                    if (mileStoneList[i].plan_begin_time !== this.props.mileStoneListOriginal[i].plan_begin_time) {
                        obj.plan_begin_time = mileStoneList[i].plan_begin_time;
                    }
                    //如果里程碑计划结束时间改变了，传值
                    if (mileStoneList[i].plan_end_time !== this.props.mileStoneListOriginal[i].plan_end_time) {
                        obj.plan_end_time = mileStoneList[i].plan_end_time;
                    }
                    //如果里程碑计划工作量改变了，传值
                    //这里使用Number的原因是，mileStoneList里面存的数字是字符串型的，
                    // 当为分别为 ‘4.0’ 和‘4’时，使用字符串认为是不等的,其实是相等的
                    if (Number(mileStoneList[i].plan_workload) !== Number(this.props.mileStoneListOriginal[i].plan_workload)) {
                        obj.plan_workload = mileStoneList[i].plan_workload.toString();
                        obj.progress = (mileStoneList[i].plan_workload / this.props.fore_workload * 100).toFixed(2);
                    }
                    array_milestone.push(obj);
                    break;
                case 'delete':
                    obj.flag = 'delete';
                    obj.mile_uid = mileStoneList[i].mile_uid;              //此处和启动不一样
                    array_milestone.push(obj);
                    break;
            }
        }
        return array_milestone;
    };


    render() {
        const {mileStoneList, fore_workload, remainWorkLoad, mileModalType, begin_time, end_time, projChangeCheckFlag} = this.props;
        let columns = [
            {
                title: '序号',
                dataIndex: '',
                width: '5%',
                render: (text, record, index) => {
                    return (<div>{index + 1}</div>)
                }
            }, {
                title: '里程碑名称',
                dataIndex: 'mile_name',
                width: '30%',
                render: (text, record, index) => {
                    return <div style={{textAlign: 'left'}}>{text}</div>
                }
            }, {
                title: '开始时间',
                dataIndex: 'plan_begin_time',
                width: '13%'
            }, {
                title: '结束时间',
                dataIndex: 'plan_end_time',
                width: '13%'
            },{
                title: '计划工作量（人月）',
                dataIndex: 'plan_workload',
                width:'15%'
            },{
                title: '进度',
                dataIndex: 'mile_month_progress',
                width:'8%',
                render: (text, record, index) => {
                    return <div style={{textAlign: 'left'}}>{text + '%'}</div>
                }
            }
        ];
        if (projChangeCheckFlag === '0') {
            columns.push(
                {
                    title: '操作',
                    dataIndex: '',
                    width: '15%',
                    render: (text, record, index) => {
                        return(
                            <div>
                                <Button
                                    type='primary'
                                    onClick={()=>this.showMileModal('edit',record)}
                                    disabled={record.is_edit !== '1'}
                                >{'编辑'}
                                </Button>
                                &nbsp;&nbsp;
                                <Button
                                    type='primary'
                                    onClick={()=>this.deleteMilestone(record)}
                                    disabled={record.is_edit !== '1'}
                                >{'删除'}
                                </Button>
                            </div>
                        );
                    }
                }
            );
        }

        return (
            <div>
                <div>
                    <Row style={{textAlign: 'right'}}>
                        <Col span={8}>
                            {fore_workload !== undefined ?
                                <p style={{marginBottom: '15px', fontWeight: '600', fontSize: '12px'}}>
                                    总共工作量&nbsp;&nbsp;<span style={{color: '#e4393c'}}>{fore_workload}</span>&nbsp;&nbsp;
                                    人月</p>
                                :
                                <p style={{marginBottom: '15px', fontWeight: '600', fontSize: '12px'}}>
                                    总共工作量&nbsp;&nbsp;<span style={{color: '#e4393c'}}>{'无'}</span></p>
                            }
                        </Col>
                        <Col span={8}>
                            {remainWorkLoad !== undefined ?
                                <p style={{marginBottom: '15px', fontWeight: '600', fontSize: '12px'}}>
                                    待分配工作量&nbsp;&nbsp;<span
                                    style={{color: '#e4393c'}}>{Number(remainWorkLoad).toFixed(1)}</span>&nbsp;&nbsp;人月
                                </p>
                                :
                                <p style={{marginBottom: '15px', fontWeight: '600', fontSize: '12px'}}>
                                    待分配工作量&nbsp;&nbsp;<span style={{color: '#e4393c'}}>{'无'}</span></p>
                            }

                        </Col>
                    </Row>
                </div>
                <div>
                    {
                        projChangeCheckFlag === '0'
                            ?
                            (Number(Number(remainWorkLoad).toFixed(1)) <= 0 || remainWorkLoad === undefined ?
                                    null
                                    :
                                    <div>
                                        <Button
                                            type='primary'
                                            onClick={()=>this.showMileModal('add')}
                                        >新增
                                        </Button>
                                    </div>
                            )
                            :
                            ''
                    }
                    <div style={{marginTop:5}}>
                        <Table
                            columns={columns}
                            dataSource={mileStoneList.filter(item => item.opt_type !== 'delete')}
                            className={styles.orderTable}
                            bordered={true}
                        />
                    </div>

                    {/*新增编辑里程碑时的模态框*/}
                    <Modal
                        visible={this.props.mileModalVisible}
                        width={640}
                        title={
                            mileModalType === 'add'
                                ?
                                '新增'
                                :
                                (mileModalType === 'edit' ? '编辑': '')
                        }
                        onOk={() => this.hideMileModal('confirm')}
                        onCancel={() => this.hideMileModal('cancel')}
                        maskClosable={false}
                    >
                        <MileAddOrEdit
                            ref="mileAddOrEdit"
                            key={getUuid(32, 64)}
                            mileStoneList={mileStoneList}
                            mileStoneModalData={this.props.mileStoneModalData}
                            mileModalType={mileModalType}
                            begin_time={begin_time}
                            end_time={end_time}
                            mileStoneRecord={this.props.mileStoneRecord}
                            fore_workload={this.props.fore_workload}
                            remainWorkLoad={this.props.remainWorkLoad}
                        />
                    </Modal>

                </div>
            </div>
        );
    }
}

export default MileStone;
