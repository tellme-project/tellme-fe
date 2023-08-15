"use client"

import LoginForm from "@/components/modules/auth/LoginForm"
import { Center, Link, Text } from "@chakra-ui/react"

export default function login (){
    return(
        <main>
            <div className="flex items-center justify-center h-screen bg-slate-200">
                <div className="rounded-lg flex flex-col py-8 px-20 items-center shadow-lg bg-white">
                    <div className="text-3xl font-bold mb-3">Log In</div>
                    <LoginForm />
                    <Center>
                        <Text>
                            No Account?{' '}
                            <Link color='teal' href='/auth/register'>
                                Register Now
                            </Link>
                        </Text>
                    </Center>
                </div> 
            </div>
        </main>
    )
}