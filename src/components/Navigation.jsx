import React from "react";
import styled from "styled-components";
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';

const NavigationContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: visible;
`


const Navbar = styled.button`
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    width: 30%;
    min-width: 320px;
    @media (max-width: 768px) {
        width: 90%;
    }
    z-index: 10;
    justify-content: center;
    align-items: center;
    gap: 25px;
    padding: 0.8rem;
    font-size: 1rem;
    background: rgba(243, 241, 246, 0.08);
    border: 1px solid rgba(243, 241, 246, 0.12);
    backdrop-filter: blur(12px);
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    transition: all 0.3s ease;

    @media (max-width: 768px) {
        gap: 8px;
        padding: 0.6rem;
        top: 20px;
    }
    
`

const StyledRouterLink = styled(RouterLink)`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 35px;
    padding: 0.7rem 1.2rem;
    border-radius: 14px;
    color: white;
    cursor: pointer;

    transition:
            background 0.2s ease,
            transform 0.2s ease,
            color 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        color: #c4b5fd;
    }

    @media (max-width: 768px) {
        padding: 0.65rem 0.9rem;
        font-size: 0.9rem;
    }
`;

const StyledScrollLink = styled(ScrollLink)`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 35px;
    padding: 0.7rem 1.2rem;
    border-radius: 14px;
    color: white;
    cursor: pointer;

    transition:
            background 0.2s ease,
            transform 0.2s ease,
            color 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        color: #c4b5fd;
    }

    @media (max-width: 768px) {
        padding: 0.65rem 0.9rem;
        font-size: 0.9rem;
    }
`;

const Navigation = () => {
    return (
        <NavigationContainer>
            <Navbar>
                <StyledScrollLink to="projects">Projects</StyledScrollLink>
                <StyledScrollLink to="contact">Contact</StyledScrollLink>
                <StyledRouterLink to="write-ups">Write-ups</StyledRouterLink>
            </Navbar>
        </NavigationContainer>
    )
}

export default Navigation;