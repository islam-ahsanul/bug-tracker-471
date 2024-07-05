import SignUpForm from '@/components/auth_forms/signUpForm';

const SignUp = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <SignUpForm />
    </div>
  );
};

export default SignUp;