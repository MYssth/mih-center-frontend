import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import jwtDecode from "jwt-decode";
// @mui
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

// const img = fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_roleCrudPort}/api/getsitesetting`)
//   .then((response) => response.json())
//   .then((data) => data.logo)
//   .catch((error) => {
//     console.error('Error:', error);
//   });

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
        <image id="image0" width="100%" height="100%" x="0" y="0" href={localStorage.getItem('logo')} />
      </svg>

      {/* <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 333 100" enableBackground="new 0 0 333 100" xmlSpace="preserve" >  <image id="image0" width="100%" height="100%" x="0" y="0"
    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAU0AAABkCAMAAAA1+pK8AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABIFBMVEUAAAD/////////////
///////////////////////////////////////////////////x9vG60bqRtpFnm2hZklowdjEi
bSNLiEyDrYOsyK3j7eSev58+fz/W5NbI28h1pHb+okX+smT/8OD+ixf+gwf/9/D+uXT/wYP/6NH+
mjb+kyb+qlX/0aL/4MH/yZP/2LLu7e329vaYkpJ2bm7U0tKHgIDd29vk6fKUqMqppKTJ0+QoUJR/
d3fl5OTDwMCyra2hstCuvddefK+QiYmGncN5krw1W5tDZqHy9PjX3utrh7VQcai8yN67t7fMycmh
m5vKyMnt7e25tbfl4+TBvsDT0dKVkJLc2ttya26wrK2Mh4l7dHeno6SEfoCemZvCEK5DAAAAEHRS
TlMAEFCAv8/vj2AgcN8wQK+fQEvuowAAAAFiS0dEAf8CLd4AAAAHdElNRQfmDAcGMwXUYmqKAAAP
kklEQVR42u2di1vayhLAgYSAhMcg8hAEtIq179bSljRpTyWF8Ow5redcpbU9//9/cWd2NyGRKMHb
Ho+XzPepye5mkvyY3ZndTDASCSWUUELxk2hMkuPARZETyY3bvqC7KxspG+Rc1ET6ti/rTkomC/6i
Jm/70u6cZGSOLr9Z2CqWyiiV4na1FvK8gUS5XdZ2KmWv1LcbrCaeue1LvDsSU4hYc6vsJ/Uq45m4
7Yu8K5IgWo1i+SrhPOOhfw8gURox89vl66RIA6gSevelEqWoqFEpXy+laogzgDCYm6XyUtkNcfrI
hpcIwax6sG025+LBmQ9xXhIaJJXc3J/kFmCW3YG7p6JCkWf0tu/g3yQiRrd5JhdhXk2TdXb5tu/g
XyQbDieJjGwD48xGKTDNcgGLUrd9D/8eSSOOvXv7bLYYY5aar5eD0yxv4jgRhp2OqAD7B617h4Qq
S/18Mc68jmYJPVH2tu/h3yMZRHS/1To4Eria5ZVosqEznLI7grPIBy2Uhw8YruKKNMuN0BG5hEbO
R4SzdeTjz5fTLGJpOHI6giPnY0az9fgQdlemWa65l5NiWZlEuu2bujXJAhxxmq2Hh7XKyjRx5FRs
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" />
</svg> */}

    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
