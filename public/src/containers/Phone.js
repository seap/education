import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as IndexActions from '../actions';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Loader from '../components/Loader';

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

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: ''
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
  }

  handleSubmit = () => {
    const { modifyPhone } = this.props.actions;
    modifyPhone(this.state.phone);
  }

  handleClose = () => {
    const { confirmMessage } = this.props.actions;
    confirmMessage();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  renderMyInfo() {
    return (
      <div style={{padding: 10}}>
      <TextField
        id="phone"
        floatingLabelText="手机号"
        type="text"
        value={this.state.phone}
        onChange={this.handleChange}
        fullWidth={true} />
       <div style={{textAlign: 'center'}}>
       <RaisedButton
         id="bind"
         label="确认修改"
         style={{width:180}}
         onTouchTap={this.handleSubmit}
         primary={true}
         fullWidth={true} />
       </div>
       </div>
    )
  }
  render() {
    return (
       <MuiThemeProvider  muiTheme={ getMuiTheme({userAgent: this.props.value.userAgent}) }>
         <div style={style.container}>
         <Helmet title="修改手机号" />
         <AppBar
           title="修改手机号"
         />
         {this.renderMyInfo()}
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
      /> ];

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

Payment.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
