import Image from "next/image";

const AboutSectionTwo = () => {
  return (
    <section className="w-full py-16 md:px-20 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center justify-between">
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="wow fadeInUp relative mx-auto mb-12 h-[300px] w-full max-w-[1000px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
              data-wow-delay=".15s"
            >
              <Image
                src="/images/metrics.png"
                alt="about image"
                fill
                className="drop-shadow-three object-cover object-center dark:hidden"
              />
              <Image
                src="/images/metrics.png"
                alt="about image"
                fill
                className="drop-shadow-three hidden object-cover object-center dark:block"
              />
            </div>
          </div>

          <div className="w-full px-10 md:px-20 lg:w-1/2">
            <div className="wow fadeInUp max-w-[470px]" data-wow-delay=".2s">
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Stage 1: FFF & Angels
                </h3>
                <p className="text-body-color text-base font-medium leading-relaxed sm:text-lg sm:leading-relaxed">
                  Begin with a lean team—CEO, developer, and Sales—while proving
                  your idea works. Land your first 10 users, grow to 100 buyers,
                  and gain early angel backing.
                </p>
              </div>
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Stage 2: Pre-Seed to Series D
                </h3>
                <p className="text-body-color text-base font-medium leading-relaxed sm:text-lg sm:leading-relaxed">
                  As your team expands with designers, QA, and managers, so do
                  your goals. Scale to 500+ users, turn your contribution margin
                  positive, hit $100K in margin, and break even. Series C-D
                  pushes you toward $500K in revenue.
                </p>
              </div>
              <div className="mb-1">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Stage 3: Pre-IPO & IPO
                </h3>
                <p className="text-body-color text-base font-medium leading-relaxed sm:text-lg sm:leading-relaxed">
                  With a full team and matured systems, it's time to scale
                  efficiently and go public—while staying profitable and
                  dominating the market.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
