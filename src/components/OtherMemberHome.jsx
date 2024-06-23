import { Badge, Button, Card, Col, Container, Form, Image, Modal, Pagination, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';

function OtherMemberHome(props) {

    const person_o = props.person;

    const [member, setMember] = useState({...person_o});

    useEffect(() => {

        const params_o = {
            fields: 'maindescription',
            id: member.id
        };

        axios.get('https://healthysingles4you2.com/api/members/', {
            params: params_o
        })
            .then(function (response_o) {

                if (response_o.status === 200) {
                    
                    setMember({...member, ...response_o.data[0]})
                }
            });

    }, []);

    return (
        <Container className='mt-3'>

            <Row xs={1} sm={1} md={1} lg={3}>

                <Col className='mb-3'>

                    <Card style={{ height: '376px' }}>

                        <Card.Header className='card-header'>

                            {member.firstname} {member.lastname}

                        </Card.Header>

                        <Card.Body>

                            {member.maindescription}

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

        </Container>
    );
}

export default OtherMemberHome;