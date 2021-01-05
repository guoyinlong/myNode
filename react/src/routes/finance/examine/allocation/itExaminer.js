/**
 * 文件说明：组织绩效考核it专业线审核人配置
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2020-9-27
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import {Table, Icon, Modal} from 'antd';
import tableStyle from '../../../../components/finance/table.less';
import allocation from './allocation.less';
import {unitMap} from '../common/mapInformation';
import AddButton from '../common/addButton';
import UserSelect from './UserSelect';

class ItExaminer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userModalVisible: false,
            userMsg: {}
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
            type: 'allocationModel/itModifyExaminerUser',
            payload: {
                id,
                userId
            }
        })
    }
    // 生成配置项
    addIt = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'allocationModel/addIt'
        });
    }
    // 关闭模态框
    closeModal = () => {
        this.setState({
            userModalVisible: false
        })
    }

    render() {
        const {loading, itUsersData, users} = this.props;
        const {userModalVisible, userMsg} = this.state;

        return (
            <div>
                {itUsersData.length > 0
                    ? <Table
                         className={tableStyle.financeTable}
                         columns={this.getColumns()}
                         dataSource={this.getDataSource(itUsersData)}
                         loading={loading}
                      />
                    : <AddButton
                         loading={loading}
                         addIndex={this.addIt}
                      >生成it专业线申请人配置表</AddButton>
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

export default connect(mapStateToProps)(ItExaminer);
