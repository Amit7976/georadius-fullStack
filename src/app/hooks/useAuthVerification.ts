"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const useAuthVerification = () => {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(true);
  const [loading, setLoading] = useState(isVerified);

  return { isVerified, loading };
};

export default useAuthVerification;
