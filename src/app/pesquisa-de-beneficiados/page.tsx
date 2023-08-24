'use client'
import { useEffect, useState } from 'react';
import { MainCtnHorizontal } from '@/components/template/mainctn'
import SideMenu from '@/components/sections/sidemenu'
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import { AiOutlineCalendar } from 'react-icons/ai'
import { InputTextForms } from '@/components/template/input';
import { Btn, BtnRS } from '@/components/template/btn';
import Pagination from '@/components/template/pagination';
import axios from 'axios';
import { FiEdit } from 'react-icons/fi';
import transformDateFormat from '@/helpers/dataFormat';

interface Client {
  client_id?: number | null | undefined;
  name?: string | null;
  birthday?: string | null;
  RG?: number | null;
  CPF?: number | null;
  phone?: number | null;
  email?: string | null;
  maritial_status?: string | null;
  address?: number | null;
}

export default function clientSearch() {
  const [searchClientValue, setSearchClientValue] = useState<string>('')
  //const [modalIsOpen, setModalIsOpen] = useState(false)
  //const [modalType, setModalType] = useState('search')
  const [clients, setClients] = useState<Client[]>([])
  const [ , setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const searchService = async () => {
    try {
      const response = await axios.get(`http://bequegddsooder-env.eba-fas23u33.sa-east-1.elasticbeanstalk.com/clients/search`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        params: {
          name: ' ',
          perPage: 10,
          page: 1,
        }
      });
      setClients(response.data.data)
      setIsSearch(true)
      setTotal(response.data.totalResults)
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleForm = (value: React.ChangeEvent<HTMLInputElement>) => {
    let tempValue = value.target?.value;
    setIsSearch(false)
    setSearchClientValue(tempValue)
  };

  useEffect(() => {
    searchService();
  }, [currentPage])

  return (
    <section>
      <MainCtnHorizontal>
        <Header />
        <div id="container-principal" className='flex pt-5 w-full'>
          <SideMenu />
          <Content>
            <h1 className='text-3xl pb-4 pt-2'>Pesquisar Famílias ou Beneficiados</h1>
            <hr className='mb-2 mt-4' />
            <span className="inline-block sm:w-full md:w-10/12 pr-2" >
              <InputTextForms label={'Digite sua busca'} value={searchClientValue} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block sm:w-full md:w-2/12 mt-2" >
              <Btn onClick={() => searchService()}>Buscar</Btn>
            </span>

            {
              clients.length > 0 ?
                <ul className="flex flex-col p-4 gap-3 rounded mb-5 mt-5">
                  {clients.map((a, b) => (
                    <li key={'key-bottom-' + b} className='flex flex-row items-center text-4xl w-full border-b-2 border-gray-100 mb-6 pb-4'>
                      <span className='w-10/12'>
                        <p className='text-2xl'>{a.name}</p>
                        <p className='flex items-center gap-1 uppercase' style={{fontSize: 16, height: 25}}>
                          <span className="text-blue-500 bold" style={{fontSize: 16}}>
                            ID
                          </span> 
                            {a.client_id} 
                          <span className="text-blue-500"> 
                            <AiOutlineCalendar/> 
                          </span> 
                          {transformDateFormat(a.birthday as string)}  
                        </p>
                        <p className='flex items-center gap-1 uppercase' style={{fontSize: 16, height: 25}}>
                          <span className="text-blue-500 bold" style={{fontSize: 16}}>
                            CPF
                          </span> 
                            {a.CPF} 
                          <span className="text-blue-500 bold" style={{fontSize: 16}}> 
                            RG
                          </span> 
                            {a.RG}
                        </p>
                      </span>
                      <span className='flex flex-row-reverse w-2/12'>
                        <BtnRS href={`/beneficiado/${a.client_id}`}>
                          <FiEdit style={{ fontSize: '24px', marginTop: '8px' }} />
                        </BtnRS>
                      </span>
                    </li>
                  ))}
                </ul>
                : (
                  <p>Nenhum atendimento encontrado.</p>
                )
            }
            {
              clients.length > 0 ?
                <ul className="flex flex flex-col p-4 gap-3 rounded mb-5 mt-5">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={total === 1 ? 1 : (Math.ceil(total / 10))}
                    onPageChange={handlePageChange}
                  />
                </ul>
                :null
            }

          </Content>
        </div>
      </MainCtnHorizontal>
    </section>
  );
}