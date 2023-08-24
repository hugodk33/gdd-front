"use client";
import { MainCtnHorizontal } from '@/components/template/mainctn'
import SideMenu from '@/components/sections/sidemenu'
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';
import { InputSelect, InputTextForms } from '@/components/template/input'
import { Btn, BtnRS } from '@/components/template/btn'
import { useEffect, useState } from 'react';
import Pagination from '@/components/template/pagination';
import { FiEdit } from 'react-icons/fi';
import axios from 'axios';

type Itens = {
  item_id: number | null;
  name: string | null;
  type: string | null;
  observations: string | null;
  mesure_name: string | null;
  quantity: string | null;
};

const initialData: Itens = {
  item_id: null,
  name: null ,
  type: '' ,
  observations: '' ,
  mesure_name: '' ,
  quantity: null ,
};

export default function warehouseSearch() {
  const [searchItemValue, setSearchItemValue] = useState<string>('')
  //const [modalIsOpen, setModalIsOpen] = useState(false)
  //const [modalType, setModalType] = useState('search')
  const [itens, setItens] = useState<Itens[]>([])
  const [isSearch, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  const searchService = async () => {
    try {
      const response = await axios.get(`http://bequegddsooder-env.eba-fas23u33.sa-east-1.elasticbeanstalk.com/itens/search`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        params: {
          name: searchItemValue,
          perPage: 10,
          page: 1,
        }
      });
      setTotal(response.data.totalResults)
      setItens(response.data.data)
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
    setSearchItemValue(tempValue)
  };

  useEffect(() => {
    searchService();
  }, [currentPage])

  return (
    <section>
      <MainCtnHorizontal>
        <Header />
        <div id="container-principal" className='flex pt-5 w-full'>
          <SideMenu />
          <Content>
            <h1 className='text-3xl pb-4 pt-2'>Pesquisar  no Almoxarifado</h1>
            <hr className='mb-2 mt-4' />
            <span className="inline-block sm:w-full md:w-10/12 pr-2" >
              <InputTextForms label={'Digite sua busca'} value={searchItemValue} onChange={(e) => handleForm(e)} />
            </span>
            <span className="inline-block sm:w-full md:w-2/12 mt-2" >
              <Btn onClick={() => searchService()}>Buscar</Btn>
            </span>
            {
              isSearch ?
              itens.length > 0 ?
                  <ul className="flex flex-col p-4 gap-3 rounded mb-5 mt-5">
                    {itens.map((a, b) => (
                      <li key={'key-bottom-' + b} className='flex flex-row text-4xl w-full'>
                        <span className='custom-svg w-1/12'>
                          <svg
                            stroke='currentColor'
                            fill='currentColor'
                            strokeWidth='1'
                            viewBox='0 0 24 24'
                            height='1em'
                            width='1em'
                            xmlns='http://www.w3.org/2000/svg'
                            className='text-gray text-md mr-7 mt-2'
                          >
                            <path fill='none' stroke='' strokeWidth='1' d='M2.99787498,0.999999992 L17.4999998,0.999999992 L20.9999998,4.50000005 L21,23 L3,23 L2.99787498,0.999999992 Z M16,1 L16,6 L21,6 M7.5,15 L10.5,18 L16.5,12'></path>
                          </svg>
                        </span>
                        <span className='w-10/12'>
                          <p className='text-2xl'>{a.name}</p>
                          {/* <p className='text-sm uppercase font-semibold'>
                            <span className="text-blue-500 font-thin">{"ID " + " #"}</span> {a.client_id} <span className="text-blue-500 font-thin">  - Dia: </span> {transformDateFormat(a.birthday as string)}  <span className="text-blue-500 font-thin">- Início:"</span>
                          </p> */}
                        </span>
                        <span className='flex flex-row-reverse w-1/12'>
                          <BtnRS href={`/beneficiado/${a.item_id}`}>
                            <FiEdit style={{ fontSize: '24px', marginTop: '8px' }} />
                          </BtnRS>
                        </span>
                      </li>
                    ))}
                  </ul>
                  : (
                    <p>Nenhum atendimento encontrado.</p>
                  ) : null

            }
            {
              isSearch ?
                <ul className="flex flex flex-col p-4 gap-3 rounded mb-5 mt-5">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={(Math.ceil(total / 10))}
                    onPageChange={handlePageChange}
                  />
                </ul>
                : null
            }

              {/* <li key={'key-bottom-'} className="flex flex-row text-4xl w-full">
                <span className='w-8/12'>
                  <p className='text-2xl'>Pessoas em situação de risco em local tal</p>
                  <p className='text-sm uppercase font-semibold'>11/11/11 - 2 pessoas em uma casa - <b className='text-blue-500'>DESPACHADO</b></p>
                </span>
                <span className='flex flex-row-reverse w-3/12'>
                  <button className="flex rounded-full justify-center bg-gray-100 drop-shadow-md w-10 h-10 text-gray mr-2 ml-4" >
                    <BsTrash style={{ fontSize: '24px', marginTop: '8px' }} />
                  </button>
                  <button className="flex rounded-full justify-center bg-gray-100 drop-shadow-md w-10 h-10 text-gray" >
                    <BsEye style={{ fontSize: '24px', marginTop: '8px' }} />
                  </button>
                </span>
              </li> */}
              {/* <hr />
              <li key={'key-bottom-'} className="flex flex-row text-4xl w-full">
                <span className='w-8/12'>
                  <p className='text-2xl'>Família precisando fazer festa de 15 anos</p>
                  <p className='text-sm uppercase font-semibold'>11/11/11 - 1 pessoas em uma casa - <b className='text-rose-500'>PENDENTE</b></p>
                </span>
                <span className='flex flex-row-reverse w-3/12'>
                  <button className="flex rounded-full justify-center bg-gray-100 drop-shadow-md w-10 h-10 text-gray mr-2 ml-4" >
                    <BsTrash style={{ fontSize: '24px', marginTop: '8px' }} />
                  </button>
                  <button className="flex rounded-full justify-center bg-gray-100 drop-shadow-md w-10 h-10 text-gray" >
                    <BsEye style={{ fontSize: '24px', marginTop: '8px' }} />
                  </button>
                </span>
              </li> */}
              {/* <hr /> */}
          </Content>
        </div>
      </MainCtnHorizontal>
    </section>
  );
}