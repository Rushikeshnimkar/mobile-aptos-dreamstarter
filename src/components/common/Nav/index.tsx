import React, { FC, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Nav: FC = () => {

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      title: "Launch",
      subItems: [
        { title: "Create Proposal", path: "/launch/create-proposal" },
        { title: "Convert Proposal", path: "/launch/convert-proposal" },
      ],
    },
    {
      title: "Explore",
      subItems: [
        { title: "Ongoing Proposals", path: "/explore/ongoing-proposals" },
        {
          title: "Crowdfunding Events",
          path: "/explore/crowdfunding-events",
        },
      ],
    },
  ];

  const handleDropdownToggle = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="px-6 py-4 shadow-sm flex justify-between items-center text-white">
      <div className="flex gap-2 items-center">
        <div className="text-2xl">
          <img src="/nav.png" alt="" width="30px" height="10px" />
        </div>
        <div className="text-xl font-semibold">
          <a href="/">Dreamstarter</a>
        </div>
      </div>

      <div className="hidden md:flex gap-4 items-center">
        {navLinks.map((navItem) => (
          <div
            key={navItem.title}
            className="relative cursor-pointer"
            onMouseEnter={() => handleDropdownToggle(navItem.title)}
            onMouseLeave={() => handleDropdownToggle(navItem.title)}
          >
            {navItem.title}
            {navItem.subItems && activeDropdown === navItem.title && (
              <div className="absolute left-0 w-48 py-2 px-2 rounded-md shadow-xl bg-gray-800">
                {navItem.subItems.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.path}
                    className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-500 rounded-md"
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <a href="/community/create-community">Community</a>
        <a href="/dashboard/crowdfunding-events">Dashboard</a>
      </div>

      <div className="md:hidden flex items-center">
        <button onClick={handleMobileMenuToggle} className="focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            ></path>
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 z-50 md:hidden">
          <div className="flex justify-end p-4">
            <button onClick={handleMobileMenuClose} className="focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-start p-4">
            {navLinks.map((navItem) => (
              <div key={navItem.title} className="w-full">
                <div
                  className="cursor-pointer py-2"
                  onClick={() => handleDropdownToggle(navItem.title)}
                >
                  {navItem.title}
                </div>
                {navItem.subItems && activeDropdown === navItem.title && (
                  <div className="flex flex-col pl-4">
                    {navItem.subItems.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.path}
                        className="block py-2 text-sm hover:bg-blue-50 hover:text-blue-500 rounded-md"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a href="/community/create-community" className="py-2">
              Community
            </a>
            <a href="/dashboard/crowdfunding-events" className="py-2">
              Dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav;
