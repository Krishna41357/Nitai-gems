import React, { useState, useEffect } from 'react';

const CollectionsSection = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/collections`);
      if (!response.ok) throw new Error('Failed to fetch collections');
      const data = await response.json();
      const activeCollections = data.filter(collection => collection.isActive);
      setCollections(activeCollections);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-300" />
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-300 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 mb-4">Failed to load collections</p>
          <button
            onClick={fetchCollections}
            className="text-[#5C1F1F] hover:underline font-semibold"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (collections.length === 0) return null;

  const displayCollections = collections.slice(0, 6);
  const hasMore = collections.length > 6;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Collections
          </h2>
          <p className="text-lg text-gray-600">
            Explore our newly launched collection
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCollections.map((collection) => (
            <div
              key={collection.id}
              onClick={() => window.location.href = `/collection/${collection.slug}`}
              className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Collection Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={collection.imageUrl}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    EXPLORE NOW
                  </button>
                </div>

                {/* Product Count Badge */}
                {collection.productCount && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-900">
                      {collection.productCount}+ Products
                    </span>
                  </div>
                )}
              </div>

              {/* Collection Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#5C1F1F] transition-colors">
                  {collection.name}
                </h3>
                {collection.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {collection.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={() => window.location.href = '/collections'}
              className="inline-flex items-center gap-2 text-[#5C1F1F] font-semibold text-lg hover:underline"
            >
              View All Collections
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionsSection;