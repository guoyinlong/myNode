import React from "react";
import {connect} from "dva";
import {Button, Row, Col, Input, Table, Menu, Dropdown, message, Select, Modal} from "antd";
import Style from './searchDetail.less';
import moment from 'moment';
import exportExl from '../../../components/commonApp/exportExl';
import PageSubmit from "./PageSubmit";
import styles from './projectTable.less';
import TitleM from "../../projectKpi/PM/title";
import Style1 from '../../../components/employer/employer.less'

const Option = Select.Option;


class resultRate extends React.Component {
  constructor(props) {
    super(props);


  }

  handleChange = (value, rank) => {
    this.props.dispatch({
      type: 'resultRate/updateRating',
      rank: rank - 1,
      rating: value


    });
  }
  onOUNameChange = (value) => {
    this.props.dispatch({
      type: "resultRate/updateOUName",
      department: value
    });
  }
  handleSubmitChange = () => {
    this.props.dispatch({
      type: 'resultRate/submit',


    });
    this.props.dispatch({
      type: 'resultRate/init',


    });
    message.success("保存成功")
  }
  showModal = () => {
    this.props.dispatch({
      type: 'resultRate/showModal',


    });
  }
  handleOk = () => {
    if (this.props.season ==4){
      if ((this.props.sum*0.2.toFixed(0) + this.props.remainderA) !== this.props.aNum){
        message.error("评级分配不符合要求")
        return
      }
      if ((this.props.sum*0.3.toFixed(0) + this.props.remainderB) !== this.props.bNum){
        message.error("评级分配不符合要求")
        return
      }
    }
    this.props.dispatch({
      type: 'resultRate/submit',
    });

    this.props.dispatch({
      type: 'resultRate/init',
    });


    message.success("保存成功")

  }
  handleCancel = () => {

    this.props.dispatch({
      type: 'resultRate/showModal',


    });
  }


  render() {

    const {year, projectData, season, suspending_season, userName, department, deptList} = this.props;
    var columns = [
      {
        title: '名次',
        dataIndex: 'rank',
        key: 'rank',
      }, {
        title: '团队名称',
        dataIndex: 'teamName',
        key: 'teamName',
      }, {
        title: '生产编号',
        dataIndex: 'projCode',
        key: 'projCode',
      }, {
        title: '项目经理',
        dataIndex: 'pm',
        key: 'pm',
      }, {
        title: '通用指标得分',
        dataIndex: 'tyScore',
        key: 'tyScore',
      }, {
        title: '专业指标得分',
        dataIndex: 'zyScore',
        key: 'zyScore',
      }, {
        title: '党建得分',
        dataIndex: 'djScore',
        key: 'djScore',
      },
      {
        title: '激励得分',
        dataIndex: 'jlScore',
        key: 'jlScore',
      },
      {
        title: '总分',
        dataIndex: 'totalScore',
        key: 'totalScore',
      },
      {
        title: '评级',
        dataIndex: 'rating',
        render: (text, record) => {
          return (
            <div>

              <Select defaultValue={text} style={{width: 60}}
                      onChange={(value) => this.handleChange(value, record.rank)}>
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="C">C</Option>
              </Select>

            </div>
          );
        },
      },
    ]
    const deptOption = deptList.map((item, index) => {

      return (
        <Option key={index} value={item}>{item}</Option>
      )
    })
    var dataSource = projectData.map((item, index, ary) => {
      item.key = index;
      return item;
    });
    return (
      <div style={{textAlign: "center"}} className={styles.container}>

        <h1>项目结果评级</h1>
        <p className={Style.dataShow}>
          <span>考核年度 : <i>{year} </i></span>
          <span>季度: <i>{season}</i></span>
          <span>部门 : <Select style={{width: "310px"}} value={department}  onChange={this.onOUNameChange}>
            {deptOption}
          </Select> </span>
          <span>部门经理 : <i>{userName}</i></span>
          {this.props.season == -1 ? <span><i>考核未开启...</i> </span> :
            this.props.ratingFinish == true ? <span><i>季度评级未开始或已完成</i> </span> :
              this.props.scoringFinish == false ? <span><i>项目打分未结束</i> </span> :
                <div></div>
          }


        </p>

        <Row gutter={16}>
          <div style={{marginTop: "15px"}}>
            <Table className={styles.orderTable} dataSource={dataSource} columns={columns}/>

          </div>
        </Row>

        <div className={Style1.div_submit}>
          <Button type="primary" onClick={this.showModal} disabled={(!this.props.showSubmit)}>提交</Button>
          <Modal title="Title"
                 visible={this.props.visible}
                 onOk={this.handleOk}
                 onCancel={this.handleCancel}
          >
            {this.props.season == 4 ?
              <div>
                {"当前为第四季度，项目评级需符合要求"}
                <br/>
                {"评A项目数应为： " + Math.round(parseFloat(this.props.sum * 0.2) + parseFloat(this.props.remainderA)) + "    评A项目数实为:  " + (this.props.aNum) }
                <br/>
                {"评B项目数应为： " + Math.round(parseFloat(this.props.sum * 0.3) + parseFloat(this.props.remainderB)) + "    评B项目数实为:  " + (this.props.bNum) }
                <br/>
                {"评C项目数应为： " + Math.round(parseFloat(this.props.sum) - (parseFloat(this.props.sum * 0.2) + parseFloat(this.props.remainderA)) - (parseFloat(this.props.sum * 0.3) + parseFloat(this.props.remainderB))) + "    评C项目数实为:  " + (this.props.cNum) }
                <br/>
                {"   确定提交考核指标吗？"}
              </div>:
              <div>
                {"评A项目数应为： " + (this.props.sum * 0.2).toFixed(1) + "    评A项目数实为:  " + (this.props.aNum) + "    评A余数为：  " + this.props.remainderA}
                <br/>
                {"评B项目数应为： " + (this.props.sum * 0.3).toFixed(1) + "    评B项目数实为:  " + (this.props.bNum) + "    评B余数为：  " + this.props.remainderB}
                <br/>
                {"评C项目数应为： " + (this.props.sum * 0.5).toFixed(1) + "    评C项目数实为:  " + (this.props.cNum) + "    评C余数为：   " + this.props.remainderC}
                <br/>
                {"   确定提交考核指标吗？"}
              </div>
            }
          </Modal>
        </div>

      </div>
    )
  }
}

//数据映射
const mapStateToProps = (state) => {
  return {
    ...state.resultRate,
  };
};


//
export default connect(mapStateToProps)(resultRate);
