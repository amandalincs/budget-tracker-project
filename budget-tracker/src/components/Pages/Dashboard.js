import { React, useState, useEffect } from 'react'
import { Card, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap'
import styled from 'styled-components';
import ItemList from '../Standard/ItemList' 
import {Link} from 'react-router-dom'


const Styles = styled.div`
    
    .title{
        font-size: 2rem;
    }

    .header{
        display:flex;
        justify-content: space-between
    }

    .data-header{
        padding: 5px;
        padding-left: 10px;
        font-size: 1.5rem;
        display: flex;
        justify-content: space-between
    }

`;


function Dashboard() {

    const [items, setItems] = useState([])
    const [deleteModal, setDeleteModal] = useState(false);
    // const handleDeleteAllItems = () => {
    //     setItems([])
    // }


    const toggleModal = () =>{
        setDeleteModal(!deleteModal)
    }

    const handleDeleteAllItems = () => {
        setItems([])
        localStorage.clear()
    }

    useEffect(() => {
        let ls = JSON.parse(localStorage.getItem('items'))
        console.log(ls)
        if (ls) setItems(ls)
    },[])

    return (
        <Styles>
            <Container>
                <div className="header">
                    <span className="title">Overview</span>
                    <Link to="/"><Button>Add Expense</Button></Link>
                </div>

                <Card>
                    <div className="data-header">
                        <span>All Expenses</span>
                        {items.length > 0 && <Button outline color="danger" onClick={toggleModal}>Clear All</Button>}
                        <Modal isOpen={deleteModal} toggle={toggleModal} className="">
                            <ModalHeader toggle={toggleModal}>Are you sure?</ModalHeader>
                            <ModalBody>
                                You are about to delete all expenses.
                            </ModalBody>
                            <ModalFooter>
                            <Button color="danger" onClick={handleDeleteAllItems}>Delete</Button>{' '}
                            <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                    <ItemList items={items}></ItemList>
                </Card>

            </Container>
        </Styles>
            
    );
}

export default Dashboard;