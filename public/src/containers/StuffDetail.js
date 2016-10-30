import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import * as IndexActions from '../actions';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List';

import {Card, CardHeader} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import IconPDF from 'material-ui/svg-icons/image/picture-as-pdf';
import IconAudio from 'material-ui/svg-icons/av/library-music';

import Loader from '../components/Loader';
import TitleRefresh from '../components/TitleRefresh';
import { dateFormat } from '../common/js/utility';

class StuffDetail extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const { fetchStuffDetail } = this.props.actions;
    fetchStuffDetail && fetchStuffDetail(this.props.params);
  }

  renderStuffDetail() {
    const { stuff } = this.props.value.app;
    if (stuff) {
      return (
        <Card>
          <CardHeader
            title={stuff.stuff_name}
            subtitle={dateFormat(new Date(parseInt(stuff.create_date) * 1000), 'yyyy-MM-dd')}
          />
          <Divider />
        
          <List>
            { stuff.stuff_attach.map((e, index) => {
              if (e.attach_type == 'audio/mp3') {
                return <audio src={e.attach_url} />;
              } else {
                return <a key={index} href={e.attach_url} ><ListItem key={index} primaryText={e.attach_name}
                  leftIcon={e.attach_type == 'audio/mp3'? <IconAudio />: <IconPDF />}
                /></a>;
              }
            })}
          </List>
        </Card>
      );
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
      <Helmet title="辅导材料" />
        <MuiThemeProvider muiTheme={ getMuiTheme({userAgent: this.props.value.userAgent}) }>
        <div>
          {this.renderStuffDetail()}
        </div>
        </MuiThemeProvider>
        <TitleRefresh />
        {this.renderLoading()}
      </div>
    );
  }
}

StuffDetail.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(StuffDetail);
