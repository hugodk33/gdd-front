import logoTotal  from '../../../logos/logo-total.png'
import Image from 'next/image'

export function MainCtn({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="flex min-h-screen flex-col items-center h-full justify-between content-center flex-wrap p-24" style={{backgroundImage: `url(${logoTotal})`}}>
            {children}
            <Image src={logoTotal} alt='logo'/>
        </main>
    )
}

export function MainCtnHorizontal({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="flex content-start min-h-screen h-full content-top flex-wrap" style={{backgroundImage: `url(${logoTotal})`}}>
            {children}
        </main>
    )
}