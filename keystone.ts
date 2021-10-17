/*
Welcome to Keystone! This file is what keystone uses to start the app.

It looks at the default export, and expects a Keystone config object.

You can find all the config options in our docs here: https://keystonejs.com/docs/apis/config
*/

import { config } from '@keystone-next/keystone';

// Look in the schema file for how we define our lists, and how users interact with them through graphql or the Admin UI
import { lists } from './schema';

// Keystone auth is configured separately - check out the basic auth setup we are importing from our auth file.
import { withAuth, session } from './auth';
import 'dotenv/config';

const host = 'https://ecommerce-backend-phi.vercel.app/'

let DATABASE_URL;
if (process.env.NODE_ENV === 'production') {
  DATABASE_URL = 'postgres://ytgljqrwusenvi:bc9fe5e0c5321d5772936e073126797e86e90ca30fd668d89b9a5817e3fe3af2@ec2-52-203-164-61.compute-1.amazonaws.com:5432/dat8ko9h7c54uo'
} else {
  DATABASE_URL = 'postgresql://postgres:Londonishome54%2F@localhost:5432/postgres?sslaccept=accept_invalid_certs&schema=public&connect_timeout=0'
}

export default withAuth(
  // Using the config function helps typescript guide you to the available options.
  config({
    // the db sets the database provider - we're using sqlite for the fastest startup experience
    db: {
      provider: 'postgresql',
      useMigrations: true,
      url: DATABASE_URL,
    },
    server: {
      // cors: {
      //   credentials: true,
      //   origin: process.env.FRONTEND_URL
      // }
    },
    // This config allows us to set up features of the Admin UI https://keystonejs.com/docs/apis/config#ui
    ui: {
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists,
    session,
  })
);
