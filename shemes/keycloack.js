// schemes/keycloak.js

import Keycloak from 'keycloak-js';
import Vue from 'vue'
import App from './pages/'

const keycloakConfig = {
  realm: 'spring-realm-dev',
  url: 'http://localhost:8080/realms/spring-realm-dev',
  clientId: 'app-marvell-api-rest',
  onload:'login-required'
  
};

const keycloak = Keycloak(keycloakConfig);

export default function ({ $auth }) {
  return new Promise((resolve, reject) => {
    keycloak
      .init({ onLoad: 'login-required' })
      .then((authenticated) => {
        if (authenticated) {
          $auth.setUser(keycloak.tokenParsed);
          resolve();
        } else {
          reject(new Error('No se pudo autenticar con Keycloak'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}