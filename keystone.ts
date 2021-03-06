import { config } from '@keystone-next/keystone';

// Look in the schema file for how we define our lists, and how users interact with them through graphql or the Admin UI
import { lists } from './schema';
// import { insertSeedData } from './seed-data';
import { withAuth, session } from './auth';
import { extendGraphqlSchema } from './mutations';
import 'dotenv/config';

const host = 'https://ecommerce-backend-phi.vercel.app/'

let DATABASE_URL = 'postgres://ytgljqrwusenvi:bc9fe5e0c5321d5772936e073126797e86e90ca30fd668d89b9a5817e3fe3af2@ec2-52-203-164-61.compute-1.amazonaws.com:5432/dat8ko9h7c54uo'
let FRONTEND_URL = 'https://ecommerce-nextjs-one.vercel.app'

export default withAuth(
  // Using the config function helps typescript guide you to the available options.
  config({
    // the db sets the database provider - we're using sqlite for the fastest startup experience
    db: {
      provider: 'postgresql',
      useMigrations: true,
      url: DATABASE_URL,
      async onConnect(keystone) {
        if (process.argv.includes('--seed-data')) {
          // await insertSeedData(keystone);
        }
      },
    },
    server: {
      cors: {
        credentials: true,
        allowedHeaders: ['Content-Type', 'API-Key', 'API-Secret', 'Access-Control-Allow-Headers', 'accept', 'client-security-token'],
        origin: [FRONTEND_URL, 'https://studio.apollographql.com'],
        methods: ["GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS"],
        preflightContinue: false,
        maxAge: 86400
      }
    },
    graphql: {
      cors: {
        credentials: true,
        origin: [FRONTEND_URL, 'https://studio.apollographql.com'],
        allowedHeaders: ['Content-Type', 'API-Key', 'API-Secret', 'Access-Control-Allow-Headers', 'accept', 'client-security-token'],
        methods: ["GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS"],
        preflightContinue: false,
        maxAge: 86400
      }
    },
    // This config allows us to set up features of the Admin UI https://keystonejs.com/docs/apis/config#ui
    ui: {
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: (context) => !!context.session?.data,
    },
    extendGraphqlSchema,
    lists,
    session,
  })
);
