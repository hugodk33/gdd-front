import Link from 'next/link';
import { MdPersonSearch , MdContentPasteSearch , MdPersonAddAlt, MdPersonAdd , MdHouse , MdDiversity3 } from 'react-icons/md'

export default function SideMenu( ) {
    return (
      <section id='side-menu' className='sm:w-full md:w-3/12 uppercase gap-2 flex rounded' style={{maxHeight: 770}}>
        <ul className='flex flex-col rounded gap-3'>
            {/* <li>
                <Link href="/inicio" className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'><MdHouse className="inline-block" /> Home</Link>
            </li> */}
            {/* <span className='text-md font-bold uppercase mt-4'>beneficiados</span>
            <hr /> */}
            <li >
                <Link href="/atendimento" className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'><MdDiversity3 className="inline-block" /> Atendimento</Link>
            </li>
            <li>
                <Link href="/pesquisa-de-atendimentos" className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'><MdHouse className="inline-block" /> Ver atendimentos</Link>
            </li>
            {/* <span className='text-md font-bold uppercase mt-4'>beneficiados</span>
            <hr /> */}
            <li >
                <Link href="/registro-de-beneficiado" className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'><MdPersonAdd className="inline-block" /> Cadastro de beneficiado</Link>
            </li>
            <li  className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'>
                <Link href="/pesquisa-de-beneficiados"><MdPersonSearch className="inline-block" /> Consulta de beneficiados</Link>
            </li>
            {/* <span className='text-md font-bold uppercase mt-4'>endereço</span>
            <hr /> */}
            <li >
                <Link href="/registro-de-beneficiado" className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'><MdPersonAdd className="inline-block" /> Cadastro de endereço</Link>
            </li>
            <li>
                <Link href="/pesquisa-de-beneficiados" className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'><MdPersonSearch className="inline-block" /> Consulta de endereços</Link>
            </li>
            {/* <li >
                <Link href="/registro-de-beneficiado" className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'><MdPersonAdd className="inline-block" /> Cadastro de famílias</Link>
            </li>
            <li >
                <Link href="/pesquisa-de-beneficiados" className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'><MdPersonSearch className="inline-block" /> Consulta de famílias</Link>
            </li>
            {/* <span className='text-md font-bold uppercase mt-4'>estoque</span>
            <hr /> */}
            {/* <li >
                <Link href="/registro-de-almoxarifado" className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'><MdPersonAddAlt className="inline-block" /> Cadastro de produtos</Link>
            </li>
            <li >
                <Link href="/pesquisa-de-almoxarifado" className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'><MdContentPasteSearch className="inline-block"/> Consulta de produtos</Link>
            </li>  */}
        </ul>
      </section>
    )
}