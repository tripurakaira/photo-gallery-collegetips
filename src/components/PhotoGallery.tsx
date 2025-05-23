import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useAnimation } from 'framer-motion';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { FaFilter, FaTimes, FaSpinner, FaRedo, FaInstagram, FaGlobe, FaSearch, FaDownload, FaShare, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Define our image type
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  description: string;
  source: 'website' | 'instagram';
  sourceUrl?: string;
  retryCount?: number;
}

// CollegeTips images
const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: '/assets/images/collegetips-team.jpg',
    alt: 'CollegeTips Team',
    category: 'Team Vibes',
    description: 'Our dedicated team working together to help students succeed',
    source: 'website',
    sourceUrl: 'https://collegetips.in'
  },
  {
    id: 2,
    src: '/assets/images/collegetips-mentorship.jpg',
    alt: 'Mentorship Program',
    category: 'Team Vibes',
    description: 'One-on-one mentorship sessions with our experts',
    source: 'website',
    sourceUrl: 'https://collegetips.in'
  },
  {
    id: 3,
    src: '/assets/images/collegetips-workshop.jpg',
    alt: 'Student Workshop',
    category: 'Creative Campaigns',
    description: 'Interactive workshops for student success',
    source: 'website',
    sourceUrl: 'https://collegetips.in'
  },
  {
    id: 4,
    src: '/assets/images/collegetips-event.jpg',
    alt: 'CollegeTips Event',
    category: 'Work Hard, Play Hard',
    description: 'Celebrating student achievements at our annual event',
    source: 'website',
    sourceUrl: 'https://collegetips.in'
  },
  {
    id: 5,
    src: '/assets/images/collegetips-campaign.jpg',
    alt: 'Student Success Campaign',
    category: 'Creative Campaigns',
    description: 'Launching our latest student success campaign',
    source: 'website',
    sourceUrl: 'https://collegetips.in'
  },
  {
    id: 6,
    src: '/assets/images/collegetips-community.jpg',
    alt: 'CollegeTips Community',
    category: 'Behind-The-Scenes',
    description: 'Building a strong community of learners',
    source: 'website',
    sourceUrl: 'https://collegetips.in'
  },
  {
    id: 7,
    src: '/assets/images/collegetips-instagram-1_files/433726860_3785103398389409_9190250942546798068_n.jpg',
    alt: 'Instagram Post - Student Success Story',
    category: 'Team Vibes',
    description: 'Real student success stories from our community',
    source: 'instagram',
    sourceUrl: 'https://www.instagram.com/collegetips.in/'
  },
  {
    id: 8,
    src: '/assets/images/collegetips-study-group.jpg',
    alt: 'Study Group Session',
    category: 'Work Hard, Play Hard',
    description: 'Students collaborating in our interactive study groups',
    source: 'website',
    sourceUrl: 'https://collegetips.in'
  },
  {
    id: 9,
    src: '/assets/images/collegetips-success-story.jpg',
    alt: 'Student Success Story',
    category: 'Creative Campaigns',
    description: 'Celebrating student achievements and success stories',
    source: 'instagram',
    sourceUrl: 'https://www.instagram.com/collegetips.in/'
  }
];

const categories = ['All', 'Team Vibes', 'Creative Campaigns', 'Work Hard, Play Hard', 'Behind-The-Scenes'];

// Loading component for images
const ImageLoader = () => (
  <div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center">
    <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
  </div>
);

// Source icon component
const SourceIcon: React.FC<{ source: 'website' | 'instagram' }> = ({ source }) => {
  const Icon = source === 'instagram' ? FaInstagram : FaGlobe;
  return <Icon className="w-4 h-4" />;
};

// Add new interfaces for search and carousel
interface SearchState {
  query: string;
  isActive: boolean;
}

interface CarouselState {
  isOpen: boolean;
  currentIndex: number;
}

// Add floating shape component
const FloatingShape = ({ delay = 0, size = 40, color = "rgba(147, 51, 234, 0.1)" }) => {
  const controls = useAnimation();
  
  useEffect(() => {
    const animate = async () => {
      while (true) {
        await controls.start({
          x: [0, Math.random() * 100 - 50],
          y: [0, Math.random() * 100 - 50],
          rotate: [0, Math.random() * 360],
          transition: {
            duration: 10 + Math.random() * 10,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }
        });
      }
    };
    animate();
  }, [controls]);

  return (
    <motion.div
      animate={controls}
      initial={{ opacity: 0 }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        background: color,
        borderRadius: "50%",
        filter: "blur(8px)",
      }}
      transition={{ delay }}
    />
  );
};

