"use server";

import { connectToDatabase } from "@/src/lib/utils";
import { User } from "@/src/models/userModel";
import bcryptjs from "bcryptjs";
import { redirect } from "next/navigation";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const credentialsSignUp = async (
  fullname: string,
  email: string,
  password: string
) => {
  // CONNECT TO THE DATABASE
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw new Error("Internal server error");
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // console.log("fullname:" + fullname);
  // console.log("email:" + email);
  // console.log("password:" + password);

  // // console.log("1");
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  let candidate = await User.findOne({ email });

  // console.log(candidate);

  // // console.log("2");
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  if (candidate) {
    // // console.log("4");
    throw new Error("Email already registered");
  }
  // // console.log("5");

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  // console.log("hashedPassword:" + hashedPassword);
  // // console.log("6");

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Create the new candidate and get the result
  // console.log("Create the new candidate and get the result");

  // Create a new candidate
  candidate = await User.create({
    fullname,
    email,
    image: "",
    password: hashedPassword,
  });

  // // console.log("7");

  // console.log("candidate fetch data: " + candidate);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  redirect("/pages/auth/signin");
};

export { credentialsSignUp };
