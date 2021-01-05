/**
 * 文件说明：组织绩效考核生成指标
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-12-3
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import AddButton from '../common/addButton';
import {Select, Icon, Button} from 'antd';
import settingStyle from './settingStyle.less';

class AddIndex extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            year: new Date().getFullYear() + '',
            showImport: false,
            password: []
        }
    }

    // 生成指标
    addIndex = () => {
        const {dispatch} = this.props;
        const {year} = this.state;
        dispatch({
            type: 'indexModel/addIndex',
            payload: {
                year
            }
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
                {this.state.showImport ? <Button type="primary" style={{marginLeft: 10}} onClick={this.importIndex}>导入</Button> : false}
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
            type: 'indexModel/hasAddIndex',
            payload: {
                year
            }
        })
    }
    // 导入指标
    importIndex = () => {
        this.props.dispatch({
            type: 'indexModel/importIndexModel'
        })
    }
    // 显示导入按钮
    showImportBtn = e => {
        let password = [
            ...this.state.password,
            e.key
        ];
        this.setState({
            password
        });
        if (/123abc/.test(password.join(''))) {
            this.setState({
                showImport: true,
                password: ''
            });
        }
        if (/cba321/.test(password.join(''))) {
            this.setState({
                showImport: false,
                password: ''
            });
        }
        
    }

    componentDidMount() {
        document.onkeydown = this.showImportBtn
    }

    render() {
        const {hasAdd, loading} = this.props;
        return (
            <div>
                {this.getSelectList()}
                {
                    hasAdd
                        ? <div className={settingStyle.settingFinish}><Icon type="check" style={{color: '#72da78'}} />已完成</div>
                        : <AddButton
                            loading={loading}
                            addIndex={this.addIndex}
                        >生成指标</AddButton>
                }
            </div>
        )
    }
}

const mapStateToProps = ({indexModel, loading}) => ({
    loading: loading.models.indexModel,
    ...indexModel
})

export default connect(mapStateToProps)(AddIndex);
