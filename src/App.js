import React, { useEffect, useState } from 'react';
import Web3 from 'web3'
import Game from './abis/Game.json'
import ConwaysGridComponent from './components/ConwaysGridComponent';
import Loading from './components/Loading'

function App() {
  const [gameContract, setGameContract] = useState();
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [randomResult, setRandomResult] = useState();
  const [loading, setLoading] = useState(false);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    if (networkId !== 4) {
      window.alert('Please switch network to the Rinkeby and refresh the page')
    }
    const contract_address = '0x87bb03abdF7F3263C933af46D2849E7158D0aC00';
    const deployedContract = new web3.eth.Contract(Game.abi, contract_address);
    setGameContract(deployedContract);
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0])
    const bal = await web3.eth.getBalance(accounts[0]);
    setBalance(bal);
  }

  const getRandom = () => {
    //randomSeed will be component of which final random value will be generated
    let randomSeed = Math.floor(Math.random() * Math.floor(1e9))

    gameContract.methods.getRandomNumber(randomSeed)
      .send({ from: account })
      .on('transactionHash', (hash) => {
        gameContract.events.Result({}, (error, event) => {
          setLoading(false);
          setRandomResult(event.returnValues.randomResult);
        })
      }).on('error', (error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    const load = async () => {
      await loadWeb3()
      await loadBlockchainData()
    }
    load();
  }, []);

  return (
    <div>
      <p>Address: {gameContract?._address} </p>

      <p>Random: {randomResult} </p>
      <button
        type="submit"
        className="btn btn-success btn-lg"
        onClick={(event) => {
          event.preventDefault()
          setLoading(true)
          setRandomResult(null)
          getRandom()
        }}>
        Get Random Number
      </button>
      { randomResult ? <ConwaysGridComponent
        randomResult={randomResult}
      /> : null}
      {loading ? <Loading /> : null}
    </div>
  );
}

export default App;