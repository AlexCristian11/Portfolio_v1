import React from 'react';
import styled from 'styled-components';
import { FaGithub } from "react-icons/fa";
import project1 from '@/assets/project1.png';

const ProjectsContainer = styled.div`
    width: 100%;
    max-width: 1100px;
    margin: 80px auto;
    padding: 0 20px;
    position: relative;
    z-index: 5;
    color: #bcbdbd;
    
    h2 {
        text-align: center;
        margin-bottom: 40px;
    }
`

const ProjectCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 40px;
    padding: 24px;
    margin-bottom: 40px;
    background: rgba(243, 241, 246, 0.08);
    border: 1px solid rgba(243, 241, 246, 0.15);
    backdrop-filter: blur(12px);
    border-radius: 20px;
    flex-direction: row;
    box-shadow: 2px 4px 20px rgba(0,0,0,0.2);

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
    }


    img {
        width: 100%;
        max-width: 320px;
        border-radius: 8px;
        object-fit: cover;
        height: 50%;
    }

    .projectInfo {
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex: 1;

        p {
            font-size: .95rem;
            line-height: 1.7;
        }
        
        a {
            font-size: 2rem;
            margin: 10px auto;
            transition: 0.2s ease;
            width: fit-content;
        }

        a:hover {
            transform: scale(1.1);
        }
    }
`

const Projects = () => {
    return(
        <ProjectsContainer id="projects">
            <h2>Projects</h2>
            <ProjectCard>
                <img src={project1} alt={'project1'}/>
                <div className="projectInfo">
                    <h5>OnlineCave</h5>
                    <p>
                        I can describe this project as my Magnus Opus, being the most complex application I have designed and developed.
                        This application is part of my Bachelor's thesis project.
                        It is a full-stack e-commerce web application developed using React as the front-end framework and .NET as the
                        back-end framework. The application follows modern and common elements found in most real-world e-commerce applications.
                        The design is intuitive and descriptive of it usage. Some of the functionalities integrated are: a navigation bar to toggle
                        between pages of the applications, such as account, cart and products; a carousel with images of popular products; a category
                        selection section, where users can filter products based on their desired category; product pages; cart and order pages; and
                        last but not least an account page where users can see and change their details, see their orders and invoices.
                    </p>
                    <a target={'_blank'} href={'https://github.com/AlexCristian11/LicentaReact'}><FaGithub /></a>
                </div>
            </ProjectCard>
        </ProjectsContainer>
    )
}

export default Projects;
