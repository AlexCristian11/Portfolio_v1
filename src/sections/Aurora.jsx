import React from 'react'
import styled from "styled-components";
import AuroraBackground from "../components/Aurora.jsx";

const AuroraContainer = styled.div`
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
`

const Aurora = () => {
    return (
        <AuroraContainer>
            <AuroraBackground
                colorStops={["#8066ff","#cd0e2b","#ff29c6"]}
                blend={0.5}
                amplitude={0.5}
                speed={.75}
            />
        </AuroraContainer>
    )
}

export default Aurora;