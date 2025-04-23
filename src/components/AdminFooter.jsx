import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} JobBoard Admin. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default AdminFooter;