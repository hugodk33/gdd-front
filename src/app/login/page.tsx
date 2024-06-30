'use client'

import { Btn } from '@/components/template/btn';
import Image from 'next/image';
import { InputText, InputTextForms } from '@/components/template/input'
import axios from 'axios';
import logoh from '../../../logos/logo_soodermaria.png'
import { login } from '../../helpers/login'
import { useEffect, useState } from 'react';

interface Service {
  username?: string | undefined;
  password?: string | null;
}

const initialServiceData: Service = {
  username: '',
  password: '',
};

export default function Home() {
  const [dataForm, setDataForm] = useState<Service>(initialServiceData);
  const [modalMessage, setModalMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false)

  const searchService = async () => {
    try {
      const {
        username,
        password,
      } = dataForm;

      const clientResponse = await axios.post(
        'http://back.ongprograma.org/sessions:3333',
        {
          username,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },        
        }
      );
      if (clientResponse.status === 200) {
        console.log(clientResponse.data)
        localStorage.setItem('trotsk', clientResponse.data.token.token)
        localStorage.setItem('nekot', clientResponse.data.tokenEntry.token)
        localStorage.setItem('name', clientResponse.data.userToken.name)
        localStorage.setItem('user_id', clientResponse.data.userToken.id)
        window.location.href = '/atendimento'
      } else {
        setModalMessage('ALGO DEU ERRADO')
        setIsOpen(true)
      }
    } catch (error) {
      // console.error(error);
      // setIsOpen(true)
    }
  };

  const handleForm = (value: React.ChangeEvent<HTMLInputElement>) => {
    const index = value.target.id;
    let tempValue = value.target.value;
    let tempData = { ...dataForm };
    tempData = { ...dataForm, [index]: tempValue };
    setDataForm(tempData);
  };

  return (
    <main className="flex min-h-screen flex-col content-center justify-center align-center items-center h-full flex-wrap p-24">
      <Image src={logoh} alt="Logo" width={350} className='block mb-12 mt-6 mr-auto ml-auto'/>
      <div className='flex flex-col p-8 gap-4 columns-sm rounded w-full max-w-sm shadow-black-500/50 bg-white mr-auto ml-auto'>
        <InputTextForms id={'username'} label="Login" value={dataForm.username} onChange={(e) => handleForm(e)} />
        <span style={{ height: '5px', width: '100%' }} />
        <InputTextForms id={'password'} label="Senha" value={dataForm.password} onChange={(e) => handleForm(e)} />
        <span style={{ height: '5px', width: '100%' }} />
        <Btn onClick={() => searchService()}> ENTRAR </Btn>
      </div>
    </main>
  );
}