"use client"
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast/headless";
import { User } from "@/components/models";
import Navbar from "@/components/modules/layout/Navbar";
import { Post } from "@/components/models/Post";
import { PostCard } from "@/components/modules/post/PostCard";
import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { CreatePostForm } from "@/components/modules/post/CreatePostForm";


export default function Home() {
  const token = Cookies.get('token');
  const [user, setUser] = useState<User>();
  const [fess, setFess] = useState<Post[]>();
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure()

  const fetchUser = async () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const getUser = axios.get('http://localhost:3001/auth/profile')

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

  useEffect(() => {
    getContent()
  }, [])

  const getContent = () => {
      axios.get("http://localhost:3001/posts/fess")
      .then((res) => {
        setLoading(false)
        setFess(res.data)
      })
      .catch((err) => {console.log(err)})
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
      if (fess?.length == 0) {
        return (
          <div className="text-center w-screen mt-10 text-gray-400">
            <div className="font-bold text-3xl">There are no posts :{'('}</div>
            <div className="text-lg">Be the first one to post here :D</div>
          </div>
        )
      } else {
        return (
          <div className="flex my-5 mx-10 flex-wrap content-start justify-between">
            {fess?.map((post) => (
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
  
  return (
    <>
    <Navbar username={user?.username}/>
    <main className="flex">
      <div>
        {showContent()}
      </div>
      <div className='fixed bottom-0 w-full'>
        <IconButton
          isRound={true}
          variant='solid'
          colorScheme='teal'
          aria-label='Done'
          size='lg'
          icon={<AddIcon />}
          className="float-right mx-4 my-4"
          onClick={onOpen}
        />
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={4}>
            <CreatePostForm username={user?.username}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </main>
    </>
  )
}
