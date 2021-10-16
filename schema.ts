import { list } from '@keystone-next/keystone';

import {
  text,
  relationship,
  password,
  integer,
  timestamp,
  select,
} from '@keystone-next/keystone/fields';

import { document } from '@keystone-next/fields-document';
import { cloudinaryImage } from '@keystone-next/cloudinary';

export const lists = {
  // User
  User: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ isIndexed: 'unique', validation: { isRequired: true } }),
      password: password({ validation: { isRequired: true } }),
      cart: relationship({ ref: 'CartItem.user', many: true }),
      order: relationship({ ref: 'Order.user', many: true }),
    },
  }), 

  // Product
  Product: list({
    fields: {
      name: text({         
        validation: {
          isRequired: true
        },
      }),
      description: text({
        validation: {
          isRequired: true
        },
        ui: {
          displayMode: 'textarea',
        },
      }),
      photo: relationship({
        ref: 'ProductImage.product',
        ui: {
          displayMode: 'cards',
          cardFields: ['image', 'altText'],
          inlineCreate: { fields: ['image', 'altText'] },
          inlineEdit: { fields: ['image', 'altText'] },
        },
      }),
      status: select({
        validation: {
          isRequired: true
        },
        options: [
          { label: 'Available', value: 'AVAILABLE' },
          { label: 'In progress', value: 'IN_PROGRESS' },
          { label: 'Unavailable', value: 'UNAVAILABLE' },
        ],
        defaultValue: 'IN_PROGRESS',
        ui: {
          displayMode: 'segmented-control',
        },
      }),
      price: integer(),
    },
    ui: {
      listView: {
        initialColumns: ['name', 'photo', 'description', 'status', 'price'],
      },
    },
  }), 

  // ProductImage
  ProductImage: list({
    fields: {
      image: cloudinaryImage({
        cloudinary: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME || "sickfits-tut",
          apiKey: process.env.CLOUDINARY_KEY || "455733831566597",
          apiSecret: process.env.CLOUDINARY_SECRET || "jkVnYtnoMR4xPxnKwBNHLMp0G3Y",
          folder: 'sickfits-tut',
        },
        label: 'Source',
      }),
      altText: text(),
      product: relationship({
        ref: 'Product.photo',
      }),
    },
    ui: {
      listView: {
        initialColumns: ['altText', 'image', 'product'],
      },
    },
  }),

  // Order
  Order: list({
    fields: {
      total: integer(),
      items: relationship({ ref: 'OrderItem.order', many: true }),
      user: relationship({ ref: 'User.order' }),
      charge: text(),
    },
  }),

  // OrderItem
  OrderItem: list({
    fields: {
      name: text({ 
        validation: {
          isRequired: true
        },
      }),
      description: text({
        validation: {
          isRequired: true
        },
        ui: {
          displayMode: 'textarea',
        },
      }),
      photo: relationship({
        ref: 'ProductImage',
        ui: {
          displayMode: 'cards',
          cardFields: ['image', 'altText'],
          inlineCreate: { fields: ['image', 'altText'] },
          inlineEdit: { fields: ['image', 'altText'] },
        },
      }),
      price: integer(),
      quantity: integer(),
      order: relationship({ ref: 'Order.items' }),
    },
    ui: {
      listView: {
        initialColumns: ['name', 'photo', 'description', 'price'],
      },
    },
  }),

  // CartItem
  CartItem: list({
    fields: {
      quantity: integer({
        defaultValue: 1,
        validation: {
          isRequired: true
        }
      }),
      product: relationship({ ref: 'Product' }),
      user: relationship({ ref: 'User.cart' }),
    },
    ui: {
      listView: {
        initialColumns: ['product', 'quantity', 'user'],
      },
    },
  }),
};
