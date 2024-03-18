import Logo from "./ui/logo";

export const NavbarPublic = () => {
  return (
    <div className="sticky left-0 top-0 z-[100] w-full bg-white/60 backdrop-blur-lg">
      <div className="container mx-auto">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <Logo size={60} />
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div>
              <button className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden">
                <span className="bg-body-color relative my-[6px] block h-[2px] w-[30px] dark:bg-white"></span>
                <span className="bg-body-color relative my-[6px] block h-[2px] w-[30px] dark:bg-white"></span>
                <span className="bg-body-color relative my-[6px] block h-[2px] w-[30px] dark:bg-white"></span>
              </button>
              <nav className="dark:bg-dark-2 absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow transition-all lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none xl:ml-11">
                <ul className="block lg:flex">
                  <li>
                    <a
                      href="/"
                      className="text-dark flex py-2 text-base font-medium hover:text-primary dark:text-white lg:ml-10 lg:inline-flex"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#about"
                      className="text-dark flex py-2 text-base font-medium hover:text-primary dark:text-white lg:ml-10 lg:inline-flex"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#cars"
                      className="text-dark flex py-2 text-base font-medium hover:text-primary dark:text-white lg:ml-10 lg:inline-flex"
                    >
                      Cars
                    </a>
                  </li>
                  {/* <li>
                      <a
                        href="#blogs"
                        className="text-dark flex py-2 text-base font-medium hover:text-primary dark:text-white lg:ml-10 lg:inline-flex"
                      >
                        Blogs
                      </a>
                    </li> */}
                  <li>
                    <a
                      href="/#services"
                      className="text-dark flex py-2 text-base font-medium hover:text-primary dark:text-white lg:ml-10 lg:inline-flex"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#contact"
                      className="text-dark flex py-2 text-base font-medium hover:text-primary dark:text-white lg:ml-10 lg:inline-flex"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
              <a
                href="/dashboard"
                className="hover:bg-blue-dark rounded-md bg-primary px-7 py-3 text-base font-medium text-white"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
