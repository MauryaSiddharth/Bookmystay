import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../contexts/AppContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as apiClient from '../api-client';

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();

  const mutation = useMutation({
    mutationFn: apiClient.signIn,
    onSuccess: async () => {
      showToast({ message: "Sign in successful", type: "SUCCESS" });
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      navigate(location.state?.from?.pathname || '/');
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 flex flex-col gap-6"
      onSubmit={onSubmit}
    >
      <h2 className="text-3xl font-bold text-center">Sign In</h2>

      {/* Email */}
      <label className="flex flex-col">
        <span className="text-gray-700 text-sm font-medium mb-1">Email</span>
        <input
          type="email"
          className="border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          {...register("email", { required: "This field is required" })}
        />
        {errors.email && (
          <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
        )}
      </label>

      {/* Password */}
      <label className="flex flex-col">
        <span className="text-gray-700 text-sm font-medium mb-1">Password</span>
        <input
          type="password"
          className="border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          {...register("password", {
            required: "This field is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
        />
        {errors.password && (
          <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
        )}
      </label>

      {/* Footer with link and button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-sm">
          Not registered?{" "}
          <Link to="/register" className="underline text-blue-600 hover:text-blue-500 transition">
            Create an account here
          </Link>
        </span>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 font-bold rounded hover:bg-blue-500 transition"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default SignIn;