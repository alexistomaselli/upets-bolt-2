import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const DebugAuth: React.FC = () => {
  const { user, profile, roles, loading } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">🐛 Debug Auth</h4>
      <div className="space-y-1">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</p>
        <p><strong>Profile:</strong> {profile ? `${profile.first_name} ${profile.last_name}` : 'No cargado'}</p>
        <p><strong>Roles:</strong></p>
        {roles.length > 0 ? (
          <ul className="ml-2">
            {roles.map((role, i) => (
              <li key={i}>• {role.role_name} (nivel {role.role_level})</li>
            ))}
          </ul>
        ) : (
          <p className="ml-2 text-yellow-300">Sin roles cargados</p>
        )}
      </div>
    </div>
  );
};