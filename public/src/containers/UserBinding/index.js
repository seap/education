import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
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
      userIdError: ''
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
    const { confirmMessage } = this.props.actions;
    confirmMessage();
  }

  render() {
    return (
       <MuiThemeProvider  muiTheme={ getMuiTheme({userAgent: this.props.value.userAgent}) }>
         <div style={style.container}>

         <AppBar
           title="帐号绑定"
         />
         <div style={style.bindForm} >
         <TextField
           id="studentId"
           hintText="学号"
           value={this.state.studentId}
           onChange={this.handleChange}
           fullWidth={true} />
         <TextField
           id="password"
           hintText="密码"
           value={this.state.password}
           onChange={this.handleChange}
           type="password"
           fullWidth={true} />
         <TextField
          id="remark"
          hintText="备注"
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

UserBinding.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(UserBinding);
