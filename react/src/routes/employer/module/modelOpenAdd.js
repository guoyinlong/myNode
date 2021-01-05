/**
 * 作者：张楠华
 * 日期：2017-09-5
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：开放时间点击编辑弹出框展示
 */
import { Modal, Form, Select,DatePicker } from 'antd';
const FormItem = Form.Item;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Option = Select.Option;
/**
 * 作者：张楠华
 * 创建日期：2017-09-5
 * 功能：创建模态框
 */
const ModuleCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form} = props;
    const { getFieldDecorator} = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        visible={visible}
        title="新增考核阶段"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form>
          <FormItem label="考核阶段" {...formItemLayout}>
            {getFieldDecorator('examPhase')(
              <Select showSearch style={{width: 200}} placeholder="请选择考核阶段">
                <Option value="100">指标添加</Option>
                <Option value="200">指标审核</Option>
                <Option value="300">指标评价</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="年度" {...formItemLayout}>
            {getFieldDecorator('yearType')(
              <Select showSearch style={{width: 200}} placeholder="请选择年度">
                <Option value="2020">2020</Option>
                <Option value="2019">2019</Option>
                <Option value="2018">2018</Option>
                <Option value="2017">2017</Option>
                <Option value="2016">2016</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="季度" {...formItemLayout}>
            {getFieldDecorator('seasonType')(
              <Select showSearch style={{width: 200}} placeholder="请选择季度">
                <Option value="1">第一季度</Option>
                <Option value="2">第二季度</Option>
                <Option value="3">第三季度</Option>
                <Option value="4">第四季度</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="开始时间" {...formItemLayout}>
            {getFieldDecorator('beginTime', {})(
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"  style={{width:'200px'}}/>
            )}
          </FormItem>
          <FormItem label="截止时间" {...formItemLayout}>
            {getFieldDecorator('endTime',{})
            (<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{width:'200px'}}/>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);
/**
 * 作者：张楠华
 * 创建日期：2017-09-5
 * 功能：开放时间点击编辑弹出框展示
 */
class ModelOpenAdd extends React.Component {
  /**
   * 作者：张楠华
   * 创建日期：2017-09-5
   * 功能：初始化
   */
  state = {
    visible: false,
    yearType:new Date().getFullYear().toString(),
    seasonType:Math.floor((new Date().getMonth() + 1 + 2) / 3).toString(),
    examType:'',
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-5
   * 功能：点击修改按钮，执行showModal方法
   */
  showModal = () => {
    this.setState({
        visible: true,
      });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-5
   * 功能：点击模态框中的取消按钮执行
   */
  handleCancel = () => {
    this.setState({
      visible: false,
    });
    const form=this.form;
    form.resetFields();
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-5
   * 功能：点击模态框确定按钮执行
   */
  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const {examPhaseAdd} = this.props;
      examPhaseAdd(values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-5
   * 功能：from指向对应
   */
  saveFormRef = (form) => {
    this.form = form;
  };

  render() {
    return (
      <div>
        <ModuleCreateForm
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          yearType={this.state.yearType}
          seasonTpye={this.state.seasonType}
          examType={this.state.examType}
        />
      </div>
    );
  }
}

export default ModelOpenAdd;
