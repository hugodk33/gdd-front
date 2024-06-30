"use client";
import { useState } from 'react';
import { MainCtnHorizontal } from '@/components/template/mainctn'
import SideMenu from '@/components/sections//sidemenu'
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import BeneficiarysList from '@/components/sections/beneficiarysList';
import { Btn, BtnR  } from '@/components/template/btn'
import { AiOutlineCloseCircle, AiOutlineForm, AiOutlineCalendar, AiFillSave, AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'
import { BsPersonVcard, BsSearch } from 'react-icons/bs'
import axios from 'axios';
import { InputTextForms, InputTextArea, InputTimeForm, InputCalendarForm, InputSelect } from '@/components/template/input'
import { ModalCTN } from '@/components/template/modal';
import { FiAlertTriangle, FiEdit } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import transformDateFormat from '@/helpers/dataFormat';
import {  BiMap, BiUserPlus } from 'react-icons/bi';
import Link from 'next/link';
import AuthCheck from '@/components/authCheck/authcheck';

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;


type DataForm = {
  title?: string | null;
  observations?: string | null;
  begun?: string | null;
  end?: string | null;
  type?: string | number | null | undefined;
  user?: string | null | undefined;
  client?: number | string | null | undefined;
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
  type: 'comum',
  user: '',
  client: '',
  date: formattedDate,
  status: 'pendente',
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
  user: '',
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
  const [serviceType, setServiceType] = useState<string[]>([])
  const [CPF, setCPF] = useState<string>()
  const [clientCPF, setClientCPF] = useState<Client>({})
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isCPF, setIsCPF] = useState(false)
  const [isClientFromCPF, setIsClientFromCPF] = useState(false)
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState('');
  const [fieldsUpdated, setFieldsUpdated] = useState(0);

  const pathname = usePathname();
  const parts = pathname.split('/');
  const idx = parts[2];

  const sendForm = async () => {
    let token = localStorage.getItem('trotsk')
    try {
      const {
        title,
        observations,
        begun,
        end,
        type,
        user,
        date,
        status,
        tag,
        order,
        client
      } = dataForm;
      let user_id = localStorage.getItem('user_id')
      const clientResponse = await axios.post(
        `http://back.ongprograma.org/services`,
        {
          title,
          observations,
          begun,
          end,
          type,
          user: user_id,
          date,
          status,
          tag,
          order,
          client
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'bearer ' + token
          },
        }
      );
      setModalMessage('atendimento criado')
      setFieldsUpdated(fieldsUpdated + 1)
      setIsOpen(true)
      if (clientResponse.data.status === 200) {
        setModalMessage(clientResponse.data.message)
        setIsOpen(true)
        setFieldsUpdated(fieldsUpdated + 1)
      }
    } catch (error) {
      setModalMessage(error as string)
      setIsOpen(true)
    }
  };

  const sendFormCPF = async () => {
    let token = localStorage.getItem('trotsk')
    try {
      const response = await axios.get(`http://back.ongprograma.org/clients/cpf`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': "bearer " + token
        },
        params: {
          id: CPF,
          perPage: 10,
          page: 1,
        }
      });
      if (response.status === 201) {
        setModalMessage(response.data.message)
        setClientCPF(response.data.client.data[0])
        setIsOpen(true)
        setIsCPF(true)
      } else if (response.status === 200) {
        setModalMessage(response.data.message)
        setClientCPF(response.data.client.data[0])
        setIsOpen(true)
        setIsCPF(true)
      } else if (response.status === 404) {
        setModalMessage('CPF não cadastrado')
        setIsOpen(true)
      }

    } catch (error) {
      setModalMessage('CPF não cadastrado')
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

  const handleCPF = (value: React.ChangeEvent<HTMLInputElement>) => {
    const index = value.target.id;
    setCPF(value.target.value as string);
  };

  const handleTimeInput = (event: React.ChangeEvent<HTMLInputElement>, idx: string) => {
    const value = event;
    if (value !== undefined) {
      let tempData = { ...dataForm };
      tempData = { ...tempData, [idx]: value };
      setDataForm(tempData);
    }
  };

  const inserClientFromSearchOfCPF = () => {
    let tempData = { ...dataForm };
    tempData = { ...tempData, ['client']: clientCPF.client_id };
    setDataForm(tempData);
    setIsClientFromCPF(true)
    closeModal()
  };

  const removeClientFromSearchOfCPF = () => {
    let tempData = { ...dataForm };
    tempData = { ...tempData, ['client']: '' };
    setDataForm(tempData);
    setIsClientFromCPF(false)
    setClientCPF({})
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

  return (
    <section>
      <AuthCheck>
        <MainCtnHorizontal>
          <Header />
          <div id="container-principal" className='flex w-full pt-5'>
            <SideMenu />
            <Content>
              <h1 className='text-3xl pb-2 pt-2'>Atendimento</h1>
              <h3 className='text-xl pb-2 pt-4'><AiOutlineForm id="beneficiado-nome" className="inline-block text-blue-500" /> Consultar CPF</h3>
              <hr className='mb-2 mt-2' />
              <span className="inline-block w-full sm:w-full md:w-10/12 pt-4 md:pr-1" >
                <InputTextForms id={'CPF'} label="informar CPF" value={CPF} onChange={(e) => handleCPF(e)} />
              </span>
              <span className="inline-block w-full sm:w-full md:w-2/12 pt-4 md:pl-1" >
                <Btn onClick={() => sendFormCPF()}>
                  <BsSearch style={{ margin: '0 auto' }} />
                </Btn>
              </span>
              <h3 className='text-xl pb-2 pt-4'><AiOutlineForm id="beneficiado-nome" className="inline-block text-blue-500" /> Informar atendimento</h3>
              <hr className='mb-2 mt-2' />
              <span className="inline-block w-full sm:w-full md:w-8/12 pt-4 md:pr-1" >
                <InputTextForms id={'title'} label="Assunto do atendimento" value={dataForm.title} onChange={(e) => handleForm(e)} />
              </span>
              <span className="inline-block w-full sm:w-full md:w-4/12 md:pl-1" >
                <InputSelect id={'type'} label="Tipo do atendimento" value={dataForm.type} onChange={(e) => handleFormSelect(e, 'type')} options={type_options} key={fieldsUpdated} />
              </span>
              <span className="inline-block w-full sm:w-full md:w-4/12 md:pr-1 pt-2" >
                <InputTimeForm id={'begun'} label="Hora/Início" value={dataForm.begun} onChange={(e) => handleTimeInput(e, 'begun')} />
              </span>
              <span className="inline-block w-full sm:w-full md:w-4/12 md:pr-1 pt-2" >
                <InputCalendarForm id={'date'} label="Dia" value={dataForm.date} onChange={(e) => handleFormCalendar(e)} key={fieldsUpdated} />
              </span>
              <span className="inline-block w-full sm:w-full md:w-4/12 md:pl-1 pt-2">
                <InputSelect id={'tag'} label="Etiqueta" onChange={(e) => handleFormSelect(e, 'tag')} options={type_options_tag} key={fieldsUpdated} value={dataForm.tag} />
              </span>
              <br /><br />
              <span className="inline-block w-full sm:w-full md:w-full pt-2" >
                <InputTextArea id={'observations'} label={'descrição do caso'} onChange={(e) => handleForm(e)} key={fieldsUpdated}>
                  {
                    dataForm.observations
                  }
                </InputTextArea>
              </span>
              <br />
              <span className="inline-block w-full sm:w-full md:w-full pt-4" >
                <InputTextArea id={'order'} label={'pedido de doação'} onChange={(e) => handleForm(e)} key={fieldsUpdated}>
                  {
                    dataForm.order
                  }
                </InputTextArea>
              </span>
              <h3 className='text-xl pb-2 pt-2 mb-4'><BsPersonVcard id="beneficiado-nome" className="inline-block text-blue-500" /> Pesquisar beneficiado</h3>
              {!isClientFromCPF ?
                <BeneficiarysList benefeciarys={[]} value={(e) => handleServiceClient(e)} />
                :
                <div className="flex w-full flex-row text-4xl mb-10">
                  <div className="flex flex-col w-10/12 pr-2 pl-2">
                    <span style={{ fontSize: 16 }}>{clientCPF.name}</span>
                    <p className='flex items-center gap-1 ' style={{ fontSize: 16, height: 25 }}>
                      <span className="text-blue-500 bold" style={{ fontSize: 16 }}>
                        CPF
                      </span>
                      {clientCPF.CPF ? clientCPF.CPF : ' --- '}
                      <span className="text-blue-500 bold" style={{ fontSize: 16 }}>
                        RG
                      </span>
                      {clientCPF.RG ? clientCPF.RG : ' --- '}
                    </p>
                    <p className='flex gap-2 items-center ' style={{ fontSize: 18 }}>
                      <span className="text-blue-500 ">
                        <BiMap style={{ fontSize: 16 }} />
                      </span>
                      {clientCPF.street ? clientCPF.street : ' --- '}
                      {' , '}
                      {clientCPF.number ? clientCPF.number : ' --- '}
                      {' , '}
                      {clientCPF.neighborhood ? clientCPF.neighborhood : ' --- '}
                      {' , '}
                      {clientCPF.CEP ? clientCPF.CEP : ' --- '}
                    </p>
                    <hr />
                    <p className='flex gap-2 items-center' style={{ fontSize: 18 }}>
                      <span className="text-blue-500 bold" style={{ fontSize: 18 }}>
                        {"ID"}
                      </span>
                      {clientCPF.client_id ? clientCPF.client_id : ' --- '}

                      <span className="text-blue-500">
                        <AiOutlineCalendar style={{ fontSize: 30 }} />
                      </span>
                      {clientCPF.birthday ? transformDateFormat(clientCPF.birthday as string) : ' --- '}
                    </p>
                  </div>
                  <div className="flex flex-row-reverse w-2/12">
                    <BtnR onClick={() => removeClientFromSearchOfCPF()}>
                      <AiOutlineCloseCircle className="pt-2" style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: 40, paddingTop: 0 }} />
                    </BtnR>
                  </div>
                  <hr />
                </div>
              }
              <span className="block mr-auto ml-auto sm:w-full md:w-6/12 md:pr-1 pt-4" >
                <Btn onClick={() => sendForm()} ><AiFillSave className='inline-block' /> Enviar</Btn>
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
              <h1 className=" mb-3 text-center text-md text-blue-500">RESULTADO PARA A BUSCA DE CPF</h1>
              <hr className="w-full" />
              <span className='block text-xl w-full flexmax-w-full sm:w-full mt-4 mb-4'>
                <h1 className='text-3xl mt-1 text-center '>{clientCPF?.name}</h1>
                <h1 className='block text-2xl bolder' style={{ fontSize: 18 }}>{clientCPF?.genre}</h1>
                <span className='flex flex-col items-center gap-2 mt-1 mb-1' style={{ fontSize: 12 }}>
                  <h1 className='block bold' style={{ fontSize: 19 }}>CPF: {clientCPF?.CPF} | </h1>
                  <h1 className='block semibold' style={{ fontSize: 19 }}>RG: {clientCPF?.RG}</h1>
                </span>
                <span className='flex items-center gap-2 mt-1 mb-1' style={{ fontSize: 12, height: 25 }}>
                  <span className="text-blue-500 font-thin">
                    <AiOutlinePhone style={{ fontSize: 20 }} />
                  </span>
                  <h1 className='block' style={{ fontSize: 19 }}>{clientCPF?.phone ? clientCPF?.phone : ' --- '}</h1>
                </span>
                <span className='flex items-center gap-2 mt-1 mb-1' style={{ fontSize: 19, height: 25 }}>
                  <span className="text-blue-500 font-thin">
                    <AiOutlineMail style={{ fontSize: 20 }} />
                  </span>
                  <h1 className='block' style={{ fontSize: 19 }}>{clientCPF?.email ? clientCPF?.email : ' --- '}</h1>
                </span>
              </span>
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
              <span className="flex flex-col content-center mt-4">
                <span className='flex w-full md:pl-1 mt-2 pt-4'>
                  <button onClick={() => inserClientFromSearchOfCPF()} className="btn-p items-center flex rounded-md justify-center border-2 border-gray-500 text-gray  font-semibold  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-full">
                    <BiUserPlus style={{ fontSize: '24px' }} className='inline-block' />
                    INSERIR BENEFICIADO
                  </button>
                </span>
                <span className='flex w-full md:pl-1 mt-2 pt-4'>
                  <Link className='btn-p w-full items-center block text-white font-semibold  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 mr-auto ml-auto' href={`/beneficiado/${clientCPF.client_id}`}>
                    <FiEdit style={{ fontSize: 20, marginTop: 4, display: 'inline' }} />
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