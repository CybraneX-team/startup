// import accelPartners from '@/components/investorsimages/accelPartners.png';
// import benjaminHorowitz from '@/components/investorsimages/benjaminHorowitz.png';
// import elonMusk from '@/components/investorsimages/elonMusk.png';
// import erlichBachman from '@/components/investorsimages/erlichBachman.png';
// import ggvCAPITAL from '@/components/investorsimages/ggvCAPITAL.png';
// import indexVentures from '@/components/investorsimages/indexVentures.png';
// import marcAndreessen from '@/components/investorsimages/marcAndreessen.png';
// import PeterAndreas from '@/components/investorsimages/PeterAndreas.png';
// import softbank from '@/components/investorsimages/softbank.png';
// import YCombinator from '@/components/investorsimages/YCombinator.png';

// import { StaticImport } from "next/dist/shared/lib/get-img-props";

export const getInvestorImage = (name: string)  => {
  const images: { [key: string]: string } = {
    "Accel Partners": "/images/accelPartners.png",
    "Benjamin Horowitz": "/images/benjaminHorowitz.png",
    "Elon Musk": "/images/elonMusk.png",
    "Erlich Bachman": "/images/erlichBachman.png",
    "GGV Capital": "/images/ggvCAPITAL.png",
    "Index Ventures": "/images/indexVentures.png",
    "Marc Andreessen": "/images/marcAndreessen.png",
    "Peter Andreas Thiel": "/images/PeterAndreas.png",
    "Softbank": "/images/softbank.png",
    "Y combinator": "/images/YCombinator.png",
  };

  return images[name] || null;
};

