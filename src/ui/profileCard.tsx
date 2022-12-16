import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from '../utils/trpc';
import Image from "next/image";

// const ProfileCard = () => {
//   return (
//     <div className="dropdown-end dropdown dropdown-bottom z-0">
    // <label tabIndex={0} className="btn-ghost btn-sm btn m-1 lg:btn-md gap-2">
    //     <Avatar/>
    //   <ExpandMoreIcon className="text-2xl" />
    // </label>
//     <ul
//       tabIndex={0}
//       className="dropdown-content menu rounded-box bg-base-100 w-52 z-10 gap-2 p-2 shadow-lg"
//     >
//       <li>
//         <Link href="/admin/dashboard/settings" className={`justify-start  no-underline`}>
//           <SettingsIcon className="text-lg" />
//           Settings
//         </Link>
//       </li>
//       <li>
//         <Link href="/supports" className={`justify-start  no-underline`}>
//           <SupportIcon className="text-lg" />
//          Support
//         </Link>
//       </li>
//       <li>
//         <Link href="/"  onClick={()=>signOut()} className={`justify-start  no-underline hover:text-primary`}>
//           <LogoutIcon className="text-lg" />
//           Logout
//         </Link>
//       </li>
//       <li>
//         <Link href="/"  onClick={()=>signOut()} className={`justify-start  no-underline hover:text-primary`}>
//           <LogoutIcon className="text-lg" />
//           Logout
//         </Link>
//       </li>
//     </ul>
//   </div>
//     // <div className="dropdown-end dropdown dropdown-bottom dropdown-hover">
//     //   <label tabIndex={0} className="btn m-1">
//     //     Hover
//     //   </label>
//     //   <ul
//     //     tabIndex={0}
//     //     className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
//     //   >
//     //     <li>
//     //       <a>Item 1</a>
//     //     </li>
//     //     <li>
//     //       <a>Item 2</a>
//     //     </li>
//     //   </ul>
//     // </div>

//   );
// };

const Avatar=()=>{
 const {data:user,isLoading}=trpc.user.get.useQuery()
const {data:session}=useSession()
 if(isLoading || !user?.image){
    return <div className="avatar placeholder">
    <div className="bg-neutral-focus text-neutral-content rounded-full w-[40px]">
      <span>{session?.user?.email?.[0]||""}</span>
    </div>
  </div> 
 }
 return <div className="avatar">
 <div className="w-24 rounded-full">
   <Image src={user.image} width={50} height={60} alt="profile"/>
 </div>
</div>
}


// export default ProfileCard;
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { type MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Divider from '@mui/material/Divider';
import { ExpandMoreIcon, SettingsIcon, SupportIcon } from './icons';
import { LogoutIcon } from './icons';
import { useRouter } from "next/router";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
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
const router=useRouter()
  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="text"
        disableElevation
        disableRipple
        className="hover:bg-primary/10 rounded-lg"
        onClick={handleClick}
        endIcon={<ExpandMoreIcon className="text-xl" />}
      >
         <Avatar/>
        
      </Button>
 
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple className="menu-item">
          <SettingsIcon />
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple className="menu-item">
          <SupportIcon/>
           Supports
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={()=>{
        
            signOut()
        }} disableRipple className="menu-item">
          <LogoutIcon className="text-red-500"/>
         Logout
        </MenuItem>
      </StyledMenu>
    </div>
  );
}