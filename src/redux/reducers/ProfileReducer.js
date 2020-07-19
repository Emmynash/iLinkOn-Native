import * as types from '../actions/types';

const initialState = {
    profile:{}
}
export default function ProfileReducer(state = initialState, action) {
    switch(action.type){
        case types.SET_PROFILE: 
            return Object.assign({}, state, {
                profile:{...state.profile, ...action.profile},      
            });
         default:
            return state;

    }
}
