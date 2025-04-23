import { Country } from '../types/country';

interface CountryDetailsProps {
  country: Country;
  onBorderClick: (code: string) => void;
}

export default function CountryDetails({ country, onBorderClick }: CountryDetailsProps) {
  // Sort border countries alphabetically
  const sortedBorders = [...country.borders].sort();

  return (
    <div className="bg-white text-black rounded-lg shadow-lg p-6 flex justify-center items-center min-h-screen">
      <div className="space-y-6 max-w-4xl">
        {/* Country Name and Flag */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={country.flags.svg}
            alt={`Flag of ${country.name.common}`}
            className="w-1/2 h-auto rounded-lg shadow-md"
          />
          <h2 className="text-3xl font-bold text-center">{country.name.common}</h2>
          <p className="italic text-center">{country.name.official}</p>
        </div>

        {/* Country Borders */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Border Countries (A-Z)</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {sortedBorders.length > 0 ? (
              sortedBorders.map((border) => (
                <button
                  key={border}
                  onClick={() => onBorderClick(border)}
                  className="px-3 py-1 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  {border}
                </button>
              ))
            ) : (
              <p className="text-gray-500">No border countries available</p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Capital</h4>
              <p>{country.capital?.join(', ') || 'N/A'}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Subregion</h4>
              <p>{country.subregion || 'N/A'}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Population</h4>
              <p>{country.population.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Area</h4>
              <p>{`${country.area.toLocaleString()} km²`}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Coordinates</h4>
              <p>{country.latlng.join(', ')}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Region</h4>
              <p>{country.region}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Timezones</h4>
              <ul className="list-disc list-inside">
                {country.timezones.map((timezone) => (
                  <li key={timezone}>{timezone}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Languages</h4>
              <ul className="list-disc list-inside">
                {Object.values(country.languages).map((language) => (
                  <li key={language}>{language}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Currencies</h4>
              <ul className="list-disc list-inside">
                {Object.entries(country.currencies).map(([code, currency]) => (
                  <li key={code}>
                    {currency.name} ({currency.symbol})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}