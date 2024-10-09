// ----------------------------------------------------------------------
const accountData = JSON.parse(localStorage.getItem('profile'));
const account = {
  displayName: accountData? accountData?.fullname?.toUpperCase() :"ADMIN",
  email: accountData? accountData.email :"Email",
  photoURL:  "/static/mock-images/avatars/avatar2.png",
};

export default account;