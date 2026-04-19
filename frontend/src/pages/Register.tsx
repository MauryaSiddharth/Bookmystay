
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form'
import * as apiClient from '../api-client'
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
export type  RegisterFormData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {showToast} = useAppContext();
  const { register, watch, handleSubmit ,formState:{errors}} = useForm<RegisterFormData>();

  const mutation = useMutation({
     mutationFn: apiClient.register,
     onSuccess:async()=>{
      showToast({message:"Registration Success!",type:"SUCCESS"});
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] })
      navigate('/') ; 
     },
     onError:(error:Error)=>{
         showToast({message:error.message,type:"ERROR"});
         
     }
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    
     mutation.mutate(data);
  });

  return (
    <form
      className='flex flex-col gap-5 max-w-md mx-auto p-4'
      onSubmit={onSubmit}
    >
      <h2 className='text-3xl font-bold'>Create an Account</h2>

      <div className='flex flex-col md:flex-row gap-5'>
        <label className='text-gray-700 text-sm font-bold flex-1'>
          First Name
          <input
            className='border rounded w-full py-2 px-3 font-normal focus:outline-none focus:ring-2 focus:ring-blue-400'
            {...register("firstname", { required: "This field is required" })}
          />
          {errors.firstname &&(
            <span className='text-red-500 '>{errors.firstname.message}</span>
          )}
        </label>

        <label className='text-gray-700 text-sm font-bold flex-1'>
          Last Name
          <input
            className='border rounded w-full py-2 px-3 font-normal focus:outline-none focus:ring-2 focus:ring-blue-400'
            {...register("lastname", { required: "This field is required" })}
          />
           {errors.lastname &&(
            <span className='text-red-500 '>{errors.lastname.message}</span>
          )}
        </label>
      </div>

      <label className='text-gray-700 text-sm font-bold flex-1'>
        Email
        <input
          type='email'
          className='border rounded w-full py-2 px-3 font-normal focus:outline-none focus:ring-2 focus:ring-blue-400'
          {...register("email", { required: "This field is required" })}
        />
         {errors.email &&(
            <span className='text-red-500 '>{errors.email.message}</span>
          )}
      </label>

      <label className='text-gray-700 text-sm font-bold flex-1'>
        Password
        <input
          type='password'
          className='border rounded w-full py-2 px-3 font-normal focus:outline-none focus:ring-2 focus:ring-blue-400'
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters"
            }
          })}
        />
         {errors.password &&(
            <span className='text-red-500 '>{errors.password.message}</span>
          )}
      </label>

      <label className='text-gray-700 text-sm font-bold flex-1'>
        Confirm Password
        <input
          type='password'
          className='border rounded w-full py-2 px-3 font-normal focus:outline-none focus:ring-2 focus:ring-blue-400'
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) return "This field is required";
              if (watch("password") !== val) return "Passwords do not match";
            }
          })}
        />

         {errors.confirmPassword &&(
            <span className='text-red-500 '>{errors.confirmPassword.message}</span>
          )}
      </label>
       
       {/*  removed span */}
      <button
        type='submit'
        className='bg-blue-600 text-white p-2 font-bold rounded hover:bg-blue-500 transition'
      >
        Create Account
      </button>
    </form>
  )
}

export default Register