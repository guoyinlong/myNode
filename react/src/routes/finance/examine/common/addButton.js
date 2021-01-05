/**
 * 文件说明：组织绩效考核插入内容按钮
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-11-29
 */
import {PureComponent} from 'react';
import {Button, Icon} from 'antd';
import addButtonStyle from './addButtonStyle.less';

class AddButton extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const {loading, addIndex, children} = this.props;
        return (
            <div>
                <Button
                    type="dashed"
                    onClick={addIndex}
                    className={addButtonStyle.addBtn}
                    loading={loading}
                >
                    <Icon type="plus" />
                    {children}
                </Button>
            </div>
        )
    }
}

export default AddButton;
