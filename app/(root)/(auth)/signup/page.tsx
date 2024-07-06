import SignUpForm from '@/components/auth_forms/signUpForm';
import GoogleLoginButton from '@/components/auth_forms/googleLoginButton';

const SignUp = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <SignUpForm />
      <GoogleLoginButton />
    </div>
  );
};

export default SignUp;
