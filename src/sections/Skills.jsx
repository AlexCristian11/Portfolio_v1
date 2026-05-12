import React from "react";
import styled from "styled-components";
import { ImHtmlFive, ImCss3 } from "react-icons/im";
import GlassIcons from "@/components/GlassIcons.jsx";
import { SiJavascript, SiKalilinux, SiReact } from "react-icons/si";
import { FaGithub, FaPython } from "react-icons/fa";
import { TbBrandCSharp } from "react-icons/tb";


const items = [
    { icon: <ImHtmlFive />, color: 'orange', label: 'HTML' },
    { icon: <ImCss3 />, color: 'blue', label: 'CSS' },
    { icon: <SiJavascript />, color: 'yellow', label: 'JavaScript' },
    { icon: <FaGithub />, color: 'purple', label: 'Github' },
    { icon: <SiKalilinux />, color: 'teal', label: 'Kali Linux' },
    { icon: <SiReact />, color: 'turquoise', label: 'React' },
    { icon: <TbBrandCSharp />, color: 'red', label: 'C#' },
    { icon: <FaPython />, color: 'green', label: 'Python' },
]

const PageContainer = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const AboutSection = styled.div`
    display: flex;
    justify-content: center;
    gap: 40px;
    flex-wrap: wrap;
    position: relative;
    z-index: 5;
    width: 100%;
    padding:20px;
    overflow-x: hidden;

    h2 {
        text-align: center;
        margin-bottom: 30px;
        margin-top: 20px;
        color: #bcbdbd;
    }
`

const AboutText = styled.p`
    flex: 1;
    color: #bdbcbc;
    font-size: clamp(1rem, 2vw, 1.05rem);
    line-height: 1.9;
    max-width: 550px;

    @media (max-width: 768px) {

        max-width: 100%;
    }
`

const SkillContainer = styled.div`
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    overflow: visible;
    min-width: 0;
    display: flex;
    align-items: center;
`

const AboutContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    width: 100%;
    max-width: 1200px;
    flex-wrap: wrap;
    margin-top: 2rem;
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 24px;
    }
`

const Skills = () => {
    return (
        <AboutSection>
            <PageContainer>
            <AboutContainer>
                <AboutText>Hi, I am Alex, a web developer and cybersecurity enthusiast. I specialize in building modern
                    web applications using React, Node.js and JavaScript, but my real excitement comes from the intersection
                    of development and security, whether I practice with CTF challenges, analyzing vulnerabilities or
                    implementing secure coding practices.
                </AboutText>
                <AboutText>
                    My goal is to create clean, efficient and secure digital experiences. I thrive on solving complex problems
                    and I am always eager to learn something new, as you can see in my Write-up section where I document my
                    experience with different CTFs and what I have learned from them.
                </AboutText>
            </AboutContainer>
            <h2>Skills</h2>
            <SkillContainer>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <GlassIcons items={items} className="custom-class"
                                colorful
                    />
                </div>
            </SkillContainer>
            </PageContainer>
        </AboutSection>
    )
}

export default Skills;