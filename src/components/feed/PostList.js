import React from "react";
import Post from "./Post";

function PostList({ posts, onPostsUpdate }) {
  return (
    <div className="space-y-4 mt-6">
      {posts.map((post) => (
        <Post key={post.id} post={post} onUpdate={onPostsUpdate} />
      ))}
    </div>
  );
}

export default PostList;
