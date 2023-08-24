import { useState, useEffect, useRef } from "react";
import { Btn, BtnOutline, BtnR, BtnS } from "../template/btn"
import { AiOutlineCloseCircle, AiOutlineSearch, AiOutlineUsergroupAdd } from 'react-icons/ai'
import { FiAlertTriangle } from 'react-icons/fi'
import Modal from 'react-modal';
import { BiMap } from 'react-icons/bi'

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

interface Address {
    address_id?: number | null | undefined;
    CEP?: string | null;
    street?: string | null;
    number?: number | null;
    complement?: string | null;
}

const initialData: Address = {
    address_id: null,
    CEP: null,
    street: '',
    number: null,
    complement: ''
};

export default function AddressesList({
    addressesProp,
    value,
}: {
    addressesProp: [],
    value?: () => void
}) {

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [addresses, setAddresses] = useState<Address[]>([])
    const [searchValue, setSearchValue] = useState('')
    const [inputsToggler, setInputsToggler] = useState(
        {
            commom: true,
            health: false,
            psicology: false
        }
    )

    const modalRef = useRef<HTMLDivElement>(null);

    const searchClient = async () => {

        try {
            const response = await axios.get(`${process.env.BEK_URL}/address/search`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                params: {
                    name: searchValue,
                    perPage: 10,
                    page: 1
                }
            })
                .then(function (response) {
                    setAddresses(response.data.addresses)
                })
                .catch(function (error) {
                    
                })
                .finally(function () {
                    // always executed
                });
        } catch (error) {
            console.error(error);
        }
    }

    const toggleModaladdresses = () => {
        setModalIsOpen(!modalIsOpen)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        //console.log('Tecla pressionada:', event.key);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setModalIsOpen(false)
            }
        };
    }, []);

    useEffect(() => {
        console.log('addresses')
        console.log(addresses)
    }, [addresses]);

    return (
        <div onKeyDown={handleKeyDown} >
            <div className="flex flex-col items-center justify-items-center border border-gray-100 rounded-lg content-center p-4 gap-3 mb-3">
                {
                    addresses.length > 0 ?
                        <ul id={'addresses'} className="flex flex-col w-full p-4">
                            {
                                addresses.map((a, b) => (
                                    <li key={'key-bottom-' + b} className="flex flex-row text-4xl">
                                        <span className="flex w-10/12">
                                            <span className='flex rounded mr-3 h-10 w-10 bg-gray-700 mt-1' />
                                        </span>
                                        <span className="flex w-2/12 mp-1">
                                            <BtnS onClick={()=>{}}  >
                                                <AiOutlineUsergroupAdd />
                                            </BtnS>
                                        </span>
                                    </li>
                                ))
                            }
                        </ul>
                        :
                        <span className="flex flex-col items-center justify-items-center content-center ">
                            <FiAlertTriangle className="text-2xl mb-3" />
                            <h1 className="uppercase mb-3 text-lg"> Nenhum <b>endereço</b> selecionado </h1>
                            <BtnOutline onClick={() => toggleModaladdresses()}>selecionar endereço</BtnOutline>
                        </span>
                }
            </div>
            <Modal isOpen={modalIsOpen} style={customStyles} ariaHideApp={false}>
                <div className="flex flex-col" ref={modalRef}>
                    <h1 className='text-3xl pb-4 pt-2'>Adicionar endereço</h1>
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
                        <BtnR onClick={() => setModalIsOpen(!modalIsOpen)}>
                            <AiOutlineCloseCircle style={{ fontSize: '24px', marginTop: '8px' }} />
                        </BtnR>
                    </span>
                    {
                        addresses.length > 0 ?
                            <ul className="flex flex-col py-6 gap-3 rounded max-h-100 mb-4">

                                {
                                    <>
                                        <h1 className="flex flex-col pt-2 mb-2">Resultados da pesquisa para: <b> {" " + searchValue}</b></h1>
                                        {addresses.map((a, b) => (
                                            <li key={'key-bottom-' + b} className="flex flex-row w-full text-4xl">
                                                <span className='md:w-1/12 flex mt-1'>
                                                    <BiMap className="text-gray-400" style={{ fontSize: 35}} />
                                                </span>
                                                <span className='md:w-9/12 flex mt-1' style={{ fontSize: 18}}>
                                                    { a.street + ' ' }
                                                    ,
                                                    { a.CEP + ' ' }
                                                    ,
                                                    { a.complement + ' ' }
                                                    ,
                                                    { a.number + ' ' }
                                                </span>
                                                <div className="md:w-2/12">
                                                    <BtnR onClick={() => {}} >
                                                        <AiOutlineUsergroupAdd style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 4 }} /> 
                                                    </BtnR>
                                                </div>
                                            </li>
                                        ))}
                                    </>
                                }

                            </ul>
                            :
                            null
                    }
                </div>
            </Modal>
        </div>
    )
}