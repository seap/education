import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as IndexActions from '../../actions';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';


const style = {
  container: {
    position: 'relative',
  },
  bindForm: {
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
    marginLeft: '50%'
  },
};

class UserRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentName: '',
      parentName: '',
      phone: '',
      password: '',
      // studentNameError: '',
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
    // if (this.state.studentName == '') {
    //   this.setState({
    //     studentNameError: '请输入姓名'
    //   });
    // }
    const { register } = this.props.actions;
    register(this.state);
  }

  handleClose = () => {
    const { confirmMessage } = this.props.actions;
    confirmMessage();
  }

  render() {
    return (
       <MuiThemeProvider  muiTheme={ getMuiTheme({userAgent: this.props.value.userAgent}) }>
         <div style={style.container}>

         <AppBar
           title="帐号注册"
         />
         <div style={style.bindForm} >
         <TextField
          id="studentName"
          floatingLabelText="学生姓名"
          hintText="请输入学生姓名"
          value={this.state.studentName}
          onChange={this.handleChange}
          fullWidth={true} />
        <TextField
         id="parentName"
         floatingLabelText="家长姓名"
         hintText="请输入家长姓名"
         value={this.state.parentName}
         onChange={this.handleChange}
         fullWidth={true} />
         <TextField
           id="phone"
           floatingLabelText="手机号"
           hintText="请输入手机号"
           value={this.state.phone}
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
           id="register"
           label="注册"
           onTouchTap={this.handleSubmit}
           primary={true}
           fullWidth={true} />
         </div>
         {this.renderDialog()}
         {this.renderLoading()}
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

  renderLoading() {
    if (this.props.value.app.isFetching) {
      return (
        <RefreshIndicator
           size={40}
           left={-20}
           top={10}
           status="loading"
           style={style.refresh}
         />
      );
    }
  }
}

UserRegister.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(UserRegister);
