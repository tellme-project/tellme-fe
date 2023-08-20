import { Button, Center, Checkbox, FormControl, FormLabel, Input, Radio, RadioGroup, Stack, Textarea } from "@chakra-ui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { CreatePostForSpecificReceiverFormProps } from "./interface"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie";
import React from "react"

export const CreatePostForSpecificReceiverForm: React.FC<CreatePostForSpecificReceiverFormProps> = ({
    username,
    receiver
}) => {
    const token = Cookies.get("token");
    const router = useRouter()
    const [anonymousSender, setAnonymousSender] = useState("true");
    const [content, setContent] = useState("")
    const [to, setTo] = useState("")

    const handleContentChange = (e: any) => {
        setContent(e.target.value)
    }
    const handleReceiverChange = (e: any) => {
        setTo(e.target.value)
    }

    const handleFormSubmit = async (e: any) => {
        e.preventDefault();
        const headers = {
            "Content-Type": "application/json",
        };
        const data = JSON.stringify({
            content: content,
            from: (anonymousSender == "true")? null: username,
            to: receiver
        })
        console.log(data)
        let postData;
        if (username == undefined) {
            postData = axios.post(`${process.env.NEXT_PUBLIC_HOST}/posts/anonymous`, data, { headers });
        } else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            postData = axios.post(`${process.env.NEXT_PUBLIC_HOST}/posts`, data, { headers });
        }
        toast.promise(postData, {
            loading: "Sending post...",
            success: "Post successfully sent",
            error: (err) => err.response.data.message
        })

        await postData
            .then((res) => {
                console.log("Success")
                router.push("/")
            })
            .catch((err) => {console.log(err.message)})
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <FormControl className="mb-3" isRequired>
                <FormLabel>Message</FormLabel>
                    <Textarea 
                        placeholder="Message"
                        id="content"
                        onChange={handleContentChange}
                    />
            </FormControl>
            <FormControl className='my-3'>
                <FormLabel>From</FormLabel>
                    <Input
                        value={(username == undefined)? '': username}
                        placeholder='Username'
                        id='from'
                        isReadOnly={(username == undefined)? false: true}
                        isDisabled={(username == undefined)? true: ((anonymousSender == "true")? true: false )}
                        className="mb-1"
                    />
                    <RadioGroup onChange={setAnonymousSender} value={anonymousSender} isDisabled={(username == undefined)? true: false}>
                        <Stack direction="row">
                            <Radio value="true">Send as Anonymous</Radio>
                            <Radio value="false">Send as Specific Sender</Radio>
                        </Stack>
                    </RadioGroup>
            </FormControl>
            <FormControl className='my-3'>
                <FormLabel>To</FormLabel>
                    <Input
                        value={receiver}
                        placeholder='Username'
                        id='to'
                        isReadOnly={true}
                        className="mb-1"
                        onChange={handleReceiverChange}
                    />
                    <RadioGroup value={"false"} isDisabled={true}>
                        <Stack direction='row'>
                            <Radio value="true">Send to All</Radio>
                            <Radio value="false">Send to Specific Receiver</Radio>
                        </Stack>
                    </RadioGroup>
            </FormControl>
            <Center className='mb-3'>
                <Button variant='solid' colorScheme="teal" type='submit'>
                    Send
                </Button>
            </Center>
        </form>
    )
}