/**
 * 作者：张楠华
 * 日期：2017-09-10
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：个人考核新增考核阶段界面
 */
import { Modal, Form } from 'antd';
const FormItem = Form.Item;
import { DatePicker } from 'antd';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
/**
 * 作者：张楠华
 * 创建日期：2017-09-10
 * 功能：创建模态框
 */
const ModuleCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form ,tip} = props;
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
    const {begin_time1,end_time1,stage_name}=props;
    return (
      <Modal
        visible={visible}
        title={stage_name}
        onCancel={onCancel}
        onOk={onCreate}
      >
          <Form>
            <FormItem label="开始时间" {...formItemLayout}>
              {getFieldDecorator('beginTime', {
                initialValue:moment(begin_time1),
              })(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"  style={{width:'200px'}}/>
              )}
            </FormItem>
            <FormItem label="截止时间" {...formItemLayout}>
              {getFieldDecorator('endTime',{
                initialValue: moment(end_time1)})
              (<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{width:'200px'}}/>
              )}
            </FormItem>
          </Form>
        <div style={{color:"#FA7252",marginLeft:"93px"}}>{tip}</div>
      </Modal>
    );
  }
);
/**
 * 作者：张楠华
 * 创建日期：2017-09-10
 * 功能：展示指标添加界面
 */
class ModelOpenCrl extends React.Component {
  //初始化
  state = {
    visible: false,
    tips:'',
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-10
   * 功能：点击修改按钮，执行showModal方法
   */
  showModal = (record) => {
    this.setState(
      {
        visible: true,
        stageName:record.stageName,
        beginTime:record.startTime,
        endTime:record.endTime,
        season:record.season,
        years:record.years,
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
    this.state.tips='';
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-10
   * 功能：点击模态框确定按钮执行
   */
  handleCreate = () => {
    const form = this.form;
    let flagTip=0;
    this.setState({tips:"",});
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const {timeUpdate} = this.props;
      const beginTime=values.beginTime.format(dateFormat);
      const endTime=values.endTime.format(dateFormat);
      if(beginTime>endTime){
        this.setState({
          tips:"提示信息：开始时间不能大于结束时间！",
        });
        flagTip=1;
      }
      //flagTip为0，执行timeUpdate方法，去后台掉服务。
      if(flagTip == 0){
        timeUpdate(values,this.state.stageName,this.state.years,this.state.season);
        form.resetFields();
        this.setState({ visible: false });
      }else{
        this.setState({ visible: true });
      }
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
          begin_time1={this.state.beginTime}
          end_time1={this.state.endTime}
          stage_name={this.state.stageName}
          tip={this.state.tips}
        />
      </div>
    );
  }
}

export default ModelOpenCrl;
