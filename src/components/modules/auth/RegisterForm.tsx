import { Button, Center, FormControl, FormLabel, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'

export default function RegisterForm (){
    const router = useRouter();

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
      } = useForm()
    
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    async function onSubmit(values: any) {
        const data = JSON.stringify(values);
        const headers = {
            "Content-Type": "application/json",
          };
        const postRegister = axios.post(`${process.env.NEXT_PUBLIC_HOST}/auth/register`, data, { headers })

        toast.promise(postRegister, {
            loading: "Loading...",
            success: "Your account is successfully registered",
            error: (err) => err.response.data.message,
          })
        
        await postRegister
        .then((res) => {
            router.replace("/auth/login")
        })
        .catch((err) => {console.error(err)})
    }
    
    return(
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
                <FormLabel>Name</FormLabel>
                    <Input
                        placeholder='Name'
                        id='name'
                        {...register('name')}
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
            <Center className="mb-3">
                <Button variant='solid' colorScheme="teal" type='submit' isLoading={isSubmitting}>
                    Register
                </Button>
            </Center>
        </form>
    )

}