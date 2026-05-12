import React from 'react'
import styled from "styled-components"
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiTryhackme } from "react-icons/si";

const ContactContainer = styled.div`
    width: 100%;
    max-width: 1000px;
    margin: 80px auto;
    padding: 0 20px;
    color: #bdbcbc;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    z-index: 5;
`

const ContactCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;
    background: rgba(243, 241, 246, 0.08);
    border: 1px solid rgba(243, 241, 246, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    transition: transform 0.2s ease, background 0.2s ease;
    box-shadow: 2px 4px 20px rgba(0,0,0,0.2);

    &:hover {
        transform: translateY(-5px);
        background: rgba(243, 241, 246, 0.12);
    }
    
    p {
        margin: 0;
        font-size: .85rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    a:hover {
        opacity: 0.8;
    }
`

const Title = styled.h3`
    position: relative;
    text-align: center;
    margin-bottom: 40px;
    font-size: 1.5rem;
    z-index: 5;
    color: #bcbdbd;
`;

const Contact = () => {
    return (
        <>
            <Title>Contact</Title>
            <ContactContainer id="contact">
                <ContactCard>
                    <h5>Phone number 1: +31634249446</h5>
                    <h5>Phone number 2: +40723531324</h5>
                </ContactCard>
                <ContactCard>
                    <p>Email: <a href="mailto:alexpopescu2002@yahoo.com">alexpopescu2002@yahoo.com</a></p>
                </ContactCard>
                <ContactCard>
                    <p>Github: AlexCristian11
                        <a href={"https://github.com/AlexCristian11/"} target="_blank"
                           rel="noopener noreferrer">
                            <FaGithub className={"icon"} />
                        </a>
                    </p>
                </ContactCard>
                <ContactCard>
                    <p>LinkedIn: alexcristian11
                        <a href={"https://www.linkedin.com/in/alexcristian11/"} target="_blank"
                           rel="noopener noreferrer">
                            <FaLinkedin className={"icon"} />
                        </a>
                    </p>
                </ContactCard>
                <ContactCard>
                    <p>TryHackMe: AlexCristian11
                        <a href={"https://tryhackme.com/p/AlexCristian11"} target="_blank"
                           rel="noopener noreferrer">
                        <SiTryhackme className={"icon"} />
                        </a>
                    </p>
                </ContactCard>
            </ContactContainer>
        </>
    )
}

export default Contact;