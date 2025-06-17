import Image from "next/image";
import SectionTitle from "../common/Common/SectionTitle";

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

const AboutSectionOne = () => {
  const List = ({ text }: { text: string }) => (
    <p className="text-body-color mb-5 flex items-center text-lg font-medium">
      <span className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
        {checkIcon}
      </span>
      {text}
    </p>
  );

  const startupStages = [
    "FFF",
    "Pre-Seed",
    "Angel Investors",
    "Seed",
    "Series A",
    "Series B",
    "Series C",
    "Series D ",
    "Pre-IPO",
    "IPO",
    "Post-IPO ",
  ];

  return (
    <section
      id="about"
      className="2xl:px-38 w-full bg-slate-100 px-3 pb-20 pt-16 dark:bg-[#0f1523] md:px-28 lg:px-32"
    >
      <div className="container">
        <div className="border-body-color/[.15] border-b pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <SectionTitle
                title="Make Impactful Decisions, Backed by Real Metrics"
                paragraph="Track your progress through every startup stage — from initial idea to IPO and beyond — with actionable metrics guiding each decision."
                mb="44px"
              />

              <div
                className="wow fadeInUp mb-0 max-w-[570px] md:mb-12 lg:mb-0"
                data-wow-delay=".15s"
              >
                <div className="mx-[-12px] flex flex-wrap">
                  {startupStages.map((stage, index) => (
                    <div
                      key={index}
                      className="w-1/2 px-3 sm:w-1/2 md:w-1/2 lg:w-full xl:w-1/2"
                    >
                      <List text={stage} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2">
              <div
                className="wow fadeInUp relative h-[500px] w-full lg:h-[600px]"
                data-wow-delay=".2s"
              >
                <Image
                  src="/images/metrics.png"
                  alt="about-image"
                  fill
                  className="object-cover object-center dark:hidden"
                />
                <Image
                  src="/images/metrics.png"
                  alt="about-image"
                  fill
                  className="hidden object-cover object-center dark:block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionOne;
