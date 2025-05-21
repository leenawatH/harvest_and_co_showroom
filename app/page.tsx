
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
        <section className="relative w-full h-[300px]">
            <Image
                src="/banner/banner.jpg"
                alt="Pot Banner"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h2 className="text-3xl text-white font-bold">Welcome</h2>
            </div>
        </section>

        <section className="px-4 py-8 flex justify-center">
        <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-semibold mb-6 text-left">Top Pick</h2>

            <div className="overflow-x-auto md:overflow-visible">
            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-20 px-1 sm:px-2 md:px-0 w-[600px] sm:w-[700px] md:w-full">
                {[1, 2, 3].map((i) => (
                <Link key={i} href="/" className="flex-shrink-0 w-[28%] sm:w-[28%] md:w-full max-w-sm block h-full">
                    <div className="rounded-xl md:p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between">
                    <img
                        src="https://res.cloudinary.com/dtppo2rxs/image/upload/v1747462203/27_ndpr7c.png"
                        alt="test"
                        className="w-full h-40 object-contain md:mb-2"
                    />
                    <h2 className="flex items-center justify-center text-center">tester</h2>
                    </div>
                </Link>
                ))}
            </div>
            </div>
        </div>
        </section>


        <section className="relative w-full h-[300px]">
            <Image
                src="/banner/banner.jpg"
                alt="Pot Banner"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h2 className="text-3xl text-white font-bold">กระถาง</h2>
            </div>
        </section>

        <section className="px-4 py-8 flex justify-center">
        <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-semibold mb-6 text-left">Pot</h2>

            <div className="overflow-x-auto md:overflow-visible">
            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-20 px-1 sm:px-2 md:px-0 w-[600px] sm:w-[700px] md:w-full">
                {[1, 2, 3].map((i) => (
                <Link key={i} href="/" className="flex-shrink-0 w-[28%] sm:w-[28%] md:w-full max-w-sm block h-full">
                    <div className="rounded-xl md:p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between">
                    <img
                        src="https://res.cloudinary.com/dtppo2rxs/image/upload/v1747462203/27_ndpr7c.png"
                        alt="test"
                        className="w-full h-40 object-contain md:mb-2"
                    />
                    <h2 className="flex items-center justify-center text-center">tester</h2>
                    </div>
                </Link>
                ))}
            </div>
            </div>
        </div>
        </section>


        <section className="relative w-full h-[300px]">
            <Image
                src="/banner/banner.jpg"
                alt="Pot Banner"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h2 className="text-3xl text-white font-bold">Portfolio</h2>
            </div>
        </section>

        <section className="px-4 py-10">
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-left">Portfolio</h2>

            <div className="overflow-x-auto overflow-y-hidden">
            <div className="flex gap-6 sm:gap-8 md:gap-10 px-1 sm:px-2 md:px-4">
                {[1, 2, 3].map((i) => (
                <Link
                    key={i}
                    href="/"
                    className="flex-shrink-0 w-[80%] sm:w-[45%] md:w-[40%] max-w-sm"
                >
                    
                    <div className="rounded-xl border border-gray-100 shadow overflow-hidden p-4 hover:shadow-lg transition-transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                    <img
                        src="https://res.cloudinary.com/dtppo2rxs/image/upload/v1747462203/27_ndpr7c.png"
                        alt="test"
                        className="w-full h-48 object-contain mb-2"
                    />
                    <h2 className="text-lg font-semibold">Project {i}</h2>
                    <p className="text-sm text-gray-600">Description</p>
                    </div>
                </Link>
                ))}
            </div>
            </div>
        </div>
        </section>



        <section className="relative w-full h-[300px]">
            <Image
                src="/banner/banner.jpg"
                alt="Pot Banner"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h2 className="text-3xl text-white font-bold">Big Tree</h2>
            </div>
        </section>



    </div>
  );
}
