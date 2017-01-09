import React, { Component } from 'react';
import Helmet from 'react-helmet';

export default
class NotFoundContainer extends Component {

  render() {
    return (
      <div>
        <Helmet title="Not Found" />
        404 bitch
      </div>
    );
  }

}
