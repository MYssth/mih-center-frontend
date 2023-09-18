import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 60,
        maxWidth: 130,
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >

      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" height="60" preserveAspectRatio="xMinYMin meet" xmlSpace="preserve" >
        {/* <image id="image0" width="100%" height="100%" x="0" y="0" href={localStorage.getItem('logo')} /> */}
        <img src="assets/img/logo_sticky.png" alt="" />
      </svg>

    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      <img src="assets/img/logo_sticky.png" alt="" />
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
