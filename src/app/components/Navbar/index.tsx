"use client";

import { Button } from "@crayonai/react-ui";
import Image from "next/image";
import { useTheme } from "../../hooks/useTheme";
import { Github, StarIcon, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const NavBar = () => {
  const theme = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const goToSourceCode = () => {
    window.open("https://github.com/thesysdev/analytics-with-c1", "_blank");
  };

  const goToThesys = () => {
    window.open("https://thesys.dev", "_blank");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownItemClick = (item: string) => {
    if (item === "Search") {
      window.location.href = "https://search-with-c1.vercel.app/";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="flex items-center justify-between bg-container border border-default px-l py-s">
      <div className="flex items-center text-secondary gap-s">
        {theme === "light" ? (
          <Image
            src="/thesys-navbar-light.svg"
            alt="Thesys"
            width={32}
            height={32}
            onClick={goToThesys}
            className="cursor-pointer"
          />
        ) : (
          <Image src="/thesys-navbar.svg" alt="Thesys" width={32} height={32} />
        )}
        <span className="font-semibold text-primary">Demos</span> by Thesys /
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-1 text-primary hover:text-secondary transition-colors cursor-pointer"
          >
            <span>Analytics</span>
            <ChevronDown
              size={16}
              className={`transform transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-container border border-default rounded-md shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => handleDropdownItemClick("Search")}
                  className="w-full text-left px-4 py-2 text-primary hover:bg-hover transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-s">
        <Button
          variant="primary"
          size="medium"
          onClick={goToSourceCode}
          iconLeft={<Github  />}
          iconRight={<StarIcon fill="#eac54f" color="#eac54f" />}
        >
          GitHub
        </Button>
      </div>
    </div>
  );
};
