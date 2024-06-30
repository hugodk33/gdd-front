import { useState, useEffect, useRef } from "react";
import { Btn, BtnOutline, BtnR, BtnS } from "../template/btn"
import { AiOutlineCloseCircle, AiOutlineSearch, AiOutlineUsergroupAdd } from 'react-icons/ai'
import { FiAlertTriangle } from 'react-icons/fi'
import Modal from 'react-modal';

import { InputTextForms } from "../template/input";
import axios from "axios";

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

export default function serviceClient({
    clientprop,
    value
}: {
    clientprop: [],
    value: (selectedIds: number | null | undefined) => void 
}) {
    const [searchClientValue, setSearchClientValue] = useState<number | null>()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [modalType, setModalType] = useState('search')
    const [clients, setClients] = useState(clientprop)
    const [clientSelected, setClientSelected] = useState<Client[]>([])

    const modalRef = useRef<HTMLDivElement>(null);

    const searchClient = async () => {
        try {
            const response = await axios.get(`http://back.ongprograma.org/clients/search`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                params: {
                    name: searchClientValue,
                    perPage: 10,
                    page: 1,
                }
            });
            setClients(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleModalclients = () => {
        setModalIsOpen(!modalIsOpen)
    }

    const closeModal = () => {
        setModalIsOpen(false)
        setModalType('search')
        setClients([])
        setSearchClientValue(null)
    };

    const addClient = (vlw: Client) => {
        setClientSelected([vlw])
        value(vlw.client_id)
        closeModal()
    }

    const removeClient = (index: number | undefined) => {
        setClientSelected([]);
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-items-center content-center p-4 mb-3 border border-gray-100 border-rounded">
                {
                    clientSelected.length > 0 ?
                        <ul id={'clients'} className="flex flex-col w-full p-4 m-h-80">
                            {
                                clientSelected.map((a:Client, b) => {
                                    return (
                                        <li key={'key-bottom-' + b} className="flex flex-row text-4xl h-24">
                                            <div className="flex flex-col md:w-11/12 pt-5">
                                                <span className='text-2xl'> {a.name}</span>
                                                <span className='text-sm  font-semibold'>{"CPF:" + a.CPF + " | " + "RG:" + a.RG} </span>
                                            </div>
                                            <div className="flex flex-row-reverse md:w-1/12 pt-5">
                                                <BtnR onClick={() => removeClient(b)}>
                                                    <AiOutlineCloseCircle style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 4 }} />
                                                </BtnR>
                                            </div>
                                            <hr />
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        :
                        <span className="flex flex-col items-center justify-items-center content-center ">
                            <FiAlertTriangle className="text-2xl mb-3" />
                            <h1 className=" mb-3 text-center text-lg"> Nenhum <b>parente</b> selecionado </h1>
                        </span>
                }
                <hr />
                <BtnOutline onClick={() => toggleModalclients()}>selecionar parente</BtnOutline>
            </div>
            <Modal isOpen={modalIsOpen} style={customStyles} ariaHideApp={false}>
                <div className="flex flex-col" ref={modalRef}>
                    <h1 className='text-3xl pb-4 pt-2'>Adicionar parentesco</h1>
                    <hr className='mb-2 mt-4' />
                    {modalType === 'search' ?
                        <div className="flex flex-row">
                            <span className="inline-block w-10/12 pt-4 pr-2" >
                                <InputTextForms label={"Pesquisar Beneficiado"} value={searchClientValue} onChange={(e) => setSearchClientValue(e.target.value)} />
                            </span>
                            <span className="inline-block w-2/12 pt-4" >
                                <Btn onClick={() => searchClient()}>
                                    <AiOutlineSearch style={{ margin: '0 auto' }} />
                                </Btn>
                            </span>
                        </div>
                        : null}
                    <span className="absolute" style={{ right: 5, top: 10 }}>
                        <BtnR onClick={() => setModalIsOpen(!modalIsOpen)}>
                            <AiOutlineCloseCircle style={{ fontSize: '24px', marginTop: '8px' }} />
                        </BtnR>
                    </span>
                    {clients.length > 0 ?
                        <>
                            <h1 className="flex flex-col pt-2 mb-2">Resultados da pesquisa para: <b> {" " + searchClientValue}</b></h1>

                            <ul className="flex flex-col p-6 gap-3 rounded max-h-100 mb-4">

                                {clients.map((a: Client, b) => (
                                    <li key={'key-bottom-' + b} className="flex flex-row text-4xl">
                                        <div className="flex flex-col md:w-11/12">
                                            <span className='text-2xl'> {a.name}</span>
                                            <span className='text-sm  font-semibold'>{"CPF:" + a.CPF + " | " + "RG:" + a.RG} </span>
                                        </div>
                                        <div className="flex flex-row-reverse md:w-1/12">
                                            <BtnR onClick={( ) => addClient(a)} >
                                                <AiOutlineUsergroupAdd style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 4 }} />
                                            </BtnR>
                                        </div>
                                        <hr />
                                    </li>
                                ))}
                            </ul>
                        </>
                        : null}

                </div>
            </Modal>
        </div>
    )
}