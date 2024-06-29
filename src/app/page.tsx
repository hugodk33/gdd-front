import { redirect } from 'next/navigation'

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col content-center justify-center align-center items-center h-full flex-wrap p-24">
        {redirect('/login')}
    </main>
  );
}