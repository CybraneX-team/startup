import SectionTitle from "../common/Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  return (
    <>
      <section
        id="features"
        className="flex flex-col items-center justify-center bg-slate-100 px-16 py-16 dark:bg-[#0f1523] md:px-28 md:py-20 lg:px-32 2xl:px-48"
      >
        <div className="min-w-screen container flex flex-col items-center justify-center">
          <SectionTitle
            title="Main Features"
            paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
            center
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
