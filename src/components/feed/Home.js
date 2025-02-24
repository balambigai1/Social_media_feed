// components/Home.js
import React, { useState, useEffect } from "react";

import axios from "axios";
import CreatePost from "./Createpost";
import PostList from "./PostList";
import Header from "./Header";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8081/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  const handleNewPost = async (post) => {
    try {
      const token = localStorage.getItem("token");
      console.log("localStorage.getItem: " + localStorage.getItem("user"));
      console.log("token: " + token);
      await axios.post("http://localhost:8081/api/posts", post, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts(); // Refresh posts after creating new one
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      
      <Header />
      <div className="container mx-auto ">
        <CreatePost onNewPost={handleNewPost} />
        <PostList posts={posts} onPostsUpdate={fetchPosts} />
      </div>
    </>
  );
}

export default Home;
