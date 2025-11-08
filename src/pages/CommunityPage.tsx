import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();

  const navItems = [
    {
      icon: "House",
      label: "Home",
      active: false,
      onClick: () => navigate("/")
    },
    {
      icon: "BookOpen",
      label: "Study",
      active: false,
      onClick: () => navigate("/study")
    },
    {
      icon: "Video",
      label: "Classes",
      active: false,
      onClick: () => navigate("/classes")
    },
    {
      icon: "Users",
      label: "Community",
      active: true,
      onClick: () => navigate("/community")
    },
    {
      icon: "User",
      label: "Profile",
      active: false,
      onClick: () => navigate("/profile")
    }
  ];

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-[#f8fbfc] justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div>
        <Header title="Community" />
        
        {/* Input Field */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              placeholder="Share a question or note..."
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d191c] focus:outline-0 focus:ring-0 border-none bg-[#e7f1f4] focus:border-none h-14 placeholder:text-[#498a9c] p-4 text-base font-normal leading-normal"
              value=""
            />
          </label>
        </div>

        {/* Trending Section */}
        <h3 className="text-[#0d191c] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Trending
        </h3>

        {/* Post 1 */}
        <div className="flex w-full flex-row items-start justify-start gap-3 p-4">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUjEd-I5lAHENfFAsmlx3aywUQgNcxzanj3wP8cStib1O7VXUzKuopw3qf5rFiGTGM2C1773ZXXfGKdReU0wF3Tc1bdZ_oi-1NyiNNFx9iXBaQG9PMOXhwVeSgV7eATyP9K4nVTFM_YL-b-LYYmacpkiN75OGRrQvkvirMdDCnl1JjOuNEmsKamUQptlvzJgzzdyhG8u8vUL43V8SAR8CkcxLa9YvEuuO5P_8AxgEeLA01h7REq3wROExpyZt9ckL-RPNZI45lp3E")'
            }}
          ></div>
          <div className="flex h-full flex-1 flex-col items-start justify-start">
            <div className="flex w-full flex-row items-start justify-start gap-x-3">
              <p className="text-[#0d191c] text-sm font-bold leading-normal tracking-[0.015em]">Aisha Adebayo</p>
              <p className="text-[#498a9c] text-sm font-normal leading-normal">2d</p>
            </div>
            <p className="text-[#0d191c] text-sm font-normal leading-normal">
              Does anyone have past questions for the Introduction to Economics course? I'm really struggling with the concepts and could use some help.
            </p>
          </div>
        </div>

        {/* Post 1 Reactions */}
        <div className="flex flex-wrap gap-4 px-4 py-2 justify-between">
          <div className="flex items-center justify-center gap-2 px-3 py-2">
            <div className="text-[#498a9c]" data-icon="Heart" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"
                ></path>
              </svg>
            </div>
            <p className="text-[#498a9c] text-[13px] font-bold leading-normal tracking-[0.015em]">23</p>
          </div>
          <div className="flex items-center justify-center gap-2 px-3 py-2">
            <div className="text-[#498a9c]" data-icon="ChatCircleDots" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"
                ></path>
              </svg>
            </div>
            <p className="text-[#498a9c] text-[13px] font-bold leading-normal tracking-[0.015em]">12</p>
          </div>
          <div className="flex items-center justify-center gap-2 px-3 py-2">
            <div className="text-[#498a9c]" data-icon="PaperPlaneTilt" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.42,29.84l85.62,40.55,40.55,85.62A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14L118.42,148.9l47.24-47.25a8,8,0,0,0-11.31-11.31L107.1,137.58,24,98.22l.14,0L216,40Z"
                ></path>
              </svg>
            </div>
            <p className="text-[#498a9c] text-[13px] font-bold leading-normal tracking-[0.015em]">5</p>
          </div>
        </div>

        {/* Comment 1 */}
        <div className="flex w-full flex-row items-start justify-start gap-3 p-4 pl-[68px]">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD0S5E8N6HCdmi72_gRdcZkvey8lskXChm57S3BAZwNEc7b4WLLCm56-mL0ZtRhZVU2YiafGCX2fVvNc4CTJ2x_YQheqzEye2GFuZxYNvO_SoqrwQshYhlBLIGQoAlAUs576QgN-KvGPBJV8xpoQmdERPVdQK1vgAcCzujRBzb6EXDoZsN1Vih9djTu1dffK2a4Itw-N7Uqpw48K1hVl0b4v9Afx8oopDivwk46atOpIGW-hlGqp6kisRjbafPTagS9eFRuBEotbgI")'
            }}
          ></div>
          <div className="flex h-full flex-1 flex-col items-start justify-start">
            <div className="flex w-full flex-row items-start justify-start gap-x-3">
              <p className="text-[#0d191c] text-sm font-bold leading-normal tracking-[0.015em]">Chukwudi Okoro</p>
              <p className="text-[#498a9c] text-sm font-normal leading-normal">1d</p>
            </div>
            <p className="text-[#0d191c] text-sm font-normal leading-normal">I have some past questions from last year. I can share them with you if you'd like.</p>
          </div>
        </div>

        {/* Comment 2 */}
        <div className="flex w-full flex-row items-start justify-start gap-3 p-4 pl-[68px]">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA1tVSePUGKgxxNYb3zXvAbpe84RltwVK9gz3rGR5bmmfFzAiEGcyBEGCxfkOSH0MGnkYSLXnhSOAQJ9RBbaY56skMEH19yk0Ft3BBT9cXmMI7U38gsDWM9GEjdhUU3FKP4EABIvwofSdx89oooR_1xB4ELF9I_WYphXD8FnIw-c35KvslA5rlvmrohOi65MB0ofwBo_UNbvqQXEhWL8q678-5kbNGjG2urSYodCjW-sNbxg5vva1LQ3Y9mDoZeQTI6fkfx234QYeI")'
            }}
          ></div>
          <div className="flex h-full flex-1 flex-col items-start justify-start">
            <div className="flex w-full flex-row items-start justify-start gap-x-3">
              <p className="text-[#0d191c] text-sm font-bold leading-normal tracking-[0.015em]">Aisha Adebayo</p>
              <p className="text-[#498a9c] text-sm font-normal leading-normal">1d</p>
            </div>
            <p className="text-[#0d191c] text-sm font-normal leading-normal">That would be amazing, Chukwudi! Thank you so much.</p>
          </div>
        </div>

        {/* Post 2 */}
        <div className="flex w-full flex-row items-start justify-start gap-3 p-4">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoiIMVywLqqXnA53u-Ie-O1Svapj37p-QY-ZXJJPTarNLpd7l0ILekEkaPFHN-S-KV-zCs5Fzgck3KqyjhlDf31QfIZryE8uzLD3kSDDgd0oleljE8XQ0YsB0Nn5IundQLIGsCQ7ermkdDsdkZKAevW7ftjahE-aiDqafLYDr7ikp7spa_-jiGxGE2iQWHT4XemEVQ4K3YABKDtD5TViqpJGwAUAcO6RVw2pWDPuLrMuVOvqkU0S6qs41XdCD4W1_GMFUykZenk1A")'
            }}
          ></div>
          <div className="flex h-full flex-1 flex-col items-start justify-start">
            <div className="flex w-full flex-row items-start justify-start gap-x-3">
              <p className="text-[#0d191c] text-sm font-bold leading-normal tracking-[0.015em]">Fatima Hassan</p>
              <p className="text-[#498a9c] text-sm font-normal leading-normal">3d</p>
            </div>
            <p className="text-[#0d191c] text-sm font-normal leading-normal">
              Has anyone found a good study group for the Calculus II course? I'm looking for a group that meets regularly and is focused on problem-solving.
            </p>
          </div>
        </div>

        {/* Post 2 Reactions */}
        <div className="flex flex-wrap gap-4 px-4 py-2 justify-between">
          <div className="flex items-center justify-center gap-2 px-3 py-2">
            <div className="text-[#498a9c]" data-icon="Heart" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"
                ></path>
              </svg>
            </div>
            <p className="text-[#498a9c] text-[13px] font-bold leading-normal tracking-[0.015em]">18</p>
          </div>
          <div className="flex items-center justify-center gap-2 px-3 py-2">
            <div className="text-[#498a9c]" data-icon="ChatCircleDots" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"
                ></path>
              </svg>
            </div>
            <p className="text-[#498a9c] text-[13px] font-bold leading-normal tracking-[0.015em]">8</p>
          </div>
          <div className="flex items-center justify-center gap-2 px-3 py-2">
            <div className="text-[#498a9c]" data-icon="PaperPlaneTilt" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.42,29.84l85.62,40.55,40.55,85.62A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14L118.42,148.9l47.24-47.25a8,8,0,0,0-11.31-11.31L107.1,137.58,24,98.22l.14,0L216,40Z"
                ></path>
              </svg>
            </div>
            <p className="text-[#498a9c] text-[13px] font-bold leading-normal tracking-[0.015em]">3</p>
          </div>
        </div>

        {/* Comment 3 */}
        <div className="flex w-full flex-row items-start justify-start gap-3 p-4 pl-[68px]">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAP5ov_vVGeCiX8mt_NpNvBbCpqYCY0V6OikSTo4AbWgBV76E4Q2UpFA34jA32ZHnBrATeI6p3n9vLKk6YcMIXZavNneGDpKYKePQ2I4vaTHkg7l5ZwD5KfklUt87zCeA6yLQhhRWlDY7HsV5p-JElb7NazPn6lPn2JyDWH9GYsWlT7whjOkM5eIZF70QA1BHL-lWmXdKcDNBASeR_imlGmTo16jHBOrgM3XvJejXypqJNwkCMmgxjDGEPxby0i-WZ2q-avDyQs128")'
            }}
          ></div>
          <div className="flex h-full flex-1 flex-col items-start justify-start">
            <div className="flex w-full flex-row items-start justify-start gap-x-3">
              <p className="text-[#0d191c] text-sm font-bold leading-normal tracking-[0.015em]">Obinna Eze</p>
              <p className="text-[#498a9c] text-sm font-normal leading-normal">2d</p>
            </div>
            <p className="text-[#0d191c] text-sm font-normal leading-normal">I'm also looking for a study group for Calculus II. Maybe we can start one together?</p>
          </div>
        </div>

        {/* Comment 4 */}
        <div className="flex w-full flex-row items-start justify-start gap-3 p-4 pl-[68px]">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuClu43NsbM1Ja2VKqEPUUC68YAMWrWjvu2lpXv3vC2pgxh6SYEmyIU6Mt7XiU6wrVQiBto4uPF-EdiZHrnCQoj1TWLIBaMnwDr_KrfeKrvNm2_zOXrRwuIkZXFS9bao5kWZYFqzi6t6R6fv0i6-VfMIClLBoO2mG17FR3oJz4S8zLtXAKKj5oqz9kJgbmsQ2d7ygcOik-L6VDrR8lTmzrxLdfhD84FcLl7k3Zuq6NfWvu_8By5Ebf8GSIyeZySgO8uZd35SEh4-eCc")'
            }}
          ></div>
          <div className="flex h-full flex-1 flex-col items-start justify-start">
            <div className="flex w-full flex-row items-start justify-start gap-x-3">
              <p className="text-[#0d191c] text-sm font-bold leading-normal tracking-[0.015em]">Fatima Hassan</p>
              <p className="text-[#498a9c] text-sm font-normal leading-normal">2d</p>
            </div>
            <p className="text-[#0d191c] text-sm font-normal leading-normal">That sounds great, Obinna! Let's connect and see if we can find others.</p>
          </div>
        </div>
      </div>

      <BottomNav navItems={navItems} />
    </div>
  );
};

export default CommunityPage;