import { useState } from 'react';
import { ethers } from 'ethers';
import { Row, Form } from 'react-bootstrap';
import axios from 'axios';
import Lottie from "lottie-react";
import mintingAnimation from '../assets/mintingAnimation.json'

const apiKey = '';
const apiSecret = '';

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [description, setDescription] = useState('');

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== 'undefined') {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formData,
          {
            headers: {
              'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
              'pinata_api_key': apiKey,
              'pinata_secret_api_key': apiSecret,
            },
          }
        );

        console.log(response.data);
        setImage(`https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
      } catch (error) {
        console.log('Pinata image upload error: ', error);
      }
    }
  };

  const createNFT = async () => {
    if (!image || !price || !name || !description) return;
    try {

      setIsMinting(true);

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        {
          pinataMetadata: {
            name,
            description,
          },
          pinataContent: {
            name,
            description,
            image,
            price,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': apiKey,
            'pinata_secret_api_key': apiSecret,
          },
        }
      );

      mintThenList(response.data);
    } catch (error) {
      console.log('Pinata uri upload error: ', error);
    }
  };

  const mintThenList = async (result) => {
    const uri = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    await (await nft.mint(uri)).wait();
    const id = await nft.tokenCount();
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();

      setIsMinting(false);
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: '975px' }}
        >
          <div className="content mx-auto">
            <h2 className="headings">Create Your NFT</h2>
            <Row className="g-4">
              <Form.Control
                type="file"
                className="inputFields"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Name"
                className="uwu"
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
                className="uwu"
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                required
                type="number"
                placeholder="Price in ETH"
                className="uwu"
              />
              <div className="d-grid px-0">
                <button onClick={createNFT} className="createButton">
                  Create & List NFT!
                </button>
              </div>
            </Row>
          </div>
        </main>
      </div>
      {/* Conditional rendering of the animation based on the state */}
      {isMinting && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, backdropFilter: 'blur(2px) brightness(70%)'}}>
          <div style={{backgroundColor: '#393E46', borderRadius: '38px', backdropFilter: 'blur(50px)', padding:'1rem' }}>
          <Lottie animationData={mintingAnimation} style={{paddingLeft: '3.5rem', paddingRight: '3rem'}}/>
          <p style={{fontSize: '2.3rem', fontWeight: '600', color: '#00FFF5' }}>Minting NFT...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Create;
