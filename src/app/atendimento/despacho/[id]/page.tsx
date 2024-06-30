'use client'
import { useEffect, useState } from 'react';
import { HiOutlineDocument } from 'react-icons/hi';
import { BsEye, BsPersonVcard } from 'react-icons/bs'
import { AiFillEdit, AiFillSave, AiOutlineCalendar, AiOutlineClockCircle, AiOutlineCloseCircle, AiOutlineMail, AiOutlinePhone, AiOutlinePrinter } from 'react-icons/ai';
import { MainCtnHorizontal } from '@/components/template/mainctn';
import SideMenu from '@/components/sections/sidemenu';
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import { InputCalendarForm, InputSelect, InputTextArea, InputTextForms, InputTimeForm } from '@/components/template/input';
import { Btn, BtnR, BtnRS, BtnS } from '@/components/template/btn';
import { FiAlertTriangle, FiEdit } from 'react-icons/fi';
import { usePathname } from 'next/navigation'
import axios from 'axios';
import transformDateFormat from '@/helpers/dataFormat';
import { ModalCTN } from '@/components/template/modal';
import { BiMap, BiSolidUserAccount, BiArrowBack } from 'react-icons/bi';
import logoh from '../../../../../logos/logo_soodermaria.png'
import Image from 'next/image';
import AuthCheck from '@/components/authCheck/authcheck';
import Link from 'next/link';

