import Image from 'next/image';
import React from 'react';

const PlatformContent = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Platform Content
          </h3>
          <p className="text-sm font-medium">
            Recent content updates and activities
          </p>
        </div>
        <div>
          <button className="inline-flex items-center justify-center rounded-md border border-primary px-4 py-2 text-center font-medium text-primary hover:bg-opacity-90">
            View All
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* Content Item 1 */}
        <div className="rounded-sm border border-stroke p-4 dark:border-strokedark">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full">
                <Image src="/images/user/user-01.png" alt="User" />
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  John Doe
                </h5>
                <p className="text-sm font-medium">Updated platform settings</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">2 hours ago</p>
            </div>
          </div>
        </div>

        {/* Content Item 2 */}
        <div className="rounded-sm border border-stroke p-4 dark:border-strokedark">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full">
                <Image  src="/images/user/user-02.png" alt="User" />
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Jane Smith
                </h5>
                <p className="text-sm font-medium">Added new content page</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Yesterday</p>
            </div>
          </div>
        </div>

        {/* Content Item 3 */}
        <div className="rounded-sm border border-stroke p-4 dark:border-strokedark">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full">
                <Image src="/images/user/user-03.png" alt="User" />
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Robert Johnson
                </h5>
                <p className="text-sm font-medium">Updated user permissions</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">2 days ago</p>
            </div>
          </div>
        </div>

        {/* Content Item 4 */}
        <div className="rounded-sm border border-stroke p-4 dark:border-strokedark">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full">
                <Image src="/images/user/user-04.png" alt="User" />
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Emily Davis
                </h5>
                <p className="text-sm font-medium">Published new feature</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">1 week ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformContent; 