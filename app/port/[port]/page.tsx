import Port_Templete_Title from '@/components/Templete_Port_Component/Port_Templete_Title';
import Port_Templete_Component from '@/components/Templete_Port_Component/Port_Templete_Component';

const images_templete_1 = [
  'https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg',
];
const images_templete_2 = [
  'https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg',
  'https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg',
];
const images_templete_3 = [
  'https://res.cloudinary.com/dtppo2rxs/image/upload/v1746702302/19_gpxsuf.png',
  'https://res.cloudinary.com/dtppo2rxs/image/upload/v1746702302/19_gpxsuf.png',
  'https://res.cloudinary.com/dtppo2rxs/image/upload/v1746702302/19_gpxsuf.png',
];

export default function PortfolioDetailPage() {
  return (
    <main className="min-h-screen flex flex-col items-center mt-20 mx-20 mb-20 px-10">
        <div>
            <Port_Templete_Title
                count={1}
                title="Community Garden Project"
                description="Our team volunteered to design and build a sustainable community garden, promoting urban agriculture and healthy living."
                img="https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg"
            />
            <Port_Templete_Title
                count={2}
                title="Community Garden Project"
                description="Our team volunteered to design and build a sustainable community garden, promoting urban agriculture and healthy living."
                img="https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg"
            />
            <Port_Templete_Title
                count={3}
                title="Community Garden Project"
                description="Our team volunteered to design and build a sustainable community garden, promoting urban agriculture and healthy living."
                img="https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg"
            />
            <Port_Templete_Component Templete_number={1} images={images_templete_1} />
            <Port_Templete_Component Templete_number={2} images={images_templete_2} />
            <Port_Templete_Component Templete_number={3} images={images_templete_3} />
        </div>
    </main>
  );
}
