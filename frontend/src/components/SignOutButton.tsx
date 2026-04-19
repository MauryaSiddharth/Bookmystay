import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import * as apiClient from '../api-client'
import { useAppContext } from '../contexts/AppContext'
import { useNavigate } from 'react-router-dom'
const SignOutButton = () => {
    const queryClient = useQueryClient();
    const {showToast} = useAppContext();
   
    const mutation = useMutation({
        mutationFn:apiClient.signOut,
        onSuccess: async ()=>{
        //   await queryClient.invalidateQueries("validateToken");
            await queryClient.invalidateQueries({ queryKey: ["validateToken"] })
            showToast({message:"Signout Successfully",type:"SUCCESS"})

        },
        onError:(error:Error)=>{
  showToast({message:error.message,type:"ERROR"})}
    })

    const handleClick =()=>{
        mutation.mutate();
    }
    
  return (
<button
  onClick={handleClick}
  className="text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition"
>
  Sign Out
</button>
  )
}

export default SignOutButton