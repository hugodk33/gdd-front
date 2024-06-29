'use client'
import { useEffect, useState } from 'react';
import { MainCtnHorizontal } from '@/components/template/mainctn'
import SideMenu from '@/components/sections/sidemenu'
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import { BsEye, BsTrash, BsHouse, BsClipboardCheck, BsClipboardData, BsClipboardMinus, BsPersonVcard, BsFillTrashFill } from 'react-icons/bs';
import { InputText, InputTextForms } from '@/components/template/input';
import { Btn, BtnR, BtnRS } from '@/components/template/btn';
import Pagination from '@/components/template/pagination';
import axios from 'axios';
import { FiEdit } from 'react-icons/fi';
import transformDateFormat from '@/helpers/dataFormat';
import { usePathname } from 'next/navigation'
import { AiOutlineCalendar, AiOutlineClockCircle, AiOutlineEye, AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import AuthCheck from '@/components/authCheck/authcheck';
import { BiMap, BiSolidUserAccount } from 'react-icons/bi';
import Link from 'next/link';

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

type Client = {
  client_id?: number | string | null;
  name?: string | null;
  birthday?: string | null;
  RG?: number | null | string;
  CPF?: number | null | string;
  maritial_status?: string | number | null | undefined;
  email?: string | null;
  phone?: number | null | string;
  user?: number | string | null;
  genre?: string | null;
  family?: string | null;
  already?: string | null;
  welfare_state?: string | null;
  welfare_state_type?: string | null;
  street?: string | null;
  number?: string | null | string;
  neighborhood?: string | null;
  CEP?: string | null;
  mother_name?: string | null;
  reference?: string | null;
  complement?: string | null;
  state?: string | null;
  city?: string | null;
};

const initialClientData: Client = {
  name: '',
  birthday: '',
  RG: '',
  CPF: '',
  maritial_status: '',
  email: '',
  phone: '',
  user: '',
  genre: '',
  family: '',
  already: '',
  welfare_state: '',
  welfare_state_type: '',
  street: '',
  number: '',
  neighborhood: '',
  CEP: '',
  mother_name: '',
  reference: '',
  complement: '',
  state: '',
  city: ''
};

export default function clientSearch() {
  const [, setSearchClientValue] = useState<string>('')
  const [client, setClient] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('');
  const [serviceToDestroy, setServiceToDestroy] = useState<any>()

  const pathname = usePathname()
  const parts = pathname.split('/')
  const idx = parts[3]
  const HistoricSearch = async () => {
    let token = localStorage.getItem('trotsk')
    try {
      const response = await axios.get(`http://localhost/historics/search/`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: 'bearer ' + token
        },
        params: {
          historic_id: idx,
          perPage: 10,
          page: currentPage,
        }
      });
      setServices(response.data.service)
      setClient([response.data.client])
      setTotal(response.data.total)
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const handleForm = (value: React.ChangeEvent<HTMLInputElement>) => {
  //   let tempValue = value.target?.value;
  //   setIsSearch(false)
  //   setSearchClientValue(tempValue)
  // };

  useEffect(() => {
    HistoricSearch();
  }, [currentPage])

  const reallyDestroyIt = async (id: number) => {
    setIsOpen(true)
    setModalMessage('voce deseja excluir esse atendimento?')
    setServiceToDestroy(id)
  }

  return (
    <section>
      <AuthCheck>
        <MainCtnHorizontal>
          <Header />
          <div id="container-principal" className='flex pt-5 mb-5 w-full'>
            <SideMenu />
            <Content>
              {
                client.length > 0 ?
                  client.map((a, b) => (
                    <span key={'client-historic-bio' + b}>

                      <h1 className='text-2xl pb-2 pt-2 text-gray-500'>Histórico de Beneficiados</h1>
                      <h3 className='text-sm bold  pb-2 pt-2'>
                        <BsPersonVcard className='inline-block text-blue-500' /> Dados Pessoais
                      </h3>
                      <>
                        <span className='block text-xl w-full flexmax-w-full sm:w-full mt-4 mb-4'>
                          <h1 className='text-3xl mt-1 '>{a?.name}</h1>
                          <h1 className='block text-2xl bolder' style={{ fontSize: 18 }}>{a?.genre}</h1>
                          <span className='flex items-center gap-2 mt-1 mb-1' style={{ fontSize: 12, height: 25 }}>
                            <span className="text-blue-500 font-thin">
                              <BiSolidUserAccount style={{ fontSize: 20 }} />
                            </span>
                            <h1 className='block bold' style={{ fontSize: 19 }}>CPF: {a?.CPF} | </h1>
                            <h1 className='block semibold' style={{ fontSize: 19 }}>RG: {a?.RG}</h1>
                          </span>
                          <span className='flex items-center gap-2 mt-1 mb-1' style={{ fontSize: 12, height: 25 }}>
                            <span className="text-blue-500 font-thin">
                              <AiOutlinePhone style={{ fontSize: 20 }} />
                            </span>
                            <h1 className='block' style={{ fontSize: 19 }}>{a?.phone}</h1>
                          </span>
                          <span className='flex items-center gap-2 mt-1 mb-1' style={{ fontSize: 19, height: 25 }}>
                            <span className="text-blue-500 font-thin">
                              <AiOutlineMail style={{ fontSize: 20 }} />
                            </span>
                            <h1 className='block' style={{ fontSize: 19 }}>{a?.email}</h1>
                          </span>
                        </span>
                        <p className='flex w-full items-center gap-1' style={{ fontSize: 16, height: 45 }}>
                          <span className="text-blue-500 font-thin">
                            <BiMap style={{ fontSize: 20 }} />
                          </span>
                          {a.street ? a.street : ' --- '}
                          {' , '}
                          {a.number ? a.number : ' --- '}
                          {' , '}
                          {a.neighborhood ? a.neighborhood : ' --- '}
                          {' , '}
                          {a.CEP ? a.CEP : ' --- '}
                        </p>
                        <hr className='w-full mt-4 mb-4' />
                        <span className='flex flex-col w-full items-center gap-2 ' style={{ fontSize: 19 }}>
                          <span className="w-full text-blue-500 font-thin">
                            Situação familiar
                          </span>
                          <h1 className='flex w-full ' style={{ fontSize: 19 }}>{a?.family}</h1>
                        </span>
                        <hr className='w-full mt-4 mb-4' />
                        <span className='flex w-full flex-row'>
                          <span className='flex w-full flex-col md:w-4/12 gap-2 '>
                            <span className="text-blue-500 font-thin">
                              Já foi atendido?
                            </span>
                            <h1 className='flex w-full' style={{ fontSize: 19 }}>{a?.already}</h1>
                          </span>
                          <span className='flex flex-col w-full md:w-4/12 gap-2 '>
                            <span className="text-blue-500 font-thin">
                              Recebe auxílio?
                            </span>
                            <h1 className='block' style={{ fontSize: 19 }}>{a?.welfare_state}</h1>
                          </span>
                          <span className='flex flex-col w-full md:w-4/12 gap-2 '>
                            <span className="text-blue-500 font-thin">
                              Qual auxílio??
                            </span>
                            <h1 className='block' style={{ fontSize: 19 }}>{a?.welfare_state_type}</h1>
                          </span>
                        </span>
                      </>
                      <span className='flex w-full flex-col md:flex-row mt-5'>
                        <span className='md:w-6/12 w-full p-2'>
                          <Link className='btn-p w-full items-center block text-white font-semibold  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2' href={`/beneficiado/editar/${a.client_id}`} style={{ maxWidth: 300 }}>
                            <FiEdit className="text-2xl mb-3" style={{ fontSize: 20, marginTop: 4, display: 'inline' }} />
                            EDITAR BENEFICIADO
                          </Link >
                        </span>
                        <span className='md:w-6/12 w-full p-2'>
                          <Link className='btn-p w-full items-center block text-white font-semibold  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2' href={`/beneficiado/${a.client_id}`} style={{ maxWidth: 300 }}>
                            <BsEye className="text-2xl mb-3" style={{ fontSize: 20, marginTop: 4, display: 'inline' }} />
                            VER BENEFICIADO
                          </Link >
                        </span>
                      </span>
                    </span>
                  )) : null
              }
              <h1 className='text-md pb-2 pt-2 text-gray-500 mt-6'>histórico de atendimento:</h1>
              <hr className='mb-6 mt-2' />

              {

                services.length > 0 ?
                  <ul className="flex flex-col p-4 gap-3 rounded mb-10 mt-5">
                    {services.map((a, b) => (
                      <li key={'key-bottom-' + b} className='flex flex-row text-4xl w-full border-b-2 border-gray-100 mb-7 pb-3'>
                        <span className='custom-svg w-1/12'>
                          <BsClipboardData />
                        </span>
                        <span className='w-10/12'>
                          <p className=' bold mb-3' style={{ fontSize: 26 }}>{a.title}</p>
                          <p className='gap-1 flex flex-row items-center  align-center items-center' style={{ fontSize: 26 }}>
                            <span className="text-blue-500 font-thin">
                              <BsPersonVcard style={{ fontSize: 20 }} />
                            </span>
                            {a.client_name ? a.client_name : ' --- '}
                          </p>
                          <p className='gap-1 flex flex-row items-center  align-center items-center' style={{ fontSize: 22 }}>
                            <span className="text-blue-500 font-thin">
                              <BiMap style={{ fontSize: 20 }} />
                            </span>
                            {a.street ? a.street : ' --- '}
                            {' , '}
                            {a.number ? a.number : ' --- '}
                            {' , '}
                            {a.neighborhood ? a.neighborhood : ' --- '}
                            {' , '}
                            {a.CEP ? a.CEP : ' --- '}
                          </p>
                          <p className='gap-1 flex flex-row items-center  align-center items-center' style={{ fontSize: 20 }}>
                            <span className="text-blue-500 font-thin">
                              <AiOutlineCalendar style={{ fontSize: 20 }} />
                            </span>
                            {transformDateFormat(a.date as string)}
                            <span className="text-blue-500 font-thin">
                              <AiOutlineClockCircle style={{ fontSize: 20 }} />
                            </span>
                            {a.begun ? a.begun : ' --- '}
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
                        <span className='flex flex-col gap-2 w-1/12'>
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
                    <p>Nenhum atendimento encontrado.</p>
                  )

              }
              {
                services.length > 0 ?
                  <ul className="flex flex flex-col gap-3 rounded mb-5 mt-5">
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
      </AuthCheck>
    </section>
  );
}