import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import * as IndexActions from '../../actions';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import styles from './main.scss';


class Login extends Component {
  constructor() {
    super();
  }

  _bind(...arr) {
    for (let item of arr) {
      this[item] = this[item].bind(this);
    }
  }

  componentDidMount() {
    let { actions } = this.props;
    actions && actions.wxConfig();
  }

  render() {

    return (
      <div className={ styles.uiForm }>
      logo picture
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
        <TextField
          floatingLabelText="姓名"
          hintText="请输入姓名"
          fullWidth={true}/>
        <TextField
          floatingLabelText="学号"
          hintText="请输入学号"
          fullWidth={true} />
        <TextField
          floatingLabelText="密码"
          hintText="请输入密码"
          type="password"
          fullWidth={true} />
          <br/>
        <RaisedButton
          label="开始录音"
          primary={true}
          fullWidth={true}
          onTouchTap={this.onSubmit} />
        <RaisedButton
          label="停止录音"
          primary={true}
          fullWidth={true}
          onTouchTap={this.stopRecord} />

        </div>
      </MuiThemeProvider>

      </div>
    );
  }

  onSubmit = () => {
    let { actions } = this.props;
    actions.record();
  }

  stopRecord = () => {
    let { actions } = this.props;
    actions.stopRecord();
  }
}

Login.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
