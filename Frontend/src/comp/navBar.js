import React, { useState } from "react";
import { FiSearch, FiHeart, FiShoppingCart,FiUser } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "MarketPlace", href: "/marketPlace" },
  { name: "ChatBot", href: "/" },
];

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    // Implement the logic to clear the token from localStorage and perform logout actions
    localStorage.removeItem("token");
    // Additional logout logic...
  };

  return (
    <header className="z-90 bg-white shadow-md  inset-x-0 top-0 z-50 sticky">
      <nav className="flex items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <h1 className="font-bold text-xl hover:text-xxl bg-[#5046E5] text-white px-2 rounded-md ">API MINERS</h1>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="text-md font-semibold leading-6 text-gray-900">
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        {token ? (
          <button
            onClick={handleLogout}
            className="text-md flex font-semibold leading-6 px-3 text-white bg-[#5046E5] p-2 rounded-sm"
          >
          <FiUser className="mr-2 mt-1" />  Profile
          </button>
        ) : (
          <a href="login" className="text-md font-semibold leading-6 text-white bg-[#5046E5] p-2 rounded-sm">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        )}
      </div>
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <h1 className="font-bold text-md hover:text-lg">API MINERS</h1>
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default NavBar;
