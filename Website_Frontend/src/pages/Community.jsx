import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa"; // Importing icon from react-icons
import { commdata } from "../utils/communitydata.js";

const Community = () => {
  const [posts, setPosts] = useState(commdata);

  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const newId = posts.length + 1; // Simple ID assignment
    setPosts([...posts, { id: newId, title: newPost.title, content: newPost.content, likes: 0 }]);
    setNewPost({ title: "", content: "" }); // Reset form fields
  };

  const handleLike = (postId) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)));
  };

  // Sort posts by likes
  const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes);

  return (
    <div className="community-section p-14 bg-gray-100 shadow-lg rounded-lg py-[5rem]">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Community Posts</h1>
      <PostForm newPost={newPost} setNewPost={setNewPost} onPostSubmit={handlePostSubmit} />
      <div className="post-feed">
        {sortedPosts.map((post) => (
          <Post key={post.id} post={post} onLike={handleLike} />
        ))}
      </div>
    </div>
  );
};

// Post Component
const Post = ({ post, onLike }) => {
  return (
    <div className="post mb-4 border border-green-300 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
      <h2 className="font-bold text-lg text-green-800">{post.title}</h2>
      <p className="mt-2 text-gray-700">{post.content}</p>
      <div className="flex items-center mt-4">
        <button onClick={() => onLike(post.id)} className="text-green-500 hover:text-green-600 flex items-center">
          <FaThumbsUp className="mr-1" /> {post.likes}
        </button>
      </div>
    </div>
  );
};

// PostForm Component
const PostForm = ({ newPost, setNewPost, onPostSubmit }) => {
  return (
    <form onSubmit={onPostSubmit} className="mb-6 bg-green-50 p-4 rounded-lg shadow">
      <input
        type="text"
        value={newPost.title}
        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        placeholder="Post Title"
        required
        className="border rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-green-300"
      />
      <textarea
        value={newPost.content}
        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        placeholder="Share your experience..."
        required
        className="border rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-green-300"
      ></textarea>
      <button
        type="submit"
        className="bg-green-500 text-white rounded p-2 hover:bg-green-600 transition-colors duration-200"
      >
        Post
      </button>
    </form>
  );
};

export default Community;
