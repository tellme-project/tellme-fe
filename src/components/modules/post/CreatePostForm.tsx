import { Button, Center, Checkbox, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { CreatePostProps } from "./interface"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie";

export const CreatePostForm: React.FC<CreatePostProps> = ({
    username
}) => {
    const token = Cookies.get("token");
    const router = useRouter()
    const [anonymousSender, setAnonymousSender] = useState(false);
    const [anonymousReceiver, setAnonymousReceiver] = useState(false);
    const [content, setContent] = useState("")
    const [from, setFrom] = useState((username)? username: "")
    const [to, setTo] = useState("")

    const handleContentChange = (e: any) => {
        setContent(e.target.value)
    }
    const handleSenderChange = (e: any) => {
        setFrom(e.target.value)
    }
    const handleReceiverChange = (e: any) => {
        setTo(e.target.value)
    }

    const handleFormSubmit = async (e: any) => {
        e.preventDefault();
        if (to == "" && anonymousReceiver == false){
            toast.error("Enter the username of the receiver")
        } else {
            const headers = {
                "Content-Type": "application/json",
            };
            const data = JSON.stringify({
                content: content,
                from: (anonymousSender)? null: from,
                to: (anonymousReceiver)? null: to
            })
            let postData;
            if (username == undefined) {
                postData = axios.post('http://localhost:3001/posts/anonymous', data, { headers });
            } else {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                postData = axios.post('http://localhost:3001/posts', data, { headers });
            }
            toast.promise(postData, {
                loading: "Sending post...",
                success: "Post successfully sent",
                error: (err) => err.response.data.message
            })

            await postData
                .then((res) => {
                    console.log(res);
                    //todo: refresh page after filling modal router.push("")
                })
                .catch((err) => {console.log(err.message)})
        }
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
                        isDisabled={(username == undefined)? true: anonymousSender}
                        className="mb-1"
                        onChange={handleSenderChange}
                    />
                    <Checkbox
                        isChecked={(username == undefined)? true: anonymousSender}
                        isDisabled={(username == undefined)? true: false}
                        onChange={(e) => setAnonymousSender(e.target.checked)}
                    >
                        Send as Anonymous
                    </Checkbox>
            </FormControl>
            <FormControl className='my-3'>
                <FormLabel>To</FormLabel>
                    <Input
                        placeholder='Username'
                        id='to'
                        isDisabled={anonymousReceiver}
                        className="mb-1"
                        onChange={handleReceiverChange}
                    />
                    <Checkbox 
                        onChange={(e) => setAnonymousReceiver(e.target.checked)}
                    >
                        Send to All
                    </Checkbox>
            </FormControl>
            <Center className='mb-3'>
                <Button variant='solid' colorScheme="teal" type='submit'>
                    Send
                </Button>
            </Center>
        </form>
    )
}