// import React from 'react';
// import LoginForm from '@/components/auth_forms/loginForm';
// import GoogleLoginButton from '@/components/auth_forms/googleLoginButton';

// const Login = () => {
//   return (
//     <div className="flex flex-col items-center justify-center h-[500px]">
//       <LoginForm />
//       <GoogleLoginButton />
//     </div>
//   );
// };

// export default Login;

import React from 'react';
import LoginForm from '@/components/auth_forms/loginForm';
import GoogleLoginButton from '@/components/auth_forms/googleLoginButton';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[500px]">
      <LoginForm />
      <GoogleLoginButton />
    </div>
  );
};

export default Login;