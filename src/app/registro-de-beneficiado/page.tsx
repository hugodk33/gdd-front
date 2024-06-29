"use client";

import { BsHouse, BsPeople, BsPersonVcard, BsTelephoneOutbound } from 'react-icons/bs'
import { AiFillSave, AiOutlineCloseCircle } from 'react-icons/ai'
import { MainCtnHorizontal } from '@/components/template/mainctn'
import SideMenu from '@/components/sections/sidemenu'
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import { InputCalendarForm, InputSelect, InputTextArea, InputTextForms } from '@/components/template/input'
import { Btn, BtnR } from '@/components/template/btn'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ModalCTN, ModalSm } from '@/components/template/modal';
import { FiAlertTriangle } from 'react-icons/fi';
import AuthCheck from '@/components/authCheck/authcheck';

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

interface Client {
  client_id?: number | null | undefined;
  name?: string | null;
  birthday?: string | null;
  RG?: number | null;
  CPF?: number | null;
  phone?: number | null;
  email?: string | null;
  maritial_status?: string | null;
  family?: string | null;
  already?: string | null;
  welfare_state?: string | null;
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  CEP?: string | null;
  mother_name?: string | null;
  reference?: string | null;
}

interface KinshipList {
  kinship_id?: number | null;
  client?: Client | null;
  kinship_type?: string | null;
  kin?: Client | null;
}

