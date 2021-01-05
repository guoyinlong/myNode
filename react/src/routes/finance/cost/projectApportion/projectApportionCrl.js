/**
 * 作者：张楠华
 * 日期：2017-11-11
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：全成本修改项目分摊人均标准
 */
import { Modal, Form,Input,Row,Col,Tooltip } from 'antd';
const FormItem = Form.Item;
import Style from '../../../../components/finance/finance.less'
/**
 * 作者：张楠华
 * 创建日期：2017-11-11
 * 功能：创建模态框
 */
const ModuleCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator} = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const { stateCrl }=props;
    let stateCrlData = [];
    if(stateCrl.hasOwnProperty('editList')){
      for( let i=0;i<stateCrl.editList.length;i++){
        stateCrlData.push(
          <FormItem label={stateCrl.editList[i].feeName} {...formItemLayout} key={stateCrl.editList[i].key}>
            {getFieldDecorator(`${stateCrl.editList[i].feeName}`,{initialValue:stateCrl.editList[i].feeCount})(<Input style={{width:'100px'}}/>)}
          </FormItem>
        );
      }
    }
    let stateCrlData1=[];
    let len=stateCrlData.length;
    for(let i=0;i<len;i=i+2){
      stateCrlData1.push(
        <Row key={i}>
          <Col span={12}>{stateCrlData[i]}</Col>
          <Col span={12}>{stateCrlData[i+1]}</Col>
        </Row>
      )
    }
    return (
      <Modal
        visible={visible}
        title='项目分摊编辑'
        onCancel={onCancel}
        onOk={onCreate}
        width='620px'
      >
        <div>
          <Form>
            <Row>
              <Col span={12}>
                <FormItem label="组织单元" {...formItemLayout}><span>{stateCrl.ou}</span></FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="部门名称" {...formItemLayout}><span>{stateCrl.hasOwnProperty('deptName')?stateCrl.deptName.split('-')[1]:null}</span></FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="项目编码" {...formItemLayout}><span>{stateCrl.projCode}</span></FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="项目名称" {...formItemLayout}>
                  <Tooltip title={stateCrl.projName} style={{width:'30%'}}>
                    <div className={Style.projectAbbreviation}>{stateCrl.projName}</div>
                  </Tooltip>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        {stateCrlData1}
      </Modal>
    );
  }
);
/**
 * 作者：张楠华
 * 创建日期：2017-09-10
 * 功能：项目分摊成本人均标准编辑
 */
class ProjectApportionCrl extends React.Component {
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
    const { ou,headerName } = this.props;
    let editList = [];
    for(let i=0;i<headerName.length;i++){
      if(record[headerName[i]] !== '0.0'){
        let fee = {};
        fee.feeName = headerName[i];
        fee.feeCount = record[headerName[i]];
        fee.key = i;
        editList.push(fee);
      }
    }
    this.setState(
      {
        visible: true,
        ou:ou,
        deptName:record.dept_name,
        projName:record.proj_name,
        projCode:record.proj_code,
        editList:editList,
        record:record
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
      const { apportionCrl } = this.props;
      apportionCrl(values,this.state.record,this.state.ou);
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
          stateCrl = {this.state}
        />
      </div>
    );
  }
}

export default ProjectApportionCrl;
