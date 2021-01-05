/**
 * 文件说明：组织绩效考核生成支撑服务评价人
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-12-3
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import AddButton from '../common/addButton';
import settingStyle from './settingStyle.less';
import {Icon, Select} from 'antd';

class AddSupports extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            year: new Date().getFullYear() + ''
        }
    }
    // 生成支撑服务评价人
    addIndex = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'supportModel/addSupportExaminerUsers',
            payload: {
                year: this.state.year
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
            type: 'supportModel/hasAddSupportExaminerUsers',
            payload: {
                year
            }
        })
    }

    render() {
        const {hasAdd, loading} = this.props;
        return (
            <div>
                {this.getSelectList()}
                {hasAdd
                ? <div className={settingStyle.settingFinish}><Icon type="check" style={{color: '#72da78'}} />已完成</div>
                : <AddButton
                    loading={loading}
                    addIndex={this.addIndex}
                >生成支撑服务评价人</AddButton>}
            </div>
        )
    }
}

const mapStateToProps = ({supportModel, loading}) => ({
    loading: loading.models.supportModel,
    ...supportModel
})

export default connect(mapStateToProps)(AddSupports);
