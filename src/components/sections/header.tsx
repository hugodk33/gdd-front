"use client";
import React, { useState, useEffect } from 'react';
import logob from '../../../logos/logo_soodermaria - HORIZ.png'
import Image from 'next/image'
import { AiOutlineKey } from 'react-icons/ai'
// import axios from 'axios'
// import { usePathname } from 'next/navigation'


export default function Header() {

    const [localStorageValues, setLocalStorageValues] = useState(false);
    const [localStorageUserId, setLocalStorageUserId] = useState('');

    // const pathname = usePathname();
    // const parts = pathname.split('/');
    // const idx = parts[1];

    const handleLogOff = () => {
        localStorage.setItem('name', '')
        localStorage.setItem('nekot', '')
        window.location.href = '/login'
    };

    useEffect(() => {
        if(!localStorageValues) {
          setLocalStorageValues(true)
          let id = localStorage.getItem('name')
          setLocalStorageUserId(id as string)
        }
      }, [localStorageValues])

    return (
        <nav className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 w-screen border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <span className={'flex content-center justify-center ml-8 mr-auto ml-auto'}>
                    <Image src={logob} alt='teste' width={170} />
                </span>
            </div>
            <div className="w-full items-center content-center justify-center flex flex-row bg-gray-100 text-sm mr-2">
                <AiOutlineKey />
                {
                    localStorageUserId + " | "
                }
                <button className={' border-2 border-gray-300 text-gray-300 px-1 m-1'} onClick={() => handleLogOff()}>
                    log off
                </button>
            </div>
        </nav>
    )
}

//style={{display: authString || idx==='login'?'block':'none'}}