type DataForm = {
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

const initialData: DataForm = {
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

const initialDataSanitize: DataForm = {
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

const maritial_status_options = [
  { value: '', label: '' },
  { value: 'solteiro(a)', label: 'solteiro(a)' },
  { value: 'casado(a)', label: 'casado(a)' },
  { value: 'divorciado(a)', label: 'divorciado(a)' },
  { value: 'separado(a)', label: 'separado(a)' }
];

const genre_options = [
  { value: '', label: '' },
  { value: 'masculino', label: 'masculino' },
  { value: 'feminino', label: 'feminino' }
];

const welfarestate_status_option = [
  { value: '', label: '' },
  { value: 'sim', label: 'sim' },
  { value: 'não', label: 'não' }
];

export default function ClientRegister() {

  const [dataForm, setDataForm] = useState<DataForm>(initialData)
  const [alertModalSucess, setAlertModalSuccess] = useState(false)
  const [alertModalError, setAlertModalError] = useState(false)
  const [clientsToDestroy, setClientsToDestroy] = useState<any>()
  const [selectedClientKinships, setSelectedClientKinships] = useState<KinshipList[]>([]);
  const [message, setMessage] = useState('')
  const [modalMessage, setModalMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false)
  const [sanitize, setSanitize] = useState(false)
  const [fieldsUpdated, setFieldsUpdated] = useState(0);
  const [localStorageValues, setLocalStorageValues] = useState(false);
  const [localStorageUserId, setLocalStorageUserId] = useState('');

  const sendForm = async () => {
    let token = localStorage.getItem('trotsk')
    let user_id = localStorage.getItem('user_id')
    try {
      const {
        name,
        birthday,
        RG,
        CPF,
        maritial_status,
        phone,
        email,
        user,
        mother_name,
        already,
        welfare_state,
        welfare_state_type,
        genre,
        family,
        street,
        number,
        complement,
        CEP,
        reference,
        neighborhood,
        city,
        state
      } = dataForm;
      
      const clientResponse = await axios.post(
        'http://localhost/clients',
        {
          name,
          birthday,
          RG,
          CPF,
          maritial_status,
          phone,
          email,
          mother_name,
          user:user_id,
          already,
          welfare_state,
          welfare_state_type,
          genre,
          family,
          street,
          number,
          complement,
          CEP,
          reference,
          neighborhood,
          city,
          state
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'bearer ' +  token
          },
        }
      );
      if (clientResponse.status === 201) {
        setModalMessage(clientResponse.data.message)
        setDataForm(initialDataSanitize);
        setSanitize(true)
        setIsOpen(true)
        setFieldsUpdated(fieldsUpdated + 1); // Step 2
      } else {
        setModalMessage(clientResponse.data.message)
        setIsOpen(true)
      }
    } catch (error) {
      console.error(error);
      setIsOpen(true)
    }
  };

  const handleForm = (value: React.ChangeEvent<HTMLInputElement>) => {
    const index = value.target.id;
    let tempValue = value.target.value;
    let tempData = { ...dataForm };
    tempData = { ...tempData, [index]: tempValue };
    setDataForm(tempData);
  };


  const handleFormSelect = (value: string, id: string) => {
    const selectedValue = value.trim() !== '' ? value : null;
    let prevDataForm = { ...dataForm, [id]: selectedValue };
    setDataForm(prevDataForm);
  };

  const handleFormCalendar = (value: string , id:string) => {
    let prevDataForm = { ...dataForm, [id]: value };
    setDataForm(prevDataForm);
  };

  useEffect(() => {
    let prevDataForm = { ...dataForm, kinships: selectedClientKinships };
    setDataForm(prevDataForm);
  }, [selectedClientKinships])

  // useEffect(() => {
  //   console.log('dataForm');
  //   console.log(dataForm);
  // }, [dataForm])

  const reallyDestroyIt = async (id: number) => {
    setIsOpen(true)
    setModalMessage('voce deseja excluir esse beneficiado?')
    setClientsToDestroy(id)
  }

  const closeModal = () => {
    setIsOpen(false)
  };

  useEffect(() => {
    if(!localStorageValues) {
      setLocalStorageValues(true)
      let id = localStorage.getItem('id')
      setLocalStorageUserId(id as string)
    }
  }, [localStorageValues])

  return (
    <>
      <AuthCheck>
      <MainCtnHorizontal>
        <Header />
        <div id="container-principal" className='flex pt-5 w-full'>
          <SideMenu />
          <Content>
            <h1 className='text-3xl pb-2 pt-2'>cadastro de beneficiado</h1>
            <h3 className='text-xl pb-2 pt-2'><BsPersonVcard className="inline-block text-blue-500" /> dados pessoais</h3>
            <hr className='mb-2 mt-4' />
            <span className="inline-block w-full sm:w-full md:w-full pt-4" >
              <InputTextForms id={'name'} label="Nome Completo" value={dataForm.name} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pr-1 pt-4" >
              <InputTextForms id={'RG'} label="RG" value={dataForm.RG} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pl-1 pt-4" >
              <InputTextForms id={'CPF'} label="CPF" value={dataForm.CPF} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pr-1 pt-4" >
              <InputSelect id={'maritial_status'} label="Estado Civil" value={dataForm.maritial_status} onChange={(e) => handleFormSelect(e, 'maritial_status')} options={maritial_status_options}  key={fieldsUpdated}/>
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pl-1 pt-4">
              <InputSelect
                id={'genre'}
                label="Sexo"
                value={!sanitize ? dataForm.genre : null}
                onChange={(e) => handleFormSelect(e, 'genre')}
                options={genre_options}
                key={fieldsUpdated} // Step 3
              />
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pr-1 pt-4" >
              <InputCalendarForm
                id={'birthday'}
                label="Data de Nascimento"
                value={dataForm.birthday}
                onChange={(e) => handleFormCalendar(e , 'birthday')}
                key={fieldsUpdated}
              />
            </span>
            <span className="inline-block w-full sm:w-full md:w-full pt-4" >
              <InputTextForms id={'mother_name'} label="Nome Completo da Mãe" value={dataForm.mother_name} onChange={(e) => handleForm(e)} />
            </span>
            <hr />
            <span className="inline-block w-full sm:w-full md:w-full pt-2" >
              <InputTextArea id={'family'} label={'quantos filhos? Sexo e idades'} onChange={(e) => handleForm(e)} sanitize={sanitize} key={fieldsUpdated}>
                {
                  dataForm.family 
                }
              </InputTextArea>
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pr-1 pt-4" >
              <InputSelect id={'welfare_state'} label="Recebe algum auxílio?" value={dataForm.welfare_state} onChange={(e) => handleFormSelect(e, 'welfare_state')} options={welfarestate_status_option}  key={fieldsUpdated}/>
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pl-1 pt-4" >
              <InputTextForms id={'welfare_state_type'} label="Quais auxílios?" value={dataForm.welfare_state_type} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pr-1 pt-4" >
              <InputSelect id={'already'} label="Já foi atendido antes?" value={dataForm.already} onChange={(e) => handleFormSelect(e, 'already')} options={welfarestate_status_option}  key={fieldsUpdated} />
            </span>
            <h3 className='text-xl pb-2 pt-6'><BsTelephoneOutbound className="inline-block text-blue-500" /> Contato</h3>
            <hr />
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pr-1 pt-4" >
              <InputTextForms id={'phone'} label="Telefone" value={dataForm.phone} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pl-1 pt-4" >
              <InputTextForms id={'email'} label="Email" value={dataForm.email} onChange={(e) => handleForm(e)} />
            </span>

            <h3 className='text-xl pb-2 pt-2'><BsPersonVcard className="inline-block text-blue-500" /> Endereço</h3>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pr-1 pt-4" >
              <InputTextForms id={'CEP'} label="CEP" value={dataForm.CEP} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pl-1 pt-4" >
              <InputTextForms id={'street'} label="Rua" value={dataForm.street} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pr-1 pt-4" >
              <InputTextForms id={'number'} label="Número" value={dataForm.number} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pl-1 pt-4" >
              <InputTextForms id={'neighborhood'} label="Bairro" value={dataForm.neighborhood} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-full pt-4" >
              <InputTextArea id={'complement'} label="Complemento" onChange={(e) => handleForm(e)} sanitize={sanitize} key={fieldsUpdated}>
                {
                  dataForm.complement
                }
              </InputTextArea>
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pr-1 pt-4" >
              <InputTextForms id={'reference'} label="Referência" value={dataForm.reference} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pl-1 pt-4" >
              <InputTextForms id={'city'} label="Cidade" value={dataForm.city} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block w-full sm:w-full md:w-6/12 md:pr-1 pt-4" >
              <InputTextForms id={'state'} label="Estado" value={dataForm.state} onChange={(e) => handleForm(e)} />
            </span>

            <span className="block mr-auto ml-auto sm:w-full md:w-6/12 md:pr-1 pt-4" >
              <Btn onClick={() => sendForm()}><AiFillSave className="inline-block" /> Registrar </Btn>
            </span>
          </Content>
        </div>
      </MainCtnHorizontal>
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
    </>
  );
}