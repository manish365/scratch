import NextAuth, { NextAuthOptions } from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
// import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { server } from '../../../utils/server'; 

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID ?? '',
      clientSecret: process.env.FACEBOOK_SECRET ?? ''
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? '',
      clientSecret: process.env.GOOGLE_SECRET ?? ''
    }),
    // // Passwordless / email sign in
    // EmailProvider({
    //     server: process.env.MAIL_SERVER,
    //     from: 'NextAuth.js <no-reply@example.com>'
    // }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        //   const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
        console.log('Before destructering==>>>', credentials);
        if(!credentials) {
            console.log('Error in credentials------');
            return null; 
        }
        const { username, password } = credentials as any;
        console.log('After destructering==>>>', username, password);
        const email = username;

        // const res = await fetch(`${server}/api/login`, {
        const res = await fetch(`${server}/user-auth/login`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({
            email,
            password
          }),
        });

        const dataResult = await res.json();
        console.log('Data Response ==>>>', dataResult);
        if (dataResult?.success) {
          const user: any = {
            success: dataResult?.success,
            id: dataResult?.data?.user?._id,
            name: dataResult?.data?.user?.profile?.name,
            email: dataResult?.data?.user?.email?.address,
            status: dataResult?.data?.user?.status,
            accountType: dataResult?.data?.user?.accountType,
            accessToken: dataResult?.data?.token
          }

          if (res.ok && user) {
            console.log('True=---==');
            console.log('Data Result ==>>>', user);
            return user;
          } else {
            console.log('False=---==');
            return null;
          }
        } else {
          console.error(dataResult?.error);
          return;
        }
      }
    })
    // ...add more providers here
  ],
  session: {
    strategy: 'jwt',
    maxAge: 1 * 2 * 60 * 60, //  2 hours
    // maxAge: 10 * 60, //  10 mins
  },
  callbacks: {
    jwt: async ({ user, token }) => {
      // console.log('callbacks user & Token==>>>>', user, token);
      const userData: any = user;
      if (userData) {
        token.accessToken = userData.accessToken;
        token.status = userData.status;
        token.accountType = userData.accountType;
      }
      return token;
    },
    session: async ({ session, token }) => {
      const sessionData: any = session;
      // console.log('callbacks sessionData & Token==>>>>', sessionData, token);

      if (sessionData?.user) {
        sessionData.user.id = token.sub;
        sessionData.user.accessToken = token.accessToken;
        sessionData.user.status = token.status;
        sessionData.user.accountType = token.accountType;
      }
      return sessionData;
    },
  },
  pages: {
    signIn: '/auth/login'
  },
}

export default NextAuth(authOptions);