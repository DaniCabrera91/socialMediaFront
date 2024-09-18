import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, reset } from "../../redux/posts/postsSlice";
import Post from './Post';

const PostList = () => {
  const { posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      await dispatch(getAll());
      dispatch(reset());
    };
    fetchPosts();
  }, [dispatch]);
  
  console.log("Posts in PostList:", posts); // Verifica si `imageUrl` está presente
  
  return (
    <>
      <h1>Lista de Posts</h1>
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          {posts.map((post, index) => (
            <Post key={post._id} post={post} index={index} />
          ))}
        </div>
      )}
    </>
  );
};

export default PostList;
