import axios from 'axios';

import { useContext } from 'react'
import Layout from '../components/Layout';
import Product from '../modals/product';
import styles from '../styles/Home.module.css'
import { AppWrapper } from '../utils/context';
import { toast } from 'react-toastify'
import db from '../utils/db';
import ProductItem from '../components/ProductItem';

export default function Home({ products }) {


  const { state, dispatch } = useContext(AppWrapper)
  //  console.log(state)
  const { cart } = state;
  // const product = data.products.find((x) => x._id === _id)

  const addtocartHandler = async (item) => {

    const existItem = cart.cartItem.find((x) => x._id === item._id)
    // console.log("existItem", item._id)
    // const existItem = cart.cartItem.find((x) => x);
    // console.log(existItem)
    // console.log(item._id)
    const quantity = existItem ? existItem.quantity + 1 : 1;
    // console.log("quantity",quantity)
    // console.log("products",existItem)
    const { data } = await axios.get(`/api/${item._id}`);
    // console.log("data",data)
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })

  }




  return (
    <Layout title={"home page"} >
      <div className='flex flex-wrap   mt-16  items-center justify-center rounded-xl px-4'>
        {/* {console.log(data)} */}
        {products.map((item) => (
          <ProductItem key={item._id}
            addtocartHandler={addtocartHandler}
            product={item}
          >
          </ProductItem>
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