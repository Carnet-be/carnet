import Image from "next/image";
import { priceFormatter } from "~/utils/function";
import Logo from "./_components/ui/logo";

// Carnet is a morketplace for selling and buying cars, and also sell car as auction
export const About = () => {
  return (
    <section
      id="about"
      className="dark:bg-dark overflow-hidden bg-white pb-12 pt-20 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap items-center justify-between">
          <div className="w-full px-4 lg:w-6/12">
            <div className="-mx-3 flex items-center sm:-mx-4">
              <div className="w-full px-3 sm:px-4 xl:w-1/2">
                <div className="py-3 sm:py-4">
                  <Image
                    src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2836&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    width={200}
                    height={400}
                    className="w-full rounded-2xl"
                  />
                </div>
                <div className="py-3 sm:py-4">
                  <Image
                    src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2836&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    width={200}
                    height={400}
                    className="w-full rounded-2xl"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:px-4 xl:w-1/2">
                <div className="relative z-10 my-4">
                  <Image
                    src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2836&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    width={200}
                    height={400}
                    className="w-full rounded-2xl"
                  />
                  <span className="absolute -bottom-7 -right-7 z-[-1]">
                    <svg
                      width="134"
                      height="106"
                      viewBox="0 0 134 106"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="1.66667"
                        cy="104"
                        r="1.66667"
                        transform="rotate(-90 1.66667 104)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="16.3333"
                        cy="104"
                        r="1.66667"
                        transform="rotate(-90 16.3333 104)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="31"
                        cy="104"
                        r="1.66667"
                        transform="rotate(-90 31 104)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="45.6667"
                        cy="104"
                        r="1.66667"
                        transform="rotate(-90 45.6667 104)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="60.3334"
                        cy="104"
                        r="1.66667"
                        transform="rotate(-90 60.3334 104)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="88.6667"
                        cy="104"
                        r="1.66667"
                        transform="rotate(-90 88.6667 104)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="117.667"
                        cy="104"
                        r="1.66667"
                        transform="rotate(-90 117.667 104)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="74.6667"
                        cy="104"
                        r="1.66667"
                        transform="rotate(-90 74.6667 104)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="103"
                        cy="104"
                        r="1.66667"
                        transform="rotate(-90 103 104)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="132"
                        cy="104"
                        r="1.66667"
                        transform="rotate(-90 132 104)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="1.66667"
                        cy="89.3333"
                        r="1.66667"
                        transform="rotate(-90 1.66667 89.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="16.3333"
                        cy="89.3333"
                        r="1.66667"
                        transform="rotate(-90 16.3333 89.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="31"
                        cy="89.3333"
                        r="1.66667"
                        transform="rotate(-90 31 89.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="45.6667"
                        cy="89.3333"
                        r="1.66667"
                        transform="rotate(-90 45.6667 89.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="60.3333"
                        cy="89.3338"
                        r="1.66667"
                        transform="rotate(-90 60.3333 89.3338)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="88.6667"
                        cy="89.3338"
                        r="1.66667"
                        transform="rotate(-90 88.6667 89.3338)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="117.667"
                        cy="89.3338"
                        r="1.66667"
                        transform="rotate(-90 117.667 89.3338)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="74.6667"
                        cy="89.3338"
                        r="1.66667"
                        transform="rotate(-90 74.6667 89.3338)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="103"
                        cy="89.3338"
                        r="1.66667"
                        transform="rotate(-90 103 89.3338)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="132"
                        cy="89.3338"
                        r="1.66667"
                        transform="rotate(-90 132 89.3338)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="1.66667"
                        cy="74.6673"
                        r="1.66667"
                        transform="rotate(-90 1.66667 74.6673)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="1.66667"
                        cy="31.0003"
                        r="1.66667"
                        transform="rotate(-90 1.66667 31.0003)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="16.3333"
                        cy="74.6668"
                        r="1.66667"
                        transform="rotate(-90 16.3333 74.6668)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="16.3333"
                        cy="31.0003"
                        r="1.66667"
                        transform="rotate(-90 16.3333 31.0003)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="31"
                        cy="74.6668"
                        r="1.66667"
                        transform="rotate(-90 31 74.6668)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="31"
                        cy="31.0003"
                        r="1.66667"
                        transform="rotate(-90 31 31.0003)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="45.6667"
                        cy="74.6668"
                        r="1.66667"
                        transform="rotate(-90 45.6667 74.6668)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="45.6667"
                        cy="31.0003"
                        r="1.66667"
                        transform="rotate(-90 45.6667 31.0003)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="60.3333"
                        cy="74.6668"
                        r="1.66667"
                        transform="rotate(-90 60.3333 74.6668)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="60.3333"
                        cy="30.9998"
                        r="1.66667"
                        transform="rotate(-90 60.3333 30.9998)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="88.6667"
                        cy="74.6668"
                        r="1.66667"
                        transform="rotate(-90 88.6667 74.6668)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="88.6667"
                        cy="30.9998"
                        r="1.66667"
                        transform="rotate(-90 88.6667 30.9998)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="117.667"
                        cy="74.6668"
                        r="1.66667"
                        transform="rotate(-90 117.667 74.6668)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="117.667"
                        cy="30.9998"
                        r="1.66667"
                        transform="rotate(-90 117.667 30.9998)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="74.6667"
                        cy="74.6668"
                        r="1.66667"
                        transform="rotate(-90 74.6667 74.6668)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="74.6667"
                        cy="30.9998"
                        r="1.66667"
                        transform="rotate(-90 74.6667 30.9998)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="103"
                        cy="74.6668"
                        r="1.66667"
                        transform="rotate(-90 103 74.6668)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="103"
                        cy="30.9998"
                        r="1.66667"
                        transform="rotate(-90 103 30.9998)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="132"
                        cy="74.6668"
                        r="1.66667"
                        transform="rotate(-90 132 74.6668)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="132"
                        cy="30.9998"
                        r="1.66667"
                        transform="rotate(-90 132 30.9998)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="1.66667"
                        cy="60.0003"
                        r="1.66667"
                        transform="rotate(-90 1.66667 60.0003)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="1.66667"
                        cy="16.3333"
                        r="1.66667"
                        transform="rotate(-90 1.66667 16.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="16.3333"
                        cy="60.0003"
                        r="1.66667"
                        transform="rotate(-90 16.3333 60.0003)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="16.3333"
                        cy="16.3333"
                        r="1.66667"
                        transform="rotate(-90 16.3333 16.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="31"
                        cy="60.0003"
                        r="1.66667"
                        transform="rotate(-90 31 60.0003)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="31"
                        cy="16.3333"
                        r="1.66667"
                        transform="rotate(-90 31 16.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="45.6667"
                        cy="60.0003"
                        r="1.66667"
                        transform="rotate(-90 45.6667 60.0003)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="45.6667"
                        cy="16.3333"
                        r="1.66667"
                        transform="rotate(-90 45.6667 16.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="60.3333"
                        cy="60.0003"
                        r="1.66667"
                        transform="rotate(-90 60.3333 60.0003)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="60.3333"
                        cy="16.3333"
                        r="1.66667"
                        transform="rotate(-90 60.3333 16.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="88.6667"
                        cy="60.0003"
                        r="1.66667"
                        transform="rotate(-90 88.6667 60.0003)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="88.6667"
                        cy="16.3333"
                        r="1.66667"
                        transform="rotate(-90 88.6667 16.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="117.667"
                        cy="60.0003"
                        r="1.66667"
                        transform="rotate(-90 117.667 60.0003)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="117.667"
                        cy="16.3333"
                        r="1.66667"
                        transform="rotate(-90 117.667 16.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="74.6667"
                        cy="60.0003"
                        r="1.66667"
                        transform="rotate(-90 74.6667 60.0003)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="74.6667"
                        cy="16.3333"
                        r="1.66667"
                        transform="rotate(-90 74.6667 16.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="103"
                        cy="60.0003"
                        r="1.66667"
                        transform="rotate(-90 103 60.0003)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="103"
                        cy="16.3333"
                        r="1.66667"
                        transform="rotate(-90 103 16.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="132"
                        cy="60.0003"
                        r="1.66667"
                        transform="rotate(-90 132 60.0003)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="132"
                        cy="16.3333"
                        r="1.66667"
                        transform="rotate(-90 132 16.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="1.66667"
                        cy="45.3333"
                        r="1.66667"
                        transform="rotate(-90 1.66667 45.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="1.66667"
                        cy="1.66683"
                        r="1.66667"
                        transform="rotate(-90 1.66667 1.66683)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="16.3333"
                        cy="45.3333"
                        r="1.66667"
                        transform="rotate(-90 16.3333 45.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="16.3333"
                        cy="1.66683"
                        r="1.66667"
                        transform="rotate(-90 16.3333 1.66683)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="31"
                        cy="45.3333"
                        r="1.66667"
                        transform="rotate(-90 31 45.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="31"
                        cy="1.66683"
                        r="1.66667"
                        transform="rotate(-90 31 1.66683)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="45.6667"
                        cy="45.3333"
                        r="1.66667"
                        transform="rotate(-90 45.6667 45.3333)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="45.6667"
                        cy="1.66683"
                        r="1.66667"
                        transform="rotate(-90 45.6667 1.66683)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="60.3333"
                        cy="45.3338"
                        r="1.66667"
                        transform="rotate(-90 60.3333 45.3338)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="60.3333"
                        cy="1.66683"
                        r="1.66667"
                        transform="rotate(-90 60.3333 1.66683)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="88.6667"
                        cy="45.3338"
                        r="1.66667"
                        transform="rotate(-90 88.6667 45.3338)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="88.6667"
                        cy="1.66683"
                        r="1.66667"
                        transform="rotate(-90 88.6667 1.66683)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="117.667"
                        cy="45.3338"
                        r="1.66667"
                        transform="rotate(-90 117.667 45.3338)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="117.667"
                        cy="1.66683"
                        r="1.66667"
                        transform="rotate(-90 117.667 1.66683)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="74.6667"
                        cy="45.3338"
                        r="1.66667"
                        transform="rotate(-90 74.6667 45.3338)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="74.6667"
                        cy="1.66683"
                        r="1.66667"
                        transform="rotate(-90 74.6667 1.66683)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="103"
                        cy="45.3338"
                        r="1.66667"
                        transform="rotate(-90 103 45.3338)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="103"
                        cy="1.66683"
                        r="1.66667"
                        transform="rotate(-90 103 1.66683)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="132"
                        cy="45.3338"
                        r="1.66667"
                        transform="rotate(-90 132 45.3338)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="132"
                        cy="1.66683"
                        r="1.66667"
                        transform="rotate(-90 132 1.66683)"
                        fill="#3056D3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
            <div className="mt-10 lg:mt-0">
              <span className="mb-4 block text-lg font-semibold text-primary">
                Why Choose Us
              </span>
              <h2 className="text-dark mb-5 text-3xl font-bold dark:text-white sm:text-[40px]/[48px]">
                Make the best when buying a car
              </h2>
              <p className="text-body-color dark:text-dark-6 mb-5 text-base">
                Carnet is a morketplace for selling and buying cars, and also
                sell car as auction
              </p>
              <p className="text-body-color dark:text-dark-6 mb-8 text-base">
                Carnet is a morketplace for selling and buying cars, and also
                sell car as auction
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-7 py-3 text-center text-base font-medium text-white hover:bg-opacity-90"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <footer className="dark:bg-dark relative z-10 bg-white pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 sm:w-2/3 lg:w-3/12">
            <div className="mb-10 w-full">
              <a className="mb-6 inline-block max-w-[160px]">
                <Logo size={60} />
              </a>
              <p className="text-body-color dark:text-dark-6 mb-7 text-base">
                Carnet is a morketplace for selling and buying cars, and also
                sell car as auction
              </p>
              <p className="text-dark flex items-center text-sm font-medium dark:text-white">
                <span className="mr-3 text-primary">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_941_15626)">
                      <path
                        d="M15.1875 19.4688C14.3438 19.4688 13.375 19.25 12.3125 18.8438C10.1875 18 7.84377 16.375 5.75002 14.2813C3.65627 12.1875 2.03127 9.84377 1.18752 7.68752C0.250019 5.37502 0.343769 3.46877 1.43752 2.40627C1.46877 2.37502 1.53127 2.34377 1.56252 2.31252L4.18752 0.750025C4.84377 0.375025 5.68752 0.562525 6.12502 1.18752L7.96877 3.93753C8.40627 4.59378 8.21877 5.46877 7.59377 5.90627L6.46877 6.68752C7.28127 8.00002 9.59377 11.2188 13.2813 13.5313L13.9688 12.5313C14.5 11.7813 15.3438 11.5625 16.0313 12.0313L18.7813 13.875C19.4063 14.3125 19.5938 15.1563 19.2188 15.8125L17.6563 18.4375C17.625 18.5 17.5938 18.5313 17.5625 18.5625C17 19.1563 16.1875 19.4688 15.1875 19.4688ZM2.37502 3.46878C1.78127 4.12503 1.81252 5.46877 2.50002 7.18752C3.28127 9.15627 4.78127 11.3125 6.75002 13.2813C8.68752 15.2188 10.875 16.7188 12.8125 17.5C14.5 18.1875 15.8438 18.2188 16.5313 17.625L18.0313 15.0625C18.0313 15.0313 18.0313 15.0313 18.0313 15L15.2813 13.1563C15.2813 13.1563 15.2188 13.1875 15.1563 13.2813L14.4688 14.2813C14.0313 14.9063 13.1875 15.0938 12.5625 14.6875C8.62502 12.25 6.18752 8.84377 5.31252 7.46877C4.90627 6.81252 5.06252 5.96878 5.68752 5.53128L6.81252 4.75002V4.71878L4.96877 1.96877C4.96877 1.93752 4.93752 1.93752 4.90627 1.96877L2.37502 3.46878Z"
                        fill="currentColor"
                      />
                      <path
                        d="M18.3125 8.90633C17.9375 8.90633 17.6563 8.62508 17.625 8.25008C17.375 5.09383 14.7813 2.56258 11.5938 2.34383C11.2188 2.31258 10.9063 2.00008 10.9375 1.59383C10.9688 1.21883 11.2813 0.906333 11.6875 0.937583C15.5625 1.18758 18.7188 4.25008 19.0313 8.12508C19.0625 8.50008 18.7813 8.84383 18.375 8.87508C18.375 8.90633 18.3438 8.90633 18.3125 8.90633Z"
                        fill="currentColor"
                      />
                      <path
                        d="M15.2187 9.18755C14.875 9.18755 14.5625 8.93755 14.5312 8.56255C14.3437 6.87505 13.0312 5.56255 11.3437 5.3438C10.9687 5.31255 10.6875 4.93755 10.7187 4.56255C10.75 4.18755 11.125 3.9063 11.5 3.93755C13.8437 4.2188 15.6562 6.0313 15.9375 8.37505C15.9687 8.75005 15.7187 9.0938 15.3125 9.1563C15.25 9.18755 15.2187 9.18755 15.2187 9.18755Z"
                        fill="currentColor"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_941_15626">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span>+012 (345) 678 99</span>
              </p>
            </div>
          </div>
          <div className="w-full px-4 sm:w-1/2 lg:w-2/12"></div>
          <div className="w-full px-4 sm:w-1/2 lg:w-2/12">
            <div className="mb-10 w-full">
              <h4 className="text-dark mb-9 text-lg font-semibold dark:text-white">
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="javascript:void(0)"
                    className="text-body-color dark:text-dark-6 inline-block text-base leading-loose hover:text-primary"
                  >
                    About Carnet
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="text-body-color dark:text-dark-6 inline-block text-base leading-loose hover:text-primary"
                  >
                    Contact
                  </a>
                </li>

                <li>
                  <a
                    href="javascript:void(0)"
                    className="text-body-color dark:text-dark-6 inline-block text-base leading-loose hover:text-primary"
                  >
                    Privacy & Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full px-4 sm:w-1/2 lg:w-2/12">
            <div className="mb-10 w-full">
              <h4 className="text-dark mb-9 text-lg font-semibold dark:text-white">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="javascript:void(0)"
                    className="text-body-color dark:text-dark-6 inline-block text-base leading-loose hover:text-primary"
                  >
                    Premium Support
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="text-body-color dark:text-dark-6 inline-block text-base leading-loose hover:text-primary"
                  >
                    Our Services
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="text-body-color dark:text-dark-6 inline-block text-base leading-loose hover:text-primary"
                  >
                    Know Our Team
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full px-4 sm:w-1/2 lg:w-3/12">
            <div className="mb-10 w-full">
              <h4 className="text-dark mb-9 text-lg font-semibold dark:text-white">
                Follow Us On
              </h4>
              <div className="mb-6 flex items-center">
                <a
                  href="javascript:void(0)"
                  className="border-stroke text-dark dark:border-dark-3 mr-3 flex h-8 w-8 items-center justify-center rounded-full border hover:border-primary hover:bg-primary hover:text-white dark:text-white dark:hover:border-primary sm:mr-4 lg:mr-3 xl:mr-4"
                >
                  <svg
                    width="8"
                    height="16"
                    viewBox="0 0 8 16"
                    className="fill-current"
                  >
                    <path d="M7.43902 6.4H6.19918H5.75639V5.88387V4.28387V3.76774H6.19918H7.12906C7.3726 3.76774 7.57186 3.56129 7.57186 3.25161V0.516129C7.57186 0.232258 7.39474 0 7.12906 0H5.51285C3.76379 0 2.54609 1.44516 2.54609 3.5871V5.83226V6.34839H2.10329H0.597778C0.287819 6.34839 0 6.63226 0 7.04516V8.90323C0 9.26452 0.243539 9.6 0.597778 9.6H2.05902H2.50181V10.1161V15.3032C2.50181 15.6645 2.74535 16 3.09959 16H5.18075C5.31359 16 5.42429 15.9226 5.51285 15.8194C5.60141 15.7161 5.66783 15.5355 5.66783 15.3806V10.1419V9.62581H6.13276H7.12906C7.41688 9.62581 7.63828 9.41935 7.68256 9.10968V9.08387V9.05806L7.99252 7.27742C8.01466 7.09677 7.99252 6.89032 7.85968 6.68387C7.8154 6.55484 7.61614 6.42581 7.43902 6.4Z" />
                  </svg>
                </a>
                <a
                  href="javascript:void(0)"
                  className="border-stroke text-dark dark:border-dark-3 mr-3 flex h-8 w-8 items-center justify-center rounded-full border hover:border-primary hover:bg-primary hover:text-white dark:text-white dark:hover:border-primary sm:mr-4 lg:mr-3 xl:mr-4"
                >
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    className="fill-current"
                  >
                    <path d="M14.2194 2.06654L15.2 0.939335C15.4839 0.634051 15.5613 0.399217 15.5871 0.2818C14.8129 0.704501 14.0903 0.845401 13.6258 0.845401H13.4452L13.3419 0.751468C12.7226 0.258317 11.9484 0 11.1226 0C9.31613 0 7.89677 1.36204 7.89677 2.93542C7.89677 3.02935 7.89677 3.17025 7.92258 3.26419L8 3.73386L7.45806 3.71037C4.15484 3.61644 1.44516 1.03327 1.00645 0.587084C0.283871 1.76125 0.696774 2.88845 1.13548 3.59296L2.0129 4.90802L0.619355 4.20352C0.645161 5.18982 1.05806 5.96477 1.85806 6.52838L2.55484 6.99804L1.85806 7.25636C2.29677 8.45401 3.27742 8.94716 4 9.13503L4.95484 9.36986L4.05161 9.93346C2.60645 10.8728 0.8 10.8024 0 10.7319C1.62581 11.7652 3.56129 12 4.90323 12C5.90968 12 6.65806 11.9061 6.83871 11.8356C14.0645 10.2857 14.4 4.41487 14.4 3.2407V3.07632L14.5548 2.98239C15.4323 2.23092 15.7935 1.8317 16 1.59687C15.9226 1.62035 15.8194 1.66732 15.7161 1.6908L14.2194 2.06654Z" />
                  </svg>
                </a>
                <a
                  href="javascript:void(0)"
                  className="border-stroke text-dark dark:border-dark-3 mr-3 flex h-8 w-8 items-center justify-center rounded-full border hover:border-primary hover:bg-primary hover:text-white dark:text-white dark:hover:border-primary sm:mr-4 lg:mr-3 xl:mr-4"
                >
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    className="fill-current"
                  >
                    <path d="M15.6645 1.88018C15.4839 1.13364 14.9419 0.552995 14.2452 0.359447C13.0065 6.59222e-08 8 0 8 0C8 0 2.99355 6.59222e-08 1.75484 0.359447C1.05806 0.552995 0.516129 1.13364 0.335484 1.88018C0 3.23502 0 6 0 6C0 6 0 8.79263 0.335484 10.1198C0.516129 10.8664 1.05806 11.447 1.75484 11.6406C2.99355 12 8 12 8 12C8 12 13.0065 12 14.2452 11.6406C14.9419 11.447 15.4839 10.8664 15.6645 10.1198C16 8.79263 16 6 16 6C16 6 16 3.23502 15.6645 1.88018ZM6.4 8.57143V3.42857L10.5548 6L6.4 8.57143Z" />
                  </svg>
                </a>
                <a
                  href="javascript:void(0)"
                  className="border-stroke text-dark dark:border-dark-3 mr-3 flex h-8 w-8 items-center justify-center rounded-full border hover:border-primary hover:bg-primary hover:text-white dark:text-white dark:hover:border-primary sm:mr-4 lg:mr-3 xl:mr-4"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    className="fill-current"
                  >
                    <path d="M13.0214 0H1.02084C0.453707 0 0 0.451613 0 1.01613V12.9839C0 13.5258 0.453707 14 1.02084 14H12.976C13.5432 14 13.9969 13.5484 13.9969 12.9839V0.993548C14.0422 0.451613 13.5885 0 13.0214 0ZM4.15142 11.9H2.08705V5.23871H4.15142V11.9ZM3.10789 4.3129C2.42733 4.3129 1.90557 3.77097 1.90557 3.11613C1.90557 2.46129 2.45002 1.91935 3.10789 1.91935C3.76577 1.91935 4.31022 2.46129 4.31022 3.11613C4.31022 3.77097 3.81114 4.3129 3.10789 4.3129ZM11.9779 11.9H9.9135V8.67097C9.9135 7.90323 9.89082 6.8871 8.82461 6.8871C7.73571 6.8871 7.57691 7.74516 7.57691 8.60323V11.9H5.51254V5.23871H7.53154V6.16452H7.55423C7.84914 5.62258 8.50701 5.08065 9.52785 5.08065C11.6376 5.08065 12.0232 6.43548 12.0232 8.2871V11.9H11.9779Z" />
                  </svg>
                </a>
              </div>
              <p className="text-body-color dark:text-dark-6 text-base">
                &copy; 2024 Carnet
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <span className="absolute bottom-0 left-0 z-[-1]">
          <svg
            width="217"
            height="229"
            viewBox="0 0 217 229"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-64 140.5C-64 62.904 -1.096 1.90666e-05 76.5 1.22829e-05C154.096 5.49924e-06 217 62.904 217 140.5C217 218.096 154.096 281 76.5 281C-1.09598 281 -64 218.096 -64 140.5Z"
              fill="url(#paint0_linear_1179_5)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1179_5"
                x1="76.5"
                y1="281"
                x2="76.5"
                y2="1.22829e-05"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#3056D3" stop-opacity="0.08" />
                <stop offset="1" stop-color="#C4C4C4" stop-opacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="absolute right-10 top-10 z-[-1]">
          <svg
            width="75"
            height="75"
            viewBox="0 0 75 75"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M37.5 -1.63918e-06C58.2107 -2.54447e-06 75 16.7893 75 37.5C75 58.2107 58.2107 75 37.5 75C16.7893 75 -7.33885e-07 58.2107 -1.63918e-06 37.5C-2.54447e-06 16.7893 16.7893 -7.33885e-07 37.5 -1.63918e-06Z"
              fill="url(#paint0_linear_1179_4)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1179_4"
                x1="-1.63917e-06"
                y1="37.5"
                x2="75"
                y2="37.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#13C296" stop-opacity="0.31" />
                <stop offset="1" stop-color="#C4C4C4" stop-opacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
    </footer>
  );
};

