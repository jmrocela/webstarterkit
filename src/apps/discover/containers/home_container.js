import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

class HomeContainer extends Component {

  render() {
    return (
      <main>
        <Helmet title="Home" />

        This is home
      </main>
    );
  }

}

export default connect()(HomeContainer);
