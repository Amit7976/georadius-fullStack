import Image from "next/image";
import GetStartedButton from "./GetStartedButton";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


function MainContent() {
  return (
    <div className="flex items-center justify-around flex-col space-y-4 h-[94.3vh] bg-white">
      <Image
        src={"/images/onBoarding1.png"}
        alt="On Boarding Get Started"
        width={200}
        height={200}
        priority
        className="w-full h-96 object-contain"
      />
      <div>{/* // EMPTY DIV ELEMENT FOR SPACING */}</div>
      <div className="flex items-center justify-center flex-col space-y-4 text-center bg-gray-100 text-black px-10 pt-10 pb-5 rounded-t-[5rem] w-full bottom-0 absolute">
        <h1 className="text-xl font-semibold">Stay Updated</h1>
        <p className="text-sm font-medium text-gray-600">
          Get Breaking News and your most local news directly in your feed
        </p>

        {/* Wrap with div and call handleClick */}
        <GetStartedButton />
      </div>
    </div>
  );
}

export default MainContent;
