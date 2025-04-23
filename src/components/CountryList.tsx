import { Country } from '../types/country';
import CountryDetails from './CountryDetails';

interface CountryListProps {
  countries: Country[];
  onBorderClick: (code: string) => void;
}

export default function CountryList({ countries, onBorderClick }: CountryListProps) {
  // Sort countries by their common name in ascending order
  const sortedCountries = [...countries].sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );

  return (
    <div className="space-y-8">
      {sortedCountries.map((country) => (
        <CountryDetails
          key={country.name.common}
          country={country}
          onBorderClick={onBorderClick}
        />
      ))}
    </div>
  );
}