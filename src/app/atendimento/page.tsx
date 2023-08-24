"use client";
import { useState, useEffect, use } from 'react';
import { MainCtnHorizontal } from '@/components/template/mainctn'
import SideMenu from '@/components/sections//sidemenu'
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import BeneficiarysList from '@/components/sections/beneficiarysList';
import { Btn, BtnR, BtnS } from '@/components/template/btn'
import { AiOutlineCloseCircle, AiOutlineForm, AiOutlineCalendar, AiOutlineClockCircle, AiFillSave } from 'react-icons/ai'
import { BsHouse, BsPeople, BsPersonVcard, BsSearch } from 'react-icons/bs'
import axios from 'axios';
import { InputTextForms, InputTextArea, InputTimeForm, InputCalendarForm, InputSelect } from '@/components/template/input'
import { ModalCTN } from '@/components/template/modal';
import { FiAlertTriangle } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

require('custom-env').env(true)

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;


type DataForm = {
  title: string | null;
  observations: string | null;
  begun: string | null;
  end: string | null;
  type: string | number | null | undefined;
  user: number | null;
  client: number | null | undefined;
  date: string | null;
  status: string | null;
};

const initialData: DataForm = {
  title: '',
  observations: '',
  begun: '',
  end: '',
  type: 'comum',
  user: 1,
  client: null,
  date: formattedDate,
  status: 'pendente',
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

const type_options = [
  { value: 'comum', label: 'comum' },
  { value: 'saúde', label: 'saúde' },
  { value: 'psicológico', label: 'psicológico' },
  { value: 'Multi-atendimentos', label: 'Multi-atendimentos' },
];

const type_options_tag = [
  { value: 'vermelho', label: 'vermelho' },
  { value: 'amarelo', label: 'amarelo' },
  { value: 'verde', label: 'verde' },
  { value: 'azul', label: 'azul' },
];

export default function Service() {

  const [dataForm, setDataForm] = useState<DataForm>(initialData)
  const [serviceType, setServiceType] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState('');

  const pathname = usePathname();
  const parts = pathname.split('/');
  const idx = parts[2];

  const sendForm = async () => {
    console.log('process.env.URL_BEK')
    console.log(process.env.URL_BEK)
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
      } = dataForm;
      
      const clientResponse = await axios.post(
        `${ process.env.URL_BEK }/services`,
        {
          title,
          observations,
          begun,
          end,
          type,
          user,
          date,
          status
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      if (clientResponse.status === 201) {

      } else if (clientResponse.status === 200) {
        setModalMessage(clientResponse.data.message)
        setIsOpen(true)
      }
    } catch (error) {
      setModalMessage(error as string)
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

  const handleFormSelect = (value: string) => {
    const selectedValue = value.trim() !== '' ? value : null;
    let prevDataForm = { ...dataForm, type: selectedValue };
    setDataForm(prevDataForm);
  };

  return (
    <section>
      <MainCtnHorizontal>
        <Header />
        <div id="container-principal" className='flex w-full pt-5'>
          <SideMenu />
          <Content>
            <h1 className='text-3xl pb-4 pt-2'>Atendimento</h1>
            
            <h3 className='text-xl pb-2 pt-4'><AiOutlineForm id="beneficiado-nome" className="inline-block text-blue-500" /> consultar CPF</h3>
            <hr className='mb-2 mt-2' />
            <span className="inline-block sm:w-full md:w-10/12 pt-4 md:pr-1" >
              <InputTextForms id={' '} label="informar CPF" value={dataForm.title} onChange={( ) => {}} />
            </span>
            <span className="inline-block sm:w-full md:w-2/12 pt-4 md:pl-1" >
              <Btn>
                <BsSearch style={{margin: '0 auto'}}/>
              </Btn>
            </span>
            <h3 className='text-xl pb-2 pt-4'><AiOutlineForm id="beneficiado-nome" className="inline-block text-blue-500" /> Informar atendimento</h3>
            <hr className='mb-2 mt-2' />
            <span className="inline-block sm:w-full md:w-8/12 pt-4 md:pr-1" >
              <InputTextForms id={'title'} label="Assunto do atendimento" value={dataForm.title} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block sm:w-full md:w-4/12 md:pl-1" >
              <InputSelect id={'type'} label="Tipo do atendimento" value={dataForm.type} onChange={(e) => handleFormSelect(e)} options={type_options}/>
            </span>
            <span className="inline-block sm:w-full md:w-6/12 md:pr-1 pt-4" >
              <InputTimeForm id={'begun'} label="Hora/Início" value={dataForm.begun} onChange={(e) => handleTimeInput(e, 'begun')} />
            </span>
            <span className="inline-block sm:w-full md:w-6/12 md:pl-1 md:pr-1 pt-4" >
              <InputTimeForm id={'end'} label="Hora/Encerramento" value={dataForm.end} onChange={(e) => handleTimeInput(e, 'end')} />
            </span>
            <span className="inline-block sm:w-full md:w-6/12 md:pl-1 pt-4" >
              <InputCalendarForm label="Dia" value={dataForm.date} onChange={(e) => handleFormCalendar(e)} />
            </span>
            <span className="inline-block sm:w-full md:w-6/12 md:pl-1 pt-4">
              <InputSelect label="Etiqueta"   onChange={(e) => handleFormSelect(e)} options={type_options_tag} />
            </span>
            <span className="inline-block sm:w-full md:w-full pt-2" >
              <InputTextArea id={'observations'} label={'descrição do caso'} onChange={(e) => handleForm(e)} value={dataForm.observations}></InputTextArea>
            </span>
            <span className="inline-block sm:w-full md:w-full pt-2" >
              <InputTextArea id={'observations'} label={'pedido de doação'} onChange={(e) => handleForm(e)} value={dataForm.observations}></InputTextArea>
            </span>
            <h3 className='text-xl pb-2 pt-2 mb-4'><BsPersonVcard id="beneficiado-nome" className="inline-block text-blue-500" /> Pesquisar beneficiado</h3>
            <BeneficiarysList benefeciarys={[]} value={(e) => handleServiceClient(e)} />
            <span className="block mr-auto ml-auto sm:w-full md:w-6/12 md:pr-1 pt-4" >
              <Btn onClick={() => sendForm()} ><AiFillSave className='inline-block' /> Enviar</Btn>
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
          <h1 className="uppercase mb-3 text-lg">{modalMessage}</h1>
        </span>
      </ModalCTN>
    </section>
  );
}