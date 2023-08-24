'use client'
import { useState } from 'react';
import { BsPersonVcard } from 'react-icons/bs';
import { AiFillSave } from 'react-icons/ai';
import { MainCtnHorizontal } from '@/components/template/mainctn';
import SideMenu from '@/components/sections/sidemenu';
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import { Btn } from '@/components/template/btn';
type DataForm = {
  name: string | null;
  birthday: string | null;
  RG: number | null;
  CPF: number | null;
  maritial_status: string | number | null | undefined;
  kinship: number | null;
  email: string | null;
  phone: number | null;
};

const initialData: DataForm = {
  name: null,
  birthday: null,
  RG: null,
  CPF: null,
  maritial_status: 'solteiro(a)',
  kinship: null,
  email: null,
  phone: null,
};

// const maritial_status_options = [
//   { value: 'solteiro(a)', label: 'solteiro(a)' },
//   { value: 'casado(a)', label: 'casado(a)' },
//   { value: 'divorciado(a)', label: 'divorciado(a)' },
//   { value: 'separado(a)', label: 'separado(a)' },
// ];

export default function ClientEditForm() {
//   const router = useRouter();
//   const { id } = router.query;
  const [dataForm, setDataForm] = useState<DataForm>(initialData);
  const [alertModalSucess, setAlertModalSuccess] = useState(false);
  const [ , setAlertModalError] = useState(false);

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
      // Lógica para enviar o formulário atualizado
      // ...
      setAlertModalSuccess(true);
    } catch (error) {
      console.error(error);
      setAlertModalError(true);
    }
  };

  const isFormValid = () => {
    if (
      !dataForm.name ||
      !dataForm.RG ||
      !dataForm.CPF ||
      !dataForm.phone
    ) {
      return false;
    }

    return true;
  };

  return (
    <MainCtnHorizontal>
      <Header />
      <div id="container-principal" className='flex pt-5 w-full'>
        <SideMenu />
        <Content>
          <h1 className='text-3xl pb-2 pt-2'>Edição de Beneficiado:</h1>
          <h3 className='text-xl pb-2 pt-2'>
            <BsPersonVcard className='inline-block text-blue-500' /> Dados Pessoais
          </h3>
          <hr className='mb-2 mt-4' />
          <span className='block mr-auto ml-auto sm:w-full md:w-8/12 md:pr-1 pt-4'>
            <Btn
              onClick={() => sendForm()}
            >
              <AiFillSave className='inline-block' /> Salvar
            </Btn>
          </span>
        </Content>
      </div>
    </MainCtnHorizontal>
  );
}  