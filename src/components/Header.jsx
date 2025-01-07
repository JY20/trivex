import React from 'react';
import { Box, Typography, styled } from "@mui/material";
import { Link } from 'react-router-dom';

import layer from '../assets/layers_removed.png';

const Header = () => {

    const CustomBox = styled(Box)(({ theme }) => ({
        minHeight: '85vh', // Full screen height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        // paddingTop: theme.spacing(10),
        backgroundColor: '#D1C4E9',
        backgroundPosition: 'center', // Centers the background image
        position: 'relative', // Required for overlay positioning
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        }
    }));

    const ContentBox = styled(Box)({
        zIndex: 2, // Keeps the content above the overlay
        color: 'black', // Text color on top of the transparent background
    });

    return (
        <CustomBox component='header'>
            {/* Content Section */}
            <ContentBox>
                <Typography variant="h2" sx={{ margin: 0, fontWeight: 'bold' }}>
                    Welcome to Trivex
                </Typography>
                <Typography variant="h6" sx={{ color: 'black' }}>
                    Your go-to platform for real world assets trading and analysis, plus low-fee trading.
                </Typography>
            </ContentBox>
            
            {/* Image Section with Hover effect */}
            <img
                src={layer}
                alt="Titan Logo"
                style={{
                    width: '30%',
                    height: '39%',
                    marginRight: '10px',
                    transition: 'transform 0.3s ease', // Smooth transition for the hover effect
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'} // Enlarge image on hover
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'} // Reset image size when hover ends
            />
        </CustomBox>
    );
}

export default Header;
