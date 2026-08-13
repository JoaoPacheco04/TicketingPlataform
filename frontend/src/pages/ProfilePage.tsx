import { User, Mail, Shield } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 max-w-md mx-auto">
        <div className="h-32 bg-zinc-900 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (isError || !profile) {
    return <p className="text-red-400 p-6">Failed to load profile.</p>;
  }

  const rows = [
    { icon: User, label: 'Full name', value: profile.fullName },
    { icon: Mail, label: 'Email', value: profile.email },
    { icon: Shield, label: 'Account type', value: profile.role },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-full bg-cyan-600/15 border border-cyan-600/30 flex items-center justify-center text-cyan-400 text-xl font-bold">
            {profile.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{profile.fullName}</h1>
            <p className="text-zinc-500 text-sm">{profile.role}</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="flex items-center gap-3 p-4">
                <Icon size={16} className="text-zinc-500" />
                <div>
                  <p className="text-zinc-500 text-xs">{row.label}</p>
                  <p className="text-white text-sm">{row.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;