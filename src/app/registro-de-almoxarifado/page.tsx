"use client";
import { AiOutlineForm , AiFillSave } from 'react-icons/ai'
import { MainCtnHorizontal } from '@/components/template/mainctn'
import SideMenu from '@/components/sections/sidemenu'
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import { InputTextForms, InputSelect, InputTextArea, InputText } from '@/components/template/input'
import { Btn } from '@/components/template/btn'
import { useState } from 'react';
import axios from 'axios';

type DataForm = {
  item_id: number | null;
  name: string | null;
  type: string | null;
  observations: string | null;
  mesure_name: string | null;
  quantity: string | null;
};

const initialData: DataForm = {
  item_id: null,
  name: null ,
  type: '' ,
  observations: '' ,
  mesure_name: '' ,
  quantity: null ,
};

export default function warehouseRegister() {
  
  const [dataForm, setDataForm] = useState<DataForm>(initialData)
  const [alertModalSucess, setAlertModalSuccess] = useState(false)
  const [alertModalError, setAlertModalError] = useState(false)

  const sendForm = async () => {
    try {
      const {
        item_id,
        name ,
        type,
        observations,
        mesure_name ,
        quantity ,
      } = dataForm;

      const clientResponse = await axios.post(
        'http://bequegddsooder-env.eba-fas23u33.sa-east-1.elasticbeanstalk.com/itens',
        {
          item_id,
          name ,
          type,
          observations,
          mesure_name ,
          quantity ,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (clientResponse.status === 201) {
        setAlertModalSuccess(true);
        setDataForm(initialData);
      } else {
        setAlertModalError(true);
      }
    } catch (error) {
      console.error(error);
      setAlertModalError(true);
    }
  };

  const handleForm = (value: React.ChangeEvent<HTMLInputElement>) => {
    const index = value.target.id;
    let tempValue = value.target.value;
    let tempData = { ...dataForm }; 

    tempData = { ...tempData, [index]: tempValue };

    setDataForm(tempData);
  };

  // useEffect(() => {

  // }, [])

  return (
    <section>
      <MainCtnHorizontal>
        <Header />
        <div id="container-principal" className='flex pt-5 w-full'>
          <SideMenu />
          <Content>
            <h1 className='text-3xl pb-4 pt-2'>Registro de Almoxarifado</h1>
            <h3 className='text-xl pb-2 pt-4'><AiOutlineForm id="beneficiado-nome" className="inline-block text-blue-500" /> Entrada de produto</h3>
            <hr className='mb-2 mt-2' />
            <span className="inline-block sm:w-full md:w-full pt-4" >
              <InputTextForms id={'name'} label="Nome do Produto"  value={dataForm.name} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block sm:w-full md:w-4/12 pt-2 md:pr-1" >
              <InputTextForms id={'type'} label="Tipo de produto"  value={dataForm.type} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block sm:w-full md:w-4/12 pt-2 md:pr-1 md:pl-1"  >
              <InputTextForms  id={'mesure_name'} label={'Nome da Medida'} value={dataForm.mesure_name} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block sm:w-full md:w-4/12 pt-2 md:pl-1" >
              <InputTextForms id={'quantity'} label={'Quantidade'}  value={dataForm.quantity} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block w-full pt-2" >
              <InputTextArea id={'observations'} label={'observações'}  value={dataForm.observations} onChange={(e) => handleForm(e)}  />
            </span>
            <span className="inline-block sm:w-full md:w-3/12 pt-4" >
              <Btn onClick={() => sendForm( )}><AiFillSave  className='inline-block' /> Enviar</Btn>
            </span>
          </Content>
        </div>
      </MainCtnHorizontal>
    </section>
  );
}