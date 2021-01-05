/**
 * 文件说明：组织绩效考核用户选择弹出窗
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-11-30
 */
import {PureComponent} from 'react';
import {Input} from 'antd';
import allocation from './allocation.less';

class UserSelect extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: ''
        }
    }

    // 用户列表
    getUsers = (id, modifyUser, list = []) => list.map(v => (
        <li
            onClick={() => modifyUser(v.key, id)}
            key={v.key}
        >{v.value}</li>
    ))
    // 搜索
    onChange = e => {
        this.setState({
            searchValue: e.target.value
        })
    }
    // 过滤
    userFilter = users => users.filter(v => {
        let reg = new RegExp(this.state.searchValue);
        return reg.test(v.value);
    })

    render() {
        const {users, userMsg, modifyUser} = this.props;
        return (
            <div className={allocation.userMsg}>
                <header>
                    <div>
                        <span>当前用户：</span>
                        <span>{userMsg.userName}</span>
                    </div>
                    <div>
                        <Input onChange={this.onChange} />
                    </div>
                </header>
                <ul>
                    {this.getUsers(userMsg.id, modifyUser, this.userFilter(users))}
                </ul>
            </div>
        )
    }
}

export default UserSelect;
