"use client";

import { useEffect } from "react";
import { signOutAction } from "@/lib/action/auth";

export default function AuthAutoSignOut() {
  useEffect(() => {
    const handleUnload = async () => {
      await signOutAction();
    };

    window.addEventListener("beforeunload", handleUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      
    };
  }, []);

  return null;
}
