'use client'
import { useEffect, useState } from 'react';
import { HiOutlineDocument } from 'react-icons/hi';
import { BsPersonVcard } from 'react-icons/bs'
import { AiFillSave, AiOutlineCalendar, AiOutlineClockCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { MainCtnHorizontal } from '@/components/template/mainctn';
import SideMenu from '@/components/sections/sidemenu';
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import { InputCalendarForm, InputSelect, InputTextArea, InputTextForms, InputTimeForm } from '@/components/template/input';
import { Btn, BtnR } from '@/components/template/btn';
import BeneficiarysList from '@/components/sections/beneficiarysList';
import AddressesList from '@/components/sections/addressesList';
import { FiAlertTriangle } from 'react-icons/fi';
import { usePathname } from 'next/navigation'
import axios from 'axios';
import transformDateFormat from '@/helpers/dataFormat';
import ItensList from '@/components/sections/itensList';

const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`;

type Client = {
    client_id: number | null;
    name: string | null;
    birthday: string | null;
    RG: number | null;
    CPF: number | null;
    maritial_status: string | number | null | undefined;
    kinship: number | null;
    email: string | null;
    phone: number | null;
};

const initialDataClient: Client = {
    client_id: null,
    name: null,
    birthday: null,
    RG: null,
    CPF: null,
    maritial_status: 'solteiro(a)',
    kinship: null,
    email: null,
    phone: null,
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
};

const initialData:DataForm = {
    service: '',
    type: 'comum',
    title: '',
    observations: ' ',
    client: null,
    user: null,
    begun: '',
    end: '',
    dispatch_observations: '',
    dispatch_status: '',
    checkout: formattedDate,
    itens_group: null,
    date: '',
};

const type_options = [
    { value: 'Marotona do Amor', label: 'Marotona do Amor' },
    { value: 'Missão', label: 'Missão' },
    { value: 'Outros', label: 'Outros' }
  ];

export default function ClientEdtForm() {

    const pathname = usePathname();
    const parts = pathname.split('/');
    const idx = parseInt(parts[3], 10);

    const [dataForm, setDataForm] = useState<DataForm>(initialData);
    const [dataClient, setDataClient] = useState<Client>();
    const [loading, setLoading] = useState(true);

    const searchService = async () => {
        try {
            const response = await axios.get(`${process.env.BEK_URL}/services/search/${idx}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
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
        let tempData = { ...dataForm };
        tempData = { ...tempData, [index]: tempValue };
        setDataForm(tempData);
    };

    const handleFormSelect = (value: string) => {
        const selectedValue = value.trim() !== '' ? value : null;
        let prevDataForm = { ...dataForm, maritial_status: selectedValue };
        setDataForm(prevDataForm);
    };

    const handleFormCalendar = (value: string) => {
        let prevDataForm = { ...dataForm, birthday: value };
        setDataForm(prevDataForm);
    };

    const handleAddressValue = (selectedValue: number) => {
        let prevDataForm = { ...dataForm, address: selectedValue };
        setDataForm(prevDataForm);
    };

    const sendForm = async () => {
        try {

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (loading) {
            searchService()
        }
    }, [loading])

    useEffect(() => {
        console.log('dataForm')
        console.log(dataForm)
      }, [dataForm])

    return (
        <MainCtnHorizontal>
            <Header />
            <div id="container-principal" className='flex pt-5 w-full'>
                <SideMenu />
                <Content>
                    <h1 className='text-xl pb-4 pt-4 text-gray-500'>Atendimento:</h1>
                    {
                        !loading ?
                            <>
                                <h1 className='text-2xl pb-2 pt-2' style={{ fontWeight: 600 }}>{dataForm.title}</h1>
                                <hr className='mb-2 mt-1 w-full' />
                                <span className='flex flex-row gap-2 mt-3 mb-3' style={{ fontSize: 19 }}>
                                    <AiOutlineCalendar style={{ color: 'rgb(59 130 246)', marginTop: 3 }} /> 
                                    <b>{transformDateFormat(dataForm.date as string)}</b>
                                    <AiOutlineClockCircle style={{ color: 'rgb(59 130 246)', marginTop: 3 }} /> 
                                    <b>{dataForm.begun}</b> - <b>{dataForm.end}</b>
                                </span>
                                <span className='block text-xl border border-gray-100  w-full nline-block max-w-full sm:w-full p-4 pt-4'>
                                    {dataForm.observations}
                                </span>
                                <span className='block text-xl w-full flex flex-row max-w-full sm:w-full mt-4'>
                                    <BsPersonVcard className='inline-block text-blue-500' style={{ color: 'rgb(59 130 246)', marginTop: 3, marginRight: 6 }} /> Beneficiado Atendido
                                </span>
                                <hr className='w-full mb-3 mt-3' />
                                <span className='block text-xl w-full flexmax-w-full sm:w-full mt-5 mb-5'>
                                    <h1 className='text-3xl mt-3 '>{dataClient?.name}</h1>
                                </span>
                                <span className='block text-xl w-full flex flex-row max-w-full sm:w-full mt-4'>
                                    <HiOutlineDocument style={{ color: 'rgb(59 130 246)', marginTop: 3, marginRight: 6 }} /> Status do Atendimento
                                </span>
                                <hr className='w-full mb-3 mt-3' />
                                <span className='inline-block max-w-full sm:w-full md:w-4/12 md:pr-1 pt-4'>
                                    <InputSelect
                                        id={'type'}
                                        label='STATUS DO DESPACHO'
                                        value={dataForm.type} 
                                        onChange={(e) => handleFormSelect(e)} 
                                        options={type_options}
                                    />
                                </span>
                                <span className='inline-block max-w-full sm:w-full md:w-4/12 md:pl-1 md:pr-1 pt-4'>
                                    <InputCalendarForm id={'checkout'} label="CheckOut" value={dataForm.date as string} onChange={(e) => handleFormCalendar(e)} />
                                </span>
                                <span className='inline-block max-w-full sm:w-full md:w-4/12 md:pr-1 pt-4'>
                                    <InputSelect
                                        id={'type'}
                                        label='Urgência'
                                        value={dataForm.type} 
                                        onChange={(e) => handleFormSelect(e)} 
                                        options={type_options}
                                    />
                                </span>
                                <span className='inline-block max-w-full w-full pt-4 md:pl-1'>
                                    <InputTextArea id={'dispatch_observations'} label="Observações de despacho" value={dataForm.dispatch_observations} onChange={(e) => handleForm(e)}/>
                                </span>
                                {/* almoxarifado */}
                                <span className="block sm:w-full md:w-6/12 pt-4"  style={{marginRight: 'auto' , marginLeft: 'auto'}}>
                                    <Btn onClick={() => sendForm()}><AiFillSave  className='inline-block' /> Enviar</Btn>
                                </span>
                            </>
                            : null
                    }
                </Content>
            </div>
        </MainCtnHorizontal >
    );
}  