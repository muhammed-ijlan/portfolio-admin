import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import React from 'react';
import axios from 'axios';

const Popup = (props) => {
  const updateStatus = () => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/admin/update`, {
        id: props.item._id,
        isBlocked: !props.item.isBlocked,
      })
      .then((res) => {
        props.handleClose(true, res.data.message);
      }) 
      .catch((err) => {
        props.handleClose(false, err.response.data.message);
      });
  };
  const open = true;
  return (
    <>
      <Dialog onClose={props.handleClose} open={open}>
        <DialogTitle>Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {!props.item.isBlocked
              ? 'Are you sure you want to block the Admin ?'
              : 'Are you sure you want to unblock the Admin ? '}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button onClick={updateStatus}>Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Popup;
