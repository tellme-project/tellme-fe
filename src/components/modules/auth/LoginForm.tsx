import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Center, Input } from '@chakra-ui/react';
import Cookies from "js-cookie";
import {
    FormControl,
    FormLabel,
    InputRightElement,
    InputGroup,
    Button
  } from '@chakra-ui/react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useRouter } from 'next/navigation';

export default function LoginForm (){
    const router = useRouter()
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
      } = useForm()
        
    async function onSubmit(values: any) {
        let response: any
        const data = JSON.stringify(values);
        const headers = {
            "Content-Type": "application/json",
          };
        const postLogin = axios.post(`http://localhost:3001/auth/login`, data, { headers })

        toast.promise(postLogin, {
            loading: "Loading...",
            success: "Welcome back! You have successfully logged in",
            error: (err) => err.response.data.message,
          })
        
        await postLogin
        .then((res) => {
            response = res
            Cookies.set("token", res.data.token)
            router.push("/")
        })
        .catch((err) => {console.error(err)})
    }

    useEffect(() => {
        if (Cookies.get('token')) {
            router.push("/")
        }
    }, [])
        
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl className='my-2' isRequired>
                <FormLabel>Username</FormLabel>
                    <Input
                        placeholder='Username'
                        id='username'
                        {...register('username')}
                    />
            </FormControl>
            <FormControl className='my-2' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size='md'>
                    <Input
                        id='password'
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
                        placeholder='Password'
                        {...register('password')}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Center className='mb-3'>
                <Button variant='solid' colorScheme="teal" type='submit' isLoading={isSubmitting}>
                    Login
                </Button>
            </Center>
        </form>
    )
}