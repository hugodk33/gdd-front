'use client'
import { useEffect, useState } from 'react';
import { MainCtnHorizontal } from '@/components/template/mainctn'
import SideMenu from '@/components/sections/sidemenu'
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import { BsEye, BsTrash, BsHouse, BsClipboardCheck, BsClipboardData, BsClipboardMinus, BsPersonVcard, BsListOl } from 'react-icons/bs';
import { InputText, InputTextForms } from '@/components/template/input';
import { Btn, BtnOutline, BtnRS } from '@/components/template/btn';
import Pagination from '@/components/template/pagination';
import axios from 'axios';
import { FiEdit } from 'react-icons/fi';
import transformDateFormat from '@/helpers/dataFormat';
import { usePathname } from 'next/navigation'
import { AiOutlineCalendar, AiOutlineClockCircle, AiOutlineMail, AiOutlineOrderedList, AiOutlinePhone } from 'react-icons/ai';
import Link from 'next/link';
import { BiArrowBack, BiMap, BiSolidUserAccount } from 'react-icons/bi';
import AuthCheck from '@/components/authCheck/authcheck';

interface Service {
    service_id?: number | null | undefined;
    title?: string | null;
    observations?: string | null;
    client?: number | null;
    user?: number | null;
    begun?: string | null;
    end?: string | null;
    type?: string | null;
    date?: string | null | undefined;
}

const initialServiceData: Service = {
    service_id: null,
    title: '',
    observations: '',
    client: null,
    user: null,
    begun: '',
    end: '',
    type: null,
    date: ''
};

type Client = {
    client_id?: number | null;
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
    //const [searchClientValue, setSearchClientValue] = useState<string>('')
    const [client, setClient] = useState<Client[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const [, setTotal] = useState(0);

    const pathname = usePathname()
    const parts = pathname.split('/')
    const idx = parts[2]

    const HistoricSearch = async () => {
        let token = localStorage.getItem('trotsk')
        try {
            const response = await axios.get(`http://localhost/clients/search/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: 'bearer ' + token
                },
                params: {
                    id: idx,
                    perPage: 10,
                    page: 1,
                }
            });
            setServices(response.data.service)
            setClient([response.data.client.data[0]])
            setTotal(response.data.total)
        } catch (error) {
            console.error(error);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        HistoricSearch();
    }, [currentPage])

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
                                            <span className='flex w-full flex-col md:flex-row mt-5'>
                                                <span className='md:w-6/12 w-full p-2'>
                                                    <Link className='btn-p w-full items-center block text-white font-semibold  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2' href={`/beneficiado/editar/${a.client_id}`} style={{ maxWidth: 300 }}>
                                                        <FiEdit className="text-2xl mb-3" style={{ fontSize: 20, marginTop: 4, display: 'inline' }} />
                                                        EDITAR BENEFICIADO
                                                    </Link >
                                                </span>
                                                <span className='md:w-6/12 w-full p-2'>
                                                    <Link className='btn-p w-full items-center block text-white font-semibold  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2' href={`/beneficiado/historico/${a.client_id}`} style={{ maxWidth: 300 }}>
                                                        <BsEye className="text-2xl mb-3" style={{ fontSize: 20, marginTop: 4, display: 'inline' }} />
                                                        VER HISTÓRICO
                                                    </Link >
                                                </span>
                                            </span>
                                        </>
                                    ))
                                    : null
                            }

                        </Content>
                    </div>
                </MainCtnHorizontal>
            </AuthCheck>
        </section>
    );
}