import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  Award, 
  BookOpen, 
  Phone, 
  Mail, 
  MapPin, 
  X, 
  ChevronDown, 
  Check, 
  ShieldCheck, 
  FileText, 
  ChevronUp, 
  Sparkles,
  Upload,
  User,
  Activity
} from 'lucide-react';
import { experiences, education, skills } from './data';
import { Experience } from './types';
import leoulePortrait from './assets/images/leoule_portrait_1781017915959.jpeg';

export default function App() {
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'am'>('en');
  const [activeModalExp, setActiveModalExp] = useState<Experience | null>(null);
  
  // Navigation & Scroll states
  const [navbarBg, setNavbarBg] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrolledPercentage, setScrolledPercentage] = useState(0);
  const lastScrollY = useRef(0);

  // Parallax states
  const [scrollYOffset, setScrollYOffset] = useState(0);

  // PDF.js uploader and canvas rendering state by Experience - persisted in localStorage
  const [renderedPagesByExp, setRenderedPagesByExp] = useState<{ [expId: string]: { [pageIdx: number]: string } }>(() => {
    try {
      const saved = localStorage.getItem('leoule_rendered_pages_by_exp');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.warn("Could not load pdf portfolios from localStorage:", e);
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('leoule_rendered_pages_by_exp', JSON.stringify(renderedPagesByExp));
    } catch (e) {
      console.error("Could not save pdf portfolios to localStorage (quota may be exceeded):", e);
    }
  }, [renderedPagesByExp]);

  const renderedPages = activeModalExp ? (renderedPagesByExp[activeModalExp.id] || {}) : {};
  const pdfFileUploaded = activeModalExp ? (Object.keys(renderedPages).length > 0) : false;
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Custom cursor states (only for fine-pointer desktops)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorHoverType, setCursorHoverType] = useState<'view' | 'open' | ''>('');
  const [isCursorClicked, setIsCursorClicked] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Skills section animation triggers
  const [animateSkills, setAnimateSkills] = useState(false);
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  
  // Timeline section height calculation
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineHeight, setTimelineHeight] = useState('0%');

  // Modal focus trapping ref
  const modalRef = useRef<HTMLDivElement>(null);

  // HTML Canvas for construction background overlays
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const heroRightRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = heroRightRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let resizeTimeout: any;

    const drawCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = container.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Don't render complex canvas drawings on mobile (pointer: coarse)
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      if (isCoarse) return;

      ctx.save();
      const goldColor = (alpha: number) => `rgba(201, 169, 110, ${alpha})`;

      // A — ISOMETRIC FLOOR PLAN FRAGMENTS (bottom-left zone, 30% of width)
      ctx.save();

      const drawWall = (x1: number, y1: number, x2: number, y2: number, isOuter = true) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isOuter ? goldColor(0.06) : goldColor(0.04);
        ctx.lineWidth = isOuter ? 1.5 : 0.8;
        ctx.stroke();
      };

      // A — LOCALIZED ISOMETRIC PLAN FRAGMENTS (starts from left/divider border of right side block)
      // Room 1: Bottom-left of right section
      drawWall(0, height - 220, 140, height - 220, true);
      drawWall(140, height - 220, 140, height, true);
      // Double lines for thickness
      drawWall(0, height - 226, 145, height - 226, false);
      drawWall(145, height - 226, 145, height, false);

      // Room 2: Adjacent small niche
      drawWall(140, height - 130, 240, height - 130, true);
      drawWall(240, height - 130, 240, height, true);
      drawWall(140, height - 136, 245, height - 136, false);
      drawWall(245, height - 136, 245, height, false);

      // Door swing arc
      const cxArc1 = 140;
      const cyArc1 = height - 60;
      ctx.beginPath();
      ctx.arc(cxArc1, cyArc1, 25, -Math.PI / 2, 0);
      ctx.strokeStyle = goldColor(0.04);
      ctx.lineWidth = 0.8;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(cxArc1, cyArc1);
      ctx.lineTo(cxArc1, cyArc1 - 25);
      ctx.stroke();

      // Window indicators: triple parallel lines on wall segments
      const drawWindowSegment = (x: number, yStart: number, yEnd: number, isVertical = true) => {
        ctx.strokeStyle = goldColor(0.05);
        ctx.lineWidth = 0.5;
        if (isVertical) {
          ctx.beginPath(); ctx.moveTo(x - 2, yStart); ctx.lineTo(x - 2, yEnd); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x, yStart); ctx.lineTo(x, yEnd); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + 2, yStart); ctx.lineTo(x + 2, yEnd); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.moveTo(yStart, x - 2); ctx.lineTo(yEnd, x - 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(yStart, x); ctx.lineTo(yEnd, x); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(yStart, x + 2); ctx.lineTo(yEnd, x + 2); ctx.stroke();
        }
      };
      
      drawWindowSegment(140, height - 185, height - 155, true);
      
      // Dimension tick marks
      const drawTick = (x: number, y: number) => {
        ctx.beginPath();
        ctx.moveTo(x - 4, y - 4);
        ctx.lineTo(x + 4, y + 4);
        ctx.strokeStyle = goldColor(0.07);
        ctx.lineWidth = 1;
        ctx.stroke();
      };
      drawTick(140, height - 220);
      drawTick(145, height - 226);
      drawTick(240, height - 130);
      drawTick(245, height - 136);
      ctx.restore();

      // B — ELEVATION DRAWING LINES (top-right zone, suggests building facade)
      ctx.save();
      const fWidth = Math.min(320, width * 0.7);
      const fHeight = 160;
      const fX = width - fWidth - 30; // 30px padding on the right side
      const fY = 70; // top margin spacing

      // Roofline
      ctx.beginPath();
      ctx.moveTo(fX, fY);
      ctx.lineTo(fX + fWidth, fY);
      ctx.strokeStyle = goldColor(0.08);
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Ground line
      ctx.beginPath();
      ctx.moveTo(fX - 15, fY + fHeight);
      ctx.lineTo(fX + fWidth + 15, fY + fHeight);
      ctx.strokeStyle = goldColor(0.06);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Multi-story facade lines (2 levels)
      const floorH = fHeight / 2;
      ctx.beginPath();
      ctx.moveTo(fX, fY + floorH);
      ctx.lineTo(fX + fWidth, fY + floorH);
      ctx.strokeStyle = goldColor(0.04);
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Vertical column lines (3 divisions)
      const colW = fWidth / 3;
      for (let c = 0; c <= 3; c++) {
        ctx.beginPath();
        ctx.moveTo(fX + c * colW, fY);
        ctx.lineTo(fX + c * colW, fY + fHeight);
        ctx.strokeStyle = goldColor(0.04);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Window gridding
      ctx.strokeStyle = goldColor(0.05);
      ctx.lineWidth = 0.5;
      for (let f = 0; f < 2; f++) {
        for (let c = 0; c < 3; c++) {
          const winW = colW * 0.45;
          const winH = floorH * 0.5;
          const left1 = fX + c * colW + (colW - winW * 2) / 3;
          const left2 = left1 + winW + (colW - winW * 2) / 3;
          const top = fY + f * floorH + (floorH - winH) / 2;
          
          ctx.strokeRect(left1, top, winW, winH);
          ctx.strokeRect(left2, top, winW, winH);
        }
      }
      ctx.restore();

      // C — SCATTERED TECHNICAL ANNOTATIONS (localized bounds)
      ctx.save();
      const annoPositions = [
        { x: 30, y: 140, length: 100, dir: 'h' },
        { x: width * 0.5, y: 125, length: 110, dir: 'v' },
        { x: width * 0.15, y: height * 0.45, length: 90, dir: 'v' },
        { x: width * 0.75, y: height * 0.75, length: 120, dir: 'h' },
        { x: width * 0.3, y: height * 0.88, length: 110, dir: 'h' },
        { x: 45, y: height * 0.28, length: 70, dir: 'v' }
      ];

      annoPositions.forEach(({ x, y, length, dir }) => {
        if (x < 0 || x > width || y < 0 || y > height) return;
        
        ctx.beginPath();
        ctx.strokeStyle = goldColor(0.05);
        ctx.lineWidth = 0.8;

        if (dir === 'h') {
          ctx.moveTo(x, y);
          ctx.lineTo(x + length, y);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x - 3, y - 3);
          ctx.lineTo(x + 3, y + 3);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x + length - 3, y - 3);
          ctx.lineTo(x + length + 3, y + 3);
          ctx.stroke();
        } else {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + length);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x - 3, y - 3);
          ctx.lineTo(x + 3, y + 3);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x - 3, y + length - 3);
          ctx.lineTo(x + 3, y + length + 3);
          ctx.stroke();
        }
      });
      ctx.restore();

      // D — COMPASS ROSE
      ctx.save();
      const pad = 60;
      const compX = width - pad;
      const compY = height - pad;

      ctx.beginPath();
      ctx.arc(compX, compY, 26, 0, Math.PI * 2);
      ctx.strokeStyle = goldColor(0.04);
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(compX - 32, compY);
      ctx.lineTo(compX + 32, compY);
      ctx.moveTo(compX, compY - 32);
      ctx.lineTo(compX, compY + 32);
      ctx.strokeStyle = goldColor(0.07);
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(compX, compY, 2, 0, Math.PI * 2);
      ctx.fillStyle = goldColor(0.12);
      ctx.fill();

      // North Arrow Triangle
      ctx.beginPath();
      ctx.moveTo(compX, compY - 32);
      ctx.lineTo(compX - 4, compY - 24);
      ctx.lineTo(compX + 4, compY - 24);
      ctx.closePath();
      ctx.fillStyle = goldColor(0.08);
      ctx.fill();
      ctx.restore();

      // E — DIAGONAL SECTION CUT LINE
      ctx.save();
      const startX = width * 0.22;
      const startY = 85;
      const endX = width * 0.85;
      const endY = height * 0.8;

      ctx.beginPath();
      ctx.setLineDash([12, 6]);
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = goldColor(0.05);
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = goldColor(0.05);

      ctx.beginPath();
      ctx.arc(startX, startY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(endX, endY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();
    };

    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        requestAnimationFrame(drawCanvas);
      }, 100);
    });

    observer.observe(container);
    requestAnimationFrame(drawCanvas);

    return () => {
      observer.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, [isDesktop]);

  // Check device capabilities and setup cursor on desktop
  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    setIsDesktop(!isCoarse);

    if (!isCoarse) {
      document.body.classList.add('cursor-hide-all');
    }

    return () => {
      document.body.classList.remove('cursor-hide-all');
    };
  }, []);

  // Tracking cursor positions and hover classes
  useEffect(() => {
    if (!isDesktop) return;

    const onMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });

      // Determine hover state based on closest selectors
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .interactive-trigger, input')) {
        setCursorHoverType('view');
      } else if (target.closest('.experience-card, .education-card')) {
        setCursorHoverType('open');
      } else {
        setCursorHoverType('');
      }
    };

    const onMouseDown = () => setIsCursorClicked(true);
    const onMouseUp = () => setIsCursorClicked(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDesktop]);

  // General scroll listeners
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Raw offset for parallax
      setScrollYOffset(currentScrollY);

      // Scroll height percentage
      const percent = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
      setScrolledPercentage(percent);

      // Navbar visual trigger
      setNavbarBg(currentScrollY > 80);

      // Scroll back up button
      setShowScrollTop(currentScrollY > 600);

      // Hide / Show Navbar on scroll velocity
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current) {
          setNavbarVisible(false); // scrolling down
        } else {
          setNavbarVisible(true); // scrolling up
        }
      } else {
        setNavbarVisible(true);
      }

      lastScrollY.current = currentScrollY;

      // Update timeline indicator height
      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const startOffset = window.innerHeight * 0.8;
        const scrolled = startOffset - rect.top;
        let p = (scrolled / rect.height) * 100;
        p = Math.max(0, Math.min(100, p));
        setTimelineHeight(`${p}%`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Skills intersection observer uploader
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setAnimateSkills(true);
      }
    }, { threshold: 0.2 });

    if (skillsSectionRef.current) {
      observer.observe(skillsSectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Handle PDF Drag & Drop / Upload
  const processUploadedPdf = async (file: File, expId: string) => {
    setIsPdfLoading(true);
    setPdfError(null);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arr = new Uint8Array(e.target?.result as ArrayBuffer);
        const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'] || (window as any)['pdfjsLib'];
        
        if (!pdfjsLib) {
          throw new Error("PDF.js renderer is loading. Please try again in 2 seconds.");
        }

        // Configure Worker CDN
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        const loadingTask = pdfjsLib.getDocument({ data: arr });
        const pdf = await loadingTask.promise;
        const slices: { [key: number]: string } = {};

        // Extract and render page canvases locally
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.2 });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          if (context) {
            // Fill background with solid white for high-compatibility JPEG compression
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            slices[i] = canvas.toDataURL('image/jpeg', 0.65);
          }
        }
        
        setRenderedPagesByExp(prev => ({
          ...prev,
          [expId]: slices
        }));
        setIsPdfLoading(false);
      } catch (err: any) {
        console.error(err);
        setPdfError(err.message || "Failed to process PDF portfolio scan. Please verify this is a valid PDF.");
        setIsPdfLoading(false);
      }
    };

    reader.onerror = () => {
      setPdfError("Error reading the file. Please try again.");
      setIsPdfLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (files[0].type === "application/pdf") {
        if (activeModalExp) {
          processUploadedPdf(files[0], activeModalExp.id);
        } else {
          setPdfError("No active work history modal is open.");
        }
      } else {
        setPdfError("Please drop a valid PDF document portfolio.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (activeModalExp) {
        processUploadedPdf(files[0], activeModalExp.id);
      } else {
        setPdfError("No active work history modal is open.");
      }
    }
  };

  // Trapping ESC to shut open dialog modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalExp(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth scroll with offset for elements
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const navbarOffset = 72;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Reusable side-by-side translation renderer
  const BilingualBlock = ({ 
    en, 
    am, 
    className = "" 
  }: { 
    en: React.ReactNode; 
    am: React.ReactNode; 
    className?: string 
  }) => {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start relative ${className}`}>
        {/* Left Column: English */}
        <div 
          className="lang-col font-sans text-lux-white/95 text-[16.5px] md:text-[17.5px] leading-[1.95]"
          style={{ opacity: activeLanguage === 'en' ? 1 : 0.45 }}
        >
          {en}
        </div>
        
        {/* Vertical Separator */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gold-primary/10 hidden md:block select-none pointer-events-none transform -translate-x-1/2" />
        
        {/* Mobile Horizontal Gold Divider */}
        <div className="h-[1px] w-full bg-gold-primary/15 md:hidden my-2 select-none pointer-events-none" />

        {/* Right Column: Amharic */}
        <div 
          className="lang-col font-ethiopic text-lux-white/90 text-[15.5px] md:text-[16.5px] leading-[2.15] text-right md:text-left"
          style={{ opacity: activeLanguage === 'am' ? 1 : 0.45 }}
        >
          {am}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-void text-lux-white/90 selection:bg-gold-primary/30 selection:text-gold-glow relative">
      
      {/* Scroll Progress Bar */}
      <div 
        id="scroll-progress" 
        className="fixed top-0 left-0 h-[2.5px] z-[999] transition-all duration-[80ms] ease-out pointer-events-none"
        style={{ 
          width: `${scrolledPercentage}%`,
          background: 'linear-gradient(90deg, var(--gold-dim), var(--gold-primary), var(--gold-glow))',
          boxShadow: '0 0 10px rgba(199,169,110,0.6)'
        }}
      />

      {/* Custom Mouse Cursor (Desktop luxury only) */}
      {isDesktop && (
        <>
          {/* Instant follow dot */}
          <div 
            className="fixed w-1.5 h-1.5 bg-gold-bright rounded-full pointer-events-none z-[9999] mix-blend-difference"
            style={{ 
              left: `${cursorPos.x}px`, 
              top: `${cursorPos.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          />
          {/* Lerped ring lagging behind */}
          <div 
            className={`fixed rounded-full border pointer-events-none z-[9998] flex items-center justify-center transition-all duration-[120ms] ease-out mix-blend-difference ${
              isCursorClicked 
                ? 'w-4.5 h-4.5 border-gold-glow bg-gold-primary/15'
                : cursorHoverType === 'view'
                  ? 'w-[52px] h-[52px] border-gold-primary bg-gold-primary/8'
                  : cursorHoverType === 'open'
                    ? 'w-16 h-16 border-copper bg-copper/8'
                    : 'w-9 h-9 border-gold-dim bg-transparent'
            }`}
            style={{ 
              left: `${cursorPos.x}px`, 
              top: `${cursorPos.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {cursorHoverType && (
              <span className={`font-bebas text-[8px] tracking-[0.1em] text-gold-bright ${
                cursorHoverType === 'open' ? 'text-copper font-medium' : ''
              }`}>
                {cursorHoverType === 'open' ? 'OPEN' : 'VIEW'}
              </span>
            )}
          </div>
        </>
      )}

      {/* Navigation Bar */}
      <nav 
        className={`fixed left-0 right-0 h-[68px] z-[100] transition-all duration-350 ${
          navbarBg 
            ? 'bg-void/90 backdrop-blur-2xl border-b border-gold-primary/10 saturate-150' 
            : 'bg-transparent border-b border-transparent'
        } ${
          navbarVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* LEFT: LZ Monogram */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group text-left interactive-trigger"
          >
            <div className="w-[38px] h-[38px] rounded-full border border-gold-dim/40 flex items-center justify-center font-serif italic text-lg text-gold-primary transition-all duration-300 group-hover:border-gold-primary group-hover:shadow-[0_0_15px_rgba(201,169,110,0.3)]">
              LZ
            </div>
            <div className="hidden sm:block">
              <div className="font-bebas text-[10px] tracking-[0.2em] text-gold-dim">ARCHITECTURAL</div>
              <div className="font-serif text-[13px] text-lux-white font-light">Leoule Zenebe</div>
            </div>
          </button>

          {/* CENTER: Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { id: 'about', label: 'About', labelAm: 'የኔ ታሪክ' },
              { id: 'experience', label: 'Experience', labelAm: 'የስራ ልምድ' },
              { id: 'education', label: 'Education', labelAm: 'ትምህርት' },
              { id: 'languages', label: 'Languages', labelAm: 'ቋንቋዎች' },
              { id: 'contact', label: 'Contact', labelAm: 'አግኙኝ' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="font-bebas text-[11px] text-lux-gray hover:text-gold-bright tracking-[0.25em] transition-colors relative py-1 group"
              >
                {activeLanguage === 'en' ? link.label : link.labelAm}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-350" />
              </button>
            ))}
          </div>

          {/* RIGHT: Bilingual pill toggle */}
          <div className="flex items-center gap-4">
            <div className="bg-void border border-gold-dim/20 rounded-full p-[2.5px] flex items-center gap-1 select-none">
              <button 
                onClick={() => setActiveLanguage('en')}
                className={`px-3 py-1 text-[10px] font-bebas tracking-[0.1em] rounded-full transition-all duration-300 ${
                  activeLanguage === 'en' 
                    ? 'bg-gold-primary text-void font-bold shadow-md shadow-gold-dim/30' 
                    : 'text-gold-dim hover:text-gold-bright'
                }`}
              >
                EN
              </button>
              <button 
                onClick={() => setActiveLanguage('am')}
                className={`px-3 py-1 text-[10px] font-ethiopic rounded-full transition-all duration-300 ${
                  activeLanguage === 'am' 
                    ? 'bg-gold-primary text-void font-bold shadow-md shadow-gold-dim/30' 
                    : 'text-gold-dim hover:text-gold-bright'
                }`}
              >
                አማ
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section 
        ref={heroSectionRef}
        className="relative min-h-screen flex flex-col md:flex-row overflow-hidden justify-between items-stretch bg-void"
        style={{
          background: 'radial-gradient(ellipse 120% 80% at 65% 50%, #0c0a05 0%, #070705 45%, #030303 100%)'
        }}
      >
        
        {/* Dark radial glow vignette behind layout */}
        <div 
          className="absolute inset-0 pointer-events-none select-none"
          style={{ 
            zIndex: 2,
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(3,3,3,0.3) 75%, rgba(3,3,3,0.9) 100%)'
          }}
        />

        {/* Bottom fade — merges hero smoothly into About section */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none select-none"
          style={{ 
            zIndex: 8,
            background: 'linear-gradient(to bottom, transparent 60%, rgba(3,3,3,1) 100%)'
          }}
        />

        {/* Hero Left: Minimalist Image Area */}
        <div 
          className="w-full md:w-[54%] relative overflow-hidden flex items-center justify-center min-h-[50vh] md:min-h-screen"
          style={{ zIndex: 3 }}
        >
          
          {/* Centered portrait container - increased size */}
          <div 
            className="relative w-[360px] h-[360px] md:w-[420px] md:h-[420px] rounded-full overflow-hidden border-2 border-gold-primary/30 shadow-2xl"
            style={{ zIndex: 1 }}
          >
            {/* Professional portrait photo */}
            <img 
              src={leoulePortrait} 
              alt="Leoule Zenebe" 
              className="w-full h-full object-cover object-center select-none"
              referrerPolicy="no-referrer"
            />
            
            {/* Subtle gold rim glow */}
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-gold-bright/20 pointer-events-none" />
          </div>

          {/* Layer 5: Gold vertical margin line / dividing line */}
          <div 
            className="absolute top-0 bottom-0 right-0 w-[1.5px] bg-gradient-to-b from-transparent via-gold-dim/40 to-transparent pointer-events-none hidden md:block" 
            style={{ zIndex: 6 }}
          />
        </div>

        {/* Hero Right: Content Info combined with local architectural background layers */}
        <div 
          ref={heroRightRef}
          className="w-full md:w-[46%] px-6 md:px-14 flex flex-col justify-center py-20 relative bg-transparent overflow-hidden"
          style={{ zIndex: 5 }}
        >
          {/* Right Blueprint Layer A: Localized blueprint grid background */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              backgroundImage: 'linear-gradient(rgba(201,169,110,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.035) 1px, transparent 1px), linear-gradient(rgba(201,169,110,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.015) 1px, transparent 1px)',
              backgroundSize: '80px 80px, 80px 80px, 20px 20px, 20px 20px',
              transform: !isDesktop ? 'none' : `translate3d(0, ${scrollYOffset * -0.06}px, 0)`,
              willChange: 'transform'
            }}
          />

          {/* Right Blueprint Layer B: Dynamic Drawing Canvas */}
          {isDesktop && (
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 2 }}
            />
          )}

          {/* Right Blueprint Layer C: Floating Technical Symbols */}
          {isDesktop && (
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" style={{ zIndex: 3 }}>
              {[
                { type: 'symbol-column-cross', top: '15%', left: '8%', duration: '9s', delay: '1s' },
                { type: 'symbol-level-indicator', top: '28%', left: '74%', duration: '12s', delay: '3s', children: <><div className="symbol-level-indicator-circle"/><div className="symbol-level-indicator-tick-l"/><div className="symbol-level-indicator-tick-r"/></> },
                { type: 'symbol-rebar', top: '52%', left: '16%', duration: '11s', delay: '0s', children: <div className="symbol-rebar-circle" /> },
                { type: 'symbol-north', top: '72%', left: '68%', duration: '14s', delay: '4s', children: <><div className="symbol-north-triangle"/><div className="symbol-north-line"/></> },
                { type: 'symbol-bracket', top: '42%', left: '6%', duration: '10s', delay: '2s', children: <><div className="symbol-bracket-serif-top"/><div className="symbol-bracket-serif-bottom"/></> },
                { type: 'symbol-welding', top: '64%', left: '44%', duration: '13s', delay: '5s' },
              ].map((sym, idx) => (
                <div 
                  key={idx}
                  className="absolute tech-symbol-container"
                  style={{
                    top: sym.top,
                    left: sym.left,
                    animation: isReducedMotion ? 'none' : `techFloat ${sym.duration} ease-in-out infinite`,
                    animationDelay: isReducedMotion ? '0s' : sym.delay,
                  }}
                >
                  <div className={sym.type}>
                    {sym.children}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* High contrast gradient vignette on Right Side to ensure perfect readability of text */}
          <div 
            className="absolute inset-y-0 left-0 right-0 pointer-events-none"
            style={{ 
              zIndex: 4,
              background: 'linear-gradient(to bottom, rgba(3,3,3,0.85) 0%, rgba(3,3,3,0.3) 30%, rgba(3,3,3,0.3) 70%, rgba(3,3,3,0.85) 100%)'
            }}
          />

          {/* Text Content Container - Centered and constrained for pristine layout and ultra-premium typography */}
          <div className="relative z-10 w-full flex flex-col justify-center h-full">
            
            {/* Eyebrow - Bilingual Row */}
            <div className="mb-6 overflow-hidden">
              <BilingualBlock 
                en={<p className="font-bebas text-[16px] md:text-[19.5px] tracking-[0.3em] text-gold-bright font-bold">CONSTRUCTION PROFESSIONAL · HAWASSA, ETHIOPIA</p>}
                am={<p className="font-bebas text-[15.5px] md:text-[19px] tracking-[0.2em] text-gold-bright text-right md:text-left font-ethiopic font-bold">የግንባታ ባለሙያ · ሀዋሳ፣ ኢትዮጵያ</p>}
              />
            </div>

            {/* Major Title: Clamp-scaled Cormorant (Bilingual name stacked in two dimensions) */}
            <div className="space-y-2 mb-8 border-b border-gold-dim/15 pb-8">
              <div className="grid grid-cols-2 gap-4 items-baseline border-b border-gold-primary/5 pb-2">
                <span className="font-serif text-[clamp(44px,7vw,88px)] font-light text-lux-white leading-none tracking-tight">LEOULE</span>
                <span className="font-ethiopic text-[clamp(34px,5.5vw,72px)] text-lux-white/90 text-right leading-none">ልኡል</span>
              </div>
              <div className="grid grid-cols-2 gap-4 items-baseline">
                <span className="font-serif text-[clamp(44px,7vw,88px)] font-light text-gold-bright leading-none tracking-tight">ZENEBE</span>
                <span className="font-ethiopic text-[clamp(34px,5.5vw,72px)] text-gold-bright text-right leading-none">ዘነበ</span>
              </div>
              
              {/* Bilingual Role subtitles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 pt-4 border-t border-faint">
                <div 
                  className="font-sans text-[18px] md:text-[21.5px] text-lux-white hover:text-gold-bright tracking-wider uppercase transition-colors font-semibold"
                  style={{ opacity: activeLanguage === 'en' ? 1 : 0.6 }}
                >
                  Senior Foreman & Site Supervisor
                </div>
                <div 
                  className="font-ethiopic text-[17.5px] md:text-[20.5px] text-lux-white hover:text-gold-bright tracking-wider text-right md:text-left transition-colors font-bold"
                  style={{ opacity: activeLanguage === 'am' ? 1 : 0.6 }}
                >
                  ከፍተኛ ፎርማን እና የጣቢያ ተቆጣጣሪ
                </div>
              </div>
            </div>

            {/* Quick Stat Pill Icons Row */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {[
                { val: '16+', labelEn: 'YEARS OF WORK', labelAm: 'የስራ ዓமታት' },
                { val: '13+', labelEn: 'EMPLOYERS', labelAm: 'ያገለገሉ አሰሪዎች' },
                { val: 'ETH', labelEn: 'COUNTRY', labelAm: 'ሀገር / ኢትዮጵያ' }
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className="border border-gold-dim/20 rounded-[2px] p-4 text-center bg-card/40 hover:border-gold-primary/40 hover:bg-card/90 transition-all duration-300"
                >
                  <div className="font-bebas text-[11px] md:text-[13px] tracking-[0.12em] text-gold-dim mb-1 font-bold">
                    {activeLanguage === 'en' ? stat.labelEn : stat.labelAm}
                  </div>
                  <div className="font-serif text-2xl font-semibold text-gold-bright">
                    {stat.val}
                  </div>
                </div>
              ))}
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToSection('contact')}
                className="bg-gold-primary text-void font-bebas text-xs tracking-[0.2em] font-bold px-8 py-4.5 rounded-[2px] hover:bg-gold-bright hover:-translate-y-[2px] transition-all duration-280 shadow-[0_12px_40px_rgba(201,169,110,0.15)] hover:shadow-[0_12px_45px_rgba(201,169,110,0.3)] flex items-center justify-center gap-2 group"
              >
                <span>{activeLanguage === 'en' ? 'CONTACT' : 'አግኙኝ'}</span>
                <Sparkles className="w-4 h-4 text-void group-hover:scale-120 transition-transform" />
              </button>
              <button 
                onClick={() => scrollToSection('experience')}
                className="bg-transparent border border-gold-dim/40 text-gold-primary font-bebas text-xs tracking-[0.2em] px-8 py-4.5 rounded-[2px] hover:border-gold-primary hover:bg-gold-primary/5 hover:-translate-y-[2px] transition-all duration-280 flex items-center justify-center"
              >
                {activeLanguage === 'en' ? 'EXPERIENCE TIMELINE' : 'ስራዎችና ምስክር ወረቀቶች'}
              </button>
            </div>
          </div>
        </div>

        {/* absolute bottom center scrolling indicator lines */}
        <button 
          onClick={() => scrollToSection('about')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[20] opacity-70 hover:opacity-100 transition-opacity hidden md:flex"
        >
          <span className="font-bebas text-[8px] tracking-[0.3em] text-gold-dim text-center">scroll</span>
          <div className="w-[1.5px] h-10 bg-gold-dim/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gold-primary animate-float-indicator" />
          </div>
        </button>

      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="relative py-28 md:py-40 bg-surface blueprint-overlay">
        
        {/* Subtle grid accent */}
        <div className="absolute inset-0 blueprint-grid opacity-[0.018] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column Description */}
            <div className="lg:col-span-7 relative">
              
              {/* Background decorative giant single quote */}
              <div className="absolute -top-16 -left-10 font-serif text-[180px] text-gold-primary/5 leading-none select-none pointer-events-none">
                “
              </div>
              
              {/* Section Tag */}
              <div className="mb-4">
                <BilingualBlock 
                  en={<span className="font-bebas text-[10px] text-gold-primary tracking-[0.35em] block">LZ PROFILES //</span>}
                  am={<span className="font-bebas text-[10px] text-gold-primary tracking-[0.25em] block text-right md:text-left font-ethiopic">የህይወት ታሪክ //</span>}
                />
              </div>

              {/* Major Section titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gold-dim/15 pb-8 mb-10 items-baseline">
                <h2 className="font-serif text-[clamp(38px,4vw,60px)] font-light tracking-tight text-lux-white">
                  About Leoule
                </h2>
                <h2 className="font-ethiopic text-[clamp(30px,3vw,48px)] font-light text-gold-bright text-right md:text-left">
                  ስለ እኔ አጭር መግለጫ
                </h2>
              </div>

              {/* Central Bio Block in full side-by-side bilinguality */}
              <div className="mb-14">
                <BilingualBlock 
                  en={
                    <p className="text-lux-white/85 font-light text-[16.5px] md:text-[18px] leading-[1.95] space-y-4">
                      A dedicated building construction professional with over 16 years of proven foreman and general foreman experience across Ethiopia's leading construction companies. 
                      <span className="block mt-4">
                        Diploma holder in Building Construction from Hulegeb Technical Skill Training Center, accredited by Addis Ababa Administration Education Bureau. Known for exceptional site leadership, structural quality, and reliable project delivery across residential and commercial buildings throughout Ethiopia.
                      </span>
                    </p>
                  }
                  am={
                    <p className="text-lux-white/75 font-ethiopic text-[15.5px] md:text-[17px] leading-[2.15] space-y-4">
                      በኢትዮጵያ ውስጥ ካሉ ግንባታ ኩባንያዎች ጋር ከ16 ዓመት በላይ የፎርማን እና ጀኔራል ፎርማን ልምድ ያለው ታታሪ የህንፃ ስራ ባለሙያ። 
                      <span className="block mt-4">
                        ከሁለጌብ ቴክኒካል ሙያ ማሰልጠኛ ማዕከል የህንፃ ስራ ዲፕሎማ ያለው፣ በአዲስ አበባ ትምህርት ቢሮ የተረጋገጠ። በጣቢያ አመራር፣ የግንባታ ጥራት እና ፕሮጀክት አስተዳደር ለቁርጠኝነቱና ለታማኝነቱ ይታወቃል።
                      </span>
                    </p>
                  }
                />
              </div>

              {/* Personal details info sub-grid - Redesigned with Modern Visual Hierarchy */}
              <div className="relative border-2 border-gold-primary/30 bg-gradient-to-br from-card/40 via-card/30 to-void/40 backdrop-blur-sm p-8 md:p-10 rounded-lg shadow-2xl overflow-hidden group hover:border-gold-primary/50 transition-all duration-500">
                
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-gold-primary/40" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-gold-primary/40" />
                
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold-primary/5 via-transparent to-gold-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Header with icon */}
                <div className="relative flex items-center gap-3 mb-8 pb-4 border-b-2 border-gold-primary/20">
                  <div className="w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center border border-gold-primary/30">
                    <MapPin className="w-5 h-5 text-gold-bright" />
                  </div>
                  <h4 className="font-bebas text-[14px] md:text-[16px] tracking-[0.3em] text-gold-bright">
                    METRICS AND LOCATION
                  </h4>
                </div>

                <div className="relative space-y-6">
                  {[
                    { 
                      labelEn: 'ORIGIN', 
                      valueEn: 'Yirgalem, Ethiopia', 
                      labelAm: 'መነሻ ከተማ', 
                      valueAm: 'ይርጋለም፣ ኢትዮጵያ',
                      icon: MapPin
                    },
                    { 
                      labelEn: 'LOCATION', 
                      valueEn: 'Hawassa, Ethiopia', 
                      labelAm: 'አድራሻ', 
                      valueAm: 'ሀዋሳ፣ ኢትዮጵያ',
                      icon: MapPin
                    },
                    { 
                      labelEn: 'BORN', 
                      valueEn: 'January 16, 1968 G.C.', 
                      labelAm: 'የተወለዱበት የልደት ቀን', 
                      valueAm: 'ጥር 16, 1960',
                      icon: User
                    },
                    { 
                      labelEn: 'CONTACT PHONE', 
                      valueEn: '+251 911 984 283', 
                      labelAm: 'የስልክ ቁጥር', 
                      valueAm: '+251 911 984 283', 
                      href: 'tel:+251911984283',
                      icon: Phone
                    },
                    { 
                      labelEn: 'EMAIL ADDRESS', 
                      valueEn: 'Leoulzenebe2@gmail.com', 
                      labelAm: 'ኢሜይል አድራሻ', 
                      valueAm: 'Leoulzenebe2@gmail.com', 
                      href: 'mailto:Leoulzenebe2@gmail.com',
                      icon: Mail
                    }
                  ].map((field, index) => {
                    const Icon = field.icon;
                    return (
                      <div 
                        key={index} 
                        className="group/item relative bg-void/30 border border-gold-dim/20 rounded-md p-5 hover:bg-void/50 hover:border-gold-primary/40 transition-all duration-300"
                      >
                        {/* Icon badge */}
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold-primary/20 border-2 border-gold-primary/40 flex items-center justify-center backdrop-blur-sm">
                          <Icon className="w-4 h-4 text-gold-bright" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                          {/* English Column */}
                          <div className="space-y-1.5">
                            <span className="font-bebas text-[10px] tracking-[0.2em] text-gold-dim/80 block">
                              {field.labelEn}
                            </span>
                            {field.href ? (
                              <a 
                                href={field.href} 
                                className="font-sans text-[15px] md:text-[16px] text-white hover:text-gold-bright transition-colors block underline decoration-gold-dim/30 hover:decoration-gold-bright"
                              >
                                {field.valueEn}
                              </a>
                            ) : (
                              <span className="font-sans text-[15px] md:text-[16px] text-white/95 block font-medium">
                                {field.valueEn}
                              </span>
                            )}
                          </div>

                          {/* Amharic Column */}
                          <div className="space-y-1.5 md:border-l md:border-gold-dim/10 md:pl-5">
                            <span className="font-bebas text-[10px] tracking-[0.2em] text-gold-dim/80 block font-ethiopic">
                              {field.labelAm}
                            </span>
                            <span className="font-ethiopic text-[14px] md:text-[15px] text-white/85 block">
                              {field.valueAm}
                            </span>
                          </div>
                        </div>

                        {/* Bottom accent line */}
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-gold-primary to-gold-bright group-hover/item:w-full transition-all duration-500" />
                      </div>
                    );
                  })}
                </div>

                {/* Bottom decorative element */}
                <div className="mt-8 pt-6 border-t border-gold-dim/20 flex items-center justify-center gap-2">
                  <div className="h-[1px] w-12 bg-gold-primary/30" />
                  <Sparkles className="w-4 h-4 text-gold-primary/50" />
                  <div className="h-[1px] w-12 bg-gold-primary/30" />
                </div>
              </div>

            </div>

            {/* Right Column: Three Stat Counter metrics displays */}
            <div className="lg:col-span-5 space-y-6">
              {[
                { count: 16, suffix: ' Years', titleEn: 'Proven Site Experience', titleAm: 'የተረጋገጠ የጣቢያ ልምድ' },
                { count: 13, suffix: '+', titleEn: 'Employers in Registry', titleAm: 'የስራ ታሪክ ኩባንያዎች' },
                { count: 14, suffix: ' Certificates', titleEn: 'Verified Scanned Credentials', titleAm: 'ኦሪጅናል ምስክር ወረቀቶች' }
              ].map((card, i) => (
                <div 
                  key={i}
                  className="bg-card border border-faint/80 border-l-2 border-l-gold-primary p-8 hover:bg-card-hover hover:border-l-gold-glow hover:-translate-y-1 transition-all duration-300 group shadow-lg"
                >
                  <div className="flex items-baseline gap-1 font-serif text-5xl md:text-6xl text-gold-primary font-light mb-3 group-hover:text-gold-bright transition-colors">
                    <span>{card.count}</span>
                    <span className="text-xl font-sans text-gold-dim">{card.suffix}</span>
                  </div>
                  <div className="h-[1px] w-12 bg-gold-dim/30 my-3 group-hover:w-20 transition-all duration-300" />
                  <div className="grid grid-cols-2 gap-3 items-start">
                    <p className="font-bebas text-[10px] tracking-[0.15em] text-lux-gray">{card.titleEn}</p>
                    <p className="font-ethiopic text-xs text-lux-gray text-right">{card.titleAm}</p>
                  </div>
                </div>
              ))}

              {/* Call out on verification */}
              <div className="bg-gold-primary/5 border border-gold-dim/10 p-6 rounded-[2px] text-center">
                <ShieldCheck className="w-8 h-8 text-gold-primary mx-auto mb-3" />
                <p className="font-bebas text-[11px] tracking-[0.15em] text-gold-bright mb-1">STRICTLY AUTHENTICATED</p>
                <p className="font-serif text-xs italic text-lux-gray">Every position is fully supported by stamp-signed original certifications certified by official ministries.</p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* EXPERIENCE TIMELINE SECTION */}
      <section id="experience" className="bg-deep py-28 md:py-40 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center mb-24 md:mb-32">
            <span className="font-bebas text-[10px] text-gold-primary tracking-[0.35em] mb-3 block">// CHRONICLE</span>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-3xl mx-auto border-b border-gold-dim/15 pb-6 mb-4">
              <h2 className="font-serif text-4xl md:text-6xl font-light text-lux-white">
                Professional Experience
              </h2>
              <span className="hidden md:inline text-gold-dim text-2xl font-serif">·</span>
              <h2 className="font-ethiopic text-3xl md:text-4xl text-gold-bright">
                ሙያዊ የስራ ልምድ ታሪክ
              </h2>
            </div>
            <p className="font-serif text-xs italic text-lux-gray tracking-wider">
              16 Years · 14 Registered Sites & Certified Employers · Ethiopia
            </p>
          </div>

          {/* Timeline container layout */}
          <div ref={timelineRef} className="relative max-w-5xl mx-auto">
            
            {/* Thread Progress Line (Central) */}
            <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold-dim/20 to-transparent pointer-events-none transform -translate-x-1/2" />
            
            {/* Golden running scale progress line */}
            <div 
              className="absolute left-[19px] md:left-1/2 top-0 w-[1.5px] bg-gradient-to-b from-gold-primary via-gold-bright to-gold-primary origin-top pointer-events-none transform -translate-x-1/2 transition-all duration-[100ms] ease-out shadow-[0_0_8px_rgba(201,169,110,0.5)]"
              style={{ height: timelineHeight }}
            />

            {/* List of 14 experiences */}
            <div className="space-y-16 md:space-y-24">
              {experiences.map((exp, idx) => {
                const isLeft = idx % 2 === 0;
                
                return (
                  <div 
                    key={exp.id}
                    className={`flex flex-col md:flex-row relative items-start ${
                      isLeft ? 'md:justify-start' : 'md:justify-end'
                    }`}
                  >
                    {/* Timeline Node Symbol */}
                    <div className="absolute left-[19px] md:left-1/2 w-3.5 h-3.5 rotate-45 border-2 border-void bg-gold-primary transform -translate-x-1/2 z-10 transition-transform duration-300 hover:scale-120 cursor-pointer shadow-[0_0_10px_rgba(201,169,110,0.7)]" />

                    {/* Horizontal Connector bar */}
                    <div className={`hidden md:block absolute top-1/2 w-[3%] h-[1px] bg-gold-dim/20 pointer-events-none ${
                      isLeft ? 'left-[47%]' : 'right-[47%]'
                    }`} />

                    {/* Card container box */}
                    <div className="w-full md:w-[46%] pl-10 md:pl-0">
                      
                      <div 
                        onClick={() => setActiveModalExp(exp)}
                        className="experience-card cursor-pointer bg-card border border-faint/80 border-t-2 border-t-gold-primary p-6 md:p-8 hover:-translate-y-1.5 transition-all duration-300 hover:bg-card-hover hover:border-gold-bright active:scale-[0.99] shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),var(--glow-gold)]"
                      >
                        {/* Row 1: Company + badge */}
                        <div className="flex md:items-center justify-between gap-4 mb-3 border-b border-faint/50 pb-3">
                          <h3 className="font-serif text-xl text-gold-bright font-medium leading-tight select-all">
                            {activeLanguage === 'en' ? exp.company.en : exp.company.am}
                          </h3>
                          <span className="font-bebas text-[8px] bg-gold-primary text-void font-bold px-1.5 py-0.5 rounded-[1px] flex items-center gap-0.5 shrink-0 self-start mt-1 md:mt-0 select-none">
                            <Check className="w-2.5 h-2.5" /> VERIFIED
                          </span>
                        </div>

                        {/* Row 2: Role title + Dates */}
                        <div className="flex justify-between items-baseline gap-4 mb-4">
                          <p className="font-sans text-[13px] text-lux-white/90 uppercase tracking-wider font-medium">
                            {activeLanguage === 'en' ? exp.role.en : exp.role.am}
                          </p>
                          <span className="font-bebas text-[10px] text-gold-dim tracking-wider whitespace-nowrap">
                            {exp.period}
                          </span>
                        </div>

                        {/* Row 3: Description paragraphs */}
                        <div className="text-[14px] md:text-[15px] leading-[1.85] text-lux-gray/95 mb-5 relative pl-4 border-l border-gold-dim/15">
                          <p className={activeLanguage === 'am' ? 'font-ethiopic text-[13px] md:text-[14px]' : ''}>
                            {activeLanguage === 'en' ? exp.description.en : exp.description.am}
                          </p>
                        </div>

                        {/* Row 4: Registration citations & call trigger */}
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-faint/40 items-center">
                          <span className="font-bebas text-[8.5px] text-gold-dim tracking-wider uppercase whitespace-nowrap block truncate">
                            {exp.ref}
                          </span>
                          <span className="font-bebas text-[8.5px] text-gold-primary tracking-widest text-right block uppercase font-bold group-hover:text-gold-glow">
                            VERIFY EVIDENCE →
                          </span>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* EXPERT EVIDENCE DOCUMENT MODAL SYSTEM */}
      {activeModalExp && (
        <div 
          onClick={() => setActiveModalExp(null)}
          className="fixed inset-0 bg-void/95 z-[500] backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          {/* Modal Container */}
          <div 
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-card w-full max-w-4xl border border-gold-dim/40 border-t-4 border-t-gold-primary shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_50px_rgba(201,169,110,0.15)] my-8 text-left transition-all duration-300 relative rounded-none flex flex-col max-h-[90vh]"
          >
            {/* Modal Exit corner button */}
            <button 
              onClick={() => setActiveModalExp(null)}
              className="absolute top-5 right-5 text-gold-dim hover:text-gold-bright p-2 transition-colors interactive-trigger z-50 rounded-full hover:bg-white/5"
              aria-label="Close credentials view"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-faint shrink-0 pr-16 bg-surface">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bebas text-[9px] bg-gold-primary text-void font-bold px-2 py-0.5 rounded-[1.5px] tracking-wider select-none">PORTFOLIO CITATION</span>
                <span className="font-bebas text-[10px] text-lux-gray">{activeModalExp.ref}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline">
                <h3 className="font-serif text-2xl md:text-3xl text-gold-primary font-medium tracking-tight">
                  {activeModalExp.company.en}
                </h3>
                <h3 className="font-ethiopic text-xl md:text-2xl text-gold-bright text-right md:text-left leading-tight">
                  {activeModalExp.company.am}
                </h3>
              </div>

              <div className="flex gap-4 items-center mt-3 text-xs text-lux-gray/90 font-mono">
                <p className="border-r border-faint pr-4 uppercase">{activeModalExp.role.en} / {activeModalExp.role.am}</p>
                <p className="text-gold-dim uppercase">{activeModalExp.period} | Location: {activeModalExp.location}</p>
              </div>
            </div>

            {/* Modal Scroll Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1 bg-void/50">
              
              {/* TOP PROFILE EXTRACTIONS */}
              <div className="border border-faint/80 bg-[#151512] p-5 md:p-6 rounded-[1px] relative overflow-hidden">
                <div className="absolute top-0 right-0 py-1.5 px-3 bg-gold-primary/10 text-gold-primary text-[8px] font-bebas tracking-widest border-l border-b border-gold-dim/10 uppercase select-none flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-gold-primary" /> Verified Original File Duplicate
                </div>
                
                <h5 className="font-bebas text-[11px] tracking-[0.2em] text-gold-primary mb-4 block">AUTHENTICATED DIGIT METRICS //</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-faint/40">
                  <div className="space-y-3">
                    <div>
                      <p className="font-bebas text-[8px] text-gold-dim tracking-wider">Official Certificate ID / Ref Code</p>
                      <p className="font-mono text-xs text-lux-white">{activeModalExp.ref}</p>
                    </div>
                    <div>
                      <p className="font-bebas text-[8px] text-gold-dim tracking-wider">Registered Term / Period</p>
                      <p className="font-sans text-xs text-lux-white/90">{activeModalExp.period}</p>
                    </div>
                  </div>
                  <div className="space-y-3 sm:pl-6">
                    <div>
                      <p className="font-bebas text-[8px] text-gold-dim tracking-wider">Employer Branch location</p>
                      <p className="font-sans text-xs text-[#dcd6cd]">{activeModalExp.location}</p>
                    </div>
                    <div>
                      <p className="font-bebas text-[8px] text-gold-dim tracking-wider">Position Assignment and Duties</p>
                      <p className="font-sans text-xs text-[#dcd6cd]">{activeModalExp.role.en} / {activeModalExp.role.am}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CORE PREVIEW DISPLAY CONTAINER */}
              <div>
                <p className="font-bebas text-[10px] text-gold-dim tracking-[0.3em] uppercase mb-4 block">// PORTFOLIO IMAGE SCAN</p>
                
                <div className="border border-gold-dim/20 bg-card/60 rounded-[1px] min-h-[320px] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                  
                  {isPdfLoading ? (
                    <div className="text-center p-12">
                      <div className="w-10 h-10 border-2 border-gold-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="font-bebas text-xs tracking-wider text-gold-primary">Extracting PDF file scan slices dynamically...</p>
                    </div>
                  ) : pdfFileUploaded ? (
                    <div className="w-full space-y-6">
                      {/* Active File Management - Locked & Saved Indicator with no action buttons */}
                      <div className="bg-void/90 border border-gold-dim/30 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-[1px] max-w-xl mx-auto backdrop-blur-md">
                        <div className="text-left flex items-center gap-3 w-full">
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shrink-0" />
                          <div>
                            <p className="font-bebas text-[10px] text-gold-bright tracking-widest leading-none mb-1">PORTFOLIO IS RENDERED & LOCKED</p>
                            <p className="font-sans text-[11px] text-lux-white/80 leading-tight">Your uploaded evidence document is fully processed, locked, and securely saved.</p>
                          </div>
                        </div>
                      </div>

                      {(() => {
                        const requestedPagesExist = activeModalExp.docPages.every(p => renderedPages[p]);
                        const pagesToRender = requestedPagesExist 
                          ? activeModalExp.docPages 
                          : Object.keys(renderedPages).map(Number).sort((a, b) => a - b);

                        if (pagesToRender.length === 0) {
                          return (
                            <div className="py-16 text-center bg-void text-gold-dim text-xs font-mono border border-dashed border-faint w-full max-w-xl mx-auto">
                              No pages found in the uploaded PDF.
                            </div>
                          );
                        }

                        return pagesToRender.map((pageIdx) => (
                          <div key={pageIdx} className="relative group max-w-xl mx-auto border border-gold-dim/30 shadow-2xl bg-white p-2">
                            {renderedPages[pageIdx] ? (
                              <img 
                                src={renderedPages[pageIdx]} 
                                alt={`Leoule Zenebe Certified Page Scan ${pageIdx}`} 
                                className="w-full h-auto filter contrast-[1.03] brightness-[1.01]"
                              />
                            ) : (
                              <div className="py-16 text-center bg-void text-gold-dim text-xs font-mono border border-dashed border-faint">
                                Page {pageIdx} exceeds document limits.
                              </div>
                            )}
                            <div className="absolute bottom-4 right-4 bg-void/80 backdrop-blur-md py-1 px-3 border border-gold-dim/20 text-gold-primary text-[8px] font-bebas select-none">
                              PAGE {pageIdx} OF PORTFOLIO
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  ) : (
                    /* Elegant fallback layout showing vector mock layout with uploader */
                    <div className="w-full text-center py-8">
                      
                      {/* Document mockup visual representation */}
                      <div className="max-w-md mx-auto bg-[#faf8f4] border-[3px] border-[#cbba9e] p-8 text-left text-void shadow-2xl transform rotate-1 mb-8 hover:rotate-0 transition-transform duration-300 relative">
                        {/* Stamp detail representation */}
                        <div className="absolute bottom-6 right-6 w-20 h-20 border-4 border border-dashed border-red-700/40 rounded-full flex items-center justify-center rotate-12 pointer-events-none select-none">
                          <span className="font-bebas text-[9px] text-center text-red-700/40 leading-none">ኢትዮጵያ <br/> VERIFIED</span>
                        </div>

                        <div className="border border-void/10 p-4 min-h-[220px] flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="font-bebas text-[11px] font-bold tracking-widest text-[#0c0c0a] leading-none mb-1">CERTIFICATE OF EMPLOYMENT</h4>
                                <p className="text-[7.5px] text-[#555] uppercase">Verified construction registry record</p>
                              </div>
                              <span className="font-mono text-[7px] text-gray-500">{activeModalExp.ref}</span>
                            </div>
                            
                            <div className="space-y-2 mt-4">
                              <p className="text-[10px] leading-relaxed italic text-gray-700">
                                "This is to officially certify that <strong className="text-black font-semibold">Leoule Zenebe</strong> was employed under our company as a professional <strong className="text-black">{activeModalExp.role.en}</strong> during the tenure {activeModalExp.period} in location {activeModalExp.location}. His professional reliability on building sites and general foreman operations has been found excellent."
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-end border-t border-void/10 pt-4 mt-6">
                            <div>
                              <p className="text-[7px] text-gray-400">ISSUED TO</p>
                              <p className="font-serif text-[11px] font-bold text-black mt-0.5">Leoule Zenebe</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[7px] text-[#b87333]">OFFICIAL SEAL STATUS</p>
                              <p className="font-bebas text-[8px] text-green-700 font-bold tracking-wider mt-0.5">✓ STAMPED & LICENSED</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* File dropping Zone block */}
                      <div 
                        onDragOver={handleDragOver}
                        onDrop={handleFileDrop}
                        className="max-w-md mx-auto border border-dashed border-gold-dim/40 bg-void/80 p-8 rounded-[2px] cursor-pointer hover:border-gold-primary hover:bg-gold-primary/5 transition-all group relative"
                      >
                        <input 
                          type="file" 
                          id="pdf-port-file" 
                          accept="application/pdf" 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleFileChange}
                        />
                        <Upload className="w-8 h-8 text-gold-dim group-hover:text-gold-primary group-hover:scale-110 transition-all mx-auto mb-3" />
                        <h4 className="font-bebas text-[11px] tracking-[0.15em] text-gold-bright mb-1">DRAG & DROP PORTFOLIO PDF SCAN</h4>
                        <p className="text-[11px] text-lux-gray/90 leading-normal max-w-xs mx-auto">
                          Drop the full scanned certificate PDF here to instantly render original 100% accurate document screenshots inside PDF.js!
                        </p>
                        {pdfError && (
                          <div className="mt-3 p-2 bg-red-950/40 border border-red-500/20 text-red-400 text-[10px] uppercase font-mono">
                            {pdfError}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="p-6 bg-surface border-t border-faint text-center flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
              <span className="font-bebas text-[9px] text-[#8a8070] tracking-[0.2em] uppercase select-none">
                🔏 OFFICIAL STAMPS VISIBLE ON THE ORIGINAL PHYSICAL SCROLLS
              </span>
              <button 
                onClick={() => setActiveModalExp(null)}
                className="bg-gold-primary text-void hover:bg-gold-bright transition-colors font-bebas text-[10px] tracking-[0.2em] px-6 py-2.5 rounded-[1px] font-semibold flex items-center gap-1.5 interactive-trigger"
              >
                <span>RETURN TO LIST</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EDUCATION SECTION */}
      <section id="education" className="bg-surface py-28 md:py-40 relative border-t border-faint/30">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-20">
            <span className="font-bebas text-[10px] text-gold-primary tracking-[0.35em] mb-3 block">// ACADEMICS</span>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-3xl mx-auto border-b border-gold-dim/15 pb-6 mb-4">
              <h2 className="font-serif text-4xl md:text-5xl font-light text-lux-white">
                Education & Credentials
              </h2>
              <span className="hidden md:inline text-gold-dim text-2xl font-serif">·</span>
              <h2 className="font-ethiopic text-3xl md:text-3xl text-gold-bright">
                የትምህርት ማስረጃዎች
              </h2>
            </div>
            <p className="font-serif text-xs italic text-lux-gray tracking-wider">
              Legitimate structural training programs and building construction certifications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {education.map((edu) => (
              <div 
                key={edu.id}
                className={`bg-card border border-faint/80 p-8 hover:-translate-y-2 transition-all duration-380 rounded-none relative flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-[0_40px_80px_rgba(0,0,0,0.6),var(--glow-gold)] ${
                  edu.id === 'edu-diploma' ? 'border-t-[3px] border-t-gold-primary' : 'border-t border-t-gold-dim/40'
                }`}
              >
                {/* Visual Icons and Badges */}
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-gold-primary/5 border border-gold-dim/20 rounded-[2px] text-gold-primary">
                      {edu.id === 'edu-diploma' && <Award className="w-8 h-8" />}
                      {edu.id === 'edu-higher' && <Briefcase className="w-8 h-8" />}
                      {edu.id === 'edu-secondary' && <BookOpen className="w-8 h-8" />}
                    </div>
                    {edu.badge && (
                      <span className="font-bebas text-[9px] bg-gold-primary text-void font-bold px-2 py-0.5 rounded-[1.5px] select-none">
                        {edu.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mb-4 select-all">
                    <h3 className="font-serif text-2xl text-lux-white hover:text-gold-bright leading-tight transition-colors">
                      {edu.title.en}
                    </h3>
                    <p className="font-ethiopic text-base text-gold-primary/95 leading-relaxed pt-1">
                      {edu.title.am}
                    </p>
                  </div>

                  <div className="space-y-1 hover:text-gold-bright transition-colors">
                    <p className="font-bebas text-xs md:text-[13px] tracking-[0.15em] text-lux-gray uppercase">
                      {edu.institution.en}
                    </p>
                    <p className="font-ethiopic text-sm text-lux-gray/80 leading-relaxed">
                      {edu.institution.am}
                    </p>
                  </div>
                </div>

                {/* Foot Details block */}
                <div className="border-t border-faint/50 pt-5 mt-4 space-y-2 select-text">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-gold-dim font-bebas text-[9px] tracking-wider uppercase">DUNDEE TERM //</span>
                    <span className="font-semibold text-lux-white">{activeLanguage === 'en' ? edu.period.en : edu.period.am}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-gold-dim font-bebas text-[9px] tracking-wider uppercase">REGISTRATION //</span>
                    <span className="text-lux-gray/90 text-[11px]">{activeLanguage === 'en' ? edu.subDetails.en : edu.subDetails.am}</span>
                  </div>

                  {edu.accreditation && (
                    <div className="pt-3 border-t border-dashed border-faint/45 text-center">
                      <p className="font-bebas text-[8px] text-gold-primary tracking-widest leading-none select-none uppercase mb-0.5">ACCREDITOR STATUS</p>
                      <p className="text-[10px] text-lux-gray/80 italic leading-snug">{activeLanguage === 'en' ? edu.accreditation.en : edu.accreditation.am}</p>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* LANGUAGES SECTION */}
      <section id="languages" className="bg-deep py-28 md:py-40 relative">
        <div ref={skillsSectionRef} className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-24">
            <span className="font-bebas text-[10px] text-gold-primary tracking-[0.35em] mb-3 block">// DIALECTS</span>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-3xl mx-auto border-b border-gold-dim/15 pb-6 mb-4">
              <h2 className="font-serif text-4xl md:text-5xl font-light text-lux-white">
                Languages & Fluency
              </h2>
              <span className="hidden md:inline text-gold-dim text-2xl font-serif">·</span>
              <h2 className="font-ethiopic text-3xl md:text-3xl text-gold-bright">
                የቋንቋ ችሎታ
              </h2>
            </div>
            <p className="font-serif text-xs italic text-lux-gray tracking-wider">
              Bilingual metrics representing site supervision commands and contractor relationships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-8 relative p-4 border border-faint/10 hover:border-gold-dim/15 transition-all duration-300 bg-card/10 hover:bg-card/30">
                
                {/* Language Title Header */}
                <div className="border-b border-gold-dim/15 pb-4 flex justify-between items-end">
                  <h3 className="font-serif text-2xl text-gold-bright font-light">
                    {activeLanguage === 'en' ? skill.name.en : skill.name.am}
                  </h3>
                  <span className="font-bebas text-[9px] text-gold-dim tracking-widest">FLUENT PROFILE</span>
                </div>

                {/* Three progress skills metric lines */}
                <div className="space-y-6">
                  {[
                    { labelEn: 'Writing/ማንበብ', labelAm: 'የጽሁፍ ችሎታ', val: skill.writing },
                    { labelEn: 'Speaking/መናገር', labelAm: 'የንግግር ችሎታ', val: skill.speaking },
                    { labelEn: 'Reading/መረዳት', labelAm: 'የንባብ ችሎታ', val: skill.reading }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2 select-none">
                      <div className="flex justify-between text-xs tracking-wider">
                        <span className="font-bebas text-[9px] text-[#8a8070] tracking-[0.2em] uppercase">
                          {activeLanguage === 'en' ? item.labelEn : item.labelAm}
                        </span>
                        <span className="font-bebas text-[11px] text-gold-dim">{item.val}%</span>
                      </div>
                      
                      {/* Scale Progress fill track */}
                      <div className="h-[2px] bg-faint w-full relative">
                        <div 
                          className="h-full bg-gradient-to-r from-gold-dim to-gold-primary transition-all relative will-change-[width]"
                          style={{ 
                            width: animateSkills ? `${item.val}%` : '0%',
                            transitionDuration: '1400ms',
                            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.32, 1)'
                           }}
                        >
                          {/* Glowing Dot Endpoint */}
                          {animateSkills && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold-glow animate-gold-pulse shadow-[0_0_12px_4px_rgba(245,212,133,0.5)]" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="bg-surface py-32 md:py-44 relative border-t border-faint/30">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-20">
            <span className="font-bebas text-[10px] text-gold-primary tracking-[0.35em] mb-3 block">// CONNECTION</span>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-3xl mx-auto border-b border-gold-dim/15 pb-6 mb-4">
              <h2 className="font-serif text-4xl md:text-5xl font-light text-lux-white">
                Get In Touch
              </h2>
              <span className="hidden md:inline text-gold-dim text-2xl font-serif">·</span>
              <h2 className="font-ethiopic text-3xl md:text-3xl text-gold-bright">
                እኔን ለማግኘት
              </h2>
            </div>
            <p className="font-serif text-xs italic text-lux-gray tracking-wider">
              Open to foreman, supervision and project construction management opportunities across Ethiopia
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Phone option */}
            <a 
              href="tel:+251911984283"
              className="bg-card border border-faint/80 p-10 text-center hover:-translate-y-1.5 hover:border-gold-primary hover:shadow-[0_15px_40px_rgba(201,169,110,0.1),var(--glow-gold)] transition-all duration-300 group rounded-none relative"
            >
              <div className="w-[52px] h-[52px] border border-gold-dim/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:border-gold-primary transition-all text-gold-primary bg-void">
                <Phone className="w-5 h-5" />
              </div>
              <p className="font-bebas text-[9px] text-gold-dim tracking-[0.2em] mb-1 select-none">PHONE // ስልክ</p>
              <p className="font-serif text-xl md:text-2xl font-medium text-lux-white hover:text-gold-bright transition-colors select-all whitespace-nowrap">
                +251 911 984 283
              </p>
              <p className="font-ethiopic text-xs text-lux-gray mt-1 font-light leading-none">ሀዋሳ / አዲስ አበባ</p>
            </a>

            {/* Email Option */}
            <a 
              href="mailto:Leoulzenebe2@gmail.com"
              className="bg-card border border-faint/80 p-10 text-center hover:-translate-y-1.5 hover:border-gold-primary hover:shadow-[0_15px_40px_rgba(201,169,110,0.1),var(--glow-gold)] transition-all duration-300 group rounded-none relative"
            >
              <div className="w-[52px] h-[52px] border border-gold-dim/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:border-gold-primary transition-all text-gold-primary bg-void">
                <Mail className="w-5 h-5" />
              </div>
              <p className="font-bebas text-[9px] text-gold-dim tracking-[0.2em] mb-1 select-none">EMAIL // ኢሜይል</p>
              <p className="font-serif text-lg md:text-xl font-normal text-lux-white hover:text-gold-bright transition-colors select-all break-all leading-normal pt-1 pb-1">
                Leoulzenebe2@gmail.com
              </p>
              <p className="font-ethiopic text-xs text-lux-gray mt-1 font-light leading-none">ቀጥታ መልዕክት መላኪያ</p>
            </a>

            {/* Location Option */}
            <a 
              href="https://maps.google.com/?q=Hawassa,Ethiopia"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-faint/80 p-10 text-center hover:-translate-y-1.5 hover:border-gold-primary hover:shadow-[0_15px_40px_rgba(201,169,110,0.1),var(--glow-gold)] transition-all duration-300 group rounded-none relative"
            >
              <div className="w-[52px] h-[52px] border border-gold-dim/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:border-gold-primary transition-all text-gold-primary bg-void">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="font-bebas text-[9px] text-gold-dim tracking-[0.2em] mb-1 select-none">LOCATION // አድራሻ</p>
              <p className="font-serif text-xl md:text-2xl font-medium text-lux-white hover:text-gold-bright transition-colors select-all">
                Hawassa, Ethiopia
              </p>
              <p className="font-ethiopic text-xs text-lux-gray mt-1 font-light leading-none">ሀዋሳ፣ ሲዳማ፣ ኢትዮጵያ</p>
            </a>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-void border-t border-gold-primary/10 pt-20 pb-12 relative overflow-hidden">
        
        {/* Repeating architectural grids overlay wrapper */}
        <div className="absolute inset-0 architectural-grid opacity-[0.05] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-faint">
            
            {/* Column 1: Monogram brand & description */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-[38px] h-[38px] rounded-full border border-gold-dim/50 flex items-center justify-center font-serif italic text-lg text-gold-primary select-none">
                  LZ
                </div>
                <h4 className="font-serif text-xl tracking-tight text-lux-white font-light">Leoule Zenebe</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13.5px] md:text-[14.5px] text-lux-gray">
                <p className="leading-relaxed">
                  Proven Building construction professional with 16+ years of general site foreman supervisory experience in high-profile residential & commercial contracts across Ethiopia.
                </p>
                <p className="leading-relaxed font-ethiopic">
                  በኢትዮጵያ ውስጥ በሚገኙ በርካታ የመኖሪያ እና የንግድ ህንፃ ግንባታዎች ላይ ከ16 ዓመታት በላይ ከፍ ያለ የጀነራል ፎርማንነት የጣቢያ ስራ አመራር ልምድ ያካበተ ብቁ ባለሙያ።
                </p>
              </div>
            </div>

            {/* Column 2: Minimalist Nav Links Grid hierarchy */}
            <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-center">
              <div className="flex gap-x-6 gap-y-3 flex-wrap max-w-xs justify-start lg:justify-center">
                {[
                  { id: 'about', label: 'About/ስለ እኔ' },
                  { id: 'experience', label: 'Experience/ልምድ' },
                  { id: 'education', label: 'Education/ትምህርት' },
                  { id: 'languages', label: 'Languages/ቋንቋዎች' },
                  { id: 'contact', label: 'Contact/አግኙኝ' }
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="font-bebas text-[13.5px] md:text-[15.5px] text-lux-gray hover:text-gold-primary tracking-widest transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Copyrigting contacts */}
            <div className="lg:col-span-3 lg:text-right flex flex-col justify-center">
              <p className="font-bebas text-[11.5px] md:text-[13px] text-[#9b9181] tracking-[0.15em] mb-2 font-bold">GENERAL INQUIRIES //</p>
              <a href="mailto:Leoulzenebe2@gmail.com" className="font-serif text-[17px] md:text-[19px] text-lux-white hover:text-gold-bright transition-colors">
                Leoulzenebe2@gmail.com
              </a>
              <p className="font-bebas text-[10.5px] md:text-[12px] text-gold-dim tracking-wider mt-3 select-none font-bold">
                DEVELOPED WITH EXTREME ARCHITECTURAL CARE
              </p>
            </div>

          </div>

          {/* Sub strip centered details */}
          <div className="pt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="font-bebas text-[11.5px] md:text-[13.5px] text-[#9b9181] tracking-[0.25em] uppercase text-center sm:text-left select-none font-bold">
              LEOULE ZENEBE · SENIOR CONSTRUCTION PROFESSIONAL & SITE SUPERVISOR
            </span>
            <span className="font-bebas text-[11.5px] md:text-[13.5px] text-gold-dim select-all font-bold">
              © {new Date().getFullYear()} ALL CREDENTIALS VERIFIED BY MINISTRY
            </span>
          </div>

        </div>
      </footer>

      {/* Floating scroll to top indicator trigger */}
      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-11 h-11 bg-card hover:bg-card-hover border border-gold-dim text-gold-primary rounded-[1px] flex items-center justify-center transition-all duration-300 z-[99] hover:-translate-y-1 active:scale-95 shadow-[0_10px_25px_rgba(0,0,0,0.5),var(--glow-gold)] shadow-gold-dim/20 pointer-events-auto rounded-full"
          aria-label="Scroll back to top of portfolio"
        >
          <ChevronUp className="w-5 h-5 text-gold-primary" />
        </button>
      )}

    </div>
  );
}
