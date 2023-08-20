"use client"

import { User } from "@/components/models";
import Navbar from "@/components/modules/layout/Navbar";
import { CreatePostForSpecificReceiverForm } from "@/components/modules/post/CreatePostForSpecificReceiverForm";
import { CreatePostForm } from "@/components/modules/post/CreatePostForm";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function CreateSpecificReceiverPost ({ params }: { params: { username: string }}){
    const token = Cookies.get('token');
    const [user, setUser] = useState<User>();

    const fetchUser = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const getUser = axios.get(`${process.env.NEXT_PUBLIC_HOST}/auth/profile`)
    
        await getUser
        .then((res) => {
          setUser({
            username: res.data.username,
            name: res.data.name
          })
        })
        .catch((err) => {
          toast.error(err)
        }) 
      }
    
      useEffect(() => {
        if (!token) {
          setUser(undefined)
        } else{
          fetchUser();
        }
      }, [])

    return(
        <>
            <Navbar />
            <div className="text-3xl text-center font-bold my-5">Send Message to {params.username}</div>
            <div className="mx-5 mb-5 p-5">
                <CreatePostForSpecificReceiverForm username={user?.username} receiver={params.username} />
            </div>
        </>
    )

}