import NextAuth, { AuthError } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "./models/userModel";
import { compare } from "bcryptjs";
import { connectToDatabase } from "./lib/utils";
import { UserProfile } from "./models/UserProfileModel";


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      username: string | boolean;
    };
  }
}

// DATABASE CONNECTION FUNCTION
const LoadDb = async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit process if connection fails
  }
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          console.log("====================================");
          console.log("Please provide both email and password");
          console.log("====================================");
          throw new Error("Please provide both email and password");
        }

        await LoadDb();

        const user = await User.findOne({ email }).select("+password");

        console.log("====================================");
        console.log(user);
        console.log("====================================");

        if (!user || !user.password) {
          console.log("====================================");
          console.log("Invalid Email and Password");
          console.log("====================================");
          throw new Error("Invalid Email and Password");
        }

        let isMatch = await compare(password, user.password);

        if (!isMatch) {
          isMatch = await compare(password, user.tempPassword);
        }

        if (!isMatch) {
          console.log("====================================");
          console.log("Invalid Email and Password");
          console.log("====================================");
          throw new Error("Invalid Email and Password");
        }
        console.log("====================================");
        console.log(user.fullname);
        console.log("====================================");
        console.log(user.email);
        console.log("====================================");
        console.log(user._id);
        console.log("====================================");
        return { fullname: user.fullname, email: user.email, id: user._id };
      },
    }),
  ],
  pages: {
    signIn: "/pages/auth/signin",
  },

  callbacks: {
    async session({ session, token }) {
      await LoadDb();

      const user = await User.findOne({ email: token.email }, { _id: 1 });

      if (user) {
        session.user.id = user._id.toString();
        
        const userProfile = await UserProfile.findOne(
          { userId: user._id },
          { username: 1 } // Only fetch username
        );

        session.user.username = userProfile ? userProfile.username : false;
        
      } else {
        session.user.username = false;
      }
  
      return session;
    },
   
    signIn: async ({ user, account }) => {
      console.log("====================================");
      console.log("Google");
      console.log("====================================");
      if (account?.provider === "google") {
        try {
          const { email, name, image, id } = user;

          console.log("====================================");
          console.log("New trying....");
          console.log("====================================");

          await connectToDatabase();

          let alreadyUser = await User.findOne({ email });

          console.log("====================================");
          console.log(alreadyUser);
          console.log("====================================");

          if (!alreadyUser) {
            console.log("====================================");
            console.log("User Not Found");
            console.log("====================================");

            console.log("====================================");
            console.log("Creating user....");
            console.log("====================================");
            alreadyUser = await User.create({
              email,
              fullname: name,
              image,
              googleId: id,
            });
            console.log("====================================");
            console.log(alreadyUser);
            console.log("====================================");
          }
          console.log("====================================");
          console.log("candidate fetch data: " + alreadyUser);
          console.log("====================================");

          console.log("====================================");
          console.log(
            "Create a new CandidateProfileModel entry with the candidate's _id"
          );
          console.log("====================================");

          console.log("====================================");
          console.log(alreadyUser);
          console.log("====================================");
          console.log(alreadyUser._id);
          console.log("====================================");
          console.log(name);
          console.log("====================================");
          console.log(image);
          console.log("====================================");

          const userProfile = await UserProfile.create({
            userId: alreadyUser._id,
            fullname: name,
            profileImage: image,
          });

          console.log("====================================");
          console.log(userProfile);
          console.log("====================================");
          console.log("data inserted");

          return true;
        } catch (error) {
          console.log("====================================");
          console.log("Error while creating user");
          console.log("====================================");
          console.log(error);
          console.log("====================================");
          throw new AuthError("Error while creating user");
        }
      }
      return true;
    },
  },
});