const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`;

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
    welfare_state_type: string | null;
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
    city: '',
    welfare_state_type: ''
};

type DataForm = {
    service: string | null;
    type: string | null;
    title: string | null;
    observations: string | null;
    client: number | null;
    dispatch_status: string | null;
    checkout: string | null;
    itens_group: number | null;
    user: number | number | null | undefined;
    begun: string | null;
    end: string | null;
    date: Date | string | null;
    dispatch_observations: string | null;
    order: string | null;
};

interface Service {
    service_id?: number | null | undefined | string;
    title?: string | null;
    observations?: string | null;
    client?: number | null | string;
    user?: number | null | string;
    user_dispatch?: number | null | string;
    begun?: string | null;
    end?: string | null;
    type?: string | null;
    date?: string | null;
    name?: string | null;
    street?: string | null;
    complement?: string | null;
    CEP?: number | null | string;
    number?: number | null | string;
    tag?: string | null;
    dispatch_observations?: string | null;
    order?: string | null;
    status?: string | null;
    checkout?: string | null;
    dispatch_type?: string | null;
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
    status: '',
    dispatch_observations: '',
    checkout: '',
    dispatch_type: ''
};


interface Dispatch {
    status?: string | null;
    dispatch_observations?: string | null;
    checkout?: string | null;
    dispatch_type?: string | null;
    user_dispatch?: string | null,
}

const initialDispatch: Dispatch = {
    status: '',
    dispatch_observations: '',
    checkout: '',
    dispatch_type: '',
    user_dispatch: '',
};

const type_options = [
    { value: '', label: '' },
    { value: 'maratona do Amor', label: 'maratona do Amor' },
    { value: 'missão', label: 'missão' },
    { value: 'cesta básica', label: 'cesta básica' },
    { value: 'outros', label: 'outros' }
];

const type_options_status = [
    { value: '', label: '' },
    { value: 'pendente', label: 'pendente' },
    { value: 'finalizado', label: 'finalizado' },
    { value: 'negado', label: 'negado' }
];


export default function ClientEdtForm() {

    const pathname = usePathname();
    const parts = pathname.split('/');
    const idx = parseInt(parts[3], 10);

    const [dataForm, setDataForm] = useState<Service>(initialData);
    const [dispatchDataForm, setDispatchDataForm] = useState<Dispatch>(initialDispatch);
    const [dataClient, setDataClient] = useState<Client>();
    const [loading, setLoading] = useState(true);
    const [modalMessage, setModalMessage] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [fieldsUpdated, setFieldsUpdated] = useState(0);
    const [userName, setUserName] = useState('')


    const serviceDispatch = async () => {
        try {
            const {
                status,
                dispatch_observations,
                checkout,
                dispatch_type,
                user_dispatch
            } = dispatchDataForm;
            let token = localStorage.getItem('trotsk')
            let user_id = localStorage.getItem('user_id')
            const clientResponse = await axios.put(

                `http://back.ongprograma.org/services/dispatch/${idx}`,
                {
                    status,
                    dispatch_observations,
                    checkout,
                    dispatch_type,
                    user_dispatch: user_id
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: 'bearer ' + token
                    },
                }
            );
            if (clientResponse.status === 201) {
                setFieldsUpdated(fieldsUpdated + 1); // Step 2
            } else if (clientResponse.status === 200) {
                setFieldsUpdated(fieldsUpdated + 1); // Step 2
                setModalMessage(clientResponse.data.message)
                setIsOpen(true)
                searchService()
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
                    'Authorization': "bearer " + token
                }
            });
            setLoading(false)
            setDataForm(response.data.service)
            setDataClient(response.data.client)
        } catch (error) {
            console.error(error);
        }
    };

    const handleForm = (value: React.ChangeEvent<HTMLInputElement>) => {
        const index = value.target.id;
        let tempValue = value.target.value;
        let tempData = { ...dispatchDataForm };
        tempData = { ...dispatchDataForm, [index]: tempValue };
        setDispatchDataForm(tempData);
    };

    const handleFormSelect = (value: string, id: string) => {
        const selectedValue = value.trim() !== '' ? value : null;
        let prevDataForm = { ...dispatchDataForm, [id]: selectedValue };
        setDispatchDataForm(prevDataForm);
    };

    const handleFormCalendar = (value: string) => {
        let prevDataForm = { ...dispatchDataForm, checkout: value };
        setDispatchDataForm(prevDataForm);
    };

    const handleAddressValue = (selectedValue: number) => {
        let prevDataForm = { ...dispatchDataForm, address: selectedValue };
        setDispatchDataForm(prevDataForm);
    };

    useEffect(() => {
        if (loading) {
            searchService()
            let user_name = localStorage.getItem('name')
            setUserName(user_name as string)
        }
    }, [loading])

    const printContent = () => {
        const printDiv = document.getElementById('print');
        if (printDiv) {
            const originalContents = document.body.innerHTML;
            const printContents = printDiv.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
        }
    };

    return (
        <section>
            {/* IMPRESSÃO!!! */}

            <div id='print' className='absolute overflow-hidden' style={{ height: 1, width: 1 }}>

                <Image src={logoh} alt='teste' width={130} className='mr-auto ml-auto' />
                <span className='block text-xl w-full flexmax-w-full sm:w-full mt-4 mb-4'>
                    <h1 className='text-3xl mt-1 '>{dataClient?.name}</h1>
                    <h1 className='block text-2xl bolder' style={{ fontSize: 14 }}>{dataClient?.genre}</h1>
                    <span className='flex items-center gap-2 mt-1 mb-1' style={{ fontSize: 12, height: 25 }}>
                        <span className="text-blue-500 font-thin">
                            <BiSolidUserAccount style={{ fontSize: 15 }} />
                        </span>
                        <h1 className='block bold' style={{ fontSize: 12 }}>CPF: {dataClient?.CPF} | </h1>
                        <h1 className='block semibold' style={{ fontSize: 12 }}>RG: {dataClient?.RG}</h1>
                    </span>
                    <span className='flex items-center gap-2 mt-1 mb-1' style={{ fontSize: 12, height: 25 }}>
                        <span className="text-blue-500 font-thin">
                            <AiOutlinePhone style={{ fontSize: 15 }} />
                        </span>
                        <h1 className='block' style={{ fontSize: 12 }}>{dataClient?.phone}</h1>
                    </span>
                    <span className='flex items-center gap-2 mt-1 mb-1' style={{ fontSize: 19, height: 25 }}>
                        <span className="text-blue-500 font-thin">
                            <AiOutlineMail style={{ fontSize: 15 }} />
                        </span>
                        <h1 className='block' style={{ fontSize: 12 }}>{dataClient?.email}</h1>
                    </span>
                </span>
                <span className='block text-sm w-full flex flex-row max-w-full sm:w-full mt-1'>
                    <BsPersonVcard className='inline-block text-blue-500' style={{ color: 'rgb(59 130 246)', marginTop: 3, marginRight: 6 }} /> Atendimento
                </span>
                <span className='flex flex-row gap-2 mt-3 pt-2 mb-1' style={{ fontSize: 19 }}>
                    <AiOutlineCalendar style={{ color: 'rgb(59 130 246)', marginTop: 3 }} />
                    <b>{transformDateFormat(dataForm.date as string)}</b>
                    <AiOutlineClockCircle style={{ color: 'rgb(59 130 246)', marginTop: 3 }} />
                    <b>{dataForm.begun}</b>
                </span>
                <span className='block text-xl pt-4 mb-4 border border-gray-200 border-2  w-full nline-block max-w-full sm:w-full p-2'>
                    <span className='flex text-blue-400 flex-row gap-2 mt-1 mb-1' style={{ fontSize: 12 }}>
                        DESCRIÇÃO DO CASO
                    </span>
                    <h1 className='block' style={{ fontSize: 19 }}>{dataForm.observations}</h1>
                </span>
                <span className='block text-xl border border-gray-200 border-2 w-full nline-block max-w-full sm:w-full p-2'>
                    <span className='flex text-blue-400 flex-row gap-2 mt-1 mb-1' style={{ fontSize: 12 }}>
                        PEDIDO DE DOAÇÃO
                    </span>
                    {dataForm.order}
                </span>
                <span className='flex flex-row w-full absolute' style={{ bottom: 5 }} >
                    <span className='flex flex-row mt-3 w-4/12 items-center' style={{ flexDirection: 'column' }}>
                        <hr className='w-full border-2' />
                        <span className='flex' style={{ fontSize: 12 }}>
                            {userName}
                        </span>
                    </span>
                    <span className='flex flex-row mt-3 w-4/12' >
                        <br />
                    </span>
                    <span className='flex flex-row mt-3 w-4/12 items-center' style={{ flexDirection: 'column' }}>
                        <hr className='w-full border-2' />
                        <span className='flex' style={{ fontSize: 12 }}>
                            {dataClient?.name}
                        </span>
                    </span>
                </span>
            </div>
            <AuthCheck>
                <MainCtnHorizontal>
                    <Header />
                    <div id="container-principal" className='flex pt-5 w-full'>
                        <SideMenu />
                        <Content>
                            {/* <h1 className='text-xl pb-4 pt-4 text-gray-500'>Atendimento:</h1> */}
                            {
                                !loading ?
                                    <>
                                        <div>
                                            <div className='w-full flex items-center mb-4 gap-4' style={{ maxWidth: '220px' }}>
                                                <BtnRS href={`/atendimento/editar/${dataForm?.service_id}`}>
                                                    <AiFillEdit style={{ fontSize: '24px', marginTop: '8px' }} />
                                                </BtnRS>
                                                editar atendimento
                                            </div>
                                            <h1 className='text-2xl pb-2 pt-2' style={{ fontWeight: 600 }}>{dataForm.title}</h1>
                                            <span className='block text-sm w-full flex flex-row max-w-full sm:w-full mt-1'>
                                                <BsPersonVcard className='inline-block text-blue-500' style={{ color: 'rgb(59 130 246)', marginTop: 3, marginRight: 6 }} /> Beneficiado Atendido
                                            </span>
                                            <span className='block text-xl w-full flexmax-w-full sm:w-full mt-4 mb-4'>
                                                <h1 className='text-3xl mt-1 '>{dataClient?.name}</h1>
                                                <h1 className='block text-2xl bolder' style={{ fontSize: 18 }}>{dataClient?.genre}</h1>
                                                <span className='flex items-center gap-2 mt-1 mb-1' style={{ fontSize: 12, height: 25 }}>
                                                    <span className="text-blue-500 font-thin">
                                                        <BiSolidUserAccount style={{ fontSize: 20 }} />
                                                    </span>
                                                    <h1 className='block bold' style={{ fontSize: 19 }}>CPF: {dataClient?.CPF} | </h1>
                                                    <h1 className='block semibold' style={{ fontSize: 19 }}>RG: {dataClient?.RG}</h1>
                                                </span>
                                                <span className='flex items-center gap-2 mt-1 mb-1' style={{ fontSize: 12, height: 25 }}>
                                                    <span className="text-blue-500 font-thin">
                                                        <AiOutlinePhone style={{ fontSize: 20 }} />
                                                    </span>
                                                    <h1 className='block' style={{ fontSize: 19 }}>{dataClient?.phone}</h1>
                                                </span>
                                                <span className='flex items-center gap-2 mt-1 mb-1' style={{ fontSize: 19, height: 25 }}>
                                                    <span className="text-blue-500 font-thin">
                                                        <AiOutlineMail style={{ fontSize: 20 }} />
                                                    </span>
                                                    <h1 className='block' style={{ fontSize: 19 }}>{dataClient?.email}</h1>
                                                </span>
                                            </span>
                                            <hr className='w-full mt-4 mb-4' />
                                            <span className='flex flex-col w-full items-center gap-2 ' style={{ fontSize: 19 }}>
                                                <span className="w-full text-blue-500 font-thin">
                                                    Situação familiar
                                                </span>
                                                <h1 className='flex w-full ' style={{ fontSize: 19 }}>{dataClient?.family}</h1>
                                            </span>
                                            <hr className='w-full mt-4 mb-4' />
                                            <span className='flex w-full flex-row'>
                                                <span className='flex w-full flex-col md:w-4/12 gap-2 '>
                                                    <span className="text-blue-500 font-thin">
                                                        Já foi atendido?
                                                    </span>
                                                    <h1 className='flex w-full' style={{ fontSize: 19 }}>{dataClient?.already}</h1>
                                                </span>
                                                <span className='flex flex-col w-full md:w-4/12 gap-2 '>
                                                    <span className="text-blue-500 font-thin">
                                                        Recebe auxílio?
                                                    </span>
                                                    <h1 className='block' style={{ fontSize: 19 }}>{dataClient?.welfare_state}</h1>
                                                </span>
                                                <span className='flex flex-col w-full md:w-4/12 gap-2 '>
                                                    <span className="text-blue-500 font-thin">
                                                        Qual auxílio??
                                                    </span>
                                                    <h1 className='block' style={{ fontSize: 19 }}>{dataClient?.welfare_state_type}</h1>
                                                </span>
                                            </span>
                                            <hr className='w-full mt-4 mb-4' />
                                            <span className='block text-sm w-full flex flex-row max-w-full sm:w-full mt-1'>
                                                <BsPersonVcard className='inline-block text-blue-500' style={{ color: 'rgb(59 130 246)', marginTop: 3, marginRight: 6 }} /> Atendimento
                                            </span>
                                            <span className='flex flex-row gap-2 mt-3 pt-2 mb-1' style={{ fontSize: 19 }}>
                                                <AiOutlineCalendar style={{ color: 'rgb(59 130 246)', marginTop: 3 }} />
                                                <b>{transformDateFormat(dataForm.date as string)}</b>
                                                <AiOutlineClockCircle style={{ color: 'rgb(59 130 246)', marginTop: 3 }} />
                                                <b>{dataForm.begun}</b>
                                            </span>
                                            <span className='block text-xl pt-4 mb-4 border border-gray-200 border-2  w-full nline-block max-w-full sm:w-full p-2'>
                                                <span className='flex text-blue-400 flex-row gap-2 mt-1 mb-1' style={{ fontSize: 12 }}>
                                                    DESCRIÇÃO DO CASO
                                                </span>
                                                <h1 className='block' style={{ fontSize: 19 }}>{dataForm.observations}</h1>
                                            </span>
                                            <span className='block text-xl border border-gray-200 border-2 w-full nline-block max-w-full sm:w-full p-2'>
                                                <span className='flex text-blue-400 flex-row gap-2 mt-1 mb-1' style={{ fontSize: 12 }}>
                                                    PEDIDO DE DOAÇÃO
                                                </span>
                                                {dataForm.order}
                                            </span>
                                            <span className='flex text-xl max-w-full pt-5'>
                                                <span className='flex flex-col items-start text-xll w-full md:w-4/12 m-1 ml-0 p-1 rounded bg-gray-100'>
                                                    <span className='flex flex-col text-blue-400 flex-row gap-2 mt-1 mb-1 p1 ' style={{ fontSize: 12 }}>
                                                        ETIQUETA
                                                    </span>
                                                    {dataForm.tag}
                                                </span>
                                                <span className='flex flex-col items-start text-xl w-full md:w-4/12 m-1 ml-0 p-1 rounded bg-gray-100'>
                                                    <span className='flex flex-col text-blue-400 flex-row gap-2 mt-1 mb-1 p1 ' style={{ fontSize: 12 }}>
                                                        data do atendimento
                                                    </span>
                                                    {transformDateFormat(dataForm.date as string)}
                                                </span>
                                                <span className='flex flex-col items-start text-xl w-full md:w-4/12 m-1 mr-0 p-1 rounded bg-gray-100'>
                                                    <span className='flex text-blue-400 flex-row gap-2 mt-1 mb-1 p2 rounded' style={{ fontSize: 12 }}>
                                                        TIPO
                                                    </span>
                                                    {dataForm.type}
                                                </span>
                                            </span>
                                            <hr className='w-full mb-3 mt-3' />
                                            {dataForm.status === 'pendente' ?
                                                <>
                                                    <span className='block text-xl w-full flex flex-row max-w-full sm:w-full mt-4'>
                                                        <HiOutlineDocument style={{ color: 'rgb(59 130 246)', marginTop: 3, marginRight: 6 }} /> Status do Atendimento
                                                    </span>
                                                    <span className='inline-block max-w-full sm:w-full md:w-4/12 md:pr-1 pt-4'>
                                                        <InputSelect
                                                            id={'dispatch_type'}
                                                            label='STATUS DO DESPACHO'
                                                            value={dispatchDataForm.status}
                                                            onChange={(e) => handleFormSelect(e, 'dispatch_type')}
                                                            options={type_options}
                                                        />
                                                    </span>
                                                    <span className='inline-block max-w-full sm:w-full md:w-4/12 md:pl-1 md:pr-1 pt-4'>
                                                        <InputCalendarForm id={'checkout'} label="data do despacho" value={dispatchDataForm.checkout as string} onChange={(e) => handleFormCalendar(e)} />
                                                    </span>
                                                    <span className='inline-block max-w-full sm:w-full md:w-4/12 md:pr-1 pt-4'>
                                                        <InputSelect
                                                            id={'status'}
                                                            label='Status'
                                                            value={dispatchDataForm.status}
                                                            onChange={(e) => handleFormSelect(e, 'status')}
                                                            options={type_options_status}
                                                            key={fieldsUpdated}
                                                        />
                                                    </span>
                                                    <span className='inline-block max-w-full w-full pt-4 md:pl-1'>
                                                        <InputTextArea id={'dispatch_observations'} label="Observações de despacho" value={dispatchDataForm.dispatch_observations} onChange={(e) => handleForm(e)} >
                                                            {
                                                                dispatchDataForm.dispatch_observations
                                                            }
                                                        </InputTextArea>
                                                    </span>
                                                </>
                                                : dataForm.status === 'finalizado' || dataForm.status === 'negado' ?
                                                    <>
                                                        <span className='flex text-xl max-w-full pt-5'>
                                                            <span className='flex flex-col items-start text-xl w-full md:w-4/12 m-1 ml-0 p-1 rounded bg-gray-100'>
                                                                <span className='flex flex-col text-blue-400 flex-row gap-1 mt-1 mb-1 p1 ' style={{ fontSize: 12 }}>
                                                                    Despacho
                                                                </span>
                                                                {dataForm.dispatch_type}
                                                            </span>
                                                            <span className='flex flex-col items-start text-xl  w-full md:w-4/12 m-1 ml-0 p-1 rounded bg-gray-100'>
                                                                <span className='flex flex-col text-blue-400 flex-row gap-1 mt-1 mb-1 p1 ' style={{ fontSize: 12 }}>
                                                                    dia do despacho
                                                                </span>
                                                                {transformDateFormat(dataForm.checkout as string)}
                                                            </span>
                                                            <span className='flex flex-col items-start text-xl w-full md:w-4/12 m-1 mr-0 p-1 rounded bg-gray-100'>
                                                                <span className='flex text-blue-400 flex-row gap-2 mt-1 mb-1 p2 rounded' style={{ fontSize: 12 }}>
                                                                    Status
                                                                </span>
                                                                {dataForm.status}
                                                            </span>
                                                        </span>
                                                        <span className='flex flex-col items-start text-xl w-full m-1 mr-0 p-1 rounded bg-gray-100'>
                                                            <span className='flex text-blue-400 flex-row gap-2 mt-1 mb-1 p2 rounded' style={{ fontSize: 12 }}>
                                                                Observações de despacho
                                                            </span>
                                                            {dataForm.dispatch_observations}
                                                        </span>
                                                    </>

                                                    : null}
                                        </div>
                                        <span className='flex flex-row mt-4'>
                                            <span className="block sm:w-full md:w-6/12 pt-4 mr-1" style={{ marginRight: 'auto', marginLeft: 'auto' }}>
                                                <BtnS onClick={printContent}><AiOutlinePrinter className='inline-block' /> Imprimir</BtnS>
                                            </span>
                                            <span className="block sm:w-full md:w-6/12 pt-4 ml-1" style={{ marginRight: 'auto', marginLeft: 'auto' }}>
                                                <Btn onClick={() => serviceDispatch()}><AiFillSave className='inline-block' /> Despachar</Btn>
                                            </span>
                                        </span>
                                    </>
                                    : null
                            }
                        </Content>
                    </div>
                </MainCtnHorizontal >
                <ModalCTN isOpen={isOpen}>
                    <span className="absolute" style={{ right: 5, top: 10 }}>
                        <BtnR onClick={() => setIsOpen(false)}><AiOutlineCloseCircle style={{ fontSize: '24px', marginTop: '8px' }} /></BtnR>
                    </span>
                    <span className="flex flex-col items-center justify-items-center content-center pt-20">
                        <FiAlertTriangle className="text-2xl mb-3" />
                        <h1 className=" mb-3 text-lg">{modalMessage}</h1>
                    </span>
                </ModalCTN>
            </AuthCheck>
        </section>
    );
}  