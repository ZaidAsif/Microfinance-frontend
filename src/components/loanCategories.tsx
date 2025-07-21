import { LoanCategory } from "@/types/category";

export default function LoanCategories({ categories }: {categories: LoanCategory[]}) {
    return (
      <section className="py-12 bg-white">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">Available Loan Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
          {categories.map((category, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
              <ul className="text-gray-600">
                {category.subcategories.map((sub, i) => (
                  <li key={i} className="list-disc ml-4">{sub}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  }
  