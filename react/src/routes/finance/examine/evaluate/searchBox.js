/**
 * 文件说明：组织绩效考核指标评价搜索框
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-9-18
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import {Form, Button, Select, Input} from 'antd';
import evaluateStyle from './evaluateStyle.less';

class SearchBox extends PureComponent {
    constructor(props) {
        super(props);
        this.currentYear = new Date().getFullYear();
    }
    // 筛选框初始值
    getInitialValue = options => {
        if (options.id === 'year') {
            return new Date().getFullYear() + '';
        }
        return options.options[0].value;
    }
    // 获取表单项
    getFormItem = (list = []) => {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return list.map((v, i) => {
            return (
                <Form.Item
                    label={v.title}
                    className={evaluateStyle.formItem}
                    key={i}
                >
                    {getFieldDecorator(v.id, {
                        initialValue: v.type === 'select' ? this.getInitialValue(v) : ''
                    })(
                        v.type === 'select'
                        ? <Select
                            showSearch
                            optionFilterProp="children"
                        >
                            {this.getOption(v.options)}
                        </Select>
                        : <Input />
                    )}
                </Form.Item>
            )
        })
    }
    // 获取选择选项
    getOption = (list = []) => {
        const {Option} = Select;
        return list.map((v, i) => (
            <Option value={v.value} key={v.id}>
                {v.text}
            </Option>
        ))
    }
    // 清空条件
    clearRules = () => {
        const {form} = this.props;
        const {setFieldsValue} = form;
        let rules = {
            year: new Date().getFullYear() + '',
            unit: '',
            applicantName: '',
            status: '',
            type: ''
        };
        setFieldsValue(rules);
    }

    render() {
        const {searchList} = this.props;
        return (
            <Form className={evaluateStyle.searchForm} layout="inline">
                {this.getFormItem(searchList)}
                <Button type="primary" onClick={this.clearRules}>重置条件</Button>
            </Form>
        )
    }
}

let timer = null;
const SearchBoxForm = Form.create({
    onValuesChange(props, values) { // 选项改变时
        clearTimeout(timer);
        let res = {};
        for (let v in values) {
            res[v] = values[v].replace(/\s+/g, '');
        }
        timer = setTimeout(() => {
            props.dispatch({
                type: 'indexModel/getSearchRules',
                rules: {
                    ...res
                }
            })
        }, 500)
        
    }
})(SearchBox);

const mapStatesToProps = ({indexModel}) => ({
    ...indexModel
});

export default connect(mapStatesToProps)(SearchBoxForm);
