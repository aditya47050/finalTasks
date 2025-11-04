import React from 'react';

const UserProfile = ({ user, name, email }) => {
  return (
    <section className="p-8 bg-gray-100 hidden">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-indigo-600 mb-4">User ID: {user.id}</h2>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
          <p className="text-gray-700 mb-6">{email}</p>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
