import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { reports } from '@/content/reports/reports.js';

const Container = styled.div`
    width: 100%;
    max-width: 950px;
    margin: 0 auto;
    padding: 40px 20px 80px;
    color: #bdbcbc;
    line-height: 1.8;
    font-size: clamp(0.95rem, 2vw, 1.05rem);


    h1, h2, h3 {
        color: #a78bfa;
        margin-top: 2rem;
        margin-bottom: 1rem;
        line-height: 1.3;
    }

    h1 {
        font-size: clamp(2rem, 5vw, 3rem);
    }

    h2 {
        font-size: clamp(1.5rem, 4vw, 2rem);
    }

    h3 {
        font-size: clamp(1.2rem, 3vw, 1.5rem);
    }
    
    p {
        margin-bottom: 1.2rem;
    }
    
    ul, ol {
        padding-left: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    li {
        margin-bottom: 0.5rem;
    }

    img {
        width: 100%;
        max-width: 100%;
        border-radius: 8px;
        margin: 1.5rem 0;
        max-height: 700px;
        object-fit: contain;
        box-shadow: 0 4px 20px rgba(0,0,0,0.35);
    }

    code {
        background: rgba(255,255,255,0.08);
        padding: 3px 6px;
        border-radius: 6px;
        font-size: .9rem;
        word-break: break-word;
    }

    pre {
        background: #111;
        padding: 1rem;
        border-radius: 12px;
        overflow-x: auto;
        margin: 1.5rem 0;
        border: 1px solid rgba(255,255,255,0.08);
    }

    pre code {
        background: transparent;
        padding: 0;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        overflow-x: auto;
        display: block;
        margin: 1.5rem 0;
    }

    th, td {
        border: 1px solid rgba(255,255,255,0.1);
        padding: 10px;
        text-align: left;
    }

    @media (max-width: 768px) {
        padding: 25px 16px 60px;
        line-height: 1.7;
        
        img {
            margin: 1rem 0;

            border-radius: 10px;
        }
        
        pre {
            padding: 0.8rem;

            font-size: 0.85rem;
        }
    }
`;

const Back = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: .95rem;
    margin-bottom: 20px;
    color: #a78bfa;
    text-decoration: none;
    transition: 0.2s;

    &:hover {
        color: #c4b5fd;
    }
`;

const ReportPage = () => {
    const { id } = useParams();

    const report = reports.find(r => r.id === id);

    if (!report) {
        return <Container>Report not found</Container>;
    }

    return (
        <Container>
            <Back to="/writeups">← Back to reports</Back>

            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {report.content}
            </ReactMarkdown>
        </Container>
    );
};

export default ReportPage;