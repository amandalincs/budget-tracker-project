import { React, useState, useEffect } from 'react'
import { Card, CardDeck, CardTitle, CardBody, CardText, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, Col  } from 'reactstrap'
import styled from 'styled-components';
import ItemList from '../Standard/ItemList' 
import {Link} from 'react-router-dom'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// DASHBOARD PAGE: displays an overview of the user's budget and spending data

// Styling for the dashboard elements:
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

// Functions and variables needed for handling dashboard elements:
function Dashboard() {

    // Setting variables to keep track of state:
    const [items, setItems] = useState([])
    const [processedItems, setProcessedItems] = useState([])
    const [deleteModal, setDeleteModal] = useState(false);
    const [filterBy, setFilterBy] = useState("all")
    const [budget, setBudget] = useState('1000.00')
    const [budgetModal, setBudgetModal] = useState(false);
    const [budgetModalVal, setBudgetModalVal] = useState('')

    // Functions that handle changes and updates to elements:
    const toggleModal = () =>{
        setDeleteModal(!deleteModal)
    }

    const handleFilterBy = (event) => {
        let item = event.target.value
        setFilterBy(item)
    }
    const toggleBudgetModal = () => {
        setBudgetModal(!budgetModal)
        setBudgetModalVal('')
    }

    const handleDeleteAllItems = () => {
        setItems([])
        setProcessedItems([])
        localStorage.clear() 
        toggleModal()       
    }

    // Add items to local storage:
    const handleDeleteItem = (event) => {
        let id = event.target.value     
        let new_items = items.filter( (expense) => {
            return expense.id !== id
        })
        localStorage.setItem('items', JSON.stringify(new_items))
        setItems(new_items)
        window.location.reload(false);

    }

    const handleBudgetModalVal = event => {
        setBudgetModalVal(event.target.value)
    }

    // Add budget to local storage:
    const handleSetBudget = () => {
        localStorage.setItem('budget', parseFloat(budgetModalVal).toFixed(2))
        setBudget(parseFloat(budgetModalVal).toFixed(2))
        toggleBudgetModal()
    }

    // Get local storage and update dashboard:
    useEffect(() => {
        let ls = JSON.parse(localStorage.getItem('items'))
        let b = JSON.parse(localStorage.getItem('budget'))
        if (ls) {
            setItems(ls); 
            setProcessedItems(ls)
        }
        if (b) setBudget(parseFloat(b).toFixed(2))
    },[])

    useEffect(() => {
        let ls = JSON.parse(localStorage.getItem('items'))
        if (ls) {
            setProcessedItems(ls)
            
            if (filterBy !== 'all'){
                let sorted_items = ls.filter(expense => {
                    return expense.category.toLowerCase().replaceAll('&', '_').replaceAll(" ", '') === filterBy
                })
                setProcessedItems(sorted_items)
                
            }
        }

    },[filterBy])

    // HTML for dashboard:
    return (
        <Styles>
            <Container>
                <div className="header">
                    <span className="title">Overview</span>
                    <Link to="/add_expense"><Button>Add Expense</Button></Link>
                </div>

                <CardDeck style={{marginTop: 20}}>
                    <Card>
                        <CardBody className="row" style={{alignItems:"center"}} >
                            <Col sm="12" lg="6">
                                <CardTitle>
                                    <span>Total Budget{' '}</span>
                                </CardTitle>
                                <CardText>
                                    <span className="text-success">
                                        $ {budget}
                                    </span>
                                </CardText>
                            </Col>
                            <Col>
                                {<Button onClick={toggleBudgetModal}>Set Budget</Button>}
                                <Modal isOpen={budgetModal} toggle={toggleBudgetModal} className="">
                                    <ModalHeader toggle={toggleBudgetModal}>Set your budget</ModalHeader>
                                    <ModalBody>
                                    <Input 
                                        type="number" 
                                        name="totalBudget" 
                                        id="totalBudget" 
                                        placeholder="0.00"
                                        value={budgetModalVal}
                                        onChange={handleBudgetModalVal}
                                    />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="secondary" onClick={toggleBudgetModal}>Cancel</Button>
                                        <Button color="primary" onClick={handleSetBudget}>Confirm</Button>{' '}
                                    </ModalFooter>
                                </Modal>
                            </Col>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody>
                            <CardTitle>
                                Total Spent{' '}
                            </CardTitle>
                            <CardText>
                                <span className="text-success">
                                    ${' '}
                                    {items.reduce((accumulator, currentValue) => {
                                        return (accumulator += parseFloat(currentValue.amount))
                                    }, 0).toFixed(2)}
                                </span>
                            </CardText>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody>
                            <CardTitle>
                                Remaining Budget {' '}
                            </CardTitle>
                            <CardText>
                                { budget - (items.reduce((accumulator, currentValue) => {
                                        return (accumulator += parseFloat(currentValue.amount))
                                    }, 0)) > 0 && <span className="text-success">
                                    ${(budget - (items.reduce((accumulator, currentValue) => {
                                        return (accumulator += parseFloat(currentValue.amount))
                                    }, 0))).toFixed(2)}
                                </span>}
                                { budget - (items.reduce((accumulator, currentValue) => {
                                        return (accumulator += parseFloat(currentValue.amount))
                                    }, 0)) <= 0 && <span className="text-danger">
                                    ${(budget - (items.reduce((accumulator, currentValue) => {
                                        return (accumulator += parseFloat(currentValue.amount))
                                    }, 0))).toFixed(2)}
                                </span>}
                            </CardText>
                        </CardBody>
                    </Card>
                </CardDeck>

                <Card style={{marginTop: 20}}>
                <CardBody>
                    <div className="data-header">
                        <div>
                        <span style={{marginRight: '10px'}}>All Expenses</span>
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
                        <div>
                            <span>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={filterBy}
                                    onChange={handleFilterBy}
                                    style={{margin:'10px'}}
                                    >   
                                        <MenuItem value="all">
                                            All 
                                        </MenuItem>
                                        <MenuItem value="food_drinks">Food & Drinks</MenuItem>
                                        <MenuItem value="transportation">Transportation</MenuItem>
                                        <MenuItem value="housing_utilities">Housing & Utilities</MenuItem>
                                        <MenuItem value="clothing">Clothing</MenuItem>
                                        <MenuItem value="entertainment">Entertainment</MenuItem>
                                        <MenuItem value="medical">Medical</MenuItem>
                                        <MenuItem value="miscellaneous">Miscellaneous</MenuItem>

                                    </Select>
                            </span>
                
                        </div>
                    
                    </div>
                    {processedItems.length > 0 ?
                    (<ItemList items={processedItems} handleDeleteItem={handleDeleteItem}></ItemList>) 
                    : (<div style={{textAlign: 'center', padding: '20px 10px'}}>No Data Available</div>)
                    }
                    </CardBody>
                </Card>
            </Container>
        </Styles>
            
    );
}

export default Dashboard;
