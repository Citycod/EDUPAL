import { useNavigate } from "react-router-dom";

const CommunityPostDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-[#f8f9fc] justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div>
        {/* Header with Back Button */}
        <div className="flex items-center bg-[#f8f9fc] p-4 pb-2 justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="text-[#0d121b] flex size-12 shrink-0 items-center"
            data-icon="ArrowLeft" 
            data-size="24px" 
            data-weight="regular"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h2 className="text-[#0d121b] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Community
          </h2>
        </div>

        {/* Post Content */}
        <div className="flex gap-4 bg-[#f8f9fc] px-4 py-3">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-[70px] w-fit"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB4uzTKyAm5wbmebOCIqI-1VbPa1yeYZRZ81bKKXQYoZXJYP-IfPs6A0rr-5KrF93bfMa4kXASuMBFrEFVrjPmGgxSqaiwi2BTfWQUsu8Ph0SDN7BcrS8wHUZPVG63w7GjYko3r29lBKYCb-hHfT56UiJpDZb7MO1lGrc7AWfhFbNC8J07t0zGLNygw6Iyd7qUFV-TqZI41uPyk9y0LYAE8XNz-rbfgYSDQB96WxjQdhLaADN5i83HapJEWNdo7R_9bIm3Z85Y6dzM")'
            }}
          ></div>
          <div className="flex flex-1 flex-col justify-center">
            <p className="text-[#0d121b] text-base font-medium leading-normal">
              Anyone taking Data Structures this semester? Need help with the linked list implementation.
            </p>
            <p className="text-[#4c669a] text-sm font-normal leading-normal">Posted 2d ago</p>
            <p className="text-[#4c669a] text-sm font-normal leading-normal">2nd year, Computer Science</p>
          </div>
        </div>

        {/* Post Reactions */}
        <div className="flex flex-wrap gap-4 px-4 py-2">
          <div className="flex items-center justify-center gap-2 px-3 py-2">
            <div className="text-[#4c669a]" data-icon="Heart" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"
                ></path>
              </svg>
            </div>
            <p className="text-[#4c669a] text-[13px] font-bold leading-normal tracking-[0.015em]">23</p>
          </div>
          <div className="flex items-center justify-center gap-2 px-3 py-2">
            <div className="text-[#4c669a]" data-icon="ChatCircleDots" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"
                ></path>
              </svg>
            </div>
            <p className="text-[#4c669a] text-[13px] font-bold leading-normal tracking-[0.015em]">12</p>
          </div>
        </div>

        {/* Comments Section */}
        <h3 className="text-[#0d121b] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Comments
        </h3>

        {/* Comment 1 */}
        <div className="flex w-full flex-row items-start justify-start gap-3 p-4">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBG5tgypbakWnRnGvY7Z3vLXrxaqxrO2quw6KyWQ1zqVAl_BBSBq1HJJiW82wk_3lV7jT_DtbBdQnpaUBAEqnbe8N5Q3AmOAyLPi9YJvRUlWy6th8sIHZo9OvclVmeXEPlUwjbmwnAcvaEXPKfTahb6g59ecstUnrbRjcqDfi05HvoyAy3FqriCRfczWkd8_CRjK-m8UpUxHsoY6asrOWGIi_GkHfNoTTHuKTIu23rWAB9JC4Cv8fb3h9IEXSDJT1ZJ3QCtG8nZfjI")'
            }}
          ></div>
          <div className="flex h-full flex-1 flex-col items-start justify-start">
            <div className="flex w-full flex-row items-start justify-start gap-x-3">
              <p className="text-[#0d121b] text-sm font-bold leading-normal tracking-[0.015em]">Aisha Bello</p>
              <p className="text-[#4c669a] text-sm font-normal leading-normal">1d ago</p>
            </div>
            <p className="text-[#0d121b] text-sm font-normal leading-normal">
              I'm in that class! We can study together. I'm also struggling with linked lists.
            </p>
          </div>
        </div>

        {/* Comment 2 */}
        <div className="flex w-full flex-row items-start justify-start gap-3 p-4 pl-[68px]">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjxc1_ZT8P11yVziKizCzDyHVFPV-NdpkLRCECKwVgI8xkoPUIywtlcYr2-YbV5RQUkQWs83Oltuq31MSto6AgthaiW2-tAl-u1Z5LKywKXcKbwdabun4kkwvPh-HnFU-39XvrpLH8TXwbluGummBGCtubcMbp6IRXgYYK2LvOf30FQQd68_jljTzHAzqu_xXT7-3N0YdLiJw3GXWFmtYJAJkN7oVCdz3LWKvhr-DooBs-NjD9ySUR76rH_Kva9kybenJ_RjrO7_E")'
            }}
          ></div>
          <div className="flex h-full flex-1 flex-col items-start justify-start">
            <div className="flex w-full flex-row items-start justify-start gap-x-3">
              <p className="text-[#0d121b] text-sm font-bold leading-normal tracking-[0.015em]">Chukwudi Okoro</p>
              <p className="text-[#4c669a] text-sm font-normal leading-normal">12h ago</p>
            </div>
            <p className="text-[#0d121b] text-sm font-normal leading-normal">
              I can help too! I've got a good grasp on linked lists. Let's connect.
            </p>
          </div>
        </div>

        {/* Comment 3 */}
        <div className="flex w-full flex-row items-start justify-start gap-3 p-4">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBAZZUauW_8ogtmULdPSLNoGOO7lRT8ojSo0Ni5ESOVkaM07qfZgukVSZTIrtXzgKcjbKVFDjZrHNJ9jtvKpWlaqL6B8221z7s97142GRIcD0oqzahV-vVO3R8xKnFRmfLPbbsipKNYEux7s8HMTh4359cK3o9XD3Vn6RvZDsnQQH-bWE44pbHJuytyVutp8ygmMw6Ztgp6R8CfbH1YE01UTVIxAvps7B-FaE2hyBBTrWSEn08XLfTVOe0JkfegTBNZGNNcuJT01Ps")'
            }}
          ></div>
          <div className="flex h-full flex-1 flex-col items-start justify-start">
            <div className="flex w-full flex-row items-start justify-start gap-x-3">
              <p className="text-[#0d121b] text-sm font-bold leading-normal tracking-[0.015em]">Ngozi Eze</p>
              <p className="text-[#4c669a] text-sm font-normal leading-normal">8h ago</p>
            </div>
            <p className="text-[#0d121b] text-sm font-normal leading-normal">
              I'm in the same boat. Maybe we can form a study group?
            </p>
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div>
        <div className="flex items-center px-4 py-3 gap-3 @container">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCnAlvnQ1QrM-WUOy0fiGy-eTVLrsxcu0-fjMLhyrzrwvY_LN_YXdK7e32hCdl4_mO-MkV4v0-HF44twDRwqF91LPVOKO0Hg2acdgLLxFL-nb8bDXAHTIUW_DC_E97GaEnTz0feIr6BjQkEcC6fYjmwZbnpKNGa5cJKI_STsotCYWVjscKwRhBG5Z5MRM6afTMLpZYGjeInOxHXyEx8i_7685xaegUdGPCDDS0H3k-98BK_phq1NKqiQEvJdSfEjN79yKaCgMIKUgU")'
            }}
          ></div>
          <label className="flex flex-col min-w-40 h-12 flex-1">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <input
                placeholder="Add a comment"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d121b] focus:outline-0 focus:ring-0 border-none bg-[#e7ebf3] focus:border-none h-full placeholder:text-[#4c669a] px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                value=""
              />
              <div className="flex border-none bg-[#e7ebf3] items-center justify-center pr-4 rounded-r-xl border-l-0">
                <div className="flex items-center gap-4 justify-end">
                  <div className="flex items-center gap-1">
                    <button className="flex items-center justify-center p-1.5">
                      <div className="text-[#4c669a]" data-icon="Image" data-size="20px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                          <path
                            d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"
                          ></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </label>
        </div>
        <div className="h-5 bg-[#f8f9fc]"></div>
      </div>
    </div>
  );
};

export default CommunityPostDetail;