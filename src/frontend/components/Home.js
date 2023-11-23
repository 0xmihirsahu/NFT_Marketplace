import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'

import video from './bg-vid.mp4'

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const phrases = ['Mint Your NFTs!', 'List Your NFTs!', 'Buy Any NFTs!', 'Sell Your NFTs!', 'Trade Any NFTs!'];
  const loadMarketplaceItems = async () => {
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (!item.sold) {
        const uri = await nft.tokenURI(item.tokenId)
        const response = await fetch(uri)
        const metadata = await response.json()
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    setLoading(false)
    setItems(items)
  }

  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    loadMarketplaceItems()
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentText.length < phrases[currentPhraseIndex].length) {
        setCurrentText((prevText) => prevText + phrases[currentPhraseIndex][currentText.length]);
      } else {
        clearInterval(intervalId); 
        setTimeout(() => {
          setCurrentText('');
          setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        }, 1800); 
      }
    }, 160);
  
    return () => clearInterval(intervalId);
  }, [currentText, currentPhraseIndex]);
  
  useEffect(() => {
    loadMarketplaceItems()
  }, [])

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      <div className='flex-column justify-center vid-container'>
      <h1 className='p-4 mb-4 banner-text'>
        You can <span>{currentText}<span className='cursory'></span></span>
      </h1>
      <video muted autoPlay loop width="100%" height="100%" preload="auto" id="bg-main">
        <source src={video} type="video/mp4" />
      </video>
      </div>
      
      {items.length > 0 ?
        <div className="px-5 container">
          <h3 className='headings'>Items</h3>
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card bg='dark' key='Dark' text='white' border='light' className='rounded'>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}
export default Home