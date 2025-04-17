import accelPartners from '@/components/investorsimages/accelPartners.png';
import benjaminHorowitz from '@/components/investorsimages/benjaminHorowitz.png';
import elonMusk from '@/components/investorsimages/elonMusk.png';
import erlichBachman from '@/components/investorsimages/erlichBachman.png';
import ggvCAPITAL from '@/components/investorsimages/ggvCAPITAL.png';
import indexVentures from '@/components/investorsimages/indexVentures.png';
import marcAndreessen from '@/components/investorsimages/marcAndreessen.png';
import PeterAndreas from '@/components/investorsimages/PeterAndreas.png';
import softbank from '@/components/investorsimages/softbank.png';
import YCombinator from '@/components/investorsimages/YCombinator.png';

export const getInvestorImage = (name: string) => {
  const images: { [key: string]: any } = {
    "Accel Partners" :accelPartners,
    "Benjamin Horowitz" :benjaminHorowitz,
    "Elon Musk" : elonMusk,
    "Erlich Bachman" : erlichBachman,
    "GGV Capital" :ggvCAPITAL,
    "Index Ventures" :indexVentures,
    "Marc Andreessen" : marcAndreessen,
    "Peter Andreas Thiel" :PeterAndreas,
    "Softbank" : softbank,
    "Y combinator" :YCombinator,
  };

  return images[name] || null;
};
