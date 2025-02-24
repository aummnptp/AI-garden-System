import React from 'react';
import { Menu, MenuItem, Avatar, Typography, Button } from '@mui/material';
import { getImageUrl } from '../../function/util';

type Notification = {
  inviteId: string;
  invitedBy: {
    name: string;
    picture: string;
  };
  workspace: {
    name: string;
  };
};

interface NotificationMenuProps {
  notiData: Notification[];
  open: boolean;
  anchorEl: HTMLElement | null;
  toggleNotifications: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseNoti: () => void;
  handleAccept: (inviteId: string) => void;
  handleReject: (inviteId: string) => void;
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({
  notiData,
  open,
  anchorEl,
  toggleNotifications,
  handleCloseNoti,
  handleAccept,
  handleReject
}) => {
  return (
    <>
      <div
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        className="relative flex items-center p-4 ml-3 hover:bg-gray-100 cursor-pointer rounded-lg hover:text-blue-700"
        onClick={toggleNotifications}
      >
        <i className="bi bi-bell-fill"></i>
        <span className="ml-2">Notification</span>
        {notiData.length > 0 && (
          <span className="absolute top-3 right-0 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
            {notiData.length}
          </span>
        )}
      </div>

      <Menu
        id="noti-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseNoti}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {notiData.length > 0 ? (
          notiData.map((noti, index) => (
            <MenuItem 
              key={index}
              sx={{ "&:hover": { backgroundColor: "transparent" }, cursor: "default" }}
            >
              <Avatar
                src={getImageUrl(noti.invitedBy.picture) || "/images/homeImage/profile.webp"}
                alt="InviterProfile"
                sx={{ width: 40, height: 40, marginRight: 1 }}
              />
              <div>
                <Typography variant="body1" fontWeight="bold">
                  {noti.invitedBy.name}
                </Typography>
                <Typography variant="body2">
                  ได้เชิญคุณเข้าร่วม {noti.workspace.name}
                </Typography>
                <div style={{ marginTop: 4 }}>
                  <Button
                    onClick={() => handleAccept(noti.inviteId)}
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ marginRight: 1 }}
                  >
                    ยอมรับ
                  </Button>
                  <Button
                    onClick={() => handleReject(noti.inviteId)}
                    variant="outlined"
                    color="error"
                    size="small"
                  >
                    ปฏิเสธ
                  </Button>
                </div>
              </div>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No Invitation</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;
