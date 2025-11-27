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

