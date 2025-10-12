'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function GoogleProvider({ children }: { children: React.ReactNode }) {
    return (
        <GoogleOAuthProvider clientId="925746768505-b4bs779ll0nodni160a5uifq0njpngtb.apps.googleusercontent.com">
            {children}
        </GoogleOAuthProvider>
    );
}