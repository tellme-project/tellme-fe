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
import { Button, IconButton, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useClipboard, useDisclosure } from "@chakra-ui/react";
import { AddIcon, CopyIcon, LinkIcon } from "@chakra-ui/icons";
import { CreatePostForm } from "@/components/modules/post/CreatePostForm";


export default function Home() {
  const token = Cookies.get('token');
  const [user, setUser] = useState<User>();
  const [fess, setFess] = useState<Post[]>();
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [url, setURL] = useState("");
  const { onCopy, value, setValue, hasCopied } = useClipboard("");

  const fetchUser = async () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const getUser = axios.get(`${process.env.NEXT_PUBLIC_HOST}/auth/profile`)

    await getUser
    .then((res) => {
      setUser({
        username: res.data.username,
        name: res.data.name
      })
      setURL(`${process.env.NEXT_PUBLIC_FE_HOST}/post/create/${user?.username}`)
      setValue(url)
    })
    .catch((err) => {
      toast.error(err)
    }) 
  }

  useEffect(() => {
    getContent()
  }, [])

  useEffect(() => {
    if(token) {
      fetchUser()
    }
  })

  const getContent = () => {
      axios.get(`${process.env.NEXT_PUBLIC_HOST}/posts/fess`)
      .then((res) => {
        setLoading(false)
        setFess(res.data)
      })
      .catch((err) => {console.log(err)})
  }

  const showGreetingsAndInboxButton = () => {
    if(user != undefined){
      return (
        <>
          <div className="my-4">
          <div className="text-center text-xl">Hello, <span className="font-bold">{user.name}</span>!</div>
          <div className="flex justify-center items-center w-screen mt-2">
            <div className="flex flex-row">
              <Button 
                colorScheme="teal"
                onClick={() => {router.push("/post/inbox")}}
                className="mr-2"
              >
                Inbox
              </Button>
              <Button
                colorScheme="teal"
                className="ml-2"
                onClick={onOpen}
              >
                Share Personal Message URL
              </Button>
            </div>
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Personal Message URL</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="mb-3 text-center">
              <InputGroup className="mb-2">
                <InputLeftElement pointerEvents='none'>
                  <LinkIcon color='gray.300' />
                </InputLeftElement>
                <Input 
                  value={url}
                  isReadOnly={true}
                />
              </InputGroup>
              <Button leftIcon={<CopyIcon />} colorScheme="teal" onClick={onCopy}>
                {hasCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
        </Modal>
        </>
      )
    }
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
    <Navbar/>
    <div className="flex">
      <div>
        {showGreetingsAndInboxButton()}
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
          onClick={() => {router.push("/post/create")}}
        />
      </div>
    </div>
    </>
  )
}
