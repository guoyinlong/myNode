/**
 * 作者：罗玉棋
 * 邮箱：809590923@qq.com
 * 创建日期：2019-08-23
 * 文件说明：全面激励-权限配置
 */
import { Form, Row, Col, Table, Button, Select,Modal,message } from "antd";
import { connect } from "dva";
import Style from "./authchange.less";
import AuthForm from "./authform";
import Cookie from 'js-cookie';
const { Option } = Select;
const user_id = Cookie.get('userid');
const { confirm } = Modal;

class AuthorityChange extends React.Component {
 
  state = {
    selectName: "", //类名
    selected: "", //选中的类名
    select1: "", //类别信息id
    select2: "", //字段名
    flage: false, //详细按钮-是否禁用（类别，字段）
    baninfo: false, //详细按钮-是否禁用（修改,审核,审核人的下拉框,增加审核人）
   // addnew: false, //增加按钮-字段下拉框显示（空/单个字段）
    iconShow: "show", //审核人减号的图标显示与不显示
    addshow: "show", //增加按钮-审核人回显是否显示
    detailshow: "show", //详细信息中 增加审核人的显示和不显示
    modelTitle:""
  };

  //变更权限（增加）
  handleAdd = (record,tip) => {
    if(tip==1){
      this.setState({
        addshow: "none",
        modelTitle:"权限变更",
        flage: true,
      });
    }else{
      this.setState({
        addshow: "none",
        modelTitle:"权限变更",
        flage: false,
      });
    }

    this.props.dispatch({
      type: "authchange/fieldAdd",
        formVisble: true,
        addAction:true
    });
    this.props.dispatch({
      type:'authchange/updateShallowState',
      payload:{
        //copyrecord:{}
        copyrecord:record
      }
    })
  };
  //详细 
  handledetail = record => {
    this.setState({
      flage: true,
      baninfo: true,
      iconShow: "none",
      detailshow: "none",
      modelTitle:"详细"
    });
    this.props.dispatch({
      type: "authchange/updateState",
      payload: {
        copyrecord:record,
        formVisble: true
      }
    });
  };
  //修改
  handleEdit = record => {
    if(record.audit==0&&record.revisability==0&&record.checkers==undefined){
      this.handleAdd(record,1)
    }else{
      this.setState({
        flage: true,
        iconShow: "show",
        modelTitle:"修改"
      });
      const objStr=JSON.stringify(record);
      this.props.dispatch({
        type: "authchange/updateState",
        payload: {
          copyrecord:JSON.parse(objStr),
          formVisble: true,
          addAction:false
        }
      });
    }
 
  };
  //删除
  handleDelete = record => {
    let { selectName } =this.state;
    let className=this.props.typeInfoList.DataRows[0].category_name;
    selectName==""?className:selectName,
    this.props.dispatch({
      type: "authchange/deleteInfo",
      record,
      user_id,
      selectName
      });
    };
  //重置
  deleteTip=record=>{
      confirm({
        title: '是否重置?',
        content: '',
        onOk:()=>{//这里是属性值
       this.handleDelete(record);
        },
        onCancel() {
        return
        },
        });  
    }
 
  
 //移除联系人
  handleRemove =(opt,key) => {
    this.props.dispatch({
      type: "authchange/remove",
      opt,
      key
    });
  };
  //提交（确定）
  handleOk = (values) => {
    this.setState({
      flage: false,
      baninfo: false,
      addshow: "show",
      detailshow: "show"
    });
    this.props.dispatch({
      type: "authchange/tbEdit",
      values,
      user_id,
      //addopt:false//关闭的开关
    });
  };
  //取消
  handleCancel = () => {
    this.setState({
      flage: false,
      baninfo: false,
      addshow: "show",
      detailshow: "show"
    });
    this.props.dispatch({
      type: "authchange/updateShallowState",
      payload: {
        copyrecord: { },
        formVisble: false,
        //addAction:false
      }
    });
  };
  //查询
  handleSearch =()=> {
    const {  selectName, select2 } = this.state;
    this.props.dispatch({
    type: "authchange/filter",
    selectName ,
    select2
    });
   
    
  };
  //类别下拉框改变
  handleChange = (value, option) => {
    this.setState({
      selectName: option.props.children, //这里是类名
      select1: value, //这里是类id
      select2: undefined,
      selected: option.props.selected
    });


    this.props.dispatch({
      type: "authchange/typeinfo",
      select1: value,
      selectName: option.props.children
    });
  };
  //信息下拉框改变
  handleChange2 = value => {
    this.setState({
      select2: value
    });
  };
   clearField=()=>{
     this.setState({
      select2:undefined
     })
    this.props.dispatch({
      type: "authchange/fieldAdd", 
    });
   }

