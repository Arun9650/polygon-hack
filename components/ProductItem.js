import React from 'react'
import Layout from './Layout'
import { Button, Card, CardFooter, CardHeader } from '@material-tailwind/react';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
export default function ProductItem(props) {
    
    let dollarUS = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });


    const { product } = props;
    const { addtocartHandler } = props;

    // console.log("item",props);
    // console.log("item",product);
    return (

        <Card className=" m-3 border rounded-2xl  ">
            <Link href={`/product/${product._id}`}>
                <a>
                   
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={300}

                        className="object-contain cursor-pointer"

                    />
                </a>

            </Link>
            <CardFooter divider className='mx-4 p-5 flex justify-between'>
                <div className=''>


                    <div className='font-Roboto text-[#0e0a23] truncate w-28'>{product.name}</div>
                    <div className='font-light '> {dollarUS.format(product.price)}</div>


                </div>
                <div className=''>
                    <Button onClick={() => addtocartHandler(product)} size='sm' className='p-3 active:scale-95'>Add to  Cart</Button>
                </div>
            </CardFooter>
        </Card>


    )
}