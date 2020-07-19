const Baseurl = 'https://ilinkon.herokuapp.com/';
const imageUpload = 'https://api.cloudinary.com/v1_1/https-cyberve-com/image/upload'
import { AsyncStorage } from 'react-native';
import { OtpInputs } from '../../components';
const LoginEndpoint = `${Baseurl}auth/verify-otp`,
  GetOTPEndpoint = `${Baseurl}auth/generate-otp`,
  UpdateProfileEndpoint = `${Baseurl}auth/register`,
  ProfileEndpoint = `${Baseurl}users/`,
  VerificationEndpoint = `${Baseurl}api/users/`,
  ChangePassword = `${Baseurl}api/users/`,
  ForgotPassword = `${Baseurl}api/users/password/forgot`,
  CreateGroupEndpoint = `${Baseurl}groups`,
  CreateEventEndpoint = `${Baseurl}groups/`,
  GetGroupsEndpoint = `${Baseurl}groups/`,
  YourGroupEndpoint = `${Baseurl}groups​/`,
  GetAllEvent = `${Baseurl}events`,
  GetSimilarInterest = `${Baseurl}interests`,
  UserLogoutEndpoint = `${Baseurl}api/logout`,
  JoinGroup = `${Baseurl}groups/`,
  GetGroupDetails = `${Baseurl}groups/`,
  GetGroupEvent = `${Baseurl}groups/`,
  LeaveGroupEndpoint = `${Baseurl}groups/`,
  GetEventDetails = `${Baseurl}events/`,
  GetGroupMember = `${Baseurl}groups/`,
  GetCommentEndpoint = `${Baseurl}events/`,
  CreateCommentEndpoint = `${Baseurl}events/`,
  GetAttendEvent = `${Baseurl}events/`,
  GetSchoolsEndpoint = `${Baseurl}schools`,
  GetInterestEndpoint = `${Baseurl}interests`,
  CreateThreadEndpoint = `${Baseurl}messages`,
  GetAllMessageEndPoint = `${Baseurl}messages`,
  GetGroupByID = `${Baseurl}groups/schools/`,
  NotificationEndpoint = `${Baseurl}notifications`,
  GetThreadMessage = `${Baseurl}messagethreads`
export {
  LoginEndpoint,
  GetOTPEndpoint,
  CreateGroupEndpoint,
  CreateEventEndpoint,
  GetGroupsEndpoint,
  YourGroupEndpoint,
  UpdateProfileEndpoint,
  ProfileEndpoint,
  VerificationEndpoint,
  ChangePassword,
  ForgotPassword,
  GetAttendEvent,
  GetAllEvent,
  UserLogoutEndpoint,
  GetSimilarInterest,
  JoinGroup,
  GetGroupDetails,
  GetGroupEvent,
  GetGroupMember,
  GetEventDetails,
  LeaveGroupEndpoint,
  CreateCommentEndpoint,
  GetCommentEndpoint,
  imageUpload,
  GetSchoolsEndpoint,
  GetInterestEndpoint,
  NotificationEndpoint,
  CreateThreadEndpoint,
  GetAllMessageEndPoint,
  GetGroupByID,
  GetThreadMessage
};

export const isEmailValid = email => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const isPhoneValid = phone => {
  if (phone.length == 14) {
    return true;
  } else {
    return false;
  }
};

export const _isEmpty = (value) => {
  return value === undefined ||
    value === null ||
    value === NaN ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length() === 0);
}


export const postRoute = (endpoint, body) => {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(res => {
      return res;
    })
    .then(res => {
      return res.json();
    })
    .catch(error => {
      return error;
    });
};

export const postWithToken = (endpoint, body, token) => {
  console.log({ endpoint: endpoint, body: body, token: token });
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })
    .then(res => {
      return res.json();
    })
    .then(res => {
      return res;
    })
    .catch(error => {
      return error;
    });
};
export const postToken = (endpoint, token) => {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify('')
  })
    .then(res => {
      return res.json();
    })
    .then(res => {
      return res;
    })
    .catch(error => {
      return error;
    });
};

export const getRoute = endpoint => {
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then(res => {
      return res.json();
    })
    .then(res => {
      return res;
    })
    .catch(error => {
      return error;
    });
};

export const getRouteToken = (endpoint, token) => {
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      return res.json();
    })
    .then(res => {
      return res;
    })
    .catch(error => {
      return error;
    });
};

export const putRoute = (endpoint, body, token) => {
  return fetch(endpoint, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: body
  })
    .then(res => {
      return res.json();
    })
    .then(res => {
      return res;
    })
    .catch(error => {
      return error;
    });
};

export const saveProfile = async access_token => {
  let profile = {
    access_token: access_token
  };
  return await AsyncStorage.setItem('profile', JSON.stringify(profile));
};

export const getProfile = async () => {
  return await AsyncStorage.getItem('profile').then(value => {
    if (value) {
      return JSON.parse(value);
    } else {
      return false;
    }
  });
};

export const saveUserDetail = async (data) => {
  let details = {
    data: data
  };
  return await AsyncStorage.setItem('details', JSON.stringify(details));
};

export const subscription = async status => {
  await AsyncStorage.removeItem('subscription');
  return await AsyncStorage.setItem('subscription', status);
};

export const getSubscription = async () => {
  return await AsyncStorage.getItem('subscription').then(value => {
    if (value == 'active') {
      return true;
    } else {
      return false;
    }
  });
};

export const getUserDetails = async () => {
  return await AsyncStorage.getItem('details').then(value => {
    if (value) {
      return JSON.parse(value);
    } else {
      return false;
    }
  });
};

export const updateUserDetails = async (data, token) => {
  let details = {
    data: data,
    token: token
  };

  await AsyncStorage.removeItem('details');
  return await AsyncStorage.setItem('details', JSON.stringify(details));
};

export const saveProfileImage = async base64Image => {
  let record = {
    image: base64Image
  };
  return await AsyncStorage.setItem('profileImage', JSON.stringify(record));
};

export const getProfileImage = async () => {
  return await AsyncStorage.getItem('profileImage').then(value => {
    if (value) {
      return JSON.parse(value);
    } else {
      return false;
    }
  });
};

export const saveExpoToken = async (expoToken) => {
  return await AsyncStorage.setItem('expoToken', expoToken);
}

export const getExpoToken = async () => {
  return await AsyncStorage.getItem('expoToken')
    .then((value) => {
      if (value) {
        return value;
      } else {
        return false;
      }
    });
}
