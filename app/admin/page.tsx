// app/admin/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import User from "@/lib/models/User";
import connectToDB from "@/lib/mongodb";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (status === "authenticated" && (session?.user as any)?.role === "admin") {
        try {
          await connectToDB();
          const usersData = await User.find({}).select("name email role").lean();
          const formattedUsers = usersData.map(user => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          }));
          setUsers(formattedUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
          // Handle error (e.g., show an error message)
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [status, session]);

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated" || (session?.user as any)?.role !== "admin") {
    redirect("/"); // Redirect to home or login
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="py-2 px-4 border">{user.name}</td>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
