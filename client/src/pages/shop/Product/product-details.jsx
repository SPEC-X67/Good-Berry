import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ProductDetails = ({ description }) => {
  const [activeTab, setActiveTab] = useState('details');

  // Dummy reviews data
  const reviews = [
    {
      id: 1,
      user: "John Doe",
      rating: 5,
      date: "2024-01-02",
      comment: "Great product! The quality is exceptional and it fits perfectly."
    },
    {
      id: 2,
      user: "Jane Smith",
      rating: 4,
      date: "2024-01-01",
      comment: "Very satisfied with the purchase. Would definitely recommend."
    }
  ];

  return (
    <div className="w-full lg:pt-16 pt-8 mt-8 ">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-48 pr-2 md:border-r">
          <div className="flex md:flex-col border-b md:border-b-0">
            <button
              onClick={() => setActiveTab('details')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors w-full rounded rounded-5",
                activeTab === 'details'
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              )}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Details
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors w-full rounded rounded-5 mt-1",
                activeTab === 'reviews'
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              )}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Reviews
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Customer Reviews</h3>
                <Button variant="outline" className="ml-4">
                  Write a Review
                </Button>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="font-medium">{review.user}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;