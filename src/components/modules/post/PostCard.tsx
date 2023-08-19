import { convertIso } from "@/components/utils/TimeConverter";
import { PostProps } from "./interface";

export const PostCard: React.FC<PostProps> = ({
    content,
    createdAt,
    from,
    to
}) => {
    if (from == null) {
        from = "Anonymous"
    }
    return (
        <div className="rounded-lg shadow-lg w-80 p-5 mx-3 mb-3 hover:scale-105 duration-300">
            <div className="font-bold text-md">{content}</div>
            <div className="text-xs my-1 text-gray-400">{convertIso(createdAt)}</div>
            <div className="text-gray-400 text-sm">Posted by <span className="font-bold">{from}</span></div>
        </div>
    )
}