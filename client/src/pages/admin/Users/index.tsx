import { useQuery } from "@tanstack/react-query";
import { fetchAdminUsers } from "../../../services/adminService";

export default function AdminUsersPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => fetchAdminUsers(1, 50)
  });

  const users = response?.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-3xl text-accent-gold">Customers</h1>
      <p className="mt-2 text-text-secondary">Registered accounts on Bukhari Perfumes.</p>

      {isLoading ? (
        <p className="mt-8 text-text-secondary">Loading users…</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-bg-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.role.toLowerCase().replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {new Date(user.createdAt).toLocaleDateString()}
                    {user.isVerified ? " · Verified" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
