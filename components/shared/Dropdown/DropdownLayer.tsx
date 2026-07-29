"use client"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type DropdownLayerProps = {
  children: React.ReactNode;
  trigger: React.ReactElement<unknown>;
}

const DropdownLayer = ({ children, trigger }: DropdownLayerProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align="end" side="right">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

DropdownLayer.displayName = "DropdownLayer";

export default DropdownLayer;