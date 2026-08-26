import './Home.css';
import PopularCities from '@features/home/PopularCities';
import FeaturesHighlight from '@features/home/FeaturesHighlight';
import HotelsSearchSection from '@features/home/HotelsSearchSection';

const Home = () => {
  return (
    <div className="home-page">
      <HotelsSearchSection />
      <PopularCities />
      <FeaturesHighlight />
    </div>
  );
};

export default Home;
