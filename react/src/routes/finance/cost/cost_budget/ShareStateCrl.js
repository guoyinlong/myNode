/**
 * 作者：张楠华
 * 日期：2017-11-6
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：全成本修改项目分摊人均标准
 */
import { Modal, Form,Input } from 'antd';
const FormItem = Form.Item;
/**
 * 作者：张楠华
 * 创建日期：2017-09-10
 * 功能：创建模态框
 */
const ModuleCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
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
    const { OU,shareYear,feeName,yearPs,upYearPs }=props;
    return (
      <Modal
        visible={visible}
        title='项目分摊成本人均标准编辑'
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form>
          <FormItem label="OU" {...formItemLayout}>
            {getFieldDecorator('OU', {initialValue:OU,})(<Input disabled style={{width:'250px'}}/>)}
          </FormItem>
          <FormItem label="年份" {...formItemLayout}>
            {getFieldDecorator('shareYear',{initialValue: shareYear})(<Input disabled style={{width:'250px'}}/>)}
          </FormItem>
          <FormItem label="类别" {...formItemLayout}>
            {getFieldDecorator('feeName',{initialValue: feeName})(<Input disabled style={{width:'250px'}}/>)}
          </FormItem>
          <FormItem label="上一年人均标准" {...formItemLayout}>
            {getFieldDecorator('UpYearPs',{initialValue: upYearPs})(<Input disabled style={{width:'250px'}}/>)}
          </FormItem>
          <FormItem label="今年人均标准" {...formItemLayout}>
            {getFieldDecorator('yearPs',{initialValue: yearPs})(<Input style={{width:'250px'}}/>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);
/**
 * 作者：张楠华
 * 创建日期：2017-09-10
 * 功能：项目分摊成本人均标准编辑
 */
class ShareStateCrl extends React.Component {
  //初始化
  state = {
    visible: false,
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-10
   * 功能：点击修改按钮，执行showModal方法
   */
  showModal = (record) => {
    const { ou,shareStateYear } = this.props;
    this.setState(
      {
        visible: true,
        OU:ou,
        shareYear:shareStateYear,
        feeName:record.fee_name,
        upYearPs:record.up_year_ps,
        yearPs:record.year_ps,
        record:record,
      });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-10
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
   * 创建日期：2017-09-10
   * 功能：点击模态框确定按钮执行
   */
  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { yearPsCrl } = this.props;
      yearPsCrl(values,this.state.record);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

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
          OU={this.state.OU}
          shareYear={this.state.shareYear}
          feeName={this.state.feeName}
          upYearPs={this.state.upYearPs}
          yearPs={this.state.yearPs}

        />
      </div>
    );
  }
}

export default ShareStateCrl;
