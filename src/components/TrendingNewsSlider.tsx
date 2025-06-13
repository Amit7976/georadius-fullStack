import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { formatTimeAgo } from '../helpers/formatTimeAgo';
import { t } from '../helpers/i18n';
import { TrendingNewsPost } from '../helpers/types';
import { LoaderLink } from './loaderLinks';


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


const TrendingNewsSlider = ({ trendingNews, loading }: { trendingNews: TrendingNewsPost[], loading: boolean }) => {
    if (loading) return (
        <div className='py-3 px-0'>
            <HeaderForTrendingNews />
            <div className="py-2 pr-0">
                <Swiper spaceBetween={0} slidesPerView={1} parallax={true} modules={[Autoplay]}>
                    {[1, 2, 3].map((i) => (
                        <SwiperSlide key={i}>
                            <div className="animate-pulse bg-gray-100 dark:bg-neutral-800 rounded-lg h-80 w-full" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <>
            <div className="py-3 px-0">
                <HeaderForTrendingNews />
                <div className="py-2 pr-0">
                    <Swiper spaceBetween={0} slidesPerView={1} parallax={true} modules={[Autoplay]}>
                        {trendingNews.map((news: TrendingNewsPost, index: number) => (
                            <SwiperSlide key={news._id || index}>
                                <LoaderLink href={`/search/results/${news._id}`} className="w-full h-80 relative overflow-hidden text-start select-none bg-gray-100 dark:bg-neutral-800">
                                    <Image
                                        src={news.image || '/default-image.jpg'}
                                        alt={news.creatorName || ""}
                                        width={600}
                                        height={300}
                                        priority
                                        className="w-full h-full object-cover object-center"
                                    />
                                    {/* Text Overlay */}
                                    <div className="absolute bottom-0 space-y-3 py-4 w-full h-full bg-gradient-to-b to-[#00000090] px-3 flex flex-col justify-end text-white z-50">
                                        <span className="text-xl font-bold">{news.title}</span>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <p className="text-green-500 text-sm font-semibold">
                                                {news.distance}
                                            </p>
                                            <p className="font-bold text-gray-100 text-sm">
                                                <span className='text-gray-300 font-normal'>by</span> {news?.creatorName || "Unknown"}
                                            </p>
                                            <p className="text-gray-400 text-xs font-medium">
                                                {news.createdAt ? formatTimeAgo(news.createdAt) : "Just now"}
                                            </p>
                                        </div>
                                    </div>
                                </LoaderLink>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>

    );
};
export default TrendingNewsSlider;

/////////////////////////////////////////////////////////////////////////////////////////////////////

export const HeaderForTrendingNews = () => {
    return (
        <div className="flex justify-between items-end p-2">
            <h2 className="text-3xl font-bold">{t("breaking")} <span className='text-green-500'>{t("news")}</span></h2>
            <LoaderLink href={'/pages/trendingNews'} className="text-xs font-bold pb-2 text-gray-500 active:scale-95">
                {t("viewAll")}
            </LoaderLink>
        </div>
    )
}