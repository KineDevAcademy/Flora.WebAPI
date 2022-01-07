import React, { useState, useEffect } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useSubstrate } from '../../substrate-lib';
import { Link } from 'react-router-dom';
import Account from '../../components/AccountSelector';
import { message, loader } from '../../middlewares/status';
import flora from '../../images/tree-rem.png';
import FEMALE from '../../Website/img/mascote-feminina-FLORA.png';
import './Auctions.scss';
function AuctionDetails (props) {
  const [isLoading, setLoading] = useState(false);
  const [idAuction, setAuctionId] = useState([]);
  const [token, setTokenInfo] = useState([]);
  const [sendBid, setSendBid] = useState(true);
  const [messageToken, setMessage] = useState('');
  const [auctionDetails, setAuctionDetails] = useState({});
  const [value, setValue] = useState('');
  const [accountAddress, setAccountAddress] = useState(null);
  const [accountSelected, setAccountSelected] = useState('');

  const { api, apiState, keyringState, apiError, keyring } = useSubstrate();

  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  useEffect(() => {
    setAccountSelected(accountAddress);
    const tokenId = props.match.params.id;
    setAuctionId(tokenId);
    async function getTokenInfo () {
      const tokenInfo = [];
      try {
        const data = await api.query.tokenNonFungible.tokens(tokenId);
        const res = await data.toHuman();
        tokenInfo.push(res);
        setLoading(true);
      } catch (e) {}

      const filterArr = tokenInfo.filter(function (val) {
        return Boolean(val);
      });
      setTokenInfo(filterArr);
    }
    async function getToken () {
      try {
        const myArray = [];
        setLoading(false);
        const ownerInfoToken = await api.query.nftMarket.auctionsInfo(tokenId);
        const details = await ownerInfoToken.toHuman();
        myArray.push(details);
        const filterArr = myArray.filter(function (val) {
          return Boolean(val);
        });
        setAuctionDetails(filterArr);
        await getTokenInfo();
      } catch (e) {
        console.log(e);
      }
    }

    getToken();
  }, [
    messageToken,
    api,
    accountAddress,
    props.match.params.id,
    accountSelected
  ]);

  async function getToken () {
    setLoading(false);
    try {
      setSendBid(false);
      const myArray = [];
      const ownerInfoToken = await api.query.nftMarket.auctionsInfo(idAuction);
      const details = await ownerInfoToken.toHuman();
      myArray.push(details);
      const filterArr = myArray.filter(function (val) {
        return Boolean(val);
      });
      setAuctionDetails(filterArr);
      setLoading(true);
      setSendBid(true);
    } catch (e) {
      console.log(e);
    }
  }

  const getFromAcct = async () => {
    try {
      const {
        address,
        meta: { source, isInjected }
      } = accountPair;
      let fromAcct;

      // signer is from Polkadot-js browser extension
      if (isInjected) {
        const injected = await web3FromSource(source);
        fromAcct = address;
        api.setSigner(injected.signer);
      } else {
        fromAcct = accountPair;
      }

      return fromAcct;
    } catch (e) {
      console.log(e);
    }
  };

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    );
  }

  function getValue (e) {
    setValue(e.target.value);
  }

  const txResHandler = ({ status }) => {
    if (status.isFinalized) {
      console.log(status.type);
    }
    setMessage(status.type);
  };

  async function bidSend () {
    const fromAcct = await getFromAcct();
    const extrinsic = api.tx.nftMarket.bidAuction(idAuction, value);

    try {
      const gruly = await extrinsic.signAndSend(fromAcct, txResHandler);
      console.log(gruly);
    } catch (e) {
      console.log(e);
    }
    getToken();
  }

  return (
    <>
<div className="flora">
    <div className="flex w-full mt-3  justify-end items-center " >
    {
    accountAddress !== ''
      ? <Link to="/perfil" className="mr-2">Profile</Link>
      : ''
    }
    <Account setAccountAddress={setAccountAddress}/>
    </div>

      {isLoading && token.length > 0
        ? (
        <section className="body-font overflow-hidden" >

       <Link to="/auctions" style={{ fontSize: '15px' }}>Return Market</Link>
          <div className="container px-5 py-24 mx-auto">

            <div className="lg:w-4/5 mx-auto flex flex-wrap mt-20">
              <img
                alt="flora"
                className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded "

                src={flora}
              />
              <div className="lg:w-1/2 w-full lg:pl-10 lg:pt-6 mt-6 lg:mt-0">
                <h1 className=" title-font  tracking-widest">
                  {token[0].nft_type}
                </h1>
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                  {token[0].name}
                </h1>
                <div className="flex mb-4">
                  <span className="flex items-center">
                    <svg
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      className="w-4 h-4 text-indigo-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <svg
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      className="w-4 h-4 text-indigo-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <svg
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      className="w-4 h-4 text-indigo-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <svg
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      className="w-4 h-4 text-indigo-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      className="w-4 h-4 text-indigo-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <h2 className="text-gray-600 ml-3 pb-8">
                      number bids: {auctionDetails[0].num_bid}{' '}
                    </h2>
                  </span>
                </div>
                <p className="leading-relaxed">
                  Description: {token[0].tree_description}
                </p>
                <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                  <div className="flex">
                    <span className="mr-5 pt-2">Active</span>
                    <button
                      className="border-2 border-gray-300 rounded-full w-full h-full focus:outline-none"
                      style={{ fontSize: '30px' }}
                    >
                      <b>Current: {auctionDetails[0].current_price}</b>
                    </button>

                  </div>

                </div>
                <p>Last Bidder: {auctionDetails[0].last_bidder === accountSelected ? <h3>You</h3> : <h3>{auctionDetails[0].last_bidder}</h3> }</p>
                {sendBid
                  ? <div className="flex">

                  {
                    auctionDetails[0].owner === accountSelected
                      ? <h2>You cannot place a bid as you are the owner of the auction</h2>
                      : <div>
                           <span className="title-font font-medium text-2xl text-gray-900">
                       <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="value offer"
                    onChange={getValue}
                    type="number"
                  />

                    <button className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={bidSend}>
                    Send Bid
                  </button>
                  </span>
                    </div>

                  }

                    <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4" >
                    <img src={FEMALE} alt="flora" />
                  </button>

                </div>
                  : <p>Status:{ messageToken }</p>
                  }

              </div>
            </div>
          </div>
        </section>
          )
        : (
            ''
          )}
</div>
    </>
  );
}

export default AuctionDetails;
