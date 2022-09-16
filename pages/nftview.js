import React, { useContext, useEffect, useState } from 'react'



import Layout from '../components/Layout'
import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constans/index'
import { useContract, useSigner } from 'wagmi'

import { NFTStorage } from 'nft.storage'
import { useAccount } from 'wagmi'
import { Contract, Wallet } from 'ethers'
import { AppWrapper } from '../utils/context'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Card, CardFooter } from '@material-tailwind/react'


const api = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU0ZkMxMTU0NzY3MzBCQTEyODBEYUFFRjNBODcxZGFGYzc0ZTdBQjkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzE0NDMyODEzNSwibmFtZSI6InBvbHlnb24tbmZ0In0.aqieFyTXDvAAbdNGBdwVu3ePNBkW3bvUCeUrw_uslXI"


function Nftview() {


  const baseurl = "https://ipfs.io/ipfs/";

  const { address, isConnecting, isDisconnected } = useAccount()
  const { state, dispatch } = useContext(AppWrapper)

  const { cart: { cartItem }, } = state

  const { data: signer, isError, isLoading } = useSigner()


  const [links, setLink] = useState([]);
  const [name, setName] = useState();
  const [imagelink, setImageLink] = useState();

  const getAllTokens = async () => {
    setLink([]);
    try {

      const nftContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);

      const token = await nftContract.getAllTokens();

      console.log("token",token)
      token.forEach((nft) => {
        // const nft2 = nft.uri.slice(7);
        console.log("nft2", nft.uri)
        // console.log(nft)        
        fetch(nft.uri).then((response) => response.json())
        // console.log(nft.uri)
          .then((metaData) => {
            setLink((state) => [...state, { id: nft.id, metaData: metaData }])
          })
      }
      )





      // token.forEach((nft) => {
      //   const nft2 =  nft.uri.slice(7)
      //   console.log(baseurl + nft2  )})

      console.log(links)


    } catch (error) {
      console.log(error)
    }









  }





  
  const getETHFromContract = async () => {


    try {
      
      
    const nftContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);

    const money = await nftContract.withdraw();
    console.log(money);
      


    } catch (error) {
      throw new Error(error.message);
    }
  }

  


  return (
    <Layout>
    <div className='mt-20'>
      <button>
       
      </button>
      <button className='border p-4 m-4 bg-blue-gray-50 rounded  ' onClick={() => getAllTokens()}>
        view tokens
      </button>
      <button className='border p-4 m-4 bg-blue-gray-50 rounded  ' onClick={() => getETHFromContract()}>
        withdraw
      </button>

      
      <div className='flex items-center justify-center  flex-wrap '>
        {
          links ?


            (links.map((nft, index) => {

              const image = nft.metaData.image.slice(7);
              const url = baseurl + image;
              console.log(nft)
              return (
                <div key={index} className="">



                  <Card className=" m-3 border rounded-2xl  ">

                    <a>

                      <Image
                        src={url}
                        alt={nft.metaData.name}
                        width={300}
                        height={300}

                        className="object-contain cursor-pointer"

                      />
                    </a>


                    <CardFooter divider className='mx-4 p-5 flex justify-between'>
                      <div className=''>


                        <div className='font-Roboto text-[#0e0a23] truncate w-40z'>{nft.metaData.name}</div>



                      </div>

                    </CardFooter>
                  </Card>



                </div>

              )
            }))


            :
            "loading"



        }

      </div>


    </div>
    </Layout>

  )
}

export default Nftview