export const Pricing = () => {
  return (
    <section
      id="pricing"
      className="dark:bg-dark relative z-10 overflow-hidden bg-white pb-12 pt-20 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center">
              <span className="mb-2 block text-lg font-semibold text-primary">
                Pricing
              </span>
              <h2 className="text-dark mb-3 text-3xl font-bold leading-[1.208] dark:text-white sm:text-4xl md:text-[40px]">
                Our Pricing Plan
              </h2>
              <p className="text-body-color dark:text-dark-6 text-base">
                Choose the right plan for your business. All plans include
                unlimited support and free updates.
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="border-stroke shadow-pricing dark:border-dark-3 dark:bg-dark-2 relative z-10 mb-10 overflow-hidden rounded-[10px] border-2 bg-white px-8 py-10 sm:p-12 lg:px-6 lg:py-10 xl:p-[50px]">
              <span className="mb-3 block text-lg font-semibold text-primary">
                Personal
              </span>
              <h2 className="text-dark mb-5 text-[42px] font-bold dark:text-white">
                <span>$0</span>
                <span className="text-body-color dark:text-dark-6 text-base font-medium">
                  / month
                </span>
              </h2>
              <p className="border-stroke text-body-color dark:border-dark-3 dark:text-dark-6 mb-8 border-b pb-8 text-base">
                Perfect for a normal user who wants to buy a car
              </p>
              <div className="mb-9 flex flex-col gap-[14px]">
                <p className="text-body-color dark:text-dark-6 text-base">
                  1 User
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  All UI components
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  Lifetime access
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  Free updates
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  Use on 1 (one) project
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  3 Months support
                </p>
              </div>
              <a
                href="javascript:void(0)"
                className="border-stroke dark:border-dark-3 block w-full rounded-md border bg-transparent p-3 text-center text-base font-medium text-primary transition hover:border-primary hover:bg-primary hover:text-white"
              >
                Choose Personal
              </a>

              <div>
                <span className="absolute right-0 top-7 z-[-1]">
                  <svg
                    width="77"
                    height="172"
                    viewBox="0 0 77 172"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="86" cy="86" r="86" fill="url(#paint0_linear)" />
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="86"
                        y1="0"
                        x2="86"
                        y2="172"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#3056D3" stop-opacity="0.09" />
                        <stop
                          offset="1"
                          stop-color="#C4C4C4"
                          stop-opacity="0"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className="absolute right-4 top-4 z-[-1]">
                  <svg
                    width="41"
                    height="89"
                    viewBox="0 0 41 89"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="38.9138"
                      cy="87.4849"
                      r="1.42021"
                      transform="rotate(180 38.9138 87.4849)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="74.9871"
                      r="1.42021"
                      transform="rotate(180 38.9138 74.9871)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="62.4892"
                      r="1.42021"
                      transform="rotate(180 38.9138 62.4892)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="38.3457"
                      r="1.42021"
                      transform="rotate(180 38.9138 38.3457)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="13.634"
                      r="1.42021"
                      transform="rotate(180 38.9138 13.634)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="50.2754"
                      r="1.42021"
                      transform="rotate(180 38.9138 50.2754)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="26.1319"
                      r="1.42021"
                      transform="rotate(180 38.9138 26.1319)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="1.42021"
                      r="1.42021"
                      transform="rotate(180 38.9138 1.42021)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="87.4849"
                      r="1.42021"
                      transform="rotate(180 26.4157 87.4849)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="74.9871"
                      r="1.42021"
                      transform="rotate(180 26.4157 74.9871)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="62.4892"
                      r="1.42021"
                      transform="rotate(180 26.4157 62.4892)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="38.3457"
                      r="1.42021"
                      transform="rotate(180 26.4157 38.3457)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="13.634"
                      r="1.42021"
                      transform="rotate(180 26.4157 13.634)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="50.2754"
                      r="1.42021"
                      transform="rotate(180 26.4157 50.2754)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="26.1319"
                      r="1.42021"
                      transform="rotate(180 26.4157 26.1319)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="1.4202"
                      r="1.42021"
                      transform="rotate(180 26.4157 1.4202)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="87.4849"
                      r="1.42021"
                      transform="rotate(180 13.9177 87.4849)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="74.9871"
                      r="1.42021"
                      transform="rotate(180 13.9177 74.9871)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="62.4892"
                      r="1.42021"
                      transform="rotate(180 13.9177 62.4892)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="38.3457"
                      r="1.42021"
                      transform="rotate(180 13.9177 38.3457)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="13.634"
                      r="1.42021"
                      transform="rotate(180 13.9177 13.634)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="50.2754"
                      r="1.42021"
                      transform="rotate(180 13.9177 50.2754)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="26.1319"
                      r="1.42021"
                      transform="rotate(180 13.9177 26.1319)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="1.42019"
                      r="1.42021"
                      transform="rotate(180 13.9177 1.42019)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="87.4849"
                      r="1.42021"
                      transform="rotate(180 1.41963 87.4849)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="74.9871"
                      r="1.42021"
                      transform="rotate(180 1.41963 74.9871)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="62.4892"
                      r="1.42021"
                      transform="rotate(180 1.41963 62.4892)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="38.3457"
                      r="1.42021"
                      transform="rotate(180 1.41963 38.3457)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="13.634"
                      r="1.42021"
                      transform="rotate(180 1.41963 13.634)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="50.2754"
                      r="1.42021"
                      transform="rotate(180 1.41963 50.2754)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="26.1319"
                      r="1.42021"
                      transform="rotate(180 1.41963 26.1319)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="1.4202"
                      r="1.42021"
                      transform="rotate(180 1.41963 1.4202)"
                      fill="#3056D3"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="border-stroke shadow-pricing dark:border-dark-3 dark:bg-dark-2 relative z-10 mb-10 overflow-hidden rounded-[10px] border-2 bg-white px-8 py-10 sm:p-12 lg:px-6 lg:py-10 xl:p-[50px]">
              <span className="mb-3 block text-lg font-semibold text-primary">
                Business
              </span>
              <h2 className="text-dark mb-5 text-[42px] font-bold dark:text-white">
                <span>$30</span>
                <span className="text-body-color dark:text-dark-6 text-base font-medium">
                  / month
                </span>
              </h2>
              <p className="border-stroke text-body-color dark:border-dark-3 dark:text-dark-6 mb-8 border-b pb-8 text-base">
                Perfect for a small garage who wants to sell cars
              </p>
              <div className="mb-9 flex flex-col gap-[14px]">
                <p className="text-body-color dark:text-dark-6 text-base">
                  5 Users
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  All UI components
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  Lifetime access
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  Free updates
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  Use on 3 (Three) project
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  4 Months support
                </p>
              </div>
              <a
                href="javascript:void(0)"
                className="block w-full rounded-md border border-primary bg-primary p-3 text-center text-base font-medium text-white transition hover:bg-opacity-90"
              >
                Choose Business
              </a>

              <div>
                <span className="absolute right-0 top-7 z-[-1]">
                  <svg
                    width="77"
                    height="172"
                    viewBox="0 0 77 172"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="86" cy="86" r="86" fill="url(#paint0_linear)" />
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="86"
                        y1="0"
                        x2="86"
                        y2="172"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#3056D3" stop-opacity="0.09" />
                        <stop
                          offset="1"
                          stop-color="#C4C4C4"
                          stop-opacity="0"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className="absolute right-4 top-4 z-[-1]">
                  <svg
                    width="41"
                    height="89"
                    viewBox="0 0 41 89"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="38.9138"
                      cy="87.4849"
                      r="1.42021"
                      transform="rotate(180 38.9138 87.4849)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="74.9871"
                      r="1.42021"
                      transform="rotate(180 38.9138 74.9871)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="62.4892"
                      r="1.42021"
                      transform="rotate(180 38.9138 62.4892)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="38.3457"
                      r="1.42021"
                      transform="rotate(180 38.9138 38.3457)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="13.634"
                      r="1.42021"
                      transform="rotate(180 38.9138 13.634)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="50.2754"
                      r="1.42021"
                      transform="rotate(180 38.9138 50.2754)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="26.1319"
                      r="1.42021"
                      transform="rotate(180 38.9138 26.1319)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="1.42021"
                      r="1.42021"
                      transform="rotate(180 38.9138 1.42021)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="87.4849"
                      r="1.42021"
                      transform="rotate(180 26.4157 87.4849)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="74.9871"
                      r="1.42021"
                      transform="rotate(180 26.4157 74.9871)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="62.4892"
                      r="1.42021"
                      transform="rotate(180 26.4157 62.4892)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="38.3457"
                      r="1.42021"
                      transform="rotate(180 26.4157 38.3457)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="13.634"
                      r="1.42021"
                      transform="rotate(180 26.4157 13.634)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="50.2754"
                      r="1.42021"
                      transform="rotate(180 26.4157 50.2754)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="26.1319"
                      r="1.42021"
                      transform="rotate(180 26.4157 26.1319)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="1.4202"
                      r="1.42021"
                      transform="rotate(180 26.4157 1.4202)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="87.4849"
                      r="1.42021"
                      transform="rotate(180 13.9177 87.4849)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="74.9871"
                      r="1.42021"
                      transform="rotate(180 13.9177 74.9871)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="62.4892"
                      r="1.42021"
                      transform="rotate(180 13.9177 62.4892)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="38.3457"
                      r="1.42021"
                      transform="rotate(180 13.9177 38.3457)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="13.634"
                      r="1.42021"
                      transform="rotate(180 13.9177 13.634)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="50.2754"
                      r="1.42021"
                      transform="rotate(180 13.9177 50.2754)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="26.1319"
                      r="1.42021"
                      transform="rotate(180 13.9177 26.1319)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="1.42019"
                      r="1.42021"
                      transform="rotate(180 13.9177 1.42019)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="87.4849"
                      r="1.42021"
                      transform="rotate(180 1.41963 87.4849)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="74.9871"
                      r="1.42021"
                      transform="rotate(180 1.41963 74.9871)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="62.4892"
                      r="1.42021"
                      transform="rotate(180 1.41963 62.4892)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="38.3457"
                      r="1.42021"
                      transform="rotate(180 1.41963 38.3457)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="13.634"
                      r="1.42021"
                      transform="rotate(180 1.41963 13.634)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="50.2754"
                      r="1.42021"
                      transform="rotate(180 1.41963 50.2754)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="26.1319"
                      r="1.42021"
                      transform="rotate(180 1.41963 26.1319)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="1.4202"
                      r="1.42021"
                      transform="rotate(180 1.41963 1.4202)"
                      fill="#3056D3"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="border-stroke shadow-pricing dark:border-dark-3 dark:bg-dark-2 relative z-10 mb-10 overflow-hidden rounded-[10px] border-2 bg-white px-8 py-10 sm:p-12 lg:px-6 lg:py-10 xl:p-[50px]">
              <span className="mb-3 block text-lg font-semibold text-primary">
                Entreprise
              </span>
              <h2 className="text-dark mb-5 text-[42px] font-bold dark:text-white">
                <span>$99</span>
                <span className="text-body-color dark:text-dark-6 text-base font-medium">
                  / month
                </span>
              </h2>
              <p className="border-stroke text-body-color dark:border-dark-3 dark:text-dark-6 mb-8 border-b pb-8 text-base">
                Perfect for a big garage who wants to sell cars.
              </p>
              <div className="mb-9 flex flex-col gap-[14px]">
                <p className="text-body-color dark:text-dark-6 text-base">
                  Unlimited Users
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  All UI components
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  Lifetime access
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  Free updates
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  Use on Unlimited project
                </p>
                <p className="text-body-color dark:text-dark-6 text-base">
                  12 Months support
                </p>
              </div>
              <a
                href="javascript:void(0)"
                className="border-stroke dark:border-dark-3 block w-full rounded-md border bg-transparent p-3 text-center text-base font-medium text-primary transition hover:border-primary hover:bg-primary hover:text-white"
              >
                Choose Entreprise
              </a>

              <div>
                <span className="absolute right-0 top-7 z-[-1]">
                  <svg
                    width="77"
                    height="172"
                    viewBox="0 0 77 172"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="86" cy="86" r="86" fill="url(#paint0_linear)" />
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="86"
                        y1="0"
                        x2="86"
                        y2="172"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#3056D3" stop-opacity="0.09" />
                        <stop
                          offset="1"
                          stop-color="#C4C4C4"
                          stop-opacity="0"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className="absolute right-4 top-4 z-[-1]">
                  <svg
                    width="41"
                    height="89"
                    viewBox="0 0 41 89"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="38.9138"
                      cy="87.4849"
                      r="1.42021"
                      transform="rotate(180 38.9138 87.4849)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="74.9871"
                      r="1.42021"
                      transform="rotate(180 38.9138 74.9871)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="62.4892"
                      r="1.42021"
                      transform="rotate(180 38.9138 62.4892)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="38.3457"
                      r="1.42021"
                      transform="rotate(180 38.9138 38.3457)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="13.634"
                      r="1.42021"
                      transform="rotate(180 38.9138 13.634)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="50.2754"
                      r="1.42021"
                      transform="rotate(180 38.9138 50.2754)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="26.1319"
                      r="1.42021"
                      transform="rotate(180 38.9138 26.1319)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.9138"
                      cy="1.42021"
                      r="1.42021"
                      transform="rotate(180 38.9138 1.42021)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="87.4849"
                      r="1.42021"
                      transform="rotate(180 26.4157 87.4849)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="74.9871"
                      r="1.42021"
                      transform="rotate(180 26.4157 74.9871)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="62.4892"
                      r="1.42021"
                      transform="rotate(180 26.4157 62.4892)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="38.3457"
                      r="1.42021"
                      transform="rotate(180 26.4157 38.3457)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="13.634"
                      r="1.42021"
                      transform="rotate(180 26.4157 13.634)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="50.2754"
                      r="1.42021"
                      transform="rotate(180 26.4157 50.2754)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="26.1319"
                      r="1.42021"
                      transform="rotate(180 26.4157 26.1319)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.4157"
                      cy="1.4202"
                      r="1.42021"
                      transform="rotate(180 26.4157 1.4202)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="87.4849"
                      r="1.42021"
                      transform="rotate(180 13.9177 87.4849)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="74.9871"
                      r="1.42021"
                      transform="rotate(180 13.9177 74.9871)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="62.4892"
                      r="1.42021"
                      transform="rotate(180 13.9177 62.4892)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="38.3457"
                      r="1.42021"
                      transform="rotate(180 13.9177 38.3457)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="13.634"
                      r="1.42021"
                      transform="rotate(180 13.9177 13.634)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="50.2754"
                      r="1.42021"
                      transform="rotate(180 13.9177 50.2754)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="26.1319"
                      r="1.42021"
                      transform="rotate(180 13.9177 26.1319)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.9177"
                      cy="1.42019"
                      r="1.42021"
                      transform="rotate(180 13.9177 1.42019)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="87.4849"
                      r="1.42021"
                      transform="rotate(180 1.41963 87.4849)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="74.9871"
                      r="1.42021"
                      transform="rotate(180 1.41963 74.9871)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="62.4892"
                      r="1.42021"
                      transform="rotate(180 1.41963 62.4892)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="38.3457"
                      r="1.42021"
                      transform="rotate(180 1.41963 38.3457)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="13.634"
                      r="1.42021"
                      transform="rotate(180 1.41963 13.634)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="50.2754"
                      r="1.42021"
                      transform="rotate(180 1.41963 50.2754)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="26.1319"
                      r="1.42021"
                      transform="rotate(180 1.41963 26.1319)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.41963"
                      cy="1.4202"
                      r="1.42021"
                      transform="rotate(180 1.41963 1.4202)"
                      fill="#3056D3"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Contact = () => {
  return (
    <section
      id="contact"
      className="dark:bg-dark relative z-10 overflow-hidden bg-white py-20 lg:py-[120px]"
    >
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap lg:justify-between">
          <div className="w-full px-4 lg:w-1/2 xl:w-6/12">
            <div className="mb-12 max-w-[570px] lg:mb-0">
              <span className="mb-4 block text-base font-semibold text-primary">
                Contact Us
              </span>
              <h2 className="text-dark mb-6 text-[32px] font-bold uppercase dark:text-white sm:text-[40px] lg:text-[36px] xl:text-[40px]">
                GET IN TOUCH WITH US
              </h2>
              <p className="text-body-color dark:text-dark-6 mb-9 text-base leading-relaxed">
                We are ready to build your garage. Tell us more about your
                project.
              </p>

              <div className="mb-8 flex w-full max-w-[370px]">
                <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M30.6 11.8002L17.7 3.5002C16.65 2.8502 15.3 2.8502 14.3 3.5002L1.39998 11.8002C0.899983 12.1502 0.749983 12.8502 1.04998 13.3502C1.39998 13.8502 2.09998 14.0002 2.59998 13.7002L3.44998 13.1502V25.8002C3.44998 27.5502 4.84998 28.9502 6.59998 28.9502H25.4C27.15 28.9502 28.55 27.5502 28.55 25.8002V13.1502L29.4 13.7002C29.6 13.8002 29.8 13.9002 30 13.9002C30.35 13.9002 30.75 13.7002 30.95 13.4002C31.3 12.8502 31.15 12.1502 30.6 11.8002ZM13.35 26.7502V18.5002C13.35 18.0002 13.75 17.6002 14.25 17.6002H17.75C18.25 17.6002 18.65 18.0002 18.65 18.5002V26.7502H13.35ZM26.3 25.8002C26.3 26.3002 25.9 26.7002 25.4 26.7002H20.9V18.5002C20.9 16.8002 19.5 15.4002 17.8 15.4002H14.3C12.6 15.4002 11.2 16.8002 11.2 18.5002V26.7502H6.69998C6.19998 26.7502 5.79998 26.3502 5.79998 25.8502V11.7002L15.5 5.4002C15.8 5.2002 16.2 5.2002 16.5 5.4002L26.3 11.7002V25.8002Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="w-full">
                  <h4 className="text-dark mb-1 text-xl font-bold dark:text-white">
                    Our Location
                  </h4>
                  <p className="text-body-color dark:text-dark-6 text-base">
                    99 S.t Park Pekanbaru 28292. Belgium
                  </p>
                </div>
              </div>

              <div className="mb-8 flex w-full max-w-[370px]">
                <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_941_17577)">
                      <path
                        d="M24.3 31.1499C22.95 31.1499 21.4 30.7999 19.7 30.1499C16.3 28.7999 12.55 26.1999 9.19997 22.8499C5.84997 19.4999 3.24997 15.7499 1.89997 12.2999C0.39997 8.59994 0.54997 5.54994 2.29997 3.84994C2.34997 3.79994 2.44997 3.74994 2.49997 3.69994L6.69997 1.19994C7.74997 0.599942 9.09997 0.899942 9.79997 1.89994L12.75 6.29994C13.45 7.34994 13.15 8.74994 12.15 9.44994L10.35 10.6999C11.65 12.7999 15.35 17.9499 21.25 21.6499L22.35 20.0499C23.2 18.8499 24.55 18.4999 25.65 19.2499L30.05 22.1999C31.05 22.8999 31.35 24.2499 30.75 25.2999L28.25 29.4999C28.2 29.5999 28.15 29.6499 28.1 29.6999C27.2 30.6499 25.9 31.1499 24.3 31.1499ZM3.79997 5.54994C2.84997 6.59994 2.89997 8.74994 3.99997 11.4999C5.24997 14.6499 7.64997 18.0999 10.8 21.2499C13.9 24.3499 17.4 26.7499 20.5 27.9999C23.2 29.0999 25.35 29.1499 26.45 28.1999L28.85 24.0999C28.85 24.0499 28.85 24.0499 28.85 23.9999L24.45 21.0499C24.45 21.0499 24.35 21.0999 24.25 21.2499L23.15 22.8499C22.45 23.8499 21.1 24.1499 20.1 23.4999C13.8 19.5999 9.89997 14.1499 8.49997 11.9499C7.84997 10.8999 8.09997 9.54994 9.09997 8.84994L10.9 7.59994V7.54994L7.94997 3.14994C7.94997 3.09994 7.89997 3.09994 7.84997 3.14994L3.79997 5.54994Z"
                        fill="currentColor"
                      />
                      <path
                        d="M29.3 14.25C28.7 14.25 28.25 13.8 28.2 13.2C27.8 8.15003 23.65 4.10003 18.55 3.75003C17.95 3.70003 17.45 3.20003 17.5 2.55003C17.55 1.95003 18.05 1.45003 18.7 1.50003C24.9 1.90003 29.95 6.80003 30.45 13C30.5 13.6 30.05 14.15 29.4 14.2C29.4 14.25 29.35 14.25 29.3 14.25Z"
                        fill="currentColor"
                      />
                      <path
                        d="M24.35 14.7002C23.8 14.7002 23.3 14.3002 23.25 13.7002C22.95 11.0002 20.85 8.90018 18.15 8.55018C17.55 8.50018 17.1 7.90018 17.15 7.30018C17.2 6.70018 17.8 6.25018 18.4 6.30018C22.15 6.75018 25.05 9.65018 25.5 13.4002C25.55 14.0002 25.15 14.5502 24.5 14.6502C24.4 14.7002 24.35 14.7002 24.35 14.7002Z"
                        fill="currentColor"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_941_17577">
                        <rect width="32" height="32" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="w-full">
                  <h4 className="text-dark mb-1 text-xl font-bold dark:text-white">
                    Phone Number
                  </h4>
                  <p className="text-body-color dark:text-dark-6 text-base">
                    (+62)81 414 257 9980
                  </p>
                </div>
              </div>

              <div className="mb-8 flex w-full max-w-[370px]">
                <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M28 4.7998H3.99998C2.29998 4.7998 0.849976 6.1998 0.849976 7.9498V24.1498C0.849976 25.8498 2.24998 27.2998 3.99998 27.2998H28C29.7 27.2998 31.15 25.8998 31.15 24.1498V7.8998C31.15 6.1998 29.7 4.7998 28 4.7998ZM28 7.0498C28.05 7.0498 28.1 7.0498 28.15 7.0498L16 14.8498L3.84998 7.0498C3.89998 7.0498 3.94998 7.0498 3.99998 7.0498H28ZM28 24.9498H3.99998C3.49998 24.9498 3.09998 24.5498 3.09998 24.0498V9.2498L14.8 16.7498C15.15 16.9998 15.55 17.0998 15.95 17.0998C16.35 17.0998 16.75 16.9998 17.1 16.7498L28.8 9.2498V24.0998C28.9 24.5998 28.5 24.9498 28 24.9498Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="w-full">
                  <h4 className="text-dark mb-1 text-xl font-bold dark:text-white">
                    Email Address
                  </h4>
                  <p className="text-body-color dark:text-dark-6 text-base">
                    info@carnet.be
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
            <div className="dark:bg-dark-2 relative rounded-lg bg-white p-8 shadow-lg sm:p-12">
              <form>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="border-stroke text-body-color dark:border-dark-3 dark:bg-dark dark:text-dark-6 w-full rounded border px-[14px] py-3 text-base outline-none focus:border-primary"
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="border-stroke text-body-color dark:border-dark-3 dark:bg-dark dark:text-dark-6 w-full rounded border px-[14px] py-3 text-base outline-none focus:border-primary"
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Your Phone"
                    className="border-stroke text-body-color dark:border-dark-3 dark:bg-dark dark:text-dark-6 w-full rounded border px-[14px] py-3 text-base outline-none focus:border-primary"
                  />
                </div>
                <div className="mb-6">
                  <textarea
                    rows={6}
                    placeholder="Your Message"
                    className="border-stroke text-body-color dark:border-dark-3 dark:bg-dark dark:text-dark-6 w-full resize-none rounded border px-[14px] py-3 text-base outline-none focus:border-primary"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full rounded border border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                  >
                    Send Message
                  </button>
                </div>
              </form>
              <div>
                <span className="absolute -right-9 -top-10 z-[-1]">
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clip-rule="evenodd"
                      d="M0 100C0 44.7715 0 0 0 0C55.2285 0 100 44.7715 100 100C100 100 100 100 0 100Z"
                      fill="#3056D3"
                    />
                  </svg>
                </span>
                <span className="absolute -right-10 top-[90px] z-[-1]">
                  <svg
                    width="34"
                    height="134"
                    viewBox="0 0 34 134"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="31.9993"
                      cy="132"
                      r="1.66667"
                      transform="rotate(180 31.9993 132)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="117.333"
                      r="1.66667"
                      transform="rotate(180 31.9993 117.333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="102.667"
                      r="1.66667"
                      transform="rotate(180 31.9993 102.667)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="88"
                      r="1.66667"
                      transform="rotate(180 31.9993 88)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="73.3333"
                      r="1.66667"
                      transform="rotate(180 31.9993 73.3333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="45"
                      r="1.66667"
                      transform="rotate(180 31.9993 45)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="16"
                      r="1.66667"
                      transform="rotate(180 31.9993 16)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="59"
                      r="1.66667"
                      transform="rotate(180 31.9993 59)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="30.6666"
                      r="1.66667"
                      transform="rotate(180 31.9993 30.6666)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="1.66665"
                      r="1.66667"
                      transform="rotate(180 31.9993 1.66665)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="132"
                      r="1.66667"
                      transform="rotate(180 17.3333 132)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="117.333"
                      r="1.66667"
                      transform="rotate(180 17.3333 117.333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="102.667"
                      r="1.66667"
                      transform="rotate(180 17.3333 102.667)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="88"
                      r="1.66667"
                      transform="rotate(180 17.3333 88)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="73.3333"
                      r="1.66667"
                      transform="rotate(180 17.3333 73.3333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="45"
                      r="1.66667"
                      transform="rotate(180 17.3333 45)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="16"
                      r="1.66667"
                      transform="rotate(180 17.3333 16)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="59"
                      r="1.66667"
                      transform="rotate(180 17.3333 59)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="30.6666"
                      r="1.66667"
                      transform="rotate(180 17.3333 30.6666)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="1.66665"
                      r="1.66667"
                      transform="rotate(180 17.3333 1.66665)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="132"
                      r="1.66667"
                      transform="rotate(180 2.66536 132)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="117.333"
                      r="1.66667"
                      transform="rotate(180 2.66536 117.333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="102.667"
                      r="1.66667"
                      transform="rotate(180 2.66536 102.667)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="88"
                      r="1.66667"
                      transform="rotate(180 2.66536 88)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="73.3333"
                      r="1.66667"
                      transform="rotate(180 2.66536 73.3333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="45"
                      r="1.66667"
                      transform="rotate(180 2.66536 45)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="16"
                      r="1.66667"
                      transform="rotate(180 2.66536 16)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="59"
                      r="1.66667"
                      transform="rotate(180 2.66536 59)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="30.6666"
                      r="1.66667"
                      transform="rotate(180 2.66536 30.6666)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="1.66665"
                      r="1.66667"
                      transform="rotate(180 2.66536 1.66665)"
                      fill="#13C296"
                    />
                  </svg>
                </span>
                <span className="absolute -bottom-7 -left-7 z-[-1]">
                  <svg
                    width="107"
                    height="134"
                    viewBox="0 0 107 134"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="104.999"
                      cy="132"
                      r="1.66667"
                      transform="rotate(180 104.999 132)"
                      fill="#13C296"
                    />
                    <circle
                      cx="104.999"
                      cy="117.333"
                      r="1.66667"
                      transform="rotate(180 104.999 117.333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="104.999"
                      cy="102.667"
                      r="1.66667"
                      transform="rotate(180 104.999 102.667)"
                      fill="#13C296"
                    />
                    <circle
                      cx="104.999"
                      cy="88"
                      r="1.66667"
                      transform="rotate(180 104.999 88)"
                      fill="#13C296"
                    />
                    <circle
                      cx="104.999"
                      cy="73.3333"
                      r="1.66667"
                      transform="rotate(180 104.999 73.3333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="104.999"
                      cy="45"
                      r="1.66667"
                      transform="rotate(180 104.999 45)"
                      fill="#13C296"
                    />
                    <circle
                      cx="104.999"
                      cy="16"
                      r="1.66667"
                      transform="rotate(180 104.999 16)"
                      fill="#13C296"
                    />
                    <circle
                      cx="104.999"
                      cy="59"
                      r="1.66667"
                      transform="rotate(180 104.999 59)"
                      fill="#13C296"
                    />
                    <circle
                      cx="104.999"
                      cy="30.6666"
                      r="1.66667"
                      transform="rotate(180 104.999 30.6666)"
                      fill="#13C296"
                    />
                    <circle
                      cx="104.999"
                      cy="1.66665"
                      r="1.66667"
                      transform="rotate(180 104.999 1.66665)"
                      fill="#13C296"
                    />
                    <circle
                      cx="90.3333"
                      cy="132"
                      r="1.66667"
                      transform="rotate(180 90.3333 132)"
                      fill="#13C296"
                    />
                    <circle
                      cx="90.3333"
                      cy="117.333"
                      r="1.66667"
                      transform="rotate(180 90.3333 117.333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="90.3333"
                      cy="102.667"
                      r="1.66667"
                      transform="rotate(180 90.3333 102.667)"
                      fill="#13C296"
                    />
                    <circle
                      cx="90.3333"
                      cy="88"
                      r="1.66667"
                      transform="rotate(180 90.3333 88)"
                      fill="#13C296"
                    />
                    <circle
                      cx="90.3333"
                      cy="73.3333"
                      r="1.66667"
                      transform="rotate(180 90.3333 73.3333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="90.3333"
                      cy="45"
                      r="1.66667"
                      transform="rotate(180 90.3333 45)"
                      fill="#13C296"
                    />
                    <circle
                      cx="90.3333"
                      cy="16"
                      r="1.66667"
                      transform="rotate(180 90.3333 16)"
                      fill="#13C296"
                    />
                    <circle
                      cx="90.3333"
                      cy="59"
                      r="1.66667"
                      transform="rotate(180 90.3333 59)"
                      fill="#13C296"
                    />
                    <circle
                      cx="90.3333"
                      cy="30.6666"
                      r="1.66667"
                      transform="rotate(180 90.3333 30.6666)"
                      fill="#13C296"
                    />
                    <circle
                      cx="90.3333"
                      cy="1.66665"
                      r="1.66667"
                      transform="rotate(180 90.3333 1.66665)"
                      fill="#13C296"
                    />
                    <circle
                      cx="75.6654"
                      cy="132"
                      r="1.66667"
                      transform="rotate(180 75.6654 132)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="132"
                      r="1.66667"
                      transform="rotate(180 31.9993 132)"
                      fill="#13C296"
                    />
                    <circle
                      cx="75.6654"
                      cy="117.333"
                      r="1.66667"
                      transform="rotate(180 75.6654 117.333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="117.333"
                      r="1.66667"
                      transform="rotate(180 31.9993 117.333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="75.6654"
                      cy="102.667"
                      r="1.66667"
                      transform="rotate(180 75.6654 102.667)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="102.667"
                      r="1.66667"
                      transform="rotate(180 31.9993 102.667)"
                      fill="#13C296"
                    />
                    <circle
                      cx="75.6654"
                      cy="88"
                      r="1.66667"
                      transform="rotate(180 75.6654 88)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="88"
                      r="1.66667"
                      transform="rotate(180 31.9993 88)"
                      fill="#13C296"
                    />
                    <circle
                      cx="75.6654"
                      cy="73.3333"
                      r="1.66667"
                      transform="rotate(180 75.6654 73.3333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="73.3333"
                      r="1.66667"
                      transform="rotate(180 31.9993 73.3333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="75.6654"
                      cy="45"
                      r="1.66667"
                      transform="rotate(180 75.6654 45)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="45"
                      r="1.66667"
                      transform="rotate(180 31.9993 45)"
                      fill="#13C296"
                    />
                    <circle
                      cx="75.6654"
                      cy="16"
                      r="1.66667"
                      transform="rotate(180 75.6654 16)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="16"
                      r="1.66667"
                      transform="rotate(180 31.9993 16)"
                      fill="#13C296"
                    />
                    <circle
                      cx="75.6654"
                      cy="59"
                      r="1.66667"
                      transform="rotate(180 75.6654 59)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="59"
                      r="1.66667"
                      transform="rotate(180 31.9993 59)"
                      fill="#13C296"
                    />
                    <circle
                      cx="75.6654"
                      cy="30.6666"
                      r="1.66667"
                      transform="rotate(180 75.6654 30.6666)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="30.6666"
                      r="1.66667"
                      transform="rotate(180 31.9993 30.6666)"
                      fill="#13C296"
                    />
                    <circle
                      cx="75.6654"
                      cy="1.66665"
                      r="1.66667"
                      transform="rotate(180 75.6654 1.66665)"
                      fill="#13C296"
                    />
                    <circle
                      cx="31.9993"
                      cy="1.66665"
                      r="1.66667"
                      transform="rotate(180 31.9993 1.66665)"
                      fill="#13C296"
                    />
                    <circle
                      cx="60.9993"
                      cy="132"
                      r="1.66667"
                      transform="rotate(180 60.9993 132)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="132"
                      r="1.66667"
                      transform="rotate(180 17.3333 132)"
                      fill="#13C296"
                    />
                    <circle
                      cx="60.9993"
                      cy="117.333"
                      r="1.66667"
                      transform="rotate(180 60.9993 117.333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="117.333"
                      r="1.66667"
                      transform="rotate(180 17.3333 117.333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="60.9993"
                      cy="102.667"
                      r="1.66667"
                      transform="rotate(180 60.9993 102.667)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="102.667"
                      r="1.66667"
                      transform="rotate(180 17.3333 102.667)"
                      fill="#13C296"
                    />
                    <circle
                      cx="60.9993"
                      cy="88"
                      r="1.66667"
                      transform="rotate(180 60.9993 88)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="88"
                      r="1.66667"
                      transform="rotate(180 17.3333 88)"
                      fill="#13C296"
                    />
                    <circle
                      cx="60.9993"
                      cy="73.3333"
                      r="1.66667"
                      transform="rotate(180 60.9993 73.3333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="73.3333"
                      r="1.66667"
                      transform="rotate(180 17.3333 73.3333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="60.9993"
                      cy="45"
                      r="1.66667"
                      transform="rotate(180 60.9993 45)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="45"
                      r="1.66667"
                      transform="rotate(180 17.3333 45)"
                      fill="#13C296"
                    />
                    <circle
                      cx="60.9993"
                      cy="16"
                      r="1.66667"
                      transform="rotate(180 60.9993 16)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="16"
                      r="1.66667"
                      transform="rotate(180 17.3333 16)"
                      fill="#13C296"
                    />
                    <circle
                      cx="60.9993"
                      cy="59"
                      r="1.66667"
                      transform="rotate(180 60.9993 59)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="59"
                      r="1.66667"
                      transform="rotate(180 17.3333 59)"
                      fill="#13C296"
                    />
                    <circle
                      cx="60.9993"
                      cy="30.6666"
                      r="1.66667"
                      transform="rotate(180 60.9993 30.6666)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="30.6666"
                      r="1.66667"
                      transform="rotate(180 17.3333 30.6666)"
                      fill="#13C296"
                    />
                    <circle
                      cx="60.9993"
                      cy="1.66665"
                      r="1.66667"
                      transform="rotate(180 60.9993 1.66665)"
                      fill="#13C296"
                    />
                    <circle
                      cx="17.3333"
                      cy="1.66665"
                      r="1.66667"
                      transform="rotate(180 17.3333 1.66665)"
                      fill="#13C296"
                    />
                    <circle
                      cx="46.3333"
                      cy="132"
                      r="1.66667"
                      transform="rotate(180 46.3333 132)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="132"
                      r="1.66667"
                      transform="rotate(180 2.66536 132)"
                      fill="#13C296"
                    />
                    <circle
                      cx="46.3333"
                      cy="117.333"
                      r="1.66667"
                      transform="rotate(180 46.3333 117.333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="117.333"
                      r="1.66667"
                      transform="rotate(180 2.66536 117.333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="46.3333"
                      cy="102.667"
                      r="1.66667"
                      transform="rotate(180 46.3333 102.667)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="102.667"
                      r="1.66667"
                      transform="rotate(180 2.66536 102.667)"
                      fill="#13C296"
                    />
                    <circle
                      cx="46.3333"
                      cy="88"
                      r="1.66667"
                      transform="rotate(180 46.3333 88)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="88"
                      r="1.66667"
                      transform="rotate(180 2.66536 88)"
                      fill="#13C296"
                    />
                    <circle
                      cx="46.3333"
                      cy="73.3333"
                      r="1.66667"
                      transform="rotate(180 46.3333 73.3333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="73.3333"
                      r="1.66667"
                      transform="rotate(180 2.66536 73.3333)"
                      fill="#13C296"
                    />
                    <circle
                      cx="46.3333"
                      cy="45"
                      r="1.66667"
                      transform="rotate(180 46.3333 45)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="45"
                      r="1.66667"
                      transform="rotate(180 2.66536 45)"
                      fill="#13C296"
                    />
                    <circle
                      cx="46.3333"
                      cy="16"
                      r="1.66667"
                      transform="rotate(180 46.3333 16)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="16"
                      r="1.66667"
                      transform="rotate(180 2.66536 16)"
                      fill="#13C296"
                    />
                    <circle
                      cx="46.3333"
                      cy="59"
                      r="1.66667"
                      transform="rotate(180 46.3333 59)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="59"
                      r="1.66667"
                      transform="rotate(180 2.66536 59)"
                      fill="#13C296"
                    />
                    <circle
                      cx="46.3333"
                      cy="30.6666"
                      r="1.66667"
                      transform="rotate(180 46.3333 30.6666)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="30.6666"
                      r="1.66667"
                      transform="rotate(180 2.66536 30.6666)"
                      fill="#13C296"
                    />
                    <circle
                      cx="46.3333"
                      cy="1.66665"
                      r="1.66667"
                      transform="rotate(180 46.3333 1.66665)"
                      fill="#13C296"
                    />
                    <circle
                      cx="2.66536"
                      cy="1.66665"
                      r="1.66667"
                      transform="rotate(180 2.66536 1.66665)"
                      fill="#13C296"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Blog = () => {
  return (
    <section
      id="blogs"
      className="dark:bg-dark bg-white pb-10 pt-20 lg:pb-20 lg:pt-[120px]"
    >
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center lg:mb-20">
              <span className="mb-2 block text-lg font-semibold text-primary">
                Our Blogs
              </span>
              <h2 className="text-dark mb-4 text-3xl font-bold dark:text-white sm:text-4xl md:text-[40px]">
                Our Recent News
              </h2>
              <p className="text-body-color dark:text-dark-6 text-base">
                Those are the latest news from our blog. You can either read it
                or subscribe to our newsletter to get the latest news.
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="mb-10 w-full">
              <div className="mb-8 overflow-hidden rounded">
                <Image
                  src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2836&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="image"
                  width={400}
                  height={300}
                  className="w-full"
                />
              </div>
              <div>
                <span className="mb-5 inline-block rounded bg-primary px-4 py-1 text-center text-xs font-semibold leading-loose text-white">
                  Dec 22, 2023
                </span>
                <h3>
                  <a
                    href="javascript:void(0)"
                    className="text-dark mb-4 inline-block text-xl font-semibold hover:text-primary dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                  >
                    Meet AutoManage, the best AI management tools for your work
                  </a>
                </h3>
                <p className="text-body-color dark:text-dark-6 text-base">
                  Use the best AI management tools for your work in your
                  business. Get the best AI management tools
                </p>
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="mb-10 w-full">
              <div className="mb-8 overflow-hidden rounded">
                <Image
                  src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2836&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="image"
                  width={400}
                  height={300}
                  className="w-full"
                />
              </div>
              <div>
                <span className="mb-5 inline-block rounded bg-primary px-4 py-1 text-center text-xs font-semibold leading-loose text-white">
                  Mar 15, 2023
                </span>
                <h3>
                  <a
                    href="javascript:void(0)"
                    className="text-dark mb-4 inline-block text-xl font-semibold hover:text-primary dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                  >
                    How to earn more money as a garagist ?
                  </a>
                </h3>
                <p className="text-body-color dark:text-dark-6 text-base">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="mb-10 w-full">
              <div className="mb-8 overflow-hidden rounded">
                <Image
                  src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2836&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="image"
                  width={400}
                  height={300}
                  className="w-full"
                />
              </div>
              <div>
                <span className="mb-5 inline-block rounded bg-primary px-4 py-1 text-center text-xs font-semibold leading-loose text-white">
                  Jan 05, 2023
                </span>
                <h3>
                  <a
                    href="javascript:void(0)"
                    className="text-dark mb-4 inline-block text-xl font-semibold hover:text-primary dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                  >
                    The no-fuss guide to upselling and cross selling
                  </a>
                </h3>
                <p className="text-body-color dark:text-dark-6 text-base">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CarSection = () => {
  return (
    <section
      id="cars"
      x-data="
    {
      showCards: 'all',
      activeClasses: 'bg-primary text-white',
      inactiveClasses: 'text-body-color dark:text-dark-6 hover:bg-primary hover:text-white',
    }
  "
      className="dark:bg-dark pb-12 pt-20 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center">
              <span className="mb-2 block text-lg font-semibold text-primary">
                Cars
              </span>
              <h2 className="text-dark mb-3 text-3xl font-bold leading-[1.208] sm:text-4xl md:text-[40px]">
                Our Recent cars
              </h2>
              <p className="text-body-color dark:text-dark-6 text-base">
                Those are the latest cars from added to our website.
              </p>
            </div>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap justify-center"></div>
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 md:w-1/2 xl:w-1/3">
            <div className="relative mb-12">
              <div className="overflow-hidden rounded-[10px]">
                <Image
                  src="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="portfolio"
                  width={400}
                  height={300}
                  className=" w-full"
                />
              </div>
              <div className="shadow-portfolio dark:bg-dark-2 dark:shadow-box-dark relative z-10 mx-7 -mt-20 rounded-lg bg-white px-3 py-[34px] text-center">
                <span className="mb-2 block text-sm font-medium text-primary">
                  BMW 2020
                </span>
                <h3 className="text-dark text-xl font-bold dark:text-white">
                  {priceFormatter.format(200000)}
                </h3>
                <p>100 KM</p>

                <a
                  href="/dashboard/car/1"
                  className="border-stroke text-body-color dark:border-dark-3 dark:text-dark-6 mt-3 inline-block rounded-md border px-7 py-[10px] text-sm font-medium transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 xl:w-1/3">
            <div className="relative mb-12">
              <div className="overflow-hidden rounded-[10px]">
                <Image
                  src="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="portfolio"
                  width={400}
                  height={300}
                  className="w-full"
                />
              </div>
              <div className="shadow-portfolio dark:bg-dark-2 dark:shadow-box-dark relative z-10 mx-7 -mt-20 rounded-lg bg-white px-3 py-[34px] text-center">
                <span className="mb-2 block text-sm font-medium text-primary">
                  Audi Civid 2023
                </span>
                <h3 className="text-dark mb-5 text-xl font-bold dark:text-white">
                  {priceFormatter.format(340000)}
                </h3>
                <a
                  href="/dashboard/car/1"
                  className="border-stroke text-body-color dark:border-dark-3 dark:text-dark-6 inline-block rounded-md border px-7 py-[10px] text-sm font-medium transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 xl:w-1/3">
            <div className="relative mb-12">
              <div className="overflow-hidden rounded-[10px]">
                <Image
                  src="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="portfolio"
                  width={400}
                  height={300}
                  className=" w-full"
                />
              </div>
              <div className="shadow-portfolio dark:bg-dark-2 dark:shadow-box-dark relative z-10 mx-7 -mt-20 rounded-lg bg-white px-3 py-[34px] text-center">
                <span className="mb-2 block text-sm font-medium text-primary">
                  Toyota 2020
                </span>
                <h3 className="text-dark mb-5 text-xl font-bold dark:text-white">
                  {priceFormatter.format(100000)}
                </h3>
                <a
                  href="/dashboard/car/1"
                  className="border-stroke text-body-color dark:border-dark-3 dark:text-dark-6 inline-block rounded-md border px-7 py-[10px] text-sm font-medium transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 xl:w-1/3">
            <div className="relative mb-12">
              <div className="overflow-hidden rounded-[10px]">
                <Image
                  src="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="portfolio"
                  width={400}
                  height={300}
                  className="w-full"
                />
              </div>
              <div className="shadow-portfolio dark:bg-dark-2 dark:shadow-box-dark relative z-10 mx-7 -mt-20 rounded-lg bg-white px-3 py-[34px] text-center">
                <span className="mb-2 block text-sm font-medium text-primary">
                  Bugatti Veron 2020
                </span>
                <h3 className="text-dark mb-5 text-xl font-bold dark:text-white">
                  {priceFormatter.format(450000)}
                </h3>
                <a
                  href="/dashboard/car/1"
                  className="border-stroke text-body-color dark:border-dark-3 dark:text-dark-6 inline-block rounded-md border px-7 py-[10px] text-sm font-medium transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 xl:w-1/3">
            <div className="relative mb-12">
              <div className="overflow-hidden rounded-[10px]">
                <Image
                  src="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="portfolio"
                  width={400}
                  height={300}
                  className="w-full"
                />
              </div>
              <div className="shadow-portfolio dark:bg-dark-2 dark:shadow-box-dark relative z-10 mx-7 -mt-20 rounded-lg bg-white px-3 py-[34px] text-center">
                <span className="mb-2 block text-sm font-medium text-primary">
                  Honda 2020
                </span>
                <h3 className="text-dark mb-5 text-xl font-bold dark:text-white">
                  {priceFormatter.format(300000)}
                </h3>
                <a
                  href="/dashboard/car/1"
                  className="border-stroke text-body-color dark:border-dark-3 dark:text-dark-6 inline-block rounded-md border px-7 py-[10px] text-sm font-medium transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 xl:w-1/3">
            <div className="relative mb-12">
              <div className="overflow-hidden rounded-[10px]">
                <Image
                  src="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="portfolio"
                  width={400}
                  height={300}
                  className="w-full"
                />
              </div>
              <div className="shadow-portfolio dark:bg-dark-2 dark:shadow-box-dark relative z-10 mx-7 -mt-20 rounded-lg bg-white px-3 py-[34px] text-center">
                <span className="mb-2 block text-sm font-medium text-primary">
                  Mercedez-Benz 2020
                </span>
                <h3 className="text-dark mb-5 text-xl font-bold dark:text-white">
                  {priceFormatter.format(200000)}
                </h3>
                <a
                  href="/dashboard/car/1"
                  className="border-stroke text-body-color dark:border-dark-3 dark:text-dark-6 inline-block rounded-md border px-7 py-[10px] text-sm font-medium transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Services = () => {
  return (
    <section
      id="services"
      className="dark:bg-dark pb-12 pt-20 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-12 max-w-[510px] text-center lg:mb-20">
              <span className="mb-2 block text-lg font-semibold text-primary">
                Our Services
              </span>
              <h2 className="text-dark mb-3 text-3xl font-bold leading-[1.2] dark:text-white sm:text-4xl md:text-[40px]">
                What We Offer
              </h2>
              <p className="text-body-color dark:text-dark-6 text-base">
                Our services are the best in the market. We offer the best
                services for our clients. We are the best in the market.
              </p>
            </div>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="shadow-2 dark:bg-dark-2 mb-9 rounded-[20px] bg-white p-10 hover:shadow-lg md:px-7 xl:px-10">
              <div className="mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-primary">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.0375 1.2374C11.8125 -0.393851 2.92503 5.7374 1.29378 14.9624C0.450029 19.4061 1.46253 23.9624 4.05003 27.6749C6.63753 31.4436 10.5188 33.9186 14.9625 34.7624C15.975 34.9311 16.9875 35.0436 18 35.0436C26.0438 35.0436 33.2438 29.2499 34.7625 21.0374C36.3938 11.8124 30.2625 2.9249 21.0375 1.2374ZM32.2313 20.5874C32.175 21.0374 32.0625 21.4874 31.95 21.8811L19.2375 17.0999V3.5999C19.6875 3.65615 20.1375 3.7124 20.5313 3.76865C28.4063 5.1749 33.6375 12.7124 32.2313 20.5874ZM16.7063 3.5999V16.7624H3.60003C3.65628 16.3124 3.71253 15.8624 3.76878 15.4124C4.95003 8.83115 10.4063 4.10615 16.7063 3.5999ZM15.4125 32.2311C11.5875 31.5561 8.32503 29.4186 6.13128 26.2124C4.66878 24.1311 3.82503 21.7124 3.60003 19.2374H17.775L31.05 24.2436C28.2938 29.9811 21.9375 33.4686 15.4125 32.2311Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h4 className="text-dark mb-[14px] text-2xl font-semibold dark:text-white">
                Support 24/7
              </h4>
              <p className="text-body-color dark:text-dark-6">
                We dejoy working with discerning clients, people for whom
                qualuty, service, integrity & aesthetics.
              </p>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="shadow-2 dark:bg-dark-2 mb-9 rounded-[20px] bg-white p-10 hover:shadow-lg md:px-7 xl:px-10">
              <div className="mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-primary">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clip-rule="evenodd"
                    d="M9.89195 14.625C10.9995 10.1252 13.769 7.875 18.1996 7.875C24.8458 7.875 25.6765 12.9375 28.9996 13.7812C31.2151 14.3439 33.1535 13.5002 34.815 11.25C33.7075 15.7498 30.9379 18 26.5073 18C19.8611 18 19.0304 12.9375 15.7073 12.0938C13.4918 11.5311 11.5535 12.3748 9.89195 14.625ZM1.58423 24.75C2.69174 20.2502 5.46132 18 9.89195 18C16.5381 18 17.3689 23.0625 20.692 23.9062C22.9075 24.4689 24.8458 23.6252 26.5073 21.375C25.3998 25.8748 22.6302 28.125 18.1996 28.125C11.5535 28.125 10.7227 23.0625 7.39963 22.2188C5.18405 21.6561 3.24576 22.4998 1.58423 24.75Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h4 className="text-dark mb-[14px] text-2xl font-semibold dark:text-white">
                Best car deals
              </h4>
              <p className="text-body-color dark:text-dark-6">
                We dejoy working with discerning clients, people for whom
                qualuty, service, integrity & aesthetics.
              </p>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="shadow-2 dark:bg-dark-2 mb-9 rounded-[20px] bg-white p-10 hover:shadow-lg md:px-7 xl:px-10">
              <div className="mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-primary">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.2063 1.9126H5.0625C3.15 1.9126 1.575 3.4876 1.575 5.4001V12.5438C1.575 14.4563 3.15 16.0313 5.0625 16.0313H12.2063C14.1188 16.0313 15.6938 14.4563 15.6938 12.5438V5.45635C15.75 3.4876 14.175 1.9126 12.2063 1.9126ZM13.2188 12.6001C13.2188 13.1626 12.7688 13.6126 12.2063 13.6126H5.0625C4.5 13.6126 4.05 13.1626 4.05 12.6001V5.45635C4.05 4.89385 4.5 4.44385 5.0625 4.44385H12.2063C12.7688 4.44385 13.2188 4.89385 13.2188 5.45635V12.6001Z"
                    fill="white"
                  />
                  <path
                    d="M30.9375 1.9126H23.7937C21.8812 1.9126 20.3062 3.4876 20.3062 5.4001V12.5438C20.3062 14.4563 21.8812 16.0313 23.7937 16.0313H30.9375C32.85 16.0313 34.425 14.4563 34.425 12.5438V5.45635C34.425 3.4876 32.85 1.9126 30.9375 1.9126ZM31.95 12.6001C31.95 13.1626 31.5 13.6126 30.9375 13.6126H23.7937C23.2312 13.6126 22.7812 13.1626 22.7812 12.6001V5.45635C22.7812 4.89385 23.2312 4.44385 23.7937 4.44385H30.9375C31.5 4.44385 31.95 4.89385 31.95 5.45635V12.6001Z"
                    fill="white"
                  />
                  <path
                    d="M12.2063 19.8564H5.0625C3.15 19.8564 1.575 21.4314 1.575 23.3439V30.4877C1.575 32.4002 3.15 33.9752 5.0625 33.9752H12.2063C14.1188 33.9752 15.6938 32.4002 15.6938 30.4877V23.4002C15.75 21.4314 14.175 19.8564 12.2063 19.8564ZM13.2188 30.5439C13.2188 31.1064 12.7688 31.5564 12.2063 31.5564H5.0625C4.5 31.5564 4.05 31.1064 4.05 30.5439V23.4002C4.05 22.8377 4.5 22.3877 5.0625 22.3877H12.2063C12.7688 22.3877 13.2188 22.8377 13.2188 23.4002V30.5439Z"
                    fill="white"
                  />
                  <path
                    d="M30.9375 19.8564H23.7937C21.8812 19.8564 20.3062 21.4314 20.3062 23.3439V30.4877C20.3062 32.4002 21.8812 33.9752 23.7937 33.9752H30.9375C32.85 33.9752 34.425 32.4002 34.425 30.4877V23.4002C34.425 21.4314 32.85 19.8564 30.9375 19.8564ZM31.95 30.5439C31.95 31.1064 31.5 31.5564 30.9375 31.5564H23.7937C23.2312 31.5564 22.7812 31.1064 22.7812 30.5439V23.4002C22.7812 22.8377 23.2312 22.3877 23.7937 22.3877H30.9375C31.5 22.3877 31.95 22.8377 31.95 23.4002V30.5439Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h4 className="text-dark mb-[14px] text-2xl font-semibold dark:text-white">
                100+ Cars Models
              </h4>
              <p className="text-body-color dark:text-dark-6">
                We dejoy working with discerning clients, people for whom
                qualuty, service, integrity & aesthetics.
              </p>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="shadow-2 dark:bg-dark-2 mb-9 rounded-[20px] bg-white p-10 hover:shadow-lg md:px-7 xl:px-10">
              <div className="mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-primary">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M30.2625 10.6312C27.1688 7.36875 22.8375 5.34375 18 5.34375C8.60626 5.34375 1.01251 12.9937 1.01251 22.3875C1.01251 25.0312 1.63126 27.6187 2.75626 29.925C2.92501 30.2625 3.20626 30.4875 3.54376 30.6C3.65626 30.6 3.71251 30.6562 3.82501 30.6562C3.82501 30.6562 3.82501 30.6562 3.88126 30.6562C3.88126 30.6562 3.88126 30.6562 3.93751 30.6562C3.99376 30.6562 4.05001 30.6562 4.10626 30.6562C4.21876 30.6562 4.38751 30.6 4.50001 30.5437L6.80626 29.4187C7.42501 29.1375 7.70626 28.35 7.36876 27.7312C7.03126 27.1125 6.30001 26.8312 5.68126 27.1687L4.55626 27.7312C3.88126 26.1 3.60001 24.3562 3.54376 22.5562H5.90626C6.58126 22.5562 7.20001 21.9937 7.20001 21.2625C7.20001 20.5312 6.63751 19.9687 5.90626 19.9687H3.71251C4.10626 17.4937 5.17501 15.2437 6.69376 13.3875L8.71876 15.4125C8.94376 15.6375 9.28126 15.8062 9.61876 15.8062C9.95626 15.8062 10.2938 15.6937 10.5188 15.4125C11.025 14.9062 11.025 14.1187 10.5188 13.6125L8.43751 11.5312C10.6875 9.5625 13.5563 8.2125 16.7625 7.9875V11.4187C16.7625 12.0937 17.325 12.7125 18.0563 12.7125C18.7313 12.7125 19.35 12.15 19.35 11.4187V7.9875C22.5 8.26875 25.425 9.5625 27.675 11.5312L26.1 13.1062C25.5938 13.6125 25.5938 14.4 26.1 14.9062C26.325 15.1312 26.6625 15.3 27 15.3C27.3375 15.3 27.675 15.1875 27.9 14.9062L29.4188 13.3875C30.9375 15.2437 31.95 17.4937 32.4 19.9687H30.2063C29.5313 19.9687 28.9125 20.5312 28.9125 21.2625C28.9125 21.9937 29.475 22.5562 30.2063 22.5562H32.5688C32.5688 24.3562 32.2313 26.1 31.5563 27.7875L30.4313 27.225C29.8125 26.8875 29.025 27.1687 28.7438 27.7875C28.4625 28.4062 28.6875 29.1937 29.3063 29.475L31.6125 30.6C31.7813 30.7125 32.0063 30.7125 32.175 30.7125C32.175 30.7125 32.175 30.7125 32.2313 30.7125C32.2313 30.7125 32.2313 30.7125 32.2875 30.7125C32.7375 30.7125 33.1875 30.4312 33.4125 30.0375C34.5938 27.7312 35.1563 25.0875 35.1563 22.5C35.0438 17.8312 33.1875 13.6687 30.2625 10.6312Z"
                    fill="white"
                  />
                  <path
                    d="M21.4313 19.3499L17.6625 22.1624C16.9875 22.2749 16.3688 22.6687 15.975 23.2312C15.9188 23.3437 15.8625 23.3999 15.8063 23.5124L15.6938 23.6249H15.75C15.1313 24.8062 15.4688 26.2687 16.5938 27.1124C17.7188 27.8999 19.2375 27.7874 20.1375 26.8312H20.1938L20.25 26.7187C20.3063 26.6624 20.4188 26.5499 20.475 26.4374C20.925 25.8749 21.0375 25.1437 20.9813 24.4687L22.4438 19.9687C22.6125 19.4624 21.9375 19.0124 21.4313 19.3499Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h4 className="text-dark mb-[14px] text-2xl font-semibold dark:text-white">
                Speed Optimized
              </h4>
              <p className="text-body-color dark:text-dark-6">
                We dejoy working with discerning clients, people for whom
                qualuty, service, integrity & aesthetics.
              </p>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="shadow-2 dark:bg-dark-2 mb-9 rounded-[20px] bg-white p-10 hover:shadow-lg md:px-7 xl:px-10">
              <div className="mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-primary">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M30.0937 21.8251L29.6437 21.6001L30.2062 21.2626C31.3312 20.5876 31.95 19.4063 31.95 18.0563C31.95 16.7626 31.2187 15.5813 30.0937 14.9063L28.9125 14.2313L30.2062 13.4438C31.3312 12.7688 31.95 11.5876 31.95 10.2376C31.95 8.94385 31.2187 7.7626 30.0937 7.14385L19.9125 1.4626C18.7875 0.843848 17.3812 0.843848 16.3125 1.4626L5.84999 7.5376C4.72499 8.2126 4.04999 9.39385 4.04999 10.6876C4.04999 11.9813 4.72499 13.2188 5.84999 13.8376L7.08749 14.5688L5.84999 15.3001C4.72499 15.9751 4.04999 17.1563 4.04999 18.4501C4.04999 19.7438 4.72499 20.9813 5.84999 21.6001L6.35624 21.8813L5.84999 22.1626C4.72499 22.8376 3.99374 24.0188 3.99374 25.3126C3.99374 26.6626 4.66874 27.8438 5.79374 28.4626L16.1437 34.4813C16.7062 34.8188 17.325 34.9876 18 34.9876C18.675 34.9876 19.35 34.8188 19.9125 34.4251L30.2625 28.1251C31.3875 27.4501 32.0062 26.2688 32.0062 24.9188C31.95 23.6251 31.275 22.4438 30.0937 21.8251ZM6.52499 10.6876C6.52499 10.5188 6.58124 10.0126 7.08749 9.73135L17.55 3.65635C17.8875 3.43135 18.3375 3.43135 18.675 3.65635L28.9125 9.3376C29.4187 9.61885 29.475 10.1251 29.475 10.2938C29.475 10.4626 29.4187 10.9688 28.9125 11.3063L18.6187 17.6626C18.2812 17.8876 17.8312 17.8876 17.4375 17.6626L7.08749 11.6438C6.58124 11.3626 6.52499 10.8563 6.52499 10.6876ZM7.08749 17.4938L9.56249 16.0313L16.1437 19.8563C16.7062 20.1938 17.325 20.3626 18 20.3626C18.675 20.3626 19.35 20.1938 19.9125 19.8001L26.4375 15.8063L28.8562 17.1563C29.3625 17.4376 29.4187 17.9438 29.4187 18.1126C29.4187 18.2813 29.3625 18.7876 28.8562 19.1251L18.6187 25.4251C18.2812 25.6501 17.8312 25.6501 17.4375 25.4251L7.08749 19.4063C6.58124 19.1251 6.52499 18.6188 6.52499 18.4501C6.52499 18.2813 6.58124 17.7751 7.08749 17.4938ZM28.9125 25.9876L18.6187 32.3438C18.2812 32.5688 17.8312 32.5688 17.4375 32.3438L7.08749 26.3251C6.58124 26.0438 6.52499 25.5376 6.52499 25.3688C6.52499 25.2001 6.58124 24.6938 7.08749 24.4126L8.83124 23.4001L16.2 27.6751C16.7625 28.0126 17.3812 28.1813 18.0562 28.1813C18.7312 28.1813 19.4062 28.0126 19.9687 27.6188L27.225 23.1751L28.9125 24.0751C29.4187 24.3563 29.475 24.8626 29.475 25.0313C29.475 25.2001 29.4187 25.7063 28.9125 25.9876Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h4 className="text-dark mb-[14px] text-2xl font-semibold dark:text-white">
                Fully Customizable
              </h4>
              <p className="text-body-color dark:text-dark-6">
                We dejoy working with discerning clients, people for whom
                qualuty, service, integrity & aesthetics.
              </p>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="shadow-2 dark:bg-dark-2 mb-9 rounded-[20px] bg-white p-10 hover:shadow-lg md:px-7 xl:px-10">
              <div className="mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-primary">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.725 16.3124C4.89375 16.3124 5.11875 16.2562 5.2875 16.1999L11.5312 14.0062C12.2062 13.7812 12.5437 13.0499 12.3187 12.3749C12.0937 11.6999 11.3625 11.3624 10.6875 11.5874L6.80625 12.9374C8.6625 8.0999 13.3875 4.8374 18.7875 4.8374C24.6938 4.8374 29.8125 8.7749 31.275 14.3999C31.4437 15.0749 32.1187 15.4687 32.7937 15.2999C33.4687 15.1312 33.8625 14.4562 33.6938 13.7812C31.95 7.03115 25.8187 2.30615 18.7312 2.30615C12.4312 2.30615 6.8625 6.01865 4.55625 11.5874L3.375 8.2124C3.15 7.5374 2.41875 7.1999 1.74375 7.4249C1.06875 7.6499 0.73125 8.38115 0.95625 9.05615L3.09375 15.1874C3.43125 15.9187 4.05 16.3124 4.725 16.3124Z"
                    fill="white"
                  />
                  <path
                    d="M34.9312 27.9562L32.625 21.9375C32.4562 21.5437 32.175 21.2062 31.7812 21.0375C31.3875 20.8687 30.9375 20.8687 30.5437 21.0375L24.3562 23.3999C23.6812 23.6249 23.4 24.3562 23.625 25.0312C23.85 25.7062 24.5813 25.9875 25.2563 25.7625L29.1375 24.3C26.8875 28.4062 22.5 31.1062 17.6062 31.1062C12.0375 31.1062 7.14375 27.6187 5.4 22.4437C5.175 21.7687 4.44375 21.4312 3.825 21.6562C3.15 21.8812 2.8125 22.6124 3.0375 23.2312C5.11875 29.4187 10.9687 33.5812 17.6062 33.5812C23.4 33.5812 28.6312 30.375 31.275 25.425L32.5688 28.8562C32.7375 29.3625 33.2437 29.6437 33.75 29.6437C33.9187 29.6437 34.0312 29.6437 34.2 29.5312C34.875 29.3625 35.1562 28.6312 34.9312 27.9562Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h4 className="text-dark mb-[14px] text-2xl font-semibold dark:text-white">
                Regular Updates
              </h4>
              <p className="text-body-color dark:text-dark-6">
                We dejoy working with discerning clients, people for whom
                qualuty, service, integrity & aesthetics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
