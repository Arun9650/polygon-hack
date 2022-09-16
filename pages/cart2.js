import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import Layout from '../components/Layout'
import { Card, CardBody, Button } from '@material-tailwind/react'
import { AppWrapper } from '../utils/context'
import { HiXCircle } from 'react-icons/hi'
import { NFTStorage } from 'nft.storage'
import { useAccount } from 'wagmi'
import {Contract, Wallet} from 'ethers'
import {Signer} from 'ethers'
import { ToastContainer, toast } from 'react-toastify'
import {ethers} from 'ethers'
import dynamic from 'next/dynamic'
let dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});


import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constans/index'
import { useContract, useSigner } from 'wagmi'



const api = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU0ZkMxMTU0NzY3MzBCQTEyODBEYUFFRjNBODcxZGFGYzc0ZTdBQjkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzE0NDMyODEzNSwibmFtZSI6InBvbHlnb24tbmZ0In0.aqieFyTXDvAAbdNGBdwVu3ePNBkW3bvUCeUrw_uslXI"
function CartScreen() {

    const baseurl = "https://ipfs.io/ipfs/";
    const { address, isConnecting, isDisconnected } = useAccount()
    const [price, setPrice] = useState(0);
    const [amount, setAmount] = useState(0);

    const cartItemPrice = JSON.stringify( amount / price);

    const { data: signer, isError, isLoading } = useSigner()


    const { state, dispatch } = useContext(AppWrapper)

    const { cart: { cartItem }, } = state




   



   async function Mint(url) {

    
        try {

           const nftContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);

           const tx =  await nftContract.mint(url,{value: ethers.utils.parseEther(cartItemPrice)});
           toast.info('Your NFT is Minting...');
          
            console.log("Your nft is minting...")
            await tx.wait();

            console.log(tx);    
            toast.success("congratulations ,Your NFT Is Minted ")



        } catch (error) {
            console.log(error)
        }
    }


    console.log("cartItem",cartItem)
    const storeNFT = async () => {
        // const name = cartItem.map((item) => item.name)
        
        const discription  = cartItem[0].discription ? cartItem[0].discription : "something new  is  discription";
        console.log(discription)
        const a = 0;

        for (let x of cartItem) {

            a = 1 + a;
            console.log(x, a);



            const name = x.name;
            const imageURL = x.image;

            const getImage = async () => {

                // const img = cartItem.map((item) => item.image)


                const imageurl = imageURL;

                const FatchedImage = await fetch(imageurl);

                if (!FatchedImage.ok) {
                    throw new Error(`error fetching image: [${FatchedImage.statusCode}]: ${FatchedImage.status}`)
                }

                    console.log("fatched",FatchedImage) // return a promise
                return FatchedImage.blob();


            }

            const image = await getImage();

            // const imageurl = baseurl + image.slice(7);

            console.log(image)
             const nameImg = imageURL.slice(75)

            const nft = {

                image: new File([image], `${nameImg}`, {type: 'image/jpg'}),
                name: name,
                description:discription,
            }

            const client = new NFTStorage({ token: api })
            const metadata = await client.store(nft);

            console.log('NFtT data stored!')
            // console.log(image)
            console.log("Meta Data url ", metadata.url)


            const url = baseurl +  metadata.url.slice(7);
            console.log("url", url);

            Mint(url );



        }

    }



    const StartMintingProcess = async () => {
      await   storeNFT();
    }




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



  
    


    const PriceofEth = async () => {

        


        try {


            const contract = new Contract( WHITELIST_CONTRACT_ADDRESS, abi,signer)
        
          
            console.log(contract)
            const price = await contract.getLatestPrice();
            console.log(price)
            const decimals = await contract.getDecimals();





            const insertDecimal = (num) => {
                return Number((num / 100000000).toFixed(8));
            }
            setPrice(insertDecimal(price))



        } catch (error) {
            console.log(error)
        }
    }
    PriceofEth();
  


    return (
        <Layout title="shopping cart">
            {/* <ToastContainer/> */}
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
                                    onClick={() => StartMintingProcess()}
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