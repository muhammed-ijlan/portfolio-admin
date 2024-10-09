import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import React from 'react';
import axios from 'axios';

const Popup = (props) => {
  const updateStatus = () => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/news/status`, {
        id: props.item._id,
        status: !props.item.isBlocked,
      })
      .then((res) => {
        props.handleClose(true, res.data.message);
      })
      .catch((err) => {
        props.handleClose(
          false,
          err && err.response && err.response.data && err.response.data.message
            ? err.data.response.message
            : err.message
        );
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
              ? 'Are you sure you want to block the News ?'
              : 'Are you sure you want to unblock the News ? '}
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
