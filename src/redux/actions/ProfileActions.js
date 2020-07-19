import * as types from './types';
export const setProfile = (profile) => dispatch => {
   dispatch({
    type: types.SET_PROFILE,
     profile
  });
}


  



