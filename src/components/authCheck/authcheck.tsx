'use client'
import React, { useEffect, useState } from 'react';
//import { useAuth } from '../context/AuthContext'; // Substitua pelo seu contexto de autenticação
import { usePathname } from 'next/navigation'
import axios from 'axios'
import { AiOutlineReload } from 'react-icons/ai'

export default function AuthCheck({
    children,
    auth
}: {
    children?: React.ReactNode,
    auth?: string
}) {

    const [isLoading, setIsLoading] = useState(true)
    const [isSession, setIsSession] = useState(false)

    const pathname = usePathname()
    const parts = pathname.split('/')
    const idx = parts[parts.length - 1]

    const searchService = async () => {
        try {
            const token = localStorage.getItem('nekot')
            const clientResponse = await axios.post(
                'http://localhost/sessions/check',
                {
                    token
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
            setIsSession(clientResponse.data)
            if (clientResponse.data) {
            } else {
                setIsLoading(false)
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        if (isLoading) {
            searchService()
        }
    }, [isLoading]);

    useEffect(() => {
        console.log(isSession)
    }, [isSession]);

    if (idx !== 'login') {
        if (isSession) {
            
            return children
        } else if (!isSession) {
            console.log('!isSession')
            if (!isLoading) {
                console.log('!isSession redirect')
                return window.location.href = '/login'
            } else {
                console.log('loading')
                return (
                    <div style={{
                        backgroundImage: 'linear-gradient(#dedede, white)',
                        height: '100vh'
                    }}>
                        <div id='load'>
                            <AiOutlineReload/>
                        </div>
                    </div>
                )
            }
        }
    } else if (idx === 'login') {
        return children
    }
}