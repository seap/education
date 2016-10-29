import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import * as IndexActions from '../actions';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import {GridList, GridTile} from 'material-ui/GridList';

import Loader from '../components/Loader';
import TitleRefresh from '../components/TitleRefresh';
import { dateFormat } from '../common/js/utility';

class WriteonDetail extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const { fetchWriteonDetail, wxConfig} = this.props.actions;
    fetchWriteonDetail && fetchWriteonDetail(this.props.params);
  }

  renderWriteonDetail() {
    const { writeon } = this.props.value.app;
    if (writeon) {
      return (
        <Card>
          <CardHeader
            title={writeon.writeon_name}
            subtitle={dateFormat(new Date(parseInt(writeon.create_date) * 1000), 'yyyy-MM-dd')}
          />
          <Divider />
          <p>
            {writeon.content}
          </p>
          <GridList cellHeight={200} >
            {writeon.writeon_attach.map((tile, index) => (
              <a href={tile.attach_url} target="_blank">
              <GridTile
                key={index}
                title={tile.attach_name} >
                <img src={tile.attach_url_small} />
              </GridTile>
              </a>
            ))}
          </GridList>

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
      <Helmet title="板书详情" />
        <MuiThemeProvider muiTheme={ getMuiTheme({userAgent: this.props.value.userAgent}) }>
        <div>
          {this.renderWriteonDetail()}
        </div>
        </MuiThemeProvider>
        <TitleRefresh />
        {this.renderLoading()}
      </div>
    );
  }
}

WriteonDetail.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(WriteonDetail);
