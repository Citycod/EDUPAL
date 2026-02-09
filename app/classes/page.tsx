'use client';

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useRouter } from "next/navigation";

const ClassesPage: React.FC = () => {
  const router = useRouter();

  const navItems = [
    {
      icon: "House",
      label: "Home",
      active: false,
      onClick: () => router.push("/home")
    },
    {
      icon: "BookOpen",
      label: "Study",
      active: false,
      onClick: () => router.push("/study")
    },
    {
      icon: "Video",
      label: "Classes",
      active: true,
      onClick: () => router.push("/classes")
    },
    {
      icon: "Users",
      label: "Community",
      active: false,
      onClick: () => router.push("/community")
    },
    {
      icon: "User",
      label: "Profile",
      active: false,
      onClick: () => router.push("/profile")
    }
  ];

  return (
    <div
      className="relative flex n w-full flex-col bg-[#f8fbfc] justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="pt-6">
        <Header title="Classes" />

        <h3 className="text-[#0d191c] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Live Classes
        </h3>

        <div className="p-4">
          <div className="flex items-stretch justify-between gap-4 rounded-xl">
            <div className="flex flex-col gap-1 flex-[2_2_0px]">
              <p className="text-[#498a9c] text-sm font-normal leading-normal">Live</p>
              <p className="text-[#0d191c] text-base font-bold leading-tight">
                Study Session: Calculus 101
              </p>
              <p className="text-[#498a9c] text-sm font-normal leading-normal">
                Hosted by Dr. Adebayo, 10:00 AM
              </p>
            </div>
            <div
              className="flex-1 w-full bg-center bg-no-repeat bg-cover aspect-video rounded-xl"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAuw6jU9vjQFtk-p6QGaJ0ihD_DO-E34odJA05vkoIfHn2r75vD64I3jkvdL6CrWLwHeSmDLgXDGCHVMMEn3UXh3c9_fSFrQsx-5vlS097tsp-04KM2xYqU9nII2qWrNOdSOHz7YZpo35Snre-bheLa-1eBrDsUaxZqSJrSbBI_i2rdEf1UgZWNHKP4ZtCYRujtr4-8keFvXcbLiKR2zLlSEI3wo457De7MSqdT-RQPMBRXW6eNvWI2yGqHxmjSKn2SgSAcD7mB8JM")',
              }}
            ></div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-stretch justify-between gap-4 rounded-xl">
            <div className="flex flex-col gap-1 flex-[2_2_0px]">
              <p className="text-[#498a9c] text-sm font-normal leading-normal">Live</p>
              <p className="text-[#0d191c] text-base font-bold leading-tight">
                Physics for Engineers
              </p>
              <p className="text-[#498a9c] text-sm font-normal leading-normal">
                Hosted by Prof. Okoro, 11:30 AM
              </p>
            </div>
            <div
              className="flex-1 w-full bg-center bg-no-repeat bg-cover aspect-video rounded-xl"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsop9siMReODShJUQVDPAqcUfwSlLfthRhZMC40L-WnXpqprRQYlu5fvx6Onjst_XUjM7vnSE78wO4AnuaXqbkg1vHRtT1Ry_I6jUVr02F1AQg2Rd5qYespJff0GyS_Sn7MEEeSDmzuhqP1DdUxR91_5I4UMK6Y0Wu3sEDJHXYfd63Ym0OGSysxrct3z5Am4Ige9xKwIzhPGwr_PSVTFEVao_gc45CBwahdfrRiKgFNONjLjvRCarj9R8OWMI7WtXjLfPtFbnW0xA")',
              }}
            ></div>
          </div>
        </div>

        <h3 className="text-[#0d191c] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Upcoming Classes
        </h3>

        <div className="p-4">
          <div className="flex items-stretch justify-between gap-4 rounded-xl">
            <div className="flex flex-col gap-1 flex-[2_2_0px]">
              <p className="text-[#0d191c] text-base font-bold leading-tight">
                Organic Chemistry Review
              </p>
              <p className="text-[#498a9c] text-sm font-normal leading-normal">
                Hosted by Dr. Eze, Tomorrow, 2:00 PM
              </p>
            </div>
            <div
              className="flex-1 w-full bg-center bg-no-repeat bg-cover aspect-video rounded-xl"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZngbafQjfL-CCWcsVh6hsCxf_SJdryp8Bu84RwHUC4bAx2bzhIyo-nykCVo864VSQITs9GxNy4mYkUw7zuSast6Cpx3Kk_vokVbJtI1vgDBNpOrTQaGwJUkeJ1ge-8I3YGR570-0rItp09UeOcwnEWMzktiUILKD42goshuThOn60a3GZoHChszWlwpbvFrwmJRADpYDc2RRV2mDSrXDRCD47L2EIr3Jcu4qB5akUfZCTlRr9XOuC84sy6lRmk8QiiMAcDPmcUAI")',
              }}
            ></div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-stretch justify-between gap-4 rounded-xl">
            <div className="flex flex-col gap-1 flex-[2_2_0px]">
              <p className="text-[#0d191c] text-base font-bold leading-tight">
                Introduction to Economics
              </p>
              <p className="text-[#498a9c] text-sm font-normal leading-normal">
                Hosted by Prof. Musa, Next Week, 4:00 PM
              </p>
            </div>
            <div
              className="flex-1 w-full bg-center bg-no-repeat bg-cover aspect-video rounded-xl"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC-4FlckQnU0aoI8z_Kj1yjIYmTVL-7K0aYrphPLve-rzE-yCLkhQKBXSce_UFV1FM15lOvM7ruSnkVOO6UyZT0nnoa_ipPH_VRN4PVz4jc1j8YgZf2GR7EZUUBPLS_J_cKrC7afYnWchsh911MEBzaLFV9JpQvw71EJSIceYm0n4w4PgLFAqBTd89nRyjbTogYN8psMsUxG2YKF1SAC1wwWKlqwGuP6MoUT_lQGlyDx-X2KfJDofM2Zeb3S9M0Y1k3cKLEjXPubz4")',
              }}
            ></div>
          </div>
        </div>
      </div>

      <BottomNav navItems={navItems} />
    </div>
  );
};

export default ClassesPage;

