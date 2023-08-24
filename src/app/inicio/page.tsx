import { MainCtnHorizontal } from '@/components/template/mainctn'
import SideMenu from '@/components/sections/sidemenu'
import Content from '@/components/sections/content';
import Header from '@/components/sections/header';

export default function DashboardLayout() {
  return (
    <section>
      <MainCtnHorizontal>
        <Header />
        <div className='flex w-full pt-5'>
          <SideMenu />
          <Content>
            <h1>dashboard</h1>
          </Content>
        </div>
      </MainCtnHorizontal>
    </section>
  );
}