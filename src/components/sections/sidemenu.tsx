import Link from 'next/link';
import { MdPersonSearch , MdPersonAdd , MdHouse , MdDiversity3 } from 'react-icons/md'

export default function SideMenu( ) {
    return (
      <section id='side-menu' className='md:flex md:w-3/12  gap-2 rounded mb-3' style={{maxHeight: 770}}>
        <ul className='flex flex-col rounded gap-3'>
            <li >
                <Link href="/atendimento" className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'><MdDiversity3 className="inline-block" /> Atendimento</Link>
            </li>
            <li>
                <Link href="/pesquisa-de-atendimentos" className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'><MdHouse className="inline-block" /> Ver atendimentos</Link>
            </li>
            <li >
                <Link href="/registro-de-beneficiado" className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'><MdPersonAdd className="inline-block" /> Cadastro de beneficiado</Link>
            </li>
            <li >
                <Link href="/pesquisa-de-beneficiados"  className='text-md uppercase py-4 px-4 rounded-md bg-white w-full'><MdPersonSearch className="inline-block" /> Consulta de beneficiados</Link>
            </li>
        </ul>
      </section>
    )
}