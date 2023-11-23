import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import nftLogo from '../assets/nft_logo.png'
import './App.css';

const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar expand="lg" variant="dark" className="nav-css">
            <Container>
                <Navbar.Brand className="brandNav" href="./">
                    <img src={nftLogo} width="40" height="45" className="" alt="" />
                    &nbsp; NFT Bazaar
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto navLink">
                        <Nav.Link as={Link} to="/" className="">Home</Nav.Link>
                        <Nav.Link as={Link} to="/create" >Create</Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items">My Listed Items</Nav.Link>
                        <Nav.Link as={Link} to="/my-purchases">My Purchases</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <button className="connect-button">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </button>

                            </Nav.Link>
                        ) : (
                            <button onClick={web3Handler} className="connect-button" >Connect Wallet</button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;