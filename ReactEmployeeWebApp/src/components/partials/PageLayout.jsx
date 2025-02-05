import Header from "./Header";

const PageLayout = ({ children }) => {
  return (
    <>
      <Header />
      <section className="flex flex-col gap-6 padding py-28 md:pt-36 sm:min-h-screen lg:h-auto lg:py-0 lg:pt-0 lg:justify-center bg-background">
        {children}
      </section>
    </>
  );
};

export default PageLayout;
