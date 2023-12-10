import React from 'react'
import animationData from "../../../../public/animations/location.json";
import cx from "classnames";
import Animation from '~/app/_components/Animation';
import Link from 'next/link';
const MyCars = () => {
  return (
    <div>
        <BannierAddAuction />
    </div>
  )
}

export default MyCars



const BannierAddAuction = () => {
    
  return (
    <div
      className={cx(
        "mx-auto flex h-[250px] max-w-[900px] flex-row items-center justify-between rounded-xl bg-primary p-10 drop-shadow-xl"
      )}
    >
      <div className="flex max-w-[400px] flex-grow flex-col gap-4 space-y-6">
        <p className="text-xl font-bold text-white">
        Join the excitement: create your own auction or post your car and watch the bids roll in!
        </p>
        <Link
          href={"/new-car"}
          className="w-[200px] no-underline cursor-pointer rounded-xl bg-white px-4 py-2 text-center text-primary"
        >
          Add a car
        </Link>
      </div>
      <div className="w-[330px]">
        <Animation animationData={animationData} />
      </div>
    </div>
  );
};
