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
import { AiOutlineCalendar, AiOutlineClockCircle, AiOutlineOrderedList } from 'react-icons/ai';

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

const initialClientData: Client = {
    client_id: null,
    name: null,
    birthday: null,
    RG: null,
    CPF: null,
    phone: null,
    email: null,
    maritial_status: null,
    address: null
}

export default function clientSearch() {
    //const [searchClientValue, setSearchClientValue] = useState<string>('')
    const [client, setClient] = useState<Client[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const [ , setTotal] = useState(0);

    const pathname = usePathname()
    const parts = pathname.split('/')
    const idx = parts[2]
    const HistoricSearch = async () => {

        try {
            const response = await axios.get(`${ process.env.DB_USER }/historics/search/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                params: {
                    historic_id: idx,
                    perPage: 10,
                    page: 1,
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

    useEffect(() => {
        HistoricSearch();
    }, [currentPage])

    return (
        <section>
            <MainCtnHorizontal>
                <Header />
                <div id="container-principal" className='flex pt-5 mb-5 w-full'>
                    <SideMenu />
                    <Content>
                        {
                            client.length > 0 ?
                                client.map((a, b) => (
                                    <span key={'client-historic-bio' + b}>
                                        <h1 className='text-md pb-2 pt-2 text-gray-500'>Histórico de Beneficiados</h1>
                                        <h1 className='text-2xl pb-2 pt-2' style={{ fontWeight: 600 }}>{a.name}</h1>
                                        <hr className='mb-2 mt-4' />
                                        <h3 className='text-sm bold uppercase pb-2 pt-2'>
                                            <BsPersonVcard className='inline-block text-blue-500' /> Dados Pessoais
                                        </h3>
                                        <p className='flex items-center gap-1 uppercase mb-2' style={{ fontSize: 16, height: 45 }}>
                                            <span className="text-blue-500 bold" style={{ fontSize: 18 }}>
                                                ID
                                            </span>
                                            <span className="bg-gray-100 uppercase rounded-md block w-full text-center mt-4 mb-2" style={{ fontSize: 23 }} >
                                                {a.client_id}
                                            </span>
                                            <span className="text-blue-500">
                                                <AiOutlineCalendar style={{ fontSize: 18 }} />
                                            </span>
                                            <span className="bg-gray-100 uppercase rounded-md block w-full text-center mt-4 mb-2" style={{ fontSize: 23 }} >
                                                {transformDateFormat(a.birthday as string)}
                                            </span>
                                        </p>
                                        <p className='flex items-center gap-1 uppercase mb-3' style={{ fontSize: 16, height: 45 }}>
                                            <span className="text-blue-500 bold" style={{ fontSize: 18 }}>
                                                CPF
                                            </span>
                                            <span className="bg-gray-100 uppercase rounded-md block w-full text-center mt-4 mb-2" style={{ fontSize: 23 }} >
                                                {a.CPF}
                                            </span>
                                            <span className="text-blue-500 bold" style={{ fontSize: 18 }}>
                                                RG
                                            </span>
                                            <span className="bg-gray-100 uppercase rounded-md block w-full text-center mt-4 mb-2" style={{ fontSize: 23 }} >
                                                {a.RG}
                                            </span>
                                        </p>
                                    </span>
                                )) : null
                        }
                        <span className='flex w-full md:pr-1 mt-2 pt-4'>
                            <span className='flex sm:w-full md:w-6/12 md:pr-1 mt-2 pt-4'>
                                <Btn
                                    onClick={() => {}}
                                >
                                    <FiEdit style={{ fontSize: '24px' }}  className='inline-block' /> Editar
                                </Btn>
                            </span>
                            <span className='flex sm:w-full md:w-6/12 md:pl-1 mt-2 pt-4'>
                                <BtnOutline>
                                    <AiOutlineOrderedList style={{ fontSize: '24px' }}  className='inline-block' /> Histórico          
                                </BtnOutline>
                            </span>
                        </span>
                    </Content>
                </div>
            </MainCtnHorizontal>
        </section>
    );
}