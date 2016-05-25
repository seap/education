import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
import {blue500, yellow600} from 'material-ui/styles/colors';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';

import Slider from 'material-ui/Slider';
import styles from './main.scss';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class MyTask extends Component {
  constructor() {
    super();
    this.state = {
      value: 1
    }
  }

  _bind(...arr) {
    for (let item of arr) {
      this[item] = this[item].bind(this);
    }
  }

  handleChange = (event, index, value) => this.setState({value});

  render() {
    return (
      <div className={ styles.uiForm }>

      <MuiThemeProvider muiTheme={getMuiTheme()}>
      <div>
        <AppBar
          title="我的作业"
        />

        <SelectField
          value={this.state.value}
          onChange={this.handleChange}
          floatingLabelText="当前班级"
          fullWidth={true}>
          <MenuItem value={1} primaryText="英语" />
          <MenuItem value={2} primaryText="数学" />
        </SelectField>
        <Tabs>
        <Tab label="未完成作业" >
          <div>
          <List>
            <Subheader inset={true}>未完成 未提交作业</Subheader>
            <ListItem
              leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500} />}
              rightIcon={<IconCreate />}
              primaryText="作业XXXX"
              secondaryText="2016-05-25"
            />
            <ListItem
              leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={yellow600} />}
              rightIcon={<IconCreate />}
              primaryText="作业YYYYY"
              secondaryText="2016-05-25"
            />
            <ListItem
              leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500} />}
              rightIcon={<IconCreate />}
              primaryText="作业XXXX"
              secondaryText="2016-05-25"
            />
            <ListItem
              leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={yellow600} />}
              rightIcon={<IconCreate />}
              primaryText="作业YYYYY"
              secondaryText="2016-05-25"
            />
            <ListItem
              leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500} />}
              rightIcon={<IconCreate />}
              primaryText="作业XXXX"
              secondaryText="2016-05-25"
            />
            <ListItem
              leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={yellow600} />}
              rightIcon={<IconCreate />}
              primaryText="作业YYYYY"
              secondaryText="2016-05-25"
            />
            <ListItem
              leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500} />}
              rightIcon={<IconCreate />}
              primaryText="作业XXXX"
              secondaryText="2016-05-25"
            />
            <ListItem
              leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={yellow600} />}
              rightIcon={<IconCreate />}
              primaryText="作业YYYYY"
              secondaryText="2016-05-25"
            />
          </List>
          </div>
        </Tab>
        <Tab label="已完成作业" >
          <List>
            <Subheader inset={true}>已完成作业</Subheader>
            <ListItem
              leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500} />}
              rightIcon={<IconDone />}
              primaryText="作业"
              secondaryText="2016-05-20"
            />
            <ListItem
              leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={yellow600} />}
              rightIcon={<IconDone />}
              primaryText="Kitchen remodel"
              secondaryText="2016-05-21"
            />
          </List>
        </Tab>

      </Tabs>
      </div>
      </MuiThemeProvider>

      </div>
    );
  }
}

MyTask.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(MyTask);
