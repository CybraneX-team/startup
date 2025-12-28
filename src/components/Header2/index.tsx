"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import { useUser } from "@/context/UserContext";

const Header = () => {
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  // const handleSubmenu = (index) => {
  //   if (openIndex === index) {
  //     setOpenIndex(-1);
  //   } else {
  //     setOpenIndex(index);
  //   }
  // };

  const usePathName = usePathname();
  const { user } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in via token or user context
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!(token || user));
  }, [user]);

  return (
    <>
      <header
        className={`header left-0 right-0  z-40 flex items-center justify-center ${
          sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark shadow-sticky fixed z-[9999] !bg-opacity-80 backdrop-blur-sm transition"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
            <Link
            href="/"
            className={`header-logo block w-full ${
              sticky ? "py-5 lg:py-2" : "py-8"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Image
                src="/images/logo/logo-icon.svg"
                alt="logo"
                width={50}
                height={50}
                className="block"
              />
              <h1 className="text-[#495CE2] dark:text-white text-2xl lg:text-3xl font-bold leading-tight whitespace-nowrap">
                Unicorn Simulator
              </h1>
            </div>
          </Link>
            </div>
            <div className="flex w-auto items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? " top-[7px] rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "opacity-0 " : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? " top-[-8px] -rotate-45" : " "
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar border-body-color/50 dark:border-body-color/20 dark:bg-dark absolute right-0 z-30 w-[250px] rounded border-[.5px] bg-white px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visible top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  {!isLoggedIn && (
                    <ul className="block lg:flex lg:space-x-12">
                      <li>
                        <Link
                          href="/home#features"
                          onClick={() => setNavbarOpen(false)}
                          className="flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                        >
                          Features
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/home#about"
                          onClick={() => setNavbarOpen(false)}
                          className="flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                        >
                          About
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/home#pricing"
                          onClick={() => setNavbarOpen(false)}
                          className="flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                        >
                          Pricing
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/home#contact"
                          onClick={() => setNavbarOpen(false)}
                          className="flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                        >
                          Contact
                        </Link>
                      </li>
                      <li className="lg:hidden">
                        <Link
                          href="/auth/signin"
                          onClick={() => setNavbarOpen(false)}
                          className="flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                        >
                          Sign In
                        </Link>
                      </li>
                      <li className="lg:hidden">
                        <Link
                          href="/auth/signup"
                          onClick={() => setNavbarOpen(false)}
                          className="flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 text-primary dark:text-white font-semibold"
                        >
                          Sign Up
                        </Link>
                      </li>
                    </ul>
                  )}
                </nav>
              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0">
                {isLoggedIn ? (
                  <Link
                    href="/"
                    className="ease-in-up shadow-btn hover:shadow-btn-hover hidden rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90 md:block md:px-9 lg:px-6 xl:px-9"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="text-dark hidden px-7 py-3 text-base font-medium hover:opacity-70 dark:text-white md:block"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="ease-in-up shadow-btn hover:shadow-btn-hover hidden rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90 md:block md:px-9 lg:px-6 xl:px-9"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                <div className="mx-5">
                  <ThemeToggler />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
