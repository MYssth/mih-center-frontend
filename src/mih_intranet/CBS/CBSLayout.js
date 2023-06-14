import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MainHeader from '../layouts/MainHeader';
import CBSSidebar from './components/Sidebar';

function CBSLayout() {

    const [open, setOpen] = useState(false);

    return (
        <>
            <MainHeader onOpenNav={() => setOpen(true)} />

            <CBSSidebar name="dashboard" openNav={open} onCloseNav={() => setOpen(false)} />

            <Outlet />

        </>
    )
}

export default CBSLayout