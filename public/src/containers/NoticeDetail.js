import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import * as IndexActions from '../actions';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import IconPDF from 'material-ui/svg-icons/image/picture-as-pdf';
import IconAudio from 'material-ui/svg-icons/av/library-music';
import Loader from '../components/Loader';
import TitleRefresh from '../components/TitleRefresh';
import { dateFormat } from '../common/js/utility';

class NoticeDetail extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
  }

  renderNoticeDetail() {
    const {classId, noticeId} = this.props.params;
    const { myClasses } = this.props.value.app;
    if (myClasses) {
      for (let i = 0; i < myClasses.length; i++) {
        if (myClasses[i].clazz_id == classId) {
          let notices = myClasses[i].notices;
          for (let j = 0; j < notices.length; j++) {
            if (notices[j].id == noticeId) {
              const notice = notices[j];
              return (
                <Card>
                  <CardHeader
                    title={notice.name}
                    subtitle={dateFormat(new Date(parseInt(notice.create_date) * 1000), 'yyyy-MM-dd')}
                  />
                  <Divider />
                  <CardText>
                    <div dangerouslySetInnerHTML={{__html: notice.context}} />
                  </CardText>
                  <List>
                    <a href={notice.attach_url} ><ListItem primaryText={"通知附件"}
                      leftIcon={notice.attach_type == 'audio/mp3'? <IconAudio />: <IconPDF />}
                    /></a>
                  </List>
                </Card>
              );
            }
          }
        }
      }
    }
  }

  renderLoading() {
    const { isFetching } = this.props.value.app;
    return (
      <Loader visible={ isFetching } />
    );
  }

  render() {
    return (
      <div>
      <Helmet title="通告详情" />
        <MuiThemeProvider muiTheme={ getMuiTheme({userAgent: this.props.value.userAgent}) }>
        <div>
          {this.renderNoticeDetail()}
        </div>
        </MuiThemeProvider>
        <TitleRefresh />
        {this.renderLoading()}
      </div>
    );
  }
}

NoticeDetail.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(NoticeDetail);
