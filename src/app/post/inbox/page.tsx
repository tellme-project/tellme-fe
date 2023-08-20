"use client"

import { User } from '@/components/models';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Cookies from "js-cookie";
import Navbar from '@/components/modules/layout/Navbar';
import { useRouter } from 'next/navigation';
import { Post } from '@/components/models/Post';
import { Spinner } from '@chakra-ui/react';
import { PostCard } from '@/components/modules/post/PostCard';

export default function Inbox (){
    const router = useRouter();
    const token = Cookies.get('token');
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);
    const [inbox, setInbox] = useState<Post[]>();

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
          router.push("/auth/login")
        } else{
          fetchUser();
          fetchInbox()
        }
      }, [])

    const fetchInbox = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        axios.get(`${process.env.NEXT_PUBLIC_HOST}/posts/to`)
        .then((res) => {
            setLoading(false)
            setInbox(res.data)
        })
        .catch((err) => console.log(err))
    }

    const showContent = () => {
        if (loading) {
          return (
            <div className="flex justify-center items-center w-screen h-[70vh]">
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='teal'
                size='xl'
              />
            </div>
          )
        } else {
          if (inbox?.length == 0) {
            return (
              <div className="text-center w-screen mt-10 text-gray-400">
                <div className="font-bold text-3xl">There are no posts :{'('}</div>
                <div className="text-lg">Be the first one to post here :D</div>
              </div>
            )
          } else {
            return (
              <div className="flex my-5 mx-10 flex-wrap content-start justify-between">
                {inbox?.map((post) => (
                  <PostCard
                    key={post.id} 
                    content={post.content}
                    createdAt={post.createdAt}
                    from={post.from}
                    to={post.to}
                  />
                ))}
              </div>
            )
          } 
        }
      }
      
    return(
        <>
            <title>Inbox</title>
            <Navbar />
            {showContent()}
        </>
    )

}