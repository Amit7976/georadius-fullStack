import Image from "next/image";
import ClientPermissionHandler from "./ClientPermissionHandler";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


export default function MainContent() {
  return (
    <div className="flex items-center justify-around flex-col space-y-4 h-[94.3vh] bg-white">
      <Image
        src={"/gif/location.gif"}
        alt="On Boarding Get Started"
        width={200}
        height={200}
        priority
        className="w-full h-96 object-contain"
      />

      <div>{/* EMPTY DIV FOR SPACING */}</div>

      <div className="flex items-center justify-center flex-col space-y-4 text-center bg-gray-50 px-10 pt-10 pb-5 rounded-t-[5rem] w-full bottom-0 absolute">
        <h1 className="text-xl font-semibold text-black">Location Permission</h1>
        <p className="text-sm font-medium text-gray-600">
          We need your location to deliver the most accurate, real-time news on the go.
        </p>

        <ClientPermissionHandler />
      </div>
    </div>
  );
}
