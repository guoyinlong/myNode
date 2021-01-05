/**
 * 作者：罗玉棋
 * 邮箱：809590923@qq.com
 * 创建日期：2019-09-25
 * 文件说明：全面激励-新增个人信息
 */
import { Modal, Form, Input, Button, DatePicker } from "antd";
import Selector from './selector';
import boxMap from './addingBox.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
let id = 0;
class AddInfo extends React.Component {
  constructor(props){
    super(props)
    this.state={
      ...props,
      dateopt:""
    }
  }
  guid=()=>{
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }
  
  handleOk = () => {
    const {fieldList,category_name,category_id}=this.state
    this.props.form.validateFields((err, values)=>{

     if(!err){
      
      let addInfoList=[],subArr=values,datauid,year;
      datauid=this.guid().split("-").join("");
      
      for(var key in subArr){
       if(""+key=="year"){
        year=subArr[""+key]
        break
       }
      }

       for(var index in subArr){
           
          fieldList.forEach(item=>{
            if( item.column_name==index){

             let newData= item.column_comment.indexOf("时间")>=0?
             moment(subArr[index]).format('YYYY-MM-DD')
             :
             item.column_comment.indexOf("日期")>0?
             moment(subArr[index]).format('YYYY-MM-DD')
             :
             subArr[index]
            let param = 
            {
              opt:"insert",
              year:year,
              category_uid:category_id,
              category_name:category_name,
              data_uid:datauid,
              field_uid:item.uid,
              field_name:item.column_comment,
              new_data:newData,
            }
            addInfoList.push(param)  
            }
          })
      }
      addInfoList=JSON.stringify(addInfoList);

       this.props.onSubmit(addInfoList)
     }
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { category_name } = this.props;
    const copyrecord =boxMap[category_name]
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 },
        xs: { span: 8 }
      },
      wrapperCol: {
        sm: { span: 8 },
        xs: { span: 8 }
      }
    };

    return (
      <Modal
        visible
        destroyOnClose
        width="50%"
        center
        onOk={this.handleOk}
        onCancel={this.props.onCancel}
        maskClosable={false}
        footer={
          <div>
            <Button type="primary" onClick={this.props.onCancel}>
              取消
            </Button>
            <Button type="primary" onClick={this.handleOk}>
              确定
            </Button>
          </div>
        }
        title={
          <div>
            <b>增加</b>
          </div>
        }
      >
        <Form>
          {copyrecord.map((item, index) => {
            return (
              <Form.Item label={item.title?item.title:item.name} {...formItemLayout} key={index}>
                {item.type == "S"?
                   getFieldDecorator(`${item.fieldKey}`, {initialValue: item.val , rules: [{ required: true, message: '信息不能为空!' }]})
                   (
                      <Selector fieldName={item.name} disabled={!item.edit}/>
                    )
                  :
                  item.type == "D"?
                  getFieldDecorator(`${item.fieldKey}`, {initialValue: item.val , rules: [{ required: true, message: '信息不能为空!' }]})
                  (
                      <DatePicker  key={index}  disabled={!item.edit} size={"large"} />
                  )
               
                  :
                  getFieldDecorator(`${item.fieldKey}`, {initialValue: item.val , rules: [{ required: true, message: '信息不能为空!' }]})
                  (
                      <Input key={index}  disabled={!item.edit}/>
                  )
                  }
              
              </Form.Item>
            );
          })}
        </Form>
      </Modal>
    );
  }
}

AddInfo = Form.create()(AddInfo);
export default AddInfo;
