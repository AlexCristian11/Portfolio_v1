import React from "react";
import styled from "styled-components";
import Navigation from "../components/Navigation.jsx";
import AuroraBackground from "@/sections/Aurora.jsx";

const HeroSection = styled.section`
    position: relative;
    z-index: 5;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 20px;
    padding-top: 120px;
`

const HeroButton = styled.button`
    padding: 0.9rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    background: rgba(139, 92, 246, 0.18);
    color: white;
    border: 1px solid rgba(139, 92, 246, 0.45);
    border-radius: 14px;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
    min-height: 48px;

    &:hover {
        transform: translateY(-3px);

        background: rgba(139, 92, 246, 0.32);

        border-color: rgba(139, 92, 246, 0.8);
    }

    @media (max-width: 768px) {

        width: 100%;

        max-width: 300px;

        font-size: 0.95rem;

        padding: 0.85rem 1.5rem;
    }
`

const HeroTitle = styled.h1`
    font-size: clamp(2.5rem, 8vw, 5rem);
    color: white;
    margin-bottom: 20px;
    line-height: 1.1;
    max-width: 900px;
    text-wrap: balance;
`

const HeroSubtitle = styled.p`
    font-size: clamp(1rem, 3vw, 1.4rem);
    color: rgba(255,255,255,0.8);
    margin-bottom: 40px;
    max-width: 700px;
    line-height: 1.7;
`

const Hero = () => {
    return (
        <>
            <AuroraBackground />
            <Navigation />
            <HeroSection>
                <HeroTitle>Alexandru Cristian Popescu</HeroTitle>
                <HeroSubtitle>Web Developer & Cybersecurity Enthusiast</HeroSubtitle>
                <HeroButton as='a' href="/cv/CV_Alexandru_Cristian_Popescu.pdf" download>
                    Download CV
                </HeroButton>
            </HeroSection>
        </>
    )
}

export default Hero;