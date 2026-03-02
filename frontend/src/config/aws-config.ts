// import { Amplify } from 'aws-amplify';

// // Check if Cognito is configured
// const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID || '';
// const userPoolClientId = import.meta.env.VITE_COGNITO_CLIENT_ID || '';
// const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN || '';

// const isCognitoConfigured = userPoolId && userPoolClientId && cognitoDomain;

// const awsConfig: any = {};

// // Only configure Cognito if credentials are provided
// if (isCognitoConfigured) {
//   awsConfig.Auth = {
//     Cognito: {
//       userPoolId: userPoolId,
//       userPoolClientId: userPoolClientId,
//       loginWith: {
//         oauth: {
//           domain: cognitoDomain,
//           scopes: ['openid', 'email', 'profile'],
//           redirectSignIn: [import.meta.env.VITE_REDIRECT_URI || window.location.origin + '/callback'],
//           redirectSignOut: [window.location.origin],
//           responseType: 'code',
//         },
//       },
//     },
//   };
  
//   Amplify.configure(awsConfig);
//   console.log('✅ AWS Cognito configured');
// } else {
//   console.warn('⚠️ AWS Cognito not configured - authentication disabled');
// }

// export default awsConfig;
// export { isCognitoConfigured };
