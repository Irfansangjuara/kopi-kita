import Image from 'next/image';
import type { MenuItem } from '@/lib/menu-data';

const rupiahFormatter = new Intl.NumberFormat('id-ID');

interface ProductCardProps {
  product: MenuItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex min-w-0 flex-col">
      <div className="relative aspect-square overflow-hidden bg-[#E8E0D6]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 1023px) 50vw, 25vw"
          className={`object-cover transition duration-500 group-hover:scale-[1.03] ${
            product.available ? '' : 'grayscale opacity-45'
          }`}
        />

        {!product.available && (
          <span className="absolute right-2 top-2 z-20 bg-[#D4A574] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4A2C2A] shadow-sm sm:right-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs">
            Sold Out
          </span>
        )}

        <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-[#4A2C2A]/90 px-4 text-[#FAF3E0] opacity-0 transition-opacity sm:flex sm:group-hover:opacity-100">
          <span aria-hidden="true" className="text-4xl font-light">
            +
          </span>
          <p className="text-sm font-bold uppercase tracking-wider">
            See Description
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-3 text-center sm:pt-4">
        <h3 className="text-sm font-bold leading-snug sm:text-lg lg:text-xl">
          {product.name}
        </h3>
        <p className="mt-1 flex-1 text-[11px] leading-relaxed text-[#6D5A55] sm:text-sm">
          {product.description}
        </p>
        <p className="mt-2 text-sm font-bold text-light-brown sm:text-base">
          Rp {rupiahFormatter.format(product.price)}
        </p>
      </div>
    </article>
  );
}
