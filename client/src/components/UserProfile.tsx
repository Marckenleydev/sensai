'use client'

import { useCheckUser } from "@/app/hook/useCheckUser";
import { Loader2 } from "lucide-react";


export const UserProfile = () => {
  const { dbUser, loading, error } = useCheckUser();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!dbUser) {
    return <div>No user data</div>;
  }

  return (
    
    <div className="flex items-center gap-2">
     
     {/* <span className="text-sm font-medium">{dbUser.name}</span>*/}
    </div>
  );
};