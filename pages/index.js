import { Button, Card, CardFooter, CardHeader } from '@material-tailwind/react';
import axios from 'axios';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import { useContext } from 'react'
import Layout from '../components/Layout';
import Product from '../modals/product';
import styles from '../styles/Home.module.css'
import { AppWrapper } from '../utils/context';
// import data from '../utils/data';
import db from '../utils/db';

export default function Home({products}) {


 const {state, dispatch} =  useContext(AppWrapper)
    //  console.log(state)
  const {cart} = state;
    // const product = data.products.find((x) => x._id === _id)
    const addtocartHandler = async () =>{
      const existItem = cart.cartItem.find((x) => x._id === products._id);
      const quantity = existItem ? existItem.quantity + 1 : 1;

      const { data } = await axios.get(`/api/${products._id}`);

      if (data.countInStock < quantity) {
        return alert('Sorry. Product is out of stock');
      }

      dispatch({type:'CART_ADD_ITEM', payload:{...products, quantity}})
      
  }


 

  return (
    <Layout title="home page"  classsName="sticky absolute top-0">





      <div className='flex flex-wrap  items-center justify-center rounded-xl px-4'>
        {/* {console.log(data)} */}
        {products.map((item) => (
          <Card key={item._id} className=" m-3 border rounded-2xl   ">
            <Link href={`product/${item._id}`}>
            <Image
              src={item.img}
              alt={item.title}
              width={300}
              height={300}
              loading="lazy"
              className="object-contain cursor-pointer"

            >

            </Image>
            </Link>
            <CardFooter divider className='mx-4 p-5 flex justify-between'>
              <div className=''>


                <div className='font-Roboto text-[#0e0a23] truncate w-28'>{item.title}</div>
                <div className='font-light '> ${item.price}</div>


              </div>
              <div className=''>
                <Button onClick={addtocartHandler} size='sm' className='p-3 active:scale-95'>Add to  Cart</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>






    </Layout>
  )
}


export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();

  return {
    props: {
      products: products.map(db.convertDocToObj)

    }
  }

}