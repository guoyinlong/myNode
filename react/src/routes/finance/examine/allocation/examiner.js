/**
 * 文件说明：组织绩效考核审核人配置
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-11-29
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import {Table, Icon, Modal, Select} from 'antd';
import tableStyle from '../../../../components/finance/table.less';
import allocation from './allocation.less';
import {unitMap, indexTypeMap} from '../common/mapInformation';
import AddButton from '../common/addButton';
import UserSelect from './UserSelect';

class Examiner extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userModalVisible: false,
            userMsg: {},
            unitKey: '0',
            year: new Date().getFullYear() + ''
        }
    }
    // 表格colums
    getColumns = () => [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '指标类型',
            dataIndex: 'indexType',
            key: 'indexType',
            render: (text) => indexTypeMap[text]
        },
        {
            title: '打分单元',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '用户',
            dataIndex: 'userName',
            key: 'userName',
            render: (text, record) => (
                <span
                    onClick={() => this.userModal(record)}
                    className={allocation.userName}
                >
                        {text}
                        <Icon
                            type="caret-down"
                            style={{fontSize: 12, marginLeft: 5}}
                        />
                </span>
            )
        }
    ]
    // 获取表格数据
    getDataSource = (list = []) => list.map((v, i) => ({
        ...v,
        index: i + 1,
        key: v.id
    }))
    // 弹出模态框
    userModal = (record) => {
        this.setState({
            userModalVisible: true,
            userMsg: record
        })
        
    }
    // 点击选择用户
    modifyUser = (userId, id) => {
        const {dispatch} = this.props;
        this.setState({
            userModalVisible: false
        })
        dispatch({
            type: 'allocationModel/modifyExaminerUser',
            payload: {
                id,
                userId,
                unitKey: this.state.unitKey,
                year: this.state.year
            }
        })
    }
    // 生成配置项
    addExaminerUsers = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'allocationModel/addExaminerUsers',
            payload: {
                year: this.state.year
            }
        });
    }
    // 关闭模态框
    closeModal = () => {
        this.setState({
            userModalVisible: false
        })
    }
    // 部门
    getUnit = () => {
        return (
            <div>
                <span style={{marginRight: 10}}>部门（分院）：</span>
                <Select
                    defaultValue='0'
                    style={{width: 150, marginBottom: 10}}
                    onChange={this.selectUnit}
                >
                    {unitMap.map((v, i) => (
                        <Select.Option
                            key={i}
                        >{v}</Select.Option>
                    ))}
                </Select>
            </div>
        )
    }
    // 选择部门
    selectUnit = value => {
        const {dispatch} = this.props;
        dispatch({
            type: 'allocationModel/getExaminerUsers',
            payload: {
                unitKey: value,
                year: this.state.year
            }
        });
        this.setState({
            unitKey: value
        })
    }
    // 年份选择列表
    getSelectList = () => {
        const currentYear = new Date().getFullYear();
        let optionDate = [];
        for (let i = 2019; i <= currentYear; i++) {
            optionDate.push({
                year: i + '',
                key: i + 'year',
                text: i
            })
        }
        const options = optionDate.map(v => (
            <Select.Option
                value={v.year}
                key={v.key}
            >
                {v.text}
            </Select.Option>
        ))
        return (
            <div>
                <span>年度：</span>
                <Select
                    value={this.state.year}
                    style={{width: 100, marginBottom: 10}}
                    onChange={this.indexSelect}
                >
                    {options}
                </Select>
            </div>
        )
    }
    // 年份选择时
    indexSelect = year => {
        const {dispatch} = this.props;
        this.setState({
            year
        });
        dispatch({
            type: 'allocationModel/getExaminerUsers',
            payload: {
                year,
                unitKey: this.state.unitKey
            }
        })
    }

    render() {
        const {loading, examinerUsers, users} = this.props;
        const {userModalVisible, userMsg} = this.state;

        return (
            <div>
                <div style={{display: 'flex'}}>
                    <div style={{marginRight: 10}}>{this.getSelectList()}</div>
                    {examinerUsers.length > 0 ? this.getUnit() : null}
                </div>
                {examinerUsers.length > 0
                    ? <Table
                         className={tableStyle.financeTable}
                         columns={this.getColumns()}
                         dataSource={this.getDataSource(examinerUsers)}
                         loading={loading}
                      />
                    : <AddButton
                         loading={loading}
                         addIndex={this.addExaminerUsers}
                      >生成审核人配置</AddButton>
                }
                <Modal
                    footer={null}
                    onCancel={this.closeModal}
                    visible={userModalVisible}
                >
                    {userModalVisible
                        ? <UserSelect
                            users={users}
                            userMsg={userMsg}
                            modifyUser={this.modifyUser}
                          />
                        : null}
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = ({allocationModel, loading}) => ({
    loading: loading.models.allocationModel,
    ...allocationModel
});

export default connect(mapStateToProps)(Examiner);
