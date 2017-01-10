import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../redux/app';

class Wrapper extends Component {

  componentDidMount() {
    this.props.actions.getFingerprint();

    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      /*eslint no-console: ["error", { allow: ["info", "error"] }] */
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        console.info('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(function(err) {
        console.error('ServiceWorker registration failed: ', err);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.key !== this.props.location.key && nextProps.location.state && nextProps.location.state.modal) {
      this.previousChildren = this.props.children;
    }
  }

  render() {
    let { location } = this.props;

    let isModal = (
      location.state &&
      location.state.modal &&
      this.previousChildren
    );

    return (
      <main id="wrapper" className={this.props.app.mobile === true ? 'mobile' : 'desktop'}>
        {isModal ?
          this.previousChildren :
          this.props.children
        }

        {isModal && (
          <div id="modal">
            {this.props.children}
          </div>
        )}
      </main>
    );
  }

}

function mapStateToProps(state) {
  return { app: state.app };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);
