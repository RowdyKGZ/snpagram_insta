import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/querisAndMutation";
import { useParams } from "react-router-dom";
import { string } from "zod";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isPending: isLoadingPost } = useGetPostById(id || "");

  if (isLoadingPost) return <Loader />;

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="Add Image"
            width={36}
            height={36}
          />

          <h2 className="h3-bold md:h2-bold text-left w-full">Edit post</h2>
        </div>

        <PostForm action="Update" post={post} />
      </div>
    </div>
  );
};

export default EditPost;
