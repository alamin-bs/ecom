import { Snackbar } from '@material-ui/core';
import React from 'react';

// import MuiAlert from '@mui/material/Alert';

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });
const Toast = ({ open, handleClose, type, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
      message={message}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    ></Snackbar>
  );
};

export default Toast;
