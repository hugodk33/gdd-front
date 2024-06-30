"use client";
import { useState, useEffect, use } from 'react';
import { MainCtnHorizontal } from '@/components/template/mainctn'
import SideMenu from '@/components/sections//sidemenu'
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import BeneficiarysList from '@/components/sections/beneficiarysList';
import { Btn, BtnOutline, BtnR, BtnRS, BtnS } from '@/components/template/btn'
import { AiOutlineCloseCircle, AiOutlineForm, AiOutlineCalendar, AiOutlineClockCircle, AiFillSave, AiOutlineOrderedList } from 'react-icons/ai'
import { BsEye, BsHouse, BsPeople, BsPersonVcard, BsSearch } from 'react-icons/bs'
import axios from 'axios';
import { InputTextForms, InputTextArea, InputTimeForm, InputCalendarForm, InputSelect, InputTextFormsBig } from '@/components/template/input'
import { ModalCTN } from '@/components/template/modal';
import { FiAlertTriangle, FiEdit } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import transformDateFormat from '@/helpers/dataFormat';
import { BiArrowBack, BiMap, BiUserPlus } from 'react-icons/bi';
import Link from 'next/link';
import AuthCheck from '@/components/authCheck/authcheck';

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;


type DataForm = {
    service_id?: number | string | null;
    title?: string | null;
    observations?: string | null;
    begun?: string | null;
    end?: string | null;
    type?: string | number | null | undefined;
    user?: number | null;
    client?: number | null | undefined;
    date?: string | null;
    status?: string | null;
    tag?: string | null;
    order?: string | null;
};

