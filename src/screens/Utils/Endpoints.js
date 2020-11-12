import { AsyncStorage } from 'react-native';

// userProfile
export const saveUserDetail = async (data, token) => {
  let details = {
    data: data,
    token: token,
  };
  return await AsyncStorage.setItem('details', JSON.stringify(details));
};
export const getUserDetails = async () => {
  return await AsyncStorage.getItem('details').then((value) => {
    if (value) {
      return JSON.parse(value);
    } else {
      return false;
    }
  });
};
