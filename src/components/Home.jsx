import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, Col, Container, Form, Image, Modal, Pagination, Row } from 'react-bootstrap';
import EditPictureModal from './EditPictureModal';
import arnold from '../assets/arnold.jpg';
import woman from '../assets/woman.jpg';
import man from '../assets/man.jpg';
import axios from 'axios';
import OtherMemberHome from './OtherMemberHome';

function Home(props) {

    const [ages, setAges] = useState([]);

    const [countries, setCountries] = useState([]);

    const [country, setCountry] = useState('any');

    const [searchResults, setSearchResults] = useState([]);

    const [showColumns, setShowColumns] = useState(false)

    const [showModal, setShowModal] = useState(false);

    const [showSearchResults, setShowSearchResults] = useState(false);

    const [theirGender, setTheirGender] = useState('any');

    const [myGender, setMyGender] = useState('any');

    const [toAge, setToAge] = useState(null);

    const [fromAge, setFromAge] = useState(null);

    const member = props.member;

    const searchResultRef = useRef();

    useEffect(() => {

        const ages_a = [];

        for (let age_i = 18; age_i < 100; ++age_i) {

            ages_a.push(age_i);
        }

        setAges(ages_a);

        createCountryNames();

    }, []);

    function createCountryNames() {

        axios.get('https://healthysingles4you2.com/api/countries.json')

            .then(function (response_o) {

                if (response_o.status === 200) {

                    const countries_a = [];

                    for (const country_o of response_o.data) {

                        countries_a.push(country_o.name.common);
                    }

                    countries_a.sort();

                    setCountries(countries_a);
                }
            });
    }

    function search(e) {

        e.stopPropagation();
        e.preventDefault();

        const params_o = {
            fields: 'firstname,lastname,country,birthdate,gender',
            mygender: member.gender
        };

        if (toAge) {
            params_o.frombirthdate = getPastDateISO(toAge);
        }

        if (fromAge) {
            params_o.tobirthdate = getPastDateISO(fromAge);
        }

        if (theirGender !== 'any') {
            params_o.theirgender = theirGender;
        }

        if (country !== 'any') {
            params_o.country = country;
        }

        axios.get('https://healthysingles4you2.com/api/members/', {
            params: params_o
        })
            .then(function (response_o) {

                if (response_o.status === 200) {
                    
                    setSearchResults(response_o.data);
                    setShowSearchResults(true);
                    window.scrollTo(0, 0);
                    searchResultRef.current.scrollTo(0, 0);
                }
            });
    }

    function getPastDateISO(yearsInPast) {
        // Get the current date
        const currentDate = new Date();

        // Subtract the specified number of years from the current date
        currentDate.setFullYear(currentDate.getFullYear() - yearsInPast);

        // Return the date as an ISO string
        return currentDate.toISOString().substring(0, 10);
    }

    function updateProfilePicture() {

        setShowModal(true);
    }

    function calculateAge(isoDate_s) {

        const birthDate = new Date(isoDate_s);
        const currentDate = new Date();
        const difference = currentDate - birthDate;
        const currentAge = Math.floor(difference / 31557600000); // Divide by 1000*60*60*24*365.25
        return currentAge;
    }

    return (

        <Container className='mt-3'>

            <Row xs={1} sm={1} md={1} lg={3}>

                {!showSearchResults && <><Col className='mb-3'>

                    <Card style={{ height: '376px' }}>

                        <Card.Header className='card-header'>

                            Hi {member.firstname}!

                        </Card.Header>

                        <Card.Body>

                            <div className='d-block'>

                                <Image onClick={updateProfilePicture} style={{ cursor: 'pointer', width: '130px', display: 'inline-block', float: 'left' }} src={'https://healthysingles4you2.com/api/profilepictures/?id=' + member.id + '&gender=' + member.gender + '&cachebuster=' + Math.random()} rounded />

                                <div className='d-grid ps-2'>

                                    <h6 style={{ paddingLeft: '8px', marginBottom: '0', fontSize: '12px' }}>Profile Status</h6>

                                    <Button className='button' size='sm' type='button' variant='success'><span>✔</span> VISIBLE</Button>

                                    <h6 style={{ paddingLeft: '8px', marginBottom: '0', fontSize: '12px' }}>Online Status</h6>

                                    <Button className='button' size='sm' type='button' variant='success'><span>✔</span> AVAILABLE</Button>

                                    <h6 style={{ paddingLeft: '8px', marginBottom: '0', fontSize: '12px' }}>Membership</h6>

                                    <Button className='button' size='sm' type='button' variant='success'><span>✔</span> REGULAR</Button>

                                </div>

                            </div>

                            <div className='d-block mt-5'>

                                <i className='bi bi-envelope fs-3' style={{ cursor: 'pointer' }}></i>

                                <Badge pill bg='danger' className='position-relative' style={{ cursor: 'pointer', fontSize: '10px', left: '-10px', top: '-15px' }}>
                                    3
                                </Badge>

                                <i className='bi bi-hand-thumbs-up fs-3' style={{ cursor: 'pointer' }}></i>

                                <Badge pill bg='danger' className='position-relative' style={{ cursor: 'pointer', fontSize: '10px', left: '-10px', top: '-15px' }}>
                                    2
                                </Badge>

                                <i className='bi bi-heart fs-3' style={{ cursor: 'pointer' }}></i>

                                <Badge pill bg='danger' className='position-relative' style={{ cursor: 'pointer', fontSize: '10px', left: '-10px', top: '-15px' }}>
                                    1
                                </Badge>

                                <i className='bi bi-star fs-3' style={{ cursor: 'pointer' }}></i>

                                <Badge pill bg='danger' className='position-relative' style={{ cursor: 'pointer', fontSize: '10px', left: '-10px', top: '-15px' }}>
                                    5
                                </Badge>

                                <i className='bi bi-search fs-3' style={{ cursor: 'pointer' }}></i>

                                <Badge pill bg='danger' className='position-relative' style={{ cursor: 'pointer', fontSize: '10px', left: '-10px', top: '-15px' }}>
                                    3
                                </Badge>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

                    <Col className='mb-3'>

                        <Card style={{ height: '376px' }}>

                            <Card.Header className='card-header'>

                                Recent happenings

                            </Card.Header>

                            <Card.Body className='overflow-auto'>

                                <div className='border-bottom pb-3'>

                                    <Image style={{ width: '130px', display: 'inline-block', float: 'left' }} src={woman} rounded />

                                    <div className='d-grid ps-2'>

                                        <h6 className='fw-bold mb-0 fs-6 text'>Jane Doe (25)</h6>

                                        <p>Stockholm, Sweden</p>

                                        <p>Sent you a message 3 hours ago</p>

                                    </div>

                                </div>

                                <div className='border-bottom pb-3 pt-3'>

                                    <Image style={{ width: '130px', display: 'inline-block', float: 'left' }} src={woman} rounded />

                                    <div className='d-grid ps-2'>

                                        <h6 className='fw-bold mb-0 fs-6 text'>Jane Doe (25)</h6>

                                        <p>Stockholm, Sweden</p>

                                        <p>Sent you a message 3 hours ago</p>

                                    </div>

                                </div>

                                <div className='pb-3 pt-3'>

                                    <Image style={{ width: '130px', display: 'inline-block', float: 'left' }} src={woman} rounded />

                                    <div className='d-grid ps-2'>

                                        <h6 className='fw-bold mb-0 fs-6 text'>Jane Doe (25)</h6>

                                        <p>Stockholm, Sweden</p>

                                        <p>Sent you a message 3 hours ago</p>

                                    </div>

                                </div>

                            </Card.Body>

                        </Card>

                    </Col></>}

                {showSearchResults && <Col lg={8} className='mb-3'>

                    <Card style={{ height: '376px' }}>

                        <Card.Header className='card-header'>

                            Search results <span onClick={() => setShowSearchResults(false)} style={{float: 'right'}}><i className='bi bi-x-lg' style={{ cursor: 'pointer' }}></i></span>

                        </Card.Header>

                        <Card.Body ref={searchResultRef} className='overflow-auto'>

                            {searchResults.map(person_o => (
                                <div key={person_o.id} className='search-result-item' onClick={() => props.setPage(<OtherMemberHome person={person_o} />)}>
                                    <Image className='search-result-img' src={person_o.gender === 'male' ? man : woman} rounded />
                                    <p>{person_o.firstname} {person_o.lastname} ({calculateAge(person_o.birthdate)})</p>
                                    <p>{person_o.country}</p>
                                </div>
                            ))}


                            {/* <div style={{clear: 'both', borderTop: '1px solid #ccc',marginBottom:'10px'}}></div>

        <div style={{borderBottom: '1px solid grey'}}>
        <Image style={{ width: '130px', display: 'inline-block', float: 'left' }} src={woman} rounded />
            <p>Kalle Karlsson</p>
        </div>

        <div style={{borderBottom: '1px solid grey'}}>
            <p>Kalle Karlsson</p>
        </div> */}

                            {/*  <div className='border-bottom pb-3'>

            <Image style={{ width: '130px', display: 'inline-block', float: 'left' }} src={woman} rounded />

            <div className='d-grid ps-2'>

                <h6 className='fw-bold mb-0 fs-6 text'>Jane Doe (25)</h6>

                <p>Stockholm, Sweden</p>

                <p>Sent you a message 3 hours ago</p>

            </div>

        </div>

        <div className='border-bottom pb-3'>

            <Image style={{ width: '130px', display: 'inline-block', float: 'left' }} src={woman} rounded />

            <div className='d-grid ps-2'>

                <h6 className='fw-bold mb-0 fs-6 text'>Jane Doe (25)</h6>

                <p>Stockholm, Sweden</p>

                <p>Sent you a message 3 hours ago</p>

            </div>

        </div> */}

                        </Card.Body>

                    </Card>

                </Col>}

                <Col className='mb-3'>

                    <Card>

                        <Card.Header className='card-header'>

                            Search

                        </Card.Header>

                        <Card.Body>

                            <Form autoComplete='off'>

                                {/* <Form.Group className='mb-3'
                                    as={Row}
                                    controlId='choose-your-gender'
                                >

                                    <Form.Label
                                        column
                                        size='sm'
                                        sm='4'
                                    >
                                        I am:

                                    </Form.Label>

                                    <Col sm='8'>

                                        <Form.Select size='sm' onChange={(e) => setMyGender(e.target.value)}>

                                            <option value="any">Choose gender</option>

                                            <option value="male">Male</option>

                                            <option value="female">Female</option>

                                        </Form.Select>

                                    </Col>

                                </Form.Group> */}

                                <Form.Group as={Row} className="mb-3" controlId="choose-gender">

                                    <Form.Label style={{ whiteSpace: 'nowrap' }} column sm='4' size='sm'>

                                        Looking for:

                                    </Form.Label>

                                    <Col sm={8}>

                                        <Form.Select size="sm" onChange={(e) => setTheirGender(e.target.value)}>

                                            <option value="any">Any gender</option>

                                            <option value="male">Male</option>

                                            <option value="female">Female</option>

                                        </Form.Select>

                                    </Col>

                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="choose-age">

                                    <Form.Label className='search-label'
                                        column
                                        size='sm'
                                        sm='4'
                                    >
                                        Preferred age:

                                    </Form.Label>

                                    <Col sm='3'>

                                        <Form.Select size='sm' onChange={(e) => setFromAge(e.target.value)}>

                                            <option></option>

                                            {ages.map(age_i => <option key={age_i} value={age_i}>{age_i}</option>)}

                                        </Form.Select>

                                    </Col>

                                    <Form.Label className='text-center pt-0'
                                        column sm='2'
                                        size='sm'
                                    >
                                        to
                                    </Form.Label>

                                    <Col sm='3'>

                                        <Form.Select size='sm' onChange={(e) => setToAge(e.target.value)}>

                                            <option></option>

                                            {ages.map(age_i => <option key={age_i} value={age_i}>{age_i}</option>)}

                                        </Form.Select>

                                    </Col>

                                </Form.Group>

                                <Form.Group className='mb-3'
                                    as={Row}
                                    controlId='choose-country'
                                >

                                    <Form.Label column sm='4' size='sm'>
                                        Country:
                                    </Form.Label>

                                    <Col sm='8'>

                                        <Form.Select size='sm' onChange={(e) => setCountry(e.target.value)}>

                                            <option value='any'>Any</option>

                                            {countries.map(country_s => <option key={country_s} value={country_s}>{country_s}</option>)}

                                        </Form.Select>

                                    </Col>

                                </Form.Group>

                                {/*<Form.Group className='mb-3'
                                    as={Row}
                                    controlId='choose-city'
                                >

                                    <Form.Label column sm='4' size='sm'>
                                        City:
                                    </Form.Label>

                                    <Col sm='8'>

                                        <Form.Select size='sm'>

                                            <option>Any</option>

                                            <option value='1'>Gothenburg</option>

                                            <option value='2'>Stockholm</option>

                                        </Form.Select>

                                    </Col>

                                </Form.Group>*/}

                                <div className='d-grid gap-2'>

                                    <Button
                                        onClick={search}
                                        size='sm'
                                        type='submit'
                                        variant='success'>
                                        Search
                                    </Button>


                                </div>

                            </Form>

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

            <Row xs={1} sm={1} md={1} lg={1}>

                <Col>

                    <Card>

                        <Card.Header className='card-header'>

                            Online: 1435

                            <Pagination size='sm' className='float-end mb-0'>

                                <Pagination.Item active={true} className='mb-0'>1</Pagination.Item>

                                <Pagination.Item className='mb-0'>2</Pagination.Item>

                                <Pagination.Item className='mb-0'>3</Pagination.Item>

                                <Pagination.Item className='mb-0'>4</Pagination.Item>

                                <Pagination.Item className='mb-0'>5</Pagination.Item>

                            </Pagination>

                        </Card.Header>

                        <Card.Body>

                            <Row xs={2} sm={2} md={4} lg={6} className='g-4'>

                                <Col>

                                    <Card>

                                        <Card.Img variant='top' src={woman} />

                                        <Card.Body>

                                            <h6 className='fw-bold mb-0 fs-6 text'>Jane Doe (25)</h6>

                                            <p className='mb-0'>Stockholm, Sweden</p>

                                        </Card.Body>

                                    </Card>

                                </Col>

                                <Col>

                                    <Card>

                                        <Card.Img variant='top' src={woman} />

                                        <Card.Body>

                                            <h6 className='fw-bold mb-0 fs-6 text'>Jane Doe (25)</h6>

                                            <p className='mb-0'>Stockholm, Sweden</p>

                                        </Card.Body>

                                    </Card>

                                </Col>

                                <Col>

                                    <Card>

                                        <Card.Img variant='top' src={woman} />

                                        <Card.Body>

                                            <h6 className='fw-bold mb-0 fs-6 text'>Jane Doe (25)</h6>

                                            <p className='mb-0'>Stockholm, Sweden</p>

                                        </Card.Body>

                                    </Card>

                                </Col>

                                <Col>

                                    <Card>

                                        <Card.Img variant='top' src={woman} />

                                        <Card.Body>

                                            <h6 className='fw-bold mb-0 fs-6 text'>Jane Doe (25)</h6>

                                            <p className='mb-0'>Stockholm, Sweden</p>

                                        </Card.Body>

                                    </Card>

                                </Col>

                                <Col>

                                    <Card>

                                        <Card.Img variant='top' src={woman} />

                                        <Card.Body>

                                            <h6 className='fw-bold mb-0 fs-6 text'>Jane Doe (25)</h6>

                                            <p className='mb-0'>Stockholm, Sweden</p>

                                        </Card.Body>

                                    </Card>

                                </Col>

                                <Col>

                                    <Card>

                                        <Card.Img variant='top' src={woman} />

                                        <Card.Body>

                                            <h6 className='fw-bold mb-0 fs-6 text'>Jane Doe (25)</h6>

                                            <p className='mb-0'>Stockholm, Sweden</p>

                                        </Card.Body>

                                    </Card>

                                </Col>

                            </Row>

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

            <EditPictureModal member={member} show={showModal} hideModal={() => setShowModal(false)} />

        </Container>
    );
}

export default Home;