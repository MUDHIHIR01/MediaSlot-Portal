interface AdSlot {
    ad_slot_id: number;
    slot_name: string;
    position: string;
    size: string;
    price: string;
    available: boolean;
    image: string;
    created_at: string;
    updated_at: string;
  }
  
  interface AdSlotCardProps {
    ad: AdSlot;
    selectedAds: AdSlot[];
    setSelectedAds: (ads: AdSlot[]) => void;
    onSelect: () => void;
  }
  
  export default function AdSlotCard({ ad, selectedAds, setSelectedAds, onSelect }: AdSlotCardProps) {
    const isSelected = selectedAds.some((selected) => selected.ad_slot_id === ad.ad_slot_id);
  
    const handleToggle = () => {
      if (!ad.available) return;
      if (isSelected) {
        setSelectedAds(selectedAds.filter((selected) => selected.ad_slot_id !== ad.ad_slot_id));
      } else {
        setSelectedAds([...selectedAds, ad]);
      }
    };
  
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        <img src={ad.image} alt={ad.slot_name} className="w-full h-32 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">{ad.slot_name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Position: {ad.position}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Size: {ad.size}</p>
          <p className="text-sm font-semibold text-gray-800 dark:text-white">TShs {ad.price}</p>
          <p className={`text-sm ${ad.available ? "text-green-600" : "text-red-600"}`}>
            {ad.available ? "Available" : "Booked"}
          </p>
          <button
            onClick={handleToggle}
            disabled={!ad.available}
            className={`mt-2 w-full py-2 rounded-md text-white ${
              ad.available
                ? isSelected
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {ad.available ? (isSelected ? "Remove" : "Add to Cart") : "Unavailable"}
          </button>
        </div>
      </div>
    );
  }