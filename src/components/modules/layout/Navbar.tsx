import { User } from '@/components/models';
import { Button } from '@chakra-ui/react';
import axios from 'axios';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";

export default function Navbar (){
    const token = Cookies.get('token');
    const [user, setUser] = useState<User>();
    const router = useRouter();

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
      
    const handleLogout = () => {
        Cookies.remove("token")
        router.push("/auth/login")
        toast.success("Successfully logged out")
    }

    const rightSideComponents = () => {
        if (user == undefined) {
            return <>
                <li className='mx-2' onClick={() => {router.push("/auth/login")}}>
                    <Button colorScheme='teal'>Log In</Button>
                </li>
                <li className='ml-2' onClick={() => {router.push("/auth/register")}}>
                    <Button colorScheme='teal' variant='outline'>Register</Button>
                </li>
            </>
        } else {
            return <>
                <li className='my-2 mr-6'>
                    <div className='font-bold'>
                        {user.username}
                    </div>
                </li>
                <li className='ml-2' onClick={handleLogout}>
                    <Button colorScheme='red'>Log Out</Button>
                </li>
            </>
        }
    }

    return(
    <nav className="bg-white shadow-lg p-3">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="/" className="flex items-center">
                <span className="self-center text-3xl font-bold">Tellme</span>
            </a>
            <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul className="flex flex-row list-none">
                    {rightSideComponents()}
                </ul>
            </div>
        </div>
    </nav>
    )
}