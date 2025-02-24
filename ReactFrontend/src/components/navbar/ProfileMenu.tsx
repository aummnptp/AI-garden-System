import React, { useState } from "react";
import { Menu, MenuItem, Typography, Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { getImageUrl } from "../../function/util";


interface ProfileMenuProps {
  user: {
    name: string;
    email: string;
    picture: string;
  };
  onlogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user, onlogout}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);


  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* ปุ่มเปิดเมนู */}
      <div onClick={handleClick} className="flex items-center w-fit ml-3 hover:bg-gray-100 p-2 cursor-pointer rounded-lg">
        <Avatar
          src={getImageUrl(user.picture) || "/images/homeImage/profile.webp"}
          alt="InviterProfile"
          sx={{ width: 40, height: 40, marginRight: 1 }}
        />
        <Typography variant="body1" fontWeight="bold">
          {user.name}
        </Typography>
      </div>

      {/* เมนูโปรไฟล์ */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: { mt: 1, minWidth: 200 }, // กำหนดระยะห่างและขนาด
        }}
      >
        {/* แสดงอีเมลของผู้ใช้ */}
        <MenuItem 
        disabled
           sx={{ "&:hover": { backgroundColor: "transparent" }, cursor: "default" }}>
          <Typography variant="body1" color="textSecondary"
          >
            {user?.email || "Guest"}
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            onlogout();
            handleClose();
          }}
        >
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
