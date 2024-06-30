'use client'

import { MainCtnHorizontal } from '@/components/template/mainctn'
import SideMenu from '@/components/sections/sidemenu'
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import { FiAlertTriangle, FiEdit } from 'react-icons/fi';
import { BsClipboardData, BsClipboardMinus, BsFillTrashFill, BsPersonVcard, } from 'react-icons/bs';
import { BiMap } from 'react-icons/bi';
import { InputCalendarForm, InputSelect, InputTextForms } from '@/components/template/input';
import { Btn, BtnR, BtnRS } from '@/components/template/btn';
import { useEffect, useState } from 'react';
import { AiOutlineCalendar, AiOutlineClockCircle, AiOutlineCloseCircle, AiOutlineEye } from 'react-icons/ai';
import AuthCheck from '@/components/authCheck/authcheck';
import axios from 'axios';
import Pagination from '@/components/template/pagination';
import transformDateFormat from '@/helpers/dataFormat'
import { ModalCTN } from '@/components/template/modal';

interface Service {
  service_id?: number | string | null | undefined;
  title?: string | null;
  observations?: string | null;
  client?: number | string | null;
  user?: number | string | null;
  begun?: string | null;
  end?: string | null;
  type?: string | null;
  date?: string | null;
  name?: string | null;
  street?: string | null;
  complement?: string | null;
  CEP?: number | string | null;
  number?: number | string | null;
  tag?: string | null;
  neighborhood?: string | null;
  client_name?: string | null
}

const initialData: Service = {
  service_id: '',
  title: '',
  observations: '',
  client: '',
  user: '',
  begun: '',
  end: '',
  type: '',
  date: '',
  name: '',
  street: '',
  complement: '',
  CEP: '',
  number: '',
  tag: '',
  neighborhood: '',
  client_name: ''
};

interface Client {
  client_id?: number | null | undefined;
  name?: string | number | null;
  birthday?: Date | string | null;
  RG?: number | string | null;
  CPF?: number |  string | null;
  phone?: number |  string | null;
  email?: string | null;
  maritial_status?: string | null;
  address?: number |  string | null;
}

interface Philter {
  datebegun?: string | null;
  dateend?: string | null;
  tag?: string | null;
}

const type_options_tag = [
  { value: 'vermelho', label: 'vermelho' },
  { value: 'amarelo', label: 'amarelo' },
  { value: 'verde', label: 'verde' },
  { value: 'azul', label: 'azul' },
];

