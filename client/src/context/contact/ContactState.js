import React, { useReducer } from 'react';
import { v4 as uuid } from 'uuid';
import ContactContext from './contactContext';
import ContactReducer from './contactReducer';
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER,
} from '../types';

const ContactState = (props) => {
  const initialState = {
    contacts: [
      {
        id: 1,
        name: 'Jill Taladega Nights',
        email: 'jill@gmail.com',
        phone: '111-111',
        type: 'personal',
      },
      {
        id: 2,
        name: 'Rey Slico',
        email: 'rey@gmail.com',
        phone: '222-222',
        type: 'personal',
      },
      {
        id: 3,
        name: 'Jack Taladega Day',
        email: 'jack@gmail.com',
        phone: '121-212',
        type: 'professional',
      },
    ],
    // contact object is set here for editing
    current: null,
    // filtered contacts
    filtered: null,
  };

  const [state, dispatch] = useReducer(ContactReducer, initialState);

  // add contact
  const addContact = (contact) => {
    contact.id = uuid();
    dispatch({ type: ADD_CONTACT, payload: contact });
  };

  // delete contact
  const deleteContact = (id) => {
    dispatch({ type: DELETE_CONTACT, payload: id });
  };

  // set current contact
  const setCurrent = (contact) => {
    dispatch({ type: SET_CURRENT, payload: contact });
  };

  // clear current contact
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // update contact
  const updateContact = (contact) => {
    dispatch({ type: UPDATE_CONTACT, payload: contact });
  };

  // filter contacts
  const filterContacts = (text) => {
    dispatch({ type: FILTER_CONTACTS, payload: text });
  };

  // clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        addContact,
        deleteContact,
        setCurrent,
        clearCurrent,
        updateContact,
        filterContacts,
        clearFilter,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
