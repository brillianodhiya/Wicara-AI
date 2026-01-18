"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Link as HeroLink,
} from "@heroui/react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Plugins", href: "/plugins" },
  ];

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white/70 backdrop-blur-md"
      maxWidth="xl"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            {/* Simple Logo Placeholder */}
            <div className="w-8 h-8 rounded-full bg-primary-blue flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <p className="font-bold text-inherit text-primary-900 text-xl">Wicara AI</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name}>
            <Link color="foreground" href={item.href} className="text-gray-600 hover:text-primary-600 transition-colors">
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/(auth)/login" className="text-primary-600 font-medium">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/(auth)/register" variant="flat" className="font-semibold text-primary-700 bg-primary-100">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full text-lg py-2 block text-gray-700 hover:text-primary-600"
              href={item.href}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Link href="/(auth)/login" className="w-full text-lg py-2 block text-gray-700">Login</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/(auth)/register" className="w-full text-lg py-2 block text-primary-600 font-bold">Sign Up</Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
