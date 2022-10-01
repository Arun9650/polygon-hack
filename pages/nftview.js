import React, { useContext, useState } from 'react'
import Layout from '../components/Layout'
import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constans/index'
import { useSigner } from 'wagmi'
import { Contract } from 'ethers'
import { AppWrapper } from '../utils/context'
import Image from 'next/image'
import { Card, CardFooter } from '@material-tailwind/react'


function Nftview() {


  const baseurl = "https://ipfs.io/ipfs/";

  const { state, dispatch } = useContext(AppWrapper)

  const { cart: { cartItem }, } = state

  const { data: signer,  } = useSigner()


  const [links, setLink] = useState([]);

  const getAllTokens = async () => {
    setLink([]);
    try {
      const nftContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);

      const token = await nftContract.getAllTokens();

      console.log("token", token)
      token.forEach((nft) => {
        console.log("nft2", nft.uri)
        fetch(nft.uri).then((response) => response.json())
          .then((metaData) => {
            setLink((state) => [...state, { id: nft.id, metaData: metaData }])
          })
      }
      )
      console.log(links)


    } catch (error) {
      console.log(error)
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