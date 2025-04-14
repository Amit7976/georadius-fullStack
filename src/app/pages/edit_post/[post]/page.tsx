"use client";
import React, { useEffect, useState } from 'react'
import MainContent from './MainContent'
import useAuthVerification from '../../../hooks/useAuthVerification';
import { useParams } from 'next/navigation';

function page() {
  const params = useParams();
  const { isVerified, loading } = useAuthVerification();
  const [post, setPost] = useState(null);

  async function fetchPostById(postId: any) {
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
    } catch (err: any) {
      console.error("Error:", err.message);
      throw err;
    }
  }


  useEffect(() => {
    fetchPostById(params.post)
      .then(post => {
        console.log("Post found:", post);
        setPost(post);
      })
      .catch(err => {
        console.error("Access denied or error:", err.message);
      });
  }, []);



  if (loading) {
    return <p>Loading...</p>;
  }
  return isVerified ? (
    <>
      <div className="text-center p-10">
        <h1 className="text-2xl font-extrabold text-black">Edit News</h1>
      </div>
      <MainContent post={post} />
    </>
  ) : null;
}

export default page