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
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right" | "inline-start" | "inline-end";
}

const DropdownLayer = ({ children, trigger, align, side }: DropdownLayerProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align={align} side={side}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

DropdownLayer.displayName = "DropdownLayer";

export default DropdownLayer;