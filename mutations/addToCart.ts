/* eslint-disable */
import { KeystoneContext } from '@keystone-next/keystone/types';
import { Session } from '../types';
// import { CartItemCreateInput } from '../.keystone/admin/pages/';

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<any> {
  const user = context.session as Session;
  if (!user.itemId) { 
    throw new Error('You must be signed in!');
  }

  console.log("Adding cart....")
  const allCartItems = await context.query.CartItem.findMany({
    where: { user: { id: { equals: user.itemId } }, product: { id: productId } },
    resolveFields: 'id,quantity,product'
  });

  const [existingCartItem] = allCartItems;
  console.log(existingCartItem)

  if (existingCartItem) {
    return await context.db.CartItem.updateOne({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity: parseInt(existingCartItem.quantity) + 1,
      },
    });
  }

  return await context.db.CartItem.createOne({
      data: {
          product: {connect: {id: productId}},
          user: {connect: {id: user.itemId}}
      },
  })
}

export default addToCart