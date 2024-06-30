import { useState, useEffect, useRef } from "react";
import { Btn, BtnOutline, BtnR, BtnS } from "../template/btn"
import { AiOutlineCalendar, AiOutlineCloseCircle, AiOutlineSearch, AiOutlineUsergroupAdd } from 'react-icons/ai'
import { FiAlertTriangle } from 'react-icons/fi'
import Modal from 'react-modal';

import { InputTextForms } from "../template/input";
import axios from "axios";
import clientsList from "./clientsList";
import transformDateFormat from "@/helpers/dataFormat";
import Pagination from "../template/pagination";
import { BiMap } from "react-icons/bi";

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

const initialData: Client = {
    client_id: null,
    name: '',
    birthday: '',
    RG: null,
    CPF: null,
    phone: null,
    email: '',
    maritial_status: '',
    address: null,
    street: '',
    number: null,
    neighborhood: '',
    CEP: null
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '9999',
        minWidth: 300,
        minHeight: 300,
        width: 600
    },
    overlay: {
        backgroundColor: 'rgb(38 110 153 / 75%)',
        zIndex: '9999'
    }
};

export default function BeneficiarysList({
    benefeciarys,
    value
}: {
    benefeciarys: [],
    value: (selectedValue: number) => void
}) {

    const [modalsOpen, setModalsOpen] = useState(false)
    const [beneficiarys, setBeneficiarys] = useState([])
    const [beneficiary, setBeneficiary] = useState<Client[]>([])
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [, setIsSearch] = useState(false)
    const [total, setTotal] = useState(0);
    const [isOpen, setIsOpen] = useState(false)
    const [modalMessage, setModalMessage] = useState('');


    const modalRef = useRef<HTMLDivElement>(null);

    const searchClient = async () => {
        let token = localStorage.getItem('trotsk')
        try {
            const response = await axios.get(`http://back.ongprograma.org/clients/search`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: 'bearer ' + token
                },
                params: {
                    id: searchValue,
                    perPage: 10,
                    page: currentPage,
                }
            });
            setBeneficiarys(response.data.client.data)
            setIsSearch(true)
            setTotal(response.data.client.total)
        } catch (error) {
            console.error(error);
        }
    }

    const toggleModalBeneficiarys = () => {
        setModalsOpen(!modalsOpen)
        removeClient()
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        //console.log('Tecla pressionada:', event.key);
    };

    const removeClient = () => {
        setBeneficiary([]);
    };

    const handleBeneficiary = (a: Client) => {
        setBeneficiary([a])
        setModalsOpen(!modalsOpen)
    };

    useEffect(() => {
        if (beneficiary.length > 0) {
            value(beneficiary[0].client_id as number);
        }
    }, [beneficiary]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        searchClient();
    }, [currentPage])

    return (
        <div onKeyDown={handleKeyDown} >
            <div className="flex flex-col items-center justify-items-center content-center p-4  mb-3   border border-gray-300 border-roundedflex flex-col items-center justify-items-center content-center p-4 mb-3 border border-gray-100 rounded-md">
                {
                    beneficiary.length > 0 ?
                        <ul id={'beneficiarys'} className="flex items-center flex-col w-full p-4 gap-3">
                            {
                                beneficiary.map((a: Client, b) => {
                                    return (
                                        <li key={'key-bottom-' + b} className="flex w-full flex-row text-4xl">
                                            <div className="flex flex-col w-10/12 pr-2 pl-2">
                                                <span style={{ fontSize: 24 }}>{a.name}</span>
                                                <p className='flex items-center gap-1 ' style={{ fontSize: 16, height: 25 }}>
                                                    <span className="text-blue-500 bold" style={{ fontSize: 16 }}>
                                                        CPF
                                                    </span>
                                                    {a.CPF ? a.CPF : ' --- '}
                                                    <span className="text-blue-500 bold" style={{ fontSize: 16 }}>
                                                        RG
                                                    </span>
                                                    {a.RG ? a.RG : ' --- '}
                                                </p>
                                                <p className='flex gap-2 items-center  font-semibold' style={{ fontSize: 18 }}>
                                                    <span className="text-blue-500 ">
                                                        <BiMap style={{ fontSize: 42 }} />
                                                    </span>
                                                    {a.street ? a.street : ' --- '}
                                                    {' , '}
                                                    {a.number ? a.number : ' --- '}
                                                    {' , '}
                                                    {a.neighborhood ? a.neighborhood : ' --- '}
                                                    {' , '}
                                                    {a.CEP ? a.CEP : ' --- '}
                                                </p>
                                                <hr />
                                                <p className='flex gap-2 items-center  font-semibold' style={{ fontSize: 18 }}>
                                                    <span className="text-blue-500" style={{ fontSize: 18 }}>
                                                        {"ID"}
                                                    </span>
                                                    {a.client_id ? a.client_id : ' --- '}

                                                    <span className="text-blue-500">
                                                        <AiOutlineCalendar style={{ fontSize: 30 }} />
                                                    </span>
                                                    {a.birthday ? transformDateFormat(a.birthday as string) : ' --- '}
                                                </p>
                                            </div>
                                            <div className="flex flex-row-reverse w-2/12">
                                                <BtnR onClick={() => removeClient()}>
                                                    <AiOutlineCloseCircle className="pt-2" style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 4, fontSize: 50 }} />
                                                </BtnR>
                                            </div>
                                            <hr />
                                        </li>
                                    )
                                }
                                )}
                        </ul>
                        :
                        <span className="flex flex-col items-center justify-items-center content-center ">
                            <FiAlertTriangle className="text-2xl mb-3" />
                            <h1 className=" mb-3 text-lg"> Nenhum beneficiado selecionado </h1>
                            <BtnOutline onClick={() => toggleModalBeneficiarys()}>selecionar beneficiado</BtnOutline>
                        </span>
                }
            </div>
            <Modal isOpen={modalsOpen} style={customStyles} ariaHideApp={false}>
                <div className="flex flex-col" ref={modalRef}>
                    <h1 className='text-3xl pb-4 pt-2'>Buscar beneficiado</h1>
                    <hr className='mb-2 mt-4' />
                    <div className="flex flex-row">
                        <span className="inline-block w-10/12 pt-4 pr-2" >
                            <InputTextForms label={"Pesquisar Beneficiado"} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                        </span>
                        <span className="inline-block w-2/12 pt-4" style={{ paddingTop: 32 }}>
                            <Btn onClick={() => searchClient()}>
                                <AiOutlineSearch style={{ margin: '0 auto' }} />
                            </Btn>
                        </span>
                    </div>
                    <span className="absolute" style={{ right: 5, top: 10 }}>
                        <BtnR onClick={() => setModalsOpen(!modalsOpen)}>
                            <AiOutlineCloseCircle style={{ fontSize: '24px', marginTop: '8px' }} />
                        </BtnR>
                    </span>
                    {
                        beneficiarys.length > 0 ?
                            <>
                                <h1 className="flex flex-col pt-2 mb-2">Resultados da pesquisa para: <b> {" " + searchValue}</b></h1>
                                <ul className="flex flex-col py-6 gap-3 overflow-y-scroll rounded mb-4" style={{ maxHeight: 300 }}>

                                    {
                                        <>
                                            {beneficiarys.map((a: Client, b) => (
                                                <li key={'key-bottom-' + b} className='flex flex-row text-4xl mb-4 w-full'>
                                                    <span className='w-10/12'>
                                                        <p className='text-2xl'>{a.name}</p>
                                                        <p className='flex items-center gap-1 ' style={{ fontSize: 16, height: 25 }}>
                                                            <span className="text-blue-500 bold" style={{ fontSize: 16 }}>
                                                                CPF
                                                            </span>
                                                            {a.CPF ? a.CPF : ' --- '}
                                                            <span className="text-blue-500 bold" style={{ fontSize: 16 }}>
                                                                RG
                                                            </span>
                                                            {a.RG ? a.RG : ' --- '}
                                                        </p>
                                                        <p className='flex gap-2 items-center  font-semibold' style={{ fontSize: 16 }}>
                                                            <span className="text-blue-500" style={{ fontSize: 16 }}>
                                                                {"ID"}
                                                            </span>
                                                            {a.client_id}
                                                            <span className="text-blue-500">
                                                                <AiOutlineCalendar style={{ fontSize: 18 }} />
                                                            </span>
                                                            {a.birthday ? transformDateFormat(a.birthday as string) : ' --- '}
                                                        </p>
                                                        <p className='flex items-center gap-1 ' style={{ fontSize: 16, height: 25 }}>
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
                                                    </span>
                                                    <span className='flex flex-row-reverse w-2/12 pt-2'>
                                                        <BtnR onClick={() => handleBeneficiary(a)} >
                                                            <AiOutlineUsergroupAdd style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 4, fontSize: 24 }} />
                                                        </BtnR>
                                                    </span>
                                                </li>
                                            ))}
                                        </>
                                    }

                                </ul>
                                {
                                    beneficiarys.length > 0 ?
                                        <ul className="flex flex flex-col p-4 gap-3 rounded mb-5 mt-5">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={total === 1 ? 1 : (Math.ceil(total / 10))}
                                                onPageChange={handlePageChange}
                                            />
                                        </ul>
                                        : null
                                }
                            </>

                            :
                            null
                    }
                </div>
            </Modal>
        </div>
    )
}