export const storeToken = (serverRes: {
  data: { user: string; token: string; loans: [] };
}) => {
  let token = serverRes.data.token;
  const myExp = new Date(new Date().getTime() + 161 * 60 * 60);
  localStorage.setItem(
    "userValidation",
    JSON.stringify({
      username: serverRes.data.user,
      token,
      loans: serverRes.data.loans,
      expiration: myExp.toISOString(),
    })
  );
};

export const clearLocalStorage = () =>
  localStorage.removeItem("userValidation");
