import Header from "./Header";

const PageLayout = ({ children }) => {
  return (
    <>
      <Header />
      <section className="page">
        {children}
      </section>
    </>
  );
};

export default PageLayout;
