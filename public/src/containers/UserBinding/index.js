import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import * as IndexActions from '../../actions';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
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
  divider: {
    textAlign: 'right',
    marginTop: 10,
  }
};

class UserBinding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentId: '',
      password: '',
      remark: '',
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
    const { isFetching, bind } = this.props.actions;
    if (isFetching) {
      return;
    }
    bind(this.state);
  }

  handleClose = () => {
    const { push } = this.props;
    const { confirmMessage } = this.props.actions;
    const { bindSuccess } = this.props.value.app;
    if (bindSuccess) {
      // refer页面
      push('task/list');
    }
    confirmMessage();
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
      <Helmet title="帐号绑定" />
      <AppBar
        title="帐号绑定"
        onLeftIconButtonTouchTap={this.handleMenuTouchTap}
      />
      <Popover
       open={this.state.menuOpen}
       anchorEl={this.state.anchorEl}
       anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
       targetOrigin={{horizontal: 'left', vertical: 'top'}}
       onRequestClose={this.handleMenuRequestClose} >
       <Menu>
         <MenuItem primaryText="帐号注册" onTouchTap={()=>{push('/register')}}/>
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
           id="studentId"
           hintText="请输入学号"
           floatingLabelText="学号"
           value={this.state.studentId}
           onChange={this.handleChange}
           fullWidth={true} />
         <TextField
           id="password"
           hintText="请输入密码"
           floatingLabelText="密码"
           value={this.state.password}
           onChange={this.handleChange}
           type="password"
           fullWidth={true} />
         <TextField
          id="remark"
          hintText="请输入备注"
          floatingLabelText="备注"
          value={this.state.remark}
          onChange={this.handleChange}
          fullWidth={true} />
          <RaisedButton
            id="bind"
            label="绑定帐号"
            onTouchTap={this.handleSubmit}
            primary={true}
            fullWidth={true} />
         </div>
         <div style={style.divider} >
         <Divider />
         <Link to='/register'> <FlatButton label="没有帐号？请注册" /></Link>
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

  renderLoading() {
    const { isFetching } = this.props.value.app;
    return (
      <Loader visible={ isFetching } />
    );
  }
}

UserBinding.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(IndexActions, dispatch),
  push: bindActionCreators(push, dispatch)}
);

export default connect(mapStateToProps, mapDispatchToProps)(UserBinding);
