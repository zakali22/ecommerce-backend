/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { Session } from '../types';
// import { OrderCreateInput } from '../.keystone/schema-types';
import {stripeConfig} from "../lib/stripe"

interface Arguments {
    token: string
}

const graphql = String.raw
async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
) {
  // Check if user is signed in
  const userId = context.session.itemId

  console.log(userId)
  if(!userId) throw new Error("You must be signedin")

  // Get the user details (incl. cart)
  const user = await context.lists.User.findOne({
    where: {id: userId},
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          id
          name
          price
          description
          photo {
            id
            image {
              publicUrlTransformed
            }
          }
        }
      }
    `
  })

  
  // Get the cart
  const cartItems = user.cart.filter(cartItem => cartItem.product)
  console.log(cartItems)

  // Get the cart total
  const amount = user.cart.reduce((total, cartItem) => {
    return total + (cartItem.quantity * cartItem.product.price)
  }, 0)

  console.log(amount)

  // Create the payment/charge on stripe
  const charge = await stripeConfig.paymentIntents.create({
    amount, 
    currency: 'USD',
    confirm: true,
    payment_method: token
  }).catch(err => {
    throw new Error(err.message)
  })



  // Convert cart items in to order items
  const orderItems = cartItems.map(cartItem => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: {connect: {id: cartItem.product.photo.id}}
    }

    return orderItem
  })

  // Create the order in the DB
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: {id: userId }}
    }
  })

  // Clear existing cart 
  const cartItemIds = user.cart.map(cartItem => cartItem.id)
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds
  })


  return order
}

export default checkout