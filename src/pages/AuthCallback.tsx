;

import { useEffect, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CallbackContent() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setToken } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setToken(token);
            navigate('/');
        } else {
            // Handle error or missing token
            console.error('No token found in callback URL');
            navigate('/login');
        }
    }, [searchParams, setToken, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Authenticating...</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
