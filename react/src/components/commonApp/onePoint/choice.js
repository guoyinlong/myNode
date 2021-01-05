/*
 * 作者：刘东旭
 * 邮箱：liudx100@chinaunicom.cn
 * 日期：2017-11-01
 * 说明：一点看全-级联选择查询
 */
import { Select, Button } from 'antd';
const Option = Select.Option;

const instituteData = ['总院', '济南分院',  '哈尔滨分院'];

const departmentData = {
  总院: ['架构部', '项目部', '财务部'],
  济南分院: ['济部1', '济部2', '济部3'],
  哈尔滨分院: ['哈部1', '哈部2']
};

const projectData = {
  架构部: ['总部1项目1', '总部1项目2'],
  项目部: ['总部2项目1', '总部2项目2'],
  财务部: ['总部3项目1', '总部3项目2'],
  济部1: ['济部1项目1', '济部1项目2'],
  济部2: ['济部2项目1', '济部2项目2'],
  济部3: ['济部3项目1', '济部3项目2', '济部3项目3'],
  哈部1: ['哈部1项目1'],
  哈部2: []
};

export default class Choice extends React.Component {
  state = {
    institute: '',
    departmentList: [],
    department:'',
    projectList: [],
    project:''
  };
  handleInstituteChange = (value) => {
    console.log(value + '一级+');
    this.setState({
      institute: value,
      departmentList:departmentData[value],
      projectList: [],
      department: '',
      project: ''
    });
  };
  onDepartmentChange = (value) => {
    console.log(value + '二级');
    this.setState({
      department: value,
      projectList: projectData[value],
      project: ''
    });
  };
  onProjectChange = (value) => {
    console.log(value + '三级');
    this.setState({
      project: value,
    });
  };
  render() {
    const instituteOptions = instituteData.map(ins => <Option key={ins}>{ins}</Option>);
    const departmentOptions = this.state.departmentList.map(dep=> <Option key={dep}>{dep}</Option>);
    const projectOptions = this.state.projectList.map(pro => <Option key={pro}>{pro}</Option>);
    return (
      <div>
        <Button style={{marginRight: 10}}>全览</Button>
        <Select
          showSearch
          style={{ width: 150, marginRight: 10 }}
          onChange={this.handleInstituteChange}
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {instituteOptions}
        </Select>
        <Select value={this.state.department} style={{ width: 150, marginRight: 10 }} onChange={this.onDepartmentChange}>
          {departmentOptions}
        </Select>
        <Select value={this.state.project} style={{ width: 250 }} onChange={this.onProjectChange}>
          {projectOptions}
        </Select>
      </div>
    );
  }
}
