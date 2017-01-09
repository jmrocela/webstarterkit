import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import Helmet from 'react-helmet';

class HomeContainer extends Component {

  render() {
    return (
      <main>
        <Helmet title="HOOQ" />

        Tests
      </main>
    );
  }

}

export default connect()(HomeContainer);