  render() {

    const {
      copyrecord,
      formVisble,
      typeInfoList,
      metadataList,
      formList,
      fieldList,
    } = this.props;

    if(formList){
      formList.forEach((i,index)=>{
        i.key = index;
      })
    }
    let defaultInfo =typeInfoList.DataRows.length > 0? typeInfoList.DataRows[0].category_name: undefined;
    const typeInfo = typeInfoList.DataRows.map(item => {
      return (
        <Option key={item.uid+item.category_name} value={item.uid} selected={item.category_name}>
          {item.category_name}
        </Option>
      );
    });
    const meteData = metadataList.map(item => {
      return (
        <Option value={item.column_comment} key={item.column_comment} selected={item.uid}>
          {item.column_comment}
        </Option>
      );
    });
 
    const maxlength=metadataList.length;
    const fieldOption=fieldList.length>0? fieldList.map((item,index) => {
        return (
          <Option value={item} key={index}>
            {item}
          </Option>
        );
      }):""

    const columns = [
      {
        title: "字段名称",
        dataIndex: "column_comment",
        className:`${Style.field_col}`,
        width:"25%",
        onHeaderCell:()=>{
          return{
           className:`${Style.field_title}`
          }
        }
      },
      {
        title: "是否可修改",
        dataIndex: "revisability",
        algin:'center',
        width:"15%",
        render: value => {
          if (value == 1) {
            return "是";
          } else {
            return "否";
          }
        }
      },
      {
        title: "修改需审核",
        dataIndex: "audit",
        algin:'center',
        width:"15%",
        render: value => {
          if (value == 1) {
            return "是";
          } else {
            return "否";
          }
        }
      },
      {
        title: "审核人",
        dataIndex: "checkers",
        algin:'center',
        width:"15%",
        render: (value, record,index) => {
          if (value != undefined && value.length > 0) {
            value = value.map(item => {
              var arr = item.split("(");
              item = arr[0];
              return item;
            });
            return value.join(", ");
          } else if (value == undefined) {
            return "无";
          }
        }
      },

      {
        title: "操作",
        algin:'center',
        width:"30%",
        render: (record) => {
          return (
            <div className={Style.action_col}>
              <span > 
                <a onClick={() => this.handledetail(record)}>&nbsp;&nbsp;详细&nbsp;&nbsp;</a>
              </span>
              <span>
                <a onClick={() => this.handleEdit(record)}>&nbsp;&nbsp;修改&nbsp;&nbsp;</a>
              </span>

              {record.audit==0&&record.revisability==0&&record.checkers==undefined?
              <span>
                <a style={{color:"#CFCFCF"}}>&nbsp;&nbsp;重置&nbsp;&nbsp; </a>
              </span>
              :
              <span>
                <a onClick={() => this.deleteTip(record)}>&nbsp;&nbsp;重置&nbsp;&nbsp; </a>
              </span>
              }

            </div>
          );
        }
      }
    ];

    return (
      <div className={Style.bottom}>
        <div className={Style.tip1}>全面激励信息变更审核权限配置</div>
        <br />
        <br />
        <Row>
          <Col span={6} style={{ minWidth: 250 }}>
            <label>类别 : </label>
            <Select
              key={defaultInfo}
              defaultValue={defaultInfo}
              style={{ width: 200 }}
              onSelect={this.handleChange}
            >
              {typeInfo}
            </Select>
          </Col>
          <Col span={6} style={{ minWidth: 250 }}>
            <label>信息 : </label>
            <Select
              style={{ width: 200 }}
              onChange={this.handleChange2}
              value={this.state.select2}
            >
              {meteData}
            </Select>
          </Col>

          <Button onClick={this.handleSearch} className={Style.btn_select}>
            查 询
          </Button>
          <Button className={Style.btn_select} onClick={() => this.clearField()}>
            清 空
          </Button>
          <Button className={Style.btn_select} onClick={() => this.handleAdd()} disabled={metadataList.length==0?true:false}>
            权限变更
          </Button>

        </Row>
        <br />
        <br />

        <Table
          columns={columns}
          dataSource={formList || []}
          bordered={true}
          pagination={true}
        />
        {formVisble && (
          <AuthForm
            dispatch={this.props.dispatch.bind(this)}
            typeInfo={typeInfo}
            typeName={this.state.selected || defaultInfo}
            flage={this.state.flage}
            baninfo={this.state.baninfo}
            copyrecord={copyrecord}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            onRemove={this.handleRemove}
            onAdd={this.handleSearch}
            iconShow={this.state.iconShow}
            addshow={this.state.addshow}
            fieldList={fieldOption}
            detailshow={this.state.detailshow}
            maxlength={maxlength}
            modelTitle={this.state.modelTitle}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    data,
    copyrecord,
    formVisble,
    formList,
    typeInfoList,
    metadataList,
    fieldList,
  } = state.authchange;
  return {
    data,
    copyrecord: { ...copyrecord }, //model更新后界面的传值也更新
    formVisble,
    formList,
    typeInfoList,
    metadataList:[...metadataList],
    fieldList,
  };
}

AuthorityChange = Form.create({})(AuthorityChange);
export default connect(mapStateToProps)(AuthorityChange);
