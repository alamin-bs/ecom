import './CartScreen.css';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import sendmail from 'sendmail';
// Components
import CartItem from '../components/CartItem';

// Actions
import { addToCart, removeFromCart } from '../redux/actions/cartActions';
import useLogin from '../utils/hooks/useLogin';
import {
  Card,
  Grid,
  TextField,
  Button,
  CardContent,
  CardHeader,
  CardActions,
} from '@material-ui/core';
import { Api } from '../utils/Api';
import Toast from '../components/Toast';
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  validatePhoneNumberLength,
} from 'libphonenumber-js';
const initValues = {
  name: '',
  email: '',
  number: null,
  address: '',
};
const nameMsg = 'Name Field can not be empty';
const emailMsg = 'Please Provide a valid e-mail';
const adrsMsg = 'Address Field can not be empty';
const numberMsg = 'Please Provide a valid number';
const errObj = {
  name: {
    error: false,
    text: '',
  },
  email: {
    error: false,
    text: '',
  },
  number: {
    error: false,
    text: '',
  },
  address: {
    error: false,
    text: '',
  },
};
const PaymentScreen = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(errObj);
  const [value, setValue] = useState(initValues);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const cart = useSelector((state) => state.cart);
  //console.log('cart ', cart);
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const handleValidation = () => {
    const { name, email, address, number } = value;
    if (!name)
      setError((prevState) => ({
        ...prevState,
        ['name']: { error: true, text: nameMsg },
      }));
    if (!validateEmail(email))
      setError((prevState) => ({
        ...prevState,
        ['email']: { error: true, text: emailMsg },
      }));
    if (!number || !isValidPhoneNumber(number, 'BD'))
      setError((prevState) => ({
        ...prevState,
        ['number']: { error: true, text: numberMsg },
      }));
    if (!address)
      setError((prevState) => ({
        ...prevState,
        ['address']: { error: true, text: adrsMsg },
      }));
  };
  const handlePurchase = async () => {
    const { name, email, address, number } = value;

    handleValidation();
    if (
      !name ||
      !validateEmail(email) ||
      !isValidPhoneNumber(number) ||
      !number
    )
      return;
    const { cartItems } = cart;
    const data = cartItems.map((item) => ({
      Name: item.name,
      Price: item.price,
      Quantity: item.qty,
    }));
    try {
      const response = await Api.postRequest('/api/user/send-mail', {
        name,
        email,
        data: data,
      });
      console.log('response ', response);
      if (response) setOpen(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.log('error ', error);
    }
  };

  const handleChange = (name, value) => {
    setError((prevState) => ({
      ...prevState,
      [name]: { error: false, text: '' },
    }));
    setValue((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <Grid
      container
      style={{
        width: '100%',
        padding: 10,
        background: '#ffffff',
        height: '100vh',
      }}
    >
      <Grid
        item
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card style={{ padding: 30 }}>
          <CardHeader title="Shipment" />
          <CardContent>
            <TextField
              type="text"
              label={'Name'}
              variant={'outlined'}
              style={{ width: '100%', margin: 5 }}
              required={true}
              error={error.name.error}
              helperText={error.name.text}
              value={value.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <TextField
              type="text"
              label={'Email'}
              variant={'outlined'}
              style={{ width: '100%', margin: 5 }}
              required={true}
              error={error.email.error}
              helperText={error.email.text}
              value={value.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            <TextField
              type="number"
              label="Phone Number"
              variant={'outlined'}
              style={{ width: '100%', margin: 5 }}
              error={error.number.error}
              helperText={error.number.text}
              value={value.number}
              onChange={(e) => handleChange('number', e.target.value)}
            />
            <TextField
              type="text"
              label="Address"
              variant={'outlined'}
              style={{ width: '100%', margin: 5 }}
              error={error.address.error}
              helperText={error.address.text}
              value={value.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </CardContent>
          <CardActions>
            <Button
              color="primary"
              variant="contained"
              style={{ display: 'flex', justifyContent: 'center' }}
              onClick={handlePurchase}
            >
              Make Purchase
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Toast
        open={open}
        handleClose={handleClose}
        message={'Order placed successfully'}
      />
    </Grid>
  );
};

export default PaymentScreen;
