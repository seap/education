import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
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
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Loader from '../../components/Loader';

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
      userIdError: '',
      menuOpen: false
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = () => {
    const { register } = this.props.actions;
    register(this.state);
  }

  handleClose = () => {
    const { registerSuccess } = this.props.value.app;
    const { confirmMessage } = this.props.actions;
    const { push } = this.props;
    confirmMessage();
    if (registerSuccess) {
      push('/task/list');
    }
  }

  handleMenuTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      menuOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  handleMenuRequestClose = () => {
    this.setState({
      menuOpen: false,
    });
  };

  renderAppBar() {
    const { push } = this.props;
    return (
      <div>
      <Helmet title="帐号注册" />
      <AppBar
        title="帐号注册"
        onLeftIconButtonTouchTap={this.handleMenuTouchTap}
      />
      <Popover
       open={this.state.menuOpen}
       anchorEl={this.state.anchorEl}
       anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
       targetOrigin={{horizontal: 'left', vertical: 'top'}}
       onRequestClose={this.handleMenuRequestClose} >
       <Menu>
         <MenuItem primaryText="帐号绑定" onTouchTap={()=>{push('/bind')}}/>
       </Menu>
      </Popover>
      </div>
    )
  }

  render() {
    return (
       <MuiThemeProvider  muiTheme={ getMuiTheme({userAgent: this.props.value.userAgent}) }>
         <div style={style.container}>
         {this.renderAppBar()}
         <div style={style.bindForm} >
         <TextField
          id="studentName"
          hintText="请输入学生姓名"
          floatingLabelText="学生姓名"
          value={this.state.studentName}
          onChange={this.handleChange}
          fullWidth={true} />
        <TextField
         id="parentName"
         hintText="请输入家长姓名"
         floatingLabelText="家长姓名"
         value={this.state.parentName}
         onChange={this.handleChange}
         fullWidth={true} />
         <TextField
           id="phone"
           hintText="请输入手机号"
           floatingLabelText="手机号"
           value={this.state.phone}
           onChange={this.handleChange}
           fullWidth={true} />
         <TextField
           id="password"
           hintText="请设置密码"
           floatingLabelText="密码"
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
    const { message, registerSuccess, student } = this.props.value.app;
    if (!message) {
      return;
    }
    let messageDesc = message;
    if (registerSuccess) {
      messageDesc = <div>{message}<p>您的学号：{student.student_no}</p></div>
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
        {messageDesc}
      </Dialog>
    );
  }

  renderLoading() {
    const { isFetching } = this.props.value.app;
    return (
      <Loader visible={ isFetching } />
    );
  }
}

UserRegister.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(IndexActions, dispatch),
  push: bindActionCreators(push, dispatch)}
);

export default connect(mapStateToProps, mapDispatchToProps)(UserRegister);
