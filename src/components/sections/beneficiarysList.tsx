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

const initialData: Client = {
    client_id: null,
    name: null,
    birthday: null,
    RG: null,
    CPF: null,
    phone: null,
    email: null,
    maritial_status: null,
    address: null
};

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
    const [total, setTotal] = useState(0);

    const modalRef = useRef<HTMLDivElement>(null);

    const searchClient = async () => {

        try {
            const response = await axios.get(`${process.env.BEK_URL}/clients/search`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                params: {
                    name: searchValue,
                    perPage: 5,
                    page: currentPage
                }
            })
                .then(function (response) {
                    setBeneficiarys(response.data.data);
                    setTotal(response.data.totalResults)
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                    
                });
        } catch (error) {
            console.error(error);
        }
    }

    const toggleModalBeneficiarys = () => {
        setModalsOpen(!modalsOpen)
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

    // useEffect(() => {
    //     const handleKeyDown = (event: KeyboardEvent) => {
    //         if (event.key === 'Escape') {
    //             setModalsOpen(false)
    //         }
    //     };
    // }, []);

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

    // useEffect(() => {
    //     console.log('Beneficiarys')
    // }, [beneficiarys])

    return (
        <div onKeyDown={handleKeyDown} >
            <div className="flex flex-col items-center justify-items-center content-center p-4  mb-3   border border-gray-300 border-roundedflex flex-col items-center justify-items-center content-center p-4 mb-3 border border-gray-100 rounded-md">
                {
                    beneficiary.length > 0 ?
                        <ul id={'beneficiarys'} className="flex items-center flex-col w-full p-4 gap-3">
                            {
                                beneficiary.map((a: Client, b) => {
                                    return (
                                        <li key={'key-bottom-' + b} className="flex w-full flex-row text-4xl h-24">
                                            <div className="flex flex-col w-10/12 pr-2 pl-2">
                                                <span style={{ fontSize: 24 }}>{a.name}</span>
                                                <hr />
                                                <p className='flex gap-2 items-center uppercase font-semibold' style={{ fontSize: 18 }}>
                                                    <span className="text-blue-500" style={{ fontSize: 18 }}>
                                                        {"ID"}
                                                    </span>
                                                    {a.client_id}
                                                    <span className="text-blue-500">
                                                        <AiOutlineCalendar style={{ fontSize: 30 }} />
                                                    </span>
                                                    {transformDateFormat(a.birthday as string)}
                                                </p>
                                            </div>
                                            <div className="flex flex-row-reverse w-2/12 pt-5">
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
                            <h1 className="uppercase mb-3 text-lg"> Nenhum beneficiado selecionado </h1>
                            <BtnOutline onClick={() => toggleModalBeneficiarys()}>selecionar beneficiado</BtnOutline>
                        </span>
                }
            </div>
            <Modal isOpen={modalsOpen} style={customStyles} ariaHideApp={false}>
                <div className="flex flex-col" ref={modalRef}>
                    <h1 className='text-3xl pb-4 pt-2'>Adicionar beneficiado</h1>
                    <hr className='mb-2 mt-4' />
                    <div className="flex flex-row">
                        <span className="inline-block w-10/12 pt-4 pr-2" >
                            <InputTextForms label={"Pesquisar Beneficiado"} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                        </span>
                        <span className="inline-block w-2/12 pt-4" >
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
                                <ul className="flex flex-col py-6 gap-3 rounded max-h-100 mb-4">

                                    {
                                        <>
                                            <h1 className="flex flex-col pt-2 mb-2">Resultados da pesquisa para: <b> {" " + searchValue}</b></h1>
                                            {beneficiarys.map((a: Client, b) => (
                                                <li key={'key-bottom-' + b} className='flex flex-row text-4xl w-full'>
                                                    <span className='w-10/12'>
                                                        <p className='text-2xl'>{a.name}</p>
                                                        <p className='flex gap-2 items-center uppercase font-semibold' style={{ fontSize: 16 }}>
                                                            <span className="text-blue-500" style={{ fontSize: 16 }}>
                                                                {"ID"}
                                                            </span>
                                                            {a.client_id}
                                                            <span className="text-blue-500">
                                                                <AiOutlineCalendar style={{ fontSize: 18 }} />
                                                            </span>
                                                            {transformDateFormat(a.birthday as string)}
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