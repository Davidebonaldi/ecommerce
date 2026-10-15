import { Link } from "react-router-dom";
import { formatPrice } from "../services/api";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 to-stone-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <span className="text-6xl font-bold text-indigo-300">
            {product.name[0]}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
          {product.category_name}
        </p>
        <h3 className="mt-1 font-semibold">{product.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          {product.stock === 0 && (
            <span className="text-xs font-medium text-red-600">Esaurito</span>
          )}
        </div>
      </div>
    </Link>
  );
}