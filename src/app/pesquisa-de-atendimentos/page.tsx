'use client'

import { MainCtnHorizontal } from '@/components/template/mainctn'
import SideMenu from '@/components/sections/sidemenu'
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import { FiEdit } from 'react-icons/fi';
import { BsClipboardData, BsClipboardMinus, BsPersonVcard } from 'react-icons/bs';
import { InputTextForms } from '@/components/template/input';
import { Btn, BtnRS } from '@/components/template/btn';
import { useEffect, useState } from 'react';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai';

import axios from 'axios';
import Pagination from '@/components/template/pagination';
import transformDateFormat from '@/helpers/dataFormat'

interface Service {
  service_id?: number | null | undefined;
  title?: string | null;
  observations?: string | null;
  client?: number | null;
  user?: number | null;
  begun?: string | null;
  end?: string | null;
  type?: string | null;
  date?: string | null;
}

const initialData: Service = {
  service_id: null,
  title: '',
  observations: '',
  client: null,
  user: null,
  begun: '',
  end: '',
  type: null,
  date: ''
};

export default function ServiceSearch() {

  const [searchServiceValue, setSearchServiceValue] = useState<string>('')
  //const [modalIsOpen, setModalIsOpen] = useState(false)
  //const [modalType, setModalType] = useState('search')
  const [services, setServices] = useState<Service[]>([])
  const [isSearch, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const searchService = async () => {
    try {
      const response = await axios.get(`http://bequegddsooder-env.eba-fas23u33.sa-east-1.elasticbeanstalk.com/services/search/1`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        params: {
          perPage: 10,
          page: currentPage,
        }
      });
      setTotal(response.data.services.total)
      setServices(response.data.services.data)
      setIsSearch(true)
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleForm = (value: React.ChangeEvent<HTMLInputElement>) => {
    let tempValue = value.target?.value;
    setIsSearch(false)
    setSearchServiceValue(tempValue)
  };

  useEffect(() => {
    searchService();     
  },[currentPage])

  return (
    <section>
      <MainCtnHorizontal>
        <Header />
        <div id="container-principal" className='flex pt-5 w-full'>
          <SideMenu />
          <Content>
            <h1 className='text-3xl pb-4 pt-2'>Pesquisar Atendimentos</h1>
            <hr className='mb-2 mt-4' />
            <span className="inline-block sm:w-full md:w-10/12 pr-2" >
              <InputTextForms label={'Digite sua busca'} value={searchServiceValue} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block sm:w-full md:w-2/12 mt-2" >
              <Btn onClick={() => searchService()}>Buscar</Btn>
            </span>
            {
                services.length > 0 ?
                  <ul className="flex flex-col p-4 gap-3 rounded mb-5 mt-5">
                    {services.map((a, b) => (
                      <li key={'key-bottom-' + b} className='flex flex-row text-4xl w-full border-b-2 border-gray-100 mb-7 pb-3'>
                        <span className='custom-svg w-1/12'>
                          <BsClipboardData />
                        </span>
                        <span className='w-10/12'>
                          <p className=' bold mb-3' style={{fontSize: 26}}>{a.title}</p>
                          <p className='gap-1 flex flex-row items-center uppercase align-center items-center' style={{fontSize: 20}}>
                            <span className="text-blue-500 font-thin">
                              <BsPersonVcard style={{fontSize: 20}}/>
                            </span> 
                              {a.service_id} 
                            <span className="text-blue-500 font-thin">  
                              <AiOutlineCalendar style={{fontSize: 20}}/> 
                            </span> 
                              {transformDateFormat(a.date as string)} 
                            <span className="text-blue-500 font-thin">
                               <AiOutlineClockCircle style={{fontSize: 20}}/>
                            </span>
                              {a.begun}  
                            <span className="text-blue-500 font-thin"> 
                              -
                            </span>
                              {a.end}
                          </p>
                        </span>
                        <span className='flex flex-row-reverse w-1/12'>
                          <BtnRS href={`/atendimento/despacho/${a.service_id}`}>
                            <FiEdit style={{ fontSize: '24px', marginTop: '8px' }} />
                          </BtnRS>
                        </span>
                      </li>
                    ))}
                  </ul>
                  : (
                    <p>Nenhum atendimento encontrado.</p>
                  )
            }           
            {
              services.length > 0 ?
                <ul className="flex flex flex-col p-4 gap-3 rounded mb-5 mt-5">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={(Math.ceil(total / 10))}
                    onPageChange={handlePageChange}
                  />
                </ul>
                : null
            }
          </Content>
        </div>
      </MainCtnHorizontal>
    </section>
  );
}