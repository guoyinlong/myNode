/**
 * 文件说明：组织绩效考核支撑协同互评评分人配置
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2020-9-23
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import {Table, Icon, Modal, Select} from 'antd';
import tableStyle from '../../../../components/finance/table.less';
import allocation from './allocation.less';
import {unitMap} from '../common/mapInformation';
import AddButton from '../common/addButton';
import UserSelect from './UserSelect';

class AddMutual extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userModalVisible: false,
            userMsg: {},
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
            title: '部门（分院）',
            dataIndex: 'indexType',
            key: 'indexType',
            render: (text) => unitMap[text]
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
            type: 'allocationModel/supportModifyExaminerUser',
            payload: {
                id,
                userId,
                year: this.state.year
            }
        })
    }
    // 生成配置项
    addMutual = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'allocationModel/addMutual',
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
            type: 'allocationModel/getMutualUsers',
            payload: {
                year
            }
        })
    }

    render() {
        const {loading, mutualUsersData, users} = this.props;
        const {userModalVisible, userMsg} = this.state;

        return (
            <div>
                {this.getSelectList()}
                {mutualUsersData.length > 0
                    ? <Table
                         className={tableStyle.financeTable}
                         columns={this.getColumns()}
                         dataSource={this.getDataSource(mutualUsersData)}
                         loading={loading}
                      />
                    : <AddButton
                         loading={loading}
                         addIndex={this.addMutual}
                      >生成支撑协同互评配置表</AddButton>
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

export default connect(mapStateToProps)(AddMutual);
