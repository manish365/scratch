import React from "react";
import { IoFlower, IoFlowerOutline } from "react-icons/io5";
import { LuHeartPulse } from "react-icons/lu";
import { GiFlowerPot, GiHeartPlus } from "react-icons/gi";
import { PiFlowerTulip, PiPottedPlantDuotone } from "react-icons/pi";
import { RiBearSmileLine, RiHeart2Fill, RiHeart2Line } from "react-icons/ri";

interface PropTypes {
  icon: string;
}

function MenuIcon({ icon }: PropTypes) {
  return icon === "LuHeartPulse" ? (
    <LuHeartPulse fontSize={20} className="mr-1 colr" />
  ) : icon === "IoFlower" ? (
    <IoFlower fontSize={20} className="mr-1 colr" />
  ) : icon === "IoFlowerOutline" ? (
    <IoFlowerOutline />
  ) : icon === "GiFlowerPot" ? (
    <GiFlowerPot />
  ) : icon === "PiFlowerTulip" ? (
    <PiFlowerTulip />
  ) : icon === "RiHeart2Line" ? (
    <RiHeart2Line />
  ) : icon === "RiHeart2Fill" ? (
    <RiHeart2Fill />
  ) : icon === "GiHeartPlus" ? (
    <GiHeartPlus />
  ) : icon === "PiPottedPlantDuotone" ? (
    <PiPottedPlantDuotone />
  ) : icon === "RiBearSmileLine" ? (
    <RiBearSmileLine />
  ) : (
    <></>
  );
}

export default MenuIcon;
