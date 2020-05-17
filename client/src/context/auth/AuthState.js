import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import AuthReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from '../types';

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // load user
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get('/api/auth');

      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (error) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  // register user
  const register = async (formData) => {
    const config = {
      // header in axios (for content-type and etc)
      header: {
        'Content-Type': 'application/json',
      },
    };

    try {
      // no need to enter localhost:5000 for every request because of proxy in package.json
      const res = await axios.post('/api/users', formData, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data, // the token
      });

      loadUser();
    } catch (error) {
      // catch status 400 from routes/users.js
      dispatch({
        type: REGISTER_FAIL,
        payload: error.response.data.msg, // error message
      });
    }
  };

  // login user
  const login = async (formData) => {
    const config = {
      // header in axios (for content-type and etc)
      header: {
        'Content-Type': 'application/json',
      },
    };

    try {
      // no need to enter localhost:5000 for every request because of proxy in package.json
      const res = await axios.post('/api/auth', formData, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data, // the token
      });

      loadUser();
    } catch (error) {
      // catch status 400 from routes/users.js
      dispatch({
        type: LOGIN_FAIL,
        payload: error.response.data.msg, // error message
      });
    }
  };

  // logout
  const logout = () => {
    dispatch({
      type: LOGOUT,
    });
  };

  // clear errors
  const clearErrors = () => {
    dispatch({ type: CLEAR_ERRORS });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
