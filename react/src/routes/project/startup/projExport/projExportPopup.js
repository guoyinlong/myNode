/**
 * 作者： 夏天
 * 创建日期：2018-08-28
 * 邮件：1348744578@qq.com
 * 文件说明：项目信息导出--弹框组件
 */
import React from 'react';
import { Form, Checkbox, Row, Col } from 'antd';

const FormItem = Form.Item;
class ProjExportPopup extends React.PureComponent {

    // 全选按钮
    onCheckAllChange = () => {
        this.props.dispatch({
            type: 'projInfoExport/checkAllOrNull',
        });
    }
    // 勾选/取消勾选字段
    getVal = (e, field) => {
        this.props.dispatch({
            type: 'projInfoExport/exportDataSelect',
            field,
            value: e.target.checked,
        });
    };
    render() {
        const { projExportFiled, judgeAllFiledCheck } = this.props;
        const { getFieldDecorator } = this.props.form;

        const fieldButton = (projExportFiled).map((item) => {
            return (
                <Col key={item.field_id} span={8} >
                    <FormItem >
                        {getFieldDecorator((item.field_id), {
                            initialValue: item.init_is_checked === '1',
                        })(
                            <Checkbox
                                onChange={e => this.getVal(e, item.field_id)}
                                checked={item.init_is_checked !== '0'}
                                defaultChecked={item.init_is_checked !== '0'}
                            >
                                {item.field_name}
                            </Checkbox>
                            )}
                    </FormItem>
                </Col>
            );
        });
        return (
            <Form>
                <Checkbox
                    indeterminate={judgeAllFiledCheck === '0'}
                    onChange={this.onCheckAllChange}
                    checked={judgeAllFiledCheck === '1'}
                >
                    {'全选'}
                </Checkbox>
                <Row>
                    {fieldButton}
                </Row>
            </Form>
        );
    }
}

export default Form.create()(ProjExportPopup);
