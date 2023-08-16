"use client"
import RegisterForm from "@/components/modules/auth/RegisterForm"
import { Center, Link, Text } from "@chakra-ui/react"

export default function register (){
    return(
        <main>
            <div className="flex items-center justify-center h-screen bg-slate-200">
                <div className="rounded-lg flex flex-col py-8 px-20 items-center shadow-lg bg-white">
                    <div className="text-3xl font-bold mb-3">Register</div>
                    <RegisterForm />
                    <Center>
                        <Text>
                            Have an Account?{' '}
                            <Link color='teal' href='/auth/login'>
                                Login Now
                            </Link>
                        </Text>
                    </Center>
                </div> 
            </div>
        </main>
    )

}