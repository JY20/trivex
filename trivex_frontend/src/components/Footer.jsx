import React from 'react';
import { Box, Stack, styled, Typography, Container, Grid, Link as MuiLink, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const FooterContainer = styled(Box)(({ theme }) => ({
    background: 'rgba(28, 25, 38, 0.85)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(126, 87, 194, 0.2)',
    boxShadow: '0 -8px 32px 0 rgba(31, 38, 135, 0.15)',
    padding: '40px 0 30px',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, rgba(155, 109, 255, 0) 0%, rgba(155, 109, 255, 0.5) 50%, rgba(155, 109, 255, 0) 100%)',
    }
  }));

  const FooterSection = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px',
  });

  const FooterTitle = styled(Typography)({
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginBottom: '16px',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-8px',
      left: 0,
      width: '40px',
      height: '2px',
      background: 'linear-gradient(90deg, #9B6DFF 0%, rgba(155, 109, 255, 0.3) 100%)',
    }
  });

  const FooterLink = styled(MuiLink)({
    color: '#B19EE3',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    position: 'relative',
    padding: '4px 0',
    '&:hover': {
      color: '#FFFFFF',
      transform: 'translateX(4px)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '0%',
      height: '1px',
      background: 'linear-gradient(90deg, #9B6DFF 0%, rgba(155, 109, 255, 0.3) 100%)',
      transition: 'width 0.3s ease',
    },
    '&:hover::before': {
      width: '100%',
    }
  });

  const SocialIcon = styled('a')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'rgba(28, 25, 38, 0.5)',
    border: '1px solid rgba(126, 87, 194, 0.3)',
    color: '#B19EE3',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      background: 'rgba(126, 87, 194, 0.2)',
      boxShadow: '0 6px 20px rgba(155, 109, 255, 0.25)',
      color: '#FFFFFF',
    },
    '& svg': {
      width: '20px',
      height: '20px',
      transition: 'all 0.3s ease',
    },
    '&:hover svg': {
      transform: 'scale(1.15)',
    }
  }));

  const Copyright = styled(Typography)({
    color: '#B19EE3',
    fontSize: '0.875rem',
    textAlign: 'center',
    marginTop: '30px',
    opacity: 0.8,
  });

  const HexagonPattern = styled(Box)({
    position: 'absolute',
    width: '300px',
    height: '300px',
    right: '-150px',
    bottom: '-150px',
    background: 'radial-gradient(circle, rgba(155, 109, 255, 0.1) 0%, rgba(155, 109, 255, 0) 70%)',
    opacity: 0.4,
    borderRadius: '30%',
    transform: 'rotate(30deg)',
    pointerEvents: 'none',
  });

  const Divider = styled(Box)({
    width: '100%',
    height: '1px',
    background: 'linear-gradient(90deg, rgba(155, 109, 255, 0) 0%, rgba(155, 109, 255, 0.2) 50%, rgba(155, 109, 255, 0) 100%)',
    margin: '30px 0',
  });

  return (
    <FooterContainer component='footer'>
      <HexagonPattern />
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FooterSection>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: 2 }}>
                <Typography variant="h6" sx={{ 
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #B19EE3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.5rem'
                }}>
                  Trivex
                </Typography>
              </Box>
              <Typography sx={{ color: '#B19EE3', mb: 2, lineHeight: 1.6 }}>
                Decentralized perpetual exchange built on Starknet. Trade with confidence on a cutting-edge platform designed for the Web3 future.
              </Typography>
            </FooterSection>
          </Grid>

          <Grid item xs={12} md={6}>
            <FooterTitle variant="h6">Connect With Us</FooterTitle>
            <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap', mt: 1 }}>
              <SocialIcon target="_blank" rel="noreferrer noopener" href="https://x.com/trivex_xyz" aria-label="X">
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M8.28064 10.6416L2.20837 2.9165H7.01804L10.7664 7.69116L14.7709 2.938H17.4198L12.0472 9.3226L18.4177 17.4373H13.6224L9.56365 12.2738L5.23057 17.423H2.5673L8.28064 10.6416ZM14.3213 16.006L5.1575 4.34783H6.31855L15.4708 16.006H14.3213Z"></path>
                </svg>
              </SocialIcon>

              <SocialIcon target="_blank" rel="noreferrer noopener" href="https://discord.gg/9sVWPDQxsD" aria-label="Discord">
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M16.93 1.644A16.491 16.491 0 0012.86.38a.062.062 0 00-.066.031c-.175.313-.37.72-.506 1.041a15.226 15.226 0 00-4.573 0A10.54 10.54 0 007.2.412a.064.064 0 00-.065-.031 16.447 16.447 0 00-4.07 1.263.058.058 0 00-.028.023C.444 5.54-.266 9.319.083 13.05a.069.069 0 00.026.047 16.584 16.584 0 004.994 2.525.064.064 0 00.07-.023c.385-.526.728-1.08 1.022-1.662a.063.063 0 00-.035-.088 10.917 10.917 0 01-1.56-.744.064.064 0 01-.007-.106c.105-.079.21-.16.31-.243a.062.062 0 01.065-.009c3.273 1.495 6.817 1.495 10.051 0a.062.062 0 01.066.008c.1.083.204.165.31.244a.064.064 0 01-.005.106c-.499.291-1.017.537-1.561.743a.064.064 0 00-.034.089c.3.582.643 1.135 1.02 1.66a.063.063 0 00.07.025 16.53 16.53 0 005.003-2.525.064.064 0 00.026-.046c.417-4.314-.699-8.061-2.957-11.384a.05.05 0 00-.026-.023zM6.684 10.778c-.985 0-1.797-.905-1.797-2.016 0-1.11.796-2.015 1.797-2.015 1.01 0 1.814.912 1.798 2.015 0 1.111-.796 2.016-1.798 2.016zm6.646 0c-.986 0-1.797-.905-1.797-2.016 0-1.11.796-2.015 1.797-2.015 1.009 0 1.813.912 1.797 2.015 0 1.111-.788 2.016-1.797 2.016z"></path>
                </svg>
              </SocialIcon>

              <SocialIcon target="_blank" rel="noreferrer noopener" href="https://t.me/trivexxyz" aria-label="Telegram">
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M10 0C4.478 0 0 4.478 0 9.99 0 15.511 4.478 20 10 20s10-4.488 10-10.01C20 4.477 15.522 0 10 0zm4.925 6.28c-.064.927-1.78 7.856-1.78 7.856s-.107.406-.48.416a.644.644 0 01-.49-.192c-.395-.33-1.29-.97-2.132-1.556a.953.953 0 01-.107.096c-.192.17-.48.416-.789.714a10.7 10.7 0 00-.373.352l-.01.01a2.214 2.214 0 01-.193.171c-.415.341-.458.053-.458-.096l.224-2.441v-.021l.01-.022c.011-.032.033-.043.033-.043s4.36-3.88 4.477-4.296c.01-.021-.021-.042-.074-.021-.288.096-5.31 3.273-5.864 3.625-.032.02-.128.01-.128.01l-2.441-.8s-.288-.117-.192-.383c.021-.053.053-.107.17-.181.544-.384 10-3.785 10-3.785s.267-.085.427-.032c.074.032.117.064.16.17.01.043.021.128.021.224 0 .054-.01.118-.01.224z"></path>
                </svg>
              </SocialIcon>

              <SocialIcon target="_blank" rel="noreferrer noopener" href="https://github.com/JY20/trivex_web" aria-label="GitHub">
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" />
                </svg>
              </SocialIcon>
            </Box>
          </Grid>
        </Grid>

        <Divider />

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'center' : 'center', gap: 2 }}>
          <Copyright>
            &copy; {new Date().getFullYear()} Trivex. All rights reserved.
          </Copyright>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <FooterLink href="#" sx={{ fontSize: '0.875rem' }}>Terms</FooterLink>
            <FooterLink href="#" sx={{ fontSize: '0.875rem' }}>Privacy</FooterLink>
          </Box>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
