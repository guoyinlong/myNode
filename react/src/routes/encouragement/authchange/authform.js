/**
 * 作者：罗玉棋
 * 邮箱：809590923@qq.com
 * 创建日期：2019-08-25
 * 文件说明：全面激励-权限变更模态框
 */
import { Modal, Form, Icon, Radio, Button, Select, message } from "antd";
import Style from "./authchange.less";
import SelectPerson from "./checker.js";
let id = 0,keys;
class AuthForm extends React.Component {
  state = {
    needAdulit: this.props.copyrecord.audit == "1",
    cherkerKeys: [],
    editable:this.props.copyrecord.revisability =="1",
    keyshow:"",
    okloading:false
  };
  
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    if (keys.length === 0) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(item => item !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  handleRemove =(opt,index) => {
    this.props.onRemove(opt,index);
  };

  handleOk = () => {
  this.props.form.validateFields((err, values) => {

  if (!err) {
    //console.log("原values：", values);  
    const {editable}=this.state;
    let keyarr=[];
    let keylength=values.keys.length;
    if(!editable){
      // 可修改
      values.audit="0",
      values.checkerIds=undefined;
    }
      // 不可修改

    // 新增字段校验
    if (values.column_comment == "") {
      message.error("字段不能为空！");
      return;
    }

    // 审核人的处理和校验
    if (values.checkerIds != undefined) {
      let arr = [];
     
      for (const index in values.checkerIds) {
        if (values.checkerIds[index] == undefined) {
          message.error("审核人不能为空！");
          return;
        }
        arr.push(values.checkerIds[index]);
      }

      if(keylength>0){
        let keyindex=keylength-1;
        if(keyindex==0)
        keyarr.push(arr[0])
        else{
        for(var k=0;k<=keyindex;k++){
        keyarr.push(arr[""+k])
         }
        } 
       }

       if(keylength>0){
        for(var j=0;j<keylength;j++){
          arr.shift()
         }
       }

    values.checkerIds = arr.concat(keyarr)
    }

    // 修改按钮的校验
    if (values.revisability == undefined) {
      message.error("是否修改不能为空！");
      return;
    }
    // 审核按钮的校验
    if (values.audit == undefined) {
      message.error("是否审核不能为空！");
      return;
    }
    if (values.audit == 1 && values.checkerIds == undefined) {
      message.error("如需审核请添加审核人，无需审核请勾选否");
      return;
    }
    //console.log("Received values of form: ", values);  
    this.setState({
      okloading:true
    })
    this.props.onOk(values);
    
  }
});
};


  Select = e => {
    if (e.target.value == "1") {
      this.setState({
        needAdulit: true
      });
    } else if (e.target.value == "0") {
      this.setState({
        needAdulit: false
      });
    }
  };
  
  handleEditableChange=(e)=>{//点击修改时候的监听
    // console.log(e.target.value)
    if(e.target.value==="1"){
      // 可修改
      // debugger
      this.setState({
        editable:true,
        needAdulit:false,
      })
       this.props.dispatch({
        type:"authchange/updateState",
        payload:{
          copyrecord:{
            audit:"0"
          }
        }
      })
   
    }else{
      // 不可修改
      this.setState({
        editable:false,//隐藏
        needAdulit:false,
        keyshow:false
      })
      this.props.form.setFieldsValue({
        keys: []
      });
      id=0;
      this.props.dispatch({
        type:"authchange/updateState",
        payload:{
          copyrecord:{
            ...this.props.copyrecord,
             checkers:[],
             checkerIds:[],
             revisability:"0"
          }
        }
      })

      
    }
  }
  
  fieldOpt=()=>{
    this.setState({
      editable:false,
      needAdulit:false,
      keyshow:false
    })

  this.props.dispatch({
    type:"authchange/updateState",
    payload:{
      copyrecord:{
        ...this.props.copyrecord,
         keys:[],
         checkers:[],
         checkerIds:[],
         revisability:"0",
      }
    }
  })
  this.props.form.setFieldsValue({
    revisability:"0",
    keys: []
  })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const {
      copyrecord,
      flage,
      typeName,
      baninfo,
      iconShow,
      addshow,
      fieldList,
      detailshow,
      maxlength,
      modelTitle,
      keyshow
    } = this.props;
    const {editable,okloading} =this.state;
  

   // const elements = addnew ? "" : copyrecord.column_comment;
    const { Option } = Select;
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 },
        xs:{span:8}
      },
      wrapperCol: {
        sm: { span: 8 },
        xs:{span:8}
      }
    };
    const formItemLayoutAdd = {
      labelCol: {
        sm: { span: 8 },
        xs:{span:8}
      },
      wrapperCol: {
        sm: { span: 8 },
        xs:{span:8}
      }
    };

    getFieldDecorator("keys", { initialValue: [] });
     keys = getFieldValue("keys");
    const formItems = keys.map((k) => (
      <Form.Item
        {...formItemLayoutAdd}
        label="审核人"
        required
        key={k}
        style={{
          position: "relative"
        }}
      >
        {getFieldDecorator(`checkerIds[${k}]`)(
          <SelectPerson
            key={k}
          />
        )}
        {keys.length > 0 ? (
          <Icon
            className={Style["dynamic-delete-button"]}
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));

    return (
      <Modal
        visible
        destroyOnClose
        width="60%"
        center
        onCancel={() => this.props.onCancel()}
        footer={
          <div>
            <Button
              type="primary"
              className={Style.btn_cancel}
              onClick={() => this.props.onCancel()}
            >
              取消
            </Button>
            <Button
              type="primary"
              className={Style.btn_ok}
              onClick={this.handleOk}
              disabled={baninfo}
              loading={okloading}
            >
              确定
            </Button>
          </div>
        }
        title={
          <div>
            <b>{modelTitle}</b>
          </div>
        }
      >
        <Form className={Style.form_range}>
          <Form.Item label="类别" {...formItemLayout} required>
            {getFieldDecorator("typeName", { initialValue: typeName })(
              <Select
                disabled={true}
                className={Style.cell_width}
              >  
              </Select>
            )}
          </Form.Item>
          <Form.Item label="字段" {...formItemLayout} required>
            {getFieldDecorator("column_comment", {
              initialValue: copyrecord.column_comment
            })( <Select
                      disabled={flage}
                      className={Style.cell_width}
                      onSelect={this.fieldOpt}

                      >
                  
                      <Option value="all" key="af" disabled={fieldList.length==maxlength?false:true}>
                        全部
                      </Option>
                    
                      {fieldList}
                    </Select>                          
            )}
          </Form.Item>
          <Form.Item label="是否可修改" {...formItemLayout} required>
            {getFieldDecorator("revisability", {
              initialValue: copyrecord.revisability
            })(
              <Radio.Group disabled={baninfo} onChange={this.handleEditableChange} >
                <Radio value="1">是</Radio>
                <Radio value="0"
                disabled={
                  copyrecord.checkerIds==undefined?false:
                  (copyrecord.checkerIds.length>0)?true:false
                }
                >否</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          {
            editable&&<Form.Item label="是否需审核" {...formItemLayout} required>
              {getFieldDecorator("audit", { initialValue: copyrecord.audit })(
                <Radio.Group disabled={baninfo} onChange={this.Select} >
                  <Radio value="1">是</Radio>
                  <Radio value="0"
                    disabled={
                      (copyrecord.checkerIds == undefined? false
                        : copyrecord.checkerIds.length > 0) || keys.length > 0
                    }
                  >
                    否
                  </Radio>
                </Radio.Group>
              )}
            </Form.Item>
          }
          {Array.isArray(copyrecord.checkerIds)
            ? copyrecord.checkerIds.map((item, index) => (
                <Form.Item
                  label="审核人"
                  {...formItemLayout}
                  key={index}
                  style={{ display: `${addshow}` }}
                  required
                >
                  {getFieldDecorator(`checkerIds[lyq${index}]`, {
                    initialValue: item
                  })
                  (<SelectPerson disabled={baninfo} key={index} />)}
                  <Icon
                    style={{ display: `${iconShow}` }}
                    className={Style["dynamic-delete-button"]}
                    type="minus-circle-o"
                    onClick={() => this.handleRemove(item,index)}
                  />
                </Form.Item>
              ))
            : ""}
          {keyshow==false?"": formItems}
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Button
              type="dashed"
              onClick={this.add}
              style={{ width: "20%", display: `${detailshow}` }}
              disabled={!this.state.needAdulit}
            >
              <Icon type="plus" /> 增加审核人
            </Button>
          </div>
        </Form>
      </Modal>
    );
  }
}

AuthForm = Form.create()(AuthForm);
export default AuthForm;

