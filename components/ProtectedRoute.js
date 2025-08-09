
"use client";

import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function ProtectedRoute(Component) {
  return function Protected(props) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      if (!loading) {
        setIsChecking(false);
        if (!user) {
          router.push('/login');
        }
      }
    }, [user, loading, router]);

    if (loading || isChecking) {
      return (
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    return user ? <Component {...props} /> : null;
  };
}

export default ProtectedRoute;