export default function ServiceSearch() {

  const [searchServiceValue, setSearchServiceValue] = useState<string>('')
  //const [modalIsOpen, setModalIsOpen] = useState(false)
  //const [modalType, setModalType] = useState('search')
  const [services, setServices] = useState<Service[]>([])
  const [serviceToDestroy, setServiceToDestroy] = useState<any>()
  const [clients, setClients] = useState<Client[]>([])
  const [philter, setPhilter] = useState<Philter>({})
  const [isSearch, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('');
  const [localStorageValues, setLocalStorageValues] = useState(false);
  const [localStorageUserId, setLocalStorageUserId] = useState('');

  const searchService = async () => {
    let token = localStorage.getItem('trotsk')
    try {
      const response = await axios.get(`http://back.ongprograma.org/services/all`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: 'bearer ' + token
        },
        params: {
          id: searchServiceValue,
          perPage: 10,
          page: currentPage,
          dateEnd: philter.datebegun,
          dateBegun: philter.dateend,
          tag: philter.tag
        }
      });
      setTotal(response.data.services.total)
      setServices(response.data.services.data)
      setIsSearch(true)
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
    setSearchServiceValue(tempValue)
  };

  const handleFormPhilterSelect = (value: string, id: string) => {
    const selectedValue = value.trim() !== '' ? value : null;
    let prevDataForm = { ...philter, [id]: selectedValue };
    setPhilter(prevDataForm);
  };

  const handleFormCalendar = (value: string, id: string) => {
    let prevDataForm = { ...philter, [id]: value };
    setPhilter(prevDataForm);
  };

  const destroyIt = async (id: number) => {
    let token = localStorage.getItem('trotsk');
    try {
      await axios.delete(`http://back.ongprograma.org/services/delete/${id}}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token // Make sure 'Bearer' is capitalized
        }
      });
      setServices((prevClients) => prevClients.filter((service) => service.service_id !== id));
    } catch (error) {
      console.error(error);
    }
    closeModal();
  };

  useEffect(() => {
    searchService();
  }, [currentPage])

  const reallyDestroyIt = async (id: number) => {
    setIsOpen(true)
    setModalMessage('voce deseja excluir esse atendimento?')
    setServiceToDestroy(id)
  }

  const closeModal = () => {
    setIsOpen(false)
  };

  useEffect(() => {
    if(!localStorageValues) {
      console.log('! localStorageValues')
      setLocalStorageValues(true)
      let id = localStorage.getItem('user_id')
      setLocalStorageUserId(id as string)
    }
  }, [localStorageValues])

  return (
    <section>
      <AuthCheck>
      <MainCtnHorizontal>
        <Header />
        <div id="container-principal" className='flex pt-5 w-full'>
          <SideMenu />
          <Content>
            <h1 className='text-3xl pb-4 pt-2'>Pesquisar Atendimento</h1>
            <hr className='mb-2 mt-4' />
            <span className="inline-block w-full sm:w-full md:w-12/12 pr-2 mb-3" >
              <InputTextForms label={'Digite sua busca'} value={searchServiceValue} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-12/12 pr-2 mb-3" >
              Filtrar por:
              <hr className='w-full' />
            </span>
            <span className="inline-block w-full sm:w-full md:w-4/12 pr-2" >
              <InputCalendarForm label={'Data inicial'} value={philter.tag} onChange={(e) => handleFormCalendar(e, 'dateend')} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-4/12 pr-2" >
              <InputCalendarForm label={'Data limite'} value={philter.tag} onChange={(e) => handleFormCalendar(e, 'dateend')} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-4/12 pr-2" >
              <InputSelect label={'Etiqueta'} value={philter.tag} onChange={(e) => handleFormPhilterSelect(e, 'tag')} options={type_options_tag} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-3/12 mt-4 mr-auto ml-auto" >
              <Btn onClick={() => searchService()}>Buscar</Btn>
            </span>
            {
              services.length > 0 ?
                <ul className="flex w-full flex-col p-4 gap-3 rounded mb-5 mt-5">
                  {services.map((a, b) => (
                    <li key={'key-bottom-' + b} className='listes flex flex-row text-4xl w-full border-b-2 border-gray-100 mb-7 pb-3'>
                      <span className='custom-svg w-1/12'>
                        <BsClipboardData />
                      </span>
                      <span className='w-10/12'>
                        <p className=' bold mb-3' style={{ fontSize: 26 }}>{a.title}</p>
                        <p className='gap-1 flex flex-row items-center  align-center items-center' style={{ fontSize: 26 }}>
                          <span className="text-blue-500 font-thin">
                            <BsPersonVcard style={{ fontSize: 20 }} />
                          </span>
                          {a.client_name?a.client_name:' --- '}
                        </p>
                        <p className='gap-1 flex flex-row items-center  align-center items-center' style={{ fontSize: 22 }}>
                          <span className="text-blue-500 font-thin">
                            <BiMap style={{ fontSize: 20 }} />
                          </span>
                          {a.street?a.street:' --- '}  
                          {' , '} 
                          {a.number?a.number:' --- ' }
                          { ' , ' }
                          { a.neighborhood?a.neighborhood:' --- ' }
                          { ' , ' }
                          { a.CEP?a.CEP:' --- '}
                        </p>
                        <p className='gap-1 flex flex-row items-center  align-center items-center' style={{ fontSize: 20 }}>
                          <span className="text-blue-500 font-thin">
                            <AiOutlineCalendar style={{ fontSize: 20 }} />
                          </span>
                          {transformDateFormat(a.date as string)}
                          <span className="text-blue-500 font-thin">
                            <AiOutlineClockCircle style={{ fontSize: 20 }} />
                          </span>
                          {a.begun?a.begun:' --- '}
                        </p>
                        {
                          a.tag === 'vermelho' ?
                            <span className='bg-red-500 rounded flex w-20 h-6' />
                            : a.tag === 'amarelo' ?
                              <span className='bg-yellow-500 rounded flex w-20 h-6' />
                              : a.tag === 'verde' ?
                                <span className='bg-green-500 rounded flex w-20 h-6' />
                                : null
                        }
                      </span>
                      <span className='liste-btns flex flex-col w-full gap-2 md:w-1/12'>
                        <BtnRS href={`/atendimento/despacho/${a.service_id}`}>
                          <AiOutlineEye style={{ fontSize: '24px', marginTop: '8px' }} />
                        </BtnRS>
                        <BtnRS href={`/atendimento/editar/${a.service_id}`}>
                          <FiEdit style={{ fontSize: '24px', marginTop: '8px' }} />
                        </BtnRS>
                        <BtnR onClick={() => reallyDestroyIt(a.service_id as number)}>
                          <BsFillTrashFill style={{ fontSize: '24px', marginTop: '8px' }} />
                        </BtnR>
                      </span>
                    </li>
                  ))}
                </ul>
                : (
                  <p className="text-lg">Nenhum atendimento encontrado.</p>
                )
            }
            {
              services.length > 0 ?
                <ul className="flex w-full flex-col p-4 gap-3 rounded mb-5 mt-5">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={(Math.ceil(total / 10))}
                    onPageChange={handlePageChange}
                  />
                </ul>
                : null
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
            <Btn onClick={() => destroyIt(serviceToDestroy)}>
              <BsFillTrashFill className="inline text-sm" />
              descartar
            </Btn>
        </span>
      </ModalCTN>
      </AuthCheck>
    </section>
  );
}