import SignUpForm from '@/components/auth_forms/signUpForm';
import GoogleLoginButton from '@/components/auth_forms/googleLoginButton';
import Link from 'next/link';

const SignUp = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] gap-4 py-4">
      <div className="flex flex-col items-center justify-center gap-4  w-[40%] 2xl:w-[30%]">
        <h1 className="font-extrabold text-3xl tracking-wide text-blue-800">
          Create Account
        </h1>
        <p className="text-sm">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold hover:underline text-blue-800"
          >
            Login
          </Link>
        </p>
        <SignUpForm />
        <GoogleLoginButton />
      </div>
    </div>
  );
};

export default SignUp;
