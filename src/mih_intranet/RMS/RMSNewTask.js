import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import MainHeader from '../components/MainHeader';
import RMSSidebar from './components/nav/RMSSidebar';
import RMSNewTaskForm from './components/pages/RMSNewTaskForm';

function RMSNewTask() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title> บันทึกความเสี่ยง | MIH Center </title>
      </Helmet>
      <MainHeader onOpenNav={() => setOpen(true)} />
      <RMSSidebar name="newtask" openNav={open} onCloseNav={() => setOpen(false)} />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>บันทึกความเสี่ยง</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">
                <a href="/rmsdashboard">หน้าหลักระบบจัดการความเสี่ยง</a>
              </li>
              <li className="breadcrumb-item my-2">บันทึกความเสี่ยง</li>
            </ol>
          </nav>
        </div>

        {/* <!-- End Page Title --> */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body pt-3">
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                      <RMSNewTaskForm />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default RMSNewTask;
