import { useEffect, useState } from 'react';
import NavigationBar from './components/NavigationBar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import Start from './components/Start';

import axios from 'axios';

export default function App() {

    const [page, setPage] = useState(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [member, setMember] = useState({});

    useEffect(() => {

        setPage(<Start setMember={setMember} setPage={setPage} setIsLoggedIn={setIsLoggedIn} />);

    }, []);

    return (

        <div spellCheck='false'>

            {/* <NavigationBar setPage={setPage} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> */}

            <NavigationBar setPage={setPage} member={member} setMember={setMember} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            <MainContent page={page} />

            <Footer />

        </div>
    );
}