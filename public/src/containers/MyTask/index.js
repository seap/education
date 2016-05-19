import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import * as IndexActions from '../../actions';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Tabs, Tab} from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import {blue500, yellow600} from 'material-ui/styles/colors';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import ICON_CREATE from 'material-ui/svg-icons/content/create';

import Slider from 'material-ui/Slider';
import styles from './main.scss';


class MyTask extends Component {
  constructor() {
    super();
  }

  _bind(...arr) {
    for (let item of arr) {
      this[item] = this[item].bind(this);
    }
  }

  render() {
    return (
      <div className={ styles.uiForm }>
      logo picture
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Tabs>
        <Tab label="未完成作业" >
          <div>
          <List>
            <Subheader inset={true}>Files</Subheader>
            <ListItem
              leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500} />}
              rightIcon={<ActionInfo />}
              primaryText="Vacation itinerary"
              secondaryText="Jan 20, 2014"
            />
            <ListItem
              leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={yellow600} />}
              rightIcon={<ActionInfo />}
              primaryText="Kitchen remodel"
              secondaryText="Jan 10, 2014"
            />
          </List>
          </div>
        </Tab>
        <Tab label="已完成作业" >
          <List>
            <Subheader inset={true}>我的班级</Subheader>
            <ListItem
              leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500} />}
              rightIcon={<ActionInfo />}
              primaryText="作业"
              secondaryText="2016-05-20"
            />
            <ListItem
              leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={yellow600} />}
              rightIcon={<ICON_CREATE />}
              primaryText="Kitchen remodel"
              secondaryText="2016-05-21"
            />
          </List>
        </Tab>

      </Tabs>
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
