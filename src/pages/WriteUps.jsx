import React from 'react';
import styled from "styled-components";
import {reports} from "@/content/reports/reports.js";
import { Link } from 'react-router-dom';

const WriteUpsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #bdbcbc;
    margin: 0 auto;
    padding: 40px 20px;
    max-width: 1200px;
`

const HomeLink = styled(Link)`
    align-self: flex-start;
    color: #a78bfa;
    text-decoration: none;
    margin-bottom: 20px;
    font-size: 0.95rem;
    transition: 0.2s;
    &:hover {
        color: #c4b5fd;
    }
`;

const Title = styled.h1`
    font-size: clamp(2rem, 5vw, 3rem);
    margin-bottom: 20px;
    text-align: center;
`;

const Description = styled.p`
    width: 100%;
    max-width: 700px;
    text-align: center;
    line-height: 1.7;
    margin-bottom: 40px;
    font-size: clamp(0.95rem, 2vw, 1.1rem);
`;


const CardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    width: 100%;
`;

const Card = styled(Link)`
    text-decoration: none;
    color: inherit;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    transition: 
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 120px;
    
    &:hover {
        transform: translateY(-6px);
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(167, 139, 250, 0.4);
    }

    @media (max-width: 768px) {
        min-height: 120px;
        padding: 1.2rem;
    }
`;

const CardTitle = styled.h3`
    color: #a78bfa;
    margin-bottom: 12px;
    font-size: 1.3rem;
`;

const CardText = styled.p`
    width: 100% !important;
    margin: 0 !important;
    line-height: 1.5;
    color: rgba(255,255,255,0.75);
    font-size: 0.95rem;
`;


const WriteUps = () => {
    return (
    <WriteUpsContainer>
        <HomeLink to={"/"} >Home</HomeLink>
        <Title>CTF Write-ups</Title>
        <Description>
            Here you can see the reports I have written when solving CTFs on TryHackMe. You will see
            the methods and tools I used to solve the rooms and what I have learned from them. You can see
            only a portion of the rooms I have solved, more can be seen on my TryHackMe profile which is linked
            in the contact section.
        </Description>

        <CardsGrid>
            {reports.map((report) => (
                <Card key={report.id} to={`/writeups/${report.id}`}>
                    <CardTitle>{report.title}</CardTitle>
                    <CardText>Click to view report</CardText>
                </Card>
            ))}
        </CardsGrid>
    </WriteUpsContainer>
    )
}

export default WriteUps;