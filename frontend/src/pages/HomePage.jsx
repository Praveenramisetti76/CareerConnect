import { useNavigate } from "react-router-dom";


const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          {/* Remove the custom header/navbar here. The Navbar will be added in AppRouter. */}
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              {/* Hero Section */}
              <div className="@container">
                <div className="@[480px]:p-4">
                  <div
                    className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
                    style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8rTeR80fB53UNfVX0G0Su0O5f5p47xGatDxP0ZEpdi2sRYI2EvhIGy-Dk_Ng_g4_250We0q6wSNJ0b3ppm8-m9jGl9-d9m3SYGoB3LBQo3aLTLXienzyoCPRa8HxmESt4B66QPpAvI1eoYvIKfvJiU7bA99eU38UIyCeMvT6hBISMW2nDuWjHJL5BqwsYKDNYEO6r-GnRJ1BcijfdOp7bsnMBC5qIIedMK15ItzdNqCble91IRUO5ep_lDst6UNdKxQlvrkD9ZcQ')` }}
                  >
                    <div className="flex flex-col gap-2 text-center">
                      <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                        Find Your Dream Job or Your Next Great Hire
                      </h1>
                      <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                        CareerConnect is the leading platform connecting talented professionals with innovative companies. Whether you're seeking a new opportunity or looking to expand your team, we've got you covered.
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              {/* Features Section */}
              <div className="flex flex-col gap-10 px-4 py-10 @container">
                <div className="flex flex-col gap-4">
                  <h1 className="text-[#111518] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                    Why Choose CareerConnect?
                  </h1>
                  <p className="text-[#111518] text-base font-normal leading-normal max-w-[720px]">
                    We offer a comprehensive suite of tools and resources to streamline your job search or hiring process.
                  </p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                  <div className="flex flex-1 gap-3 rounded-lg border border-[#d5dce2] bg-gray-50 p-4 flex-col">
                    <div className="text-[#111518]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"></path>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-[#111518] text-base font-bold leading-tight">For Job Seekers</h2>
                      <p className="text-[#5d7589] text-sm font-normal leading-normal">
                        Discover thousands of job openings across various industries and locations. Create a standout profile, apply with ease, and get personalized recommendations.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-3 rounded-lg border border-[#d5dce2] bg-gray-50 p-4 flex-col">
                    <div className="text-[#111518]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-[#111518] text-base font-bold leading-tight">For Employers</h2>
                      <p className="text-[#5d7589] text-sm font-normal leading-normal">
                        Post jobs that attract top talent, manage applications efficiently, and connect with qualified candidates through our intuitive platform.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-3 rounded-lg border border-[#d5dce2] bg-gray-50 p-4 flex-col">
                    <div className="text-[#111518]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-[#111518] text-base font-bold leading-tight">Advanced Analytics</h2>
                      <p className="text-[#5d7589] text-sm font-normal leading-normal">
                        Gain valuable insights into your hiring performance with detailed analytics. Track key metrics, optimize your recruitment strategy, and make data-driven decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* ... (continue converting testimonials, call-to-action, and footer sections to JSX) ... */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;