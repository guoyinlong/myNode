/**
 * 文件说明：组织绩效考核筛选框
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2020-8-4
 */
import {PureComponent} from 'react';
import {Select, Input, Button, Row, Col, DatePicker} from 'antd';
import Style from './filterBox.less';
const Option = Select.Option;
const {MonthPicker} = DatePicker;

class FilterBox extends PureComponent {
    constructor(props) {
        super(props);
    }

    // 筛选框
    getFilterBox = () => {
        const {filterData} = this.props;
        return filterData.map((v, i) => {
            let filterDom = '';
            switch (v.type) {
                case 'select':
                    filterDom = (
                        <Select
                            value={v.value}
                            onChange={v.onChange}
                            style={{width: v.width}}
                        >
                            {
                                v.options.map(item => (
                                    <Option key={item.key}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    )
                    break;
                case 'input':
                    filterDom = (
                        <Input
                            value={v.value}
                            onChange={v.onChange}
                            style={{width: v.width}}
                        />
                    )
                    break;
                case 'button':
                    filterDom = v.options.map((item, o) => (
                        <Button
                            onClick={item.onClick}
                            type={item.btnType}
                            key={o}
                            style={{marginRight: 10}}

                        >{item.title}</Button>
                    )) 
                    break;
                case 'monthPicker':
                    filterDom = (
                        <MonthPicker
                            value={v.value}
                            onChange={v.onChange}
                            format={v.format}
                            style={{width: v.width}}
                        />
                    )
                    break;
            }
            return (
                <Col
                    key={i}
                    span={v.span}
                    className={Style.col}
                >
                    {v.type === 'button' ? false : <div className={Style.title}>{v.title}：</div>}
                    <div>{filterDom}</div>
                </Col>
            )
        })
    }

    render() {
        return (
            <Row>{this.getFilterBox()}</Row>
        )
    }
}

export default FilterBox;
