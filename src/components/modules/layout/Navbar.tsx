import { Button } from '@chakra-ui/react';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";

export default function Navbar (props: any){
    const { username } = props;
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove("token")
        router.push("/auth/login")
        toast.success("Successfully logged out")
    }

    const rightSideComponents = () => {
        if (!username) {
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
                        {username}
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