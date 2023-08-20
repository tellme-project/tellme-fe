export interface PostProps {
    content: string | undefined;
    createdAt: string;
    from?: string | undefined;
    to?: string | undefined;
}

export interface CreatePostProps {
    username: string | undefined
}

export interface CreatePostForSpecificReceiverFormProps {
    username: string | undefined;
    receiver: string;
}