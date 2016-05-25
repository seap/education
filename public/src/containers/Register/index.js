import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as IndexActions from '../../actions';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';

const formStyle = {
  textAlign: 'center',
  marginLeft: 10,
  marginRight: 10
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentName: '',
      studentId: '',
      password: '',
      studentNameError: '',
      userIdError: ''
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = () => {
    console.log('submit......');
    if (this.state.studentName == '') {
      this.setState({
        studentNameError: '请输入姓名'
      });
    }
    const { register } = this.props.actions;
    register();
  }

  handleClose = () => {
    const { confirmMessage } = this.props.actions;
    confirmMessage();
  }

  render() {
    return (
       <MuiThemeProvider  muiTheme={ getMuiTheme({userAgent: this.props.value.userAgent}) }>
         <div >
         <AppBar
           title="帐号绑定"
         />
         <div style={formStyle} >
         <TextField
          id="studentName"
          floatingLabelText="姓名"
          hintText="请输入姓名"
          errorText={this.state.studentNameError}
          value={this.state.studentName}
          onChange={this.handleChange}
          fullWidth={true} />
         <TextField
           id="studentId"
           floatingLabelText="学号"
           hintText="请输入学号"
           value={this.state.studentId}
           onChange={this.handleChange}
           fullWidth={true} />
         <TextField
           id="password"
           floatingLabelText="密码"
           hintText="请输入密码"
           value={this.state.password}
           onChange={this.handleChange}
           type="password"
           fullWidth={true} />
         <RaisedButton
           id="bind"
           label="绑定帐号"
           onTouchTap={this.handleSubmit}
           primary={true}
           fullWidth={true} />
         </div>
         {this.renderDialog()}
         </div>
       </MuiThemeProvider>
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
        onTouchTap={this.handleClose}
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
}

Register.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(Register);
