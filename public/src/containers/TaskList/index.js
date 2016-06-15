import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import * as IndexActions from '../../actions';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Tabs, Tab} from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import IconCreate from 'material-ui/svg-icons/content/create';
import IconDone from 'material-ui/svg-icons/action/done';

import Divider from 'material-ui/Divider';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import {blue500, yellow500, grey500} from 'material-ui/styles/colors';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';

import Slider from 'material-ui/Slider';
import styles from './main.scss';

import DropDownMenu from 'material-ui/DropDownMenu';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { dateFormat } from '../../common/js/utility';

class TaskList extends Component {
  constructor() {
    super();
    this.myTasks = null;
    this.state = {
      classIndex: 0,
      currentClass: null
    }
  }

  componentDidMount() {
    const { fetchAllMyTasks } = this.props.actions;
    fetchAllMyTasks && fetchAllMyTasks();
  }

  handleClassChange = (event, index, value) => this.setState({
    classIndex: index
  });

  renderMyClasses() {
    const { myClasses } = this.props.value.app;
    if (myClasses && myClasses.length > 0) {
      const classList = myClasses.map((clazz, index) =>
        <MenuItem key={index} value={clazz.clazz_id} primaryText={clazz.clazz_name} />
      );
      // console.log(myClasses[0].clazz_id);
      return (
        <div>
        当前班级
        <DropDownMenu
          value={myClasses[this.state.classIndex].clazz_id}
          onChange={this.handleClassChange}>
          {classList}
        </DropDownMenu>
        </div>
      );
    } else {
      // 无班级列表
      return (
        <div style={{textAlign: 'center', margin: 20}}>
        没有您的班级信息！
        </div>
      )
    }

  }
  // 渲染已批改作业
  renderCompletedTasks() {
    if (this.myTasks) {
      let completedTasks = this.myTasks.filter((task)=>task.status === 'compl');
      return completedTasks.map((task, index) =>
        <Link to={`/task/detail/${task.task_id}`}>
        <ListItem
          key={task.task_id}
          leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={grey500} />}
          rightIcon={<IconDone />}
          primaryText={task.task_name}
          secondaryText={dateFormat(new Date(parseInt(task.create_date)*1000), 'yyyy-MM-dd')}
        />
        </Link>
      )
    }
  }

  // 渲染当前作业
  renderCurrentTasks() {
    if (this.myTasks) {
      let currentTasks = this.myTasks.filter((task)=>task.status !== 'compl');
      return currentTasks.map((task, index) =>
        <Link to={`/task/detail/${task.task_id}`}>
        <ListItem
          key={task.task_id}
          leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={task.status === 'nocom' ? blue500 : yellow500} />}
          rightIcon={<IconCreate />}
          primaryText={task.task_name}
          secondaryText={dateFormat(new Date(parseInt(task.create_date)*1000), 'yyyy-MM-dd')}
        />
        </Link>
      )
    }
  }

  render() {
    const { myClasses } = this.props.value.app;
    if (this.state.currentClass) {
      for (let i = 0; i < myClasses.length; i++) {
        if (this.state.currentClass == myClasses[i].clazz_id) {
          this.myTasks = myClasses[i].tasks;
          break;
        }
      }
    } else if (myClasses && myClasses[0]) {
      this.state.currentClass = myClasses[0].clazz_id;
      this.myTasks = myClasses[0].tasks;
    }
    return (
      <div>
        <Helmet title="我的作业" />
        <MuiThemeProvider muiTheme={ getMuiTheme({userAgent: this.props.value.userAgent}) }>
        <div>
          <AppBar title="我的作业" />
          {this.renderMyClasses()}
          <Tabs>
          <Tab label="当前作业" >
            <div>
            <List>
              <Subheader inset={true}>未提交作业</Subheader>
              {this.renderCurrentTasks()}
            </List>
            </div>
          </Tab>
          <Tab label="已批改作业" >
            {this.renderCompletedTasks()}
          </Tab>
        </Tabs>
        </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

TaskList.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
