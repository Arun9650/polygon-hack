import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import Layout from '../components/Layout'
import { Card, CardBody, Button } from '@material-tailwind/react'
import { AppWrapper } from '../utils/context'
import { HiXCircle } from 'react-icons/hi'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BigNumber } from 'ethers'
import { Buffer } from 'buffer';
import { useSendTransaction, usePrepareSendTransaction } from 'wagmi'
import { create } from "ipfs-http-client";
import { Web3Storage,getFilesFromPath ,File } from 'web3.storage'

let dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});


import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constans/index'
import { useContract, useSigner } from 'wagmi'

// const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");

// const projectId = '1d487b7f777448148e786c60be3a2f96';   // <---------- your Infura Project ID

// const projectSecret = '5b461e708cbb4613bcd3b6cc2c47db3a';  // <---------- your Infura Secret
// // (for security concerns, consider saving these values in .env 912c3bcc4d03026fb53decf499b80ec0files)

// const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

// const ipfsClient = create({
//     host: 'ipfs.infura.io',
//     port: 5001,
//     protocol: 'https',
//     headers: {
//         authorization: auth,
//     },
// });

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');





// store.mjs



const token = process.env.WEB3STORAGE_TOKEN
const client = new Web3Storage({ token })






function CartScreen() {

   
    const [price, setPrice] = useState(0);
    const [amount, setAmount] = useState(0);

    const cartItemPrice = amount / price;

    const description = "this is just for testing ";


    // const ipfsBaseUrl = "https://ipfs.infura.io/ipfs/";


    const { state, dispatch } = useContext(AppWrapper)

    const { cart: { cartItem }, } = state






    


// async function getFiles (path) {
//     const files = await getFilesFromPath(path)
//     console.log(`read ${files.length} file(s) from ${path}`)
//     return files
//   }




storeFiles(makeFileObjects());

    // const startMintingProcess = () => {
    //     const name = cartItem.map((item) => item.name)
    //     const image = cartItem.map((item) => item.image)
    //     createMetaDataAndMint( name, description,image);

    //     // console.log(cartItem.map((item) => item.name))
    //     // console.log(image)
    //   };


    //   const createMetaDataAndMint = async (_name, _des, _imgBuffer) => {
    //     // setLoading(true);
    //     // setStatus("Uploading to IPFS");
    //     try {
    //       const addedImage = await ipfsClient.add(_imgBuffer);
    //       console.log(addedImage)
    //       const metaDataObj = {
    //         name: _name,
    //         description: _des,
    //         image: ipfsBaseUrl + addedImage.path,
    //       };
    //       const addedMetaData = await ipfsClient.add(JSON.stringify(metaDataObj));
    //       console.log(ipfsBaseUrl + addedMetaData.path);
         
    //     console.log(_name)
    //     } catch (err) {
    //       console.log(err);
    //     //   setLoading(false);
    //     //   setStatus("Error");
    //     }
    //   };
    

    // const image = cartItem.map((item) => item.image)

    // async function storeFiles () {
    //     const files = await getFilesFromPath(image)
    //     const cid = await client.put(files)
    //     console.log(cid)
    //   }
      
    //   storeFiles()
      
      



    useEffect(() => {
        const itemPrice = cartItem.reduce((a, c) => a + c.quantity * c.price, 0);
        setAmount(itemPrice)



    }, [])


    const removeItemHandler = (item) => {
        dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    };


    const updateCartHandler = async (item, qty) => {
        const quantity = Number(qty);

        const { data } = await axios.get(`/api/${item._id}`)


        if (data.countInStock < quantity) {
            return toast.error("Sorry , Product is out of stock");
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })

        toast.success("Product added to the cart ")
    }




    const { data: signer, isError } = useSigner()


    const Arun = async () => {
        try {


            const contract = useContract({
                addressOrName: WHITELIST_CONTRACT_ADDRESS,
                contractInterface: abi,
                signerOrProvider: signer,
            })

            const price = await contract.getLatestPrice();
            const decimals = await contract.getDecimals();





            const insertDecimal = (num) => {
                return Number((num / 100000000).toFixed(8));
            }
            setPrice(insertDecimal(price))



        } catch (error) {
            console.log(error)
        }
    }

    Arun();


//    const json = JSON.stringify(cartItem)

//    console.log(json);

    return (
        <Layout title="shopping cart">
            <h1 className='mb-4 text-xl mt-20'>Shipping cart</h1>
            {
                cartItem.length === 0 ?
                    (<div>
                        cart is empty , <Link href="/">Go Shopping</Link>
                    </div>)
                    :
                    (
                        <div className='grid md:grid-cols-4 md:gap-5'>
                            <div className='overflow-x-auto md:col-span-3'>
                                <table className='min-w-full'>
                                    <thead className='border-b'>
                                        <tr>
                                            <th className='px-5 text-left'>Item</th>
                                            <th className='px-5 text-right'>Quantity</th>
                                            <th className='px-5 text-right'>Price</th>
                                            <th className='px-5 '>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        
                                        {cartItem.map((item) => (
                                            <tr key={item._id} className="border-b">
                                                <td>
                                                    <Link href={`/product/${item._id}`}>
                                                        <a className='flex p-0 items-center border'>

                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                width={80}
                                                                height={80}
                                                                className="object-contain"
                                                            >

                                                            </Image>

                                                            &nbsp;
                                                            <span> {item.name}</span>

                                                        </a>
                                                    </Link>
                                                </td>
                                                <td className='p-5 text-right'>
                                                    <select className='rounded cursor-pointer focus:outline-none '
                                                        value={item.quantity} onChange={(e) => updateCartHandler(item, e.target.value)}>
                                                        {
                                                            [...Array(item.countInStock).keys()].map(x => (
                                                                <option className='text-center   ' key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>
                                                </td>
                                                <td className='p-5 text-right'>
                                                    ${item.price}
                                                </td>
                                                <td className='p-5 text-center'>
                                                    <button onClick={() => removeItemHandler(item)}>
                                                        <HiXCircle />
                                                    </button>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>



                            </div>
                            <Card className='p-7 border pt-0'>

                                <CardBody className='font-semibold'>
                                    Subtotal ({cartItem.reduce((a, c) => a + c.quantity, 0)}) : $
                                    {cartItem.reduce((a, c) => a + c.quantity * c.price, 0)}
                                    /
                                    eth {
                                        cartItemPrice
                                    }



                                </CardBody>
                                <Button
                                   
                                    color="yellow" className='text-[#2f4468] normal-case font-Popins subpixel-antialiased'>
                                    Check Out
                                </Button>
                            </Card>
                        </div>
                    )

            }
        </Layout>
    )
}


export default dynamic(() => Promise.resolve(CartScreen), { ssr: false })