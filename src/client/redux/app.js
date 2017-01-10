import cookie from 'react-cookie';

const APP_MOBILE = 'app/mobile';

const initialState = {
  mobile: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case APP_MOBILE:
      return { ...state, mobile: true };
    default:
      return state;
  }
}

export const getFingerprint = () => {
  return dispatch => {
    let savedFingerprint = cookie.load('_fp');
    if (!savedFingerprint) {
      // save fingerprint to cookie
    }
  };
};
