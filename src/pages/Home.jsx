import Hero from '../components/sections/Hero';
// import About from '../components/sections/About';
// import Projects from '../components/sections/Projects';
import Skills from '../components/sections/Skills';
import Testimonials from '../components/sections/Testimonials';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Home = () => {
    return (
        <div>
            <Navbar />
            <Hero />

            {/* <About />
            <Projects /> */}
            <Skills />
            <Testimonials />
            {/* <Contact /> */}
             <Footer />
        </div>
    );
};

export default Home;