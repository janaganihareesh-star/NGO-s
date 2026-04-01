import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Dynamic theme

const ParticleNetwork = ({ isDarkMode }) => {
  const pointsRef = useRef();
  
  const count = 1500;
  const [positions, connections] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return [pos, []];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={isDarkMode ? "#C9933A" : "#0A0A0F"} // Dark particles in light mode
          size={isDarkMode ? 0.15 : 0.2}
          sizeAttenuation={true}
          depthWrite={false}
          blending={isDarkMode ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </Points>
      
      {/* Central Glow */}
      <mesh>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial color={isDarkMode ? "#C9933A" : "#FFFFFF"} transparent opacity={isDarkMode ? 0.03 : 0} />
      </mesh>
    </group>
  );
};

const Hero3D = () => {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const y1 = useTransform(scrollY, [0, 500], [0, isMobile ? 0 : 200]);
  const opacityValue = useTransform(scrollY, [0, 300], [1, isMobile ? 1 : 0]);

  return (
    <section className="relative h-screen w-full bg-primary-navy overflow-hidden">
      {/* Background Particles - Only on Desktop for Performance */}
      {!isMobile && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Canvas camera={{ position: [0, 0, 50], fov: 60 }}>
            <ambientLight intensity={isDarkMode ? 0.2 : 0.8} />
            <pointLight position={[10, 10, 10]} intensity={1} color={isDarkMode ? "#C9933A" : "#000000"} />
            <ParticleNetwork isDarkMode={isDarkMode} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>
      )}

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6">
        <motion.div
          style={{ y: y1, opacity: opacityValue }}
          className="max-w-7xl text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: isMobile ? 0 : 0.8, delay: 0.2 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 ${isDarkMode ? 'glass-gold' : 'border border-gray-300 bg-white/50'}`}
          >
            <div className={`w-2 h-2 rounded-full ${!isMobile ? 'animate-pulse' : ''} ${isDarkMode ? 'bg-primary-gold shadow-[0_0_10px_#C9933A]' : 'bg-gray-800 shadow-[0_0_10px_rgba(0,0,0,0.5)]'}`} />
            <span className={`text-[10px] uppercase tracking-[0.3em] font-bold ${isDarkMode ? 'text-primary-gold' : 'text-gray-800'}`}>
              Protecting lives since 2014
            </span>
          </motion.div>

          <h1 className={`text-5xl md:text-8xl font-heading font-black mb-6 leading-tight select-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            From Womb to World — <br />
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-gold-gradient italic"
            >
              We Protect Her
            </motion.span>
          </h1>

          <p className={`font-body text-[10px] md:text-xs tracking-[0.6em] uppercase mb-8 block font-black ${isDarkMode ? 'text-primary-gold' : 'text-primary-gold'}`}>
            Women • Children • LGBTQ • Elderly • Environment
          </p>

          <p className={`max-w-3xl mx-auto font-body text-base mb-10 select-none font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Empowering the vulnerable, restoring dignity, and building a sustainable future where every life is cherished and protected.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center pointer-events-auto">
            <button 
              onClick={() => navigate('/login')}
              className="group relative px-12 py-5 bg-primary-gold text-primary-navy font-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary-gold/40"
            >
              <span className="relative z-10">JOIN US TODAY</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <button 
              onClick={() => navigate('/donate')}
              className={`px-12 py-5 font-black rounded-full transition-all ${isDarkMode ? 'border border-primary-gold/30 text-primary-gold hover:bg-primary-gold/5' : 'border-2 border-primary-navy text-primary-navy hover:bg-primary-navy/5'}`}
            >
              DONATE NOW
            </button>
          </div>
        </motion.div>
      </div>

      {/* Horizontal Ticker */}
      <div className={`absolute bottom-0 left-0 w-full py-4 overflow-hidden ${isDarkMode ? 'glass border-t border-primary-gold/10' : 'bg-white/40 border-t border-gray-200'}`}>
        <div className={`flex whitespace-nowrap ${!isMobile ? 'animate-[marquee_30s_linear_infinite]' : ''}`}>
          {[1,2,3,4].map((i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span className={`text-[10px] uppercase tracking-[0.4em] font-bold ${isDarkMode ? 'text-primary-gold' : 'text-primary-navy'}`}>Women Safety</span>
              <span className={`text-[10px] uppercase tracking-[0.4em] font-bold ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>•</span>
              <span className={`text-[10px] uppercase tracking-[0.4em] font-bold ${isDarkMode ? 'text-primary-gold' : 'text-primary-navy'}`}>Girl Child Protection</span>
              <span className={`text-[10px] uppercase tracking-[0.4em] font-bold ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>•</span>
              <span className={`text-[10px] uppercase tracking-[0.4em] font-bold ${isDarkMode ? 'text-primary-gold' : 'text-primary-navy'}`}>LGBTQ Awareness</span>
              <span className={`text-[10px] uppercase tracking-[0.4em] font-bold ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>•</span>
              <span className={`text-[10px] uppercase tracking-[0.4em] font-bold ${isDarkMode ? 'text-primary-gold' : 'text-primary-navy'}`}>Environment</span>
              <span className={`text-[10px] uppercase tracking-[0.4em] font-bold ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>•</span>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </section>
  );
};

export default Hero3D;
