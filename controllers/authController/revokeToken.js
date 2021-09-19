const isDevelopment = process.env.NODE_ENV === 'development';

const revokeToken = (res) => {
  res.cookie('authorization', 'revoked', {
    maxAge: 0,
    httpOnly: true,
    sameSite: isDevelopment ? 'Lax' : 'Strict',
    // secure: true  at first need to endable https
  });
};

module.exports = { revokeToken };
