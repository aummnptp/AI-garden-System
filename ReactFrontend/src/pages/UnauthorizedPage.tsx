import { FlagCircleOutlined } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <div>
     <div className="h-screen mx-auto grid place-items-center text-center px-8">
        <div>
          <FlagCircleOutlined className="w-20 h-20 mx-auto" />
          <Typography
            variant="h1"
            color="blue-gray"
            className="mt-10 !text-3xl !leading-snug md:!text-4xl"
          >
            Error 404 <br /> Page Not Found
          </Typography>
          <Typography className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
          The requested page is not found or not allowed.
          </Typography>
          <Button  className="w-full px-4 md:w-[8rem]">
            back home
          </Button>
        </div>
      </div>
      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default UnauthorizedPage;
