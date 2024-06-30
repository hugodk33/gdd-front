'use client'
import { useEffect, useState } from 'react';
import { MainCtnHorizontal } from '@/components/template/mainctn'
import SideMenu from '@/components/sections/sidemenu'
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import { AiOutlineCalendar, AiOutlineCloseCircle, AiOutlineEye } from 'react-icons/ai'
import { InputTextForms } from '@/components/template/input';
import { Btn, BtnR, BtnRS } from '@/components/template/btn';
import Pagination from '@/components/template/pagination';
import axios from 'axios';
import { FiAlertTriangle, FiEdit } from 'react-icons/fi';
import transformDateFormat from '@/helpers/dataFormat';
import { BiMap } from 'react-icons/bi';
import { BsFillTrashFill } from 'react-icons/bs';
import { ModalCTN } from '@/components/template/modal';
import AuthCheck from '@/components/authCheck/authcheck';

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
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  CEP?: string | null;
}

export default function clientSearch() {
  const [searchClientValue, setSearchClientValue] = useState<string>('')
  //const [modalIsOpen, setModalIsOpen] = useState(false)
  //const [modalType, setModalType] = useState('search')
  const [clients, setClients] = useState<Client[]>([])
  const [clientsToDestroy, setClientsToDestroy] = useState<any>()
  const [ , setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('');

  const searchService = async () => {
    let token = localStorage.getItem('trotsk')
    try {
      const response = await axios.get(`http://back.ongprograma.org/clients/search`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: 'bearer ' + token
        },
        params: {
          id: searchClientValue,
          perPage: 10,
          page: currentPage,
        }
      });
      setClients(response.data.client.data)
      setIsSearch(true)
      setTotal(response.data.client.total)
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


  useEffect(() => {
    console.log(searchClientValue);
  }, [searchClientValue])

  const reallyDestroyIt = async (id: number) => {
    setIsOpen(true)
    setModalMessage('voce deseja excluir esse beneficiado?')
    setClientsToDestroy(id)
  }

  const destroyIt = async (id: number) => {
    let token = localStorage.getItem('trotsk');
    try {
      await axios.delete(`http://back.ongprograma.org/clients/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token // Make sure 'Bearer' is capitalized
        }
      });
      setClients((prevClients) => prevClients.filter((client) => client.client_id !== id));
    } catch (error) {
      console.error(error);
    }
  
    closeModal();
  };
  

  const closeModal = () => {
    setIsOpen(false)
  };
  
  return (
    <section>
      <AuthCheck>
      <MainCtnHorizontal>
        <Header />
        <div id="container-principal" className='flex pt-5 w-full'>
          <SideMenu />
          <Content>
            <h1 className='text-3xl pb-4 pt-2'>Pesquisar Beneficiado</h1>
            <hr className='mb-2 mt-4' />
            <span className="inline-block w-full sm:w-full md:w-10/12 pr-2" >
              <InputTextForms label={'Digite sua busca'} value={searchClientValue} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-2/12 mt-2" >
              <Btn onClick={() => searchService()}>Buscar</Btn>
            </span>

            {
              clients.length > 0 ?
                <ul className="flex flex-col p-4 gap-3 rounded mb-5 mt-5">
                  {clients.map((a, b) => (
                    <li key={'key-bottom-' + b} className='listes flex flex-row items-center text-4xl w-full border-b-2 border-gray-100 mb-6 pb-4'>
                      <span className='w-10/12'>
                        <p className='text-2xl'>{a.name}</p>
                        <p className='flex items-center gap-1 ' style={{fontSize: 16, height: 25}}>
                          <span className="text-blue-500 bold" style={{fontSize: 16}}>
                            ID
                          </span> 
                            {a.client_id?a.client_id:' --- '} 
                          <span className="text-blue-500"> 
                            <AiOutlineCalendar/> 
                          </span> 
                          {a.birthday?transformDateFormat(a.birthday as string):' --- '}  
                        </p>
                        <p className='flex items-center gap-1 ' style={{fontSize: 16, height: 25}}>
                          <span className="text-blue-500 font-thin">
                            <BiMap style={{fontSize: 20}}/>
                          </span> 
                          {a.street?a.street:' --- '}  
                          {' , '} 
                          {a.number?a.number:' --- ' }
                          { ' , ' }
                          { a.neighborhood?a.neighborhood:' --- ' }
                          { ' , ' }
                          { a.CEP?a.CEP:' --- '} 
                        </p>
                        <p className='flex items-center gap-1 ' style={{fontSize: 16, height: 25}}>
                          <span className="text-blue-500 bold" style={{fontSize: 16}}>
                            CPF
                          </span> 
                            {a.CPF?a.CPF:' --- '} 
                          <span className="text-blue-500 bold" style={{fontSize: 16}}> 
                            RG
                          </span> 
                            {a.RG?a.RG:' --- '}
                        </p>
                      </span>
                      <span className='liste-btns w-full flex flex-col gap-2 md:w-2/12' style={{marginTop: '10px'}}>
                        <BtnRS href={`/beneficiado/${a.client_id}`}>
                            <AiOutlineEye style={{ fontSize: '24px', marginTop: '8px' }} />
                          </BtnRS>
                          <BtnRS href={`/beneficiado/editar/${a.client_id}`}>
                            <FiEdit style={{ fontSize: '24px', marginTop: '8px' }} />
                          </BtnRS>
                          <BtnR onClick={() => reallyDestroyIt(a.client_id as number)}>
                            <BsFillTrashFill   style={{ fontSize: '24px', marginTop: '8px' }} />
                          </BtnR>
                      </span>
                    </li>
                  ))}
                </ul>
                : (
                  <p>Nenhum beneficiado encontrado.</p>
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
      <ModalCTN isOpen={isOpen}>
        <span className="absolute" style={{ right: 5, top: 10 }}>
          <BtnR onClick={() => closeModal()}><AiOutlineCloseCircle style={{ fontSize: '24px', marginTop: '8px' }} /></BtnR>
        </span>
        <span className="flex flex-col items-center justify-items-center content-center pt-20">
          <FiAlertTriangle className="text-2xl mb-3" />
          <h1 className=" mb-3 text-lg">{modalMessage}</h1>
            <Btn onClick={() => destroyIt(clientsToDestroy)}>
              <BsFillTrashFill className="inline text-sm" />
              descartar
            </Btn>
        </span>
      </ModalCTN>
      </AuthCheck>
    </section>
  );
}