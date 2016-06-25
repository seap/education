import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import * as IndexActions from '../../actions';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
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
import Loader from '../../components/Loader';

import { dateFormat } from '../../common/js/utility';

const style = {
  infoContainer: {
    textAlign: 'center',
    margin: 20
  }
};

class TaskList extends Component {
  constructor() {
    super();
    this.myTasks = null;
    this.currentClass = null;
    this.state = {
      classIndex: 0
    }
  }

  componentDidMount() {
    const { fetchAllMyTasks } = this.props.actions;
    fetchAllMyTasks && fetchAllMyTasks();
  }

  handleClassChange = (event, index, value) => this.setState({
    classIndex: index
  });

  handleClose = () => {
    const { confirmMessage } = this.props.actions;
    confirmMessage();
  }

  renderMyClasses() {
    const { myClasses } = this.props.value.app;
    if (!myClasses) {
      return;
    }
    if (myClasses.length > 0) {
      this.currentClass = myClasses[this.state.classIndex];
      const classList = myClasses.map((clazz, index) =>
        <MenuItem key={index} value={clazz.clazz_id} primaryText={clazz.clazz_name} />
      );
      // console.log(myClasses[0].clazz_id);
      return (
        <div style={{paddingLeft: 10}}>
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
        <div style={style.infoContainer}>
        没有您的班级信息！
        </div>
      )
    }

  }
  // 渲染已批改作业
  renderCompletedTasks() {
    if (this.currentClass && this.currentClass.tasks) {
      let completedTasks = this.currentClass.tasks.filter((task)=>task.status === 'compl');
      if (completedTasks.length > 0) {
        return completedTasks.map((task, index) =>
          <Link key={index} to={`/task/detail/${task.task_id}`}>
          <ListItem
            key={index}
            leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={grey500} />}
            rightIcon={<IconDone />}
            primaryText={task.task_name}
            secondaryText={dateFormat(new Date(parseInt(task.create_date)*1000), 'yyyy-MM-dd')}
          />
          </Link>
        )
      } else {
        return (
          <div style={style.infoContainer}>
            没有已批改的作业！
          </div>
        );
      }
    }
  }

  // 渲染当前作业
  renderCurrentTasks() {
    if (this.currentClass && this.currentClass.tasks) {
      let currentTasks = this.currentClass.tasks.filter((task)=>task.status !== 'compl');
      if (currentTasks.length > 0) {
        return currentTasks.map((task, index) =>
          <Link key={index} to={`/task/detail/${task.task_id}`}>
          <ListItem
            key={index}
            leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={task.status === 'nocom' ? blue500 : yellow500} />}
            rightIcon={task.status === 'nocom' ? <IconCreate /> : ''}
            primaryText={task.task_name}
            secondaryText={dateFormat(new Date(parseInt(task.create_date)*1000), 'yyyy-MM-dd')}
          />
          </Link>
        )
      } else {
        return (
          <div style={style.infoContainer}>
            没有当前作业！
          </div>
        )
      }
    }
  }

  renderLoading() {
    const { isFetching } = this.props.value.app;
    return (
      <Loader visible={ isFetching } />
    );
  }

  renderDialog() {
    const { message } = this.props.value.app;
    if (!message) {
      return;
    }
    const actions = [
      <FlatButton
        label="确认"
        primary={true}
        onClick={this.handleClose}
      />
    ];
    return (
      <Dialog
          actions={actions}
          modal={true}
          open={true}
          onRequestClose={this.handleClose} >
        {message}
      </Dialog>
    );
  }

  render() {
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
              {this.renderCurrentTasks()}
            </List>
            </div>
          </Tab>
          <Tab label="已批改作业" >
            {this.renderCompletedTasks()}
          </Tab>
        </Tabs>
        {this.renderLoading()}
        {this.renderDialog()}
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
