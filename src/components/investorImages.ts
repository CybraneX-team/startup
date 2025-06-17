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
    "Accel Partners": "/investorsimages/accelPartners.png",
    "Benjamin Horowitz": "/investorsimages/benjaminHorowitz.png",
    "Elon Musk": "/investorsimages/elonMusk.png",
    "Erlich Bachman": "/investorsimages/erlichBachman.png",
    "GGV Capital": "/investorsimages/ggvCAPITAL.png",
    "Index Ventures": "/investorsimages/indexVentures.png",
    "Marc Andreessen": "/investorsimages/marcAndreessen.png",
    "Peter Andreas Thiel": "/investorsimages/PeterAndreas.png",
    "Softbank": "/investorsimages/softbank.png",
    "Y combinator": "/investorsimages/YCombinator.png",
  };

  return images[name] || null;
};

