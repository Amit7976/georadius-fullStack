import dynamic from "next/dynamic";
import {
  IoHomeOutline,
  IoHome,
  IoFlashOutline,
  IoFlash,
} from "react-icons/io5";
import { MdAddBox, MdOutlineAddBox } from "react-icons/md";
import { CgSearchLoading, CgSearch } from "react-icons/cg";
import { FaUser } from "react-icons/fa";

// 👇 Dynamic imports with ssr: false ensure they behave as client components
const HomePage = dynamic(() => import("@/src/app/page"), { ssr: false });
const RapidPage = dynamic(() => import("@/src/app/rapid/page"), { ssr: false });
const PostPage = dynamic(() => import("@/src/app/post/page"), { ssr: false });
const SearchPage = dynamic(() => import("@/src/app/search/page"), {
  ssr: false,
});
const ProfilePage = dynamic(() => import("@/src/app/[profile]/page"), {
  ssr: false,
});

export const tabs = [
  {
    key: "home",
    name: "Home",
    icon: IoHomeOutline,
    icon2: IoHome,
    component: HomePage,
  },
  {
    key: "rapid",
    name: "Rapid",
    icon: IoFlashOutline,
    icon2: IoFlash,
    component: RapidPage,
  },
  {
    key: "post",
    name: "Post",
    icon: MdOutlineAddBox,
    icon2: MdAddBox,
    component: PostPage,
  },
  {
    key: "search",
    name: "Search",
    icon: CgSearch,
    icon2: CgSearchLoading,
    component: SearchPage,
  },
  {
    key: "profile",
    name: "Profile",
    icon: FaUser,
    icon2: FaUser,
    component: ProfilePage,
  },
];
