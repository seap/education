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
          label="绑定账号"
          primary={true}
          fullWidth={true} />

        </div>
      </MuiThemeProvider>

      </div>
    );
  }
}

Login.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
