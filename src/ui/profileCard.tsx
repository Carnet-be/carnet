import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import Image from "next/image";
import aucitonaireIcon from "@assets/auctionnaire.png"
import bidderIcon from "@assets/bidder.png"
import {PersonIcon} from "@ui/icons"
import adminIcon from "@assets/admin.png"
const Avatar = ({username,user,isLoading,session}:{username?:boolean,user:User|undefined|null,isLoading:boolean,session:Session|null}) => {

 // const { data: session } = useSession();
  if (isLoading || !user?.image) {
    return (
      <div className="placeholder avatar">
        <div className="w-[40px] rounded-full bg-neutral-focus text-neutral-content">
          <span>{session?.user?.email?.[0] || ""}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="avatar">
      <div className="w-24 rounded-full">
        <Image src={user.image} width={50} height={60} alt="profile" />
      </div>
    </div>
  );
};

// export default ProfileCard;
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { type MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Divider from "@mui/material/Divider";
import { ExpandMoreIcon, SettingsIcon, SupportIcon } from "./icons";
import { LogoutIcon } from "./icons";
import { useRouter } from "next/router";
import { type User } from "@prisma/client";
import { type Session } from "next-auth";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const router = useRouter();
  const { data: user, isLoading } = trpc.user.get.useQuery();
  const {data:session}=useSession()
  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="text"
        disableElevation
        disableRipple
        className="rounded-lg hover:bg-primary/10"
        onClick={handleClick}
        startIcon={user&&<Image src={user.type=="AUC"? aucitonaireIcon:user.type=="BID"?bidderIcon:adminIcon} width={25} height={25} alt="icon"/>}
        endIcon={<ExpandMoreIcon className="text-xl" />}
      >
        <Avatar session={session} isLoading={isLoading} user={user}/>
      </Button>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple className="menu-item">
          <PersonIcon />
          Account
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple className="menu-item">
          <SupportIcon />
          Supports
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => {
            signOut();
          }}
          disableRipple
          className="menu-item"
        >
          <LogoutIcon className="text-red-500" />
          Logout
        </MenuItem>
      </StyledMenu>
    </div>
  );
}


