import { useState, useEffect } from 'react';
import axios from 'axios';
import { Country } from './types/country';
import Header from './components/Header';
import Footer from './components/Footer';
import CountryDetails from './components/CountryDetails';
import SearchAndFilter from './components/SearchAndFilter';

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 3;
  const INITIAL_RETRY_DELAY = 1000;

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const fetchWithRetry = async (attempt: number = 1): Promise<any> => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all', {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      return response;
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await sleep(delay);
        return fetchWithRetry(attempt + 1);
      }
      throw err;
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetchWithRetry();

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid data format received from API');
      }

      const isValidData = response.data.every((country: any) => 
        country?.name?.common &&
        country?.cca3 &&
        country?.region &&
        country?.flags?.png
      );

      if (!isValidData) {
        throw new Error('Invalid country data structure');
      }

      setCountries(response.data);
      
      const afghanistan = response.data.find((country: Country) => 
        country.name.common === 'Afghanistan'
      );
      
      if (afghanistan) {
        setSelectedCountry(afghanistan);
      } else {
        throw new Error('Default country (Afghanistan) not found in the data');
      }

      setError('');
      setLoading(false);
    } catch (err) {
      let errorMessage = 'Failed to fetch countries';
      
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please check your internet connection and try again.';
        } else if (err.message === 'Network Error') {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error('Error fetching countries:', err);
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, [retryCount]);

  const handleRetry = () => {
    setLoading(true);
    setError('');
    setRetryCount(count => count + 1);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    scrollToTop();
  };

  const handleBorderClick = (code: string) => {
    const borderCountry = countries.find((country) => country.cca3 === code);
    if (borderCountry) {
      setSelectedCountry(borderCountry);
      scrollToTop();
    }
  };

  const regions = Array.from(
    new Set(
      countries
        .map((country) => country.region)
        .filter(Boolean)
    )
  ).sort();

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRegion = !selectedRegion || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading country data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Data</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          regions={regions}
        />

        {filteredCountries.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side - Country Details */}
            <div className="lg:w-1/2 xl:w-2/5">
              {selectedCountry && (
                <div className="sticky top-8">
                  <CountryDetails
                    country={selectedCountry}
                    onBorderClick={handleBorderClick}
                  />
                </div>
              )}
            </div>
            
            {/* Right side - Country Grid */}
            <div className="lg:w-1/2 xl:w-3/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCountries.map((country) => (
                  <button
                    key={country.cca3}
                    onClick={() => handleCountrySelect(country)}
                    className={`p-4 rounded-lg shadow-md transition-all ${
                      selectedCountry?.cca3 === country.cca3
                        ? 'bg-indigo-100 border-2 border-indigo-500'
                        : 'bg-white hover:shadow-lg'
                    }`}
                  >
                    <img
                      src={country.flags.png}
                      alt={`Flag of ${country.name.common}`}
                      className="w-full h-32 object-cover rounded-md mb-4"
                    />
                    <h3 className="font-semibold text-gray-800">{country.name.common}</h3>
                    <p className="text-sm text-gray-600">{country.region}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">
            No countries found matching your criteria
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;