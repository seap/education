import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import * as IndexActions from '../actions';
import { push } from 'react-router-redux';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import IconCreate from 'material-ui/svg-icons/image/navigate-next';

import ActionAssignment from 'material-ui/svg-icons/social/notifications';
import {grey500} from 'material-ui/styles/colors';

import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import Loader from '../components/Loader';
import TitleRefresh from '../components/TitleRefresh';
import { dateFormat } from '../common/js/utility';

const style = {
  infoContainer: {
    textAlign: 'center',
    margin: 20
  }
};

class NoticeList extends Component {
  constructor() {
    super();
    this.currentClass = null;
    this.state = {
      classIndex: 0,
      menuOpen: false
    }
  }

  componentDidMount() {
    const { fetchNoticeList } = this.props.actions;
    fetchNoticeList && fetchNoticeList();
  }

  handleClassChange = (event, index, value) => this.setState({
    classIndex: index
  });

  renderMyClasses() {
    const { myClasses } = this.props.value.app;
    if (!myClasses) {
      return;
    }
    this.currentClass = myClasses[this.state.classIndex];
    if (myClasses.length > 0) {
      const classList = myClasses.map((clazz, index) =>
        <MenuItem key={index} value={clazz.clazz_id} primaryText={clazz.clazz_name} />
      );
      // console.log(myClasses[0].clazz_id);
      return (
        <div style={{paddingLeft: 10}}>
        当前班级
        <DropDownMenu
          value={myClasses[this.state.classIndex].clazz_id}
          onChange={this.handleClassChange}>
          {classList}
        </DropDownMenu>
        </div>
      );
    } else {
      // 无班级列表
      return (
        <div style={style.infoContainer}>
        没有您的班级信息！
        </div>
      )
    }
  }

  // 渲染列表
  renderNoticeList() {
    if (this.currentClass && this.currentClass.notices) {
      let currentList = this.currentClass.notices;
      if (currentList.length > 0) {
        return currentList.map((notice, index) =>
          <Link key={index} to={`/notice/detail/${notice.id}`}>
          <ListItem
            key={index}
            leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={grey500} />}
            rightIcon={<IconCreate />}
            primaryText={notice.name}
            secondaryText={dateFormat(new Date(parseInt(notice.create_date) * 1000), 'yyyy-MM-dd')}
          />
          </Link>
        )
      } else {
        return (
          <div style={style.infoContainer}>
            当前没有通告内容！
          </div>
        );
      }
    }
  }

  renderLoading() {
    const { isFetching } = this.props.value.app;
    return (
      <Loader visible={ isFetching } />
    );
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

  renderMenu() {
    const { push } = this.props;
    return (
      <Popover
         open={this.state.menuOpen}
         anchorEl={this.state.anchorEl}
         anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
         targetOrigin={{horizontal: 'left', vertical: 'top'}}
         onRequestClose={this.handleMenuRequestClose} >
         <Menu>
           <MenuItem primaryText="我的作业" onTouchTap={()=>{push('/task/list')}}/>
           <MenuItem primaryText="课程板书" onTouchTap={()=>{push('/writeon/list')}}/>
           <MenuItem primaryText="辅导材料" onTouchTap={()=>{push('/stuff/list')}}/>
         </Menu>
      </Popover>
    );
  }

  render() {
    return (
      <div>
        <Helmet title="班级通告" />
        <MuiThemeProvider muiTheme={ getMuiTheme({userAgent: this.props.value.userAgent}) }>
        <div>
          <AppBar
            title="班级通告"
            onLeftIconButtonTouchTap={this.handleMenuTouchTap}
          />
          {this.renderMenu()}
          {this.renderMyClasses()}
          <List>
          {this.renderNoticeList()}
          </List>
        </div>
        </MuiThemeProvider>
        <TitleRefresh />
        {this.renderLoading()}
      </div>
    );
  }
}

NoticeList.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(IndexActions, dispatch),
    push: bindActionCreators(push, dispatch)
   }
);

export default connect(mapStateToProps, mapDispatchToProps)(NoticeList);
