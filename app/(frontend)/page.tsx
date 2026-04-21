import HeroBanner from '@/components/home/HeroBanner';
import HomeSearchForm from '@/components/home/HomeSearchForm';

export default function Home() {
  return (
    <>
      <HeroBanner
        badge="Premium Properties"
        headline="Find Your Dream Home"
        subtext="Discover exceptional properties in Dubai's most prestigious locations. Your perfect home awaits with our curated collection."
        backgroundImage="/assets/images/hero-bg.jpg"
      >
        <HomeSearchForm />
      </HeroBanner>
    </>
  );
}