// Add animated background component
const AnimatedBackground = () => {
  const shapes = [
    { size: 60, color: "rgba(147, 51, 234, 0.1)", delay: 0 },
    { size: 80, color: "rgba(59, 130, 246, 0.1)", delay: 0.5 },
    { size: 40, color: "rgba(236, 72, 153, 0.1)", delay: 1 },
    { size: 100, color: "rgba(147, 51, 234, 0.05)", delay: 1.5 },
    { size: 70, color: "rgba(59, 130, 246, 0.05)", delay: 2 },
    { size: 50, color: "rgba(236, 72, 153, 0.05)", delay: 2.5 },
    { size: 90, color: "rgba(147, 51, 234, 0.08)", delay: 3 },
    { size: 65, color: "rgba(59, 130, 246, 0.08)", delay: 3.5 },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
      
      {/* Animated radial gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 50% 120%, rgba(120,119,198,0.3), rgba(255,255,255,0))",
            "radial-gradient(circle at 120% 50%, rgba(120,119,198,0.3), rgba(255,255,255,0))",
            "radial-gradient(circle at 50% -20%, rgba(120,119,198,0.3), rgba(255,255,255,0))",
            "radial-gradient(circle at -20% 50%, rgba(120,119,198,0.3), rgba(255,255,255,0))",
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Floating shapes */}
      {shapes.map((shape, index) => (
        <FloatingShape
          key={index}
          size={shape.size}
          color={shape.color}
          delay={shape.delay}
        />
      ))}

      {/* Animated grid lines */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(147, 51, 234, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(147, 51, 234, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
      }} />

      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1), transparent 70%)",
          filter: "blur(40px)"
        }}
      />
    </div>
  );
};

// Add a fun animated title component
const AnimatedTitle = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="relative"
  >
    <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4">
      CollegeTips Gallery
    </h1>
    <motion.div
      className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    />
  </motion.div>
);

// Add a fun category button component
const CategoryButton = ({ category, isSelected, onClick }: { category: string; isSelected: boolean; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`
      px-6 py-2 rounded-full text-sm font-medium
      ${isSelected
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
      }
      transition-all duration-300
    `}
  >
    {category}
  </motion.button>
);

const PhotoGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<GalleryImage[]>(galleryImages);
  const [search, setSearch] = useState<SearchState>({ query: '', isActive: false });
  const [carousel, setCarousel] = useState<CarouselState>({ isOpen: false, currentIndex: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter images based on search and category
  const filteredImages = images.filter(img => {
    const matchesCategory = selectedCategory === 'All' || img.category === selectedCategory;
    const matchesSearch = search.query === '' || 
      img.description.toLowerCase().includes(search.query.toLowerCase()) ||
      img.category.toLowerCase().includes(search.query.toLowerCase()) ||
      img.alt.toLowerCase().includes(search.query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Carousel controls
  const nextImage = useCallback(() => {
    setCarousel(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % filteredImages.length
    }));
  }, [filteredImages.length]);

  const prevImage = useCallback(() => {
    setCarousel(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + filteredImages.length) % filteredImages.length
    }));
  }, [filteredImages.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (carousel.isOpen) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') setCarousel(prev => ({ ...prev, isOpen: false }));
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [carousel.isOpen, nextImage, prevImage]);

  const handleImageLoad = (id: number) => {
    console.log(`Image ${id} loaded`);
    setLoadedImages(prev => new Set(prev).add(id));
    setError(null);
  };

  const handleImageError = (id: number, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Error loading image ${id}:`, e);
    const image = images.find(img => img.id === id);
    const retryCount = (image?.retryCount || 0) + 1;

    if (retryCount <= 3) {
      setError(`Loading image ${id}... Please wait while we retry.`);
    } else {
      setError(`Unable to load image ${id}. Please check if the image exists at ${image?.src}`);
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoadedImages(new Set());
    setImages(prevImages => 
      prevImages.map(img => ({
        ...img,
        retryCount: 0
      }))
    );
  };

  // Download image function
  const handleDownload = async (image: GalleryImage) => {
    try {
      const response = await fetch(image.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${image.alt.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading image:', err);
      setError('Failed to download image. Please try again.');
    }
  };

  // Share image function
  const handleShare = async (image: GalleryImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.alt,
          text: image.description,
          url: image.sourceUrl || window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = image.sourceUrl || window.location.href;
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <FaRedo className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <AnimatedTitle />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Capturing our journey, one moment at a time ✨
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Search images..."
                value={search.query}
                onChange={(e) => setSearch(prev => ({ ...prev, query: e.target.value }))}
                className="w-full px-4 py-3 pl-12 rounded-full border-2 border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 shadow-lg"
              />
              <FaSearch className="absolute left-4 top-3.5 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
              {search.query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearch({ query: '', isActive: false })}
                  className="absolute right-3 top-3 text-gray-400 hover:text-purple-500 transition-colors duration-300"
                >
                  <FaTimes />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Filter Button for Mobile */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="md:hidden fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg z-50"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {isFilterOpen ? <FaTimes /> : <FaFilter />}
        </motion.button>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`
            ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 fixed md:static bottom-0 left-0 w-64 md:w-auto
            bg-white/80 backdrop-blur-md md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none
            transition-transform duration-300 ease-in-out z-40 rounded-t-2xl md:rounded-none
          `}
        >
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            {categories.map((category) => (
              <CategoryButton
                key={category}
                category={category}
                isSelected={selectedCategory === category}
                onClick={() => {
                  setSelectedCategory(category);
                  setIsFilterOpen(false);
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Photo Grid */}
        <PhotoProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={`${image.id}-${image.retryCount}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-2xl shadow-xl bg-white"
                >
                  <PhotoView src={image.src}>
                    <div className="relative w-full h-64">
                      {!loadedImages.has(image.id) && <ImageLoader />}
                      <motion.img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        onLoad={() => handleImageLoad(image.id)}
                        onError={(e) => handleImageError(image.id, e)}
                        onClick={() => isMobile && setCarousel({ isOpen: true, currentIndex: index })}
                        className={`
                          w-full h-64 object-cover transform transition-all duration-500
                          group-hover:scale-110 cursor-pointer
                          ${loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'}
                        `}
                        whileHover={{ scale: 1.1 }}
                      />
                    </div>
                  </PhotoView>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 text-white"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{image.category}</h3>
                        <p className="text-sm opacity-90">{image.description}</p>
                      </div>
                      <div className="flex gap-3">
                        {image.sourceUrl && (
                          <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            href={image.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-purple-300 transition-colors"
                            title={`View on ${image.source === 'instagram' ? 'Instagram' : 'Website'}`}
                          >
                            <SourceIcon source={image.source} />
                          </motion.a>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image);
                          }}
                          className="text-white hover:text-purple-300 transition-colors"
                          title="Download image"
                        >
                          <FaDownload className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(image);
                          }}
                          className="text-white hover:text-purple-300 transition-colors"
                          title="Share image"
                        >
                          <FaShare className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </PhotoProvider>

        {/* Mobile Carousel */}
        {isMobile && carousel.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevImage}
              className="absolute left-4 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            >
              <FaChevronLeft className="w-6 h-6" />
            </motion.button>
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.img
                key={carousel.currentIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                src={filteredImages[carousel.currentIndex].src}
                alt={filteredImages[carousel.currentIndex].alt}
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-0 right-0 text-center text-white bg-black/50 backdrop-blur-sm p-4 rounded-lg mx-4"
              >
                <p className="text-lg font-semibold">{filteredImages[carousel.currentIndex].category}</p>
                <p className="text-sm opacity-90">{filteredImages[carousel.currentIndex].description}</p>
              </motion.div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextImage}
              className="absolute right-4 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            >
              <FaChevronRight className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCarousel(prev => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            >
              <FaTimes className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}

        {/* Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-sm text-gray-600 bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
        >
          <p className="text-lg font-medium text-gray-800 mb-2">✨ CollegeTips Gallery ✨</p>
          <p className="mb-4">Images will be replaced with actual CollegeTips content.</p>
          <div className="flex justify-center gap-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://collegetips.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FaGlobe className="w-4 h-4" />
              Visit Website
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://www.instagram.com/collegetips.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FaInstagram className="w-4 h-4" />
              Follow on Instagram
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PhotoGallery; 