"use client";
import React, { useEffect, useState } from 'react';
import MainContent from './MainContent';
import useAuthVerification from '../../../hooks/useAuthVerification';
import { useParams } from 'next/navigation';

function Page() {  // Renamed to uppercase "Page"
  const params = useParams();
  const { isVerified, loading } = useAuthVerification();
  const [post, setPost] = useState(null);  // Set type to 'any' or more specific type later

  // Updated fetchPostById to use string type for postId
  async function fetchPostById(postId: string) {  // Type postId as string
    try {
      const res = await fetch("/api/post/fetchById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch post");

      return data.post; // 🔥 Successfully got post
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error:", err.message);
      } else {
        console.error("Error:", err);
      }
      throw err;
    }
  }

  useEffect(() => {
    if (params.post) {
      fetchPostById(Array.isArray(params.post) ? params.post[0] : params.post)
        .then((post) => {
          console.log("Post found:", post);
          setPost(post);
        })
        .catch((err) => {
          console.error("Access denied or error:", err.message);
        });
    }
  }, [params.post]);  // Added params.post to the dependency array

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="loader"></div></div>;
  }

  return isVerified ? (
    <>
      <div className="text-center p-10">
        <h1 className="text-2xl font-extrabold text-black">Edit News</h1>
      </div>
      {post && <MainContent post={post} />}
    </>
  ) : null;
}

export default Page;  // Ensure correct export
