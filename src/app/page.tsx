'use client'

import { Btn } from '@/components/template/btn';
import { InputText } from '@/components/template/input'
import axios from 'axios';

export default function Home() {

  const getteste = () => {
    try {
      const response = axios(`${process.env.BEK_URL}/sessions`, {
        method: 'POST',
        params: {    
          username:'victorus',
          password:'hugohugo'
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
    
      .then(function (response) {
  
      })
    
      .catch(function (error) {
        console.log(error);
      })
    
      .finally(function () {
        // always executed
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center h-full justify-between content-center flex-wrap p-24">
        <div className='flex flex-col p-8 gap-4 columns-sm rounded w-full max-w-sm shadow-black-500/50 bg-white'>
          <InputText label="Usuário" value={''}/>
          <span style={{height: '5px', width: '100%'}} />
          {/* <InputPassword label="Senha"/> */}
          <span style={{height: '5px', width: '100%'}} />
          <Btn onClick={() => getteste()}> ENTRAR </Btn>
        </div>
    </main>
  )
}