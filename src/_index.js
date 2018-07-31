const Elm = require('./Main');

const elm = Elm.Main.fullscreen({
  accessToken: localStorage.getItem('access_token') ? localStorage.getItem('access_token') : '',
  idToken: localStorage.getItem('id_token') ? localStorage.getItem('id_token') : '',
  expiresAt: localStorage.getItem('expires_at') ? localStorage.getItem('expires_at') : ''
});

elm.ports.login.subscribe(() => {
  webAuth.authorize();
});

elm.ports.logout.subscribe(() => {
  logout();
  elm.ports.updateAuth.send({
    accessToken: '',
    idToken: '',
    expiresAt: ''
  });
});

//
// Auth0
//

const webAuth = new auth0.WebAuth({
  domain: 'scoredy.auth0.com',
  clientID: 'jsm2JYWhpBMS2ZqeVbm0SudJcCRLCH-i',
  responseType: 'token id_token',
  audience: 'https://scoredy.auth0.com/userinfo',
  scope: 'openid',
  redirectUri: window.location.href
});

function handleAuthentication() {
  webAuth.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      setSession(authResult);

      elm.ports.updateAuth.send({
        accessToken: localStorage.getItem('access_token') ? localStorage.getItem('access_token') : '',
        idToken: localStorage.getItem('id_token') ? localStorage.getItem('id_token') : '',
        expiresAt: localStorage.getItem('expires_at') ? localStorage.getItem('expires_at') : ''
      });
    } else if (err) {
      console.log(err);
      alert(
        'Error: ' + err.error + '. Check the console for further details.'
      );
    }
  });
}

function setSession(authResult) {
  var expiresAt = JSON.stringify(
    authResult.expiresIn * 1000 + new Date().getTime()
  );
  localStorage.setItem('access_token', authResult.accessToken);
  localStorage.setItem('id_token', authResult.idToken);
  localStorage.setItem('expires_at', expiresAt);
}

function logout() {
  // TODO: Expand the logout (call Auth0 and expire token?)
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('expires_at');
}

handleAuthentication();

if (module.hot) {
  module.hot.dispose(() => {
    window.location.reload();
  });
}