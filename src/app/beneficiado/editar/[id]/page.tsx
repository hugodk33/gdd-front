'use client'
import { useEffect, useState } from 'react';
import {  BsPeople, BsPersonVcard } from 'react-icons/bs';
import { AiFillSave, AiOutlineCloseCircle } from 'react-icons/ai';
import { MainCtnHorizontal } from '@/components/template/mainctn';
import SideMenu from '@/components/sections/sidemenu';
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import { InputSelect, InputTextForms } from '@/components/template/input';
import { Btn } from '@/components/template/btn';

import { usePathname } from 'next/navigation'
import axios from 'axios';

type DataForm = {
    client_id: number | null;
    name: string | null;
    birthday: string | null;
    RG: number | null;
    CPF: number | null;
    maritial_status: string | number | null | undefined;
    kinship: number | null;
    email: string | null;
    phone: number | null;
    status: string | null;
};

const initialData: DataForm = {
    client_id: null,
    name: null,
    birthday: null,
    RG: null,
    CPF: null,
    maritial_status: 'solteiro(a)',
    kinship: null,
    email: null,
    phone: null,
    status: 'pendente',
};

const maritial_status_options = [
    { value: 'solteiro(a)', label: 'solteiro(a)' },
    { value: 'casado(a)', label: 'casado(a)' },
    { value: 'divorciado(a)', label: 'divorciado(a)' },
    { value: 'separado(a)', label: 'separado(a)' },
];

export default function ClientEdtForm() {

    const pathname = usePathname();
    const parts = pathname.split('/');
    const idx = parts[2];

    const [dataForm, setDataForm] = useState<DataForm>(initialData);
    const [alertModalSucess, setAlertModalSuccess] = useState(false);
    const [alertModalError, setAlertModalError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');

    const searchClient = async (idx: number) => {
        try {
            const response = await axios.get('http://bequegddsooder-env.eba-fas23u33.sa-east-1.elasticbeanstalk.com/clients/search', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                params: {
                    name: '',
                    perPage: 1,
                    page: 1,
                    client_id: idx
                }
            });
            setDataForm(response.data.data[0]);
            setName(response.data.data[0].name)
            setLoading(false);
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
            setAlertModalSuccess(true);
        } catch (error) {
            console.error(error);
            setAlertModalError(true);
        }
    };

    useEffect(() => {
        if (loading) {
            const idxAsNumber = parseInt(idx, 10);
            searchClient(idxAsNumber);
        }
    }, [loading])

    return (
        <MainCtnHorizontal>
            <Header />
            <div id="container-principal" className='flex pt-5 w-full'>
                <SideMenu />
                <Content>
                    {! loading ?
                        <>
                            <h1 className='text-xl pb-2 pt-2 text-gray-500'>Editar cadastro de Beneficiado:</h1>
                            <h1 className='text-2xl pb-2 pt-2' style={{fontWeight: 600}}>{name}</h1>
                            <hr className='mb-2 mt-4' />
                            <h3 className='text-xl pb-2 pt-2'>
                                <BsPersonVcard className='inline-block text-blue-500' /> Dados Pessoais
                            </h3>
                            <span className='inline-block max-w-full sm:w-full md:w-full pt-4'>
                                <InputTextForms
                                    id={'name'}
                                    label='Nome'
                                    value={dataForm.name}
                                    onChange={(e) => handleForm(e)}
                                />
                            </span>
                            <span className='inline-block max-w-full sm:w-full md:w-6/12 md:pr-1 pt-4'>
                                <InputTextForms
                                    id={'RG'}
                                    label='RG'
                                    value={dataForm.RG}
                                    onChange={(e) => handleForm(e)}
                                />
                            </span>
                            <span className='inline-block max-w-full sm:w-full md:w-6/12 md:pl-1 pt-4'>
                                <InputTextForms
                                    id={'CPF'}
                                    label='CPF'
                                    value={dataForm.CPF}
                                    onChange={(e) => handleForm(e)}
                                />
                            </span>
                            <span className='inline-block max-w-full sm:w-full md:w-6/12 md:pr-1 pt-4'>
                                <InputSelect
                                    id={'maritial_status'}
                                    label='Estado Civil'
                                    value={dataForm.maritial_status}
                                    onChange={(e) => handleFormSelect(e)}
                                    options={maritial_status_options}
                                />
                            </span>
                            <span className="inline-block max-w-full sm:w-full md:w-full md:pr-1 pt-4" >
                                <h3 className='text-xl pb-2 pt-6'><BsPeople className="inline-block text-blue-500" /> Parentesco</h3>
                                <hr />
                                
                            </span>
                        </>
                        : null}
                    {/* Restante do formulário */}
                    <span className='block mr-auto ml-auto sm:w-full md:w-8/12 md:pr-1 pt-4'>
                        <Btn
                            onClick={() => sendForm()}
                        >
                            <AiFillSave className='inline-block' /> Salvar
                        </Btn>
                    </span>
                </Content>
                {/* Modais de sucesso e erro */}
                {/* ... */}
            </div>
        </MainCtnHorizontal>
    );
}  