import React from "react";
import Image from "next/image";
import Link from "next/link";

const logo = "/ecoglasnik.png";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={`relative w-[230px] ${className}`}>
      <Link href="/dashboard">
        <Image
          src={logo}
          alt="Logo"
          width={200}
          height={50}
          priority
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
        />
      </Link>
    </div>
  );
};

export default Logo;
