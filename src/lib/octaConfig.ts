export const oktaConfig = {
    clientId: '0oad1wd1j84ARapQG5d7',
    issuer: 'https://dev-23225889.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
  };
  