const initialData: DataForm = {
    title: '',
    observations: '',
    begun: '',
    end: '',
    type: '',
    user: 1,
    client: null,
    date: formattedDate,
    status: '',
    tag: '',
    order: '',
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
    user: 1,
    genre: '',
    family: '',
    already: '',
    welfare_state: '',
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

const type_options = [
    { value: '', label: '' },
    { value: 'comum', label: 'comum' },
    { value: 'saúde', label: 'saúde' },
    { value: 'psicológico', label: 'psicológico' },
    { value: 'Multi-atendimentos', label: 'Multi-atendimentos' },
];

const type_options_tag = [
    { value: '', label: '' },
    { value: 'vermelho', label: 'vermelho' },
    { value: 'amarelo', label: 'amarelo' },
    { value: 'verde', label: 'verde' },
    { value: 'azul', label: 'azul' },
];

export default function Service() {

    const [dataForm, setDataForm] = useState<DataForm>(initialData)
    const [clientCPF, setClientCPF] = useState<Client>({})
    const [client, setClient] = useState<Client>({})
    const [message, setMessage] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isCPF, setIsCPF] = useState(false)
    const [loading, setLoading] = useState(true);
    const [modalMessage, setModalMessage] = useState('');
    const [fieldsUpdated, setFieldsUpdated] = useState(0);
    const [requisited, setRequisited] = useState(false)

    const pathname = usePathname();
    const parts = pathname.split('/');
    const idx = parts[3];

    const serviceEdit = async () => {
        let token = localStorage.getItem('trotsk')
        try {
            const {
                type,
                title,
                observations,
                client,
                user,
                begun,
                end,
                date,
                status,
                order,
                tag
            } = dataForm;

            const clientResponse = await axios.put(
                `http://back.ongprograma.org/services/edit/${idx}`,
                {
                    type,
                    title,
                    observations,
                    client,
                    user,
                    begun,
                    end,
                    date,
                    status,
                    order,
                    tag
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Authorization': 'bearer ' + token
                    },
                }
            );
            if (clientResponse.status === 201) {
                setFieldsUpdated(fieldsUpdated + 1); // Step 2
            } else if (clientResponse.status === 200) {
                setFieldsUpdated(fieldsUpdated + 1); // Step 2
                setModalMessage(clientResponse.data.message)
                setIsOpen(true)
            }
        } catch (error) {
            setModalMessage(error as string)
            setIsOpen(true)
        }
    };

    const searchService = async () => {
        let token = localStorage.getItem('trotsk')
        try {
            const response = await axios.get(`http://back.ongprograma.org/services/search/${idx}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: 'bearer ' + token
                }
            });
            setLoading(false)
            setDataForm(response.data.service)
            setClient(response.data.client)
            setFieldsUpdated(fieldsUpdated + 1)
        } catch (error) {
            console.error(error);
        }
    };

    const handleForm = (value: React.ChangeEvent<HTMLInputElement>) => {
        const index = value.target.id;
        let tempValue = value.target.value;
        let tempData = { ...dataForm };
        tempData = { ...tempData, [index]: tempValue };
        setDataForm(tempData);
    };

    const handleTimeInput = (event: React.ChangeEvent<HTMLInputElement>, idx: string) => {
        const value = event;
        if (value !== undefined) {
            let tempData = { ...dataForm };
            tempData = { ...tempData, [idx]: value };
            setDataForm(tempData);
        }
    };

    const handleFormCalendar = (value: string) => {
        let prevDataForm = { ...dataForm, date: value };
        setDataForm(prevDataForm);
    };


    const handleServiceClient = (vlw: any) => {
        let tempData = { ...dataForm };
        tempData = { ...tempData, client: vlw as number };
        setDataForm(tempData);
    };

    const handleFormSelect = (value: string, id: string) => {
        const selectedValue = value.trim() !== '' ? value : null;
        let prevDataForm = { ...dataForm, [id]: selectedValue };
        setDataForm(prevDataForm);
    };

    const closeModal = () => {
        setIsOpen(false)
        setIsCPF(false)
    };

    useEffect(() => {
        !requisited ?
            searchService()
            : null
    }, [requisited])

    useEffect(() => {
        !requisited ?
            searchService()
            : null
    }, [])

    useEffect(() => {
        console.log(dataForm)
    }, [dataForm])

    return (
        <section>
            <AuthCheck>
                <MainCtnHorizontal>
                    <Header />
                    <div id="container-principal" className='flex w-full pt-5'>
                        <SideMenu />
                        <Content>
                            <div className='w-full flex mb-3'>
                                <div className='w-full flex items-center' style={{ maxWidth: '150px' }}>
                                    <BtnRS href={`/atendimento/despacho/${dataForm?.service_id}`}>
                                        <BsEye style={{ fontSize: '24px', marginTop: '8px' }} />
                                    </BtnRS>
                                    ver despacho
                                </div>
                            </div>
                            <h1 className='text-3xl pb-4 pt-2'>Editar Atendimento</h1>
                            <h3 className='text-xl pb-2 pt-4'><AiOutlineForm id="beneficiado-nome" className="inline-block text-blue-500" /> dados de atendimento</h3>
                            <hr className='mb-2 mt-2 w-full' />
                            <span className="inline-block w-full sm:w-full md:w-8/12 pt-4 md:pr-1" >
                                <InputTextForms id={'title'} label="Assunto do atendimento" value={dataForm.title} onChange={(e) => handleForm(e)} key={fieldsUpdated} />
                            </span>
                            <span className="inline-block w-full sm:w-full md:w-4/12 md:pl-1" >
                                <InputSelect id={'type'} label="Tipo do atendimento" value={dataForm.type} onChange={(e) => handleFormSelect(e, 'type')} key={fieldsUpdated} options={type_options} />
                            </span>
                            <span className="inline-block w-full sm:w-full md:w-4/12 md:pr-1 " >
                                <InputTimeForm id={'begun'} label="Hora/Início" value={dataForm.begun} onChange={(e) => handleTimeInput(e, 'begun')} key={fieldsUpdated} />
                            </span>
                            <span className="inline-block w-full sm:w-full md:w-4/12 md:pr-1 " >
                                <InputCalendarForm id={'date'} label="Dia" value={dataForm.date} onChange={(e) => handleFormCalendar(e)} key={fieldsUpdated} />
                            </span>
                            <span className="inline-block w-full sm:w-full md:w-4/12 md:pl-1 ">
                                <InputSelect id={'tag'} label="Etiqueta" onChange={(e) => handleFormSelect(e, 'tag')} options={type_options_tag} value={dataForm.tag} />
                            </span>
                            <br /><br />
                            <span className="inline-block w-full sm:w-full md:w-full " >
                                <InputTextArea id={'observations'} label={'descrição do caso'} onChange={(e) => handleForm(e)} key={fieldsUpdated}>
                                    {dataForm.observations}
                                </InputTextArea>
                            </span>
                            <br /><br />
                            <span className="inline-block w-full sm:w-full md:w-full " >
                                <InputTextArea id={'order'} label={'pedido de doação'} onChange={(e) => handleForm(e)} key={fieldsUpdated}>
                                    {dataForm.order}
                                </InputTextArea>
                            </span>

                            <h3 className='text-xl w-full pb-2  mb-1'><BsPersonVcard id="beneficiado-nome" className="inline-block text-blue-500" /> Beneficiado Atual</h3>
                            <hr className="w-full mt-1 mb-3" />
                            <span className='w-10/12'>
                                {
                                    client ?
                                        <>
                                            <p className='text-2xl'>{client.name}</p>
                                            <p className='flex items-center gap-1 ' style={{ fontSize: 16, height: 25 }}>
                                                <span className="text-blue-500 bold" style={{ fontSize: 16 }}>
                                                    ID
                                                </span>
                                                {client.client_id}
                                                <span className="text-blue-500">
                                                    <AiOutlineCalendar />
                                                </span>
                                                {transformDateFormat(client.birthday as string)}
                                            </p>
                                            <p className='flex items-center gap-1 ' style={{ fontSize: 16, height: 25 }}>
                                                <span className="text-blue-500 font-thin">
                                                    <BiMap style={{ fontSize: 20 }} />
                                                </span>
                                                {client.street ? client.street : ' --- '}
                                                {' , '}
                                                {client.number ? client.number : ' --- '}
                                                {' , '}
                                                {client.neighborhood ? client.neighborhood : ' --- '}
                                                {' , '}
                                                {client.CEP ? client.CEP : ' --- '}
                                            </p>
                                            <p className='flex items-center gap-1 ' style={{ fontSize: 16, height: 25 }}>
                                                <span className="text-blue-500 bold" style={{ fontSize: 16 }}>
                                                    CPF
                                                </span>
                                                {client.CPF}
                                                <span className="text-blue-500 bold" style={{ fontSize: 16 }}>
                                                    RG
                                                </span>
                                                {client.RG}
                                            </p>
                                        </>
                                        : <h1 className='mt-6 mb-6 mr-auto ml-auto gray w-full uppercase text-center'>Nenhum cliente foi cadastrado nesse atendimento</h1>
                                }
                            </span>
                            <h3 className='text-xl pb-2 pt-2 mb-4'><BsPersonVcard id="beneficiado-nome" className="inline-block text-blue-500" /> Mudar beneficiado</h3>
                            <hr className="w-full" />
                            <BeneficiarysList benefeciarys={[]} value={(e) => handleServiceClient(e)} />
                            <span className="block mr-auto ml-auto sm:w-full md:w-6/12 md:pr-1 pt-4" >
                                <Btn onClick={() => serviceEdit()} ><AiFillSave className='inline-block' /> Editar</Btn>
                            </span>
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
                    </span>
                    {isCPF ?
                        <span className="flex flex-col items-center justify-items-center content-center pt-5">
                            <h1 className=" mb-3 text-md text-blue-500">RESULTADO PARA A BUSCA DE CPF</h1>
                            <hr className="w-full" />
                            <h1 className=" mb-3 text-lg">{clientCPF.name}</h1>
                            <p className='flex w-full items-center gap-1  mb-2' style={{ fontSize: 16, height: 45 }}>
                                <span className="text-blue-500 bold" style={{ fontSize: 18 }}>
                                    ID
                                </span>
                                <span className="bg-gray-100  rounded-md block w-full text-center mb-2" style={{ fontSize: 23 }} >
                                    {clientCPF.client_id}
                                </span>
                                <span className="text-blue-500">
                                    <AiOutlineCalendar style={{ fontSize: 18 }} />
                                </span>
                                <span className="bg-gray-100  rounded-md block w-full text-center mb-2" style={{ fontSize: 23 }} >
                                    {transformDateFormat(clientCPF.birthday as string)}
                                </span>
                            </p>
                            <p className='flex  w-full items-center gap-1  mb-3' style={{ fontSize: 16, height: 45 }}>
                                <span className="text-blue-500 bold" style={{ fontSize: 18 }}>
                                    CPF
                                </span>
                                <span className="bg-gray-100  rounded-md block w-full text-center mb-2" style={{ fontSize: 23 }} >
                                    {clientCPF.CPF}
                                </span>
                                <span className="text-blue-500 bold" style={{ fontSize: 18 }}>
                                    RG
                                </span>
                                <span className="bg-gray-100  rounded-md block w-full text-center mb-2" style={{ fontSize: 23 }} >
                                    {clientCPF.RG}
                                </span>
                            </p>
                            <p className='flex w-full items-center gap-1' style={{ fontSize: 16, height: 45 }}>
                                <span className="text-blue-500 font-thin">
                                    <BiMap style={{ fontSize: 20 }} />
                                </span>
                                {clientCPF.street ? clientCPF.street : ' --- '}
                                {' , '}
                                {clientCPF.number ? clientCPF.number : ' --- '}
                                {' , '}
                                {clientCPF.neighborhood ? clientCPF.neighborhood : ' --- '}
                                {' , '}
                                {clientCPF.CEP ? clientCPF.CEP : ' --- '}
                            </p>
                            <span className="flex flex-row content-center mt-4">
                                <span className='flex sm:w-full md:w-6/12 md:pl-1'>
                                    {/* <button onClick={() => { }} className="btn-p items-center flex rounded-md justify-center border-2 border-gray-500 text-gray  font-semibold  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-full">
                  <BiUserPlus style={{ fontSize: '24px' }} className='inline-block' />
                  INSERIR BENEFICIADO
                </button> */}
                                </span>
                                <span className='flex sm:w-full md:w-6/12 md:pl-1'>
                                    <Link className='btn-p w-full items-center block text-white font-semibold  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2' href={`/beneficiado/${clientCPF.client_id}`} style={{ maxWidth: 300 }}>
                                        <FiEdit className="text-2xl mb-3" style={{ fontSize: 20, marginTop: 4, display: 'inline' }} />
                                        VER BENEFICIADO
                                    </Link >
                                </span>
                            </span>
                        </span>
                        : null}
                </ModalCTN>
            </AuthCheck>
        </section>
    );
}