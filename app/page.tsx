import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
    return (
        <div>
            <section className="relative w-full h-[800px] mt-0">
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

            {/* Top Pick Section */}
            <section className="px-4 py-4 flex justify-center">
                <div className="w-full max-w-6xl">
                    <h2 className="text-3xl font-semibold mt-4 mb-4 text-left">Top Pick</h2>
                    <div className="overflow-x-auto overflow-y-hidden">
                        <div className="flex gap-6 min-w-max px-1 sm:px-2 md:px-0">
                             {[
          "https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,h_1350,g_south/c_crop,g_center,w_1200,h_1200/v1747462203/27_ndpr7c.png",
          "https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702299/18_bhgr6n.png",
          "https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702286/4.2_bavldh.png",
          "https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,h_1350,g_south/c_crop,g_center,w_1200,h_1200/v1747462203/27_ndpr7c.png",
          "https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702299/18_bhgr6n.png",
          "https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702286/4.2_bavldh.png",
        ].map((i, index) => (
                                <Link
                                    key={index}
                                    href="/"
                                    className="flex-shrink-0 w-[370px] block h-full"
                                >
                                    <div className="rounded-3xl p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                        <div className="w-full h-[380px] flex items-center justify-center">
                                            <img
                                                src={i}
                                                alt="plant"
                                                className="object-contain max-h-full"
                                            />
                                        </div>
                                        <h2 className="flex items-center justify-center text-center mt-2">tester</h2>
                                        <p className="text-sm text-center text-gray-600">ราคา xxx บาท</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center mt-10 mb-10">
                        <Link href="/plant" className="px-6 py-2 border-2 border-green-900 text-green-900 rounded-full text-lg hover:bg-green-900 hover:text-white transition flex items-center justify-center">
                            See More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Banner */}
            <section className="relative h-[700px] mx-10">
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

            {/* Pot Section */}
            <section className="px-4 py-4 flex justify-center">
                <div className="w-full max-w-6xl">
                    <h2 className="text-3xl font-semibold mt-4 mb-4 text-left">Pot</h2>
                    <div className="overflow-x-auto overflow-y-hidden">
                        <div className="flex gap-6 min-w-max px-1 sm:px-2 md:px-0">
                             {[
          "https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,h_1350,g_south/c_crop,g_center,w_1200,h_1200/v1747462203/27_ndpr7c.png",
          "https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702299/18_bhgr6n.png",
          "https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702286/4.2_bavldh.png",
          "https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,h_1350,g_south/c_crop,g_center,w_1200,h_1200/v1747462203/27_ndpr7c.png",
          "https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702299/18_bhgr6n.png",
          "https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702286/4.2_bavldh.png",
        ].map((i, index) => (
                                <Link
                                    key={index}
                                    href="/"
                                    className="flex-shrink-0 w-[370px] block h-full"
                                >
                                    <div className="rounded-3xl p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                        <div className="w-full h-[380px] flex items-center justify-center">
                                            <img
                                                src={i}
                                                alt="pot"
                                                className="object-contain max-h-full"
                                            />
                                        </div>
                                        <h2 className="flex items-center justify-center text-center mt-2">tester</h2>
                                        <p className="text-sm text-center text-gray-600">ราคา xxx บาท</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center mt-10 mb-10">
                        <Link href="/pot" className="px-6 py-2 border-2 border-green-900 text-green-900 rounded-full text-lg hover:bg-green-900 hover:text-white transition flex items-center justify-center">
                            See More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Banner */}
            <section className="relative w-full h-[700px]">
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

            {/* Portfolio Section */}
            <section className="py-10">
                <div className="container mx-auto px-10 mt-10">
                    <h2 className="text-3xl font-semibold mb-6 text-left">Portfolio</h2>
                    {/* Scrollable wrapper */}
                    <div className="overflow-x-auto overflow-y-hidden">
                        <div className="flex gap-6 min-w-max">
                            {[
                                "https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg",
                                "https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893614/IMG_7820_vl1vlo.jpg",
                                "https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893614/IMG_2129_vzgqdk.jpg",
                                "https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg"
                            ].map((i) => (
                                <Link key={i} href="/" className="flex-shrink-0 w-[420px]">
                                    <div className="overflow-hidden hover:shadow-lg transition-transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                        <div className="w-full aspect-[3/2] overflow-hidden mb-2">
                                            <img
                                                src={i}
                                                alt="project"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h2 className="text-lg font-semibold px-4">Project</h2>
                                        <p className="text-sm text-gray-600 px-4 mb-2">Description</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center mt-20 mb-10">
                        <Link href="/port" className="px-6 py-2 border-2 border-green-900 text-green-900 rounded-full text-lg hover:bg-green-900 hover:text-white transition flex items-center justify-center">
                            See More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Banner */}
            <section className="relative w-full h-[700px]">
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
