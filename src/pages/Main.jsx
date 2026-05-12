import Hero from '@/sections/Hero.jsx';
import ClickSpark from "@/components/ClickSpark.jsx";
import Skills from "@/sections/Skills.jsx";
import Projects from "@/sections/Projects.jsx";
import Contact from "@/sections/Contact.jsx";

function Main() {
    return (
    <ClickSpark>
        <Hero />
        <Skills />
        <Projects />
        <Contact />
    </ClickSpark>
)
}

export default Main;